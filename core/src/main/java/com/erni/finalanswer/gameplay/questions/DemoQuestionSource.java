package com.erni.finalanswer.gameplay.questions;

import java.util.List;

public final class DemoQuestionSource implements QuestionSource {
    private final List<Question> questions = List.of(
        new Question("solar-largest", "What is the largest planet in our solar system?",
            List.of("Earth", "Jupiter", "Saturn", "Neptune"), 1),
        new Question("ocean-deepest", "Which ocean contains the deepest known point on Earth?",
            List.of("Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"), 2),
        new Question("raven-author", "Who wrote the poem The Raven?",
            List.of("Mary Shelley", "Bram Stoker", "H. P. Lovecraft", "Edgar Allan Poe"), 3),
        new Question("light-year", "When astronomers describe a star as being one light-year away, what are they measuring?",
            List.of("The distance light travels in one year", "The age of the star",
                "The time it takes the star to orbit its galaxy", "The brightness of the star compared with the Sun"), 0),
        new Question("human-bones", "How many bones are typically found in an adult human skeleton?",
            List.of("186", "206", "226", "246"), 1)
    );

    @Override public int size() { return questions.size(); }
    @Override public Question get(int index) { return questions.get(index); }
}
