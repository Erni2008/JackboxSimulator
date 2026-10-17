package com.erni.finalanswer.gameplay.round;

/** Configurable answer time and hold AFTER the correct answer finishes growing. */
public record RoundTiming(double answerSeconds, double revealSeconds) {
    public static final double CHARACTER_SECONDS = 0.04;
    public static final double WRONG_FADE_SECONDS = .30, CORRECT_GROW_SECONDS = .60;
    public static final double CLOCK_EXIT_SECONDS =
        com.erni.finalanswer.gameplay.clock.ClockTimeline.CLOSING_SECONDS
        + com.erni.finalanswer.gameplay.clock.ClockTimeline.CLOSED_HOLD_SECONDS
        + com.erni.finalanswer.gameplay.clock.ClockTimeline.FALL_SECONDS;
    public static final RoundTiming STANDARD = new RoundTiming(20, 2.5);

    public RoundTiming {
        if (!Double.isFinite(answerSeconds) || answerSeconds <= 0
                || !Double.isFinite(revealSeconds) || revealSeconds < 0)
            throw new IllegalArgumentException("Invalid round timing");
    }
}
