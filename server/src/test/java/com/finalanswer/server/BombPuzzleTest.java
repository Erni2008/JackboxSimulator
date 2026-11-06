package com.finalanswer.server;

import com.erni.finalanswer.gameplay.elevator.*;
import com.erni.finalanswer.gameplay.elevator.BombPuzzle.*;
import com.finalanswer.protocol.Protocol;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.finalanswer.server.RoomServiceTest.*;

/** THE HOST'S SUITCASE: module choice, fuse, progress, and the room keeps the same suitcase across reconnects. */
class BombPuzzleTest {
    @Test void moduleChoiceIsReproducibleCoversAllFiveAndCanBeForced() {
        Set<Mechanism> seen = EnumSet.noneOf(Mechanism.class);
        for (long s = 0; s < 200; s++) { assertEquals(BombPuzzle.pick(s), BombPuzzle.pick(s)); seen.add(BombPuzzle.pick(s)); }
        assertEquals(EnumSet.allOf(Mechanism.class), seen, "every mechanism can come up");
        assertEquals(Mechanism.LASER, new BombPuzzle(1, Difficulty.EASY, Mechanism.LASER, 0).module);
        assertEquals(Mechanism.THERMAL, BombPuzzle.parse("thermal")); assertNull(BombPuzzle.parse("lava"));
    }
    @Test void timersComeFromDifficultyAndTheFuseDetonates() {
        assertEquals(90_000, Difficulty.EASY.bombMs); assertEquals(60_000, Difficulty.NORMAL.bombMs); assertEquals(45_000, Difficulty.HARD.bombMs);
        var p = new BombPuzzle(3, Difficulty.HARD, null, 1000); assertFalse(p.advance(1000 + 44_999)); assertEquals(Outcome.RUNNING, p.outcome());
        assertTrue(p.advance(1000 + 45_000)); assertEquals(Outcome.DETONATED, p.outcome()); assertEquals("TIMEOUT", p.failReason());
        assertFalse(p.apply("OPEN", 1, 50_000), "nothing works after the bang");
    }
    @Test void progressIsOrderedAndDuplicatesIgnored() {
        var p = new BombPuzzle(3, Difficulty.NORMAL, null, 0); assertEquals(Stage.HIDDEN, p.stage());
        assertTrue(p.apply("FOUND", 1, 10)); assertEquals(Stage.FOUND, p.stage()); assertFalse(p.apply("OPEN", 1, 20), "same seq twice");
        assertTrue(p.apply("OPEN", 2, 30)); assertEquals(Stage.OPEN, p.stage()); assertTrue(p.apply("FOUND", 3, 40)); assertEquals(Stage.OPEN, p.stage(), "never goes back");
        assertThrows(IllegalArgumentException.class, () -> p.apply("DEFUSE", 4, 50), "the client cannot claim success");
    }
    @Test void roomKeepsTheSameSuitcaseAcrossReconnects() {
        var clock = new java.util.concurrent.atomic.AtomicLong(1_000_000); var service = new com.finalanswer.server.rooms.RoomService(clock::get, 1000, "");
        TestPeer h = new TestPeer(), a = new TestPeer(), a2 = new TestPeer();
        var host = obj(service.create(new HashMap<>(Map.of("name", "Cage", "maxPlayers", "4")))); service.attach(s(host, "code"), s(host, "token"), h, "host");
        var one = obj(service.join(s(host, "code"), Map.of("name", "One"))); service.attach(s(host, "code"), s(one, "token"), a, "a");
        java.util.function.BiConsumer<TestPeer, Object[]> cmd = (peer, kv) -> { Map<String, Object> m = new LinkedHashMap<>(); for (int i = 1; i < kv.length; i += 2) m.put((String) kv[i], kv[i + 1]); service.command(peer, Protocol.decode(Protocol.event((String) kv[0], UUID.randomUUID().toString(), m))); };
        cmd.accept(h, new Object[]{"OPEN_WEB_GAME", "game", "broken-elevator", "difficulty", "NORMAL"});
        cmd.accept(a, new Object[]{"BOMB_START", "module", "WIRE_MAZE"}); cmd.accept(a, new Object[]{"BOMB_ACTION", "action", "OPEN", "seq", 1});
        String before = bomb(a); assertTrue(before.contains("\"module\":\"WIRE_MAZE\"") && before.contains("\"stage\":\"OPEN\""), before);
        service.attach(s(host, "code"), s(one, "token"), a2, "a2"); cmd.accept(a2, new Object[]{"BOMB_START", "module", "LASER"});
        String after = bomb(a2); assertTrue(after.contains("\"module\":\"WIRE_MAZE\"") && after.contains("\"stage\":\"OPEN\""), "same suitcase, same progress: " + after);
        assertEquals(before.replaceAll(".*\"puzzleId\":\"([0-9a-f]+)\".*", "$1"), after.replaceAll(".*\"puzzleId\":\"([0-9a-f]+)\".*", "$1"));
        assertThrows(com.finalanswer.server.rooms.RoomService.Failure.class, () -> cmd.accept(a2, new Object[]{"BOMB_ACTION", "action", "DEFUSE", "seq", 2}));
    }
    @Test void wireMazeAlwaysHasExactlyOneFiringWireAndTheRulesMatter() {
        for (Difficulty d : Difficulty.values()) { int redirected = 0, total = 400;
            for (long seed = 0; seed < total; seed++) { var m = WireMaze.generate(seed, d); assertEquals(WireMaze.wires(d), m.n);
                assertEquals(m.n, new HashSet<>(m.letters).size(), "letters unique"); assertEquals(1, Collections.frequency(m.letters, m.seal.letter), "the seal's letter is on the panel once");
                var ends = new HashSet<Integer>(); for (int e : m.end) ends.add(e); assertEquals(m.n, ends.size(), "a permutation: one wire per end terminal");
                // independent reading of chapter I
                int key = m.letters.indexOf(m.seal.letter), e = m.end[key], expect = key;
                if (d != Difficulty.EASY && e % 3 == 0) { expect = -1; for (int i = 0; i < m.n; i++) if (m.end[i] == e + 1) expect = i; redirected++; }
                assertTrue(expect >= 0, "rule II always has a next terminal"); assertEquals(expect, m.solution());
                int same = 0; for (int i = 0; i < m.n; i++) if (m.color[i] == m.color[m.solution()]) same++; assertTrue(same >= 2, "colour alone never gives it away");
                assertEquals(m.n, Arrays.stream(m.layer).distinct().count(), "every wire on its own layer"); }
            if (d == Difficulty.EASY) assertEquals(0, redirected); else assertTrue(redirected > total / 4 && redirected < total * 3 / 4, "rule II matters about half the time: " + redirected);
            assertEquals(WireMaze.generate(42, d).solution(), WireMaze.generate(42, d).solution(), "reproducible"); }
    }
    @Test void cuttingIsValidatedOnTheServer() {
        var p = new BombPuzzle(9, Difficulty.NORMAL, Mechanism.WIRE_MAZE, 0); int ok = p.wires.solution(), bad = (ok + 1) % p.wires.n, bad2 = (ok + 2) % p.wires.n;
        assertThrows(IllegalArgumentException.class, () -> p.apply("CUT", ok, 1, 10), "the lid must be open first");
        p.apply("OPEN", 2, 20); assertThrows(IllegalArgumentException.class, () -> p.apply("CUT", 99, 3, 30));
        assertTrue(p.apply("CUT", bad, 4, 40)); assertEquals(1, p.strikes()); assertEquals(Outcome.RUNNING, p.outcome());
        assertFalse(p.apply("CUT", bad, 5, 50), "a cut wire stays cut"); assertEquals(1, p.strikes());
        assertTrue(p.apply("CUT", ok, 6, 60)); assertEquals(Outcome.DEFUSED, p.outcome()); assertEquals(Set.of(bad, ok), p.cut());
        var h = new BombPuzzle(9, Difficulty.HARD, Mechanism.WIRE_MAZE, 0); h.apply("OPEN", 1, 1); int s = h.wires.solution();
        h.apply("CUT", (s + 1) % h.wires.n, 2, 2); assertEquals(Outcome.RUNNING, h.outcome(), "hard forgives one"); h.apply("CUT", (s + 2) % h.wires.n, 3, 3); assertEquals(Outcome.DETONATED, h.outcome()); assertEquals("WRONG", h.failReason());
        void_(bad2);
    }
    static void void_(int x) {}
    static String bomb(TestPeer p) { for (int i = p.events.size() - 1; i >= 0; i--) { var pl = p.events.get(i).getAsJsonObject("payload"); if (pl != null && pl.has("elevatorBomb")) return pl.get("elevatorBomb").toString(); } return ""; }
}
