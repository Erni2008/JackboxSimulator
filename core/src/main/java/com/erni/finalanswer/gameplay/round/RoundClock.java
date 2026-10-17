package com.erni.finalanswer.gameplay.round;

/** Presentation-independent elapsed time shared by introduction, countdown and result phases. */
public final class RoundClock {
    private double elapsed;
    public void reset() { elapsed = 0; }
    public void update(double delta) {
        if (!Double.isFinite(delta) || delta < 0) throw new IllegalArgumentException("Invalid delta");
        elapsed += delta;
    }
    public double elapsedSeconds() { return elapsed; }
}
