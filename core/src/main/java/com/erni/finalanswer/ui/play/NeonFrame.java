package com.erni.finalanswer.ui.play;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.NinePatch;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Disposable;

/**
 * Ornate cut-corner frame used by THINK OR DIE (player cards, category plate, rule cards, badges): a steel bevel with a
 * light top and dark bottom edge, an inner neon line with a soft outer glow, corner diamonds and short light accents.
 * All procedural (no image assets); one instance per screen, textures generated once.
 */
public final class NeonFrame implements Disposable {
    private static final int N=96;private static final float CUT=24;
    private final Texture fillTex,edgeTex,softTex,gradTex,pixelTex;private final com.badlogic.gdx.graphics.g2d.TextureRegion px;
    private final NinePatch fill,edge,soft;
    private final Color tmp=new Color();

    public NeonFrame(){
        fillTex=octagon(0);edgeTex=octagon(1);softTex=octagon(2);
        fill=new NinePatch(fillTex,30,30,30,30);edge=new NinePatch(edgeTex,30,30,30,30);soft=new NinePatch(softTex,30,30,30,30);
        Pixmap g=new Pixmap(1,64,Pixmap.Format.RGBA8888);for(int y=0;y<64;y++){float f=y/63f;g.drawPixel(0,y,Color.rgba8888(1,1,1,(1-f)*(1-f)));}
        gradTex=new Texture(g);gradTex.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);g.dispose();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixelTex=new Texture(p);p.dispose();px=new com.badlogic.gdx.graphics.g2d.TextureRegion(pixelTex);
    }
    /** mode 0 filled, 1 thin edge, 2 blurred edge (glow) */
    private static Texture octagon(int mode){Pixmap p=new Pixmap(N,N,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float r=(float)Math.sqrt(.5);
        for(int y=0;y<N;y++)for(int x=0;x<N;x++){float fx=x+.5f,fy=y+.5f;
            float d=Math.min(Math.min(Math.min(fx,fy),Math.min(N-fx,N-fy)),Math.min(Math.min((fx+fy-CUT)*r,(N-fx+fy-CUT)*r),Math.min((fx+N-fy-CUT)*r,(N-fx+N-fy-CUT)*r)));
            float a=mode==0?MathUtils.clamp(d+.5f,0,1):mode==1?MathUtils.clamp(1-Math.abs(d-2.2f)/1.4f,0,1):MathUtils.clamp(1-Math.abs(d-8f)/8f,0,1)*MathUtils.clamp(d+.5f,0,1);
            p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}

    private void nine(Batch b,NinePatch n,float x,float y,float w,float h,float k){if(w<=1||h<=1)return;if(k<1){n.scale(k,k);n.draw(b,x,y,w,h);n.scale(1/k,1/k);}else n.draw(b,x,y,w,h);}

    /**
     * @param bevel steel border width in world units (6 for big plates, 4 for small ones)
     * @param inner fill colour inside the frame (alpha respected)
     */
    public void draw(Batch b,float x,float y,float w,float h,Color rim,Color inner,float bevel,float a){
        if(a<=0||w<8||h<8)return;
        Color keep=tmp.set(b.getColor());float k=Math.min(1,Math.min(w,h)/70f);
        // drop shadow and outer neon glow
        b.setColor(0,0,0,.50f*a);nine(b,fill,x+3,y-8,w,h,k);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        b.setColor(rim.r,rim.g,rim.b,.55f*a);nine(b,soft,x-8,y-8,w+16,h+16,k);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        // steel bevel: dark body, light top half, bright outer line
        b.setColor(.13f,.12f,.13f,a);nine(b,fill,x,y,w,h,k);
        b.setColor(.42f,.40f,.42f,.55f*a);nine(b,fill,x,y+h*.50f,w,h*.50f,k);
        b.setColor(.80f,.78f,.80f,.85f*a);nine(b,edge,x,y,w,h,k);
        // inner panel with a soft top light
        float i=bevel;b.setColor(inner.r,inner.g,inner.b,inner.a*a);nine(b,fill,x+i,y+i,w-2*i,h-2*i,k);
        b.setColor(rim.r,rim.g,rim.b,.10f*a);b.draw(gradTex,x+i+CUT*k*.6f,y+h*.45f,w-2*i-CUT*k*1.2f,h*.55f-i);
        // neon line just inside the bevel, plus an additive pass for the glow
        b.setColor(rim.r,rim.g,rim.b,a);nine(b,edge,x+i-1.5f,y+i-1.5f,w-2*i+3,h-2*i+3,k);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        b.setColor(rim.r,rim.g,rim.b,.35f*a);nine(b,soft,x+i-6,y+i-6,w-2*i+12,h-2*i+12,k);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        // corner diamonds on the bevels and short light accents along the edges
        float c=CUT*k,d=Math.max(3.5f,5*k);
        float[][] corners={{x+c*.48f,y+c*.48f},{x+w-c*.48f,y+c*.48f},{x+c*.48f,y+h-c*.48f},{x+w-c*.48f,y+h-c*.48f}};
        for(float[] p:corners)diamond(b,p[0],p[1],d,rim,a);
        float acc=Math.min(46,w*.12f);
        b.setColor(1,1,1,.55f*a);
        b.draw(pixelTex,x+c+6,y+h-1.5f,acc,1.5f);b.draw(pixelTex,x+w-c-6-acc,y+h-1.5f,acc,1.5f);
        b.setColor(rim.r,rim.g,rim.b,.9f*a);
        b.draw(pixelTex,x+c+6,y,acc,2);b.draw(pixelTex,x+w-c-6-acc,y,acc,2);
        b.setColor(keep);
    }
    private void diamond(Batch b,float cx,float cy,float s,Color rim,float a){
        b.setColor(.85f,.83f,.85f,a);b.draw(px,cx-s,cy-s,s,s,s*2,s*2,1,1,45);
        b.setColor(rim.r,rim.g,rim.b,a);b.draw(px,cx-s*.55f,cy-s*.55f,s*.55f,s*.55f,s*1.1f,s*1.1f,1,1,45);
    }
    /** A glowing ring (behind a character portrait). */
    public void halo(Batch b,float cx,float cy,float r,Color rim,float a){
        Color keep=tmp.set(b.getColor());
        b.setColor(.02f,.0f,.01f,.85f*a);b.draw(softTexOrNull(),cx-r*1.05f,cy-r*1.05f,r*2.1f,r*2.1f);
        b.setColor(rim.r*.25f,rim.g*.12f,rim.b*.15f,.75f*a);b.draw(softTexOrNull(),cx-r,cy-r,r*2,r*2);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        int n=48;for(int i=0;i<n;i++){float u=360f*i/n;float qx=cx+MathUtils.cosDeg(u)*r,qy=cy+MathUtils.sinDeg(u)*r;
            b.setColor(rim.r,rim.g,rim.b,.85f*a);b.draw(px,qx-1.6f,qy-1.6f,1.6f,1.6f,3.2f,2*MathUtils.PI*r/n+1,1,1,u);}
        b.setColor(rim.r,rim.g,rim.b,.16f*a);b.draw(softTexOrNull(),cx-r*1.3f,cy-r*1.3f,r*2.6f,r*2.6f);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        b.setColor(keep);
    }
    private Texture radial;
    private Texture softTexOrNull(){
        if(radial==null){int n=64;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=(x+.5f)/n-.5f,dy=(y+.5f)/n-.5f,d=(float)Math.sqrt(dx*dx+dy*dy)*2;p.drawPixel(x,y,Color.rgba8888(1,1,1,MathUtils.clamp(1-d,0,1)*MathUtils.clamp(1-d,0,1)));}
            radial=new Texture(p);radial.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();}
        return radial;
    }
    private Texture roundTex;private NinePatch round;
    /** Clean rounded panel (game-show style): soft drop shadow, a thin solid outline in the accent colour, flat fill. */
    public void clean(Batch b,float x,float y,float w,float h,Color fill,Color rim,float a){
        if(a<=0||w<8||h<8)return;
        if(round==null){int n=64;float R=22;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
            for(int yy=0;yy<n;yy++)for(int xx=0;xx<n;xx++){float fx=xx+.5f,fy=yy+.5f,dx=Math.max(Math.max(R-fx,fx-(n-R)),0),dy=Math.max(Math.max(R-fy,fy-(n-R)),0);
                float d=R-(float)Math.sqrt(dx*dx+dy*dy);if(dx==0&&dy==0)d=R;p.drawPixel(xx,yy,Color.rgba8888(1,1,1,MathUtils.clamp(d+.5f,0,1)));}
            roundTex=new Texture(p);roundTex.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();round=new NinePatch(roundTex,24,24,24,24);}
        Color keep=tmp.set(b.getColor());float k=Math.min(1,Math.min(w,h)/56f);
        b.setColor(0,0,0,.40f*a);nine(b,round,x+2,y-6,w,h,k);
        b.setColor(rim.r,rim.g,rim.b,a);nine(b,round,x,y,w,h,k);
        b.setColor(fill.r,fill.g,fill.b,fill.a*a);nine(b,round,x+3,y+3,w-6,h-6,k);
        b.setColor(1,1,1,.05f*a);nine(b,round,x+3,y+h*.5f,w-6,h*.5f-3,k);
        b.setColor(keep);
    }
    @Override public void dispose(){if(roundTex!=null)roundTex.dispose();fillTex.dispose();edgeTex.dispose();softTex.dispose();gradTex.dispose();pixelTex.dispose();if(radial!=null)radial.dispose();}
}
