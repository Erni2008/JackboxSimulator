package com.erni.finalanswer;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.erni.finalanswer.utils.DisplayManager;
import com.erni.finalanswer.screens.MainMenu;
import com.erni.finalanswer.screens.RoomSettingsScreen;
import com.erni.finalanswer.screens.GenerationCodeScreen;

/** Owns the three menu screens; navigation never reloads textures or fonts. */
public class FinalAnswerGame extends Game {
    private DisplayManager displayManager;
    private MainMenu mainMenu;
    private RoomSettingsScreen roomSettings;
    private GenerationCodeScreen generationCode;

    @Override
    public void create() {
        displayManager = new DisplayManager();
        // Warm the bounded menu cache before enabling input on the first screen.
        // Display-sized textures keep the three screens smaller than the former full-size UI.
        mainMenu = new MainMenu(this);
        roomSettings = new RoomSettingsScreen(this);
        generationCode = new GenerationCodeScreen(this);
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
        setScreen(generationCode);
    }

    @Override
    public void render() {
        if (Gdx.input.isKeyJustPressed(Input.Keys.F11)) displayManager.toggleFullscreen();
        super.render();
    }

    @Override
    public void dispose() {
        // Game.dispose hides the current screen but does not dispose cached screens.
        super.dispose();
        if (mainMenu != null) mainMenu.dispose();
        if (roomSettings != null) roomSettings.dispose();
        if (generationCode != null) generationCode.dispose();
    }
}
