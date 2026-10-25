package com.finalanswer.server;
import org.junit.jupiter.api.Test;
import java.net.*;
import java.net.http.*;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;
class LastCommandDevIsolationTest {
    @Test void devJoinKeepsLiveSessionButNormalJoinIsStillRejected(){
        var rooms=new com.finalanswer.server.rooms.RoomService();
        var first=com.google.gson.JsonParser.parseString(rooms.lastCommandDevelopment("","Host",42,"mechanisms")).getAsJsonObject();String code=first.get("code").getAsString();
        var joined=com.google.gson.JsonParser.parseString(rooms.lastCommandDevelopment(code,"Phone",42,"mechanisms")).getAsJsonObject();
        assertEquals(first.getAsJsonObject("lastCommand").get("sessionId"),joined.getAsJsonObject("lastCommand").get("sessionId"));
        assertEquals("IN_GAME",joined.get("roomStatus").getAsString());
        assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class,()->rooms.join(code,java.util.Map.of("name","Normal join")));
    }
    @Test void productionDoesNotExposeDevEntryOrModels()throws Exception{
        String prior=System.getProperty("lastcommand.dev");System.clearProperty("lastcommand.dev");
        try(var server=new RoomServer(new ServerConfig("127.0.0.1",0,"",Set.of(),"",4)).start()){
            var client=HttpClient.newHttpClient();String origin="http://127.0.0.1:"+server.port();
            for(String path:new String[]{"/last-command-dev/info","/last-command-3d/models/low/box_final.glb"})assertEquals(404,client.send(HttpRequest.newBuilder(URI.create(origin+path)).GET().build(),HttpResponse.BodyHandlers.discarding()).statusCode());
            var health=client.send(HttpRequest.newBuilder(URI.create(origin+"/health")).GET().build(),HttpResponse.BodyHandlers.discarding());assertEquals(200,health.statusCode());assertFalse(health.headers().firstValue("Content-Security-Policy").orElseThrow().contains("blob:"));
        }finally{if(prior!=null)System.setProperty("lastcommand.dev",prior);}
    }
}
