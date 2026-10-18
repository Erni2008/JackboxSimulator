package com.finalanswer.server.transport;

/** Transport boundary: gameplay never imports Jetty or LibGDX. Send must be non-blocking. */
public interface Peer {
    String id();
    void send(String message);
    void close(int code, String reason);
}
