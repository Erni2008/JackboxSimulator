package com.erni.finalanswer.lobby;

import com.erni.finalanswer.ui.lobby.cages.*;

/** Graphics-free verification in the same executable-check style as the existing characters. */
public final class DraculaCheck {
    private static void check(boolean ok,String message) { if(!ok) throw new AssertionError(message); }
    private static void near(float a,float b,float tolerance) { check(Math.abs(a-b)<tolerance,"Expected "+a+", got "+b); }
    private static void same(DraculaAnimator a,DraculaAnimator b) {
        near(a.pose.hipX,b.pose.hipX,.002f);near(a.pose.hipY,b.pose.hipY,.002f);
        near(a.pose.headAngle,b.pose.headAngle,.002f);near(a.pose.rightArm,b.pose.rightArm,.002f);
        near(a.pose.leftArm,b.pose.leftArm,.002f);near(a.pose.capeAngle,b.pose.capeAngle,.002f);
        near(a.pose.capeFlutter,b.pose.capeFlutter,.002f);
    }
    public static void main(String[] args) {
        DraculaAnimator a=new DraculaAnimator(42),b=new DraculaAnimator(42);
        check(a.state()==DraculaAnimationState.DRACULA_APPEAR,"New occupant appears");
        check(a.pose.alpha==0&&a.pose.hipY < -3,"Dark arrival is lower and invisible");
        check(a.pose.capeReveal==.25f,"Cape begins cropped, not compressed");
        for(int frame=0;frame<7200;frame++) a.update(1f/60,.7f,false);
        for(int frame=0;frame<3600;frame++) b.update(1f/30,.7f,false);
        same(a,b);check(a.state()==DraculaAnimationState.DRACULA_IDLE,"Single transition to idle");
        a=new DraculaAnimator(19);b=new DraculaAnimator(19);
        a.update(2.9999f,.4f,false);b.update(3.0001f,.4f,false);
        same(a,b);near(a.pose.bodyScale,b.pose.bodyScale,.0001f);
        near(a.pose.alpha,b.pose.alpha,.0001f);near(a.pose.capeReveal,b.pose.capeReveal,.0001f);
        check(a.state()==DraculaAnimationState.DRACULA_APPEAR&&b.state()==DraculaAnimationState.DRACULA_IDLE,"Appearance boundary");
        float elapsed=a.elapsed();a.update(Float.NaN,0,false);a.update(-1,0,false);a.update(Float.POSITIVE_INFINITY,0,false);
        near(elapsed,a.elapsed(),.0001f);
        DraculaAnimator[] slots=new DraculaAnimator[8];for(int i=0;i<8;i++) { slots[i]=new DraculaAnimator(i+7);slots[i].update(0,i*2.39996f,false); }
        float difference=0;TwoBonePose leg=new TwoBonePose();
        for(int frame=0;frame<7200;frame++) for(int i=0;i<8;i++) {
            DraculaAnimator z=slots[i];float lastHead=z.pose.headAngle;z.update(1f/60,i*2.39996f,false);
            check(Float.isFinite(z.pose.headAngle),"Finite pose");
            check(Math.abs(z.pose.headAngle-lastHead)<1,"No neck snaps at frame "+frame+" slot "+i+" delta "+Math.abs(z.pose.headAngle-lastHead));
            check(z.pose.alpha>=0&&z.pose.alpha<=1,"Bounded opacity");
            check(z.pose.capeReveal>=.25f&&z.pose.capeReveal<=1,"Bounded reveal");
            check(z.pose.bodyScale>.997f&&z.pose.bodyScale<1.003f,"Subtle uniform breathing");
            if(z.state()==DraculaAnimationState.DRACULA_IDLE) {
                check(Math.abs(z.pose.hipY)<.63f,"Grounded body movement");
                check(Math.abs(z.pose.bodyAngle)<3.7f,"Controlled bow and sway");
                check(z.pose.alpha==1&&z.pose.capeReveal==1,"Appearance stays complete");
            }
            float y=33+z.pose.hipY;
            float l1=(float)Math.hypot(-115,580)*.0245f,l2=(float)Math.hypot(-30,720)*.0245f;
            leg.solve(z.pose.hipX-7,y,-12,3,l1,l2,-1);
            near(-12,leg.endX,.001f);near(3,leg.endY,.001f);
            float r1=(float)Math.hypot(-100,600)*.0245f,r2=(float)Math.hypot(30,690)*.0245f;
            leg.solve(z.pose.hipX+7,y,13,3,r1,r2,1);
            near(13,leg.endX,.001f);near(3,leg.endY,.001f);
            if(i==1) difference+=Math.abs(z.pose.headAngle-slots[0].pose.headAngle);
        }
        check(difference>1000,"Independent slot phases and schedules");
        elapsed=slots[1].elapsed();slots[0].update(1,0,false);near(elapsed,slots[1].elapsed(),.0001f);
        // Identical continuous phase still has different seeded theatrical schedules.
        a=new DraculaAnimator(1);b=new DraculaAnimator(2);difference=0;
        for(int i=0;i<7200;i++) {a.update(1f/60,0,false);b.update(1f/60,0,false);difference+=Math.abs(a.pose.headAngle-b.pose.headAngle);}
        check(difference>100,"Independent gesture scheduling");
        System.out.println("PASS: Dracula entrance, seamless idle, deterministic delta timing, eight independent schedules, bounded motion and planted feet");
    }
}
