package com.erni.finalanswer.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.effects.CyclingRoomBackground;
import com.erni.finalanswer.ui.windows.OptionsMainWindow;

public class RoomSettingsScreen extends ScreenAdapter {
    private static final float UI_WIDTH = 1920;
    private static final float UI_HEIGHT = 1080;

    private final CyclingRoomBackground background = new CyclingRoomBackground();
    private final Stage stage = new Stage(new FitViewport(UI_WIDTH, UI_HEIGHT));
    private final OptionsMainWindow optionsWindow = new OptionsMainWindow();
    private boolean disposed;

    public RoomSettingsScreen() {
        stage.addActor(optionsWindow);
        optionsWindow.layoutIn(UI_WIDTH, UI_HEIGHT);
    }

    @Override
    public void show() {
        Gdx.input.setInputProcessor(stage);
        optionsWindow.reveal();
        optionsWindow.focusName();
    }

    @Override
    public void hide() {
        if (Gdx.input.getInputProcessor() == stage) {
            Gdx.input.setInputProcessor(null);
        }
    }

    @Override
    public void render(float delta) {
        ScreenUtils.clear(0.04f, 0.02f, 0.03f, 1f);
        background.render(delta);
        stage.getViewport().apply();
        stage.act(Math.min(delta, 0.1f));
        stage.draw();
    }

    @Override
    public void resize(int width, int height) {
        background.resize(width, height);
        stage.getViewport().update(width, height, true);
        optionsWindow.layoutIn(UI_WIDTH, UI_HEIGHT);
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        hide();
        stage.dispose();
        optionsWindow.dispose();
        background.dispose();
    }
}
