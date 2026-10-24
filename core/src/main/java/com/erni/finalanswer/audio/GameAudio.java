package com.erni.finalanswer.audio;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.*;
import java.util.function.Consumer;
import static com.erni.finalanswer.audio.AudioMix.Category.*;

/** Application-owned cached UI/cage audio. Scene sound managers keep their existing ownership. */
public final class GameAudio implements AutoCloseable {
    public enum Cue {
        HOVER("sounds/ui/hover_button.wav",UI), PRESS("sounds/ui/button_press.mp3",UI),
        GATE("sounds/cages/gate_closes.wav",CAGES),
        GATE_LOCK(QuestionAudio.LOCK,CAGES),
        CHAIN_1("sounds/cages/runtime/chain_cage.wav",CAGES), CHAIN_2("sounds/cages/runtime/chain_cage2.wav",CAGES);
        public final String path;final AudioMix.Category category;
        Cue(String path,AudioMix.Category category){this.path=path;this.category=category;}
    }
    public static final String AMBIENCE="sounds/environment/creepy_basement.mp3";
    public static final class Levels {public float hover=.35f,press=.55f,gate=.75f,lock=.75f,chain=.55f,ambience=.20f;}
    private static final Cue[] CUES=Cue.values();
    private static final class Voice {Sound sound;Cue cue;long id=-1;float age,level,pan,duration;}
    public final Levels levels=new Levels();
    private final AudioMix mix;
    private final float lockDuration;
    private final PresentationAudio.Backend backend;
    private QuestionAudio questions;
    private HostVoiceManager host;
    private IntroAudio intro;
    private float environmentScopeGain=1;
    private float cageScopeGain=1;
    public void environmentGain(float value){environmentScopeGain=AudioMix.unit(value);}
    public void cagesGain(float value){cageScopeGain=AudioMix.unit(value);}
    public IntroAudio intro(){if(intro==null)intro=new IntroAudio(com.erni.finalanswer.gameplay.intro.IntroDefinition.RUSSIAN,hostVoice(),mix);return intro;}
    public void beginIntro(){if(questions!=null){questions.pause(true);questions.leave();}intro().restart();}
    public void finishIntro(){if(intro!=null)intro.retire();if(host!=null){host.releaseIntro();host.scopeGain(1);}environmentScopeGain=1;}
    public HostVoiceManager hostVoice(){if(closed)throw new IllegalStateException("Audio disposed");if(host==null){host=new HostVoiceManager("ru",mix,warning);if(paused)host.pause();}return host;}
    public QuestionAudio activeQuestions(){return questions;}
    public QuestionAudio questions(){if(closed)throw new IllegalStateException("Audio disposed");if(questions==null)questions=new QuestionAudio(backend,mix,warning,QuestionAudio.clockPeriod(),QuestionAudio.lockDuration());return questions;}
    private final boolean[] warned=new boolean[CUES.length];
    private final Sound[] sounds=new Sound[CUES.length];
    private final Voice[] voices=new Voice[8];
    private final long[] starts=new long[CUES.length];
    private final float[] angle=new float[8],velocity=new float[8],cageCooldown=new float[8],gateCooldown=new float[8];
    private final boolean[] moving=new boolean[8],observed=new boolean[8];
    private final Consumer<String> warning;
    private Music ambience;
    private float hoverCooldown,pressCooldown,environmentFade,uiScopeGain=1;
    private int chainVariant;
    private boolean room,paused,closed,ambienceFailed;
    public GameAudio(){this(PresentationAudio.GDX,AudioMix.GLOBAL,message->Gdx.app.error("Game audio",message));}
    public GameAudio(PresentationAudio.Backend backend,AudioMix mix,Consumer<String> warning){
        this.mix=mix;this.warning=warning;this.backend=backend;lockDuration=backend==PresentationAudio.GDX?QuestionAudio.lockDuration():8;
        for(int i=0;i<voices.length;i++)voices[i]=new Voice();
        for(Cue cue:CUES)try{sounds[cue.ordinal()]=backend.sound(cue.path);if(sounds[cue.ordinal()]==null)warning.accept("Missing optional audio: "+cue.path);}catch(RuntimeException e){warning.accept("Cannot preload "+cue.path+": "+e.getMessage());}
        try{ambience=backend.music(AMBIENCE);if(ambience==null)warning.accept("Missing optional ambience: "+AMBIENCE);else{ambience.setLooping(true);ambience.setVolume(0);}}catch(RuntimeException e){warning.accept("Cannot preload "+AMBIENCE+": "+e.getMessage());}
    }
    private void warn(Cue cue,String message){if(!warned[cue.ordinal()]){warned[cue.ordinal()]=true;warning.accept(message);}}
    public void uiGain(float value){uiScopeGain=AudioMix.unit(value);}
    private float level(Cue cue){return (cue.category==UI?uiScopeGain:cue.category==CAGES?cageScopeGain:1)*AudioMix.unit(switch(cue){case HOVER->levels.hover;case PRESS->levels.press;case GATE->levels.gate;case GATE_LOCK->levels.lock;default->levels.chain;});}
    private void stop(Voice voice){if(voice.id>=0)try{voice.sound.stop(voice.id);}catch(RuntimeException e){warn(voice.cue,"Cannot stop "+voice.cue.path+": "+e.getMessage());}voice.id=-1;}
    private void play(Cue cue,float strength,float pan){
        Sound sound=sounds[cue.ordinal()];if(closed||paused||sound==null)return;
        float volume=AudioMix.unit(strength)*level(cue)*mix.gain(cue.category);if(volume<=0)return;
        boolean chain=cue==Cue.CHAIN_1||cue==Cue.CHAIN_2;int count=0;Voice free=null,oldest=null;
        for(Voice voice:voices){if(voice.id<0){if(free==null)free=voice;continue;}boolean same=chain?(voice.cue==Cue.CHAIN_1||voice.cue==Cue.CHAIN_2):voice.cue==cue;if(same){count++;if(oldest==null||voice.age>oldest.age)oldest=voice;}}
        int limit=chain?2:cue==Cue.GATE?3:1;Voice voice=count>=limit?oldest:free;
        if(voice==null)return;stop(voice);
        try{voice.id=sound.play(volume,1,Math.max(-.65f,Math.min(.65f,pan)));if(voice.id<0){warn(cue,"No playback voice: "+cue.path);return;}voice.sound=sound;voice.cue=cue;voice.age=0;voice.level=AudioMix.unit(strength);voice.pan=pan;voice.duration=cue==Cue.GATE_LOCK?lockDuration:chain?1.1f:cue==Cue.GATE?1.3f:cue==Cue.HOVER?.49f:.24f;starts[cue.ordinal()]++;}
        catch(RuntimeException e){voice.id=-1;warn(cue,"Cannot play "+cue.path+": "+e.getMessage());}
    }
    public void hover(){if(hoverCooldown>0)return;hoverCooldown=.085f;play(Cue.HOVER,1,0);}
    public void press(){if(pressCooldown>0)return;pressCooldown=.025f;play(Cue.PRESS,1,0);}
    public void gate(int slot,float pan){if(slot<0||slot>=8||gateCooldown[slot]>0)return;gateCooldown[slot]=.65f;play(Cue.GATE,1,pan);}
    /** One full key recording covers overlapping cage locks without stacking identical tails. */
    public void lock(int slot,float pan){
        if(slot<0||slot>=8)return;
        for(Voice voice:voices)if(voice.id>=0&&voice.cue==Cue.GATE_LOCK)return;
        play(Cue.GATE_LOCK,1,pan);
    }
    /** Observe the actual rendered angle, including existing impact and departure animation. */
    public void cageMotion(int slot,boolean occupied,float rotation,float dt,float pan){
        if(slot<0||slot>=8||!Float.isFinite(rotation)||!Float.isFinite(dt)||dt<=0)return;
        if(!occupied){observed[slot]=moving[slot]=false;angle[slot]=velocity[slot]=0;return;}
        if(!observed[slot]){observed[slot]=true;angle[slot]=rotation;return;}
        float speed=(rotation-angle[slot])/dt,energy=Math.abs(speed),previous=Math.abs(velocity[slot]);
        boolean noticeable=energy>.5f,reverse=speed*velocity[slot]<0&&Math.max(energy,previous)>1.5f;
        boolean settling=moving[slot]&&energy<.5f&&previous>.8f;
        if(cageCooldown[slot]<=0&&((noticeable&&!moving[slot])||reverse||settling)){
            cageCooldown[slot]=.45f;chainVariant=1-chainVariant;
            play(chainVariant==0?Cue.CHAIN_1:Cue.CHAIN_2,Math.min(1,.18f+Math.max(energy,previous)/14),pan);
        }
        moving[slot]=noticeable;angle[slot]=rotation;velocity[slot]=speed;
    }
    public void room(boolean active){room=active;}
    public void update(float dt){
        if(closed||!Float.isFinite(dt)||dt<0)return;mix.update(dt);if(questions!=null)questions.update(dt);if(host!=null)host.update();if(intro!=null){intro.update(dt);if(intro.closed())intro=null;}
        hoverCooldown=Math.max(0,hoverCooldown-dt);pressCooldown=Math.max(0,pressCooldown-dt);
        for(int i=0;i<8;i++){cageCooldown[i]=Math.max(0,cageCooldown[i]-dt);gateCooldown[i]=Math.max(0,gateCooldown[i]-dt);}
        for(Voice voice:voices)if(voice.id>=0){voice.age+=dt;if(paused||voice.age>=voice.duration){stop(voice);continue;}
            float tail=(voice.cue==Cue.CHAIN_1||voice.cue==Cue.CHAIN_2)?Math.min(1,(voice.duration-voice.age)/.25f):1;
            try{voice.sound.setVolume(voice.id,voice.level*level(voice.cue)*mix.gain(voice.cue.category)*tail);}catch(RuntimeException e){stop(voice);warn(voice.cue,"Cannot update effect: "+e.getMessage());}}
        float target=room&&!paused?1:0;environmentFade+=Math.max(-dt/.65f,Math.min(dt/.65f,target-environmentFade));
        if(ambience!=null&&!ambienceFailed)try{
            float gain=(paused?0:environmentFade)*environmentScopeGain*AudioMix.unit(levels.ambience)*mix.gain(ENVIRONMENT)*mix.ambienceDuck();
            ambience.setVolume(gain);if(gain>0&&!ambience.isPlaying())ambience.play();else if(gain<=0&&ambience.isPlaying())ambience.pause();
        }catch(RuntimeException e){warning.accept("Ambience device failure: "+e.getMessage());try{ambience.stop();}catch(RuntimeException ignored){}ambienceFailed=true;}
    }
    public void pause(boolean value){paused=value;if(questions!=null)questions.pause(value);if(host!=null){if(value)host.pause();else host.resume();}if(value){for(Voice voice:voices)stop(voice);if(ambience!=null)try{ambience.pause();}catch(RuntimeException e){ambienceFailed=true;warning.accept("Cannot pause ambience: "+e.getMessage());}}}
    public void leaveCages(){for(int i=0;i<8;i++){observed[i]=moving[i]=false;angle[i]=velocity[i]=cageCooldown[i]=gateCooldown[i]=0;}for(Voice voice:voices)if(voice.id>=0&&voice.cue.category==CAGES)stop(voice);}
    public boolean ambiencePlaying(){return ambience!=null&&ambience.isPlaying();}
    public int loaded(){int n=0;for(Sound sound:sounds)if(sound!=null)n++;return n+(ambience==null?0:1);}
    public long playCount(Cue cue){return starts[cue.ordinal()];}
    public int activeChains(){int n=0;for(Voice v:voices)if(v.id>=0&&(v.cue==Cue.CHAIN_1||v.cue==Cue.CHAIN_2))n++;return n;}
    @Override public void close(){
        if(closed)return;closed=true;if(questions!=null)questions.close();if(intro!=null)intro.close();if(host!=null)host.close();for(Voice voice:voices)stop(voice);
        for(Cue cue:CUES)if(sounds[cue.ordinal()]!=null){
            try{sounds[cue.ordinal()].stop();}catch(RuntimeException e){warn(cue,"Cannot stop "+cue.path+": "+e.getMessage());}
            try{sounds[cue.ordinal()].dispose();}catch(RuntimeException e){warn(cue,"Cannot dispose "+cue.path+": "+e.getMessage());}
        }
        if(ambience!=null){try{ambience.stop();}catch(RuntimeException e){warning.accept("Cannot stop ambience: "+e.getMessage());}try{ambience.dispose();}catch(RuntimeException e){warning.accept("Cannot dispose ambience: "+e.getMessage());}ambience=null;}
        mix.resetDuck();
    }
}
