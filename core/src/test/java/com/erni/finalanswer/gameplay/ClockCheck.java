package com.erni.finalanswer.gameplay;

import com.erni.finalanswer.gameplay.clock.ClockTimeline;
import com.erni.finalanswer.gameplay.round.RoundController;
import com.erni.finalanswer.gameplay.questions.DemoQuestionSource;

public final class ClockCheck {
    private static void check(boolean value, String message) { if (!value) throw new AssertionError(message); }
    private static void near(double expected, double actual, String message) { check(Math.abs(expected - actual) < .0001, message); }
    public static void main(String[] args) {
        var clock = new ClockTimeline();
        check(clock.state() == ClockTimeline.State.WAITING, "Initially waiting");
        clock.update(5); near(120, clock.angleDegrees(), "Waiting hand at IV");
        clock.start();
        for (int seconds = 0; seconds <= 20; seconds++) {
            near((20 - seconds) * 6, clock.angleDegrees(), "Hand and sector angle at second " + seconds);
            if (seconds < 20) clock.update(1);
        }
        check(clock.state() == ClockTimeline.State.CLOSING, "Close at exactly 20 seconds");
        near(0, clock.remainingSeconds(), "No remaining time");
        clock.synchronize(20.199); check(clock.closingProgress() < 1, "Still closing before 200ms");
        clock.synchronize(20.2); near(1, clock.closingProgress(), "Closure ends after 200ms");
        check(clock.state() == ClockTimeline.State.CLOSING, "100ms closed hold");
        clock.synchronize(20.31); check(clock.state() == ClockTimeline.State.FALLING, "Fall follows closure");
        clock.synchronize(20.73); check(clock.state() == ClockTimeline.State.FINISHED, "Fall completes offscreen");
        near(0, clock.angleDegrees(), "Hand stays at XII after timer ends");
        clock.reset(); clock.start(); clock.update(.5);
        near(117, clock.angleDegrees(), "Smooth subsecond motion, no one-second steps");
        clock.setPaused(true); clock.update(10); clock.synchronize(10);
        near(117, clock.angleDegrees(), "Pause freezes both update and synchronization");
        clock.setPaused(false); clock.update(.5); near(114, clock.angleDegrees(), "Resume continues without jump");
        clock.reset(); check(clock.state() == ClockTimeline.State.WAITING, "Reset opens clock");
        near(120, clock.angleDegrees(), "Reset restores full sector");
        var custom = new ClockTimeline(10); custom.start(); custom.update(5);
        near(60, custom.angleDegrees(), "Custom durations still travel only 120 degrees");
        var round = new RoundController(new DemoQuestionSource());
        round.update(round.presentation().typingEndSeconds());
        round.update(round.answeringStartsAt() - round.elapsedSeconds() - .01);
        check(round.clockAnimationElapsedSeconds() < 0, "Do not start before final answer fade");
        round.update(.02); near(.01, round.clockAnimationElapsedSeconds(), "Same round clock starts countdown");
        round.revealAnswer(); near(20, round.clockAnimationElapsedSeconds(), "Manual end clamps hand to XII");
        round.update(.5); near(20.5, round.clockAnimationElapsedSeconds(), "Closure follows shared time");
        round.next(); check(round.clockAnimationElapsedSeconds() < 0, "New question returns to waiting");
        System.out.println("PASS: IV/III/II/I/XII, smooth 120-degree travel, closure/hold/fall, pause, reset and round synchronization");
    }
}
