package com.erni.finalanswer.ui.windows;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.InputListener;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.scenes.scene2d.actions.Actions;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.TextField;
import com.badlogic.gdx.scenes.scene2d.utils.BaseDrawable;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.buttons.PlayerCountSelector;

/** Original artwork with real text fields positioned inside its painted frames. */
public final class OptionsMainWindow extends Group implements Disposable {
    private final Texture texture;
    private final Texture pixel;
    private final BitmapFont font;
    private final BitmapFont hintFont;
    private final Image artwork;
    private final TextField roomName;
    private final TextField password;
    private final PlayerCountSelector playerCount;
    private boolean disposed;
    private float baseY;
    private float animationTime;
    private float quietTime = 3f;
    private float floatOffset;

    public OptionsMainWindow() {
        texture = new Texture(Gdx.files.internal("ui/windows/create_room/options_main.png"));
        texture.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
        artwork = new Image(texture);
        artwork.setTouchable(Touchable.disabled);
        addActor(artwork);
        setTouchable(Touchable.childrenOnly);

        font = createFont("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf", 32, true);
        hintFont = createFont("ui/fonts/NotoSans-Regular.ttf", 25, false);

        Pixmap white = new Pixmap(1, 1, Pixmap.Format.RGBA8888);
        white.setColor(Color.WHITE);
        white.fill();
        pixel = new Texture(white);
        white.dispose();
        TextureRegionDrawable solid = new TextureRegionDrawable(new TextureRegion(pixel));

        TextField.TextFieldStyle style = new TextField.TextFieldStyle();
        style.font = font;
        style.fontColor = new Color(0.96f, 0.91f, 0.86f, 1f);
        style.focusedFontColor = new Color(1f, 0.96f, 0.9f, 1f);
        style.messageFont = hintFont;
        style.messageFontColor = new Color(0.66f, 0.61f, 0.6f, 1f);
        style.background = padding(solid.tint(new Color(1, 1, 1, 0)));
        style.focusedBackground = padding(solid.tint(new Color(1, 0.45f, 0.25f, 0.04f)));
        style.selection = solid.tint(new Color(0.65f, 0.12f, 0.1f, 0.7f));
        style.cursor = solid.tint(new Color(1f, 0.75f, 0.5f, 1f));
        ((BaseDrawable) style.cursor).setMinWidth(2f);

        roomName = new TextField("", style);
        roomName.setName("roomName");
        roomName.setMessageText("Enter room name");
        roomName.setMaxLength(40);
        configure(roomName);
        addActor(roomName);

        password = new TextField("", style);
        password.setName("roomPassword");
        password.setMessageText("Optional");
        password.setMaxLength(64);
        password.setPasswordMode(true);
        password.setPasswordCharacter('\u2022');
        configure(password);
        addActor(password);

        playerCount = new PlayerCountSelector(() -> quietTime = 0);
        addActor(playerCount);
    }

    private static BitmapFont createFont(String path, int size, boolean shadow) {
        FreeTypeFontGenerator generator = new FreeTypeFontGenerator(Gdx.files.internal(path));
        try {
            FreeTypeFontGenerator.FreeTypeFontParameter parameters =
                new FreeTypeFontGenerator.FreeTypeFontParameter();
            parameters.size = size;
            StringBuilder characters = new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            for (char c = '\u00a0'; c <= '\u024f'; c++) characters.append(c);
            for (char c = '\u0400'; c <= '\u04ff'; c++) characters.append(c);
            characters.append('\u2022');
            parameters.characters = characters.toString();
            parameters.minFilter = Texture.TextureFilter.Linear;
            parameters.magFilter = Texture.TextureFilter.Linear;
            if (shadow) {
                parameters.shadowOffsetY = 1;
                parameters.shadowColor = new Color(0.02f, 0.01f, 0.02f, 0.75f);
            }
            return generator.generateFont(parameters);
        } finally {
            generator.dispose();
        }
    }

    @Override
    public void act(float delta) {
        super.act(delta);
        float dt = Math.max(0, Math.min(delta, 0.1f));
        animationTime += dt;
        quietTime += dt;
        // A short upward entrance; only vertical motion, keeping all fields aligned.
        float entrance = Interpolation.smoother.apply(Math.min(animationTime / 0.65f, 1f));
        float idle = Interpolation.smoother.apply(Math.min(Math.max((quietTime - 2.5f) / 1.5f, 0), 1));
        float target = (float) Math.sin(animationTime * Math.PI * 2 / 8f) * 1.8f * idle;
        floatOffset += (target - floatOffset) * (1 - (float) Math.exp(-dt / 0.4f));
        setY(baseY - 14f * (1 - entrance) + floatOffset * entrance);
    }

    private static BaseDrawable padding(com.badlogic.gdx.scenes.scene2d.utils.Drawable drawable) {
        BaseDrawable background = (BaseDrawable) drawable;
        background.setLeftWidth(18f);
        background.setRightWidth(18f);
        return background;
    }

    private void configure(TextField field) {
        field.setFocusTraversal(true);
        field.setBlinkTime(0.55f);
        field.addListener(new InputListener() {
            @Override
            public boolean keyTyped(InputEvent event, char character) {
                quietTime = 0;
                return false;
            }

            @Override
            public boolean keyDown(InputEvent event, int keycode) {
                quietTime = 0;
                return false;
            }

            @Override
            public boolean touchDown(InputEvent event, float x, float y, int pointer, int button) {
                quietTime = 0;
                return false;
            }
        });
        field.setTextFieldFilter((textField, character) -> !Character.isISOControl(character));
    }

    public void layoutIn(float screenWidth, float screenHeight) {
        float scale = Math.min((screenWidth - 160f) / texture.getWidth(),
            (screenHeight - 90f) / texture.getHeight());
        float width = texture.getWidth() * scale;
        float height = texture.getHeight() * scale;
        baseY = (screenHeight - height) / 2;
        setBounds((screenWidth - width) / 2, baseY, width, height);
        artwork.setBounds(0, 0, width, height);
        // Coordinates measured in the original PNG, with its origin at the top left.
        placeField(roomName, 236, 436, 778, 68, scale);
        placeField(password, 236, 986, 778, 68, scale);
        playerCount.layoutButtons(230 * scale, (texture.getHeight() - 619 - 90) * scale,
            794 * scale, 90 * scale);
    }

    private void placeField(TextField field, float x, float top, float width,
                            float height, float scale) {
        field.setBounds(x * scale, (texture.getHeight() - top - height) * scale,
            width * scale, height * scale);
    }

    public void focusName() {
        if (getStage() != null) getStage().setKeyboardFocus(roomName);
    }

    public String getRoomName() {
        return roomName.getText().trim();
    }

    public int getMaxPlayers() {
        return playerCount.getMaxPlayers();
    }

    public String getPassword() {
        return password.getText();
    }

    public void reveal() {
        clearActions();
        animationTime = 0;
        quietTime = 3f;
        floatOffset = 0;
        getColor().a = 0;
        addAction(Actions.fadeIn(0.65f, Interpolation.smoother));
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        texture.dispose();
        pixel.dispose();
        font.dispose();
        hintFont.dispose();
        playerCount.dispose();
    }
}
