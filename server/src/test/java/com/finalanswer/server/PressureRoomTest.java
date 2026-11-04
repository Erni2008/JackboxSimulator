package com.finalanswer.server;

import com.finalanswer.protocol.Protocol;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

/** THE BROKEN VALVES through the production room service: authority, isolation, reward/penalty, reconnect. */
class PressureRoomTest {
    final java.util.concurrent.atomic.AtomicLong clock = new java.util.concurrent.atomic.AtomicLong(1_000_000);
    final com.finalanswer.server.rooms.RoomService service = new com.finalanswer.server.rooms.RoomService(clock::get, 1000, "");
    com.google.gson.JsonObject host, one, two;
    TestPeer h = new TestPeer(), a = new TestPeer(), b = new TestPeer();
    long seq = 1;
    @org.junit.jupiter.api.BeforeEach void setup() {
        host = obj(service.create(new HashMap<>(Map.of("name", "Lift", "maxPlayers", "4"))));
        service.attach(s(host, "code"), s(host, "token"), h, "host");
        one = obj(service.join(s(host, "code"), Map.of("name", "One"))); service.attach(s(host, "code"), s(one, "token"), a, "a");
        two = obj(service.join(s(host, "code"), Map.of("name", "Two"))); service.attach(s(host, "code"), s(two, "token"), b, "b");
    }
    void command(TestPeer peer, String type, Map<String, ?> fields) { service.command(peer, Protocol.decode(Protocol.event(type, UUID.randomUUID().toString(), fields))); }
    void act(TestPeer peer, String action) { command(peer, "PRESSURE_ACTION", Map.of("action", action, "seq", seq++)); }
    void failure(String code, Runnable action) { assertEquals(code, assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class, action::run).getMessage()); }
    com.google.gson.JsonObject pz(TestPeer p) { return p.latest().getAsJsonObject("elevatorPressure"); }
    /** advances server time; players keep the 5 s PING heartbeat the elevator page sends */
    void tick(long ms) { for (long t = 0; t < ms; t += 25) { clock.addAndGet(25); service.tick(); if (clock.get() % 5000 == 0) { command(a, "PING", Map.of()); command(b, "PING", Map.of()); } } }

    @Test void eachPlayerHasAnIndependentMachineAndTheFaultStaysHiddenUntilTested() {
        command(a, "PRESSURE_START", Map.of()); command(b, "PRESSURE_START", Map.of());
        assertNotEquals(pz(a).get("puzzleId").getAsString(), pz(b).get("puzzleId").getAsString());
        assertEquals("", pz(a).get("code").getAsString(), "no fault before TEST"); assertFalse(pz(a).toString().matches(".*\\b(R02|B04|F01|L03)\\b.*"));
        double bBefore = pz(b).get("pressure").getAsDouble(); boolean bBypass = pz(b).get("bypass").getAsBoolean();
        act(a, "BYPASS_AUX"); act(a, "DIAGNOSTIC"); tick(1600);
        assertTrue(pz(a).get("bypass").getAsBoolean()); assertTrue(Set.of("R-02", "B-04", "F-01", "L-03").contains(pz(a).get("code").getAsString()));
        command(b, "SYNC", Map.of()); assertEquals(bBypass, pz(b).get("bypass").getAsBoolean(), "A's lever never touches B"); assertEquals("", pz(b).get("code").getAsString());
        assertTrue(Math.abs(pz(b).get("pressure").getAsDouble() - bBefore) <= 10.5, "B only changed by its own leak/surge");
        assertFalse(h.latest().has("elevatorPressure"), "host sees no private machine");
    }
    @Test void clientCannotSubmitStateOrDeclareSuccess() {
        command(a, "PRESSURE_START", Map.of());
        failure("INVALID_PRESSURE_ACTION", () -> command(a, "PRESSURE_ACTION", Map.of("action", "RED", "seq", 1, "pressure", 60)));
        failure("INVALID_PRESSURE_ACTION", () -> command(a, "PRESSURE_ACTION", Map.of("action", "WIN", "seq", 1)));
        failure("INVALID_PRESSURE_ACTION", () -> command(a, "PRESSURE_START", Map.of("outcome", "STABILIZED")));
        failure("NOT_A_PLAYER", () -> command(h, "PRESSURE_START", Map.of()));
    }
    @Test void emergencyReleaseIsTrackedByTheServerAndRejectedTwice() {
        command(a, "PRESSURE_START", Map.of()); double p0 = pz(a).get("pressure").getAsDouble();
        act(a, "EMERGENCY"); assertTrue(pz(a).get("emergencyUsed").getAsBoolean()); assertEquals(Math.max(0, p0 - 20), pz(a).get("pressure").getAsDouble(), .2);
        failure("EMERGENCY_USED", () -> act(a, "EMERGENCY"));
        var again = new TestPeer(); service.attach(s(host, "code"), s(one, "token"), again, "again");
        assertTrue(pz(again).get("emergencyUsed").getAsBoolean(), "survives reconnect"); failure("EMERGENCY_USED", () -> command(again, "PRESSURE_ACTION", Map.of("action", "EMERGENCY", "seq", seq++)));
    }
    @Test void duplicateActionsAreHarmless() {
        command(a, "PRESSURE_START", Map.of()); act(a, "BYPASS_AUX"); double p0 = pz(a).get("pressure").getAsDouble();
        command(a, "PRESSURE_ACTION", Map.of("action", "FINE_ON", "seq", 500)); command(a, "PRESSURE_ACTION", Map.of("action", "RED", "seq", 501));
        command(a, "PRESSURE_ACTION", Map.of("action", "RED", "seq", 501)); command(a, "PRESSURE_ACTION", Map.of("action", "RED", "seq", 400));
        assertEquals(Math.min(120, p0 + 2), pz(a).get("pressure").getAsDouble(), .2, "one turn applied once"); assertEquals(501, pz(a).get("lastSeq").getAsLong());
    }
    @Test void timeoutFailsOnceWithPenaltyAndRestartCannotExtendTheTimer() {
        command(a, "PRESSURE_START", Map.of()); long deadline = pz(a).get("deadline").getAsLong(), id = pz(a).get("puzzleId").getAsLong();
        tick(10_000); command(a, "PRESSURE_START", Map.of()); assertEquals(deadline, pz(a).get("deadline").getAsLong()); assertEquals(id, pz(a).get("puzzleId").getAsLong());
        tick(36_000); assertEquals("FAILED", pz(a).get("outcome").getAsString());
        assertTrue(Set.of("TIMEOUT", "CRITICAL").contains(pz(a).get("failReason").getAsString()));
        assertEquals(1, a.latest().get("elevatorPenalties").getAsInt()); tick(2000); assertEquals(1, a.latest().get("elevatorPenalties").getAsInt(), "penalty once");
        assertEquals(0, a.latest().get("elevatorRepairs").getAsInt());
    }
    /** a player who reads the code, throws BYPASS and steers: success is decided and pushed by the server */
    @Test void solvingGrantsTheRepairOnceAndSurvivesReconnect() {
        command(a, "PRESSURE_START", Map.of()); act(a, "DIAGNOSTIC"); tick(1600); act(a, "BYPASS_AUX");
        for (int i = 0; i < 120 && pz(a).get("outcome").getAsString().equals("RUNNING"); i++) {
            var v = pz(a); double err = v.get("safeLow").getAsInt() + 2.5 - v.get("pressure").getAsDouble(), m = Math.abs(err); boolean fine = v.get("fine").getAsBoolean();
            if (m > 6) act(a, fine ? "FINE_OFF" : err > 0 ? "RED" : "BLUE"); else if (m > 1.5) act(a, !fine ? "FINE_ON" : err > 0 ? "RED" : "BLUE");
            tick(400);
        }
        assertEquals("STABILIZED", pz(a).get("outcome").getAsString());
        assertEquals(1, a.latest().get("elevatorRepairs").getAsInt()); assertEquals(0, a.latest().get("elevatorPenalties").getAsInt());
        assertEquals(-1, pz(a).get("surgeAt").getAsLong(), "pending surge cancelled");
        failure("INVALID_PRESSURE_ACTION", () -> command(a, "PRESSURE_ACTION", Map.of("action", "RED")));
        command(a, "PRESSURE_ACTION", Map.of("action", "RED", "seq", seq++)); assertEquals("STABILIZED", pz(a).get("outcome").getAsString(), "inputs after success ignored");
        tick(2000); assertEquals(1, a.latest().get("elevatorRepairs").getAsInt(), "reward once");
        var again = new TestPeer(); service.attach(s(host, "code"), s(one, "token"), again, "again");
        assertEquals("STABILIZED", pz(again).get("outcome").getAsString(), "restored on reconnect");
        assertEquals(0, b.latest().get("elevatorRepairs").getAsInt());
    }
    @Test void outcomeReachedBetweenRequestsIsPushedByTheTick() {
        command(a, "PRESSURE_START", Map.of()); act(a, "BYPASS_AUX"); int before = a.events.size(); tick(46_000);
        assertEquals("FAILED", pz(a).get("outcome").getAsString());
        assertTrue(a.events.subList(before, a.events.size()).stream().anyMatch(e -> e.get("type").getAsString().equals("PRESSURE_UPDATED")), "server pushed the outcome");
    }
}
