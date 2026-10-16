package com.erni.finalanswer.ui;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;
import java.util.WeakHashMap;

/** Loads build-prepared display textures while preserving original crop coordinates. */
public final class RuntimeTextures {
    private static final Properties SIZES = new Properties();
    private static final Map<Texture, int[]> ORIGINAL_SIZES = new WeakHashMap<>();
    private static boolean initialized;

    private RuntimeTextures() {}

    public static Texture load(String path) {
        if (!initialized) {
            if (Gdx.files.internal("runtime/sizes.properties").exists()) {
                try (InputStream input = Gdx.files.internal("runtime/sizes.properties").read()) {
                    SIZES.load(input);
                } catch (IOException error) {
                    throw new IllegalStateException("Cannot read runtime texture sizes", error);
                }
            }
            initialized = true;
        }
        String size = SIZES.getProperty(path);
        Texture texture = new Texture(Gdx.files.internal(size == null ? path : "runtime/" + path));
        texture.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
        if (size != null) {
            String[] dimensions = size.split(",");
            ORIGINAL_SIZES.put(texture, new int[] {
                Integer.parseInt(dimensions[0]), Integer.parseInt(dimensions[1])
            });
        }
        return texture;
    }

    public static TextureRegion region(Texture texture, int x, int y, int width, int height) {
        int[] original = ORIGINAL_SIZES.get(texture);
        if (original == null) return new TextureRegion(texture, x, y, width, height);
        float sx = (float) texture.getWidth() / original[0];
        float sy = (float) texture.getHeight() / original[1];
        int left = Math.round(x * sx), top = Math.round(y * sy);
        return new TextureRegion(texture, left, top,
            Math.max(1, Math.round((x + width) * sx) - left),
            Math.max(1, Math.round((y + height) * sy) - top));
    }
}
