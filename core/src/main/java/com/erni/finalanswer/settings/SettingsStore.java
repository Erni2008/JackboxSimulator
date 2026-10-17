package com.erni.finalanswer.settings;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Preferences;

public final class SettingsStore {
    private final Preferences preferences = Gdx.app.getPreferences("FinalAnswer.settings");

    public GameSettings load() {
        GameSettings defaults = GameSettings.defaults();
        try {
            return new GameSettings(
                    preferences.getString("language", defaults.language()),
                    preferences.getBoolean("fullscreen", defaults.fullscreen()),
                    preferences.getInteger("width", defaults.width()),
                    preferences.getInteger("height", defaults.height()),
                    preferences.getBoolean("vsync", defaults.vsync()),
                    preferences.getInteger("fpsLimit", defaults.fpsLimit()),
                    preferences.getBoolean("reducedMotion", defaults.reducedMotion()));
        } catch (IllegalArgumentException error) {
            return defaults;
        }
    }

    public void save(GameSettings settings) {
        preferences
                .putString("language", settings.language())
                .putBoolean("fullscreen", settings.fullscreen())
                .putInteger("width", settings.width())
                .putInteger("height", settings.height())
                .putBoolean("vsync", settings.vsync())
                .putInteger("fpsLimit", settings.fpsLimit())
                .putBoolean("reducedMotion", settings.reducedMotion())
                .flush();
    }
}
