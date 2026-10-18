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
    private com.erni.finalanswer.network.RealtimeClient realtime;
    public com.erni.finalanswer.network.RealtimeClient getRealtime() { return realtime; }
    private String lobbyStatus = "";

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
        if (activeRoom == null) return;
        if (!activeRoom.host()) { lobbyStatus="Only the host can start the game. Use the phone controller to answer."; return; }
        if (realtime == null || !realtime.connected()) { lobbyStatus="CONNECTION_LOST"; if(realtime!=null)realtime.retry(); return; }
        var state=realtime.snapshot();
        if (state == null || state.get("phase").getAsString().equals("LOBBY")) realtime.send("START_GAME",java.util.Map.of());
        else openNetworkPlay();
    }
    private void openNetworkPlay() {
        if (playScreen == null) playScreen = new PlayScreen(this, realtime);
        if (getScreen() != playScreen) setScreen(playScreen);
    }
    private void onRealtime(com.google.gson.JsonObject event) {
        if (activeRoom == null) return;
        String type=event.get("type").getAsString();
        var data=event.getAsJsonObject("payload");
        if (type.equals("ROOM_CLOSED")) { leaveRoom(); showMainMenu(); return; }
        if (type.equals("ERROR")) { lobbyStatus=data.get("code").getAsString(); return; }
        if (!data.has("players")) return;
        activeRoom=RoomApiClient.parse(new com.badlogic.gdx.utils.JsonReader().parse(data.toString()),activeRoom.token());
        if (activeRoom.host() && data.has("question") && (type.equals("QUESTION_STARTED") || type.equals("AUTHENTICATED"))) openNetworkPlay();
    }

    public void activateRoom(RoomSession room) {
        if (activeRoom != null && !activeRoom.token().equals(room.token()))
            roomApi.leave(activeRoom);
        if (realtime != null) realtime.close();
        if (playScreen != null) { if (getScreen()==playScreen) showMainMenu(); playScreen.dispose(); playScreen=null; }
        activeRoom = room;
        realtime=new com.erni.finalanswer.network.RealtimeClient(roomApi.baseUrl(),room.code(),room.token(),this::onRealtime,status -> lobbyStatus=status);
        pendingConfiguration = null;
        lobbyStatus = "lobby.waiting";
        showMainMenu();
    }

    public void leaveRoom() {
        roomApi.leave(activeRoom);
        if (realtime != null) { realtime.close(); realtime=null; }
        if (playScreen != null) { if (getScreen()==playScreen) showMainMenu(); playScreen.dispose(); playScreen=null; }
        activeRoom = null;
        lobbyStatus = "";
    }

    public void discardPendingConfiguration() {
        pendingConfiguration = null;
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
        // Active lobbies use push snapshots; HTTP heartbeat is retained for the generation screen.
        super.render();
    }

    @Override
    public void dispose() {
        // Game.dispose hides the current screen but does not dispose cached screens.
        if (realtime != null) realtime.close();
        roomApi.close();
        super.dispose();
        if (mainMenu != null) mainMenu.dispose();
        if (roomSettings != null) roomSettings.dispose();
        if (generationCode != null) generationCode.dispose();
        if (playScreen != null) playScreen.dispose();
        if (settingsScreen != null) settingsScreen.dispose();
    }
}
