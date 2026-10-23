package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.rooms.RoomService;
import com.erni.finalanswer.gameplay.impostor.ImpostorSettings;
import com.google.gson.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

class ImpostorSettingsTest {
    static class Room {
        AtomicLong clock=new AtomicLong(1000000);
        RoomService rooms=new RoomService(clock::get,20,"",Protocol.EndPolicy.TIME_ONLY,r->"ЯБЛОКО");
        JsonObject credentials=obj(rooms.create(Map.of("name","Settings","maxPlayers","8")));
        String code=s(credentials,"code");TestPeer host=new TestPeer();List<TestPeer> peers=new ArrayList<>();List<JsonObject> players=new ArrayList<>();
        Room(){rooms.attach(code,s(credentials,"token"),host,"host");for(int i=0;i<5;i++){var p=obj(rooms.join(code,Map.of("name","Guest"+i)));var peer=new TestPeer();players.add(p);peers.add(peer);rooms.attach(code,s(p,"token"),peer,"join");}}
        void command(TestPeer peer,String type,Map<String,?> payload){rooms.command(peer,Protocol.decode(Protocol.event(type,UUID.randomUUID().toString(),payload)));}
        String session(){return host.latest().has("impostor")?s(host.latest().getAsJsonObject("impostor"),"sessionId"):s(host.latest(),"lobbyId");}
        Map<String,Object> fields(){return new HashMap<>(Map.of("roomCode",code,"sessionId",session()));}
        void settings(Object settings){var p=fields();p.put("settings",settings);command(host,"UPDATE_IMPOSTOR_SETTINGS",p);}
        void start(){var p=fields();if(!host.latest().has("impostor"))p.put("participantIds",players.subList(0,3).stream().map(x->s(x,"selfId")).toList());command(host,"START_IMPOSTOR",p);}
        void advance(long delta){clock.addAndGet(delta);rooms.tick();}
        JsonObject mini(){return host.latest().getAsJsonObject("impostor");}
        void finish(int rounds,int clues,int discussion,int voting){advance(4000);for(int r=0;r<rounds;r++){assertEquals("ROUND_CLUE_INPUT",s(mini(),"phase"));advance(clues*1000L);advance(500);advance(5000);advance(1);advance(1850);}assertEquals("EVIDENCE_REVIEW",s(mini(),"phase"));assertEquals(discussion*1000L,mini().get("deadline").getAsLong()-clock.get());advance(discussion*1000L);assertEquals(voting*1000L,mini().get("deadline").getAsLong()-clock.get());advance(voting*1000L);advance(700);advance(5000);advance(3500);advance(4000);assertEquals("RESULT",s(mini(),"phase"));}
    }
    @Test void writingActivityIsValidatedShortLivedAndOnlyAggregatedForHost(){
        var r=new Room();r.start();r.advance(4000);var fields=r.fields();fields.put("round",1);
        r.command(r.peers.getFirst(),"IMPOSTOR_TYPING",fields);
        assertEquals(r.clock.get()+450,r.mini().get("writingUntil").getAsLong());
        assertFalse(r.peers.getFirst().latest().getAsJsonObject("impostor").has("writingUntil"));
        int events=r.host.events.size();r.command(r.peers.getFirst(),"IMPOSTOR_TYPING",fields);assertEquals(events,r.host.events.size(),"Repeated activity is coalesced");
        failure("NOT_ELIGIBLE",()->r.command(r.peers.get(4),"IMPOSTOR_TYPING",fields));
        var forged=new HashMap<String,Object>(fields);forged.put("clue","SECRET");failure("INVALID_CLUE",()->r.command(r.peers.getFirst(),"IMPOSTOR_TYPING",forged));
        r.advance(500);r.command(r.host,"SYNC",Map.of());assertEquals(0,r.mini().get("writingUntil").getAsLong(),"No stale activity after its short lease");
        var clue=new HashMap<String,Object>(fields);clue.put("clue","СВЕТ");r.command(r.peers.getFirst(),"SUBMIT_CLUE",clue);
        failure("CLUE_ALREADY_SUBMITTED",()->r.command(r.peers.getFirst(),"IMPOSTOR_TYPING",fields));
    }
    ImpostorSettings custom(){return new ImpostorSettings(2,7,9,12,"DEFAULT",false,false,true);}
    void failure(String code,Runnable work){assertEquals(code,assertThrows(RoomService.Failure.class,work::run).getMessage());}
    @Test void defaultsArePublicAndContainNoSecret(){var r=new Room();assertEquals(20,ImpostorSettings.defaults().clueSeconds());assertEquals(10,ImpostorSettings.defaults().discussionSeconds());assertEquals(20,ImpostorSettings.defaults().votingSeconds());assertEquals(ImpostorSettings.defaults(),Protocol.JSON.fromJson(r.host.latest().get("impostorSettings"),ImpostorSettings.class));assertEquals(List.of("DEFAULT"),Protocol.JSON.fromJson(r.host.latest().get("impostorWordCategories"),List.class));assertFalse(r.rooms.view(r.code).contains("secretWord"));}
    @Test void hostUpdatesSynchronizeEveryClient(){var r=new Room();r.settings(custom());for(var peer:r.peers)assertEquals(custom(),Protocol.JSON.fromJson(peer.latest().get("impostorSettings"),ImpostorSettings.class));}
    @Test void playersAndSpectatorsCannotConfigure(){var r=new Room();var p=r.fields();p.put("settings",custom());for(var peer:r.peers)failure("HOST_ONLY",()->r.command(peer,"UPDATE_IMPOSTOR_SETTINGS",p));}
    @Test void unauthenticatedCannotConfigure(){var r=new Room();var p=r.fields();p.put("settings",custom());failure("AUTH_REQUIRED",()->r.command(new TestPeer(),"UPDATE_IMPOSTOR_SETTINGS",p));}
    @Test void invalidValuesRejectedAtomically(){var r=new Room();for(var field:List.of("roundCount","discussionSeconds","votingSeconds","clueSeconds"))for(int n:new int[]{-1,0,999}){var bad=Protocol.JSON.toJsonTree(custom()).getAsJsonObject();bad.addProperty(field,n);failure("INVALID_IMPOSTOR_SETTINGS",()->r.settings(bad));assertEquals(ImpostorSettings.defaults(),Protocol.JSON.fromJson(r.host.latest().get("impostorSettings"),ImpostorSettings.class));}}
    @Test void strictTypesAndSchema(){var r=new Room();for(var mutation:List.of("string","decimal","boolean","missing","extra","category")){var bad=Protocol.JSON.toJsonTree(custom()).getAsJsonObject();switch(mutation){case "string"->bad.addProperty("roundCount","2");case "decimal"->bad.addProperty("roundCount",2.5);case "boolean"->bad.addProperty("soundEnabled","false");case "missing"->bad.remove("clueSeconds");case "extra"->bad.addProperty("winner","IMPOSTOR");case "category"->bad.addProperty("wordCategory","INVENTED");}failure("INVALID_IMPOSTOR_SETTINGS",()->r.settings(bad));}}
    @Test void staleLobbyAndWrongRoomRejected(){var r=new Room();var p=r.fields();p.put("settings",custom());p.put("sessionId","old");failure("STALE_IMPOSTOR_SESSION",()->r.command(r.host,"UPDATE_IMPOSTOR_SETTINGS",p));p.put("roomCode","OTHER");failure("WRONG_ROOM",()->r.command(r.host,"UPDATE_IMPOSTOR_SETTINGS",p));}
    @Test void changesDuringMatchAndPreparationRejected(){var r=new Room();r.start();failure("SETTINGS_LOCKED",()->r.settings(custom()));r.finish(3,20,10,20);r.command(r.host,"REPLAY_IMPOSTOR",r.fields());failure("SETTINGS_LOCKED",()->r.settings(custom()));}
    @Test void roleRevealUsesExistingAuthoritativeDeadline(){var r=new Room();r.start();assertEquals("ROLE_REVEAL",s(r.mini(),"phase"));assertEquals(4000,r.mini().get("roleRevealDurationMillis").getAsLong());assertEquals(4000,r.mini().get("deadline").getAsLong()-r.clock.get());r.advance(3999);assertEquals("ROLE_REVEAL",s(r.mini(),"phase"));r.advance(1);assertEquals("ROUND_CLUE_INPUT",s(r.mini(),"phase"));}
    @Test void customRoundsAndTimersUseServerConfiguration(){var r=new Room();r.settings(custom());r.start();r.advance(4000);assertEquals(12000,r.mini().get("deadline").getAsLong()-r.clock.get());}
    @Test void shortenedGameProducesAccurateResults(){var r=new Room();r.settings(custom());r.start();r.finish(2,12,7,9);var result=r.mini().getAsJsonObject("result");assertEquals(2,result.getAsJsonObject("statistics").get("completedRounds").getAsInt());assertEquals(2,result.getAsJsonArray("clueRounds").size());}
    @Test void replayAndLobbyPreserveSettings(){var r=new Room();r.settings(custom());r.start();r.finish(2,12,7,9);r.command(r.host,"REPLAY_IMPOSTOR",r.fields());assertEquals(custom(),Protocol.JSON.fromJson(r.host.latest().get("impostorSettings"),ImpostorSettings.class));r.start();r.finish(2,12,7,9);r.command(r.host,"IMPOSTOR_RETURN_TO_LOBBY",r.fields());assertEquals(custom(),Protocol.JSON.fromJson(r.host.latest().get("impostorSettings"),ImpostorSettings.class));r.settings(ImpostorSettings.defaults());}
    @Test void reconnectReceivesCurrentConfiguration(){var r=new Room();r.settings(custom());var peer=new TestPeer();r.rooms.attach(r.code,s(r.players.getFirst(),"token"),peer,"reconnect");assertEquals(custom(),Protocol.JSON.fromJson(peer.latest().get("impostorSettings"),ImpostorSettings.class));}
}
