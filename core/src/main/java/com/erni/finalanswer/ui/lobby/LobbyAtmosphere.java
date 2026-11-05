package com.erni.finalanswer.ui.lobby;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.utils.Disposable;

/**
 * Living light and air for the waiting room, laid over the painted background (1920×1080 stage space).
 * BACK layer (behind the cages): moonlight through the three ceiling windows with drifting cloud shadow, dust motes
 * that sparkle inside the beams, candle flames with a breathing halo. FRONT layer (over the cages): floor mist and a
 * film finish (vignette + fine grain). Everything is procedural; reduced motion freezes it to a still, lit frame.
 */
public final class LobbyAtmosphere implements Disposable {
    public enum Layer { BACK, FRONT }
    // painted positions (stage space): window centres / bottoms, candle flames
    private static final float[][] WINDOWS = {{822, 952, 120}, {1122, 968, 180}, {1443, 968, 150}};
    private static final float[][] CANDLES = {{12, 566}, {42, 548}, {1888, 632}, {1894, 428}, {96, 158}, {482, 216}, {1398, 458}, {1846, 214}};
    private final Texture glow, beam, fog, grain, vignette; private float time; private boolean reduced;
    private final float[] mx = new float[260], my = new float[260], mv = new float[260], ms = new float[260], mp = new float[260];

    public LobbyAtmosphere() {
        glow = radial(128); beam = beamTex(); fog = fogTex(); grain = grainTex(); vignette = vignetteTex();
        for (int i = 0; i < mx.length; i++) { mx[i] = MathUtils.random(560, 1760); my[i] = MathUtils.random(60, 1000); mv[i] = MathUtils.random(4f, 14f); ms[i] = MathUtils.random(1.4f, 3.6f); mp[i] = MathUtils.random(0, 100f); }
    }
    public void reducedMotion(boolean value) { reduced = value; }
    public void update(float delta) { if (!reduced) time += delta; }
    /** an actor that draws one layer, for placing in the stage between the background and the cages / above them */
    public Actor layer(Layer layer) { return new Actor() { { setBounds(0, 0, 1920, 1080); setTouchable(com.badlogic.gdx.scenes.scene2d.Touchable.disabled); }
        @Override public void act(float delta) { if (layer == Layer.BACK) update(delta); }
        @Override public void draw(Batch batch, float alpha) { if (layer == Layer.BACK) drawBack(batch, alpha); else drawFront(batch, alpha); } }; }

    private float cloud(float x) { return .72f + .28f * (float) (Math.sin(time * .11f + x * .004f) * .6 + Math.sin(time * .23f + x * .011f + 1.7f) * .4); }

    void drawBack(Batch batch, float alpha) {
        int src = batch.getBlendSrcFunc(), dst = batch.getBlendDstFunc(); Color saved = batch.getColor().cpy();
        batch.setBlendFunction(GL20.GL_SRC_ALPHA, GL20.GL_ONE);
        // moon glow on the window panes and the shafts falling from them
        for (float[] w : WINDOWS) { float k = cloud(w[0]);
            batch.setColor(.62f, .74f, 1f, .32f * k * alpha); batch.draw(glow, w[0] - w[2], w[1] - w[2] * .2f, w[2] * 2, w[2] * 1.6f);
            for (int s = 0; s < 3; s++) { float spread = (s - 1) * w[2] * .32f, len = 940, width = w[2] * (.55f + .15f * s), lean = 9 + s * 2.5f;
                batch.setColor(.55f, .68f, 1f, (.075f + .02f * s) * k * alpha);
                batch.draw(beam, w[0] + spread - width / 2, w[1] - len, width / 2, len, width, len, 1, 1, lean, 0, 0, beam.getWidth(), beam.getHeight(), false, false); } }
        // dust: drifting slowly, sparkling when it crosses a beam
        for (int i = 0; i < mx.length; i++) { float y = (my[i] + time * mv[i]) % 1000 + 40, x = mx[i] + (float) Math.sin(time * .3f + mp[i]) * 22;
            float lit = 0; for (float[] w : WINDOWS) { float cx = w[0] + (w[1] - y) * (float) Math.tan(Math.toRadians(10)); lit = Math.max(lit, 1 - Math.abs(x - cx) / (w[2] * .75f)); }
            lit = Math.max(0, lit); float tw = .5f + .5f * (float) Math.sin(time * 2.1f + mp[i] * 3);
            batch.setColor(.85f, .9f, 1f, (.05f + .55f * lit * tw) * alpha); batch.draw(glow, x - ms[i], y - ms[i], ms[i] * 2, ms[i] * 2); }
        // candles: a hot core, a soft halo, a wide warm spill, all flickering
        for (int i = 0; i < CANDLES.length; i++) { float[] c = CANDLES[i]; float f = .82f + .1f * (float) Math.sin(time * 13 + i * 2.1f) + .08f * (float) Math.sin(time * 29 + i) + (reduced ? 0 : MathUtils.random(-.04f, .04f));
            batch.setColor(1f, .55f, .22f, .16f * f * alpha); batch.draw(glow, c[0] - 120 * f, c[1] - 110 * f, 240 * f, 240 * f);
            batch.setColor(1f, .72f, .36f, .38f * f * alpha); batch.draw(glow, c[0] - 34 * f, c[1] - 30 * f, 68 * f, 72 * f);
            batch.setColor(1f, .93f, .75f, .8f * f * alpha); batch.draw(glow, c[0] - 6, c[1] - 6 + 2 * f, 12, 18 * f); }
        batch.setBlendFunction(src, dst); batch.setColor(saved);
    }

    void drawFront(Batch batch, float alpha) {
        Color saved = batch.getColor().cpy();
        // floor mist: three slow layers moving against each other
        for (int l = 0; l < 3; l++) { float u = (time * (.006f + l * .004f) * (l % 2 == 0 ? 1 : -1)) % 1f, y = -40 + l * 70, h = 260 - l * 40;
            batch.setColor(.62f, .66f, .78f, (.16f - l * .03f) * alpha);
            batch.draw(fog, 0, y, 1920, h, u, 1, u + 1.6f, 0); }
        // film finish: vignette and a fine moving grain
        batch.setColor(1, 1, 1, .85f * alpha); batch.draw(vignette, 0, 0, 1920, 1080);
        if (!reduced) { float gx = MathUtils.random(), gy = MathUtils.random(); batch.setColor(1, 1, 1, .05f * alpha); batch.draw(grain, 0, 0, 1920, 1080, gx, gy, gx + 7.5f, gy + 4.2f); }
        batch.setColor(saved);
    }

    // ------------------------------------------------------------------ procedural textures
    private static Texture finish(Pixmap p, boolean repeat) { Texture t = new Texture(p); p.dispose(); t.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear); if (repeat) t.setWrap(Texture.TextureWrap.Repeat, Texture.TextureWrap.Repeat); return t; }
    private static Texture radial(int n) { Pixmap p = new Pixmap(n, n, Pixmap.Format.RGBA8888); p.setBlending(Pixmap.Blending.None);
        for (int y = 0; y < n; y++) for (int x = 0; x < n; x++) { float d = (float) Math.hypot(x - n / 2f + .5f, y - n / 2f + .5f) / (n / 2f), a = Math.max(0, 1 - d); a = a * a * (3 - 2 * a); p.drawPixel(x, y, Color.rgba8888(1, 1, 1, a)); }
        return finish(p, false); }
    private static Texture beamTex() { int w = 64, h = 256; Pixmap p = new Pixmap(w, h, Pixmap.Format.RGBA8888); p.setBlending(Pixmap.Blending.None);
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) { float across = 1 - Math.abs((x + .5f) / w * 2 - 1), along = 1 - (float) y / (h - 1); // pixmap row 0 is the window end (bright)
            float a = (float) Math.pow(across, 1.6) * (float) Math.pow(along, 1.4) * (.75f + .25f * (float) Math.sin(x * .9 + y * .05)); p.drawPixel(x, y, Color.rgba8888(1, 1, 1, Math.max(0, a))); }
        return finish(p, false); }
    private static Texture fogTex() { int w = 512, h = 128; Pixmap p = new Pixmap(w, h, Pixmap.Format.RGBA8888); p.setBlending(Pixmap.Blending.SourceOver); p.setColor(0, 0, 0, 0); p.fill();
        var r = new java.util.Random(7); float[] acc = new float[w * h];
        for (int i = 0; i < 90; i++) { float cx = r.nextFloat() * w, cy = 30 + r.nextFloat() * 70, rad = 20 + r.nextFloat() * 60;
            for (int y = 0; y < h; y++) for (int x = -w; x < 2 * w; x++) { int xx = ((x % w) + w) % w; float d = (float) Math.hypot(x - cx, (y - cy) * 1.8f) / rad; if (d < 1) acc[y * w + xx] += (1 - d) * (1 - d) * .35f; } }
        for (int y = 0; y < h; y++) { float fade = (float) Math.sin(Math.PI * y / (h - 1)); for (int x = 0; x < w; x++) p.drawPixel(x, y, Color.rgba8888(1, 1, 1, Math.min(1, acc[y * w + x]) * fade)); }
        return finish(p, true); }
    private static Texture grainTex() { int n = 256; Pixmap p = new Pixmap(n, n, Pixmap.Format.RGBA8888); p.setBlending(Pixmap.Blending.None); var r = new java.util.Random(3);
        for (int y = 0; y < n; y++) for (int x = 0; x < n; x++) { float v = r.nextFloat(); p.drawPixel(x, y, Color.rgba8888(v, v, v, Math.abs(v - .5f) * 2)); } return finish(p, true); }
    private static Texture vignetteTex() { int w = 256, h = 144; Pixmap p = new Pixmap(w, h, Pixmap.Format.RGBA8888); p.setBlending(Pixmap.Blending.None);
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) { float dx = (x + .5f) / w * 2 - 1, dy = (y + .5f) / h * 2 - 1, d = (float) Math.sqrt(dx * dx * .8f + dy * dy), a = Math.max(0, Math.min(1, (d - .62f) / .7f)); p.drawPixel(x, y, Color.rgba8888(0, 0, 0, a * a * .75f)); }
        return finish(p, false); }
    @Override public void dispose() { glow.dispose(); beam.dispose(); fog.dispose(); grain.dispose(); vignette.dispose(); }
}
