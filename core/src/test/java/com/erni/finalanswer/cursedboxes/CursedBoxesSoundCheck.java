package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.audio.Sound;
import com.erni.finalanswer.shotgun.*;
import com.finalanswer.protocol.CursedSurvivorTimeline;
import java.lang.reflect.Proxy;
import java.util.*;
import static com.erni.finalanswer.cursedboxes.CursedBoxesSoundManager.Cue.*;

/** Backend-independent sound/event regression; no files or audio device needed. */
public final class CursedBoxesSoundCheck {
    private static void check(boolean condition,String message){if(!condition)throw new AssertionError(message);}
    private static final class Fake {
        int starts,loops,stops,disposals,active,maxActive;long next=1;float lastVolume;
        final Set<Long> looping=new HashSet<>();
        final Sound sound=(Sound)Proxy.newProxyInstance(Sound.class.getClassLoader(),new Class<?>[]{Sound.class},(proxy,method,args)->{
            switch(method.getName()){
                case "play":starts++;lastVolume=args==null?1:(float)args[0];return next++;
                case "loop":loops++;long id=next++;looping.add(id);active=looping.size();maxActive=Math.max(maxActive,active);return id;
                case "setVolume":lastVolume=(float)args[1];break;
                case "stop":stops++;if(args==null)looping.clear();else looping.remove((long)args[0]);active=looping.size();break;
                case "dispose":disposals++;break;
                default:break;
            }
            return null;
        });
    }
    private static final class Fixture {
        final Map<String,Fake> files=new HashMap<>();int loads;
        final CursedBoxesSoundManager audio=new CursedBoxesSoundManager(path->{loads++;Fake f=new Fake();files.put(path,f);return f.sound;});
        Fixture(){for(int i=0;i<CursedBoxesSoundManager.cueCount()+1;i++)audio.loadNext();check(loads==CursedBoxesSoundManager.cueCount()&&audio.loaded()==loads,"All original and additional resources preloaded once");}
        Fake cue(CursedBoxesSoundManager.Cue cue){return files.get(cue.path);}
    }
    public static void main(String[] args){
        Fixture f=new Fixture();var audio=f.audio;
        audio.weaponEvent(ShotgunAnimator.Event.FIRED,1);audio.weaponEvent(ShotgunAnimator.Event.FIRED,1);
        check(audio.playCount(SHOT)==1&&f.cue(SHOT).lastVolume==1,"One actual shot, independent gain");
        audio.weaponEvent(ShotgunAnimator.Event.CYCLE_STARTED,2);check(audio.playCount(MECHANISM)==1&&f.cue(MECHANISM).lastVolume==.75f,"Mechanism start");
        audio.weaponEvent(ShotgunAnimator.Event.EJECTED,3);check(audio.playCount(SHELL_DROP)==0,"Ejection is not a landing");
        audio.shellContact(1,false);audio.shellContact(1,true);audio.shellContact(1,true);audio.shellContact(2,true);
        check(audio.playCount(SHELL_DROP)==2&&f.cue(SHELL_DROP).lastVolume==.9f,"One landing per shell, repeated shots");
        audio.impact(1);audio.impact(1);audio.impact(2);check(audio.playCount(WOOD_BREAK)==2&&f.cue(WOOD_BREAK).lastVolume==.85f*audio.levels.destructionHeadroom,"One wood impact per salvo");
        check(audio.playCount(WOOD_EXTRA)==2&&f.cue(WOOD_EXTRA).lastVolume==.75f*audio.levels.destructionHeadroom,"Extra wood layer shares the same deduplicated impact event");
        check((audio.levels.wood+audio.levels.newWood)*audio.levels.destructionHeadroom<=1,"Layered bus has peak headroom");
        audio.levels.master=.5f;audio.weaponEvent(ShotgunAnimator.Event.FIRED,4);check(f.cue(SHOT).lastVolume==.5f,"Scene master gain");
        audio.muted(true);audio.weaponEvent(ShotgunAnimator.Event.FIRED,5);check(audio.playCount(SHOT)==2,"Mute consumes without replay");audio.muted(false);
        Fixture insert=new Fixture();var config=new ShotgunConfig();var animator=new ShotgunAnimator(config);animator.listener(insert.audio::weaponEvent);
        check(animator.playReloadAnimation(),"Existing insertion animation starts");insert.audio.weaponPose(animator);
        check(insert.audio.playCount(MECHANISM)==0&&insert.audio.playCount(INSERT_ROUND)==0,"No rack or insertion before contact");
        animator.update(config.reloadDuration*.26f);insert.audio.weaponPose(animator);insert.audio.weaponPose(animator);
        check(insert.audio.playCount(INSERT_ROUND)==0,"Shell movement is not insertion contact");
        animator.update(config.reloadDuration*.35f);check(insert.audio.playCount(INSERT_ROUND)==1&&insert.audio.playCount(MECHANISM)==1,"Insertion then mechanical close at timeline markers");
        animator.update(config.reloadDuration);insert.audio.weaponPose(animator);check(insert.audio.playCount(INSERT_ROUND)==1,"Reload completion is not another insertion");
        animator.chamber(ShotgunAnimator.Chamber.LIVE);insert.audio.weaponPose(animator);check(insert.audio.playCount(INSERT_ROUND)==1,"Automatic ammo refill stays silent");
        Fixture batch=new Fixture();var batchAnimator=new ShotgunAnimator(config);
        batchAnimator.listener(batch.audio::weaponEvent);
        check(batchAnimator.playReloadAnimation(5),"Batch insertion starts");batch.audio.weaponPose(batchAnimator);
        for(int frame=0;frame<400;frame++){batchAnimator.update(1f/60);batch.audio.weaponPose(batchAnimator);}
        check(batch.audio.playCount(INSERT_ROUND)==5&&batch.audio.playCount(MECHANISM)==1,"Five contacts then one mechanical close");
        batch.audio.weaponPose(batchAnimator);check(batch.audio.playCount(INSERT_ROUND)==5,"No duplicate insertion after loading");
        batch.audio.reset();batch.audio.weaponPose(batchAnimator);check(batch.audio.playCount(INSERT_ROUND)==5,"Reset at idle does not replay completed insertions");
        Fixture ghosts=new Fixture();var death=new com.finalanswer.protocol.CursedEliminationTimeline();death.start(3);
        for(int i=0;i<300;i++){death.update(1f/60);ghosts.audio.elimination(death,1f/60);ghosts.audio.elimination(death,1f/60);}
        check(ghosts.audio.playCount(HORROR_2)==1&&ghosts.audio.playCount(APPEARANCE_2)==0,"One death accent for simultaneous ghosts, never survivor appearance");
        ghosts.audio.reset();var lateDeath=new com.finalanswer.protocol.CursedEliminationTimeline();lateDeath.start(3);lateDeath.seek(5);ghosts.audio.elimination(lateDeath,.016f);check(ghosts.audio.playCount(HORROR_2)==1,"Late restoration skips historical death sound");ghosts.audio.dispose();
        Fixture r=new Fixture();var timeline=new CursedSurvivorTimeline();timeline.start(0x15);
        for(int i=0;i<620;i++){r.audio.reveal(timeline,1f/60);timeline.update(1f/60);}
        check(r.audio.playCount(REVEAL_START)==3&&r.audio.playCount(APPEARANCE_2)==3&&r.audio.playCount(REVEAL_COMPLETE)==0,"Ordered start/visible cues for each survivor");
        long appearances=r.audio.playCount(APPEARANCE_1)+r.audio.playCount(APPEARANCE_2)+r.audio.playCount(APPEARANCE_3)+r.audio.playCount(APPEARANCE_4);
        check(appearances==3&&r.audio.playCount(HORROR_1)+r.audio.playCount(HORROR_2)==0,"One regular appearance per actual survivor; actual count="+appearances+"; special horror="+(r.audio.playCount(HORROR_1)+r.audio.playCount(HORROR_2)));
        check(r.cue(HEARTBEAT).loops==3&&r.cue(HEARTBEAT).maxActive==1&&!r.audio.heartbeatActive(),"Single heartbeat loop with fade-out per survivor");
        for(int i=0;i<120;i++)r.audio.reveal(timeline,1f/60);check(r.audio.playCount(APPEARANCE_2)==3,"Snapshot refresh never repeats reveal");
        r.audio.reset();timeline.reset();timeline.start(1);r.audio.reveal(timeline,.016f);check(r.audio.heartbeatActive(),"Restartable heartbeat");
        r.audio.paused(true);check(!r.audio.heartbeatActive()&&r.cue(HEARTBEAT).active==0,"Pause stops loop immediately");
        r.audio.paused(false);r.audio.reset();timeline.reset();timeline.start(1);timeline.seek(2.3f);r.audio.reveal(timeline,.016f);
        check(r.audio.playCount(REVEAL_START)==3&&r.audio.playCount(APPEARANCE_2)==3&&r.audio.playCount(REVEAL_COMPLETE)==0,"Late host restore skips historical cues");
        timeline.reset();r.audio.reset();timeline.start(0);r.audio.reveal(timeline,.016f);check(!r.audio.heartbeatActive(),"Zero survivors are silent");
        int loads=r.loads;r.audio.warmup();check(r.loads==loads,"Warmup reuses Sound objects");
        r.audio.dispose();r.audio.dispose();r.audio.weaponEvent(ShotgunAnimator.Event.FIRED,100);
        for(Fake sound:r.files.values())check(sound.disposals==1&&sound.active==0,"Dispose once, no residual loop");
        var warnings=new ArrayList<String>();var optional=new CursedBoxesSoundManager(path->null,warnings::add);optional.loadNext();
        check(optional.loaded()==1&&optional.available()==0&&warnings.size()==1&&warnings.get(0).contains(SHOT.path),"Missing optional sound warns without aborting loading");optional.weaponEvent(ShotgunAnimator.Event.FIRED,1);optional.dispose();
        var failures=new ArrayList<String>();Sound broken=(Sound)Proxy.newProxyInstance(Sound.class.getClassLoader(),new Class<?>[]{Sound.class},(proxy,method,values)->{throw new IllegalStateException("Device lost during "+method.getName());});
        var unavailable=new CursedBoxesSoundManager(path->broken,failures::add);for(int i=0;i<8;i++)unavailable.loadNext();
        unavailable.warmup();unavailable.weaponEvent(ShotgunAnimator.Event.FIRED,1);var waiting=new CursedSurvivorTimeline();waiting.start(1);unavailable.reveal(waiting,.02f);unavailable.reset();unavailable.dispose();
        check(!failures.isEmpty()&&failures.size()<=8,"Optional device failures warn once per cue without crashing");
        var cinematic=new com.finalanswer.protocol.CursedBoxesCinematicConfig();cinematic.validate();check(cinematic.aimDuration(0,3)==.9f&&cinematic.aimDuration(1,3)==.6f&&cinematic.suspenseDuration(2,3)==.55f,"Centralized first/middle/last pacing");
        cinematic.selectionDuration=Float.NaN;try{cinematic.validate();throw new AssertionError("Invalid duration accepted");}catch(IllegalArgumentException expected){}
        Fixture variants=new Fixture();int previous=-1;
        for(int i=0;i<20;i++){
            var reveal=new CursedSurvivorTimeline();reveal.start(1);variants.audio.reset();variants.audio.reveal(reveal,.016f);
            check(variants.audio.lastAppearance()==previous,"Hidden character does not consume appearance variation");
            for(int frame=0;frame<130;frame++){reveal.update(.016f);variants.audio.reveal(reveal,.016f);}
            int next=variants.audio.lastAppearance();check(next==1&&variants.audio.playCount(APPEARANCE_2)==i+1&&variants.audio.playCount(APPEARANCE_1)+variants.audio.playCount(APPEARANCE_3)+variants.audio.playCount(APPEARANCE_4)==0,"Every survivor uses appearance2 exclusively");previous=next;
        }
        variants.audio.specialReveal(1);variants.audio.specialReveal(1);variants.audio.specialReveal(2);
        check(variants.audio.playCount(HORROR_1)+variants.audio.playCount(HORROR_2)==2,"Explicit special reveals deduplicated");variants.audio.dispose();
        audio.dispose();insert.audio.dispose();
        System.out.println("PASS: original eight plus seven cached WAVs, layered impact, fixed appearance2 survivor reveal, explicit special reveals, shot/impact/cycle/contact/insertion events, independent gain, reveal order, single heartbeat loop/fade, duplicate suppression, late join, reset/pause/mute/disposal");
    }
}
