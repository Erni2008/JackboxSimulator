package com.erni.finalanswer.intro;

import java.util.function.Consumer;

/** Presentation only. The server separately validates the single completion/skip signal. */
public final class IntroSequenceController {
    public enum State { WAITING, PLAYING, EXITING, PAUSED, COMPLETED, SKIPPED, TIMING_CONFLICT }
    public interface Output {
        void speak(IntroTimeline.Speech speech,float offset,Consumer<Boolean> completion);
        void sound(IntroTimeline.Sound sound);
        void stopSound(String id);
        void finished(boolean skipped);
        void warning(String reason);
    }
    private final IntroTimeline plan;
    private final Output output;
    private final boolean[] soundStarted,soundStopped;
    private State state=State.WAITING;
    private State pausedState;
    private float exitStarted;
    public float exitProgress(){return state==State.EXITING?Math.min(1,(age-exitStarted)/plan.exitFade):state==State.COMPLETED||state==State.SKIPPED?1:0;}
    private float age,lastSpeechEnd=-100;
    private int nextSpeech,generation;
    private boolean speaking,lateWarned;
    public IntroSequenceController(IntroTimeline plan,Output output){this.plan=plan;this.output=output;soundStarted=new boolean[plan.sounds.size()];soundStopped=new boolean[plan.sounds.size()];}
    public State state(){return state;}
    public float age(){return age;}
    public float duration(){return plan.duration;}
    public void start(float elapsed){
        if(state!=State.WAITING)return;
        if(!plan.fits){state=State.TIMING_CONFLICT;output.warning("INTRO_TIMING_CONFLICT: measured="+plan.duration+", metadata="+plan.completeMetadata);return;}
        age=Math.max(0,elapsed);state=State.PLAYING;
        while(nextSpeech<plan.speech.size()&&plan.speech.get(nextSpeech).end()<=age)nextSpeech++;
        for(int i=0;i<plan.sounds.size();i++){
            var cue=plan.sounds.get(i);
            if(cue.at()<age&&(cue.until()==0||cue.until()<=age)){soundStarted[i]=soundStopped[i]=true;}
        }
        update(0);
    }
    public void update(float delta){
        if(state!=State.PLAYING&&state!=State.EXITING||!Float.isFinite(delta)||delta<0)return;
        age+=delta;
        if(state==State.EXITING){if(age>=exitStarted+plan.exitFade)finish(false);return;}
        for(int i=0;i<plan.sounds.size();i++){
            var sound=plan.sounds.get(i);
            if(!soundStarted[i]&&age>=sound.at()){soundStarted[i]=true;output.sound(sound);}
            if(soundStarted[i]&&!soundStopped[i]&&sound.until()>0&&age>=sound.until()){soundStopped[i]=true;output.stopSound(sound.cue().id());}
        }
        if(!speaking&&nextSpeech<plan.speech.size()){
            var speech=plan.speech.get(nextSpeech);
            float pause=nextSpeech==0?0:plan.speech.get(nextSpeech-1).line().pauseAfter();
            if(age>=speech.start()&&age>=lastSpeechEnd+pause){
                speaking=true;nextSpeech++;int token=generation;
                float offset=lastSpeechEnd<0?Math.max(0,age-speech.start()):0;
                output.speak(speech,offset,success->{if(token!=generation)return;speaking=false;lastSpeechEnd=age;if(!success)output.warning("Intro voice unavailable: "+speech.line().id());});
            }
        }
        if(!speaking&&nextSpeech==plan.speech.size()&&age>=plan.duration-plan.exitFade){state=State.EXITING;exitStarted=age;}
        if(age>80&&!lateWarned){lateWarned=true;output.warning("INTRO_RUNTIME_TIMING_CONFLICT: narration was not truncated");}
    }
    public void pause(){if(state==State.PLAYING||state==State.EXITING){pausedState=state;state=State.PAUSED;}}
    public void resume(){if(state==State.PAUSED)state=pausedState;}
    public void skip(){if(state==State.COMPLETED||state==State.SKIPPED)return;finish(true);}
    public void cancel(){generation++;speaking=false;state=State.SKIPPED;}
    private void finish(boolean skipped){generation++;speaking=false;state=skipped?State.SKIPPED:State.COMPLETED;output.finished(skipped);}
}
