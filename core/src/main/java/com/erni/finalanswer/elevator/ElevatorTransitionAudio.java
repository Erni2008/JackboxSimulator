package com.erni.finalanswer.elevator;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.audio.AudioMix;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * Audio events of the elevator transition. Each event maps to a file in the config; existing project sounds are
 * reused where they fit, the rest are named hook points. Missing files are skipped silently and listed in
 * {@link #missing}. Everything is loaded up front — never during the sequence. One looping event at a time.
 */
public final class ElevatorTransitionAudio implements Disposable {
    private final Map<String,Sound> sounds=new HashMap<>();private final Map<String,ElevatorTransitionConfig.Sound> spec;
    public final Set<String> missing=new TreeSet<>(),played=new java.util.LinkedHashSet<>();
    private Sound loop;private long loopId=-1;private float loopBase=1,loopGain=1;
    private final Map<String,Long> lastPlay=new HashMap<>();

    public ElevatorTransitionAudio(ElevatorTransitionConfig config){
        spec=config.sounds;Map<String,Sound> byFile=new HashMap<>();
        for(var e:config.sounds.entrySet()){
            if(Gdx.audio==null||Gdx.files==null){missing.add(e.getKey());continue;}
            var f=Gdx.files.internal(e.getValue().file());
            if(!f.exists()){missing.add(e.getKey());continue;}
            try{sounds.put(e.getKey(),byFile.computeIfAbsent(e.getValue().file(),p->Gdx.audio.newSound(f)));}catch(RuntimeException ex){missing.add(e.getKey());}
        }
    }
    public void play(String event){
        played.add(event);var s=sounds.get(event);if(s==null)return;var cfg=spec.get(event);
        long now=System.nanoTime();Long prev=lastPlay.get(event);
        if(!cfg.loop()&&prev!=null&&now-prev<250_000_000L)return;                  // the same cue twice within 250 ms would only stack loudness
        lastPlay.put(event,now);
        float v=cfg.volume()*AudioMix.GLOBAL.gain(AudioMix.Category.SFX);
        if(cfg.loop()){stopLoop();loop=s;loopBase=v;loopId=s.loop(v*loopGain);}else s.play(v);
    }
    /** Motor/ambience gain (events duck or cut the movement loop); restored to 1 after every event. */
    public void setLoopGain(float g){g=Math.max(0,Math.min(1,g));if(g==loopGain)return;loopGain=g;if(loop!=null)loop.setVolume(loopId,loopBase*g);}
    public void stopLoop(){if(loop!=null){loop.stop(loopId);loop=null;loopId=-1;}}
    @Override public void dispose(){stopLoop();for(Sound s:new java.util.HashSet<>(sounds.values()))s.dispose();sounds.clear();}
}
