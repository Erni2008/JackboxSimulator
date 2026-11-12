package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.GL20;
import com.erni.finalanswer.network.RealtimeClient;
import com.erni.finalanswer.systembreach.host.SystemBreachHostScreen;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;
import com.google.gson.JsonObject;
import java.util.Map;

/**
 * Developer host for SYSTEM BREACH against a running room server: the production host screen with the room's host
 * token. Starts the match once {@code sb.players} players are online. Used by tools/dev/system_breach_live.cjs.
 */
public final class SystemBreachHostLauncher {
    public static void main(String[] args){
        String url=System.getProperty("room.url","http://localhost:18240"),code=System.getProperty("room.code"),token=System.getProperty("room.token");
        int need=Integer.getInteger("sb.players",2);boolean ru=!"en".equals(System.getProperty("sb.lang","ru"));
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("FINAL ANSWER / SYSTEM BREACH / Host "+code);c.setWindowedMode(1600,900);c.setForegroundFPS(60);c.setBackBufferConfig(8,8,8,8,16,0,4);
        new Lwjgl3Application(new Game(){
            RealtimeClient client;SystemBreachHostScreen screen;CageLobby lobby;String session="";boolean asked;long lastOnline=-1;volatile JsonObject latest,room;
            @Override public void create(){lobby=new CageLobby();client=new RealtimeClient(url,code,token,e->{var d=e.getAsJsonObject("payload");if(d!=null&&d.has("players")){latest=d;room=d;}},s->Gdx.app.log("Host",s));}
            @Override public void render(){
                JsonObject data=latest;latest=null;
                if(data!=null){
                    if(data.has("systemBreach")){String id=data.getAsJsonObject("systemBreach").get("sessionId").getAsString();
                        if(screen==null||!id.equals(session)){if(screen!=null)screen.dispose();session=id;screen=new SystemBreachHostScreen(data,lobby,s->client.send("SYSTEM_BREACH_END",Map.of("roomCode",code,"sessionId",s)),ru);setScreen(screen);}
                        else screen.apply(data);}
                    else if(screen!=null){setScreen(null);screen.dispose();screen=null;session="";asked=false;}
                }
                var s=room;
                if(screen==null){Gdx.gl.glClearColor(.03f,.02f,.02f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
                    if(s!=null&&!asked&&s.has("lobbyId")&&!s.has("systemBreach")){
                        long online=s.getAsJsonArray("players").asList().stream().filter(p->{var o=p.getAsJsonObject();return o.has("connectionStatus")?"ONLINE".equals(o.get("connectionStatus").getAsString()):o.has("online")&&o.get("online").getAsBoolean();}).count();
                        if(online!=lastOnline){lastOnline=online;Gdx.app.log("Host","online "+online+"/"+need);}
                        if(online>=need){asked=true;client.send("SYSTEM_BREACH_START",Map.of("roomCode",code,"sessionId",s.get("lobbyId").getAsString()));}}}
                super.render();
            }
            @Override public void dispose(){if(screen!=null)screen.dispose();lobby.dispose();client.close();}
        },c);
    }
}
