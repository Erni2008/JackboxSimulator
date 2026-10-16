package com.erni.finalanswer.ui.buttons.menu;

import com.badlogic.gdx.Gdx;

/** Отдельная кнопка PLAY со своими изображениями и обработчиком. */
public class PlayButton extends AnimatedImageButton {
    public PlayButton() {
        // Надпись встроена в PNG: генерировать шрифт для неё не нужно.
        super("ui/buttons/play/", "play_up.png", "play_hover.png", "play_pressed.png");
    }

    @Override
    protected void onActivate() {
        // Позже подключим игровой экран; пока проверяем действие в консоли.
        Gdx.app.log("Final Answer", "PLAY clicked!");
    }
}
