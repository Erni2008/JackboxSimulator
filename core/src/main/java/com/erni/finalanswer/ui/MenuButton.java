package com.erni.finalanswer.ui;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.TextureRegion;

import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;

public class MenuButton extends TextButton {

    private static Texture buttonTexture;

    public MenuButton(String text, BitmapFont font) {

        super(text, createStyle(font));

        setSize(420, 85);
    }

    private static TextButtonStyle createStyle(BitmapFont font) {

        if (buttonTexture == null) {

            Pixmap pixmap = new Pixmap(
                1,
                1,
                Pixmap.Format.RGBA8888
            );

            pixmap.setColor(Color.WHITE);
            pixmap.fill();

            buttonTexture = new Texture(pixmap);

            pixmap.dispose();
        }

        TextButtonStyle style = new TextButtonStyle();

        style.up = new TextureRegionDrawable(
            new TextureRegion(buttonTexture)
        ).tint(new Color(0.10f, 0.08f, 0.12f, 0.95f));

        style.over = new TextureRegionDrawable(
            new TextureRegion(buttonTexture)
        ).tint(new Color(0.45f, 0.06f, 0.12f, 1f));

        style.down = new TextureRegionDrawable(
            new TextureRegion(buttonTexture)
        ).tint(new Color(0.7f, 0.08f, 0.12f, 1f));

        style.font = font;
        style.fontColor = Color.WHITE;

        return style;
    }

    public static void disposeSharedResources() {

        if (buttonTexture != null) {
            buttonTexture.dispose();
            buttonTexture = null;
        }
    }
}