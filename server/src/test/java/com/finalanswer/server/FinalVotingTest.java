package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.game.*;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import java.util.*;
import java.util.concurrent.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

class FinalVotingTest {
    final List<String> ids=List.of("a","b","c","d");
    void fail(String code,Runnable call){assertEquals(code,assertThrows(RoomService.Failure.class,call::run).getMessage());}
    FinalVoting voting(){return new FinalVoting(new LinkedHashSet<>(ids),20_000);}
    @Test void validImmutableVote(){var v=voting();v.submit("a","b",1);assertEquals(1,v.submitted());assertEquals("b",v.ownVote("a"));
        fail("FINAL_VOTE_ALREADY_SUBMITTED",()->v.submit("a","c",2));assertEquals(1,v.submitted());}
    @Test void invalidSelfSpectatorAndDeadline(){var v=voting();fail("SELF_VOTE",()->v.submit("a","a",1));
        fail("INVALID_SUSPECT",()->v.submit("a","spectator",1));fail("NOT_ELIGIBLE",()->v.submit("spectator","a",1));
        fail("FINAL_VOTING_CLOSED",()->v.submit("a","b",20_000));assertEquals(0,v.submitted());}
    @Test void caughtAndExactlyOneStampPerVote(){var v=voting();v.submit("a","b",1);v.submit("b","a",1);v.submit("c","b",1);v.submit("d","b",1);
        var result=v.close("b");assertEquals(FinalVoting.Outcome.IMPOSTOR_CAUGHT,result.outcome());assertEquals(3,result.counts().get("b"));assertEquals(4,result.stampTargets().size());
        assertEquals(3,Collections.frequency(result.stampTargets(),"b"));assertSame(result,v.close("c"));
        assertThrows(UnsupportedOperationException.class,()->result.counts().put("a",9));assertThrows(UnsupportedOperationException.class,()->result.stampTargets().add("a"));
        fail("FINAL_VOTING_CLOSED",()->v.submit("d","a",3));}
    @Test void innocentSuspectEscapes(){var v=voting();v.submit("a","b",1);v.submit("c","b",1);assertEquals(FinalVoting.Outcome.IMPOSTOR_ESCAPED,v.close("d").outcome());}
    @Test void tieAndAllAbstainingAreNoConsensus(){var v=voting();v.submit("a","b",1);v.submit("b","a",1);
        var tied=v.close("a");assertEquals(FinalVoting.Outcome.NO_CONSENSUS,tied.outcome());assertEquals(List.of("a","b"),tied.leaders());
        var empty=voting().close("d");assertEquals(FinalVoting.Outcome.NO_CONSENSUS,empty.outcome());assertEquals(0,empty.stampTargets().size());assertEquals(4,empty.leaders().size());}
    @Test void timingConfigurationValidated(){assertThrows(IllegalArgumentException.class,()->new FinalVoting.Timing(0,20_000));
        assertThrows(IllegalArgumentException.class,()->new FinalVoting.Timing(30_000,300_001));}

    static final class Match {
        final ImpostorGameTest f=new ImpostorGameTest();
        Match(int count){f.start(count);f.advance(4000);
            for(int r=1;r<=3;r++){f.advance(20000);f.advance(500);f.advance(5000);f.advance(1);f.advance(1850);}
            assertEquals("EVIDENCE_REVIEW",s(f.mini(0),"phase"));
        }
        void vote(int voter,int suspect){f.rooms.command(f.peers.get(voter),Protocol.decode(Protocol.event("SUBMIT_FINAL_VOTE","vote",Map.of("roomCode",f.code,"sessionId",f.session,"suspectId",f.pid(suspect)))));}
        String phase(){return s(f.mini(0),"phase");}
    }
    @Test void discussionDeadlineAndEligibility(){var m=new Match(3);fail("FINAL_VOTING_CLOSED",()->m.vote(0,1));
        assertEquals(10000,m.f.mini(0).get("deadline").getAsLong()-m.f.clock.get());m.f.advance(9999);assertEquals("EVIDENCE_REVIEW",m.phase());
        m.f.advance(1);assertEquals("FINAL_VOTING",m.phase());assertEquals(20000,m.f.mini(0).get("deadline").getAsLong()-m.f.clock.get());
        fail("NOT_ELIGIBLE",()->m.vote(3,0));fail("SELF_VOTE",()->m.vote(0,0));}
    @Test void privateVotesUntilRevealAndIdentityAfterAnnouncement(){var m=new Match(3);m.f.advance(10000);m.vote(0,1);
        var publicState=obj(m.f.rooms.view(m.f.code)).getAsJsonObject("impostor");assertFalse(publicState.has("ownFinalVote"));assertFalse(publicState.has("finalVoteSnapshot"));assertFalse(publicState.has("revealedImpostorId"));
        assertEquals(m.f.pid(1),s(m.f.mini(0),"ownFinalVote"));assertFalse(m.f.mini(1).has("ownFinalVote"));
        m.vote(1,0);m.vote(2,1);assertEquals("VOTING_LOCKED",m.phase());assertFalse(m.f.mini(0).has("finalVoteSnapshot"));
        m.f.advance(700);assertEquals("FINAL_VOTE_REVEAL",m.phase());assertEquals(3,m.f.mini(0).getAsJsonObject("finalVoteSnapshot").getAsJsonArray("stampTargets").size());
        assertFalse(m.f.mini(0).has("revealedImpostorId"));assertFalse(m.f.mini(0).has("outcome"));
        m.f.advance(3000);assertEquals("SUSPECT_ANNOUNCEMENT",m.phase());assertFalse(m.f.mini(0).has("revealedImpostorId"));
        assertEquals(m.f.pid(1),m.f.mini(0).getAsJsonArray("leadingSuspects").get(0).getAsString());
        m.f.advance(3500);assertEquals("IMPOSTOR_REVEAL",m.phase());assertTrue(m.f.mini(0).has("revealedImpostorId"));
        String actual=m.f.players.stream().filter(p->{int i=m.f.players.indexOf(p);return i<3&&s(m.f.mini(i),"role").equals("IMPOSTOR");}).map(p->s(p,"selfId")).findFirst().orElseThrow();
        assertEquals(actual,s(m.f.mini(4),"revealedImpostorId"));assertEquals(actual.equals(m.f.pid(1))?"IMPOSTOR_CAUGHT":"IMPOSTOR_ESCAPED",s(m.f.mini(4),"outcome"));
        m.f.advance(4000);assertEquals("RESULT",m.phase());}
    @Test void timeoutAndDisconnectRetainFrozenVoters(){var m=new Match(4);m.f.advance(10000);m.vote(0,1);m.f.rooms.detach(m.f.peers.get(3).id());
        assertEquals(4,m.f.mini(0).get("finalEligibleCount").getAsInt());m.f.advance(20000);assertEquals("VOTING_LOCKED",m.phase());
        fail("FINAL_VOTING_CLOSED",()->m.vote(1,0));m.f.advance(700);
        assertEquals(1,m.f.mini(0).getAsJsonObject("finalVoteSnapshot").getAsJsonArray("stampTargets").size());}
    @Test void reconnectRestoresAcceptedVoteAndImmutableSnapshot(){var m=new Match(3);m.f.advance(10000);m.vote(0,1);m.f.rooms.detach(m.f.peers.getFirst().id());
        var replacement=new TestPeer();m.f.rooms.attach(m.f.code,s(m.f.players.getFirst(),"token"),replacement,"again");
        assertEquals(m.f.pid(1),s(replacement.latest().getAsJsonObject("impostor"),"ownFinalVote"));
        m.vote(1,0);m.vote(2,0);m.f.advance(700);
        var result=m.f.mini(1).get("finalVoteSnapshot");var another=new TestPeer();m.f.rooms.attach(m.f.code,s(m.f.players.getFirst(),"token"),another,"again2");
        assertEquals(result,another.latest().getAsJsonObject("impostor").get("finalVoteSnapshot"));}
    @Test void schemaRoomSessionAndAuthentication(){var m=new Match(3);m.f.advance(10000);
        var payload=new HashMap<String,Object>(Map.of("roomCode",m.f.code,"sessionId",m.f.session,"suspectId",m.f.pid(1)));
        fail("AUTH_REQUIRED",()->m.f.rooms.command(new TestPeer(),Protocol.decode(Protocol.event("SUBMIT_FINAL_VOTE","x",payload))));
        payload.put("voterId",m.f.pid(0));fail("INVALID_FINAL_VOTE",()->m.f.rooms.command(m.f.peers.getFirst(),Protocol.decode(Protocol.event("SUBMIT_FINAL_VOTE","x",payload))));
        payload.remove("voterId");payload.put("roomCode","OTHER");fail("WRONG_ROOM",()->m.f.rooms.command(m.f.peers.getFirst(),Protocol.decode(Protocol.event("SUBMIT_FINAL_VOTE","x",payload))));
        payload.put("roomCode",m.f.code);payload.put("sessionId","old");fail("STALE_IMPOSTOR_SESSION",()->m.f.rooms.command(m.f.peers.getFirst(),Protocol.decode(Protocol.event("SUBMIT_FINAL_VOTE","x",payload))));}
    @Test void concurrentVotesCloseExactlyOnce()throws Exception{var m=new Match(4);m.f.advance(10000);var pool=Executors.newFixedThreadPool(4);
        try{var barrier=new CyclicBarrier(4);var jobs=new ArrayList<Future<?>>();for(int i=0;i<4;i++){int voter=i;jobs.add(pool.submit(()->{try{barrier.await();m.vote(voter,(voter+1)%4);}catch(Exception e){throw new RuntimeException(e);}}));}for(var job:jobs)job.get();}
        finally{pool.shutdownNow();}assertEquals("VOTING_LOCKED",m.phase());assertEquals(4,m.f.mini(0).get("finalSubmittedCount").getAsInt());}
    @Test void newSessionHasNoOldBallots(){var first=new Match(3);first.f.advance(10000);first.vote(0,1);
        var next=new Match(4);next.f.advance(10000);assertNotEquals(first.f.session,next.f.session);assertEquals(0,next.f.mini(0).get("finalSubmittedCount").getAsInt());assertFalse(next.f.mini(0).has("ownFinalVote"));}
}
