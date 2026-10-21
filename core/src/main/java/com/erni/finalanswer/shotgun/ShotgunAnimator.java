package com.erni.finalanswer.shotgun;

/** Deterministic single-chamber presentation. Fire -> spent case -> cycle/eject -> empty -> reload. */
public final class ShotgunAnimator {
    public enum State { IDLE, PUMP, OPENING, CLOSING, RELOAD, FIRING }
    public enum CyclePhase { IDLE, PUMP_BACKWARD, REAR_POSITION, PUMP_FORWARD }
    public enum BoltState { CLOSED, OPENING, OPEN, CLOSING }
    public enum ShellState { HIDDEN, VISIBLE, MOVING, LOADED }
    public enum Chamber { EMPTY, LIVE, SPENT }
    public enum Event { FIRED, EJECTED, RELOADED, CYCLE_STARTED, EMPTY_TRIGGER, RESET }
    @FunctionalInterface public interface Listener { void onEvent(Event event,long sequence); }
    private static final Listener NONE=(event,sequence)->{};
    private Listener listener=NONE;
    private final ShotgunConfig config;
    private State state=State.IDLE;
    private ShellState shell=ShellState.HIDDEN;
    private Chamber chamber;
    private double time,ejectionAge=Double.POSITIVE_INFINITY;
    private float pump,bolt,fromBolt,shellProgress;
    private long sequence,shots,ejections;
    public ShotgunAnimator(ShotgunConfig config){this.config=config;chamber=config.startLoaded?Chamber.LIVE:Chamber.EMPTY;}
    public void listener(Listener listener){this.listener=listener==null?NONE:listener;}
    private void emit(Event event){listener.onEvent(event,++sequence);}
    public State state(){return state;}
    public Chamber chamber(){return chamber;}
    /** Match setup only; per-round authority owns ammunition, never per-frame network poses. */
    public boolean chamber(Chamber value){if(isAnimating()||value==null)return false;chamber=value;return true;}
    public long shotSerial(){return shots;}
    public long ejectionSerial(){return ejections;}
    public float ejectionAge(){return (float)ejectionAge;}
    public boolean ejecting(){return ejectionAge<config.ejectionLifetime;}
    public float flash(){return state==State.FIRING?(float)Math.pow(Math.max(0,1-time/config.flashDuration),2):0;}
    public float recoil(){
        if(state!=State.FIRING)return 0;
        if(time<.035)return (float)Math.sin(time/.035*Math.PI*.5);
        float t=(float)Math.min(1,(time-.035)/(config.fireDuration-.035));
        return (1-t)*(1-t)*(float)Math.cos(t*3.3);
    }
    public boolean fire(){
        if(isAnimating()||bolt>0||pump>0)return false;
        if(chamber!=Chamber.LIVE){emit(Event.EMPTY_TRIGGER);return false;}
        chamber=Chamber.SPENT;state=State.FIRING;time=0;shell=ShellState.HIDDEN;shots++;emit(Event.FIRED);return true;
    }
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
    public float progress(){
        float duration=switch(state){case PUMP->config.pumpDuration;case RELOAD->config.reloadDuration;case FIRING->config.fireDuration;default->config.boltDuration;};
        return state==State.IDLE?0:(float)Math.min(1,time/duration);
    }
    public float shellProgress(){return shellProgress;}
    public boolean isAnimating(){return state!=State.IDLE;}
    public boolean playPumpAnimation(){if(!start(State.PUMP))return false;emit(Event.CYCLE_STARTED);return true;}
    public boolean openBolt(){return start(State.OPENING);}
    public boolean closeBolt(){return start(State.CLOSING);}
    public boolean playReloadAnimation(){if(chamber!=Chamber.EMPTY||!start(State.RELOAD))return false;shell=ShellState.VISIBLE;shellProgress=0;return true;}
    private boolean start(State next){if(isAnimating())return false;state=next;time=0;fromBolt=bolt;return true;}
    public void resetShotgun(){state=State.IDLE;shell=ShellState.HIDDEN;time=0;pump=bolt=fromBolt=shellProgress=0;chamber=config.startLoaded?Chamber.LIVE:Chamber.EMPTY;ejectionAge=Double.POSITIVE_INFINITY;emit(Event.RESET);}
    public void showShell(){if(!isAnimating()){shell=ShellState.VISIBLE;shellProgress=0;}}
    public void hideShell(){if(!isAnimating())shell=ShellState.HIDDEN;}
    private void eject(double trigger){
        if(chamber==Chamber.EMPTY)return;
        chamber=Chamber.EMPTY;ejectionAge=Math.max(0,time-trigger);ejections++;emit(Event.EJECTED);
    }
    public void update(float delta){
        if(!Float.isFinite(delta)||delta<=0)return;
        if(ejecting())ejectionAge+=delta;
        if(!isAnimating())return;
        time+=delta;
        float duration=switch(state){case PUMP->config.pumpDuration;case RELOAD->config.reloadDuration;case FIRING->config.fireDuration;default->config.boltDuration;};
        float t=(float)Math.min(1,time/duration);
        switch(state){
            case PUMP->{pump=t<.45f?ease(t/.45f):t<.55f?1:1-ease((t-.55f)/.45f);bolt=t<.55f?fromBolt+(1-fromBolt)*pump:pump;if(t>=config.ejectionAt)eject(config.pumpDuration*(double)config.ejectionAt);}
            case OPENING->{bolt=fromBolt+(1-fromBolt)*ease(t);if(t>=.90f)eject(config.boltDuration*.90);}
            case CLOSING->bolt=fromBolt*(1-ease(t));
            case RELOAD->{
                if(t<.25f){bolt=fromBolt+(1-fromBolt)*ease(t/.25f);pump=ease(t/.25f);}
                else if(t<.6f){bolt=pump=1;shell=ShellState.MOVING;shellProgress=ease((t-.25f)/.35f);}
                else{shell=ShellState.LOADED;shellProgress=1;bolt=pump=1-ease((t-.6f)/.4f);}
            }
            default->{}
        }
        if(t>=1){
            boolean reloaded=state==State.RELOAD;
            if(state==State.OPENING)bolt=1;else bolt=0;pump=0;
            if(reloaded)chamber=Chamber.LIVE;
            state=State.IDLE;
            if(reloaded)emit(Event.RELOADED);
        }
    }
    private float ease(float value){float x=Math.max(0,Math.min(1,value));return switch(config.easing){case "linear"->x;case "smoother"->x*x*x*(x*(x*6-15)+10);default->x*x*(3-2*x);};}
}
