package com.erni.finalanswer.elevator;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.audio.AudioMix;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

/**
 * Audio hook points for the elevator cues. Every cue maps to a file in {@link ElevatorGeometry#sounds}; files that do
 * not exist yet are simply skipped (no invented placeholder audio), so dropping the real WAVs in makes them play with
 * no code change. The motor hum loops between {@code motor_loop} and {@code motor_loop_stop}. All sounds are loaded
 * up front, never during a ride.
 */
public final class ElevatorSounds implements Consumer<String>,Disposable {
    private final Map<String,Sound> sounds=new HashMap<>();
    private long loopId=-1;private Sound loop;
    public final java.util.Set<String> missing=new java.util.TreeSet<>();

    public ElevatorSounds(ElevatorGeometry g){
        if(Gdx.audio==null)return;
        Map<String,Sound> byPath=new HashMap<>();
        for(var e:ElevatorAssets.realSounds(g).entrySet()){
            var f=Gdx.files.internal(e.getValue());
            if(!f.exists()){missing.add(e.getKey());continue;}
            try{sounds.put(e.getKey(),byPath.computeIfAbsent(e.getValue(),p->Gdx.audio.newSound(f)));}catch(RuntimeException ex){missing.add(e.getKey());}
        }
    }
    @Override public void accept(String cue){
        float v=AudioMix.GLOBAL.gain(AudioMix.Category.SFX);
        switch(cue){
            case ElevatorController.CUE_MOTOR_LOOP->{Sound s=sounds.get(cue);if(s!=null&&loop==null){loop=s;loopId=s.loop(.55f*v);}}
            case ElevatorController.CUE_MOTOR_LOOP_STOP->{if(loop!=null){loop.stop(loopId);loop=null;}}
            case ElevatorController.CUE_JOLT->{}                                       // visual only
            default->{Sound s=sounds.get(cue);if(s!=null)s.play(v);}
        }
    }
    @Override public void dispose(){if(loop!=null)loop.stop(loopId);for(Sound s:new java.util.HashSet<>(sounds.values()))s.dispose();sounds.clear();}
}
