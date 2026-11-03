package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Music;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.utils.*;

/**
 * One sound surface for the table: named one-shot events (pickup, place, exchange, pairBurn, …) mapped in table.json to
 * existing files, plus the looping ambient room bed, which other systems can duck (the DEATH cinematic). Unmapped events
 * are silent hooks, so the game's own audio system can take over by replacing {@link #hook}.
 */
public final class TableAudio implements Disposable {
    public static final class Config{public String ambient="";public float ambientVolume=.3f;public ObjectMap<String,String> sounds=new ObjectMap<>();}
    public interface Hook{void play(String event,float volume);}
    public Hook hook;
    private final ObjectMap<String,Sound> loaded=new ObjectMap<>();private Music ambient;private final float ambientVolume;private float duck=1,duckTarget=1;

    public TableAudio(Config config){
        ambientVolume=config.ambientVolume;
        if(Gdx.audio!=null){
            for(var e:config.sounds){if(e.value==null||e.value.isEmpty())continue;var f=Gdx.files.internal(e.value);
                try{if(f.exists())loaded.put(e.key,Gdx.audio.newSound(f));else Gdx.app.error("CursedCards","table sound missing: "+e.value);}catch(RuntimeException x){Gdx.app.error("CursedCards","table sound unusable: "+e.value);}}
            if(config.ambient!=null&&!config.ambient.isEmpty()&&Gdx.files.internal(config.ambient).exists()){
                try{ambient=Gdx.audio.newMusic(Gdx.files.internal(config.ambient));ambient.setLooping(true);ambient.setVolume(0);ambient.play();}catch(RuntimeException x){Gdx.app.error("CursedCards","ambient unusable: "+config.ambient);ambient=null;}}}
        hook=(event,volume)->{Sound s=loaded.get(event);if(s!=null)s.play(volume);};
    }
    public void play(String event,float volume){if(hook!=null)hook.play(event,volume);}
    /** 0..1 multiplier for the ambient bed (1 = normal). */
    public void duck(float volume){duckTarget=volume;}
    /** Fades the bed in at start and follows ducking smoothly. */
    public void update(float dt){if(ambient==null)return;duck+=(duckTarget-duck)*Math.min(1,dt*2.5f);float fadeIn=Math.min(1,time+=dt);ambient.setVolume(ambientVolume*duck*fadeIn);}
    private float time;
    @Override public void dispose(){for(Sound s:loaded.values())s.dispose();loaded.clear();if(ambient!=null){ambient.stop();ambient.dispose();ambient=null;}}
}
