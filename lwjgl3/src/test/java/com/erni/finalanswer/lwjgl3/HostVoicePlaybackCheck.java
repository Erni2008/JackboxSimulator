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
    private final boolean impostor=Boolean.getBoolean("host.voice.impostor");
    private static final String[] MODE_LINES={"impostor_intro","impostor_round_1","impostor_round_2","impostor_round_3","impostor_suspicion","impostor_discussion","impostor_final_voting","impostor_round_deadline","impostor_vote_intro_1","impostor_vote_intro_2","impostor_vote_tie","impostor_vote_no_votes","impostor_vote_reveal_intro","impostor_outcome_caught","impostor_outcome_escaped"};
    @Override public void create(){
        started=System.nanoTime();
        voice=new HostVoiceManager("ru",new AudioMix(),message->Gdx.app.error("Host voice QA",message));
        missing=new HostVoiceManager("zz",new AudioMix(),message->Gdx.app.log("Expected missing manifest QA",message));
        missing.playQuestion("absent","qa:missing",result->missingHandled=result==HostVoiceManager.Result.MISSING);
        if(impostor)voice.playLine(MODE_LINES[0],"qa:"+MODE_LINES[0],this::done);else voice.playQuestion("solar-largest","qa:question",this::done);
    }
    private void done(HostVoiceManager.Result result){
        if(result!=HostVoiceManager.Result.COMPLETED){failure=new AssertionError("Host narration failed: "+result);Gdx.app.exit();return;}
        completed++;
        if(impostor){
            if(completed<MODE_LINES.length)voice.playLine(MODE_LINES[completed],"qa:"+MODE_LINES[completed],this::done);
            else{if(!missingHandled)failure=new AssertionError("Missing-manifest fallback failed");Gdx.app.log("Host voice QA","PASS: all "+completed+" real Impostor OGG clips decoded and played to completion sequentially, offline");Gdx.app.exit();}
        }else if(completed==1)voice.playLine("impostor_intro","qa:intro",this::done);
        else{
            if(!missingHandled)failure=new AssertionError("Missing manifest did not complete gracefully");
            Gdx.app.log("Host voice QA","PASS: real question and announcement, async manifest/mono Vorbis, sequential completion, missing-manifest fallback, offline playback");Gdx.app.exit();
        }
    }
    @Override public void render(){
        ScreenUtils.clear(.02f,.015f,.025f,1);voice.update();missing.update();
        if(System.nanoTime()-started>(impostor?180_000_000_000L:30_000_000_000L)){failure=new AssertionError("Narration completion timed out");Gdx.app.exit();}
    }
    @Override public void dispose(){if(voice!=null)voice.close();if(missing!=null)missing.close();}
    public static void main(String[] args){
        var config=new Lwjgl3ApplicationConfiguration();config.setWindowedMode(480,270);
        config.setTitle("Final Answer — Host voice playback check");config.setForegroundFPS(60);
        new Lwjgl3Application(new HostVoicePlaybackCheck(),config);
        if(failure!=null)throw new AssertionError(failure);
    }
}
