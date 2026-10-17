package com.erni.finalanswer.gameplay.questions;

import java.util.List;
import java.util.Objects;

/** Immutable content; the host view never uses the answer key for presentation. */
public record Question(String id, String text, List<String> answers, int correctAnswerIndex) {
    public Question {
        if (Objects.requireNonNull(id).isBlank() || Objects.requireNonNull(text).isBlank())
            throw new IllegalArgumentException("Question ID and text must not be blank");
        answers = List.copyOf(answers);
        if (answers.size() != 4 || answers.stream().anyMatch(String::isBlank))
            throw new IllegalArgumentException("Exactly four nonblank answers are required");
        if (correctAnswerIndex < 0 || correctAnswerIndex >= 4)
            throw new IllegalArgumentException("Correct answer index must be 0..3");
    }
}
