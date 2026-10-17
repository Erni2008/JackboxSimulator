package com.erni.finalanswer.screens;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.InputListener;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.scenes.scene2d.actions.Actions;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomCodeGenerator;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.localization.Localization;
import com.erni.finalanswer.ui.RuntimeTextures;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.buttons.generation.BackButton;
import com.erni.finalanswer.ui.buttons.generation.ConfirmCodeButton;
import com.erni.finalanswer.ui.buttons.generation.GenerateCodeButton;
import com.erni.finalanswer.ui.buttons.generation.RerollButton;
import com.erni.finalanswer.ui.effects.GenerationCodeBackground;

public class GenerationCodeScreen extends ScreenAdapter {
    // Match the artwork and keep the code field centered on the board.
    private String generatedCode = "";
    private final BitmapFont codeFont = createCodeFont();
    private final Label[] codeLabels = new Label[4];

    private static final float WIDTH = 1672;
    private static final float HEIGHT = 941;
    private final FinalAnswerGame game;
    private final Stage stage = new Stage(new FitViewport(WIDTH, HEIGHT));
    private final GenerationCodeBackground background = new GenerationCodeBackground();
    private final GenerateCodeButton generateButton = new GenerateCodeButton();
    private final RerollButton rerollButton = new RerollButton();
    private final BackButton backButton = new BackButton();
    private final Texture codeFieldTexture =
            RuntimeTextures.load("ui/windows/generation_code/CodeField.png");
    private final ConfirmCodeButton confirmButton =
            new ConfirmCodeButton(codeFont, this::confirmCode);
    private final BitmapFont statusFont = UiFonts.body(22);
    private final Label status =
            new Label("", new Label.LabelStyle(statusFont, Color.valueOf("F0E8DE")));
    private RoomSession createdRoom;
    private int requestVersion;
    private boolean generating;
    private boolean heartbeatPending;
    private float heartbeatTimer;
    private final Localization texts = new Localization("en");
    private String statusKey = "code.generate_hint";
    private String statusError;
    public void setLanguage(String language) {
        texts.setLanguage(language);
        status.setText(statusError == null ? texts.get(statusKey) : texts.error(statusError));
    }
    public void setReducedMotion(boolean enabled) { background.setReducedMotion(enabled); }
    private void setStatus(String key) { statusKey = key; statusError = null; status.setText(texts.get(key)); }
    private void setError(String error) { statusError = error; status.setText(texts.error(error)); }
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
        Label.LabelStyle codeStyle = new Label.LabelStyle(codeFont, Color.valueOf("F0E8DE"));
        for (int i = 0; i < codeLabels.length; i++) {
            Label label = new Label("", codeStyle);
            label.setAlignment(Align.center);
            label.setTouchable(Touchable.disabled);

            float cellWidth = fieldWidth * 0.2f;
            float cellX = fieldX + fieldWidth * 0.1f + i * cellWidth;
            label.setBounds(cellX, fieldY, cellWidth, fieldHeight);

            codeLabels[i] = label;
            stage.addActor(label);
        }
        float generateWidth = 470;
        float generateHeight = generateWidth * 586f / 2094f;
        generateButton.setBounds(
                fieldX + (fieldWidth - generateWidth) / 2,
                300 - generateHeight / 2,
                generateWidth,
                generateHeight);
        stage.addActor(generateButton);
        generateButton.setOnGenerate(this::generateCode);
        rerollButton.setBounds(fieldX + fieldWidth + 8, fieldY + (fieldHeight - 108) / 2, 116, 108);
        rerollButton.setVisible(false);
        rerollButton.setOnReroll(this::rerollCode);
        stage.addActor(rerollButton);
        confirmButton.setBounds((WIDTH - 300) / 2, 250, 300, 100);
        confirmButton.setVisible(false);
        rerollButton.setVisible(false);
        rerollButton.setDisabled(false);
        backButton.setDisabled(false);
        stage.addActor(confirmButton);
        status.setName("codeGenerationStatus");
        status.setAlignment(Align.center);
        status.setWrap(true);
        status.setBounds((WIDTH - 860) / 2, 192, 860, 52);
        status.setTouchable(Touchable.disabled);
        stage.addActor(status);
        stage.addListener(
                new InputListener() {
                    @Override
                    public boolean keyDown(InputEvent event, int keycode) {
                        if (keycode == Input.Keys.ENTER) {
                            if (confirmButton.isVisible() && !confirmButton.isDisabled())
                                confirmCode();
                            else if (generateButton.isVisible() && !generateButton.isDisabled())
                                generateCode();
                            return true;
                        }
                        if (keycode != Input.Keys.ESCAPE) return false;
                        returnToMenu();
                        return true;
                    }
                });
    }

    private static BitmapFont createCodeFont() {
        FreeTypeFontGenerator generator =
                new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/RoadRage-Regular.ttf"));
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

    public void prepareForCreation() {
        requestVersion++;
        game.getRoomApi().leave(createdRoom);
        createdRoom = null;
        generating = false;
        heartbeatPending = false;
        generatedCode = "";
        for (Label label : codeLabels) label.setText("");
        generateButton.setVisible(true);
        generateButton.setDisabled(false);
        confirmButton.setVisible(false);
        setStatus(game.getPendingConfiguration() == null ? "code.preview_hint" : "code.generate_hint");
    }

    private void generateCode() {
        if (generating || createdRoom != null) return;
        var configuration = game.getPendingConfiguration();
        if (configuration == null) {
            displayCode(nextCode());
            setStatus("code.preview_ready");
            return;
        }
        generating = true;
        generateButton.setDisabled(true);
        setStatus("code.creating");
        int version = ++requestVersion;
        game.getRoomApi()
                .create(
                        configuration,
                        RoomCodeGenerator.generate(),
                        room -> {
                            if (disposed || version != requestVersion) {
                                game.getRoomApi().leave(room);
                                return;
                            }
                            generating = false;
                            createdRoom = room;
                            displayCode(room.code());
                            generateButton.setVisible(false);
                            confirmButton.setVisible(true);
                            confirmButton.setDisabled(false);
                            heartbeatTimer = 0;
                            setStatus("code.ready");
                        },
                        error -> {
                            if (disposed || version != requestVersion) return;
                            generating = false;
                            generateButton.setDisabled(false);
                            setError(error);
                        });
    }

    private void displayCode(String code) {
        generatedCode = code;
        rerollButton.setVisible(true);
        for (int i = 0; i < codeLabels.length; i++)
            codeLabels[i].setText(String.valueOf(code.charAt(i)));
    }

    private String nextCode() {
        String code;
        do { code = RoomCodeGenerator.generate(); } while (code.equals(generatedCode));
        return code;
    }

    private void rerollCode() {
        if (generating || leaving || generatedCode.isEmpty()) return;
        if (createdRoom == null) {
            displayCode(nextCode());
            setStatus("code.preview_ready");
            return;
        }
        generating = true;
        heartbeatPending = false;
        int version = ++requestVersion;
        rerollButton.setDisabled(true);
        confirmButton.setDisabled(true);
        backButton.setDisabled(true);
        setStatus("code.rerolling");
        game.getRoomApi().reroll(createdRoom, nextCode(), room -> {
            if (disposed || version != requestVersion) {
                game.getRoomApi().leave(room);
                return;
            }
            createdRoom = room;
            displayCode(room.code());
            finishReroll();
            setStatus("code.ready");
        }, error -> {
            if (disposed || version != requestVersion) return;
            finishReroll();
            setError(error);
        });
    }

    private void finishReroll() {
        generating = false;
        heartbeatTimer = 0;
        rerollButton.setDisabled(false);
        confirmButton.setDisabled(false);
        backButton.setDisabled(false);
    }

    private void confirmCode() {
        if (createdRoom == null || leaving || generating) return;
        leaving = true;
        RoomSession room = createdRoom;
        createdRoom = null;
        requestVersion++;
        Gdx.app.postRunnable(
                () -> {
                    if (!disposed) game.activateRoom(room);
                });
    }

    private void keepDraftAlive(float delta) {
        if (createdRoom == null || heartbeatPending || generating) return;
        heartbeatTimer += Math.max(0, Math.min(delta, 0.1f));
        if (heartbeatTimer < 2) return;
        heartbeatTimer = 0;
        heartbeatPending = true;
        int version = requestVersion;
        game.getRoomApi()
                .heartbeat(
                        createdRoom,
                        updated -> {
                            if (disposed || version != requestVersion) return;
                            heartbeatPending = false;
                            createdRoom = updated;
                            confirmButton.setDisabled(false);
                            setStatus("code.ready");
                        },
                        error -> {
                            if (disposed || version != requestVersion) return;
                            heartbeatPending = false;
                            confirmButton.setDisabled(true);
                            setError(error);
                        });
    }

    private void returnToMenu() {
        if (leaving || disposed || (generating && createdRoom != null)) return;
        leaving = true;
        requestVersion++;
        game.getRoomApi().leave(createdRoom);
        createdRoom = null;
        game.discardPendingConfiguration();
        Gdx.app.postRunnable(
                () -> {
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
        keepDraftAlive(delta);
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
        rerollButton.dispose();
        backButton.dispose();
        background.dispose();
        codeFieldTexture.dispose();
        confirmButton.dispose();
        statusFont.dispose();
        codeFont.dispose();
    }
}
