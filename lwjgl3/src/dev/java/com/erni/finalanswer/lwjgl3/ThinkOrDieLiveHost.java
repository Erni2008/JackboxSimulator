package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.thinkordie.ThinkOrDieScreen;
import com.google.gson.*;
import java.net.URI;
import java.net.http.*;
import java.util.concurrent.*;

/**
 * THINK OR DIE live host for local tests: joins a room as its host over the real WebSocket protocol, optionally turns
 * one player into a ghost (QA server only), starts the match once everyone is online and shows the real host screen.
 * Used by tools/dev/think_or_die_test.py. Properties: tod.url, tod.code, tod.token, tod.players, tod.lang, tod.ghost.
 */
public final class ThinkOrDieLiveHost {
    public static void main(String[] a){
        String url=System.getProperty("tod.url","http://localhost:18330"),code=System.getProperty("tod.code"),token=System.getProperty("tod.token");
        int players=Integer.getInteger("tod.players",6);
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / THINK OR DIE / live test host");c.setWindowedMode(1600,900);c.setForegroundFPS(60);
        new Lwjgl3Application(new Game(){
            ThinkOrDieScreen screen;volatile long offset;boolean started;WebSocket ws;
            long now(){return System.currentTimeMillis()+offset;}
            synchronized void send(String type,JsonObject payload){JsonObject m=new JsonObject();m.addProperty("type",type);m.addProperty("requestId",Long.toHexString(System.nanoTime()));payload.addProperty("roomCode",code);m.add("payload",payload);ws.sendText(m.toString(),true).join();}
            @Override public void create(){
                new com.erni.finalanswer.localization.Localization(System.getProperty("tod.lang","ru"));
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
                if(!started&&!s.has("thinkOrDie")){java.util.List<String> on=new java.util.ArrayList<>();for(var e:s.getAsJsonArray("players"))if("ONLINE".equals(e.getAsJsonObject().get("connectionStatus").getAsString()))on.add(e.getAsJsonObject().get("id").getAsString());
                    if(on.size()>=players){started=true;JsonObject lg=new JsonObject();lg.addProperty("language",System.getProperty("tod.lang","ru"));send("SET_LANGUAGE",lg);
                        String ghost=System.getProperty("tod.ghost","");
                        for(var e:s.getAsJsonArray("players")){var o=e.getAsJsonObject();if(o.get("name").getAsString().equals(ghost)){JsonObject g=new JsonObject();g.addProperty("id",o.get("id").getAsString());g.addProperty("alive",false);send("QA_SET_ALIVE",g);}}
                        JsonObject p=new JsonObject();p.addProperty("sessionId",s.get("lobbyId").getAsString());send("START_THINK_OR_DIE",p);}}
                if(!s.has("thinkOrDie"))return;
                if(screen==null){screen=new ThinkOrDieScreen(s,this::now,id->{JsonObject p=new JsonObject();p.addProperty("sessionId",id);send("END_THINK_OR_DIE",p);});setScreen(screen);}else screen.apply(s);
            }
            @Override public void render(){if(screen==null){ScreenUtils.clear(0,0,0,1);return;}super.render();}
        },c);
    }
}
