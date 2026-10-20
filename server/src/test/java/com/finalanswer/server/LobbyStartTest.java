package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import org.junit.jupiter.api.Test;
import java.util.*;
import java.util.concurrent.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

/** Authoritative ownership and start barrier regressions, using the production room service. */
class LobbyStartTest {
    final java.util.concurrent.atomic.AtomicLong clock=new java.util.concurrent.atomic.AtomicLong(1_000_000);
    final com.finalanswer.server.rooms.RoomService service=new com.finalanswer.server.rooms.RoomService(clock::get,1000,"");
    com.google.gson.JsonObject host,one,two;
    TestPeer h=new TestPeer(),a=new TestPeer(),b=new TestPeer();
    @org.junit.jupiter.api.BeforeEach void setup(){host=create(Map.of());service.attach(s(host,"code"),s(host,"token"),h,"host");}
    com.google.gson.JsonObject create(Map<String,String> extra){var data=new HashMap<>(Map.of("name","Lobby","maxPlayers","2"));data.putAll(extra);return obj(service.create(data));}
    com.google.gson.JsonObject join(String name){return obj(service.join(s(host,"code"),Map.of("name",name)));}
    void players(){one=join("One");two=join("Two");service.attach(s(host,"code"),s(one,"token"),a,"one");service.attach(s(host,"code"),s(two,"token"),b,"two");}
    void command(TestPeer peer,String type,Map<String,?> fields){service.command(peer,Protocol.decode(Protocol.event(type,UUID.randomUUID().toString(),fields)));}
    void failure(String code,Runnable action){assertEquals(code,assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,action::run).getMessage());}
    void submit(TestPeer peer,int answer){var state=h.latest();command(peer,"SUBMIT_ANSWER",Map.of("gameId",s(state,"gameId"),"questionId",s(state.getAsJsonObject("question"),"id"),"answerIndex",answer));}

    @Test void sameCharacterCannotBeClaimedTwiceAndLeaveReleasesIt(){
        String code=s(host,"code");
        var first=obj(service.join(code,Map.of("name","First","characterId","ghost")));
        failure("CHARACTER_IN_USE",()->service.join(code,Map.of("name","Second","characterId","ghost")));
        assertEquals(1,obj(service.view(code)).getAsJsonArray("players").size());
        service.leave(code,s(first,"token"));
        assertEquals("ghost",obj(service.join(code,Map.of("name","Second","characterId","ghost"))).getAsJsonArray("players").get(0).getAsJsonObject().get("characterId").getAsString());
    }
    @Test void eightAutomaticAssignmentsAreUniqueAndAtomic() throws Exception {
        service.leave(s(host,"code"),s(host,"token"));host=create(Map.of("maxPlayers","8"));
        String code=s(host,"code");
        try(var pool=Executors.newFixedThreadPool(8)){
            var jobs=new ArrayList<Future<String>>();for(int i=0;i<8;i++){int n=i;jobs.add(pool.submit(()->service.join(code,Map.of("name","Player "+n))));}
            for(var job:jobs)job.get(5,TimeUnit.SECONDS);
        }
        var state=obj(service.view(code));Set<String> ids=new HashSet<>(),characters=new HashSet<>();
        for(var row:state.getAsJsonArray("players")){ids.add(s(row.getAsJsonObject(),"id"));characters.add(s(row.getAsJsonObject(),"characterId"));}
        assertEquals(8,ids.size());assertEquals(8,characters.size());assertEquals(0,state.getAsJsonArray("availableCharacters").size());
        failure("ROOM_IS_FULL",()->service.join(code,Map.of("name","Ninth")));
    }
    @Test void onePlayerCannotStartAndOfflineMemberBlocksStart(){
        one=join("One");service.attach(s(host,"code"),s(one,"token"),a,"one");
        failure("NOT_ENOUGH_PLAYERS",()->command(h,"START_GAME",Map.of()));
        two=join("Two");service.attach(s(host,"code"),s(two,"token"),b,"two");
        service.detach(b.id());assertFalse(h.latest().get("canStart").getAsBoolean());
        failure("PLAYER_OFFLINE",()->command(h,"START_GAME",Map.of()));
        var replacement=new TestPeer();service.attach(s(host,"code"),s(two,"token"),replacement,"again");
        assertTrue(h.latest().get("canStart").getAsBoolean());command(h,"START_GAME",Map.of());assertEquals("STARTING",s(h.latest(),"phase"));
    }
    @Test void sharedStartDeadlineLocksRosterAndCatchesUpWithoutRestart(){
        players();command(h,"START_GAME",Map.of());var starting=h.latest();
        assertEquals("STARTING",s(starting,"phase"));assertFalse(starting.has("question"));
        assertEquals(starting.get("transitionEndsAt"),a.latest().get("transitionEndsAt"));
        assertEquals(starting.get("transitionEndsAt"),b.latest().get("transitionEndsAt"));
        failure("GAME_ALREADY_STARTED",()->join("Late"));
        failure("GAME_ALREADY_STARTED",()->command(h,"START_GAME",Map.of()));
        service.detach(a.id());clock.addAndGet(1500);var replacement=new TestPeer();service.attach(s(host,"code"),s(one,"token"),replacement,"again");
        assertEquals(starting.get("transitionStartedAt"),replacement.latest().get("transitionStartedAt"));
        assertEquals(one.get("selfId"),replacement.latest().get("selfId"));
        clock.addAndGet(2499);service.tick();assertEquals("STARTING",s(h.latest(),"phase"));
        clock.incrementAndGet();service.tick();assertEquals("QUESTION_PRESENTATION",s(h.latest(),"phase"));
        assertEquals(starting.get("transitionEndsAt"),h.latest().get("questionStartTime"));
        assertEquals(h.latest().get("question"),replacement.latest().get("question"));
        failure("ANSWERING_NOT_STARTED",()->submit(replacement,0));
        assertEquals(1,h.events.stream().filter(e->s(e,"type").equals("QUESTION_STARTED")).count());
    }
    @Test void silentLobbySocketBecomesOfflineAndCanReconnect(){
        players();clock.addAndGet(45_001);command(h,"PING",Map.of());service.tick();
        assertEquals("OFFLINE",h.latest().getAsJsonArray("players").get(0).getAsJsonObject().get("connectionStatus").getAsString());
        assertEquals(4000,a.closed);var replacement=new TestPeer();service.attach(s(host,"code"),s(one,"token"),replacement,"recover");
        assertEquals(one.get("selfId"),replacement.latest().get("selfId"));
        assertEquals(one.getAsJsonArray("players").get(0).getAsJsonObject().get("characterId"),replacement.latest().getAsJsonArray("players").get(0).getAsJsonObject().get("characterId"));
    }
}
