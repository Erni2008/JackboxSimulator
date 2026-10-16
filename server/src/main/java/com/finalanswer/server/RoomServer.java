package com.finalanswer.server;

import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class RoomServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(
            new InetSocketAddress("127.0.0.1", 8080),
            0
        );

        server.createContext("/health", exchange -> {
            byte[] response = "Server is running!"
                .getBytes(StandardCharsets.UTF_8);

            exchange.getResponseHeaders().set(
                "Content-Type",
                "text/plain; charset=utf-8"
            );
            exchange.sendResponseHeaders(200, response.length);

            try (var output = exchange.getResponseBody()) {
                output.write(response);
            }
        });

        server.start();
        System.out.println("Server started: http://127.0.0.1:8080");
    }
}
