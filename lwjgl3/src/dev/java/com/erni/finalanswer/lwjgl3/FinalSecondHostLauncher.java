package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.GL20;
import com.erni.finalanswer.finalsecond.FinalSecondScreen;
import com.erni.finalanswer.network.RealtimeClient;
import com.google.gson.JsonObject;
import java.util.Map;

/**
 * Developer host for THE FINAL SECOND against a running room server: the production host screen, connected with
 * the room's host token. It starts a round once two players are online, and after the results starts the next one
 * (ENTER on the results returns to the lobby at once). Used by tools/dev/forgotten_room_play.cjs; never shipped.
 */
public final class FinalSecondHostLauncher {
    public static void main(String[] args){
        String url=System.getProperty("room.url","http://localhost:18240"),code=System.getProperty("room.code"),token=System.getProperty("room.token"),difficulty=System.getProperty("room.difficulty","MEDIUM");
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / THE FINAL SECOND / Host "+code);c.setWindowedMode(1600,900);c.setForegroundFPS(60);c.setBackBufferConfig(8,8,8,8,16,0,4);
        new Lwjgl3Application(new Game(){
            RealtimeClient client;FinalSecondScreen screen;String session="";long resultsSince;boolean asked;
            @Override public void create(){client=new RealtimeClient(url,code,token,this::received,s->Gdx.app.log("Host",s));}
            void received(JsonObject event){
                JsonObject data=event.getAsJsonObject("payload");if(data==null||!data.has("players"))return;
                if(data.has("finalSecond")){
                    String id=data.getAsJsonObject("finalSecond").get("sessionId").getAsString();
                    if(screen==null||!id.equals(session)){if(screen!=null)screen.dispose();session=id;asked=false;resultsSince=0;
                        screen=new FinalSecondScreen(data,client::serverNow,m->end());setScreen(screen);}
                    else screen.apply(data);
                }else{if(screen!=null){setScreen(null);screen.dispose();screen=null;session="";}asked=false;}
            }
            void end(){if(!session.isEmpty())client.send("END_FINAL_SECOND",Map.of("roomCode",code,"sessionId",session));}
            @Override public void render(){
                var s=client.snapshot();
                if(screen==null){Gdx.gl.glClearColor(.03f,.02f,.02f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
                    if(s!=null&&!asked&&s.has("lobbyId")&&!s.has("finalSecond")){
                        long online=s.getAsJsonArray("players").asList().stream().filter(p->"ONLINE".equals(p.getAsJsonObject().get("connectionStatus").getAsString())).count();
                        if(online>=2){asked=true;client.send("START_FINAL_SECOND",Map.of("roomCode",code,"sessionId",s.get("lobbyId").getAsString()));}}
                }else if("RESULTS".equals(screen.phase())){if(resultsSince==0)resultsSince=System.currentTimeMillis();else if(System.currentTimeMillis()-resultsSince>14_000){resultsSince=Long.MAX_VALUE;end();}}
                super.render();
            }
            @Override public void dispose(){if(screen!=null)screen.dispose();client.close();}
        },c);
    }
}
