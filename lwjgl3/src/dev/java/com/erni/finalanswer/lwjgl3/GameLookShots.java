package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.screens.CageLobbyScreen;
import com.erni.finalanswer.screens.PlayScreen;
import java.util.ArrayList;

/**
 * Look-development captures of the real game screens AFTER the whole-frame cinematic finish: main menu, the cage lobby
 * with players, and a question. {@code -Dlook.output=dir}; {@code -Dcinematic=false} captures the untouched look.
 * Never part of production distributions.
 */
public final class GameLookShots {
    public static void main(String[] args){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / look shots");c.setWindowedMode(1600,900);c.disableAudio(true);c.setForegroundFPS(60);
        String out=System.getProperty("look.output","/tmp");
        new Lwjgl3Application(new FinalAnswerGame(){
            float t;int stage;CageLobbyScreen lobby;
            RoomSession room(int count){String[] ids={"skeleton","ghost","zombie","dracula","plague_doctor","pumpkin"},names={"Скелет","Призрак","Зомби","Дракула","Доктор","Тыква"};
                var players=new ArrayList<RoomSession.Player>();for(int i=0;i<count;i++)players.add(new RoomSession.Player("p"+i,names[i],false,ids[i],"ONLINE",false,0));
                return new RoomSession("ABC123","THE WAITING ROOM",8,"standard","demo",true,players);}
            @Override public void render(){
                t+=Gdx.graphics.getDeltaTime();super.render();
                switch(stage){
                    case 0->{if(t>4){grab("1-menu");lobby=new CageLobbyScreen(this);setScreen(lobby);stage=1;t=0;}}
                    case 1->{lobby.synchronize(room(6),"");if(t>9){grab("2-lobby");setScreen(new PlayScreen(this));stage=2;t=0;}}
                    case 2->{if(t>9){grab("3-question");stage=3;Gdx.app.exit();}}
                    default->{}
                }
            }
            void grab(String name){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                try{PixmapIO.writePNG(Gdx.files.absolute(out+"/"+name+".png"),p,-1,true);}finally{p.dispose();}}
        },c);
    }
}
