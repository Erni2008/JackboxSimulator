package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.erni.finalanswer.gameplay.intro.IntroDefinition;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import java.util.*;
import static com.finalanswer.server.RoomServiceTest.*;
import static org.junit.jupiter.api.Assertions.*;

class IntroSequenceTest {
    final java.util.concurrent.atomic.AtomicLong clock=new java.util.concurrent.atomic.AtomicLong(1_000_000);
    final com.finalanswer.server.rooms.RoomService rooms=new com.finalanswer.server.rooms.RoomService(clock::get,1000,"");
    final TestPeer host=new TestPeer();final List<TestPeer> phones=new ArrayList<>();
    final List<com.google.gson.JsonObject> credentials=new ArrayList<>();
    String code,gameId;
    void command(TestPeer peer,String type,Map<String,?> data){rooms.command(peer,Protocol.decode(Protocol.event(type,UUID.randomUUID().toString(),data)));}
    Map<String,Object> intro(){return Map.of("gameId",gameId,"introId",IntroDefinition.RUSSIAN.introId());}
    void setup(int count){
        var created=obj(rooms.create(Map.of("name","Intro QA","maxPlayers","8")));code=s(created,"code");rooms.attach(code,s(created,"token"),host,"host");
        for(int i=0;i<count;i++){var joined=obj(rooms.join(code,Map.of("name","Phone "+i)));credentials.add(joined);var peer=new TestPeer();rooms.attach(code,s(joined,"token"),peer,"phone-"+i);phones.add(peer);}
        command(host,"START_GAME",Map.of("introId",IntroDefinition.RUSSIAN.introId()));gameId=s(host.latest(),"gameId");
    }
    void advance(long millis){
        while(millis>0){long step=Math.min(10_000,millis);clock.addAndGet(step);command(host,"PING",Map.of());for(var peer:phones)command(peer,"PING",Map.of());rooms.tick();millis-=step;}
    }
    @ParameterizedTest @ValueSource(ints={2,8}) void noQuestionBeforeCompletedIntroAndOneSharedTransition(int count){
        setup(count);var roster=host.latest().get("players").deepCopy();
        assertTrue(host.latest().has("intro"));assertFalse(host.latest().has("question"));assertEquals(0,host.latest().get("deadline").getAsLong());
        assertEquals("HOST_ONLY",assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,()->command(phones.getFirst(),"SKIP_INTRO",intro())).getMessage());
        assertEquals("INTRO_NOT_READY",assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,()->command(host,"INTRO_READY",intro())).getMessage());
        advance(10_000);assertEquals("STARTING",s(host.latest(),"phase"));assertFalse(host.latest().has("question"));
        advance(Math.round(IntroDefinition.RUSSIAN.targetDurationSeconds()*1000)-10_000);
        assertEquals("STARTING",s(host.latest(),"phase"));command(host,"INTRO_READY",intro());
        assertEquals("QUESTION_PRESENTATION",s(host.latest(),"phase"));assertEquals(roster,host.latest().get("players"));
        for(var phone:phones){assertEquals(host.latest().get("question"),phone.latest().get("question"));assertEquals(0,phone.latest().get("deadline").getAsLong());}
        command(host,"INTRO_READY",intro());command(host,"SKIP_INTRO",intro());
        assertEquals(1,host.events.stream().filter(e->s(e,"type").equals("QUESTION_STARTED")).count());
    }
    @ParameterizedTest @ValueSource(ints={0,12,58,67}) void hostCanSkipAtEveryMajorStage(int seconds){
        setup(2);advance(seconds*1000L);command(host,"SKIP_INTRO",intro());
        assertEquals("QUESTION_PRESENTATION",s(host.latest(),"phase"));assertEquals(1,host.latest().get("questionNumber").getAsInt());assertEquals(0,host.latest().get("answeringStartedAt").getAsLong());
        command(host,"SKIP_INTRO",intro());assertEquals(1,host.events.stream().filter(e->s(e,"type").equals("QUESTION_STARTED")).count());
    }
    @Test void pauseAndReconnectRetainTheBarrierAndIdentity(){
        setup(2);advance(20_000);command(host,"INTRO_PAUSE",intro());long elapsed=host.latest().getAsJsonObject("intro").get("elapsedMillis").getAsLong();
        advance(60_000);assertEquals(elapsed,host.latest().getAsJsonObject("intro").get("elapsedMillis").getAsLong());assertFalse(host.latest().has("question"));
        String player=s(phones.getFirst().latest(),"selfId");var cage=phones.getFirst().latest().getAsJsonArray("players").get(0).deepCopy();
        rooms.detach(phones.getFirst().id());var recovered=new TestPeer();rooms.attach(code,s(credentials.getFirst(),"token"),recovered,"recovered");phones.set(0,recovered);
        assertEquals(player,s(recovered.latest(),"selfId"));assertEquals(cage.getAsJsonObject().get("characterId"),recovered.latest().getAsJsonArray("players").get(0).getAsJsonObject().get("characterId"));
        assertTrue(recovered.latest().getAsJsonObject("intro").get("paused").getAsBoolean());
        command(host,"INTRO_RESUME",intro());advance(500);assertFalse(host.latest().getAsJsonObject("intro").get("paused").getAsBoolean());
        assertEquals("STALE_INTRO",assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,()->command(host,"SKIP_INTRO",Map.of("gameId","stale","introId",IntroDefinition.RUSSIAN.introId()))).getMessage());
        command(host,"SKIP_INTRO",intro());
    }
    @Test void latePresentationIsReportedAndCanStillBeSkippedWithoutStartingAnswers(){
        setup(2);advance(85_000);assertEquals("STARTING",s(host.latest(),"phase"));
        assertTrue(host.latest().getAsJsonObject("intro").get("timingConflict").getAsBoolean());assertFalse(host.latest().has("question"));
        command(host,"SKIP_INTRO",intro());assertEquals("QUESTION_PRESENTATION",s(host.latest(),"phase"));assertEquals(0,host.latest().get("deadline").getAsLong());
    }
}
