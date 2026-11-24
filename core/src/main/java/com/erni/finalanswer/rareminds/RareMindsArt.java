package com.erni.finalanswer.rareminds;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.Disposable;
import java.util.*;

/**
 * RARE MINDS drawing kit: the stage background, fonts and a few procedural sprites (soft light, skull, crown), plus
 * the framed-panel and text primitives every part of the host screen is built from. No game rules in here.
 */
final class RareMindsArt implements Disposable {
    static final Color GOLD=new Color(.93f,.80f,.56f,1),GOLD_DEEP=new Color(.66f,.48f,.24f,1),IVORY=new Color(.98f,.93f,.84f,1),
        DIM=new Color(.70f,.62f,.52f,1),RED=new Color(.93f,.17f,.12f,1),RED_SOFT=new Color(1f,.42f,.34f,1),GHOST=new Color(.62f,.82f,1f,1),PANEL=new Color(.045f,.018f,.02f,.84f);
    /** COMMON … MYTHIC gem colours, same order as the server's tiers. */
    static final Color[] TIER={new Color(.82f,.82f,.84f,1),new Color(.30f,.88f,.54f,1),new Color(.30f,.70f,1f,1),new Color(.78f,.49f,1f,1),new Color(1f,.76f,.24f,1),new Color(1f,.29f,.24f,1)};

    final Texture background,pixel,soft,skull,crown,ring;
    final BitmapFont title,big,mid,small,tiny;
    private final Map<String,Texture> faces=new HashMap<>();
    final GlyphLayout gl=new GlyphLayout();
    SpriteBatch batch;

    RareMindsArt(){
        background=new Texture(Gdx.files.internal("rare_minds/background.jpg"),true);background.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        soft=radial();skull=skull();crown=crown();ring=ring();
        title=com.erni.finalanswer.ui.UiFonts.gothic(132);big=com.erni.finalanswer.ui.UiFonts.gothic(66);mid=com.erni.finalanswer.ui.UiFonts.gothic(40);
        small=com.erni.finalanswer.ui.UiFonts.gothic(30);tiny=com.erni.finalanswer.ui.UiFonts.gothic(23);
    }

    Texture face(String character){
        if(character==null||character.isEmpty())return null;
        return faces.computeIfAbsent(character,c->{var f=Gdx.files.internal("forgotten_room/portraits/"+c+".png");if(!f.exists())return null;Texture t=new Texture(f,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;});
    }

    // ---------------------------------------------------------------- primitives
    void rect(float x,float y,float w,float h,Color c,float a){batch.setColor(c.r,c.g,c.b,c.a*a);batch.draw(pixel,x,y,w,h);}
    void glow(float cx,float cy,float w,float h,Color c,float a){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(c.r,c.g,c.b,a);batch.draw(soft,cx-w/2,cy-h/2,w,h);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
    void shade(float cx,float cy,float w,float h,float a){batch.setColor(0,0,0,a);batch.draw(soft,cx-w/2,cy-h/2,w,h);}
    void diamond(float x,float y,float r,Color c,float a){batch.setColor(c.r,c.g,c.b,a);batch.draw(pixel,x-r*.7f,y-r*.7f,r*.7f,r*.7f,r*1.4f,r*1.4f,1,1,45,0,0,1,1,false,false);}
    /** A gem: dark-edged diamond with a bright facet. */
    void gem(float x,float y,float r,Color c,float a){diamond(x,y,r+2,Color.BLACK,a*.8f);diamond(x,y,r,c,a);batch.setColor(1,1,1,.55f*a);batch.draw(pixel,x-r*.35f,y,r*.35f,0,r*.5f,r*.5f,1,1,45,0,0,1,1,false,false);}

    /**
     * The game-show frame used by every panel: smoked glass, a double gilt line with chamfered corners and a faint
     * inner rim light. {@code accent} tints the outer line (red for danger, blue for ghosts).
     */
    void panel(float x,float y,float w,float h,float a,Color accent){
        shade(x+w/2,y+h/2-14,w+150,h+150,.55f*a);
        rect(x,y,w,h,PANEL,a);
        batch.setColor(.30f,.05f,.04f,.22f*a);batch.draw(soft,x+w*.1f,y+h*.45f,w*.8f,h*.9f);
        Color c=accent==null?GOLD:accent;float k=12;
        line(x+k,y+h-1.5f,w-2*k,2,c,.92f*a);line(x+k,y-.5f,w-2*k,2,c,.92f*a);line(x-.5f,y+k,2,h-2*k,c,.92f*a);line(x+w-1.5f,y+k,2,h-2*k,c,.92f*a);
        corner(x,y+h,k,1,-1,c,a);corner(x+w,y+h,k,-1,-1,c,a);corner(x,y,k,1,1,c,a);corner(x+w,y,k,-1,1,c,a);
        float i=7;rect(x+i+k,y+h-i-1,w-2*i-2*k,1,c,.28f*a);rect(x+i+k,y+i,w-2*i-2*k,1,c,.28f*a);rect(x+i,y+i+k,1,h-2*i-2*k,c,.28f*a);rect(x+w-i-1,y+i+k,1,h-2*i-2*k,c,.28f*a);
        diamond(x+w/2,y+h,6,c,a);diamond(x+w/2,y,6,c,a);
    }
    private void line(float x,float y,float w,float h,Color c,float a){rect(x,y,w,h,c,a);}
    private void corner(float x,float y,float k,int sx,int sy,Color c,float a){
        // 45° chamfer from (x, y+sy*k) to (x+sx*k, y)
        float len=(float)Math.hypot(k,k);float ang=sx*sy>0?-45:45;
        batch.setColor(c.r,c.g,c.b,c.a*.92f*a);batch.draw(pixel,x+sx*k/2-len/2,y+sy*k/2-1,len/2,1,len,2,1,1,ang,0,0,1,1,false,false);
    }
    /** A small gilt plaque with pointed ends (the "QUESTION 3 / 8" tab, the subtitle plate). */
    void plaque(float cx,float cy,float w,float h,float a,Color accent){
        Color c=accent==null?GOLD:accent;
        shade(cx,cy-6,w+90,h+70,.6f*a);rect(cx-w/2,cy-h/2,w,h,PANEL,a);
        rect(cx-w/2,cy+h/2-2,w,2,c,.9f*a);rect(cx-w/2,cy-h/2,w,2,c,.9f*a);
        diamond(cx-w/2,cy,h*.42f,c,.9f*a);diamond(cx+w/2,cy,h*.42f,c,.9f*a);diamond(cx-w/2,cy,h*.28f,PANEL,a);diamond(cx+w/2,cy,h*.28f,PANEL,a);
    }
    void ornament(float cx,float y,float w,Color c,float a){
        batch.setColor(c.r,c.g,c.b,0);
        for(int i=0;i<40;i++){float t=i/39f,x=cx-w/2+w*t;float fade=1-Math.abs(t-.5f)*2;rect(x,y,w/40f+1,1.4f,c,a*fade*.85f);}
        diamond(cx,y+.7f,5,c,a);
    }

    // ---------------------------------------------------------------- text
    float width(BitmapFont f,String s,float scale){f.getData().setScale(scale);gl.setText(f,s);f.getData().setScale(1);return gl.width;}
    /** Centred single line with a soft drop shadow; shrinks to {@code maxW}. */
    void text(BitmapFont f,String s,float cx,float y,float scale,Color c,float a,float maxW){
        if(a<=0||s==null||s.isEmpty())return;float w=width(f,s,scale);if(maxW>0&&w>maxW)scale*=maxW/w;
        f.getData().setScale(scale);gl.setText(f,s);float x=cx-gl.width/2;
        f.setColor(0,0,0,.75f*a);f.draw(batch,s,x+2,y-3);f.setColor(c.r,c.g,c.b,a);f.draw(batch,s,x,y);f.getData().setScale(1);
    }
    void textLeft(BitmapFont f,String s,float x,float y,float scale,Color c,float a){if(a<=0||s==null)return;f.getData().setScale(scale);f.setColor(0,0,0,.7f*a);f.draw(batch,s,x+2,y-2);f.setColor(c.r,c.g,c.b,a);f.draw(batch,s,x,y);f.getData().setScale(1);}
    void textRight(BitmapFont f,String s,float x,float y,float scale,Color c,float a){float w=width(f,s,scale);textLeft(f,s,x-w,y,scale,c,a);}
    /** Wrapped, centred paragraph inside {@code w}; returns its height. */
    float paragraph(BitmapFont f,String s,float cx,float top,float w,float scale,Color c,float a){
        f.getData().setScale(scale);gl.setText(f,s,c,w,Align.center,true);float h=gl.height;
        f.setColor(0,0,0,.75f*a);f.draw(batch,s,cx-w/2+2,top-3,w,Align.center,true);f.setColor(c.r,c.g,c.b,a);f.draw(batch,s,cx-w/2,top,w,Align.center,true);f.getData().setScale(1);return h;
    }
    float paragraphHeight(BitmapFont f,String s,float w,float scale){f.getData().setScale(scale);gl.setText(f,s,Color.WHITE,w,Align.center,true);f.getData().setScale(1);return gl.height;}

    /** Timer ring: dark disc, faint track, the remaining arc lit, ticks every second. */
    void timerRing(float cx,float cy,float r,float frac,Color c,float a,float pulse){
        shade(cx,cy-8,r*3.2f,r*3.2f,.7f*a);
        batch.setColor(.03f,.01f,.012f,.92f*a);batch.draw(soft,cx-r*1.25f,cy-r*1.25f,r*2.5f,r*2.5f);
        batch.setColor(.03f,.01f,.012f,a);batch.draw(ring,cx-r,cy-r,r*2,r*2);
        int n=180;for(int k=0;k<n;k++){float t=k/(float)n;float ang=90-t*360;boolean lit=t<=frac;
            float x=cx+MathUtils.cosDeg(ang)*r*.86f,y=cy+MathUtils.sinDeg(ang)*r*.86f;
            batch.setColor(lit?c.r:.22f,lit?c.g:.07f,lit?c.b:.06f,a*(lit?1:.9f));batch.draw(pixel,x-6,y-1.6f,6,1.6f,12,3.2f,1,1,ang+90,0,0,1,1,false,false);}
        glow(cx,cy,r*3f,r*3f,c,(.18f+.25f*pulse)*a);
        batch.setColor(GOLD_DEEP.r,GOLD_DEEP.g,GOLD_DEEP.b,.75f*a);batch.draw(ring,cx-r*1.04f,cy-r*1.04f,r*2.08f,r*2.08f);
    }

    // ---------------------------------------------------------------- procedural sprites
    private static Texture radial(){int n=128;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float d=(float)Math.hypot(x-c,y-c)/c;float a=d>=1?0:(1-d);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    /** Thin anti-aliased circle outline. */
    private static Texture ring(){int n=256;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float d=(float)Math.hypot(x-c,y-c);float a=MathUtils.clamp(1-Math.abs(d-(c-3))/2.2f,0,1);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    /** Skull silhouette (white, tinted at draw time), supersampled for clean edges. */
    private static Texture skull(){int s=4,n=64;Pixmap big=new Pixmap(n*s,n*s,Pixmap.Format.RGBA8888);big.setBlending(Pixmap.Blending.None);
        big.setColor(Color.WHITE);big.fillCircle(32*s,27*s,22*s);big.fillRectangle(18*s,34*s,28*s,14*s);big.fillRectangle(22*s,46*s,20*s,10*s);
        big.setColor(0,0,0,0);big.fillCircle(23*s,28*s,6*s);big.fillCircle(41*s,28*s,6*s);big.fillTriangle(32*s,33*s,28*s,40*s,36*s,40*s);
        for(int i=0;i<3;i++)big.fillRectangle((26+i*5)*s,48*s,s*2,8*s);
        Texture t=downsample(big,s);big.dispose();return t;}
    private static Texture crown(){int s=4,n=64;Pixmap big=new Pixmap(n*s,n*s,Pixmap.Format.RGBA8888);big.setBlending(Pixmap.Blending.None);big.setColor(Color.WHITE);
        big.fillRectangle(10*s,40*s,44*s,10*s);big.fillTriangle(10*s,42*s,10*s,16*s,24*s,42*s);big.fillTriangle(22*s,42*s,32*s,10*s,42*s,42*s);big.fillTriangle(40*s,42*s,54*s,16*s,54*s,42*s);
        big.fillCircle(10*s,15*s,4*s);big.fillCircle(32*s,9*s,4*s);big.fillCircle(54*s,15*s,4*s);
        Texture t=downsample(big,s);big.dispose();return t;}
    private static Texture downsample(Pixmap big,int s){int n=big.getWidth()/s;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float a=0;for(int j=0;j<s;j++)for(int i=0;i<s;i++)a+=(big.getPixel(x*s+i,y*s+j)&0xff)/255f;p.drawPixel(x,y,Color.rgba8888(1,1,1,a/(s*s)));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}

    @Override public void dispose(){background.dispose();pixel.dispose();soft.dispose();skull.dispose();crown.dispose();ring.dispose();title.dispose();big.dispose();mid.dispose();small.dispose();tiny.dispose();for(Texture t:faces.values())if(t!=null)t.dispose();}
}
