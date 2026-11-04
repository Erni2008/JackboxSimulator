package com.finalanswer.server;

import com.erni.finalanswer.gameplay.elevator.*;
import com.erni.finalanswer.gameplay.elevator.PressurePuzzle.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

/** THE BROKEN VALVES — rules of one machine. */
class PressurePuzzleTest {
    long seq = 0;
    static Config cfg(int start, int low, Malfunction f, long surge) { return new Config(1, start, low, f, false, surge); }
    PressurePuzzle p(int start, int low, Malfunction f) { return new PressurePuzzle(cfg(start, low, f, -1), 0); }
    void act(PressurePuzzle p, Action a, long t) { assertTrue(p.apply(a, seq++, t), a + " accepted"); }

    @Test void normalValvesAndFineControl() {
        var p = p(30, 60, Malfunction.L03); act(p, Action.BYPASS_AUX, 0);
        act(p, Action.RED, 0); assertEquals(40, p.pressure(), 1e-9);
        act(p, Action.BLUE, 0); assertEquals(30, p.pressure(), 1e-9);
        act(p, Action.FINE_ON, 0); act(p, Action.RED, 0); assertEquals(32, p.pressure(), 1e-9);
        act(p, Action.BLUE, 0); act(p, Action.BLUE, 0); assertEquals(28, p.pressure(), 1e-9);
        act(p, Action.FINE_OFF, 0); act(p, Action.RED, 0); assertEquals(38, p.pressure(), 1e-9);
    }
    @Test void redJamUntilBypass() {
        var p = p(30, 60, Malfunction.R02); act(p, Action.RED, 0); assertEquals(30, p.pressure(), 1e-9); assertTrue(p.lastEffect().jammed());
        act(p, Action.BLUE, 0); assertEquals(20, p.pressure(), 1e-9); assertFalse(p.lastEffect().jammed());
        act(p, Action.BYPASS_AUX, 0); act(p, Action.RED, 0); assertEquals(30, p.pressure(), 1e-9); assertFalse(p.lastEffect().jammed());
        act(p, Action.BYPASS_MAIN, 0); act(p, Action.RED, 0); assertEquals(30, p.pressure(), 1e-9, "MAIN restores the fault");
    }
    @Test void blueJamUntilBypass() {
        var p = p(90, 60, Malfunction.B04); act(p, Action.BLUE, 0); assertEquals(90, p.pressure(), 1e-9); assertTrue(p.lastEffect().jammed());
        act(p, Action.BYPASS_AUX, 0); act(p, Action.BLUE, 0); assertEquals(80, p.pressure(), 1e-9);
    }
    @Test void reversedFlowIsPlayableAndBypassRestoresIt() {
        var p = p(30, 60, Malfunction.F01); act(p, Action.BLUE, 0); assertEquals(40, p.pressure(), 1e-9); act(p, Action.RED, 0); assertEquals(30, p.pressure(), 1e-9);
        act(p, Action.BYPASS_AUX, 0); act(p, Action.RED, 0); assertEquals(40, p.pressure(), 1e-9);
        // option A: win on reversed flow without the bypass
        var q = p(40, 60, Malfunction.F01); for (int i = 0; i < 2; i++) act(q, Action.BLUE, 0); act(q, Action.FINE_ON, 0); act(q, Action.BLUE, 0);
        assertEquals(62, q.pressure(), 1e-9); q.advance(1000); assertEquals(Outcome.STABILIZED, q.outcome(), "reversed flow can be operated safely");
    }
    @Test void leakBleedsAtAFixedRateAndIsNeverSafeUntilIsolated() {
        var p = p(70, 60, Malfunction.L03); p.advance(2000); assertEquals(68, p.pressure(), 1e-9); assertFalse(p.safeState());
        p.advance(9000); assertEquals(Outcome.RUNNING, p.outcome(), "leaking through the green zone never counts"); assertEquals(61, p.pressure(), 1e-9);
        act(p, Action.BYPASS_AUX, 9000); assertTrue(p.safeState()); p.advance(9990); assertEquals(Outcome.RUNNING, p.outcome()); p.advance(10_000);
        assertEquals(Outcome.STABILIZED, p.outcome()); assertEquals(61, p.pressure(), 1e-9, "isolated: no further bleed");
    }
    @Test void diagnosticRevealsTheCodeAfterOneAndAHalfSecondsAndNeverChangesIt() {
        for (var f : Malfunction.values()) {
            var p = p(30, 60, f); assertEquals("", p.code());
            act(p, Action.DIAGNOSTIC, 1000); assertTrue(p.diagnosing()); p.advance(2490); assertEquals("", p.code()); p.advance(2500); assertEquals(f.code, p.code());
            act(p, Action.DIAGNOSTIC, 5000); assertEquals(f.code, p.code(), "repeat keeps the code readable"); p.advance(7000); assertEquals(f.code, p.code());
            assertEquals(PressurePuzzle.LIMIT_MS, p.deadline(), "timer unchanged");
        }
        assertEquals(List.of("R-02", "B-04", "F-01", "L-03"), Arrays.stream(Malfunction.values()).map(m -> m.code).toList());
    }
    @Test void emergencyReleaseOnce() {
        var p = p(100, 60, Malfunction.R02); act(p, Action.EMERGENCY, 0); assertEquals(80, p.pressure(), 1e-9); assertTrue(p.emergencyUsed());
        assertThrows(IllegalStateException.class, () -> p.apply(Action.EMERGENCY, 99, 10)); assertEquals(80, p.pressure(), 1e-9);
    }
    @Test void pressureBoundsAndCriticalFailure() {
        var lo = p(10, 60, Malfunction.L03); act(lo, Action.BYPASS_AUX, 0); act(lo, Action.BLUE, 0); act(lo, Action.BLUE, 0); assertEquals(0, lo.pressure(), 1e-9);
        var hi = p(100, 40, Malfunction.B04); act(hi, Action.RED, 0); assertEquals(Outcome.RUNNING, hi.outcome()); act(hi, Action.RED, 100);
        assertEquals(Outcome.FAILED, hi.outcome()); assertEquals("CRITICAL", hi.failReason()); assertEquals(120, hi.pressure(), 1e-9);
        assertFalse(hi.apply(Action.BLUE, 999, 200), "locked after failure");
    }
    @Test void surgeIsTelegraphedAddsTenOnceAndCanBeCritical() {
        var p = new PressurePuzzle(cfg(30, 70, Malfunction.R02, 20_000), 0);
        p.advance(17_990); assertFalse(p.surgeWarning()); p.advance(18_000); assertTrue(p.surgeWarning(), "2 s warning");
        p.advance(19_990); assertEquals(30, p.pressure(), 1e-9); p.advance(20_000); assertEquals(40, p.pressure(), 1e-9); assertTrue(p.surged()); assertFalse(p.surgeWarning());
        p.advance(30_000); assertEquals(40, p.pressure(), 1e-9, "only once");
        var c = new PressurePuzzle(cfg(100, 40, Malfunction.R02, 16_000), 0); act(c, Action.BYPASS_AUX, 0); act(c, Action.RED, 0); c.advance(16_000);
        assertEquals(Outcome.FAILED, c.outcome()); assertEquals("CRITICAL", c.failReason());
    }
    @Test void surgeIsCancelledBySuccess() {
        var p = new PressurePuzzle(cfg(52, 60, Malfunction.R02, 20_000), 0); act(p, Action.FINE_ON, 0); act(p, Action.BLUE, 0); act(p, Action.BYPASS_AUX, 0);
        for (int i = 0; i < 5; i++) act(p, Action.RED, 0); assertEquals(60, p.pressure(), 1e-9);
        p.advance(1000); assertEquals(Outcome.STABILIZED, p.outcome()); assertEquals(-1, p.surgeAt()); p.advance(25_000); assertEquals(60, p.pressure(), 1e-9); assertFalse(p.surged());
    }
    @Test void verificationNeedsOneContinuousSecond() {
        var p = p(50, 60, Malfunction.F01); act(p, Action.BYPASS_AUX, 0); act(p, Action.RED, 0); // 60
        p.advance(900); assertEquals(Outcome.RUNNING, p.outcome()); assertEquals(900, p.verifyMs());
        act(p, Action.FINE_ON, 900); act(p, Action.RED, 900); assertEquals(0, p.verifyMs(), "a step restarts the check"); // 62, still inside
        p.advance(1890); assertEquals(Outcome.RUNNING, p.outcome()); p.advance(1900); assertEquals(Outcome.STABILIZED, p.outcome());
        var q = p(50, 60, Malfunction.F01); act(q, Action.BYPASS_AUX, 0); act(q, Action.RED, 0); q.advance(500); act(q, Action.RED, 500); assertEquals(70, q.pressure(), 1e-9); q.advance(3000); assertEquals(0, q.verifyMs(), "leaving resets");
    }
    @Test void jamCanBeWorkedAroundWithoutBypass() {
        var p = p(80, 60, Malfunction.R02); act(p, Action.BLUE, 0); act(p, Action.BLUE, 0); assertEquals(60, p.pressure(), 1e-9); p.advance(1000); assertEquals(Outcome.STABILIZED, p.outcome());
    }
    @Test void timerExpiryFails() {
        var p = new PressurePuzzle(cfg(20, 60, Malfunction.R02, -1), 1000); p.advance(45_999); assertEquals(Outcome.RUNNING, p.outcome());
        assertTrue(p.advance(46_000)); assertEquals(Outcome.FAILED, p.outcome()); assertEquals("TIMEOUT", p.failReason()); assertFalse(p.apply(Action.RED, 5, 47_000));
    }
    @Test void duplicateAndStaleActionsAreIgnored() {
        var p = p(30, 60, Malfunction.B04); assertTrue(p.apply(Action.RED, 7, 0)); assertFalse(p.apply(Action.RED, 7, 10)); assertFalse(p.apply(Action.RED, 3, 10)); assertEquals(40, p.pressure(), 1e-9);
    }
    @Test void frameRateIndependent() {
        var c = PressureGenerator.generate(42); var a = new PressurePuzzle(c, 0); var b = new PressurePuzzle(c, 0);
        a.advance(30_000); for (long t = 0; t <= 30_000; t += 7 + t % 13) b.advance(t); b.advance(30_000);
        assertEquals(a.pressure(), b.pressure(), 1e-9); assertEquals(a.surged(), b.surged());
    }
    @Test void fiveThousandGeneratedPuzzlesAreSolvable() {
        long slowest = 0, total = 0; int[] faults = new int[4], surges = {0}; Set<Integer> zones = new TreeSet<>();
        for (long seed = 1; seed <= 5000; seed++) {
            var c = PressureGenerator.generate(seed);
            assertFalse(c.startPsi() >= c.safeLow() && c.startPsi() <= c.safeHigh(), "starts outside the zone, seed " + seed);
            var idle = new PressurePuzzle(c, 0); idle.advance(PressurePuzzle.LIMIT_MS); assertNotEquals(Outcome.STABILIZED, idle.outcome(), "not winnable idle, seed " + seed);
            long t = PressureGenerator.solveTime(c, 600, 2_500); assertTrue(t <= 30_000, "normal player solves within 30 s, seed " + seed + ": " + t);
            assertTrue(PressureGenerator.solveTime(c, 1_000, 4_000) <= PressurePuzzle.LIMIT_MS, "slow player still in time, seed " + seed);
            slowest = Math.max(slowest, t); total += t; faults[c.fault().ordinal()]++; if (c.surgeAt() >= 0) { surges[0]++; assertTrue(c.surgeAt() >= 15_000 && c.surgeAt() <= 25_000); } zones.add(c.safeLow());
        }
        assertEquals(Set.of(40, 45, 50, 55, 60, 65, 70, 75), zones); for (int f : faults) assertTrue(f > 1000);
        System.out.printf("broken valves: 5000 solvable; scripted solve avg %.1f s, slowest %.1f s; faults %s; surges %d%n", total / 5000 / 1000.0, slowest / 1000.0, Arrays.toString(faults), surges[0]);
    }
}
