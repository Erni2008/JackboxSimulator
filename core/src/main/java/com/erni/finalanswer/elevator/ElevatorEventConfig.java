package com.erni.finalanswer.elevator;

import com.badlogic.gdx.utils.JsonValue;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The random-event block of {@code elevator_transition.json}. Every probability, window and phase duration lives here;
 * phase durations are {@code [min,max]} ranges sampled once when an event is selected.
 */
public final class ElevatorEventConfig {
    public float probability=.3f;public boolean enabled=true,flashing=true;
    /** False Arrival never opens the inner doors further than this. */
    public float safeDoorOpen=.2f;
    /** Full-travel times handed to the existing door animator for the false arrival (closing is faster than normal). */
    public float doorOpenSeconds=1.6f,doorCloseSeconds=1.3f;
    /** Window (seconds into MOVING) in which a non-stopping event or an emergency stop may start. */
    public float scheduleEarliest=.35f,scheduleLatest=1.2f;
    /** A false arrival starts this many seconds before the end of MOVING, when the needle is near the destination. */
    public float falseArrivalBeforeEnd=.5f;
    /** Motor/ambience gain while the host speaks. */
    public float hostDuck=.4f;
    /** Debug: "" = random, "NONE" = never, or an event name forced on every journey. */
    public String force="";
    final Map<String,float[]> phases=new HashMap<>();
    final Map<ElevatorEventType,List<String>> voiceLines=new EnumMap<>(ElevatorEventType.class);

    public static ElevatorEventConfig defaults(){return new ElevatorEventConfig();}

    static ElevatorEventConfig parse(JsonValue v){
        var c=new ElevatorEventConfig();if(v==null)return c;
        c.probability=v.getFloat("probability",c.probability);c.enabled=v.getBoolean("enabled",c.enabled);c.flashing=v.getBoolean("flashing",c.flashing);
        c.safeDoorOpen=v.getFloat("safeDoorOpen",c.safeDoorOpen);c.doorOpenSeconds=v.getFloat("doorOpenSeconds",c.doorOpenSeconds);c.doorCloseSeconds=v.getFloat("doorCloseSeconds",c.doorCloseSeconds);c.scheduleEarliest=v.getFloat("scheduleEarliest",c.scheduleEarliest);
        c.scheduleLatest=v.getFloat("scheduleLatest",c.scheduleLatest);c.falseArrivalBeforeEnd=v.getFloat("falseArrivalBeforeEnd",c.falseArrivalBeforeEnd);
        c.hostDuck=v.getFloat("hostDuck",c.hostDuck);
        JsonValue d=v.get("debug");if(d!=null)c.force=d.getString("force","");
        JsonValue p=v.get("phases");
        if(p!=null)for(JsonValue t=p.child;t!=null;t=t.next)for(JsonValue ph=t.child;ph!=null;ph=ph.next)c.phases.put(t.name+"."+ph.name,ph.asFloatArray());
        JsonValue lines=v.get("voiceLines");
        if(lines!=null)for(JsonValue t=lines.child;t!=null;t=t.next){List<String> ids=new ArrayList<>();for(JsonValue l=t.child;l!=null;l=l.next)ids.add(l.asString());c.voiceLines.put(ElevatorEventType.valueOf(t.name),ids);}
        c.validate();return c;
    }
    /** {@code [min,max]} of a phase; fails fast on a missing entry. */
    public float[] phase(ElevatorEventType type,String name){
        float[] r=phases.get(type.name()+"."+name);
        if(r==null)throw new IllegalArgumentException("missing event phase "+type+"."+name);return r;
    }
    public List<String> voiceLines(ElevatorEventType type){return voiceLines.getOrDefault(type,List.of());}
    void validate(){
        if(!(probability>=0&&probability<=1))throw new IllegalArgumentException("event probability must be 0..1");
        if(!(safeDoorOpen>0&&safeDoorOpen<=.3f))throw new IllegalArgumentException("safeDoorOpen must be in (0, .3]");
        for(var e:phases.entrySet()){float[] r=e.getValue();if(r.length!=2||r[0]<0||r[1]<r[0])throw new IllegalArgumentException("bad phase range "+e.getKey());}
        if(!force.isEmpty()&&!force.equals("NONE"))ElevatorEventType.valueOf(force);
    }
}
