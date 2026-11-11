package com.finalanswer.server.rooms;

import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FinalSecondSessionTest {
    static final FinalSecondSession.Config C=FinalSecondSession.Config.DEFAULT;
    static long runAt(){return C.introMs()+C.targetRevealMs()+C.countdownMs();}
    static List<String> p(int n){List<String> o=new ArrayList<>();for(int i=0;i<n;i++)o.add("p"+i);return o;}
    static FinalSecondSession running(int n){var s=new FinalSecondSession(p(n),0);s.tick(runAt());assertEquals(FinalSecondSession.Phase.RUNNING,s.phase());return s;}
    static RoomService.Failure fails(Runnable r){return assertThrows(RoomService.Failure.class,r::run);}

    @Test void phasesInOrder(){
        var s=new FinalSecondSession(p(2),0);List<FinalSecondSession.Phase> seen=new ArrayList<>(List.of(s.phase()));
        for(long t=0;t<120_000;t+=50)if(s.tick(t))seen.add(s.phase());
        assertEquals(List.of(FinalSecondSession.Phase.values()),seen);
    }
    @Test void playerCount(){assertEquals(409,fails(()->new FinalSecondSession(p(1),0)).status);assertEquals(409,fails(()->new FinalSecondSession(p(9),0)).status);}

    @Test void latencyIsCompensatedWithinBounds(){
        var s=running(3);long t0=runAt();
        s.stop("p0","a",7000L,t0+7200);          // 200 ms late on the wire: the phone's 7.000 counts
        s.stop("p1","b",6000L,t0+7200);          // claims a press 1.2 s before arrival: clamped to arrival − 450
        s.stop("p2","c",9000L,t0+7200);          // claims a press after arrival: clamped to arrival
        s.tick(t0+60_000);
        var r=byId(s);assertEquals(7000,r.get("p0").stoppedMs());assertEquals(7200-C.maxCompensationMs(),r.get("p1").stoppedMs());assertEquals(7200,r.get("p2").stoppedMs());
    }
    @Test void oneStopEachNoEarlyNoLate(){
        var s=new FinalSecondSession(p(2),0);
        assertEquals("FS_NOT_STARTED",fails(()->s.stop("p0","x",1000L,10)).getMessage());
        s.tick(runAt());long t0=runAt();
        assertTrue(s.stop("p0","a",5000L,t0+5000));assertFalse(s.stop("p0","a",5000L,t0+5000),"resent request ignored");
        assertEquals("FS_ALREADY_STOPPED",fails(()->s.stop("p0","b",5100L,t0+5100)).getMessage());
        assertEquals(403,fails(()->s.stop("stranger","c",5000L,t0+5000)).status);
        s.tick(t0+C.targetMs()+C.graceAfterTargetMs()+1);
        assertEquals("FS_CLOSED",fails(()->s.stop("p1","d",9000L,t0+20_000)).getMessage());
    }
    @Test void rankingByErrorTiesShareRankWorstEliminated(){
        var s=running(4);long t0=runAt();
        s.stop("p0","a",6980L,t0+7000);s.stop("p1","b",7020L,t0+7050);s.stop("p2","c",7150L,t0+7200);   // p3 never stops
        s.tick(t0+60_000);var rows=s.results();
        assertEquals(List.of("p0","p1","p2","p3"),rows.stream().map(FinalSecondSession.Result::playerId).toList());
        assertEquals(1,rows.get(0).rank());assertEquals(1,rows.get(1).rank(),"equal 20 ms errors tie");
        assertTrue(rows.get(3).eliminated());assertFalse(rows.get(3).stopped());
        assertEquals(1,rows.stream().filter(FinalSecondSession.Result::eliminated).count());
    }
    @Test void tieAtTheCutOffSparesEveryone(){
        var s=running(2);long t0=runAt();s.stop("p0","a",6900L,t0+7000);s.stop("p1","b",7100L,t0+7200);s.tick(t0+60_000);
        assertTrue(s.results().stream().noneMatch(FinalSecondSession.Result::eliminated));
    }
    @Test void timesStayHiddenUntilReveal(){
        var s=running(2);long t0=runAt();s.stop("p0","a",7000L,t0+7000);
        var v=s.snapshot("p1",false,t0+7001);assertFalse(v.containsKey("results"));assertEquals(List.of("p0"),v.get("stopped"));
        assertEquals(true,s.snapshot("p0",false,t0+7001).get("myStopped"));assertFalse(s.snapshot("",true,t0+7001).containsKey("results"));
    }
    @Test void disconnectedPlayersDoNotBlock(){
        var s=running(3);long t0=runAt();s.stop("p0","a",7000L,t0+7000);s.stop("p1","b",7000L,t0+7000);
        assertFalse(s.everyoneStopped(List.of("p0","p1","p2"),t0+7001));assertTrue(s.everyoneStopped(List.of("p0","p1"),t0+7001));
    }
    @Test void blindTaskNeverShowsTheTimerAndIsDealtFairly(){
        var s=new FinalSecondSession(p(2),0,true);assertEquals(0L,s.snapshot("p0",false,0).get("visibleMs"));assertEquals(true,s.snapshot("p0",false,0).get("blind"));
        var bag=new FinalSecondSession.TaskBag();var r=new Random(3);int blind=0,run=0;Boolean prev=null;
        for(int i=0;i<200;i++){boolean b=bag.draw(r);if(b)blind++;run=prev!=null&&prev==b?run+1:1;prev=b;assertTrue(run<=2,"never three alike in a row");}
        assertTrue(blind>80&&blind<120,"about half of the rounds are blind");
    }
    static Map<String,FinalSecondSession.Result> byId(FinalSecondSession s){Map<String,FinalSecondSession.Result> m=new HashMap<>();for(var r:s.results())m.put(r.playerId(),r);return m;}
}
