package com.erni.finalanswer.ui.buttons.room;

import com.erni.finalanswer.ui.RuntimeTextures;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.InputListener;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.scenes.scene2d.actions.Actions;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Button;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.localization.Localization;
import com.erni.finalanswer.rooms.GameMode;
import com.erni.finalanswer.ui.windows.ModeInfoDialog;

/** Reuses the painted GAME MODE field: previous, centered localized name, next. */
public final class GameModeSelector extends Group implements Disposable {
    private final Texture[] textures = new Texture[9];
    private final Texture fieldTexture;
    private final Image field;
    private final Label title;
    private final Button previous;
    private final Button next;
    private final Button info;
    private final ModeInfoDialog infoDialog;
    private final Runnable onInteraction;
    private Localization texts = new Localization("en");
    private GameMode selected = GameMode.STANDARD;
    private boolean disposed;
    private float navigationOffsetY;

    /** Keeps the arrows stationary while their parent window moves vertically. */
    public void compensateWindowMotion(float windowOffsetY) {
        float offset = -windowOffsetY;
        previous.moveBy(0, offset - navigationOffsetY);
        next.moveBy(0, offset - navigationOffsetY);
        navigationOffsetY = offset;
    }

    public GameModeSelector(BitmapFont font, BitmapFont bodyFont, Runnable onInteraction) {
        this.onInteraction = onInteraction;
        setName("gameModeSelector");
        fieldTexture = RuntimeTextures.load("ui/windows/create_room/field.png");
        fieldTexture.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
        field = new Image(RuntimeTextures.region(fieldTexture, 36, 113, 2100, 446));
        field.setName("gameModeField");
        field.setColor(0.78f, 0.78f, 0.78f, 1);
        field.setTouchable(Touchable.disabled);
        addActor(field);
        previous = new Button(loadStyle("previous", 0));
        previous.setColor(0.85f, 0.85f, 0.85f, 1);
        previous.setName("previousGameMode");
        next = new Button(loadStyle("next", 3));
        next.setColor(0.85f, 0.85f, 0.85f, 1);
        next.setName("nextGameMode");
        info = new Button(loadStyle("info", 6));
        info.setName("gameModeInfo");
        info.setColor(0.85f, 0.85f, 0.85f, 1);
        infoDialog = new ModeInfoDialog(font, bodyFont);
        title = new Label("", new Label.LabelStyle(font, new Color(0.97f, 0.9f, 0.82f, 1)));
        title.setName("gameModeName");
        title.setAlignment(Align.center);
        title.setTouchable(Touchable.disabled);
        addActor(previous);
        addActor(title);
        addActor(next);
        addActor(info);
        info.addListener(new ClickListener() {
            @Override
            public void clicked(InputEvent event, float x, float y) {
                info.setChecked(false);
                showInfo();
            }
        });

        previous.addListener(new ClickListener() {
            @Override
            public void clicked(InputEvent event, float x, float y) {
                previous.setChecked(false);
                select(selected.previous());
            }
        });
        next.addListener(new ClickListener() {
            @Override
            public void clicked(InputEvent event, float x, float y) {
                next.setChecked(false);
                select(selected.next());
            }
        });
        addListener(new InputListener() {
            @Override
            public boolean touchDown(InputEvent event, float x, float y, int pointer, int button) {
                focus();
                onInteraction.run();
                return false;
            }

            @Override
            public boolean keyDown(InputEvent event, int keycode) {
                if (keycode == Input.Keys.I || keycode == Input.Keys.ENTER) {
                    showInfo();
                    return true;
                }
                if (keycode == Input.Keys.LEFT) {
                    select(selected.previous());
                    return true;
                }
                if (keycode == Input.Keys.RIGHT) {
                    select(selected.next());
                    return true;
                }
                return false;
            }
        });
        updateTitle(false);
    }

    private Button.ButtonStyle loadStyle(String direction, int offset) {
        String[] states = {"up", "hover", "pressed"};
        TextureRegionDrawable[] frames = new TextureRegionDrawable[3];
        for (int i = 0; i < states.length; i++) {
            Texture image = RuntimeTextures.load("ui/buttons/game_mode/" + direction
                + "/" + direction + "_" + states[i] + ".png");
            textures[offset + i] = image;
            image.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
            // The same crop aligns all three supplied frames without stretching their margins.
            TextureRegion region = direction.equals("info")
                ? RuntimeTextures.region(image, 30, 140, 2110, 430)
                : RuntimeTextures.region(image, 160, 70, 1040, 1000);
            frames[i] = new TextureRegionDrawable(region);
            frames[i].setMinWidth(0);
            frames[i].setMinHeight(0);
        }
        Button.ButtonStyle style = new Button.ButtonStyle();
        style.up = frames[0];
        style.over = frames[1];
        style.down = frames[2];
        return style;
    }

    private void showInfo() {
        if (getStage() == null) return;
        onInteraction.run();
        infoDialog.open(getStage(), texts.get(selected.getNameKey()),
            getSelectedDescription(), texts.get("ui.close"));
    }

    private void select(GameMode mode) {
        selected = mode;
        updateTitle(true);
        onInteraction.run();
    }

    public void resetSelection() {
        selected = GameMode.STANDARD;
        updateTitle(false);
    }

    public GameMode getSelectedMode() {
        return selected;
    }

    public void setLanguage(String language) {
        texts = new Localization(language);
        updateTitle(false);
    }

    public String getSelectedDescription() {
        return texts.get(selected.getDescriptionKey());
    }

    public void focus() {
        if (getStage() != null) getStage().setKeyboardFocus(this);
    }

    public void layoutIn(float x, float y, float width, float height) {
        navigationOffsetY = 0;
        setBounds(x, y, width, height);
        field.setBounds(0, 0, width, height);
        float buttonHeight = Math.min(58f, height - 4);
        float buttonWidth = buttonHeight * 1.04f;
        // Смещения стрелок: X — вправо (+) / влево (-), Y — вверх (+) / вниз (-).
        float previousOffsetX = 0f;
        float previousOffsetY = 0.35f;
        float nextOffsetX = 0f;
        float nextOffsetY = 0.35f;

        previous.setBounds(5 + previousOffsetX,
            (height - buttonHeight) / 2 + previousOffsetY, buttonWidth, buttonHeight);
        next.setBounds(width - buttonWidth - 5 + nextOffsetX,
            (height - buttonHeight) / 2 + nextOffsetY, buttonWidth, buttonHeight);
        previous.setOrigin(buttonWidth / 2, buttonHeight / 2);
        next.setOrigin(buttonWidth / 2, buttonHeight / 2);
        // INFO sits below the field, slightly right of its center.
        float infoWidth = 198f;
        float infoHeight = 52.8f;
        float infoOffsetX = 150f;
        float infoGapY = 6f;
        info.setBounds((width - infoWidth) / 2 + infoOffsetX,
            -infoHeight - infoGapY, infoWidth, infoHeight);
        float margin = buttonWidth + 19;
        title.setBounds(margin, 0, width - margin * 2, height);
        fitTitle();
    }

    private void updateTitle(boolean animate) {
        title.setText(texts.get(selected.getNameKey()));
        fitTitle();
        title.clearActions();
        title.getColor().a = animate ? 0.7f : 1;
        if (animate) title.addAction(Actions.fadeIn(0.16f));
    }

    private void fitTitle() {
        title.setFontScale(1);
        float naturalWidth = title.getPrefWidth();
        if (title.getWidth() > 0 && naturalWidth > 0) {
            float scale = Math.min(1f, (title.getWidth() - 8f) / naturalWidth);
            title.setFontScale(scale);
        }
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        for (Texture texture : textures) texture.dispose();
        infoDialog.dispose();
        fieldTexture.dispose();
        // The window owns the shared font.
    }
}
