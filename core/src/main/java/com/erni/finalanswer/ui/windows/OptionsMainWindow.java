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
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.utils.BaseDrawable;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.buttons.room.PlayerCountSelector;
import com.erni.finalanswer.ui.buttons.room.ConfirmCreateButton;
import com.erni.finalanswer.ui.buttons.room.CancelRoomButton;
import java.util.function.Consumer;
import java.util.Objects;
import com.erni.finalanswer.ui.buttons.room.GameModeSelector;
import com.erni.finalanswer.rooms.GameMode;
import com.erni.finalanswer.rooms.RoomConfiguration;
import com.badlogic.gdx.scenes.scene2d.utils.UIUtils;

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
    private final GameModeSelector gameMode;
    private final ConfirmCreateButton createButton;
    private final CancelRoomButton cancelButton;
    private Runnable onCancel = () -> {};
    private final Label validationMessage;
    private Consumer<RoomConfiguration> onCreate = configuration -> {};
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

        gameMode = new GameModeSelector(font, hintFont, () -> quietTime = 0);
        addActor(gameMode);
        validationMessage = new Label("", new Label.LabelStyle(hintFont,
            new Color(1f, 0.43f, 0.35f, 1)));
        validationMessage.setName("roomValidationMessage");
        validationMessage.setAlignment(com.badlogic.gdx.utils.Align.center);
        validationMessage.setTouchable(Touchable.disabled);
        addActor(validationMessage);
        createButton = new ConfirmCreateButton(this::requestCreation);
        addActor(createButton);
        cancelButton = new CancelRoomButton(() -> {
            quietTime = 0;
            onCancel.run();
        });
        addActor(cancelButton);
        roomName.addListener(new com.badlogic.gdx.scenes.scene2d.utils.ChangeListener() {
            @Override
            public void changed(ChangeEvent event, com.badlogic.gdx.scenes.scene2d.Actor actor) {
                validationMessage.setText("");
            }
        });
        // Tab order follows the footer: name -> mode -> password -> CREATE -> CANCEL -> name.
        addCaptureListener(new InputListener() {
            @Override
            public boolean keyTyped(InputEvent event, char character) {
                if (character != '\t' || getStage() == null) return false;
                com.badlogic.gdx.scenes.scene2d.Actor current = getStage().getKeyboardFocus();
                boolean reverse = UIUtils.shift();
                if (current == roomName) {
                    getStage().setKeyboardFocus(reverse ? cancelButton : gameMode);
                } else if (current == gameMode) {
                    getStage().setKeyboardFocus(reverse ? roomName : password);
                } else if (current == password) {
                    getStage().setKeyboardFocus(reverse ? gameMode : createButton);
                } else if (current == cancelButton) {
                    getStage().setKeyboardFocus(reverse ? createButton : roomName);
                } else if (current == createButton) {
                    getStage().setKeyboardFocus(reverse ? password : cancelButton);
                } else {
                    return false;
                }
                quietTime = 0;
                event.stop();
                return true;
            }
        });
        cancelButton.addListener(new InputListener() {
            @Override
            public boolean keyDown(InputEvent event, int keycode) {
                if (keycode == com.badlogic.gdx.Input.Keys.ENTER || keycode == com.badlogic.gdx.Input.Keys.SPACE) {
                    onCancel.run();
                    return true;
                }
                return false;
            }
        });
        createButton.addListener(new InputListener() {
            @Override
            public boolean keyDown(InputEvent event, int keycode) {
                if (keycode == com.badlogic.gdx.Input.Keys.ENTER || keycode == com.badlogic.gdx.Input.Keys.SPACE) {
                    requestCreation();
                    return true;
                }
                return false;
            }
        });
    }

    public void setOnCancel(Runnable onCancel) {
        this.onCancel = Objects.requireNonNull(onCancel, "onCancel");
    }

    public void setOnCreate(Consumer<RoomConfiguration> onCreate) {
        this.onCreate = Objects.requireNonNull(onCreate, "onCreate");
    }

    private void requestCreation() {
        quietTime = 0;
        if (getRoomName().isEmpty()) {
            validationMessage.setText("Enter a room name to continue.");
            focusName();
            return;
        }
        validationMessage.setText("");
        onCreate.accept(getRoomConfiguration());
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
        gameMode.compensateWindowMotion(getY() - baseY);
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
        gameMode.layoutIn(227 * scale, (texture.getHeight() - 784 - 86) * scale,
            800 * scale, 86 * scale);
        playerCount.layoutButtons(230 * scale, (texture.getHeight() - 619 - 90) * scale,
            794 * scale, 90 * scale);
        // Larger footer actions: CREATE on the left, CANCEL on the right.
        float cancelWidth = 400f * scale;
        float createWidth = 540f * scale;
        float gap = 24f * scale;
        float left = (width - cancelWidth - gap - createWidth) / 2;
        float bottom = 70f * scale;
        float createHeight = createWidth * createButton.getImageAspectRatio();
        float cancelHeight = cancelWidth * cancelButton.getImageAspectRatio();
        float createOffsetY = 14f * scale;
        createButton.setBounds(left, bottom + createOffsetY, createWidth, createHeight);
        cancelButton.setBounds(left + createWidth + gap, bottom + (createHeight - cancelHeight) / 2,
            cancelWidth, cancelHeight);
        validationMessage.setBounds(236f * scale, (texture.getHeight() - 1110f) * scale,
            778f * scale, 36f * scale);
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

    public GameMode getSelectedGameMode() {
        return gameMode.getSelectedMode();
    }

    public void setLanguage(String language) {
        gameMode.setLanguage(language);
    }

    public RoomConfiguration getRoomConfiguration() {
        return new RoomConfiguration(getRoomName(), getMaxPlayers(), getPassword(), getSelectedGameMode());
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
        gameMode.dispose();
        createButton.dispose();
        cancelButton.dispose();
    }
}
