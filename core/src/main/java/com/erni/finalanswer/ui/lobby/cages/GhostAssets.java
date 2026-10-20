package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import java.util.ArrayList;
import java.util.List;

/** Four unchanged PNGs, shared by every ghost. Bounds are measured once from their actual alpha. */
public final class GhostAssets implements Disposable {
    public record Part(TextureRegion region, int x, int y, int width, int height) {}
    private final List<Texture> textures = new ArrayList<>();
    public final Part body, leftArm, rightArm, tail;
    public final TextureRegion leftEye, rightEye, mote, scrap;
    public GhostAssets() {
        try {
            body = load("ghost_body.png"); leftArm = load("ghost_left_arm.png");
            rightArm = load("ghost_right_arm.png"); tail = load("ghost_tail.png");
            // These small crops contain only white eyes and their black face background, never the hood.
            leftEye = new TextureRegion(body.region().getTexture(), 559, 277, 102, 102);
            rightEye = new TextureRegion(body.region().getTexture(), 719, 259, 102, 102);
            mote = leftEye;
            scrap = tail.region();
        } catch (RuntimeException error) { dispose(); throw error; }
    }
    private Part load(String name) {
        String path = "lobby/characters/ghost/" + name;
        if (!Gdx.files.internal(path).exists()) throw new IllegalStateException("Missing ghost asset: assets/" + path);
        Pixmap pixels = new Pixmap(Gdx.files.internal(path));
        try {
            int minX = pixels.getWidth(), minY = pixels.getHeight(), maxX = -1, maxY = -1;
            for (int y = 0; y < pixels.getHeight(); y++) for (int x = 0; x < pixels.getWidth(); x++)
                if ((pixels.getPixel(x, y) & 255) > 0) {
                    minX = Math.min(minX, x); minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
                }
            if (maxX < 0) throw new IllegalArgumentException("Empty ghost texture: " + path);
            minX = Math.max(0, minX - 6); minY = Math.max(0, minY - 6);
            maxX = Math.min(pixels.getWidth() - 1, maxX + 6); maxY = Math.min(pixels.getHeight() - 1, maxY + 6);
            Texture texture = new Texture(pixels); textures.add(texture);
            texture.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
            return new Part(new TextureRegion(texture, minX, minY, maxX - minX + 1, maxY - minY + 1),
                minX, minY, maxX - minX + 1, maxY - minY + 1);
        } finally { pixels.dispose(); }
    }
    @Override public void dispose() { for (Texture texture : textures) texture.dispose(); textures.clear(); }
}
