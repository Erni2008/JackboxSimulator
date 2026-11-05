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
    // background_dungeon.png: three barred windows (centre x, bottom y, half width) and the wall candle (+ its floor reflection)
    private static final float[][] WINDOWS = {{780, 846, 96}, {1140, 846, 100}, {1548, 852, 96}};
    private static final float[][] CANDLES = {{267, 755}};
    private static final float[][] REFLECTIONS = {{262, 104}};
    // window panes (x0, y0, x1, y1), the moon (x, y, radius), the moonlit patches on the wet floor (x0, y0, x1, y1)
    private static final float[][] PANES = {{688, 846, 872, 1046}, {1044, 846, 1238, 1052}, {1454, 858, 1644, 1052}};
    private static final float[] MOON = {1179, 946, 31};
    private static final float[][] PATCHES = {{618, 300, 918, 352}, {950, 222, 1344, 352}, {1468, 252, 1840, 345}};
    private final Texture ring, bat;
    private final float[] dropX = new float[6], dropT = new float[6], dropFloor = new float[6]; private float nextDrop = 2;
    private final float[] batX = new float[3], batY = new float[3], batV = new float[3], batS = new float[3]; private float nextBats = 6;
    private final Texture glow, beam, fog, grain, vignette; private float time; private boolean reduced;
    private final float[] mx = new float[260], my = new float[260], mv = new float[260], ms = new float[260], mp = new float[260];

    public LobbyAtmosphere() {
        glow = radial(128); beam = beamTex(); fog = fogTex(); grain = grainTex(); vignette = vignetteTex(); ring = ringTex(); bat = batTex();
        java.util.Arrays.fill(dropT, -1); java.util.Arrays.fill(batX, -1e4f);
        for (int i = 0; i < mx.length; i++) { mx[i] = MathUtils.random(560, 1760); my[i] = MathUtils.random(60, 1000); mv[i] = MathUtils.random(4f, 14f); ms[i] = MathUtils.random(1.4f, 3.6f); mp[i] = MathUtils.random(0, 100f); }
    }
    public void reducedMotion(boolean value) { reduced = value; }
    public void update(float delta) { if (reduced) return; time += delta;
        // water drips: fall from the beams, splash rings on the wet floor
        if ((nextDrop -= delta) <= 0) { nextDrop = 1.2f + MathUtils.random(2.8f); for (int i = 0; i < dropT.length; i++) if (dropT[i] < 0) { dropT[i] = 0; dropX[i] = MathUtils.random(560, 1860); dropFloor[i] = MathUtils.random(90, 330); break; } }
        for (int i = 0; i < dropT.length; i++) if (dropT[i] >= 0 && (dropT[i] += delta) > 2.6f) dropT[i] = -1;
        // now and then a bat or two crosses the moonlit windows
        if ((nextBats -= delta) <= 0) { nextBats = 14 + MathUtils.random(16f); int n = 1 + MathUtils.random(1); for (int i = 0; i < n; i++) { batX[i] = 560 - i * 70; batY[i] = 900 + MathUtils.random(-40, 110); batV[i] = 260 + MathUtils.random(120f); batS[i] = .8f + MathUtils.random(.5f); } }
        for (int i = 0; i < batX.length; i++) if (batX[i] > -1e3f) { batX[i] += batV[i] * delta; batY[i] += (float) Math.sin(time * 3 + i) * 18 * delta; if (batX[i] > 2000) batX[i] = -1e4f; } }
    /** 1 = clear moon, ~0.45 = a thick cloud passing in front of it */
    private float clear() { float c = (float) (Math.sin(time * .07f) * .5 + Math.sin(time * .173f + 1.3f) * .35 + Math.sin(time * .41f + 4) * .15); return .45f + .55f * MathUtils.clamp(.6f - c, 0, 1); }
    /** an actor that draws one layer, for placing in the stage between the background and the cages / above them */
    public Actor layer(Layer layer) { return new Actor() { { setBounds(0, 0, 1920, 1080); setTouchable(com.badlogic.gdx.scenes.scene2d.Touchable.disabled); }
        @Override public void act(float delta) { if (layer == Layer.BACK) update(delta); }
        @Override public void draw(Batch batch, float alpha) { if (layer == Layer.BACK) drawBack(batch, alpha); else drawFront(batch, alpha); } }; }

    private float cloud(float x) { return .72f + .28f * (float) (Math.sin(time * .11f + x * .004f) * .6 + Math.sin(time * .23f + x * .011f + 1.7f) * .4); }

    void drawBack(Batch batch, float alpha) {
        int src = batch.getBlendSrcFunc(), dst = batch.getBlendDstFunc(); Color saved = batch.getColor().cpy();
        batch.setBlendFunction(GL20.GL_SRC_ALPHA, GL20.GL_ONE);
        float sky = clear();
        // moon: a tight bright core glow, a soft halo and a wide corona, breathing with the passing clouds
        batch.setColor(.95f, .97f, 1f, .55f * sky * alpha); batch.draw(glow, MOON[0] - MOON[2] * 1.6f, MOON[1] - MOON[2] * 1.6f, MOON[2] * 3.2f, MOON[2] * 3.2f);
        batch.setColor(.7f, .8f, 1f, .32f * sky * alpha); batch.draw(glow, MOON[0] - MOON[2] * 3.4f, MOON[1] - MOON[2] * 3.4f, MOON[2] * 6.8f, MOON[2] * 6.8f);
        batch.setColor(.5f, .62f, 1f, .16f * sky * alpha); batch.draw(glow, MOON[0] - MOON[2] * 7, MOON[1] - MOON[2] * 7, MOON[2] * 14, MOON[2] * 14);
        // moonlit clouds drifting across the panes (additive: the iron bars stay dark)
        for (int i = 0; i < PANES.length; i++) { float[] p = PANES[i]; float u = time * (.012f + i * .003f) + i * .37f;
            batch.setColor(.62f, .72f, 1f, (.2f - .1f * sky + .06f) * alpha); batch.draw(fog, p[0], p[1], p[2] - p[0], p[3] - p[1], u, .9f, u + .45f, .1f);
            batch.setColor(.75f, .82f, 1f, .1f * alpha); batch.draw(fog, p[0], p[1] + 20, p[2] - p[0], (p[3] - p[1]) * .7f, -u * .7f + .2f, 1, -u * .7f + .55f, 0); }
        // the floor's moonlit patches shimmer like rippling water and dim under a cloud
        for (int i = 0; i < PATCHES.length; i++) { float[] p = PATCHES[i]; float u = time * .03f + i;
            batch.setColor(.6f, .72f, 1f, (.1f + .06f * (float) Math.sin(time * 1.7f + i * 2)) * sky * alpha); batch.draw(fog, p[0], p[1], p[2] - p[0], p[3] - p[1], u, 1, u + .8f, 0);
            batch.setColor(.85f, .92f, 1f, .07f * sky * alpha); batch.draw(fog, p[0] + 20, p[1] + 8, p[2] - p[0] - 40, p[3] - p[1] - 16, -u * 1.3f, 0, -u * 1.3f + .6f, 1); }
        // shafts falling from the windows
        for (float[] w : WINDOWS) { float k = cloud(w[0]) * (.4f + .6f * sky);
            batch.setColor(.62f, .74f, 1f, .32f * k * alpha); batch.draw(glow, w[0] - w[2], w[1] - w[2] * .2f, w[2] * 2, w[2] * 1.6f);
            for (int s = 0; s < 3; s++) { float spread = (s - 1) * w[2] * .32f, len = 940, width = w[2] * (.55f + .15f * s), lean = 9 + s * 2.5f;
                batch.setColor(.55f, .68f, 1f, (.04f + .012f * s) * k * alpha);
                batch.draw(beam, w[0] + spread - width / 2, w[1] - len, width / 2, len, width, len, 1, 1, lean, 0, 0, beam.getWidth(), beam.getHeight(), false, false); } }
        // dust: drifting slowly, sparkling when it crosses a beam
        for (int i = 0; i < mx.length; i++) { float y = (my[i] + time * mv[i]) % 1000 + 40, x = mx[i] + (float) Math.sin(time * .3f + mp[i]) * 22;
            float lit = 0; for (float[] w : WINDOWS) { float cx = w[0] + (w[1] - y) * (float) Math.tan(Math.toRadians(10)); lit = Math.max(lit, 1 - Math.abs(x - cx) / (w[2] * .75f)); }
            lit = Math.max(0, lit); float tw = .5f + .5f * (float) Math.sin(time * 2.1f + mp[i] * 3);
            batch.setColor(.85f, .9f, 1f, (.05f + .55f * lit * tw) * alpha); batch.draw(glow, x - ms[i], y - ms[i], ms[i] * 2, ms[i] * 2); }
        // drips: a falling streak, then two widening rings on the water
        for (int i = 0; i < dropT.length; i++) { float t = dropT[i]; if (t < 0) continue; float fall = 1000 - dropFloor[i], tf = (float) Math.sqrt(2 * fall / 1400f);
            if (t < tf) { float y = 1000 - .5f * 1400 * t * t; batch.setColor(.75f, .85f, 1f, .5f * alpha); batch.draw(glow, dropX[i] - 1.5f, y, 3, 16); }
            else { float r = t - tf; for (int k = 0; k < 2; k++) { float rr = r - k * .25f; if (rr <= 0) continue; float w = 10 + rr * 70, a = Math.max(0, 1 - rr / 1.6f);
                batch.setColor(.7f, .8f, 1f, .45f * a * alpha); batch.draw(ring, dropX[i] - w / 2, dropFloor[i] - w * .14f, w, w * .28f); } } }
        // candles: a hot core, a soft halo, a wide warm spill, all flickering
        for (int i = 0; i < CANDLES.length; i++) { float[] c = CANDLES[i]; float f = .82f + .1f * (float) Math.sin(time * 13 + i * 2.1f) + .08f * (float) Math.sin(time * 29 + i) + (reduced ? 0 : MathUtils.random(-.04f, .04f));
            batch.setColor(1f, .55f, .22f, .16f * f * alpha); batch.draw(glow, c[0] - 120 * f, c[1] - 110 * f, 240 * f, 240 * f);
            batch.setColor(1f, .72f, .36f, .38f * f * alpha); batch.draw(glow, c[0] - 34 * f, c[1] - 30 * f, 68 * f, 72 * f);
            batch.setColor(1f, .93f, .75f, .8f * f * alpha); batch.draw(glow, c[0] - 6, c[1] - 6 + 2 * f, 12, 18 * f); }
        for (int i = 0; i < REFLECTIONS.length; i++) { float[] c = REFLECTIONS[i]; float f = .8f + .12f * (float) Math.sin(time * 11 + i) + .08f * (float) Math.sin(time * 23);
            batch.setColor(1f, .6f, .25f, .22f * f * alpha); batch.draw(glow, c[0] - 26, c[1] - 60, 52, 120); }
        batch.setBlendFunction(src, dst);
        // bats: dark silhouettes against the moonlit sky, wings flapping
        for (int i = 0; i < batX.length; i++) if (batX[i] > -1e3f) { float flap = (float) Math.sin(time * 22 + i * 2), w = 46 * batS[i], h = 22 * batS[i] * (.35f + .65f * Math.abs(flap));
            batch.setColor(.02f, .02f, .035f, .92f * alpha); batch.draw(bat, batX[i] - w / 2, batY[i] - h / 2, w, h, 0, 0, bat.getWidth(), bat.getHeight(), false, flap < 0); }
        batch.setColor(saved);
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
    private static Texture ringTex() { int n = 128; Pixmap p = new Pixmap(n, n, Pixmap.Format.RGBA8888); p.setBlending(Pixmap.Blending.None);
        for (int y = 0; y < n; y++) for (int x = 0; x < n; x++) { float d = (float) Math.hypot(x - n / 2f + .5f, y - n / 2f + .5f) / (n / 2f), a = Math.max(0, 1 - Math.abs(d - .85f) / .12f); p.drawPixel(x, y, Color.rgba8888(1, 1, 1, a * a)); }
        return finish(p, false); }
    private static Texture batTex() { int w = 128, h = 64; Pixmap p = new Pixmap(w, h, Pixmap.Format.RGBA8888); p.setColor(0, 0, 0, 0); p.fill(); p.setColor(Color.WHITE);
        p.fillCircle(64, 34, 7); p.fillTriangle(60, 28, 64, 18, 66, 30); p.fillTriangle(64, 28, 68, 18, 70, 30); // body and ears
        for (int s = -1; s <= 1; s += 2) { p.fillTriangle(64, 30, 64 + s * 60, 14, 64 + s * 30, 40); p.fillTriangle(64 + s * 30, 40, 64 + s * 60, 14, 64 + s * 58, 40); p.fillTriangle(64 + s * 30, 40, 64 + s * 44, 36, 64 + s * 40, 48); }
        return finish(p, false); }
    @Override public void dispose() { ring.dispose(); bat.dispose(); glow.dispose(); beam.dispose(); fog.dispose(); grain.dispose(); vignette.dispose(); }
}
