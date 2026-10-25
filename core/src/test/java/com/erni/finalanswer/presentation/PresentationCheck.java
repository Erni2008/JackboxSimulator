package com.erni.finalanswer.presentation;

import com.erni.finalanswer.audio.PresentationAudio;
import com.badlogic.gdx.audio.*;
import java.lang.reflect.Proxy;
import java.util.*;

/** Deterministic transitions/audio without a window or an audio device. */
public final class PresentationCheck {
    static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    static final class Device implements java.lang.reflect.InvocationHandler {
        int plays,stops,disposals;float volume;
        @Override public Object invoke(Object proxy,java.lang.reflect.Method method,Object[] args){
            switch(method.getName()){
                case "play" -> {plays++;return method.getReturnType()==long.class?1L:null;}
                case "stop" -> stops++;
                case "dispose" -> disposals++;
                case "setVolume" -> volume=((Number)args[args.length-1]).floatValue();
            }
            if(method.getReturnType()==boolean.class)return false;
            if(method.getReturnType()==float.class)return volume;
            return null;
        }
        <T>T proxy(Class<T> type){return type.cast(Proxy.newProxyInstance(type.getClassLoader(),new Class[]{type},this));}
    }
    public static void main(String[] args){
        var transition=new PhaseTransition();int n=0;
        for(var style:PhaseTransition.Style.values()){
            String key="phase-"+n++;var config=new PhaseTransition.Config(style,.5f,.2f);
            check(transition.enter(key,config,false),"Transition starts");transition.update(.25f,false,false);
            check(transition.active()&&transition.progress()==.5f,"Half duration");
            check(!transition.enter(key,config,false)&&transition.progress()==.5f,"Duplicate snapshot cannot restart");
            transition.update(5,true,false);check(transition.progress()==.5f,"Pause freezes transition");
            transition.update(Float.NaN,false,false);check(transition.progress()==.5f,"Invalid delta ignored");
            transition.update(.25f,false,false);check(!transition.active()&&transition.opacity()==0&&transition.scale()==1,"Completion restores scene");
        }
        var config=new PhaseTransition.Config(PhaseTransition.Style.DARKNESS,.5f,.18f);
        transition.enter("old",config,false);transition.update(.2f,false,false);transition.enter("new",config,false);check(transition.progress()==0,"Phase interruption cancels old timeline");
        transition.cancel();check(!transition.active(),"Explicit cancellation");
        check(!transition.enter("restored",config,true)&&transition.opacity()==0,"Reconnect skips obsolete animation");
        transition.enter("reduced",config,false);transition.update(0,false,true);check(!transition.active(),"Reduced motion restores scene immediately");
        transition.reset();check(transition.enter("reduced",config,false),"Replay starts fresh presentation");
        var missing=new PresentationAudio(new PresentationAudio.Backend(){public Sound sound(String path){return null;}public Music music(String path){throw new IllegalStateException("missing");}});
        missing.play(PresentationAudio.Cue.STAMP_IMPACT);missing.ambience("room");missing.update(1);check(missing.loadedCues()==0,"Missing files are silent");missing.close();missing.close();
        var sound=new Device();var room=new Device();var suspense=new Device();
        var clock=new Device();var writing=new Device();
        var audio=new PresentationAudio(new PresentationAudio.Backend(){public Sound sound(String path){return path.endsWith("stamp_impact.ogg")?sound.proxy(Sound.class):null;}public Music music(String path){return (path.equals(com.erni.finalanswer.audio.QuestionAudio.CLOCK)?clock:path.contains("writing_words")?writing:path.endsWith("/room.ogg")?room:suspense).proxy(Music.class);}});
        check(audio.loadedCues()==1,"One sound cached per cue");audio.volume(.4f);audio.play(PresentationAudio.Cue.STAMP_IMPACT);check(sound.plays==1,"Cue plays");
        audio.mute(true);audio.play(PresentationAudio.Cue.STAMP_IMPACT);check(sound.plays==1&&sound.stops==1,"Mute blocks cues and stops active effects");
        audio.mute(false);audio.ambience("room");audio.update(.6f);check(room.volume>0&&room.volume<.4f,"Ambience fades below SFX volume");
        audio.ambience("suspense");audio.update(.6f);check(room.volume>0&&suspense.volume>0,"Ambience crossfades");
        audio.update(.6f);check(room.stops>0,"Previous ambience stops");
        audio.muteAmbience(true);audio.update(0);check(suspense.volume==0,"Independent ambience mute");
        audio.timer("discussion:100",true);audio.timer("discussion:100",true);check(clock.plays==1,"One loop per timer");audio.timer("vote:200",true);check(clock.plays==2&&clock.stops==1,"Phase switch stops previous clock");audio.timer("vote:200",false);check(clock.stops==2,"Early completion stops clock");
        audio.writing(true);audio.update(.05f);audio.update(.05f);check(writing.plays==1,"Shared writing uses one voice across participants");audio.writing(false);audio.update(.2f);check(writing.stops==1,"Writing stops when activity expires");
        audio.pause(true);audio.play(PresentationAudio.Cue.STAMP_IMPACT);check(sound.plays==1,"Pause blocks effects");audio.pause(false);
        audio.volume(9);check(audio.volume()==1,"Volume clamped");audio.close();audio.close();check(sound.disposals==1&&room.disposals==1&&suspense.disposals==1&&clock.disposals==1&&writing.disposals==1,"Each resource disposed once");
        audio.play(PresentationAudio.Cue.STAMP_IMPACT);check(sound.plays==1,"Disposed scope cannot play");
        check(com.erni.finalanswer.impostor.ImpostorLayout.clockRotation(1000,1000,11000)==0,"Clock starts at twelve");
        check(com.erni.finalanswer.impostor.ImpostorLayout.clockRotation(6000,1000,11000)==-180,"Clock follows actual timer midpoint");
        check(com.erni.finalanswer.impostor.ImpostorLayout.clockRotation(12000,1000,11000)==-360,"Clock holds at completed deadline");
        var prepared=new java.util.HashMap<String,Device>();
        var layered=new PresentationAudio(new PresentationAudio.Backend(){public Sound sound(String path){if(path.endsWith("stamp_impact.ogg")||path.startsWith("sounds/impostor/")){var device=new Device();prepared.put(path,device);return device.proxy(Sound.class);}return null;}public Music music(String path){return null;}});
        for(var cue:new PresentationAudio.Cue[]{PresentationAudio.Cue.INTRODUCTION,PresentationAudio.Cue.PAGE_TURN,PresentationAudio.Cue.VOTING_START,PresentationAudio.Cue.VOTING_CLOSED,PresentationAudio.Cue.IMPOSTOR}){layered.play(cue);check(layered.playCount(cue)==1,"Prepared WAV mapped to event "+cue);}
        layered.play(PresentationAudio.Cue.STAMP_IMPACT);check(prepared.get("audio/impostor/stamp_impact.ogg").plays==1&&prepared.get("sounds/impostor/runtime/wooden_stumb_hit.wav").plays==1,"Working legacy effect preserved alongside new WAV");
        layered.close();for(var device:prepared.values())check(device.disposals==1,"Prepared WAV disposed once");
        var portrait=new com.badlogic.gdx.scenes.scene2d.Actor();portrait.setBounds(10,20,100,200);portrait.setScale(.5f);portrait.setRotation(5);
        var elimination=new com.erni.finalanswer.impostor.ImpostorElimination(portrait);elimination.apply(.6f,false,0);check(portrait.getColor().a<.3f,"Caught portrait slumps and fades");elimination.apply(3,false,0);check(Math.abs(portrait.getColor().a-.48f)<.001,"Ghost remnant remains visible");elimination.apply(-1,false,0);check(portrait.getScaleY()==.5f&&portrait.getRotation()==5&&portrait.getY()==20&&portrait.getColor().a==1,"Unrelated outcome/reset restores original pose");
        var verdict=new com.erni.finalanswer.impostor.FinalActSnapshot("match",com.erni.finalanswer.gameplay.impostor.ImpostorPhase.IMPOSTOR_REVEAL,1000,5000,0,3,3,"",java.util.List.of(),java.util.Map.of(),java.util.List.of(),"a","IMPOSTOR_CAUGHT");
        check(com.erni.finalanswer.impostor.ImpostorElimination.age(verdict,6799)<0&&com.erni.finalanswer.impostor.ImpostorElimination.age(verdict,6801)>0,"Elimination waits until identity is revealed");
        var escaped=new com.erni.finalanswer.impostor.FinalActSnapshot("match",verdict.phase(),1000,5000,0,3,3,"",java.util.List.of(),java.util.Map.of(),java.util.List.of(),"a","IMPOSTOR_ESCAPED");check(com.erni.finalanswer.impostor.ImpostorElimination.age(escaped,9000)<0,"Escaped impostor is never visually eliminated");
        System.out.println("PASS: transition completion/interruption/cancellation/pause/reconnect/reduced motion; audio cache/missing assets/mute/fades/crossfade/cleanup");
    }
}
