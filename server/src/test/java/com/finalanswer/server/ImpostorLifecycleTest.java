package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.game.ImpostorResultPolicy;
import com.erni.finalanswer.gameplay.impostor.ImpostorMatchResult;
import com.google.gson.*;
import java.util.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

/** Stage 7 through the same authenticated command path used by WebSockets. */
class ImpostorLifecycleTest {
    static class Match {
        final ImpostorGameTest f=new ImpostorGameTest();
        final int count;
        Match(int count){this.count=count;f.start(count);}
        String phase(){return s(f.mini(0),"phase");}
        void action(String type){action(f.hostPeer,type,f.session);}
        void action(TestPeer peer,String type,String session){f.rooms.command(peer,Protocol.decode(Protocol.event(type,UUID.randomUUID().toString(),Map.of("roomCode",f.code,"sessionId",session))));}
        void toVoting(){
            f.advance(com.finalanswer.server.game.ImpostorSession.ROLE_MILLIS);
            for(int round=1;round<=3;round++){
                f.submit(0,round,List.of("СВЕТ","ЛУНА","ВЕТЕР").get(round-1));
                f.advance(20000);f.advance(500);f.advance(5000);f.advance(1);f.advance(1850);
            }
            assertEquals("EVIDENCE_REVIEW",phase());assertFalse(f.mini(0).has("result"));f.advance(30000);
        }
        int impostor(){for(int i=0;i<count;i++)if(s(f.mini(i),"role").equals("IMPOSTOR"))return i;throw new AssertionError();}
        void finish(String outcome){
            toVoting();int actual=impostor(),target=outcome.equals("IMPOSTOR_CAUGHT")?actual:(actual+1)%count;
            if(!outcome.equals("NO_CONSENSUS"))for(int i=0;i<count;i++){
                int suspect=i==target?(target+1)%count:target;
                f.rooms.command(f.peers.get(i),Protocol.decode(Protocol.event("SUBMIT_FINAL_VOTE","v",Map.of("roomCode",f.code,"sessionId",f.session,"suspectId",f.pid(suspect)))));
            }
            else f.advance(20000);
            f.advance(com.finalanswer.server.game.FinalVoting.LOCK_MILLIS);f.advance(5000);f.advance(com.finalanswer.server.game.FinalVoting.ANNOUNCEMENT_MILLIS);assertFalse(f.mini(0).has("result"));f.advance(com.finalanswer.server.game.FinalVoting.IDENTITY_MILLIS);
            assertEquals("RESULT",phase());assertEquals(outcome,result().outcome());
        }
        ImpostorMatchResult result(){return Protocol.JSON.fromJson(f.mini(0).get("result"),ImpostorMatchResult.class);}
        void replay(){action("REPLAY_IMPOSTOR");f.session=s(f.mini(0),"sessionId");}
        void start(){action("START_IMPOSTOR");}
    }
    void failure(String code,Runnable action){assertEquals(code,assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,action::run).getMessage());}
    @Test void caughtAndInnocentVictory(){checkOutcome("IMPOSTOR_CAUGHT",ImpostorMatchResult.Side.INNOCENTS);}
    @Test void escapedAndImpostorVictory(){checkOutcome("IMPOSTOR_ESCAPED",ImpostorMatchResult.Side.IMPOSTOR);}
    @Test void noConsensusAndImpostorVictory(){checkOutcome("NO_CONSENSUS",ImpostorMatchResult.Side.IMPOSTOR);}
    void checkOutcome(String outcome,ImpostorMatchResult.Side side){var m=new Match(4);m.finish(outcome);var result=m.result();assertEquals(side,result.winningSide());
        for(var p:result.participants())assertEquals(p.role().equals("IMPOSTOR")== (side==ImpostorMatchResult.Side.IMPOSTOR),p.winner());}
    @Test void noConsensusPolicyConfigurable(){assertEquals(ImpostorMatchResult.Side.INNOCENTS,new ImpostorResultPolicy(false).winner(com.finalanswer.server.game.FinalVoting.Outcome.NO_CONSENSUS));}
    @Test void spectatorsHaveNoPersonalResult(){var m=new Match(3);m.finish("IMPOSTOR_CAUGHT");assertNull(m.result().participant(m.f.pid(3)));assertNull(m.result().participant(s(m.f.host,"selfId")));assertEquals(3,m.result().participants().size());}
    @Test void statisticsCluesAndHistoryAreAuthoritative(){var m=new Match(3);m.finish("IMPOSTOR_ESCAPED");var r=m.result();
        assertEquals(new ImpostorMatchResult.Statistics(3,3,3,3,0),r.statistics());assertEquals(3,r.ballots().size());assertTrue(r.abstentions().isEmpty());
        for(int round=0;round<3;round++){assertEquals(List.of("СВЕТ","ЛУНА","ВЕТЕР").get(round),r.clueRounds().get(round).get(m.f.pid(0)));assertEquals("—",r.clueRounds().get(round).get(m.f.pid(1)));}
        for(var p:r.participants())assertEquals(Collections.frequency(new ArrayList<>(r.ballots().values()),p.playerId()),p.votesReceived());
        assertThrows(UnsupportedOperationException.class,()->r.ballots().clear());assertThrows(UnsupportedOperationException.class,()->r.clueRounds().getFirst().clear());assertThrows(UnsupportedOperationException.class,()->r.participants().clear());}
    @Test void abstentionsNeverInventVotes(){var m=new Match(3);m.finish("NO_CONSENSUS");assertEquals(0,m.result().statistics().validVotes());assertEquals(3,m.result().abstentions().size());assertTrue(m.result().ballots().isEmpty());}
    @Test void replayResetsAllMatchDataAndPreservesRoom(){var m=new Match(3);m.finish("IMPOSTOR_CAUGHT");var before=m.f.hostPeer.latest().deepCopy();String old=m.f.session;m.replay();assertNotEquals(old,m.f.session);assertEquals("REPLAY_PREPARATION",m.phase());
        var mini=m.f.mini(0);for(String key:List.of("role","secretWord","result","ownClue","ownFinalVote","finalVoteSnapshot","revealedImpostorId","outcome"))assertFalse(mini.has(key),key);
        assertEquals(0,mini.get("round").getAsInt());assertEquals(0,mini.get("deadline").getAsLong());assertTrue(mini.getAsJsonArray("revealedClues").isEmpty());
        for(String key:List.of("code","roomId","players","roomSettings","selfId","host"))assertEquals(before.get(key),m.f.hostPeer.latest().get(key),key);
        m.start();assertEquals("ROLE_REVEAL",m.phase());assertEquals(1,java.util.stream.IntStream.range(0,3).filter(i->s(m.f.mini(i),"role").equals("IMPOSTOR")).count());}
    @Test void replayAndLobbyRequireHost(){var m=new Match(3);m.finish("NO_CONSENSUS");for(String type:List.of("REPLAY_IMPOSTOR","IMPOSTOR_RETURN_TO_LOBBY","START_IMPOSTOR"))failure("HOST_ONLY",()->m.action(m.f.peers.getFirst(),type,m.f.session));}
    @Test void activeReplayRejected(){var m=new Match(3);failure("INVALID_PHASE",()->m.action("REPLAY_IMPOSTOR"));failure("INVALID_PHASE",()->m.action("IMPOSTOR_RETURN_TO_LOBBY"));}
    @Test void duplicateReplayAndStaleEventsRejected(){var m=new Match(3);m.finish("NO_CONSENSUS");String old=m.f.session;m.replay();failure("STALE_IMPOSTOR_SESSION",()->m.action(m.f.hostPeer,"REPLAY_IMPOSTOR",old));failure("INVALID_PHASE",()->m.action("REPLAY_IMPOSTOR"));m.start();
        failure("STALE_IMPOSTOR_SESSION",()->m.f.rooms.command(m.f.peers.getFirst(),Protocol.decode(Protocol.event("SUBMIT_FINAL_VOTE","stale",Map.of("roomCode",m.f.code,"sessionId",old,"suspectId",m.f.pid(1))))));}
    @Test void resultsReconnectRestoresExactlyOneIdentity(){var m=new Match(3);m.finish("IMPOSTOR_CAUGHT");var result=m.f.mini(0).get("result");var peer=new TestPeer();m.f.rooms.detach(m.f.peers.getFirst().id());m.f.rooms.attach(m.f.code,s(m.f.players.getFirst(),"token"),peer,"reconnect");assertEquals(result,peer.latest().getAsJsonObject("impostor").get("result"));assertEquals(5,peer.latest().getAsJsonArray("players").size());}
    @Test void replayReconnectNeverRestoresOldRoles(){var m=new Match(3);m.finish("NO_CONSENSUS");m.replay();var peer=new TestPeer();m.f.rooms.attach(m.f.code,s(m.f.players.getFirst(),"token"),peer,"reconnect");var mini=peer.latest().getAsJsonObject("impostor");assertEquals("REPLAY_PREPARATION",s(mini,"phase"));assertFalse(mini.has("role"));assertFalse(mini.has("result"));m.start();assertEquals(m.f.session,s(peer.latest().getAsJsonObject("impostor"),"sessionId"));}
    @Test void threeConsecutiveMatchesSameRoom(){var m=new Match(4);String code=m.f.code;Set<String> sessions=new HashSet<>();for(String outcome:List.of("IMPOSTOR_CAUGHT","NO_CONSENSUS","IMPOSTOR_ESCAPED")){assertTrue(sessions.add(m.f.session));m.finish(outcome);assertEquals(code,s(m.f.hostPeer.latest(),"code"));assertEquals(6,m.f.hostPeer.latest().getAsJsonArray("players").size());m.replay();m.start();}}
    @Test void lobbySynchronizesAndCanStartAgain(){var m=new Match(3);m.finish("NO_CONSENSUS");String old=m.f.session;m.action("IMPOSTOR_RETURN_TO_LOBBY");for(var peer:m.f.peers){assertFalse(peer.latest().has("impostor"));assertEquals("LOBBY",s(peer.latest(),"phase"));assertEquals(m.f.code,s(peer.latest(),"code"));}
        String lobby=s(m.f.hostPeer.latest(),"lobbyId");failure("STALE_IMPOSTOR_SESSION",()->m.action(m.f.hostPeer,"START_IMPOSTOR",old));m.action(m.f.hostPeer,"START_IMPOSTOR",lobby);assertEquals("ROLE_REVEAL",m.phase());}
    @Test void hostDisconnectionUsesExistingRoomExpiry(){var m=new Match(3);m.finish("NO_CONSENSUS");m.f.rooms.detach(m.f.hostPeer.id());m.f.advance(120001);assertEquals(4002,m.f.peers.getFirst().closed);failure("ROOM_NOT_FOUND",()->m.f.rooms.view(m.f.code));}
    @Test void newMatchReconnectReceivesOnlyNewSession(){var m=new Match(3);m.finish("NO_CONSENSUS");String old=m.f.session;m.replay();m.start();var peer=new TestPeer();m.f.rooms.attach(m.f.code,s(m.f.players.getFirst(),"token"),peer,"new-match");var mini=peer.latest().getAsJsonObject("impostor");assertNotEquals(old,s(mini,"sessionId"));assertTrue(mini.has("role"));assertFalse(mini.has("result"));assertFalse(mini.has("ownFinalVote"));}
    @Test void lobbyReconnectKeepsSeat(){var m=new Match(3);m.finish("NO_CONSENSUS");m.action("IMPOSTOR_RETURN_TO_LOBBY");var peer=new TestPeer();m.f.rooms.attach(m.f.code,s(m.f.players.getFirst(),"token"),peer,"lobby");assertEquals(m.f.pid(0),s(peer.latest(),"selfId"));assertEquals("LOBBY",s(peer.latest(),"phase"));assertFalse(peer.latest().has("impostor"));}
    @Test void duplicateStartCannotReassignRoles(){var m=new Match(3);m.finish("NO_CONSENSUS");m.replay();m.start();var roles=m.f.mini(0).deepCopy();failure("INVALID_PHASE",()->m.action("START_IMPOSTOR"));assertEquals(roles,m.f.mini(0));}
    @Test void clientCannotSupplyResults(){var m=new Match(3);m.finish("NO_CONSENSUS");failure("INVALID_IMPOSTOR_ACTION",()->m.f.rooms.command(m.f.hostPeer,Protocol.decode(Protocol.event("REPLAY_IMPOSTOR","spoof",Map.of("roomCode",m.f.code,"sessionId",m.f.session,"winningSide","INNOCENTS")))));assertEquals("RESULT",m.phase());}
}
