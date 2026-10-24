package com.erni.finalanswer.gameplay.questions;

import java.util.List;

public final class DemoQuestionSource implements QuestionSource {
    private final List<Question> questions = QuestionCatalog.demo();

    @Override public int size() { return questions.size(); }
    @Override public Question get(int index) { return questions.get(index); }
}
