package com.finalanswer.server;

import com.finalanswer.server.rooms.RoomService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.Executors;

/** Plain Java HTTP transport; gameplay rules do not belong in request handlers. */
public class RoomServer {
    public static void main(String[] args) throws IOException {
        int port = args.length == 0 ? 8080 : Integer.parseInt(args[0]);
        HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", port), 32);
        var executor = Executors.newFixedThreadPool(4);
        server.setExecutor(executor);
        RoomService rooms = new RoomService();
        server.createContext("/health", exchange -> send(exchange, 200, "{\"status\":\"ok\"}"));
        server.createContext(
                "/rooms",
                exchange -> {
                    try {
                        String[] parts = exchange.getRequestURI().getPath().split("/");
                        String method = exchange.getRequestMethod();
                        if (parts.length < 2 || !parts[1].equals("rooms")) {
                            throw new RoomService.Failure(404, "Unknown endpoint.");
                        }
                        if (parts.length == 2 && method.equals("POST")) {
                            send(exchange, 201, rooms.create(form(exchange)));
                            return;
                        }
                        if (parts.length == 3 && method.equals("GET")) {
                            send(exchange, 200, rooms.view(parts[2]));
                            return;
                        }
                        if (parts.length == 4 && method.equals("POST")) {
                            Map<String, String> data = form(exchange);
                            switch (parts[3]) {
                                case "join" -> send(exchange, 200, rooms.join(parts[2], data));
                                case "heartbeat" ->
                                        send(
                                                exchange,
                                                200,
                                                rooms.heartbeat(
                                                        parts[2], data.getOrDefault("token", "")));
                                case "reroll" -> send(exchange, 200, rooms.reroll(parts[2], data));
                                case "leave" -> {
                                    rooms.leave(parts[2], data.getOrDefault("token", ""));
                                    send(exchange, 200, "{}");
                                }
                                default -> throw new RoomService.Failure(404, "Unknown endpoint.");
                            }
                            return;
                        }
                        throw new RoomService.Failure(404, "Unknown endpoint or HTTP method.");
                    } catch (RoomService.Failure failure) {
                        send(
                                exchange,
                                failure.status,
                                "{\"error\":" + RoomService.quote(failure.getMessage()) + "}");
                    } catch (IllegalArgumentException failure) {
                        send(exchange, 400, "{\"error\":\"Invalid request.\"}");
                    } catch (Exception failure) {
                        failure.printStackTrace();
                        send(exchange, 500, "{\"error\":\"Server error.\"}");
                    } finally {
                        exchange.close();
                    }
                });
        Runtime.getRuntime()
                .addShutdownHook(
                        new Thread(
                                () -> {
                                    server.stop(0);
                                    executor.shutdownNow();
                                }));
        server.start();
        System.out.println("Final Answer room server: http://127.0.0.1:" + port);
    }

    private static Map<String, String> form(HttpExchange exchange) throws IOException {
        byte[] bytes = exchange.getRequestBody().readNBytes(8193);
        if (bytes.length > 8192) throw new RoomService.Failure(413, "Request is too large.");
        Map<String, String> result = new HashMap<>();
        for (String entry : new String(bytes, StandardCharsets.UTF_8).split("&")) {
            if (entry.isEmpty()) continue;
            String[] pair = entry.split("=", 2);
            result.put(
                    URLDecoder.decode(pair[0], StandardCharsets.UTF_8),
                    URLDecoder.decode(pair.length == 2 ? pair[1] : "", StandardCharsets.UTF_8));
        }
        return result;
    }

    private static void send(HttpExchange exchange, int status, String body) throws IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.getResponseHeaders().set("Cache-Control", "no-store");
        exchange.sendResponseHeaders(status, bytes.length);
        try (var output = exchange.getResponseBody()) {
            output.write(bytes);
        }
        exchange.close();
    }
}
