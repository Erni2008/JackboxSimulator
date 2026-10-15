package com.erni.finalanswer.ui.effects;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Disposable;

/** The original 96-frame, three-candle render, anchored to the background. */
public final class TableCandle implements Disposable {
    private static final int FRAME_COUNT = 96;
    private static final float FRAMES_PER_SECOND = 24f;
    private static final float LOOP_DURATION = FRAME_COUNT / FRAMES_PER_SECOND;
    private static final float[] FOOT_X = {0.28f, 0.52f, 0.735f};
    private static final float[] FOOT_Y = {0.18f, 0.18f, 0.15f};
    private static final float[] FLAME_X = {0.285f, 0.525f, 0.74f};
    private static final float[] FLAME_Y = {0.745f, 0.91f, 0.71f};
    private final Texture[] frames = new Texture[FRAME_COUNT];
    private final Texture falloff;
    private float time;
    private float animationTime;

    public TableCandle() {
        try {
            for (int i = 0; i < frames.length; i++) {
                String number = String.format(java.util.Locale.ROOT, "%04d", i + 1);
                Pixmap original = new Pixmap(Gdx.files.internal(
                    "models/candle/frames/" + number + ".png"));
                Pixmap scaled = new Pixmap(384, 384, Pixmap.Format.RGBA8888);
                try {
                    // The full sequence uses 54 MiB on the GPU instead of 216 MiB.
                    // Keep the original PNGs intact; prepare only display textures.
                    scaled.setBlending(Pixmap.Blending.None);
                    scaled.setFilter(Pixmap.Filter.BiLinear);
                    scaled.drawPixmap(original, 0, 0, original.getWidth(), original.getHeight(),
                        0, 0, scaled.getWidth(), scaled.getHeight());
                    frames[i] = new Texture(scaled);
                } finally {
                    original.dispose();
                    scaled.dispose();
                }
                frames[i].setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
            }
        } catch (RuntimeException error) {
            for (Texture frame : frames) if (frame != null) frame.dispose();
            throw error;
        }
        Pixmap pixels = new Pixmap(256, 256, Pixmap.Format.RGBA8888);
        pixels.setBlending(Pixmap.Blending.None);
        for (int y = 0; y < 256; y++) {
            for (int x = 0; x < 256; x++) {
                float dx = (x - 127.5f) / 127.5f;
                float dy = (y - 127.5f) / 127.5f;
                float radius = (float) Math.sqrt(dx * dx + dy * dy);
                float alpha = Math.max(0, 1 - radius);
                pixels.setColor(1, 1, 1, alpha * alpha * alpha);
                pixels.drawPixel(x, y);
            }
        }
        falloff = new Texture(pixels);
        pixels.dispose();
        falloff.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
    }

    public void draw(Batch batch, float delta, float backgroundX, float backgroundY,
                     float backgroundWidth, float backgroundHeight) {
        float elapsed = Math.max(0, delta);
        time = (time + elapsed) % 1000f;
        animationTime = (animationTime + elapsed) % LOOP_DURATION;
        float unit = backgroundHeight / 945f;
        float baseX = backgroundX + backgroundWidth * 0.575f;
        float baseY = backgroundY + backgroundHeight * 0.09f;
        float height = 288 * unit;
        float width = height;
        float left = baseX - width / 2;
        float bottom = baseY - height * 0.16f;
        float flicker = 0.94f + 0.035f * MathUtils.sin(time * 4.3f)
            + 0.025f * MathUtils.sin(time * 9.7f + 0.8f);
        float previousColor = batch.getPackedColor();
        int src = batch.getBlendSrcFunc(), dst = batch.getBlendDstFunc();
        int srcAlpha = batch.getBlendSrcFuncAlpha(), dstAlpha = batch.getBlendDstFuncAlpha();
        try {
            // Warm pool follows the perspective of the tabletop.
            batch.setBlendFunction(GL20.GL_SRC_ALPHA, GL20.GL_ONE);
            batch.setColor(1f, 0.32f, 0.075f, 0.30f * flicker);
            batch.draw(falloff, baseX - 185 * unit, baseY - 48 * unit,
                370 * unit, 105 * unit);
            batch.setBlendFunction(GL20.GL_SRC_ALPHA, GL20.GL_ONE_MINUS_SRC_ALPHA);
            // Soft cast shadow and a tighter contact shadow beneath the metal foot.
            batch.setColor(0.025f, 0.008f, 0.02f, 0.42f);
            batch.draw(falloff, baseX - 12 * unit, baseY - 15 * unit,
                140 * unit, 30 * unit);
            for (int i = 0; i < FOOT_X.length; i++) {
                batch.setColor(0.015f, 0.008f, 0.018f, 0.7f);
                batch.draw(falloff, left + width * FOOT_X[i] - 29 * unit,
                    bottom + height * FOOT_Y[i] - 9 * unit, 58 * unit, 18 * unit);
            }
            batch.setColor(1, 1, 1, 1);
            int frame = Math.min(FRAME_COUNT - 1, (int) (animationTime * FRAMES_PER_SECOND));
            // Show each source frame in numerical order, without substituting a new render.
            batch.draw(frames[frame], left, bottom, width, height);
            batch.setBlendFunction(GL20.GL_SRC_ALPHA, GL20.GL_ONE);
            for (int i = 0; i < FLAME_X.length; i++) {
                float x = left + width * FLAME_X[i];
                float y = bottom + height * FLAME_Y[i];
                float glow = flicker + 0.025f * MathUtils.sin(time * 7f + i * 2f);
                batch.setColor(1, 0.24f, 0.035f, 0.22f * glow);
                batch.draw(falloff, x - 34 * unit, y - 44 * unit, 68 * unit, 88 * unit);
                batch.setColor(1, 0.65f, 0.22f, 0.26f * glow);
                batch.draw(falloff, x - 11 * unit, y - 20 * unit, 22 * unit, 40 * unit);
            }
        } finally {
            batch.setBlendFunctionSeparate(src, dst, srcAlpha, dstAlpha);
            batch.setPackedColor(previousColor);
        }
    }

    @Override
    public void dispose() {
        for (Texture frame : frames) frame.dispose();
        falloff.dispose();
    }
}
