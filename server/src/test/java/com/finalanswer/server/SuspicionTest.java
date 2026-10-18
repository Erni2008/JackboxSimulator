package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.game.ImpostorSession;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import org.junit.jupiter.api.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

class SuspicionTest {
    final AtomicLong clock=new AtomicLong(1_000_000);
    final RoomService rooms=new RoomService(clock::get,20,"");
    final TestPeer hostPeer=new TestPeer();
    final List<JsonObject> players=new ArrayList<>();
    final List<TestPeer> peers=new ArrayList<>();
    JsonObject host;String code,session;
    @BeforeEach void setup(){
        host=obj(rooms.create(Map.of("name","Suspicion","maxPlayers","8")));code=s(host,"code");
        rooms.attach(code,s(host,"token"),hostPeer,"host");
        for(int i=0;i<5;i++){
            JsonObject player=obj(rooms.join(code,Map.of("name","Player"+i)));players.add(player);
            TestPeer peer=new TestPeer();peers.add(peer);rooms.attach(code,s(player,"token"),peer,"auth"+i);
        }
        session=rooms.installImpostorSession(code,players.subList(0,3).stream().map(p->s(p,"selfId")).toList());
        rooms.startPreliminarySuspicion(code,session,1);
    }
    void command(TestPeer peer,Map<String,?> fields){rooms.command(peer,Protocol.decode(Protocol.event("SUBMIT_SUSPICION",UUID.randomUUID().toString(),fields)));}
    Map<String,Object> fields(int suspect,int round){return new HashMap<>(Map.of("roomCode",code,"sessionId",session,"round",round,"suspectId",s(players.get(suspect),"selfId")));}
    void submit(int voter,int suspect){command(peers.get(voter),fields(suspect,1));}
    JsonObject mini(TestPeer peer){return peer.latest().getAsJsonObject("impostor");}
    void failure(String error,Runnable action){assertEquals(error,assertThrows(RoomService.Failure.class,action::run).getMessage());}
    @Test void participantAndSpectatorSubmitPrivately(){
        submit(0,1);submit(3,2);
        assertEquals(2,mini(hostPeer).get("submittedCount").getAsInt());
        assertEquals(5,mini(hostPeer).get("eligibleCount").getAsInt());
        assertFalse(mini(hostPeer).has("selectedSuspectId"));
        assertEquals(s(players.get(1),"selfId"),s(mini(peers.get(0)),"selectedSuspectId"));
        assertFalse(mini(peers.get(4)).has("selectedSuspectId"));
        assertFalse(rooms.view(code).contains("selectedSuspectId"));
        assertFalse(rooms.view(code).contains("selections"));
        assertFalse(rooms.view(code).contains("secret"));
        assertEquals(3,mini(hostPeer).getAsJsonArray("participants").size());
    }
    @Test void rejectsSelfAndSpectatorTargets(){failure("SELF_SUSPICION",()->submit(0,0));failure("INVALID_SUSPECT",()->submit(0,4));}
    @Test void unknownTargetAndImpersonation(){
        var data=fields(1,1);data.put("suspectId","unknown");failure("INVALID_SUSPECT",()->command(peers.get(0),data));
        var spoof=fields(1,1);spoof.put("voterId",s(players.get(2),"selfId"));
        failure("INVALID_SUSPICION",()->command(peers.get(0),spoof));
        failure("AUTH_REQUIRED",()->command(new TestPeer(),fields(1,1)));
        failure("NOT_ELIGIBLE",()->command(hostPeer,fields(1,1)));
    }
    @Test void latestSelectionReplacesAndIdenticalSubmissionDoesNotInflate(){
        submit(0,1);submit(0,1);submit(0,2);
        assertEquals(1,mini(hostPeer).get("submittedCount").getAsInt());
        assertEquals(s(players.get(2),"selfId"),s(mini(peers.get(0)),"selectedSuspectId"));
    }
    @Test void deadlineUsesServerTimeAndAllowsAbstention(){
        assertEquals(clock.get()+5000,mini(hostPeer).get("deadline").getAsLong());
        clock.addAndGet(4999);submit(0,1);clock.incrementAndGet();
        failure("SUSPICION_TOO_LATE",()->submit(1,0));
        assertEquals("SUSPICION_FINALIZED",s(mini(hostPeer),"phase"));
        assertEquals(1,mini(hostPeer).get("submittedCount").getAsInt());
    }
    @Test void earlyCompletionWaitsForSpectators(){
        submit(0,1);submit(1,0);submit(2,0);
        assertEquals("PRELIMINARY_SUSPICION",s(mini(hostPeer),"phase"));
        submit(3,0);assertEquals("PRELIMINARY_SUSPICION",s(mini(hostPeer),"phase"));
        submit(4,0);assertEquals("SUSPICION_FINALIZED",s(mini(hostPeer),"phase"));
        assertEquals(5,mini(hostPeer).get("submittedCount").getAsInt());
        failure("SUSPICION_CLOSED",()->submit(0,2));
    }
    @Test void disconnectDoesNotShrinkDenominatorAndReconnectRestoresChoice(){
        submit(3,0);rooms.detach(peers.get(3).id());
        assertEquals(5,mini(hostPeer).get("eligibleCount").getAsInt());
        TestPeer replacement=new TestPeer();rooms.attach(code,s(players.get(3),"token"),replacement,"again");
        assertEquals(s(players.get(0),"selfId"),s(mini(replacement),"selectedSuspectId"));
        failure("AUTH_REQUIRED",()->submit(3,1));
        command(replacement,fields(2,1));assertEquals(1,mini(hostPeer).get("submittedCount").getAsInt());
    }
    @Test void disconnectedAbstainerPreventsEarlyCompletionUntilDeadline(){
        rooms.detach(peers.get(4).id());
        for(int i=0;i<4;i++)submit(i,i==0?1:0);
        assertEquals("PRELIMINARY_SUSPICION",s(mini(hostPeer),"phase"));
        clock.addAndGet(5000);rooms.tick();assertEquals("SUSPICION_FINALIZED",s(mini(hostPeer),"phase"));
    }
    @Test void malformedAndWrongRoomOrSessionAreRejected(){
        var wrong=fields(1,1);wrong.put("roomCode","OTHER");failure("WRONG_ROOM",()->command(peers.get(0),wrong));
        var stale=fields(1,1);stale.put("sessionId","other-session");failure("STALE_SUSPICION",()->command(peers.get(0),stale));
        var bad=fields(1,1);bad.put("round","1");failure("INVALID_SUSPICION",()->command(peers.get(0),bad));
        var timestamp=fields(1,1);timestamp.put("timestamp",0);failure("INVALID_SUSPICION",()->command(peers.get(0),timestamp));
    }
    @Test void roundsAreSeparateAndSequential(){
        submit(0,1);failure("INVALID_SUSPICION_ROUND",()->rooms.startPreliminarySuspicion(code,session,2));
        clock.addAndGet(5000);rooms.tick();rooms.startPreliminarySuspicion(code,session,2);
        assertEquals(0,mini(hostPeer).get("submittedCount").getAsInt());
        assertFalse(mini(peers.get(0)).has("selectedSuspectId"));failure("STALE_SUSPICION",()->submit(0,1));
        command(peers.get(0),fields(2,2));clock.addAndGet(5000);rooms.tick();rooms.startPreliminarySuspicion(code,session,3);
        assertEquals(0,mini(hostPeer).get("submittedCount").getAsInt());
        clock.addAndGet(5000);rooms.tick();failure("INVALID_SUSPICION_ROUND",()->rooms.startPreliminarySuspicion(code,session,4));
    }
    @Test void independentRoomAndSessionDoNotAcceptForeignIdentity(){
        var other=obj(rooms.create(Map.of("name","Other","maxPlayers","4")));
        TestPeer otherPeer=new TestPeer();rooms.attach(s(other,"code"),s(other,"token"),otherPeer,"other");
        failure("WRONG_ROOM",()->command(otherPeer,fields(1,1)));
        assertFalse(otherPeer.latest().has("impostor"));
    }
    @Test void concurrentSubmissionsAreSerialized() {
        var jobs=new ArrayList<CompletableFuture<Void>>();
        for(int i=0;i<5;i++){int voter=i;jobs.add(CompletableFuture.runAsync(()->submit(voter,voter==0?1:0)));}
        CompletableFuture.allOf(jobs.toArray(CompletableFuture[]::new)).join();
        assertEquals(5,mini(hostPeer).get("submittedCount").getAsInt());
        assertEquals("SUSPICION_FINALIZED",s(mini(hostPeer),"phase"));
    }
    @Test void noClientStartCommandAndRoomClosureInvalidatesSessions(){
        failure("GAME_ALREADY_STARTED",()->rooms.command(hostPeer,Protocol.decode(Protocol.event("START_GAME","start",Map.of()))));
        rooms.leave(code,s(host,"token"));failure("AUTH_REQUIRED",()->submit(0,1));
    }
    @Test void modelKeepsPreviousRoundsAndFourParticipants(){
        var model=new ImpostorSession("isolated",List.of("a","b","c","d"));
        model.startSuspicion(1,Set.of("a","b","c","d","spectator"),100);
        model.submit("spectator","a",1,101);model.tick(5100);
        model.startSuspicion(2,Set.of("a","b","c","d"),5200);
        model.submit("a","b",2,5201);
        assertEquals("a",model.rounds().getFirst().ownSelection("spectator"));
        assertEquals("b",model.current().ownSelection("a"));
        assertEquals("isolated",model.current().roomId);assertEquals(model.id,model.current().sessionId);
        model.close();assertThrows(RoomService.Failure.class,()->model.submit("b","a",2,5202));
    }
    @Test void fourActiveWithoutSpectatorsAndOutsidePhaseRejection(){
        var model=new ImpostorSession("four",List.of("a","b","c","d"));
        assertThrows(RoomService.Failure.class,()->model.submit("a","b",1,0));
        model.startSuspicion(1,Set.of("a","b","c","d"),10);
        for(String voter:List.of("a","b","c","d"))model.submit(voter,voter.equals("a")?"b":"a",1,11);
        assertTrue(model.current().finalized());assertEquals(4,model.current().submittedCount());
        var other=new ImpostorSession("other",List.of("a","b","c"));
        other.startSuspicion(1,Set.of("a","b","c"),10);assertEquals(0,other.current().submittedCount());
    }
    @Test void assignmentsValidateCountAndDuplicateIds(){
        assertThrows(RoomService.Failure.class,()->new ImpostorSession("x",List.of("a","b")));
        assertThrows(RoomService.Failure.class,()->new ImpostorSession("x",List.of("a","a","b")));
        assertThrows(RoomService.Failure.class,()->new ImpostorSession("x",List.of("a","b","c","d","e")));
    }

    @Test void lateConnectionCannotExpandFrozenEligibility(){
        var second=obj(rooms.create(Map.of("name","Late connection","maxPlayers","4")));
        String otherCode=s(second,"code");var members=new ArrayList<JsonObject>();var connections=new ArrayList<TestPeer>();
        for(int i=0;i<4;i++) {
            var player=obj(rooms.join(otherCode,Map.of("name","Late"+i)));members.add(player);
            var peer=new TestPeer();connections.add(peer);
            if(i<3)rooms.attach(otherCode,s(player,"token"),peer,"auth");
        }
        String mini=rooms.installImpostorSession(otherCode,members.subList(0,3).stream().map(p->s(p,"selfId")).toList());
        rooms.startPreliminarySuspicion(otherCode,mini,1);
        rooms.attach(otherCode,s(members.get(3),"token"),connections.get(3),"late-auth");
        failure("NOT_ELIGIBLE",()->command(connections.get(3),Map.of("roomCode",otherCode,"sessionId",mini,"round",1,"suspectId",s(members.get(0),"selfId"))));
        assertEquals(3,connections.get(3).latest().getAsJsonObject("impostor").get("eligibleCount").getAsInt());
    }

}
