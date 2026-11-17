package com.erni.finalanswer.finalsecond;

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
 * THE FINAL SECOND rules film for the host screen: seven voiced scenes on a spot-lit stage with the mode's red button,
 * a seven-segment readout, the task variants and the results board; typed subtitles, cross-dissolves, SKIP.
 */
public final class FinalSecondRulesFilm implements Disposable {
    public static final float W=1920,H=1080;
    private static final float[] START={0,6.2f,11.6f,17.6f,23.2f,28.2f},END={6.2f,11.6f,17.6f,23.2f,28.2f,33.2f};
    public static final float LENGTH=33.2f;
    private static final String[] TAB={"","ЦЕЛЬ","КНОПКА","ИСПЫТАНИЯ","ИТОГ",""};
    private static final String[] SUB={
        "Добро пожаловать в последнюю секунду! Здесь важна каждая доля секунды.",
        "Задача простая. Остановите таймер точно на заданном времени!",
        "Нажали один раз, и время пошло. Нажали снова, и таймер встал!",
        "Но не всё так просто. В каждом раунде вас ждёт новое испытание!",
        "Кто окажется дальше всех от цели, тот выбывает!",
        "Ну что, готовы? Ловите последнюю секунду!"},
        SUB_B={
        "Это последняя секунда! Здесь всё решают мгновения.",
        "Правило одно. Поймайте таймер ровно на нужной отметке!",
        "Первое нажатие запускает отсчёт. Второе его останавливает!",
        "А дальше сложнее. Каждый раунд приносит новое испытание!",
        "Самый неточный игрок покидает игру!",
        "Приготовьтесь! Время пошло!"};
    /** Two voiced takes of the same rules; one is picked at random each time (or -Dfs.rulesVariant=a|b). */
    private final boolean variantB;private final String[] subs;
    private static final Color BLOOD=new Color(.9f,.16f,.08f,1),GOLD=new Color(1f,.74f,.32f,1),INK=new Color(.24f,.12f,.06f,1),
        BONE=new Color(.96f,.92f,.84f,1),DARK=new Color(.03f,.015f,.015f,1),EMBER=new Color(1,.42f,.18f,1);
    private static final String[] WHO={"skeleton","dracula","pumpkin","voodoo","ghost"};


    private final SpriteBatch batch=new SpriteBatch();private final ShapeRenderer shapes=new ShapeRenderer();
    private final PolygonSpriteBatch postBatch=new PolygonSpriteBatch();private final DeathPost post=new DeathPost();
    private final FitViewport viewport=new FitViewport(W,H);private final GlyphLayout gl=new GlyphLayout();
    private final Texture eye=com.erni.finalanswer.systembreach.host.SystemBreachRulesFilm.buttonEye();private final Texture cap,collar,plate,smoke,wisp,glow,pixel;private final SevenSegment seg=new SevenSegment();private TextureRegion glowR,debrisR;private final Map<String,Texture> portraits=new HashMap<>();
    private final BitmapFont title,heading,hand,sub,small;
    private final Sound[] voice=new Sound[6];private Sound whoosh,paper,thud,flip;private int voiced=-1;
    private final Matrix4 xf=new Matrix4();private final Vector2 tmp=new Vector2();
    private float time,skipAt=-1,tabPos=1;private boolean hover,stampPlayed,shotA,shotB;private int pass;

    public FinalSecondRulesFilm(){
        cap=tex("final_second/button_cap.png");plate=tex("final_second/machine_plate.png");collar=tex("final_second/collar_front.png");smoke=tex("cursed_boxes/effects/gun_smoke.png");wisp=tex("cursed_boxes/effects/cursed_smoke.png");
        Pixmap g=new Pixmap(128,128,Pixmap.Format.RGBA8888);for(int y=0;y<128;y++)for(int x=0;x<128;x++){float d=Math.min(1,(float)Math.hypot(x-63.5,y-63.5)/63.5f);float v=(1-d)*(1-d);g.drawPixel(x,y,Color.rgba8888(1,1,1,v));}
        glow=new Texture(g);glow.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);g.dispose();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        title=UiFonts.gothic(132);heading=UiFonts.gothic(78);hand=UiFonts.handwriting(66);sub=font("NotoSans-SemiCondensedSemiBold.ttf",36);small=font("NotoSans-SemiCondensedSemiBold.ttf",22);
        String vp=System.getProperty("fs.rulesVariant","");boolean b=vp.equals("b")||(!vp.equals("a")&&MathUtils.randomBoolean());
        if(b&&!Gdx.files.internal("final_second/rules/rules_b_0.wav").exists())b=false;variantB=b;subs=b?SUB_B:SUB;
        if(Gdx.audio!=null)try{for(int i=0;i<voice.length;i++){var f=Gdx.files.internal("final_second/rules/rules_"+(variantB?"b_":"")+i+".wav");if(f.exists())voice[i]=Gdx.audio.newSound(f);}
            whoosh=snd("system_breach/sfx/whoosh.wav");paper=null;thud=snd("system_breach/sfx/strike.wav");flip=snd("system_breach/sfx/tick.wav");}catch(RuntimeException ignored){}
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
    public void seek(float t){time=t;skipAt=-1;voiced=-1;stampPlayed=false;shotA=t>START[2]+1.4f;shotB=t>START[2]+3.9f;for(var v:voice)if(v!=null)v.stop();}

    public void render(float dt){
        time=Math.min(LENGTH,time+Math.min(dt,.1f));input();audio();
        post.begin();Gdx.gl.glViewport(0,0,DeathPost.SW,DeathPost.SH);ScreenUtils.clear(DARK);frame();post.end();
        ScreenUtils.clear(0,0,0,1);viewport.apply();
        float cut=99;for(int i=1;i<START.length;i++)cut=Math.min(cut,Math.abs(time-START[i]));
        float slam=-1;
        post.time=time;post.cx=.5f;post.cy=.55f;post.desat=0;post.aberration=0;
        if(slam>=0&&slam<.6f){post.shock=slam*1.1f;post.shockStrength=.35f*(1-slam/.6f);}else post.shock=-1;
        post.present(postBatch);
    }
    private float shakeX,shakeY;
    private void frame(){
        {float e=-1;for(float st:new float[]{START[2]+1.4f,START[2]+3.9f})if(time>=st&&time<st+.7f)e=time-st;
         if(e>=0){float amp=8*(float)Math.exp(-e*9);shakeX=amp*(hash((int)(time*90))-.5f)*2;shakeY=amp*(hash((int)(time*90)+77)-.5f)*2;}else{shakeX=shakeY=0;}}
        var cam=viewport.getCamera();cam.update();shapes.setProjectionMatrix(cam.combined);batch.setProjectionMatrix(cam.combined);
        int s=scene();float lt=time-START[s];
        stage(s,lt);
        for(int i=Math.max(0,s-1);i<=Math.min(START.length-1,s+1);i++){float v=vis(i);if(v<=0)continue;float t=time-START[i],len=END[i]-START[i];
            float enter=1-k(time,START[i]-.1f,START[i]+.6f),leave=k(time,END[i]-.45f,END[i]);float sc=1+.025f*k(t,0,len)+.05f*ease(enter)-.04f*ease(leave);
            xf.idt().translate(W/2+shakeX,H/2+shakeY,0).scale(sc,sc,1).translate(-W/2,-H/2,0);shapes.setTransformMatrix(xf);batch.setTransformMatrix(xf);
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
        for(int i=0;i<26;i++){float h1=hash(i*9+2),h2=hash(i*5+11);float y=(h2*H*1.2f+time*(40+60*h1))%(H*1.2f)-60;float x=h1*W+MathUtils.sin(time*.9f+i*2.1f)*40;float fl=.5f+.5f*MathUtils.sin(time*4+i);
            glowAt(x,y,5+7*h2,EMBER,.55f*fl*(1-y/H));glowAt(x,y,26,BLOOD,.10f*fl);}
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.end();
    }
    private int scene(){for(int i=START.length-1;i>=0;i--)if(time>=START[i])return i;return 0;}
    private float vis(int i){float in=i==0?1:ease(k(time,START[i]-.05f,START[i]+.5f)),out=i==START.length-1?1:1-ease(k(time,END[i]-.45f,END[i]));return in*out;}
    private void scene(int s,float t,float a){switch(s){case 0->titleScene(t,a);case 1->roles(t,a);case 2->clues(t,a);case 3->mystery(t,a);case 4->result(t,a);default->finale(t,a);}}

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
    /** Seven-segment readout "d.dd" centred at cx; ghost segments stay faintly visible like a real display. */
    private void readout(String txt,float cx,float y,float h,float lit,float a,boolean hidden){
        if(pass!=1||a<=0)return;float w=h*.56f,gap=h*.16f,dot=h*.12f;int n=0;for(char c:txt.toCharArray())if(c!='.')n++;
        float total=n*w+(n-1)*gap+dot*2.2f,x=cx-total/2;var c0=batch.getColor().cpy();
        seg.on.a=a;seg.off.a=.55f*a;
        for(char c:txt.toCharArray()){if(c=='.'){seg.dot(batch,x+dot*.3f,y,dot,lit,.12f);x+=dot*2.2f;continue;}
            int m=hidden?SevenSegment.mask('-'):SevenSegment.mask(c);seg.digit(batch,m,x,y,w,h,lit,.12f);x+=w+gap;}
        seg.on.a=1;seg.off.a=1;batch.setColor(c0);
    }
    private static String fmt(float v){return String.format(java.util.Locale.ROOT,"%.2f",Math.max(0,v));}
    /** Brass display bezel behind a readout. */
    private void bezel(float cx,float y,float w,float h,float a,Color rim){if(pass!=0||a<=0)return;panel(cx-w/2,y-h*.18f,w,h*1.36f,rim,a);}
    /** The game's red button: collar in front, cap that sinks when pressed (press 0..1). */
    /**
     * The game's red button assembled like the machine: a dark brass well behind, the red cap seated in it (sinks on
     * press), and the brass front lip on top, using the plate layout offsets so the cap is never cut through the middle.
     */
    private void button(float cx,float cy,float s,float press,float a){
        if(a<=0)return;float cw=357*s,ch=207*s,lw=369*s,lh=134*s;float capY=cy-ch*.5f,lipTop=capY+ch-132*s,sink=press*26*s;
        if(pass==0){Color z=new Color(0,0,0,0),sh=new Color(0,0,0,.6f*a);shapes.setColor(0,0,0,.55f*a);shapes.ellipse(cx-lw*.62f,lipTop-lh-26*s,lw*1.24f,70*s);
            shapes.setColor(.10f,.05f,.04f,a);shapes.ellipse(cx-lw*.49f,lipTop-58*s,lw*.98f,128*s);shapes.setColor(.035f,.01f,.01f,a);shapes.ellipse(cx-lw*.44f,lipTop-44*s,lw*.88f,104*s);}
        if(pass==2){glowAt(cx,capY+ch*.6f,cw*2.4f,BLOOD,.32f*a*(.7f+.3f*MathUtils.sin(time*3))+.55f*a*press);}
        if(pass==1){float l=1-.15f*press;b(l,l,l,a);batch.draw(cap,cx-cw/2,capY-sink,cw,ch);b(1,1,1,a);batch.draw(collar,cx-lw/2,lipTop-lh,lw,lh);b(1,1,1,1);}
    }
    private Texture edge;
    /** Black frame that fades the plate crop into the stage so no rectangle edge shows. */
    private Texture edgeMask(){if(edge==null){int n=256;Pixmap pm=new Pixmap(n,n,Pixmap.Format.RGBA8888);pm.setBlending(Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=(x-n/2f+.5f)/(n/2f),dy=(y-n/2f+.5f)/(n/2f);float d=(float)Math.sqrt(dx*dx*.85f+dy*dy);float al=MathUtils.clamp((d-.62f)/.36f,0,1);al=al*al*(3-2*al);
            float c=.012f;pm.drawPixel(x,y,Color.rgba8888(c,c*.4f,c*.4f,al));}
        edge=new Texture(pm);edge.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);pm.dispose();}return edge;}
    private float pressAt(float t,float at){float e=t-at;return e<0||e>.35f?0:e<.08f?e/.08f:1-(e-.08f)/.27f;}
    private void ripple(float x,float y,float e,float a,Color c){if(pass!=2||e<0||e>.8f)return;float k=e/.8f;float r=80+520*ease(k);for(int q=0;q<40;q++){float an=q/40f*MathUtils.PI2;glowAt(x+MathUtils.cos(an)*r,y+MathUtils.sin(an)*r*.35f,26,c,.45f*a*(1-k));}}

    private void titleScene(float t,float a){
        float q=ease(k(t,.4f,1.3f));
        bezel(W/2,380,700,190,a*q,BLOOD);
        float on=k(t,.9f,2.2f);String v=on<.25f?"0.00":on<.5f?"3.00":on<.75f?"5.00":"7.00";readout(v,W/2,380,190,on>=1?1:.85f,a*q,false);
        if(pass==2)glowAt(W/2,470,1100,BLOOD,.3f*a*q*(on>=1?1:.6f));
        if(pass==1){float r=ease(k(t,.6f,1.5f));text(title,"THE FINAL SECOND",W/2,H-190+(1-r)*30,GOLD,a*r,.9f);
            float u=ease(k(t,1.3f,2.1f));text(heading,"ПОСЛЕДНЯЯ СЕКУНДА",W/2,H-320,BLOOD,a*u,.8f);}
    }
    private void roles(float t,float a){
        headingText("ЦЕЛЬ",t,a,GOLD);
        float run=k(t,.8f,3.6f);float v=7f*ease(run);boolean done=run>=1;
        bezel(W/2,450,760,210,a,done?new Color(.4f,1,.5f,1):BLOOD);readout(fmt(v),W/2,450,210,1,a,false);
        if(pass==2&&done){float e=t-3.6f;glowAt(W/2,550,1200,new Color(.3f,1,.45f,1),a*(e<.4f?.6f*(1-e/.4f):0)+.15f*a);}
        if(pass==1){text(heading,"ЦЕЛЬ:  7,00 С",W/2,840,GOLD,a,.55f);text(small,"например  ·  в каждом раунде своё время",W/2,790,BONE,.75f*a,1.05f);
            text(heading,"РОВНО!",W/2,300,new Color(.45f,1,.55f,1),a*k(t,3.7f,4f),.8f);}
    }
    private void clues(float t,float a){
        headingText("КНОПКА",t,a,GOLD);
        float p1=1.4f,p2=3.9f;float press=Math.max(pressAt(t,p1),pressAt(t,p2));
        float v=t<p1?0:t<p2?(t-p1)*2.78f:(p2-p1)*2.78f;
        bezel(W/2,670,560,150,a,BLOOD);readout(fmt(v),W/2,670,150,1,a,false);
        button(W/2,360,1.15f,press,a);ripple(W/2,380,t-p1,a,BLOOD);ripple(W/2,380,t-p2,a,GOLD);
        if(pass==1){text(heading,"СТАРТ",W/2-470,400,BLOOD,a*k(t,p1,p1+.2f)*(1-k(t,p2-.3f,p2)),.75f);text(heading,"СТОП",W/2+470,400,GOLD,a*k(t,p2,p2+.2f),.75f);
            text(small,"1 НАЖАТИЕ",W/2-470,330,BONE,.7f*a*k(t,p1,p1+.2f)*(1-k(t,p2-.3f,p2)),1.1f);text(small,"2 НАЖАТИЕ",W/2+470,330,BONE,.7f*a*k(t,p2,p2+.2f),1.1f);}
    }
    /** New trial every round: three sealed cards; each turns over in turn to show only a glowing question mark. */
    private void mystery(float t,float a){
        headingText("ИСПЫТАНИЯ",t,a,BLOOD);
        for(int i=0;i<3;i++){float in=ease(k(t,.3f+.25f*i,.8f+.25f*i));float x=W/2+(i-1)*480,y=520-(1-in)*80+MathUtils.sin(time*1.4f+i)*8;float fl=ease(k(t,1.6f+.7f*i,2.1f+.7f*i));
            float sx=Math.max(.05f,Math.abs(MathUtils.cos(fl*MathUtils.PI)));boolean front=fl>.5f;float w=320*sx,h=420;
            if(pass==0){Color rim=front?GOLD:BLOOD;panel(x-w/2,y-h/2,w,h,rim,a*in);}
            if(pass==1){text(small,"РАУНД "+(i+1),x,y+h/2+40,BONE,.7f*a*in,1.1f);
                if(front&&sx>.3f)text(title,"?",x,y+70,GOLD,a*in,1.3f*sx);else if(sx>.3f)text(heading,"???",x,y+30,new Color(.5f,.3f,.28f,1),a*in*.7f,.8f*sx);}
            if(pass==2&&front)glowAt(x,y,520,GOLD,.3f*a*in*(.8f+.2f*MathUtils.sin(time*4+i)));}
        if(pass==1)text(heading,"КАЖДЫЙ РАУНД — НОВОЕ ИСПЫТАНИЕ",W/2,230,BLOOD,a*k(t,3.6f,4f),.5f);
    }
    private void result(float t,float a){
        headingText("ИТОГ",t,a,GOLD);
        String[] who={WHO[0],WHO[1],WHO[2],WHO[3]};float[] res={7.02f,6.95f,7.21f,8.40f};
        for(int i=0;i<4;i++){float in=ease(k(t,.3f+.25f*i,.8f+.25f*i));float y=720-i*130,x0=W/2-520;boolean out=i==3;float loss=out?k(t,2.4f,2.9f):0;
            if(pass==0)panel(x0,y-55,1040,110,out&&loss>0?BLOOD:GOLD,a*in);
            framed(who[i],x0+80,y,90,a*in,BLOOD,loss);
            if(pass==1){text(heading,String.valueOf(i+1),x0+175,y+28,out?BLOOD:GOLD,a*in,.55f);text(small,i==0?"ближе всех":i==3?"дальше всех":"",x0+620,y-14,BONE,.6f*a*in,1);}
            readout(fmt(res[i]),x0+460,y-38,76,1,a*in,false);
            if(pass==1){String err=String.format(java.util.Locale.ROOT,"%+.2f",res[i]-7);text(heading,err,x0+870,y+28,out?BLOOD:new Color(.45f,1,.55f,1),a*in,.5f);}
            if(out&&loss>0){if(pass==1)text(heading,"ВЫБЫВАЕТ",W/2,y-80,BLOOD,a*loss,.6f);if(pass==2)glowAt(x0+520,y,1100,BLOOD,.3f*a*loss);}}
    }
    private void finale(float t,float a){
        float p=ease(k(t,1.1f,1.7f)),q=ease(k(t,.1f,.6f));
        bezel(W/2,300,560,150,a*q,BLOOD);float pulse=.75f+.25f*MathUtils.sin(time*6);readout("7.00",W/2,300,150,pulse,a*q,false);
        if(pass==1){text(heading,"Ну что, готовы?",W/2,H/2+250,BONE,a*q*(1-p*.4f),.8f);text(title,"ЛОВИТЕ ПОСЛЕДНЮЮ СЕКУНДУ!",W/2,H/2+130,BLOOD,a*p,.5f*(1+.25f*(1-p)));}
        if(pass==2)glowAt(W/2,360,1000,BLOOD,.35f*a*q*pulse);
    }

    // ---------- chrome ----------
    private void chromeShapes(int s){
        float a=ease(k(time,.2f,.9f))*(1-k(time,LENGTH-.6f,LENGTH));
        Color c0=new Color(0,0,0,0),c1=new Color(0,0,0,.72f*a);shapes.rect(W/2-820,40,820,110,c0,c1,c1,c0);shapes.rect(W/2,40,820,110,c1,c0,c0,c1);
        Color l0=new Color(GOLD.r,GOLD.g,GOLD.b,0),l1=new Color(GOLD.r,GOLD.g,GOLD.b,.7f*a);shapes.rect(W/2-820,148,820,1.5f,l0,l1,l1,l0);shapes.rect(W/2,148,820,1.5f,l1,l0,l0,l1);
        float ta=k(time,START[1]-.3f,START[1]+.3f)*(1-k(time,START[START.length-1]-.3f,START[START.length-1]+.3f));tabPos+=(MathUtils.clamp(s,1,TAB.length-2)-tabPos)*Math.min(1,Gdx.graphics.getDeltaTime()*7);
        for(int i=1;i<=TAB.length-2;i++){col(i<s?GOLD:new Color(.35f,.25f,.2f,1),.7f*ta);shapes.rect(tabX(i)-95,H-52,190,2);}col(BONE,ta);float mx=tabX(1)+(tabPos-1)*230;shapes.rect(mx-95,H-53,190,4);
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
        float ta=k(time,START[1]-.3f,START[1]+.3f)*(1-k(time,START[START.length-1]-.3f,START[START.length-1]+.3f));
        for(int i=1;i<=TAB.length-2;i++){Color c=i==s?BONE:i<s?GOLD:new Color(.55f,.45f,.4f,1);small.getData().setScale(.85f);gl.setText(small,TAB[i]);float lw=gl.width;small.getData().setScale(1);text(small,"0"+i,tabX(i)+14-lw/2-36,H-64,i==s?BLOOD:c,(i==s?1:.6f)*ta,.8f,false);text(small,TAB[i],tabX(i)+14,H-64,c,(i==s?1:.8f)*ta,.85f);}
        text(small,"THE FINAL SECOND  ·  ПРАВИЛА",60,H-30,GOLD,.7f,.85f,false);
        float len=END[s]-START[s];float a=ease(k(t,.15f,.5f))*(1-ease(k(t,len-.3f,len)))*(1-k(time,LENGTH-.6f,LENGTH));typeLine(subs[s],t-.15f,a);cutFlare();
    }
    /** Anamorphic light streak and a warm flash sweeping across every chapter cut. */
    private void cutFlare(){
        for(int i=1;i<START.length;i++){float d=time-START[i]+.15f;if(d<0||d>.9f)continue;float e=1-d/.9f,ee=e*e;
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);float x=-300+(W+600)*ease(Math.min(1,d/.7f));
            b(GOLD.r,GOLD.g,GOLD.b,.35f*ee);batch.draw(glow,x-1100,H/2-14,2200,28);b(1,.95f,.85f,.55f*ee);batch.draw(glow,x-500,H/2-4,1000,8);
            b(EMBER.r,EMBER.g,EMBER.b,.18f*ee);batch.draw(glow,x-420,H/2-420,840,840);b(1,1,1,1);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
    }
    private static float tabX(int i){return W/2+(i-(TAB.length-1)/2f)*230;}
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
        if(!shotA&&time>=START[2]+1.4f&&time<START[2]+1.8f){shotA=true;if(thud!=null)thud.play(.5f);}
        if(!shotB&&time>=START[2]+3.9f&&time<START[2]+4.3f){shotB=true;if(thud!=null)thud.play(.7f);}
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
        for(var v:voice)if(v!=null)v.dispose();for(Sound s:new Sound[]{whoosh,paper,thud,flip})if(s!=null)s.dispose();
        seg.dispose();if(edge!=null)edge.dispose();for(Texture t:new Texture[]{eye,cap,collar,plate,smoke,wisp,glow,pixel})t.dispose();for(Texture t:portraits.values())if(t!=null)t.dispose();if(ringTex!=null)ringTex.dispose();
        for(BitmapFont f:new BitmapFont[]{title,heading,hand,sub,small})f.dispose();batch.dispose();shapes.dispose();postBatch.dispose();post.dispose();
    }
}
