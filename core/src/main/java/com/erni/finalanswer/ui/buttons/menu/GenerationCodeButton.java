package com.erni.finalanswer.ui.buttons.menu;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Screen;
import com.erni.finalanswer.FinalAnswerGame;

/** GENERATION CODE: собственные изображения и обработчик нажатия. */
public class GenerationCodeButton extends AnimatedImageButton {
    private final FinalAnswerGame game;



    public GenerationCodeButton(FinalAnswerGame game) {
        super("ui/buttons/generation_code/", "generation_code_up.png",
            "generation_code_hover.png", "generation_code_pressed.png");

        this.game = game;
    }

    @Override
    protected void onActivate() {
        Screen previous = game.getScreen();

        Gdx.app.postRunnable(() -> {
            if (game.getScreen()!= previous) return;
            game.showGenerationCode();
        });
    }
}
