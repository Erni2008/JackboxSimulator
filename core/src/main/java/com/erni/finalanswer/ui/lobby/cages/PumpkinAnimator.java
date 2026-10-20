package com.erni.finalanswer.ui.lobby.cages;

import java.util.Random;

/** One-shot seven-beat entrance and event-sampled, non-conflicting idle gestures per occupant. */
public final class PumpkinAnimator {
    public static final float APPEAR_SECONDS=3.5f, GESTURE_MIN=6, GESTURE_MAX=12;
    public static final float BREATH_SPEED=1.4f, HEAD_SWAY=3;
    public static final class Pose {
        public float hipX,hipY,bodyAngle,bodyScale=1,headAngle,headScale=1;
        public float leftArm=20,rightArm=-20,stemAngle;
        public float alpha=1,eyes=.85f,mouth=.85f;
    }
    public final Pose pose=new Pose();
    private final Random random;
    private double elapsed,nextGesture,gestureAt=-100;
    private float gestureDuration=2,gestureDirection=1,motionTime,strength=1;
    private int gesture,gestureCount;
    public PumpkinAnimator() {this(new Random().nextLong());}
    public PumpkinAnimator(long seed) {
        random=new Random(seed);nextGesture=APPEAR_SECONDS+GESTURE_MIN+random.nextDouble()*(GESTURE_MAX-GESTURE_MIN);update(0,0,false);
    }
    public PumpkinAnimationState state() {return elapsed<APPEAR_SECONDS?PumpkinAnimationState.PUMPKIN_APPEAR:PumpkinAnimationState.PUMPKIN_IDLE;}
    public float elapsed() {return (float)elapsed;}
    public float motionTime() {return motionTime;}
    public float motionStrength() {return strength;}
    public int gestureCount() {return gestureCount;}
    public float nextGestureAt() {return (float)nextGesture;}
    public void update(float delta,float phase,boolean reducedMotion) {
        if(!Float.isFinite(delta)||delta<0) return;
        elapsed+=delta;
        while(nextGesture<=elapsed) {
            gestureAt=nextGesture;gesture=random.nextInt(7);gestureDirection=random.nextBoolean()?1:-1;
            gestureDuration=1.8f+random.nextFloat()*.8f;gestureCount++;
            nextGesture+=GESTURE_MIN+random.nextDouble()*(GESTURE_MAX-GESTURE_MIN);
        }
        strength=reducedMotion?.3f:1;motionTime=(float)elapsed+phase;
        float t=motionTime;
        pose.hipX=sin(t*.4f)*.32f*strength;pose.hipY=sin(t*BREATH_SPEED)*.18f*strength;
        pose.bodyAngle=sin(t*.64f)*1.05f*strength;pose.bodyScale=1+sin(t*BREATH_SPEED)*.0018f*strength;
        pose.headAngle=-2+sin(t*.8f)*HEAD_SWAY*strength;pose.headScale=1;
        pose.leftArm=20+sin(t*.75f)*2.5f*strength;pose.rightArm=-20+sin(t*.65f+1.4f)*3*strength;
        pose.stemAngle=(sin(t*1.1f+.7f)*2+sin(t*.8f-.7f)*.7f)*strength;
        float glow=.85f+sin(t*2.1f)*.08f+sin(t*4.7f)*.04f;
        pose.eyes=glow;pose.mouth=glow*.9f;pose.alpha=1;
        float g=envelope((float)(elapsed-gestureAt),gesture==1?.15f:.55f,gestureDuration*.52f,gestureDuration)*strength;
        switch(gesture) {
            case 0 -> pose.headAngle+=g*8*gestureDirection;
            case 1 -> {pose.headAngle+=g*6*gestureDirection;pose.stemAngle-=sin((float)(elapsed-gestureAt)*9)*g*2;}
            case 2 -> pose.leftArm-=g*16;
            case 3 -> {pose.rightArm+=g*18;pose.bodyAngle-=g*1.3f;pose.headScale+=g*.012f;}
            case 4 -> {pose.eyes+=g*.35f;pose.mouth+=g*.3f;}
            case 5 -> pose.stemAngle+=sin(t*2.6f)*g*3;
            case 6 -> {pose.hipY-=g*.4f;pose.bodyAngle+=g*1.5f*gestureDirection;}
            default -> throw new AssertionError("Unknown pumpkin gesture");
        }
        if(state()==PumpkinAnimationState.PUMPKIN_APPEAR) appear((float)elapsed);
    }
    private void appear(float t) {
        float settle=1-ease(t,3,APPEAR_SECONDS),bow=1-ease(t,1.5f,1.76f);
        float awake=envelope(t-1.5f,.12f,.16f,.47f)*strength;
        float tilt=ease(t,2,2.36f)*(1-ease(t,2.5f,2.78f))*strength;
        float scare=envelope(t-2.5f,.16f,.5f,1)*strength;
        pose.alpha=ease(t,.5f,1);
        pose.hipY-=2.8f*(1-ease(t,.5f,1.7f));
        pose.bodyAngle-=6*bow*settle+3*scare;
        pose.headAngle-=16*bow*settle;pose.headAngle+=4*awake+9*tilt-3*scare;
        pose.headScale+=.025f*scare;
        pose.leftArm+=8*bow*settle-12*awake-10*tilt-22*scare;
        pose.rightArm-=7*bow*settle;pose.rightArm+=13*awake+24*scare;
        pose.stemAngle+=sin((t-1.55f)*15)*envelope(t-1.55f,.08f,.12f,.45f)*3*strength;
        pose.eyes*=ease(t,1,1.5f);pose.mouth*=ease(t,1.17f,1.65f);
        pose.eyes+=awake*.65f+scare*.4f;pose.mouth+=awake*.5f+scare*.3f;
    }
    public static float ease(float t,float start,float end) {
        float p=Math.max(0,Math.min(1,(t-start)/(end-start)));return p*p*p*(p*(p*6-15)+10);
    }
    private static float envelope(float t,float attack,float hold,float end) {return ease(t,0,attack)*(1-ease(t,hold,end));}
    private static float sin(float x) {return (float)Math.sin(x);}
}
