package com.erni.finalanswer.ui.effects;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Disposable;

/**
 * Brings the main-menu room painting to life without repainting it: light glows are laid over the lights that are
 * already in the picture (marquee "?" bulbs chase and twinkle, candle flames flicker, the lamps breathe, the moon
 * pulses, lightning now and then behind the window) plus dust drifting in the lamp light. Positions are fractions of
 * the background image (x from the left, y from the top), so they follow the picture at any window size.
 * Also gives the slow camera drift the menu applies to the painting.
 */
public final class MenuAmbience implements Disposable {
    // marquee "?" bulbs along the sign, top of the hook to the dot
    private static final float[][] BULBS={{.666f,.135f},{.679f,.092f},{.697f,.069f},{.714f,.063f},{.733f,.069f},{.748f,.091f},{.756f,.123f},{.751f,.155f},{.739f,.182f},{.723f,.203f},{.713f,.229f},{.711f,.258f},{.704f,.324f}};
    private static final float[][] CANDLES={{.247f,.398f},{.427f,.369f},{.969f,.110f},{.814f,.398f},{.736f,.686f},{.991f,.090f}};
    private static final float[][] LAMPS={{.066f,.21f,1f,.72f,.4f,1.2f},{.545f,.355f,1f,.3f,.45f,.75f}};
    private static final float MOON_X=.446f,MOON_Y=.045f,WIN_X0=.386f,WIN_X1=.5f,WIN_Y0=0f,WIN_Y1=.33f;
    private static final int DUST=46;

    private final Texture glow;
    private final float[] dx=new float[DUST],dy=new float[DUST],ds=new float[DUST],dp=new float[DUST];
    private float time,nextLightning=6,lightning;

    public MenuAmbience(){
        int n=128;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float d=(float)Math.hypot(x-n/2f+.5f,y-n/2f+.5f)/(n/2f);float a=MathUtils.clamp(1-d,0,1);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(1,1,1,a*a));}
        glow=new Texture(p);glow.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();
        for(int i=0;i<DUST;i++){dx[i]=MathUtils.random();dy[i]=MathUtils.random();ds[i]=MathUtils.random(.6f,1.6f);dp[i]=MathUtils.random(MathUtils.PI2);}
    }

    /** Slow "breathing" camera over the painting: returns {x,y,w,h} to draw it at, slightly larger than the cover rect. */
    public float[] drift(float x,float y,float w,float h,boolean still){
        if(still)return new float[]{x,y,w,h};
        float z=1.035f+.012f*MathUtils.sin(time*.13f),nw=w*z,nh=h*z;
        float px=MathUtils.sin(time*.07f)*w*.008f,py=MathUtils.sin(time*.09f+1)*h*.006f;
        return new float[]{x-(nw-w)/2+px,y-(nh-h)/2+py,nw,nh};
    }

    public void update(float dt){
        time+=dt;
        if(lightning>0)lightning=Math.max(0,lightning-dt*2.2f);
        if(dt>0&&time>=nextLightning){lightning=1;nextLightning=time+MathUtils.random(9f,20f);}
        for(int i=0;i<DUST;i++){dy[i]-=dt*.006f*ds[i];dx[i]+=MathUtils.sin(time*.4f+dp[i])*dt*.003f;if(dy[i]<0){dy[i]=1;dx[i]=MathUtils.random();}}
    }

    /** Draws the light over the painting (batch must be drawing; restores normal blending). */
    public void draw(SpriteBatch batch,float x,float y,float w,float h){
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        // the "?" sign: a chase runs along the bulbs, each also twinkles
        for(int i=0;i<BULBS.length;i++){float chase=.5f+.5f*MathUtils.sin(time*3.2f-i*.7f),tw=.85f+.15f*MathUtils.sin(time*17+i*5.3f);
            float a=(.25f+.55f*chase*chase)*tw;spot(batch,x,y,w,h,BULBS[i][0],BULBS[i][1],.035f,1f,.62f,.3f,a*.55f);spot(batch,x,y,w,h,BULBS[i][0],BULBS[i][1],.012f,1f,.9f,.7f,a);}
        spot(batch,x,y,w,h,.711f,.17f,.16f,1f,.45f,.2f,.05f+.03f*MathUtils.sin(time*3.2f));
        // candles: fast irregular flicker
        for(int i=0;i<CANDLES.length;i++){float f=flicker(i);spot(batch,x,y,w,h,CANDLES[i][0],CANDLES[i][1],.05f,1f,.55f,.22f,.28f*f);spot(batch,x,y,w,h,CANDLES[i][0],CANDLES[i][1]-.004f,.012f,1f,.85f,.55f,.55f*f);}
        // lamps breathe slowly
        for(int i=0;i<LAMPS.length;i++){float[] l=LAMPS[i];float b=.8f+.12f*MathUtils.sin(time*.9f+i*2)+.08f*flicker(10+i);spot(batch,x,y,w,h,l[0],l[1],.14f*l[5],l[2],l[3],l[4],.22f*b);}
        // moon and the night outside, lightning now and then
        spot(batch,x,y,w,h,MOON_X,MOON_Y,.07f,.6f,.65f,1f,.18f+.06f*MathUtils.sin(time*.5f));
        if(lightning>0){float k=lightning*lightning*(MathUtils.sin(time*60)>-.3f?1:.4f);
            batch.setColor(.55f,.6f,1f,.35f*k);batch.draw(glow,x+(WIN_X0-.04f)*w,y+(1-WIN_Y1-.04f)*h,(WIN_X1-WIN_X0+.08f)*w,(WIN_Y1-WIN_Y0+.08f)*h);
            spot(batch,x,y,w,h,(WIN_X0+WIN_X1)/2,.25f,.35f,.45f,.5f,1f,.08f*k);}
        // dust in the lamp light
        for(int i=0;i<DUST;i++){float a=.25f+.25f*MathUtils.sin(time*1.3f+dp[i]*3);spot(batch,x,y,w,h,dx[i],dy[i],.0022f*ds[i],1f,.8f,.6f,a*.5f);}
        batch.setColor(Color.WHITE);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    private float flicker(int i){return .78f+.12f*MathUtils.sin(time*11.3f+i*1.7f)+.07f*MathUtils.sin(time*23.1f+i*3.1f)+.05f*MathUtils.sin(time*5.7f+i);}
    private void spot(SpriteBatch b,float x,float y,float w,float h,float u,float v,float r,float cr,float cg,float cb,float a){
        float s=r*w*2;b.setColor(cr,cg,cb,MathUtils.clamp(a,0,1));b.draw(glow,x+u*w-s/2,y+(1-v)*h-s/2,s,s);}

    @Override public void dispose(){glow.dispose();}
}
