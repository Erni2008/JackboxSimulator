package com.erni.finalanswer.screens;

import com.erni.finalanswer.ui.RuntimeTextures;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.InputListener;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.actions.Actions;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomCodeGenerator;
import com.erni.finalanswer.ui.buttons.generation.GenerateCodeButton;
import com.erni.finalanswer.ui.buttons.generation.BackButton;
import com.erni.finalanswer.ui.effects.GenerationCodeBackground;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.utils.Align;

public class GenerationCodeScreen extends ScreenAdapter {
    // Match the artwork and keep the code field centered on the board.
    private String generatedCode = "";    
    private final BitmapFont codeFont = createCodeFont();
    private final Label[] codelaLabels = new Label[4];

    private static final float WIDTH = 1672;
    private static final float HEIGHT = 941;
    private final FinalAnswerGame game;
    private final Stage stage = new Stage(new FitViewport(WIDTH, HEIGHT));
    private final GenerationCodeBackground background = new GenerationCodeBackground();
    private final GenerateCodeButton generateButton = new GenerateCodeButton();
    private final BackButton backButton = new BackButton();
    private final Texture codeFieldTexture = RuntimeTextures.load("ui/windows/generation_code/CodeField.png");
    private boolean leaving;
    private boolean disposed;

    public GenerationCodeScreen(FinalAnswerGame game) {
        this.game = java.util.Objects.requireNonNull(game, "game");
        background.setBounds(0, 0, WIDTH, HEIGHT);
        stage.addActor(background);
        float backWidth = 240;
        float backHeight = backWidth * 589f / 1999f;
        backButton.setBounds(32, HEIGHT - 32 - backHeight, backWidth, backHeight);
        backButton.setOnBack(this::returnToMenu);
        stage.addActor(backButton);
        codeFieldTexture.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
        Image codeField = new Image(codeFieldTexture);
        codeField.setName("codeField");
        codeField.setTouchable(Touchable.disabled);
        float fieldWidth = 680;
        float fieldHeight = fieldWidth * codeFieldTexture.getHeight() / codeFieldTexture.getWidth();
        float fieldY = 390;
        float fieldX = (WIDTH - fieldWidth) / 2;
        codeField.setBounds(fieldX, fieldY, fieldWidth, fieldHeight);
        stage.addActor(codeField);
        Label.LabelStyle codeStyle = new Label.LabelStyle(
        codeFont,
        Color.valueOf("F0E8DE")
        );
        for (int i = 0; i< codelaLabels.length; i++) {
            Label label = new Label("", codeStyle);
            label.setAlignment(Align.center);
            label.setTouchable(Touchable.disabled);

            float cellWidth = fieldWidth * 0.2f;
            float cellX = fieldX + fieldWidth * 0.1f + i * cellWidth;
            label.setBounds(cellX, fieldY, cellWidth, fieldHeight);

            codelaLabels[i] = label;
            stage.addActor(label);
        }
        float generateWidth = 470;
        float generateHeight = generateWidth * 586f / 2094f;
        generateButton.setBounds(fieldX + (fieldWidth - generateWidth) / 2,
            300 - generateHeight / 2, generateWidth, generateHeight);
        stage.addActor(generateButton);
        generateButton.setOnGenerate(() -> {
        generatedCode = RoomCodeGenerator.generate();

        for (int i = 0; i< codelaLabels.length; i++) {
            codelaLabels[i].setText(String.valueOf(generatedCode.charAt(i)));
        }
        Gdx.app.log("Final Answer", "Generated code: " + generatedCode);
    });
        stage.addListener(new InputListener() {
            @Override
            public boolean keyDown(InputEvent event, int keycode) {
                if (keycode != Input.Keys.ESCAPE) return false;
                returnToMenu();
                return true;
            }
        });
    }
    private static BitmapFont createCodeFont() { 
        FreeTypeFontGenerator generator = new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/RoadRage-Regular.ttf"));
        try {
        FreeTypeFontGenerator.FreeTypeFontParameter parameters =
            new FreeTypeFontGenerator.FreeTypeFontParameter();

        parameters.size = 112;
        parameters.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        parameters.minFilter = Texture.TextureFilter.Linear;
        parameters.magFilter = Texture.TextureFilter.Linear;

        return generator.generateFont(parameters);
    } finally {
        generator.dispose();
    }
}


    private void returnToMenu() {
        if (leaving || disposed) return;
        leaving = true;
        Gdx.app.postRunnable(() -> {
            if (disposed || game.getScreen() != this) return;
            game.showMainMenu();
        });
    }

    @Override
    public void show() {
        leaving = false;
        Gdx.input.setInputProcessor(stage);
        stage.getRoot().clearActions();
        stage.getRoot().getColor().a = 0;
        stage.getRoot().addAction(Actions.fadeIn(0.18f, Interpolation.smoother));
    }

    @Override
    public void render(float delta) {
        ScreenUtils.clear(0, 0, 0, 1);
        stage.getViewport().apply();
        stage.act(Math.max(0, Math.min(delta, 0.1f)));
        stage.draw();
    }

    @Override
    public void resize(int width, int height) {
        stage.getViewport().update(width, height, true);
    }

    @Override
    public void hide() {
        if (Gdx.input.getInputProcessor() == stage) Gdx.input.setInputProcessor(null);
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        hide();
        stage.dispose();
        generateButton.dispose();
        backButton.dispose();
        background.dispose();
        codeFieldTexture.dispose();
        codeFont.dispose();
    }
}
