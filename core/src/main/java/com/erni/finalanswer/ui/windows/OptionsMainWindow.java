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
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.scenes.scene2d.actions.Actions;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.TextField;
import com.badlogic.gdx.scenes.scene2d.utils.BaseDrawable;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Disposable;

/** Original artwork with real text fields positioned inside its painted frames. */
public final class OptionsMainWindow extends Group implements Disposable {
    private final Texture texture;
    private final Texture pixel;
    private final BitmapFont font;
    private final Image artwork;
    private final TextField roomName;
    private final TextField password;
    private boolean disposed;

    public OptionsMainWindow() {
        texture = new Texture(Gdx.files.internal("ui/windows/create_room/options_main.png"));
        texture.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
        artwork = new Image(texture);
        artwork.setTouchable(Touchable.disabled);
        addActor(artwork);
        setTouchable(Touchable.childrenOnly);

        FreeTypeFontGenerator generator = new FreeTypeFontGenerator(
            Gdx.files.internal("ui/fonts/NotoSans-Regular.ttf"));
        try {
            FreeTypeFontGenerator.FreeTypeFontParameter parameters =
                new FreeTypeFontGenerator.FreeTypeFontParameter();
            parameters.size = 30;
            StringBuilder characters = new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            for (char c = '\u00a0'; c <= '\u024f'; c++) characters.append(c);
            for (char c = '\u0400'; c <= '\u04ff'; c++) characters.append(c);
            characters.append('\u2022');
            parameters.characters = characters.toString();
            parameters.minFilter = Texture.TextureFilter.Linear;
            parameters.magFilter = Texture.TextureFilter.Linear;
            font = generator.generateFont(parameters);
        } finally {
            generator.dispose();
        }

        Pixmap white = new Pixmap(1, 1, Pixmap.Format.RGBA8888);
        white.setColor(Color.WHITE);
        white.fill();
        pixel = new Texture(white);
        white.dispose();
        TextureRegionDrawable solid = new TextureRegionDrawable(new TextureRegion(pixel));

        TextField.TextFieldStyle style = new TextField.TextFieldStyle();
        style.font = font;
        style.fontColor = new Color(1f, 0.93f, 0.87f, 1f);
        style.messageFont = font;
        style.messageFontColor = new Color(0.7f, 0.65f, 0.65f, 1f);
        style.background = padding(solid.tint(new Color(1, 1, 1, 0)));
        style.focusedBackground = padding(solid.tint(new Color(1, 0.45f, 0.25f, 0.04f)));
        style.selection = solid.tint(new Color(0.65f, 0.12f, 0.1f, 0.7f));
        style.cursor = solid.tint(new Color(1f, 0.75f, 0.5f, 1f));
        ((BaseDrawable) style.cursor).setMinWidth(2f);

        roomName = new TextField("", style);
        roomName.setName("roomName");
        roomName.setMessageText("Название комнаты");
        roomName.setMaxLength(40);
        configure(roomName);
        addActor(roomName);

        password = new TextField("", style);
        password.setName("roomPassword");
        password.setMessageText("Необязательно");
        password.setMaxLength(64);
        password.setPasswordMode(true);
        password.setPasswordCharacter('\u2022');
        configure(password);
        addActor(password);
    }

    private static BaseDrawable padding(com.badlogic.gdx.scenes.scene2d.utils.Drawable drawable) {
        BaseDrawable background = (BaseDrawable) drawable;
        background.setLeftWidth(14f);
        background.setRightWidth(14f);
        return background;
    }

    private static void configure(TextField field) {
        field.setFocusTraversal(true);
        field.setBlinkTime(0.55f);
        field.setTextFieldFilter((textField, character) -> !Character.isISOControl(character));
    }

    public void layoutIn(float screenWidth, float screenHeight) {
        float scale = Math.min((screenWidth - 160f) / texture.getWidth(),
            (screenHeight - 90f) / texture.getHeight());
        float width = texture.getWidth() * scale;
        float height = texture.getHeight() * scale;
        setBounds((screenWidth - width) / 2, (screenHeight - height) / 2, width, height);
        artwork.setBounds(0, 0, width, height);
        // Coordinates measured in the original PNG, with its origin at the top left.
        placeField(roomName, 236, 436, 778, 68, scale);
        placeField(password, 236, 986, 778, 68, scale);
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

    public String getPassword() {
        return password.getText();
    }

    public void reveal() {
        clearActions();
        getColor().a = 0;
        addAction(Actions.fadeIn(0.45f, Interpolation.smooth));
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        texture.dispose();
        pixel.dispose();
        font.dispose();
    }
}
