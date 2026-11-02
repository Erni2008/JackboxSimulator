package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.*;
import java.util.EnumMap;

/**
 * GL-thread owner of every card texture: one shared back and one composed front per {@link CardValue}.
 * Finished per-value art (card_3/5/10/death.png) is used as-is; otherwise the value is printed into the blank parchment once at load
 * (no decal quads, so no z-fighting).
 * Missing source art is replaced by procedural placeholders and reported through {@link #missing}.
 */
public final class CardFaces implements Disposable {
    public static final String BACK_FILE="cursed_cards/cards/card_back.jpg",FRONT_FILE="cursed_cards/cards/card_front_blank.jpg";
    static final int W=512,H=716;
    public final Texture back;
    private final Texture blank;
    private final EnumMap<CardValue,Texture> fronts=new EnumMap<>(CardValue.class);
    public final Array<String> missing=new Array<>();

    private final int maxHeight;
    public CardFaces(){this(Integer.MAX_VALUE);}
    /** @param maxHeight art taller than this is downsampled once at load (weak devices). */
    public CardFaces(int maxHeight){
        this.maxHeight=maxHeight;back=load(BACK_FILE,true);blank=load(FRONT_FILE,false);
        var generator=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/BebasNeue-Regular.ttf"));
        var horror=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/Creepster-Regular.ttf"));
        BitmapFont big=font(generator,280,"0123456789"),small=font(generator,74,"0123456789"),death=font(horror,150,"DEATH"),deathSmall=font(horror,44,"DEATH");
        generator.dispose();horror.dispose();
        var fbo=new FrameBuffer(Pixmap.Format.RGBA8888,W,H,false);var batch=new SpriteBatch();
        try{for(CardValue value:CardValue.values()){FileHandle art=art(faceFile(value));
            fronts.put(value,art.exists()?loadArt(art):compose(fbo,batch,value,value==CardValue.DEATH?death:big,value==CardValue.DEATH?deathSmall:small));}}
        finally{fbo.dispose();batch.dispose();big.dispose();small.dispose();death.dispose();deathSmall.dispose();}
    }
    public Texture front(CardValue value){return fronts.get(value);}
    /** Optional finished face art per value (e.g. card_10.png, card_death.png); used as-is instead of printing on the blank. */
    public static String faceFile(CardValue value){return "cursed_cards/cards/card_"+value.label.toLowerCase(java.util.Locale.ROOT)+".jpg";}
    private Texture loadArt(FileHandle file){Pixmap p=fit(new Pixmap(file));try{return texture(p);}finally{p.dispose();}}
    private Pixmap fit(Pixmap p){
        if(p.getHeight()<=maxHeight)return p;
        int h=maxHeight,w=Math.round(p.getWidth()*(h/(float)p.getHeight()));Pixmap out=new Pixmap(w,h,Pixmap.Format.RGBA8888);
        out.setFilter(Pixmap.Filter.BiLinear);out.setBlending(Pixmap.Blending.None);out.drawPixmap(p,0,0,p.getWidth(),p.getHeight(),0,0,w,h);p.dispose();return out;}
    public boolean placeholders(){return missing.notEmpty();}

    /** Art may ship as .jpg (default, small) or .png. */
    static FileHandle art(String path){FileHandle f=Gdx.files.internal(path);if(f.exists())return f;FileHandle png=Gdx.files.internal(path.replace(".jpg",".png"));return png.exists()?png:f;}
    private Texture load(String path,boolean isBack){
        FileHandle file=art(path);Pixmap pixmap;
        if(file.exists())pixmap=fit(new Pixmap(file));else{missing.add(path);pixmap=isBack?placeholderBack():placeholderFront();}
        try{return texture(pixmap);}finally{pixmap.dispose();}
    }
    private static Texture texture(Pixmap pixmap){
        var t=new Texture(pixmap,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);t.setAnisotropicFilter(8f);
        t.setWrap(Texture.TextureWrap.ClampToEdge,Texture.TextureWrap.ClampToEdge);return t;}
    private static BitmapFont font(FreeTypeFontGenerator generator,int size,String chars){
        var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=size;p.characters=chars;p.minFilter=p.magFilter=Texture.TextureFilter.Linear;p.kerning=true;return generator.generateFont(p);}

    private Texture compose(FrameBuffer fbo,SpriteBatch batch,CardValue value,BitmapFont font,BitmapFont corner){
        fbo.begin();
        try{
            Gdx.gl.glClearColor(0,0,0,0);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
            batch.getProjectionMatrix().setToOrtho2D(0,0,W,H);batch.getTransformMatrix().idt();batch.begin();batch.disableBlending();batch.draw(blank,0,0,W,H,0,0,1,1);batch.enableBlending();
            boolean doom=value==CardValue.DEATH;Color ink=doom?new Color(.48f,.04f,.05f,1):new Color(.20f,.11f,.06f,1);
            var layout=new GlyphLayout(font,value.label);
            font.setColor(ink.r,ink.g,ink.b,.22f);font.draw(batch,value.label,(W-layout.width)*.5f+4,(H+layout.height)*.5f-5);
            font.setColor(ink);font.draw(batch,value.label,(W-layout.width)*.5f,(H+layout.height)*.5f);
            corner.setColor(ink);
            corner.draw(batch,value.label,58,H-52);
            batch.setTransformMatrix(new Matrix4().translate(W,H,0).rotate(Vector3.Z,180));corner.draw(batch,value.label,58,H-52);
            batch.end();batch.getTransformMatrix().idt();
            Pixmap read=Pixmap.createFromFrameBuffer(0,0,W,H),flipped=new Pixmap(W,H,Pixmap.Format.RGBA8888);
            try{flipped.setBlending(Pixmap.Blending.None);for(int y=0;y<H;y++)flipped.drawPixmap(read,0,y,W,1,0,H-1-y,W,1);return texture(flipped);}
            finally{read.dispose();flipped.dispose();}
        }finally{fbo.end();}
    }

    // ---- Procedural placeholders: clearly temporary until the authored PNGs exist. ----
    private static float noise(int x,int y){int n=x*374761393+y*668265263;n=(n^(n>>>13))*1274126177;return ((n^(n>>>16))&0xffff)/65535f;}
    private static float smooth(float x,float y,float scale){
        float fx=x/scale,fy=y/scale;int ix=MathUtils.floor(fx),iy=MathUtils.floor(fy);float tx=fx-ix,ty=fy-iy;tx=tx*tx*(3-2*tx);ty=ty*ty*(3-2*ty);
        return MathUtils.lerp(MathUtils.lerp(noise(ix,iy),noise(ix+1,iy),tx),MathUtils.lerp(noise(ix,iy+1),noise(ix+1,iy+1),tx),ty);}
    static Pixmap placeholderBack(){
        Pixmap p=new Pixmap(W,H,Pixmap.Format.RGBA8888);
        for(int y=0;y<H;y++)for(int x=0;x<W;x++){
            float lattice=Math.abs(((x+y)%46)-23)<1.2f||Math.abs(((x-y+2000)%46)-23)<1.2f?.75f:1f;
            float dx=(x-W*.5f)/(W*.5f),dy=(y-H*.5f)/(H*.5f),vig=1-.38f*(dx*dx+dy*dy),grain=.88f+.2f*smooth(x,y,9)+.05f*noise(x,y);
            float k=Math.min(1.5f,lattice*vig*grain);p.drawPixel(x,y,Color.rgba8888(.36f*k,.05f*k,.08f*k,1));}
        Color gold=new Color(.78f,.58f,.27f,1),dark=new Color(.22f,.03f,.05f,1);
        frame(p,gold,18,7);frame(p,gold,34,2);
        for(int[] c:new int[][]{{40,40},{W-41,40},{40,H-41},{W-41,H-41}}){p.setColor(gold);diamond(p,c[0],c[1],16);p.setColor(dark);diamond(p,c[0],c[1],8);}
        p.setColor(gold);p.fillCircle(W/2,H/2,150);p.setColor(.30f,.04f,.07f,1);p.fillCircle(W/2,H/2,143);p.setColor(gold);p.drawCircle(W/2,H/2,132);
        spade(p,W/2,H/2+8,124,gold);spade(p,W/2,H/2+8,108,dark);spade(p,W/2,H/2+8,58,gold);
        return p;
    }
    static Pixmap placeholderFront(){
        Pixmap p=new Pixmap(W,H,Pixmap.Format.RGBA8888);
        for(int y=0;y<H;y++)for(int x=0;x<W;x++){
            float dx=(x-W*.5f)/(W*.5f),dy=(y-H*.5f)/(H*.5f),edge=Math.max(Math.abs(dx),Math.abs(dy)),age=MathUtils.clamp((edge-.72f)*2.4f,0,1);
            float fibre=.9f+.12f*smooth(x,y,24)+.06f*smooth(x*3,y,5)+.03f*noise(x,y),stain=smooth(x+900,y,70)>.78f?.9f:1;
            float k=Math.min(1.07f,fibre*stain*(1-.32f*age*age));p.drawPixel(x,y,Color.rgba8888(.93f*k,.85f*k,.68f*k,1));}
        Color ink=new Color(.40f,.24f,.12f,1);frame(p,ink,22,4);frame(p,ink,32,1);
        for(int[] c:new int[][]{{W/2,32},{W/2,H-33}}){p.setColor(ink);diamond(p,c[0],c[1],10);}
        return p;
    }
    private static void frame(Pixmap p,Color c,int inset,int width){p.setColor(c);for(int i=0;i<width;i++)p.drawRectangle(inset+i,inset+i,W-2*(inset+i),H-2*(inset+i));}
    private static void diamond(Pixmap p,int x,int y,int r){p.fillTriangle(x-r,y,x+r,y,x,y-r);p.fillTriangle(x-r,y,x+r,y,x,y+r);}
    /** Spade centred at (x,y), size = overall height; pixmap y grows downward. */
    private static void spade(Pixmap p,int x,int y,int size,Color c){
        p.setColor(c);int r=(int)(size*.27f),lobeY=y+(int)(size*.06f);
        p.fillCircle(x-(int)(r*.92f),lobeY,r);p.fillCircle(x+(int)(r*.92f),lobeY,r);
        p.fillTriangle(x-(int)(r*1.86f),lobeY-(int)(r*.2f),x+(int)(r*1.86f),lobeY-(int)(r*.2f),x,y-size/2);
        p.fillTriangle(x,lobeY,x-(int)(size*.2f),y+size/2,x+(int)(size*.2f),y+size/2);
    }
    @Override public void dispose(){back.dispose();blank.dispose();for(Texture t:fronts.values())t.dispose();fronts.clear();}
}
