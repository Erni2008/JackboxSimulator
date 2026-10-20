package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import java.util.ArrayList;
import java.util.List;

/** Shared original PNGs in the standard lobby asset tree. */
public final class ZombieAssets implements Disposable {
    private final List<Texture> owned = new ArrayList<>();
    public final TextureRegion head, body, leftArm, rightArm, leftLeg, rightLeg;
    public ZombieAssets() {
        try {
            head=load("zombie1.png"); body=load("zombie2.png");
            leftArm=load("zombie3.png"); rightArm=load("zombie4.png");
            leftLeg=load("zombie5.png"); rightLeg=load("zombie6.png");
        } catch(RuntimeException failure) { dispose(); throw failure; }
    }
    private TextureRegion load(String name) {
        Texture t=CharacterTextures.load("lobby/characters/zombie/"+name); owned.add(t); return new TextureRegion(t);
    }
    @Override public void dispose() { for(Texture t:owned) t.dispose(); owned.clear(); }
}
