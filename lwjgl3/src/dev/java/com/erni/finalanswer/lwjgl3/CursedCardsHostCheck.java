package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.erni.finalanswer.cursedcards.*;
import com.erni.finalanswer.network.RealtimeClient;
import com.google.gson.*;
import java.net.URI;
import java.net.http.*;
import java.util.*;
import java.util.concurrent.*;

/**
 * Host shared screen against a running room server (-Durl): the real CursedCardsScreen + bridge as host, six bot players
 * and one bot spectator over WebSockets. Checks that the table replays the server exactly (hand sizes every turn, the
 * curse, the loser) and saves screenshots to -Dout.
 */
public final class CursedCardsHostCheck extends ApplicationAdapter {
    private final String url=System.getProperty("url","http://localhost:18231"),out=System.getProperty("out","/tmp");
    private final HttpClient http=HttpClient.newHttpClient();private RealtimeClient host;private CursedCardsScreen screen;
    private final Map<String,Bot> bots=new LinkedHashMap<>();private final List<String> log=new ArrayList<>();private boolean failed,started,voted,finishedSeen;
    private float t;private int turnsChecked;private String code,pending;private final Set<String> shots=new HashSet<>();private JsonObject last;

    final class Bot implements WebSocket.Listener{final String name,token;String id;volatile JsonObject state;WebSocket ws;final StringBuilder buf=new StringBuilder();
        Bot(String name,String token){this.name=name;this.token=token;}
        void connect()throws Exception{ws=http.newWebSocketBuilder().buildAsync(URI.create(url.replace("http","ws")+"/ws"),this).get(8,TimeUnit.SECONDS);send("AUTH",Map.of("roomCode",code,"token",token));}
        void send(String type,Map<String,?> p){var o=new JsonObject();o.addProperty("type",type);o.addProperty("requestId",UUID.randomUUID().toString());o.add("payload",new Gson().toJsonTree(p));ws.sendText(o.toString(),true);}
        @Override public CompletionStage<?> onText(WebSocket w,CharSequence d,boolean lastPart){buf.append(d);if(lastPart){var m=JsonParser.parseString(buf.toString()).getAsJsonObject();buf.setLength(0);
            var p=m.getAsJsonObject("payload");if(p!=null&&p.has("phase")){state=p;if(p.has("selfId"))id=p.get("selfId").getAsString();}}w.request(1);return null;}
    }
    @Override public void create(){
        try{
            var room=post("/rooms","name=Cards+Host+QA&maxPlayers=8&gameMode=standard");code=room.get("code").getAsString();
            for(String n:List.of("Vesper","Mordecai","Lilith","Absalom","Seraphine","Corvin","Watcher")){var j=post("/rooms/"+code+"/join","name="+n);var b=new Bot(n,j.get("token").getAsString());b.connect();bots.put(n,b);}
            host=new RealtimeClient(url,code,room.get("token").getAsString(),e->{},s->{});
        }catch(Exception e){throw new RuntimeException(e);}
    }
    private JsonObject post(String path,String body)throws Exception{var r=http.send(HttpRequest.newBuilder(URI.create(url+path)).header("Content-Type","application/x-www-form-urlencoded").POST(HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());return JsonParser.parseString(r.body()).getAsJsonObject();}

    @Override public void render(){
        float dt=Gdx.graphics.getDeltaTime();t+=dt;var snap=host.connected()?host.snapshot():null;
        if(!started){if(snap!=null&&snap.getAsJsonArray("players").size()==7&&bots.values().stream().allMatch(b->b.id!=null)){started=true;
                List<String> seats=new ArrayList<>();for(String n:List.of("Vesper","Mordecai","Lilith","Absalom","Seraphine","Corvin"))seats.add(bots.get(n).id);
                host.send("START_CARDS",Map.of("roomCode",code,"sessionId",snap.get("lobbyId").getAsString(),"participantIds",seats));}
            Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);return;}
        if(snap!=null&&snap.has("cursedCards")&&screen==null){screen=new CursedCardsScreen(host,snap);screen.show();screen.resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());}
        if(screen==null){Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);return;}
        var c=snap.getAsJsonObject("cursedCards");if(c!=null)last=c;
        if(c!=null){String phase=c.get("phase").getAsString();
            if(phase.equals("CURSE_VOTE")&&!voted&&t>1.5f){voted=true;var w=bots.get("Watcher");w.send("CARDS_VOTE",Map.of("roomCode",code,"sessionId",c.get("sessionId").getAsString(),"targetId",bots.get("Lilith").id));shot("h1-vote");}
            if(phase.equals("PLAYING")){
                boolean drawerIsBot=false;String drawer=c.get("drawer").getAsString();
                for(var b:bots.values())if(drawer.equals(b.id)&&b.state!=null&&b.state.has("cursedCards")){var bc=b.state.getAsJsonObject("cursedCards");
                    if(bc.has("canDraw")&&bc.get("canDraw").getAsBoolean()&&!(code+bc.get("turn")).equals(pending)){pending=code+bc.get("turn");
                        if(table().awaitingDraw()){mirror(c);if(!shots.contains("turn")&&turnsChecked>=2){shots.add("turn");shot("h2-turn");}}
                        b.send("CARDS_DRAW",Map.of("roomCode",code,"sessionId",bc.get("sessionId").getAsString(),"turn",bc.get("turn").getAsInt(),"slot",new Random().nextInt(bc.get("sourceCards").getAsInt())));}}}
            if(phase.equals("FINISHED")&&!finishedSeen&&table().loserSeat()>=0&&!table().presenting()){finishedSeen=true;
                int seat=seatOf(c,c.get("loser").getAsString());check(table().loserSeat()==seat,"table shows the server's loser");
                check(table().handSize(seat)==1&&table().handCard(seat,0).value==CardValue.DEATH,"DEATH revealed face up in the loser's place");
                shot("h3-result");t=0;}}
        screen.render(dt);
        if(pendingShot!=null){Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());{var file=Gdx.files.absolute(out+"/"+pendingShot+".png");var px=p;SHOTS.execute(()->{PixmapIO.writePNG(file,px,-1,true);px.dispose();});}pendingShot=null;}
        if(finishedSeen&&t>1.5f){check(turnsChecked>=2,"table mirrored the server on "+turnsChecked+" turns");check(curseShown,"audience curse shown on the shared screen");
            log.forEach(System.out::println);System.out.println(failed?"RESULT FAIL":"RESULT PASS");Gdx.app.exit();}
        if(t>240){System.out.println("FAIL timeout turnsChecked="+turnsChecked+" phase="+(last==null?"-":last.get("phase")));log.forEach(System.out::println);Gdx.app.exit();}
        if(last!=null&&last.has("cursedPlayer")&&!curseShown){curseShown=true;check(last.get("cursedPlayer").getAsString().equals(bots.get("Lilith").id),"server cursed the voted player");}
    }
    private boolean curseShown;private String pendingShot;
    private CursedCardsTable table(){try{var f=CursedCardsScreen.class.getDeclaredField("table");f.setAccessible(true);return (CursedCardsTable)f.get(screen);}catch(Exception e){throw new RuntimeException(e);}}
    /** Visual hand sizes equal the server's, all face down, nothing the host should not know is face up. */
    private void mirror(JsonObject c){var sizes=c.getAsJsonArray("handSizes");boolean same=true,down=true;
        for(int p=0;p<sizes.size();p++){int n=table().handSize(p);same&=n==sizes.get(p).getAsInt();for(int k=0;k<n;k++)down&=table().handCard(p,k).pose.faceDown();}
        turnsChecked++;if(!same||!down)check(false,"turn "+turnsChecked+": sizes="+same+" faceDown="+down);}
    private static int seatOf(JsonObject c,String id){var s=c.getAsJsonArray("seats");for(int i=0;i<s.size();i++)if(s.get(i).getAsString().equals(id))return i;return -1;}
    private void shot(String n){pendingShot=n;}
    private void check(boolean ok,String what){log.add((ok?"PASS ":"FAIL ")+what);failed|=!ok;}
    @Override public void dispose(){if(screen!=null)screen.dispose();if(host!=null)host.close();for(var b:bots.values())if(b.ws!=null)b.ws.abort();}
    /** PNG encoding off the render thread, so screenshots never freeze the picture. */
    private static final java.util.concurrent.ExecutorService SHOTS=java.util.concurrent.Executors.newSingleThreadExecutor(r->{var t=new Thread(r,"shots");t.setDaemon(true);return t;});
    static{Runtime.getRuntime().addShutdownHook(new Thread(()->{SHOTS.shutdown();try{SHOTS.awaitTermination(20,java.util.concurrent.TimeUnit.SECONDS);}catch(InterruptedException e){}}));}
    public static void main(String[] a){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1600,900);c.useVsync(true);c.setBackBufferConfig(8,8,8,8,24,0,4);new Lwjgl3Application(new CursedCardsHostCheck(),c);}
}
