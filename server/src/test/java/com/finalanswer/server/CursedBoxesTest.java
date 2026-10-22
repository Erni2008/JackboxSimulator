package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.game.CursedBoxesSession;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import org.junit.jupiter.api.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;

/** Real authenticated room commands plus focused authoritative survival cases. */
class CursedBoxesTest {
    final AtomicLong clock=new AtomicLong(1_000_000);
    final RoomService rooms=new RoomService(clock::get,10,"");
    final RoomServiceTest.TestPeer h=new RoomServiceTest.TestPeer(),a=new RoomServiceTest.TestPeer(),b=new RoomServiceTest.TestPeer();
    JsonObject host,one,two;String code,session;
    @BeforeEach void setup(){
        host=json(rooms.create(Map.of("name","Gallery","maxPlayers","8")));code=host.get("code").getAsString();
        rooms.attach(code,host.get("token").getAsString(),h,"host");
        one=json(rooms.join(code,Map.of("name","Hider","characterId","ghost")));two=json(rooms.join(code,Map.of("name","Shooter","characterId","voodoo")));
        rooms.attach(code,one.get("token").getAsString(),a,"a");rooms.attach(code,two.get("token").getAsString(),b,"b");
    }
    JsonObject json(String text){return JsonParser.parseString(text).getAsJsonObject();}
    JsonObject mini(RoomServiceTest.TestPeer peer){return peer.latest().getAsJsonObject("cursedBoxes");}
    void command(RoomServiceTest.TestPeer peer,String type,Map<String,?> payload){command(peer,type,UUID.randomUUID().toString(),payload);}
    void command(RoomServiceTest.TestPeer peer,String type,String request,Map<String,?> payload){rooms.command(peer,Protocol.decode(Protocol.event(type,request,payload)));}
    void start(){command(h,"START_CURSED_BOXES",Map.of("roomCode",code,"sessionId",h.latest().get("lobbyId").getAsString()));session=mini(h).get("sessionId").getAsString();command(h,"CURSED_SCENE_READY",base());}
    Map<String,Object> base(){return Map.of("roomCode",code,"sessionId",session);}
    Map<String,Object> selection(int box){var value=new HashMap<>(base());value.put("turnId",mini(h).get("turnId").getAsInt());value.put("boxId",box);return value;}
    Map<String,Object> hideFields(int box){var value=new HashMap<>(base());value.put("boxId",box);return value;}
    Map<String,Object> fireFields(int box,int number){var value=selection(box);value.put("shotNumber",number);return value;}
    void stage(String type,String shot){var value=new HashMap<>(base());value.put("shotId",shot);command(h,type,value);}
    void resolve(){String shot=mini(h).getAsJsonObject("pendingShot").get("id").getAsString();stage("CURSED_SHOT_STARTED",shot);clock.addAndGet(30);stage("CURSED_SHOT_IMPACT",shot);clock.addAndGet(1070);stage("CURSED_SHOT_COMPLETE",shot);}
    void shoot(int box,int number){command(b,"CURSED_SELECT",selection(box));command(b,"CURSED_FIRE",fireFields(box,number));resolve();}
    void rejects(String code,Runnable action){assertEquals(code,assertThrows(RoomService.Failure.class,action::run).getMessage());}
    @Test void secretChoiceLocksBeforeAnyShotAndCannotBeChanged(){
        start();assertEquals("HIDING_SELECTION",mini(a).get("phase").getAsString());assertTrue(mini(a).get("canHide").getAsBoolean());
        assertEquals("HIDING",mini(a).get("role").getAsString());assertEquals("SHOOTING",mini(b).get("role").getAsString());
        assertEquals(0,mini(h).getAsJsonArray("hostContents").size());assertEquals(16,mini(a).getAsJsonArray("boxes").size());
        rejects("HIDING_NOT_LOCKED",()->command(b,"CURSED_SELECT",selection(0)));
        rejects("NOT_HIDING_PLAYER",()->command(b,"CURSED_HIDE",hideFields(15)));
        command(a,"CURSED_HIDE",hideFields(15));command(a,"CURSED_HIDE",hideFields(15));
        rejects("HIDING_ALREADY_CONFIRMED",()->command(a,"CURSED_HIDE",hideFields(2)));
        rejects("NOT_SHOOTING_PLAYER",()->command(a,"CURSED_SELECT",selection(0)));
        assertTrue(mini(b).get("canAct").getAsBoolean());assertFalse(mini(b).has("hidingBoxId"));assertFalse(mini(b).has("hostContents"));
        assertFalse(json(rooms.view(code)).getAsJsonObject("cursedBoxes").has("hostContents"));
        for(var box:mini(b).getAsJsonArray("boxes")){assertFalse(box.getAsJsonObject().has("characterId"));assertFalse(box.getAsJsonObject().has("empty"));}
        var occupant=mini(h).getAsJsonArray("hostContents").get(0).getAsJsonObject();assertEquals(15,occupant.get("boxId").getAsInt());assertEquals(one.get("selfId"),occupant.get("playerId"));
    }
    @Test void twoEmptyShotsPreserveHiderAndRevealOnlyChosenBox(){
        start();command(a,"CURSED_HIDE",hideFields(15));shoot(0,1);
        assertFalse(mini(h).has("survivors"));assertEquals(1,mini(b).get("shotsRemaining").getAsInt());
        shoot(1,2);assertEquals("REVEALING",mini(h).get("phase").getAsString());
        assertEquals(1,mini(h).get("survivorCount").getAsInt());assertEquals(15,mini(h).getAsJsonArray("survivors").get(0).getAsJsonObject().get("boxId").getAsInt());
        assertEquals(0,mini(b).getAsJsonArray("survivors").size());assertTrue(mini(a).getAsJsonArray("outcomes").get(0).getAsJsonObject().get("survived").getAsBoolean());
        clock.set(mini(h).get("revealEndsAt").getAsLong());rooms.tick();assertEquals("FINISHED",mini(h).get("phase").getAsString());
        assertEquals(3,mini(h).get("destroyedCrateIds").getAsInt());assertEquals(1,mini(b).getAsJsonArray("survivors").size());
    }
    @Test void hitEliminatesOnlyOccupantAndExcludesFinalReveal(){
        start();command(a,"CURSED_HIDE",hideFields(9));shoot(9,1);shoot(0,2);
        assertEquals("FINISHED",mini(a).get("phase").getAsString());assertEquals(0,mini(h).get("survivorCount").getAsInt());
        assertEquals(0,mini(h).getAsJsonArray("survivors").size());assertFalse(mini(a).getAsJsonArray("outcomes").get(0).getAsJsonObject().get("survived").getAsBoolean());
        assertEquals("ghost",mini(b).getAsJsonArray("boxes").get(9).getAsJsonObject().get("characterId").getAsString());
    }
    @Test void choiceSurvivesReconnectWithoutLeakingAndAcceptedShotIsIdempotent(){
        start();command(a,"CURSED_HIDE",hideFields(7));rooms.detach(a.id());rooms.attach(code,one.get("token").getAsString(),a,"again");
        assertEquals(7,mini(a).get("hidingBoxId").getAsInt());assertFalse(mini(b).has("hidingBoxId"));
        command(b,"CURSED_SELECT",selection(0));var fields=fireFields(0,1);command(b,"CURSED_FIRE","once",fields);command(b,"CURSED_FIRE","once",fields);
        assertEquals(1,mini(b).get("shotsRemaining").getAsInt());resolve();command(b,"CURSED_FIRE","once",fields);
        assertFalse(mini(h).has("pendingShot"));assertEquals(1,mini(b).get("shotsRemaining").getAsInt());
        rooms.detach(h.id());rooms.attach(code,host.get("token").getAsString(),h,"restored");command(h,"CURSED_SCENE_READY",base());
        assertEquals(7,mini(h).getAsJsonArray("hostContents").get(0).getAsJsonObject().get("boxId").getAsInt());
    }
    @Test void allSixteenChoicesRetainExactCharacterIdentity(){
        for(int box=0;box<16;box++){
            var game=new CursedBoxesSession(List.of(new CursedBoxesSession.Player("h","H","ghost"),new CursedBoxesSession.Player("s","S","zombie")),Set.of("h"));
            game.ready(true,clock.get());game.hide("h",box);
            var contents=(List<?>)game.snapshot("host",true,true,Set.of("h","s"),clock.get()).get("hostContents");
            assertEquals(box,((Map<?,?>)contents.getFirst()).get("boxId"));
        }
    }
    @Test void multipleHidersLockTogetherAndOnlyActualVictimIsEliminated(){
        var game=new CursedBoxesSession(List.of(new CursedBoxesSession.Player("a","A","ghost"),new CursedBoxesSession.Player("b","B","voodoo"),new CursedBoxesSession.Player("s","S","zombie")),Set.of("a","b"));
        game.ready(true,clock.get());game.hide("a",3);
        rejects("HIDING_NOT_LOCKED",()->game.select("s",3,0));rejects("HIDING_BOX_UNAVAILABLE",()->game.hide("b",3));game.hide("b",14);
        game.select("s",3,3);var shot=game.fire("s","1",3,3,1,clock.get());game.started(shot.id,clock.get());game.impact(shot.id,clock.get()+30);game.complete(shot.id,clock.get()+1100);
        assertEquals(Set.of("a"),game.eliminatedPlayers());assertEquals(14,((Map<?,?>)((List<?>)game.snapshot("b",false,true,Set.of("b","s"),clock.get()).get("boxes")).get(14)).get("id"));
    }
    @Test void triviaAssignsWrongRespondentRatherThanFirstJoinedAndResumesAfterReveal(){
        command(h,"START_GAME",Map.of());clock.addAndGet(4000);rooms.tick();
        var question=h.latest();var fields=new HashMap<String,Object>();fields.put("gameId",question.get("gameId").getAsString());fields.put("questionId",question.getAsJsonObject("question").get("id").getAsString());
        command(h,"PRESENTATION_READY",fields);fields.put("answerIndex",1);command(a,"SUBMIT_ANSWER",fields);fields.put("answerIndex",0);command(b,"SUBMIT_ANSWER",fields);
        clock.addAndGet(20_000);rooms.tick();clock.addAndGet(720);command(h,"REVEAL_READY",fields);clock.addAndGet(3100);command(h,"NEXT_READY",fields);
        session=mini(h).get("sessionId").getAsString();assertEquals("HIDING",mini(b).get("role").getAsString());assertEquals("SHOOTING",mini(a).get("role").getAsString());
        command(h,"CURSED_SCENE_READY",base());command(b,"CURSED_HIDE",hideFields(7));
        rejects("CURSED_IN_PROGRESS",()->command(h,"NEXT_READY",fields));
        rejects("CURSED_IN_PROGRESS",()->command(h,"CURSED_RETURN_TO_LOBBY",base()));
        for(int number=1;number<=1;number++){int box=7;command(a,"CURSED_SELECT",selection(box));command(a,"CURSED_FIRE",fireFields(box,number));resolve();}
        assertEquals(0,mini(h).get("survivorCount").getAsInt());command(h,"CURSED_RETURN_TO_LOBBY",base());
        assertFalse(h.latest().has("cursedBoxes"));assertEquals(2,h.latest().get("questionNumber").getAsInt());
        var victim=h.latest().getAsJsonArray("players").asList().stream().map(JsonElement::getAsJsonObject).filter(p->p.get("id").equals(two.get("selfId"))).findFirst().orElseThrow();assertFalse(victim.get("isAlive").getAsBoolean());
    }

    @Test void twoWrongPlayersHideAndEachCorrectPlayerHasExactlyOneShot(){
        var game=new CursedBoxesSession(List.of(new CursedBoxesSession.Player("a","A","ghost"),new CursedBoxesSession.Player("b","B","puppeteer"),new CursedBoxesSession.Player("c","C","dracula"),new CursedBoxesSession.Player("d","D","voodoo")),Set.of("a","b"),1);
        game.ready(true,clock.get());game.hide("a",5);rejects("HIDING_NOT_LOCKED",()->game.select("c",3,0));game.hide("b",10);
        for(int i=0;i<2;i++){
            String player=i==0?"c":"d";int turn=3+i,box=i==0?5:0;long now=clock.addAndGet(3000);
            game.select(player,turn,box);var shot=game.fire(player,"one",turn,box,1,now);game.started(shot.id,now);game.impact(shot.id,now+30);game.complete(shot.id,now+1100);
            var state=game.snapshot(player,false,true,Set.of("a","b","c","d"),now+1100);assertEquals(1,state.get("shotLimit"));assertEquals(0,state.get("shotsRemaining"));
            assertSame(shot,game.fire(player,"one",turn,box,1,now+1100));
        }
        assertEquals(Set.of("a"),game.eliminatedPlayers());
        var state=game.snapshot("host",true,true,Set.of("a","b","c","d"),clock.get()+1100);
        assertEquals(1,state.get("survivorCount"));assertEquals(10,((Map<?,?>)((List<?>)state.get("survivors")).getFirst()).get("boxId"));
        assertEquals((1<<5)|1,state.get("destroyedCrateIds"));
    }

}
