package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.screens.CageLobbyScreen;
import java.util.ArrayList;
import java.util.List;

/** Dev source set only. R resets, 1/8 change occupancy, L removes a middle player, J rejoins. */
public final class CagePreviewLauncher {
    public static void main(String[] args) {
        if (StartupHelper.startNewJvmIfRequired()) return;
        var config = new Lwjgl3ApplicationConfiguration(); config.setTitle("FINAL ANSWER — Cage preview / R 1 8 L J");
        config.setWindowedMode(1600, 900); config.disableAudio(true); config.setForegroundFPS(60);
        new Lwjgl3Application(new FinalAnswerGame() {
            private CageLobbyScreen preview;
            private RoomSession room;
            private float elapsed;
            private int shot;
            private final boolean check = Boolean.getBoolean("cage.check");
            private final float[] times = {.25f, 1f, 1.9f, 2.7f, 4.2f, 5.2f, 6.2f, 6.7f, 7.7f, 11.7f};
            private RoomSession room(int count, boolean middle) {
                var players = new ArrayList<RoomSession.Player>();
                for (int i = 0; i < count; i++) if (middle || i != 3)
                    players.add(new RoomSession.Player("player-" + i, List.of("Анастасия", "Bram", "Mary", "Edgar", "Wednesday", "Владислав", "Григорий", "Alexander").get(i), false, System.getProperty("cage.character", "skeleton"), "ONLINE", false, 0));
                return new RoomSession("ABC123", "THE WAITING ROOM", 8, "standard", "preview", false, players);
            }
            @Override public void create() { super.create(); preview = new CageLobbyScreen(this); setScreen(preview); room = room(8, true);
                if (check) {
                    preview.synchronize(room, "");
                    var nameplate = preview.cages().cage(7);
                    for (String text : List.of("WWWWWWWWWWWWWWWWWWWWWWWW", "Друgруру", ".", "Анастасия", "Long nickname example"))
                        nameplate.assign("player-7", text, "skeleton", null);
                    nameplate.assign("player-7", "Alexander", "skeleton", null);
                    System.out.println("PASS: bold nickname glyphs fit the nameplate, including 24 wide letters and descenders");
                }
            }
            @Override public void render() {
                // PNG encoding must not skip the next animation phase in capture mode.
                float delta = check ? 1f / 60 : Gdx.graphics.getDeltaTime(); elapsed += delta;
                if (Gdx.input.isKeyJustPressed(Input.Keys.R)) { preview.synchronize(null, ""); room = room(8, true); }
                if (Gdx.input.isKeyJustPressed(Input.Keys.NUM_1)) room = room(1, true);
                if (Gdx.input.isKeyJustPressed(Input.Keys.NUM_8) || Gdx.input.isKeyJustPressed(Input.Keys.J)) room = room(8, true);
                if (Gdx.input.isKeyJustPressed(Input.Keys.L)) room = room(8, false);
                for (int i=0;i<8;i++) if (preview.cages().cage(i).character() instanceof com.erni.finalanswer.ui.lobby.cages.GhostCharacter ghost) {
                    if(Gdx.input.isKeyJustPressed(Input.Keys.I)) ghost.setState(com.erni.finalanswer.ui.lobby.cages.GhostAnimator.State.IDLE);
                    if(Gdx.input.isKeyJustPressed(Input.Keys.S)) ghost.setState(com.erni.finalanswer.ui.lobby.cages.GhostAnimator.State.SCARED);
                    if(Gdx.input.isKeyJustPressed(Input.Keys.H)) ghost.setState(com.erni.finalanswer.ui.lobby.cages.GhostAnimator.State.HIT);
                    if(Gdx.input.isKeyJustPressed(Input.Keys.D)) ghost.setState(com.erni.finalanswer.ui.lobby.cages.GhostAnimator.State.DEATH);
                    if(Gdx.input.isKeyJustPressed(Input.Keys.F)) ghost.flipped(true);
                }
                preview.synchronize(room, "WAITING FOR PLAYERS · Eight independent ceiling attachments"); preview.draw(delta);
                if (check && shot < times.length && elapsed >= times[shot]) {
                    if (System.getProperty("cage.character", "").equals("ghost"))
                        for (int i=0;i<8;i++) if (preview.cages().cage(i).character() instanceof com.erni.finalanswer.ui.lobby.cages.GhostCharacter ghost
                            && ghost.animator().state()!=com.erni.finalanswer.ui.lobby.cages.GhostAnimator.State.IDLE)
                            throw new AssertionError("Lobby ghost left idle in slot " + i);
                    System.out.println("CAGE_CAPTURE=" + shot + " TIME=" + preview.cages().cage(0).animation().time());
                    var pixels = ScreenUtils.getFrameBufferPixmap(0, 0, Gdx.graphics.getBackBufferWidth(), Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("cage.output") + "/stage-" + shot + ".png"), pixels, -1, true); pixels.dispose(); shot++;
                    if (shot == 5) { room = room(8, false); Gdx.graphics.setWindowedMode(960, 540); }
                    if (shot == 6) { room = room(8, true); Gdx.graphics.setWindowedMode(1024, 768); }
                    if (shot == 7) room = room(0, true);
                    if (shot == 8) room = room(1, true);
                    if (shot == 9) room = room(8, true);
                    if (shot == times.length) Gdx.app.exit();
                }
            }
            @Override public void dispose() { showMainMenu(); if (preview != null) preview.dispose(); super.dispose(); }
        }, config);
    }
}
