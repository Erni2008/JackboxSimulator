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
            // a small art library caps the room: every placed object needs art, and two stay in reserve for «appeared»
            int library=(int)RoomCatalog.OBJECTS.stream().filter(o->d.sizes.contains(o.size())).count();
            int expectedMin=Math.min(d.minObjects,Math.min(round.layout().slots().size()-6,library-2));
            assertTrue(round.original().size()>=expectedMin&&round.original().size()<=d.maxObjects,d+" objects "+round.original().size());
            assertTrue(round.changes().size()>=d.minChanges&&round.changes().size()<=d.maxChanges,d+" changes");
            assertEquals(RoomScoring.MARKS,round.guessLimit());
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

    @Test void aMarkOnAChangedPlaceScoresOneAndAnywhereElseNothing(){
        var round=RoomGenerator.generate(7,RoomDifficulty.HARD);var changes=round.changes();var first=changes.get(0);
        String place=first.slots().iterator().next();
        var hit=RoomScoring.score(changes,List.of(new Guess(place)),R);
        assertEquals(1,hit.points());assertEquals(1,hit.correct());
        assertEquals(1,RoomScoring.score(changes,List.of(new Guess(place),new Guess(place)),R).points(),"the same place twice counts once");
        String untouched=round.layout().slots().stream().map(RoomCatalog.Slot::id).filter(s->changes.stream().noneMatch(c->c.slots().contains(s))).findFirst().orElseThrow();
        var miss=RoomScoring.score(changes,List.of(new Guess(untouched)),R);
        assertEquals(0,miss.points());assertEquals(1,miss.wrong());
        assertEquals(0,RoomScoring.score(changes,List.of(),R).points());
        List<Guess> all=changes.stream().map(c->new Guess(c.slots().iterator().next())).toList();
        assertEquals(changes.size(),RoomScoring.score(changes,all,R).points(),"every change found = one point each");
    }

    @Test void moveCountsFromEitherEndButOnlyOnce(){
        RoomGenerator.Round round=null;RoomChange move=null;
        for(long s=0;move==null;s++){round=RoomGenerator.generate(s,RoomDifficulty.EASY);move=round.changes().stream().filter(c->c.type()==ChangeType.MOVED).findFirst().orElse(null);}
        var c=round.changes();
        assertEquals(1,RoomScoring.score(c,List.of(new Guess(move.before().slotId())),R).points());
        assertEquals(1,RoomScoring.score(c,List.of(new Guess(move.after().slotId())),R).points());
        assertEquals(1,RoomScoring.score(c,List.of(new Guess(move.before().slotId()),new Guess(move.after().slotId())),R).points());
    }

    @Test void missingAndNewObjectsAreSelectableByTheirPlaces(){
        boolean sawGone=false,sawNew=false;
        for(long s=0;s<200&&!(sawGone&&sawNew);s++){var round=RoomGenerator.generate(s,RoomDifficulty.MEDIUM);
            for(RoomChange c:round.changes()){
                if(c.type()==ChangeType.DISAPPEARED){sawGone=true;assertFalse(round.changed().occupied(c.before().slotId()));
                    assertEquals(1,RoomScoring.score(round.changes(),List.of(new Guess(c.before().slotId())),R).points());}
                if(c.type()==ChangeType.APPEARED){sawNew=true;assertFalse(round.original().occupied(c.after().slotId()));
                    assertEquals(1,RoomScoring.score(round.changes(),List.of(new Guess(c.after().slotId())),R).points());}
            }}
        assertTrue(sawGone&&sawNew);
    }

    @Test void objectsOnlyStandWhereTheSetDresserPutThem(){
        for(var l:RoomCatalog.LAYOUTS)for(var e:l.staging().entrySet())for(String spot:e.getValue())
            assertTrue(RoomCatalog.object(e.getKey()).surfaces().contains(l.slot(spot).surface()),e.getKey()+" cannot stand on "+spot);
        for(RoomDifficulty d:RoomDifficulty.values())for(long seed=0;seed<300;seed++){var round=RoomGenerator.generate(seed,d);
            for(var st:List.of(round.original(),round.changed()))for(var p:st.bySlot().values())
                assertTrue(round.layout().spots(p.objectId()).contains(p.slotId()),p.objectId()+" dumped on "+p.slotId());}
    }

    @Test void everyObjectInRoundsHasArt(){
        for(var def:RoomCatalog.OBJECTS){
            boolean art=new java.io.File("../assets/forgotten_room/objects/"+def.id()+".png").exists()||new java.io.File("../assets/forgotten_room/objects/"+def.id()+"_v0.png").exists();
            assertTrue(art,"missing art for "+def.id());}
        for(var l:RoomCatalog.LAYOUTS)assertTrue(new java.io.File("../assets/"+l.background()).exists(),"missing background "+l.background());
    }

    @Test void captionsAreGrammatical(){
        var gone=new RoomChange(ChangeType.DISAPPEARED,"clock",new RoomState.Placed("clock","mantel_1",false,0,false),null);
        assertEquals("НАПОЛЬНЫЕ ЧАСЫ ИСЧЕЗЛИ",gone.captionRu());
        var lit=new RoomChange(ChangeType.TOGGLED,"candelabra",new RoomState.Placed("candelabra","table_1",false,0,false),new RoomState.Placed("candelabra","table_1",false,0,true));
        assertEquals("КАНДЕЛЯБР ЗАЖЁГСЯ САМ",lit.captionRu());
        var doll=new RoomChange(ChangeType.ROTATED,"doll",new RoomState.Placed("doll","shelf_1",false,0,false),new RoomState.Placed("doll","shelf_1",true,0,false));
        assertEquals("ЖУТКАЯ КУКЛА УПАЛА НА БОК",doll.captionRu());
        var skull=new RoomChange(ChangeType.ROTATED,"skull",new RoomState.Placed("skull","shelf_2",false,0,false),new RoomState.Placed("skull","shelf_2",true,0,false));
        assertEquals("ЧЕРЕП ОТВЕРНУЛСЯ",skull.captionRu());
    }
}
