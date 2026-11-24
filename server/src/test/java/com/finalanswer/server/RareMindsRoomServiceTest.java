package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.game.rareminds.RarityStats;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

/** RARE MINDS through the real room: timing, privacy, reconnection, late and duplicate messages, SOULS payout. */
class RareMindsRoomServiceTest {
    final AtomicLong clock=new AtomicLong(1_000_000);final RoomService service=new RoomService(clock::get,1000,"");
    final TestPeer hostPeer=new TestPeer(),a=new TestPeer();TestPeer b=new TestPeer();JsonObject host,one,two;
    { service.rareStats=new RarityStats.Memory(); }
    void command(TestPeer peer,String type,Map<String,?> fields){service.command(peer,Protocol.decode(Protocol.event(type,UUID.randomUUID().toString(),fields)));}
    void command(TestPeer peer,String type,String requestId,Map<String,?> fields){service.command(peer,Protocol.decode(Protocol.event(type,requestId,fields)));}
    JsonObject rm(TestPeer peer){return peer.latest().getAsJsonObject("rareMinds");}
    void advance(long ms){clock.addAndGet(ms);service.tick();}
    String code(){return s(host,"code");}
    void start(){
        host=obj(service.create(new HashMap<>(Map.of("name","Rare","maxPlayers","4"))));service.attach(code(),s(host,"token"),hostPeer,"host");
        one=obj(service.join(code(),Map.of("name","One")));two=obj(service.join(code(),Map.of("name","Two")));
        service.attach(code(),s(one,"token"),a,"one");service.attach(code(),s(two,"token"),b,"two");
        command(hostPeer,"START_RARE_MINDS",Map.of("sessionId",s(hostPeer.latest(),"lobbyId")));
        assertEquals("INITIALIZING",s(rm(a),"phase"));advance(7_100);assertEquals("QUESTION_ACTIVE",s(rm(a),"phase"));
    }
    Map<String,Object> answer(TestPeer p,String text){return new HashMap<>(Map.of("sessionId",s(rm(p),"sessionId"),"question",rm(p).get("question").getAsInt(),"text",text));}
    /** a valid answer for the current question, picked by popularity rank (0 = most common) */
    String valid(int rank){var q=com.finalanswer.server.game.rareminds.RareQuestionBank.load().get(s(rm(a),"questionId"));var l=new ArrayList<>(q.answers());l.sort(Comparator.comparingInt(x->-x.popularity()));return l.get(rank).labelEn();}

    @Test void draftsStayPrivateAndOnlyTheHostMonitorSeesThem(){
        start();command(a,"RM_DRAFT",answer(a,"Secret draf"));command(b,"RM_SUBMIT",answer(b,valid(0)));
        for(TestPeer p:List.of(a,b))assertFalse(p.latest().toString().contains("Secret draf"),"drafts never reach other phones");
        assertTrue(hostPeer.latest().toString().contains("Secret draf"),"the host's own client gets live typing");
        assertFalse(rm(a).toString().contains(valid(0)),"another player's locked answer is hidden until the reveal");
        assertTrue(rm(b).getAsJsonObject("me").get("submitted").getAsBoolean());
        var mon=obj(service.rareMindsMonitor(code(),s(host,"token")));assertTrue(mon.toString().contains("Secret draf"));
        assertThrows(RoomService.Failure.class,()->service.rareMindsMonitor(code(),s(one,"token")),"players cannot open the monitor");
        assertThrows(RoomService.Failure.class,()->service.rareMindsMonitor(code(),"forged"));
    }
    @Test void draftIsTimeLockedAtTheDeadlineAndLateAnswersAreRejected(){
        start();command(a,"RM_DRAFT",answer(a,valid(1)));var late=answer(b,valid(2));advance(18_400);
        assertEquals("ANSWERS_LOCKED",s(rm(a),"phase"));
        var rows=rm(a).getAsJsonObject("reveal").getAsJsonArray("rows");
        assertTrue(rows.get(0).getAsJsonObject().get("valid").getAsBoolean(),"the unsent draft counted");
        var e=assertThrows(RoomService.Failure.class,()->command(b,"RM_SUBMIT",late));assertEquals("RM_ANSWERS_CLOSED",e.getMessage());
    }
    @Test void duplicateMessagesNeverScoreTwiceAndAnswersLockOnce(){
        start();var msg=answer(a,valid(0));command(a,"RM_SUBMIT","same-request",msg);command(a,"RM_SUBMIT","same-request",msg);
        var e=assertThrows(RoomService.Failure.class,()->command(a,"RM_SUBMIT",answer(a,valid(3))));assertEquals("RM_ALREADY_SUBMITTED",e.getMessage());
        assertThrows(RoomService.Failure.class,()->command(b,"RM_SUBMIT",answer(b,"x".repeat(41))));
        assertThrows(RoomService.Failure.class,()->command(b,"RM_SUBMIT",answer(b,"   ")));
    }
    @Test void fullMatchPaysSoulsOnceAndSurvivesReconnect(){
        start();
        for(int q=1;q<=8;q++){
            assertEquals(q,rm(a).get("question").getAsInt());
            command(a,"RM_SUBMIT",answer(a,valid(q)));
            if(q==4){b=new TestPeer();service.attach(code(),s(two,"token"),b,"two-again");assertEquals(4,rm(b).get("question").getAsInt(),"a reconnecting player is back in the same question");}
            command(b,"RM_SUBMIT",answer(b,valid(q+10)));
            advance(700);assertEquals("ANSWERS_LOCKED",s(rm(a),"phase"),"everyone answered: the window closes early");
            advance(3_300);advance(q==8?13_600:12_600);
        }
        assertEquals("FINAL_RESULTS",s(rm(a),"phase"));
        var standings=rm(a).getAsJsonArray("standings");long total=0;
        for(var st:standings){var o=st.getAsJsonObject();long souls=o.get("souls").getAsLong();total+=souls;
            var p=hostPeer.latest().getAsJsonArray("players").asList().stream().map(JsonElement::getAsJsonObject).filter(x->s(x,"id").equals(s(o,"playerId"))).findFirst().orElseThrow();
            assertEquals(souls,p.get("souls").getAsLong(),"the match souls went into the room wallet");}
        assertTrue(total>0);assertTrue(standings.get(0).getAsJsonObject().get("winner").getAsBoolean());
        assertEquals("rare-minds",s(hostPeer.latest().getAsJsonObject("modeSummary"),"mode"));
        advance(1000);advance(16_000);advance(1000);
        var p=hostPeer.latest().getAsJsonArray("players").get(0).getAsJsonObject();long once=p.get("souls").getAsLong();
        advance(30_000);assertFalse(hostPeer.latest().has("rareMinds"),"the finished match returns the room to the lobby");
        assertEquals(once,hostPeer.latest().getAsJsonArray("players").get(0).getAsJsonObject().get("souls").getAsLong(),"never paid twice");
    }
}
