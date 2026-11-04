package com.erni.finalanswer.gameplay.elevator;

/**
 * THE BROKEN ELEVATOR — THE BROKEN VALVES. Server-authoritative state and simulation of one player's machine.
 *
 * <p>Discrete controls: one red / blue turn changes pressure by 10 PSI (2 PSI with FINE CONTROL on), filtered through
 * the mechanical fault and the BYPASS lever; the CLAMP stops the L-03 leak; EMERGENCY RELEASE drops 20 PSI once; TEST
 * reveals every fault code after 1.5 s. Line noise kicks the pressure by 1–2 PSI every 0.5–2 s (seeded, so the server
 * and the solvability checker see the same kicks). Continuous effects (the L-03 leak) and the optional, telegraphed +10 PSI surge advance in fixed 10 ms quanta,
 * so the result never depends on how often {@link #advance(long)} is called. Success: pressure inside the 5 PSI green zone
 * for 1 continuous second while the system is in a safe state. Failure: 45 s timer, or 120 PSI.
 */
public final class PressurePuzzle {
    public static final double MAX_PSI = 120, COARSE = 10, FINE = 2, EMERGENCY = 20, SURGE = 10;
    public static final long LIMIT_MS = 45_000, VERIFY_MS = 1_000, DIAGNOSTIC_MS = 1_500, SURGE_WARNING_MS = 2_000, QUANTUM_MS = 10;

    public enum Outcome { RUNNING, STABILIZED, FAILED }
    public enum Action { RED, BLUE, FINE_ON, FINE_OFF, BYPASS_AUX, BYPASS_MAIN, DIAGNOSTIC, EMERGENCY, CLAMP }
    /** what an accepted action physically did (for valve resistance / steam feedback on the client) */
    public record Effect(long seq, Action action, double delta, boolean jammed) {}

    /** surgeAt &lt; 0: no surge; second: null or the other half of a fault pair; noise: line-noise kicks on/off */
    public record Config(long seed, int startPsi, int safeLow, Malfunction fault, Malfunction second, boolean fine, long surgeAt, boolean noise) {
        public Config(long seed, int startPsi, int safeLow, Malfunction fault, boolean fine, long surgeAt) { this(seed, startPsi, safeLow, fault, null, fine, surgeAt, false); }
        public int safeHigh() { return safeLow + 5; }
        public boolean has(Malfunction m) { return fault == m || second == m; }
        public Malfunction mechanical() { return fault.mechanical() ? fault : second != null && second.mechanical() ? second : null; }
        public String codes() { return java.util.stream.Stream.of(Malfunction.values()).filter(this::has).map(m -> m.code).collect(java.util.stream.Collectors.joining(" + ")); }
    }
    public static final long NOISE_MIN_MS = 500, NOISE_MAX_MS = 2_000;

    private final Config config;
    private final long startedAt;
    private long elapsed, verifyMs, finishedAt = -1, diagnosticAt = -1, lastSeq = -1;
    private double pressure;
    private boolean fine, bypass, emergencyUsed, diagnosed, surged, clamped;
    private final java.util.Random noise; private long nextNoise = -1, lastNoiseAt = -1; private double lastNoise;
    private Outcome outcome = Outcome.RUNNING;
    private String failReason = "";
    private Effect lastEffect;
    /** server bookkeeping: repair reward granted once; last push time */
    public boolean rewarded; public long sentAt;

    public PressurePuzzle(Config config, long startedAt) {
        this.config = config; this.startedAt = startedAt; pressure = config.startPsi(); fine = config.fine();
        noise = new java.util.Random(config.seed() * 31 + 7); if (config.noise()) nextNoise = noiseGap();
    }

    // ------------------------------------------------------------------ simulation
    private long noiseGap() { return NOISE_MIN_MS + noise.nextInt((int) ((NOISE_MAX_MS - NOISE_MIN_MS) / QUANTUM_MS) + 1) * QUANTUM_MS; }
    public boolean inZone() { return pressure >= config.safeLow() && pressure <= config.safeHigh(); }
    public boolean leaking() { return config.has(Malfunction.L03) && !clamped; }
    public boolean safeState() { return !leaking(); }
    public double drift() { return leaking() ? -Malfunction.LEAK_PSI_PER_S : 0; }
    private double red(double step) { var m = config.mechanical(); return m == Malfunction.R02 ? (bypass ? step : 0) : m == Malfunction.F01 ? (bypass ? step : -step) : step; }
    private double blue(double step) { var m = config.mechanical(); return m == Malfunction.B04 ? (bypass ? -step : 0) : m == Malfunction.F01 ? (bypass ? -step : step) : -step; }
    private boolean jammed(boolean red) { var m = config.mechanical(); return !bypass && m == (red ? Malfunction.R02 : Malfunction.B04); }
    public boolean surgeWarning() { return config.surgeAt() >= 0 && !surged && outcome == Outcome.RUNNING && elapsed >= config.surgeAt() - SURGE_WARNING_MS; }

    /** Advances to absolute time {@code now}; true if the outcome changed. */
    public boolean advance(long now) {
        if (outcome != Outcome.RUNNING) return false;
        long target = Math.min(now - startedAt, LIMIT_MS);
        while (elapsed + QUANTUM_MS <= target && outcome == Outcome.RUNNING) {
            elapsed += QUANTUM_MS;
            pressure = Math.max(0, pressure + drift() * QUANTUM_MS / 1000.0);
            if (!surged && config.surgeAt() >= 0 && elapsed >= config.surgeAt()) { surged = true; pressure += SURGE; if (critical()) return true; }
            if (nextNoise >= 0 && elapsed >= nextNoise) { lastNoise = (noise.nextBoolean() ? 1 : -1) * (1 + noise.nextInt(2)); pressure = Math.max(0, pressure + lastNoise); lastNoiseAt = elapsed; nextNoise = elapsed + noiseGap(); if (critical()) return true; }
            if (diagnosticAt >= 0 && elapsed >= diagnosticAt + DIAGNOSTIC_MS) diagnosed = true;
            verifyMs = inZone() && safeState() ? verifyMs + QUANTUM_MS : 0;
            if (verifyMs >= VERIFY_MS) { outcome = Outcome.STABILIZED; finishedAt = startedAt + elapsed; return true; }
        }
        if (elapsed >= LIMIT_MS && outcome == Outcome.RUNNING) { outcome = Outcome.FAILED; failReason = "TIMEOUT"; finishedAt = startedAt + LIMIT_MS; return true; }
        return false;
    }
    private boolean critical() {
        if (pressure < MAX_PSI) return false;
        pressure = MAX_PSI; outcome = Outcome.FAILED; failReason = "CRITICAL"; finishedAt = startedAt + elapsed; return true;
    }

    /**
     * Applies one player action at server time {@code now}. Returns false for a duplicate / stale sequence number or an
     * ended puzzle; throws {@link IllegalStateException} for a rule violation (second EMERGENCY RELEASE).
     */
    public boolean apply(Action action, long seq, long now) {
        advance(now);
        if (outcome != Outcome.RUNNING || seq <= lastSeq) return false;
        if (action == Action.EMERGENCY && emergencyUsed) throw new IllegalStateException("EMERGENCY_USED");
        lastSeq = seq;
        double step = fine ? FINE : COARSE, before = pressure; boolean jam = false;
        switch (action) {
            case RED -> { jam = jammed(true); pressure += red(step); }
            case BLUE -> { jam = jammed(false); pressure += blue(step); }
            case CLAMP -> clamped = true;
            case FINE_ON -> fine = true;
            case FINE_OFF -> fine = false;
            case BYPASS_AUX -> bypass = true;
            case BYPASS_MAIN -> bypass = false;
            case DIAGNOSTIC -> diagnosticAt = elapsed;
            case EMERGENCY -> { emergencyUsed = true; pressure -= EMERGENCY; }
        }
        pressure = Math.max(0, pressure);
        if (pressure != before) verifyMs = 0; // a step re-starts the stability check
        lastEffect = new Effect(seq, action, pressure - before, jam);
        critical();
        return true;
    }

    // ------------------------------------------------------------------ accessors
    public Config config() { return config; }
    public double pressure() { return pressure; }
    public long elapsed() { return elapsed; }
    public long startedAt() { return startedAt; }
    public long deadline() { return startedAt + LIMIT_MS; }
    public long finishedAt() { return finishedAt; }
    public long verifyMs() { return verifyMs; }
    public long lastSeq() { return lastSeq; }
    public boolean fine() { return fine; }
    public boolean bypass() { return bypass; }
    public boolean emergencyUsed() { return emergencyUsed; }
    public boolean diagnosed() { return diagnosed; }
    /** relay animation running */
    public boolean diagnosing() { return diagnosticAt >= 0 && elapsed < diagnosticAt + DIAGNOSTIC_MS; }
    public long diagnosticReadyAt() { return diagnosticAt < 0 ? -1 : startedAt + diagnosticAt + DIAGNOSTIC_MS; }
    /** the fault code — only once a TEST has completed */
    public String code() { return diagnosed ? config.codes() : ""; }
    public boolean clamped() { return clamped; }
    /** absolute time of the latest line-noise kick (-1 none) and its size */
    public long lastNoiseAt() { return lastNoiseAt < 0 ? -1 : startedAt + lastNoiseAt; }
    public double lastNoise() { return lastNoise; }
    public boolean surged() { return surged; }
    /** absolute time of the pending surge, -1 when none is pending */
    public long surgeAt() { return config.surgeAt() < 0 || surged || outcome != Outcome.RUNNING ? -1 : startedAt + config.surgeAt(); }
    public Outcome outcome() { return outcome; }
    public String failReason() { return failReason; }
    public Effect lastEffect() { return lastEffect; }
}
