package com.erni.finalanswer;

import com.badlogic.gdx.Gdx;
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

import com.erni.finalanswer.ui.GameFonts;
import com.erni.finalanswer.ui.buttons.AnimatedImageButton;
import com.erni.finalanswer.ui.buttons.PlayButton;
import com.erni.finalanswer.ui.buttons.CreateRoomButton;

public class MainMenu extends ScreenAdapter {

    private static final float UI_WIDTH = 1920;
    private static final float UI_HEIGHT = 1080;
    private static final float MENU_LEFT = 90;
    private static final float MENU_TOP = 620;
    private static final float MENU_WIDTH = 660;
    private static final float MENU_BUTTON_WIDTH = 420;
    private static final float MENU_ROW_GAP = 12;

    private final SpriteBatch batch;
    private final Texture background;
    private final Texture titleShade;
    private final Texture titleLogo;
    private float titleTime;
    private boolean disposed;

    // Сцена рисует кнопки и обрабатывает их нажатия.
    private final Stage menuStage;

    // Шрифты меню и отдельная кнопка PLAY.
    private final GameFonts fonts;
    private final PlayButton playButton;
    private final CreateRoomButton createRoomButton;

    private final OrthographicCamera backgroundCamera;

    private final ScreenViewport backgroundViewport;
    private final FitViewport uiViewport;


    public MainMenu(FinalAnswerGame receivedGame) {

        batch = new SpriteBatch();

        titleLogo = new Texture(Gdx.files.internal("ui/Final_Answer.png"));
        titleLogo.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);


        // Load background
        background = new Texture(
            Gdx.files.internal("backgrounds/main_screen_background.png")
        );

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

        // Создаём шрифты после запуска графического контекста игры.
        fonts = new GameFonts();

        // Кнопки используют те же координаты 1920 × 1080, что и логотип.
        menuStage = new Stage(uiViewport);

        // Создаём PLAY с её собственным обработчиком нажатия.
        playButton = new PlayButton(fonts.buttonFont);

        // Добавляем кнопку на сцену, чтобы она могла отображаться.
        menuStage.addActor(playButton);

        // Следующая кнопка столбика имеет свой класс и собственные изображения.
        createRoomButton = new CreateRoomButton();
        menuStage.addActor(createRoomButton);

        resize(
            Gdx.graphics.getWidth(),
            Gdx.graphics.getHeight()
        );
    }


    @Override
    public void show() {

        // При возвращении в меню заново запускаем плавное появление.
        titleTime = 0;
        playButton.restartEntrance();
        createRoomButton.restartEntrance();
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
        float entrance = Interpolation.smooth.apply(MathUtils.clamp(titleTime / 0.8f, 0f, 1f));
        float logoWidth = 660;
        float logoHeight = logoWidth * titleLogo.getHeight() / titleLogo.getWidth();
        float logoY = UI_HEIGHT - 40 - logoHeight;
        logoY += (1f - entrance) * 14f + MathUtils.sin(titleTime * 1.15f) * 2f;
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
        menuStage.act(Math.min(delta, 0.1f));
        menuStage.draw();

    }


    private void updateMenuLayout() {
        // Один столбик по центру логотипа; пропорции изображений сохраняются.
        positionMenuButton(playButton, 0);
        positionMenuButton(createRoomButton, 1);
    }

    private void positionMenuButton(AnimatedImageButton button, int slot) {
        float width = MENU_BUTTON_WIDTH;
        float height = width * button.getImageAspectRatio();
        float rowHeight = width * Math.max(playButton.getImageAspectRatio(),
            createRoomButton.getImageAspectRatio());
        float left = MENU_LEFT + (MENU_WIDTH - width) / 2f;
        float top = MENU_TOP - slot * (rowHeight + MENU_ROW_GAP);
        button.setBounds(left, top - height, width, height);
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
        menuStage.dispose();
        playButton.dispose();
        createRoomButton.dispose();
        fonts.dispose();

        batch.dispose();

        titleLogo.dispose();

        background.dispose();
        titleShade.dispose();
    }
}
