package com.erni.finalanswer.screens;

import com.erni.finalanswer.ui.RuntimeTextures;
import com.badlogic.gdx.Gdx;
import com.erni.finalanswer.FinalAnswerGame;
import com.badlogic.gdx.ScreenAdapter;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.OrthographicCamera;

import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.math.MathUtils;

import com.badlogic.gdx.utils.ScreenUtils;

import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.ScreenViewport;

import com.badlogic.gdx.scenes.scene2d.Stage;

import com.erni.finalanswer.ui.effects.TableCandle;
import com.erni.finalanswer.ui.lobby.LobbyPanel;
import com.erni.finalanswer.ui.buttons.menu.AnimatedImageButton;
import com.erni.finalanswer.ui.buttons.menu.PlayButton;
import com.erni.finalanswer.ui.buttons.menu.CreateRoomButton;
import com.erni.finalanswer.ui.buttons.menu.GenerationCodeButton;
import com.erni.finalanswer.ui.buttons.menu.SettingsButton;
import com.erni.finalanswer.ui.buttons.menu.ExitButton;

public class MainMenu extends ScreenAdapter {

    private static final float UI_WIDTH = 1920;
    private static final float UI_HEIGHT = 1080;
    private static final float MENU_LEFT = 90;
    private static final float MENU_TOP = 650;
    private static final float MENU_WIDTH = 660;
    private static final float MENU_BUTTON_WIDTH = 500;
    // PNG содержат прозрачные поля: шаг задаём по видимой рамке.
    private static final float MENU_ROW_STEP = 110;

    private final SpriteBatch batch;
    private final Texture background;
    private final TableCandle tableCandle;
    private final Texture titleShade;
    private final Texture titleLogo;
    private float titleTime;
    private boolean disposed;
    private boolean firstShow = true;
    private final FinalAnswerGame game;
    private final LobbyPanel lobbyPanel;

    // Сцена рисует кнопки и обрабатывает их нажатия.
    private final Stage menuStage;

    // Шрифты меню и отдельная кнопка PLAY.
    private final PlayButton playButton;
    private final CreateRoomButton createRoomButton;
    private final AnimatedImageButton[] menuButtons;

    private final OrthographicCamera backgroundCamera;

    private final ScreenViewport backgroundViewport;
    private final FitViewport uiViewport;


    public MainMenu(FinalAnswerGame receivedGame) {
        game = receivedGame;

        batch = new SpriteBatch();
        tableCandle = new TableCandle();

        titleLogo = RuntimeTextures.load("ui/Final_Answer.png");
        titleLogo.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);


        // Load background
        background = RuntimeTextures.load("backgrounds/main_screen_background.png");

        background.setFilter(
            Texture.TextureFilter.Linear,
            Texture.TextureFilter.Linear
        );


        // A fading scrim preserves the artwork while keeping the title readable.
        Pixmap shade = new Pixmap(1, 256, Pixmap.Format.RGBA8888);
        shade.setBlending(Pixmap.Blending.None);
        for (int y = 0; y < 256; y++) {
            float opacity = 0.78f * (1f - y / 255f) * (1f - y / 255f);
            shade.setColor(0.025f, 0.018f, 0.04f, opacity);
            shade.drawPixel(0, y);
        }
        titleShade = new Texture(shade);
        titleShade.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
        shade.dispose();

        // Background camera
        backgroundCamera = new OrthographicCamera();

        backgroundViewport = new ScreenViewport(
            backgroundCamera
        );

        // UI viewport
        uiViewport = new FitViewport(
            UI_WIDTH,
            UI_HEIGHT
        );

        // Кнопки используют те же координаты 1920 × 1080, что и логотип.
        menuStage = new Stage(uiViewport);

        // Создаём PLAY с её собственным обработчиком нажатия.
        lobbyPanel = new LobbyPanel(game);
        lobbyPanel.setBounds(1010, 240, 800, 650);
        playButton = new PlayButton(this::requestPlay);

        // Добавляем кнопку на сцену, чтобы она могла отображаться.
        menuStage.addActor(playButton);

        // Следующая кнопка столбика имеет свой класс и собственные изображения.
        createRoomButton = new CreateRoomButton(receivedGame);
        menuStage.addActor(createRoomButton);

        menuButtons = new AnimatedImageButton[] {
            playButton, createRoomButton, new GenerationCodeButton(receivedGame),
            new SettingsButton(game::showSettings), new ExitButton()
        };
        for (int i = 2; i < menuButtons.length; i++) {
            menuStage.addActor(menuButtons[i]);
        }

        menuStage.addActor(lobbyPanel);
        resize(
            Gdx.graphics.getWidth(),
            Gdx.graphics.getHeight()
        );
    }


    @Override
    public void show() {

        // Keep the initial reveal; returning to a cached menu is immediate.
        titleTime = firstShow && !game.getSettings().reducedMotion() ? 0 : 1;
        for (AnimatedImageButton button : menuButtons) {
            if (firstShow && !game.getSettings().reducedMotion()) button.restartEntrance();
            else button.showImmediately();
        }
        firstShow = false;
        // Направляем мышь и нажатия на сцену с кнопками.
        Gdx.input.setInputProcessor(menuStage);
    }


    @Override
    public void hide() {

        // При уходе с меню отключаем его ввод, не затрагивая чужой обработчик.
        if (Gdx.input.getInputProcessor() == menuStage) {
            Gdx.input.setInputProcessor(null);
        }
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

        tableCandle.draw(batch, game.getSettings().reducedMotion() ? 0 : delta, drawX, drawY, drawWidth, drawHeight);
        batch.end();

        // Draw the title last, in resolution-independent UI coordinates.

        uiViewport.apply();

        batch.setProjectionMatrix(
            uiViewport.getCamera().combined
        );

        batch.begin();
        batch.setColor(1f, 1f, 1f, 1f);
        batch.draw(titleShade, 0, UI_HEIGHT - 520, 900, 520);

        // The illustrated emblem enters softly and floats almost imperceptibly.
        titleTime += Math.min(delta, 0.1f);
        float entrance = game.getSettings().reducedMotion() ? 1 : Interpolation.smooth.apply(MathUtils.clamp(titleTime / 0.8f, 0f, 1f));
        float logoWidth = 660;
        float logoHeight = logoWidth * titleLogo.getHeight() / titleLogo.getWidth();
        float logoY = UI_HEIGHT - 40 - logoHeight;
        logoY += (1f - entrance) * 14f + MathUtils.sin(titleTime * 1.15f) * (game.getSettings().reducedMotion() ? 0 : 2f);
        batch.setColor(1f, 1f, 1f, entrance);
        batch.draw(titleLogo, 90, logoY, logoWidth, logoHeight);
        batch.setColor(1f, 1f, 1f, 1f);
        batch.end();

        // Положение задаём каждый кадр: метод удобно менять через Live Debug.
        updateMenuLayout();

        // Восстанавливаем область интерфейса перед отрисовкой кнопок.
        uiViewport.apply();

        // Обновляем сцену и рисуем кнопку поверх фона.
        // Stage рисует самостоятельно, поэтому вызов идёт после batch.end().
        lobbyPanel.update(game.getActiveRoom(), game.getLobbyStatus());
        menuStage.act(Math.min(delta, 0.1f));
        menuStage.draw();

    }


    public void setLanguage(String language) { lobbyPanel.setLanguage(language); }

    private void requestPlay() {
        if (game.getActiveRoom() == null) {
            lobbyPanel.showRoomRequired(menuStage);
            return;
        }

        Gdx.app.postRunnable(() -> {
            if (game.getScreen() == this) {
                game.showPlayScreen();
            }
        });
    }

    private void updateMenuLayout() {
        // Один столбик по центру логотипа; пропорции изображений сохраняются.
        float top = MENU_TOP;
        float left = MENU_LEFT + (MENU_WIDTH - MENU_BUTTON_WIDTH) / 2f;
        for (AnimatedImageButton button : menuButtons) {
            float height = MENU_BUTTON_WIDTH * button.getImageAspectRatio();
            button.setBounds(left, top - height, MENU_BUTTON_WIDTH, height);
            top -= MENU_ROW_STEP;
        }
    }


    @Override
    public void resize(int width, int height) {

        backgroundViewport.update(width, height, true);

        uiViewport.update(width, height, true);
    }


    @Override
    public void dispose() {

        // Защита от повторного освобождения одного экрана.
        if (disposed) return;
        disposed = true;

        // Отключаем ввод меню перед освобождением его ресурсов.
        hide();

        // Stage освобождает свой Batch, но картинки PLAY освобождаем отдельно.
        lobbyPanel.dispose();
        menuStage.dispose();
        for (AnimatedImageButton button : menuButtons) {
            button.dispose();
        }

        batch.dispose();

        titleLogo.dispose();

        tableCandle.dispose();
        background.dispose();
        titleShade.dispose();
    }

}
