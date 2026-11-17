package com.erni.finalanswer.impostor;

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
 * THE IMPOSTOR rules film for the host screen: seven voiced scenes built from the mode's own art (the lamp-lit room,
 * parchment role cards, suspicion envelopes, the blood stamp, the gothic portrait frames) with typed subtitles,
 * cross-dissolves, a cinematic post pass and a SKIP button (click, Enter, Esc).
 */
public final class ImpostorRulesFilm implements Disposable {
    public static final float W=1920,H=1080;
    private static final float[] START={0,5.6f,13.4f,19f,23.6f,27.4f,33.4f},END={5.6f,13.4f,19f,23.6f,27.4f,33.4f,37.8f};
    public static final float LENGTH=37.8f;
    private static final String[] TAB={"","РОЛИ","УЛИКИ","ПОДОЗРЕНИЕ","ГОЛОСОВАНИЕ","ИТОГ",""};
    private static final String[] SUB={
        "Добро пожаловать в игру! Сегодня среди вас есть самозванец.",
        "Все получают секретное слово! Все, кроме самозванца, ему достаётся только подсказка.",
        "Пишите слова улики! Намекайте, но не выдавайте слово!",
        "После каждого раунда отмечайте, кто подозрителен!",
        "Через три раунда финальное голосование!",
        "Поймали самозванца, победа ваша! Ошиблись, побеждает он!",
        "Ну что, готовы? Тогда найдите самозванца!"};
    private static final Color BLOOD=new Color(.86f,.1f,.08f,1),GOLD=new Color(.96f,.78f,.45f,1),INK=new Color(.24f,.12f,.06f,1),
        BONE=new Color(.96f,.92f,.84f,1),DARK=new Color(.03f,.015f,.015f,1),EMBER=new Color(1,.42f,.18f,1);
    private static final String[] WHO={"skeleton","dracula","pumpkin","voodoo","ghost"};
    private static final String[] CLUE={"Сок","Сад","Ньютон","Круглое…"};
    private static final int IMP=3;

    private final SpriteBatch batch=new SpriteBatch();private final ShapeRenderer shapes=new ShapeRenderer();
    private final PolygonSpriteBatch postBatch=new PolygonSpriteBatch();private final DeathPost post=new DeathPost();
    private final FitViewport viewport=new FitViewport(W,H);private final GlyphLayout gl=new GlyphLayout();
    private final Texture eye=com.erni.finalanswer.systembreach.host.SystemBreachRulesFilm.buttonEye();private final Texture room,back,front,envelope,stamp,print,note,frame,glow,pixel;private final Map<String,Texture> portraits=new HashMap<>();
    private final BitmapFont title,heading,hand,sub,small;
    private final Sound[] voice=new Sound[7];private Sound whoosh,paper,thud;private int voiced=-1;
    private final Matrix4 xf=new Matrix4();private final Vector2 tmp=new Vector2();
    private float time,skipAt=-1,tabPos=1;private boolean hover,stampPlayed;private int pass;

    public ImpostorRulesFilm(){
        room=tex("impostor/backgrounds/background1.png");back=tex("impostor/papers/papper_player_back.png");front=tex("impostor/papers/papper_player_front.png");
        envelope=tex("impostor/envelopes/envelop1.png");stamp=tex("impostor/voting/stamp.png");print=tex("impostor/voting/suspect_print.png");
        note=tex("impostor/papers/suspect_papper.png");frame=tex("impostor/portraits/impostor_avatar_frame.png");
        Pixmap g=new Pixmap(128,128,Pixmap.Format.RGBA8888);for(int y=0;y<128;y++)for(int x=0;x<128;x++){float d=Math.min(1,(float)Math.hypot(x-63.5,y-63.5)/63.5f);float v=(1-d)*(1-d);g.drawPixel(x,y,Color.rgba8888(1,1,1,v));}
        glow=new Texture(g);glow.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);g.dispose();
        Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
        title=UiFonts.gothic(132);heading=UiFonts.gothic(78);hand=UiFonts.handwriting(66);sub=font("NotoSans-SemiCondensedSemiBold.ttf",36);small=font("NotoSans-SemiCondensedSemiBold.ttf",22);
        if(Gdx.audio!=null)try{for(int i=0;i<voice.length;i++){var f=Gdx.files.internal("impostor/rules/rules_"+i+".wav");if(f.exists())voice[i]=Gdx.audio.newSound(f);}
            whoosh=snd("system_breach/sfx/whoosh.wav");paper=snd("sounds/impostor/page_turn.wav");thud=snd("sounds/impostor/wooden_stumb_hit.wav");}catch(RuntimeException ignored){}
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
    public void seek(float t){time=t;skipAt=-1;voiced=-1;stampPlayed=t>START[4]+1.6f;for(var v:voice)if(v!=null)v.stop();}

    public void render(float dt){
        time=Math.min(LENGTH,time+Math.min(dt,.1f));input();audio();
        post.begin();Gdx.gl.glViewport(0,0,DeathPost.SW,DeathPost.SH);ScreenUtils.clear(DARK);frame();post.end();
        ScreenUtils.clear(0,0,0,1);viewport.apply();
        float cut=99;for(int i=1;i<START.length;i++)cut=Math.min(cut,Math.abs(time-START[i]));
        float slam=time-(START[4]+1.6f);
        post.time=time;post.cx=.5f;post.cy=.55f;post.desat=0;post.aberration=.08f+(cut<.35f?.7f*(1-cut/.35f):0)+(slam>0&&slam<.3f?1.2f*(1-slam/.3f):0);
        if(slam>0&&slam<.6f){post.shock=slam*1.1f;post.shockStrength=1-slam/.6f;}else post.shock=-1;
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
        float target=s==4?W/2:s==3?W/2+(IMP-1.5f)*400:W/2;spotX+=(target-spotX)*Math.min(1,Gdx.graphics.getDeltaTime()*1.5f);
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
    private void headingText(String txt,float t,float a,Color c){
        if(pass==1){float p=ease(k(t,.1f,.7f));text(heading,txt,W/2,H-118+(1-p)*16,c,a*p,1);}
        if(pass==2){float sw=k(t,.4f,1.4f);if(sw>0&&sw<1)glowAt(W/2-300+600*ease(sw),H-150,260,c,.5f*a*MathUtils.sin(sw*MathUtils.PI));}
        if(pass==0){float p=ease(k(t,.2f,.9f));Color c0=new Color(c.r,c.g,c.b,0),c1=new Color(c.r,c.g,c.b,.85f*a);shapes.rect(W/2-300*p,H-200,300*p,2,c0,c1,c1,c0);shapes.rect(W/2,H-200,300*p,2,c1,c0,c0,c1);}
    }
    private void titleScene(float t,float a){
        if(pass==1){float pr=ease(k(t,.2f,1.6f));draw(print,W/2,H/2+40,560*(1.15f-.15f*pr),.16f*a*pr,time*2);
            float p=ease(k(t,.3f,1.3f));text(title,"THE IMPOSTOR",W/2,H/2+120+(1-p)*30,GOLD,a*p,1);
            float q=ease(k(t,1.2f,2f));text(heading,"САМОЗВАНЕЦ",W/2,H/2-10,BLOOD,a*q,1+.08f*(1-q));}
        if(pass==2){glowAt(W/2,H/2+60,1100,BLOOD,.22f*a*k(t,.3f,1.5f));glowAt(W/2,H/2+90,700,GOLD,.10f*a*k(t,.5f,1.5f));}
        if(pass==0){float w=ease(k(t,.6f,1.6f))*620;Color c0=new Color(GOLD.r,GOLD.g,GOLD.b,0),c1=new Color(GOLD.r,GOLD.g,GOLD.b,.8f*a);shapes.rect(W/2-w,H/2-70,w,2,c0,c1,c1,c0);shapes.rect(W/2,H/2-70,w,2,c1,c0,c0,c1);}
    }
    /** Five parchment cards are dealt, then flipped: four carry the word, one the hint. */
    private void roles(float t,float a){
        headingText("РОЛИ",t,a,GOLD);
        for(int i=0;i<5;i++){float d=ease(k(t,.4f+.22f*i,1.1f+.22f*i));float tx=W/2+(i-2)*300,ty=560;float x=MathUtils.lerp(W/2,tx,d),y=MathUtils.lerp(-200,ty,d);float rot=(1-d)*(i-2)*-18;
            float fl=k(t,2.4f+.35f*i,2.75f+.35f*i);float sx=Math.abs(MathUtils.cos(fl*MathUtils.PI));boolean shown=fl>.5f;boolean imp=i==IMP;
            float focus=k(t,5.4f,6.2f);float dim=imp?1:1-.45f*focus;float lift=imp?focus*30:0;float cw=250,ch=314;
            if(pass==1){b(0,0,0,.45f*a*d*dim);batch.draw(shown?front:back,x-cw/2*sx+12,y-ch/2-14+lift,cw/2*sx,ch/2,cw*sx,ch,1,1,rot,0,0,back.getWidth(),back.getHeight(),false,false);
                float sh=dim*(imp&&focus>0?1:.95f);b(sh,sh*(imp?.92f:1),sh*(imp?.9f:1),a*d);batch.draw(shown?front:back,x-cw/2*sx,y-ch/2+lift,cw/2*sx,ch/2,cw*sx,ch,1,1,rot,0,0,back.getWidth(),back.getHeight(),false,false);b(1,1,1,1);
                if(shown&&sx>.3f){if(imp){text(hand,"САМОЗВАНЕЦ",x,y+40+lift,BLOOD,a*dim,.56f*sx);text(small,"подсказка:",x,y-22+lift,INK,a*.9f,1);text(hand,"Еда",x,y-50+lift,INK,a,.7f*sx);}
                    else{text(small,"секретное слово",x,y+44+lift,INK,a*.8f*dim,1);text(hand,"ЯБЛОКО",x,y+8+lift,INK,a*dim,.8f*sx);}}}
            if(pass==2&&imp&&focus>0)glowAt(x,y+lift,520,BLOOD,.45f*a*focus*(.8f+.2f*MathUtils.sin(time*5)));
        }
        if(pass==1){float f=k(t,6,6.6f);text(sub,"Самозванец не знает слова",W/2+2*300-300,250,BLOOD,a*f,.9f);}
    }
    /** Portrait medallion: drop shadow, dark velvet disc, the character, a fine gold ring and a red rim light. */
    private void framed(String id,float x,float y,float w,float a,Color tint,float tintK){
        if(a<=0)return;float r=w*.42f;Texture p=portrait(id);
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
    private void clues(float t,float a){
        headingText("УЛИКИ",t,a,GOLD);
        if(pass==1){float p=ease(k(t,.3f,.9f));text(small,"СЕКРЕТНОЕ СЛОВО",W/2,H-232,BONE,a*.7f*p,1);text(hand,"ЯБЛОКО",W/2,H-252,GOLD,a*p,.8f);}
        for(int i=0;i<4;i++){float d=ease(k(t,.4f+.15f*i,1+.15f*i));float x=W/2+(i-1.5f)*400,y=600-(1-d)*60;
            if(pass==1){framed(WHO[i],x,y,230,a*d,BLOOD,0);
                float nx=x,ny=y-250;b(0,0,0,.4f*a*d);batch.draw(note,nx-118+8,ny-78-8,236,156);b(1,1,1,a*d);batch.draw(note,nx-118,ny-78,236,156);b(1,1,1,1);
                float tp=k(t,1.6f+.7f*i,2.2f+.7f*i);String c=CLUE[i];int n=(int)Math.ceil(c.length()*tp);
                if(n>0)text(hand,c.substring(0,n),nx,ny+22,i==IMP?BLOOD:INK,a,.72f);}
            if(pass==2&&i==IMP){float q=k(t,4.8f,5.4f);glowAt(x,y-250,380,BLOOD,.35f*a*q*(.7f+.3f*MathUtils.sin(time*6)));}
        }
        if(pass==1){float q=k(t,4.9f,5.4f);text(sub,"Хм… подозрительно?",W/2+1.5f*400,170,BLOOD,a*q,.85f);}
    }
    /** Detective board: red threads run from each accuser to the one they suspect; the suspect lights up. */
    private static final int[][] ENV={{0,3},{1,3},{2,1},{4,3}};
    private void suspicion(float t,float a){
        headingText("ПОДОЗРЕНИЕ",t,a,BLOOD);
        float[] px=new float[5],py=new float[5];for(int i=0;i<4;i++){px[i]=W/2+(i-1.5f)*400;py[i]=560+((i%2)*2-1)*40;}px[4]=W/2;py[4]=300;
        int[] got=new int[4];
        for(int e=0;e<ENV.length;e++){int from=ENV[e][0],to=ENV[e][1];float f=ease(k(t,.9f+.6f*e,1.6f+.6f*e));if(f<=0)continue;got[to]++;
            float x0=px[from],y0=py[from],x1=MathUtils.lerp(x0,px[to],f),y1=MathUtils.lerp(y0,py[to],f);float sag=60*(1-f*.4f);
            if(pass==0){int seg=24;float lx=x0,ly=y0;for(int q=1;q<=seg;q++){float u=q/(float)seg;float xx=MathUtils.lerp(x0,x1,u),yy=MathUtils.lerp(y0,y1,u)-MathUtils.sin(u*MathUtils.PI)*sag;
                shapes.setColor(0,0,0,.5f*a);shapes.rectLine(lx+4,ly-6,xx+4,yy-6,3.5f);shapes.setColor(BLOOD.r,BLOOD.g*.8f,BLOOD.b,.95f*a);shapes.rectLine(lx,ly,xx,yy,3f);lx=xx;ly=yy;}}
            if(pass==2&&f<1)glowAt(x1,y1,90,BLOOD,.7f*a);}
        for(int i=0;i<4;i++){float d=ease(k(t,.2f+.1f*i,.7f+.1f*i));float sus=i==IMP?k(t,3.4f,4f):0;if(pass==1){framed(WHO[i],px[i],py[i],230,a*d,BLOOD,sus);pin(px[i],py[i]+100,a*d);}}
        if(pass==1){float pa=ease(k(t,.4f,.8f));framed(WHO[4],px[4],py[4],150,a*pa,BLOOD,0);pin(px[4],py[4]+66,a*pa);
            for(int i=0;i<4;i++)if(got[i]>0)text(heading,"×"+got[i],px[i]+130,py[i]-110,i==IMP?BLOOD:GOLD,a*k(t,3,3.4f),.62f);}
        if(pass==2)glowAt(px[IMP],py[IMP],560,BLOOD,.4f*a*k(t,3.4f,4f)*(.8f+.2f*MathUtils.sin(time*6)));
    }
    private void pin(float x,float y,float a){b(0,0,0,.5f*a);batch.draw(glow,x-14+4,y-14-6,28,28);b(.75f,.08f,.06f,a);batch.draw(glow,x-11,y-11,22,22);b(1,.7f,.6f,a);batch.draw(glow,x-5,y-1,8,8);b(1,1,1,1);}
    /** The blood stamp slams onto the suspect's sheet. */
    private void vote(float t,float a){
        headingText("ГОЛОСОВАНИЕ",t,a,BLOOD);
        float x=W/2,y=520;float sw=440,sh=sw*note.getHeight()/(float)note.getWidth();
        if(pass==1){b(0,0,0,.5f*a);batch.draw(note,x-sw/2+14,y-sh/2-14,sw,sh);b(1,1,1,a);batch.draw(note,x-sw/2,y-sh/2,sw,sh);
            Texture p=portrait(WHO[IMP]);if(p!=null){b(1,1,1,a);batch.draw(p,x-110,y-30,220,220);}b(1,1,1,1);
            text(hand,"Подозреваемый",x,y-120,INK,a,.75f);}
        float hit=1.6f,f=k(t,.4f,hit);float lift=t<hit?(1-ease(f))*620:t<hit+.25f?(t-hit)/.25f*-0+0:ease(k(t,hit+.5f,hit+1.3f))*700;float sq=t>=hit&&t<hit+.15f?.92f:1;
        if(t>=hit){float pk=Math.min(1,(t-hit)/.12f);if(pass==1){b(1,1,1,a*pk);float s=300*(1.25f-.25f*pk);batch.draw(print,x-s/2,y+30-s/2,s,s);b(1,1,1,1);}
            if(pass==2){float fl=Math.max(0,1-(t-hit)/.5f);glowAt(x,y,900,BLOOD,.6f*a*fl);}}
        if(pass==1&&lift<690){float st=330;b(0,0,0,.35f*a*(1-lift/700));batch.draw(stamp,x-st/2+30,y-60-30,st,st);b(1,1,1,a);batch.draw(stamp,x-st/2,y-40+lift,st,st*sq);b(1,1,1,1);}
    }
    private void result(float t,float a){
        headingText("ИТОГ",t,a,GOLD);
        float l=ease(k(t,.3f,.9f)),r=ease(k(t,2.6f,3.2f));
        if(pass==0){panel(W/2-760,330,700,420,GOLD,a*l);panel(W/2+60,330,700,420,BLOOD,a*r);}
        if(pass==1){framed(WHO[IMP],W/2-410,600,190,a*l,BLOOD,0);text(sub,"Самозванец пойман",W/2-410,440,BONE,a*l,1);text(heading,"ПОБЕДА МИРНЫХ",W/2-410,395,GOLD,a*l,.62f);
            framed(WHO[1],W/2+410,600,190,a*r,BLOOD,0);text(sub,"Выгнали невиновного",W/2+410,440,BONE,a*r,1);text(heading,"ПОБЕДА САМОЗВАНЦА",W/2+410,395,BLOOD,a*r,.62f);
            if(r>0){b(1,1,1,.55f*a*r);batch.draw(print,W/2+410-120,600-120,240,240);b(1,1,1,1);}}
        if(pass==2){glowAt(W/2-410,540,700,GOLD,.18f*a*l);glowAt(W/2+410,540,700,BLOOD,.25f*a*r);}
    }
    private void finale(float t,float a){
        float p=ease(k(t,1.1f,1.7f)),q=ease(k(t,.1f,.6f));
        if(pass==1){draw(print,W/2,H/2+30,640*(1.3f-.3f*p),.35f*a*p,0);text(heading,"Ну что ж…",W/2,H/2+190,BONE,a*q*(1-p*.4f),.8f);
            text(title,"НАЙДИТЕ САМОЗВАНЦА!",W/2,H/2+60,BLOOD,a*p,.62f*(1+.25f*(1-p)));}
        if(pass==2)glowAt(W/2,H/2+40,1200,BLOOD,.35f*a*p*(.85f+.15f*MathUtils.sin(time*4)));
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
        text(small,"THE IMPOSTOR  ·  ПРАВИЛА",60,H-30,GOLD,.7f,.85f,false);
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
        if(!stampPlayed&&time>=START[4]+1.6f&&time<START[4]+2){stampPlayed=true;if(thud!=null)thud.play(.8f);}
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
        for(Texture t:new Texture[]{eye,room,back,front,envelope,stamp,print,note,frame,glow,pixel})t.dispose();for(Texture t:portraits.values())if(t!=null)t.dispose();if(ringTex!=null)ringTex.dispose();
        for(BitmapFont f:new BitmapFont[]{title,heading,hand,sub,small})f.dispose();batch.dispose();shapes.dispose();postBatch.dispose();post.dispose();
    }
}
