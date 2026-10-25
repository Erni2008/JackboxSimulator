package com.erni.finalanswer.impostor;

import com.badlogic.gdx.audio.Music;
import com.erni.finalanswer.audio.*;
import com.erni.finalanswer.gameplay.impostor.ImpostorPhase;
import java.lang.reflect.Proxy;
import java.util.*;

/** Real voice-manager callbacks with a deterministic audio device; no audio hardware required. */
public final class VotingNarrationCheck {
    private static void check(boolean condition,String message){if(!condition)throw new AssertionError(message);}
    private static final class Device implements HostVoiceManager.Loader {
        String lastPath;int starts;boolean playing;Music.OnCompletionListener completion;
        final Music music=(Music)Proxy.newProxyInstance(Music.class.getClassLoader(),new Class[]{Music.class},(proxy,method,args)->{
            switch(method.getName()){
                case "play" -> {starts++;playing=true;}
                case "stop" -> playing=false;
                case "setOnCompletionListener" -> completion=(Music.OnCompletionListener)args[0];
            }
            if(method.getName().equals("isPlaying"))return playing;
            if(method.getReturnType()==boolean.class)return false;
            if(method.getReturnType()==float.class)return 0f;
            return null;
        });
        public void load(String path){lastPath=path;}public boolean update(){return true;}public Music music(String path){return music;}
        public void unload(String path){}public void close(){}
        void finish(){playing=false;completion.onCompletion(music);}
    }
    private static FinalActSnapshot snapshot(ImpostorPhase phase,long start,long end,String outcome){
        return new FinalActSnapshot("test",phase,start,end,10000,2,4,"votes",List.of("a","b"),Map.of("a",1,"b",1),List.of("a","b"),"a",outcome);
    }
    public static void main(String[] args){
        var manifest=new HostVoiceManager.Manifest();manifest.version=1;manifest.language="ru";manifest.events=new HashMap<>();
        for(String id:List.of("intro_1","intro_2","tie","no_votes","first","second")){
            var entry=new HostVoiceManager.Entry();entry.file="events/impostor_vote_"+id+".ogg";entry.status="ready";entry.duration=.3f;manifest.events.put("impostor_vote_"+id,entry);
        }
        var device=new Device();var voice=new HostVoiceManager(manifest,device,new AudioMix(),ignored->{});var narration=new VotingNarration(voice);
        var intro=snapshot(ImpostorPhase.VOTING_LOCKED,9000,10000,"");
        narration.update(intro,9000);voice.update();voice.update();check(device.starts==1,"First recorded line starts");
        narration.update(intro,9300);check(device.starts==1,"No overlapping or replaced host line");device.finish();
        narration.update(intro,9400);voice.update();voice.update();check(device.starts==1,"Pause follows actual completion");
        narration.update(intro,9490);voice.update();voice.update();check(device.starts==2,"Next line follows completion, not a guessed timer");device.finish();
        var count=snapshot(ImpostorPhase.FINAL_VOTE_REVEAL,10000,14100,"");narration.update(count,10000);
        narration.update(count,11920);voice.update();voice.update();narration.update(count,12320);voice.update();voice.update();
        check(device.starts==2,"Vote stamping has SFX only, with no spoken first or second vote");
        var tie=snapshot(ImpostorPhase.SUSPECT_ANNOUNCEMENT,15000,19000,"NO_CONSENSUS");narration.update(tie,15000);voice.update();voice.update();check(device.starts==3,"Tie bank begins once");
        narration.update(tie,15300);device.finish();
        var identity=snapshot(ImpostorPhase.IMPOSTOR_REVEAL,19000,23000,"NO_CONSENSUS");narration.update(identity,19000);voice.update();voice.update();check(device.starts==3,"Single tie line is not repeated on identity");
        narration.reset();check(!voice.busy(),"Scene reset cancels owned voice and releases pending lines");
        narration.update(tie,18000);voice.update();voice.update();check(device.starts==3,"Late reconnect does not replay the old monologue");
        narration.reset();manifest.events.clear();narration.update(intro,9000);check(!voice.busy(),"Absent files do not block or synthesize speech");
        narration.reset();
        var generic=new HostVoiceManager.Entry();generic.file="events/address.ogg";generic.status="ready";generic.duration=.3f;
        var unavailable=new HostVoiceManager.Entry();unavailable.file="events/name.ogg";unavailable.status="missing";
        manifest.events.put("impostor_vote_reveal_intro",generic);manifest.events.put("impostor_vote_name_b",unavailable);
        var accused=new FinalActSnapshot("test",ImpostorPhase.SUSPECT_ANNOUNCEMENT,20000,25000,10000,2,4,"votes",List.of("b","b"),Map.of("b",2),List.of("b"),""," ");
        narration.update(accused,20000);voice.update();voice.update();
        check(device.lastPath.endsWith("events/address.ogg"),"The single approved reveal intro starts before the music phase");
        narration.reset();
        var epilogue=new HostVoiceManager.Entry();epilogue.file="events/caught.ogg";epilogue.status="ready";epilogue.duration=.3f;
        manifest.events.put("impostor_outcome_caught",epilogue);
        var caught=new FinalActSnapshot("music",ImpostorPhase.IMPOSTOR_REVEAL,30000,34000,20000,2,4,"votes",List.of("b","b"),Map.of("b",2),List.of("b"),"b","IMPOSTOR_CAUGHT");
        int before=device.starts;narration.update(caught,30000);narration.update(caught,37599);voice.update();voice.update();
        check(device.starts==before,"Narration leaves the whole role-reveal score unobstructed");
        narration.update(caught,37600);voice.update();voice.update();check(device.starts==before+1,"Outcome speech begins after the music tail");device.finish();
        narration.reset();manifest.events.put("impostor_round_1",generic);manifest.events.put("impostor_round_deadline",generic);
        before=device.starts;narration.round("round",ImpostorPhase.ROUND_CLUE_INPUT,1,40000,60000,40000);voice.update();voice.update();
        check(device.starts==before+1,"Round entry uses the same recorded voice queue");
        narration.round("round",ImpostorPhase.ROUND_CLUE_INPUT,1,40000,60000,40300);device.finish();
        narration.round("round",ImpostorPhase.ROUND_CLUE_INPUT,1,40000,60000,55000);voice.update();voice.update();
        check(device.starts==before+2,"A short deadline warning plays once when the voice bus is free");
        narration.round("round",ImpostorPhase.ROUND_CLUE_INPUT,1,40000,60000,55001);check(device.starts==before+2,"Duplicate snapshots do not repeat warnings");
        narration.reset();narration.round("round",ImpostorPhase.ROUND_CLUE_INPUT,1,40000,60000,49000);voice.update();voice.update();
        check(device.starts==before+2,"Late round reconnect does not restart instructions");
        narration.close();voice.close();System.out.println("PASS: recorded voting narration, completion-driven sequence, pauses, no overlap, tie continuity, restore, missing files and cleanup");
    }
}
