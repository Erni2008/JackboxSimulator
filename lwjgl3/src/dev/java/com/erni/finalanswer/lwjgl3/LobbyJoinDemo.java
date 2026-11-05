package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.screens.CageLobbyScreen;
import java.util.ArrayList;

/** Dev demo: all eight characters join the waiting room one by one (every 2.5 s), then the room empties and it repeats. */
public final class LobbyJoinDemo {
    public static void main(String[] args) {
        if (StartupHelper.startNewJvmIfRequired()) return;
        var config = new Lwjgl3ApplicationConfiguration(); config.setTitle("FINAL ANSWER — join test (8 characters)"); config.setWindowedMode(1600, 900);
        config.setForegroundFPS(60); config.useVsync(true); config.setBackBufferConfig(8, 8, 8, 8, 24, 0, 4);
        new Lwjgl3Application(new FinalAnswerGame() {
            static final String[] IDS = {"skeleton", "ghost", "zombie", "dracula", "plague_doctor", "pumpkin", "puppeteer", "voodoo"};
            static final String[] NAMES = {"Скелет", "Призрак", "Зомби", "Дракула", "Чумной доктор", "Тыква", "Кукловод", "Вуду"};
            CageLobbyScreen lobby; float t; int shown = 0; final RoomSession[] rooms = new RoomSession[9];
            RoomSession room(int count) { var players = new ArrayList<RoomSession.Player>();
                for (int i = 0; i < count; i++) players.add(new RoomSession.Player("p" + i, NAMES[i], false, IDS[i], "ONLINE", false, 0));
                return new RoomSession("ABC123", "THE WAITING ROOM", 8, "standard", "demo", true, players); }
            @Override public void create() { super.create(); lobby = new CageLobbyScreen(this); setScreen(lobby); rooms[0] = room(0); lobby.synchronize(rooms[0], ""); }
            @Override public void render() { float d = com.badlogic.gdx.Gdx.graphics.getDeltaTime(); t += d;
                int want = (int) Math.min(8, t / 2.5f); if (t > 2.5f * 8 + 25) { t = 0; want = 0; }
                if (want != shown) { shown = want; rooms[want] = room(want); }
                long t0 = System.nanoTime(); lobby.synchronize(rooms[shown], ""); lobby.draw(d); com.badlogic.gdx.Gdx.gl.glFinish(); cpu += (System.nanoTime() - t0) / 1e6; frames++;
                if ((sec += d) >= 1) { System.out.printf("FPS %d  frame %.1f ms  players %d%n", com.badlogic.gdx.Gdx.graphics.getFramesPerSecond(), cpu / frames, shown); sec = 0; cpu = 0; frames = 0; }
                if (limit > 0 && t > limit) com.badlogic.gdx.Gdx.app.exit(); }
            float sec, limit = Float.parseFloat(System.getProperty("demo.seconds", "0")); double cpu; int frames;
        }, config);
    }
}
