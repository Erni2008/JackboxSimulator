package com.erni.finalanswer.cursedcards;

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
 * THE CURSED CARDS rules film for the host screen: seven voiced scenes on a spot-lit stage using the mode's card art
 * (red back, numbered fronts, the reaper DEATH card) with typed subtitles, cross-dissolves, a post pass and SKIP.
 */
public final class CursedCardsRulesFilm implements Disposable {
    public static final float W=1920,H=1080;
    private static final float[] START={0,5.6f,11.8f,18.6f,25.6f,31.6f,38.6f},END={5.6f,11.8f,18.6f,25.6f,31.6f,38.6f,43.4f};
    public static final float LENGTH=43.4f;
    private static final String[] TAB={"","РАЗДАЧА","ПАРЫ","ХОД","ПРОКЛЯТИЕ","ИТОГ",""};
    private static final String[] SUB={
        "Добро пожаловать в проклятые карты! Одна из них несёт смерть.",
        "Каждому раздают карты. И где-то среди них прячется карта смерти!",
        "Одинаковые пары сразу сбрасываются. Чем меньше карт, тем вы ближе к спасению.",
        "По очереди берите одну карту у соседа. Вслепую! На ход всего пять секунд.",
        "Зрители могут проклясть игрока. Тогда смерть скорее окажется у него в руке!",
        "Избавились от всех карт? Вы спасены! А у кого осталась смерть, тот погибает.",
        "Ну что, готовы? Главное, не вытащите смерть!"};
    private static final Color BLOOD=new Color(.9f,.16f,.08f,1),GOLD=new Color(1f,.74f,.32f,1),INK=new Color(.24f,.12f,.06f,1),
        BONE=new Color(.96f,.92f,.84f,1),DARK=new Color(.03f,.015f,.015f,1),EMBER=new Color(1,.42f,.18f,1);
    private static final String[] WHO={"skeleton","dracula","pumpkin","voodoo","ghost"};
    private static final int CURSED=2;

    private final SpriteBatch batch=new SpriteBatch();private final ShapeRenderer shapes=new ShapeRenderer();
    private final PolygonSpriteBatch postBatch=new PolygonSpriteBatch();private final DeathPost post=new DeathPost();
    private final FitViewport viewport=new FitViewport(W,H);private final GlyphLayout gl=new GlyphLayout();
    private final Texture eye=com.erni.finalanswer.systembreach.host.SystemBreachRulesFilm.buttonEye();private final Texture back,death,smoke,wisp,glow,pixel;private final Texture[] face=new Texture[11];private TextureRegion glowR,debrisR;private final Map<String,Texture> portraits=new HashMap<>();
    private final BitmapFont title,heading,hand,sub,small;
    private final Sound[] voice=new Sound[7];private Sound whoosh,paper,thud,flip;private int voiced=-1;
    private final Matrix4 xf=new Matrix4();private final Vector2 tmp=new Vector2();
    private float time,skipAt=-1,tabPos=1;private boolean hover,stampPlayed,shotA,shotB;private int pass;

    public CursedCardsRulesFilm(){
        back=tex("cursed_cards/cards/card_back.jpg");death=tex("cursed_cards/cards/card_death.jpg");for(int v=1;v<=10;v++)face[v]=tex("cursed_cards/cards/card_"+v+".jpg");smoke=tex("cursed_boxes/effects/gun_smoke.png");wisp=tex("cursed_boxes/effects/cursed_smoke.png");
        Pixmap g=new Pixmap(128,128,Pixmap.Format.RGBA8888);for(int y=0;y<128;y++)for(int x=0;x<128;x++){float d=Math.min(1,(float)Math.hypot(x-63.5,y-63.5)/63.5f);float v=(1-d)*(1-d);g.drawPixel(x,y,Color.rgba8888(1,1,1,v));}
        glow=new Texture(g);glow.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);g.dispose();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        title=UiFonts.gothic(132);heading=UiFonts.gothic(78);hand=UiFonts.handwriting(66);sub=font("NotoSans-SemiCondensedSemiBold.ttf",36);small=font("NotoSans-SemiCondensedSemiBold.ttf",22);
        if(Gdx.audio!=null)try{for(int i=0;i<voice.length;i++){var f=Gdx.files.internal("cursed_cards/rules/rules_"+i+".wav");if(f.exists())voice[i]=Gdx.audio.newSound(f);}
            whoosh=snd("system_breach/sfx/whoosh.wav");paper=null;thud=snd("system_breach/sfx/strike.wav");flip=snd("sounds/impostor/page_turn.wav");}catch(RuntimeException ignored){}
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
    public void seek(float t){time=t;skipAt=-1;voiced=-1;stampPlayed=false;shotA=t>START[5]+3.2f;for(var v:voice)if(v!=null)v.stop();}

    public void render(float dt){
        time=Math.min(LENGTH,time+Math.min(dt,.1f));input();audio();
        post.begin();Gdx.gl.glViewport(0,0,DeathPost.SW,DeathPost.SH);ScreenUtils.clear(DARK);frame();post.end();
        ScreenUtils.clear(0,0,0,1);viewport.apply();
        float cut=99;for(int i=1;i<START.length;i++)cut=Math.min(cut,Math.abs(time-START[i]));
        float slam=time>=START[5]+3.2f&&time<START[5]+3.8f?time-(START[5]+3.2f):-1;
        post.time=time;post.cx=.5f;post.cy=.55f;post.desat=0;post.aberration=.06f+(cut<.35f?.35f*(1-cut/.35f):0)+(slam>=0&&slam<.25f?.4f*(1-slam/.25f):0);
        if(slam>=0&&slam<.6f){post.shock=slam*1.1f;post.shockStrength=.35f*(1-slam/.6f);}else post.shock=-1;
        post.present(postBatch);
    }
    private float shakeX,shakeY;
    private void frame(){
        {float e=-1;for(float st:new float[]{START[5]+3.2f})if(time>=st&&time<st+.7f)e=time-st;
         if(e>=0){float amp=26*(float)Math.exp(-e*7);shakeX=amp*(hash((int)(time*90))-.5f)*2;shakeY=amp*(hash((int)(time*90)+77)-.5f)*2;}else{shakeX=shakeY=0;}}
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
    private static final float CW=150,CH=CW*1.5f;
    private Texture tx(int v){return v==0?death:face[v];}
    /** One card with a soft shadow; flip 0 shows the back, 1 the face (it turns edge-on in between). */
    private void card(float x,float y,float w,float rot,float flip,int value,float a,float lit){
        if(pass!=1||a<=0)return;rot+=MathUtils.sin(time*1.3f+x*.013f)*1.4f;y+=MathUtils.sin(time*1.7f+x*.021f)*3;float h=w*1.5f,sx=Math.abs(MathUtils.cos(flip*MathUtils.PI));boolean front=flip>.5f;Texture t=front?tx(value):back;
        b(0,0,0,.5f*a);batch.draw(new TextureRegion(t),x-w/2*sx+10,y-h/2-14,w/2*sx,h/2,w*sx,h,1,1,rot);
        float l=.82f+.18f*lit;b(l,l,l,a);batch.draw(new TextureRegion(t),x-w/2*sx,y-h/2,w/2*sx,h/2,w*sx,h,1,1,rot);b(1,1,1,1);
        // a glint sweeps across the face right after it turns over
        if(flip>.5f&&flip<1){float g=(flip-.5f)/.5f;if(glowR==null)glowR=new TextureRegion(glow);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            float gx=x+(g-.5f)*w*1.3f;b(1,.92f,.75f,.55f*a*MathUtils.sin(g*MathUtils.PI));batch.draw(glowR,gx-w*.18f,y-h*.6f,w*.18f,h*.6f,w*.36f,h*1.2f,1,1,rot+22);
            b(1,1,1,1);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
    }
    /** Radial gold sparks bursting from (x,y), e seconds after the moment. */
    private void sparks(float x,float y,float e,float a,Color c){
        if(pass!=2||e<0||e>.9f)return;for(int i=0;i<28;i++){float an=hash(i*7+3)*MathUtils.PI2,sp=260+420*hash(i*11);float px=x+MathUtils.cos(an)*sp*e,py=y+MathUtils.sin(an)*sp*e-300*e*e;float k=1-e/.9f;glowAt(px,py,10+18*k,c,a*k);}
        if(e<.25f)glowAt(x,y,420,c,.6f*a*(1-e/.25f));
    }
    private void fan(float cx,float cy,int n,float spread,float w,float a,int[] vals,float flip){
        for(int i=0;i<n;i++){float u=n==1?0:i/(float)(n-1)-.5f;float rot=-u*spread,x=cx+u*w*1.9f,y=cy-Math.abs(u)*30;card(x,y,w,rot,flip,vals==null?1:vals[i],a,1);}
    }
    private void titleScene(float t,float a){
        float fl=ease(k(t,1.2f,2f));float bob=MathUtils.sin(time*1.4f)*8;
        if(pass==2){glowAt(W/2,H/2-150,900,BLOOD,.35f*a*fl*(.8f+.2f*MathUtils.sin(time*3)));glowAt(W/2,H/2+250,800,GOLD,.12f*a);
            if(glowR==null)glowR=new TextureRegion(glow);for(int i=0;i<12;i++){float ang=i*30+time*8;b(1,.35f,.2f,.10f*a*fl);batch.draw(glowR,W/2,H/2-150-24,0,24,620,48,1,1,ang);}b(1,1,1,1);}
        card(W/2,H/2-150+bob,230,MathUtils.sin(time*.8f)*3,fl,0,a*ease(k(t,.2f,.8f)),1);
        if(pass==1){float q=ease(k(t,.6f,1.5f));text(title,"THE CURSED CARDS",W/2,H-190+(1-q)*30,GOLD,a*q,.9f);
            float r=ease(k(t,1.3f,2.1f));text(heading,"ПРОКЛЯТЫЕ КАРТЫ",W/2,H-320,BLOOD,a*r,.8f);}
    }
    private static final float[][] SEAT={{W/2-640,520},{W/2-215,520},{W/2+215,520},{W/2+640,520}};
    private void roles(float t,float a){
        headingText("РАЗДАЧА",t,a,GOLD);
        float dx=W/2,dy=740;card(dx,dy,110,0,0,1,a*ease(k(t,.1f,.5f)),1);
        for(int p=0;p<4;p++){framed(WHO[p],SEAT[p][0],SEAT[p][1]-230,130,a*ease(k(t,.2f+.1f*p,.6f+.1f*p)),GOLD,0);
            for(int c=0;c<4;c++){float st=.7f+(c*4+p)*.13f,f=ease(k(t,st,st+.45f));if(f<=0)continue;float u=c/3f-.5f;
                float tx=SEAT[p][0]+u*120,ty=SEAT[p][1]-Math.abs(u)*20,rot=-u*20;float x=MathUtils.lerp(dx,tx,f),y=MathUtils.lerp(dy,ty,f)+MathUtils.sin(f*MathUtils.PI)*60;
                if(f<.98f)for(int g=3;g>=1;g--){float fg=Math.max(0,f-g*.06f);float gx=MathUtils.lerp(dx,tx,fg),gy=MathUtils.lerp(dy,ty,fg)+MathUtils.sin(fg*MathUtils.PI)*60;card(gx,gy,110,MathUtils.lerp(0,rot,fg)+(1-fg)*200,0,1,a*.18f*(4-g)/3f,1);}
                card(x,y,110,MathUtils.lerp(0,rot,f)+(1-f)*200,0,1,a,1);if(f>=1&&pass==2){float e=t-st-.45f;if(e<.2f)glowAt(tx,ty,180,GOLD,.4f*a*(1-e/.2f));}}}
        // the DEATH card hides somewhere: one back pulses red
        float hb=k(t,3.4f,3.8f);if(hb>0){float x=SEAT[CURSED][0]+(2/3f-.5f)*120,y=SEAT[CURSED][1]-(1/6f)*20;float beat=(float)Math.pow(Math.max(0,MathUtils.sin(time*6)),6);
            if(pass==2)glowAt(x,y,340,BLOOD,a*hb*(.25f+.55f*beat));if(pass==1)text(sub,"Где-то здесь — смерть",W/2,215,BLOOD,a*hb,.85f);}
    }
    private void clues(float t,float a){
        headingText("ПАРЫ",t,a,GOLD);
        int[] v={3,9,7,3,7};float cx=W/2-160,cy=500;
        float px=W/2+520,py=520;if(pass==1){text(small,"СБРОС",px,py+170,BONE,.6f*a,1);}
        for(int i=0;i<5;i++){float u=i/4f-.5f;float x=cx+u*560,y=cy-Math.abs(u)*40,rot=-u*16;int pair=(v[i]==3)?0:(v[i]==7)?1:-1;
            float lift=0,go=0;if(pair>=0){float st=1.2f+pair*1.6f;lift=ease(k(t,st,st+.4f));go=ease(k(t,st+.6f,st+1.2f));}
            float fx=MathUtils.lerp(x,px+(pair==0?-12:12),go),fy=MathUtils.lerp(y+lift*60,py+(pair==0?-6:8),go),fr=MathUtils.lerp(rot,pair==0?-8:10,go);
            card(fx,fy,MathUtils.lerp(170,130,go),fr,ease(k(t,.4f+.1f*i,.8f+.1f*i)),v[i],a,1);
            if(pass==2&&pair>=0&&lift>0&&go<1)glowAt(x,y+lift*60,300,GOLD,.35f*a*lift*(1-go));}
        for(int pr=0;pr<2;pr++){float st=1.2f+pr*1.6f;sparks(W/2-160,620,t-st-.3f,a,GOLD);sparks(W/2+520,520,t-st-1.2f,a*.7f,GOLD);}
        if(pass==1){for(int pr=0;pr<2;pr++){float st=1.2f+pr*1.6f,f=k(t,st+.2f,st+.5f)*(1-k(t,st+1.1f,st+1.4f));text(heading,"ПАРА!",W/2-160,760,GOLD,a*f,.7f);}
            text(sub,"Осталась одна карта",cx,240,BONE,a*k(t,4.6f,5.1f),.85f);}
    }
    private void suspicion(float t,float a){
        headingText("ХОД",t,a,GOLD);
        float mx=W/2-520,my=520,nx=W/2+330,ny=520;
        framed(WHO[0],mx,my+40,190,a,GOLD,0);if(pass==1)text(small,"ТВОЙ ХОД",mx,my-80,GOLD,a,1.1f);
        framed(WHO[1],nx,my+260,120,a,GOLD,0);if(pass==1)text(small,"СОСЕД",nx,my+180,BONE,.7f*a,1);
        // countdown ring: five seconds per turn
        float tl=Math.max(1,5-Math.max(0,t-.6f));if(pass==0){int seg=60;for(int q=0;q<seg;q++){float f0=q/(float)seg;boolean on=f0<tl/5;col(on?GOLD:new Color(.25f,.15f,.12f,1),a*(on?.95f:.6f));float a0=MathUtils.PI/2-f0*MathUtils.PI2,a1=a0-MathUtils.PI2/seg*.7f;shapes.rectLine(mx+MathUtils.cos(a0)*120,my+40+MathUtils.sin(a0)*120,mx+MathUtils.cos(a1)*120,my+40+MathUtils.sin(a1)*120,5);}}
        if(pass==1)text(heading,String.valueOf((int)Math.ceil(tl)),mx+150,my+160,GOLD,a,.6f);
        int pick=2;float hov=k(t,.8f,2.6f),take=ease(k(t,2.8f,3.6f)),fl=ease(k(t,3.6f,4.1f));
        for(int i=0;i<5;i++){float u=i/4f-.5f;float x=nx+u*420,y=ny-Math.abs(u)*30,rot=-u*14;float hoverIdx=hov*4.99f;boolean over=(int)hoverIdx==i&&take==0;
            if(i==pick&&take>0){x=MathUtils.lerp(x,mx+260,take);y=MathUtils.lerp(y,my-40,take)+MathUtils.sin(take*MathUtils.PI)*120;rot*=1-take;}
            card(x,y+(over?28:0),150,rot,i==pick?fl:0,9,a,over?1:.85f);if(pass==2&&over)glowAt(x,y+28,260,GOLD,.35f*a);}
        sparks(mx+260,my-40,t-4.15f,a,GOLD);
        if(pass==1){float p=k(t,4.2f,4.6f);text(heading,"ВСЛЕПУЮ!",nx,ny-260,BLOOD,a*k(t,1,1.4f)*(1-p),.7f);text(heading,"9 + 9 = ПАРА!",nx,ny-260,GOLD,a*p,.7f);}
    }
    private void vote(float t,float a){
        headingText("ПРОКЛЯТИЕ",t,a,BLOOD);
        float tx=W/2,ty=420;framed(WHO[CURSED],tx,ty,240,a,BLOOD,ease(k(t,2.6f,3.4f)));
        for(int i=0;i<5;i++){float sx=W/2+(i-2)*320,sy=770;framed(i<4?WHO[(i+3)%5]:WHO[4],sx,sy,100,a*.75f*ease(k(t,.2f+.1f*i,.6f+.1f*i)),BLOOD,0);
            float f=k(t,1+.25f*i,1.9f+.25f*i);if(f>0&&f<1&&pass==2){for(int q=0;q<10;q++){float ff=Math.max(0,f-q*.025f);float x=MathUtils.lerp(sx,tx,ease(ff)),y=MathUtils.lerp(sy-60,ty+40,ease(ff))+MathUtils.sin(ff*MathUtils.PI)*80*(i%2==0?1:-1);glowAt(x,y,70-q*5,BLOOD,.8f*a*(1-q/10f));}}}
        float c=ease(k(t,2.6f,3.4f));
        if(c>0&&pass==0){float rr=210;int n=72;for(int q=0;q<n;q++){float a0=q/(float)n*MathUtils.PI2+time*.4f,a1=a0+MathUtils.PI2/n*.6f;col(BLOOD,.8f*a*c);shapes.rectLine(tx+MathUtils.cos(a0)*rr,ty+MathUtils.sin(a0)*rr*.42f-120,tx+MathUtils.cos(a1)*rr,ty+MathUtils.sin(a1)*rr*.42f-120,2.5f);}
            for(int q=0;q<5;q++){float a0=q*MathUtils.PI2/5-time*.3f,a1=a0+MathUtils.PI2*2/5;col(BLOOD,.55f*a*c);shapes.rectLine(tx+MathUtils.cos(a0)*rr*.92f,ty+MathUtils.sin(a0)*rr*.39f-120,tx+MathUtils.cos(a1)*rr*.92f,ty+MathUtils.sin(a1)*rr*.39f-120,2);}}
        if(c>0){if(pass==1){for(int i=0;i<6;i++){float ph=(time*.4f+i/6f)%1;float r=160+220*ph;b(.9f,.15f,.12f,.25f*a*c*(1-ph));batch.draw(new TextureRegion(wisp),tx-r,ty-r*.6f+ph*120,r,r*.6f,r*2,r*1.2f,1,1,i*60+time*20);}b(1,1,1,1);
                text(heading,"ПРОКЛЯТ",tx,ty-170,BLOOD,a*k(t,3,3.4f),.75f);}
            if(pass==2)glowAt(tx,ty,700,BLOOD,.45f*a*c*(.8f+.2f*MathUtils.sin(time*5)));
            sparks(tx+230,ty,t-4.4f,a,BLOOD);            float d=ease(k(t,3.6f,4.4f));card(MathUtils.lerp(W/2+700,tx+230,d),ty+MathUtils.sin(d*MathUtils.PI)*120,130,(1-d)*-90+8,ease(k(t,4.6f,5.1f)),0,a*d,1);}
    }
    private void result(float t,float a){
        headingText("ИТОГ",t,a,GOLD);
        float l=ease(k(t,.3f,.9f)),r=ease(k(t,1.6f,2.2f));float lx=W/2-420,rx=W/2+420,y=470;
        if(pass==0){panel(lx-320,y-190,640,420,GOLD,a*l);panel(rx-320,y-190,640,420,BLOOD,a*r);}
        framed(WHO[0],lx,y+70,190,a*l,GOLD,0);if(pass==1){text(small,"0 КАРТ В РУКЕ",lx,y-60,BONE,a*l,1.1f);text(heading,"СПАСЁН",lx,y-110,GOLD,a*l,.75f);}
        if(pass==2)glowAt(lx,y+70,600,GOLD,.2f*a*l);
        float fl=ease(k(t,2.6f,3.2f)),dead=k(t,3.2f,4f);framed(WHO[CURSED],rx-90,y+70,170,a*r,BLOOD,dead);
        card(rx+120,y+50,140,6,fl,0,a*r,1);
        if(pass==1){text(small,"ПОСЛЕДНЯЯ КАРТА",rx,y-60,BONE,a*r,1.1f);text(heading,"СМЕРТЬ",rx,y-110,BLOOD,a*dead,.75f+.1f*(1-dead));}
        {float e=t-3.2f;if(e>0&&e<2f){if(pass==1){for(int i=0;i<6;i++){float k2=e/2f,rs=60+260*ease(Math.min(1,k2*1.5f));b(.35f,.08f,.08f,.5f*a*(1-k2));batch.draw(new TextureRegion(smoke),rx+120-rs+(i-2.5f)*30,y+50-rs*.6f+e*60,rs,rs*.6f,rs*2,rs*1.2f,1,1,i*55+e*30);}b(1,1,1,1);}
            sparks(rx+120,y+50,e,a,BLOOD);}}
        if(pass==2&&fl>.5f)glowAt(rx+120,y+50,700,BLOOD,.55f*a*(1-.5f*dead)*(.8f+.2f*MathUtils.sin(time*6)));
    }
    private void finale(float t,float a){
        float p=ease(k(t,1.1f,1.7f)),q=ease(k(t,.1f,.6f));
        for(int i=0;i<5;i++){float u=i/4f-.5f;float x=W/2+u*760,y=320-Math.abs(u)*40;float fl=i==2?ease(k(t,1.8f,2.4f)):0;card(x,y+(i==2?fl*30:0),150,-u*18,fl,0,a*q,1);}
        if(pass==2)glowAt(W/2,350,800,BLOOD,.4f*a*ease(k(t,1.8f,2.4f)));
        if(pass==1){text(heading,"Ну что, готовы?",W/2,H/2+250,BONE,a*q*(1-p*.4f),.8f);text(title,"НЕ ВЫТАЩИТЕ СМЕРТЬ!",W/2,H/2+130,BLOOD,a*p,.6f*(1+.25f*(1-p)));}
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
        text(small,"THE CURSED CARDS  ·  ПРАВИЛА",60,H-30,GOLD,.7f,.85f,false);
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
        if(!shotA&&time>=START[5]+3.2f&&time<START[5]+3.6f){shotA=true;if(thud!=null)thud.play(.9f);}
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
        for(Texture t:face)if(t!=null)t.dispose();for(Texture t:new Texture[]{eye,back,death,smoke,wisp,glow,pixel})t.dispose();for(Texture t:portraits.values())if(t!=null)t.dispose();if(ringTex!=null)ringTex.dispose();
        for(BitmapFont f:new BitmapFont[]{title,heading,hand,sub,small})f.dispose();batch.dispose();shapes.dispose();postBatch.dispose();post.dispose();
    }
}
