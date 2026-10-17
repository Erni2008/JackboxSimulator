package com.erni.finalanswer.ui.clock;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.gameplay.clock.ClockTimeline;
import com.erni.finalanswer.ui.RuntimeTextures;

/** Layered PNG clock. All anchors below are original PNG pixels, measured from the top left. */
public final class ClockTimerActor extends Actor implements Disposable {
    public static final float BODY_CENTER_X = 656, BODY_CENTER_Y = 598, BODY_WIDTH = 820;
    public static final float HAND_PIVOT_X = 656, HAND_PIVOT_Y = 838;
    private static final float CANVAS_WIDTH = 1312, CANVAS_HEIGHT = 1199;
    private static final float FACE_RADIUS = 260, HAND_SCALE = .30f;
    // clock3 duplicates the open pose; clock9 is almost identical to clock10.
    // clock7 is absent. The remaining frames are ordered by actual lid coverage.
    private static final int[] FRAME_FILES = {1, 4, 5, 6, 8, 10, 11};
    private static final float[] FRAME_CENTER_Y = {598, 653, 647, 641, 661, 659, 665};
    private static final float[] FRAME_SCALE = {1, 820f/951, 820f/926, 820f/951, 820f/1017, 820f/1015, 820f/962};
    private final Texture[] frames = new Texture[FRAME_FILES.length];
    private final TextureRegion[] regions = new TextureRegion[FRAME_FILES.length];
    private final Texture hand;
    private final TextureRegion handRegion;
    private final ShapeRenderer shapes;
    private final ClockTimeline timeline;
    private final double duration;
    private boolean disposed, reducedMotion;
    private float entrance;

    public ClockTimerActor() { this(20); }
    public ClockTimerActor(double duration) {
        setName("gothicClock");
        setTouchable(Touchable.disabled);
        timeline = new ClockTimeline(duration);
        this.duration = duration;
        Texture loadedHand = null;
        ShapeRenderer loadedShapes = null;
        try {
            for (int i = 0; i < frames.length; i++) {
                frames[i] = RuntimeTextures.load("clock/clock" + FRAME_FILES[i] + ".png");
                regions[i] = new TextureRegion(frames[i]);
            }
            loadedHand = RuntimeTextures.load("clock/clock2.png");
            loadedShapes = new ShapeRenderer(256);
        } catch (RuntimeException error) {
            for (Texture texture : frames) if (texture != null) texture.dispose();
            if (loadedHand != null) loadedHand.dispose();
            if (loadedShapes != null) loadedShapes.dispose();
            throw error;
        }
        hand = loadedHand;
        handRegion = new TextureRegion(hand);
        shapes = loadedShapes;
    }

    public ClockTimeline timeline() { return timeline; }
    public void reset() { timeline.reset(); entrance = 0; }
    public void start() { timeline.start(); entrance = 1; }
    public void update(float delta) { if (!disposed) timeline.update(delta); }
    public void setReducedMotion(boolean value) { reducedMotion = value; }
    /** Negative seconds means waiting. Intro appearance occurs before the countdown starts. */
    public void synchronize(double answerElapsed, double introElapsed) {
        if (disposed) return;
        entrance = reducedMotion ? 1 : (float) Math.max(0, Math.min(1, (introElapsed - 3) / .3));
        if (answerElapsed >= 0) timeline.synchronize(answerElapsed);
    }

    @Override public void draw(Batch batch, float parentAlpha) {
        if (disposed || entrance == 0 || timeline.state() == ClockTimeline.State.FINISHED) return;
        float saved = batch.getPackedColor();
        float alpha = parentAlpha * getColor().a * entrance;
        float scale = getWidth() / BODY_WIDTH;
        float cx = getX() + getWidth() / 2;
        float cy = getY() + (CANVAS_HEIGHT - BODY_CENTER_Y) * scale;
        if (!reducedMotion && timeline.state() == ClockTimeline.State.RUNNING) {
            double remaining = timeline.remainingSeconds();
            float envelope = (float) Math.min(1, Math.min((duration - remaining) / .4, remaining / .25));
            float urgency = (float) Math.max(0, 1 - remaining / 5);
            float amplitude = getWidth() * .002f * envelope * (1 + urgency * .35f);
            // One shared rigid offset: hand pivot and sector remain aligned with the dial.
            cx += amplitude * ((float) Math.sin(remaining * 17) + .3f * (float) Math.sin(remaining * 29));
            cy += amplitude * .65f * (float) Math.sin(remaining * 19 + .7);
        }
        if (timeline.state() == ClockTimeline.State.FALLING) {
            float p = timeline.fallingProgress();
            // Enough travel to put even the crown below the viewport, regardless of window size.
            float travel = getY() + CANVAS_HEIGHT * scale + 32;
            cy -= travel * p * p * p;
        }
        if (timeline.state() == ClockTimeline.State.WAITING || timeline.state() == ClockTimeline.State.RUNNING) {
            drawFrame(batch, 0, cx, cy, scale, alpha);
            drawSector(batch, cx, cy, FACE_RADIUS * scale, alpha);
            drawHand(batch, cx, cy, scale, -timeline.angleDegrees(), alpha);
        } else {
            float position = timeline.closingProgress() * (regions.length - 1);
            int index = Math.min(regions.length - 1, (int) position);
            float mix = position - index;
            mix = mix * mix * (3 - 2 * mix);
            // Opaque stationary base avoids a transparent flash during the crossfade.
            drawFrame(batch, index, cx, cy, scale, alpha);
            if (index == 0) drawHand(batch, cx, cy, scale, 0, alpha);
            if (index + 1 < regions.length) drawFrame(batch, index + 1, cx, cy, scale, alpha * mix);
        }
        batch.setPackedColor(saved);
    }

    private void drawFrame(Batch batch, int index, float cx, float cy, float scale, float alpha) {
        float s = scale * FRAME_SCALE[index];
        batch.setColor(1, 1, 1, alpha);
        batch.draw(regions[index], cx - BODY_CENTER_X * s,
            cy - (CANVAS_HEIGHT - FRAME_CENTER_Y[index]) * s, CANVAS_WIDTH * s, CANVAS_HEIGHT * s);
    }
    private void drawHand(Batch batch, float cx, float cy, float scale, float rotation, float alpha) {
        float s = scale * HAND_SCALE;
        float originX = HAND_PIVOT_X * s, originY = (CANVAS_HEIGHT - HAND_PIVOT_Y) * s;
        batch.setColor(1, 1, 1, alpha);
        batch.draw(handRegion, cx - originX, cy - originY, originX, originY,
            CANVAS_WIDTH * s, CANVAS_HEIGHT * s, 1, 1, rotation);
    }
    private void drawSector(Batch batch, float cx, float cy, float radius, float alpha) {
        float angle = timeline.angleDegrees();
        if (angle <= 0) return;
        double remaining = timeline.remainingSeconds();
        float urgency = remaining <= 5 ? (float) (1 - remaining / 5) : 0;
        float pulse = reducedMotion ? 0 : (float) (.5 + .5 * Math.sin(remaining * Math.PI * 2));
        float opacity = .46f + urgency * (.04f + .02f * pulse);
        shapes.setProjectionMatrix(batch.getProjectionMatrix());
        shapes.setTransformMatrix(batch.getTransformMatrix());
        boolean blending = Gdx.gl.glIsEnabled(GL20.GL_BLEND);
        batch.end();
        Gdx.gl.glEnable(GL20.GL_BLEND);
        Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA, GL20.GL_ONE_MINUS_SRC_ALPHA);
        shapes.begin(ShapeRenderer.ShapeType.Filled);
        shapes.setColor((116 + urgency * 12) / 255f, 5 / 255f, 14 / 255f, opacity * alpha);
        // World angles grow counter-clockwise. The wedge runs from the hand to XII.
        shapes.arc(cx, cy, radius, 90 - angle, angle, 64);
        shapes.end();
        if (!blending) Gdx.gl.glDisable(GL20.GL_BLEND);
        batch.begin();
    }
    @Override public void dispose() {
        if (disposed) return;
        disposed = true;
        remove();
        for (Texture frame : frames) frame.dispose();
        hand.dispose();
        shapes.dispose();
    }
}
