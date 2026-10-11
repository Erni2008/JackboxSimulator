package com.erni.finalanswer.utils;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Graphics;

public class DisplayManager {

    private static final int WINDOW_WIDTH = 1280;
    private static final int WINDOW_HEIGHT = 720;

    public void toggleFullscreen() {

        if (Gdx.graphics.isFullscreen()) {

            // Switch to windowed mode
            Gdx.graphics.setWindowedMode(
                WINDOW_WIDTH,
                WINDOW_HEIGHT
            );

        } else {

            // Get current monitor mode
            Graphics.DisplayMode displayMode =
                Gdx.graphics.getDisplayMode();

            // Switch to fullscreen
            Gdx.graphics.setFullscreenMode(displayMode);

        }
    }

    public boolean isFullscreen() {

        return Gdx.graphics.isFullscreen();

    }
}