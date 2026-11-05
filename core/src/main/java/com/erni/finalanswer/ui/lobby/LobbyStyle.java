package com.erni.finalanswer.ui.lobby;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.NinePatch;
import com.badlogic.gdx.scenes.scene2d.ui.TextButton;
import com.badlogic.gdx.scenes.scene2d.utils.NinePatchDrawable;
import com.badlogic.gdx.utils.Disposable;

/**
 * Waiting-room buttons in the dungeon's material language (procedural, no artwork):
 * forged iron plates with a brass inlay line; hover warms the brass, press sinks the plate, disabled goes cold and dull.
 * The primary action (START) is a blood-red lacquered plate in a brass frame.
 */
public final class LobbyStyle implements Disposable {
    private final Texture iron, ironHover, ironDown, ironOff, blood, bloodHover, bloodDown, bloodOff;
    public final TextButton.TextButtonStyle normal, primary;

    public LobbyStyle(BitmapFont font) {
        iron = plate(.115f, .095f, .08f, .55f, 0, false); ironHover = plate(.16f, .13f, .1f, 1f, .35f, false); ironDown = plate(.07f, .058f, .05f, .7f, 0, true); ironOff = plate(.075f, .072f, .07f, .18f, 0, false);
        blood = plate(.36f, .05f, .04f, .85f, .1f, false); bloodHover = plate(.5f, .08f, .05f, 1f, .45f, false); bloodDown = plate(.24f, .03f, .03f, .9f, 0, true); bloodOff = plate(.14f, .07f, .065f, .2f, 0, false);
        normal = style(font, iron, ironHover, ironDown, ironOff, Color.valueOf("E9D6B4"));
        primary = style(font, blood, bloodHover, bloodDown, bloodOff, Color.valueOf("FFE7C2"));
    }
    private static TextButton.TextButtonStyle style(BitmapFont font, Texture up, Texture over, Texture down, Texture off, Color text) {
        var s = new TextButton.TextButtonStyle(); s.font = font; s.fontColor = text; s.overFontColor = Color.valueOf("FFF1D6"); s.downFontColor = text; s.disabledFontColor = Color.valueOf("6E6458");
        s.up = patch(up); s.over = patch(over); s.down = patch(down); s.disabled = patch(off); s.pressedOffsetY = -2; return s; }
    private static NinePatchDrawable patch(Texture t) { return new NinePatchDrawable(new NinePatch(t, 22, 22, 22, 22)); }

    /** a bevelled plate: face colour, brass inlay strength, a warm glow (hover), pressed (inverted bevel) */
    private static Texture plate(float r, float g, float b, float brass, float glow, boolean pressed) {
        int w = 96, h = 64; Pixmap p = new Pixmap(w, h, Pixmap.Format.RGBA8888); p.setBlending(Pixmap.Blending.None); var rnd = new java.util.Random(31);
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) {
            float e = Math.min(Math.min(x, w - 1 - x), Math.min(y, h - 1 - y)), v = (float) y / (h - 1), n = rnd.nextFloat() * .025f;
            float shade = pressed ? .85f + .25f * v : 1.18f - .38f * v;                        // light from above (inverted when pressed)
            float cr = r * shade + n, cg = g * shade + n, cb = b * shade + n, a = 1;
            if (e < 1.5f) { cr = cg = cb = .02f; }                                               // outer edge
            else if (e < 4) { float lit = (y < h / 2) != pressed ? .16f : -.03f; cr = .12f + lit; cg = .1f + lit * .9f; cb = .085f + lit * .8f; } // bevel
            else if (e >= 6 && e < 7.6f) { cr = cr + (.62f - cr) * brass; cg = cg + (.47f - cg) * brass; cb = cb + (.22f - cb) * brass; }   // brass inlay line
            if (glow > 0 && e < 10) { float k = glow * (1 - e / 10f) * .5f; cr += k; cg += k * .62f; cb += k * .25f; }
            p.drawPixel(x, y, Color.rgba8888(Math.min(1, cr), Math.min(1, cg), Math.min(1, cb), a));
        }
        for (int[] c : new int[][]{{11, 11}, {w - 12, 11}, {11, h - 12}, {w - 12, h - 12}}) for (int y = -3; y <= 3; y++) for (int x = -3; x <= 3; x++) { if (x * x + y * y > 9) continue; float lit = .25f + .4f * Math.max(0, 1 - (float) Math.hypot(x + 1, y + 1) / 4);
            p.drawPixel(c[0] + x, c[1] + y, Color.rgba8888(lit * 1.15f, lit * .9f, lit * .55f, 1)); }   // corner rivets
        Texture t = new Texture(p); p.dispose(); t.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear); return t;
    }
    @Override public void dispose() { for (Texture t : new Texture[]{iron, ironHover, ironDown, ironOff, blood, bloodHover, bloodDown, bloodOff}) t.dispose(); }
}
