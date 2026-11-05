package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.PixmapIO;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.screens.CageLobbyScreen;
import java.util.ArrayList;

/** Dev capture: the 8-character lobby, for judging whole-figure character lighting (-Dfinalanswer.characterLighting=false for the old look). */
public final class CharacterLightingShot {
    public static void main(String[] args) {
        if (StartupHelper.startNewJvmIfRequired()) return;
        var config = new Lwjgl3ApplicationConfiguration(); config.setTitle("Character lighting"); config.setWindowedMode(1600, 900); config.disableAudio(true); config.setForegroundFPS(60);
        new Lwjgl3Application(new FinalAnswerGame() {
            CageLobbyScreen preview; RoomSession room; float elapsed; boolean done;
            @Override public void create() { super.create(); preview = new CageLobbyScreen(this); setScreen(preview);
                String[] ids = {"skeleton", "ghost", "zombie", "dracula", "plague_doctor", "pumpkin", "puppeteer", "voodoo"}; var players = new ArrayList<RoomSession.Player>();
                for (int i = 0; i < 8; i++) players.add(new RoomSession.Player("p" + i, ids[i], false, ids[i], "ONLINE", false, 0));
                room = new RoomSession("ABC123", "THE WAITING ROOM", 8, "standard", "preview", false, players); preview.synchronize(room, ""); }
            @Override public void render() { if (done) return; elapsed += 1f / 60; preview.synchronize(room, ""); preview.draw(1f / 60);
                if (elapsed > Float.parseFloat(System.getProperty("shot.at", "9"))) { done = true;
                    int w = Gdx.graphics.getBackBufferWidth(), h = Gdx.graphics.getBackBufferHeight(); Pixmap p = Pixmap.createFromFrameBuffer(0, 0, w, h);
                    var flipped = new Pixmap(w, h, Pixmap.Format.RGBA8888); for (int y = 0; y < h; y++) flipped.drawPixmap(p, 0, y, w, 1, 0, h - 1 - y, w, 1);
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("shot.out")), flipped, -1, true); Gdx.app.exit(); } }
        }, config);
    }
}
