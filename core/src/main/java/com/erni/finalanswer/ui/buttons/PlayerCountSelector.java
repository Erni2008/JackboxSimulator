package com.erni.finalanswer.ui.buttons;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.scenes.scene2d.ui.ButtonGroup;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.utils.ChangeListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Disposable;

/** Seven exclusive choices using the user's three button states and a horror numeral font. */
public final class PlayerCountSelector extends Group implements Disposable {
    private final Texture[] textures = new Texture[3];
    private final BitmapFont font;
    private final ButtonGroup<TextButton> choices = new ButtonGroup<>();
    private final TextButton[] buttons = new TextButton[7];
    private boolean disposed;

    public PlayerCountSelector(Runnable onSelection) {
        String[] files = {"button_up.png", "button_hover.png", "button_pressed.png"};
        // Match the visible metal frames, excluding different transparent margins.
        int[][] crops = {{293, 198, 1191, 483}, {161, 273, 1208, 452}, {167, 263, 1198, 456}};
        TextureRegionDrawable[] states = new TextureRegionDrawable[3];
        for (int i = 0; i < files.length; i++) {
            textures[i] = new Texture(Gdx.files.internal("ui/buttons/player_count/" + files[i]));
            textures[i].setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
            int[] crop = crops[i];
            states[i] = new TextureRegionDrawable(new TextureRegion(textures[i],
                crop[0], crop[1], crop[2], crop[3]));
            states[i].setMinWidth(0);
            states[i].setMinHeight(0);
            states[i].setLeftWidth(5f);
            states[i].setRightWidth(5f);
            states[i].setTopHeight(5f);
            states[i].setBottomHeight(5f);
        }
        FreeTypeFontGenerator generator = new FreeTypeFontGenerator(
            Gdx.files.internal("ui/fonts/Creepster-Regular.ttf"));
        try {
            FreeTypeFontGenerator.FreeTypeFontParameter parameters =
                new FreeTypeFontGenerator.FreeTypeFontParameter();
            parameters.size = 32;
            parameters.characters = "2345678";
            parameters.minFilter = Texture.TextureFilter.Linear;
            parameters.magFilter = Texture.TextureFilter.Linear;
            parameters.shadowOffsetY = 1;
            parameters.shadowColor = new Color(0.025f, 0, 0, 0.85f);
            font = generator.generateFont(parameters);
        } finally {
            generator.dispose();
        }
        TextButton.TextButtonStyle style = new TextButton.TextButtonStyle();
        style.up = states[0];
        style.over = states[1];
        style.down = states[2];
        style.checked = states[0];
        style.checkedOver = states[1];
        style.font = font;
        style.fontColor = new Color(0.93f, 0.86f, 0.79f, 1);
        style.overFontColor = new Color(1, 0.96f, 0.87f, 1);
        style.downFontColor = new Color(1, 0.48f, 0.32f, 1);
        style.checkedFontColor = new Color(0.96f, 0.62f, 0.49f, 1);
        style.checkedOverFontColor = new Color(1, 0.54f, 0.36f, 1);
        style.pressedOffsetY = -1;

        choices.setMinCheckCount(1);
        choices.setMaxCheckCount(1);
        for (int i = 0; i < buttons.length; i++) {
            TextButton button = new CountButton(Integer.toString(i + 2), style);
            button.setName("maxPlayers" + (i + 2));
            buttons[i] = button;
            choices.add(button);
            addActor(button);
        }
        // Four players by default. Configure before attaching user callbacks.
        buttons[2].setChecked(true);
        for (TextButton button : buttons) {
            button.addListener(new ChangeListener() {
                @Override
                public void changed(ChangeEvent event, Actor actor) {
                    if (button.isChecked()) {
                        if (getStage() != null) getStage().setKeyboardFocus(null);
                        onSelection.run();
                    }
                }
            });
        }
    }

    public void layoutButtons(float x, float y, float width, float height) {
        setBounds(x, y, width, height);
        float gap = 5f;
        float buttonWidth = (width - gap * 6) / buttons.length;
        float buttonHeight = buttonWidth * 0.64f;
        for (int i = 0; i < buttons.length; i++) {
            TextButton button = buttons[i];
            button.setBounds(i * (buttonWidth + gap), (height - buttonHeight) / 2,
                buttonWidth, buttonHeight);
            button.setOrigin(buttonWidth / 2, buttonHeight / 2);
        }
    }

    public int getMaxPlayers() {
        return choices.getCheckedIndex() + 2;
    }

    private static final class CountButton extends TextButton {
        CountButton(String number, TextButtonStyle style) {
            super(number, style);
            setTransform(true);
            setColor(0.76f, 0.76f, 0.76f, 1);
        }

        @Override
        public void act(float delta) {
            super.act(delta);
            float dt = MathUtils.clamp(delta, 0, 0.1f);
            float target = isPressed() ? 0.985f : isOver() ? 1.02f : 1f;
            float response = 1 - (float) Math.exp(-dt / 0.1f);
            setScale(MathUtils.lerp(getScaleX(), target, response));
            // Keep idle frames calm; reserve the bright artwork for interaction.
            float brightness = isPressed() || isOver() ? 1f : isChecked() ? 0.86f : 0.76f;
            float lightResponse = 1 - (float) Math.exp(-dt / 0.16f);
            Color tint = getColor();
            float level = MathUtils.lerp(tint.r, brightness, lightResponse);
            setColor(level, level, level, tint.a);
        }

    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        for (Texture texture : textures) texture.dispose();
        font.dispose();
    }
}
