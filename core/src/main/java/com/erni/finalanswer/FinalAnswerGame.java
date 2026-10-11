package com.erni.finalanswer;

import com.badlogic.gdx.Game;

public class FinalAnswerGame extends Game {

    @Override
    public void create() {
        setScreen(new MainMenu(this));
    }
}