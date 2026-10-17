package com.erni.finalanswer.ui.buttons.generation;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.InputEvent;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.RuntimeTextures;

/** Reuses the blank grunge button artwork; the screen owns the shared font. */
public final class ConfirmCodeButton extends TextButton implements Disposable {
    private final Texture[] textures = new Texture[3];

    public ConfirmCodeButton(BitmapFont font, Runnable confirm) {
        super("OK", initialStyle(font));
        setName("confirmRoomCode");
        String[] names = {"up", "hover", "pressed"};
        int[][] crops = {{293, 198, 1191, 483}, {161, 273, 1208, 452}, {167, 263, 1198, 456}};
        TextureRegionDrawable[] frames = new TextureRegionDrawable[3];
        for (int i = 0; i < 3; i++) {
            textures[i] =
                    RuntimeTextures.load("ui/buttons/player_count/button_" + names[i] + ".png");
            int[] c = crops[i];
            frames[i] =
                    new TextureRegionDrawable(
                            RuntimeTextures.region(textures[i], c[0], c[1], c[2], c[3]));
            frames[i].setMinWidth(0);
            frames[i].setMinHeight(0);
        }
        TextButtonStyle style = new TextButtonStyle();
        style.up = frames[0];
        style.over = frames[1];
        style.down = frames[2];
        style.checked = frames[0];
        style.checkedOver = frames[1];
        style.font = font;
        style.fontColor = Color.valueOf("F0E8DE");
        style.downFontColor = Color.valueOf("FF8A72");
        setStyle(style);
        getLabel().setFontScale(0.55f);
        addListener(
                new ClickListener() {
                    @Override
                    public void clicked(InputEvent event, float x, float y) {
                        setChecked(false);
                        if (!isDisabled()) confirm.run();
                    }
                });
    }

    private static TextButtonStyle initialStyle(BitmapFont font) {
        TextButtonStyle style = new TextButtonStyle();
        style.font = font;
        style.fontColor = Color.WHITE;
        return style;
    }

    @Override
    public void dispose() {
        for (Texture texture : textures) if (texture != null) texture.dispose();
    }
}
