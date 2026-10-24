package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.screens.*;
import java.util.*;

/** Explicit review mode using the production basement, timeline, audio and subtitles. No real room is mutated. */
public final class IntroPreviewLauncher {
    public static void main(String[] args){
        if(StartupHelper.startNewJvmIfRequired())return;
        var config=new Lwjgl3ApplicationConfiguration();config.setWindowedMode(1600,900);config.setForegroundFPS(60);
        config.setTitle("FINAL ANSWER — Intro review / Space: skip / R: replay");
        new Lwjgl3Application(new FinalAnswerGame(){
            CageLobbyScreen preview;PlayScreen questionScreen;boolean question;float elapsed;int capture;
            @Override public void create(){super.create();preview=new CageLobbyScreen(this);start();}
            private void start(){
                question=false;elapsed=0;capture=0;
                var players=new ArrayList<RoomSession.Player>();String[] ids={"ghost","dracula","plague_doctor","puppeteer","skeleton","zombie","pumpkin","voodoo"};
                for(int i=0;i<ids.length;i++)players.add(new RoomSession.Player("intro-"+i,ids[i],false,ids[i],"ONLINE",false,0));
                var room=new RoomSession("INTRO1","INTRO PREVIEW",8,"standard","preview",true,players);
                setScreen(preview);preview.synchronize(room,"");getAudio().pause(true);preview.cages().act(4);preview.cages().stopAudio();getAudio().pause(false);
                preview.previewIntro(room,()->{if(question)return;question=true;questionScreen=new PlayScreen(this);setScreen(questionScreen);});
            }
            @Override public void render(){
                if(Gdx.input.isKeyJustPressed(Input.Keys.R)){if(questionScreen!=null){questionScreen.dispose();questionScreen=null;}start();}
                if(question){super.render();return;}
                float dt=Gdx.graphics.getDeltaTime();elapsed+=dt;
                getAudio().room(preview.introAmbience());getAudio().environmentGain(preview.introAmbienceGain());getAudio().cagesGain(.15f);getAudio().update(dt);preview.draw(dt);
                float[] moments={1,7,12,40,58,71};
                if(capture<moments.length&&elapsed>=moments[capture]){
                    var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    try{PixmapIO.writePNG(Gdx.files.local("../generated/intro/scene-"+capture+".png"),pixels,-1,true);}finally{pixels.dispose();}capture++;
                }
            }
            @Override public void dispose(){if(questionScreen!=null){if(getScreen()==questionScreen)setScreen(null);questionScreen.dispose();}if(preview!=null){if(getScreen()==preview)setScreen(null);preview.dispose();}super.dispose();}
        },config);
    }
}
