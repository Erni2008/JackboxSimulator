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

    final Texture background,pixel,soft,skull,crown,ring,car,wheels;
    final BitmapFont title,big,mid,small,tiny,num;
    /** pre-rendered materials from tools/assets/rare_minds/make_ui.py */
    final Texture titleArt,bezel,gemTex,grain,flame;final NinePatch slot,frame,frameRed,frameGhost,card,cardRed,cardGhost,tab;
    private final java.util.List<Texture> owned=new java.util.ArrayList<>();
    private Texture ui(String n){Texture t=new Texture(Gdx.files.internal("rare_minds/ui/"+n),true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);owned.add(t);return t;}
    private NinePatch nine(String n,int edge){return new NinePatch(ui(n),edge,edge,edge,edge);}
    private final Map<String,Texture> faces=new HashMap<>();
    final GlyphLayout gl=new GlyphLayout();
    SpriteBatch batch;

    RareMindsArt(){
        background=new Texture(Gdx.files.internal("rare_minds/background.jpg"),true);background.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        titleArt=ui("title.png");bezel=ui("bezel.png");gemTex=ui("gem.png");grain=new Texture(Gdx.files.internal("rare_minds/ui/grain.png"));grain.setWrap(Texture.TextureWrap.Repeat,Texture.TextureWrap.Repeat);owned.add(grain);
        frame=nine("panel.png",40);frameRed=nine("panel_red.png",40);frameGhost=nine("panel_ghost.png",40);card=nine("card.png",30);cardRed=nine("card_red.png",30);cardGhost=nine("card_ghost.png",30);tab=nine("tab.png",28);
        soft=radial();skull=ui("skull.png");flame=ui("flame.png");slot=nine("slot.png",14);crown=crown();ring=ring();car=car(false);wheels=car(true);
        // Russo One (display, numbers) + Noto Sans SemiCondensed SemiBold (everything read at a glance); both carry Cyrillic
        title=font("ui/fonts/RussoOne-Regular.ttf",118,3);big=font("ui/fonts/RussoOne-Regular.ttf",58,0);num=font("ui/fonts/RussoOne-Regular.ttf",40,0);
        mid=font("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf",38,0);small=font("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf",28,0);tiny=font("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf",22,0);
    }

    private static BitmapFont font(String file,int size,int border){
        var g=new com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator(Gdx.files.internal(file));
        try{var p=new com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator.FreeTypeFontParameter();p.size=size;p.kerning=true;
            StringBuilder c=new StringBuilder(com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator.DEFAULT_CHARS);for(char ch='\u0400';ch<='\u04ff';ch++)c.append(ch);
            p.characters=c.append("\u2013\u2014\u2018\u2019\u201c\u201d\u00ab\u00bb\u2026\u00b7\u00d7\u2212\u25b2").toString();
            if(border>0){p.borderWidth=border;p.borderColor=new Color(.10f,.03f,.02f,1);}
            p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;return g.generateFont(p);}finally{g.dispose();}
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
    void gem(float x,float y,float r,Color c,float a){if(gemTex!=null){batch.setColor(0,0,0,.6f*a);batch.draw(gemTex,x-r*1.25f+1,y-r*1.25f-2,r*2.5f,r*2.5f);batch.setColor(c.r,c.g,c.b,a);batch.draw(gemTex,x-r*1.2f,y-r*1.2f,r*2.4f,r*2.4f);return;}diamond(x,y,r+2,Color.BLACK,a*.8f);diamond(x,y,r,c,a);batch.setColor(1,1,1,.55f*a);batch.draw(pixel,x-r*.35f,y,r*.35f,0,r*.5f,r*.5f,1,1,45,0,0,1,1,false,false);}

    /**
     * The game-show frame used by every panel: smoked glass, a double gilt line with chamfered corners and a faint
     * inner rim light. {@code accent} tints the outer line (red for danger, blue for ghosts).
     */
    /** Gilt frame over dark glass (nine-patch art), a soft shadow under it; red for danger, blue for ghosts. */
    void panel(float x,float y,float w,float h,float a,Color accent){
        NinePatch n=accent==RED||accent==RED_SOFT?frameRed:accent==GHOST?frameGhost:frame;
        shade(x+w/2,y+h/2-18,w+120,h+110,.6f*a);
        batch.setColor(Color.WHITE);n.setColor(new Color(1,1,1,a));n.draw(batch,x-6,y-6,w+12,h+12);
        if(accent!=GHOST){diamond(x+w/2,y+h+3,11,new Color(.28f,.13f,.05f,1),a);gem(x+w/2,y+h+3,8,accent==null?GOLD:accent,a);}
    }
    void cardFrame(float x,float y,float w,float h,Color accent){NinePatch n=accent==RED?cardRed:accent==GHOST?cardGhost:card;shade(x+w/2,y+h/2-14,w+70,h+60,.6f);batch.setColor(Color.WHITE);n.setColor(Color.WHITE);n.draw(batch,x-4,y-4,w+8,h+8);}
    private void line(float x,float y,float w,float h,Color c,float a){rect(x,y,w,h,c,a);}
    private void corner(float x,float y,float k,int sx,int sy,Color c,float a){
        // 45° chamfer from (x, y+sy*k) to (x+sx*k, y)
        float len=(float)Math.hypot(k,k);float ang=sx*sy>0?-45:45;
        batch.setColor(c.r,c.g,c.b,c.a*.92f*a);batch.draw(pixel,x+sx*k/2-len/2,y+sy*k/2-1,len/2,1,len,2,1,1,ang,0,0,1,1,false,false);
    }
    /** Gilt tab (question number, labels). */
    void plaque(float cx,float cy,float w,float h,float a,Color accent){shade(cx,cy-8,w+80,h+50,.6f*a);batch.setColor(Color.WHITE);tab.setColor(accent==RED?new Color(1,.55f,.5f,a):new Color(1,1,1,a));tab.draw(batch,cx-w/2,cy-h/2,w,h);}
    void ornament(float cx,float y,float w,Color c,float a){rect(cx-w/2,y,w,1,c,a*.35f);}

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
        shade(cx,cy-10,r*3f,r*3f,.75f*a);
        batch.setColor(1,1,1,a);batch.draw(bezel,cx-r*1.22f,cy-r*1.22f,r*2.44f,r*2.44f);
        int n=120;float rr=r*.86f;batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int k=0;k<n;k++){float t=k/(float)n;if(t>frac)break;float ang=90-t*360;float x=cx+MathUtils.cosDeg(ang)*rr,y=cy+MathUtils.sinDeg(ang)*rr;
            batch.setColor(c.r,c.g,c.b,a*.95f);batch.draw(pixel,x-7,y-2.2f,7,2.2f,14,4.4f,1,1,ang+90,0,0,1,1,false,false);
            batch.setColor(c.r,c.g,c.b,a*.18f);batch.draw(soft,x-14,y-14,28,28);}
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        glow(cx,cy,r*2.6f,r*2.6f,c,(.10f+.22f*pulse)*a);
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
    /** Side view of a low race car, 128×40 (body tinted at draw time; {@code wheelsOnly} gives the dark tyres + glass layer). */
    private static Texture car(boolean wheelsOnly){int s=4,W=128,H=40;Pixmap b=new Pixmap(W*s,H*s,Pixmap.Format.RGBA8888);b.setBlending(Pixmap.Blending.None);b.setColor(Color.WHITE);
        if(!wheelsOnly){b.fillRectangle(14*s,12*s,100*s,12*s);b.fillCircle(14*s,18*s,6*s);b.fillTriangle(110*s,12*s,110*s,24*s,126*s,22*s);// body + nose
            b.fillCircle(56*s,12*s,12*s);b.fillRectangle(44*s,6*s,30*s,8*s);// cockpit dome
            b.fillRectangle(2*s,4*s,10*s,6*s);b.fillRectangle(8*s,8*s,4*s,8*s);// rear wing
            b.setColor(0,0,0,0);b.fillRectangle(0,24*s,W*s,16*s);}
        else{b.fillCircle(30*s,26*s,9*s);b.fillCircle(98*s,26*s,9*s);b.fillTriangle(50*s,9*s,62*s,2*s,68*s,9*s);}
        Pixmap p=new Pixmap(W,H,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<H;y++)for(int x=0;x<W;x++){float a=0;for(int j=0;j<s;j++)for(int i=0;i<s;i++)a+=(b.getPixel(x*s+i,y*s+j)&0xff)/255f;p.drawPixel(x,y,Color.rgba8888(1,1,1,a/(s*s)));}
        b.dispose();Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    private static Texture downsample(Pixmap big,int s){int n=big.getWidth()/s;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float a=0;for(int j=0;j<s;j++)for(int i=0;i<s;i++)a+=(big.getPixel(x*s+i,y*s+j)&0xff)/255f;p.drawPixel(x,y,Color.rgba8888(1,1,1,a/(s*s)));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}

    @Override public void dispose(){for(Texture t:owned)t.dispose();background.dispose();pixel.dispose();soft.dispose();crown.dispose();ring.dispose();car.dispose();wheels.dispose();title.dispose();big.dispose();num.dispose();mid.dispose();small.dispose();tiny.dispose();for(Texture t:faces.values())if(t!=null)t.dispose();}
}
