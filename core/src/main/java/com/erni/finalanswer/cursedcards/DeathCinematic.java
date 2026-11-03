package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.*;

/**
 * Timeline of the DEATH reveal, independent of rendering: SILENCE → LAST CARD → REVEAL → ELIMINATION → RESULTS. It only
 * presents the result the rules already decided (the loser is passed in); it never touches game state. Durations and
 * sounds come from table.json ("death"). {@link #skip()} jumps to RESULTS once, stopping cinematic audio.
 */
public final class DeathCinematic implements Disposable {
    public enum Phase {SILENCE,LAST_CARD,REVEAL,ELIMINATION,RESULTS,DONE}
    /** Durations in seconds and sound files per event (existing files only; empty = hook only). */
    public static final class Config{
        public float silence=.5f,lastCard=1.5f,reveal=1f,elimination=2f,results=1f;
        public ObjectMap<String,String> sounds=new ObjectMap<>();
    }
    /** Audio events: suspense, cardMove, cardFlip, deathReveal, reaction, results, plus musicDuck(volume 0..1). */
    public interface SoundHook{void play(String event,float volume);default void musicDuck(float volume){}}
    /** Fired exactly once when the sequence reaches RESULTS (normally or by skipping): hand over to the result system. */
    public interface ResultListener{void results(int loser,int[] survivors);}

    public final Config config;public SoundHook sounds;public ResultListener onResults;
    private final ObjectMap<String,Sound> loaded=new ObjectMap<>();private final LongArray playing=new LongArray();private final Array<Sound> playingSounds=new Array<>();
    private Phase phase=Phase.DONE;private float age;private int loser=-1;private int[] survivors={};private boolean resultsFired,skipped;
    private final boolean[] entered=new boolean[Phase.values().length];

    public DeathCinematic(Config config){
        this.config=config;
        for(var e:config.sounds){if(e.value==null||e.value.isEmpty()||Gdx.audio==null)continue;var f=Gdx.files.internal(e.value);
            try{if(f.exists())loaded.put(e.key,Gdx.audio.newSound(f));else Gdx.app.error("CursedCards","death sound missing: "+e.value);}catch(RuntimeException x){Gdx.app.error("CursedCards","death sound unusable: "+e.value);}}
        sounds=(event,volume)->{Sound s=loaded.get(event);if(s!=null){long id=s.play(volume);playing.add(id);playingSounds.add(s);}};
    }
    public void start(int loser,int[] survivors){this.loser=loser;this.survivors=survivors.clone();phase=Phase.SILENCE;age=0;resultsFired=skipped=false;java.util.Arrays.fill(entered,false);playing.clear();playingSounds.clear();}
    public boolean active(){return phase!=Phase.DONE;}
    public boolean running(){return phase!=Phase.DONE&&phase!=Phase.RESULTS;}
    public Phase phase(){return phase;}
    /** 0..1 progress through the current phase. */
    public float progress(){return MathUtils.clamp(age/duration(phase),0,1);}
    public float age(){return age;}
    public int loser(){return loser;}
    public boolean skipped(){return skipped;}
    /** True on the first update of a phase (start its one-shot effects). */
    public boolean entered(Phase p){if(phase!=p||entered[p.ordinal()])return false;entered[p.ordinal()]=true;return true;}

    public void update(float dt){
        if(phase==Phase.DONE)return;age+=dt;
        if(age>=duration(phase)){age=0;phase=Phase.values()[phase.ordinal()+1];if(phase==Phase.DONE)return;}
        if(phase==Phase.RESULTS)fireResults();
    }
    /** Jump straight to RESULTS: stop cinematic audio; the presenter snaps visuals to their final state. Safe to call twice. */
    public void skip(){
        if(!running())return;skipped=true;
        for(int i=0;i<playing.size;i++)playingSounds.get(i).stop(playing.get(i));playing.clear();playingSounds.clear();
        if(sounds!=null)sounds.musicDuck(1);
        phase=Phase.RESULTS;age=0;for(int i=0;i<Phase.RESULTS.ordinal();i++)entered[i]=true;fireResults();
    }
    private void fireResults(){if(resultsFired)return;resultsFired=true;if(onResults!=null)onResults.results(loser,survivors);}
    public float duration(Phase p){return switch(p){case SILENCE->config.silence;case LAST_CARD->config.lastCard;case REVEAL->config.reveal;case ELIMINATION->config.elimination;case RESULTS->config.results;default->1;};}
    public void sound(String event,float volume){if(sounds!=null)sounds.play(event,volume);}
    public void cancel(){for(int i=0;i<playing.size;i++)playingSounds.get(i).stop(playing.get(i));playing.clear();playingSounds.clear();phase=Phase.DONE;}
    @Override public void dispose(){cancel();for(Sound s:loaded.values())s.dispose();loaded.clear();}
}
