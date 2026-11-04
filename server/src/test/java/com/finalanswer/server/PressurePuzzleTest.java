package com.finalanswer.server;

import com.erni.finalanswer.gameplay.elevator.PressurePuzzle;
import com.erni.finalanswer.gameplay.elevator.PressurePuzzle.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/** THE BROKEN ELEVATOR — PRESSURE CONTROL simulation rules. */
class PressurePuzzleTest {
    /** start below the zone, drift +0.75, all valves closed / stabilizer off */
    static Config cfg(double start, double drift) { return new Config(1, start, 55, 65, drift, 0, 0, 0); }

    @Test void intakeIncreasesPressure() {
        var p = new PressurePuzzle(cfg(30, -.75), 0); p.set(Valve.INTAKE, 2, 1, 0); p.advance(1000);
        assertEquals(30 + 7 - .75, p.pressure(), 1e-6);
    }
    @Test void releaseDecreasesPressure() {
        var p = new PressurePuzzle(cfg(90, .75), 0); p.set(Valve.RELEASE, 2, 1, 0); p.advance(1000);
        assertEquals(90 - 7 + .75, p.pressure(), 1e-6);
    }
    @Test void stabilizerSlowsChangesWithoutFreezing() {
        var a = new PressurePuzzle(cfg(30, .75), 0); a.set(Valve.INTAKE, 2, 1, 0); a.advance(2000);
        var b = new PressurePuzzle(cfg(30, .75), 0); b.set(Valve.INTAKE, 2, 1, 0); b.set(Valve.STABILIZER, 1, 2, 0); b.advance(2000);
        double da = a.pressure() - 30, db = b.pressure() - 30;
        assertEquals(da * PressurePuzzle.STABILIZED_FACTOR, db, 1e-6); assertTrue(db > 0);
    }
    @Test void frameRateIndependent() {
        var c = PressurePuzzle.generate(42);
        var coarse = new PressurePuzzle(c, 0); var fine = new PressurePuzzle(c, 0);
        coarse.set(Valve.INTAKE, 1, 1, 0); fine.set(Valve.INTAKE, 1, 1, 0);
        coarse.advance(7_000);
        for (long t = 0; t <= 7_000; t += 3 + (t % 17)) fine.advance(t); fine.advance(7_000);
        assertEquals(coarse.pressure(), fine.pressure(), 1e-9); assertEquals(coarse.holdMs(), fine.holdMs());
    }
    @Test void pressureStaysWithinBounds() {
        var hi = new PressurePuzzle(cfg(100, 1.5), 0); hi.set(Valve.INTAKE, 2, 1, 0); hi.advance(40_000); assertEquals(PressurePuzzle.MAX_PSI, hi.pressure(), 1e-9); assertTrue(hi.critical());
        var lo = new PressurePuzzle(cfg(20, -1.5), 0); lo.set(Valve.RELEASE, 2, 1, 0); lo.advance(40_000); assertEquals(0, lo.pressure(), 1e-9);
    }
    @Test void safeZoneDetection() {
        var p = new PressurePuzzle(new Config(1, 55, 55, 65, 0.75, 0, 0, 0), 0); assertTrue(p.inZone());
        var q = new PressurePuzzle(new Config(1, 54.9, 55, 65, 0.75, 0, 0, 0), 0); assertFalse(q.inZone());
        var r = new PressurePuzzle(new Config(1, 65.1, 55, 65, 0.75, 0, 0, 0), 0); assertFalse(r.inZone());
    }
    @Test void stabilizationStartsInsideAndResetsOutside() {
        var p = new PressurePuzzle(cfg(50, .75), 0); p.set(Valve.INTAKE, 2, 1, 0);
        p.advance(1500); assertTrue(p.inZone()); assertTrue(p.holdMs() > 0, "hold starts inside");
        p.advance(3000); assertFalse(p.inZone()); assertEquals(0, p.holdMs(), "hold resets after leaving");
        assertEquals(Outcome.RUNNING, p.outcome());
    }
    @Test void continuousHoldSucceeds() {
        // 54 PSI + 0.75*0.25 PSI/s: enters at ~1.33 s (stabilizer on) ... use a balanced setup
        var p = new PressurePuzzle(new Config(1, 50, 55, 65, .75, 0, 0, 0), 0);
        p.set(Valve.INTAKE, 2, 1, 0); p.advance(1100); // ~58.4 PSI, inside
        p.set(Valve.RELEASE, 2, 2, 1100); p.set(Valve.STABILIZER, 1, 3, 1100); // net +0.1875 PSI/s
        p.advance(2600); assertEquals(Outcome.RUNNING, p.outcome());
        p.advance(2700); assertEquals(Outcome.STABILIZED, p.outcome());
        assertTrue(p.finishedAt() >= PressurePuzzle.HOLD_MS);
        assertFalse(p.set(Valve.INTAKE, 0, 9, 5000), "no input after the end");
    }
    @Test void timerExpiryFails() {
        var p = new PressurePuzzle(cfg(20, -1.5), 1_000); long end = 1_000 + PressurePuzzle.LIMIT_MS; p.advance(end - 1); assertEquals(Outcome.RUNNING, p.outcome());
        assertTrue(p.advance(end)); assertEquals(Outcome.FAILED, p.outcome()); assertEquals(end, p.finishedAt());
        assertFalse(p.set(Valve.INTAKE, 2, 1, end + 1000));
    }
    @Test void thousandGeneratedPuzzlesAreValidAndSolvable() {
        int slowest = 0;
        for (long seed = 1; seed <= 1000; seed++) {
            var c = PressurePuzzle.generate(seed);
            assertFalse(c.startPsi() >= c.safeLow() && c.startPsi() <= c.safeHigh(), "starts outside the zone");
            assertTrue(c.startPsi() >= 20 && c.startPsi() <= 100);
            var idle = new PressurePuzzle(c, 0); idle.advance(PressurePuzzle.LIMIT_MS); assertNotEquals(Outcome.STABILIZED, idle.outcome(), "cannot win idle, seed " + seed);
            long t = PressurePuzzle.solveTime(c, 600); assertTrue(t <= 35_000, "solvable in time, seed " + seed + ": " + t);
            assertTrue(PressurePuzzle.solveTime(c, 1200) <= PressurePuzzle.LIMIT_MS, "solvable even with slow reactions, seed " + seed);
            slowest = (int) Math.max(slowest, t);
        }
        System.out.println("pressure puzzles: 1000 valid, slowest scripted solve " + slowest + " ms");
    }
    @Test void invalidValvePositionsAreRejected() {
        var p = new PressurePuzzle(cfg(30, .75), 0);
        assertThrows(IllegalArgumentException.class, () -> p.set(Valve.INTAKE, 3, 1, 0));
        assertThrows(IllegalArgumentException.class, () -> p.set(Valve.STABILIZER, 2, 1, 0));
        assertThrows(IllegalArgumentException.class, () -> p.set(Valve.RELEASE, -1, 1, 0));
    }
    @Test void duplicateRequestsAreIgnored() {
        var p = new PressurePuzzle(cfg(30, .75), 0);
        assertTrue(p.set(Valve.INTAKE, 2, 5, 0));
        assertFalse(p.set(Valve.INTAKE, 0, 5, 100), "same sequence replayed");
        assertFalse(p.set(Valve.INTAKE, 0, 4, 100), "stale sequence");
        assertEquals(2, p.position(Valve.INTAKE));
    }
}
