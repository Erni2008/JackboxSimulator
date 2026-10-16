package com.erni.finalanswer.ui.effects;

import com.erni.finalanswer.ui.RuntimeTextures;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.Disposable;

/** Aligned lighting stages; transitions never fade through black. */
public final class GenerationCodeBackground extends Actor implements Disposable {
    private static final float HOLD_SECONDS = 1.8f;
    private static final float TRANSITION_SECONDS = 2.6f;
    private static final float STEP_SECONDS = HOLD_SECONDS + TRANSITION_SECONDS;
    private final Texture[] frames = new Texture[2];
    private float elapsed;
    private boolean disposed;

    public GenerationCodeBackground() {
        setTouchable(Touchable.disabled);
        try {
            for (int i = 0; i < frames.length; i++) {
                frames[i] = RuntimeTextures.load(
                    "backgrounds/generation_code/stage" + (i + 2) + ".png");
                frames[i].setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear);
            }
        } catch (RuntimeException error) {
            dispose();
            throw error;
        }
    }

    @Override
    public void act(float delta) {
        super.act(delta);
        elapsed = (elapsed + Math.max(0, Math.min(delta, 0.1f)))
            % (STEP_SECONDS * frames.length);
    }

    @Override
    public void draw(Batch batch, float parentAlpha) {
        int current = (int) (elapsed / STEP_SECONDS);
        float phase = elapsed - current * STEP_SECONDS;
        float blend = Interpolation.smoother.apply(Math.max(0,
            (phase - HOLD_SECONDS) / TRANSITION_SECONDS));
        float saved = batch.getPackedColor();
        Color tint = getColor();
        batch.setColor(tint.r, tint.g, tint.b, tint.a * parentAlpha);
        batch.draw(frames[current], getX(), getY(), getWidth(), getHeight());
        batch.setColor(tint.r, tint.g, tint.b, tint.a * parentAlpha * blend);
        batch.draw(frames[(current + 1) % frames.length], getX(), getY(), getWidth(), getHeight());
        batch.setPackedColor(saved);
    }

    @Override
    public void dispose() {
        if (disposed) return;
        disposed = true;
        for (Texture frame : frames) if (frame != null) frame.dispose();
    }
}
