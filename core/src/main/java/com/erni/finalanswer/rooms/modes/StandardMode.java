package com.erni.finalanswer.rooms.modes;

import com.erni.finalanswer.rooms.GameMode;

/**
 * Стандартный режим игры Final Answer.
 *
 * Игроки отвечают на вопросы викторины.
 * Неправильные ответы отправляют игроков в смертельные мини-игры.
 * Выбывшие игроки становятся призраками и продолжают участвовать.
 * Последний выживший побеждает в финальном испытании на побег.
 */
public class StandardMode {

    public GameMode getId() {
        return GameMode.STANDARD;
    }

    public String getNameKey() {
        return getId().getNameKey();
    }

    public String getDescriptionKey() {
        return getId().getDescriptionKey();
    }
}
