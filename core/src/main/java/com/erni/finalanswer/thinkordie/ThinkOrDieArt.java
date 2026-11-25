package com.erni.finalanswer.thinkordie;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.Disposable;
import java.util.*;

/**
 * THINK OR DIE drawing kit. Everything replaceable lives under {@code assets/think_or_die/} (background.jpg is used
 * when present, otherwise a procedural stage is drawn); fonts and portraits are the project's own. No game rules.
 */
final class ThinkOrDieArt implements Disposable {
    static final Color INK=new Color(.94f,.91f,.88f,1),DIM=new Color(.58f,.55f,.53f,1),ACID=new Color(.85f,1f,.25f,1),BLOOD=new Color(.92f,.18f,.14f,1),
        GOLD=new Color(1f,.77f,.30f,1),GREEN=new Color(.36f,.89f,.54f,1),ORANGE=new Color(1f,.60f,.24f,1),RED=new Color(1f,.29f,.24f,1),
        NEUTRAL=new Color(.62f,.62f,.66f,1),GHOST=new Color(.56f,.82f,1f,1),PANEL=new Color(.06f,.045f,.05f,.86f);
    /** lane colours, one per seat */
    static final Color[] SEAT={new Color(.95f,.30f,.25f,1),new Color(.30f,.70f,1f,1),new Color(.98f,.78f,.25f,1),new Color(.55f,.90f,.40f,1),
        new Color(.80f,.45f,1f,1),new Color(1f,.55f,.20f,1),new Color(.25f,.90f,.85f,1),new Color(1f,.45f,.70f,1)};

    final Texture pixel,soft,ring,car,carGlass,noise;final Texture background;
    final BitmapFont horror,display,big,mid,small,tiny;
    final GlyphLayout gl=new GlyphLayout();
    private final Map<String,Texture> faces=new HashMap<>();private final Map<String,Sound> sounds=new HashMap<>();
    SpriteBatch batch;

    ThinkOrDieArt(){
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        soft=radial();ring=ring();car=car(false);carGlass=car(true);noise=noise();
        var bg=Gdx.files.internal("think_or_die/background.jpg");
        background=bg.exists()?mip(new Texture(bg,true)):null;
        horror=font("ui/fonts/Creepster-Regular.ttf",150,0);display=font("ui/fonts/RussoOne-Regular.ttf",96,0);big=font("ui/fonts/RussoOne-Regular.ttf",56,0);
        mid=font("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf",40,0);small=font("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf",28,0);tiny=font("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf",21,0);
    }
    private static Texture mip(Texture t){t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;}
    private static BitmapFont font(String file,int size,int border){
        var fh=Gdx.files.internal(file);if(!fh.exists())fh=Gdx.files.internal("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf");
        var g=new FreeTypeFontGenerator(fh);
        try{var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=size;p.kerning=true;
            StringBuilder c=new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);for(char ch='Ѐ';ch<='ӿ';ch++)c.append(ch);
            p.characters=c.append("–—‘’“”«»…·×−▲✓✕").toString();
            if(border>0){p.borderWidth=border;p.borderColor=Color.BLACK;}
            p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;return g.generateFont(p);}finally{g.dispose();}
    }
    Texture face(String character){
        if(character==null||character.isEmpty())return null;
        return faces.computeIfAbsent(character,c->{var f=Gdx.files.internal("forgotten_room/portraits/"+c+".png");return f.exists()?mip(new Texture(f,true)):null;});
    }
    /** Existing project sound effects; a missing file is skipped silently. */
    void play(String path,float volume){
        Sound s=sounds.computeIfAbsent(path,k->{try{var f=Gdx.files.internal(k);return f.exists()?Gdx.audio.newSound(f):null;}catch(RuntimeException e){return null;}});
        if(s!=null)try{s.play(volume);}catch(RuntimeException ignored){}
    }

    // ---------------------------------------------------------------- primitives
    void rect(float x,float y,float w,float h,Color c,float a){batch.setColor(c.r,c.g,c.b,c.a*a);batch.draw(pixel,x,y,w,h);}
    void glow(float cx,float cy,float w,float h,Color c,float a){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(c.r,c.g,c.b,a);batch.draw(soft,cx-w/2,cy-h/2,w,h);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
    void shade(float cx,float cy,float w,float h,float a){batch.setColor(0,0,0,a);batch.draw(soft,cx-w/2,cy-h/2,w,h);}
    /** Smoked-glass slab with a hairline rim and a coloured spine on the left. */
    void slab(float x,float y,float w,float h,Color spine,float a){
        shade(x+w/2,y+h/2-10,w+60,h+50,.55f*a);
        rect(x,y,w,h,PANEL,a);rect(x,y+h-1,w,1,Color.WHITE,.10f*a);rect(x,y,w,1,Color.BLACK,.6f*a);
        if(spine!=null){rect(x,y,5,h,spine,a);glow(x+2,y+h/2,40,h*1.1f,spine,.10f*a);}
    }
    void frame(float x,float y,float w,float h,Color c,float a,float t){rect(x,y,w,t,c,a);rect(x,y+h-t,w,t,c,a);rect(x,y,t,h,c,a);rect(x+w-t,y,t,h,c,a);}

    // ---------------------------------------------------------------- text
    float width(BitmapFont f,String s,float scale){f.getData().setScale(scale);gl.setText(f,s);f.getData().setScale(1);return gl.width;}
    void text(BitmapFont f,String s,float cx,float y,float scale,Color c,float a,float maxW){
        if(a<=0||s==null||s.isEmpty())return;float w=width(f,s,scale);if(maxW>0&&w>maxW)scale*=maxW/w;
        f.getData().setScale(scale);gl.setText(f,s);float x=cx-gl.width/2;
        f.setColor(0,0,0,.8f*a);f.draw(batch,s,x+2,y-3);f.setColor(c.r,c.g,c.b,a);f.draw(batch,s,x,y);f.getData().setScale(1);
    }
    void left(BitmapFont f,String s,float x,float y,float scale,Color c,float a,float maxW){
        if(a<=0||s==null||s.isEmpty())return;float w=width(f,s,scale);if(maxW>0&&w>maxW)scale*=maxW/w;
        f.getData().setScale(scale);f.setColor(0,0,0,.75f*a);f.draw(batch,s,x+2,y-2);f.setColor(c.r,c.g,c.b,a);f.draw(batch,s,x,y);f.getData().setScale(1);
    }
    void right(BitmapFont f,String s,float x,float y,float scale,Color c,float a){left(f,s,x-width(f,s,scale),y,scale,c,a,0);}
    /** Wrapped, centred paragraph; shrinks the scale until it fits {@code maxH}. Returns the height used. */
    float paragraph(BitmapFont f,String s,float cx,float top,float w,float scale,float maxH,Color c,float a){
        for(int k=0;k<8;k++){f.getData().setScale(scale);gl.setText(f,s,c,w,Align.center,true);if(gl.height<=maxH||scale<.4f)break;scale*=.9f;}
        float h=gl.height;f.setColor(0,0,0,.8f*a);f.draw(batch,s,cx-w/2+3,top-4,w,Align.center,true);f.setColor(c.r,c.g,c.b,a);f.draw(batch,s,cx-w/2,top,w,Align.center,true);f.getData().setScale(1);return h;
    }

    /** Portrait in a round frame, dimmed and tinted cold for ghosts. */
    void portrait(String character,float cx,float cy,float r,Color rim,boolean ghost,float a){
        shade(cx,cy-6,r*3,r*3,.6f*a);
        batch.setColor(rim.r,rim.g,rim.b,a);batch.draw(ring,cx-r-4,cy-r-4,r*2+8,r*2+8);
        Texture t=face(character);
        if(t!=null){batch.setColor(ghost?new Color(.55f,.75f,1f,.55f*a):new Color(1,1,1,a));batch.draw(t,cx-r,cy-r,r*2,r*2);}
        else{rect(cx-r*.7f,cy-r*.7f,r*1.4f,r*1.4f,rim,.35f*a);}
        if(ghost)glow(cx,cy,r*3,r*3,GHOST,.18f*a);
    }
    /** A low race car facing right, tinted with the seat colour. */
    void car(float x,float y,float w,Color c,float a,boolean ghost){
        float h=w*40/128f;
        shade(x+w/2,y-2,w*1.3f,h*.9f,.55f*a);
        batch.setColor(c.r,c.g,c.b,(ghost?.55f:1f)*a);batch.draw(car,x,y,w,h);
        batch.setColor(.05f,.05f,.06f,a);batch.draw(carGlass,x,y,w,h);
        if(ghost)glow(x+w/2,y+h/2,w*1.6f,h*2.4f,GHOST,.14f*a);
    }
    /** Fine film grain + scanlines over the whole stage. */
    void grain(float w,float h,float clock,float a){
        batch.setColor(1,1,1,a);float ox=MathUtils.random(256f),oy=MathUtils.random(256f);
        batch.draw(noise,0,0,w,h,(int)ox,(int)oy,(int)w/2,(int)h/2,false,false);
        for(float y=0;y<h;y+=4)rect(0,y,w,1,Color.BLACK,.06f);
    }

    // ---------------------------------------------------------------- procedural sprites
    private static Texture radial(){int n=128;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float d=(float)Math.hypot(x-c,y-c)/c;float a=d>=1?0:(1-d);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    private static Texture ring(){int n=256;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float d=(float)Math.hypot(x-c,y-c);float a=MathUtils.clamp(1-Math.abs(d-(c-4))/3.2f,0,1);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    private static Texture noise(){int n=256;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);Random r=new Random(7);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float v=r.nextFloat();p.drawPixel(x,y,Color.rgba8888(v,v,v,.05f));}
        Texture t=new Texture(p);t.setWrap(Texture.TextureWrap.Repeat,Texture.TextureWrap.Repeat);p.dispose();return t;}
    private static Texture car(boolean glass){int s=4,W=128,H=40;Pixmap b=new Pixmap(W*s,H*s,Pixmap.Format.RGBA8888);b.setBlending(Pixmap.Blending.None);b.setColor(Color.WHITE);
        if(!glass){b.fillRectangle(14*s,12*s,100*s,12*s);b.fillCircle(14*s,18*s,6*s);b.fillTriangle(110*s,12*s,110*s,24*s,126*s,22*s);
            b.fillCircle(56*s,12*s,12*s);b.fillRectangle(44*s,6*s,30*s,8*s);b.fillRectangle(2*s,4*s,10*s,6*s);b.fillRectangle(8*s,8*s,4*s,8*s);
            b.setColor(0,0,0,0);b.fillRectangle(0,24*s,W*s,16*s);}
        else{b.fillCircle(30*s,26*s,9*s);b.fillCircle(98*s,26*s,9*s);b.fillTriangle(50*s,9*s,62*s,2*s,68*s,9*s);}
        Pixmap p=new Pixmap(W,H,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<H;y++)for(int x=0;x<W;x++){float a=0;for(int j=0;j<s;j++)for(int i=0;i<s;i++)a+=(b.getPixel(x*s+i,y*s+j)&0xff)/255f;p.drawPixel(x,y,Color.rgba8888(1,1,1,a/(s*s)));}
        b.dispose();Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}

    @Override public void dispose(){pixel.dispose();soft.dispose();ring.dispose();car.dispose();carGlass.dispose();noise.dispose();if(background!=null)background.dispose();
        horror.dispose();display.dispose();big.dispose();mid.dispose();small.dispose();tiny.dispose();
        for(Texture t:faces.values())if(t!=null)t.dispose();for(Sound s:sounds.values())if(s!=null)s.dispose();}
}
