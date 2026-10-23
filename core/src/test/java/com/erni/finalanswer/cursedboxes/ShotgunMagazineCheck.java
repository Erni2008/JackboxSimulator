package com.erni.finalanswer.cursedboxes;

import com.erni.finalanswer.shotgun.*;
import java.util.*;

public final class ShotgunMagazineCheck {
    private static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    public static void main(String[] args){
        for(int fps:new int[]{10,30,60,144})for(int shots:new int[]{1,2,5,6,7,8,9,10,14}){
            ShotgunConfig c=ShotgunConfig.parse("{}");c.startLoaded=false;
            ShotgunAnimator a=new ShotgunAnimator(c);ShotgunMagazine m=new ShotgunMagazine(a);m.reset();
            List<Integer> batches=new ArrayList<>();int fired=0;long seenReload=0;
            for(int frame=0;frame<fps*100&&fired<shots;frame++){
                a.update(1f/fps);m.update(shots-fired);
                if(a.reloadSerial()!=seenReload){seenReload=a.reloadSerial();batches.add(a.reloadRounds());}
                if(m.canFire()&&!a.isAnimating()&&a.chamber()==ShotgunAnimator.Chamber.LIVE){check(a.fire(),"Live fire");m.fired();fired++;}
                if(!a.isAnimating()&&a.chamber()==ShotgunAnimator.Chamber.SPENT)check(a.playPumpAnimation(),"Cycle once");
                check(m.rounds()>=0&&m.rounds()<=5,"Bounded capacity");
            }
            check(fired==shots,"All planned shots at "+fps+" FPS / "+shots);
            List<Integer> expected=new ArrayList<>();expected.add(5);for(int left=shots-5;left>0;left-=5)expected.add(Math.min(5,left));
            check(batches.equals(expected),"Exact batch plan "+batches+" expected "+expected);
            a.update(3);m.update(0);if(a.chamber()==ShotgunAnimator.Chamber.SPENT){a.playPumpAnimation();a.update(3);m.update(0);}
            check(!m.loading(),"No loading after final shot");
            a.resetShotgun();m.reset();check(!m.canFire(),"Reset blocks fire before introduction");m.update(shots);check(m.loadingTarget()==5,"Reset repeats five-round introduction");
        }
        for(int fps:new int[]{10,30,60,144}){
            ShotgunAnimator marked=new ShotgunAnimator(new ShotgunConfig());List<ShotgunAnimator.Event> trace=new ArrayList<>();
            marked.listener((event,sequence)->{trace.add(event);if(event==ShotgunAnimator.Event.RELOAD_CLOSING)check(marked.insertionCount()==5,"Rack begins after all five contacts");});
            marked.playReloadAnimation(5);for(int i=0;i<fps*8;i++)marked.update(1f/fps);
            check(Collections.frequency(trace,ShotgunAnimator.Event.ROUND_INSERTED)==5&&Collections.frequency(trace,ShotgunAnimator.Event.RELOAD_CLOSING)==1,"One contact per round, one rack at "+fps+" FPS");
            check(trace.indexOf(ShotgunAnimator.Event.RELOAD_CLOSING)>trace.lastIndexOf(ShotgunAnimator.Event.ROUND_INSERTED)&&trace.getLast()==ShotgunAnimator.Event.RELOADED,"Contacts -> rack -> live chamber");
        }
        ShotgunConfig heldConfig=ShotgunConfig.parse("{}");ShotgunAnimator heldAnimator=new ShotgunAnimator(heldConfig);ShotgunMagazine held=new ShotgunMagazine(heldAnimator);held.reset();
        for(int i=0;i<200;i++){heldAnimator.update(.1f);held.update(9,false);}check(held.loadingTarget()==0&&heldAnimator.reloadSerial()==0,"No loading on table or during pickup");
        held.update(9,true);check(held.loadingTarget()==5,"Raised weapon begins five-shell batch");
        heldAnimator.update(10);held.update(9,false);check(held.rounds()==5,"Active batch completes even if pose gate closes");
        ShotgunConfig c=ShotgunConfig.parse("{}");ShotgunAnimator a=new ShotgunAnimator(c);
        check(a.playReloadAnimation(5),"Five shell animation starts");check(!a.playReloadAnimation(1),"Cannot overlap reloads");
        a.update(c.reloadDuration*.26f);check(a.insertionCount()==0,"Movement precedes insertion contact");a.update(c.reloadDuration*.35f);check(a.insertionCount()==1,"First completed insertion boundary");
        a.update(100);check(a.insertionCount()==5&&!a.isAnimating(),"Low FPS crosses all five markers");
        ShotgunMagazine m=new ShotgunMagazine(a);a.resetShotgun();m.restore(3,6);check(m.rounds()==2&&m.canFire(),"Restore does not replay introduction");
        a.resetShotgun();m.restore(5,3);m.update(3);check(m.loadingTarget()==3,"Restore reloads remaining three");
        m.reset();m.update(9);a.update(.9f);m.reset();check(!a.isAnimating()&&!m.loading()&&!m.canFire(),"Reset interrupts a partial batch");m.update(9);check(m.loadingTarget()==5,"Interrupted introduction can restart");
        System.out.println("PASS: five-round introduction; exact refill batches for 1/2/5/6/7/8/9/10/14 shots at 10/30/60/144 FPS; cycles, no final refill, reset, restore and insertion markers");
    }
}
