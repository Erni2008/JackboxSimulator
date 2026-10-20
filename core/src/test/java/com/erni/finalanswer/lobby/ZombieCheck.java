package com.erni.finalanswer.lobby;

import com.erni.finalanswer.ui.lobby.cages.*;

/** Executable checks follow CageCheck/GhostCheck without a graphics dependency. */
public final class ZombieCheck {
    private static void check(boolean ok,String message) { if(!ok) throw new AssertionError(message); }
    private static void near(float a,float b,float tolerance) { check(Math.abs(a-b)<tolerance,"Expected "+a+", got "+b); }
    private static void same(ZombieAnimator a,ZombieAnimator b,float tolerance) {
        near(a.pose.hipX,b.pose.hipX,tolerance); near(a.pose.hipY,b.pose.hipY,tolerance);
        near(a.pose.headAngle,b.pose.headAngle,tolerance); near(a.pose.bodyAngle,b.pose.bodyAngle,tolerance);
        near(a.pose.leftArm,b.pose.leftArm,tolerance); near(a.pose.rightArm,b.pose.rightArm,tolerance);
        near(a.pose.bodyScale,b.pose.bodyScale,tolerance);
    }
    public static void main(String[] args) {
        ZombieAnimator a=new ZombieAnimator(42),b=new ZombieAnimator(42);
        check(a.state()==ZombieAnimationState.APPEAR,"New occupant starts APPEAR");
        check(a.pose.hipY < -8,"Emergence starts crouched, not a fade");
        for(int i=0;i<3600;i++) a.update(1f/60,.4f,false);
        for(int i=0;i<1800;i++) b.update(1f/30,.4f,false);
        same(a,b,.002f);
        check(a.state()==ZombieAnimationState.IDLE,"APPEAR transitions once to IDLE");
        a=new ZombieAnimator(42); a.update(2.1999f,.4f,false);
        float head=a.pose.headAngle,arm=a.pose.rightArm,hip=a.pose.hipY,scale=a.pose.bodyScale;
        a.update(.0002f,.4f,false);
        check(a.state()==ZombieAnimationState.IDLE,"Boundary crossed");
        near(head,a.pose.headAngle,.002f); near(arm,a.pose.rightArm,.002f);
        near(hip,a.pose.hipY,.002f); near(scale,a.pose.bodyScale,.0001f);
        float elapsed=a.elapsed(); a.update(Float.NaN,0,false); a.update(-1,0,false); a.update(Float.POSITIVE_INFINITY,0,false);
        near(elapsed,a.elapsed(),.0001f);
        ZombieAnimator[] slots=new ZombieAnimator[8];
        for(int i=0;i<8;i++) slots[i]=new ZombieAnimator(i+19);
        float divergence=0;
        for(int frame=0;frame<60*120;frame++) {
            for(int i=0;i<8;i++) {
                ZombieAnimator z=slots[i]; z.update(1f/60,i*2.39996f,false);
                check(Float.isFinite(z.pose.headAngle),"Finite animation");
                check(Math.abs(z.pose.hipX)<.66f,"Small grounded weight shift");
                if(z.state()==ZombieAnimationState.IDLE) {
                    check(Math.abs(z.pose.hipY)<.56f,"No floating in idle");
                    check(z.pose.bodyScale==1,"Undistorted idle scale");
                    check(Math.abs(z.pose.bodyAngle)<5.5f,"Bounded torso shudder");
                    check(Math.abs(z.pose.headAngle)<17,"Bounded neck twitch");
                }
            }
            divergence+=Math.abs(slots[0].pose.headAngle-slots[1].pose.headAngle);
        }
        check(divergence>1000,"Independent phases and event schedules");
        elapsed=slots[1].elapsed(); slots[0].update(1,0,false); near(elapsed,slots[1].elapsed(),.0001f);
        ZombieAnimator normal=new ZombieAnimator(12),reduced=new ZombieAnimator(12);
        normal.update(20,.8f,false); reduced.update(20,.8f,true);
        check(Math.abs(reduced.pose.hipY)<=Math.abs(normal.pose.hipY)+.0001f,"Reduced motion");
        // Reuse the actual leg geometry and fixed targets: both feet remain reachable during the crouch.
        TwoBonePose leg=new TwoBonePose();
        float l1=(float)Math.hypot(85,575)*.036f,l2=(float)Math.hypot(-15,880)*.036f;
        a=new ZombieAnimator(99);
        for(int frame=0;frame<600;frame++) {
            a.update(1f/60,.4f,false);
            leg.solve(a.pose.hipX-8,55+a.pose.hipY+a.pose.leftBalance,-12,4,l1,l2,-1);
            near(-12,leg.endX,.001f); near(4,leg.endY,.001f);
            float r1=(float)Math.hypot(100,550)*.039f,r2=(float)Math.hypot(-240,830)*.039f;
            leg.solve(a.pose.hipX+8,55+a.pose.hipY+a.pose.rightBalance,13,4,r1,r2,1);
            near(13,leg.endX,.001f); near(4,leg.endY,.001f);
        }
        System.out.println("PASS: zombie appearance/idle continuity, frame independence, eight instances, scheduled twitches, planted feet and invalid delta");
    }
}
