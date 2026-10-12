package com.erni.finalanswer.ui.buttons;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.utils.ChangeListener;

import com.erni.finalanswer.ui.MenuButton;

public class PlayButton extends MenuButton {

    public PlayButton(BitmapFont font) {

        super("PLAY", font);

        addListener(new ChangeListener() {

            @Override
            public void changed(ChangeEvent event, Actor actor) {

                Gdx.app.log(
                    "Final Answer",
                    "PLAY clicked!"
                );
            }
        });
    }
}