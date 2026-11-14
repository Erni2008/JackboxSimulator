package com.erni.finalanswer.elevator;

import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.elevator.ElevatorEventContext.DoorCommand;
import java.util.List;
import java.util.Random;

/**
 * One event, fully decided when it is created: phase durations (sampled from the configured ranges), the voice line and
 * the needle's wrong positions. After that it is deterministic and time-based. It advances at most one phase per update,
 * so a frame stall never skips a phase's entry cues (door commands, sounds). It only writes the per-frame
 * {@link ElevatorEventContext}; it never touches the elevator's real state.
 */
public final class ElevatorEventSequence {
    public final ElevatorEventType type;
    private final ElevatorEventConfig cfg;
    private final String[] names;private final float[] dur;
    private final float[] needleTargets=new float[4];private final String voice;
    private int phase=-1;private float time;private boolean entered,midCue;
    private float needle,needleVel;

    ElevatorEventSequence(ElevatorEventType type,ElevatorEventConfig cfg,Random rng){
        this.type=type;this.cfg=cfg;names=phaseNames(type);dur=new float[names.length];
        for(int i=0;i<names.length;i++){float[] r=cfg.phase(type,names[i]);dur[i]=r[0]+(r[1]-r[0])*rng.nextFloat();}
        float sign=rng.nextBoolean()?1:-1;                                       // the needle lies toward a neighbouring mark, then twitches back
        needleTargets[0]=sign*(.65f+.3f*rng.nextFloat());needleTargets[1]=-sign*(.2f+.2f*rng.nextFloat());
        needleTargets[2]=sign*(.35f+.25f*rng.nextFloat());needleTargets[3]=sign*.08f;
        List<String> lines=cfg.voiceLines(type);voice=lines.isEmpty()?null:lines.get(rng.nextInt(lines.size()));
    }
    public static String[] phaseNames(ElevatorEventType t){
        return switch(t){
            case EMERGENCY_STOP->new String[]{"brake","suspense","recovery"};
            case SOMEONE_WATCHING->new String[]{"fail","darkness","return"};
            case POWER_FAILURE->new String[]{"instability","malfunction","stabilize"};
            case HOST_INTERRUPTION->new String[]{"dim","line","return"};
            case FALSE_ARRIVAL->new String[]{"decelerate","open","interrupt","close","resume"};
        };
    }
    public boolean done(){return phase>=names.length;}
    public String phaseName(){return phase<0?"pending":done()?"done":names[phase];}
    public float phaseTime(){return time;}
    public float totalDuration(){float s=0;for(float d:dur)s+=d;return s;}
    public String voiceLine(){return voice;}

    void update(float dt,ElevatorEventContext c){
        if(phase<0){phase=0;time=0;entered=true;}
        else{time+=dt;if(time>=dur[phase]){time=Math.min(time-dur[phase],dt);phase++;entered=true;midCue=false;}}
        if(done()){needle=needleVel=0;return;}
        float u=MathUtils.clamp(time/dur[phase],0,1);
        apply(c,names[phase],u,entered);entered=false;
        spring(dt);c.needleOffset=needle;
    }

    private float target;
    private void apply(ElevatorEventContext c,String p,float u,boolean in){
        target=0;
        switch(type){
            case EMERGENCY_STOP->{switch(p){
                case "brake"->{if(in){c.sounds.add("elevator_emergency_brake");c.bump=9;}
                    float k=1-u;c.speed=k*k;c.motorGain=k;c.judder=4.5f*k;c.light=1-.6f*smooth(u);}
                case "suspense"->{c.speed=0;c.motorGain=0;c.judder=1.6f*(1-smooth(u));
                    if(!midCue&&u>=.3f){midCue=true;c.sounds.add("elevator_metal_creak");}
                    c.light=.4f-.25f*flick(u,.22f,.6f);}
                default->{if(in){c.sounds.add("elevator_motor_restart");c.bump=2.5f;}
                    float e=smooth(u);c.speed=e;c.motorGain=e;c.judder=2.2f*MathUtils.sin(u*MathUtils.PI);c.light=MathUtils.lerp(.4f,1,e);}
            }}
            case SOMEONE_WATCHING->{switch(p){
                case "fail"->{float e=smooth(u);c.dark=.94f*e;c.light=1-.5f*e;c.motorGain=1-.4f*e;}
                case "darkness"->{if(in){c.sounds.add("elevator_dark_ambience");c.voiceLine=voice;}c.dark=.94f;c.light=.5f;c.motorGain=.6f;}
                default->{float e=smooth(u);c.dark=.94f*(1-e);c.light=MathUtils.lerp(.5f,1,e);c.motorGain=MathUtils.lerp(.6f,1,e);}
            }}
            case POWER_FAILURE->{switch(p){
                case "instability"->{if(in){c.sounds.add("elevator_power_failure");c.sounds.add("elevator_electric_crackle");}
                    c.light=1-.5f*flick(u,.15f,.42f,.58f,.85f);target=.06f*MathUtils.sin(u*40);}
                case "malfunction"->{if(!midCue&&u>=.5f){midCue=true;c.sounds.add("elevator_electric_crackle");}
                    c.light=.8f-.32f*flick(u,.2f,.52f,.74f);target=needleTargets[Math.min(3,(int)(u/.27f))];}
                default->{float e=smooth(u);c.light=MathUtils.lerp(.8f,1,e);target=0;}
            }}
            case HOST_INTERRUPTION->{float duck=cfg.hostDuck;switch(p){
                case "dim"->{float e=smooth(u);c.light=1-.28f*e;c.motorGain=1-(1-duck)*e;}
                case "line"->{if(in){c.sounds.add("elevator_host_interruption");c.voiceLine=voice;}c.light=.72f;c.motorGain=duck;}
                default->{float e=smooth(u);c.light=MathUtils.lerp(.72f,1,e);c.motorGain=MathUtils.lerp(duck,1,e);}
            }}
            case FALSE_ARRIVAL->{switch(p){
                case "decelerate"->{float e=smooth(u);c.speed=1-e;c.motorGain=1-e;c.judder=1.2f*MathUtils.sin(u*MathUtils.PI);}
                case "open"->{if(in){c.bump=2.5f;c.door=DoorCommand.OPEN_PARTIAL;c.doorTarget=cfg.safeDoorOpen;c.doorSeconds=cfg.doorOpenSeconds;c.sounds.add("elevator_false_arrival");}
                    c.speed=0;c.motorGain=0;}
                case "interrupt"->{if(in){c.door=DoorCommand.PAUSE;c.sounds.add("elevator_door_interrupt");c.bump=3.5f;}
                    c.speed=0;c.motorGain=0;c.light=1-.45f*flick(u,.3f,.72f);}
                case "close"->{if(in){c.door=DoorCommand.CLOSE;c.doorTarget=0;c.doorSeconds=cfg.doorCloseSeconds;c.sounds.add("interior_doors_close");}
                    c.speed=0;c.motorGain=0;}
                default->{if(in){c.sounds.add("elevator_motor_restart");c.bump=2.2f;}
                    float e=smooth(u);c.speed=e;c.motorGain=e;c.judder=2f*MathUtils.sin(u*MathUtils.PI);}
            }}
        }
    }
    /** Short dips centred on the given phase points; with flashing disabled they become one soft, slow dim. */
    private float flick(float u,float... at){
        if(!cfg.flashing)return .35f*MathUtils.sin(u*MathUtils.PI);
        float d=0;for(float a:at){float x=(u-a)/.045f;d=Math.max(d,(float)Math.exp(-x*x));}return d;
    }
    /** Critically damped spring: the needle swings mechanically instead of teleporting. */
    private void spring(float dt){
        float w=13;int n=Math.max(1,(int)Math.ceil(dt*240));float h=dt/n;
        for(int i=0;i<n;i++){float a=w*w*(target-needle)-2*w*needleVel;needleVel+=a*h;needle+=needleVel*h;}
    }
    private static float smooth(float t){return ElevatorCinematicCamera.smoother(t);}
}
