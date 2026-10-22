package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.shotgun.ShotgunAnimator;
import com.finalanswer.protocol.CursedSurvivorTimeline;

/** Screen-scoped, preloaded audio. No networking, timers, threads or render-time asset access. */
public final class CursedBoxesSoundManager implements Disposable {
    public enum Category { SHOTGUN, RELOAD, SHELL, WOOD, HEARTBEAT, REVEAL }
    public enum Cue {
        SHOT("shotgun_shoot_done.wav",Category.SHOTGUN,true),
        MECHANISM("reload_done.wav",Category.RELOAD),
        SHELL_DROP("773860__mrgungus__12-guage-shotgun-shell-drop.wav",Category.SHELL),
        WOOD_BREAK("box_destroy_done.wav",Category.WOOD,true),
        HEARTBEAT("heart_beating_done.wav",Category.HEARTBEAT),
        REVEAL_START("reveal_sound2(done).wav",Category.REVEAL),
        REVEAL_COMPLETE("reveal_done.wav",Category.REVEAL),
        INSERT_ROUND("reload_done(bullets).wav",Category.RELOAD);
        public final String path,sourcePath;public final Category category;
        Cue(String file,Category category){this(file,category,false);}
        Cue(String file,Category category,boolean tightAttack){sourcePath="sounds/cursed_boxes/"+file;path="sounds/cursed_boxes/"+(tightAttack?"runtime/":"")+file;this.category=category;}
    }
    public static final class Levels {
        public float master=1,shotgun=1,reload=.75f,shell=.90f,wood=.85f,heartbeat=.60f,reveal=.80f;
        public float gain(Category category){return unit(master)*unit(switch(category){case SHOTGUN->shotgun;case RELOAD->reload;case SHELL->shell;case WOOD->wood;case HEARTBEAT->heartbeat;case REVEAL->reveal;});}
    }
    @FunctionalInterface public interface Backend {Sound load(String path);}
    private static final Cue[] CUES=Cue.values();
    public final Levels levels=new Levels();
    private final Backend backend;
    private final Sound[] sounds=new Sound[CUES.length];
    private final boolean[] warned=new boolean[CUES.length];
    private final java.util.function.Consumer<String> warning;
    private Sound hostVoice;
    private float hostVoiceDuration;
    private boolean hostAnnounced;
    private final long[] voices=new long[CUES.length],plays=new long[CUES.length];
    private int loaded,smokeCues,completeCues;
    private long weaponSequence,lastImpact=-1,landedShell=-1;
    private boolean loading,paused,muted,disposed,inserting,revealObserved,heartbeatWanted,heartbeatAttempted;
    private ShotgunAnimator.State weaponState=ShotgunAnimator.State.IDLE;
    private float heartbeatGain,previousRevealAge;
    public CursedBoxesSoundManager(){this(path->Gdx.audio.newSound(Gdx.files.internal(path)));loading=true;}
    /** Injected backend also permits deterministic tests without an audio device. */
    public CursedBoxesSoundManager(Backend backend){this(backend,message->{if(Gdx.app!=null)Gdx.app.error("Cursed audio",message);else System.err.println("Cursed audio: "+message);});}
    public CursedBoxesSoundManager(Backend backend,java.util.function.Consumer<String> warning){this.backend=backend;this.warning=warning;java.util.Arrays.fill(voices,-1);}
    private void warn(Cue cue,String operation,RuntimeException error){int index=cue.ordinal();if(!warned[index]){warned[index]=true;warning.accept(operation+" optional WAV "+cue.path+": "+error.getMessage());}}
    public int available(){int count=0;for(Sound sound:sounds)if(sound!=null)count++;return count;}
    public float hostVoiceDuration(){return hostVoiceDuration;}
    public void loadHostVoice(){
        String path="sounds/cursed_boxes/host_check_boxes.wav";
        var file=Gdx.files.internal(path);
        if(!file.exists()){warning.accept("Optional host voice missing: "+path+"; using cinematic subtitle");return;}
        try{hostVoiceDuration=wavDuration(file.readBytes());hostVoice=backend.load(path);}
        catch(RuntimeException error){warning.accept("Cannot load optional host voice "+path+": "+error.getMessage());hostVoiceDuration=0;}
    }
    public void hostAnnouncement(){
        if(hostAnnounced||!audible())return;hostAnnounced=true;
        if(hostVoice!=null)try{hostVoice.play(levels.gain(Category.REVEAL));}catch(RuntimeException error){warning.accept("Host voice playback failed: "+error.getMessage());}
    }
    private static float wavDuration(byte[] data){
        var b=java.nio.ByteBuffer.wrap(data).order(java.nio.ByteOrder.LITTLE_ENDIAN);int rate=0,size=0;
        if(data.length<12||b.getInt(0)!=0x46464952||b.getInt(8)!=0x45564157)throw new IllegalArgumentException("Expected WAV header");
        for(int p=12;p+8<=data.length;){int id=b.getInt(p),n=b.getInt(p+4);if(n<0||n>data.length-p-8)throw new IllegalArgumentException("Invalid WAV chunk");if(id==0x20746d66&&n>=16)rate=b.getInt(p+16);if(id==0x61746164)size=n;p+=8+n+(n&1);}
        if(rate<=0||size<=0)throw new IllegalArgumentException("Missing WAV format/data");return size/(float)rate;
    }
    private static float unit(float value){return Float.isFinite(value)?Math.max(0,Math.min(1,value)):0;}
    public int loaded(){return loaded;}
    public String nextAsset(){return loaded<CUES.length?CUES[loaded].path:"";}
    public void loadNext(){
        if(disposed)throw new IllegalStateException("Loading disposed Cursed Boxes audio");if(loaded==CUES.length)return;
        Cue cue=CUES[loaded];Sound sound=null;
        try{sound=backend.load(cue.path);if(sound==null)throw new IllegalStateException("No Sound returned");}
        catch(RuntimeException error){warn(cue,"Cannot preload",error);}
        sounds[loaded++]=sound;
    }
    public void warmup(){for(int i=0;i<sounds.length;i++)if(sounds[i]!=null)try{long id=sounds[i].play(0);if(id>=0)sounds[i].stop(id);}catch(RuntimeException error){warn(CUES[i],"Cannot warm up",error);}}
    public void loading(boolean value){loading=value;if(value)stop();}
    public void muted(boolean value){muted=value;if(value)stop();}
    public void paused(boolean value){paused=value;if(value)stop();}
    private boolean audible(){return !disposed&&!loading&&!paused&&!muted;}
    private void play(Cue cue){
        int i=cue.ordinal();Sound sound=sounds[i];float volume=levels.gain(cue.category);
        if(!audible()||sound==null||volume<=0)return;
        // One controlled voice per cue. A restart cannot stack a long tail from a previous reveal/shot.
        try{if(voices[i]>=0)sound.stop(voices[i]);voices[i]=sound.play(volume);if(voices[i]>=0)plays[i]++;else warn(cue,"No playback channel for",new IllegalStateException("Sound.play returned -1"));}
        catch(RuntimeException error){voices[i]=-1;warn(cue,"Cannot play",error);}
    }
    /** Existing animator event, emitted at the same fire/cycle boundary as the visual animation. */
    public void weaponEvent(ShotgunAnimator.Event event,long sequence){
        if(disposed||sequence<=weaponSequence)return;weaponSequence=sequence;
        switch(event){
            case FIRED->play(Cue.SHOT);
            case CYCLE_STARTED->play(Cue.MECHANISM);
            case RESET->reset();
            default->{/* Ejection is not floor contact, and chamber refill is not insertion. */}
        }
    }
    /** Poll the existing shell MOVING state; normal auto-refill has no insertion animation. */
    public void weaponPose(ShotgunAnimator animator){
        var next=animator.state();
        if(next!=weaponState&&(next==ShotgunAnimator.State.RELOAD||next==ShotgunAnimator.State.OPENING||next==ShotgunAnimator.State.CLOSING))play(Cue.MECHANISM);
        boolean moving=next==ShotgunAnimator.State.RELOAD&&animator.shellState()==ShotgunAnimator.ShellState.MOVING;
        if(moving&&!inserting)play(Cue.INSERT_ROUND);
        inserting=moving;weaponState=next;
    }
    public void impact(long shotSerial){if(shotSerial<=lastImpact)return;lastImpact=shotSerial;play(Cue.WOOD_BREAK);}
    /** Caller supplies contact from the current, unmodified rendered shell trajectory/bounds. */
    public void shellContact(long ejectionSerial,boolean visibleContact){
        if(!visibleContact||ejectionSerial<=landedShell)return;landedShell=ejectionSerial;play(Cue.SHELL_DROP);
    }
    public void reveal(CursedSurvivorTimeline clock,float dt){
        if(disposed)return;
        float step=Float.isFinite(dt)?Math.max(0,dt):0;
        if(!clock.started()){
            revealObserved=false;smokeCues=completeCues=0;heartbeatWanted=false;
        }else{
            float age=clock.age();
            if(!revealObserved){
                // Reconnect/late scene load must not replay old survivors or a burst of historical cues.
                previousRevealAge=age<=step+.05f?-.001f:age;revealObserved=true;
            }
            float lower=Math.max(previousRevealAge,age-step-.05f);
            for(int box=0;box<16;box++)if(clock.eligible(box)){
                int bit=1<<box;float start=age-clock.localAge(box),smoke=start+clock.timings.anticipation,visible=start+clock.timings.anticipation+clock.timings.smoke+clock.timings.panel;
                if(age>=smoke&&(smokeCues&bit)==0){smokeCues|=bit;if(smoke>lower)play(Cue.REVEAL_START);}
                if(age>=visible&&(completeCues&bit)==0){completeCues|=bit;if(visible>lower)play(Cue.REVEAL_COMPLETE);}
            }
            previousRevealAge=age;
            int box=clock.currentBox();float local=box<0?-1:clock.localAge(box);
            heartbeatWanted=box>=0&&local>=0&&local<clock.timings.anticipation+clock.timings.smoke;
        }
        updateHeartbeat(step);
    }
    private void updateHeartbeat(float dt){
        int i=Cue.HEARTBEAT.ordinal();Sound sound=sounds[i];float target=heartbeatWanted&&audible()&&levels.gain(Category.HEARTBEAT)>0?1:0;
        if(target==0)heartbeatAttempted=false;
        if(target>0&&!heartbeatAttempted&&voices[i]<0&&sound!=null){heartbeatAttempted=true;try{voices[i]=sound.loop(0);if(voices[i]>=0)plays[i]++;else warn(Cue.HEARTBEAT,"No loop channel for",new IllegalStateException("Sound.loop returned -1"));}catch(RuntimeException error){voices[i]=-1;warn(Cue.HEARTBEAT,"Cannot loop",error);}}
        heartbeatGain=target>0?Math.min(1,heartbeatGain+dt/.08f):Math.max(0,heartbeatGain-dt/.12f);
        if(sound!=null&&voices[i]>=0)try{
            sound.setVolume(voices[i],levels.gain(Category.HEARTBEAT)*heartbeatGain);
            if(heartbeatGain<=0){sound.stop(voices[i]);voices[i]=-1;}
        }catch(RuntimeException error){try{sound.stop(voices[i]);}catch(RuntimeException stopError){error.addSuppressed(stopError);}voices[i]=-1;warn(Cue.HEARTBEAT,"Cannot update loop",error);}
    }
    public long playCount(Cue cue){return plays[cue.ordinal()];}
    public boolean heartbeatActive(){return voices[Cue.HEARTBEAT.ordinal()]>=0;}
    public void stop(){if(hostVoice!=null)try{hostVoice.stop();}catch(RuntimeException error){warning.accept("Cannot stop host voice: "+error.getMessage());}for(int i=0;i<sounds.length;i++){if(sounds[i]!=null)try{sounds[i].stop();}catch(RuntimeException error){warn(CUES[i],"Cannot stop",error);}voices[i]=-1;}heartbeatGain=0;heartbeatWanted=heartbeatAttempted=false;}
    public void reset(){stop();lastImpact=landedShell=-1;smokeCues=completeCues=0;hostAnnounced=revealObserved=inserting=false;previousRevealAge=0;weaponState=ShotgunAnimator.State.IDLE;}
    @Override public void dispose(){if(disposed)return;stop();disposed=true;for(int i=0;i<sounds.length;i++)if(sounds[i]!=null)try{sounds[i].dispose();}catch(RuntimeException error){warn(CUES[i],"Cannot dispose",error);}if(hostVoice!=null)try{hostVoice.dispose();}catch(RuntimeException error){warning.accept("Cannot dispose host voice: "+error.getMessage());}}
}
