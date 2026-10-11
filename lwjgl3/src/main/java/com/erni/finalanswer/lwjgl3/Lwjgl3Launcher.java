package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;

import com.erni.finalanswer.FinalAnswerGame;

/**
 * Desktop launcher for Final Answer.
 *
 * Configures the game window and starts the application.
 */
public class Lwjgl3Launcher {

    public static void main(String[] args) {

        // Required startup handling for macOS and some Windows setups
        if (StartupHelper.startNewJvmIfRequired()) {
            return;
        }

        createApplication();
    }

    /**
     * Creates and launches the game.
     */
    private static Lwjgl3Application createApplication() {

        return new Lwjgl3Application(
            new FinalAnswerGame(),
            getDefaultConfiguration()
        );
    }

    /**
     * Configures the desktop application.
     */
    private static Lwjgl3ApplicationConfiguration getDefaultConfiguration() {

        Lwjgl3ApplicationConfiguration configuration =
            new Lwjgl3ApplicationConfiguration();

        // ---------------------------------
        // WINDOW SETTINGS
        // ---------------------------------

        // Window title
        configuration.setTitle("Final Answer");

        // Initial window resolution
        configuration.setWindowedMode(1280, 720);

        // Enable standard window decorations
        configuration.setDecorated(true);

        // Allow resizing the window
        configuration.setResizable(true);

        // ---------------------------------
        // GRAPHICS SETTINGS
        // ---------------------------------

        // Enable vertical synchronization
        configuration.useVsync(true);

        // Target maximum FPS
        configuration.setForegroundFPS(60);

        // ---------------------------------
        // WINDOW ICONS
        // ---------------------------------

        configuration.setWindowIcon(
            "libgdx128.png",
            "libgdx64.png",
            "libgdx32.png",
            "libgdx16.png"
        );

        return configuration;
    }
}