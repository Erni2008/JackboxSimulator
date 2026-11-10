package com.finalanswer.server;

import com.erni.finalanswer.gameplay.forgottenroom.*;
import com.erni.finalanswer.gameplay.forgottenroom.RoomScoring.*;
import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ForgottenRoomTest {
    private static final Rules R=Rules.DEFAULT;

    @Test void everyDifficultyGeneratesTheRightNumberOfObjectsAndChanges(){
        for(RoomDifficulty d:RoomDifficulty.values())for(long seed=0;seed<400;seed++){
            var round=RoomGenerator.generate(seed,d);
            assertTrue(round.original().size()>=Math.min(d.minObjects,round.layout().slots().size()-6)&&round.original().size()<=d.maxObjects,d+" objects "+round.original().size());
            assertTrue(round.changes().size()>=d.minChanges&&round.changes().size()<=d.maxChanges,d+" changes");
            assertEquals(round.changes().size(),round.guessLimit());
        }
    }

    @Test void sameSeedSameRoundDifferentSeedsDiffer(){
        var a=RoomGenerator.generate(42,RoomDifficulty.HARD);var b=RoomGenerator.generate(42,RoomDifficulty.HARD);
        assertEquals(a,b);
        Set<List<RoomChange>> distinct=new HashSet<>();for(long s=0;s<30;s++)distinct.add(RoomGenerator.generate(s,RoomDifficulty.HARD).changes());
        assertTrue(distinct.size()>25);
    }

    @Test void changesNeverConflictAndAlwaysMatchTheTwoRooms(){
        for(RoomDifficulty d:RoomDifficulty.values())for(long seed=0;seed<400;seed++){
            var round=RoomGenerator.generate(seed,d);Set<String> objects=new HashSet<>(),slots=new HashSet<>();
            for(RoomChange c:round.changes()){
                assertTrue(objects.add(c.objectId()),"object changed twice");
                for(String s:c.slots())assertTrue(slots.add(s),"place touched twice");
                assertTrue(d.changeTypes.contains(c.type()));
                assertTrue(RoomCatalog.object(c.objectId()).supports(c.type()));
                if(c.before()!=null)assertEquals(c.before(),round.original().at(c.before().slotId()));
                else assertTrue(round.original().find(c.objectId()).isEmpty(),"appeared object was already there");
                if(c.after()!=null)assertEquals(c.after(),round.changed().at(c.after().slotId()));
                else assertTrue(round.changed().find(c.objectId()).isEmpty(),"vanished object still there");
                switch(c.type()){
                    case MOVED->assertTrue(RoomCatalog.distance(round.layout().slot(c.before().slotId()),round.layout().slot(c.after().slotId()))>=d.minMove);
                    case ROTATED->assertNotEquals(c.before().rotated(),c.after().rotated());
                    case CHANGED->assertNotEquals(c.before().variant(),c.after().variant());
                    case TOGGLED->assertNotEquals(c.before().lit(),c.after().lit());
                    default->{}
                }
            }
            // Everything not named in the key is identical before and after the blackout.
            for(var placed:round.original().bySlot().values())if(!objects.contains(placed.objectId()))assertEquals(placed,round.changed().at(placed.slotId()));
            for(var placed:round.changed().bySlot().values())if(!objects.contains(placed.objectId()))assertEquals(placed,round.original().at(placed.slotId()));
        }
    }

    @Test void objectsStandOnlyOnValidVisiblePlacesAndEmptyPlacesRemain(){
        for(RoomDifficulty d:RoomDifficulty.values())for(long seed=0;seed<300;seed++){
            var round=RoomGenerator.generate(seed,d);
            for(var state:List.of(round.original(),round.changed())){
                for(var p:state.bySlot().values()){var slot=round.layout().slot(p.slotId());var def=RoomCatalog.object(p.objectId());
                    assertTrue(def.surfaces().contains(slot.surface()),def.id()+" on "+slot.surface());
                    assertTrue(slot.x()>0&&slot.x()<1&&slot.y()>0&&slot.y()<1);
                    assertTrue(d.sizes.contains(def.size()));assertTrue(round.layout().hasSlot(p.slotId()));
                    assertTrue(p.variant()>=0&&p.variant()<def.variants());}
                assertTrue(round.layout().slots().size()-state.size()>=5,"an empty place must never betray a disappearance");
            }
        }
    }

    @Test void exactPartialWrongAndNoDuplicateCredit(){
        var round=RoomGenerator.generate(7,RoomDifficulty.HARD);var changes=round.changes();var first=changes.get(0);
        String place=first.slots().iterator().next();
        var exact=RoomScoring.score(changes,List.of(new Guess(place,first.type())),R);
        assertEquals(100,exact.points());assertEquals(1,exact.correct());
        ChangeType other=Arrays.stream(ChangeType.values()).filter(t->t!=first.type()).findFirst().orElseThrow();
        var partial=RoomScoring.score(changes,List.of(new Guess(place,other)),R);
        assertEquals(25,partial.points());assertEquals(1,partial.partial());
        // The same place twice never counts twice: only the first answer for a place is read.
        assertEquals(100,RoomScoring.score(changes,List.of(new Guess(place,first.type()),new Guess(place,first.type())),R).points());
        assertEquals(25,RoomScoring.score(changes,List.of(new Guess(place,other),new Guess(place,first.type())),R).points());
        String untouched=round.layout().slots().stream().map(RoomCatalog.Slot::id).filter(s->changes.stream().noneMatch(c->c.slots().contains(s))).findFirst().orElseThrow();
        var wrong=RoomScoring.score(changes,List.of(new Guess(untouched,ChangeType.MOVED)),R);
        assertEquals(0,wrong.points());assertEquals(1,wrong.wrong());
        assertEquals(0,RoomScoring.score(changes,List.of(),R).points());
    }

    @Test void moveCountsFromEitherEndButOnlyOnce(){
        RoomGenerator.Round round=null;RoomChange move=null;
        for(long s=0;move==null;s++){round=RoomGenerator.generate(s,RoomDifficulty.EASY);move=round.changes().stream().filter(c->c.type()==ChangeType.MOVED).findFirst().orElse(null);}
        var c=round.changes();
        assertEquals(100,RoomScoring.score(c,List.of(new Guess(move.before().slotId(),ChangeType.MOVED)),R).points());
        assertEquals(100,RoomScoring.score(c,List.of(new Guess(move.after().slotId(),ChangeType.MOVED)),R).points());
        assertEquals(100,RoomScoring.score(c,List.of(new Guess(move.before().slotId(),ChangeType.MOVED),new Guess(move.after().slotId(),ChangeType.MOVED)),R).points());
    }

    @Test void missingAndNewObjectsAreSelectableByTheirPlaces(){
        boolean sawGone=false,sawNew=false;
        for(long s=0;s<200&&!(sawGone&&sawNew);s++){var round=RoomGenerator.generate(s,RoomDifficulty.MEDIUM);
            for(RoomChange c:round.changes()){
                if(c.type()==ChangeType.DISAPPEARED){sawGone=true;assertFalse(round.changed().occupied(c.before().slotId()));
                    assertEquals(100,RoomScoring.score(round.changes(),List.of(new Guess(c.before().slotId(),ChangeType.DISAPPEARED)),R).points());}
                if(c.type()==ChangeType.APPEARED){sawNew=true;assertFalse(round.original().occupied(c.after().slotId()));
                    assertEquals(100,RoomScoring.score(round.changes(),List.of(new Guess(c.after().slotId(),ChangeType.APPEARED)),R).points());}
            }}
        assertTrue(sawGone&&sawNew);
    }

    @Test void captionsAreGrammatical(){
        var gone=new RoomChange(ChangeType.DISAPPEARED,"clock",new RoomState.Placed("clock","mantel_1",false,0,false),null);
        assertEquals("СТАРИННЫЕ ЧАСЫ ИСЧЕЗЛИ",gone.captionRu());
        var lit=new RoomChange(ChangeType.TOGGLED,"lantern",new RoomState.Placed("lantern","floor_1",false,0,false),new RoomState.Placed("lantern","floor_1",false,0,true));
        assertEquals("ФОНАРЬ ЗАЖЁГСЯ САМ",lit.captionRu());
    }
}
