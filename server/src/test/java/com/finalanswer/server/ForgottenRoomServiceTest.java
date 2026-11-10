package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

/** THE FORGOTTEN ROOM through the production room service: start, privacy, validation, reconnect, scores. */
class ForgottenRoomServiceTest {
    final java.util.concurrent.atomic.AtomicLong clock=new java.util.concurrent.atomic.AtomicLong(1_000_000);
    final com.finalanswer.server.rooms.RoomService service=new com.finalanswer.server.rooms.RoomService(clock::get,1000,""); { service.randomCharacters=false; }
    JsonObject host,one,two;TestPeer h=new TestPeer(),a=new TestPeer(),b=new TestPeer();
    void command(TestPeer peer,String type,Map<String,?> fields){service.command(peer,Protocol.decode(Protocol.event(type,UUID.randomUUID().toString(),fields)));}
    JsonObject room(TestPeer peer){return peer.latest().getAsJsonObject("forgottenRoom");}
    void advance(long ms){clock.addAndGet(ms);service.tick();}

    void start(){
        host=obj(service.create(new HashMap<>(Map.of("name","Room","maxPlayers","4"))));service.attach(s(host,"code"),s(host,"token"),h,"host");
        one=obj(service.join(s(host,"code"),Map.of("name","One")));two=obj(service.join(s(host,"code"),Map.of("name","Two")));
        service.attach(s(host,"code"),s(one,"token"),a,"one");service.attach(s(host,"code"),s(two,"token"),b,"two");
        command(h,"START_FORGOTTEN_ROOM",Map.of("sessionId",s(h.latest(),"lobbyId"),"difficulty","EASY"));
    }

    @Test void fullRoundThroughTheServiceAddsPointsToRoomScores(){
        start();var r=room(a);assertEquals("INTRO",s(r,"phase"));assertEquals(2,r.getAsJsonArray("seats").size());
        assertEquals("HOST",s(room(h),"role"));assertEquals("PLAYER",s(r,"role"));
        advance(4_600+10_000+1_300+1_600);assertEquals("ANSWER_PHASE",s(room(a),"phase"));
        assertFalse(room(h).has("changes"),"the host doesn't get the key while players answer");
        String session=s(room(a),"sessionId");String place=room(a).getAsJsonArray("places").get(0).getAsJsonObject().get("id").getAsString();
        command(a,"ROOM_SUBMIT",Map.of("sessionId",session,"answers",List.of(Map.of("slot",place))));
        assertTrue(room(a).has("myAnswers"));assertFalse(room(b).has("myAnswers"));
        assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,()->command(b,"ROOM_SUBMIT",Map.of("sessionId",session,"answers",List.of(Map.of("nope",place)))));
        // Reconnect: a fresh socket for player one still shows their own answers.
        TestPeer again=new TestPeer();service.attach(s(host,"code"),s(one,"token"),again,"one");assertTrue(room(again).has("myAnswers"));
        command(b,"ROOM_SUBMIT",Map.of("sessionId",session,"answers",List.of()));
        advance(1_000);assertEquals("REVEAL",s(room(h),"phase"));assertTrue(room(h).has("changes"));
        int expected=room(h).getAsJsonArray("results").asList().stream().filter(e->s(e.getAsJsonObject(),"playerId").equals(s(one,"selfId"))).findFirst().orElseThrow().getAsJsonObject().get("points").getAsInt();
        int score=h.latest().getAsJsonArray("players").asList().stream().map(JsonElement::getAsJsonObject).filter(p->s(p,"id").equals(s(one,"selfId"))).findFirst().orElseThrow().get("score").getAsInt();
        assertEquals(expected,score,"points land in the room score exactly once");
        advance(60_000);assertEquals("RESULTS",s(room(h),"phase"));
        command(h,"END_FORGOTTEN_ROOM",Map.of("sessionId",session));assertFalse(h.latest().has("forgottenRoom"));
    }

    @Test void otherCommandsAreBlockedWhileTheRoomRuns(){
        start();var e=assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,()->command(h,"START_CARDS",Map.of("sessionId","x")));
        assertTrue(Set.of("GAME_ALREADY_STARTED","STALE_CARDS_SESSION").contains(e.getMessage()));
        assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,()->command(a,"START_FORGOTTEN_ROOM",Map.of("sessionId","x")));
    }
}
