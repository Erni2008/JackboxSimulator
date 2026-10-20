package com.finalanswer.server;

import com.finalanswer.server.rooms.RoomService;
import com.finalanswer.server.transport.Peer;
import com.finalanswer.server.game.GameSession;
import com.finalanswer.protocol.Protocol;
import com.google.gson.*;
import org.junit.jupiter.api.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;

class RoomServiceTest {
    final AtomicLong clock=new AtomicLong(1_000_000);
    final RoomService service=new RoomService(clock::get,1000,"https://play.example.test");
    JsonObject host,one,two;
    TestPeer h=new TestPeer(),a=new TestPeer(),b=new TestPeer();
    @BeforeEach void setup(){host=create(Map.of());service.attach(s(host,"code"),s(host,"token"),h,"h");}
    JsonObject create(Map<String,String> extras){Map<String,String> data=new HashMap<>(Map.of("name","Test room","maxPlayers","2","gameMode","standard"));data.putAll(extras);return obj(service.create(data));}
    JsonObject join(String name){return obj(service.join(s(host,"code"),Map.of("name",name)));}
    void players(){one=join("Анна");two=join("Ben");service.attach(s(host,"code"),s(one,"token"),a,"a");service.attach(s(host,"code"),s(two,"token"),b,"b");}
    void command(TestPeer peer,String type,Map<String,?> payload){service.command(peer,Protocol.decode(Protocol.event(type,UUID.randomUUID().toString(),payload)));}
    void command(TestPeer peer,String type){command(peer,type,fields());}
    Map<String,Object> fields(){JsonObject st=h.latest();return Map.of("gameId",s(st,"gameId"),"questionId",s(st.getAsJsonObject("question"),"id"));}
    void start(){players();command(h,"START_GAME",Map.of());}
    void answering(){start();command(h,"PRESENTATION_READY");}
    void submit(TestPeer peer,int index){var f=new HashMap<>(fields());f.put("answerIndex",index);command(peer,"SUBMIT_ANSWER",f);}
    void ends(){clock.addAndGet(20_000);service.tick();}
    void results(){ends();clock.addAndGet(720);command(h,"REVEAL_READY");}
    void failure(String code,Runnable action){assertEquals(code,assertThrows(RoomService.Failure.class,action::run).getMessage());}
    @Test void characterChoiceSurvivesReconnectAndRejectsUnknownWithoutOccupyingSeat() {
        String code=s(host,"code");
        failure("INVALID_CHARACTER",()->service.join(code,Map.of("name","Bad","characterId","unknown")));
        var ghost=obj(service.join(code,Map.of("name","Ghost","characterId","ghost")));
        service.attach(code,s(ghost,"token"),a,"ghost");
        assertEquals("ghost",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.detach(a.id()); var replacement=new TestPeer(); service.attach(code,s(ghost,"token"),replacement,"again");
        assertEquals("ghost",s(replacement.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        join("Legacy"); assertEquals(2,replacement.latest().getAsJsonArray("players").size());
    }
    @Test void zombieSelectionSurvivesRosterRefreshAndReconnect() {
        String code=s(host,"code");
        var zombie=obj(service.join(code,Map.of("name","Zombie","characterId","zombie")));
        service.attach(code,s(zombie,"token"),a,"zombie");
        assertEquals("zombie",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        join("Other");
        assertEquals("zombie",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.detach(a.id()); var replacement=new TestPeer();
        service.attach(code,s(zombie,"token"),replacement,"zombie-reconnect");
        assertEquals("zombie",s(replacement.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
    }
    @Test void draculaSelectionSurvivesRosterRefreshAndReconnect() {
        String code=s(host,"code");
        var dracula=obj(service.join(code,Map.of("name","Dracula","characterId","dracula")));
        service.attach(code,s(dracula,"token"),a,"dracula");
        assertEquals("dracula",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        join("Other");
        assertEquals("dracula",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.detach(a.id()); var replacement=new TestPeer();
        service.attach(code,s(dracula,"token"),replacement,"dracula-reconnect");
        assertEquals("dracula",s(replacement.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
    }
    @Test void plagueDoctorSelectionSurvivesRosterRefreshAndReconnect() {
        String code=s(host,"code");
        var dracula=obj(service.join(code,Map.of("name","Plague Doctor","characterId","plague_doctor")));
        service.attach(code,s(dracula,"token"),a,"plague_doctor");
        assertEquals("plague_doctor",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        join("Other");
        assertEquals("plague_doctor",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.detach(a.id()); var replacement=new TestPeer();
        service.attach(code,s(dracula,"token"),replacement,"dracula-reconnect");
        assertEquals("plague_doctor",s(replacement.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
    }
    @Test void pumpkinChoiceSurvivesRosterRefreshAndReconnect() {
        String code=s(host,"code");
        var pumpkin=obj(service.join(code,Map.of("name","Pumpkin Head","characterId","pumpkin")));
        service.attach(code,s(pumpkin,"token"),a,"pumpkin");
        assertEquals("pumpkin",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.heartbeat(code,s(pumpkin,"token"));
        service.detach(a.id());var replacement=new TestPeer();service.attach(code,s(pumpkin,"token"),replacement,"pumpkin-reconnect");
        assertEquals("pumpkin",s(replacement.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.leave(code,s(pumpkin,"token"));assertEquals(0,h.latest().getAsJsonArray("players").size());
    }
    @Test void voodooSelectionSurvivesReconnectWithoutChangingProtocol() {
        String code=s(host,"code");
        var doll=obj(service.join(code,Map.of("name","Voodoo","characterId","voodoo")));
        service.attach(code,s(doll,"token"),a,"voodoo");
        assertEquals("voodoo",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.detach(a.id());var replacement=new TestPeer();service.attach(code,s(doll,"token"),replacement,"voodoo-again");
        assertEquals("voodoo",s(replacement.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.leave(code,s(doll,"token"));assertEquals(0,h.latest().getAsJsonArray("players").size());
    }
    @Test void puppeteerSelectionSurvivesReconnectWithoutChangingProtocol() {
        String code=s(host,"code");
        var doll=obj(service.join(code,Map.of("name","Puppeteer","characterId","puppeteer")));
        service.attach(code,s(doll,"token"),a,"puppeteer");
        assertEquals("puppeteer",s(a.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.detach(a.id());var replacement=new TestPeer();service.attach(code,s(doll,"token"),replacement,"puppeteer-again");
        assertEquals("puppeteer",s(replacement.latest().getAsJsonArray("players").get(0).getAsJsonObject(),"characterId"));
        service.leave(code,s(doll,"token"));assertEquals(0,h.latest().getAsJsonArray("players").size());
    }
    @Test void createsServerGeneratedUniqueCodes(){Set<String> codes=new HashSet<>();for(int i=0;i<100;i++){JsonObject room=create(Map.of("code","AAAAAA"));assertTrue(s(room,"code").matches("[A-HJ-NP-Z2-9]{6}"));assertTrue(codes.add(s(room,"code")));assertEquals(43,s(room,"token").length());assertTrue(room.has("roomId"));}}
    @Test void joinsAndCapacityExcludesHost(){players();assertEquals(2,h.latest().getAsJsonArray("players").size());failure("ROOM_IS_FULL",()->join("Third"));}
    @Test void wrongCodeAndBadNickname(){failure("ROOM_NOT_FOUND",()->service.join("ZZZZZZ",Map.of("name","A")));failure("INVALID_NICKNAME",()->join("\n\t"));failure("INVALID_NICKNAME",()->join("x".repeat(25)));join("Test");failure("NICKNAME_IN_USE",()->join("test"));}
    @Test void passwordAndTokenPrivacy(){var locked=create(Map.of("password","secret"));String code=s(locked,"code");failure("INVALID_PASSWORD",()->service.join(code,Map.of("name","A","password","wrong")));var player=obj(service.join(code,Map.of("name","A","password","secret")));assertFalse(player.has("hostSession"));assertFalse(service.view(code).contains(s(locked,"token")));assertFalse(service.view(code).contains("secret"));}
    @Test void reconnectDoesNotDuplicateAndRevokesOldSocket(){players();var replacement=new TestPeer();service.attach(s(host,"code"),s(one,"token"),replacement,"r");assertEquals(4001,a.closed);assertEquals(2,replacement.latest().getAsJsonArray("players").size());failure("AUTH_REQUIRED",()->command(a,"PING",Map.of()));service.detach(a.id());assertEquals("ONLINE",replacement.latest().getAsJsonArray("players").get(0).getAsJsonObject().get("connectionStatus").getAsString());}
    @Test void startsSameQuestionForEveryone(){start();assertEquals(s(h.latest().getAsJsonObject("question"),"id"),s(a.latest().getAsJsonObject("question"),"id"));assertEquals(s(a.latest().getAsJsonObject("question"),"id"),s(b.latest().getAsJsonObject("question"),"id"));assertEquals("QUESTION_PRESENTATION",s(h.latest(),"phase"));assertFalse(a.latest().getAsJsonObject("question").has("correctAnswerIndex"));assertFalse(h.latest().getAsJsonObject("question").has("correctAnswerIndex"));}
    @Test void needsOnlinePlayersAndHostRole(){failure("NOT_ENOUGH_PLAYERS",()->command(h,"START_GAME",Map.of()));players();failure("HOST_ONLY",()->command(a,"START_GAME",Map.of()));command(h,"START_GAME",Map.of());failure("HOST_ONLY",()->command(a,"PRESENTATION_READY"));}
    @Test void noEarlyAnswers(){start();failure("ANSWERING_NOT_STARTED",()->submit(a,1));}
    @Test void acceptsCorrectAndWrongAndOnlyOnce(){answering();submit(a,1);submit(b,0);assertEquals("ANSWERING",s(h.latest(),"phase"));failure("ANSWER_ALREADY_SUBMITTED",()->submit(a,2));assertTrue(a.events.stream().anyMatch(e->s(e,"type").equals("ANSWER_ACCEPTED")));assertFalse(h.latest().getAsJsonArray("players").get(0).getAsJsonObject().has("currentAnswer"));results();var rs=h.latest().getAsJsonArray("results");assertEquals(1,java.util.stream.StreamSupport.stream(rs.spliterator(),false).filter(r->r.getAsJsonObject().get("isCorrect").getAsBoolean()).count());}
    @Test void deadlineIsExclusiveAndAuthoritative(){answering();clock.addAndGet(19999);submit(a,1);clock.incrementAndGet();failure("ANSWER_TOO_LATE",()->submit(b,1));assertEquals("REVEALING",s(h.latest(),"phase"));assertFalse(a.latest().getAsJsonObject("question").has("correctAnswerIndex"));assertFalse(obj(service.view(s(host,"code"))).getAsJsonObject("question").has("correctAnswerIndex"));}
    @Test void cannotForgePlayerOrHost(){answering();var payload=new HashMap<>(fields());payload.put("playerId",s(two,"selfId"));payload.put("answerIndex",1);command(a,"SUBMIT_ANSWER",payload);assertTrue(a.latest().get("hasSubmittedAnswer").getAsBoolean());assertFalse(b.latest().get("hasSubmittedAnswer").getAsBoolean());failure("HOST_ONLY",()->command(a,"NEXT_READY"));failure("NOT_A_PLAYER",()->submit(h,1));}
    @Test void resultsWaitForClockAndHostAck(){answering();ends();failure("NOT_READY",()->command(h,"REVEAL_READY"));clock.addAndGet(720);assertFalse(a.latest().has("results"));command(h,"REVEAL_READY");assertEquals("RESULTS",s(a.latest(),"phase"));assertTrue(a.latest().getAsJsonObject("question").has("correctAnswerIndex"));for(var result:a.latest().getAsJsonArray("results")){assertFalse(result.getAsJsonObject().get("answeredInTime").getAsBoolean());assertFalse(result.getAsJsonObject().get("isCorrect").getAsBoolean());}}
    @Test void nextWaitsForVisualsAndOldMessagesCannotAnswer(){answering();var old=new HashMap<>(fields());old.put("answerIndex",1);results();failure("NOT_READY",()->command(h,"NEXT_READY"));clock.addAndGet(3100);command(h,"NEXT_READY");assertEquals(2,h.latest().get("questionNumber").getAsInt());failure("STALE_QUESTION",()->command(a,"SUBMIT_ANSWER",old));assertFalse(a.latest().get("hasSubmittedAnswer").getAsBoolean());}
    @Test void retainsAcceptedAnswerOnReconnect(){answering();submit(a,1);service.detach(a.id());var r=new TestPeer();service.attach(s(host,"code"),s(one,"token"),r,"r");assertTrue(r.latest().get("hasSubmittedAnswer").getAsBoolean());assertEquals(1,r.latest().get("currentAnswer").getAsInt());failure("ANSWER_ALREADY_SUBMITTED",()->submit(r,2));}
    @Test void disconnectedPlayerRetainsSeatAndDoesNotPause(){answering();service.detach(a.id());assertEquals("OFFLINE",h.latest().getAsJsonArray("players").get(0).getAsJsonObject().get("connectionStatus").getAsString());ends();assertEquals("REVEALING",s(h.latest(),"phase"));}
    @Test void closingRoomInvalidatesAllTokens(){players();service.leave(s(host,"code"),s(host,"token"));failure("ROOM_NOT_FOUND",()->service.view(s(host,"code")));assertEquals(4002,a.closed);assertEquals(4002,h.closed);}
    @Test void hostLossDoesNotWaitForever(){answering();service.detach(h.id());clock.addAndGet(60001);service.tick();assertEquals("GAME_FINISHED",s(a.latest(),"phase"));assertEquals("HOST_UNRESPONSIVE",s(a.latest(),"finishReason"));}
    @Test void twelveQuestionSessionFinishes(){service.leave(s(host,"code"),s(host,"token"));host=create(Map.of("questionCount","12"));h=new TestPeer();service.attach(s(host,"code"),s(host,"token"),h,"h");start();for(int i=0;i<12;i++){command(h,"PRESENTATION_READY");results();clock.addAndGet(3100);command(h,"NEXT_READY");}assertEquals("GAME_FINISHED",s(h.latest(),"phase"));assertEquals("COMPLETED",s(h.latest(),"finishReason"));}
    @Test void malformedMessagesAndValues(){assertThrows(IllegalArgumentException.class,()->Protocol.decode("not JSON"));assertThrows(IllegalArgumentException.class,()->Protocol.decode("[".repeat(40)));assertThrows(IllegalArgumentException.class,()->Protocol.decode("x".repeat(16385)));answering();var fields=new HashMap<>(fields());fields.put("answerIndex",4);failure("INVALID_ANSWER",()->command(a,"SUBMIT_ANSWER",fields));fields.put("answerIndex","1");failure("INVALID_ANSWER",()->command(a,"SUBMIT_ANSWER",fields));failure("UNKNOWN_EVENT",()->command(h,"SET_SCORE"));}
    @Test void concurrentSubmissionsAreAtomic() throws Exception {answering();var executor=Executors.newFixedThreadPool(2);var barrier=new CyclicBarrier(2);var accepted=new AtomicLong();try{var tasks=new ArrayList<Future<?>>();for(int i=0;i<2;i++)tasks.add(executor.submit(()->{try{barrier.await();submit(a,1);accepted.incrementAndGet();}catch(RoomService.Failure e){assertEquals("ANSWER_ALREADY_SUBMITTED",e.getMessage());}catch(Exception e){throw new RuntimeException(e);}}));for(var t:tasks)t.get();assertEquals(1,accepted.get());}finally{executor.shutdownNow();}}
    @Test void earlyCompletionPolicyIsExplicit(){var game=new GameSession(1,Set.of("a","b"),Protocol.EndPolicy.ALL_SUBMITTED_OR_TIMEOUT,clock.get());game.next(clock.get());game.beginAnswers(clock.get());game.submitted.put("a",0);assertFalse(game.allSubmitted());game.submitted.put("b",1);assertTrue(game.allSubmitted());assertEquals(Protocol.EndPolicy.ALL_SUBMITTED_OR_TIMEOUT,game.endPolicy);}
    @Test void allSubmittedPolicyActuallyEndsBeforeDeadline(){
        var early=new RoomService(clock::get,10,"",Protocol.EndPolicy.ALL_SUBMITTED_OR_TIMEOUT);
        var room=obj(early.create(Map.of("name","Early")));
        var player=obj(early.join(s(room,"code"),Map.of("name","Player")));
        var hostPeer=new TestPeer();var playerPeer=new TestPeer();
        early.attach(s(room,"code"),s(room,"token"),hostPeer,"h");
        early.attach(s(room,"code"),s(player,"token"),playerPeer,"p");
        early.command(hostPeer,Protocol.decode(Protocol.event("START_GAME","start",Map.of())));
        var state=hostPeer.latest();var payload=new HashMap<String,Object>();
        payload.put("gameId",s(state,"gameId"));payload.put("questionId",s(state.getAsJsonObject("question"),"id"));
        early.command(hostPeer,Protocol.decode(Protocol.event("PRESENTATION_READY","ready",payload)));
        clock.addAndGet(1000);payload.put("answerIndex",1);
        early.command(playerPeer,Protocol.decode(Protocol.event("SUBMIT_ANSWER","answer",payload)));
        assertEquals("REVEALING",s(hostPeer.latest(),"phase"));
        assertEquals(clock.get(),hostPeer.latest().get("answeringEndedAt").getAsLong());
    }
    @Test void rerollChangesSixCharacterCodeAndKeepsRoomSettings(){
        String previous=s(host,"code");
        for(int i=0;i<20;i++) {
            var updated=obj(service.reroll(previous,Map.of("token",s(host,"token"))));
            assertNotEquals(previous,s(updated,"code"));
            assertTrue(s(updated,"code").matches("[A-HJ-NP-Z2-9]{6}"));
            assertEquals(host.get("roomId"),updated.get("roomId"));
            assertEquals(host.get("roomSettings"),updated.get("roomSettings"));
            String expired=previous;failure("ROOM_NOT_FOUND",()->service.view(expired));
            previous=s(updated,"code");
        }
    }
    static String s(JsonObject o,String key){return o.get(key).getAsString();}
    static JsonObject obj(String s){return JsonParser.parseString(s).getAsJsonObject();}
    static class TestPeer implements Peer {
        final String id=UUID.randomUUID().toString(); final List<JsonObject> events=new ArrayList<>(); int closed;
        public String id(){return id;} public void send(String text){events.add(obj(text));}public void close(int code,String reason){closed=code;}
        JsonObject latest(){for(int i=events.size()-1;i>=0;i--){JsonObject p=events.get(i).getAsJsonObject("payload");if(p.has("phase"))return p;}throw new AssertionError("No state");}
    }
}
