package com.finalanswer.server;

import com.erni.finalanswer.gameplay.elevator.Formula;
import com.finalanswer.protocol.Protocol;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

/** THE UNSTABLE FORMULA through the production room service. */
class FormulaRoomTest {
    final java.util.concurrent.atomic.AtomicLong clock = new java.util.concurrent.atomic.AtomicLong(1_000_000);
    final com.finalanswer.server.rooms.RoomService service = new com.finalanswer.server.rooms.RoomService(clock::get, 1000, "");
    com.google.gson.JsonObject host, one, two; TestPeer h = new TestPeer(), a = new TestPeer(), b = new TestPeer(); long seq = 1;
    @org.junit.jupiter.api.BeforeEach void setup() {
        host = obj(service.create(new HashMap<>(Map.of("name", "Lab", "maxPlayers", "4")))); service.attach(s(host, "code"), s(host, "token"), h, "host");
        one = obj(service.join(s(host, "code"), Map.of("name", "One"))); service.attach(s(host, "code"), s(one, "token"), a, "a");
        two = obj(service.join(s(host, "code"), Map.of("name", "Two"))); service.attach(s(host, "code"), s(two, "token"), b, "b");
    }
    void command(TestPeer peer, String type, Map<String, ?> f) { service.command(peer, Protocol.decode(Protocol.event(type, UUID.randomUUID().toString(), f))); }
    void act(TestPeer peer, String action, String reagent) { var m = new HashMap<String, Object>(Map.of("action", action, "seq", seq++)); if (reagent != null) m.put("reagent", reagent); command(peer, "FORMULA_ACTION", m); }
    void failure(String code, Runnable r) { assertEquals(code, assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class, r::run).getMessage()); }
    com.google.gson.JsonObject fz(TestPeer p) { return p.latest().getAsJsonObject("elevatorFormula"); }
    void tick(long ms) { for (long t = 0; t < ms; t += 25) { clock.addAndGet(25); service.tick(); if (clock.get() % 5000 == 0) { command(a, "PING", Map.of()); command(b, "PING", Map.of()); } } }
    /** what a player derives from the analyzer with the journal */
    static List<String> decode(com.google.gson.JsonObject v) {
        var s = new Formula.Sample(v.get("sampleId").getAsString(), Formula.Family.valueOf(v.get("family").getAsString()), v.get("cls").getAsInt(), Formula.Reaction.valueOf(v.get("reaction").getAsString()),
            Formula.Polarity.valueOf(v.get("polarity").getAsString()), Formula.Concentration.valueOf(v.get("concentration").getAsString()), null);
        return Formula.solve(s).sequence().stream().map(Enum::name).toList();
    }
    void brew(TestPeer p, List<String> doses) { var v = fz(p); if (!v.get("unstable").getAsString().isEmpty()) act(p, "LOCK_ON", null); for (String d : doses) { act(p, "DISPENSE", d); tick(700); } act(p, "INJECT", null); }

    @Test void independentLabsAndTheRecipeNeverLeaves() {
        command(a, "FORMULA_START", Map.of()); command(b, "FORMULA_START", Map.of());
        var v = fz(a); for (String k : List.of("recipe", "base", "additive", "sequence")) assertFalse(v.has(k), "no " + k + " in client state");
        act(a, "LOCK_ON", null); act(a, "DISPENSE", "CRIMSON"); command(b, "SYNC", Map.of());
        assertTrue(fz(a).get("lock").getAsBoolean()); assertFalse(fz(b).get("lock").getAsBoolean()); assertEquals(0, fz(b).getAsJsonArray("doses").size());
        assertFalse(h.latest().has("elevatorFormula"));
    }
    @Test void clientCannotSubmitARecipeOrSuccess() {
        command(a, "FORMULA_START", Map.of());
        failure("INVALID_FORMULA_ACTION", () -> command(a, "FORMULA_ACTION", Map.of("action", "INJECT", "seq", 1, "recipe", "VIOLET")));
        failure("INVALID_FORMULA_ACTION", () -> command(a, "FORMULA_ACTION", Map.of("action", "DISPENSE", "seq", 1)));
        failure("INVALID_FORMULA_ACTION", () -> command(a, "FORMULA_ACTION", Map.of("action", "DISPENSE", "seq", 1, "reagent", "WATER")));
        failure("INVALID_FORMULA_ACTION", () -> command(a, "FORMULA_ACTION", Map.of("action", "WIN", "seq", 1)));
        failure("NOT_A_PLAYER", () -> command(h, "FORMULA_START", Map.of()));
    }
    @Test void wrongThenRightGrantsTheRewardOnceAndSurvivesReconnect() {
        command(a, "FORMULA_START", Map.of()); var doses = decode(fz(a)); var wrong = new ArrayList<>(doses); Collections.reverse(wrong); if (wrong.equals(doses)) wrong.remove(0);
        brew(a, wrong); assertEquals("REJECTED", fz(a).getAsJsonObject("event").get("type").getAsString()); tick(1900); assertEquals(0, fz(a).getAsJsonArray("doses").size(), "drained");
        assertEquals("RUNNING", fz(a).get("outcome").getAsString());
        brew(a, doses); assertEquals("STABILIZED", fz(a).get("outcome").getAsString()); assertEquals(1, a.latest().get("elevatorRepairs").getAsInt());
        act(a, "INJECT", null); tick(2000); assertEquals(1, a.latest().get("elevatorRepairs").getAsInt(), "reward once");
        var again = new TestPeer(); service.attach(s(host, "code"), s(one, "token"), again, "again"); assertEquals("STABILIZED", fz(again).get("outcome").getAsString());
        assertEquals(0, b.latest().get("elevatorRepairs").getAsInt());
    }
    @Test void reconnectMidBrewKeepsDosesAndTimer() {
        command(a, "FORMULA_START", Map.of()); long deadline = fz(a).get("deadline").getAsLong(); act(a, "DISPENSE", "AMBER"); tick(700);
        var again = new TestPeer(); service.attach(s(host, "code"), s(one, "token"), again, "again");
        assertEquals(List.of("AMBER"), fz(again).getAsJsonArray("doses").asList().stream().map(e -> e.getAsString()).toList()); assertEquals(deadline, fz(again).get("deadline").getAsLong());
        command(again, "FORMULA_START", Map.of()); assertEquals(deadline, fz(again).get("deadline").getAsLong(), "restart cannot extend the timer");
    }
    @Test void timeoutGivesOnePenalty() {
        command(a, "FORMULA_START", Map.of()); int before = a.events.size(); tick(46_000);
        assertEquals("FAILED", fz(a).get("outcome").getAsString()); assertEquals(1, a.latest().get("elevatorPenalties").getAsInt());
        assertTrue(a.events.subList(before, a.events.size()).stream().anyMatch(e -> e.get("type").getAsString().equals("FORMULA_UPDATED")));
        tick(2000); assertEquals(1, a.latest().get("elevatorPenalties").getAsInt());
    }
}
