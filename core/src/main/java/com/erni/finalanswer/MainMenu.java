package com.erni.finalanswer;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.ScreenAdapter;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.OrthographicCamera;

import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

import com.badlogic.gdx.utils.ScreenUtils;

import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.ScreenViewport;

public class MainMenu extends ScreenAdapter {

    private static final float UI_WIDTH = 1920;
    private static final float UI_HEIGHT = 1080;

    private final FinalAnswerGame game;

    private final SpriteBatch batch;
    private final BitmapFont font;
    private final Texture background;

    private final OrthographicCamera backgroundCamera;

    private final ScreenViewport backgroundViewport;
    private final FitViewport uiViewport;

    public MainMenu(FinalAnswerGame receivedGame) {

        this.game = receivedGame;

        batch = new SpriteBatch();

        font = new BitmapFont();

        background = new Texture(
            Gdx.files.internal("backgrounds/main_image_background.png")
        );

        background.setFilter(
            Texture.TextureFilter.Linear,
            Texture.TextureFilter.Linear
        );

        backgroundCamera = new OrthographicCamera();

        backgroundViewport = new ScreenViewport(
            backgroundCamera
        );

        uiViewport = new FitViewport(
            UI_WIDTH,
            UI_HEIGHT
        );

        resize(
            Gdx.graphics.getWidth(),
            Gdx.graphics.getHeight()
        );
    }

    @Override
    public void render(float delta) {

        ScreenUtils.clear(0.05f, 0.03f, 0.08f, 1f);

        // 1. Draw background
        backgroundViewport.apply();

        batch.setProjectionMatrix(
            backgroundCamera.combined
        );

        float screenWidth = backgroundViewport.getWorldWidth();
        float screenHeight = backgroundViewport.getWorldHeight();

        float imageWidth = background.getWidth();
        float imageHeight = background.getHeight();

        float scale = Math.max(
            screenWidth / imageWidth,
            screenHeight / imageHeight
        );

        float drawWidth = imageWidth * scale;
        float drawHeight = imageHeight * scale;

        float drawX = (screenWidth - drawWidth) / 2;
        float drawY = (screenHeight - drawHeight) / 2;

        batch.begin();

        batch.draw(
            background,
            drawX,
            drawY,
            drawWidth,
            drawHeight
        );

        batch.end();

        // 2. Draw UI
        uiViewport.apply();

        batch.setProjectionMatrix(
            uiViewport.getCamera().combined
        );

        batch.begin();

        font.getData().setScale(4f);

        font.draw(
            batch,
            "FINAL ANSWER",
            100,
            900
        );

        batch.end();
    }

    @Override
    public void resize(int width, int height) {

        backgroundViewport.update(width, height, true);

        uiViewport.update(width, height, true);
    }

    @Override
    public void dispose() {

        batch.dispose();

        font.dispose();

        background.dispose();
    }
}