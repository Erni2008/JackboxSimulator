package com.finalanswer.server;

import com.finalanswer.server.rooms.RoomService;
import io.javalin.config.JavalinConfig;
import java.nio.file.*;
import java.util.*;

/** Explicit opt-in local development routes. No filesystem wildcard or original GLB export. */
final class LastCommandDevRoutes {
    private static final Set<String> MODELS=Set.of("computer.glb","box_final.glb","hole_final.glb","button.glb","adjuster.glb","light.glb","level_handler.glb","lever.glb","secret_hole.glb","door.glb","code_display.glb","animal_panel.glb");
    private static final Set<String> SFX=Set.of("questiontyping2.wav","question_typing.wav","confirm_button.wav","Success2.wav","wrong_symbol_chosen.wav","metal_DOOR_CLOSE.wav","symbol_clicked.wav","symbol_appear.wav","transition_screen.wav","manifest.json","lever.wav","memory_note_green.wav","adjuster.wav","wrong_answer.wav","small_button_click.wav","electrical_circuit_done.wav","wires1.wav","success.mp3","machine_shutdown .wav","button_pressed.wav","metal_cracking.wav","failed.circuit.wav","memory_note_yellow.wav","second_metal_cracking.wav","memory_note_red.wav","1 to 4 sound(appearing sequence).wav","success.wav","memory_note_blue.wav","door_open.wav");
    static void install(JavalinConfig c,RoomService rooms){
        Path root=Path.of(System.getProperty("lastcommand.root")).toAbsolutePath().normalize();
        c.routes.get("/last-command-3d/",ctx->send(ctx,root.resolve("web/last-command-3d/index.html"),"text/html"));
        c.routes.get("/last-command-3d/{file}",ctx->{String file=ctx.pathParam("file");if(!Set.of("app.js","app.js.map","style.css","audio-test.html","audio-test.css","audio-test.js","audio-test.js.map").contains(file))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("web/last-command-3d/"+file),file.endsWith("css")?"text/css":file.endsWith("html")?"text/html":"application/javascript");});
        c.routes.get("/last-command-3d/models/{quality}/{file}",ctx->{String quality=ctx.pathParam("quality"),file=ctx.pathParam("file");if(!Set.of("low","medium","high","mobile").contains(quality)||!MODELS.contains(file))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("assets/models/last_command/"+quality+"/"+file),"model/gltf-binary");});
        c.routes.get("/last-command-3d/voice/{id}",ctx->{String id=ctx.pathParam("id");if(!Set.of("PRESS_RED","PRESS_GREEN","PRESS_BLUE","PRESS_YELLOW").contains(id))throw new RoomService.Failure(404,"NOT_FOUND");Path manifest=root.resolve("assets/audio/host/ru/manifest.json");if(!Files.isRegularFile(manifest))throw new RoomService.Failure(404,"NOT_FOUND");var events=com.google.gson.JsonParser.parseString(Files.readString(manifest)).getAsJsonObject().getAsJsonObject("events");var entry=events.has(id)?events.getAsJsonObject(id):null;if(entry==null||!entry.get("status").getAsString().equals("ready"))throw new RoomService.Failure(404,"NOT_FOUND");String file=entry.get("file").getAsString();if(!file.matches("events/[A-Za-z0-9_-]+\\.ogg"))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("assets/audio/host/ru/"+file),"audio/ogg");});
        c.routes.get("/last-command-3d/sfx/{name}",ctx->{String name=ctx.pathParam("name");if(!SFX.contains(name))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("assets/sounds/last_command/runtime/"+name),name.endsWith("json")?"application/json":name.endsWith("mp3")?"audio/mpeg":"audio/wav");});
        c.routes.get("/last-command-3d/audio/{name}",ctx->{String name=ctx.pathParam("name");if(!Set.of("adjuster.wav").contains(name))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("assets/sounds/last_command/"+name),"audio/wav");});
        c.routes.get("/last-command-3d/art/{name}",ctx->{String name=ctx.pathParam("name");if(!Set.of("panel_lamps.png","hole1.png").contains(name))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("assets/models/last_command/"+name),"image/png");});
        c.routes.get("/last-command-3d/config/{name}",ctx->{String name=ctx.pathParam("name");if(!Set.of("assembly.json","panel.json","mechanisms.json","surface.json").contains(name))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("assets/models/last_command/"+name),"application/json");});
        c.routes.get("/last-command-dev/info",ctx->{
            List<String> addresses=new ArrayList<>();Map<String,Integer> priority=new HashMap<>();var interfaces=java.net.NetworkInterface.getNetworkInterfaces();while(interfaces.hasMoreElements()){var net=interfaces.nextElement();if(!net.isUp()||net.isLoopback())continue;var ips=net.getInetAddresses();while(ips.hasMoreElements()){var ip=ips.nextElement();if(ip instanceof java.net.Inet4Address&&!ip.isLoopbackAddress()&&!ip.isLinkLocalAddress()){addresses.add(ip.getHostAddress());priority.put(ip.getHostAddress(),net.getName().equals("en0")?0:net.getName().startsWith("en")?1:10);}}}
            addresses.sort(Comparator.comparingInt(ip->priority.getOrDefault(ip,10)));ctx.contentType("application/json").result(com.finalanswer.protocol.Protocol.JSON.toJson(Map.of("addresses",addresses)));
        });
        c.routes.post("/last-command-dev/join",ctx->{
            String code=Objects.requireNonNullElse(ctx.formParam("roomCode"),"");String name=Objects.requireNonNullElse(ctx.formParam("name"),"Player");
            long seed;try{seed=Long.parseLong(Objects.requireNonNullElse(ctx.formParam("seed"),"20261025"));}catch(NumberFormatException e){throw new RoomService.Failure(400,"INVALID_SEED");}
            String scenario=Objects.requireNonNullElse(ctx.formParam("scenario"),"mechanisms");if(!Set.of("campaign","classic","mechanisms","memory","inspection").contains(scenario))throw new RoomService.Failure(400,"INVALID_SCENARIO");
            ctx.contentType("application/json").result(rooms.lastCommandDevelopment(code,name,seed,scenario));
        });
    }
    private static void send(io.javalin.http.Context ctx,Path path,String type)throws java.io.IOException{
        if(!Files.isRegularFile(path))throw new RoomService.Failure(404,"ASSET_MISSING");
        ctx.contentType(type).header("Cache-Control","no-cache").result(Files.newInputStream(path));
    }
}
