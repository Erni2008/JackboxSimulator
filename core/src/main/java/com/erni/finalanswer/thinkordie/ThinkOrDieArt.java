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
    // TV show palette: deep studio violet, hot magenta, electric cyan, sunshine yellow
    static final Color INK=new Color(1f,1f,1f,1),DIM=new Color(.76f,.70f,.92f,1),ACID=new Color(.12f,.88f,1f,1),BLOOD=new Color(1f,.17f,.42f,1),
        GOLD=new Color(1f,.85f,.18f,1),GREEN=new Color(.40f,1f,.45f,1),ORANGE=new Color(1f,.55f,.12f,1),RED=new Color(1f,.22f,.32f,1),
        NEUTRAL=new Color(.62f,.58f,.78f,1),GHOST=new Color(.55f,.88f,1f,1),PANEL=new Color(.16f,.07f,.34f,.92f),
        MAGENTA=new Color(1f,.18f,.58f,1),VIOLET=new Color(.24f,.08f,.50f,1),NIGHT=new Color(.06f,.02f,.16f,1);
    /** seat colours, one per player: saturated and distinct on violet */
    static final Color[] SEAT={new Color(1f,.27f,.36f,1),new Color(.18f,.74f,1f,1),new Color(1f,.82f,.16f,1),new Color(.36f,.95f,.42f,1),
        new Color(.78f,.42f,1f,1),new Color(1f,.55f,.14f,1),new Color(.15f,.95f,.85f,1),new Color(1f,.42f,.80f,1)};

    final Texture pixel,soft,ring,car,carGlass,noise,round,beam,dots;final Texture background;final NinePatch plateFill,plateEdge;
    /** the game's own dungeon kit (lobby): moonlit dungeon, hanging cage, chain, ceiling hook; flame from RARE MINDS */
    final Texture[] badges=new Texture[4];final Texture panelTex;final com.badlogic.gdx.graphics.g2d.NinePatch panel9;final Texture logo,plate,rules,dungeon,cage,chain,hook,flame;final BitmapFont hand;
    final BitmapFont horror,display,big,mid,small,tiny;
    /** THINK OR DIE typography: condensed bold for names and numbers, Inter for instructions (both OFL, Latin + Cyrillic) */
    final BitmapFont cond,inter;
    final GlyphLayout gl=new GlyphLayout();
    private final Map<String,Texture> faces=new HashMap<>();private final Map<String,Sound> sounds=new HashMap<>();
    SpriteBatch batch;private Texture roundEdge;

    ThinkOrDieArt(){
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        soft=radial();ring=ring();car=car(false);carGlass=car(true);noise=noise();
        round=rounded(false);Texture edge=rounded(true);plateFill=new NinePatch(round,40,40,40,40);plateEdge=new NinePatch(edge,40,40,40,40);roundEdge=edge;
        beam=beam();dots=dots();
        var bg=Gdx.files.internal("think_or_die/background.jpg");
        background=bg.exists()?mip(new Texture(bg,true)):null;
        logo=tex("think_or_die/logo.png");panelTex=tex("think_or_die/panel.png");panel9=panelTex==null?null:new com.badlogic.gdx.graphics.g2d.NinePatch(panelTex,62,62,26,30);plate=tex("think_or_die/category_plate.png");rules=tex("think_or_die/rules_bar.png");for(int i=0;i<4;i++)badges[i]=tex("think_or_die/badge_"+i+".png");dungeon=tex("lobby/background_dungeon.png");cage=tex("lobby/cages/cage_bars.png");hook=tex("lobby/cages/chain_hook.png");flame=tex("rare_minds/ui/flame.png");
        chain=tex("lobby/cages/chain.png");if(chain!=null)chain.setWrap(Texture.TextureWrap.ClampToEdge,Texture.TextureWrap.Repeat);
        hand=font("ui/fonts/Caveat-Variable.ttf",64,0);
        horror=font("ui/fonts/RussoOne-Regular.ttf",150,0);display=font("ui/fonts/RussoOne-Regular.ttf",108,0);big=font("ui/fonts/RussoOne-Regular.ttf",64,0);
        mid=font("ui/fonts/RussoOne-Regular.ttf",40,0);small=font("ui/fonts/RussoOne-Regular.ttf",28,0);tiny=font("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf",22,0);
        cond=font("ui/fonts/RobotoCondensed-Bold.ttf",64,0);inter=font("ui/fonts/Inter-SemiBold.ttf",26,0);
    }
    private static Texture tex(String path){var f=Gdx.files.internal(path);return f.exists()?mip(new Texture(f,true)):null;}
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
    private final java.util.Map<String,Texture> bodies=new java.util.HashMap<>();
    /** Full-body character art (results/characters/<id>.png), feet at the bottom edge. */
    Texture body(String character){
        if(character==null||character.isEmpty())return null;
        return bodies.computeIfAbsent(character,c->{var f=Gdx.files.internal("results/characters/"+c+".png");return f.exists()?mip(new Texture(f,true)):null;});
    }
    Texture face(String character){
        if(character==null||character.isEmpty())return null;
        return faces.computeIfAbsent(character,c->{var f=Gdx.files.internal("forgotten_room/portraits/"+c+".png");return f.exists()?mip(new Texture(f,true)):null;});
    }
    /** Existing project sound effects; a missing file is skipped silently. */
    void play(String path,float volume){
        Sound s=sounds.computeIfAbsent(path,k->{try{var f=Gdx.files.internal(k);return f.exists()?Gdx.audio.newSound(f):null;}catch(RuntimeException e){return null;}});
        float g=com.erni.finalanswer.audio.AudioMix.GLOBAL.gain(com.erni.finalanswer.audio.AudioMix.Category.SFX);if(s!=null&&g>0)try{s.play(volume*g);}catch(RuntimeException ignored){}
    }

    // ---------------------------------------------------------------- primitives
    /**
     * The ornate gothic panel (bronze bevel, red inner line, dark stone with cracks) cut from the category plate artwork,
     * stretched to any size; corners scale down for small panels. {@code accent} tints it (null or bronze/red keep the art
     * as drawn; gold, green, violet and side colours shift the rim) and adds a soft glow for highlighted panels.
     */
    void panel(float x,float y,float w,float h,Color accent,float a){
        if(a<=0||w<8||h<8)return;
        if(panel9==null){rect(x,y,w,h,new Color(.06f,.03f,.03f,1),.94f*a);return;}
        float k=Math.min(1,Math.min(h/(26+30)*.95f,w/(62+62)*.95f));
        float tr=1,tg=1,tb=1;boolean glowIt=false;
        if(accent!=null&&!(accent.r>.9f&&accent.g<.35f)&&!(Math.abs(accent.r-.72f)<.05f&&Math.abs(accent.g-.50f)<.05f)){
            tr=MathUtils.lerp(1,accent.r,.55f);tg=MathUtils.lerp(1,accent.g,.55f);tb=MathUtils.lerp(1,accent.b,.55f);glowIt=true;}
        if(glowIt)glow(x+w/2,y+h/2,w*1.15f,h*1.6f,accent,.18f*a);
        batch.setColor(tr,tg,tb,a);
        if(k<1){panel9.scale(k,k);panel9.draw(batch,x,y,w,h);panel9.scale(1/k,1/k);}else panel9.draw(batch,x,y,w,h);
        batch.setColor(Color.WHITE);
    }
    void rect(float x,float y,float w,float h,Color c,float a){batch.setColor(c.r,c.g,c.b,c.a*a);batch.draw(pixel,x,y,w,h);}
    void glow(float cx,float cy,float w,float h,Color c,float a){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(c.r,c.g,c.b,a);batch.draw(soft,cx-w/2,cy-h/2,w,h);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
    /** A straight stroke of width w (used for the pulse traces). additive: glows instead of covering. */
    void line(float x1,float y1,float x2,float y2,float w,Color c,float a,boolean additive){
        float dx=x2-x1,dy=y2-y1,len=(float)Math.sqrt(dx*dx+dy*dy);if(len<.01f)return;
        if(additive)batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        batch.setColor(c.r,c.g,c.b,c.a*a);
        batch.draw(pixel,x1,y1-w/2,0,w/2,len,w,1,1,com.badlogic.gdx.math.MathUtils.atan2(dy,dx)*com.badlogic.gdx.math.MathUtils.radiansToDegrees,0,0,1,1,false,false);
        if(additive)batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    void shade(float cx,float cy,float w,float h,float a){batch.setColor(0,0,0,a);batch.draw(soft,cx-w/2,cy-h/2,w,h);}
    /** Editorial card: flat dark fill, hairline bone border, a 2px accent rule on top. No glow. */
    void slab(float x,float y,float w,float h,Color accent,float a){
        rect(x+6,y-8,w,h,Color.BLACK,.35f*a);
        rect(x,y,w,h,PANEL,a);
        rect(x,y,w,1,INK,.10f*a);rect(x,y+h-1,w,1,INK,.16f*a);rect(x,y,1,h,INK,.10f*a);rect(x+w-1,y,1,h,INK,.10f*a);
        if(accent!=null)rect(x,y+h-2,Math.min(w,Math.max(40,w*.18f)),2,accent,a);
    }
    /** TV plate: soft drop shadow, rounded fill, glossy top band, bright rim. r = colour of the rim and gloss. */
    /** Draws a nine-patch, shrinking the corner radius when the box is smaller than two corners. */
    void np(NinePatch n,float x,float y,float w,float h){
        if(w<=0||h<=0)return;float k=Math.min(1,Math.min(w,h)/80f);
        if(k<1){n.scale(k,k);n.draw(batch,x,y,w,h);n.scale(1/k,1/k);}else n.draw(batch,x,y,w,h);
    }
    void plate(float x,float y,float w,float h,Color fill,Color rim,float a){
        if(a<=0)return;float m=Math.min(1,Math.min(w,h)/80f);
        batch.setColor(0,0,0,.45f*a);np(plateFill,x+6,y-10,w,h);
        batch.setColor(fill.r,fill.g,fill.b,fill.a*a);np(plateFill,x,y,w,h);
        batch.setColor(1,1,1,.10f*a);np(plateFill,x+4,y+h*.52f,w-8,h*.46f-2);
        if(rim!=null){batch.setColor(rim.r,rim.g,rim.b,a);np(plateEdge,x,y,w,h);
            glow(x+w/2,y+h/2,w*1.15f,h*1.6f,rim,.10f*a*m);}
    }
    /** Pill-shaped chip with centred text. */
    void chip(BitmapFont f,String s,float cx,float cy,float scale,Color fill,Color ink,float a){
        if(a<=0||scale<=.01f)return;
        float w=width(f,s,scale)+44,h=f.getLineHeight()*scale*.95f+18;plate(cx-w/2,cy-h/2,w,h,fill,null,a);
        f.getData().setScale(scale);gl.setText(f,s);f.setColor(ink.r,ink.g,ink.b,a);f.draw(batch,s,cx-gl.width/2,cy+gl.height/2);f.getData().setScale(1);
    }
    /** The TV studio: violet gradient, LED dot wall, sweeping spotlights, glossy stage floor with a neon rim. */
    void studio(float w,float h,float clock,float energy,Color accent){
        int bands=36;for(int k=0;k<bands;k++){float f=k/(float)bands;Color c=new Color(NIGHT).lerp(VIOLET,(float)Math.pow(f,1.4f));rect(0,h*(1-f)-h/bands,w,h/bands+1,c,1);}
        rect(0,0,w,h*.36f,NIGHT,.55f);
        // LED wall: dots that ripple with the energy of the moment
        batch.setColor(accent.r,accent.g,accent.b,.10f+.08f*energy);batch.draw(dots,0,h*.36f,w,h*.64f,0,0,(int)(w/24),(int)(h*.64f/24));
        for(int k=0;k<7;k++){float x=w*(k+.5f)/7,wave=.5f+.5f*MathUtils.sin(clock*1.6f+k*.9f);glow(x,h*.70f,380,460,k%2==0?MAGENTA:ACID,(.05f+.07f*energy)*wave);}
        // spotlights from the rig
        for(int k=0;k<4;k++){float base=w*(.14f+k*.24f),ang=MathUtils.sin(clock*(.45f+k*.11f)+k*1.7f)*22+(k<2?8:-8);
            Color c=k%2==0?MAGENTA:ACID;batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(c.r,c.g,c.b,.10f+.06f*energy);
            batch.draw(beam,base-170,h-40-900,170,900,340,900,1,1,ang+180,0,0,beam.getWidth(),beam.getHeight(),false,false);
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);glow(base,h-30,160,90,Color.WHITE,.35f);}
        // stage floor with reflection and a neon edge
        rect(0,0,w,h*.30f,NIGHT,.55f);
        glow(w/2,h*.30f,w*1.1f,60,accent,.35f);rect(0,h*.30f-2,w,3,accent,.65f);
        glow(w/2,h*.16f,w*.9f,h*.25f,MAGENTA,.10f+.05f*energy);
    }
    /** A neon podium disc the characters stand on. */
    void disc(float cx,float y,float w,Color c,float a){
        batch.setColor(0,0,0,.55f*a);batch.draw(soft,cx-w*.62f,y-w*.14f,w*1.24f,w*.30f);
        batch.setColor(c.r*.35f,c.g*.35f,c.b*.35f,a);batch.draw(round,cx-w/2,y-w*.09f,w,w*.18f);
        batch.setColor(c.r,c.g,c.b,a);batch.draw(roundEdge,cx-w/2,y-w*.09f,w,w*.18f);
        glow(cx,y,w*1.2f,w*.5f,c,.35f*a);
    }
    static final Color PAPER=new Color(.90f,.84f,.72f,1),INKD=new Color(.12f,.08f,.07f,1);
    /** An aged parchment note: torn-looking uneven edges, burnt rim, a few stains (deterministic per seed). */
    void paper(float x,float y,float w,float h,int seed,float a){
        java.util.Random r=new java.util.Random(seed*7919L+3);
        rect(x+5,y-7,w,h,Color.BLACK,.45f*a);
        rect(x,y,w,h,PAPER,a);
        for(int k=0;k<6;k++){float sx=x+r.nextFloat()*w,sy=y+r.nextFloat()*h,sr=8+r.nextFloat()*30;batch.setColor(.55f,.42f,.28f,.10f*a);batch.draw(soft,sx-sr,sy-sr,sr*2,sr*2);}
        // burnt rim
        for(int k=0;k<4;k++){float t=3+k*3,al=(.16f-k*.035f)*a;rect(x,y,w,t,new Color(.35f,.22f,.12f,1),al);rect(x,y+h-t,w,t,new Color(.35f,.22f,.12f,1),al);rect(x,y,t,h,new Color(.35f,.22f,.12f,1),al);rect(x+w-t,y,t,h,new Color(.35f,.22f,.12f,1),al);}
        // ragged bottom edge
        for(float px=x;px<x+w;px+=6)rect(px,y-r.nextFloat()*4,6,4,PAPER,a);
    }
    void frame(float x,float y,float w,float h,Color c,float a,float t){rect(x,y,w,t,c,a);rect(x,y+h-t,w,t,c,a);rect(x,y,t,h,c,a);rect(x+w-t,y,t,h,c,a);}

    // ---------------------------------------------------------------- text
    float width(BitmapFont f,String s,float scale){scale=Math.max(scale,.01f);f.getData().setScale(scale);gl.setText(f,s);f.getData().setScale(1);return gl.width;}
    void text(BitmapFont f,String s,float cx,float y,float scale,Color c,float a,float maxW){
        if(a<=0||s==null||s.isEmpty()||scale<=.01f)return;float w=width(f,s,scale);if(maxW>0&&w>maxW)scale*=maxW/w;
        f.getData().setScale(scale);gl.setText(f,s);float x=cx-gl.width/2;float o=Math.max(2,f.getLineHeight()*scale*.045f);
        f.setColor(.05f,.0f,.14f,.9f*a);f.draw(batch,s,x+o*.6f,y-o*1.4f);f.setColor(c.r,c.g,c.b,a);f.draw(batch,s,x,y);f.getData().setScale(1);
    }
    void left(BitmapFont f,String s,float x,float y,float scale,Color c,float a,float maxW){
        if(a<=0||s==null||s.isEmpty()||scale<=.01f)return;float w=width(f,s,scale);if(maxW>0&&w>maxW)scale*=maxW/w;
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
    private static Texture rounded(boolean edgeOnly){int n=128,r=40;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=Math.max(0,Math.max(r-x-.5f,x+.5f-(n-r))),dy=Math.max(0,Math.max(r-y-.5f,y+.5f-(n-r)));float d=(float)Math.hypot(dx,dy)-(r-1);
            float inside=MathUtils.clamp(.5f-d,0,1);float a=edgeOnly?inside*MathUtils.clamp(1-Math.abs(d+3f)/2.6f,0,1):inside;p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    private static Texture beam(){int w=64,h=256;Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<h;y++){float f=y/(float)(h-1),half=.10f+.90f*f;for(int x=0;x<w;x++){float u=Math.abs((x+.5f)/w-.5f)*2/half;float a=u>=1?0:(1-u*u)*(1-f)*(.4f+.6f*(1-f));p.drawPixel(x,h-1-y,Color.rgba8888(1,1,1,a));}}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    private static Texture dots(){int n=24;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float d=(float)Math.hypot(x-c,y-c);p.drawPixel(x,y,Color.rgba8888(1,1,1,MathUtils.clamp(3.2f-d,0,1)));}
        Texture t=new Texture(p);t.setWrap(Texture.TextureWrap.Repeat,Texture.TextureWrap.Repeat);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
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

    @Override public void dispose(){round.dispose();roundEdge.dispose();beam.dispose();dots.dispose();pixel.dispose();soft.dispose();ring.dispose();car.dispose();carGlass.dispose();noise.dispose();if(background!=null)background.dispose();for(Texture t:new Texture[]{panelTex,logo,plate,rules,dungeon,cage,chain,hook,flame})if(t!=null)t.dispose();for(Texture t:badges)if(t!=null)t.dispose();hand.dispose();
        horror.dispose();display.dispose();big.dispose();mid.dispose();small.dispose();tiny.dispose();cond.dispose();inter.dispose();
        for(Texture t:faces.values())if(t!=null)t.dispose();for(Sound s:sounds.values())if(s!=null)s.dispose();}
}
