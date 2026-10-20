package com.erni.finalanswer.ui.lobby.cages;

import java.util.Random;

/** One instance per occupant. Scheduled randomness is sampled only at event boundaries. */
public final class ZombieAnimator {
    public static final float APPEAR_SECONDS = 2.2f;
    public static final float SWAY_SPEED = .8f, SWAY_DEGREES = 1.6f;
    public static final float TWITCH_MIN = 3f, TWITCH_MAX = 7f;
    public static final class Pose {
        public float hipX, hipY, bodyAngle, bodyScale = 1, headAngle, leftArm, rightArm;
        public float leftLift, rightLift, leftBalance, rightBalance;
    }
    public final Pose pose = new Pose();
    private final Random random;
    private ZombieAnimationState state = ZombieAnimationState.APPEAR;
    private double elapsed, nextHead, nextOther, headAt = -100, otherAt = -100;
    private float headKick, otherKick;
    private int event;
    public ZombieAnimator() { this(new Random().nextLong()); }
    public ZombieAnimator(long seed) {
        random = new Random(seed);
        nextHead = APPEAR_SECONDS + interval();
        nextOther = nextHead + 1.1 + random.nextDouble();
        update(0, 0, false);
    }
    public ZombieAnimationState state() { return state; }
    public float elapsed() { return (float)elapsed; }
    public float stateTime() { return (float)(state == ZombieAnimationState.APPEAR ? elapsed : elapsed-APPEAR_SECONDS); }
    private double interval() { return TWITCH_MIN + random.nextDouble()*(TWITCH_MAX-TWITCH_MIN); }
    public void update(float delta, float phase, boolean reducedMotion) {
        if (!Float.isFinite(delta) || delta < 0) return;
        elapsed += delta;
        state = elapsed < APPEAR_SECONDS ? ZombieAnimationState.APPEAR : ZombieAnimationState.IDLE;
        // Process in time order, preserving event choices even if a frame crosses several events.
        while (Math.min(nextHead,nextOther) <= elapsed) {
            if (nextHead <= nextOther) {
                headAt=nextHead; headKick=(random.nextBoolean()?1:-1)*(5+random.nextFloat()*4);
                nextHead += interval();
                if (Math.abs(nextHead-nextOther)<.85) nextHead=nextOther+.85;
            } else {
                otherAt=nextOther; event=random.nextInt(3); otherKick=random.nextBoolean()?1:-1;
                nextOther += 3+random.nextDouble()*5;
                if (Math.abs(nextOther-nextHead)<.85) nextOther=nextHead+.85;
            }
        }
        float strength=reducedMotion?.2f:1;
        float t=(float)(elapsed*(1+.018*Math.sin(phase))+phase);
        pose.hipX=sin(t*.57f)*.65f*strength;
        pose.hipY=sin(t*1.17f)*.55f*strength;
        pose.bodyAngle=-2+sin(t*SWAY_SPEED)*SWAY_DEGREES*strength;
        pose.bodyScale=1;
        pose.headAngle=4+sin(t*.7f-.55f)*3.4f*strength;
        pose.leftArm=-4+sin(t*1.1f+.3f)*4*strength;
        pose.rightArm=9+sin(t*.91f+1.4f)*5*strength;
        pose.leftLift=sin(t*.83f)*.35f*strength;
        pose.rightLift=(.5f+.5f*sin(t*.43f+2))*1.1f*strength;
        pose.leftBalance=sin(t*.6f)*.6f*strength;
        pose.rightBalance=sin(t*.6f+2)*.5f*strength;
        pose.headAngle += headKick*pulse((float)(elapsed-headAt),.065f,.13f,.5f)*strength;
        float kick=pulse((float)(elapsed-otherAt),.07f,.12f,.5f)*otherKick*strength;
        if(event==0) { pose.leftArm+=6*kick; pose.leftLift+=.7f*kick; }
        else if(event==1) { pose.rightArm+=7*kick; pose.rightLift+=kick; }
        else pose.bodyAngle+=1.8f*kick;
        if (state==ZombieAnimationState.APPEAR) appear((float)elapsed,strength);
    }
    private void appear(float t,float strength) {
        float rise=1-ease(t,0,.4f), wake=1-ease(t,.4f,.85f);
        float settle=1-ease(t,1.75f,APPEAR_SECONDS);
        float twitch=pulse(t-.85f,.045f,.085f,.32f)*settle*strength;
        float reach=ease(t,1.25f,1.62f)*settle;
        // Additive offsets vanish with zero velocity at 2.2s, matching the live idle pose.
        pose.hipY-=8*rise+1.5f*wake*settle;
        pose.bodyAngle-=6*wake*settle+2*reach;
        pose.bodyScale=1-.035f*rise+.012f*reach;
        pose.headAngle-=19*wake*settle;
        pose.headAngle+=8*twitch-4*reach;
        pose.bodyAngle-=1.5f*twitch;
        pose.leftArm-=4*rise+11*reach;
        pose.leftArm-=4*pulse(t-.92f,.06f,.1f,.3f)*strength;
        pose.rightArm+=3*rise+18*reach;
        pose.rightArm+=3*pulse(t-.88f,.05f,.1f,.3f)*strength;
        pose.leftLift+=1.1f*reach; pose.rightLift+=2*reach;
    }
    private static float sin(float x) { return (float)Math.sin(x); }
    private static float ease(float t,float start,float end) {
        float p=Math.max(0,Math.min(1,(t-start)/(end-start)));
        return p*p*p*(p*(p*6-15)+10);
    }
    private static float pulse(float t,float attack,float hold,float end) {
        return ease(t,0,attack)*(1-ease(t,hold,end));
    }
}
