package com.finalanswer.server;

import com.finalanswer.server.rooms.RoomService;
import com.finalanswer.protocol.Protocol;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

class SystemBreachRoomServiceTest {
    final AtomicLong clock=new AtomicLong(100000);final RoomService service=new RoomService(clock::get,1000,"");
    final TestPeer hostPeer=new TestPeer(),a=new TestPeer(),b=new TestPeer();JsonObject host,one,two;
    void command(TestPeer peer,String type,Map<String,?> payload){service.command(peer,Protocol.decode(Protocol.event("SYSTEM_BREACH_"+type,UUID.randomUUID().toString(),payload)));}
    JsonObject sb(TestPeer peer){return peer.latest().getAsJsonObject("systemBreach");}
    Map<String,Object> fields(TestPeer peer){return new HashMap<>(Map.of("roomCode",s(host,"code"),"sessionId",s(sb(peer),"sessionId")));}
    void start(){host=obj(service.create(Map.of("name","Breach","maxPlayers","8")));String code=s(host,"code");service.attach(code,s(host,"token"),hostPeer,"h");one=obj(service.join(code,Map.of("name","One")));two=obj(service.join(code,Map.of("name","Two")));service.attach(code,s(one,"token"),a,"a");service.attach(code,s(two,"token"),b,"b");command(hostPeer,"START",Map.of("roomCode",code,"sessionId",s(hostPeer.latest(),"lobbyId")));}
    void active(){start();for(TestPeer peer:List.of(a,b)){var payload=fields(peer);payload.put("password",sb(peer).getAsJsonObject("self").getAsJsonArray("passwordOptions").get(0).getAsString());command(peer,"PASSWORD_SELECT",payload);}assertEquals("ACTIVE",s(sb(a),"phase"));}
    void earn(){var payload=fields(a);payload.put("type","PASSWORD_DECRYPTION");command(a,"CHALLENGE_REQUEST",payload);var c=sb(a).getAsJsonObject("self").getAsJsonObject("challenge");StringBuilder answer=new StringBuilder();var table=c.getAsJsonObject("data").getAsJsonObject("substitutions");for(String token:s(c.getAsJsonObject("data"),"encoded").split(" "))answer.append(table.get(token).getAsString());payload=fields(a);payload.put("challengeId",s(c,"challengeId"));payload.put("answer",answer.toString());command(a,"CHALLENGE_SUBMIT",payload);}
    @Test void startupIsHostOnlyBlocksOtherModesAndKeepsPrivateOptions(){start();assertFalse(sb(hostPeer).has("self"));assertEquals("INITIALIZATION",s(sb(a),"phase"));assertThrows(RoomService.Failure.class,()->command(a,"START",Map.of("sessionId",s(hostPeer.latest(),"lobbyId"))));assertThrows(RoomService.Failure.class,()->service.join(s(host,"code"),Map.of("name","New")));assertThrows(RoomService.Failure.class,()->service.command(hostPeer,Protocol.decode(Protocol.event("START_FINAL_SECOND","other",Map.of("sessionId",s(hostPeer.latest(),"lobbyId"))))));}
    @Test void reconnectRestoresExactlySameChallengeAndIdentity(){active();var payload=fields(a);payload.put("type","CIRCUIT_BYPASS");command(a,"CHALLENGE_REQUEST",payload);var puzzle=sb(a).getAsJsonObject("self").get("challenge").deepCopy();service.detach(a.id());TestPeer reconnect=new TestPeer();service.attach(s(host,"code"),s(one,"token"),reconnect,"again");assertEquals(s(one,"selfId"),s(reconnect.latest(),"selfId"));assertEquals(puzzle,sb(reconnect).getAsJsonObject("self").get("challenge"));assertFalse(sb(hostPeer).toString().contains("challengeId"));assertFalse(sb(b).getAsJsonObject("self").getAsJsonObject("challenge").has("challengeId"));}
    @Test void resultsAddScoreOnceGhostTheLastPlaceAndReturnToLobby(){active();earn();clock.addAndGet(240000);service.tick();assertEquals("RESULTS",s(sb(a),"phase"));assertEquals(s(one,"selfId"),s(sb(a),"winnerId"));var outcome=service.completedSystemBreachResult(s(host,"code"));assertEquals(10,outcome.rankings().getFirst().accessPoints());for(int i=0;i<4;i++)service.tick();var scored=hostPeer.latest().getAsJsonArray("players").asList().stream().map(JsonElement::getAsJsonObject).filter(p->s(p,"id").equals(s(one,"selfId"))).findFirst().orElseThrow();assertEquals(10,scored.get("score").getAsInt());String last=outcome.rankings().getLast().playerId();for(var p:hostPeer.latest().getAsJsonArray("players"))assertEquals(!s(p.getAsJsonObject(),"id").equals(last),p.getAsJsonObject().get("isAlive").getAsBoolean(),"only the last place becomes a ghost");clock.addAndGet(24000);service.tick();assertEquals("FINISHED",s(sb(a),"phase"));command(hostPeer,"END",fields(hostPeer));assertFalse(hostPeer.latest().has("systemBreach"));assertEquals(outcome,service.completedSystemBreachResult(s(host,"code")));service.join(s(host,"code"),Map.of("name","Three"));}
    @Test void leavingDoesNotDeleteComputerOrPermitSeatReplacement(){active();service.leave(s(host,"code"),s(one,"token"));assertEquals(2,sb(b).getAsJsonArray("players").size());assertTrue(sb(b).getAsJsonArray("players").get(0).getAsJsonObject().get("disconnected").getAsBoolean());assertThrows(RoomService.Failure.class,()->service.attach(s(host,"code"),s(one,"token"),new TestPeer(),"left"));}
    @Test void staleAndSpoofedCommandsAreRejectedWithoutAPChanges(){active();var payload=fields(a);payload.put("sessionId","old");assertEquals("SB_STALE_SESSION",assertThrows(RoomService.Failure.class,()->command(a,"FIREWALL_UPGRADE",payload)).getMessage());var spoof=fields(a);spoof.put("accessPoints",99999);assertEquals("SB_INVALID_ACTION",assertThrows(RoomService.Failure.class,()->command(a,"FIREWALL_UPGRADE",spoof)).getMessage());assertThrows(RoomService.Failure.class,()->command(hostPeer,"FIREWALL_UPGRADE",fields(hostPeer)));}
    @Test void shutdownCleansRoomAndExpiresCredentials(){active();service.shutdown();assertThrows(RoomService.Failure.class,()->service.view(s(host,"code")));assertThrows(RoomService.Failure.class,()->command(a,"STATE",fields(a)));}
    @Test void finishedMatchReleasesExplicitlyAbandonedLobbySeats(){active();service.leave(s(host,"code"),s(one,"token"));clock.addAndGet(264000);service.tick();command(hostPeer,"END",fields(hostPeer));assertEquals(1,hostPeer.latest().getAsJsonArray("players").size());assertNotNull(service.completedSystemBreachResult(s(host,"code")));}

    long souls(TestPeer peer,JsonObject who){for(var p:peer.latest().getAsJsonArray("players")){var o=p.getAsJsonObject();if(s(o,"id").equals(s(who,"selfId")))return o.get("souls").getAsLong();}return -1;}
    @Test void finishedMatchReturnsToLobbyOnItsOwnWhenTheHostNeverEndsIt(){active();clock.addAndGet(240000+24000);service.tick();assertEquals("FINISHED",s(sb(a),"phase"));clock.addAndGet(19000);service.tick();assertTrue(a.latest().has("systemBreach"));clock.addAndGet(2000);service.tick();assertFalse(a.latest().has("systemBreach"),"room is back in the lobby");}
    @Test void soulsBuyAtMostTwoKeysAndNeverOverspend(){active();String code=s(host,"code"),id=s(one,"selfId");
        assertThrows(RoomService.Failure.class,()->command(a,"BUY_KEY",fields(a)),"no SOULS, no key");
        assertEquals(5000,service.rewardPlayer(code,id,5000,"TEST","t1"));assertEquals(0,service.rewardPlayer(code,id,5000,"TEST","t1"),"idempotent");
        command(a,"BUY_KEY",fields(a));command(a,"BUY_KEY",fields(a));assertEquals(2,sb(a).getAsJsonObject("self").get("keys").getAsInt());assertEquals(1000,souls(a,one));
        assertEquals("SB_KEY_LIMIT",assertThrows(RoomService.Failure.class,()->command(a,"BUY_KEY",fields(a))).getMessage());assertEquals(1000,souls(a,one));
        assertEquals(0,souls(b,two),"the other player's wallet is untouched");}
    @Test void ghostsBuyTheirWayBackWithSouls(){active();clock.addAndGet(240000+24000);service.tick();String code=s(host,"code");
        var ghost=a.latest().getAsJsonArray("players").asList().stream().map(JsonElement::getAsJsonObject).filter(p->!p.get("isAlive").getAsBoolean()).findFirst().orElseThrow();
        TestPeer gp=s(ghost,"id").equals(s(one,"selfId"))?a:b;JsonObject who=gp==a?one:two;
        clock.addAndGet(21000);service.tick();
        assertThrows(RoomService.Failure.class,()->service.command(gp,Protocol.decode(Protocol.event("SOULS_REVIVE",UUID.randomUUID().toString(),Map.of()))),"needs 5,000 SOULS");
        service.rewardPlayer(code,s(who,"selfId"),6000,"TEST","r1");service.command(gp,Protocol.decode(Protocol.event("SOULS_REVIVE",UUID.randomUUID().toString(),Map.of())));
        var me=gp.latest().getAsJsonArray("players").asList().stream().map(JsonElement::getAsJsonObject).filter(p->s(p,"id").equals(s(who,"selfId"))).findFirst().orElseThrow();
        assertTrue(me.get("isAlive").getAsBoolean());assertEquals(1000,me.get("souls").getAsLong());
        assertThrows(RoomService.Failure.class,()->service.command(gp,Protocol.decode(Protocol.event("SOULS_REVIVE",UUID.randomUUID().toString(),Map.of()))),"the living cannot buy it again");}
}
