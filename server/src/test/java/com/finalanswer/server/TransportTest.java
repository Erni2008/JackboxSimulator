package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;
import static org.junit.jupiter.api.Assertions.*;

/** Real HTTP and WebSocket transport, with virtual game time (no twenty-second sleeps). */
class TransportTest {
    @Test void realClientsCompleteRoundAndReconnect() throws Exception {
        AtomicLong time=new AtomicLong(1_000_000);
        RoomService rooms=new RoomService(time::get,10,"");
        try(RoomServer server=new RoomServer(new ServerConfig("127.0.0.1",0,"",Set.of(),"",10),rooms).start();
            HttpClient http=HttpClient.newHttpClient()) {
            String base="http://127.0.0.1:"+server.port();
            assertEquals(200,http.send(HttpRequest.newBuilder(URI.create(base+"/health")).build(),HttpResponse.BodyHandlers.ofString()).statusCode());
            var page=http.send(HttpRequest.newBuilder(URI.create(base+"/")).build(),HttpResponse.BodyHandlers.ofString());
            assertEquals(200,page.statusCode());assertTrue(page.body().contains("FINAL ANSWER"));
            assertEquals(403,http.send(HttpRequest.newBuilder(URI.create(base+"/health")).header("Origin","https://evil.example").build(),HttpResponse.BodyHandlers.ofString()).statusCode());
            JsonObject host=post(http,base+"/rooms","name=Transport&maxPlayers=2&gameMode=standard");
            String code=host.get("code").getAsString();
            JsonObject first=post(http,base+"/rooms/"+code+"/join","name=Anna");
            JsonObject second=post(http,base+"/rooms/"+code+"/join","name=Ben");
            try(Client h=new Client(http,base);Client a=new Client(http,base);Client b=new Client(http,base)) {
                h.auth(code,host);a.auth(code,first);b.auth(code,second);
                a.send("START_GAME",Map.of());assertEquals("HOST_ONLY",a.await("ERROR").get("code").getAsString());
                a.socket.sendText("broken json",true).join();assertEquals("INVALID_MESSAGE",a.await("ERROR").get("code").getAsString());
                h.send("START_GAME",Map.of());h.await("GAME_STARTED");time.addAndGet(Protocol.LOBBY_TRANSITION_MILLIS);rooms.tick();var q=h.await("QUESTION_STARTED");
                assertEquals(q.get("question"),a.await("QUESTION_STARTED").get("question"));
                assertEquals(q.get("question"),b.await("QUESTION_STARTED").get("question"));
                assertFalse(q.getAsJsonObject("question").has("correctAnswerIndex"));
                Map<String,Object> fields=new HashMap<>(Map.of("gameId",q.get("gameId").getAsString(),"questionId",q.getAsJsonObject("question").get("id").getAsString()));
                h.send("PRESENTATION_READY",fields);h.await("ANSWERING_STARTED");a.await("ANSWERING_STARTED");b.await("ANSWERING_STARTED");
                fields.put("answerIndex",1);a.send("SUBMIT_ANSWER",fields);a.await("ANSWER_ACCEPTED");
                a.send("SUBMIT_ANSWER",fields);assertEquals("ANSWER_ALREADY_SUBMITTED",a.await("ANSWER_REJECTED").get("code").getAsString());
                fields.put("answerIndex",0);b.send("SUBMIT_ANSWER",fields);b.await("ANSWER_ACCEPTED");
                try(Client replacement=new Client(http,base)) {
                    var restored=replacement.auth(code,first);assertTrue(restored.get("hasSubmittedAnswer").getAsBoolean());
                    assertEquals(first.get("selfId"),restored.get("selfId"));
                    time.addAndGet(20_000);rooms.tick();h.await("ANSWERING_FINISHED");
                    assertFalse(b.await("ANSWERING_FINISHED").getAsJsonObject("question").has("correctAnswerIndex"));
                    time.addAndGet(720);h.send("REVEAL_READY",fields);
                    var results=replacement.await("QUESTION_RESULTS");
                    assertEquals(1,results.getAsJsonObject("question").get("correctAnswerIndex").getAsInt());
                    assertEquals(2,results.getAsJsonArray("results").size());
                    long correct=java.util.stream.StreamSupport.stream(results.getAsJsonArray("results").spliterator(),false).filter(r->r.getAsJsonObject().get("isCorrect").getAsBoolean()).count();
                    assertEquals(1,correct);
                    time.addAndGet(3100);h.send("NEXT_READY",fields);
                    var started=h.await("CURSED_BOXES_STARTED");var mini=started.getAsJsonObject("cursedBoxes");
                    var hiding=b.await("CURSED_BOXES_STARTED").getAsJsonObject("cursedBoxes");
                    assertEquals("HIDING",hiding.get("role").getAsString());
                    assertEquals("SHOOTING",replacement.await("CURSED_BOXES_STARTED").getAsJsonObject("cursedBoxes").get("role").getAsString());
                    Map<String,Object> baseFields=Map.of("roomCode",code,"sessionId",mini.get("sessionId").getAsString());
                    h.send("CURSED_SCENE_READY",baseFields);h.await("CURSED_BOXES_READY");b.await("CURSED_BOXES_READY");replacement.await("CURSED_BOXES_READY");
                    var hideFields=new HashMap<>(baseFields);hideFields.put("boxId",15);b.send("CURSED_HIDE",hideFields);
                    var locked=h.await("CURSED_HIDING_UPDATED").getAsJsonObject("cursedBoxes");
                    assertTrue(locked.get("hidingLocked").getAsBoolean());assertEquals(15,locked.getAsJsonArray("hostContents").get(0).getAsJsonObject().get("boxId").getAsInt());
                    for(int shotNumber=1;shotNumber<=1;shotNumber++){
                        var target=new HashMap<>(baseFields);target.put("turnId",locked.get("turnId").getAsInt());target.put("boxId",shotNumber-1);
                        replacement.send("CURSED_SELECT",target);replacement.await("CURSED_SELECTION_UPDATED");target.put("shotNumber",shotNumber);replacement.send("CURSED_FIRE",target);
                        var job=h.await("CURSED_SHOT_QUEUED").getAsJsonObject("cursedBoxes").getAsJsonObject("pendingShot");
                        var stageFields=new HashMap<>(baseFields);stageFields.put("shotId",job.get("id").getAsString());
                        h.send("CURSED_SHOT_STARTED",stageFields);h.await("CURSED_SHOT_STARTED");time.addAndGet(30);
                        h.send("CURSED_SHOT_IMPACT",stageFields);h.await("CURSED_BOX_REVEALED");time.addAndGet(1070);
                        h.send("CURSED_SHOT_COMPLETE",stageFields);h.await("CURSED_SHOT_RESOLVED");
                    }
                    time.addAndGet(5000);rooms.tick();var finished=h.await("CURSED_BOXES_UPDATED").getAsJsonObject("cursedBoxes");
                    assertEquals(1,finished.get("survivorCount").getAsInt());
                    h.send("CURSED_RETURN_TO_LOBBY",baseFields);assertEquals(2,h.await("CURSED_BOXES_ENDED").get("questionNumber").getAsInt());
                }
            }
        }
    }
    static JsonObject post(HttpClient http,String url,String body)throws Exception {
        var response=http.send(HttpRequest.newBuilder(URI.create(url)).header("Content-Type","application/x-www-form-urlencoded").POST(HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertTrue(response.statusCode()<300,response.body());return JsonParser.parseString(response.body()).getAsJsonObject();
    }
    static class Client implements WebSocket.Listener,AutoCloseable {
        final BlockingQueue<JsonObject> events=new LinkedBlockingQueue<>();final StringBuilder buffer=new StringBuilder();final WebSocket socket;
        Client(HttpClient http,String base){socket=http.newWebSocketBuilder().connectTimeout(Duration.ofSeconds(5)).buildAsync(URI.create(base.replace("http:","ws:")+"/ws"),this).join();}
        public void onOpen(WebSocket ws){ws.request(1);}
        public CompletionStage<?> onText(WebSocket ws,CharSequence data,boolean last){buffer.append(data);if(last){events.add(JsonParser.parseString(buffer.toString()).getAsJsonObject());buffer.setLength(0);}ws.request(1);return null;}
        void send(String type,Map<String,?> payload){socket.sendText(Protocol.event(type,UUID.randomUUID().toString(),payload),true).join();}
        JsonObject auth(String code,JsonObject credentials)throws Exception {send("AUTH",Map.of("roomCode",code,"token",credentials.get("token").getAsString()));return await("AUTHENTICATED");}
        JsonObject await(String type)throws Exception {long end=System.nanoTime()+TimeUnit.SECONDS.toNanos(5);while(System.nanoTime()<end){JsonObject e=events.poll(Math.max(1,end-System.nanoTime()),TimeUnit.NANOSECONDS);if(e==null)break;if(e.get("type").getAsString().equals(type))return e.getAsJsonObject("payload");}throw new AssertionError("Missing "+type);}
        public void close(){socket.abort();}
    }
}
