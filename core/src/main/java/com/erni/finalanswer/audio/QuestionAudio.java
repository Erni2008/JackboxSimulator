package com.erni.finalanswer.audio;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.*;
import java.io.DataInputStream;
import java.util.function.Consumer;

/** Question presentation channel owned and updated by GameAudio, including screen-exit fades and lock tails. */
public final class QuestionAudio implements AutoCloseable {
    public static final String FIRST="sounds/questions/background_music.wav",SECOND="sounds/questions/runtime/background_music2.wav",
        CLOCK="sounds/questions/clock_ticks.wav",LOCK="sounds/questions/door_lock(done).wav";
    public float musicLevel=.35f,tickLevel=.55f,lockLevel=.85f;
    private final Music[] tracks=new Music[2];
    private final AudioMix mix;
    private final Consumer<String> warning;
    private final boolean[] failed=new boolean[4];
    private Music clock;
    private Sound lock;
    private final float clockPeriod,lockDuration;
    private float lockRemaining;
    private String question="";
    private int requested=-1,current=-1,lastSelected=-1;
    private float fade;
    private double elapsed;
    private long lockVoice=-1,lockCount;
    private boolean wanted,ticks,answerSeen,locked,paused,closed,clockPlaying;
    public QuestionAudio(PresentationAudio.Backend backend,AudioMix mix,Consumer<String> warning,float clockPeriod){
        this(backend,mix,warning,clockPeriod,8);
    }
    public QuestionAudio(PresentationAudio.Backend backend,AudioMix mix,Consumer<String> warning,float clockPeriod,float lockDuration){
        this.lockDuration=Float.isFinite(lockDuration)&&lockDuration>0?lockDuration:8;
        this.mix=mix;this.warning=warning;this.clockPeriod=Float.isFinite(clockPeriod)&&clockPeriod>0?clockPeriod:20;
        tracks[0]=load(backend,FIRST);tracks[1]=load(backend,SECOND);clock=load(backend,CLOCK);
        try{lock=backend.sound(LOCK);if(lock==null)warning.accept("Missing optional question audio: "+LOCK);}catch(RuntimeException e){warning.accept("Cannot preload "+LOCK+": "+e.getMessage());}
    }
    private Music load(PresentationAudio.Backend backend,String path){
        Music value=null;try{value=backend.music(path);if(value==null)warning.accept("Missing optional question audio: "+path);else{value.setLooping(true);value.setVolume(0);}return value;}
        catch(RuntimeException e){if(value!=null)try{value.dispose();}catch(RuntimeException ignored){}warning.accept("Cannot preload "+path+": "+e.getMessage());return null;}
    }
    /** Header inspection only during preload, never during rendering or playback. */
    public static float clockPeriod(){return wavDuration(CLOCK,20);}
    public static float lockDuration(){return wavDuration(LOCK,8);}
    private static float wavDuration(String path,float fallback){
        try(var in=new DataInputStream(Gdx.files.internal(path).read())){
            if(in.readInt()!=0x52494646)throw new IllegalArgumentException("Not RIFF");in.readInt();if(in.readInt()!=0x57415645)throw new IllegalArgumentException("Not WAV");
            int rate=0;for(int chunks=0;chunks<128;chunks++){
                int id=in.readInt(),length=Integer.reverseBytes(in.readInt());if(length<0)throw new IllegalArgumentException("Invalid chunk");
                if(id==0x666d7420&&length>=16){in.skipNBytes(8);rate=Integer.reverseBytes(in.readInt());in.skipNBytes(length-12L+(length&1));}
                else if(id==0x64617461&&rate>0)return length/(float)rate;
                else in.skipNBytes(length+(long)(length&1));
            }
        }catch(Exception e){if(Gdx.app!=null)Gdx.app.error("Question audio","Cannot inspect optional WAV "+path+"; using "+fallback+"s duration",e);}
        return fallback;
    }
    public void question(String key,int number){
        if(closed)return;
        if(!question.equals(key)){
            question=key;requested=lastSelected<0?Math.floorMod(number-1,2):1-lastSelected;lastSelected=requested;
            answerSeen=locked=false;
        }
        wanted=!locked;
    }
    /** lockedNow must come from actual timer closure, not an individual player's submission. */
    public void phase(boolean answering,boolean lockedNow,double elapsedSeconds,double remainingSeconds){
        if(closed)return;elapsed=Double.isFinite(elapsedSeconds)?Math.max(0,elapsedSeconds):0;
        if(answering&&!locked)answerSeen=true;
        ticks=answering&&!locked&&remainingSeconds>0;
        if(lockedNow){
            ticks=false;wanted=false;
            if(!locked&&answerSeen){locked=true;playLock();}else locked=true;
        }
        if(!ticks)stopClock();
    }
    private void playLock(){
        if(paused||lock==null||failed[3]||lockRemaining>0)return;
        float gain=mix.gain(AudioMix.Category.SFX)*AudioMix.unit(lockLevel);if(gain<=0)return;
        mix.important(.75f);
        try{lockVoice=lock.play(gain);if(lockVoice>=0){lockCount++;lockRemaining=lockDuration;}}
        catch(RuntimeException e){fail(3,"door lock",e);}
    }
    private void fail(int index,String what,RuntimeException e){if(!failed[index])warning.accept("Question audio "+what+": "+e.getMessage());failed[index]=true;}
    private void stopClock(){if(clock!=null&&clockPlaying){try{clock.stop();}catch(RuntimeException e){fail(2,"clock stop",e);}clockPlaying=false;}}
    public void leave(){wanted=ticks=answerSeen=false;stopClock();if(paused){fade=0;current=-1;}paused=false;}
    public void pause(boolean value){
        if(paused==value)return;paused=value;if(value){stopClock();for(int i=0;i<2;i++)if(tracks[i]!=null)try{tracks[i].pause();}catch(RuntimeException e){fail(i,"pause",e);}
            if(lock!=null)try{lock.stop();}catch(RuntimeException e){fail(3,"lock pause",e);}lockVoice=-1;lockRemaining=0;}
    }
    public void update(float dt){
        if(closed||!Float.isFinite(dt)||dt<0)return;
        if(lockVoice>=0&&lock!=null)try{lock.setVolume(lockVoice,mix.gain(AudioMix.Category.SFX)*AudioMix.unit(lockLevel));}catch(RuntimeException e){fail(3,"lock volume",e);lockVoice=-1;}
        if(paused)return;
        lockRemaining=Math.max(0,lockRemaining-dt);if(lockRemaining==0)lockVoice=-1;
        int target=wanted?requested:-1;
        if(target>=0&&(tracks[target]==null||failed[target]))target=tracks[1-target]!=null&&!failed[1-target]?1-target:-1;
        if(current>=0&&current!=target){
            fade=Math.max(0,fade-dt/.55f);
            if(fade==0){try{tracks[current].stop();}catch(RuntimeException e){fail(current,"music stop",e);}current=-1;}
        }
        if(current<0&&target>=0){current=target;fade=0;}
        if(current>=0){
            if(current==target)fade=Math.min(1,fade+dt/.65f);
            try{float gain=fade*AudioMix.unit(musicLevel)*mix.gain(AudioMix.Category.MUSIC)*mix.ambienceDuck();
                tracks[current].setVolume(gain);if(gain>0&&!tracks[current].isPlaying())tracks[current].play();else if(gain<=0&&tracks[current].isPlaying())tracks[current].pause();
            }catch(RuntimeException e){int index=current;try{tracks[index].stop();}catch(RuntimeException ignored){}fail(index,"music playback",e);current=-1;fade=0;}
        }
        if(clock!=null&&!failed[2])try{
            float gain=mix.gain(AudioMix.Category.SFX)*AudioMix.unit(tickLevel);
            if(ticks&&gain>0){clock.setVolume(gain);if(!clockPlaying){clock.play();clock.setPosition((float)(elapsed%clockPeriod));clockPlaying=true;}}
            else stopClock();
        }catch(RuntimeException e){stopClock();fail(2,"clock playback",e);}
    }
    public int loaded(){int count=lock==null?0:1;for(Music track:tracks)if(track!=null)count++;return count+(clock==null?0:1);}
    public boolean trackPlaying(int index){return index>=0&&index<2&&tracks[index]!=null&&tracks[index].isPlaying();}
    public long lockCount(){return lockCount;}
    public boolean ticking(){return clockPlaying;}
    public int currentTrack(){return current;}
    @Override public void close(){
        if(closed)return;closed=true;stopClock();
        for(int i=0;i<3;i++){Music m=i==2?clock:tracks[i];if(m!=null){try{m.stop();}catch(RuntimeException e){warning.accept("Cannot stop question Music: "+e.getMessage());}try{m.dispose();}catch(RuntimeException e){warning.accept("Cannot dispose question Music: "+e.getMessage());}}}
        if(lock!=null){try{lock.stop();}catch(RuntimeException e){warning.accept("Cannot stop lock: "+e.getMessage());}try{lock.dispose();}catch(RuntimeException e){warning.accept("Cannot dispose lock: "+e.getMessage());}}
    }
}
