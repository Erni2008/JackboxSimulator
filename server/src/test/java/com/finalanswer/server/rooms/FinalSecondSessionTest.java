package com.finalanswer.server.rooms;

import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FinalSecondSessionTest {
    static final FinalSecondSession.Config C=FinalSecondSession.Config.DEFAULT;
    static long runAt(){return C.introMs()+C.targetRevealMs()+C.countdownMs();}
    static List<String> p(int n){List<String> o=new ArrayList<>();for(int i=0;i<n;i++)o.add("p"+i);return o;}
    static FinalSecondSession running(int n){var s=new FinalSecondSession(p(n),0);s.tick(runAt());assertEquals(FinalSecondSession.Phase.RUNNING,s.phase());for(String member:s.seats)s.start(member,"start-"+member,runAt(),null,runAt());return s;}
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
        s.tick(runAt());long t0=runAt();s.start("p0","start",t0,null,t0);s.start("p1","start-p1",t0,null,t0);
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
        var bag=new FinalSecondSession.TaskBag();var random=new Random(3);var counts=new EnumMap<FinalSecondSession.Task,Integer>(FinalSecondSession.Task.class);FinalSecondSession.Task previous=null;
        for(int i=0;i<400;i++){var task=bag.drawTask(random);counts.merge(task,1,Integer::sum);assertNotEquals(previous,task,"no identical adjacent tasks");previous=task;}
        for(var task:FinalSecondSession.Task.values())assertEquals(100,counts.get(task));
    }
    @Test void everyTaskRequiresStartThenStopAndKeepsPersonalTime(){
        var s=new FinalSecondSession(p(2),0);long t=runAt();s.tick(t);
        assertEquals("FS_TIMER_NOT_STARTED",fails(()->s.stop("p0","early",0L,t)).getMessage());
        s.start("p0","start-a",t+1000,null,t+1000);s.start("p1","start-b",t+3000,null,t+3000);
        s.stop("p0","stop-a",7000L,t+8000);s.stop("p1","stop-b",7000L,t+10_000);s.tick(t+11_000);
        assertEquals(0,byId(s).get("p0").errorMs());assertEquals(0,byId(s).get("p1").errorMs());
    }
    @Test void individualStartInstantIsPrivateAndIdempotent(){
        var s=new FinalSecondSession(p(2),0);long t=runAt();s.tick(t);
        assertTrue(s.start("p0","same",t,null,t));assertFalse(s.start("p0","same",t,null,t+100));
        assertTrue(s.start("p1","same",t+100,null,t+100),"request IDs are scoped per player");
        assertEquals(t,s.snapshot("p0",false,t+100).get("myStartedAt"));
        assertFalse(s.snapshot("",true,t+100).containsKey("myStartedAt"));
        assertEquals("FS_ALREADY_STARTED",fails(()->s.start("p0","again",t+100,null,t+100)).getMessage());
    }
    static FinalSecondSession chain(){var s=new FinalSecondSession(p(2),0,FinalSecondSession.Task.CHAIN);s.tick(runAt()+1000);assertEquals(FinalSecondSession.Phase.RUNNING,s.phase());return s;}
    @Test void chainPausesBetweenPlayersAndEliminatesOnlyTheOneWhoCrosses(){
        var s=chain();long t=runAt()+1000;
        s.start("p0","s0",t,1,t);s.stop("p0","e0",null,t+600,1,t+600);
        var paused=s.snapshot("p1",false,t+9000);assertEquals("p1",paused.get("activePlayer"));assertEquals(false,paused.get("turnRunning"));assertFalse(paused.containsKey("chainTotalMs"));assertEquals(-1L,paused.get("phaseEndsAt"));
        assertFalse(s.everyoneStopped(List.of("p0","p1"),t+9000));
        s.start("p1","s1",t+10_000,2,t+10_000);s.stop("p1","e1",null,t+10_800,2,t+10_800);
        s.start("p0","s2",t+11_000,3,t+11_000);s.stop("p0","e2",null,t+11_900,3,t+11_900);
        assertEquals(FinalSecondSession.Phase.REVEAL,s.phase());assertEquals(2300L,s.snapshot("",true,t+12_000).get("chainTotalMs"));
        assertTrue(byId(s).get("p0").eliminated());assertFalse(byId(s).get("p1").eliminated());assertEquals(1,s.results().stream().filter(FinalSecondSession.Result::eliminated).count());
    }
    @Test void chainRejectsOutOfTurnAndStaleTokensAndIgnoresRetransmission(){
        var s=chain();long t=runAt()+1000;
        assertEquals("FS_NOT_YOUR_TURN",fails(()->s.start("p1","bad",t,1,t)).getMessage());
        s.start("p0","a",t,1,t);assertEquals("FS_ALREADY_STARTED",fails(()->s.start("p0","b",t,1,t)).getMessage());
        s.stop("p0","c",null,t+200,1,t+200);assertFalse(s.stop("p0","c",null,t+200,1,t+300));
        assertEquals("FS_STALE_TURN",fails(()->s.start("p0","d",t+400,1,t+400)).getMessage());assertEquals(2,s.snapshot("p1",false,t+400).get("turnId"));
    }
    @Test void chainAllowsTheExactBoundaryButOneMoreMillisecondLoses(){
        var s=chain();long t=runAt()+1000;s.start("p0","s",t,1,t);s.stop("p0","e",null,t+2000,1,t+2200);
        assertEquals(FinalSecondSession.Phase.RUNNING,s.phase());s.start("p1","s1",t+2300,2,t+2300);s.stop("p1","e1",null,t+2301,2,t+2400);
        assertTrue(byId(s).get("p1").eliminated());assertEquals(2001L,s.snapshot("",true,t+2400).get("chainTotalMs"));
    }
    @Test void chainAutomaticallyResolvesAPlayerWhoDoesNotStopOrStart(){
        var s=chain();long t=runAt()+1000;s.start("p0","s",t,1,t);s.tick(t+2001+C.maxCompensationMs());
        assertEquals(FinalSecondSession.Phase.REVEAL,s.phase());assertTrue(byId(s).get("p0").eliminated());assertEquals("LIMIT",s.snapshot("",true,t+3000).get("lossReason"));
        var idle=chain();idle.tick(idle.runStart()+FinalSecondSession.CHAIN_WAIT_MS);assertTrue(byId(idle).get("p0").eliminated());assertEquals("NO_START",idle.snapshot("",true,t+20_000).get("lossReason"));
    }
    @Test void chainUsesBoundedSyncedTimestampsAndKeepsTotalsHidden(){
        var s=chain();long t=runAt()+1000;s.start("p0","s",t,1,t+200);s.stop("p0","e",null,t+500,1,t+800);
        for(String member:List.of("p0","p1","")){
            var v=s.snapshot(member,member.isEmpty(),t+900);assertFalse(v.containsKey("turnHistory"));assertFalse(v.containsKey("chainTotalMs"));assertFalse(v.containsKey("runStart"));
        }
        s.start("p1","s1",t+1000,2,t+1000);s.stop("p1","e1",null,t+2501,2,t+2501);assertEquals(2001L,s.snapshot("",true,t+2501).get("chainTotalMs"));
    }
    static Map<String,FinalSecondSession.Result> byId(FinalSecondSession s){Map<String,FinalSecondSession.Result> m=new HashMap<>();for(var r:s.results())m.put(r.playerId(),r);return m;}
}
