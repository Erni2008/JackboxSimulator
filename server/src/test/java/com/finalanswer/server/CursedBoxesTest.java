package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import org.junit.jupiter.api.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;

class CursedBoxesTest {
    final AtomicLong clock=new AtomicLong(1_000_000);
    final RoomService rooms=new RoomService(clock::get,10,"");
    final RoomServiceTest.TestPeer h=new RoomServiceTest.TestPeer(),a=new RoomServiceTest.TestPeer(),b=new RoomServiceTest.TestPeer();
    JsonObject host,one,two;String code,session;
    @BeforeEach void setup(){
        host=json(rooms.create(Map.of("name","Gallery","maxPlayers","8")));code=host.get("code").getAsString();
        rooms.attach(code,host.get("token").getAsString(),h,"host");
        one=json(rooms.join(code,Map.of("name","Игрок А","characterId","ghost")));two=json(rooms.join(code,Map.of("name","Player B","characterId","voodoo")));
        rooms.attach(code,one.get("token").getAsString(),a,"a");rooms.attach(code,two.get("token").getAsString(),b,"b");
    }
    JsonObject json(String text){return JsonParser.parseString(text).getAsJsonObject();}
    JsonObject mini(RoomServiceTest.TestPeer peer){return peer.latest().getAsJsonObject("cursedBoxes");}
    void command(RoomServiceTest.TestPeer peer,String type,Map<String,?> payload){command(peer,type,UUID.randomUUID().toString(),payload);}
    void command(RoomServiceTest.TestPeer peer,String type,String request,Map<String,?> payload){rooms.command(peer,Protocol.decode(Protocol.event(type,request,payload)));}
    void start(){command(h,"START_CURSED_BOXES",Map.of("roomCode",code,"sessionId",h.latest().get("lobbyId").getAsString()));session=mini(h).get("sessionId").getAsString();}
    Map<String,Object> base(){return Map.of("roomCode",code,"sessionId",session);}
    void ready(){command(h,"CURSED_SCENE_READY",base());}
    Map<String,Object> selection(int box){var value=new HashMap<>(base());value.put("turnId",mini(h).get("turnId").getAsInt());value.put("boxId",box);return value;}
    Map<String,Object> fireFields(int box,int number){var value=selection(box);value.put("shotNumber",number);return value;}
    String pending(){return mini(h).getAsJsonObject("pendingShot").get("id").getAsString();}
    void stage(String type,String shot){var value=new HashMap<>(base());value.put("shotId",shot);command(h,type,value);}
    void resolve(){String shot=pending();stage("CURSED_SHOT_STARTED",shot);clock.addAndGet(30);stage("CURSED_SHOT_IMPACT",shot);clock.addAndGet(1070);stage("CURSED_SHOT_COMPLETE",shot);}
    void shoot(RoomServiceTest.TestPeer peer,int box,int number){command(peer,"CURSED_SELECT",selection(box));command(peer,"CURSED_FIRE",fireFields(box,number));resolve();}
    void rejects(String code,Runnable action){assertEquals(code,assertThrows(RoomService.Failure.class,action::run).getMessage());}
    JsonObject box(RoomServiceTest.TestPeer peer,int id){return mini(peer).getAsJsonArray("boxes").get(id).getAsJsonObject();}
    @Test void hiddenAssignmentsAndIndicesAreRedactedUntilPhysicalImpact(){
        start();assertEquals("PREPARING",mini(a).get("phase").getAsString());assertFalse(mini(a).get("canAct").getAsBoolean());ready();
        assertEquals(16,mini(a).getAsJsonArray("boxes").size());
        for(int i=0;i<16;i++){assertEquals(i,box(a,i).get("id").getAsInt());assertFalse(box(a,i).has("characterId"));assertFalse(box(a,i).has("nickname"));assertFalse(box(a,i).has("empty"));}
        assertTrue(mini(h).has("hostContents"));assertFalse(mini(a).has("hostContents"));assertFalse(json(rooms.view(code)).getAsJsonObject("cursedBoxes").has("hostContents"));
        int target=mini(h).getAsJsonArray("hostContents").get(0).getAsJsonObject().get("boxId").getAsInt();
        command(a,"CURSED_SELECT",selection(target));assertEquals(2,mini(a).get("shotsRemaining").getAsInt());assertFalse(mini(a).has("pendingShot"));assertEquals(-1,mini(b).get("selectedCrateId").getAsInt());assertEquals(target,mini(h).get("selectedCrateId").getAsInt());
        command(a,"CURSED_FIRE",fireFields(target,1));assertEquals("LOCKED",box(b,target).get("state").getAsString());assertFalse(box(a,target).has("characterId"));assertFalse(mini(a).has("lastResult"));
        String shot=pending();stage("CURSED_SHOT_STARTED",shot);rejects("SHOT_NOT_READY",()->stage("CURSED_SHOT_IMPACT",shot));assertFalse(box(a,target).has("characterId"));
        clock.addAndGet(30);stage("CURSED_SHOT_IMPACT",shot);assertEquals("DESTROYED",box(a,target).get("state").getAsString());assertEquals(box(a,target),box(b,target));assertTrue(box(b,target).has("nickname"));assertTrue(mini(a).has("lastResult"));
        rejects("SHOT_NOT_READY",()->stage("CURSED_SHOT_COMPLETE",shot));clock.addAndGet(1070);stage("CURSED_SHOT_COMPLETE",shot);stage("CURSED_SHOT_IMPACT",shot);stage("CURSED_SHOT_COMPLETE",shot);
        assertEquals(1,mini(a).get("shotsRemaining").getAsInt());
    }
    @Test void twoShotsSequentialTurnsDuplicatesAndInvalidActions(){
        rejects("HOST_ONLY",()->command(a,"START_CURSED_BOXES",Map.of("roomCode",code,"sessionId",h.latest().get("lobbyId").getAsString())));
        start();ready();
        rejects("NOT_YOUR_TURN",()->command(b,"CURSED_SELECT",selection(0)));
        rejects("BOX_NOT_SELECTED",()->command(a,"CURSED_FIRE",fireFields(0,1)));
        var forged=new HashMap<>(fireFields(0,1));forged.put("playerId",two.get("selfId").getAsString());rejects("INVALID_CURSED_ACTION",()->command(a,"CURSED_FIRE",forged));
        rejects("INVALID_BOX",()->command(a,"CURSED_SELECT",selection(16)));
        var bad=selection(0);bad.put("boxId","0");rejects("INVALID_CURSED_ACTION",()->command(a,"CURSED_SELECT",bad));assertEquals(2,mini(a).get("shotsRemaining").getAsInt());
        command(a,"CURSED_SELECT",selection(0));var first=fireFields(0,1);command(a,"CURSED_FIRE","first-request",first);
        command(a,"CURSED_FIRE","first-request",first);assertEquals(1,mini(a).get("shotsRemaining").getAsInt());
        rejects("SHOT_IN_PROGRESS",()->command(a,"CURSED_FIRE",first));rejects("REQUEST_ID_REUSED",()->command(a,"CURSED_FIRE","first-request",fireFields(1,1)));
        var stage=new HashMap<>(base());stage.put("shotId",pending());rejects("HOST_ONLY",()->command(a,"CURSED_SHOT_STARTED",stage));
        resolve();command(a,"CURSED_FIRE","first-request",first);assertEquals(1,mini(a).get("shotsRemaining").getAsInt());assertFalse(mini(a).has("pendingShot"));
        rejects("BOX_DESTROYED",()->command(a,"CURSED_SELECT",selection(0)));command(a,"CURSED_SELECT",selection(1));rejects("STALE_CURSED_SHOT",()->command(a,"CURSED_FIRE",fireFields(1,1)));
        command(a,"CURSED_FIRE",fireFields(1,2));resolve();assertTrue(mini(b).get("canAct").getAsBoolean());assertEquals(0,mini(a).get("shotsRemaining").getAsInt());
        rejects("NOT_YOUR_TURN",()->command(a,"CURSED_SELECT",selection(2)));shoot(b,2,1);shoot(b,3,2);
        assertEquals(mini(a).get("survivorCount").getAsInt()==0?"FINISHED":"REVEALING",mini(a).get("phase").getAsString());clock.addAndGet(60_000);rooms.tick();assertEquals("FINISHED",mini(a).get("phase").getAsString());assertEquals(4,Integer.bitCount(mini(a).get("destroyedCrateIds").getAsInt()));assertEquals(0,mini(b).get("shotsRemaining").getAsInt());
        rejects("CURSED_FINISHED",()->command(b,"CURSED_SELECT",selection(4)));
        command(h,"CURSED_RETURN_TO_LOBBY",base());assertFalse(h.latest().has("cursedBoxes"));assertTrue(h.latest().get("canStart").getAsBoolean());
    }
    @Test void reconnectAndPausedHostNeverResetAmmoOrLeakOrDropAcceptedShots(){
        start();ready();command(a,"CURSED_SELECT",selection(4));rooms.detach(a.id());var again=new RoomServiceTest.TestPeer();rooms.attach(code,one.get("token").getAsString(),again,"again");
        assertEquals(one.get("selfId"),again.latest().get("selfId"));assertEquals(4,mini(again).get("selectedCrateId").getAsInt());assertEquals(2,mini(again).get("shotsRemaining").getAsInt());
        command(again,"CURSED_FIRE","durable-shot",fireFields(4,1));String shot=pending();rooms.detach(again.id());rooms.detach(h.id());
        assertFalse(mini(b).get("hostReady").getAsBoolean());assertEquals("PREPARING",mini(b).get("phase").getAsString());assertTrue(mini(b).has("pendingShot"));
        rooms.attach(code,host.get("token").getAsString(),h,"host-again");ready();clock.addAndGet(15_000);rooms.tick();
        assertFalse(mini(h).get("hostReady").getAsBoolean());assertEquals(shot,pending());ready();resolve();
        var restored=new RoomServiceTest.TestPeer();rooms.attach(code,one.get("token").getAsString(),restored,"restored");assertEquals(1,mini(restored).get("shotsRemaining").getAsInt());assertEquals("DESTROYED",box(restored,4).get("state").getAsString());assertFalse(mini(restored).has("hostContents"));
    }
    @Test void eightPlayersGetExactlySixteenDistinctShotsAndAssignmentsStayPersistent(){
        var peers=new ArrayList<RoomServiceTest.TestPeer>(List.of(a,b));
        for(String type:List.of("dracula","plague_doctor","puppeteer","skeleton","zombie","pumpkin")){
            var player=json(rooms.join(code,Map.of("name",type,"characterId",type)));var peer=new RoomServiceTest.TestPeer();rooms.attach(code,player.get("token").getAsString(),peer,type);peers.add(peer);
        }
        start();ready();assertEquals(8,mini(h).getAsJsonArray("hostContents").size());
        for(int i=0;i<8;i++){shoot(peers.get(i),i*2,1);shoot(peers.get(i),i*2+1,2);for(int box=0;box<=i*2+1;box++)assertEquals("DESTROYED",box(peers.get(i),box).get("state").getAsString());}
        assertEquals(0xffff,mini(h).get("destroyedCrateIds").getAsInt());assertEquals("FINISHED",mini(h).get("phase").getAsString());clock.addAndGet(60_000);rooms.tick();assertEquals(0xffff,mini(h).get("destroyedCrateIds").getAsInt());
    }
    @Test void survivorPhaseIsAuthoritativeDelayedRedactedAndReconnectable(){
        start();ready();
        var assignments=mini(h).getAsJsonArray("hostContents");var victim=assignments.get(0).getAsJsonObject();var survivor=assignments.get(1).getAsJsonObject();
        int killed=victim.get("boxId").getAsInt(),safe=survivor.get("boxId").getAsInt();
        var empties=new ArrayList<Integer>();for(int i=0;i<16;i++)if(i!=killed&&i!=safe)empties.add(i);
        shoot(a,killed,1);assertFalse(mini(h).has("survivors"));shoot(a,empties.get(0),2);assertFalse(mini(b).has("outcomes"));shoot(b,empties.get(1),1);
        assertEquals("SELECTING",mini(h).get("phase").getAsString());assertFalse(mini(h).has("survivors"));
        shoot(b,empties.get(2),2);
        assertEquals("REVEALING",mini(h).get("phase").getAsString());assertEquals(1,mini(h).get("survivorCount").getAsInt());
        assertFalse(mini(a).get("canAct").getAsBoolean());assertFalse(mini(b).get("canAct").getAsBoolean());
        assertEquals(1,mini(h).getAsJsonArray("survivors").size());assertEquals(survivor,mini(h).getAsJsonArray("survivors").get(0));
        assertEquals(0,mini(a).getAsJsonArray("survivors").size());assertFalse(box(a,safe).has("characterId"));
        assertEquals(1,mini(h).getAsJsonArray("outcomes").asList().stream().filter(e->e.getAsJsonObject().get("survived").getAsBoolean()).count());
        rejects("INVALID_CURSED_ACTION",()->command(a,"CURSED_REVEAL_COMPLETE",base()));
        rejects("CURSED_FINISHED",()->command(b,"CURSED_SELECT",selection(15)));
        long at=mini(h).get("revealStartedAt").getAsLong(),end=mini(h).get("revealEndsAt").getAsLong();int damage=mini(h).get("destroyedCrateIds").getAsInt();
        rooms.detach(a.id());rooms.detach(h.id());clock.set(at+1000);rooms.tick();
        assertEquals(1,mini(b).getAsJsonArray("survivors").size());assertEquals("REVEALING",mini(b).get("phase").getAsString());
        rooms.attach(code,host.get("token").getAsString(),h,"host-return");assertEquals(at,mini(h).get("revealStartedAt").getAsLong());
        clock.set(end);rooms.tick();assertEquals("FINISHED",mini(b).get("phase").getAsString());assertEquals(damage,mini(h).get("destroyedCrateIds").getAsInt());
        assertEquals(safe,mini(b).getAsJsonArray("survivors").get(0).getAsJsonObject().get("boxId").getAsInt());
    }
    @Test void fiveSurvivorsAreSequentialAndEmptyBoxesNeverEnterResults(){
        var peers=new ArrayList<RoomServiceTest.TestPeer>(List.of(a,b));
        for(String type:List.of("dracula","plague_doctor","puppeteer")){var p=json(rooms.join(code,Map.of("name",type,"characterId",type)));var peer=new RoomServiceTest.TestPeer();rooms.attach(code,p.get("token").getAsString(),peer,type);peers.add(peer);}
        start();ready();var occupied=new HashSet<Integer>();for(var e:mini(h).getAsJsonArray("hostContents"))occupied.add(e.getAsJsonObject().get("boxId").getAsInt());
        var empty=new ArrayList<Integer>();for(int i=0;i<16;i++)if(!occupied.contains(i))empty.add(i);
        for(int i=0;i<5;i++){shoot(peers.get(i),empty.get(i*2),1);shoot(peers.get(i),empty.get(i*2+1),2);if(i<4)assertFalse(mini(h).has("survivors"));}
        assertEquals(5,mini(h).get("survivorCount").getAsInt());assertEquals(5,mini(h).getAsJsonArray("survivors").size());
        long start=mini(h).get("revealStartedAt").getAsLong();clock.set(start+1000);rooms.tick();assertEquals(1,mini(a).getAsJsonArray("survivors").size());
        clock.set(start+4000);rooms.tick();assertEquals(2,mini(a).getAsJsonArray("survivors").size());
        clock.set(mini(h).get("revealEndsAt").getAsLong());rooms.tick();assertEquals("FINISHED",mini(a).get("phase").getAsString());
        for(var e:mini(a).getAsJsonArray("survivors"))assertTrue(occupied.contains(e.getAsJsonObject().get("boxId").getAsInt()));
    }
    @Test void stalledMidAnimationPausesExplicitlyAndResumesWithoutRefundOrExtraConsumption(){
        start();ready();command(a,"CURSED_SELECT",selection(0));command(a,"CURSED_FIRE",fireFields(0,1));String shot=pending();stage("CURSED_SHOT_STARTED",shot);
        clock.addAndGet(15_000);rooms.tick();assertEquals("PREPARING",mini(a).get("phase").getAsString());assertEquals("HOST_SCENE_PAUSED",mini(a).get("notice").getAsString());assertEquals(1,mini(a).get("shotsRemaining").getAsInt());assertFalse(box(a,0).has("characterId"));
        ready();stage("CURSED_SHOT_IMPACT",shot);stage("CURSED_SHOT_COMPLETE",shot);assertEquals("SELECTING",mini(a).get("phase").getAsString());assertEquals(1,mini(a).get("shotsRemaining").getAsInt());
    }
}
