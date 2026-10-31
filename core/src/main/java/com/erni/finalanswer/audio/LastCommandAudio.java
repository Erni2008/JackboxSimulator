package com.erni.finalanswer.audio;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.*;
import com.badlogic.gdx.utils.*;
import java.util.*;
import java.util.function.*;

/** Screen-owned, bounded SFX scope using the application's existing backend and SFX mix. */
public final class LastCommandAudio implements AutoCloseable {
    public enum Cue { BUTTON_PRESS,SMALL_BUTTON_CLICK,LEVER_MOVE,ROTARY_STEP,HATCH_OPEN,METAL_CREAK,METAL_CRACK,ANSWER_CORRECT,ANSWER_WRONG,VICTORY,CIRCUIT_ROTATE,CIRCUIT_FAILED,CIRCUIT_COMPLETE,MEMORY_NOTE_RED,MEMORY_NOTE_GREEN,MEMORY_NOTE_BLUE,MEMORY_NOTE_YELLOW,MACHINE_SHUTDOWN,QUESTION_TYPING,QUESTION_TYPING_ALT,CONFIRM,SYMBOL_WRONG,HATCH_CLOSE,SYMBOL_CLICK,SYMBOL_APPEAR,SCREEN_TRANSITION }
    private static final Cue[] CUES=Cue.values();
    private static final class Clip {Sound sound;Music music;String path;float gain;int priority,duration,throttle;long last=Long.MIN_VALUE/2,starts;}
    private static final class Voice {Clip clip;Cue cue;long id=-1,end;}
    private final Clip[] clips=new Clip[CUES.length];private final Voice[] voices=new Voice[8];
    private final LinkedHashSet<String> seen=new LinkedHashSet<>();private final AudioMix mix;private final LongSupplier clock;private final Consumer<String> warning;
    private boolean closed,paused,protectedTask;private float volume=1;private long preview;
    public LastCommandAudio(){this(PresentationAudio.GDX,AudioMix.GLOBAL,System::nanoTime,s->{if(Gdx.app!=null)Gdx.app.error("Last Command audio",s);},Gdx.files.internal("sounds/last_command/runtime/manifest.json").readString("UTF-8"),true);}
    /** The injectable clock is milliseconds, except the production nanoTime adapter. */
    public LastCommandAudio(PresentationAudio.Backend backend,AudioMix mix,LongSupplier clock,Consumer<String> warning,String manifest){this(backend,mix,clock,warning,manifest,false);}
    private LastCommandAudio(PresentationAudio.Backend backend,AudioMix mix,LongSupplier clock,Consumer<String> warning,String manifest,boolean nanos){
        this.mix=mix;this.clock=nanos?()->clock.getAsLong()/1_000_000:clock;this.warning=warning;for(int i=0;i<voices.length;i++)voices[i]=new Voice();
        for(JsonValue entry:new JsonReader().parse(manifest).get("cues")){
            if(entry.getBoolean("voice",false))continue;Cue cue=Cue.valueOf(entry.getString("id"));Clip clip=new Clip();clip.path="sounds/last_command/runtime/"+entry.getString("file");clip.gain=entry.getFloat("volume");clip.priority=entry.getInt("priority");clip.duration=entry.getInt("durationMs");clip.throttle=entry.getInt("throttleMs");
            try{if(entry.getBoolean("stream",false)){clip.music=backend.music(clip.path);if(clip.music!=null)clip.music.setLooping(false);}else clip.sound=backend.sound(clip.path);if(clip.music==null&&clip.sound==null)warning.accept("Missing sound: "+clip.path);else clips[cue.ordinal()]=clip;}catch(RuntimeException e){warning.accept("Cannot preload "+clip.path+": "+e.getMessage());}
        }
    }
    public void volume(float value){volume=AudioMix.unit(value);update();}public float volume(){return volume;}
    public boolean available(Cue cue){return clips[cue.ordinal()]!=null;}public long playCount(Cue cue){Clip c=clips[cue.ordinal()];return c==null?0:c.starts;}
    public void protectedTask(boolean value){protectedTask=value;if(value)for(Voice v:voices)if(v.id>=0&&v.clip.priority==0)stop(v);}
    private static boolean note(Cue cue){return cue.name().startsWith("MEMORY_NOTE_");}
    private void stop(Voice v){if(v.id>=0){try{v.clip.sound.stop(v.id);}catch(RuntimeException e){warning.accept(e.toString());}v.id=-1;}}
    public void stopNotes(){for(Voice v:voices)if(v.id>=0&&note(v.cue))stop(v);}
    public boolean play(Cue cue,String event){
        if(closed||paused)return false;Clip c=clips[cue.ordinal()];if(c==null||volume*mix.gain(AudioMix.Category.SFX)<=0||protectedTask&&c.priority==0)return false;
        String key=cue+":"+event;if(!seen.add(key))return false;while(seen.size()>512)seen.remove(seen.iterator().next());long now=clock.getAsLong();if(now-c.last<c.throttle)return false;update();
        try{
            if(c.music!=null){for(Voice v:voices)if(v.id>=0&&v.cue==Cue.ANSWER_CORRECT)stop(v);c.music.setVolume(volume*c.gain*mix.gain(AudioMix.Category.SFX));c.music.play();c.starts++;c.last=now;return true;}
            if(note(cue))stopNotes();Voice free=null,lowest=null,oldest=null;int same=0;
            for(Voice v:voices){if(v.id<0){if(free==null)free=v;continue;}if(v.cue==cue){same++;if(oldest==null||v.end<oldest.end)oldest=v;}if(v.clip.priority<c.priority&&(lowest==null||v.clip.priority<lowest.clip.priority))lowest=v;}
            if(same>=2)free=oldest;if(free==null)free=lowest;if(free==null)return false;stop(free);
            free.clip=c;free.cue=cue;free.end=now+c.duration;free.id=c.sound.play(volume*c.gain*mix.gain(AudioMix.Category.SFX),1,0);if(free.id<0)return false;c.starts++;c.last=now;update();return true;
        }catch(RuntimeException e){warning.accept("Cannot play "+c.path+": "+e.getMessage());return false;}
    }
    public void audition(Cue cue){play(cue,"audition-"+(++preview));}
    public void update(){if(closed)return;long now=clock.getAsLong();boolean important=false,memory=false;Clip victory=clips[Cue.VICTORY.ordinal()];boolean winning=victory!=null&&victory.music!=null&&victory.music.isPlaying();
        for(Voice v:voices)if(v.id>=0){if(now>=v.end)v.id=-1;else{important|=v.clip.priority>=3;memory|=note(v.cue);}}
        for(Voice v:voices)if(v.id>=0){float duck=winning&&v.clip.priority<4?.22f:memory&&!note(v.cue)?.3f:important&&v.clip.priority<3?.35f:1;try{v.clip.sound.setVolume(v.id,volume*v.clip.gain*duck*mix.gain(AudioMix.Category.SFX));}catch(RuntimeException e){warning.accept(e.toString());}}
        if(victory!=null&&victory.music!=null)victory.music.setVolume(volume*victory.gain*mix.gain(AudioMix.Category.SFX));
    }
    public void pause(boolean value){if(paused==value)return;paused=value;if(value)stopAll();}
    public void stopAll(){for(Voice v:voices)stop(v);for(Clip c:clips)if(c!=null&&c.music!=null)c.music.stop();}
    @Override public void close(){if(closed)return;stopAll();closed=true;for(Clip c:clips)if(c!=null){if(c.sound!=null)c.sound.dispose();if(c.music!=null)c.music.dispose();}seen.clear();}
}
