package com.erni.finalanswer.gameplay.round;

import com.erni.finalanswer.gameplay.questions.*;
import java.util.Objects;
import com.erni.finalanswer.gameplay.presentation.QuestionPresentationController;

/** Local host sequence. No scheduled callbacks can survive a round reset. */
public final class RoundController {
    private final QuestionPresentationController presentation = new QuestionPresentationController();
    private final QuestionSource source;
    private final RoundClock clock = new RoundClock();
    private final RoundTiming timing;
    private double forcedRevealAt = Double.NaN;
    private int index;

    public RoundController(QuestionSource source) {
        this(source, RoundTiming.STANDARD);
    }

    public RoundController(QuestionSource source, RoundTiming timing) {
        this.source = Objects.requireNonNull(source);
        this.timing = Objects.requireNonNull(timing);
        if (source.size() == 0) throw new IllegalArgumentException("Question source is empty");
        presentation.startQuestion(question());
    }
    private void reset() { clock.reset(); forcedRevealAt = Double.NaN; presentation.startQuestion(question()); }
    public void restart() { index = 0; reset(); }
    public void update(double delta) {
        clock.update(delta);
        presentation.update(delta);
        if (resultElapsedSeconds() >= 0) presentation.markResults();
    }
    public QuestionPresentationController presentation() { return presentation; }
    public Question question() { return source.get(index); }
    public int number() { return index + 1; }
    public double elapsedSeconds() { return clock.elapsedSeconds(); }
    public double answerProgress(int answer) {
        return presentation.answerProgress(answer);
    }
    public boolean canAdvance() { return elapsedSeconds() >= answeringStartsAt(); }
    public double answeringStartsAt() {
        return presentation.timerStartSeconds();
    }
    public double answerDurationSeconds() { return timing.answerSeconds(); }
    public double clockAnimationElapsedSeconds() {
        return phase() == RoundPhase.REVEAL
            ? timing.answerSeconds() + elapsedSeconds() - revealStartsAt()
            : Double.isFinite(answeringStartsAt()) ? elapsedSeconds() - answeringStartsAt() : -1;
    }
    private double revealStartsAt() {
        return Double.isNaN(forcedRevealAt)
            ? answeringStartsAt() + timing.answerSeconds() : forcedRevealAt;
    }
    public RoundPhase phase() {
        if (elapsedSeconds() >= revealStartsAt()) return RoundPhase.REVEAL;
        return elapsedSeconds() >= answeringStartsAt() ? RoundPhase.ANSWERING : RoundPhase.INTRODUCTION;
    }
    public double answerSecondsRemaining() {
        if (phase() == RoundPhase.REVEAL) return 0;
        return Math.max(0, Math.min(timing.answerSeconds(), revealStartsAt() - elapsedSeconds()));
    }
    public boolean revealAnswer() {
        if (phase() != RoundPhase.ANSWERING) return false;
        forcedRevealAt = elapsedSeconds();
        return true;
    }
    /** Negative until the clock has closed AND left the screen. Shared by UI and result transitions. */
    public double resultElapsedSeconds() {
        return elapsedSeconds() - revealStartsAt() - RoundTiming.CLOCK_EXIT_SECONDS;
    }
    public boolean revealComplete() {
        return resultElapsedSeconds() >= RoundTiming.CORRECT_GROW_SECONDS + timing.revealSeconds();
    }
    public float revealProgress() {
        return (float) Math.max(0, Math.min(1, resultElapsedSeconds() / RoundTiming.CORRECT_GROW_SECONDS));
    }
    public boolean next() {
        if (!canAdvance()) return false;
        index = (index + 1) % source.size();
        reset();
        return true;
    }
}
