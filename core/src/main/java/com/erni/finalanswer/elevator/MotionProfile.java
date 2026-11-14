package com.erni.finalanswer.elevator;

/**
 * Smooth one-dimensional motion with limited acceleration: it speeds up, cruises and slows down so that it arrives
 * exactly on its target with zero velocity. The target can change at any moment, including reversing direction
 * mid-travel, and the motion stays continuous in both position and velocity (it brakes, then accelerates back) —
 * never a jump. Frame-rate independent: {@link #update(float)} sub-steps large deltas.
 *
 * <p>For a full travel of {@code distance} the profile is acceleration / cruise / deceleration of equal thirds, so
 * {@link #forTravel(float,float)} gives exactly the requested duration (the door: 1.0 in 1.8 s).
 */
public final class MotionProfile {
    private final float maxSpeed,accel;
    private float position,velocity,target;

    public MotionProfile(float maxSpeed,float accel,float start){this.maxSpeed=maxSpeed;this.accel=accel;position=target=start;}
    /** Ease-in / cruise / ease-out of equal thirds: covers {@code distance} in exactly {@code seconds}. */
    public static MotionProfile forTravel(float distance,float seconds,float start){
        float third=seconds/3f,vmax=distance/(2*third);return new MotionProfile(vmax,vmax/third,start);
    }

    public void setTarget(float t){target=t;}
    /** Stops where it can: brakes at full deceleration and holds wherever that lands. */
    public void brake(){float stop=velocity*Math.abs(velocity)/(2*accel);target=position+stop;}
    /** Jump without motion (setup and tests only). */
    public void snap(float p){position=target=p;velocity=0;}

    public void update(float dt){
        if(!(dt>0))return;
        int steps=Math.max(1,(int)Math.ceil(dt/(1/240f)));float h=dt/steps;
        for(int i=0;i<steps;i++)step(h);
    }
    private void step(float h){
        float d=target-position;
        if(Math.abs(d)<1e-6f&&Math.abs(velocity)<=accel*h){position=target;velocity=0;return;}
        float dir=Math.signum(d);
        // the fastest speed from which we can still stop exactly on target: v = sqrt(2·a·|d|)
        float desired=dir*Math.min(maxSpeed,(float)Math.sqrt(2*accel*Math.abs(d)));
        float maxDv=accel*h;
        if(Math.signum(velocity)==dir&&Math.abs(desired)<Math.abs(velocity))velocity=desired;     // riding the braking curve
        else velocity+=Math.max(-maxDv,Math.min(maxDv,desired-velocity));                         // accelerate / reverse smoothly
        float next=position+velocity*h;
        if(dir!=0&&Math.signum(target-next)!=dir&&Math.signum(velocity)==dir){position=target;velocity=0;return;}
        position=next;
    }

    public float position(){return position;}
    public float velocity(){return velocity;}
    public float target(){return target;}
    public boolean settled(){return velocity==0&&position==target;}
    public float maxSpeed(){return maxSpeed;}
}
