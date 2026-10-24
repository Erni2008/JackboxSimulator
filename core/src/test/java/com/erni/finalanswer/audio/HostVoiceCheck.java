package com.erni.finalanswer.audio;

import com.badlogic.gdx.audio.Music;
import java.lang.reflect.Proxy;
import java.util.*;

public final class HostVoiceCheck {
    private static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    private static final class Device implements HostVoiceManager.Loader {
        boolean ready,fail,closed,active;
        int loads,unloads,plays,pauses,stops;
        float volume;
        Music.OnCompletionListener listener;
        final Music music=(Music)Proxy.newProxyInstance(Music.class.getClassLoader(),new Class[]{Music.class},(proxy,method,args)->{
            switch(method.getName()){
                case "play" -> {plays++;active=true;}
                case "pause" -> {pauses++;active=false;}
                case "stop" -> {stops++;active=false;}
                case "setVolume" -> volume=(float)args[0];
                case "setOnCompletionListener" -> listener=(Music.OnCompletionListener)args[0];
            }
            if(method.getName().equals("isPlaying"))return active;
            if(method.getReturnType()==boolean.class)return false;
            if(method.getReturnType()==float.class)return 0f;
            return null;
        });
        public void load(String path){loads++;}
        public boolean update(){if(fail){fail=false;throw new IllegalStateException("device failure");}return ready;}
        public Music music(String path){return music;}
        public void unload(String path){unloads++;}
        public void close(){closed=true;}
    }
    public static void main(String[] args){
        var manifest=new HostVoiceManager.Manifest();manifest.version=1;manifest.language="ru";
        var question=new HostVoiceManager.Entry();question.file="questions/solar.ogg";question.status="ready";
        var intro=new HostVoiceManager.Entry();intro.file="events/intro.ogg";intro.status="ready";
        var traversal=new HostVoiceManager.Entry();traversal.file="../private.ogg";traversal.status="ready";
        manifest.questions=Map.of("solar",question);manifest.events=Map.of("intro",intro,"unsafe",traversal);
        var device=new Device();var mix=new AudioMix();mix.master=.5f;mix.sfx=.5f;
        var warnings=new ArrayList<String>();var results=new ArrayList<HostVoiceManager.Result>();
        var voice=new HostVoiceManager(manifest,device,mix,warnings::add);
        voice.playQuestion("solar","q:1",results::add);voice.update();voice.update();
        check(device.loads==1&&device.plays==0,"Loading is deferred and asynchronous");
        voice.playQuestion("solar","q:1",results::add);check(device.loads==1&&results.isEmpty(),"Duplicate events are ignored");
        voice.stop();check(results.equals(List.of(HostVoiceManager.Result.CANCELLED)),"Cancellation completes exactly once");
        voice.playLine("intro","intro:1",results::add);device.ready=true;voice.update();voice.update();
        check(device.unloads==1&&device.loads==2&&device.plays==1,"Stale load cannot play; next clip starts");
        check(Math.abs(device.volume-.2f)<.0001f,"Narration respects master, SFX and local volume");
        voice.pause();voice.pause();check(device.pauses==1,"Pause is idempotent");voice.resume();voice.resume();check(device.plays==2,"Resume does not restart every frame");
        var staleCompletion=device.listener;voice.stop();voice.playLine("intro","intro:replacement",results::add);voice.update();voice.update();
        staleCompletion.onCompletion(device.music);check(voice.playing(),"A queued completion from stopped music cannot cancel its replacement");
        device.listener.onCompletion(device.music);check(results.getLast()==HostVoiceManager.Result.COMPLETED&&!voice.playing(),"Completion releases one clip and calls back");
        voice.playLine("missing","missing:1",results::add);voice.playLine("missing","missing:1",results::add);
        check(results.getLast()==HostVoiceManager.Result.MISSING&&warnings.size()==1,"Missing audio warns once and does not block");
        voice.playLine("unsafe","unsafe:1",results::add);check(results.getLast()==HostVoiceManager.Result.MISSING,"Manifest cannot escape asset root");
        voice.playLine("intro","intro:2",results::add);voice.update();device.fail=true;voice.update();
        check(results.getLast()==HostVoiceManager.Result.FAILED,"Device failure completes gracefully");
        voice.close();voice.close();check(device.closed,"Owned loader disposed safely");
        voice.playLine("intro","closed",results::add);check(results.getLast()==HostVoiceManager.Result.CANCELLED,"Disposed scenes cannot start narration");
        System.out.println("PASS: async narration, event deduplication, cancellation/stale loads, completion, pause, volume, missing files, unsafe paths, failure and disposal");
    }
}
