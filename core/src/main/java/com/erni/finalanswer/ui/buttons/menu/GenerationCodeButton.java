package com.erni.finalanswer.ui.buttons.menu;

import com.badlogic.gdx.Gdx;

/** GENERATION CODE: собственные изображения и обработчик нажатия. */
public class GenerationCodeButton extends AnimatedImageButton {
    public GenerationCodeButton() {
        super("ui/buttons/generation_code/", "generation_code_up.png",
            "generation_code_hover.png", "generation_code_pressed.png");
    }

    @Override
    protected void onActivate() {
        Gdx.app.log("Final Answer", "GENERATION CODE clicked!");
    }
}
