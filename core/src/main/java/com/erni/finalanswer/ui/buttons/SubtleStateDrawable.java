package com.erni.finalanswer.ui.buttons;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.scenes.scene2d.utils.BaseDrawable;
import com.badlogic.gdx.scenes.scene2d.utils.Drawable;

/** Restrained hover/press artwork, without adding movement or a timed animation. */
public final class SubtleStateDrawable extends BaseDrawable {
    private final Drawable base;
    private final Drawable state;
    private final float strength;

    public SubtleStateDrawable(Drawable base, Drawable state, float strength) {
        super(base);
        this.base = base;
        this.state = state;
        this.strength = strength;
    }

    @Override
    public void draw(Batch batch, float x, float y, float width, float height) {
        float packedColor = batch.getPackedColor();
        Color tint = batch.getColor();
        float r = tint.r, g = tint.g, b = tint.b, a = tint.a;
        try {
            base.draw(batch, x, y, width, height);
            batch.setColor(r, g, b, a * strength);
            state.draw(batch, x, y, width, height);
        } finally {
            batch.setPackedColor(packedColor);
        }
    }
}
