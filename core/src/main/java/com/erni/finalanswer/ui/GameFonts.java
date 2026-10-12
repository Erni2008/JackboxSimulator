package com.erni.finalanswer.ui;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;

public class GameFonts {

    public final BitmapFont titleFont;
    public final BitmapFont buttonFont;

    public GameFonts() {

        // Шрифт названия FINAL ANSWER
        titleFont = loadFont(
            "ui/fonts/BebasNeue-Regular.ttf",
            132
        );

        // Шрифт игровых кнопок
        buttonFont = loadFont(
            "ui/fonts/Rajdhani-Bold.ttf",
            48
        );
    }

    private BitmapFont loadFont(String path, int size) {


        FreeTypeFontGenerator generator = 
            new FreeTypeFontGenerator(
                Gdx.files.internal(path)
            );

        FreeTypeFontGenerator.FreeTypeFontParameter parameters =
            new FreeTypeFontGenerator.FreeTypeFontParameter();

        parameters.size = size;
        parameters.borderWidth = 0.75f;
        parameters.borderColor = new Color(0.025f, 0.018f, 0.04f, 0.6f);

        parameters.shadowOffsetX = 0;
        parameters.shadowOffsetY = 3;
        parameters.shadowColor = new Color(0f, 0f, 0f, 0.7f);
        parameters.minFilter = Texture.TextureFilter.Linear;
        parameters.magFilter = Texture.TextureFilter.Linear;

        BitmapFont font = generator.generateFont(parameters);

        generator.dispose();

        return font;
    }

    public void dispose() {
        titleFont.dispose();
        buttonFont.dispose();
    }
}
