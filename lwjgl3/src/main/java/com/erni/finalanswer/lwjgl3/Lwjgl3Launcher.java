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

        com.erni.finalanswer.lwjgl3.hosting.DesktopPaths.logging();
        var hosting=com.erni.finalanswer.lwjgl3.hosting.LocalServerManager.configured();
        try { createApplication(hosting); } finally { hosting.close(); }
    }

    /**
     * Creates and launches the game.
     */
    private static Lwjgl3Application createApplication(com.erni.finalanswer.network.HostingAccess hosting) {

        FinalAnswerGame game=Boolean.getBoolean("finalanswer.selfCheck")?new com.erni.finalanswer.lwjgl3.hosting.ApplicationSelfCheck(hosting):new FinalAnswerGame(hosting);
        var application=new Lwjgl3Application(game,getDefaultConfiguration());
        if(game instanceof com.erni.finalanswer.lwjgl3.hosting.ApplicationSelfCheck check)check.verify();
        return application;
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
        configuration.setPreferencesConfig(com.erni.finalanswer.lwjgl3.hosting.DesktopPaths.dataDirectory().resolve("preferences").toString()+java.io.File.separator,com.badlogic.gdx.Files.FileType.Absolute);

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
            "ui/Final_Answer.png"
        );

        return configuration;
    }
}