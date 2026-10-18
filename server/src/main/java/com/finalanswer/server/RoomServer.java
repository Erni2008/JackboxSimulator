package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import com.finalanswer.server.rooms.RoomService;
import com.finalanswer.server.transport.*;
import io.javalin.Javalin;
import io.javalin.http.Context;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;

/** Single process/port for the existing HTTP room API, browser assets and authorized WebSockets. */
public final class RoomServer implements AutoCloseable {
    private final RoomService rooms;
    private final Javalin app;
    private final Map<String,SocketPeer> peers=new ConcurrentHashMap<>();
    private final RateLimit limits=new RateLimit();
    private final ScheduledExecutorService scheduler=Executors.newSingleThreadScheduledExecutor();
    private final ServerConfig config;
    private boolean closed;

    public RoomServer(ServerConfig config) {
        this(config,new RoomService(RoomService.monotonicTime(),config.maxRooms(),config.publicUrl()));
    }
    public RoomServer(ServerConfig config,RoomService rooms) {
        this.config=config;
        this.rooms=rooms;
        app=Javalin.create(c->{
            c.http.maxRequestSize=8192;
            c.jetty.modifyWebSocketServletFactory(factory->{
                factory.setMaxTextMessageSize(Protocol.MAX_MESSAGE_BYTES);
                factory.setMaxBinaryMessageSize(1);
                factory.setIdleTimeout(Duration.ofSeconds(35));
            });
            c.staticFiles.add("/web");
            c.routes.before(ctx->{
                ctx.header("X-Content-Type-Options","nosniff");
                ctx.header("Referrer-Policy","no-referrer");
                ctx.header("Content-Security-Policy","default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; connect-src 'self' ws: wss:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
                if(!config.allowsOrigin(ctx.header("Origin"),ctx.header("Host"))) throw new RoomService.Failure(403,"ORIGIN_NOT_ALLOWED");
                if(ctx.path().startsWith("/rooms")) {
                    ctx.contentType("application/json; charset=utf-8").header("Cache-Control","no-store");
                    if(!limits.allow("http:"+ip(ctx),80,2))throw new RoomService.Failure(429,"RATE_LIMITED");
                }
            });
            c.routes.get("/health",ctx->ctx.contentType("application/json").result("{\"status\":\"ok\"}"));
            c.routes.post("/rooms",ctx->{
                if(!limits.allow("create:"+ip(ctx),6,.1))throw new RoomService.Failure(429,"RATE_LIMITED");
                ctx.status(201).result(rooms.create(form(ctx)));
            });
            c.routes.get("/rooms/{code}",ctx->ctx.result(rooms.view(ctx.pathParam("code"))));
            c.routes.post("/rooms/{code}/join",ctx->{
                if(!limits.allow("join:"+ip(ctx),15,.25))throw new RoomService.Failure(429,"RATE_LIMITED");
                ctx.result(rooms.join(ctx.pathParam("code"),form(ctx)));
            });
            c.routes.post("/rooms/{code}/heartbeat",ctx->ctx.result(rooms.heartbeat(ctx.pathParam("code"),required(ctx,"token"))));
            c.routes.post("/rooms/{code}/reroll",ctx->ctx.result(rooms.reroll(ctx.pathParam("code"),form(ctx))));
            c.routes.post("/rooms/{code}/leave",ctx->{rooms.leave(ctx.pathParam("code"),required(ctx,"token"));ctx.result("{}");});
            c.routes.wsBeforeUpgrade("/ws",ctx->{
                if(!config.allowsOrigin(ctx.header("Origin"),ctx.header("Host")))throw new RoomService.Failure(403,"ORIGIN_NOT_ALLOWED");
                String ip=ip(ctx);
                if(peers.size()>=512||peers.values().stream().filter(p->p.ip().equals(ip)).count()>=32
                    ||!limits.allow("upgrade:"+ip,20,1))throw new RoomService.Failure(429,"TOO_MANY_CONNECTIONS");
                ctx.attribute("peerIp",ip);
            });
            c.routes.ws("/ws",ws->{
                ws.onConnect(ctx->{
                    SocketPeer peer=new SocketPeer(ctx.sessionId,ctx.attribute("peerIp"),ctx.session);
                    synchronized(peers) {
                        if(peers.size()>=512 || peers.values().stream().filter(p->p.ip().equals(peer.ip())).count()>=32) {
                            peer.close(1013,"TOO_MANY_CONNECTIONS");return;
                        }
                        peers.put(peer.id(),peer);
                    }
                    peer.send(Protocol.event("CONNECTED","",Map.of("protocolVersion",Protocol.VERSION)));
                });
                ws.onMessage(ctx->{
                    SocketPeer peer=peers.get(ctx.sessionId); if(peer==null)return;
                    String requestId="",type="ERROR";
                    try {
                        if(!limits.allow("ws:"+peer.id(),30,6)) throw new RoomService.Failure(429,"RATE_LIMITED");
                        var message=Protocol.decode(ctx.message()); requestId=message.requestId();
                        if(message.type().equals("SUBMIT_ANSWER"))type="ANSWER_REJECTED";
                        if(message.type().equals("SUBMIT_SUSPICION"))type="SUSPICION_REJECTED";
                        if(message.type().equals("SUBMIT_CLUE"))type="CLUE_REJECTED";
                        if(message.type().equals("SUBMIT_FINAL_VOTE"))type="FINAL_VOTE_REJECTED";
                        if(Set.of("START_IMPOSTOR","REPLAY_IMPOSTOR","IMPOSTOR_RETURN_TO_LOBBY","UPDATE_IMPOSTOR_SETTINGS").contains(message.type()))type="IMPOSTOR_ACTION_REJECTED";
                        if(message.type().equals("AUTH")) {
                            if(peer.authenticated)throw new RoomService.Failure(409,"ALREADY_AUTHENTICATED");
                            rooms.attach(Protocol.string(message.payload(),"roomCode"),Protocol.string(message.payload(),"token"),peer,requestId);
                            peer.authenticated=true;
                        } else rooms.command(peer,message);
                    } catch(RoomService.Failure error) {
                        peer.send(Protocol.event(type,requestId,Map.of("code",error.getMessage())));
                    } catch(IllegalArgumentException|IllegalStateException error) {
                        peer.send(Protocol.event(type,requestId,Map.of("code","INVALID_MESSAGE")));
                    } catch(Exception error) {
                        peer.send(Protocol.event("ERROR",requestId,Map.of("code","SERVER_ERROR")));
                    }
                });
                ws.onBinaryMessage(ctx->ctx.closeSession(1003,"TEXT_ONLY"));
                ws.onClose(ctx->{peers.remove(ctx.sessionId);rooms.detach(ctx.sessionId);});
                ws.onError(ctx->{peers.remove(ctx.sessionId);rooms.detach(ctx.sessionId);ctx.closeSession(1011,"CONNECTION_LOST");});
            });
            c.routes.exception(RoomService.Failure.class,(e,ctx)->ctx.status(e.status).contentType("application/json").result(Protocol.JSON.toJson(Map.of("error",e.getMessage()))));
            c.routes.exception(io.javalin.http.HttpResponseException.class,(e,ctx)->ctx.status(e.getStatus()).contentType("application/json").result(Protocol.JSON.toJson(Map.of("error","INVALID_HTTP_REQUEST"))));
            c.routes.exception(Exception.class,(e,ctx)->ctx.status(500).contentType("application/json").result("{\"error\":\"SERVER_ERROR\"}"));
        });
    }
    public RoomServer start() {
        app.start(config.host(),config.port());
        scheduler.scheduleAtFixedRate(()->{
            try {
                rooms.tick();
                for(SocketPeer peer:peers.values())if(!peer.authenticated&&System.nanoTime()-peer.connectedAt>5_000_000_000L)peer.close(4004,"AUTH_TIMEOUT");
            } catch(Exception e) {System.err.println("Room tick failed: "+e.getClass().getSimpleName());}
        },25,25,TimeUnit.MILLISECONDS);
        return this;
    }
    public int port(){return app.port();}
    private String ip(Context ctx) {
        String remote=ctx.req().getRemoteAddr();
        if(!config.trustedProxy().isEmpty()&&remote.equals(config.trustedProxy())) {
            String forwarded=ctx.header("X-Forwarded-For");
            if(forwarded!=null&&forwarded.length()<256)return forwarded.split(",")[0].strip();
        }
        return remote;
    }
    private static Map<String,String> form(Context ctx) {
        Map<String,String> result=new HashMap<>();
        ctx.formParamMap().forEach((key,values)->{if(values.size()!=1)throw new RoomService.Failure(400,"INVALID_REQUEST");result.put(key,values.get(0));});
        return result;
    }
    private static String required(Context ctx,String name) {String value=ctx.formParam(name);if(value==null)throw new RoomService.Failure(400,"INVALID_REQUEST");return value;}
    @Override public synchronized void close() {if(closed)return;closed=true;rooms.shutdown();scheduler.shutdownNow();app.stop();}
    public static void main(String[] args) {
        var server=new RoomServer(ServerConfig.load(args)).start();
        Runtime.getRuntime().addShutdownHook(new Thread(server::close));
        System.out.println("Final Answer HTTP + WebSocket listening on port "+server.port());
    }
}
