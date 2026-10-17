package com.erni.finalanswer.ui.buttons.menu;


/** Отдельная кнопка PLAY со своими изображениями и обработчиком. */
public class PlayButton extends AnimatedImageButton {
    private final Runnable onPlay;

    public PlayButton(Runnable onPlay) {
        // Надпись встроена в PNG: генерировать шрифт для неё не нужно.
        super("ui/buttons/play/", "play_up.png", "play_hover.png", "play_pressed.png");
        this.onPlay = onPlay;
    }

    @Override
    protected void onActivate() {
        onPlay.run();
    }
}
