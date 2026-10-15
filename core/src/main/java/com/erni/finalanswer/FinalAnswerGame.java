package com.erni.finalanswer;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;

import com.erni.finalanswer.utils.DisplayManager;
import com.erni.finalanswer.screens.MainMenu;

public class FinalAnswerGame extends Game {

    private DisplayManager displayManager;

    @Override
    public void create() {

        displayManager = new DisplayManager();

        setScreen(new MainMenu(this));

    }

    @Override
    public void render() {

        // Global fullscreen shortcut
        if (Gdx.input.isKeyJustPressed(Input.Keys.F11)) {

            displayManager.toggleFullscreen();

        }

        // Render current game screen
        super.render();
    }

    @Override
    public void dispose() {

        if (getScreen() != null) {

            getScreen().dispose();

        }

        super.dispose();
    }
}