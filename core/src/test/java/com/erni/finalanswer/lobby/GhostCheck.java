package com.erni.finalanswer.lobby;
import com.erni.finalanswer.ui.lobby.cages.GhostAnimator;
public final class GhostCheck {
    private static void check(boolean ok,String message) { if(!ok) throw new AssertionError(message); }
    private static void near(float a,float b) { check(Math.abs(a-b)<.002f,"Frame-rate discrepancy: "+a+" / "+b); }
    public static void main(String[] args) {
        GhostAnimator a=new GhostAnimator(),b=new GhostAnimator();
        for(int i=0;i<600;i++) a.update(1f/60,.4f,false);
        for(int i=0;i<300;i++) b.update(1f/30,.4f,false);
        near(a.pose.x,b.pose.x); near(a.pose.y,b.pose.y); near(a.pose.leftArm,b.pose.leftArm);
        float difference=0;
        for(int i=0;i<600;i++) { a.update(1f/60,.4f,false); difference+=Math.abs(a.pose.leftArm-a.pose.rightArm); }
        check(difference>500,"Asynchronous shoulders over a motion cycle");
        for(int i=0;i<3600;i++) { a.update(1f/60,.4f,false); check(Math.abs(a.pose.y)<2.36f,"Float amplitude"); check(a.pose.scaleX>.99f&&a.pose.scaleX<1.01f,"Subtle breathing"); }
        for(var state:new GhostAnimator.State[]{GhostAnimator.State.SCARED,GhostAnimator.State.HIT}) {
            float y=a.pose.y,arm=a.pose.leftArm; a.setState(state); a.update(0,.4f,false); near(y,a.pose.y);near(arm,a.pose.leftArm);
            for(int i=0;i<90;i++) a.update(1f/60,.4f,false);
            check(a.state()==GhostAnimator.State.IDLE,"Transient state returns to idle");
        }
        GhostAnimator[] slots = new GhostAnimator[8];
        for (int i=0;i<slots.length;i++) slots[i]=new GhostAnimator();
        for (int frame=0;frame<3600;frame++) for (int i=0;i<slots.length;i++) {
            slots[i].update(1f/60,i*2.39996f,false);
            check(slots[i].state()==GhostAnimator.State.IDLE,"Lobby remains continuously idle");
            check(slots[i].pose.eyeLight>=.9f && slots[i].pose.eyeLight<=1.28f,"Gentle eye illumination");
        }
        float otherY=slots[1].pose.y;
        slots[0].update(1,0,false);
        near(otherY,slots[1].pose.y);
        check(Math.abs(slots[0].pose.leftArm-slots[1].pose.leftArm)>.01f,"Independent slot phases");
        a.setState(GhostAnimator.State.SCARED); a.update(.13f,.4f,false);
        float interruptedX=a.pose.x,interruptedY=a.pose.y;
        a.setState(GhostAnimator.State.HIT); a.update(0,.4f,false);
        near(interruptedX,a.pose.x); near(interruptedY,a.pose.y);
        a.update(.1f,.4f,false);
        float y=a.pose.y; a.setState(GhostAnimator.State.DEATH); a.update(.2f,.4f,false); near(y,a.pose.y);
        check(a.pose.eyeLight>2,"Death brightens eyes");
        for(int i=0;i<160;i++) a.update(1f/60,.4f,false);
        check(a.finished()&&a.pose.bodyAlpha==0&&a.pose.tailAlpha==0&&a.pose.eyesAlpha==0,"Complete instance-only disappearance");
        a.setState(GhostAnimator.State.IDLE); for(int i=0;i<20;i++) a.update(1f/60,.4f,false);
        near(1,a.pose.bodyAlpha); a.update(Float.NaN,0,false); check(Float.isFinite(a.pose.y),"Ignore invalid delta");
        System.out.println("PASS: ghost timing, transitions, asymmetric motion, bounds, death and recovery");
    }
}
