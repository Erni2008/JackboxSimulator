package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.game.ImpostorSession;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

class ImpostorGameTest {
    final AtomicLong clock=new AtomicLong(1_000_000);
    final RoomService rooms=new RoomService(clock::get,20,"",Protocol.EndPolicy.TIME_ONLY,r->"ЯБЛОКО");
    final List<JsonObject> players=new ArrayList<>();final List<TestPeer> peers=new ArrayList<>();
    final TestPeer hostPeer=new TestPeer();
    JsonObject host;String code,session;
    void start(int count){
        host=obj(rooms.create(Map.of("name","Clues","maxPlayers","8")));code=s(host,"code");
        rooms.attach(code,s(host,"token"),hostPeer,"host");
        for(int i=0;i<count+2;i++){
            var player=obj(rooms.join(code,Map.of("name","Player"+i)));players.add(player);
            var peer=new TestPeer();peers.add(peer);rooms.attach(code,s(player,"token"),peer,"auth");
        }
        session=rooms.startImpostorGame(code,players.subList(0,count).stream().map(p->s(p,"selfId")).toList());
    }
    JsonObject mini(int i){return peers.get(i).latest().getAsJsonObject("impostor");}
    String pid(int i){return s(players.get(i),"selfId");}
    Map<String,Object> fields(int round,String clue){return new HashMap<>(Map.of("roomCode",code,"sessionId",session,"round",round,"clue",clue));}
    void submit(int i,int round,String clue){rooms.command(peers.get(i),Protocol.decode(Protocol.event("SUBMIT_CLUE","clue",fields(round,clue))));}
    void advance(long delta){clock.addAndGet(delta);rooms.tick();}
    void fail(String error,Runnable action){assertEquals(error,assertThrows(RoomService.Failure.class,action::run).getMessage());}
    @Test void threePrivateRoles(){checkRoles(3);}
    @Test void fourPrivateRoles(){checkRoles(4);}
    void checkRoles(int count){start(count);int impostors=0;
        for(int i=0;i<count+2;i++){
            var m=mini(i);
            if(i>=count){assertFalse(m.has("role"));assertFalse(m.has("secretWord"));assertFalse(m.get("activeParticipant").getAsBoolean());}
            else if(s(m,"role").equals("IMPOSTOR")){impostors++;assertFalse(m.has("secretWord"));assertFalse(m.toString().contains("ЯБЛОКО"));}
            else assertEquals("ЯБЛОКО",s(m,"secretWord"));
        }
        assertEquals(1,impostors);
        assertFalse(rooms.view(code).contains("secretWord"));assertFalse(rooms.view(code).contains("IMPOSTOR\""));
        assertFalse(hostPeer.latest().toString().contains("ЯБЛОКО"));
        assertFalse(hostPeer.latest().getAsJsonObject("impostor").has("role"));
    }
    @Test void earlyCompletionAndPrivateCollection(){start(3);advance(4000);
        submit(0,1,"тепло");assertEquals("ТЕПЛО",s(mini(0),"ownClue"));assertFalse(mini(1).toString().contains("ТЕПЛО"));assertFalse(rooms.view(code).contains("ТЕПЛО"));
        fail("CLUE_ALREADY_SUBMITTED",()->submit(0,1,"СВЕТ"));submit(1,1,"СВЕТ");submit(2,1,"ЛЕТО");
        assertEquals("ROUND_CLUE_REVEAL",s(mini(0),"phase"));assertEquals(1,mini(0).get("revealSequence").getAsInt());
        assertEquals("ТЕПЛО",mini(0).getAsJsonArray("revealedClues").get(0).getAsJsonObject().get(pid(0)).getAsString());
        advance(1);assertEquals(1,mini(0).get("revealSequence").getAsInt());
    }
    @Test void timeoutUsesMissingMarkersAndBoundary(){start(4);advance(4000);submit(0,1,"СВЕТ");advance(20000);
        fail("CLUE_ROUND_CLOSED",()->submit(1,1,"ЛЕТО"));
        var clues=mini(0).getAsJsonArray("revealedClues").get(0).getAsJsonObject();
        assertEquals(4,clues.size());assertEquals("—",clues.get(pid(3)).getAsString());
    }
    @Test void rejectsMalformedSecretRepeatedAndOversizedClues(){start(3);advance(4000);
        fail("INVALID_CLUE",()->submit(0,1,"яблоко"));fail("INVALID_CLUE",()->submit(0,1,"два слова"));submit(0,1,"свет");
    }
    @Test void unicodeNormalization(){assertEquals("ПОЛЁТ",ImpostorSession.normalize("поле\u0308т"));
        for(String text:List.of(""," ","<script>","a\n","a-b","x".repeat(25),"🙂"))assertThrows(RoomService.Failure.class,()->ImpostorSession.normalize(text));}
    @Test void spectatorAndHostCannotSubmit(){start(3);advance(4000);fail("NOT_ELIGIBLE",()->submit(3,1,"СВЕТ"));
        fail("NOT_ELIGIBLE",()->rooms.command(hostPeer,Protocol.decode(Protocol.event("SUBMIT_CLUE","x",fields(1,"СВЕТ")))));}
    @Test void sessionRoomRoundIdentityValidation(){start(3);advance(4000);
        fail("AUTH_REQUIRED",()->rooms.command(new TestPeer(),Protocol.decode(Protocol.event("SUBMIT_CLUE","x",fields(1,"СВЕТ")))));
        var wrongRoom=fields(1,"СВЕТ");wrongRoom.put("roomCode","OTHER");fail("WRONG_ROOM",()->rooms.command(peers.getFirst(),Protocol.decode(Protocol.event("SUBMIT_CLUE","x",wrongRoom))));
        var wrong=fields(1,"СВЕТ");wrong.put("playerId",pid(1));var spoof=wrong;fail("INVALID_CLUE",()->rooms.command(peers.getFirst(),Protocol.decode(Protocol.event("SUBMIT_CLUE","x",spoof))));
        var stale=fields(1,"СВЕТ");stale.put("sessionId","old");fail("STALE_IMPOSTOR_SESSION",()->rooms.command(peers.getFirst(),Protocol.decode(Protocol.event("SUBMIT_CLUE","x",stale))));
        fail("CLUE_ROUND_CLOSED",()->submit(0,2,"СВЕТ"));
    }
    @Test void reconnectRetainsPrivateRoleAndSubmission(){start(3);var role=mini(0).deepCopy();advance(4000);submit(0,1,"СВЕТ");rooms.detach(peers.getFirst().id());
        var replacement=new TestPeer();rooms.attach(code,s(players.getFirst(),"token"),replacement,"new");var restored=replacement.latest().getAsJsonObject("impostor");
        assertEquals(role.get("role"),restored.get("role"));assertEquals(role.get("secretWord"),restored.get("secretWord"));assertEquals("СВЕТ",s(restored,"ownClue"));
        fail("AUTH_REQUIRED",()->submit(0,1,"ЛЕТО"));
    }
    @Test void threeRoundsAndSuspicionIntegration(){start(3);advance(4000);
        for(int round=1;round<=3;round++){
            submit(0,round,List.of("ТЕПЛО","СОЛНЦЕ","ЛЕТО").get(round-1));
            submit(1,round,List.of("СВЕТ","ЛАМПА","ЛУНА").get(round-1));submit(2,round,List.of("НЕБО","ПОЛЁТ","ВЕТЕР").get(round-1));
            advance(500);assertEquals("PRELIMINARY_SUSPICION",s(mini(0),"phase"));assertEquals(5,mini(0).get("eligibleCount").getAsInt());
            for(int i=0;i<5;i++)rooms.command(peers.get(i),Protocol.decode(Protocol.event("SUBMIT_SUSPICION","v",Map.of("roomCode",code,"sessionId",session,"round",round,"suspectId",pid(i==0?1:0)))));
            advance(1);advance(1850);
            assertEquals(round,mini(0).getAsJsonArray("revealedClues").size());
            assertEquals(round==3?"EVIDENCE_REVIEW":"ROUND_CLUE_INPUT",s(mini(0),"phase"));
            if(round==1)fail("INVALID_CLUE",()->submit(0,2,"тепло"));
        }
        assertEquals(3,mini(0).get("revealSequence").getAsInt());advance(30000);assertEquals("FINAL_VOTING",s(mini(0),"phase"));
    }
    @Test void concurrentLastSubmissionsFinalizeOnce()throws Exception {start(4);advance(4000);var pool=Executors.newFixedThreadPool(4);
        try{var barrier=new CyclicBarrier(4);var jobs=new ArrayList<Future<?>>();for(int i=0;i<4;i++){int n=i;jobs.add(pool.submit(()->{try{barrier.await();submit(n,1,"СВЕТ");}catch(Exception e){throw new RuntimeException(e);}}));}for(var job:jobs)job.get();}
        finally{pool.shutdownNow();}assertEquals(1,mini(0).get("revealSequence").getAsInt());assertEquals(4,mini(0).getAsJsonArray("revealedClues").get(0).getAsJsonObject().size());}
    @Test void cleanupInvalidatesSession(){start(3);rooms.leave(code,s(host,"token"));fail("AUTH_REQUIRED",()->submit(0,1,"СВЕТ"));fail("ROOM_NOT_FOUND",()->rooms.view(code));}
    @Test void participantValidationAndNoRestart(){
        for(var ids:List.of(List.of("a","b"),List.of("a","b","c","d","e"),List.of("a","a","b")))
            assertThrows(RoomService.Failure.class,()->new ImpostorSession("room",ids));
        start(3);fail("GAME_ALREADY_STARTED",()->rooms.startImpostorGame(code,List.of(pid(0),pid(1),pid(2))));
    }
    @Test void invalidBudgetCannotProbeIndefinitely(){start(3);advance(4000);
        for(int i=0;i<4;i++)fail("INVALID_CLUE",()->submit(0,1,"ЯБЛОКО"));
        fail("INVALID_CLUE",()->submit(0,1,"СВЕТ"));assertFalse(mini(0).get("clueSubmitted").getAsBoolean());
        advance(20000);assertEquals("—",mini(0).getAsJsonArray("revealedClues").get(0).getAsJsonObject().get(pid(0)).getAsString());
    }
    @Test void malformedWirePayloads(){start(3);advance(4000);
        for(Object value:Arrays.asList(null,12,List.of("A"),Map.of("x","A"))){
            var data=fields(1,"СВЕТ");data.put("clue",value);
            fail("INVALID_CLUE",()->rooms.command(peers.getFirst(),Protocol.decode(Protocol.event("SUBMIT_CLUE","x",data))));
        }
        var data=fields(1,"СВЕТ");data.put("round","1");
        fail("INVALID_CLUE",()->rooms.command(peers.getFirst(),Protocol.decode(Protocol.event("SUBMIT_CLUE","x",data))));
    }
    @Test void roomIsolation(){start(3);advance(4000);
        var other=obj(rooms.create(Map.of("name","Other")));String otherCode=s(other,"code");
        var stranger=obj(rooms.join(otherCode,Map.of("name","Stranger")));var peer=new TestPeer();rooms.attach(otherCode,s(stranger,"token"),peer,"x");
        fail("WRONG_ROOM",()->rooms.command(peer,Protocol.decode(Protocol.event("SUBMIT_CLUE","x",fields(1,"СВЕТ")))));
        assertFalse(obj(rooms.view(otherCode)).has("impostor"));assertEquals(0,mini(0).get("submittedCount").getAsInt());
    }
    @Test void closedModelClearsHiddenInformation(){
        var model=new ImpostorSession("room",List.of("a","b","c"));model.begin(r->"СЛОВО",new java.security.SecureRandom(),clock.get());
        model.close();assertTrue(model.privateRole("a").isEmpty());assertFalse(model.advance(Long.MAX_VALUE,Set.of()));
    }

}
