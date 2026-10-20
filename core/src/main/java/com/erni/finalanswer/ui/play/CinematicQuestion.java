package com.erni.finalanswer.ui.play;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.gameplay.presentation.QuestionPresentationController;
import com.erni.finalanswer.gameplay.questions.Question;
import com.erni.finalanswer.ui.UiFonts;
import java.util.Random;

/** Cached glyph quads retain kerning and wrapping; only their transforms/colors change while drawing. */
public final class CinematicQuestion extends Actor implements Disposable {
    public static final int FONT_SIZE = 86;
    public static final float MAX_WIDTH_FRACTION = .8f, MAX_HEIGHT_FRACTION = .27f;
    public static final float FINAL_SCALE = .60f;
    private final BitmapFont displayFont;
    private final BitmapFont fallback = UiFonts.question(FONT_SIZE);
    private final GlyphLayout layout = new GlyphLayout();
    private final float[] working = new float[20];
    private float[][] quads = new float[0][];
    private Texture[] textures = new Texture[0];
    private float[] tilt = new float[0], offset = new float[0];
    private float centerX, centerY;
    private double seconds;
    private boolean reducedMotion, disposed;

    public CinematicQuestion() {
        setName("cinematicQuestion"); setTouchable(Touchable.disabled);
        displayFont = UiFonts.horror(FONT_SIZE);
    }

    public void prepare(Question question, float viewportWidth, float viewportHeight, boolean reducedMotion) {
        this.reducedMotion = reducedMotion;
        BitmapFont font = displayFont;
        for (int i = 0; i < question.text().length(); i++)
            if (!displayFont.getData().hasGlyph(question.text().charAt(i)) && !Character.isWhitespace(question.text().charAt(i))) { font = fallback; break; }
        font.getData().markupEnabled = false;
        float scale = question.text().length() < 65 ? 1.12f : 1;
        float maxWidth = viewportWidth * MAX_WIDTH_FRACTION;
        do {
            font.getData().setScale(scale);
            layout.setText(font, question.text(), Color.WHITE, maxWidth, Align.center, true);
            if (layout.height <= viewportHeight * MAX_HEIGHT_FRACTION && layout.width <= maxWidth + 1) break;
            scale *= .94f;
        } while (scale > .2f);
        BitmapFontCache cache = new BitmapFontCache(font, false);
        cache.setText(layout, 0, 0);
        int count = 0;
        for (var run : layout.runs) count += run.glyphs.size;
        quads = new float[count][20]; textures = new Texture[count];
        tilt = new float[count]; offset = new float[count];
        int[] pageOffsets = new int[font.getRegions().size];
        var random = new Random(question.id().hashCode());
        float minX = Float.MAX_VALUE, maxX = -Float.MAX_VALUE, minY = Float.MAX_VALUE, maxY = -Float.MAX_VALUE;
        int index = 0;
        for (var run : layout.runs) for (var glyph : run.glyphs) {
            int page = glyph.page, start = pageOffsets[page]; pageOffsets[page] += 20;
            System.arraycopy(cache.getVertices(page), start, quads[index], 0, 20);
            textures[index] = font.getRegion(page).getTexture();
            tilt[index] = (random.nextFloat() * 2 - 1) * 1.6f;
            offset[index] = (random.nextFloat() * 2 - 1) * 1.5f;
            for (int v = 0; v < 20; v += 5) {
                minX = Math.min(minX, quads[index][v]); maxX = Math.max(maxX, quads[index][v]);
                minY = Math.min(minY, quads[index][v + 1]); maxY = Math.max(maxY, quads[index][v + 1]);
            }
            index++;
        }
        centerX = (minX + maxX) / 2; centerY = (minY + maxY) / 2;
        setSize(maxX - minX, maxY - minY);
        seconds = 0;
    }
    public void setTime(double seconds) { this.seconds = seconds; }
    public int glyphCount() { return quads.length; }
    public float layoutHeight() { return layout.height; }
    public float layoutWidth() { return layout.width; }
    @Override public void draw(Batch batch, float parentAlpha) {
        if (disposed) return;
        float saved = batch.getPackedColor();
        float cx = getX() + getWidth()/2, cy = getY() + getHeight()/2;
        for (int i = 0; i < quads.length; i++) {
            double age = seconds - i * QuestionPresentationController.CHARACTER_DELAY;
            if (age <= 0) continue;
            float p = (float) Math.min(1, age / QuestionPresentationController.CHARACTER_APPEAR);
            float alpha = p * p * (3 - 2 * p) * parentAlpha * getColor().a;
            float drift = reducedMotion ? 0 : -6 * (1-p) + (float) Math.sin(p * Math.PI * 2) * 1.8f * (1-p);
            float angle = reducedMotion ? 0 : tilt[i] + (float) Math.sin(p * Math.PI * 2) * 2 * (1-p);
            float sin = com.badlogic.gdx.math.MathUtils.sinDeg(angle), cos = com.badlogic.gdx.math.MathUtils.cosDeg(angle);
            float[] base = quads[i];
            float gx = (base[0] + base[10])/2, gy = (base[1] + base[11])/2;
            for (int pass = 0; pass < 2; pass++) {
                float packed = pass == 0 ? Color.toFloatBits(22/255f,9/255f,9/255f,alpha * .85f)
                    : Color.toFloatBits(242/255f,239/255f,233/255f,alpha);
                for (int v = 0; v < 20; v += 5) {
                    float x = base[v]-gx, y = base[v+1]-gy;
                    working[v] = cx + (gx-centerX + x*cos-y*sin + (pass==0?2:0)) * getScaleX();
                    working[v+1] = cy + (gy-centerY + x*sin+y*cos + drift + (reducedMotion?0:offset[i]) - (pass==0?2:0)) * getScaleY();
                    working[v+2] = packed; working[v+3] = base[v+3]; working[v+4] = base[v+4];
                }
                batch.draw(textures[i], working, 0, 20);
            }
        }
        batch.setPackedColor(saved);
    }
    @Override public void dispose() {
        if (disposed) return; disposed = true;
        displayFont.dispose(); fallback.dispose();
    }
}
