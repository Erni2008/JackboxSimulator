package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.rareminds.RareMindsScreen;
import com.google.gson.*;
import java.net.URI;
import java.net.http.*;
import java.util.concurrent.*;

/**
 * RARE MINDS live host for local tests: joins a room as its host over the real WebSocket protocol, starts the match
 * once the expected number of players is online, and shows the real host screen live (typing, reveal, Soul Race).
 * Used by tools/dev/rare_minds_test.py. Properties: rm.url, rm.code, rm.token, rm.players.
 */
public final class RareMindsLiveHost {
    public static void main(String[] a){
        String url=System.getProperty("rm.url","http://localhost:18330"),code=System.getProperty("rm.code"),token=System.getProperty("rm.token");
        int players=Integer.getInteger("rm.players",6);
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / RARE MINDS / live test host");c.setWindowedMode(1600,900);c.setForegroundFPS(60);
        new Lwjgl3Application(new Game(){
            RareMindsScreen screen;volatile long offset;boolean started;WebSocket ws;
            long now(){return System.currentTimeMillis()+offset;}
            synchronized void send(String type,JsonObject payload){JsonObject m=new JsonObject();m.addProperty("type",type);m.addProperty("requestId",Long.toHexString(System.nanoTime()));payload.addProperty("roomCode",code);m.add("payload",payload);ws.sendText(m.toString(),true).join();}
            @Override public void create(){
                new com.erni.finalanswer.localization.Localization(System.getProperty("rm.lang","ru"));
                var buf=new StringBuilder();
                ws=HttpClient.newHttpClient().newWebSocketBuilder().buildAsync(URI.create(url.replaceFirst("^http","ws")+"/ws"),new WebSocket.Listener(){
                    @Override public CompletionStage<?> onText(WebSocket w,CharSequence data,boolean last){buf.append(data);w.request(1);if(!last)return null;String text=buf.toString();buf.setLength(0);
                        JsonObject ev=JsonParser.parseString(text).getAsJsonObject();JsonObject p=ev.has("payload")&&ev.get("payload").isJsonObject()?ev.getAsJsonObject("payload"):null;
                        if(p!=null&&p.has("roomId"))Gdx.app.postRunnable(()->onState(p));return null;}
                }).join();
                JsonObject auth=new JsonObject();auth.addProperty("token",token);send("AUTH",auth);
                Executors.newSingleThreadScheduledExecutor(r->{Thread t=new Thread(r);t.setDaemon(true);return t;}).scheduleAtFixedRate(()->send("PING",new JsonObject()),10,10,TimeUnit.SECONDS);
            }
            void onState(JsonObject s){
                offset=s.get("serverTime").getAsLong()-System.currentTimeMillis();
                if(!started&&!s.has("rareMinds")){long online=0;for(var e:s.getAsJsonArray("players"))if("ONLINE".equals(e.getAsJsonObject().get("connectionStatus").getAsString()))online++;
                    if(online>=players){started=true;JsonObject lg=new JsonObject();lg.addProperty("language",System.getProperty("rm.lang","ru"));send("SET_LANGUAGE",lg);JsonObject p=new JsonObject();p.addProperty("sessionId",s.get("lobbyId").getAsString());send("START_RARE_MINDS",p);}}
                if(!s.has("rareMinds"))return;
                if(screen==null){screen=new RareMindsScreen(s,this::now,id->{JsonObject p=new JsonObject();p.addProperty("sessionId",id);send("END_RARE_MINDS",p);},()->{});setScreen(screen);}else screen.apply(s);
            }
            @Override public void render(){if(screen==null){ScreenUtils.clear(0,0,0,1);return;}super.render();}
        },c);
    }
}
