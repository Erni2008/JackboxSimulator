package com.erni.finalanswer.gameplay.questions;

import java.util.List;

public final class DemoQuestionSource implements QuestionSource {
    private final List<Question> questions = List.of(
        new Question("solar-largest", "Какая планета Солнечной системы самая большая?",
            List.of("Земля", "Юпитер", "Сатурн", "Нептун"), 1),
        new Question("ocean-deepest", "В каком океане находится самая глубокая точка Земли?",
            List.of("Атлантический", "Индийский", "Тихий", "Северный Ледовитый"), 2),
        new Question("raven-author", "Кто написал стихотворение «Ворон»?",
            List.of("Мэри Шелли", "Брэм Стокер", "Говард Лавкрафт", "Эдгар Аллан По"), 3),
        new Question("light-year", "Что измеряют астрономы, когда говорят о расстоянии в один световой год?",
            List.of("Расстояние, которое свет проходит за год", "Возраст звезды",
                "Время оборота звезды вокруг галактики", "Яркость звезды по сравнению с Солнцем"), 0),
        new Question("human-bones", "Сколько костей обычно в скелете взрослого человека?",
            List.of("186", "206", "226", "246"), 1)
    );

    @Override public int size() { return questions.size(); }
    @Override public Question get(int index) { return questions.get(index); }
}
