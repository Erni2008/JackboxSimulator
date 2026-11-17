package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.GlyphLayout;
import com.badlogic.gdx.graphics.g2d.PolygonSpriteBatch;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.Disposable;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.deaths.DeathPost;
import com.erni.finalanswer.ui.UiFonts;
import java.util.HashMap;
import java.util.Map;

/**
 * CURSED BOXES rules film for the host screen: seven voiced scenes on a spot-lit stage using the mode's crates, ghost,
 * survivors, muzzle flash and splinters, with typed subtitles, cross-dissolves, a cinematic post pass and a SKIP button.
 */
public final class CursedBoxesRulesFilm implements Disposable {
    public static final float W=1920,H=1080;
    private static final float[] START={0,5.4f,12.8f,19f,25f,30.6f,37.2f},END={5.4f,12.8f,19f,25f,30.6f,37.2f,41.6f};
    public static final float LENGTH=41.6f;
    private static final String[] TAB={"","ВОПРОС","ПРЯТКИ","ВЫСТРЕЛ","ПОПАДАНИЕ","ВЫЖИВШИЕ",""};
    private static final String[] SUB={
        "Добро пожаловать в проклятые коробки! Здесь ошибка стоит жизни.",
        "Сначала вопрос! Ответил правильно, получаешь дробовик. Ошибся, придётся прятаться.",
        "Те, кто ошибся, тайно выбирают одну из шестнадцати коробок и прячутся внутри!",
        "У каждого стрелка только один выстрел! Выбирай коробку и стреляй!",
        "Попал в коробку с игроком? Он выбывает и становится призраком!",
        "Пустая коробка, это промах. А кто уцелел, тот выжил и играет дальше!",
        "Ну что, готовы? Прячьтесь получше!"};
    private static final Color BLOOD=new Color(.9f,.16f,.08f,1),GOLD=new Color(1f,.74f,.32f,1),INK=new Color(.24f,.12f,.06f,1),
        BONE=new Color(.96f,.92f,.84f,1),DARK=new Color(.03f,.015f,.015f,1),EMBER=new Color(1,.42f,.18f,1);
    private static final String[] WHO={"skeleton","dracula","pumpkin","voodoo","ghost"};
    private static final int IMP=1,HIDE_A=5,HIDE_B=10,MISS=2;

    private final SpriteBatch batch=new SpriteBatch();private final ShapeRenderer shapes=new ShapeRenderer();
    private final PolygonSpriteBatch postBatch=new PolygonSpriteBatch();private final DeathPost post=new DeathPost();
    private final FitViewport viewport=new FitViewport(W,H);private final GlyphLayout gl=new GlyphLayout();
    private final Texture eye=com.erni.finalanswer.systembreach.host.SystemBreachRulesFilm.buttonEye();private final Texture crate,broken,ghost,survivor,flash,debris,glow,pixel;private final Map<String,Texture> portraits=new HashMap<>();
    private final BitmapFont title,heading,hand,sub,small;
    private final Sound[] voice=new Sound[7];private Sound whoosh,paper,thud;private int voiced=-1;
    private final Matrix4 xf=new Matrix4();private final Vector2 tmp=new Vector2();
    private float time,skipAt=-1,tabPos=1;private boolean hover,stampPlayed,shotA,shotB;private int pass;

    public CursedBoxesRulesFilm(){
        crate=tex("cursed_boxes/phone/crate-intact.png");broken=tex("cursed_boxes/phone/crate-destroyed.png");ghost=tex("cursed_boxes/ghost_hit.png");survivor=tex("cursed_boxes/survivors/pumpkin.png");flash=tex("cursed_boxes/effects/muzzle_flash.png");debris=tex("cursed_boxes/debris_a.png");
        Pixmap g=new Pixmap(128,128,Pixmap.Format.RGBA8888);for(int y=0;y<128;y++)for(int x=0;x<128;x++){float d=Math.min(1,(float)Math.hypot(x-63.5,y-63.5)/63.5f);float v=(1-d)*(1-d);g.drawPixel(x,y,Color.rgba8888(1,1,1,v));}
        glow=new Texture(g);glow.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);g.dispose();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        title=UiFonts.gothic(132);heading=UiFonts.gothic(78);hand=UiFonts.handwriting(66);sub=font("NotoSans-SemiCondensedSemiBold.ttf",36);small=font("NotoSans-SemiCondensedSemiBold.ttf",22);
        if(Gdx.audio!=null)try{for(int i=0;i<voice.length;i++){var f=Gdx.files.internal("cursed_boxes/rules/rules_"+i+".wav");if(f.exists())voice[i]=Gdx.audio.newSound(f);}
            whoosh=snd("system_breach/sfx/whoosh.wav");paper=null;thud=snd("system_breach/sfx/strike.wav");}catch(RuntimeException ignored){}
    }
    private static Texture tex(String path){Texture t=new Texture(Gdx.files.internal(path),true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;}
    private static Sound snd(String path){var f=Gdx.files.internal(path);return f.exists()?Gdx.audio.newSound(f):null;}
    private static BitmapFont font(String file,int size){
        var gen=new FreeTypeFontGenerator(Gdx.files.internal("ui/fonts/"+file));
        try{var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=size;p.kerning=true;StringBuilder c=new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);
            for(char ch='Ѐ';ch<='ӿ';ch++)c.append(ch);p.characters=c.append("–—…·×№«»").toString();p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;return gen.generateFont(p);}
        finally{gen.dispose();}
    }
    private Texture portrait(String id){return portraits.computeIfAbsent(id,k->{var f=Gdx.files.internal("forgotten_room/portraits/"+k+".png");return f.exists()?tex("forgotten_room/portraits/"+k+".png"):null;});}

    public void resize(int w,int h){viewport.update(w,h,true);}
    public boolean done(){return time>=LENGTH||(skipAt>=0&&time-skipAt>=.45f);}
    public void skip(){if(skipAt<0)skipAt=time;}
    public void seek(float t){time=t;skipAt=-1;voiced=-1;stampPlayed=false;shotA=t>START[3]+2.6f;shotB=t>START[4]+.6f;for(var v:voice)if(v!=null)v.stop();}

    public void render(float dt){
        time=Math.min(LENGTH,time+Math.min(dt,.1f));input();audio();
        post.begin();Gdx.gl.glViewport(0,0,DeathPost.SW,DeathPost.SH);ScreenUtils.clear(DARK);frame();post.end();
        ScreenUtils.clear(0,0,0,1);viewport.apply();
        float cut=99;for(int i=1;i<START.length;i++)cut=Math.min(cut,Math.abs(time-START[i]));
        float slam=Math.min(Math.abs(time-(START[3]+2.6f)),Math.abs(time-(START[4]+.6f)));slam=time>=START[3]+2.6f&&time<START[3]+3.2f?time-(START[3]+2.6f):time>=START[4]+.6f&&time<START[4]+1.2f?time-(START[4]+.6f):-1;
        post.time=time;post.cx=.5f;post.cy=.55f;post.desat=0;post.aberration=.06f+(cut<.35f?.35f*(1-cut/.35f):0)+(slam>=0&&slam<.25f?.4f*(1-slam/.25f):0);
        if(slam>=0&&slam<.6f){post.shock=slam*1.1f;post.shockStrength=.35f*(1-slam/.6f);}else post.shock=-1;
        post.present(postBatch);
    }
    private void frame(){
        var cam=viewport.getCamera();cam.update();shapes.setProjectionMatrix(cam.combined);batch.setProjectionMatrix(cam.combined);
        int s=scene();float lt=time-START[s];
        stage(s,lt);
        for(int i=Math.max(0,s-1);i<=Math.min(START.length-1,s+1);i++){float v=vis(i);if(v<=0)continue;float t=time-START[i],len=END[i]-START[i];
            float enter=1-k(time,START[i]-.1f,START[i]+.6f),leave=k(time,END[i]-.45f,END[i]);float sc=1+.025f*k(t,0,len)+.05f*ease(enter)-.04f*ease(leave);
            xf.idt().translate(W/2,H/2,0).scale(sc,sc,1).translate(-W/2,-H/2,0);shapes.setTransformMatrix(xf);batch.setTransformMatrix(xf);
            blendOn();shapes.begin(ShapeRenderer.ShapeType.Filled);pass=0;scene(i,t,v);shapes.end();
            batch.begin();pass=1;scene(i,t,v);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);pass=2;scene(i,t,v);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.end();}
        xf.idt();shapes.setTransformMatrix(xf);batch.setTransformMatrix(xf);
        blendOn();shapes.begin(ShapeRenderer.ShapeType.Filled);vignette();chromeShapes(s);shapes.end();
        batch.begin();chromeText(s,lt);batch.end();
    }
    /** Empty black stage: a hard spotlight cone with haze, a pool of light on the floor, drifting smoke and dust. */
    private float spotX=W/2;
    private void stage(int s,float lt){
        float target=W/2;spotX+=(target-spotX)*Math.min(1,Gdx.graphics.getDeltaTime()*1.5f);
        float flick=.92f+.08f*MathUtils.sin(time*11)*MathUtils.sin(time*2.7f);
        blendOn();shapes.begin(ShapeRenderer.ShapeType.Filled);
        Color top=new Color(.05f,.012f,.014f,1),bot=new Color(.012f,.004f,.006f,1);shapes.rect(0,0,W,H,bot,bot,top,top);
        // floor plane with faint boards receding
        Color f0=new Color(.10f,.03f,.03f,1),f1=new Color(.02f,.006f,.008f,1);shapes.rect(0,0,W,330,f0,f0,f1,f1);
        for(int i=-12;i<=12;i++){shapes.setColor(.2f,.06f,.05f,.10f);shapes.rectLine(W/2+i*40,330,W/2+i*190,0,1.2f);}
        // spotlight cone (two layers) from above
        float sx=spotX,cw=420;Color c0=new Color(1,.86f,.7f,.0f),c1=new Color(1,.82f,.65f,.10f*flick);
        shapes.triangle(sx-30,H+40,sx+30,H+40,sx+cw,150,c1,c1,c0);shapes.triangle(sx-30,H+40,sx-cw,150,sx+cw,150,c1,c0,c0);
        Color d1=new Color(1,.85f,.7f,.07f*flick);shapes.triangle(sx-14,H+40,sx+14,H+40,sx+cw*.55f,150,d1,d1,c0);shapes.triangle(sx-14,H+40,sx-cw*.55f,150,sx+cw*.55f,150,d1,c0,c0);
        shapes.end();
        batch.begin();batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        glowAt(sx,190,1000,new Color(1,.8f,.6f,1),.22f*flick);
        b(1,.8f,.6f,.16f*flick);batch.draw(glow,sx-520,120,1040,150);b(1,1,1,1);
        // red rim lights at the wings
        glowAt(-60,520,900,BLOOD,.18f);glowAt(W+60,520,900,BLOOD,.18f);
        // slow smoke bands
        for(int i=0;i<7;i++){float h1=hash(i*5+1),y=180+h1*620,x=((time*(14+10*h1)+hash(i)*W*2)%(W+1400))-700;b(.75f,.55f,.5f,.06f);batch.draw(glow,x,y-110,1400,220);}
        // dust in the beam
        for(int i=0;i<46;i++){float h1=hash(i),h2=hash(i*3+7);float y=(h2*H+time*(8+14*h1))%H;float spread=(H-y)/H*cw;float x=sx+(h1-.5f)*2*spread+MathUtils.sin(time*.5f+i)*12;
            glowAt(x,y,4+6*h2,new Color(1,.85f,.7f,1),.5f*(.4f+.6f*MathUtils.sin(time*1.7f+i*1.3f)));}
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.end();
    }
    private int scene(){for(int i=START.length-1;i>=0;i--)if(time>=START[i])return i;return 0;}
    private float vis(int i){float in=i==0?1:ease(k(time,START[i]-.05f,START[i]+.5f)),out=i==START.length-1?1:1-ease(k(time,END[i]-.45f,END[i]));return in*out;}
    private void scene(int s,float t,float a){switch(s){case 0->titleScene(t,a);case 1->roles(t,a);case 2->clues(t,a);case 3->suspicion(t,a);case 4->vote(t,a);case 5->result(t,a);default->finale(t,a);}}

    // ---------- scenes ----------
    /** Portrait medallion: drop shadow, dark velvet disc, the character, a fine gold ring and a red rim light. */
    private void framed(String id,float x,float y,float w,float a,Color tint,float tintK){
        if(a<=0||pass!=1)return;float r=w*.42f;Texture p=portrait(id);
        b(0,0,0,.55f*a);batch.draw(glow,x-r*1.5f+10,y-r*1.5f-16,r*3,r*3);
        if(p!=null){float pw=r*2.1f;b(1-.2f*tintK,1-.65f*tintK,1-.65f*tintK,a);batch.draw(p,x-pw/2,y-pw/2,pw,pw);}
        if(id.equals("voodoo")&&p!=null){float pw=r*2.1f,er=pw*.085f,px0=x-pw/2,top=y+pw/2;float blink=MathUtils.sin(time*2.3f)>.985f?.25f:1;
            for(float[] e:new float[][]{{.317f,.493f},{.78f,.60f}}){float ex=px0+e[0]*pw,ey=top-e[1]*pw;b(1,1,1,a);batch.draw(eye,ex-er,ey-er*blink,er*2,er*2*blink);}}
        b(1,1,1,1);ring(x,y,r*1.02f,a);
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);glowAt(x+r*.5f,y+r*.6f,r*2.2f,BLOOD,.18f*a+.35f*a*tintK);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    private Texture ringTex;
    /** Thin antique-gold ring, baked once so it stays crisp inside the sprite pass. */
    private void ring(float x,float y,float r,float a){
        if(ringTex==null){int n=256;Pixmap pm=new Pixmap(n,n,Pixmap.Format.RGBA8888);pm.setBlending(Pixmap.Blending.None);
            for(int yy=0;yy<n;yy++)for(int xx=0;xx<n;xx++){float d=(float)Math.hypot(xx-n/2f+.5f,yy-n/2f+.5f)/(n/2f);float ring=Math.max(0,1-Math.abs(d-.93f)/.035f),inner=Math.max(0,1-Math.abs(d-.86f)/.012f)*.6f,out=d>.9f&&d<1?Math.max(0,(d-.9f)/.1f)*(1-d)*4:0;
                float sh=.75f+.25f*(float)Math.sin(Math.atan2(yy-n/2f,xx-n/2f)*1+.8f);float al=Math.min(1,ring+inner);pm.drawPixel(xx,yy,Color.rgba8888(.95f*sh,.74f*sh,.42f*sh,al));}
            ringTex=new Texture(pm);ringTex.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);pm.dispose();}
        b(1,1,1,a);batch.draw(ringTex,x-r,y-r,r*2,r*2);b(1,1,1,1);
    }

    private void headingText(String txt,float t,float a,Color c){
        if(pass==1){float p=ease(k(t,.1f,.7f));text(heading,txt,W/2,H-118+(1-p)*16,c,a*p,1);}
        if(pass==2){float sw=k(t,.4f,1.4f);if(sw>0&&sw<1)glowAt(W/2-300+600*ease(sw),H-150,260,c,.5f*a*MathUtils.sin(sw*MathUtils.PI));}
        if(pass==0){float p=ease(k(t,.2f,.9f));Color c0=new Color(c.r,c.g,c.b,0),c1=new Color(c.r,c.g,c.b,.85f*a);shapes.rect(W/2-300*p,H-200,300*p,2,c0,c1,c1,c0);shapes.rect(W/2,H-200,300*p,2,c1,c0,c0,c1);}
    }
    private static final float CW=196,CH=CW*163/274f,GAP=20;
    private static float cellX(int i){return W/2+((i%4)-1.5f)*(CW+GAP);}
    private static float cellY(int i){return 500+(1.5f-(i/4))*(CH+GAP);}
    /** The 4×4 shelf of crates; destroyed ones show the broken crate. */
    private void grid(float a,boolean[] gone,float in,int glowCell,float glowK){
        for(int i=0;i<16;i++){float d=ease(k(in,.03f*i,.35f+.03f*i));if(d<=0)continue;float x=cellX(i),y=cellY(i)-(1-d)*40;
            if(pass==1){b(0,0,0,.5f*a*d);batch.draw(crate,x-CW/2+8,y-CH/2-10,CW,CH);b(1,1,1,a*d);batch.draw(gone!=null&&gone[i]?broken:crate,x-CW/2,y-CH/2,CW,CH);b(1,1,1,1);
                text(small,String.format("%02d",i+1),x-CW/2+22,y+CH/2-8,BONE,.55f*a*d,.8f,false);}
            if(pass==2&&i==glowCell&&glowK>0)glowAt(x,y,360,BLOOD,.45f*a*glowK);}
    }
    private void crosshair(float x,float y,float a,float lock){
        if(pass!=0||a<=0)return;float r=58+(1-lock)*22;Color c=lock>.95f?BLOOD:GOLD;col(c,.9f*a);
        for(int q=0;q<4;q++){float ang=q*MathUtils.HALF_PI+time*(1-lock)*2;float cx=MathUtils.cos(ang),sy=MathUtils.sin(ang);shapes.rectLine(x+cx*r*.55f,y+sy*r*.55f,x+cx*r,y+sy*r,3);}
        for(int q=0;q<48;q++){float a0=q/48f*MathUtils.PI2,a1=(q+1)/48f*MathUtils.PI2;if(q%6==5)continue;shapes.rectLine(x+MathUtils.cos(a0)*r*.8f,y+MathUtils.sin(a0)*r*.8f,x+MathUtils.cos(a1)*r*.8f,y+MathUtils.sin(a1)*r*.8f,2);}
        shapes.circle(x,y,3.5f,12);
    }
    private void blast(float x,float y,float f,float a){
        if(f<=0||f>=1)return;
        if(pass==1){float s=1-f;b(1,1,1,a*s);batch.draw(debris,x-130*(1+f),y-85*(1+f),260*(1+f),170*(1+f));b(1,1,1,1);}
        if(pass==2){glowAt(x,y,700*(1-f*.5f),EMBER,.9f*a*(1-f));b(1,1,1,a*(1-f)*.9f);batch.draw(flash,x-210,y-70,420,280);b(1,1,1,1);}
    }
    private void titleScene(float t,float a){
        float p=ease(k(t,.2f,1.2f));float bob=MathUtils.sin(time*1.6f)*6;
        if(pass==1){float w=520*(.9f+.1f*p);b(0,0,0,.5f*a*p);batch.draw(crate,W/2-w/2+16,H/2-170-w*163/274/2-20+bob,w,w*163/274);b(1,1,1,a*p);batch.draw(crate,W/2-w/2,H/2-170-w*163/274/2+bob,w,w*163/274);b(1,1,1,1);
            float q=ease(k(t,.6f,1.5f));text(title,"CURSED BOXES",W/2,H/2+250+(1-q)*30,GOLD,a*q,1);
            float r=ease(k(t,1.3f,2.1f));text(heading,"ПРОКЛЯТЫЕ КОРОБКИ",W/2,H/2+120,BLOOD,a*r,.8f+.06f*(1-r));}
        if(pass==2){glowAt(W/2,H/2-170,900,BLOOD,.25f*a*p*(.8f+.2f*MathUtils.sin(time*3)));glowAt(W/2,H/2+230,800,GOLD,.12f*a*p);}
    }
    private void roles(float t,float a){
        headingText("ВОПРОС",t,a,GOLD);
        float qa=ease(k(t,.2f,.7f));if(pass==0)panel(W/2-420,640,840,190,GOLD,a*qa);
        if(pass==1){text(sub,"Сколько ног у паука?",W/2,790,BONE,a*qa,1.1f);String[] o={"6","8","10","12"};
            for(int i=0;i<4;i++){float x=W/2-300+i*200;boolean right=i==1;float lit=right?k(t,2.2f,2.5f):0;text(heading,o[i],x,720,lit>0?new Color(.45f,1,.55f,1):BONE,a*qa*(1-.5f*k(t,2.2f,2.5f)*(right?0:1)),.7f);}}
        float l=ease(k(t,1.6f,2.2f)),r=ease(k(t,3.4f,4f));
        framed(WHO[0],W/2-420,380,200,a*l,GOLD,0);framed(WHO[IMP],W/2+420,380,200,a*r,BLOOD,0);
        if(pass==1){text(small,"ОТВЕТИЛ ВЕРНО",W/2-420,250,new Color(.45f,1,.55f,1),a*l,1.1f);text(heading,"СТРЕЛОК",W/2-420,215,GOLD,a*l,.62f);
            text(small,"ОШИБСЯ",W/2+420,250,BLOOD,a*r,1.1f);text(heading,"ПРЯЧЕТСЯ",W/2+420,215,BLOOD,a*r,.62f);}
        crosshair(W/2-420,380,a*l*k(t,2,2.4f),1);
    }
    private void clues(float t,float a){
        headingText("ПРЯТКИ",t,a,BLOOD);
        grid(a,null,t,-1,0);
        // two hiders slip into their boxes; the crate shakes as the lid closes
        int[] hid={HIDE_A,HIDE_B};String[] who={WHO[IMP],WHO[2]};
        for(int h=0;h<2;h++){float st=1.4f+h*1.4f,f=k(t,st,st+.9f);float tx=cellX(hid[h]),ty=cellY(hid[h]);float sx=h==0?W/2+700:W/2-700,sy=300;
            if(f>0&&f<1){float x=MathUtils.lerp(sx,tx,ease(f)),y=MathUtils.lerp(sy,ty,ease(f))+MathUtils.sin(f*MathUtils.PI)*120;framed(who[h],x,y,150*(1-.6f*ease(f)),a*(1-k(f,.8f,1)),BLOOD,0);}
            if(pass==2&&f>=1&&t<st+1.6f)glowAt(tx,ty,300,GOLD,.4f*a*(1-(t-st-.9f)/.7f));}
        if(pass==1){float q=k(t,4.6f,5.2f);text(sub,"Никто не видит, кто где спрятался",W/2,262,GOLD,a*q,.85f);}
    }
    private void suspicion(float t,float a){
        headingText("ВЫСТРЕЛ",t,a,GOLD);
        boolean[] gone=new boolean[16];if(t>=2.6f)gone[MISS]=true;
        grid(a,gone,1,-1,0);
        // crosshair sweeps the shelf, locks on a box and fires
        float sw=k(t,.6f,2.2f);float x=MathUtils.lerp(cellX(12),cellX(MISS),ease(sw))+MathUtils.sin(t*3)*(1-sw)*40,y=MathUtils.lerp(cellY(12),cellY(MISS),ease(sw));
        crosshair(x,y,a*(1-k(t,2.9f,3.2f)),k(t,2,2.4f));blast(cellX(MISS),cellY(MISS),k(t,2.6f,3.6f),a);
        if(pass==1){float m=k(t,3.2f,3.6f);text(heading,"ПРОМАХ",cellX(MISS),cellY(MISS)+CH/2+40,BONE,a*m,.6f);text(sub,"1 выстрел на стрелка",W/2,262,GOLD,a*k(t,.6f,1.1f),.85f);}
    }
    private void vote(float t,float a){
        headingText("ПОПАДАНИЕ",t,a,BLOOD);
        boolean[] gone=new boolean[16];gone[MISS]=true;if(t>=.6f)gone[HIDE_A]=true;
        grid(a,gone,1,HIDE_A,k(t,.6f,1.2f));float x=cellX(HIDE_A),y=cellY(HIDE_A);
        crosshair(x,y,a*(1-k(t,.5f,.7f)),1);blast(x,y,k(t,.6f,1.6f),a);
        float g=ease(k(t,1.1f,2.6f));
        if(g>0){float gy=y+30+g*170,gs=300;if(pass==1){b(.85f,.9f,1,a*g*(.75f+.25f*MathUtils.sin(time*4)));batch.draw(ghost,x-gs/2+MathUtils.sin(time*2)*14,gy-gs/2,gs,gs*1175/1338f);b(1,1,1,1);}
            if(pass==2)glowAt(x,gy,520,new Color(.6f,.75f,1,1),.35f*a*g);
            if(pass==1)text(heading,"ВЫБЫЛ",x+260,gy-40,BLOOD,a*k(t,1.8f,2.3f),.75f);}
    }
    private void result(float t,float a){
        headingText("ВЫЖИВШИЕ",t,a,GOLD);
        boolean[] gone=new boolean[16];gone[MISS]=true;gone[HIDE_A]=true;
        float open=ease(k(t,2.2f,3.2f));if(t>2.2f)gone[HIDE_B]=true;
        grid(a,gone,1,HIDE_B,open);
        if(pass==1){text(heading,"ПРОМАХ",cellX(MISS),cellY(MISS)+CH/2+40,BONE,a*k(t,.4f,.9f)*(1-k(t,2,2.4f)),.6f);}
        if(open>0){float x=cellX(HIDE_B),y=cellY(HIDE_B);float h=420*open,w=h*1024/1536f;
            if(pass==1){b(1,1,1,a*open);batch.draw(survivor,x-w/2,y-60,w,h);b(1,1,1,1);text(heading,"ВЫЖИЛ!",x,y-90,GOLD,a*k(t,3,3.4f),.8f);}
            if(pass==2)glowAt(x,y+120,700,GOLD,.35f*a*open);}
    }
    private void finale(float t,float a){
        float p=ease(k(t,1.1f,1.7f)),q=ease(k(t,.1f,.6f));
        for(int i=0;i<5;i++){float x=W/2+(i-2)*300,y=330+MathUtils.sin(time*1.4f+i)*8;if(pass==1){b(.55f,.5f,.48f,a*q*.8f);batch.draw(crate,x-110,y-65,220,130);b(1,1,1,1);}}
        crosshair(W/2+MathUtils.sin(time*1.3f)*300,330,a*q,.6f);
        if(pass==1){text(heading,"Ну что, готовы?",W/2,H/2+230,BONE,a*q*(1-p*.4f),.8f);text(title,"ПРЯЧЬТЕСЬ ПОЛУЧШЕ!",W/2,H/2+110,BLOOD,a*p,.6f*(1+.25f*(1-p)));}
        if(pass==2)glowAt(W/2,H/2+80,1200,BLOOD,.3f*a*p*(.85f+.15f*MathUtils.sin(time*4)));
    }

    // ---------- chrome ----------
    private void chromeShapes(int s){
        float a=ease(k(time,.2f,.9f))*(1-k(time,LENGTH-.6f,LENGTH));
        Color c0=new Color(0,0,0,0),c1=new Color(0,0,0,.72f*a);shapes.rect(W/2-820,40,820,110,c0,c1,c1,c0);shapes.rect(W/2,40,820,110,c1,c0,c0,c1);
        Color l0=new Color(GOLD.r,GOLD.g,GOLD.b,0),l1=new Color(GOLD.r,GOLD.g,GOLD.b,.7f*a);shapes.rect(W/2-820,148,820,1.5f,l0,l1,l1,l0);shapes.rect(W/2,148,820,1.5f,l1,l0,l0,l1);
        float ta=k(time,START[1]-.3f,START[1]+.3f)*(1-k(time,START[6]-.3f,START[6]+.3f));tabPos+=(MathUtils.clamp(s,1,5)-tabPos)*Math.min(1,Gdx.graphics.getDeltaTime()*7);
        for(int i=1;i<=5;i++){col(i<s?GOLD:new Color(.35f,.25f,.2f,1),.7f*ta);shapes.rect(tabX(i)-95,H-52,190,2);}col(BONE,ta);float mx=tabX(1)+(tabPos-1)*230;shapes.rect(mx-95,H-53,190,4);
        float bx=W-330,by=H-118,bw=290,bh=64;col(Color.BLACK,.55f);shapes.rect(bx,by,bw,bh);col(hover?BONE:GOLD,hover?1:.8f);shapes.rect(bx,by,bw,1.5f);shapes.rect(bx,by+bh-1.5f,bw,1.5f);shapes.rect(bx,by,1.5f,bh);shapes.rect(bx+bw-1.5f,by,1.5f,bh);
        float tx=bx+bw-46,ty=by+bh/2;shapes.triangle(tx-14,ty+12,tx-14,ty-12,tx+2,ty);shapes.triangle(tx+2,ty+12,tx+2,ty-12,tx+18,ty);
        // film timeline under the subtitle: scene ticks and a glowing playhead
        {float tl=W/2-560,tw=1120,ly=30,pa=a*.9f;col(new Color(.3f,.2f,.18f,1),.6f*pa);shapes.rect(tl,ly,tw,2);
         for(int i=1;i<START.length;i++){col(GOLD,.5f*pa);shapes.rect(tl+tw*START[i]/LENGTH-1,ly-3,2,8);}
         float ph=tw*time/LENGTH;Color g0=new Color(GOLD.r,GOLD.g,GOLD.b,.2f*pa),g1=new Color(GOLD.r,GOLD.g,GOLD.b,.95f*pa);shapes.rect(tl,ly,ph,2,g0,g1,g1,g0);col(BONE,pa);shapes.circle(tl+ph,ly+1,4,16);}
        if(skipAt>=0){col(Color.BLACK,k(time-skipAt,0,.45f));shapes.rect(0,0,W,H);}
        if(time>LENGTH-1){col(Color.BLACK,k(time,LENGTH-1,LENGTH));shapes.rect(0,0,W,H);}
    }
    private void chromeText(int s,float t){
        text(small,"ПРОПУСТИТЬ",W-330+122,H-118+42,hover?BONE:GOLD,1,1.05f);text(small,"ENTER / КЛИК",W-330+145,H-140,BONE,.45f,.8f);
        float ta=k(time,START[1]-.3f,START[1]+.3f)*(1-k(time,START[6]-.3f,START[6]+.3f));
        for(int i=1;i<=5;i++){Color c=i==s?BONE:i<s?GOLD:new Color(.55f,.45f,.4f,1);small.getData().setScale(.85f);gl.setText(small,TAB[i]);float lw=gl.width;small.getData().setScale(1);text(small,"0"+i,tabX(i)+14-lw/2-36,H-64,i==s?BLOOD:c,(i==s?1:.6f)*ta,.8f,false);text(small,TAB[i],tabX(i)+14,H-64,c,(i==s?1:.8f)*ta,.85f);}
        text(small,"CURSED BOXES  ·  ПРАВИЛА",60,H-30,GOLD,.7f,.85f,false);
        float len=END[s]-START[s];float a=ease(k(t,.15f,.5f))*(1-ease(k(t,len-.3f,len)))*(1-k(time,LENGTH-.6f,LENGTH));typeLine(SUB[s],t-.15f,a);
    }
    private static float tabX(int i){return W/2+(i-3)*230;}
    private void typeLine(String full,float tt,float a){
        if(a<=0||tt<=0)return;BitmapFont f=sub;f.getData().setScale(1);gl.setText(f,full,Color.WHITE,1560,Align.center,true);
        float ox=W/2-780,oy=95+gl.height/2+f.getData().ascent;int idx=0;float cx=-1,cy=0,ca=0;final float CPS=48,FADE=.22f;
        for(var run:gl.runs){float gx=ox+run.x,gy=oy+run.y;
            for(int j=0;j<run.glyphs.size;j++){var g=run.glyphs.get(j);gx+=run.xAdvances.get(j);float p=MathUtils.clamp((tt-idx/CPS)/FADE,0,1);idx++;if(p<=0)continue;
                float e=1-(1-p)*(1-p),rise=(1-e)*12,x0=gx+g.xoffset,y0=gy+g.yoffset-rise;
                if(g.width>0&&g.height>0){Texture tx=f.getRegions().get(g.page).getTexture();b(0,0,0,.55f*a*e);batch.draw(tx,x0+2,y0-2,g.width,g.height,g.u,g.v,g.u2,g.v2);
                    float wt=1-e;b(BONE.r+(GOLD.r-BONE.r)*wt,BONE.g+(GOLD.g-BONE.g)*wt,BONE.b+(GOLD.b-BONE.b)*wt,a*e);batch.draw(tx,x0,y0,g.width,g.height,g.u,g.v,g.u2,g.v2);}
                if(p<1){cx=gx+g.xoffset+g.width;cy=gy-f.getCapHeight()*1.05f;ca=1-p;}}}
        b(1,1,1,1);
        if(cx>0){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b(GOLD.r,GOLD.g,GOLD.b,.5f*a*ca);batch.draw(glow,cx-26,cy-26,52,52);b(GOLD.r,GOLD.g,GOLD.b,.9f*a*ca);batch.draw(pixel,cx+2,cy-16,3,32);b(1,1,1,1);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
    }
    private void vignette(){Color c0=new Color(0,0,0,0),c1=new Color(0,0,0,.8f);shapes.rect(0,0,W,260,c1,c1,c0,c0);shapes.rect(0,H-200,W,200,c0,c0,c1,c1);shapes.rect(0,0,280,H,c1,c0,c0,c1);shapes.rect(W-280,0,280,H,c0,c1,c1,c0);}
    private void input(){
        tmp.set(Gdx.input.getX(),Gdx.input.getY());viewport.unproject(tmp);hover=tmp.x>=W-330&&tmp.x<=W-40&&tmp.y>=H-118&&tmp.y<=H-54;
        var in=Gdx.input;if((in.justTouched()&&hover)||in.isKeyJustPressed(com.badlogic.gdx.Input.Keys.ENTER)||in.isKeyJustPressed(com.badlogic.gdx.Input.Keys.ESCAPE))skip();
    }
    private void audio(){
        if(skipAt>=0){for(var v:voice)if(v!=null)v.stop();return;}
        int s=scene();if(s!=voiced&&time-START[s]>=.2f){voiced=s;if(voice[s]!=null)voice[s].play(1);if(whoosh!=null&&s>0)whoosh.play(.15f);}
        if(!shotA&&time>=START[3]+2.6f&&time<START[3]+3){shotA=true;if(thud!=null)thud.play(.9f);}
        if(!shotB&&time>=START[4]+.6f&&time<START[4]+1){shotB=true;if(thud!=null)thud.play(.9f);}
    }

    // ---------- primitives ----------
    private void panel(float x,float y,float w,float h,Color c,float a){
        if(a<=0)return;Color z=new Color(0,0,0,0),sh=new Color(0,0,0,.45f*a);shapes.rect(x+8,y-14,w,14,z,z,sh,sh);
        Color top=new Color(.12f+c.r*.05f,.06f,.05f,.86f*a),bot=new Color(.04f,.015f,.015f,.92f*a);shapes.rect(x,y,w,h,bot,bot,top,top);
        Color in0=new Color(c.r,c.g,c.b,.14f*a),in1=new Color(c.r,c.g,c.b,0);shapes.rect(x,y+h-30,w,30,in1,in1,in0,in0);
        col(c,.6f*a);shapes.rect(x,y,w,1.5f);shapes.rect(x,y+h-1.5f,w,1.5f);shapes.rect(x,y,1.5f,h);shapes.rect(x+w-1.5f,y,1.5f,h);
        col(c,a);float k=24;shapes.rect(x-3,y+h-3,k,3);shapes.rect(x-3,y+h-k,3,k);shapes.rect(x+w-k+3,y,k,3);shapes.rect(x+w,y,3,k);
    }
    private void draw(Texture t,float cx,float cy,float size,float a,float rot){if(a<=0)return;b(1,1,1,a);batch.draw(new TextureRegion(t),cx-size/2,cy-size/2,size/2,size/2,size,size,1,1,rot);b(1,1,1,1);}
    private void glowAt(float x,float y,float s,Color c,float a){if(a<=0)return;b(c.r,c.g,c.b,Math.min(1,a));batch.draw(glow,x-s/2,y-s/2,s,s);b(1,1,1,1);}
    private void b(float r,float g,float bl,float a){batch.setColor(r,g,bl,Math.max(0,Math.min(1,a)));}
    private void col(Color c,float a){shapes.setColor(c.r,c.g,c.b,Math.max(0,Math.min(1,a)));}
    private static void blendOn(){Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
    private void text(BitmapFont f,String s,float cx,float y,Color c,float a,float sc){text(f,s,cx,y,c,a,sc,true);}
    private void text(BitmapFont f,String s,float x,float y,Color c,float a,float sc,boolean center){
        if(a<=0||sc<=0||s.isEmpty())return;f.getData().setScale(sc);gl.setText(f,s);float x0=center?x-gl.width/2:x;
        if(c.r+c.g+c.b>.9f){float o=Math.max(2,3*sc);f.setColor(0,0,0,.6f*Math.min(1,a));f.draw(batch,s,x0+o,y-o);}
        f.setColor(c.r,c.g,c.b,Math.min(1,a));f.draw(batch,s,x0,y);f.getData().setScale(1);f.setColor(Color.WHITE);
    }
    private static float hash(int i){int h=i*374761393+668265263;h=(h^(h>>>13))*1274126177;return ((h^(h>>>16))&0xffffff)/(float)0x1000000;}
    private static float k(float t,float a,float b){return MathUtils.clamp((t-a)/(b-a),0,1);}
    private static float ease(float x){return x*x*(3-2*x);}
    @Override public void dispose(){
        for(var v:voice)if(v!=null)v.dispose();for(Sound s:new Sound[]{whoosh,paper,thud})if(s!=null)s.dispose();
        for(Texture t:new Texture[]{eye,crate,broken,ghost,survivor,flash,debris,glow,pixel})t.dispose();for(Texture t:portraits.values())if(t!=null)t.dispose();if(ringTex!=null)ringTex.dispose();
        for(BitmapFont f:new BitmapFont[]{title,heading,hand,sub,small})f.dispose();batch.dispose();shapes.dispose();postBatch.dispose();post.dispose();
    }
}
