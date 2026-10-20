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
    private com.erni.finalanswer.screens.CageLobbyScreen cageLobbyScreen;
    private com.erni.finalanswer.impostor.ImpostorScreen impostorScreen;
    private RoomSettingsScreen roomSettings;
    private GenerationCodeScreen generationCode;
    private final RoomApiClient roomApi;
    private final com.erni.finalanswer.network.HostingAccess hosting;
    public FinalAnswerGame(){this(com.erni.finalanswer.network.HostingAccess.external(System.getProperty("finalanswer.server",System.getenv().getOrDefault("FINALANSWER_SERVER_URL","http://127.0.0.1:8080"))));}
    public FinalAnswerGame(com.erni.finalanswer.network.HostingAccess hosting){this.hosting=hosting;this.roomApi=new RoomApiClient(hosting);}
    public com.erni.finalanswer.network.HostingAccess getHosting(){return hosting;}
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

    public com.erni.finalanswer.ui.lobby.cages.CageLobby getRoomCharacters(){return cageLobbyScreen==null?null:cageLobbyScreen.cages();}

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
        if (state == null || state.get("phase").getAsString().equals("LOBBY")) {
            if(cageLobbyScreen!=null)cageLobbyScreen.startRequested();
            realtime.send("START_GAME",java.util.Map.of());
        }
        else if(state.get("phase").getAsString().equals("STARTING")){showRoomLobby();cageLobbyScreen.transition(state,realtime.serverNow());}
        else openNetworkPlay();
    }
    /** Render-thread preparation, called only after the blackout frame has been presented. */
    public boolean networkPlayPrepared(){return playScreen!=null;}
    public void prepareNetworkPlay(){if(activeRoom!=null&&activeRoom.host()&&realtime!=null&&playScreen==null)playScreen=new PlayScreen(this,realtime);}
    private void openNetworkPlay() {
        prepareNetworkPlay();
        if (getScreen() != playScreen) setScreen(playScreen);
    }
    public void showRoomLobby() {
        if (activeRoom == null) { showMainMenu(); return; }
        if (cageLobbyScreen == null) cageLobbyScreen = new com.erni.finalanswer.screens.CageLobbyScreen(this);
        if(getScreen()!=cageLobbyScreen)setScreen(cageLobbyScreen);
    }
    public void showImpostorLobby(){
        if(activeRoom==null || !activeRoom.host() || realtime==null || !realtime.connected())return;
        if(impostorScreen==null){impostorScreen=new com.erni.finalanswer.impostor.ImpostorScreen(this);impostorScreen.show();impostorScreen.connectSuspicion(realtime);}
        if(getScreen()!=impostorScreen)setScreen(impostorScreen);
    }
    private void releaseImpostor(){if(impostorScreen!=null){if(getScreen()==impostorScreen)showMainMenu();impostorScreen.dispose();impostorScreen=null;}}
    private void onRealtime(com.google.gson.JsonObject event) {
        if (activeRoom == null) return;
        String type=event.get("type").getAsString();
        var data=event.getAsJsonObject("payload");
        if (type.equals("ROOM_CLOSED")) { leaveRoom(); showMainMenu(); return; }
        if (type.equals("ERROR")) { lobbyStatus=data.get("code").getAsString(); if(cageLobbyScreen!=null)cageLobbyScreen.startRejected(); return; }
        if (!data.has("players")) return;
        activeRoom=RoomApiClient.parse(new com.badlogic.gdx.utils.JsonReader().parse(data.toString()),activeRoom.token());
        if (cageLobbyScreen != null) {
            cageLobbyScreen.synchronize(activeRoom, lobbyStatus);
            cageLobbyScreen.cages().onRoomEvent(data, realtime == null ? System.currentTimeMillis() : realtime.serverNow());
        }
        if(activeRoom.host() && type.equals("IMPOSTOR_LOBBY_RETURNED")){showImpostorLobby();return;}
        if(activeRoom.host() && (data.has("impostor") || data.has("impostorLobby")) && (type.equals("IMPOSTOR_STARTED") || type.equals("IMPOSTOR_REPLAY_READY") || type.equals("AUTHENTICATED"))){showImpostorLobby();return;}
        if(activeRoom.host() && data.has("phase") && data.get("phase").getAsString().equals("STARTING")){
            showRoomLobby();cageLobbyScreen.transition(data,realtime.serverNow());
            // Heavy scene construction is queued by the lobby only after a fully black frame.
        }
        if (activeRoom.host() && data.has("question") && (type.equals("QUESTION_STARTED") || type.equals("AUTHENTICATED") || getScreen()==cageLobbyScreen)) openNetworkPlay();
    }

    public void activateRoom(RoomSession room) {
        releaseImpostor();
        if (activeRoom != null && !activeRoom.token().equals(room.token()))
            roomApi.leave(activeRoom);
        if (realtime != null) realtime.close();
        if (playScreen != null) { if (getScreen()==playScreen) showMainMenu(); playScreen.dispose(); playScreen=null; }
        activeRoom = room;
        realtime=new com.erni.finalanswer.network.RealtimeClient(roomApi.baseUrl(),room.code(),room.token(),this::onRealtime,status -> lobbyStatus=status);
        pendingConfiguration = null;
        lobbyStatus = "lobby.waiting";
        showRoomLobby();
    }

    public void leaveRoom() {
        releaseImpostor();
        roomApi.leave(activeRoom);
        if (realtime != null) { realtime.close(); realtime=null; }
        if (playScreen != null) { if (getScreen()==playScreen) showMainMenu(); playScreen.dispose(); playScreen=null; }
        activeRoom = null;
        if (cageLobbyScreen != null) cageLobbyScreen.synchronize(null, "");
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
        roomApi.close();hosting.close();
        super.dispose();
        if (cageLobbyScreen != null) cageLobbyScreen.dispose();
        if (mainMenu != null) mainMenu.dispose();
        if (roomSettings != null) roomSettings.dispose();
        if (generationCode != null) generationCode.dispose();
        if (playScreen != null) playScreen.dispose();
        if (settingsScreen != null) settingsScreen.dispose();
        if (impostorScreen != null) impostorScreen.dispose();
    }
}
