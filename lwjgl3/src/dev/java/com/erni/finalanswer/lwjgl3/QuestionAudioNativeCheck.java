package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.erni.finalanswer.audio.*;

/** Native decoding/playback regression using the production GameAudio channel and actual WAVs. */
public final class QuestionAudioNativeCheck extends ApplicationAdapter {
    private GameAudio owner;
    private QuestionAudio audio;
    private float time;
    private int stage;
    private boolean first,second,clock;
    private static void require(boolean value,String message){if(!value)throw new AssertionError(message);}
    @Override public void create(){
        owner=new GameAudio();audio=owner.questions();
        require(audio.loaded()==4,"All four supplied recordings must decode");
        require(Math.abs(QuestionAudio.clockPeriod()-20)<.01f,"Clock header duration");
        require(QuestionAudio.lockDuration()>7.9f,"Metallic tail header duration");
        audio.question("native:1",1);audio.phase(false,false,0,20);
    }
    @Override public void render(){
        float dt=Gdx.graphics.getDeltaTime();time+=dt;
        if(time>1&&stage==0){require(audio.trackPlaying(0),"First native composition playing");first=true;audio.phase(true,false,12.5,7.5);stage++;}
        if(time>2&&stage==1){require(audio.ticking(),"Native timer loop playing");clock=true;audio.phase(false,true,20,0);require(!audio.ticking(),"Timer stopped synchronously");stage++;}
        if(time>3&&stage==2){audio.question("native:2",2);audio.phase(false,false,0,20);stage++;}
        if(time>4.5&&stage==3){require(audio.trackPlaying(1),"Second native composition playing");second=true;audio.phase(true,false,0,20);stage++;}
        if(time>5&&stage==4){audio.phase(false,true,20,0);require(audio.lockCount()==1,"Rapid next question cannot truncate or overlap metallic tail");audio.leave();stage++;}
        owner.update(dt);
        require(!(audio.trackPlaying(0)&&audio.trackPlaying(1)),"Native tracks never overlap");
        if(time>11){require(first&&second&&clock,"Both tracks and timer exercised");require(!audio.trackPlaying(0)&&!audio.trackPlaying(1)&&!audio.ticking(),"Leave fades all continuous channels");
            System.out.println("PASS: native OpenAL decoded all 4 WAVs; both compositions, exclusive fades, timer loop/stop, full lock tail and scene exit");Gdx.app.exit();}
    }
    @Override public void dispose(){if(owner!=null)owner.close();}
    public static void main(String[] args){
        var config=new Lwjgl3ApplicationConfiguration();config.setTitle("FINAL ANSWER — Question audio check");config.setWindowedMode(640,360);config.setForegroundFPS(60);
        new Lwjgl3Application(new QuestionAudioNativeCheck(),config);
    }
}
