package com.erni.finalanswer.gameplay.presentation;

import com.erni.finalanswer.gameplay.questions.Question;
import java.util.Objects;
import java.util.function.Consumer;

/** Deterministic presentation timeline. Audio callbacks must be delivered on the render thread. */
public final class QuestionPresentationController {
    public enum State { IDLE, QUESTION_TYPING, QUESTION_WAITING, QUESTION_MOVING, ANSWERS_APPEARING, ANSWERING, RESULTS }
    public enum EventType { QUESTION_STARTED, QUESTION_VOICE_STARTED, QUESTION_VOICE_FINISHED,
        QUESTION_MOVE_STARTED, QUESTION_MOVE_FINISHED, ANSWERS_REVEAL_STARTED, ANSWERS_REVEAL_FINISHED, TIMER_STARTED }
    public record Event(EventType type, String questionId, long generation, double seconds) {}
    public static final double CHARACTER_DELAY = .035, CHARACTER_APPEAR = .14, STABILIZE_SECONDS = .15;
    public static final double VOICE_HOLD_SECONDS = 2, MOVE_SECONDS = .75;
    public static final double ANSWER_STAGGER = .18, ANSWER_APPEAR = .35;
    public static final double VOICE_TIMEOUT_SECONDS = 60;
    private Consumer<Event> listener = event -> {};
    private final java.util.List<Consumer<Event>> subscribers = new java.util.ArrayList<>();
    private Question question;
    private long generation;
    private double elapsed, typingEnd, voiceEnd = Double.NaN, voiceStart;
    private boolean externalVoice, voiceStarted, moveStarted, moveFinished, answersStarted, answersFinished, results;

    public void setListener(Consumer<Event> listener) { this.listener = Objects.requireNonNull(listener); }
    public void addListener(Consumer<Event> listener) { subscribers.add(Objects.requireNonNull(listener)); }
    public void useExternalVoice(boolean value) { externalVoice = value; }
    public void startQuestion(Question value) {
        reset();
        question = Objects.requireNonNull(value);
        int count = value.text().codePointCount(0, value.text().length());
        typingEnd = Math.max(0, count - 1) * CHARACTER_DELAY + CHARACTER_APPEAR + STABILIZE_SECONDS;
        emit(EventType.QUESTION_STARTED, 0);
        if (!externalVoice) onVoiceStarted(generation);
    }
    public void reset() {
        generation++;
        question = null; elapsed = 0; typingEnd = 0; voiceEnd = Double.NaN; voiceStart = 0;
        voiceStarted = moveStarted = moveFinished = answersStarted = answersFinished = results = false;
    }
    public long generation() { return generation; }
    public void onVoiceStarted(long token) {
        if (question == null || token != generation || voiceStarted || !Double.isNaN(voiceEnd)) return;
        voiceStarted = true; voiceStart = elapsed;
        emit(EventType.QUESTION_VOICE_STARTED, elapsed);
    }
    public void onVoiceFinished() { onVoiceFinished(generation); }
    public void onVoiceFinished(long token) {
        if (question == null || token != generation || !Double.isNaN(voiceEnd)) return;
        onVoiceStarted(token);
        voiceEnd = elapsed;
        emit(EventType.QUESTION_VOICE_FINISHED, voiceEnd);
        dispatch();
    }
    public void update(double delta) {
        if (!Double.isFinite(delta) || delta < 0) throw new IllegalArgumentException("Invalid delta");
        if (question == null) return;
        elapsed += delta;
        if (Double.isNaN(voiceEnd)) {
            double fallbackAt = externalVoice ? Math.max(typingEnd, voiceStart + VOICE_TIMEOUT_SECONDS) : typingEnd;
            if (elapsed >= fallbackAt) {
                if (!voiceStarted) { voiceStarted = true; emit(EventType.QUESTION_VOICE_STARTED, fallbackAt); }
                voiceEnd = fallbackAt;
                emit(EventType.QUESTION_VOICE_FINISHED, voiceEnd);
            }
        }
        dispatch();
    }
    private void dispatch() {
        if (!moveStarted && elapsed >= moveStartsAt()) { moveStarted = true; emit(EventType.QUESTION_MOVE_STARTED, moveStartsAt()); }
        if (!moveFinished && elapsed >= answersStartSeconds()) { moveFinished = true; emit(EventType.QUESTION_MOVE_FINISHED, answersStartSeconds()); }
        if (!answersStarted && elapsed >= answersStartSeconds()) { answersStarted = true; emit(EventType.ANSWERS_REVEAL_STARTED, answersStartSeconds()); }
        if (!answersFinished && elapsed >= timerStartSeconds()) {
            answersFinished = true;
            emit(EventType.ANSWERS_REVEAL_FINISHED, timerStartSeconds());
            emit(EventType.TIMER_STARTED, timerStartSeconds());
        }
    }
    private void emit(EventType type, double time) {
        Event event = new Event(type, question.id(), generation, time);
        for (Consumer<Event> subscriber : subscribers) subscriber.accept(event);
        listener.accept(event);
    }
    public double elapsedSeconds() { return elapsed; }
    public double typingEndSeconds() { return typingEnd; }
    public double moveStartsAt() { return Double.isNaN(voiceEnd) ? Double.POSITIVE_INFINITY : Math.max(typingEnd, voiceEnd + VOICE_HOLD_SECONDS); }
    public double answersStartSeconds() { return moveStartsAt() + MOVE_SECONDS; }
    public double timerStartSeconds() { return answersStartSeconds() + 3 * ANSWER_STAGGER + ANSWER_APPEAR; }
    public float moveProgress() { return (float) Math.max(0, Math.min(1, (elapsed - moveStartsAt()) / MOVE_SECONDS)); }
    public float answerProgress(int index) {
        if (index < 0 || index >= 4) throw new IllegalArgumentException("Invalid answer index");
        return (float) Math.max(0, Math.min(1, (elapsed - answersStartSeconds() - index * ANSWER_STAGGER) / ANSWER_APPEAR));
    }
    public void markResults() { results = true; }
    public State state() {
        if (question == null) return State.IDLE;
        if (results) return State.RESULTS;
        if (elapsed < typingEnd) return State.QUESTION_TYPING;
        if (elapsed < moveStartsAt()) return State.QUESTION_WAITING;
        if (elapsed < answersStartSeconds()) return State.QUESTION_MOVING;
        if (elapsed < timerStartSeconds()) return State.ANSWERS_APPEARING;
        return State.ANSWERING;
    }
}
