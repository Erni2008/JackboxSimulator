package com.erni.finalanswer.ui.play;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Rectangle;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.Align;
import com.erni.finalanswer.gameplay.round.RoundTiming;

/** Non-interactive lettering. Cached number and text share one transform and a visual-center pivot. */
public final class AnswerView extends Group {
    public static final float CORRECT_SCALE = 1.40f;
    public static final String NUMBER_COLOR = "D4D900", TEXT_COLOR = "F2EFE9";
    private static final float TEXT_GAP = 18;
    private final BitmapFont numberFont, displayFont, fallbackFont;
    private final GlyphLayout numberLayout = new GlyphLayout(), textLayout = new GlyphLayout();
    private final BitmapFontCache numberCache, displayCache, fallbackCache;
    private BitmapFontCache textCache;
    private final Rectangle numberBounds = new Rectangle(), textBounds = new Rectangle();
    private final int index;
    private float centerX, centerY, viewportWidth, viewportHeight, tilt;

    public AnswerView(int index, BitmapFont numberFont, BitmapFont displayFont, BitmapFont fallbackFont) {
        this.index = index;
        this.numberFont = numberFont; this.displayFont = displayFont; this.fallbackFont = fallbackFont;
        numberCache = new BitmapFontCache(numberFont, false);
        displayCache = new BitmapFontCache(displayFont, false);
        fallbackCache = new BitmapFontCache(fallbackFont, false);
        setName("answer" + index);
        setTouchable(Touchable.disabled);
        setTransform(true);
    }

    public void prepare(String value, float xFraction, float yFraction, float angle, float width, float height) {
        viewportWidth = width; viewportHeight = height;
        centerX = width * xFraction; centerY = height * yFraction; tilt = angle;
        numberFont.getData().setScale(1);
        numberLayout.setText(numberFont, Integer.toString(index + 1), Color.valueOf(NUMBER_COLOR), 0, Align.left, false);
        numberCache.setText(numberLayout, 0, 0);
        bounds(numberCache, numberBounds);
        BitmapFont font = displayFont;
        for (int i = 0; i < value.length(); i++) {
            if (!Character.isWhitespace(value.charAt(i)) && !font.getData().hasGlyph(value.charAt(i))) {
                font = fallbackFont; break;
            }
        }
        textCache = font == displayFont ? displayCache : fallbackCache;
        float maxTextWidth = width * .35f - numberBounds.width - TEXT_GAP;
        float maxTextHeight = height * .09f;
        float fontScale = 1;
        // Reflow only when preparing a question, including unbroken long words.
        do {
            font.getData().setScale(fontScale);
            textLayout.setText(font, value, Color.valueOf(TEXT_COLOR), maxTextWidth, Align.left, true);
            textCache.setText(textLayout, 0, 0);
            bounds(textCache, textBounds);
            if (textBounds.width <= maxTextWidth && textBounds.height <= maxTextHeight) break;
            fontScale *= .94f;
        } while (fontScale > .01f);
        font.getData().setScale(1);
        setSize(numberBounds.width + TEXT_GAP + textBounds.width, Math.max(numberBounds.height, textBounds.height));
        numberCache.translate(-numberBounds.x, (getHeight() - numberBounds.height) / 2 - numberBounds.y);
        textCache.translate(numberBounds.width + TEXT_GAP - textBounds.x, (getHeight() - textBounds.height) / 2 - textBounds.y);
        setOrigin(getWidth() / 2, getHeight() / 2);
        present(0, false, -1, false);
    }

    /** Negative resultSeconds means clocks are still running/closing/falling. No independent timers. */
    public void present(float progress, boolean correct, double resultSeconds, boolean reducedMotion) {
        float intro = Interpolation.smoother.apply(MathUtils.clamp(progress, 0, 1));
        float grow = resultSeconds < 0 ? 0 : Interpolation.smoother.apply(
            (float) Math.min(1, resultSeconds / RoundTiming.CORRECT_GROW_SECONDS));
        float fade = resultSeconds < 0 ? 0 : Interpolation.smoother.apply(
            (float) Math.min(1, resultSeconds / RoundTiming.WRONG_FADE_SECONDS));
        float alpha = intro * (correct ? 1 : 1 - fade);
        getColor().a = alpha;
        setVisible(alpha > 0);
        setRotation(reducedMotion ? 0 : tilt);
        float scale = (reducedMotion ? 1 : .9f + .1f * intro) * (correct ? 1 + (CORRECT_SCALE - 1) * grow : 1);
        setScale(scale);
        float x = centerX, y = centerY;
        if (correct && grow > 0) {
            // Keep the enlarged visual bounds within the scene and below the question.
            float halfW = extentX(CORRECT_SCALE), halfH = extentY(CORRECT_SCALE);
            x += (MathUtils.clamp(centerX, viewportWidth * .035f + halfW, viewportWidth * .965f - halfW) - centerX) * grow;
            y += (MathUtils.clamp(centerY, viewportHeight * .09f + halfH, viewportHeight * .655f - halfH) - centerY) * grow;
        }
        if (!reducedMotion) y -= 10 * (1 - intro) + (correct ? 0 : 9 * fade);
        setPosition(x - getWidth() / 2, y - getHeight() / 2);
    }

    private float extentX(float scale) {
        return (Math.abs(MathUtils.cosDeg(getRotation())) * getWidth() + Math.abs(MathUtils.sinDeg(getRotation())) * getHeight()) * scale / 2;
    }
    private float extentY(float scale) {
        return (Math.abs(MathUtils.sinDeg(getRotation())) * getWidth() + Math.abs(MathUtils.cosDeg(getRotation())) * getHeight()) * scale / 2;
    }
    /** Rotated visual bounds, useful for layout checks without allocating in the render loop. */
    public void visualBounds(Rectangle target) {
        float x = extentX(getScaleX()), y = extentY(getScaleY());
        target.set(getX() + getWidth()/2 - x, getY() + getHeight()/2 - y, x*2, y*2);
    }
    private static void bounds(BitmapFontCache cache, Rectangle target) {
        float minX = Float.MAX_VALUE, minY = Float.MAX_VALUE, maxX = -Float.MAX_VALUE, maxY = -Float.MAX_VALUE;
        for (int page = 0; page < cache.getFont().getRegions().size; page++) {
            float[] vertices = cache.getVertices(page);
            for (int i = 0; i < cache.getVertexCount(page); i += 5) {
                minX = Math.min(minX, vertices[i]); maxX = Math.max(maxX, vertices[i]);
                minY = Math.min(minY, vertices[i+1]); maxY = Math.max(maxY, vertices[i+1]);
            }
        }
        if (minX == Float.MAX_VALUE) target.set(0,0,0,0);
        else target.set(minX,minY,maxX-minX,maxY-minY);
    }
    @Override public void draw(Batch batch, float parentAlpha) {
        if (textCache == null || getColor().a <= 0) return;
        float saved = batch.getPackedColor();
        applyTransform(batch, computeTransform());
        float alpha = parentAlpha * getColor().a;
        numberCache.setAlphas(alpha); textCache.setAlphas(alpha);
        numberCache.draw(batch); textCache.draw(batch);
        resetTransform(batch);
        batch.setPackedColor(saved);
    }
}
