package com.finalanswer.server.rooms;

import com.erni.finalanswer.gameplay.forgottenroom.*;
import com.erni.finalanswer.gameplay.forgottenroom.RoomScoring.Guess;
import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ForgottenRoomSessionTest {
    private static final ForgottenRoomSession.Timing T=ForgottenRoomSession.Timing.DEFAULT;
    private static List<String> players(int n){List<String> out=new ArrayList<>();for(int i=0;i<n;i++)out.add("p"+i);return out;}
    private static long answeringAt(){return T.introMs()+T.observationMs()+T.blackoutMs()+T.changedMs()+1;}
    private static ForgottenRoomSession atAnswers(int players,RoomDifficulty d){var s=new ForgottenRoomSession(players(players),d,99,0);s.tick(answeringAt());assertEquals(ForgottenRoomSession.Phase.ANSWER_PHASE,s.phase());return s;}
    private static List<Guess> perfect(ForgottenRoomSession s){return s.round().changes().stream().map(c->new Guess(c.slots().iterator().next())).toList();}
    @SuppressWarnings("unchecked") private static List<Map<String,Object>> list(Map<String,Object> v,String k){return (List<Map<String,Object>>)v.get(k);}
    private static RoomService.Failure fails(Runnable r){return assertThrows(RoomService.Failure.class,r::run);}

    @Test void phasesRunInOrderOnTheServerClock(){
        var s=new ForgottenRoomSession(players(2),RoomDifficulty.EASY,1,0);
        long t=0;List<ForgottenRoomSession.Phase> seen=new ArrayList<>(List.of(s.phase()));
        for(;t<200_000;t+=50){if(s.tick(t))seen.add(s.phase());}
        assertEquals(List.of(ForgottenRoomSession.Phase.values()),seen);
        assertEquals(T.observationMs(),10_000);
    }

    @Test void playerCountIsTwoToEight(){
        assertEquals(409,fails(()->new ForgottenRoomSession(players(1),RoomDifficulty.EASY,1,0)).status);
        assertEquals(409,fails(()->new ForgottenRoomSession(players(9),RoomDifficulty.EASY,1,0)).status);
        for(int n:new int[]{2,8}){var s=atAnswers(n,RoomDifficulty.HARD);for(String p:players(n))assertTrue(s.submit(p,"r"+p,perfect(s),answeringAt()+5));
            s.tick(answeringAt()+T.earlyCloseMs()+10);assertEquals(ForgottenRoomSession.Phase.REVEAL,s.phase());
            for(String p:players(n))assertEquals(s.round().changes().size(),s.results().get(p).points());}
    }

    @Test void theChangedRoomAndTheKeyNeverLeakEarly(){
        var s=new ForgottenRoomSession(players(3),RoomDifficulty.MEDIUM,5,0);
        var originalIds=s.round().original().bySlot().values().stream().map(RoomState.Placed::objectId).sorted().toList();
        for(long t:new long[]{0,T.introMs()+10,T.introMs()+T.observationMs()-1}){s.tick(t);
            for(boolean host:new boolean[]{true,false}){var v=s.snapshot(host?"":"p0",host,t);
                assertEquals(originalIds,list(v,"objects").stream().map(o->(String)o.get("id")).sorted().toList(),"only the original before the blackout");
                assertFalse(v.containsKey("changes"));assertFalse(v.containsKey("original"));assertFalse(v.containsKey("results"));}}
        s.tick(T.introMs()+T.observationMs()+10);assertEquals(ForgottenRoomSession.Phase.BLACKOUT,s.phase());
        assertTrue(list(s.snapshot("",true,0),"objects").isEmpty(),"darkness shows nothing");
        s.tick(answeringAt());var v=s.snapshot("p0",false,answeringAt());
        assertFalse(v.containsKey("changes"),"no answer key while answering");
        s.submit("p1","a",perfect(s),answeringAt()+1);
        var other=s.snapshot("p0",false,answeringAt()+2);assertFalse(other.containsKey("myAnswers"),"nobody sees another player's answers");
        assertEquals(List.of("p1"),other.get("submitted"));
        assertTrue(s.snapshot("p1",false,answeringAt()+2).containsKey("myAnswers"),"own answers survive a reconnect");
    }

    @Test void submissionsAreValidatedOnTheServer(){
        var s=atAnswers(3,RoomDifficulty.EASY);long now=answeringAt()+10;var key=s.round().changes();
        assertEquals(403,fails(()->s.submit("intruder","x1",List.of(),now)).status);
        List<Guess> tooMany=new ArrayList<>();for(var slot:s.round().layout().slots().subList(0,RoomScoring.MARKS+1))tooMany.add(new Guess(slot.id()));
        assertEquals(400,fails(()->s.submit("p0","x2",tooMany,now)).status);
        assertEquals(400,fails(()->s.submit("p0","x3",List.of(new Guess("nowhere")),now)).status);
        String place=s.round().layout().slots().get(0).id();
        assertEquals(400,fails(()->s.submit("p0","x4",List.of(new Guess(place),new Guess(place)),now)).status);
        assertTrue(s.submit("p0","ok",perfect(s),now));
        assertFalse(s.submit("p0","ok",perfect(s),now),"a resent request is ignored, not double counted");
        assertEquals(409,fails(()->s.submit("p0","again",List.of(),now)).status);
        assertTrue(s.submit("p1","empty",List.of(),now),"an empty answer is allowed and scores zero");
    }

    @Test void lateAnswersAreRefusedAndTimeoutScoresWhatArrived(){
        var s=atAnswers(2,RoomDifficulty.EASY);long late=answeringAt()+T.answerMs()+5;
        assertTrue(s.submit("p0","a",perfect(s),answeringAt()+100));
        assertEquals(409,fails(()->s.submit("p1","b",perfect(s),late)).status);
        assertEquals(ForgottenRoomSession.Phase.REVEAL,s.phase());
        assertEquals(s.round().changes().size(),s.results().get("p0").points());
        assertEquals(0,s.results().get("p1").points());
    }

    @Test void disconnectedPlayersDoNotHoldTheRoomHostage(){
        var s=atAnswers(3,RoomDifficulty.EASY);long now=answeringAt()+10;
        s.submit("p0","a",perfect(s),now);s.submit("p1","b",List.of(),now);
        assertFalse(s.everyoneAnswered(List.of("p0","p1","p2"),now),"p2 is still connected and thinking");
        assertTrue(s.everyoneAnswered(List.of("p0","p1"),now),"p2 dropped: close early");
        s.tick(now+T.earlyCloseMs()+1);assertEquals(ForgottenRoomSession.Phase.REVEAL,s.phase());
        assertEquals(0,s.results().get("p2").points());
    }

    @Test void revealCarriesTheKeyWhoFoundWhatAndARanking(){
        var s=atAnswers(3,RoomDifficulty.MEDIUM);long now=answeringAt()+10;var key=s.round().changes();
        String place=key.get(0).slots().iterator().next();
        String empty=s.round().layout().slots().stream().map(RoomCatalog.Slot::id).filter(x->key.stream().noneMatch(c->c.slots().contains(x))).findFirst().orElseThrow();
        s.submit("p2","c",List.of(new Guess(empty)),now);            // 0
        s.submit("p0","a",perfect(s),now+500);                       // all
        s.submit("p1","b",List.of(new Guess(place)),now+900);        // 1
        s.tick(now+5_000);
        var v=s.snapshot("p1",false,now+5_000);var changes=list(v,"changes");
        assertEquals(key.size(),changes.size());
        assertEquals(List.of("p0","p1"),changes.get(0).get("foundBy"));
        assertEquals(key.get(0).captionRu(),changes.get(0).get("caption"));
        var table=list(v,"results");
        assertEquals(List.of("p0","p1","p2"),table.stream().map(r->r.get("playerId")).toList());
        assertEquals(List.of(1,2,3),table.stream().map(r->r.get("rank")).toList());
        assertEquals(key.size(),table.get(0).get("points"));
    }

    @Test void equalScoresBreakTiesByEarlierSubmission(){
        var s=atAnswers(3,RoomDifficulty.EASY);long now=answeringAt()+10;
        s.submit("p2","c",perfect(s),now);s.submit("p0","a",perfect(s),now+300);s.submit("p1","b",perfect(s),now+600);
        s.tick(now+5_000);assertEquals(List.of("p2","p0","p1"),s.ranking());
    }
}
