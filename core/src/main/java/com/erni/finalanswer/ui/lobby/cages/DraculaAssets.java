package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.RuntimeTextures;
import java.util.ArrayList;
import java.util.List;

/** Seven unchanged original files and one small, shared procedural smoke primitive. */
public final class DraculaAssets implements Disposable {
    private final List<Texture> owned=new ArrayList<>();
    public final TextureRegion head,body,leftArm,rightArm,leftLeg,rightLeg,cape,smoke,leftForearm,rightForearm;
    public DraculaAssets() {
        try {
            head=load("drakula.png"); body=load("drakula2.png");
            // The source filenames skip 4: 3/7 are arms and 6/5 are screen-left/right legs.
            TextureRegion fullLeft=load("drakula3.png"),fullRight=load("drakula7.png");
            // Torso already paints the shoulder sockets. Omit the separate arm socket caps.
            leftArm=RuntimeTextures.region(fullLeft.getTexture(),0,360,1015,440);
            rightArm=RuntimeTextures.region(fullRight.getTexture(),0,360,1050,440);
            leftForearm=RuntimeTextures.region(fullLeft.getTexture(),0,800,1015,749);
            rightForearm=RuntimeTextures.region(fullRight.getTexture(),0,800,1050,698);
            leftLeg=load("drakula6.png");rightLeg=load("drakula5.png");
            TextureRegion fullCape=load("drakula8.png");
            // The torso owns the collar. Omit the cape's second collar using UVs, not image edits.
            cape=RuntimeTextures.region(fullCape.getTexture(),0,300,1322,890);
            smoke=createSmoke();
        } catch(RuntimeException error) { dispose(); throw error; }
    }
    private TextureRegion load(String name) {
        Texture texture=CharacterTextures.load("lobby/characters/dracula/"+name);owned.add(texture);return new TextureRegion(texture);
    }
    private TextureRegion createSmoke() {
        Pixmap pixels=new Pixmap(32,32,Pixmap.Format.RGBA8888);
        try {
            pixels.setBlending(Pixmap.Blending.None);
            for(int y=0;y<32;y++) for(int x=0;x<32;x++) {
                float dx=(x-15.5f)/15.5f,dy=(y-15.5f)/15.5f;
                float falloff=Math.max(0,1-dx*dx-dy*dy);
                int alpha=Math.round(255*falloff*falloff*falloff);
                pixels.drawPixel(x,y,0xffffff00|alpha);
            }
            Texture texture=CharacterTextures.upload(pixels);owned.add(texture);

            return new TextureRegion(texture);
        } finally { pixels.dispose(); }
    }
    @Override public void dispose() { for(Texture t:owned) t.dispose();owned.clear(); }
}
