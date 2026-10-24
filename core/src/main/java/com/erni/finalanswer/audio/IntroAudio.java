package com.erni.finalanswer.audio;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.assets.AssetManager;
import com.badlogic.gdx.audio.*;
import com.erni.finalanswer.gameplay.intro.IntroDefinition;
import java.util.*;

/** Intro-scoped cache under GameAudio; shared master/category gains are never duplicated. */
public final class IntroAudio implements AutoCloseable {
    private final AssetManager assets=new AssetManager();
    private final IntroDefinition definition;
    private final HostVoiceManager host;
    private final AudioMix mix;
    private final Map<String,IntroDefinition.Cue> cues=new LinkedHashMap<>();
    private final Map<String,Long> instances=new HashMap<>();
    private final Set<String> started=new HashSet<>(),available=new HashSet<>();
    private final Set<String> stopped=new HashSet<>();
    private float duck=1;
    private boolean paused,closed,retiring;
    public boolean closed(){return closed;}
    public void restart(){if(closed)throw new IllegalStateException("Intro audio disposed");for(String id:started)stop(id);started.clear();stopped.clear();instances.clear();paused=retiring=false;duck=1;}
    /** Silence immediately; dispose only after queued asynchronous work finishes on later updates. */
    public void retire(){if(closed||retiring)return;for(String id:started)stop(id);retiring=true;}
    public IntroAudio(IntroDefinition definition,HostVoiceManager host,AudioMix mix){
        this.definition=definition;this.host=host;this.mix=mix;
        assets.setErrorListener((asset,error)->Gdx.app.error("Intro audio","Cannot load "+asset.fileName,error));
        for(var cue:definition.cues()){
            cues.put(cue.id(),cue);
            if(!Gdx.files.internal(cue.file()).exists()){Gdx.app.error("Intro audio","Missing optional "+cue.id()+": "+cue.file());continue;}
            if(available.add(cue.file())){if(music(cue))assets.load(cue.file(),Music.class);else assets.load(cue.file(),Sound.class);}
        }
        var missingVocal=new HashSet<String>();
        for(var scene:definition.scenes())for(var direction:scene.directions())
            if(!Gdx.files.internal(direction.file()).exists()&&missingVocal.add(direction.file()))Gdx.app.error("Intro audio","Missing approved vocal insert: "+direction.file());
    }
    private static boolean music(IntroDefinition.Cue cue){return cue.category().equals("MUSIC")||cue.id().equals("clock");}
    private float gain(IntroDefinition.Cue cue){return cue.gain()*(cue.category().equals("MUSIC")?definition.mix().music():definition.mix().sfx())*
        mix.gain(cue.category().equals("MUSIC")?AudioMix.Category.MUSIC:AudioMix.Category.SFX)*(cue.category().equals("MUSIC")?duck:1);}
    public boolean ready(){return !closed&&assets.getQueuedAssets()==0;}
    public void update(float dt){
        if(closed)return;assets.update();
        if(retiring){if(assets.getQueuedAssets()==0)close();return;}
        float target=host.playing()?.45f:1;duck+=(target-duck)*(1-(float)Math.exp(-Math.max(0,dt)/.12f));
        for(String id:started){var cue=cues.get(id);if(stopped.contains(id)||!available.contains(cue.file())||!assets.isLoaded(cue.file()))continue;
            try{if(music(cue))assets.get(cue.file(),Music.class).setVolume(gain(cue));else if(instances.containsKey(id))assets.get(cue.file(),Sound.class).setVolume(instances.get(id),gain(cue));}
            catch(RuntimeException error){Gdx.app.error("Intro audio","Audio device failure: "+id,error);}
        }
    }
    public void play(String id){
        var cue=cues.get(id);if(closed||retiring||paused||cue==null||!started.add(id)||!available.contains(cue.file())||!assets.isLoaded(cue.file()))return;
        try{if(music(cue)){Music track=assets.get(cue.file(),Music.class);track.setLooping(cue.until()>cue.at());track.setVolume(gain(cue));track.play();}
            else instances.put(id,assets.get(cue.file(),Sound.class).play(gain(cue)));}
        catch(RuntimeException error){Gdx.app.error("Intro audio","Cannot play "+id,error);}
    }
    public void stop(String id){
        stopped.add(id);
        var cue=cues.get(id);if(cue==null||!available.contains(cue.file())||!assets.isLoaded(cue.file()))return;
        try{if(music(cue))assets.get(cue.file(),Music.class).stop();else if(instances.containsKey(id))assets.get(cue.file(),Sound.class).stop(instances.remove(id));}
        catch(RuntimeException error){Gdx.app.error("Intro audio","Cannot stop "+id,error);}
    }
    public void pause(boolean value){
        if(paused==value)return;paused=value;
        for(String id:started){var cue=cues.get(id);if(stopped.contains(id)||!available.contains(cue.file())||!assets.isLoaded(cue.file()))continue;
            try{if(music(cue)){var track=assets.get(cue.file(),Music.class);if(value)track.pause();else track.play();}
                else if(instances.containsKey(id)){var sound=assets.get(cue.file(),Sound.class);if(value)sound.pause(instances.get(id));else sound.resume(instances.get(id));}}
            catch(RuntimeException error){Gdx.app.error("Intro audio","Cannot pause/resume "+id,error);}
        }
    }
    @Override public void close(){if(closed)return;for(String id:started)stop(id);closed=true;assets.dispose();}
}
