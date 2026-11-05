package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.RuntimeTextures;
import java.util.ArrayList;
import java.util.List;

/** One owner per lobby, shared by all eight cages. Original transparent PNGs are unchanged. */
public final class CageAssets implements Disposable {
    public final CageCharacterPresentation.Settings presentation=CageCharacterPresentation.Settings.load();
    private final List<Texture> owned = new ArrayList<>();
    public final TextureRegion cage, gate, key, chain, hook;
    /** the cage, chain and bracket are built in code (Cage3D); the nameplate plate is procedural too */
    public final Cage3D cage3d = new Cage3D();
    public final com.badlogic.gdx.graphics.Texture plate = plateTexture();
    public final TextureRegion head, body, leftArm, rightArm, leftLeg, rightLeg;

    public CageAssets() {
        cage = load("cages/cage_open.png");
        gate = crop(load("cages/cage_bars.png"), 116, 4, 918, 1348);
        key = crop(load("cages/cage_key.png"), 330, 0, 625, 1220);
        chain = crop(load("cages/chain.png"), 436, 0, 152, 1536);
        hook = crop(load("cages/chain_hook.png"), 54, 80, 1175, 1080);
        head = crop(load("characters/skeleton/head.png"), 200, 40, 900, 1140);
        body = load("characters/skeleton/body.png");
        leftArm = load("characters/skeleton/left_arm.png");
        rightArm = load("characters/skeleton/right_arm.png");
        leftLeg = crop(load("characters/skeleton/left_leg.png"), 185, 0, 690, 1536);
        rightLeg = crop(load("characters/skeleton/right_leg.png"), 185, 0, 680, 1536);
    }

    private TextureRegion load(String relative) {
        String path = "lobby/" + relative;
        if (!(relative.startsWith("characters/")?Gdx.files.internal(path).exists():RuntimeTextures.exists(path))) throw new IllegalStateException("Missing cage asset: assets/" + path);
        Texture texture = relative.startsWith("characters/") ? CharacterTextures.load(path) : RuntimeTextures.load(path);
        owned.add(texture);
        return new TextureRegion(texture);
    }

    /** brass nameplate: bevelled edge, brushed face, two screws */
    private static com.badlogic.gdx.graphics.Texture plateTexture() {
        int w = 256, h = 56; var p = new com.badlogic.gdx.graphics.Pixmap(w, h, com.badlogic.gdx.graphics.Pixmap.Format.RGBA8888); var r = new java.util.Random(9);
        for (int y = 0; y < h; y++) for (int x = 0; x < w; x++) { float e = Math.min(Math.min(x, w - 1 - x), Math.min(y, h - 1 - y)), bevel = e < 3 ? .55f + (y < h / 2 ? .35f : -.1f) : 1;
            float g = .9f + .1f * (float) Math.sin(y * .9 + r.nextFloat() * .6) - (float) y / h * .18f, n = r.nextFloat() * .05f;
            float cr = (.78f * g - n) * bevel, cg = (.6f * g - n) * bevel, cb = (.3f * g - n) * bevel; boolean screw = Math.hypot(x - 14, y - h / 2f) < 5 || Math.hypot(x - (w - 15), y - h / 2f) < 5;
            if (screw) { cr *= .55f; cg *= .5f; cb *= .45f; } p.drawPixel(x, y, com.badlogic.gdx.graphics.Color.rgba8888(Math.min(1, cr), Math.min(1, cg), Math.min(1, cb), e < 1 ? .7f : 1)); }
        var t = new com.badlogic.gdx.graphics.Texture(p); p.dispose(); t.setFilter(com.badlogic.gdx.graphics.Texture.TextureFilter.Linear, com.badlogic.gdx.graphics.Texture.TextureFilter.Linear); return t; }

    private static TextureRegion crop(TextureRegion source, int x, int y, int w, int h) {
        return RuntimeTextures.region(source.getTexture(), x, y, w, h);
    }

    @Override public void dispose() { presentation.dispose(); cage3d.dispose(); plate.dispose(); for (Texture texture : owned) texture.dispose(); owned.clear(); }
}
