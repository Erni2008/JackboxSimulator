package com.erni.finalanswer.network;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Net;
import com.badlogic.gdx.utils.JsonReader;
import com.badlogic.gdx.utils.JsonValue;
import com.erni.finalanswer.rooms.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Consumer;

/** Asynchronous HTTP; every UI callback is delivered on the LibGDX render thread. */
public final class RoomApiClient implements AutoCloseable {
    private final HostingAccess hosting;
    public RoomApiClient(){this(HostingAccess.external(System.getProperty("finalanswer.server",System.getenv().getOrDefault("FINALANSWER_SERVER_URL","http://127.0.0.1:8080")).replaceAll("/+$","")));}
    public RoomApiClient(HostingAccess hosting){this.hosting=hosting;}
    private final Set<Net.HttpRequest> requests = ConcurrentHashMap.newKeySet();
    private volatile boolean closed;

    public void create(
            RoomConfiguration configuration,
            String code,
            Consumer<RoomSession> done,
            Consumer<String> failed) {
        hosting.ensureReady().whenComplete((url,error)->Gdx.app.postRunnable(()->{
            if(closed)return;
            if(error!=null){Throwable cause=error;while(cause.getCause()!=null)cause=cause.getCause();failed.accept(cause.getMessage()==null?"Server unavailable. Try again.":cause.getMessage());return;}
            request(
                "/rooms",
                Map.of(
                        "name",
                        configuration.roomName(),
                        "maxPlayers",
                        Integer.toString(configuration.maxPlayers()),
                        "gameMode",
                        configuration.gameMode().getId(),
                        "password",
                        configuration.password(),
                        "code",
                        code),
                json -> done.accept(parse(json)),
                failed);
        }));
    }

    public void join(
            String code,
            String name,
            String password,
            Consumer<RoomSession> done,
            Consumer<String> failed) {
        String normalized = code.trim().toUpperCase(Locale.ROOT);
        if (!normalized.matches("[A-HJ-NP-Z2-9]{6}")) {
            failed.accept("Enter a valid six-character room code.");
            return;
        }
        request(
                "/rooms/" + normalized + "/join",
                Map.of("name", name, "password", password),
                json -> done.accept(parse(json)),
                failed);
    }

    public void heartbeat(RoomSession room, Consumer<RoomSession> done, Consumer<String> failed) {
        request(
                "/rooms/" + room.code() + "/heartbeat",
                Map.of("token", room.token()),
                json -> done.accept(parse(json)),
                failed);
    }

    public void reroll(RoomSession room, String code, Consumer<RoomSession> done, Consumer<String> failed) {
        request("/rooms/" + room.code() + "/reroll",
                Map.of("token", room.token(), "code", code),
                json -> done.accept(parse(json)), failed);
    }

    public void leave(RoomSession room) {
        if (room != null)
            request(
                    "/rooms/" + room.code() + "/leave",
                    Map.of("token", room.token()),
                    ignored -> {},
                    ignored -> {});
    }

    private void request(
            String path,
            Map<String, String> data,
            Consumer<JsonValue> done,
            Consumer<String> failed) {
        if (closed) return;
        Net.HttpRequest request = new Net.HttpRequest(Net.HttpMethods.POST);
        request.setUrl(hosting.apiUrl() + path);
        request.setTimeOut(5000);
        request.setHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        StringJoiner content = new StringJoiner("&");
        data.forEach((key, value) -> content.add(encode(key) + "=" + encode(value)));
        request.setContent(content.toString());
        requests.add(request);
        Gdx.net.sendHttpRequest(
                request,
                new Net.HttpResponseListener() {
                    public void handleHttpResponse(Net.HttpResponse response) {
                        int status = response.getStatus().getStatusCode();
                        String body = response.getResultAsString();
                        requests.remove(request);
                        Gdx.app.postRunnable(
                                () -> {
                                    if (closed) return;
                                    try {
                                        JsonValue json = new JsonReader().parse(body);
                                        if (status >= 200 && status < 300) done.accept(json);
                                        else
                                            failed.accept(
                                                    json.getString(
                                                            "error",
                                                            "Room request failed ("
                                                                    + status
                                                                    + ")."));
                                    } catch (RuntimeException error) {
                                        failed.accept(
                                                "Unexpected server response. Restart the room"
                                                    + " server.");
                                    }
                                });
                    }

                    public void failed(Throwable error) {
                        requests.remove(request);
                        Gdx.app.postRunnable(
                                () -> {
                                    if (!closed)
                                        failed.accept(
                                                "Cannot reach room server. Start it and try"
                                                    + " again.");
                                });
                    }

                    public void cancelled() {
                        requests.remove(request);
                    }
                });
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    public String baseUrl() { return hosting.apiUrl(); }

    private static RoomSession parse(JsonValue json) { return parse(json, ""); }

    public static RoomSession parse(JsonValue json, String token) {
        List<RoomSession.Player> players = new ArrayList<>();
        for (JsonValue player = json.get("players").child; player != null; player = player.next)
            players.add(
                    new RoomSession.Player(
                            player.getString("id"),
                            player.getString("name"),
                            player.getBoolean("host"), player.getString("characterId", "guest"),
                            player.getString("connectionStatus", "OFFLINE"), player.getBoolean("hasSubmittedAnswer", false), player.getInt("score",0)));
        return new RoomSession(
                json.getString("code"),
                json.getString("name"),
                json.getInt("maxPlayers"),
                json.getString("gameMode"),
                json.getString("token", token),
                json.getBoolean("host"),
                players);
    }

    @Override
    public void close() {
        closed = true;
        for (var request : requests) Gdx.net.cancelHttpRequest(request);
        requests.clear();
    }
}
