package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.MathUtils;

/** Bounded screen-space atmosphere, borrowing the preloaded soft opacity kernel. No runtime objects. */
final class CursedBoxesAtmosphere {
    private final Texture soft;
    private final CursedBoxesGalleryConfig config;
    CursedBoxesAtmosphere(Texture soft,CursedBoxesGalleryConfig config){this.soft=soft;this.config=config;}
    private static float sample(int cell,int seed){
        int h=cell*374761393+seed*668265263;h=(h^(h>>>13))*1274126177;h^=h>>>16;
        return (h>>>8)/8388607.5f-1;
    }
    private static float flicker(float time,int seed){
        int cell=MathUtils.floor(time);float t=time-cell;t=t*t*(3-2*t);
        float a=sample(cell,seed);return a+(sample(cell+1,seed)-a)*t;
    }
    void draw(SpriteBatch batch,float width,float height,float time,boolean low){
        float scale=CursedBoxesBackground.coverScale(width,height,config.imageWidth,config.imageHeight);
        float left=(width-config.imageWidth*scale)*.5f,bottom=0;
        batch.begin();
        // Very faint warm pools at the four photographed lanterns. Fixed anchors keep the room still.
        for(int i=0;i<4;i++){
            float x=i==0?105:i==1?455:i==2?1215:1568,y=i==0||i==3?177:285;
            // Independent continuous noise, bounded to roughly +/-11%, with no fixed blink cycle.
            float pulse=.042f*(1+.09f*flicker(time*(.9f+i*.07f),i+1)+.018f*flicker(time*2.7f,i+11));
            batch.setColor(1,.48f,.16f,pulse);float size=(i==0||i==3?220:140)*scale;
            batch.draw(soft,left+x*scale-size*.5f,bottom+(config.imageHeight-y)*scale-size*.5f,size,size);
        }
        for(int i=0,n=low?config.dustCount/2:config.dustCount;i<n;i++){
            float phase=time*(.007f+(i%5)*.0013f)+i*.618034f;phase-=MathUtils.floor(phase);
            float x=left+(100+(i*197%1470)+MathUtils.sin(time*.14f+i)*12)*scale;
            float y=bottom+(240+phase*530)*scale,size=(1.8f+(i%3)*.55f)*scale;
            float alpha=MathUtils.sin(phase*MathUtils.PI)*(.045f+(i%4)*.013f);
            batch.setColor(.93f,.7f,.4f,alpha);batch.draw(soft,x,y,size*2,size*2);
        }
        float haze=.026f+.004f*MathUtils.sin(time*.27f);
        batch.setColor(.6f,.49f,.36f,haze);batch.draw(soft,left+(330+MathUtils.sin(time*.11f)*14)*scale,bottom+(340+MathUtils.sin(time*.13f)*1.5f)*scale,1010*scale,145*scale);
        batch.setColor(1,1,1,1);batch.end();
    }
}
