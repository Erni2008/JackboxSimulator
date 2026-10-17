package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.screens.PlayScreen;

/** Explicit local presentation preview; never fabricates a room or bypasses the normal PLAY button. */
public final class PlayPreviewLauncher {
    public static void main(String[] args) {
        if (StartupHelper.startNewJvmIfRequired()) return;
        var config = new Lwjgl3ApplicationConfiguration();
        config.setTitle("Final Answer - Host Preview");
        config.setWindowedMode(1280, 720);
        config.disableAudio(true);
        new Lwjgl3Application(new FinalAnswerGame() {
            private PlayScreen preview;
            @Override public void create() {
                super.create();
                preview = new PlayScreen(this);
                setScreen(preview);
            }
            @Override public void dispose() {
                if (preview != null) preview.dispose();
                super.dispose();
            }
        }, config);
    }
}
