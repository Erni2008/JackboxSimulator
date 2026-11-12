package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

class FinalSecondRoomServiceTest {
    final AtomicLong clock=new AtomicLong(1_000_000);final RoomService service=new RoomService(clock::get,1000,"");
    final TestPeer hostPeer=new TestPeer(),a=new TestPeer(),b=new TestPeer();JsonObject host,one,two;
    void command(TestPeer peer,String type,Map<String,?> fields){service.command(peer,Protocol.decode(Protocol.event(type,UUID.randomUUID().toString(),fields)));}
    JsonObject fs(TestPeer peer){return peer.latest().getAsJsonObject("finalSecond");}
    void advance(long ms){clock.addAndGet(ms);service.tick();}
    void start(String task){
        host=obj(service.create(new HashMap<>(Map.of("name","Timer","maxPlayers","4"))));service.attach(s(host,"code"),s(host,"token"),hostPeer,"host");
        one=obj(service.join(s(host,"code"),Map.of("name","One")));two=obj(service.join(s(host,"code"),Map.of("name","Two")));
        service.attach(s(host,"code"),s(one,"token"),a,"one");service.attach(s(host,"code"),s(two,"token"),b,"two");
        command(hostPeer,"START_FINAL_SECOND",Map.of("sessionId",s(hostPeer.latest(),"lobbyId"),"task",task));advance(10_500);
        assertEquals("RUNNING",s(fs(a),"phase"));
    }
    Map<String,Object> action(TestPeer peer){return new HashMap<>(Map.of("sessionId",s(fs(peer),"sessionId"),"clientAt",clock.get(),"turnId",fs(peer).has("turnId")?fs(peer).get("turnId").getAsInt():0));}
    @Test void sharedTurnsSurviveReconnectAndApplyOneElimination(){
        start("CHAIN");assertEquals(s(one,"selfId"),s(fs(a),"activePlayer"));
        assertThrows(RoomService.Failure.class,()->command(b,"FS_START",action(b)));
        command(a,"FS_START",action(a));advance(700);command(a,"FS_STOP",action(a));
        assertEquals(s(two,"selfId"),s(fs(a),"activePlayer"));assertEquals(s(fs(a),"activePlayer"),s(fs(b),"activePlayer"));assertFalse(fs(hostPeer).has("chainTotalMs"));
        TestPeer reconnected=new TestPeer();service.attach(s(host,"code"),s(two,"token"),reconnected,"two-again");assertEquals(2,fs(reconnected).get("turnId").getAsInt());
        command(reconnected,"FS_START",action(reconnected));advance(900);command(reconnected,"FS_STOP",action(reconnected));
        command(a,"FS_START",action(a));advance(500);command(a,"FS_STOP",action(a));
        assertEquals("REVEAL",s(fs(a),"phase"));assertEquals(2100,fs(a).get("chainTotalMs").getAsLong());
        var players=hostPeer.latest().getAsJsonArray("players");assertEquals(1,players.asList().stream().filter(p->p.getAsJsonObject().get("isGhost").getAsBoolean()).count());
        assertFalse(players.asList().stream().map(JsonElement::getAsJsonObject).filter(p->s(p,"id").equals(s(two,"selfId"))).findFirst().orElseThrow().get("isGhost").getAsBoolean());
    }
    @Test void normalModeHasIndependentTwoTapTimersWithPrivateStarts(){
        start("NORMAL");command(a,"FS_START",action(a));assertTrue(fs(a).get("myStarted").getAsBoolean());assertFalse(fs(b).get("myStarted").getAsBoolean());assertFalse(fs(hostPeer).has("myStartedAt"));
        advance(1000);command(b,"FS_START",action(b));advance(6000);command(a,"FS_STOP",action(a));advance(1000);command(b,"FS_STOP",action(b));advance(1000);
        assertEquals("REVEAL",s(fs(a),"phase"));for(JsonElement row:fs(a).getAsJsonArray("results"))assertEquals(7000,row.getAsJsonObject().get("stoppedMs").getAsLong());
    }
    @Test void speedShiftRoutesPrivateScheduleAndReconnectKeepsIt(){
        start("SPEED_SHIFT");assertEquals("SPEED_SHIFT",s(fs(a),"task"));assertFalse(fs(a).get("blind").getAsBoolean());
        assertFalse(fs(a).has("speedMultiplier"));command(a,"FS_START",action(a));
        long point=fs(a).get("speedShiftAtMs").getAsLong();double rate=fs(a).get("speedMultiplier").getAsDouble();
        assertFalse(fs(b).has("speedMultiplier"));assertFalse(fs(hostPeer).has("speedMultiplier"));
        advance(point+300);TestPeer reconnect=new TestPeer();service.attach(s(host,"code"),s(one,"token"),reconnect,"one-again");
        assertEquals(point,fs(reconnect).get("speedShiftAtMs").getAsLong());assertEquals(rate,fs(reconnect).get("speedMultiplier").getAsDouble());
        command(reconnect,"FS_STOP",action(reconnect));assertEquals(point+Math.round(300*rate),fs(reconnect).get("myStoppedMs").getAsLong());
        command(b,"FS_START",action(b));advance(15_000);assertTrue(fs(b).get("myTimedOut").getAsBoolean());advance(1000);
        assertEquals("REVEAL",s(fs(reconnect),"phase"));assertEquals(1,hostPeer.latest().getAsJsonArray("players").asList().stream().filter(p->p.getAsJsonObject().get("isGhost").getAsBoolean()).count());
    }

}
