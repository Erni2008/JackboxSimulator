package com.erni.finalanswer.ui.lobby.cages;

import java.util.Random;

/** Occupant-local cinematic timeline. Only event boundaries sample randomness. */
public final class DraculaAnimator {
    public static final float APPEAR_SECONDS=3f;
    public static final float BREATH_SPEED=1.2f, BODY_SWAY=1.05f;
    public static final float GESTURE_MIN=6f, GESTURE_MAX=12f;
    public static final class Pose {
        public float hipX, hipY, bodyAngle, bodyScale=1, headAngle, headX;
        public float leftArm, rightArm, capeAngle, capeFlutter, capeReveal=1, alpha=1;
    }
    public final Pose pose=new Pose();
    private final Random random;
    private DraculaAnimationState state=DraculaAnimationState.DRACULA_APPEAR;
    private double elapsed, nextLook, nextGesture, lookAt=-100, gestureAt=-100;
    private float lookDirection, gestureDirection, gestureDuration=2.5f;
    private int gesture;
    private float motionTime, strength=1;
    public DraculaAnimator() { this(new Random().nextLong()); }
    public DraculaAnimator(long seed) {
        random=new Random(seed);
        nextLook=APPEAR_SECONDS+5+random.nextDouble()*4;
        nextGesture=APPEAR_SECONDS+GESTURE_MIN+random.nextDouble()*(GESTURE_MAX-GESTURE_MIN);
        update(0,0,false);
    }
    public DraculaAnimationState state() { return state; }
    public float elapsed() { return (float)elapsed; }
    public float motionTime() { return motionTime; }
    public float motionStrength() { return strength; }
    public void update(float delta,float phase,boolean reducedMotion) {
        if(!Float.isFinite(delta)||delta<0) return;
        elapsed+=delta;
        state=elapsed<APPEAR_SECONDS?DraculaAnimationState.DRACULA_APPEAR:DraculaAnimationState.DRACULA_IDLE;
        // Separate look and gesture channels reserve time for the complete return to idle.
        while(Math.min(nextLook,nextGesture)<=elapsed) {
            if(nextLook<=nextGesture) {
                lookAt=nextLook;lookDirection=random.nextBoolean()?1:-1;
                nextLook+=5+random.nextDouble()*4;
                if(nextGesture<lookAt+2.8) nextGesture=lookAt+2.8;
            } else {
                gestureAt=nextGesture;gesture=random.nextInt(5);
                gestureDirection=random.nextBoolean()?1:-1;
                gestureDuration=2.3f+random.nextFloat()*.7f;
                nextGesture+=GESTURE_MIN+random.nextDouble()*(GESTURE_MAX-GESTURE_MIN);
                if(nextLook<gestureAt+gestureDuration+.3) nextLook=gestureAt+gestureDuration+.3;
            }
        }
        strength=reducedMotion?.25f:1;
        motionTime=(float)(elapsed*(1+.015*Math.sin(phase))+phase);
        float t=motionTime, breath=sin(t*BREATH_SPEED);
        pose.hipX=sin(t*.39f)*.25f*strength;
        pose.hipY=breath*.22f*strength;
        pose.bodyAngle=sin(t*.58f)*BODY_SWAY*strength;
        pose.bodyScale=1+breath*.002f*strength;
        pose.headAngle=-2+sin(t*.65f-.4f)*2.3f*strength;
        pose.headX=0;
        pose.leftArm=-3+sin(t*.7f)*1.8f*strength;
        pose.rightArm=4+sin(t*.55f+1.2f)*2.3f*strength;
        pose.capeAngle=(sin(t*.8f)*.65f+sin(t*1.3f+1.5f)*.3f)*strength;
        pose.capeFlutter=0;pose.capeReveal=pose.alpha=1;
        float look=envelope((float)(elapsed-lookAt),.65f,1.2f,2.5f)*strength;
        pose.headAngle+=look*3*lookDirection;pose.headX+=look*.65f*lookDirection;
        float g=envelope((float)(elapsed-gestureAt),.7f,1.15f,gestureDuration)*strength;
        switch(gesture) {
            case 0 -> pose.headAngle+=g*4*gestureDirection;
            case 1 -> pose.leftArm-=g*64;
            case 2 -> { pose.rightArm+=g*68;pose.headAngle-=g; }
            case 3 -> { pose.bodyAngle-=g*2.6f;pose.headAngle-=g*2;pose.hipY-=g*.4f; }
            case 4 -> { pose.capeFlutter=g;pose.headAngle+=g*1.5f*gestureDirection; }
            default -> throw new AssertionError("Unknown Dracula gesture");
        }
        if(state==DraculaAnimationState.DRACULA_APPEAR) appear((float)elapsed);
    }
    private void appear(float t) {
        float settle=1-ease(t,2.5f,APPEAR_SECONDS);
        float hidden=1-ease(t,.5f,1.05f), bowed=1-ease(t,1.5f,2.0f);
        float unfold=ease(t,1,1.42f);
        float greet=ease(t,2,2.42f)*settle;
        pose.alpha=ease(t,.12f,1.0f);
        pose.hipY-=3.8f*hidden;
        pose.bodyAngle-=3.5f*bowed*settle+1.8f*greet;
        pose.headAngle-=11*bowed*settle;
        pose.headAngle+=1.1f*envelope(t-1.75f,.2f,.24f,.48f)*strength-2*greet;
        pose.leftArm+=6*hidden-28*unfold*settle;
        pose.rightArm-=5*hidden;
        pose.rightArm+=26*ease(t,1.09f,1.5f)*settle+58*greet;
        pose.capeReveal=.25f+.75f*unfold;
        pose.capeAngle-=1.7f*hidden;
        pose.capeFlutter=unfold*(1-ease(t,1.55f,2.25f))*.8f*strength;
    }
    private static float sin(float x) { return (float)Math.sin(x); }
    static float ease(float t,float start,float end) {
        float p=Math.max(0,Math.min(1,(t-start)/(end-start)));
        return p*p*p*(p*(p*6-15)+10);
    }
    private static float envelope(float t,float attack,float hold,float end) {
        return ease(t,0,attack)*(1-ease(t,hold,end));
    }
}
