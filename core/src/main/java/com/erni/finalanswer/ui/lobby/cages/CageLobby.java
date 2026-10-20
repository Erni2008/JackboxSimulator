package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.ui.UiFonts;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

/** Roster adapter and resource owner. Character factories can be registered without changing cages. */
public final class CageLobby extends Group implements Disposable {
    private final CageAssets assets = new CageAssets();
    private final BitmapFont font = UiFonts.nameplate(48);
    private final CageAssignments assignments = new CageAssignments();
    private final HangingCage[] cages = new HangingCage[CageLayoutManager.SLOTS];
    private final Map<String, Supplier<CageCharacter>> characters = new HashMap<>();
    private GhostAssets ghostAssets;
    private ZombieAssets zombieAssets;
    private DraculaAssets draculaAssets;
    private PumpkinAssets pumpkinAssets;
    private PlagueDoctorAssets plagueDoctorAssets;
    private PuppeteerAssets puppeteerAssets;
    private PuppeteerConfig puppeteerConfig;
    private VoodooAssets voodooAssets;
    private VoodooConfig voodooConfig;
    private final VoodooRoomEvents voodooEvents = new VoodooRoomEvents();
    private final com.badlogic.gdx.math.Vector2 puppeteerPointer = new com.badlogic.gdx.math.Vector2();
    private RoomSession previous;
    private String roomCode;
    public CageLobby() {
        registerCharacter("skeleton", () -> new SkeletonCharacter(assets));
        registerCharacter("ghost", () -> {
            if (ghostAssets == null) ghostAssets = new GhostAssets();
            return new GhostCharacter(ghostAssets);
        });
        registerCharacter("zombie", () -> {
            if (zombieAssets == null) zombieAssets = new ZombieAssets();
            return new ZombieCharacter(zombieAssets);
        });
        registerCharacter("dracula", () -> {
            if (draculaAssets == null) draculaAssets = new DraculaAssets();
            return new DraculaCharacter(draculaAssets);
        });
        registerCharacter("pumpkin", () -> {
            if (pumpkinAssets == null) pumpkinAssets = new PumpkinAssets();
            return new PumpkinCharacter(pumpkinAssets);
        });
        registerCharacter("plague_doctor", () -> {
            if (plagueDoctorAssets == null) plagueDoctorAssets = new PlagueDoctorAssets();
            return new PlagueDoctorCharacter(plagueDoctorAssets);
        });
        registerCharacter("voodoo", () -> {
            if (voodooAssets == null) { voodooConfig = VoodooConfig.load(); voodooAssets = new VoodooAssets(voodooConfig); }
            return new VoodooCharacter(voodooAssets, voodooConfig);
        });
        registerCharacter("puppeteer", () -> {
            if (puppeteerAssets == null) { puppeteerConfig = PuppeteerConfig.load(); puppeteerAssets = new PuppeteerAssets(puppeteerConfig); }
            return new PuppeteerCharacter(puppeteerAssets, puppeteerConfig);
        });
        for (int i = 0; i < cages.length; i++) { cages[i] = new HangingCage(assets, font, i); addActor(cages[i]); }
        CageLayoutManager.layout(cages);
    }
    public HangingCage cage(int slot) { return cages[slot]; }
    public void registerCharacter(String id, Supplier<CageCharacter> factory) { characters.put(id, factory); }
    public void synchronize(RoomSession room) {
        if (room == previous) return;
        previous = room;
        if (room == null || !room.code().equals(roomCode)) {
            assignments.clear(); voodooEvents.clear(); for (HangingCage cage : cages) cage.clear();
            roomCode = room == null ? null : room.code();
        }
        if (room == null) return;
        var players = room.players().stream().filter(p -> !p.host()).toList();
        assignments.synchronize(players.stream().map(RoomSession.Player::id).toList());
        for (int slot = 0; slot < cages.length; slot++) {
            HangingCage cage = cages[slot]; String id = assignments.playerAt(slot);
            if (id == null) { if (cage.playerId() != null) cage.clear(); continue; }
            for (var player : players) if (id.equals(player.id())) {
                // Older guest identifiers keep the existing skeleton fallback.
                if (!id.equals(cage.playerId()) || !player.characterId().equals(cage.characterId())) cage.assign(id, player.name(), player.characterId(),
                    characters.getOrDefault(player.characterId(), characters.get("skeleton")).get());
                else cage.assign(id, player.name(), player.characterId(), null);
                break;
            }
        }
    }
    public void onRoomEvent(com.google.gson.JsonObject payload, long serverNow) {
        voodooEvents.accept(payload, serverNow, this::playVoodoo);
    }
    /** Existing gameplay can explicitly request a terminal animation without a new wire protocol. */
    public void playVoodoo(String playerId, VoodooAnimationController.State state, String sequence, long seed, float age) {
        for (HangingCage cage : cages) if (playerId.equals(cage.playerId()) && cage.character() instanceof VoodooCharacter doll)
            doll.playNetwork(state, sequence, seed, age);
    }
    @Override public void act(float delta) {
        super.act(delta);
        if (getStage() == null) return;
        getStage().screenToStageCoordinates(puppeteerPointer.set(com.badlogic.gdx.Gdx.input.getX(), com.badlogic.gdx.Gdx.input.getY()));
        float stageX = puppeteerPointer.x, stageY = puppeteerPointer.y;
        for (HangingCage cage : cages) if (cage.character() instanceof PuppeteerCharacter puppet) {
            cage.stageToLocalCoordinates(puppeteerPointer.set(stageX, stageY));
            assets.presentation.profile(cage.characterId()).inverse(puppeteerPointer);
            var config = puppet.configuration();
            puppet.animator().lookAt((puppeteerPointer.x - config.lobbyX) / 100,
                (puppeteerPointer.y - config.lobbyFloor - 120) / 100);
        }
    }
    public void reducedMotion(boolean value) { for (HangingCage cage : cages) cage.reducedMotion(value); }
    @Override public void dispose() { clearChildren(); font.dispose(); assets.dispose(); if (ghostAssets != null) ghostAssets.dispose(); if (zombieAssets != null) zombieAssets.dispose(); if (draculaAssets != null) draculaAssets.dispose(); if (pumpkinAssets != null) pumpkinAssets.dispose(); if (plagueDoctorAssets != null) plagueDoctorAssets.dispose(); if (voodooAssets != null) voodooAssets.dispose(); if (puppeteerAssets != null) puppeteerAssets.dispose(); }
}
