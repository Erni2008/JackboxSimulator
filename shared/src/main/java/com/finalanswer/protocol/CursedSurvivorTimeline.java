package com.finalanswer.protocol;

/** Deterministic presentation clock shared by the server and desktop; no graphics dependency. */
public final class CursedSurvivorTimeline {
    public enum State { WAITING, ANTICIPATION, SMOKE_APPEARING, PANEL_FADING, CHARACTER_REVEALING, CHARACTER_IDLE, NEXT_SURVIVOR, COMPLETED }
    public static final class Timings {
        public float anticipation=.4f,smoke=.5f,panel=1f,character=.65f,idle=.1f,gap=.35f;
        public float period(){return anticipation+smoke+panel+character+idle+gap;}
        public void validate(){for(float t:new float[]{anticipation,smoke,panel,character,idle,gap})if(!Float.isFinite(t)||t<=0||t>5)throw new IllegalArgumentException("Invalid survivor timing");}
    }
    public final Timings timings;
    private int mask,count;
    private float age;
    private boolean started;
    public CursedSurvivorTimeline(){this(new Timings());}
    public CursedSurvivorTimeline(Timings timings){timings.validate();this.timings=timings;}
    public boolean start(int survivorMask){if(started)return false;if((survivorMask&~0xffff)!=0)throw new IllegalArgumentException("Invalid survivor mask");mask=survivorMask;count=Integer.bitCount(mask);age=0;started=true;return true;}
    public void reset(){mask=count=0;age=0;started=false;}
    public void update(float dt){if(Float.isFinite(dt)&&dt>0&&started)age+=dt;}
    public void seek(float seconds){if(started&&Float.isFinite(seconds))age=Math.max(age,Math.max(0,seconds));}
    public int mask(){return mask;}public int count(){return count;}public float age(){return age;}
    public float duration(){return count*timings.period();}
    public boolean started(){return started;}
    public boolean eligible(int box){return box>=0&&box<16&&(mask&(1<<box))!=0;}
    public float localAge(int box){if(!eligible(box))return -1;return age-Integer.bitCount(mask&((1<<box)-1))*timings.period();}
    public int currentBox(){if(!started||age>=duration())return -1;int index=(int)(age/timings.period());for(int b=0;b<16;b++)if(eligible(b)&&index--==0)return b;return -1;}
    public State state(){
        if(!started)return State.WAITING;if(age>=duration())return State.COMPLETED;
        float t=age%timings.period();if((t-=timings.anticipation)<0)return State.ANTICIPATION;
        if((t-=timings.smoke)<0)return State.SMOKE_APPEARING;
        if((t-=timings.panel)<0)return State.PANEL_FADING;
        if((t-=timings.character)<0)return State.CHARACTER_REVEALING;
        if((t-=timings.idle)<0)return State.CHARACTER_IDLE;return State.NEXT_SURVIVOR;
    }
    private static float smooth(float t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}
    public float panelOpacity(int box){float t=localAge(box);return t<0?1:1-smooth((t-timings.anticipation-timings.smoke)/timings.panel);}
    public float characterOpacity(int box){float t=localAge(box);return t<0?0:smooth((t-timings.anticipation-timings.smoke)/(timings.panel*.9f));}
    public float entranceAge(int box){return Math.max(0,localAge(box)-timings.anticipation-timings.smoke);}
    public float entranceDuration(){return timings.panel+timings.character;}
}
