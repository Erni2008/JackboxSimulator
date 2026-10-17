package com.erni.finalanswer.gameplay.clock;

/** GPU-independent animation time. Positive dial angles are measured clockwise from XII. */
public final class ClockTimeline {
    public enum State { WAITING, RUNNING, CLOSING, FALLING, FINISHED }
    public static final double CLOSING_SECONDS = .2;
    public static final double CLOSED_HOLD_SECONDS = .1;
    public static final double FALL_SECONDS = .42;
    private final double duration;
    private double elapsed;
    private boolean started, paused;

    public ClockTimeline() { this(20); }
    public ClockTimeline(double duration) {
        if (!Double.isFinite(duration) || duration <= 0) throw new IllegalArgumentException("Invalid clock duration");
        this.duration = duration;
    }
    public void reset() { elapsed = 0; started = false; paused = false; }
    public void start() { if (!started) { started = true; elapsed = 0; } }
    public void setPaused(boolean value) { paused = value; }
    public void update(double delta) {
        if (!Double.isFinite(delta) || delta < 0) throw new IllegalArgumentException("Invalid delta");
        if (started && !paused) elapsed += delta;
    }
    /** Host synchronization avoids a second independent countdown and cumulative drift. */
    public void synchronize(double elapsed) {
        if (!Double.isFinite(elapsed) || elapsed < 0) throw new IllegalArgumentException("Invalid elapsed time");
        if (paused) return;
        started = true;
        this.elapsed = elapsed;
    }
    public State state() {
        if (!started) return State.WAITING;
        if (elapsed < duration) return State.RUNNING;
        if (elapsed < duration + CLOSING_SECONDS + CLOSED_HOLD_SECONDS) return State.CLOSING;
        if (elapsed < duration + CLOSING_SECONDS + CLOSED_HOLD_SECONDS + FALL_SECONDS) return State.FALLING;
        return State.FINISHED;
    }
    public double remainingSeconds() { return Math.max(0, duration - elapsed); }
    public float angleDegrees() { return (float) (remainingSeconds() / duration * 120); }
    public float closingProgress() { return (float) Math.max(0, Math.min(1, (elapsed - duration) / CLOSING_SECONDS)); }
    public float fallingProgress() {
        return (float) Math.max(0, Math.min(1,
            (elapsed - duration - CLOSING_SECONDS - CLOSED_HOLD_SECONDS) / FALL_SECONDS));
    }
}
