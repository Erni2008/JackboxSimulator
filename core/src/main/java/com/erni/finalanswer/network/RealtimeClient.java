package com.erni.finalanswer.network;

import com.badlogic.gdx.Gdx;
import com.finalanswer.protocol.Protocol;
import com.google.gson.*;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.Consumer;

/** One authenticated WebSocket. Network callbacks are marshalled onto the LibGDX render thread. */
public final class RealtimeClient implements AutoCloseable {
    private final HttpClient http=HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(8)).build();
    private final ScheduledExecutorService scheduler=Executors.newSingleThreadScheduledExecutor(r->{Thread t=new Thread(r,"finalanswer-reconnect");t.setDaemon(true);return t;});
    private final URI uri;
    private final String code,token;
    private final Consumer<JsonObject> received;
    private final Consumer<String> status;
    private volatile WebSocket socket;
    private volatile boolean closed,authenticated;
    private volatile int generation,attempt;
    private final List<Consumer<JsonObject>> listeners=new ArrayList<>();
    /** Subscribe/unsubscribe on the render thread, where accepted events are delivered. */
    public void addEventListener(Consumer<JsonObject> listener){listeners.add(listener);}
    public void removeEventListener(Consumer<JsonObject> listener){listeners.remove(listener);}
    private JsonObject snapshot;
    private long receivedNano,serverMillis;
    private CompletableFuture<WebSocket> connecting;
    private ScheduledFuture<?> retryTask;
    private final Map<String,Long> pings=new ConcurrentHashMap<>();
    public RealtimeClient(String baseUrl,String code,String token,Consumer<JsonObject> received,Consumer<String> status) {
        uri=URI.create(baseUrl.replaceFirst("^http","ws")+"/ws");
        this.code=code;this.token=token;this.received=received;this.status=status;
        scheduler.scheduleAtFixedRate(()->{
            if(authenticated){String id=UUID.randomUUID().toString();pings.clear();pings.put(id,System.nanoTime());sendEnvelope("PING",id,Map.of());}
        },10,10,TimeUnit.SECONDS);
        connect();
    }
    private void post(int version,Runnable task){Gdx.app.postRunnable(()->{if(!closed&&generation==version)task.run();});}
    private synchronized void connect() {
        if(closed)return;
        int version=++generation;
        post(version,()->status.accept("CONNECTING"));
        connecting=http.newWebSocketBuilder().connectTimeout(Duration.ofSeconds(8)).buildAsync(uri,new WebSocket.Listener(){
            private final StringBuilder text=new StringBuilder();
            public void onOpen(WebSocket ws){
                if(closed||version!=generation){ws.abort();return;}
                socket=ws;ws.request(1);
                sendEnvelope("AUTH",UUID.randomUUID().toString(),Map.of("roomCode",code,"token",token));
            }
            public CompletionStage<?> onText(WebSocket ws,CharSequence data,boolean last){
                if(text.length()+data.length()>262144){ws.abort();lost(version);return null;}
                text.append(data);
                if(last){
                    String frame=text.toString();text.setLength(0);
                    try {
                        JsonObject event=JsonParser.parseString(frame).getAsJsonObject();
                        post(version,()->accept(event));
                    }catch(RuntimeException error){post(version,()->status.accept("INVALID_SERVER_MESSAGE"));}
                }
                ws.request(1);return null;
            }
            public CompletionStage<?> onClose(WebSocket ws,int code,String reason){
                if(code==4001||code==4002){post(version,()->{status.accept(reason);received.accept(JsonParser.parseString(Protocol.event("ROOM_CLOSED","",Map.of("reason",reason))).getAsJsonObject());});}
                else lost(version);return null;
            }
            public void onError(WebSocket ws,Throwable error){lost(version);}
        });
        connecting.whenComplete((ws,error)->{if(error!=null)lost(version);});
    }
    private void accept(JsonObject event) {
        String type=event.get("type").getAsString();JsonObject payload=event.getAsJsonObject("payload");
        if(type.equals("AUTHENTICATED")){authenticated=true;attempt=0;status.accept("CONNECTED");}
        if(type.equals("ERROR")&&payload.has("code")&&Set.of("SESSION_ENDED","ROOM_NOT_FOUND").contains(payload.get("code").getAsString())) {
            status.accept(payload.get("code").getAsString());close();return;
        }
        if(payload.has("revision")) {
            if(snapshot!=null && payload.get("revision").getAsLong()<snapshot.get("revision").getAsLong())return;
            snapshot=payload;receivedNano=System.nanoTime();serverMillis=payload.get("serverTime").getAsLong();
            Long sent=pings.remove(event.get("requestId").getAsString());
            if(sent!=null)serverMillis+=Math.min(1000,(receivedNano-sent)/2_000_000);
        }
        received.accept(event);
        for(int i=0;i<listeners.size();i++)listeners.get(i).accept(event);
    }
    private synchronized void lost(int version){
        if(closed||version!=generation)return;
        authenticated=false; socket=null; int nextVersion=++generation;
        post(nextVersion,()->status.accept("CONNECTION_LOST"));
        if(++attempt>12){post(nextVersion,()->status.accept("RECONNECT_FAILED"));return;}
        long delay=Math.min(15000,500L<<(Math.min(attempt-1,5)))+ThreadLocalRandom.current().nextInt(200);
        retryTask=scheduler.schedule(this::connect,delay,TimeUnit.MILLISECONDS);
    }
    public synchronized void retry() {
        if(closed||authenticated)return;
        if(retryTask!=null)retryTask.cancel(false);
        if(socket!=null)socket.abort();
        attempt=0; outgoing=CompletableFuture.completedFuture(null); connect();
    }
    public boolean connected(){return authenticated&&!closed;}
    public JsonObject snapshot(){return snapshot;}
    public long serverNow(){return serverMillis+(System.nanoTime()-receivedNano)/1_000_000;}
    public String send(String type,Map<String,?> payload){String id=UUID.randomUUID().toString();if(connected())sendEnvelope(type,id,payload);return id;}
    private synchronized void sendEnvelope(String type,String id,Map<String,?> payload){
        WebSocket ws=socket;if(ws==null||closed)return;
        // Java WebSocket permits only one pending data send.
        outgoing=outgoing.handle((v,e)->null).thenCompose(ignored->ws.sendText(Protocol.event(type,id,payload),true)).thenApply(v->null);
    }
    private CompletableFuture<Void> outgoing=CompletableFuture.completedFuture(null);
    @Override public synchronized void close(){
        if(closed)return;closed=true;authenticated=false;generation++;
        if(connecting!=null)connecting.cancel(true);
        if(socket!=null)socket.abort();scheduler.shutdownNow();http.shutdownNow();pings.clear();listeners.clear();
    }
}
