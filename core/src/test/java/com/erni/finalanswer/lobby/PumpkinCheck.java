package com.erni.finalanswer.lobby;

import com.erni.finalanswer.ui.lobby.cages.*;

/** Graphics-free state/gesture continuity and grounded-leg checks. */
public final class PumpkinCheck {
    private static void check(boolean ok,String message) {if(!ok) throw new AssertionError(message);}
    private static void near(float a,float b,float tolerance) {check(Math.abs(a-b)<tolerance,"Expected "+a+", got "+b);}
    private static void same(PumpkinAnimator a,PumpkinAnimator b) {
        near(a.pose.hipX,b.pose.hipX,.002f);near(a.pose.hipY,b.pose.hipY,.002f);near(a.pose.bodyAngle,b.pose.bodyAngle,.002f);
        near(a.pose.headAngle,b.pose.headAngle,.002f);near(a.pose.leftArm,b.pose.leftArm,.002f);near(a.pose.rightArm,b.pose.rightArm,.002f);
        near(a.pose.eyes,b.pose.eyes,.002f);near(a.pose.mouth,b.pose.mouth,.002f);near(a.pose.stemAngle,b.pose.stemAngle,.002f);
    }
    public static void main(String[] args) {
        PumpkinAnimator a=new PumpkinAnimator(42),b=new PumpkinAnimator(42);
        check(a.state()==PumpkinAnimationState.PUMPKIN_APPEAR&&a.pose.alpha==0,"Invisible fresh entrance");
        check(a.pose.eyes==0&&a.pose.mouth==0,"Dim before ignition");
        for(int i=0;i<7200;i++) a.update(1f/60,.7f,false);
        for(int i=0;i<3600;i++) b.update(1f/30,.7f,false);
        same(a,b);check(a.gestureCount()==b.gestureCount(),"Frame-rate-independent random event sampling");
        check(a.state()==PumpkinAnimationState.PUMPKIN_IDLE,"One-way transition to idle");
        a=new PumpkinAnimator(42);b=new PumpkinAnimator(42);a.update(3.4999f,.7f,false);b.update(3.5001f,.7f,false);same(a,b);
        near(a.pose.alpha,b.pose.alpha,.00001f);near(a.pose.headScale,b.pose.headScale,.00001f);
        float elapsed=a.elapsed();a.update(Float.NaN,0,false);a.update(-1,0,false);a.update(Float.POSITIVE_INFINITY,0,false);near(elapsed,a.elapsed(),.00001f);
        PumpkinAnimator[] slots=new PumpkinAnimator[8];for(int i=0;i<8;i++) {slots[i]=new PumpkinAnimator(i+1);slots[i].update(0,i*2.39996f,false);}
        TwoBonePose leg=new TwoBonePose();float diversity=0;
        for(int frame=0;frame<7200;frame++) for(int i=0;i<8;i++) {
            PumpkinAnimator z=slots[i];float previous=z.pose.headAngle,next=z.nextGestureAt();int count=z.gestureCount();
            z.update(1f/60,i*2.39996f,false);
            check(Float.isFinite(z.pose.headAngle)&&Math.abs(z.pose.headAngle-previous)<4.5f,"No sudden pose jumps");
            check(z.pose.alpha>=0&&z.pose.alpha<=1,"Valid opacity");check(z.pose.eyes>=0&&z.pose.eyes<1.8f,"Bounded flame");
            check(z.pose.headScale>=1&&z.pose.headScale<1.026f,"Controlled scare scale");
            if(count!=z.gestureCount()) {
                float gap=z.nextGestureAt()-next;check(gap>=5.999f&&gap<=12.001f,"Gesture interval 6–12 seconds");
            }
            if(z.state()==PumpkinAnimationState.PUMPKIN_IDLE) {check(z.pose.alpha==1,"Never replay materialization");check(Math.abs(z.pose.hipY)<.6f,"Grounded weight shift");}
            float hip=36+z.pose.hipY;
            leg.solve(z.pose.hipX-8,hip,-15,8,(float)Math.hypot(150,580)*.033f,(float)Math.hypot(150,290)*.033f,1);
            near(-15,leg.endX,.001f);near(8,leg.endY,.001f);
            leg.solve(z.pose.hipX+8,hip,15,8,(float)Math.hypot(250,550)*.033f,(float)Math.hypot(110,315)*.033f,-1);
            near(15,leg.endX,.001f);near(8,leg.endY,.001f);
            if(i==1) diversity+=Math.abs(z.pose.headAngle-slots[0].pose.headAngle);
        }
        check(diversity>1000,"Distinct phases and independent gestures");
        float otherTime=slots[1].elapsed();slots[0].update(2,0,false);near(otherTime,slots[1].elapsed(),.00001f);
        a=new PumpkinAnimator(1);b=new PumpkinAnimator(2);diversity=0;
        for(int i=0;i<7200;i++) {a.update(1f/60,0,false);b.update(1f/60,0,false);diversity+=Math.abs(a.pose.headAngle-b.pose.headAngle);}
        check(diversity>100,"Independent seeds even with identical phase");
        System.out.println("PASS: Pumpkin seven-beat appearance, seamless idle, 6–12s gestures, eight independent instances, bounded flame and planted feet");
    }
}
