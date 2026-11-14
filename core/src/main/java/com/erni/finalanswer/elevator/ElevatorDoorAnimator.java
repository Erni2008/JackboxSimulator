package com.erni.finalanswer.elevator;

/**
 * A pair of sliding door leaves: one opening ratio (0 = closed, 1 = open) driven by a {@link MotionProfile} with
 * eased acceleration and braking, so the leaves can open, close, stop at any ratio, pause, and reverse mid-travel
 * without a jump. When the leaves come to rest at an end they give a small damped mechanical settle (a few source
 * pixels), which the renderer adds to the leaf positions. Time-based and deterministic.
 */
public final class ElevatorDoorAnimator {
    private MotionProfile motion;private float duration;
    private float settleAge=99,settleDir;private boolean paused,wasSettled=true;

    public ElevatorDoorAnimator(float durationSeconds,float startOpen){duration=durationSeconds;motion=MotionProfile.forTravel(1,durationSeconds,startOpen);}

    public void open(){motion.setTarget(1);paused=false;}
    public void close(){motion.setTarget(0);paused=false;}
    public void moveTo(float ratio){motion.setTarget(Math.max(0,Math.min(1,ratio)));paused=false;}
    public void pause(){paused=true;}
    public void resume(){paused=false;}
    public void snap(float ratio){motion.snap(Math.max(0,Math.min(1,ratio)));settleAge=99;wasSettled=true;}
    /** Re-times future travel (e.g. a faster closing at the start of the sequence); keeps the current position. */
    public void setDuration(float seconds){if(seconds==duration)return;float p=motion.position(),t=motion.target();duration=seconds;motion=MotionProfile.forTravel(1,seconds,p);motion.setTarget(t);}

    public void update(float dt){
        if(!(dt>0))return;settleAge+=dt;
        if(!paused)motion.update(dt);
        boolean settled=motion.settled();
        if(settled&&!wasSettled){settleAge=0;settleDir=motion.position()>=1?1:-1;}
        wasSettled=settled;
    }
    public float openness(){return motion.position();}
    public boolean moving(){return !motion.settled()&&!paused;}
    public boolean settled(){return motion.settled();}
    public boolean fullyOpen(){return motion.settled()&&motion.position()>=1;}
    public boolean fullyClosed(){return motion.settled()&&motion.position()<=0;}
    public boolean justSettled(){return settleAge==0;}
    /** Extra travel (source px, along the opening direction) of the end-of-travel mechanical settle. */
    public float settleOffset(){if(settleAge>.35f)return 0;return settleDir*3.2f*(float)Math.exp(-settleAge*12)*(float)Math.sin(settleAge*38);}
    /** Seconds since the leaves last came to rest (for a closing thud / camera jolt). */
    public float settleAge(){return settleAge;}
}
