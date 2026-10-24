package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.audio.*;

/** Real asynchronous OGG playback; never calls a TTS server. Requires locally generated QA assets. */
public final class HostVoicePlaybackCheck extends ApplicationAdapter {
    private static Throwable failure;
    private HostVoiceManager voice;
    private HostVoiceManager missing;
    private boolean missingHandled;
    private long started;
    private int completed;
    @Override public void create(){
        started=System.nanoTime();
        voice=new HostVoiceManager("ru",new AudioMix(),message->Gdx.app.error("Host voice QA",message));
        missing=new HostVoiceManager("zz",new AudioMix(),message->Gdx.app.log("Expected missing manifest QA",message));
        missing.playQuestion("absent","qa:missing",result->missingHandled=result==HostVoiceManager.Result.MISSING);
        voice.playQuestion("solar-largest","qa:question",this::done);
    }
    private void done(HostVoiceManager.Result result){
        if(result!=HostVoiceManager.Result.COMPLETED){failure=new AssertionError("Host narration failed: "+result);Gdx.app.exit();return;}
        completed++;
        if(completed==1)voice.playLine("impostor_intro","qa:intro",this::done);
        else{
            if(!missingHandled)failure=new AssertionError("Missing manifest did not complete gracefully");
            Gdx.app.log("Host voice QA","PASS: real question and announcement, async manifest/mono Vorbis, sequential completion, missing-manifest fallback, offline playback");Gdx.app.exit();
        }
    }
    @Override public void render(){
        ScreenUtils.clear(.02f,.015f,.025f,1);voice.update();missing.update();
        if(System.nanoTime()-started>30_000_000_000L){failure=new AssertionError("Narration completion timed out");Gdx.app.exit();}
    }
    @Override public void dispose(){if(voice!=null)voice.close();if(missing!=null)missing.close();}
    public static void main(String[] args){
        var config=new Lwjgl3ApplicationConfiguration();config.setWindowedMode(480,270);
        config.setTitle("Final Answer — Host voice playback check");
        new Lwjgl3Application(new HostVoicePlaybackCheck(),config);
        if(failure!=null)throw new AssertionError(failure);
    }
}
