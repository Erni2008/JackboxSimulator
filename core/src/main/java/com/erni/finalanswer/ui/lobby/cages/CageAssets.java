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
        if (!Gdx.files.internal(path).exists()) throw new IllegalStateException("Missing cage asset: assets/" + path);
        Texture texture = RuntimeTextures.load(path);
        owned.add(texture);
        return new TextureRegion(texture);
    }

    private static TextureRegion crop(TextureRegion source, int x, int y, int w, int h) {
        return RuntimeTextures.region(source.getTexture(), x, y, w, h);
    }

    @Override public void dispose() { for (Texture texture : owned) texture.dispose(); owned.clear(); }
}
