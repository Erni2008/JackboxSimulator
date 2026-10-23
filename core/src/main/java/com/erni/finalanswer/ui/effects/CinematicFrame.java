package com.erni.finalanswer.ui.effects;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.utils.Disposable;

/** Static edge falloff: one small cached texture and one quad, with an untouched focal centre. */
public final class CinematicFrame implements Disposable {
    private final Texture shade;
    public CinematicFrame(){
        int width=96,height=64;
        Pixmap image=new Pixmap(width,height,Pixmap.Format.RGBA8888);
        image.setBlending(Pixmap.Blending.None);
        for(int y=0;y<height;y++)for(int x=0;x<width;x++){
            float u=2f*x/(width-1)-1,v=2f*y/(height-1)-1;
            float t=Math.max(0,Math.min(1,((u*u+v*v)*.5f-.25f)/.75f));
            float alpha=t*t*(3-2*t)*.28f;
            image.drawPixel(x,y,Color.rgba8888(.012f,.006f,.01f,alpha));
        }
        try{shade=new Texture(image);shade.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);}
        finally{image.dispose();}
    }
    public void draw(Batch batch,float width,float height,float opacity){
        if(opacity<=0||width<=0||height<=0)return;
        float previous=batch.getPackedColor();batch.setColor(1,1,1,opacity);
        batch.draw(shade,0,0,width,height);batch.setPackedColor(previous);
    }
    @Override public void dispose(){shade.dispose();}
}
