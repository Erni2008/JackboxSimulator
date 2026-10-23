package com.finalanswer.protocol;

/** End-of-shooting presentation only: authority supplies the victim mask; no outcome is inferred here. */
public final class CursedEliminationTimeline {
    public enum State { WAITING, ANNOUNCEMENT, FALLING, SOUL_RISING, GHOSTS, COMPLETED }
    public static final class Timings {
        public float announcement=1.25f,fall=.8f,rise=1.1f,hold=.45f;
        public float duration(){return announcement+fall+rise+hold;}
        public void validate(){for(float t:new float[]{announcement,fall,rise,hold})if(!Float.isFinite(t)||t<=0||t>15)throw new IllegalArgumentException("Invalid elimination timing");}
    }
    public final Timings timings=new Timings();
    private int mask;private float age;private boolean started;
    public boolean start(int mask){if(started)return false;if((mask&~0xffff)!=0)throw new IllegalArgumentException("Invalid victim mask");timings.validate();this.mask=mask;age=0;started=true;return true;}
    public void reset(){mask=0;age=0;started=false;}
    public void update(float dt){if(started&&Float.isFinite(dt)&&dt>0)age+=dt;}
    public void seek(float seconds){if(started&&Float.isFinite(seconds))age=Math.max(age,Math.max(0,seconds));}
    public int mask(){return mask;}public float age(){return age;}public boolean started(){return started;}
    public int count(){return Integer.bitCount(mask);}
    public float duration(){return mask==0?0:timings.duration();}
    public boolean eligible(int box){return started&&box>=0&&box<16&&(mask&(1<<box))!=0;}
    public boolean active(){return started&&age<duration();}
    private static float smooth(float t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}
    public float fall(){return smooth((age-timings.announcement)/timings.fall);}
    public float spirit(){return smooth((age-timings.announcement-timings.fall)/timings.rise);}
    public State state(){
        if(!started)return State.WAITING;if(age>=duration())return State.COMPLETED;
        if(age<timings.announcement)return State.ANNOUNCEMENT;
        if(age<timings.announcement+timings.fall)return State.FALLING;
        if(age<timings.announcement+timings.fall+timings.rise)return State.SOUL_RISING;
        return State.GHOSTS;
    }
}
