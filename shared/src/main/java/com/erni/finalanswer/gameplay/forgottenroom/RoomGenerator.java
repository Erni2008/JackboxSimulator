package com.erni.finalanswer.gameplay.forgottenroom;

import com.erni.finalanswer.gameplay.forgottenroom.RoomCatalog.*;
import com.erni.finalanswer.gameplay.forgottenroom.RoomState.Placed;
import java.util.*;

/**
 * Seeded room + blackout changes. The same seed and difficulty always give the same round.
 * Fairness rules: one change per object; no place is touched by two changes; a moved object travels at least
 * {@link RoomDifficulty#minMove}; nothing moves or appears onto a place another object just left; the room always
 * keeps empty places, so an empty place on the phone never betrays a disappearance.
 */
public final class RoomGenerator {
    /** A generated round: the room before and after the blackout, and the explicit answer key. */
    public record Round(long seed,RoomDifficulty difficulty,Layout layout,RoomState original,RoomState changed,List<RoomChange> changes){
        public Round{changes=List.copyOf(changes);}
        public int guessLimit(){return changes.size();}
    }
    /** Places left empty in every original room. */
    static final int MIN_EMPTY_SLOTS=6;

    private RoomGenerator(){}

    /** Picks the room from the seed as well. */
    public static Round generate(long seed,RoomDifficulty difficulty){
        return generate(seed,difficulty,RoomCatalog.LAYOUTS.get(Math.floorMod(new Random(seed^0x5DEECE66DL).nextInt(),RoomCatalog.LAYOUTS.size())));}
    public static Round generate(long seed,RoomDifficulty difficulty,Layout layout){
        // A rare unlucky layout cannot host every requested change; retry deterministically from the same seed.
        Random random=new Random(seed);
        for(int attempt=0;attempt<64;attempt++){Round round=tryGenerate(seed,difficulty,layout,new Random(random.nextLong()));if(round!=null)return round;}
        throw new IllegalStateException("No fair room for seed "+seed+" / "+difficulty);
    }

    private static Round tryGenerate(long seed,RoomDifficulty d,Layout layout,Random random){
        int objectCount=d.minObjects+random.nextInt(d.maxObjects-d.minObjects+1);
        objectCount=Math.min(objectCount,layout.slots().size()-MIN_EMPTY_SLOTS);
        List<ObjectDef> pool=new ArrayList<>(RoomCatalog.OBJECTS.stream().filter(o->d.sizes.contains(o.size())).toList());
        Collections.shuffle(pool,random);
        List<Slot> free=new ArrayList<>(layout.slots());Collections.shuffle(free,random);
        Map<String,Placed> room=new LinkedHashMap<>();List<ObjectDef> absent=new ArrayList<>();
        for(ObjectDef def:pool){
            if(room.size()>=objectCount){absent.add(def);continue;}
            Slot slot=free.stream().filter(s->def.surfaces().contains(s.surface())).findFirst().orElse(null);
            if(slot==null){absent.add(def);continue;}
            free.remove(slot);
            room.put(slot.id(),new Placed(def.id(),slot.id(),false,def.variants()>1?random.nextInt(def.variants()):0,def.light()&&random.nextInt(3)!=0));
        }
        if(room.size()<Math.min(d.minObjects,layout.slots().size()-MIN_EMPTY_SLOTS))return null;
        RoomState original=new RoomState(room);

        int target=d.minChanges+random.nextInt(d.maxChanges-d.minChanges+1);
        Map<String,Placed> after=new LinkedHashMap<>(room);
        Set<String> touched=new HashSet<>(),vacated=new HashSet<>(),usedObjects=new HashSet<>();
        List<RoomChange> changes=new ArrayList<>();
        List<ChangeType> types=new ArrayList<>(d.changeTypes);
        List<Placed> present=new ArrayList<>(room.values());Collections.shuffle(present,random);
        // Prefer variety: cycle the shuffled type list so one round rarely repeats a change type.
        Collections.shuffle(types,random);int typeCursor=0;
        for(int guard=0;changes.size()<target&&guard<200;guard++){
            ChangeType type=types.get(typeCursor++%types.size());
            RoomChange change=switch(type){
                case APPEARED->appear(layout,random,absent,after,touched,vacated,usedObjects);
                default->transform(layout,type,d,random,present,after,touched,vacated,usedObjects);};
            if(change==null)continue;
            changes.add(change);usedObjects.add(change.objectId());touched.addAll(change.slots());
            if(change.before()!=null)after.remove(change.before().slotId());
            if(change.after()!=null)after.put(change.after().slotId(),change.after());
            if(change.type()==ChangeType.DISAPPEARED||change.type()==ChangeType.MOVED)vacated.add(change.before().slotId());
        }
        if(changes.size()<target)return null;
        RoomState changed=new RoomState(after);
        if(layout.slots().size()-changed.size()<MIN_EMPTY_SLOTS-1)return null;
        return new Round(seed,d,layout,original,changed,changes);
    }

    private static RoomChange appear(Layout layout,Random random,List<ObjectDef> absent,Map<String,Placed> now,Set<String> touched,Set<String> vacated,Set<String> used){
        List<ObjectDef> candidates=new ArrayList<>(absent);candidates.removeIf(o->used.contains(o.id()));Collections.shuffle(candidates,random);
        for(ObjectDef def:candidates){
            Slot slot=emptySlot(layout,random,def,now,touched,vacated,null,0);
            if(slot!=null)return new RoomChange(ChangeType.APPEARED,def.id(),null,new Placed(def.id(),slot.id(),false,def.variants()>1?random.nextInt(def.variants()):0,def.light()));
        }
        return null;
    }

    private static RoomChange transform(Layout layout,ChangeType type,RoomDifficulty d,Random random,List<Placed> present,Map<String,Placed> now,Set<String> touched,Set<String> vacated,Set<String> used){
        for(Placed p:present){
            if(used.contains(p.objectId())||touched.contains(p.slotId()))continue;
            ObjectDef def=RoomCatalog.object(p.objectId());if(!def.supports(type))continue;
            switch(type){
                case DISAPPEARED->{return new RoomChange(type,p.objectId(),p,null);}
                case ROTATED->{return new RoomChange(type,p.objectId(),p,p.turned());}
                case TOGGLED->{return new RoomChange(type,p.objectId(),p,p.toggled());}
                case CHANGED->{int v=(p.variant()+1+random.nextInt(def.variants()-1))%def.variants();return new RoomChange(type,p.objectId(),p,p.look(v));}
                case MOVED->{Slot to=emptySlot(layout,random,def,now,touched,vacated,layout.slot(p.slotId()),d.minMove);
                    if(to!=null)return new RoomChange(type,p.objectId(),p,p.at(to.id()));}
                default->{}
            }
        }
        return null;
    }

    /** A free place for {@code def}: empty now, untouched by other changes, not just vacated, and far enough from {@code from}. */
    private static Slot emptySlot(Layout layout,Random random,ObjectDef def,Map<String,Placed> now,Set<String> touched,Set<String> vacated,Slot from,float minDistance){
        List<Slot> options=new ArrayList<>();
        for(Slot s:layout.slots())if(def.surfaces().contains(s.surface())&&!now.containsKey(s.id())&&!touched.contains(s.id())&&!vacated.contains(s.id())
            &&(from==null||RoomCatalog.distance(from,s)>=minDistance))options.add(s);
        return options.isEmpty()?null:options.get(random.nextInt(options.size()));
    }
}
