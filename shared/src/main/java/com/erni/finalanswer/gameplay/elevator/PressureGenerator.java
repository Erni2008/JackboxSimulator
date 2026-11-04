package com.erni.finalanswer.gameplay.elevator;

import com.erni.finalanswer.gameplay.elevator.PressurePuzzle.*;
import java.util.Random;

/** THE BROKEN VALVES — random puzzle generation with a solvability check. */
public final class PressureGenerator {
    private PressureGenerator() {}
    static final int[] SAFE_LOW = {40, 45, 50, 55, 60, 65, 70, 75};

    /** A random puzzle that starts outside the zone, cannot be won idle, and a normal player solves in about 15–30 s. */
    public static Config generate(long seed) {
        Random r = new Random(seed);
        for (int attempt = 0; attempt < 1000; attempt++) {
            int low = SAFE_LOW[r.nextInt(SAFE_LOW.length)], start;
            do start = 10 + r.nextInt(91); while (start > low - 6 && start < low + 5 + 6);
            Malfunction fault = Malfunction.values()[r.nextInt(4)];
            // half the machines carry a fault pair: one mechanical fault + the leak
            Malfunction second = r.nextBoolean() ? (fault == Malfunction.L03 ? Malfunction.values()[r.nextInt(3)] : Malfunction.L03) : null;
            long surge = r.nextInt(10) < 6 ? 15_000 + r.nextInt(1001) * 10L : -1;
            Config c = new Config(seed * 1_000 + attempt, start, low, fault, second, r.nextBoolean(), surge, true);
            if (validate(c)) return c;
        }
        throw new IllegalStateException("no valid pressure puzzle for seed " + seed);
    }

    public static boolean validate(Config c) {
        if (c.startPsi() >= c.safeLow() && c.startPsi() <= c.safeHigh()) return false;
        PressurePuzzle idle = new PressurePuzzle(c, 0); idle.advance(PressurePuzzle.LIMIT_MS);
        if (idle.outcome() == Outcome.STABILIZED) return false;
        return solveTime(c, 600, 2_500) <= 30_000 && solveTime(c, 1_000, 4_000) <= PressurePuzzle.LIMIT_MS;
    }

    /**
     * Time a human-like player needs: presses TEST, waits for the code plus {@code readMs} to look it up in the manual,
     * throws BYPASS for a mechanical fault, fits the CLAMP for a leak, then steers with coarse and fine turns, one action every {@code reactionMs}. MAX on failure.
     */
    public static long solveTime(Config c, long reactionMs, long readMs) {
        PressurePuzzle p = new PressurePuzzle(c, 0); long t = 0, seq = 0;
        p.apply(Action.DIAGNOSTIC, seq++, t);
        long readyAt = PressurePuzzle.DIAGNOSTIC_MS + readMs;
        while (p.outcome() == Outcome.RUNNING && t < PressurePuzzle.LIMIT_MS) {
            t += reactionMs; p.advance(t); if (p.outcome() != Outcome.RUNNING) break;
            if (t < readyAt) continue;
            if (c.mechanical() != null && !p.bypass()) { p.apply(Action.BYPASS_AUX, seq++, t); continue; }
            if (c.has(Malfunction.L03) && !p.clamped()) { p.apply(Action.CLAMP, seq++, t); continue; }
            double mid = c.safeLow() + 2.5, err = mid - p.pressure(), a = Math.abs(err);
            Action next = null;
            if (a > 6) next = p.fine() ? Action.FINE_OFF : err > 0 ? Action.RED : Action.BLUE;
            else if (a > 1.5) next = !p.fine() ? Action.FINE_ON : err > 0 ? Action.RED : Action.BLUE;
            if (next != null) p.apply(next, seq++, t);
        }
        return p.outcome() == Outcome.STABILIZED ? p.finishedAt() : Long.MAX_VALUE;
    }
}
