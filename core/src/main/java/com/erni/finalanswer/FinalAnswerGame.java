package com.erni.finalanswer;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.erni.finalanswer.localization.Localization;
import com.erni.finalanswer.network.RoomApiClient;
import com.erni.finalanswer.rooms.RoomConfiguration;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.screens.GenerationCodeScreen;
import com.erni.finalanswer.screens.MainMenu;
import com.erni.finalanswer.screens.PlayScreen;
import com.erni.finalanswer.screens.RoomSettingsScreen;
import com.erni.finalanswer.screens.SettingsScreen;
import com.erni.finalanswer.settings.GameSettings;
import com.erni.finalanswer.settings.SettingsStore;
import com.erni.finalanswer.utils.DisplayManager;

/** Owns cached screens, persisted preferences and the live room session. */
public class FinalAnswerGame extends Game {
    private DisplayManager displayManager;
    private SettingsScreen settingsScreen;
    private SettingsStore settingsStore;
    private GameSettings settings;
    private Localization texts;

    public GameSettings getSettings() {
        return settings;
    }

    public Localization getTexts() {
        return texts;
    }

    public void showSettings() {
        if (settingsScreen == null) settingsScreen = new SettingsScreen(this);
        settingsScreen.beginEdit();
        setScreen(settingsScreen);
    }

    public boolean isChangingDisplay() {
        return displayManager.isChanging();
    }

    public void previewDisplay(GameSettings settings) {
        displayManager.apply(settings);
    }

    public void commitSettings(GameSettings candidate) {
        displayManager.apply(candidate);
        settingsStore.save(candidate);
        settings = candidate;
        previewLanguage(candidate.language());
        refreshMotion();
    }

    public void previewLanguage(String language) {
        texts.setLanguage(language);
        if (mainMenu != null) mainMenu.setLanguage(language);
        if (roomSettings != null) roomSettings.setLanguage(language);
        if (generationCode != null) generationCode.setLanguage(language);
        if (settingsScreen != null) settingsScreen.refreshLanguage();
    }

    private void refreshMotion() {
        if (roomSettings != null) roomSettings.setReducedMotion(settings.reducedMotion());
        if (generationCode != null) generationCode.setReducedMotion(settings.reducedMotion());
    }

    private MainMenu mainMenu;
    private PlayScreen playScreen;
    private RoomSettingsScreen roomSettings;
    private GenerationCodeScreen generationCode;
    private final RoomApiClient roomApi = new RoomApiClient();
    private RoomConfiguration pendingConfiguration;
    private RoomSession activeRoom;
    private String lobbyStatus = "";
    private float pollTimer;
    private boolean polling;

    public RoomApiClient getRoomApi() {
        return roomApi;
    }

    public RoomConfiguration getPendingConfiguration() {
        return pendingConfiguration;
    }

    public RoomSession getActiveRoom() {
        return activeRoom;
    }

    public String getLobbyStatus() {
        return lobbyStatus.equals("lobby.waiting")
                ? texts.get(lobbyStatus)
                : texts.error(lobbyStatus);
    }

    public void beginRoomCreation(RoomConfiguration configuration) {
        pendingConfiguration = configuration;
        generationCode.prepareForCreation();
        showGenerationCode();
    }

    public void showPlayScreen() {
        if (activeRoom == null) {
            return;
        }
        if (playScreen == null) {
            playScreen = new PlayScreen(this);
        }
        setScreen(playScreen);
    }

    public void activateRoom(RoomSession room) {
        if (activeRoom != null && !activeRoom.token().equals(room.token()))
            roomApi.leave(activeRoom);
        activeRoom = room;
        pendingConfiguration = null;
        lobbyStatus = "lobby.waiting";
        pollTimer = 2;
        showMainMenu();
    }

    public void leaveRoom() {
        roomApi.leave(activeRoom);
        activeRoom = null;
        lobbyStatus = "";
    }

    public void discardPendingConfiguration() {
        pendingConfiguration = null;
    }

    private void updateLobby(float delta) {
        if (activeRoom == null) return;
        pollTimer += Math.min(Math.max(delta, 0), 0.1f);
        if (pollTimer < 1 || polling) return;
        pollTimer = 0;
        polling = true;
        RoomSession requested = activeRoom;
        roomApi.heartbeat(
                requested,
                updated -> {
                    polling = false;
                    if (activeRoom != requested) return;
                    activeRoom = updated;
                    lobbyStatus = "lobby.waiting";
                },
                error -> {
                    polling = false;
                    if (activeRoom == requested) lobbyStatus = error;
                });
    }

    @Override
    public void create() {
        settingsStore = new SettingsStore();
        settings = settingsStore.load();
        texts = new Localization(settings.language());
        displayManager = new DisplayManager();
        try {
            displayManager.apply(settings);
        } catch (RuntimeException error) {
            settings = GameSettings.defaults();
            displayManager.apply(settings);
        }
        // Warm the bounded menu cache before enabling input on the first screen.
        // Display-sized textures keep the three screens smaller than the former full-size UI.
        mainMenu = new MainMenu(this);
        roomSettings = new RoomSettingsScreen(this);
        generationCode = new GenerationCodeScreen(this);
        settingsScreen = new SettingsScreen(this);
        previewLanguage(settings.language());
        refreshMotion();
        showMainMenu();
    }

    public void showMainMenu() {
        if (mainMenu == null) mainMenu = new MainMenu(this);
        setScreen(mainMenu);
    }

    public void showRoomSettings() {
        if (roomSettings == null) roomSettings = new RoomSettingsScreen(this);
        roomSettings.resetForNewRoom();
        setScreen(roomSettings);
    }

    public void showGenerationCode() {
        if (generationCode == null) generationCode = new GenerationCodeScreen(this);
        if (pendingConfiguration == null) generationCode.prepareForCreation();
        setScreen(generationCode);
    }

    @Override
    public void render() {
        if (Gdx.input.isKeyJustPressed(Input.Keys.F11)
                && getScreen() != settingsScreen
                && !displayManager.isChanging()) {
            GameSettings previous = settings;
            try {
                commitSettings(settings.withFullscreen(!Gdx.graphics.isFullscreen()));
            } catch (RuntimeException error) {
                displayManager.apply(previous);
            }
        }
        updateLobby(Gdx.graphics.getDeltaTime());
        super.render();
    }

    @Override
    public void dispose() {
        // Game.dispose hides the current screen but does not dispose cached screens.
        roomApi.close();
        super.dispose();
        if (mainMenu != null) mainMenu.dispose();
        if (roomSettings != null) roomSettings.dispose();
        if (generationCode != null) generationCode.dispose();
        if (playScreen != null) playScreen.dispose();
        if (settingsScreen != null) settingsScreen.dispose();
    }
}
