package com.erni.finalanswer.gameplay;

import com.erni.finalanswer.gameplay.questions.*;
import com.erni.finalanswer.gameplay.round.*;
import com.erni.finalanswer.gameplay.presentation.QuestionPresentationController;
import com.erni.finalanswer.gameplay.presentation.QuestionPresentationController.*;
import java.util.*;

public final class RoundCheck {
    private static void check(boolean value, String message) { if (!value) throw new AssertionError(message); }
    public static void main(String[] args) {
        var source = new DemoQuestionSource();
        var presentation = new QuestionPresentationController();
        var events = new ArrayList<Event>(); presentation.setListener(events::add);
        var subscriberEvents = new ArrayList<Event>(); presentation.addListener(subscriberEvents::add);
        presentation.startQuestion(source.get(0));
        check(presentation.state() == State.QUESTION_TYPING, "Typing starts");
        presentation.update(presentation.typingEndSeconds());
        check(presentation.state() == State.QUESTION_WAITING, "Typing stabilizes before hold");
        presentation.update(1.999);
        check(presentation.state() == State.QUESTION_WAITING, "Full two-second voice hold");
        presentation.update(.002);
        check(presentation.state() == State.QUESTION_MOVING && presentation.answerProgress(0) == 0, "Move precedes answers");
        presentation.update(.75);
        check(presentation.state() == State.ANSWERS_APPEARING && presentation.answerProgress(0) > 0
            && presentation.answerProgress(1) == 0, "A appears after move");
        presentation.update(.18);
        check(presentation.answerProgress(1) > 0 && presentation.answerProgress(2) == 0, "B follows A");
        presentation.update(.18);
        check(presentation.answerProgress(2) > 0 && presentation.answerProgress(3) == 0, "C follows B");
        presentation.update(.18);
        check(presentation.answerProgress(3) > 0 && presentation.state() != State.ANSWERING, "D fades before timer");
        presentation.update(.35);
        check(presentation.state() == State.ANSWERING, "Timer starts after all answers");
        presentation.update(1);
        for (EventType type : EventType.values()) check(events.stream().filter(e -> e.type() == type).count() == 1, "One event: " + type);
        check(events.equals(subscriberEvents), "External listener preserves existing subscriptions");
        for (int i=1;i<events.size();i++) check(events.get(i).seconds() >= events.get(i-1).seconds(), "Ordered timestamps");
        presentation.useExternalVoice(true); presentation.startQuestion(source.get(0));
        long old = presentation.generation();
        presentation.update(10);
        check(presentation.state() == State.QUESTION_WAITING, "External voice gates movement");
        presentation.onVoiceFinished(old); presentation.update(1.99);
        check(presentation.state() == State.QUESTION_WAITING, "Hold after actual voice completion");
        presentation.update(.02); check(presentation.state() == State.QUESTION_MOVING, "Voice can have arbitrary length");
        presentation.startQuestion(source.get(1)); presentation.onVoiceFinished(old);
        check(Double.isInfinite(presentation.moveStartsAt()), "Old voice callback ignored");
        presentation.update(60.01);
        check(Double.isFinite(presentation.moveStartsAt()), "Missing audio callback has a finite fallback");
        presentation.reset(); check(presentation.state() == State.IDLE, "Reset clears presentation");
        var round = new RoundController(source);
        check(!round.next(), "Cannot skip introduction");
        round.update(round.presentation().typingEndSeconds());
        round.update(round.answeringStartsAt() - round.elapsedSeconds() + .001);
        check(round.phase() == RoundPhase.ANSWERING && round.answerSecondsRemaining() > 19.99, "Full answer time after presentation");
        round.update(20);
        check(round.phase() == RoundPhase.REVEAL && round.answerSecondsRemaining() == 0, "Timeout reveals answer");
        check(round.revealProgress() == 0 && round.resultElapsedSeconds() < 0, "No reveal while clock exits");
        round.update(.70);
        check(round.revealProgress() == 0, "Answers intact until clock fully gone");
        round.update(.03);
        check(round.presentation().state() == State.RESULTS && round.revealProgress() > 0, "Reveal begins after exit");
        round.update(.60);
        check(round.revealProgress() == 1 && !round.revealComplete(), "Full-size result held");
        round.update(2.48);
        check(!round.revealComplete(), "Full 2.5 second hold after scaling");
        round.update(.02); check(round.revealComplete() && round.next(), "Result hold and next");
        check(round.number() == 2 && round.elapsedSeconds() == 0 && round.presentation().state() == State.QUESTION_TYPING, "Next resets every timeline");
        for(int i=0;i<4;i++) { round.update(100); check(round.next(), "Advance demo"); }
        check(round.number() == 1, "Existing demo cycling retained");
        round.restart(); round.update(10); check(round.revealAnswer() && !round.revealAnswer(), "Manual reveal idempotent");
        round.update(.5); check(round.revealProgress() == 0, "Manual end also waits for clock");
        round.update(.83); check(round.revealProgress() == 1, "Result animation");
        var custom = new RoundController(source, new RoundTiming(5,2)); custom.update(20);
        check(custom.revealComplete(), "Configurable answer and result durations");
        System.out.println("PASS: glyph timeline, voice gate/fallback/stale callbacks, two-second hold, move, answer stagger, unique events, timer and reset");
    }
}
