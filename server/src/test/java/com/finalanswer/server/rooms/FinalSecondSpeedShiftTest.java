package com.finalanswer.server.rooms;

import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.rooms.FinalSecondSessionTest.*;

class FinalSecondSpeedShiftTest {
    FinalSecondSession session(long seed){var s=new FinalSecondSession(p(2),0,FinalSecondSession.Task.SPEED_SHIFT,new Random(seed));s.tick(runAt());return s;}
    Map<String,Object> started(FinalSecondSession s){s.start("p0","start",runAt(),null,runAt());return s.snapshot("p0",false,runAt());}
    long at(Map<String,Object> v){return ((Number)v.get("speedShiftAtMs")).longValue();}
    double rate(Map<String,Object> v){return ((Number)v.get("speedMultiplier")).doubleValue();}
    long deadline(Map<String,Object> v){return ((Number)v.get("myDeadlineAt")).longValue();}
    @Test void samplesOncePerRoundAndDoesNotExposeScheduleBeforeStartOrToOthers(){
        Set<Double> rates=new HashSet<>();Set<Long> points=new HashSet<>();
        for(int seed=0;seed<100;seed++){
            var s=session(seed);assertFalse(s.snapshot("p0",false,runAt()).containsKey("speedMultiplier"));
            var v=started(s);rates.add(rate(v));points.add(at(v));assertTrue(at(v)>=1400&&at(v)<=4200);
            assertFalse((boolean)v.get("blind"));assertEquals(7000L,v.get("visibleMs"));
            for(String id:List.of("p1","")){var other=s.snapshot(id,id.isEmpty(),runAt());assertFalse(other.containsKey("speedMultiplier"));assertFalse(other.containsKey("speedShiftAtMs"));}
            s.tick(runAt()+at(v)+500);assertEquals(rate(v),rate(s.snapshot("p0",false,runAt()+at(v)+500)));assertEquals(at(v),at(s.snapshot("p0",false,runAt()+at(v)+500)));
        }
        assertEquals(Set.of(.5,1.5,2.),rates);assertTrue(points.size()>80);
    }
    @Test void piecewiseIntegrationIsContinuousAndCorrectForEveryMultiplier(){
        Set<Double> covered=new HashSet<>();
        for(int seed=0;seed<40;seed++){
            var s=session(seed);var v=started(s);covered.add(rate(v));long real=at(v)+600;
            s.stop("p0","stop",real,runAt()+real);s.tick(runAt()+40_000);
            assertEquals(at(v)+Math.round(600*rate(v)),byId(s).get("p0").stoppedMs());
            var boundary=session(seed);var bv=started(boundary);boundary.stop("p0","stop",at(bv),runAt()+at(bv));boundary.tick(runAt()+40_000);assertEquals(at(bv),byId(boundary).get("p0").stoppedMs());
        }
        assertEquals(Set.of(.5,1.5,2.),covered);
    }
    @Test void stopsAtLimitWithoutAwardingPerfectScoreForNotPressing(){
        var s=session(8);var v=started(s);long end=deadline(v);
        s.tick(end-1);assertEquals(false,s.snapshot("p0",false,end-1).get("myStopped"));
        s.tick(end);var done=s.snapshot("p0",false,end);assertEquals(true,done.get("myStopped"));assertEquals(true,done.get("myTimedOut"));assertEquals(7000L,done.get("myStoppedMs"));
        s.tick(end+40_000);assertFalse(byId(s).get("p0").stopped());assertEquals(-1,byId(s).get("p0").errorMs());
    }
    @Test void compensatedStopUsesRealTimestampNotClientScaledClaim(){
        var s=session(8);var v=started(s);long pressed=deadline(v)-80;
        s.stop("p0","stop",999999L,pressed,null,pressed+200);s.tick(pressed+40_000);
        long real=pressed-runAt(),expected=Math.min(7000,Math.round(at(v)+(real-at(v))*rate(v)));
        assertEquals(expected,byId(s).get("p0").stoppedMs());assertTrue(byId(s).get("p0").stopped());
    }
    @Test void largeAndFineTicksAgreeAndPlayersHaveIndependentStarts(){
        var fine=session(21);var v=started(fine);var sparse=session(21);started(sparse);
        for(long t=runAt();t<deadline(v);t+=17)fine.tick(t);
        fine.tick(deadline(v));sparse.tick(deadline(v));assertEquals(fine.snapshot("p0",false,deadline(v)).get("myStoppedMs"),sparse.snapshot("p0",false,deadline(v)).get("myStoppedMs"));
        sparse.start("p1","start-later",deadline(v),null,deadline(v));var later=sparse.snapshot("p1",false,deadline(v));assertEquals(at(v),at(later));assertEquals(rate(v),rate(later));assertEquals(false,later.get("myStopped"));
    }
    @Test void newRoundResetsAllState(){var a=session(2);started(a);a.tick(runAt()+30_000);var b=session(3);var v=b.snapshot("p0",false,runAt());assertEquals(false,v.get("myStarted"));assertEquals(false,v.get("myStopped"));assertFalse(v.containsKey("myDeadlineAt"));assertNotEquals(a.id,b.id);}
}
