package com.erni.finalanswer.lobby;

import com.erni.finalanswer.ui.lobby.cages.*;
import java.util.Set;

/** CPU checks for independent clocks, fixed-step lantern physics, attachment geometry and continuous posing. */
public final class PlagueDoctorCheck {
    private static void check(boolean ok,String message) {if(!ok) throw new AssertionError(message);}
    private static void near(float a,float b,float tolerance) {check(Math.abs(a-b)<tolerance,"Expected "+a+", got "+b);}
    private static void same(PlagueDoctorAnimator a,PlagueDoctorAnimator b) {
        near(a.pose.hipX,b.pose.hipX,.002f);near(a.pose.headAngle,b.pose.headAngle,.002f);
        near(a.pose.hatAngle,b.pose.hatAngle,.002f);near(a.pose.freeX,b.pose.freeX,.01f);near(a.pose.freeY,b.pose.freeY,.01f);
        near(a.pose.rightArm,b.pose.rightArm,.002f);near(a.pose.fire,b.pose.fire,.002f);
        near(a.pose.lanternAngle,b.pose.lanternAngle,.02f);
    }
    public static void main(String[] args) {
        check(PlagueDoctorAssets.SOURCE_PATHS.size()==9,"Exactly nine approved source images");
        check(Set.copyOf(PlagueDoctorAssets.SOURCE_PATHS).equals(Set.of("doktor1.png","doktor_body.png","left_hand_doktor.png","doktor4.png","doktor5.png","doktor6.png","doktor7.png","doktor8.png","doktor9.png")),"Explicit approved source allowlist");
        PlagueDoctorAnimator a=new PlagueDoctorAnimator(42),b=new PlagueDoctorAnimator(42),c=new PlagueDoctorAnimator(42);
        check(a.state()==PlagueDoctorAnimationState.PLAGUE_DOCTOR_APPEAR&&a.pose.alpha==0&&a.pose.light==0,"Dark, fresh arrival");
        a.update(.3f,.4f,false);check(a.pose.light>0&&a.pose.light<.13f&&a.pose.alpha==0,"First light precedes materialization");
        a=new PlagueDoctorAnimator(42);
        for(int i=0;i<7200;i++) a.update(1f/60,.4f,false);
        for(int i=0;i<3600;i++) b.update(1f/30,.4f,false);
        for(int i=0;i<14400;i++) c.update(1f/120,.4f,false);
        same(a,b);same(a,c);
        check(a.state()==PlagueDoctorAnimationState.PLAGUE_DOCTOR_IDLE,"One-way transition to idle");
        a=new PlagueDoctorAnimator(9);b=new PlagueDoctorAnimator(9);a.update(3.9999f,.4f,false);b.update(4.0001f,.4f,false);same(a,b);
        near(a.pose.alpha,b.pose.alpha,.0001f);near(a.pose.light,b.pose.light,.0001f);
        float time=a.elapsed();a.update(Float.NaN,0,false);a.update(Float.POSITIVE_INFINITY,0,false);a.update(-1,0,false);near(time,a.elapsed(),.0001f);
        PlagueDoctorAnimator[] slots=new PlagueDoctorAnimator[8];
        for(int i=0;i<8;i++) {slots[i]=new PlagueDoctorAnimator(i+10);slots[i].update(0,i*2.39996f,false);}
        float diversity=0,maxSwing=0;TwoBonePose leg=new TwoBonePose();
        for(int frame=0;frame<7200;frame++) for(int i=0;i<8;i++) {
            PlagueDoctorAnimator z=slots[i];float oldHead=z.pose.headAngle,oldLantern=z.pose.lanternAngle,oldArm=z.pose.freeY;
            z.update(1f/60,i*2.39996f,false);
            check(Float.isFinite(z.pose.lanternAngle)&&Math.abs(z.pose.lanternAngle)<=7.001f,"Stable damped lantern bounds");
            check(Math.abs(z.pose.lanternAngle-oldLantern)<1,"No lantern snaps");
            check(Math.abs(z.pose.headAngle-oldHead)<1,"No head snaps");
            check(Math.abs(z.pose.freeY-oldArm)<6,"Continuous hat adjustment");
            check(z.pose.alpha>=0&&z.pose.alpha<=1&&z.pose.fire>=0&&z.pose.fire<1.08f,"Safe opacity and fire intensity");
            if(z.state()==PlagueDoctorAnimationState.PLAGUE_DOCTOR_IDLE) {check(z.pose.alpha==1&&z.pose.light==1,"No repeated entrance");check(Math.abs(z.pose.hipY)<.24f,"Grounded breathing");}
            float hip=PlagueDoctorRig.HIP_HEIGHT+z.pose.hipY;
            leg.solve(z.pose.hipX-8,hip,-14,3,(float)Math.hypot(-70,580)*.03f,(float)Math.hypot(10,730)*.03f,-1);
            near(-14,leg.endX,.001f);near(3,leg.endY,.001f);
            leg.solve(z.pose.hipX+8,hip,14,3,(float)Math.hypot(80,575)*.03f,(float)Math.hypot(-20,730)*.03f,1);
            near(14,leg.endX,.001f);near(3,leg.endY,.001f);
            maxSwing=Math.max(maxSwing,Math.abs(z.pose.lanternAngle));
            if(i==1) diversity+=Math.abs(z.pose.headAngle-slots[0].pose.headAngle)+Math.abs(z.pose.fire-slots[0].pose.fire);
        }
        check(maxSwing>.2f,"Lantern reacts to support movement");check(diversity>1000,"Independent slot phases and flicker");
        time=slots[1].elapsed();float angle=slots[1].pose.lanternAngle;slots[0].update(1,0,false);near(time,slots[1].elapsed(),.0001f);near(angle,slots[1].pose.lanternAngle,.0001f);
        // At the authored brim contact, the intact free hand remains on the left, above the beak.
        a=new PlagueDoctorAnimator(42);a.update(2.9f,0,false);
        check(a.pose.hatAdjust>.99f&&a.pose.freeX < 0&&a.pose.freeY>60,"Correct free hand reaches hat brim");
        check(a.pose.rightArm<0,"Lantern hand does not perform the hat gesture");
        System.out.println("PASS: nine-source allowlist, four-second entrance, 30/60/120 FPS lantern physics, seamless idle, independent flicker/gestures, hat contact and grounded legs");
    }
}
