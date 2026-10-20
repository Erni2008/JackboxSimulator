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

    /** One horror display face covering both Latin and Cyrillic for round text and nicknames. */
    public static BitmapFont question(int size) {
        var generator=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/RubikWetPaint-Regular.ttf"));
        try{
            var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=size;
            StringBuilder glyphs=new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            for(char c='\u0400';c<='\u04ff';c++)glyphs.append(c);
            p.characters=glyphs.append("«»–—‘’“”").toString();p.kerning=true;
            p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;
            return generator.generateFont(p);
        }finally{generator.dispose();}
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

    /** Cyrillic and Latin handwriting for the public identity announcement. Caller owns it. */
    public static BitmapFont handwriting(int size) {
        var generator = new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/Caveat-Variable.ttf"));
        try {
            var parameters = new FreeTypeFontGenerator.FreeTypeFontParameter();
            parameters.size = size;
            StringBuilder characters = new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            for (char c = '\u0400'; c <= '\u04ff'; c++) characters.append(c);
            parameters.characters = characters.toString();
            parameters.minFilter = Texture.TextureFilter.Linear;
            parameters.magFilter = Texture.TextureFilter.Linear;
            return generator.generateFont(parameters);
        } finally { generator.dispose(); }
    }

    /** Upright, heavy condensed lettering with full Cyrillic support for small cage nameplates. */
    public static BitmapFont nameplate(int size) {
        var generator = new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf"));
        try {
            var parameters = new FreeTypeFontGenerator.FreeTypeFontParameter();
            parameters.size = size;
            StringBuilder characters = new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            for (char c = '\u0400'; c <= '\u04ff'; c++) characters.append(c);
            parameters.characters = characters.toString();
            parameters.borderWidth = .7f;
            parameters.borderColor = com.badlogic.gdx.graphics.Color.WHITE;
            parameters.kerning = true;
            parameters.minFilter = Texture.TextureFilter.Linear;
            parameters.magFilter = Texture.TextureFilter.Linear;
            return generator.generateFont(parameters);
        } finally { generator.dispose(); }
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
