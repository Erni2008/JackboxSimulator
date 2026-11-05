package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

/** THE HELL CAGE host screen feed. */
class CageViewTest {
    final java.util.concurrent.atomic.AtomicLong clock = new java.util.concurrent.atomic.AtomicLong(1_000_000);
    final com.finalanswer.server.rooms.RoomService service = new com.finalanswer.server.rooms.RoomService(clock::get, 1000, "");
    com.google.gson.JsonObject host, one; TestPeer h = new TestPeer(), a = new TestPeer();
    void command(TestPeer peer, String type, Map<String, ?> f) { service.command(peer, Protocol.decode(Protocol.event(type, UUID.randomUUID().toString(), f))); }
    com.google.gson.JsonObject view() { return obj(service.cageView(s(host, "code"), s(host, "token"))); }

    @Test void hostFeedTracksMachinesRepairsAndFalls() {
        host = obj(service.create(new HashMap<>(Map.of("name", "Cage", "maxPlayers", "4")))); service.attach(s(host, "code"), s(host, "token"), h, "host");
        one = obj(service.join(s(host, "code"), Map.of("name", "One"))); service.attach(s(host, "code"), s(one, "token"), a, "a");
        command(h, "OPEN_WEB_GAME", Map.of("game", "broken-elevator", "difficulty", "HARD"));
        var v = view(); assertTrue(v.get("active").getAsBoolean()); assertEquals("HARD", v.get("difficulty").getAsString()); assertEquals(1, v.getAsJsonArray("players").size());
        command(a, "CAGE_REPORT", Map.of("kind", "wire", "task", 1));
        command(a, "CAGE_REPORT", Map.of("kind", "wire", "task", 1, "result", "FAIL"));
        command(a, "CAGE_REPORT", Map.of("kind", "wire", "task", 1, "result", "OK"));
        var p = view().getAsJsonArray("players").get(0).getAsJsonObject();
        assertEquals("wire", p.get("kind").getAsString()); assertEquals(1, p.get("repairs").getAsInt()); assertEquals(1, p.get("penalties").getAsInt()); assertTrue(p.get("failAt").getAsLong() > 0);
        assertEquals("NOT_HOST", assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class, () -> service.cageView(s(host, "code"), s(one, "token"))).getMessage());
        assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class, () -> command(a, "CAGE_REPORT", Map.of("kind", "lava")));
    }
}
