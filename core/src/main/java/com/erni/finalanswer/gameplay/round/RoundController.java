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
    private Question networkQuestion;
    private double networkAnswerStart = Double.POSITIVE_INFINITY;
    private boolean networkEnded;

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
    public Question question() { return networkQuestion == null ? source.get(index) : networkQuestion; }
    public boolean networked() { return networkQuestion != null; }
    public void startNetworkQuestion(Question question, int number) {
        networkQuestion = Objects.requireNonNull(question);
        index = number - 1;
        networkAnswerStart = Double.POSITIVE_INFINITY;
        networkEnded = false;
        reset();
    }
    /** On reconnect, restore a completed presentation instead of replaying it over an active timer. */
    public void restoreNetworkPresentation() {
        if (!networked()) return;
        update(presentation.typingEndSeconds());
        update(Math.max(0, presentation.timerStartSeconds() - elapsedSeconds()));
    }
    public void synchronizeNetworkAnswer(double elapsed, boolean ended, int correctIndex) {
        if (!networked()) return;
        networkAnswerStart = elapsedSeconds() - elapsed;
        networkEnded = ended;
        forcedRevealAt = ended ? networkAnswerStart + timing.answerSeconds() : Double.NaN;
        if (correctIndex >= 0 && correctIndex < 4 && networkQuestion.correctAnswerIndex() != correctIndex)
            networkQuestion = new Question(networkQuestion.id(), networkQuestion.text(), networkQuestion.answers(), correctIndex);
    }
    public int number() { return index + 1; }
    public double elapsedSeconds() { return clock.elapsedSeconds(); }
    public double answerProgress(int answer) {
        return presentation.answerProgress(answer);
    }
    public boolean canAdvance() { return !networked() && elapsedSeconds() >= answeringStartsAt(); }
    public double answeringStartsAt() {
        return networked() ? networkAnswerStart : presentation.timerStartSeconds();
    }
    public double answerDurationSeconds() { return timing.answerSeconds(); }
    public double clockAnimationElapsedSeconds() {
        if (networked() && !networkEnded)
            return Double.isFinite(networkAnswerStart) ? Math.min(timing.answerSeconds(), elapsedSeconds() - networkAnswerStart) : -1;
        return phase() == RoundPhase.REVEAL
            ? timing.answerSeconds() + elapsedSeconds() - revealStartsAt()
            : Double.isFinite(answeringStartsAt()) ? elapsedSeconds() - answeringStartsAt() : -1;
    }
    private double revealStartsAt() {
        return Double.isNaN(forcedRevealAt)
            ? answeringStartsAt() + timing.answerSeconds() : forcedRevealAt;
    }
    public RoundPhase phase() {
        if (networked() && !networkEnded) return Double.isFinite(networkAnswerStart) ? RoundPhase.ANSWERING : RoundPhase.INTRODUCTION;
        if (elapsedSeconds() >= revealStartsAt()) return RoundPhase.REVEAL;
        return elapsedSeconds() >= answeringStartsAt() ? RoundPhase.ANSWERING : RoundPhase.INTRODUCTION;
    }
    public double answerSecondsRemaining() {
        if (phase() == RoundPhase.REVEAL) return 0;
        return Math.max(0, Math.min(timing.answerSeconds(), revealStartsAt() - elapsedSeconds()));
    }
    public boolean revealAnswer() {
        if (networked()) return false;
        if (phase() != RoundPhase.ANSWERING) return false;
        forcedRevealAt = elapsedSeconds();
        return true;
    }
    /** Negative until the clock has closed AND left the screen. Shared by UI and result transitions. */
    public double resultElapsedSeconds() {
        if (networked() && (!networkEnded || networkQuestion.correctAnswerIndex() < 0)) return -1;
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
