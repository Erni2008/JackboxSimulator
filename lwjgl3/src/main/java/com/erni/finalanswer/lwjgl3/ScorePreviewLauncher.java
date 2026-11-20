package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.screens.ScoreScreen;
import com.google.gson.JsonParser;

/** Developer preview of the ROUND RESULTS screen with a sample table; replays on close. ./gradlew :lwjgl3:scorePreview */
public final class ScorePreviewLauncher {
    private static final String SAMPLE="{\"mode\":\"race\",\"rows\":["
        +"{\"name\":\"Ann\",\"characterId\":\"pumpkin\",\"earned\":1200,\"total\":3400},"
        +"{\"name\":\"Bob\",\"characterId\":\"skeleton\",\"earned\":800,\"total\":2100},"
        +"{\"name\":\"Cid\",\"characterId\":\"dracula\",\"earned\":600,\"total\":2600},"
        +"{\"name\":\"Dee\",\"characterId\":\"voodoo\",\"earned\":400,\"total\":900},"
        +"{\"name\":\"Eve\",\"characterId\":\"ghost\",\"earned\":0,\"total\":500}]}";
    public static void main(String[] args) {
        if (StartupHelper.startNewJvmIfRequired()) return;
        var config = new Lwjgl3ApplicationConfiguration();
        config.setTitle("Final Answer - Round Results Preview");
        config.setWindowedMode(1600, 900);
        new Lwjgl3Application(new FinalAnswerGame() {
            @Override public void create() {super.create();replay();}
            private void replay(){var old=getScreen();setScreen(new ScoreScreen(JsonParser.parseString(SAMPLE).getAsJsonObject(),this::replay));if(old instanceof ScoreScreen s)s.dispose();}
        }, config);
    }
}
