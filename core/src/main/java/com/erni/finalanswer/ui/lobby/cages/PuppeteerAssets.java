package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.math.Intersector;
import com.badlogic.gdx.utils.Disposable;
import java.util.HashMap;
import java.util.Map;

/** Shared, load-time alpha mattes. Unchanged originals remain packaged; no color-key or rectangular cuts. */
public final class PuppeteerAssets implements Disposable {
    private final Map<String,TextureRegion> regions=new HashMap<>();
    private final java.util.ArrayList<Texture> owned=new java.util.ArrayList<>();
    public final TextureRegion amberGlow,cord;
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
                        boolean clear=false,visible=false;
                        for(int y=0;y<pixels.getHeight();y++)for(int x=0;x<pixels.getWidth();x++){int a=pixels.getPixel(x,y)&255;clear|=a==0;visible|=a>100;}
                        if(!clear||!visible)throw new IllegalArgumentException("Puppeteer requires genuine alpha: "+path);
                        pixels.setBlending(Pixmap.Blending.None);
                        for(int y=0;y<pixels.getHeight();y++)for(int x=0;x<pixels.getWidth();x++){
                            float keep=1;
                            if(p.matte.length>0&&!Intersector.isPointInPolygon(p.matte,0,p.matte.length,x+.5f,y+.5f))keep=0;
                            // Only eyeballs, excluding the oversized decorative housings and ribbons.
                            if(p.asset==2||p.asset==3){float cx=p.asset==2?725:735,cy=p.asset==2?610:680,rx=p.asset==2?222:215,ry=p.asset==2?235:260;
                                float dx=(x-cx)/rx,dy=(y-cy)/ry;keep*=Math.max(0,Math.min(1,(1-dx*dx-dy*dy)*45));}
                            int rgba=pixels.getPixel(x,y);pixels.drawPixel(x,y,(rgba&0xffffff00)|(int)((rgba&255)*keep));
                        }
                        region=upload(pixels);regions.put(key,region);
                    } finally {pixels.dispose();}
                }
                regions.put(p.name,region);
            }
            Pixmap mask=new Pixmap(Gdx.files.internal("lobby/characters/puppeteer/puppet2.png"));
            try {mask.setBlending(Pixmap.Blending.None);
                for(int y=0;y<mask.getHeight();y++)for(int x=0;x<mask.getWidth();x++){
                    int rgba=mask.getPixel(x,y);float dx=(x-725)/210f,dy=(y-610)/220f;
                    int r=rgba>>>24,g=(rgba>>>16)&255,b=(rgba>>>8)&255;
                    float strength=dx*dx+dy*dy<1&&r>g*1.15f&&g>b*1.4f?Math.min(1,(r-b)/150f):0;
                    mask.drawPixel(x,y,0xffb34200|(int)((rgba&255)*strength));
                }
                amberGlow=upload(mask);
            }finally{mask.dispose();}
            Pixmap white=new Pixmap(1,1,Pixmap.Format.RGBA8888);try{white.setColor(1,1,1,1);white.fill();cord=upload(white);}finally{white.dispose();}
        } catch(RuntimeException e){dispose();throw e;}
    }
    private TextureRegion upload(Pixmap p){Texture t=new Texture(p);owned.add(t);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);return new TextureRegion(t);}
    public TextureRegion region(String name){return regions.get(name);}
    @Override public void dispose(){for(Texture t:owned)t.dispose();owned.clear();regions.clear();}
}
