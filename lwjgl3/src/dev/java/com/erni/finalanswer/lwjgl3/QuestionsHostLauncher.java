package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.network.HostingAccess;
import com.erni.finalanswer.rooms.RoomSession;
import java.util.*;

/** Live main-quiz test: production host, normal room protocol, answers on the player's browser. */
public final class QuestionsHostLauncher {
    public static void main(String[] args){
        String url=System.getProperty("room.url","http://localhost:18240"),code=System.getProperty("room.code"),token=System.getProperty("room.token");
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("FINAL ANSWER / Основные вопросы / "+code);c.setWindowedMode(1600,900);c.setForegroundFPS(60);
        String capture=System.getProperty("q.capture","");float every=Float.parseFloat(System.getProperty("q.every","0.5"));
        new Lwjgl3Application(new FinalAnswerGame(HostingAccess.external(url)){
            boolean started;float clock;int shot;
            @Override public void create(){super.create();activateRoom(new RoomSession(code,"Тест основной викторины",8,"standard",token,true,List.of()));}
            @Override public void render(){super.render();
                // optional QA capture: small frames of what the host actually renders (-Pq.capture=/abs/dir, -Pq.every=seconds)
                if(!capture.isEmpty()){clock+=com.badlogic.gdx.Gdx.graphics.getDeltaTime();if(clock>=every){clock=0;grab(capture+String.format("/f%04d.png",shot++));}}
                var rt=getRealtime();if(started||rt==null||!rt.connected()||rt.snapshot()==null)return;var state=rt.snapshot();
                if(!state.get("phase").getAsString().equals("LOBBY"))return;
                var players=state.getAsJsonArray("players");if(players.size()<2)return;
                if(players.asList().stream().allMatch(e->"ONLINE".equals(e.getAsJsonObject().get("connectionStatus").getAsString()))){started=true;rt.send("START_GAME",Map.of());}
            }
            void grab(String file){var g=com.badlogic.gdx.Gdx.graphics;var full=com.badlogic.gdx.utils.ScreenUtils.getFrameBufferPixmap(0,0,g.getBackBufferWidth(),g.getBackBufferHeight());
                var small=new com.badlogic.gdx.graphics.Pixmap(640,360,com.badlogic.gdx.graphics.Pixmap.Format.RGBA8888);
                try{small.setFilter(com.badlogic.gdx.graphics.Pixmap.Filter.BiLinear);small.drawPixmap(full,0,0,full.getWidth(),full.getHeight(),0,0,640,360);
                    var px=small.getPixels();for(int i=3;i<px.limit();i+=4)px.put(i,(byte)255);com.badlogic.gdx.graphics.PixmapIO.writePNG(com.badlogic.gdx.Gdx.files.absolute(file),small,-1,true);}
                finally{small.dispose();full.dispose();}}
        },c);
    }
}
