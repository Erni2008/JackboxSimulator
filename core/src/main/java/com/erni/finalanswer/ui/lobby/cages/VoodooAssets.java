package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import java.util.ArrayList;
import java.util.List;

/** Twelve untouched PNGs shared by all dolls. No background color-key or per-frame texture creation. */
public final class VoodooAssets implements Disposable {
    public static final String DIRECTORY="lobby/characters/voodoo/";
    public final TextureRegion[] sprites=new TextureRegion[12];
    public final TextureRegion[] threads,stuffing;
    public final TextureRegion heartLight,smoke;
    private final List<Texture> owned=new ArrayList<>();
    public VoodooAssets(VoodooConfig config) {
        try {
            TextureRegion light=null;
            for(int i=0;i<12;i++) {
                String path=DIRECTORY+"vudu"+(i+1)+".png";
                if(!Gdx.files.internal(path).exists()) throw new IllegalArgumentException("Missing Voodoo PNG: assets/"+path);
                Pixmap pixels=new Pixmap(Gdx.files.internal(path));
                try {
                    boolean transparent=false,visible=false;
                    for(int y=0;y<pixels.getHeight();y++) for(int x=0;x<pixels.getWidth();x++) {
                        int alpha=pixels.getPixel(x,y)&255;transparent|=alpha==0;visible|=alpha>32;
                    }
                    if(!transparent||!visible) throw new IllegalArgumentException("Voodoo PNG needs real transparent background: "+path);
                    sprites[i]=new TextureRegion(texture(pixels));
                    if(i==4) {
                        Pixmap mask=new Pixmap(pixels.getWidth(),pixels.getHeight(),Pixmap.Format.RGBA8888);
                        try {
                            mask.setBlending(Pixmap.Blending.None);
                            for(int y=500;y<Math.min(870,pixels.getHeight());y++) for(int x=500;x<Math.min(850,pixels.getWidth());x++) {
                                int pixel=pixels.getPixel(x,y),r=pixel>>>24,g=pixel>>>16&255,b=pixel>>>8&255;
                                if(r>g*1.55f&&r>b*1.5f) mask.drawPixel(x,y,pixel);
                            }
                            light=new TextureRegion(texture(mask));
                        } finally {mask.dispose();}
                    }
                } finally {pixels.dispose();}
            }
            heartLight=light;threads=regions(sprites[10],config.threadRegions);stuffing=regions(sprites[11],config.stuffingRegions);
            Pixmap radial=new Pixmap(32,32,Pixmap.Format.RGBA8888);
            try {
                radial.setBlending(Pixmap.Blending.None);
                for(int y=0;y<32;y++) for(int x=0;x<32;x++) {float dx=(x-15.5f)/15.5f,dy=(y-15.5f)/15.5f,a=Math.max(0,1-dx*dx-dy*dy);radial.drawPixel(x,y,0xffffff00|Math.round(255*a*a*a));}
                smoke=new TextureRegion(texture(radial));
            } finally {radial.dispose();}
            Gdx.app.log("VoodooAssets","Torso has an embedded heart: separate heart overlay is disabled. Source 5,7–12 contain painted haze; no color-key applied.");
        } catch(RuntimeException error) {dispose();throw error;}
    }
    private Texture texture(Pixmap p) {Texture t=new Texture(p);owned.add(t);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);return t;}
    private static TextureRegion[] regions(TextureRegion source,int[][] rectangles) {
        if(rectangles==null||rectangles.length==0) throw new IllegalArgumentException("Voodoo atlas rectangles required");
        TextureRegion[] result=new TextureRegion[rectangles.length];
        for(int i=0;i<rectangles.length;i++) {int[] r=rectangles[i];if(r.length!=4||r[0]<0||r[1]<0||r[2]<=0||r[3]<=0||r[0]+r[2]>source.getRegionWidth()||r[1]+r[3]>source.getRegionHeight()) throw new IllegalArgumentException("Voodoo atlas rectangle outside image");result[i]=new TextureRegion(source,r[0],r[1],r[2],r[3]);}
        return result;
    }
    @Override public void dispose() {for(Texture t:owned)t.dispose();owned.clear();}
}
