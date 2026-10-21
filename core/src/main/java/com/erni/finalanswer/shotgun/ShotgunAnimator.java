package com.erni.finalanswer.shotgun;

/** Allocation-free local pose controller. New commands are rejected while busy; reset interrupts. */
public final class ShotgunAnimator {
    public enum State { IDLE, PUMP, OPENING, CLOSING, RELOAD }
    public enum CyclePhase { IDLE, PUMP_BACKWARD, REAR_POSITION, PUMP_FORWARD }
    public enum BoltState { CLOSED, OPENING, OPEN, CLOSING }
    public enum ShellState { HIDDEN, VISIBLE, MOVING, LOADED }
    private final ShotgunConfig config;
    private State state=State.IDLE;
    private ShellState shell=ShellState.HIDDEN;
    private double time;
    private float pump,bolt,fromBolt,shellProgress;
    public ShotgunAnimator(ShotgunConfig config){this.config=config;}
    public State state(){return state;}
    public CyclePhase cyclePhase(){
        if(state!=State.PUMP)return CyclePhase.IDLE;
        double t=time/config.pumpDuration;
        return t<.45?CyclePhase.PUMP_BACKWARD:t<.55?CyclePhase.REAR_POSITION:CyclePhase.PUMP_FORWARD;
    }
    public ShellState shellState(){return shell;}
    public float pump(){return pump;}
    public float bolt(){return bolt;}
    public BoltState boltState(){
        if(bolt==0&&state!=State.OPENING&&state!=State.RELOAD&&state!=State.PUMP)return BoltState.CLOSED;
        if(bolt==1)return BoltState.OPEN;
        return switch(state){case CLOSING->BoltState.CLOSING;case RELOAD->time/config.reloadDuration<.6?BoltState.OPENING:BoltState.CLOSING;case PUMP->time/config.pumpDuration<.55?BoltState.OPENING:BoltState.CLOSING;default->BoltState.OPENING;};
    }
    public float shellProgress(){return shellProgress;}
    public boolean isAnimating(){return state!=State.IDLE;}
    public boolean playPumpAnimation(){if(isAnimating())return false;state=State.PUMP;time=0;fromBolt=bolt;return true;}
    public boolean openBolt(){return start(State.OPENING);}
    public boolean closeBolt(){return start(State.CLOSING);}
    public boolean playReloadAnimation(){if(!start(State.RELOAD))return false;shell=ShellState.VISIBLE;shellProgress=0;return true;}
    private boolean start(State next){if(isAnimating())return false;state=next;time=0;fromBolt=bolt;return true;}
    public void resetShotgun(){state=State.IDLE;shell=ShellState.HIDDEN;time=0;pump=bolt=fromBolt=shellProgress=0;}
    public void showShell(){if(!isAnimating()){shell=ShellState.VISIBLE;shellProgress=0;}}
    public void hideShell(){if(!isAnimating())shell=ShellState.HIDDEN;}
    public void update(float delta){
        if(!Float.isFinite(delta)||delta<=0||!isAnimating())return;
        time+=delta;
        float duration=switch(state){case PUMP->config.pumpDuration;case RELOAD->config.reloadDuration;default->config.boltDuration;};
        float t=(float)Math.min(1,time/duration);
        switch(state){
            case PUMP->{pump=t<.45f?ease(t/.45f):t<.55f?1:1-ease((t-.55f)/.45f);bolt=t<.55f?fromBolt+(1-fromBolt)*pump:pump;}
            case OPENING->bolt=fromBolt+(1-fromBolt)*ease(t);
            case CLOSING->bolt=fromBolt*(1-ease(t));
            case RELOAD->{
                if(t<.25f){bolt=fromBolt+(1-fromBolt)*ease(t/.25f);pump=ease(t/.25f);}
                else if(t<.6f){bolt=pump=1;shell=ShellState.MOVING;shellProgress=ease((t-.25f)/.35f);}
                else{shell=ShellState.LOADED;shellProgress=1;bolt=pump=1-ease((t-.6f)/.4f);}
            }
            default->{}
        }
        if(t>=1){if(state==State.OPENING)bolt=1;else bolt=0;pump=0;state=State.IDLE;}
    }
    private float ease(float value){float x=Math.max(0,Math.min(1,value));return switch(config.easing){case "linear"->x;case "smoother"->x*x*x*(x*(x*6-15)+10);default->x*x*(3-2*x);};}
}
