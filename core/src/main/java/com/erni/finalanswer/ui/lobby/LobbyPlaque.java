package com.erni.finalanswer.ui.lobby;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.NinePatch;
import com.badlogic.gdx.scenes.scene2d.utils.NinePatchDrawable;

/** Forged iron plaque for the waiting-room UI: dark brushed face, bevelled riveted frame, soft inner shadow. Procedural. */
public final class LobbyPlaque {
    private LobbyPlaque() {}
    private static Texture texture;
    public static NinePatchDrawable drawable() {
        if (texture == null) texture = build();
        return new NinePatchDrawable(new NinePatch(texture, 44, 44, 44, 44));
    }
    private static Texture build() {
        int n = 160; Pixmap p = new Pixmap(n, n, Pixmap.Format.RGBA8888); p.setBlending(Pixmap.Blending.None); var r = new java.util.Random(4);
        for (int y = 0; y < n; y++) for (int x = 0; x < n; x++) {
            float e = Math.min(Math.min(x, n - 1 - x), Math.min(y, n - 1 - y)), noise = r.nextFloat() * .035f;
            float cr, cg, cb, a = .93f;
            if (e < 2) { cr = .05f; cg = .04f; cb = .035f; a = 1; }                                       // outer dark line
            else if (e < 16) { float t = (e - 2) / 14f, lit = y < n / 2 ? .1f : -.04f;                    // bevelled iron frame, lit from above
                cr = .2f + lit + (1 - t) * .08f + noise; cg = .15f + lit * .9f + (1 - t) * .06f + noise; cb = .12f + lit * .8f + noise; a = 1; }
            else if (e < 19) { cr = .03f; cg = .025f; cb = .02f; a = 1; }                                 // seam
            else { float inner = Math.min(1, (e - 19) / 22f); float brush = (float) Math.sin(y * .7f + r.nextFloat()) * .01f;   // dark face, inner shadow near the frame
                cr = (.075f + noise + brush) * (.55f + .45f * inner); cg = (.06f + noise + brush) * (.55f + .45f * inner); cb = (.055f + noise + brush) * (.55f + .45f * inner); }
            p.drawPixel(x, y, Color.rgba8888(Math.min(1, cr), Math.min(1, cg), Math.min(1, cb), a));
        }
        // rivets in the frame corners
        for (int[] c : new int[][]{{9, 9}, {n - 10, 9}, {9, n - 10}, {n - 10, n - 10}}) for (int y = -5; y <= 5; y++) for (int x = -5; x <= 5; x++) { double d = Math.hypot(x, y); if (d > 4.6) continue;
            float lit = (float) (1 - Math.hypot(x + 1.8, y + 1.8) / 6.5); float v = .22f + .5f * Math.max(0, lit); p.drawPixel(c[0] + x, c[1] + y, Color.rgba8888(v * 1.1f, v * .85f, v * .6f, 1)); }
        Texture t = new Texture(p); p.dispose(); t.setFilter(Texture.TextureFilter.Linear, Texture.TextureFilter.Linear); return t;
    }
}
