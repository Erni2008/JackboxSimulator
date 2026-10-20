package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import java.util.HashMap;
import java.util.Map;

/** Shared, load-time alpha mattes. Unchanged originals remain packaged; no color-key or rectangular cuts. */
public final class PuppeteerAssets implements Disposable {
    public static float midtoneReadability=.14f;
    private final Map<String,TextureRegion> regions=new HashMap<>();
    private final java.util.ArrayList<Texture> owned=new java.util.ArrayList<>();
    public final TextureRegion cord;
    public PuppeteerAssets(PuppeteerConfig config){
        try {
            for(var p:config.parts){
                String key=p.asset+java.util.Arrays.toString(p.matte);
                TextureRegion region=regions.get(key);
                if(region==null){
                    String path="lobby/characters/puppeteer/"+(p.asset==9?"pupper9.png":"puppet"+p.asset+".png");
                    if(!Gdx.files.internal(path).exists())throw new IllegalStateException("Missing Puppeteer texture: assets/"+path);
                    Pixmap pixels=new Pixmap(Gdx.files.internal(path));
                    try {
                        if(!CharacterTextureMasks.validAlpha(pixels))throw new IllegalArgumentException("Puppeteer requires genuine alpha: "+path);
                        CharacterTextureMasks.polygon(pixels,p.matte);
                        if(p.asset==2)CharacterTextureMasks.ellipse(pixels,725,610,222,235);
                        else if(p.asset==3)CharacterTextureMasks.ellipse(pixels,735,680,215,260);
                        else CharacterTextures.liftMidtones(pixels,midtoneReadability);
                        region=upload(pixels);regions.put(key,region);
                    } finally {pixels.dispose();}
                }
                regions.put(p.name,region);
            }
            Pixmap white=new Pixmap(1,1,Pixmap.Format.RGBA8888);try{white.setColor(1,1,1,1);white.fill();cord=upload(white);}finally{white.dispose();}
        } catch(RuntimeException e){dispose();throw e;}
    }
    private TextureRegion upload(Pixmap p){Texture t=CharacterTextures.upload(p);owned.add(t);return new TextureRegion(t);}
    public TextureRegion region(String name){return regions.get(name);}
    @Override public void dispose(){for(Texture t:owned)t.dispose();owned.clear();regions.clear();}
}
