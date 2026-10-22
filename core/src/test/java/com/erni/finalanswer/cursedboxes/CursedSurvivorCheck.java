package com.erni.finalanswer.cursedboxes;

import com.finalanswer.protocol.CursedSurvivorTimeline;

/** Pure clock regression: eligibility, ordering, opacity endpoints, retries and frame independence. */
public final class CursedSurvivorCheck {
    private static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    public static void main(String[] args){
        for(int count:new int[]{0,1,3,5,8}){
            int mask=0;for(int i=0;i<count;i++)mask|=1<<(i*2);
            var clock=new CursedSurvivorTimeline();check(clock.state()==CursedSurvivorTimeline.State.WAITING,"Initially waiting");
            check(clock.start(mask)&&!clock.start(0),"Exactly once");
            check(clock.count()==count,"Survivor count");
            if(count==0)check(clock.state()==CursedSurvivorTimeline.State.COMPLETED,"Zero survivors complete immediately");
            for(int i=0;i<count;i++){
                int box=i*2;clock.seek(i*clock.timings.period());check(clock.currentBox()==box,"Sequential survivor");
                check(clock.panelOpacity(box)>.999f&&clock.characterOpacity(box)==0,"Hidden during anticipation");
                float fade=i*clock.timings.period()+clock.timings.anticipation+clock.timings.smoke;
                clock.seek(fade+clock.timings.panel*.5f);check(Math.abs(clock.panelOpacity(box)-.5f)<.001f,"Half panel");
                for(int b=1;b<16;b+=2)check(clock.panelOpacity(b)==1&&clock.characterOpacity(b)==0,"Unrelated/empty/eliminated untouched");
                if(i+1<count)check(clock.panelOpacity((i+1)*2)==1,"Next box stays opaque");
                clock.seek(fade+clock.timings.panel);check(clock.panelOpacity(box)==0&&clock.characterOpacity(box)>.999f,"Permanent reveal");
            }
            clock.seek(clock.duration()+120);check(clock.state()==CursedSurvivorTimeline.State.COMPLETED,"Completion");
            for(int b=0;b<16;b++)if(clock.eligible(b))check(clock.panelOpacity(b)==0&&clock.characterOpacity(b)==1,"Survivor persists");
            clock.reset();check(clock.state()==CursedSurvivorTimeline.State.WAITING&&clock.mask()==0,"Clean reset");
        }
        var a=new CursedSurvivorTimeline();var b=new CursedSurvivorTimeline();a.start(0x8421);b.start(0x8421);
        for(int i=0;i<120;i++)a.update(1f/60);for(int i=0;i<60;i++)b.update(1f/30);
        check(Math.abs(a.panelOpacity(0)-b.panelOpacity(0))<.0001,"Delta independent");
        float age=a.age();a.update(Float.NaN);a.update(-1);a.seek(-5);check(a.age()==age,"Invalid deltas and stale clock ignored");
        var t=new CursedSurvivorTimeline.Timings();t.panel=0;try{new CursedSurvivorTimeline(t);throw new AssertionError("Bad config accepted");}catch(IllegalArgumentException expected){}
        var profile=new CursedSurvivorAssets.Profile();profile.pivots=new float[16];java.util.Arrays.fill(profile.pivots,.5f);
        var rig=new CursedSpriteSkeleton(profile,1,1);var torso=rig.bones[0];var head=rig.bones[1];
        head.x=.1f;torso.rotation=90;torso.opacity=.5f;head.opacity=.5f;rig.update();
        check(Math.abs(head.world.m02-.5f)<.0001&&Math.abs(head.world.m12-.6f)<.0001,"Head inherits torso pivot/rotation");
        check(head.worldOpacity==.25f,"Inherited opacity");
        torso.scaleX=2;rig.update();check(Math.abs(head.world.m12-.7f)<.0001,"Inherited nonuniform scale");
        float pos=head.world.m12;for(int i=0;i<100;i++)rig.update();check(head.world.m12==pos,"No transform accumulation");
        System.out.println("PASS: survivor-only eligibility, sequential 0/1/3/5/8 reveals, alpha endpoints, persistence, one-shot start, reset, frame independence and invalid clocks");
    }
}
