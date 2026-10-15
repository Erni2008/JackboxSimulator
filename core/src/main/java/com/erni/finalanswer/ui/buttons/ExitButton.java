package com.erni.finalanswer.ui.buttons;

import com.badlogic.gdx.Gdx;

/** EXIT: собственные изображения и обработчик нажатия. */
public class ExitButton extends AnimatedImageButton {
    public ExitButton() {
        super("ui/buttons/exit/", "exit_up.png",
            "exit_hover.png", "exit_pressed.png");
    }

    @Override
    protected void onActivate() {
        Gdx.app.exit();
    }
}
