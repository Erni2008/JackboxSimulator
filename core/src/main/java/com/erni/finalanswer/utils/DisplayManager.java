package com.erni.finalanswer.utils;

import com.badlogic.gdx.Gdx;
import com.erni.finalanswer.settings.GameSettings;

/** All native display changes pass through this owner, including the F11 shortcut. */
public class DisplayManager {
    private GameSettings applied;
    private boolean changing;

    public boolean isChanging() {
        return changing;
    }

    public void apply(GameSettings settings) {
        if (changing) throw new IllegalStateException("Display change already in progress");
        changing = true;
        try {
            boolean success = true;
            if (settings.fullscreen()) {
                if (!Gdx.graphics.isFullscreen())
                    success = Gdx.graphics.setFullscreenMode(Gdx.graphics.getDisplayMode());
            } else if (Gdx.graphics.isFullscreen()
                    || applied == null
                    || applied.width() != settings.width()
                    || applied.height() != settings.height()) {
                if (Gdx.graphics.isFullscreen()
                        || Gdx.graphics.getWidth() != settings.width()
                        || Gdx.graphics.getHeight() != settings.height())
                    success = Gdx.graphics.setWindowedMode(settings.width(), settings.height());
            }
            if (!success) throw new IllegalStateException("Display mode unavailable");
            Gdx.graphics.setVSync(settings.vsync());
            Gdx.graphics.setForegroundFPS(settings.fpsLimit());
            applied = settings;
        } finally {
            changing = false;
        }
    }

    public boolean isFullscreen() {
        return Gdx.graphics.isFullscreen();
    }
}
