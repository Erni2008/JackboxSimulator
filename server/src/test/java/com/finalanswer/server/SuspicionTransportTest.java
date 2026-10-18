package com.finalanswer.server;

import com.finalanswer.server.rooms.RoomService;
import com.google.gson.JsonObject;
import org.junit.jupiter.api.Test;
import java.net.http.HttpClient;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.TransportTest.*;

class SuspicionTransportTest {
    @Test void authenticatedWebSocketsKeepSelectionsPrivateAndRestoreThem() throws Exception {
        AtomicLong time=new AtomicLong(1_000_000);RoomService rooms=new RoomService(time::get,10,"");
        try(RoomServer server=new RoomServer(new ServerConfig("127.0.0.1",0,"",Set.of(),"",10),rooms).start();
            HttpClient http=HttpClient.newHttpClient()) {
            String base="http://127.0.0.1:"+server.port();
            JsonObject host=post(http,base+"/rooms","name=Suspicion&maxPlayers=8");String code=host.get("code").getAsString();
            List<JsonObject> credentials=new ArrayList<>();List<Client> clients=new ArrayList<>();
            try(Client h=new Client(http,base)) {
                h.auth(code,host);
                for(int i=0;i<5;i++) {
                    JsonObject player=post(http,base+"/rooms/"+code+"/join","name=P"+i);credentials.add(player);
                    Client client=new Client(http,base);clients.add(client);client.auth(code,player);
                }
                String session=rooms.installImpostorSession(code,credentials.subList(0,3).stream().map(p->p.get("selfId").getAsString()).toList());
                rooms.startPreliminarySuspicion(code,session,1);
                Map<String,Object> payload=new HashMap<>(Map.of("roomCode",code,"sessionId",session,"round",1,
                    "suspectId",credentials.get(1).get("selfId").getAsString()));
                clients.get(0).send("SUBMIT_SUSPICION",payload);
                var accepted=clients.get(0).await("SUSPICION_ACCEPTED").getAsJsonObject("impostor");
                assertTrue(accepted.get("hasSubmitted").getAsBoolean());
                var shared=h.await("SUSPICION_UPDATED").getAsJsonObject("impostor");
                assertFalse(shared.has("selectedSuspectId"));assertFalse(shared.has("selections"));
                payload.put("suspectId",credentials.get(0).get("selfId").getAsString());
                clients.get(0).send("SUBMIT_SUSPICION",payload);
                assertEquals("SELF_SUSPICION",clients.get(0).await("SUSPICION_REJECTED").get("code").getAsString());
                clients.get(3).send("SUBMIT_SUSPICION",payload);clients.get(3).await("SUSPICION_ACCEPTED");
                try(Client replacement=new Client(http,base)) {
                    var restored=replacement.auth(code,credentials.get(0)).getAsJsonObject("impostor");
                    assertEquals(credentials.get(1).get("selfId"),restored.get("selectedSuspectId"));
                    time.addAndGet(5000);rooms.tick();replacement.await("SUSPICION_FINALIZED");
                    replacement.send("SUBMIT_SUSPICION",payload);
                    assertEquals("SUSPICION_TOO_LATE",replacement.await("SUSPICION_REJECTED").get("code").getAsString());
                }
                rooms.leave(code,host.get("token").getAsString());h.await("ROOM_CLOSED");
            } finally {for(Client client:clients)client.close();}
        }
    }
}
