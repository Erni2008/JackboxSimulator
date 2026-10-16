package com.erni.finalanswer.ui.buttons.menu;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g2d.BitmapFont;

/** Отдельная кнопка PLAY со своими изображениями и обработчиком. */
public class PlayButton extends AnimatedImageButton {
    public PlayButton(BitmapFont font) {
        // Надпись уже встроена в PNG; параметр оставлен для совместимости меню.
        super("ui/buttons/play/", "play_up.png", "play_hover.png", "play_pressed.png");
    }

    @Override
    protected void onActivate() {
        // Позже подключим игровой экран; пока проверяем действие в консоли.
        Gdx.app.log("Final Answer", "PLAY clicked!");
    }
}
