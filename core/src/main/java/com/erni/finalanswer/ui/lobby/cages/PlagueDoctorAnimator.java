package com.erni.finalanswer.ui.lobby.cages;

import java.util.Random;

/** Four-second entrance and quiet gestures; a fixed-step, driven, damped hanging lantern. */
public final class PlagueDoctorAnimator {
    public static final float APPEAR_SECONDS=4, GESTURE_MIN=7,GESTURE_MAX=14;
    public static final double PHYSICS_STEP=1.0/120,STIFFNESS=16,DAMPING=4.2;
    public static final class Pose {
        public float hipX,hipY,bodyAngle,bodyScale=1,headAngle,headX,hatAngle,robeAngle;
        public float rightArm=-15,hatAdjust,inspection,freeX=-24,freeY=-6;
        public float alpha=1,light=1,fire=1,lanternAngle,handX,handY;
    }
    public final Pose pose=new Pose();
    private final Random random;
    private PlagueDoctorAnimationState state=PlagueDoctorAnimationState.PLAGUE_DOCTOR_APPEAR;
    private double elapsed,simulationTime,nextGesture,gestureAt=-100;
    private float gestureDuration=3.2f,gestureDirection=1,phase,strength=1;
    private int gesture;
    private boolean initialized;
    private double lanternAngle,previousLanternAngle,lanternVelocity,previousHandX,previousHandVelocity;
    public PlagueDoctorAnimator() { this(new Random().nextLong()); }
    public PlagueDoctorAnimator(long seed) {
        random=new Random(seed);nextGesture=APPEAR_SECONDS+interval();evaluate(0);
    }
    private double interval() { return GESTURE_MIN+random.nextDouble()*(GESTURE_MAX-GESTURE_MIN); }
    public PlagueDoctorAnimationState state() {return state;}
    public float elapsed() {return (float)elapsed;}
    public float motionTime() {return (float)(elapsed*(1+.012*Math.sin(phase))+phase);}
    public float motionStrength() {return strength;}
    public float lanternVelocity() {return (float)Math.toDegrees(lanternVelocity);}
    public void update(float delta,float phase,boolean reducedMotion) {
        if(!Float.isFinite(delta)||delta<0) return;
        this.phase=phase;strength=reducedMotion?.25f:1;
        if(!initialized) {evaluate(0);previousHandX=pose.handX;initialized=true;}
        elapsed+=delta;
        while(simulationTime+PHYSICS_STEP<=elapsed+1e-9) {
            simulationTime+=PHYSICS_STEP;
            if(simulationTime>=nextGesture) {
                gestureAt=nextGesture;gesture=random.nextInt(8);
                gestureDuration=3+random.nextFloat()*.7f;gestureDirection=random.nextBoolean()?1:-1;
                nextGesture+=interval();
            }
            evaluate(simulationTime);
            double handVelocity=(pose.handX-previousHandX)/PHYSICS_STEP;
            double handAcceleration=(handVelocity-previousHandVelocity)/PHYSICS_STEP;
            double acceleration=-STIFFNESS*lanternAngle-DAMPING*lanternVelocity-handAcceleration/24;
            previousLanternAngle=lanternAngle;
            lanternVelocity+=acceleration*PHYSICS_STEP;
            lanternAngle+=lanternVelocity*PHYSICS_STEP;
            double limit=Math.toRadians(7);
            if(Math.abs(lanternAngle)>limit) {lanternAngle=Math.copySign(limit,lanternAngle);lanternVelocity*=.65;}
            previousHandX=pose.handX;previousHandVelocity=handVelocity;
        }
        evaluate(elapsed);
        double blend=Math.max(0,Math.min(1,(elapsed-simulationTime)/PHYSICS_STEP));
        pose.lanternAngle=(float)Math.toDegrees(previousLanternAngle+(lanternAngle-previousLanternAngle)*blend);
        state=elapsed<APPEAR_SECONDS?PlagueDoctorAnimationState.PLAGUE_DOCTOR_APPEAR:PlagueDoctorAnimationState.PLAGUE_DOCTOR_IDLE;
    }
    private void evaluate(double age) {
        float t=(float)(age*(1+.012*Math.sin(phase))+phase),breath=sin(t*1.12f);
        float g=envelope((float)(age-gestureAt),.95f,1.65f,gestureDuration)*strength;
        float pause=gesture==7?g:0,quiet=1-pause;
        pose.hipX=sin(t*.4f)*.25f*strength*quiet;
        pose.hipY=breath*.23f*strength*quiet;
        pose.bodyAngle=sin(t*.57f)*.55f*strength*quiet;
        pose.bodyScale=1+breath*.0015f*strength*quiet;
        pose.headAngle=-1.5f+sin(t*.7f-.35f)*1.05f*strength*quiet;
        pose.headX=sin(t*.31f)*.2f*strength*quiet;
        pose.hatAngle=sin(t*.85f+.4f)*.25f*strength*quiet;
        pose.robeAngle=(sin(t*.8f-.6f)*.85f+sin(t*.43f+.8f)*.25f)*strength;
        pose.rightArm=-15+sin(t*.55f+.8f)*1.5f*strength*quiet;
        pose.hatAdjust=pose.inspection=0;
        pose.freeX=-24+sin(t*.65f)*.55f*strength*quiet;
        pose.freeY=-6+sin(t*.81f+.4f)*.4f*strength*quiet;
        switch(gesture) {
            case 0 -> pose.headAngle-=g*4;
            case 1 -> {pose.headAngle+=g*3*gestureDirection;pose.headX+=g*.5f*gestureDirection;}
            case 2 -> pose.hatAdjust=g;
            case 3 -> pose.rightArm+=g*14;
            case 4 -> {pose.inspection=g;pose.headAngle-=g*4;pose.rightArm+=g*14;}
            case 5 -> {pose.freeX-=g*4;pose.freeY+=g*3;}
            case 6 -> {pose.hipX+=g*.65f*gestureDirection;pose.bodyAngle+=g*.7f*gestureDirection;}
            case 7 -> { /* Movement eases to a composed pause through quiet above. */ }
            default -> throw new AssertionError("Unknown doctor gesture");
        }
        pose.alpha=1;pose.light=1;
        if(age<APPEAR_SECONDS) appear((float)age);
        float adjust=pose.hatAdjust;
        // Wrist travels outside the beak, then approaches the brim from the side.
        pose.freeX+=-22*sin(adjust*(float)Math.PI)+16*ease(adjust,.9f,1);
        pose.freeY+=72*(adjust+.2f*sin(adjust*(float)Math.PI));
        pose.hatAngle-=adjust*.6f;
        // Gentle band-limited flicker; each slot has its own phase and rate.
        pose.fire=pose.light*(.9f+sin(t*4.1f+.7f)*.065f+sin(t*7.3f+phase)*.035f+pose.inspection*.07f);
        PlagueDoctorRig.locateHand(pose);
    }
    private void appear(float t) {
        float settle=1-ease(t,3.5f,APPEAR_SECONDS),lowered=1-ease(t,1,1.5f);
        pose.alpha=ease(t,.48f,1.12f);
        pose.hipY-=1.8f*(1-ease(t,.5f,1));
        pose.bodyAngle-=2.3f*lowered;
        pose.headAngle-=8*lowered;
        pose.hatAngle-=1.6f*(1-ease(t,1.13f,1.65f));
        pose.headAngle+=1.3f*envelope(t-2,.2f,.3f,.6f);
        pose.headX+=.65f*envelope(t-2,.25f,.33f,.65f);
        pose.hatAdjust=ease(t,2.25f,2.9f)*(1-ease(t,3.05f,3.7f));
        pose.inspection=ease(t,3,3.28f)*settle;
        pose.rightArm+=12*pose.inspection;
        pose.headAngle-=3.5f*pose.inspection;
        pose.light=(.12f*ease(t,0,.45f)+.88f*ease(t,1.5f,1.95f));
    }
    public static float ease(float t,float start,float end) {
        float p=Math.max(0,Math.min(1,(t-start)/(end-start)));return p*p*p*(p*(p*6-15)+10);
    }
    private static float envelope(float t,float attack,float hold,float end) {return ease(t,0,attack)*(1-ease(t,hold,end));}
    private static float sin(float t) {return (float)Math.sin(t);}
}
