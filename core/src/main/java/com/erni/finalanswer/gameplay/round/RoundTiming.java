package com.erni.finalanswer.gameplay.round;

/** Configurable answer time and hold AFTER the correct answer finishes growing. */
public record RoundTiming(double answerSeconds, double revealSeconds) {
    public static final double CHARACTER_SECONDS = 0.04;
    public static final double WRONG_FADE_SECONDS = .30, CORRECT_GROW_SECONDS = .60;
    /**
     * Results choreography: the host says «Правильный ответ…» (HOST_LINE), the wrong options fade away, the correct one
     * punches up with a short overshoot, then the ticks and crosses appear under the players one after another.
     */
    public static final double HOST_LINE_SECONDS = 1.15, PUNCH_SECONDS = .30, MARK_STAGGER_SECONDS = .08,
        MARKS_START_SECONDS = HOST_LINE_SECONDS + WRONG_FADE_SECONDS + PUNCH_SECONDS;
    /** Scale curve of the correct option: 0 → 1.12 fast, then settles to 1 (multiplies CORRECT_SCALE-1). */
    public static float punch(double t) {
        if (t <= 0) return 0;
        if (t < .16) { double k = 1 - t / .16; return (float) ((1 - k * k * k) * 1.12); }
        if (t < PUNCH_SECONDS) { double u = (t - .16) / (PUNCH_SECONDS - .16); u = u * u * (3 - 2 * u); return (float) (1.12 - .12 * u); }
        return 1;
    }
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
