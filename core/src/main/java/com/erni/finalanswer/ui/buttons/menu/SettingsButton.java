package com.erni.finalanswer.ui.buttons.menu;

import com.badlogic.gdx.Gdx;

/** SETTINGS: собственные изображения и обработчик нажатия. */
public class SettingsButton extends AnimatedImageButton {
    private final Runnable openSettings;
    public SettingsButton(Runnable openSettings) {
        super("ui/buttons/settings/", "settings_up.png",
            "settings_hover.png", "settings_pressed.png");
        this.openSettings = openSettings;
    }

    @Override
    protected void onActivate() {
        Gdx.app.postRunnable(openSettings);
    }
}
