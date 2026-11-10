package com.erni.finalanswer.gameplay.forgottenroom;

import java.util.*;

/** Logical room contents: which object stands at which place, and how it looks. Immutable; rendering reads it. */
public record RoomState(Map<String,Placed> bySlot){
    /** One object at one place. {@code variant} 0 is the object's default look; {@code lit} matters for light sources only. */
    public record Placed(String objectId,String slotId,boolean rotated,int variant,boolean lit){
        public Placed at(String slot){return new Placed(objectId,slot,rotated,variant,lit);}
        public Placed turned(){return new Placed(objectId,slotId,!rotated,variant,lit);}
        public Placed look(int v){return new Placed(objectId,slotId,rotated,v,lit);}
        public Placed toggled(){return new Placed(objectId,slotId,rotated,variant,!lit);}
    }
    public RoomState{bySlot=Collections.unmodifiableMap(new LinkedHashMap<>(bySlot));
        Set<String> seen=new HashSet<>();
        for(var e:bySlot.entrySet()){if(!e.getKey().equals(e.getValue().slotId()))throw new IllegalArgumentException("Slot mismatch "+e.getKey());
            if(!seen.add(e.getValue().objectId()))throw new IllegalArgumentException("Object twice "+e.getValue().objectId());}}
    public Placed at(String slot){return bySlot.get(slot);}
    public Optional<Placed> find(String objectId){return bySlot.values().stream().filter(p->p.objectId().equals(objectId)).findFirst();}
    public boolean occupied(String slot){return bySlot.containsKey(slot);}
    public int size(){return bySlot.size();}
}
