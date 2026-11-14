package com.erni.finalanswer.elevator;

import java.util.function.Consumer;

/**
 * The elevator's brain, free of rendering and audio: doors, car position, buttons, the ride sequence and the
 * emergency stop. Everything is driven by {@link #update(float)} with real seconds, so it is frame-rate independent
 * and fully testable headless. Sounds and effects subscribe to named cues through {@link #onCue(Consumer)}.
 *
 * <p>Ride sequence: request → doors close → motor spins up → travel (needle sweeps, car hums) → braking → bell →
 * short mechanical delay → doors open. An emergency stop can interrupt any moving phase and is lifted with
 * {@link #resume()}.
 */
public final class ElevatorController {
    public enum State {IDLE_OPEN,IDLE_CLOSED,DOORS_CLOSING,MOTOR_SPIN_UP,MOVING,ARRIVING,BELL,DOOR_DELAY,DOORS_OPENING,EMERGENCY}
    public enum ButtonState {IDLE,PRESSED,ACTIVE}
    public static final String CUE_BUTTON="button",CUE_DOOR_OPEN_START="door_open_start",CUE_DOOR_OPEN_END="door_open_end",CUE_DOOR_CLOSE_START="door_close_start",
        CUE_DOOR_CLOSE_END="door_close_end",CUE_MOTOR_START="motor_start",CUE_MOTOR_LOOP="motor_loop",CUE_MOTOR_LOOP_STOP="motor_loop_stop",CUE_BRAKE="brake",CUE_BELL="bell",
        CUE_EMERGENCY="emergency",CUE_JOLT="jolt";

    private final ElevatorGeometry g;
    private final MotionProfile door,car;
    private State state;
    private float stateTime,pressedAge=99;
    private int current,requested,pressedFloor;
    private Consumer<String> cues=c->{};
    private boolean doorWasSettled=true;private float doorLastTarget;

    public ElevatorController(ElevatorGeometry g,int startFloor,boolean doorsOpen){
        this.g=g;current=requested=startFloor;
        door=MotionProfile.forTravel(1,g.doorSeconds,doorsOpen?1:0);
        // the car covers one floor per secondsPerFloor at cruise, with a soft quarter-second-scale ease at both ends
        float vmax=1f/g.secondsPerFloor;car=new MotionProfile(vmax,vmax/1.1f,startFloor);
        state=doorsOpen?State.IDLE_OPEN:State.IDLE_CLOSED;doorLastTarget=door.target();
    }
    public ElevatorController onCue(Consumer<String> c){cues=c==null?x->{}:c;return this;}
    private void cue(String c){cues.accept(c);}
    private void go(State s){state=s;stateTime=0;}

    // ---------- commands ----------
    /** Press a floor button. Ignored while an emergency stop is active. */
    public void requestFloor(int floor){
        g.floor(floor);
        if(state==State.EMERGENCY)return;
        pressedFloor=floor;pressedAge=0;cue(CUE_BUTTON);
        if(isRiding()){requested=floor;return;}                         // change destination on the way
        requested=floor;
        if(floor==current&&state!=State.DOORS_CLOSING){openDoors();return;}
        if(door.position()>0||door.target()>0)closeDoorsForRide();else startMotor();
    }
    public void openDoors(){if(isRiding()||state==State.EMERGENCY)return;go(State.DOOR_DELAY);}
    public void closeDoors(){if(isRiding()||state==State.EMERGENCY)return;door.setTarget(0);go(State.DOORS_CLOSING);requested=current;}
    /** Freeze the doors where they are (testing / safety sensor). */
    public void holdDoors(){if(state==State.DOORS_OPENING||state==State.DOORS_CLOSING){door.brake();go(door.target()>0?State.IDLE_OPEN:State.IDLE_CLOSED);}}
    /** Direct door target in 0..1, smooth, for the test scene's 0/25/50/75/100 checks. */
    public void driveDoorsTo(float p){if(isRiding()||state==State.EMERGENCY)return;door.setTarget(clamp(p));go(p>door.position()?State.DOORS_OPENING:State.DOORS_CLOSING);requested=current;}
    public void emergencyStop(){
        if(!isRiding()||state==State.EMERGENCY)return;
        car.brake();go(State.EMERGENCY);cue(CUE_EMERGENCY);cue(CUE_MOTOR_LOOP_STOP);cue(CUE_JOLT);
    }
    public void resume(){
        if(state!=State.EMERGENCY)return;
        car.setTarget(requested);cue(CUE_MOTOR_START);cue(CUE_MOTOR_LOOP);go(State.MOVING);
    }
    private void closeDoorsForRide(){door.setTarget(0);go(State.DOORS_CLOSING);}
    private void startMotor(){cue(CUE_MOTOR_START);go(State.MOTOR_SPIN_UP);}

    // ---------- simulation ----------
    public void update(float dt){
        if(!(dt>0))return;dt=Math.min(dt,.25f);
        stateTime+=dt;pressedAge+=dt;
        boolean settledBefore=doorWasSettled;float doorTargetBefore=doorLastTarget;
        door.update(dt);car.update(dt);
        // door cues fire on real transitions of the leaves: starting, reversing, and settling at an end
        if(settledBefore&&!door.settled()||!settledBefore&&door.target()!=doorTargetBefore&&!door.settled())
            cue(door.target()>door.position()?CUE_DOOR_OPEN_START:CUE_DOOR_CLOSE_START);
        if(!settledBefore&&door.settled()){if(door.position()>=1)cue(CUE_DOOR_OPEN_END);else if(door.position()<=0){cue(CUE_DOOR_CLOSE_END);cue(CUE_JOLT);}}
        doorWasSettled=door.settled();doorLastTarget=door.target();
        switch(state){
            case DOORS_CLOSING->{if(door.settled()&&door.position()<=0){if(requested!=current)startMotor();else go(State.IDLE_CLOSED);}}
            case MOTOR_SPIN_UP->{if(stateTime>=g.motorSpinUp){car.setTarget(requested);cue(CUE_MOTOR_LOOP);go(State.MOVING);}}
            case MOVING->{car.setTarget(requested);
                float remaining=Math.abs(requested-car.position()),stop=car.velocity()*car.velocity()/(2*(car.maxSpeed()/1.1f));
                if(remaining<=stop+1e-3f&&Math.abs(car.velocity())>0){cue(CUE_BRAKE);go(State.ARRIVING);}
                else if(car.settled()){arrive();}}
            case ARRIVING->{car.setTarget(requested);if(car.settled())arrive();}
            case BELL->{if(stateTime>=g.arrivalBell)go(State.DOOR_DELAY);}
            case DOOR_DELAY->{if(stateTime>=g.doorStartDelay){door.setTarget(1);go(State.DOORS_OPENING);}}
            case DOORS_OPENING->{if(door.settled())go(door.position()>=1?State.IDLE_OPEN:State.IDLE_CLOSED);}
            case EMERGENCY,IDLE_OPEN,IDLE_CLOSED->{}
        }
        current=Math.round(car.position());
    }
    private void arrive(){current=requested;cue(CUE_MOTOR_LOOP_STOP);cue(CUE_JOLT);cue(CUE_BELL);go(State.BELL);}

    // ---------- read-only state for rendering ----------
    public State state(){return state;}
    public float stateTime(){return stateTime;}
    public float doorOpen(){return door.position();}
    public float doorVelocity(){return door.velocity();}
    public float carPosition(){return car.position();}
    public float carVelocity(){return car.velocity();}
    public int currentFloor(){return current;}
    public int requestedFloor(){return requested;}
    /** The floor whose image shows through the doorway: the one the car is at (or nearest to). */
    public int visibleFloor(){return Math.max(1,Math.min(5,Math.round(car.position())));}
    public boolean isRiding(){return state==State.MOTOR_SPIN_UP||state==State.MOVING||state==State.ARRIVING||state==State.EMERGENCY;}
    public ButtonState button(int floor){
        if(floor==pressedFloor&&pressedAge<.18f)return ButtonState.PRESSED;
        boolean travelling=isRiding()||state==State.DOORS_CLOSING&&requested!=current||state==State.BELL;
        return travelling&&floor==requested?ButtonState.ACTIVE:ButtonState.IDLE;
    }
    private static float clamp(float v){return Math.max(0,Math.min(1,v));}
}
