package com.erni.finalanswer.elevator;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Decides once per journey whether a horror event happens (configured probability, never the same type twice in a row
 * — the last type survives event-free journeys), schedules it inside the travel portion, runs it and cleans up. The
 * random generator is only used when a journey is planned or an event is built, never per frame.
 */
public final class ElevatorEventManager {
    private final ElevatorEventConfig cfg;private final Random rng;
    private final ElevatorEventContext ctx=new ElevatorEventContext();
    private ElevatorEventType last,planned;private float trigger=-1;
    private ElevatorEventSequence active;
    // debug overrides (null = use config)
    private String forceOverride;private Float probabilityOverride;private Boolean enabledOverride;

    public ElevatorEventManager(ElevatorEventConfig cfg,Random rng){this.cfg=cfg;this.rng=rng;}

    /** Called when a ride starts; {@code moving} is the configured length of the cruise. */
    public void planJourney(float moving){
        active=null;ctx.reset();planned=choose();trigger=-1;
        if(planned==null)return;
        if(planned==ElevatorEventType.FALSE_ARRIVAL)trigger=Math.max(.1f,moving-cfg.falseArrivalBeforeEnd);
        else{float hi=Math.max(cfg.scheduleEarliest,Math.min(cfg.scheduleLatest,moving-.4f));trigger=cfg.scheduleEarliest+(hi-cfg.scheduleEarliest)*rng.nextFloat();}
    }
    private ElevatorEventType choose(){
        String f=forceOverride!=null?forceOverride:cfg.force;
        if("NONE".equals(f))return null;
        if(f!=null&&!f.isEmpty())return ElevatorEventType.valueOf(f);
        if(!(enabledOverride!=null?enabledOverride:cfg.enabled))return null;
        float p=probabilityOverride!=null?probabilityOverride:cfg.probability;
        if(rng.nextFloat()>=p)return null;
        List<ElevatorEventType> pool=new ArrayList<>(List.of(ElevatorEventType.values()));pool.remove(last);
        return pool.get(rng.nextInt(pool.size()));
    }
    /**
     * @param moveClock seconds of real travel done in the cruise
     * @param safe      true only while the car is cruising (never during doors, camera moves or the reveal)
     */
    public ElevatorEventContext update(float dt,float moveClock,boolean safe){
        ctx.reset();
        if(active==null&&planned!=null&&safe&&moveClock>=trigger){start(planned);planned=null;}
        if(active!=null){active.update(dt,ctx);if(active.done())active=null;}
        return ctx;
    }
    private void start(ElevatorEventType t){active=new ElevatorEventSequence(t,cfg,rng);last=t;}
    /** Development trigger: works only in a safe state with no event running. */
    public boolean trigger(ElevatorEventType t,boolean safe){if(!safe||active!=null)return false;planned=null;start(t);return true;}
    public boolean active(){return active!=null;}
    public boolean pending(){return planned!=null;}
    public ElevatorEventType plannedType(){return planned;}
    public ElevatorEventType activeType(){return active==null?null:active.type;}
    public ElevatorEventType lastType(){return last;}
    public ElevatorEventSequence sequence(){return active;}
    public ElevatorEventContext context(){return ctx;}
    /** Drops any planned or running event; all temporary effects vanish with the context reset. */
    public void cancel(){active=null;planned=null;trigger=-1;ctx.reset();}

    // ---- debug ----
    public void debugForce(ElevatorEventType t){forceOverride=t==null?null:t.name();}
    public void debugForceNone(){forceOverride="NONE";}
    public void debugProbability(Float p){probabilityOverride=p;}
    public void debugEnabled(Boolean on){enabledOverride=on;}
    public void debugClear(){forceOverride=null;probabilityOverride=null;enabledOverride=null;}
    public String describe(){
        return active!=null?active.type+" / "+active.phaseName()+String.format(java.util.Locale.ROOT," %.2fs",active.phaseTime())
            :planned!=null?"planned "+planned+String.format(java.util.Locale.ROOT," at %.2fs",trigger):"none (last "+last+")";
    }
}
