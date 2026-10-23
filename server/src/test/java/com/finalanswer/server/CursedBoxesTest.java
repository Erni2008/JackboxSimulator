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
        assertEquals("ELIMINATION",mini(a).get("phase").getAsString());assertEquals(0,mini(h).get("survivorCount").getAsInt());
        assertFalse(mini(b).get("canAct").getAsBoolean());
        var ghost=mini(h).getAsJsonArray("ghosts").get(0).getAsJsonObject();assertEquals(9,ghost.get("boxId").getAsInt());assertEquals(one.get("selfId"),ghost.get("playerId"));assertTrue(ghost.get("canReturn").getAsBoolean());
        clock.set(mini(h).get("revealEndsAt").getAsLong());rooms.tick();assertEquals("FINISHED",mini(a).get("phase").getAsString());
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
    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.ValueSource(ints={0,2})
    void triviaAssignsWrongRespondentRatherThanFirstJoinedAndResumesAfterReveal(int ghostAnswer){
        command(h,"START_GAME",Map.of());clock.addAndGet(4000);rooms.tick();
        var question=h.latest();var fields=new HashMap<String,Object>();fields.put("gameId",question.get("gameId").getAsString());fields.put("questionId",question.getAsJsonObject("question").get("id").getAsString());
        command(h,"PRESENTATION_READY",fields);fields.put("answerIndex",1);command(a,"SUBMIT_ANSWER",fields);fields.put("answerIndex",0);command(b,"SUBMIT_ANSWER",fields);
        clock.addAndGet(20_000);rooms.tick();clock.addAndGet(720);command(h,"REVEAL_READY",fields);clock.addAndGet(3100);command(h,"NEXT_READY",fields);
        session=mini(h).get("sessionId").getAsString();assertEquals("HIDING",mini(b).get("role").getAsString());assertEquals("SHOOTING",mini(a).get("role").getAsString());
        command(h,"CURSED_SCENE_READY",base());command(b,"CURSED_HIDE",hideFields(7));
        rejects("CURSED_IN_PROGRESS",()->command(h,"NEXT_READY",fields));
        rejects("CURSED_IN_PROGRESS",()->command(h,"CURSED_RETURN_TO_LOBBY",base()));
        for(int number=1;number<=1;number++){int box=7;command(a,"CURSED_SELECT",selection(box));command(a,"CURSED_FIRE",fireFields(box,number));resolve();}
        assertEquals(0,mini(h).get("survivorCount").getAsInt());
        assertEquals("ELIMINATION",mini(h).get("phase").getAsString());
        rejects("REVIVAL_NOT_READY",()->rooms.revivePlayer(code,two.get("selfId").getAsString()));
        clock.set(mini(h).get("revealEndsAt").getAsLong());rooms.tick();command(h,"CURSED_RETURN_TO_LOBBY",base());
        assertFalse(h.latest().has("cursedBoxes"));assertEquals(2,h.latest().get("questionNumber").getAsInt());
        var victim=h.latest().getAsJsonArray("players").asList().stream().map(JsonElement::getAsJsonObject).filter(p->p.get("id").equals(two.get("selfId"))).findFirst().orElseThrow();assertFalse(victim.get("isAlive").getAsBoolean());assertEquals("GHOST",victim.get("lifeState").getAsString());assertTrue(victim.get("canReturn").getAsBoolean());
        assertTrue(h.latest().getAsJsonArray("participantIds").asList().contains(two.get("selfId")),"Ghost remains in the trivia roster");
        var nextFields=new HashMap<String,Object>();nextFields.put("gameId",h.latest().get("gameId").getAsString());nextFields.put("questionId",h.latest().getAsJsonObject("question").get("id").getAsString());
        command(h,"PRESENTATION_READY",nextFields);nextFields.put("answerIndex",ghostAnswer);command(b,"SUBMIT_ANSWER",nextFields);
        assertTrue(b.latest().get("hasSubmittedAnswer").getAsBoolean(),"Ghost can submit an answer");
        rejects("ANSWER_ALREADY_SUBMITTED",()->command(b,"SUBMIT_ANSWER",nextFields));
        nextFields.put("answerIndex",0);command(a,"SUBMIT_ANSWER",nextFields);
        clock.addAndGet(20_000);rooms.tick();clock.addAndGet(720);command(h,"REVEAL_READY",nextFields);
        var ghostResult=b.latest().getAsJsonArray("results").asList().stream().map(JsonElement::getAsJsonObject).filter(p->p.get("playerId").equals(two.get("selfId"))).findFirst().orElseThrow();
        assertEquals(ghostAnswer==2,ghostResult.get("isCorrect").getAsBoolean(),"Ghost receives authoritative result");
        clock.addAndGet(3100);command(h,"NEXT_READY",nextFields);
        assertTrue(h.latest().has("cursedBoxes"),"Ghost shoots even when their trivia answer was wrong");
        session=mini(h).get("sessionId").getAsString();
        assertEquals("SHOOTING",mini(b).get("role").getAsString());assertEquals("HIDING",mini(a).get("role").getAsString());
        assertFalse(mini(b).has("hidingBoxId"));command(h,"CURSED_SCENE_READY",base());
        rejects("NOT_HIDING_PLAYER",()->command(b,"CURSED_HIDE",hideFields(9)));
        command(a,"CURSED_HIDE",hideFields(9));
        command(b,"CURSED_SELECT",selection(0));command(b,"CURSED_FIRE",fireFields(0,1));resolve();
        clock.set(mini(h).get("revealEndsAt").getAsLong());rooms.tick();command(h,"CURSED_RETURN_TO_LOBBY",base());
        var stillGhost=b.latest().getAsJsonArray("players").asList().stream().map(JsonElement::getAsJsonObject).filter(p->p.get("id").equals(two.get("selfId"))).findFirst().orElseThrow();
        assertTrue(stillGhost.get("isGhost").getAsBoolean(),"Shooting does not resurrect a ghost");
        assertEquals(3,h.latest().get("questionNumber").getAsInt());
        assertTrue(rooms.revivePlayer(code,two.get("selfId").getAsString()));assertFalse(rooms.revivePlayer(code,two.get("selfId").getAsString()));
        var restored=h.latest().getAsJsonArray("players").asList().stream().map(JsonElement::getAsJsonObject).filter(p->p.get("id").equals(two.get("selfId"))).findFirst().orElseThrow();assertTrue(restored.get("isAlive").getAsBoolean());
        assertTrue(h.latest().getAsJsonArray("participantIds").asList().contains(two.get("selfId")));
    }

    @Test void privateTargetsAreLockedTogetherAndDuplicateBoxesFireOnlyOnce(){
        var game=new CursedBoxesSession(List.of(new CursedBoxesSession.Player("h","H","ghost"),new CursedBoxesSession.Player("a","A","zombie"),new CursedBoxesSession.Player("b","B","voodoo")),Set.of("h"),1,true);
        var online=Set.of("h","a","b");game.ready(true,clock.get());game.hide("h",5);
        game.select("a",2,5);var first=game.fire("a","one",2,5,1,clock.get());
        assertNull(game.pending(),"No shot before every target is locked");
        var phone=game.snapshot("b",false,true,online,clock.get());
        assertEquals(-1,phone.get("selectedCrateId"));assertEquals("TARGET_SELECTION",phone.get("phase"));
        assertEquals("AVAILABLE",((Map<?,?>)((List<?>)phone.get("boxes")).get(5)).get("state"));
        assertFalse(phone.containsKey("pendingShot"));assertFalse(phone.containsKey("hostContents"));
        assertEquals(-1,game.snapshot("host",true,true,online,clock.get()).get("selectedCrateId"));
        game.select("b",3,5);var duplicate=game.fire("b","two",3,5,1,clock.get());
        assertSame(first,game.pending());assertSame(duplicate,game.fire("b","two",3,5,1,clock.get()));
        game.started(first.id,clock.get());game.impact(first.id,clock.get()+30);game.complete(first.id,clock.get()+1100);
        assertNull(game.pending());assertEquals(1<<5,game.destroyedMask());assertEquals(Set.of("h"),game.eliminatedPlayers());
        var a=game.snapshot("a",false,true,online,clock.get()+1100);var b=game.snapshot("b",false,true,online,clock.get()+1100);
        assertEquals(((Map<?,?>)a.get("lastResult")).get("shotId"),((Map<?,?>)b.get("lastResult")).get("shotId"));
        assertEquals(1L,game.snapshot("host",true,true,online,clock.get()+1100).get("presentedShotCount"));
        game.complete(first.id,clock.get()+1200);assertNull(game.pending(),"Duplicate completion cannot fire again");
    }
    @Test void distinctPrivateTargetsUseOneContinuousQueueAndLeftPlayersCannotBlockLock(){
        var game=new CursedBoxesSession(List.of(new CursedBoxesSession.Player("h","H","ghost"),new CursedBoxesSession.Player("a","A","zombie"),new CursedBoxesSession.Player("b","B","voodoo")),Set.of("h"),1,true);
        game.ready(true,clock.get());game.hide("h",9);game.select("b",3,6);game.fire("b","b",3,6,1,clock.get());
        game.select("a",2,5);var first=game.fire("a","a",2,5,1,clock.get());assertEquals(5,game.pending().boxId,"Roster order, independent of packet arrival");
        game.started(first.id,clock.get());game.impact(first.id,clock.get()+30);game.complete(first.id,clock.get()+1100);
        var second=game.pending();assertEquals(6,second.boxId);game.complete(first.id,clock.get()+1200);assertSame(second,game.pending());
        game.started(second.id,clock.get()+1200);game.impact(second.id,clock.get()+1230);game.complete(second.id,clock.get()+2300);assertNull(game.pending());assertEquals((1<<5)|(1<<6),game.destroyedMask());
        var left=new CursedBoxesSession(List.of(new CursedBoxesSession.Player("h","H","ghost"),new CursedBoxesSession.Player("a","A","zombie"),new CursedBoxesSession.Player("b","B","voodoo")),Set.of("h"),1,true);
        left.ready(true,clock.get());left.hide("h",9);left.select("a",2,0);left.fire("a","a",2,0,1,clock.get());assertNull(left.pending());
        left.tick(clock.get(),Set.of("b"));assertNotNull(left.pending(),"Explicit leaver forfeits unconfirmed choice");
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

    @Test void ammunitionPresentationBudgetIsHostOnlyAndReservationsAreCountedOnce(){
        var game=new CursedBoxesSession(List.of(new CursedBoxesSession.Player("h","H","ghost"),new CursedBoxesSession.Player("s","S","zombie")),Set.of("h"),2);
        Set<String> online=Set.of("h","s");game.ready(true,clock.get());game.hide("h",15);
        assertEquals(2,game.snapshot("host",true,true,online,clock.get()).get("remainingShotCount"));
        assertFalse(game.snapshot("s",false,true,online,clock.get()).containsKey("remainingShotCount"));
        game.select("s",2,0);var shot=game.fire("s","one",2,0,1,clock.get());
        assertSame(shot,game.fire("s","one",2,0,1,clock.get()));
        assertEquals(1,game.snapshot("host",true,true,online,clock.get()).get("remainingShotCount"));
        game.started(shot.id,clock.get());game.impact(shot.id,clock.get()+30);
        assertEquals(1L,game.snapshot("host",true,true,online,clock.get()+30).get("presentedShotCount"));
    }

    @Test void presentationBudgetRetainsDisconnectedSeatsButExcludesExplicitLeavers(){
        var game=new CursedBoxesSession(List.of(new CursedBoxesSession.Player("h","H","ghost"),new CursedBoxesSession.Player("a","A","zombie"),new CursedBoxesSession.Player("b","B","dracula")),Set.of("h"),2);
        game.ready(true,clock.get());game.hide("h",15);
        assertEquals(4,game.snapshot("host",true,true,Set.of("h","a"),clock.get()).get("remainingShotCount"));
        game.tick(clock.get(),Set.of("b"));
        assertEquals(2,game.snapshot("host",true,true,Set.of("h","a"),clock.get()).get("remainingShotCount"));
    }

    @Test void allVictimsShareFinalDeathStageAndSurvivorsRemainSecretUntilTheirReveal(){
        var game=new CursedBoxesSession(List.of(new CursedBoxesSession.Player("a","A","ghost"),new CursedBoxesSession.Player("b","B","voodoo"),new CursedBoxesSession.Player("c","C","pumpkin"),new CursedBoxesSession.Player("s","S","zombie")),Set.of("a","b","c"),2);
        var online=Set.of("a","b","c","s");long now=clock.get();game.ready(true,now);game.hide("a",2);game.hide("b",9);game.hide("c",13);
        for(int i=0;i<2;i++){
            int box=i==0?2:9;game.select("s",4,box);var shot=game.fire("s","shot"+i,4,box,i+1,now);game.started(shot.id,now);game.impact(shot.id,now+30);game.complete(shot.id,now+1100);now+=1200;
            if(i==0)assertFalse(game.snapshot("s",false,true,online,now).containsKey("ghosts"));
        }
        var state=game.snapshot("host",true,true,online,now);assertEquals("ELIMINATION",state.get("phase"));assertEquals(2,((List<?>)state.get("ghosts")).size());
        assertEquals(Set.of("a","b"),game.eliminatedPlayers());assertFalse(game.finished());
        var phone=game.snapshot("c",false,true,online,now);assertEquals(0,((List<?>)phone.get("survivors")).size());
        long reveal=(long)state.get("revealStartedAt");assertTrue(reveal>now);game.tick(reveal,Set.of());assertEquals("REVEALING",game.snapshot("s",false,true,online,reveal).get("phase"));
        game.tick((long)state.get("revealEndsAt"),Set.of());assertTrue(game.finished());assertEquals(1,game.snapshot("host",true,true,online,reveal).get("survivorCount"));
    }

}
