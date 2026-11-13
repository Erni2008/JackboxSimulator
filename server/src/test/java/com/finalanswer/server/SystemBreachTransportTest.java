package com.finalanswer.server;

import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.net.http.HttpClient;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.TransportTest.*;

class SystemBreachTransportTest {
    @Test void realHttpAndWebSocketRouteActionsAndRestorePrivateChallenge()throws Exception{
        var clock=new AtomicLong(100000);var rooms=new RoomService(clock::get,20,"");var config=new ServerConfig("127.0.0.1",0,"",Set.of(),"",20);
        try(var server=new RoomServer(config,rooms).start();var http=HttpClient.newHttpClient()){
            String base="http://127.0.0.1:"+server.port();JsonObject host=post(http,base+"/rooms","name=Breach&maxPlayers=8"),one=post(http,base+"/rooms/"+host.get("code").getAsString()+"/join","name=One"),two=post(http,base+"/rooms/"+host.get("code").getAsString()+"/join","name=Two");String code=host.get("code").getAsString();
            try(var h=new Client(http,base);var a=new Client(http,base);var b=new Client(http,base)){
                var hs=h.auth(code,host);a.auth(code,one);b.auth(code,two);
                h.send("SYSTEM_BREACH_START",Map.of("roomCode",code,"sessionId",hs.get("lobbyId").getAsString()));var started=a.await("SYSTEM_BREACH_START").getAsJsonObject("systemBreach");String sid=started.get("sessionId").getAsString();
                String option=started.getAsJsonObject("self").getAsJsonArray("passwordOptions").get(0).getAsString();a.send("SYSTEM_BREACH_PASSWORD_SELECT",Map.of("sessionId",sid,"password",option));a.await("SYSTEM_BREACH_PLAYER_UPDATE");
                clock.addAndGet(20000);rooms.tick();a.send("SYNC",Map.of());assertEquals("ACTIVE",a.await("STATE").getAsJsonObject("systemBreach").get("phase").getAsString());
                a.send("SYSTEM_BREACH_CHALLENGE_REQUEST",Map.of("sessionId",sid,"type","DATA_ANALYSIS"));JsonObject puzzle;
                do{puzzle=a.await("SYSTEM_BREACH_PLAYER_UPDATE").getAsJsonObject("systemBreach").getAsJsonObject("self").getAsJsonObject("challenge");}while(!puzzle.has("challengeId"));
                String challengeId=puzzle.get("challengeId").getAsString();
                try(var replacement=new Client(http,base)){var restored=replacement.auth(code,one);assertEquals(challengeId,restored.getAsJsonObject("systemBreach").getAsJsonObject("self").getAsJsonObject("challenge").get("challengeId").getAsString());
                    h.send("SYNC",Map.of());assertFalse(h.await("STATE").getAsJsonObject("systemBreach").has("self"));
                    replacement.send("SYSTEM_BREACH_CHALLENGE_SUBMIT",Map.of("sessionId",sid,"challengeId",challengeId,"answer",List.of()));assertEquals("FAILED",replacement.await("SYSTEM_BREACH_CHALLENGE_RESULT").getAsJsonObject("systemBreachAction").get("status").getAsString());
                    replacement.send("SYSTEM_BREACH_SPECIAL_ATTACK",Map.of("sessionId",sid,"type","TROJAN","targetId",two.get("selfId").getAsString()));assertEquals("SB_NEED_KEY",replacement.await("SYSTEM_BREACH_ACTION_REJECTED").get("code").getAsString());
                    clock.addAndGet(240000);rooms.tick();assertTrue(h.await("SYSTEM_BREACH_RESULTS").getAsJsonObject("systemBreach").has("results"));
                    clock.addAndGet(24000);rooms.tick();h.await("SYSTEM_BREACH_FINISHED");h.send("SYSTEM_BREACH_END",Map.of("sessionId",sid));
                    JsonObject ended;do{ended=h.await("SYSTEM_BREACH_FINISHED");}while(ended.has("systemBreach"));assertEquals("LOBBY",ended.get("phase").getAsString());
                }
            }
        }
    }
}
