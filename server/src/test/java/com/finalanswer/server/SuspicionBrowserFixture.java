package com.finalanswer.server;

import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/** Test classpath only. Local file control never creates a browser-accessible admin endpoint. */
public final class SuspicionBrowserFixture {
    public static void main(String[] args)throws Exception {
        Path directory=Path.of(System.getProperty("suspicion.fixture.dir"));Files.createDirectories(directory);
        var offset=new AtomicLong();var monotonic=RoomService.monotonicTime();
        RoomService rooms=new RoomService(()->monotonic.getAsLong()+offset.get(),10,"");
        JsonObject host=JsonParser.parseString(rooms.create(Map.of("name","Browser suspicion QA","maxPlayers","8"))).getAsJsonObject();
        String code=host.get("code").getAsString();
        rooms.attach(code,host.get("token").getAsString(),new RoomServiceTest.TestPeer(),"fixture-host");
        try(RoomServer server=new RoomServer(new ServerConfig("127.0.0.1",0,"",Set.of(),"",10),rooms).start()) {
            Path prior=directory.resolve("control.json");
            String previous=Files.exists(prior)?JsonParser.parseString(Files.readString(prior)).getAsJsonObject().get("id").getAsString():"";
            String session=null;
            Files.writeString(directory.resolve("ready.json"),new Gson().toJson(Map.of("url","http://127.0.0.1:"+server.port(),"code",code)));
            long end=System.nanoTime()+600_000_000_000L;
            while(System.nanoTime()<end) {
                Path file=directory.resolve("control.json");
                if(Files.exists(file)) {
                    JsonObject command=JsonParser.parseString(Files.readString(file)).getAsJsonObject();
                    String id=command.get("id").getAsString();
                    if(!id.equals(previous)) {
                        previous=id;String type=command.get("command").getAsString();
                        if(type.equals("stop"))break;
                        if(type.equals("new")) {
                            rooms.leave(code,host.get("token").getAsString());
                            host=JsonParser.parseString(rooms.create(Map.of("name","Browser suspicion QA","maxPlayers","8"))).getAsJsonObject();
                            code=host.get("code").getAsString();session=null;
                            rooms.attach(code,host.get("token").getAsString(),new RoomServiceTest.TestPeer(),"fixture-host");
                            Files.writeString(directory.resolve("ready.json"),new Gson().toJson(Map.of("url","http://127.0.0.1:"+server.port(),"code",code)));
                        }
                        if(type.equals("expire")){offset.addAndGet(5000);rooms.tick();}
                        if(type.equals("start")) {
                            if(session==null) {
                                List<String> ids=new ArrayList<>();for(JsonElement player:command.getAsJsonArray("activeIds"))ids.add(player.getAsString());
                                session=rooms.installImpostorSession(code,ids);
                            }
                            rooms.startPreliminarySuspicion(code,session,command.get("round").getAsInt());
                        }
                        Files.writeString(directory.resolve("processed.json"),new Gson().toJson(Map.of("id",id)));
                    }
                }
                Thread.sleep(25);
            }
        }
    }
}
