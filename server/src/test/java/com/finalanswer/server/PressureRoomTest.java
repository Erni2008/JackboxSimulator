package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

/** PRESSURE CONTROL through the production room service: authority, isolation, reward, reconnect. */
class PressureRoomTest {
    final java.util.concurrent.atomic.AtomicLong clock = new java.util.concurrent.atomic.AtomicLong(1_000_000);
    final com.finalanswer.server.rooms.RoomService service = new com.finalanswer.server.rooms.RoomService(clock::get, 1000, "");
    com.google.gson.JsonObject host, one, two;
    TestPeer h = new TestPeer(), a = new TestPeer(), b = new TestPeer();
    @org.junit.jupiter.api.BeforeEach void setup() {
        host = obj(service.create(new HashMap<>(Map.of("name", "Lift", "maxPlayers", "4"))));
        service.attach(s(host, "code"), s(host, "token"), h, "host");
        one = obj(service.join(s(host, "code"), Map.of("name", "One"))); service.attach(s(host, "code"), s(one, "token"), a, "a");
        two = obj(service.join(s(host, "code"), Map.of("name", "Two"))); service.attach(s(host, "code"), s(two, "token"), b, "b");
    }
    void command(TestPeer peer, String type, Map<String, ?> fields) { service.command(peer, Protocol.decode(Protocol.event(type, UUID.randomUUID().toString(), fields))); }
    void failure(String code, Runnable action) { assertEquals(code, assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class, action::run).getMessage()); }
    com.google.gson.JsonObject pz(TestPeer p) { return p.latest().getAsJsonObject("elevatorPressure"); }
    void tick(long ms) { for (long t = 0; t < ms; t += 25) { clock.addAndGet(25); service.tick(); } }

    @Test void eachPlayerHasAnIndependentPuzzle() {
        command(a, "PRESSURE_START", Map.of()); command(b, "PRESSURE_START", Map.of());
        double before = pz(b).get("pressure").getAsDouble(); int bIntake = pz(b).get("intake").getAsInt();
        command(a, "PRESSURE_VALVE", Map.of("valve", "INTAKE", "position", 2, "seq", 1));
        command(b, "PRESSURE_VALVE", Map.of("valve", "RELEASE", "position", 0, "seq", 1));
        tick(1000);
        assertEquals(2, pz(a).get("intake").getAsInt()); assertEquals(bIntake, pz(b).get("intake").getAsInt(), "A's valve never touches B");
        assertEquals(0, pz(b).get("release").getAsInt());
        assertFalse(h.latest().has("elevatorPressure"), "host sees no private puzzle");
        assertNotEquals(pz(a).get("puzzleId").getAsString(), pz(b).get("puzzleId").getAsString());
        assertTrue(Math.abs(pz(b).get("pressure").getAsDouble() - before) < 30);
    }
    @Test void clientCannotSubmitPressureOrOutcome() {
        command(a, "PRESSURE_START", Map.of());
        failure("INVALID_PRESSURE_ACTION", () -> command(a, "PRESSURE_VALVE", Map.of("valve", "INTAKE", "position", 1, "seq", 1, "pressure", 60)));
        failure("INVALID_PRESSURE_ACTION", () -> command(a, "PRESSURE_VALVE", Map.of("valve", "WIN", "position", 1, "seq", 1)));
        failure("INVALID_VALVE_POSITION", () -> command(a, "PRESSURE_VALVE", Map.of("valve", "STABILIZER", "position", 2, "seq", 1)));
        failure("INVALID_PRESSURE_ACTION", () -> command(a, "PRESSURE_START", Map.of("outcome", "STABILIZED")));
        failure("NOT_A_PLAYER", () -> command(h, "PRESSURE_START", Map.of()));
    }
    @Test void duplicateRequestsAreHarmless() {
        command(a, "PRESSURE_START", Map.of());
        command(a, "PRESSURE_VALVE", Map.of("valve", "INTAKE", "position", 2, "seq", 7));
        command(a, "PRESSURE_VALVE", Map.of("valve", "INTAKE", "position", 0, "seq", 7));
        assertEquals(2, pz(a).get("intake").getAsInt()); assertEquals(7, pz(a).get("lastSeq").getAsLong());
    }
    @Test void timeoutFailsAndRestartDoesNotExtendARunningPuzzle() {
        command(a, "PRESSURE_START", Map.of()); long deadline = pz(a).get("deadline").getAsLong(), id = pz(a).get("puzzleId").getAsLong();
        tick(10_000); command(a, "PRESSURE_START", Map.of());
        assertEquals(deadline, pz(a).get("deadline").getAsLong(), "a running puzzle cannot be restarted to reset the timer"); assertEquals(id, pz(a).get("puzzleId").getAsLong());
        tick(36_000);
        // pressure may have been won by chance only if valves were touched; idle puzzles are generated unwinnable
        assertEquals("FAILED", pz(a).get("outcome").getAsString());
        assertEquals(0, a.latest().get("elevatorRepairs").getAsInt());
    }
    @Test void stabilizingGrantsTheRepairOnceAndSurvivesReconnect() {
        command(a, "PRESSURE_START", Map.of()); long seq = 1;
        for (int step = 0; step < 300 && pz(a).get("outcome").getAsString().equals("RUNNING"); step++) {
            var v = pz(a); double p = v.get("pressure").getAsDouble(), mid = (v.get("safeLow").getAsInt() + v.get("safeHigh").getAsInt()) / 2.0, err = mid - p;
            int in = Math.abs(err) > 12 ? (err > 0 ? 2 : 0) : Math.abs(err) > 3 ? (err > 0 ? 1 : 0) : 1, out = Math.abs(err) > 12 ? (err > 0 ? 0 : 2) : Math.abs(err) > 3 ? (err > 0 ? 0 : 1) : 1, st = Math.abs(err) > 12 ? 0 : 1;
            command(a, "PRESSURE_VALVE", Map.of("valve", "INTAKE", "position", in, "seq", seq++));
            command(a, "PRESSURE_VALVE", Map.of("valve", "RELEASE", "position", out, "seq", seq++));
            command(a, "PRESSURE_VALVE", Map.of("valve", "STABILIZER", "position", st, "seq", seq++));
            tick(500);
        }
        assertEquals("STABILIZED", pz(a).get("outcome").getAsString());
        assertEquals(1, a.latest().get("elevatorRepairs").getAsInt());
        tick(2000); assertEquals(1, a.latest().get("elevatorRepairs").getAsInt(), "reward granted once");
        var again = new TestPeer(); service.attach(s(host, "code"), s(one, "token"), again, "again");
        assertEquals("STABILIZED", pz(again).get("outcome").getAsString(), "authoritative state restored on reconnect");
        assertEquals(0, b.latest().get("elevatorRepairs").getAsInt());
    }
    @Test void stabilizingBetweenRequestsIsRewardedAndPushedByTheServerTick() {
        command(a, "PRESSURE_START", Map.of()); long seq = 1; int pushes = 0;
        // steer with requests, then stop touching the valves once inside the zone: the tick alone must finish it
        for (int step = 0; step < 200; step++) {
            var v = pz(a); double p = v.get("pressure").getAsDouble(), mid = (v.get("safeLow").getAsInt() + v.get("safeHigh").getAsInt()) / 2.0, err = mid - p;
            if (Math.abs(err) <= 3) { command(a, "PRESSURE_VALVE", Map.of("valve", "INTAKE", "position", 1, "seq", seq++)); command(a, "PRESSURE_VALVE", Map.of("valve", "RELEASE", "position", 1, "seq", seq++)); command(a, "PRESSURE_VALVE", Map.of("valve", "STABILIZER", "position", 1, "seq", seq++)); break; }
            int in = err > 0 ? (Math.abs(err) > 12 ? 2 : 1) : 0, out = err < 0 ? (Math.abs(err) > 12 ? 2 : 1) : 0;
            command(a, "PRESSURE_VALVE", Map.of("valve", "INTAKE", "position", in, "seq", seq++)); command(a, "PRESSURE_VALVE", Map.of("valve", "RELEASE", "position", out, "seq", seq++)); command(a, "PRESSURE_VALVE", Map.of("valve", "STABILIZER", "position", Math.abs(err) > 12 ? 0 : 1, "seq", seq++));
            tick(200);
        }
        int before = a.events.size(); tick(4000);
        assertEquals("STABILIZED", pz(a).get("outcome").getAsString(), "finished by the server tick, no request needed");
        assertEquals(1, a.latest().get("elevatorRepairs").getAsInt(), "reward granted by the tick");
        assertTrue(a.events.subList(before, a.events.size()).stream().anyMatch(e -> e.get("type").getAsString().equals("PRESSURE_UPDATED")), "server pushed the outcome");
    }
}
