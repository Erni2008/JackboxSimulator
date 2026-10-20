package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.BitmapFontCache;

/** Fits actual glyph ink, including descenders and bold borders, inside the parchment's safe inset. */
public final class CageNameplate {
    public static final float X = 126, Y = 27, WIDTH = 101, HEIGHT = 18;
    private final BitmapFontCache cache;
    private final float maximumScale;
    private final Color ink=new Color(.105f,.055f,.025f,1);
    public void ink(Color value){ink.set(value);cache.setColors(ink);}

    public CageNameplate(BitmapFont font) {
        cache = new BitmapFontCache(font, false);
        maximumScale = (HEIGHT - 2) / Math.max(1, font.getCapHeight());
    }
    public void setText(String text) {
        cache.setColor(ink);
        cache.setText(text.replace('\n', ' ').replace('\r', ' ').strip(), 0, 0);
        float minX = Float.POSITIVE_INFINITY, minY = Float.POSITIVE_INFINITY;
        float maxX = Float.NEGATIVE_INFINITY, maxY = Float.NEGATIVE_INFINITY;
        for (int page = 0; page < cache.getPageCount(); page++) {
            float[] vertices = cache.getVertices(page);
            for (int i = 0; i < cache.getVertexCount(page); i += 5) {
                minX = Math.min(minX, vertices[i]); maxX = Math.max(maxX, vertices[i]);
                minY = Math.min(minY, vertices[i + 1]); maxY = Math.max(maxY, vertices[i + 1]);
            }
        }
        if (!Float.isFinite(minX)) return;
        float width = Math.max(.001f, maxX - minX), height = Math.max(.001f, maxY - minY);
        float scale = Math.min(maximumScale, Math.min((WIDTH - 2) / width, (HEIGHT - 2) / height));
        float left = X + (WIDTH - width * scale) / 2;
        float bottom = Y + (HEIGHT - height * scale) / 2;
        for (int page = 0; page < cache.getPageCount(); page++) {
            float[] vertices = cache.getVertices(page);
            for (int i = 0; i < cache.getVertexCount(page); i += 5) {
                vertices[i] = left + (vertices[i] - minX) * scale;
                vertices[i + 1] = bottom + (vertices[i + 1] - minY) * scale;
            }
        }
        if (!fits()) throw new IllegalStateException("Nickname ink extends outside the cage nameplate");
    }
    /** Also exercised by the developer preview using Cyrillic, descenders and maximum-length names. */
    public boolean fits() {
        for (int page = 0; page < cache.getPageCount(); page++) {
            float[] vertices = cache.getVertices(page);
            for (int i = 0; i < cache.getVertexCount(page); i += 5)
                if (vertices[i] < X || vertices[i] > X + WIDTH || vertices[i + 1] < Y || vertices[i + 1] > Y + HEIGHT) return false;
        }
        return true;
    }
    public void draw(Batch batch, float alpha) { cache.draw(batch, alpha); }
}
