package com.erni.finalanswer.gameplay.elevator;

import java.util.Random;

/**
 * THE BROKEN ELEVATOR — PRESSURE CONTROL. Deterministic, server-authoritative steam pressure simulation.
 *
 * <p>Pressure changes linearly at {@code (drift + intake + release) × stabilizer} PSI/s and is clamped to 0–120.
 * Time advances in fixed 10 ms quanta, so the result is identical however often {@link #advance(long)} is called
 * (frame-rate / tick-rate independent). Holding the pressure inside the safe zone for 3 continuous seconds wins;
 * the 45 s limit loses. There are no hidden rules, sequences or attempt limits.
 */
public final class PressurePuzzle {
    public static final double MAX_PSI = 120, CRITICAL_PSI = 110;
    public static final long LIMIT_MS = 45_000, HOLD_MS = 3_000, QUANTUM_MS = 10;
    /** PSI/s by valve position: intake CLOSED/HALF/OPEN, release CLOSED/HALF/OPEN. */
    static final double[] INTAKE = {0, 3, 7}, RELEASE = {0, -3, -7};
    public static final double STABILIZED_FACTOR = .25;
    static final double[] DRIFTS = {-1.5, -.75, .75, 1.5};
    static final int[] SAFE_LOW = {45, 50, 55, 60};
    public static final int SAFE_WIDTH = 10;

    public enum Valve { INTAKE(3), RELEASE(3), STABILIZER(2); public final int positions; Valve(int p) { positions = p; } }
    public enum Outcome { RUNNING, STABILIZED, FAILED }

    public record Config(long seed, double startPsi, int safeLow, int safeHigh, double drift, int intake, int release, int stabilizer) {}

    private final Config config;
    private final long startedAt;
    private long elapsed, holdMs, finishedAt = -1;
    private double pressure;
    private int intake, release, stabilizer;
    private Outcome outcome = Outcome.RUNNING;
    private long lastSeq = -1;
    /** server bookkeeping: repair reward granted once; last time this state was pushed to the player */
    public boolean rewarded; public long sentAt;

    public PressurePuzzle(Config config, long startedAt) {
        this.config = config; this.startedAt = startedAt; pressure = config.startPsi();
        intake = config.intake(); release = config.release(); stabilizer = config.stabilizer();
    }

    // ------------------------------------------------------------------ generation
    /** A random, validated puzzle: starts outside the zone, cannot be won idle, is solvable well inside the limit. */
    public static Config generate(long seed) {
        Random r = new Random(seed);
        for (int attempt = 0; ; attempt++) {
            int low = SAFE_LOW[r.nextInt(SAFE_LOW.length)], high = low + SAFE_WIDTH;
            double drift = DRIFTS[r.nextInt(DRIFTS.length)], start;
            do start = 20 + r.nextInt(81); while (start > low - 8 && start < high + 8);
            Config c = new Config(seed, start, low, high, drift, r.nextInt(3), r.nextInt(3), r.nextInt(2));
            if (validate(c)) return c;
            if (attempt > 500) throw new IllegalStateException("no valid pressure puzzle for seed " + seed);
        }
    }

    /** Rejects puzzles that win without interaction or that a reasonable player could not solve in time. */
    public static boolean validate(Config c) {
        if (c.startPsi() >= c.safeLow() && c.startPsi() <= c.safeHigh()) return false;
        PressurePuzzle idle = new PressurePuzzle(c, 0); idle.advance(LIMIT_MS);
        if (idle.outcome() == Outcome.STABILIZED) return false;
        return solveTime(c, 600) <= 30_000;
    }

    /** Time a simple human-like controller (reacting every {@code reactionMs}) needs to stabilize; MAX on failure. */
    public static long solveTime(Config c, long reactionMs) {
        PressurePuzzle p = new PressurePuzzle(c, 0); long t = 0, seq = 0;
        while (p.outcome() == Outcome.RUNNING && t < LIMIT_MS) {
            double mid = (c.safeLow() + c.safeHigh()) / 2.0, err = mid - p.pressure();
            int in, out, st;
            if (Math.abs(err) > 12) { in = err > 0 ? 2 : 0; out = err > 0 ? 0 : 2; st = 0; }
            else if (Math.abs(err) > 3) { in = err > 0 ? 1 : 0; out = err > 0 ? 0 : 1; st = 1; }
            else { in = 1; out = 1; st = 1; }
            p.set(Valve.INTAKE, in, seq++, t); p.set(Valve.RELEASE, out, seq++, t); p.set(Valve.STABILIZER, st, seq++, t);
            t += reactionMs; p.advance(t);
        }
        return p.outcome() == Outcome.STABILIZED ? p.finishedAt() - p.startedAt : Long.MAX_VALUE;
    }

    // ------------------------------------------------------------------ simulation
    public double rate() {
        return (config.drift() + INTAKE[intake] + RELEASE[release]) * (stabilizer == 1 ? STABILIZED_FACTOR : 1);
    }
    public boolean inZone() { return pressure >= config.safeLow() && pressure <= config.safeHigh(); }

    /** Advances to absolute server time {@code now} (ms) in fixed quanta; returns true if the outcome changed. */
    public boolean advance(long now) {
        if (outcome != Outcome.RUNNING) return false;
        long target = Math.min(now - startedAt, LIMIT_MS);
        while (elapsed + QUANTUM_MS <= target && outcome == Outcome.RUNNING) {
            pressure = Math.max(0, Math.min(MAX_PSI, pressure + rate() * QUANTUM_MS / 1000.0));
            elapsed += QUANTUM_MS;
            holdMs = inZone() ? holdMs + QUANTUM_MS : 0;
            if (holdMs >= HOLD_MS) { outcome = Outcome.STABILIZED; finishedAt = startedAt + elapsed; return true; }
        }
        if (elapsed >= LIMIT_MS && outcome == Outcome.RUNNING) { outcome = Outcome.FAILED; finishedAt = startedAt + LIMIT_MS; return true; }
        return false;
    }

    /**
     * Applies a valve request at server time {@code now}. Returns false (state unchanged) for a duplicate/stale
     * sequence number or after the puzzle ended; throws for an invalid valve position.
     */
    public boolean set(Valve valve, int position, long seq, long now) {
        if (position < 0 || position >= valve.positions) throw new IllegalArgumentException("invalid position " + position + " for " + valve);
        advance(now);
        if (outcome != Outcome.RUNNING || seq <= lastSeq) return false;
        lastSeq = seq;
        switch (valve) { case INTAKE -> intake = position; case RELEASE -> release = position; case STABILIZER -> stabilizer = position; }
        return true;
    }

    public Config config() { return config; }
    public double pressure() { return pressure; }
    public long holdMs() { return holdMs; }
    public long elapsed() { return elapsed; }
    public long startedAt() { return startedAt; }
    public long deadline() { return startedAt + LIMIT_MS; }
    public long finishedAt() { return finishedAt; }
    public long lastSeq() { return lastSeq; }
    public Outcome outcome() { return outcome; }
    public int position(Valve v) { return switch (v) { case INTAKE -> intake; case RELEASE -> release; case STABILIZER -> stabilizer; }; }
    public boolean critical() { return pressure >= CRITICAL_PSI; }
}
