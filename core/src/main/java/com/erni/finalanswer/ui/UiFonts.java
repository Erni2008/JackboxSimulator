package com.erni.finalanswer.ui;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;

/** Small UI fonts, created once per owning panel and explicitly disposed by it. */
public final class UiFonts {
    private UiFonts() {}

    /** Shared display-font choice for questions, answer text and numbers. Caller owns the font. */
    public static BitmapFont horror(int size) {
        String path = "ui/fonts/Creepster-Regular.ttf";
        for (String candidate : new String[]{"ui/fonts/Eerie.ttf", "ui/fonts/Eerie-Regular.ttf", "ui/fonts/eerie.ttf", "ui/fonts/Eerie.otf"})
            if (Gdx.files.internal(candidate).exists()) { path = candidate; break; }
        var files = Gdx.files.internal("ui/fonts").list();
        java.util.Arrays.sort(files, java.util.Comparator.comparing(com.badlogic.gdx.files.FileHandle::name));
        for (var file : files) {
            String name = file.name().toLowerCase(java.util.Locale.ROOT);
            if (path.contains("Creepster") && name.contains("eerie") && (name.endsWith(".ttf") || name.endsWith(".otf"))) {
                path = file.path(); break;
            }
        }
        var generator = new FreeTypeFontGenerator(Gdx.files.internal(path));
        try {
            var parameters = new FreeTypeFontGenerator.FreeTypeFontParameter();
            parameters.size = size;
            StringBuilder characters = new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            for (char c = '\u0400'; c <= '\u04ff'; c++) characters.append(c);
            parameters.characters = characters.append("\u2013\u2014\u2018\u2019\u201c\u201d").toString();
            parameters.minFilter = Texture.TextureFilter.Linear;
            parameters.magFilter = Texture.TextureFilter.Linear;
            return generator.generateFont(parameters);
        } finally { generator.dispose(); }
    }

    public static BitmapFont code(int size) {
        FreeTypeFontGenerator generator =
                new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/RoadRage-Regular.ttf"));
        try {
            var parameters = new FreeTypeFontGenerator.FreeTypeFontParameter();
            parameters.size = size;
            parameters.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            parameters.minFilter = Texture.TextureFilter.Linear;
            parameters.magFilter = Texture.TextureFilter.Linear;
            return generator.generateFont(parameters);
        } finally {
            generator.dispose();
        }
    }

    public static BitmapFont body(int size) {
        FreeTypeFontGenerator generator =
                new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/NotoSans-Regular.ttf"));
        try {
            var parameters = new FreeTypeFontGenerator.FreeTypeFontParameter();
            parameters.size = size;
            StringBuilder characters = new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            for (char c = '\u0400'; c <= '\u04ff'; c++) characters.append(c);
            parameters.characters = characters.append("\u2013\u2014\u2018\u2019\u201c\u201d").toString();
            parameters.minFilter = Texture.TextureFilter.Linear;
            parameters.magFilter = Texture.TextureFilter.Linear;
            return generator.generateFont(parameters);
        } finally {
            generator.dispose();
        }
    }
}
