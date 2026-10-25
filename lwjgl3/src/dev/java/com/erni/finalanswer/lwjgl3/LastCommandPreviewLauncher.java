package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.erni.finalanswer.FinalAnswerGame;

/** Interactive preview; remains open until the user closes the window. */
public final class LastCommandPreviewLauncher {
    public static void main(String[] args) {
        if (StartupHelper.startNewJvmIfRequired()) return;
        var config = new Lwjgl3ApplicationConfiguration();
        config.setTitle("Final Answer — THE LAST COMMAND (3D PREVIEW)");
        config.setWindowedMode(1280, 800);
        config.useVsync(true);
        config.setForegroundFPS(60);
        new Lwjgl3Application(new FinalAnswerGame() {
            @Override protected boolean preloadMenuScreens() { return false; }
            @Override public void create() { super.create(); showTheLastCommand(); }
        }, config);
    }
}
