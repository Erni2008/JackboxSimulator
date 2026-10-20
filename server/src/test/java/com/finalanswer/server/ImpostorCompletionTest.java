package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

class ImpostorCompletionTest {
    @Test void everyOutcomeEmitsOneCompletionAndPreservesConnections(){
        for(int count:List.of(3,4))for(String outcome:List.of("IMPOSTOR_CAUGHT","IMPOSTOR_ESCAPED","NO_CONSENSUS")){
            var m=new ImpostorLifecycleTest.Match(count);var before=m.f.hostPeer.latest().deepCopy();m.finish(outcome);
            assertEquals(outcome,m.f.rooms.completedImpostorResult(m.f.code).outcome());
            for(var peer:m.f.peers){assertEquals(0,peer.closed);assertEquals(1,peer.events.stream().filter(e->s(e,"type").equals("IMPOSTOR_COMPLETED")).count());
                var mini=peer.latest().getAsJsonObject("impostor");assertTrue(mini.get("completed").getAsBoolean());assertEquals("UNASSIGNED",s(mini,"continuation"));assertEquals(before.get("roomId"),peer.latest().get("roomId"));assertEquals(before.get("players"),peer.latest().get("players"));}
            m.f.advance(1000);m.f.rooms.command(m.f.hostPeer,Protocol.decode(Protocol.event("SYNC","host-complete",Map.of())));
            assertEquals(1,m.f.hostPeer.events.stream().filter(e->s(e,"type").equals("IMPOSTOR_COMPLETED")).count());
        }
    }
    @Test void existingMainGameCanContinueAndArchiveSurvives(){var m=new ImpostorLifecycleTest.Match(3);m.finish("IMPOSTOR_CAUGHT");var result=m.f.rooms.completedImpostorResult(m.f.code);
        m.f.rooms.command(m.f.hostPeer,Protocol.decode(Protocol.event("START_GAME","continue",Map.of())));
        assertFalse(m.f.hostPeer.latest().has("impostor"));assertEquals("QUESTION_PRESENTATION",s(m.f.hostPeer.latest(),"phase"));assertSame(result,m.f.rooms.completedImpostorResult(m.f.code));
        for(var peer:m.f.peers)assertEquals(0,peer.closed);
    }
    @Test void reconnectRestoresCompletionWithoutDuplicatedEvent(){var m=new ImpostorLifecycleTest.Match(4);m.finish("NO_CONSENSUS");var peer=new TestPeer();m.f.rooms.detach(m.f.peers.getFirst().id());m.f.rooms.attach(m.f.code,s(m.f.players.getFirst(),"token"),peer,"reconnect");
        assertTrue(peer.latest().getAsJsonObject("impostor").get("completed").getAsBoolean());assertEquals(m.f.pid(0),s(peer.latest(),"selfId"));assertEquals(0,peer.events.stream().filter(e->s(e,"type").equals("IMPOSTOR_COMPLETED")).count());
    }
    @Test void activeMainGameHandoffRejected(){var m=new ImpostorLifecycleTest.Match(3);assertEquals("GAME_ALREADY_STARTED",assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,()->m.f.rooms.command(m.f.hostPeer,Protocol.decode(Protocol.event("START_GAME","early",Map.of())))).getMessage());assertNull(m.f.rooms.completedImpostorResult(m.f.code));}
    @Test void tiedSubmittedVotesCompleteWithoutSelectingRandomWinner(){var m=new ImpostorLifecycleTest.Match(4);m.toVoting();
        for(int i=0;i<4;i++)m.f.rooms.command(m.f.peers.get(i),Protocol.decode(Protocol.event("SUBMIT_FINAL_VOTE","tie",Map.of("roomCode",m.f.code,"sessionId",m.f.session,"suspectId",m.f.pid((i+1)%4)))));
        m.f.advance(700);m.f.advance(5000);m.f.advance(3500);m.f.advance(4000);
        assertEquals("NO_CONSENSUS",m.f.rooms.completedImpostorResult(m.f.code).outcome());assertEquals(4,m.f.rooms.completedImpostorResult(m.f.code).statistics().validVotes());assertTrue(m.f.mini(0).get("completed").getAsBoolean());
    }
    @Test void hostSyncCanDeliverDueCompletionToEveryController(){var m=new ImpostorLifecycleTest.Match(3);m.toVoting();m.f.advance(20000);m.f.advance(700);m.f.advance(5000);m.f.advance(3500);
        m.f.clock.addAndGet(4000);m.f.rooms.command(m.f.hostPeer,Protocol.decode(Protocol.event("SYNC","host-finish",Map.of())));
        for(var peer:m.f.peers)assertEquals(1,peer.events.stream().filter(e->s(e,"type").equals("IMPOSTOR_COMPLETED")).count());
    }

}
