package com.erni.finalanswer.finalsecond;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.utils.Disposable;

/**
 * A real seven-segment LED readout: every digit is seven independently lit segments (plus a decimal mark), drawn as
 * bevelled hexagonal bars with a slight forward slant like an industrial counter. Unlit segments stay faintly visible
 * behind the glass; lit ones get a hot core and a soft additive bloom. Brightness per digit allows flicker effects.
 */
public final class SevenSegment implements Disposable {
    //                         a  b  c  d  e  f  g
    private static final int[] MASK={0b1111110,0b0110000,0b1101101,0b1111001,0b0110011,0b1011011,0b1011111,0b1110000,0b1111111,0b1111011};
    private final Texture bar,glow;private final float[] v=new float[20];
    public final Color on=new Color(1f,.16f,.12f,1),off=new Color(.30f,.03f,.03f,1);
    public float slant=.12f;

    public SevenSegment(){bar=hexBar(256,48);glow=soft(128);}

    /** Segment mask for a character: '0'–'9', or 0 for blank. */
    public static int mask(char c){return c>='0'&&c<='9'?MASK[c-'0']:c=='-'?0b0000001:c=='E'?0b1001111:c=='r'?0b0000101:0;}

    /**
     * One digit with its lower-left at (x,y), {@code w}×{@code h}. {@code lit} 0–1 scales lit segments (0 = all dark);
     * {@code ghost} is how visible unlit segments are.
     */
    public void digit(SpriteBatch b,int segments,float x,float y,float w,float h,float lit,float ghost){
        float t=h*.13f,gap=t*.18f,hw=w-t,hh=(h-t)/2;
        // segment centres and orientation: a top, b top-right, c bottom-right, d bottom, e bottom-left, f top-left, g middle
        float[][] seg={{x+w/2,y+h-t/2,0},{x+w-t/2,y+h-t/2-hh/2,1},{x+w-t/2,y+t/2+hh/2,1},{x+w/2,y+t/2,0},{x+t/2,y+t/2+hh/2,1},{x+t/2,y+h-t/2-hh/2,1},{x+w/2,y+h/2,0}};
        for(int pass=0;pass<3;pass++)for(int i=0;i<7;i++){
            boolean onSeg=(segments>>(6-i)&1)==1;float[] s=seg[i];boolean vert=s[2]==1;float len=(vert?hh:hw)-gap*2;
            float yRel=s[1]-y;float cx=s[0]+yRel*slant-h*slant/2;
            if(pass==0){ // unlit body (always) — the dark glass shows every segment faintly
                b.setColor(off.r,off.g,off.b,ghost);quad(b,bar,cx,s[1],len,t,vert);}
            else if(onSeg&&lit>0){
                if(pass==1){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(on.r,on.g*.8f,on.b*.8f,.42f*lit);
                    quad(b,glow,cx,s[1],len+t*2.6f,t*3.4f,vert);b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
                else{b.setColor(on.r,on.g,on.b,lit);quad(b,bar,cx,s[1],len,t,vert);
                    b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(1f,.62f,.5f,.55f*lit);quad(b,bar,cx,s[1],len*.86f,t*.36f,vert);
                    b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            }
        }
        b.setColor(Color.WHITE);
    }
    /** Decimal comma/point at (x,y) with size {@code s}. */
    public void dot(SpriteBatch b,float x,float y,float s,float lit,float ghost){
        b.setColor(off.r,off.g,off.b,ghost);b.draw(bar,x,y,s,s);
        if(lit>0){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(on.r,on.g*.8f,on.b*.8f,.4f*lit);b.draw(glow,x-s*1.2f,y-s*1.2f,s*3.4f,s*3.4f);
            b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);b.setColor(on.r,on.g,on.b,lit);b.draw(bar,x,y,s,s);}
        b.setColor(Color.WHITE);
    }
    private void quad(SpriteBatch b,Texture tex,float cx,float cy,float len,float th,boolean vertical){
        float c=b.getPackedColor();float hl=len/2,ht=th/2;
        // corners of a horizontal bar, then rotated 90° for vertical segments; slanted by the italic factor
        float[] xs,ys;
        if(!vertical){xs=new float[]{cx-hl,cx+hl,cx+hl,cx-hl};ys=new float[]{cy-ht,cy-ht,cy+ht,cy+ht};}
        else{xs=new float[]{cx+ht,cx+ht,cx-ht,cx-ht};ys=new float[]{cy-hl,cy+hl,cy+hl,cy-hl};}
        for(int i=0;i<4;i++)xs[i]+=(ys[i]-cy)*slant;
        float[] u={0,1,1,0},w={1,1,0,0};
        for(int i=0;i<4;i++){int k=i*5;v[k]=xs[i];v[k+1]=ys[i];v[k+2]=c;v[k+3]=u[i];v[k+4]=w[i];}
        b.draw(tex,v,0,20);
    }
    /** A bevelled hexagonal bar with anti-aliased edges and a soft vertical shading. */
    private static Texture hexBar(int w,int h){
        Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float hh=h/2f;
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){
            float dy=Math.abs(y+.5f-hh),inset=dy;                      // pointed ends: 45° bevel
            float edge=Math.min(Math.min(x+.5f-inset,w-x-.5f-inset),hh-dy);
            float a=Math.max(0,Math.min(1,edge/1.4f));float shade=1-.18f*(dy/hh);
            p.drawPixel(x,y,Color.rgba8888(shade,shade,shade,a));}
        Texture t=new Texture(p,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
    private static Texture soft(int n){
        Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=Math.abs(x-c)/c,dy=Math.abs(y-c)/c,d=Math.max(dx*.75f+dy*.25f,dy);float a=d>=1?0:(1-d);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
    @Override public void dispose(){bar.dispose();glow.dispose();}
}
