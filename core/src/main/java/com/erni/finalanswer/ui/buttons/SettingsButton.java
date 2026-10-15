package com.erni.finalanswer.ui.buttons;

import com.badlogic.gdx.Gdx;

/** SETTINGS: собственные изображения и обработчик нажатия. */
public class SettingsButton extends AnimatedImageButton {
    public SettingsButton() {
        super("ui/buttons/settings/", "settings_up.png",
            "settings_hover.png", "settings_pressed.png");
    }

    @Override
    protected void onActivate() {
        Gdx.app.log("Final Answer", "SETTINGS clicked!");
    }
}
