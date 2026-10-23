package com.erni.finalanswer.cursedboxes;

import com.finalanswer.protocol.CursedEliminationTimeline;

public final class CursedEliminationCheck {
    private static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    public static void main(String[] args){
        for(int fps:new int[]{10,30,60,144})for(int mask:new int[]{0,1,0x15,0xff,0xffff}){
            var clock=new CursedEliminationTimeline();check(clock.state()==CursedEliminationTimeline.State.WAITING,"Initially waiting");
            check(clock.start(mask)&&!clock.start(0),"One authoritative start");check(clock.count()==Integer.bitCount(mask),"Exactly the supplied victims");
            for(int box=0;box<16;box++)check(clock.eligible(box)==((mask&(1<<box))!=0),"Unrelated boxes unchanged");
            float lastFall=0,lastSpirit=0;
            for(int i=0;i<fps*6;i++){
                check(clock.fall()>=lastFall&&clock.spirit()>=lastSpirit,"Continuous one-way transformation");
                lastFall=clock.fall();lastSpirit=clock.spirit();clock.update(1f/fps);
            }
            check(clock.state()==CursedEliminationTimeline.State.COMPLETED&&!clock.active(),"Completion at every frame rate");
            clock.seek(0);check(clock.state()==CursedEliminationTimeline.State.COMPLETED,"Stale snapshots cannot restart death");
            clock.reset();check(!clock.started()&&clock.mask()==0,"Reset clears all ghosts");
        }
        var restore=new CursedEliminationTimeline();restore.start(3);restore.seek(20);restore.update(Float.NaN);restore.update(-1);restore.update(Float.POSITIVE_INFINITY);
        check(restore.spirit()==1&&restore.state()==CursedEliminationTimeline.State.COMPLETED,"Late join immediately restores persistent ghost pose");
        var empty=new CursedEliminationTimeline();empty.start(0);check(empty.duration()==0&&empty.state()==CursedEliminationTimeline.State.COMPLETED,"No victims skips death");
        System.out.println("PASS: 0/1/3/8/16 simultaneous ghosts, deterministic 10/30/60/144 FPS, one-shot start, restore, persistence and reset");
    }
}
