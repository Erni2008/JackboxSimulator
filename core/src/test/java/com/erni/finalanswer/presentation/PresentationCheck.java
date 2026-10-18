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
        var audio=new PresentationAudio(new PresentationAudio.Backend(){public Sound sound(String path){return path.endsWith("stamp_impact.ogg")?sound.proxy(Sound.class):null;}public Music music(String path){return (path.endsWith("/room.ogg")?room:suspense).proxy(Music.class);}});
        check(audio.loadedCues()==1,"One sound cached per cue");audio.volume(.4f);audio.play(PresentationAudio.Cue.STAMP_IMPACT);check(sound.plays==1,"Cue plays");
        audio.mute(true);audio.play(PresentationAudio.Cue.STAMP_IMPACT);check(sound.plays==1&&sound.stops==1,"Mute blocks cues and stops active effects");
        audio.mute(false);audio.ambience("room");audio.update(.6f);check(room.volume>0&&room.volume<.4f,"Ambience fades below SFX volume");
        audio.ambience("suspense");audio.update(.6f);check(room.volume>0&&suspense.volume>0,"Ambience crossfades");
        audio.update(.6f);check(room.stops>0,"Previous ambience stops");
        audio.muteAmbience(true);audio.update(0);check(suspense.volume==0,"Independent ambience mute");
        audio.pause(true);audio.play(PresentationAudio.Cue.STAMP_IMPACT);check(sound.plays==1,"Pause blocks effects");audio.pause(false);
        audio.volume(9);check(audio.volume()==1,"Volume clamped");audio.close();audio.close();check(sound.disposals==1&&room.disposals==1&&suspense.disposals==1,"Each resource disposed once");
        audio.play(PresentationAudio.Cue.STAMP_IMPACT);check(sound.plays==1,"Disposed scope cannot play");
        System.out.println("PASS: transition completion/interruption/cancellation/pause/reconnect/reduced motion; audio cache/missing assets/mute/fades/crossfade/cleanup");
    }
}
