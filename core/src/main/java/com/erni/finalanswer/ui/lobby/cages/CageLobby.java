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
        for (int i = 0; i < cages.length; i++) { cages[i] = new HangingCage(assets, font, i); addActor(cages[i]); }
        CageLayoutManager.layout(cages);
    }
    public HangingCage cage(int slot) { return cages[slot]; }
    public void registerCharacter(String id, Supplier<CageCharacter> factory) { characters.put(id, factory); }
    public void synchronize(RoomSession room) {
        if (room == previous) return;
        previous = room;
        if (room == null || !room.code().equals(roomCode)) {
            assignments.clear(); for (HangingCage cage : cages) cage.clear();
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
    public void reducedMotion(boolean value) { for (HangingCage cage : cages) cage.reducedMotion(value); }
    @Override public void dispose() { clearChildren(); font.dispose(); assets.dispose(); if (ghostAssets != null) ghostAssets.dispose(); if (zombieAssets != null) zombieAssets.dispose(); if (draculaAssets != null) draculaAssets.dispose(); }
}
