package com.finalanswer.server;

import com.finalanswer.server.rooms.RoomService;
import io.javalin.config.JavalinConfig;
import java.nio.file.*;
import java.util.*;

/** Explicit opt-in local development routes. No filesystem wildcard or original GLB export. */
final class LastCommandDevRoutes {
    private static final Set<String> MODELS=Set.of("box_final.glb","hole_final.glb","button.glb","adjuster.glb","light.glb","level_handler.glb","lever.glb","secret_hole.glb","door.glb","code_display.glb");
    static void install(JavalinConfig c,RoomService rooms){
        Path root=Path.of(System.getProperty("lastcommand.root")).toAbsolutePath().normalize();
        c.routes.get("/last-command-3d/",ctx->send(ctx,root.resolve("web/last-command-3d/index.html"),"text/html"));
        c.routes.get("/last-command-3d/{file}",ctx->{String file=ctx.pathParam("file");if(!Set.of("app.js","app.js.map","style.css").contains(file))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("web/last-command-3d/"+file),file.endsWith("css")?"text/css":"application/javascript");});
        c.routes.get("/last-command-3d/models/{quality}/{file}",ctx->{String quality=ctx.pathParam("quality"),file=ctx.pathParam("file");if(!Set.of("low","medium","high").contains(quality)||!MODELS.contains(file))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("assets/models/last_command/"+quality+"/"+file),"model/gltf-binary");});
        c.routes.get("/last-command-3d/config/{name}",ctx->{String name=ctx.pathParam("name");if(!Set.of("assembly.json","panel.json","mechanisms.json","surface.json").contains(name))throw new RoomService.Failure(404,"NOT_FOUND");send(ctx,root.resolve("assets/models/last_command/"+name),"application/json");});
        c.routes.get("/last-command-dev/info",ctx->{
            List<String> addresses=new ArrayList<>();var interfaces=java.net.NetworkInterface.getNetworkInterfaces();while(interfaces.hasMoreElements()){var net=interfaces.nextElement();if(!net.isUp()||net.isLoopback())continue;var ips=net.getInetAddresses();while(ips.hasMoreElements()){var ip=ips.nextElement();if(ip instanceof java.net.Inet4Address&&!ip.isLoopbackAddress()&&!ip.isLinkLocalAddress())addresses.add(ip.getHostAddress());}}
            ctx.contentType("application/json").result(com.finalanswer.protocol.Protocol.JSON.toJson(Map.of("addresses",addresses)));
        });
        c.routes.post("/last-command-dev/join",ctx->{
            String code=Objects.requireNonNullElse(ctx.formParam("roomCode"),"");String name=Objects.requireNonNullElse(ctx.formParam("name"),"Player");
            long seed;try{seed=Long.parseLong(Objects.requireNonNullElse(ctx.formParam("seed"),"20261025"));}catch(NumberFormatException e){throw new RoomService.Failure(400,"INVALID_SEED");}
            String scenario=Objects.requireNonNullElse(ctx.formParam("scenario"),"mechanisms");if(!Set.of("mechanisms","memory").contains(scenario))throw new RoomService.Failure(400,"INVALID_SCENARIO");
            ctx.contentType("application/json").result(rooms.lastCommandDevelopment(code,name,seed,scenario));
        });
    }
    private static void send(io.javalin.http.Context ctx,Path path,String type)throws java.io.IOException{
        if(!Files.isRegularFile(path))throw new RoomService.Failure(404,"ASSET_MISSING");
        ctx.contentType(type).header("Cache-Control","no-cache").result(Files.newInputStream(path));
    }
}
