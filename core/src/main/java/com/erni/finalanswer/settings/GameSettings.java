package com.erni.finalanswer.settings;

import java.util.Set;

/** Validated, language-independent preferences; never stores room/session data. */
public record GameSettings(
        String language,
        boolean fullscreen,
        int width,
        int height,
        boolean vsync,
        int fpsLimit,
        boolean reducedMotion) {
    public GameSettings {
        if (!Set.of("en", "ru").contains(language))
            throw new IllegalArgumentException("Unsupported language");
        if (!Set.of("1280x720", "1600x900", "1920x1080").contains(width + "x" + height))
            throw new IllegalArgumentException("Unsupported resolution");
        if (!Set.of(0, 30, 60, 120, 144, 240).contains(fpsLimit))
            throw new IllegalArgumentException("Invalid FPS limit");
    }

    public static GameSettings defaults() {
        return new GameSettings("en", false, 1280, 720, true, 60, false);
    }

    public GameSettings withFullscreen(boolean value) {
        return new GameSettings(language, value, width, height, vsync, fpsLimit, reducedMotion);
    }
}
