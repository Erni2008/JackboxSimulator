package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.GlyphLayout;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Disposable;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;

/**
 * SYSTEM BREACH rules film shown on the host screen before the mode: nine animated scenes (password, questions, keys,
 * hacking, defence, sabotage, surge and market, winner) with subtitles. Pure presentation — no game state. Drawn at a
 * fixed 1920×1080; {@link #done()} turns true at the end, {@link #skip()} jumps there.
 */
public final class SystemBreachRulesFilm implements Disposable {
    public static final float W=1920,H=1080;
    private static final float[] START={0,5.5f,13,23,30.5f,42,51,61,68},END={5.5f,13,23,30.5f,42,51,61,68,77};
    public static final float LENGTH=77;
    private static final String[] SUB={
        "Добро пожаловать в сеть. Здесь каждый из вас — хакер.",
        "Перед стартом каждый выбирает секретный пароль. Никому его не показывай!",
        "Отвечай на вопросы на своём телефоне. Каждый верный ответ приносит очки доступа — AP.",
        "Каждые три верных ответа дают ключ. Без ключа атаковать нельзя.",
        "Выбери соперника и угадай его пароль. Угадал — забираешь его AP себе.",
        "Ставь фаервол: чем он сильнее, тем дороже и труднее тебя взломать. Множитель увеличивает награду.",
        "Мешай соперникам: вирус ломает экран, DDoS тормозит кнопки, а приманка ловит того, кто нападёт на тебя.",
        "Следи за сбоями системы — очки удваиваются. А на чёрном рынке есть щит, разгон и сканер.",
        "Побеждает тот, у кого в конце больше всего AP."};
    private static final Color CYAN=new Color(.25f,.86f,1,1),GREEN=new Color(.3f,1,.55f,1),RED=new Color(1,.27f,.3f,1),
        VIOLET=new Color(.72f,.42f,1,1),AMBER=new Color(1,.72f,.2f,1),INK=new Color(.03f,.06f,.11f,1),PANEL=new Color(.05f,.1f,.17f,1),WHITE=new Color(.92f,.97f,1,1);
    private final SystemBreachHostAssets assets;private final boolean ownAssets;
    private final SpriteBatch batch=new SpriteBatch();private final ShapeRenderer shapes=new ShapeRenderer();
    private final FitViewport viewport=new FitViewport(W,H);private final GlyphLayout gl=new GlyphLayout();
    private float time;private int pass;private ShapeRenderer r;private SpriteBatch b;
    private static final String GLYPHS="ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&@";

    public SystemBreachRulesFilm(boolean ru){this(new SystemBreachHostAssets(ru),true);}
    SystemBreachRulesFilm(SystemBreachHostAssets a,boolean own){assets=a;ownAssets=own;}
    public void resize(int w,int h){viewport.update(w,h,true);}
    public boolean done(){return time>=LENGTH;}
    public void skip(){time=LENGTH;}
    public void seek(float t){time=t;}
    public float time(){return time;}

    public void render(float dt){
        time=Math.min(LENGTH,time+Math.min(dt,.1f));
        ScreenUtils.clear(INK);viewport.apply();
        shapes.setProjectionMatrix(viewport.getCamera().combined);batch.setProjectionMatrix(viewport.getCamera().combined);
        Gdx.gl.glEnable(GL20.GL_BLEND);
        int s=scene();float lt=time-START[s];
        // backdrop
        b=batch;batch.begin();batch.setColor(.32f,.42f,.55f,1);batch.draw(assets.background,0,0,W,H);batch.setColor(Color.WHITE);batch.end();
        r=shapes;Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);shapes.begin(ShapeRenderer.ShapeType.Filled);backdrop();pass=0;scene(s,lt);shapes.end();
        batch.begin();batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);pass=2;ambient();scene(s,lt);
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);pass=1;scene(s,lt);batch.end();
        // chrome: progress, subtitles, transition wipe
        Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);shapes.begin(ShapeRenderer.ShapeType.Filled);chromeShapes(s,lt);shapes.end();
        batch.begin();chromeText(s,lt);batch.end();
    }
    private int scene(){for(int i=START.length-1;i>=0;i--)if(time>=START[i])return i;return 0;}

    // ---------- backdrop ----------
    private void backdrop(){
        // perspective floor grid sliding toward the viewer
        float hy=430;
        for(int i=-14;i<=14;i++){float x0=W/2+i*48,x1=W/2+i*260;col(CYAN,.07f);r.rectLine(x0,hy,x1,0,1.5f);}
        for(int i=0;i<12;i++){float f=((i+time*.6f)%12)/12f;float y=hy-hy*f*f;col(CYAN,.10f*f);r.rectLine(0,y,W,y,1.5f);}
        col(INK,.7f);r.rect(0,0,W,H);
    }
    private void ambient(){
        b.setColor(CYAN.r,CYAN.g,CYAN.b,.10f);b.draw(assets.glow,W/2-900,H/2-500,1800,1000);
        for(int i=0;i<26;i++){float h1=hash(i),h2=hash(i*3+1);float x=h1*W,y=((h2*H+time*(20+40*h1))%H);float s=4+6*h2;
            b.setColor(CYAN.r,CYAN.g,CYAN.b,.25f);b.draw(assets.glow,x-s,y-s,s*2,s*2);}
        b.setColor(Color.WHITE);
    }

    // ---------- scenes ----------
    private void scene(int s,float t){
        float in=ease(k(t,0,.5f)),out=1-ease(k(t,END[s]-START[s]-.45f,END[s]-START[s]));float a=in*out;
        switch(s){case 0->title(t,a);case 1->password(t,a);case 2->questions(t,a);case 3->keys(t,a);case 4->hack(t,a);
            case 5->defence(t,a);case 6->weapons(t,a);case 7->surge(t,a);default->finale(t,a);}
    }
    private void heading(String ru,float t,float a,Color c){
        if(pass!=1)return;float p=k(t,.1f,.8f);text(assets.stage,decode(ru,p,t),W/2,H-120,c,a,.72f);
    }
    private void headingBar(float t,float a,Color c){
        if(pass!=0)return;float p=ease(k(t,.2f,.9f));col(c,.8f*a);r.rect(W/2-260*p,H-196,520*p,3);
    }

    private void title(float t,float a){
        float p=k(t,.3f,1.6f);
        if(pass==0){float w=ease(k(t,.2f,1))*780;col(CYAN,.9f*a);r.rect(W/2-w,H/2-6,w*2,3);r.rect(W/2-w,H/2-150,w*2,2);
            hexRing(W/2,H/2+40,330+20*MathUtils.sin(t*1.4f),a*.25f,t*.2f);hexRing(W/2,H/2+40,380,a*.12f,-t*.15f);}
        if(pass==2){glow(W/2,H/2+60,700,CYAN,.30f*a);}
        if(pass==1){text(assets.title,decode("SYSTEM BREACH",p,t),W/2,H/2+110,WHITE,a,1.5f);
            text(assets.stage,decode("ВЗЛОМ СИСТЕМЫ",k(t,1.2f,2.3f),t),W/2,H/2-40,CYAN,a*k(t,1.1f,1.4f),.62f);
            text(assets.log,"ПРАВИЛА  ·  1 / 8",W/2,H/2-175,WHITE,a*.6f*k(t,2,2.6f),1);}
    }

    private static final String[] PASS={"NOVA7","ZER0X","K1LLR"};
    private void password(float t,float a){
        heading("ПАРОЛЬ",t,a,CYAN);headingBar(t,a,CYAN);
        float cx=W/2,cy=520;int chosen=1;float pick=k(t,2.6f,3.2f),lock=k(t,3.6f,4.4f);
        // portrait
        portraitFrame("skeleton",cx-560,cy-20,240,a,CYAN);
        for(int i=0;i<3;i++){float d=ease(k(t,.5f+.25f*i,1.1f+.25f*i));float x=cx-60+i*290,y=cy+60;boolean sel=i==chosen;
            float lift=sel?ease(pick)*30:0;float fade=sel?1:1-.7f*ease(pick);float ty=y+lift-(1-d)*60;
            if(sel){x=MathUtils.lerp(x,cx+230,ease(lock));ty=MathUtils.lerp(ty,cy-150,ease(lock));}
            if(pass==0){panel(x-120,ty-50,240,100,sel&&pick>0?GREEN:CYAN,a*d*fade);}
            if(pass==2&&sel&&pick>0){glow(x,ty,180,GREEN,.25f*a*pick);}
            if(pass==1){String w=sel&&lock>.6f?"*****":PASS[i];text(assets.digits,w,x,ty+30,sel&&pick>0?GREEN:WHITE,a*d*fade,.55f);}
        }
        // padlock
        float lx=cx+230,ly=cy-250;if(lock>0){
            if(pass==0){float c=ease(k(t,4.4f,4.8f));col(GREEN,a*lock);r.rect(lx-55,ly-50,110,80);col(INK,a*lock);r.rect(lx-45,ly-40,90,60);
                col(GREEN,a*lock);arcLine(lx,ly+30+18*(1-c),36,0,180,9);col(GREEN,a*lock);r.circle(lx,ly-12,9,16);r.rect(lx-3,ly-30,6,18);}
            if(pass==2)glow(lx,ly,220,GREEN,.3f*a*k(t,4.4f,5));
            if(pass==1)text(assets.board,"ПАРОЛЬ ЗАКРЫТ",lx,ly-80,GREEN,a*k(t,4.6f,5.1f),1);}
        if(pass==1)text(assets.name,"ТЫ",cx-560,cy-170,WHITE,a,1);
    }

    private void questions(float t,float a){
        heading("ВОПРОСЫ  =  AP",t,a,CYAN);headingBar(t,a,CYAN);
        float px=W/2-360,py=520,pw=420,ph=640;float rise=ease(k(t,.2f,1));py-=(1-rise)*120;
        // phone
        if(pass==0){col(Color.BLACK,.5f*a);r.rect(px-pw/2+10,py-ph/2-14,pw,ph);round(px-pw/2,py-ph/2,pw,ph,40,new Color(.12f,.16f,.22f,1),a);
            round(px-pw/2+16,py-ph/2+16,pw-32,ph-32,28,PANEL,a);col(CYAN,.6f*a);r.rect(px-50,py+ph/2-34,100,6);}
        boolean second=t>5.6f;float qt=second?t-5.6f:t;
        String q=second?"Столица Австралии?":"2 + 2 × 2 = ?";String[] o=second?new String[]{"Сидней","Канберра","Мельбурн","Перт"}:new String[]{"8","6","4","10"};
        int correct=1,picked=second?0:1;float tap=k(qt,2.2f,2.5f),res=k(qt,2.5f,2.8f);
        if(pass==1)text(assets.board,decode(q,k(qt,.6f,1.3f),t),px,py+190,WHITE,a,1.05f);
        for(int i=0;i<4;i++){float d=ease(k(qt,1+.12f*i,1.4f+.12f*i));float bx=px,by=py+80-i*104;
            boolean isPick=i==picked;Color c=isPick&&res>0?(picked==correct?GREEN:RED):CYAN;
            if(pass==0){float press=isPick?(1-.05f*MathUtils.sin(tap*MathUtils.PI)):1;round(bx-160*press,by-38*press,320*press,76*press,16,isPick&&res>0?c:new Color(.1f,.2f,.3f,1),a*d*(isPick&&res>0?.85f:1));}
            if(pass==1)text(assets.board,o[i],bx,by+12,isPick&&res>0?INK:WHITE,a*d,1);
        }
        // finger tap ripple
        float fy=py+80-picked*104;if(pass==2&&tap>0&&tap<1)glow(px+60,fy,120*tap+40,WHITE,.5f*(1-tap)*a);
        // AP counter on the right
        float cx=W/2+330,cy=600;int ap=second?110:MathUtils.round(100+10*ease(k(qt,3,3.8f)));if(!second&&qt<3)ap=100;
        if(pass==0){panel(cx-210,cy-110,420,220,second&&res>0?RED:GREEN,a);}
        if(pass==1){text(assets.log,"ОЧКИ ДОСТУПА",cx,cy+80,WHITE,a*.8f,1);text(assets.digits,ap+" AP",cx,cy+30,second&&res>0?WHITE:GREEN,a,.9f);}
        // flying +10
        if(!second){float f=k(qt,2.8f,3.6f);if(f>0&&f<1){float x=MathUtils.lerp(px+120,cx,ease(f)),y=MathUtils.lerp(fy,cy,ease(f))+MathUtils.sin(f*MathUtils.PI)*140;
            if(pass==2)glow(x,y,90,GREEN,.6f*a);if(pass==1)text(assets.ap,"+10",x,y+14,GREEN,a,1.3f);}}
        if(pass==1){float v=second?k(qt,2.7f,3.1f):k(qt,3.6f,4.1f);
            text(assets.board,second?"Ошибка — без награды":"Верно!  +10 AP",cx,cy-170,second?RED:GREEN,a*v,1.1f);}
    }

    private void keys(float t,float a){
        heading("КЛЮЧ",t,a,AMBER);headingBar(t,a,AMBER);
        float cy=560;
        for(int i=0;i<3;i++){float on=k(t,.8f+.8f*i,1.1f+.8f*i);float x=W/2-260+i*260,y=cy+120;float merge=ease(k(t,3.6f,4.4f));
            x=MathUtils.lerp(x,W/2,merge);y=MathUtils.lerp(y,cy-20,merge);
            if(pass==0){col(on>0?GREEN:CYAN,a*(1-merge*.9f));r.circle(x,y,46,32);col(INK,a*(1-merge*.9f));r.circle(x,y,38,32);
                if(on>0){col(GREEN,a*(1-merge)*on);float s=24*on;r.rectLine(x-s*.6f,y,x-s*.15f,y-s*.5f,7);r.rectLine(x-s*.15f,y-s*.5f,x+s*.7f,y+s*.5f,7);}}
            if(pass==2&&on>0)glow(x,y,120,GREEN,.35f*a*on*(1-merge));
            if(pass==1&&merge<.3f)text(assets.log,"ВЕРНО "+(i+1),x,y-70,WHITE,a*.8f*(1-merge*3),1);}
        float kk=ease(k(t,4.3f,5));
        if(kk>0){float s=1+.15f*MathUtils.sin(Math.max(0,t-4.3f)*3);float x=W/2,y=cy-20;
            if(pass==2){glow(x,y,420*kk,AMBER,.45f*a);}
            if(pass==0)keyShape(x,y,1.6f*kk*s,AMBER,a);
            if(pass==1)text(assets.stage,"+1 КЛЮЧ",x,y-170,AMBER,a*kk,.6f);}
    }

    private void hack(float t,float a){
        heading("ВЗЛОМ",t,a,RED);headingBar(t,a,RED);
        float ax=W/2-560,tx=W/2+560,y=560;
        portraitFrame("skeleton",ax,y,220,a,CYAN);portraitFrame("dracula",tx,y,220,a,t>6.2f?RED:CYAN);
        if(pass==1){text(assets.name,"ТЫ",ax,y-150,CYAN,a,1);text(assets.name,"СОПЕРНИК",tx,y-150,WHITE,a,1);}
        // key spent
        float spend=k(t,.6f,1.4f);if(spend<1&&spend>0&&pass==0)keyShape(ax,y+190-60*spend,.7f,AMBER,a*(1-spend));
        // beam
        float beam=ease(k(t,1.2f,2.2f));
        if(pass==0&&beam>0){col(RED,.5f*a);r.rectLine(ax+130,y,ax+130+(tx-ax-260)*beam,y,4);
            for(int i=0;i<10;i++){float f=((t*1.3f+i/10f)%1);if(f<beam){float x=ax+130+(tx-ax-260)*f;col(RED,a);r.rect(x-8,y-4,16,8);}}}
        if(pass==2&&beam>0)for(int i=0;i<10;i++){float f=((t*1.3f+i/10f)%1);if(f<beam)glow(ax+130+(tx-ax-260)*f,y,40,RED,.5f*a);}
        // password field above beam: tries, then the hit
        float fx=W/2,fy=y+180;
        if(pass==0)panel(fx-220,fy-50,440,100,t>6.2f?GREEN:RED,a*beam);
        if(pass==1&&beam>0){String shown;Color c=WHITE;
            if(t<3.2f)shown="?????";else if(t<4.2f)shown="NOVA7";else if(t<5.2f)shown="K1LLR";else if(t<6.2f)shown=decode("ZER0X",k(t,5.2f,6.2f),t);else{shown="ZER0X";c=GREEN;}
            boolean miss=(t>=3.6f&&t<4.2f)||(t>=4.6f&&t<5.2f);if(miss)c=RED;
            text(assets.digits,shown,fx,fy+30,c,a,.6f);
            text(assets.log,miss?"НЕВЕРНО":t>6.2f?"ДОСТУП ПОЛУЧЕН":"ПОДБОР ПАРОЛЯ…",fx,fy-70,miss?RED:t>6.2f?GREEN:WHITE,a*.9f,1);}
        // stamp on target
        float st=k(t,6.2f,6.5f);if(st>0){float sc=1+.6f*(1-ease(st));
            if(pass==0)panel(tx-170*sc,y+170-30*sc,340*sc,60*sc,RED,a*st);
            if(pass==2)glow(tx,y+170,300,RED,.4f*a*st);
            if(pass==1)text(assets.board,"ВЗЛОМАН",tx,y+170+14,RED,a*st,1.3f*sc);}
        // AP stream back to attacker
        float flow=k(t,7,10);if(flow>0&&flow<1)for(int i=0;i<14;i++){float f=((flow*3+i/14f)%1);float x=MathUtils.lerp(tx-120,ax+120,f),yy=y-110+MathUtils.sin(f*MathUtils.PI)*-90;
            if(pass==2)glow(x,yy,46,GREEN,.7f*a);}
        if(pass==1&&t>7)text(assets.stage,"+40 AP",ax,y+250,GREEN,a*k(t,7.2f,7.8f),.55f);
    }

    private void defence(float t,float a){
        heading("ЗАЩИТА",t,a,CYAN);headingBar(t,a,CYAN);
        float x=W/2-200,y=540;int lvl=t<2.6f?1:t<4.2f?2:3;
        portraitFrame("ghost",x,y,200,a,CYAN);
        for(int i=0;i<lvl;i++){float on=ease(k(t,i==0?.3f:i==1?2.6f:4.2f,(i==0?.3f:i==1?2.6f:4.2f)+.5f));hexRing(x,y,170+i*44,a*on*.9f,t*(i%2==0?.3f:-.25f));}
        if(pass==2)glow(x,y,520,CYAN,.18f*a*lvl);
        // incoming attacks bounce
        for(int j=0;j<3;j++){float st=1.2f+j*2.2f,f=k(t,st,st+.9f);if(f<=0||f>=1)continue;float r0=170+(lvl-1)*44;
            float ang=MathUtils.PI*(.15f+j*.12f);float dist=f<.6f?MathUtils.lerp(900,r0,f/.6f):MathUtils.lerp(r0,r0+260,(f-.6f)/.4f);
            float px=x+MathUtils.cos(ang)*dist,py=y+MathUtils.sin(ang)*dist*.6f;
            if(pass==0){col(RED,a*(f<.6f?1:1-(f-.6f)/.4f));r.circle(px,py,10,12);}
            if(pass==2){glow(px,py,60,RED,.6f*a);if(f>.55f&&f<.75f)glow(x+MathUtils.cos(ang)*r0,y+MathUtils.sin(ang)*r0*.6f,200,CYAN,.6f*a);}}
        if(pass==1&&((t>1.75f&&t<2.6f)||(t>3.95f&&t<4.8f)||(t>6.15f&&t<7)))text(assets.board,"АТАКА ОТБИТА",x,y+270,CYAN,a,1.2f);
        // right column: upgrade panels
        float rx=W/2+420;
        if(pass==0){panel(rx-230,y+20,460,150,CYAN,a);panel(rx-230,y-200,460,150,AMBER,a*k(t,5,5.5f));
            for(int i=0;i<3;i++){col(i<lvl?CYAN:new Color(.15f,.25f,.35f,1),a);r.rect(rx-180+i*125,y+40,110,26);}}
        if(pass==1){text(assets.log,"ФАЕРВОЛ",rx,y+150,WHITE,a*.8f,1);
            text(assets.board,"Уровень "+lvl+" из 3",rx,y+115,CYAN,a,1.1f);
            float m=k(t,5,5.5f);text(assets.log,"МНОЖИТЕЛЬ",rx,y-70,WHITE,a*.8f*m,1);text(assets.digits,t<6.3f?"×1.0":"×1.5",rx,y-95,AMBER,a*m,.75f);}
    }

    private void weapons(float t,float a){
        heading("ОРУЖИЕ ХАКЕРА",t,a,VIOLET);headingBar(t,a,VIOLET);
        String[] n={"ВИРУС","DDoS","ПРИМАНКА"};String[] d={"ломает экран соперника","тормозит его кнопки","наказывает нападающего"};Color[] c={VIOLET,RED,AMBER};
        for(int i=0;i<3;i++){float in=ease(k(t,.4f+.5f*i,1+.5f*i));float x=W/2-560+i*560,y=520-(1-in)*100;float act=k(t,2.4f+2.2f*i,2.8f+2.2f*i)*(1-k(t,4.4f+2.2f*i,4.8f+2.2f*i));float act2=Math.max(act,i==2?k(t,8.4f,8.8f):0);
            float sc=1+.06f*act2;
            if(pass==0){panel(x-230*sc,y-210*sc,460*sc,420*sc,c[i],a*in);
                // mini screens
                float sx=x,sy=y+40;round(sx-150,sy-90,300,180,14,new Color(.07f,.12f,.2f,1),a*in);
                if(i==0&&act2>0)for(int k=0;k<9;k++){float hy=sy-90+hash((int)(t*14)+k*13)*170;col(k%2==0?VIOLET:CYAN,.8f*a*act2);r.rect(sx-150+hash(k+(int)(t*20))*60,hy,240*hash(k*7+(int)(t*9)),8);}
                if(i==1){for(int k=0;k<3;k++){col(CYAN,a*in*(act2>0&&((int)(t*3)+k)%3!=0?.25f:.9f));r.rect(sx-120,sy+40-k*55,240,38);}
                    if(act2>0)for(int k=0;k<12;k++){float f=((t*2+k/12f)%1);col(RED,a*act2);r.rect(sx-150+f*300,sy+70-k*13,14,5);}}
                if(i==2){keyShape(sx,sy,.8f,AMBER,a*in);if(act2>0){float sn=ease(Math.min(1,act2*2));col(RED,a*sn);r.rectLine(sx-110,sy+70,sx+110,sy-70,8);r.rectLine(sx-110,sy-70,sx+110,sy+70,8);}}
            }
            if(pass==2&&act2>0)glow(x,y,420,c[i],.3f*a*act2);
            if(pass==1){text(assets.stageName,n[i],x,y-80,c[i],a*in,.85f);text(assets.board,d[i],x,y-150,WHITE,a*in*.9f,.95f);}
        }
    }

    private void surge(float t,float a){
        heading("СБОИ И РЫНОК",t,a,AMBER);headingBar(t,a,AMBER);
        float fl=t>.6f&&t<3.2f?(MathUtils.sin(t*22)>.3f?1:.55f):0;
        if(pass==0&&t<3.6f){float p=ease(k(t,.4f,.8f))*(1-ease(k(t,3.2f,3.6f)));panel(W/2-480,560,960,170,AMBER,a*p);
            col(AMBER,a*p*fl);bolt(W/2-400,645,1.1f);bolt(W/2+400,645,1.1f);}
        if(pass==2&&t<3.6f)glow(W/2,645,900,AMBER,.35f*a*fl);
        if(pass==1&&t<3.6f){float p=1-ease(k(t,3.2f,3.6f));text(assets.stage,"СБОЙ СИСТЕМЫ  ×2",W/2,690,AMBER,a*p*k(t,.5f,.9f),.7f);text(assets.board,"20 секунд двойных очков",W/2,610,WHITE,a*p*k(t,.8f,1.2f),1);}
        String[] n={"ЩИТ","РАЗГОН","СКАНЕР"},d={"сжигает одну атаку","3 ответа ×2","подсказка пароля лидера"};Color[] c={CYAN,AMBER,GREEN};
        for(int i=0;i<3;i++){float in=ease(k(t,3.6f+.35f*i,4.2f+.35f*i));float x=W/2-480+i*480,y=470-(1-in)*80;
            if(pass==0){panel(x-200,y-130,400,260,c[i],a*in);}
            if(pass==1){text(assets.stageName,n[i],x,y+60,c[i],a*in,.8f);text(assets.board,d[i],x,y-20,WHITE,a*in*.9f,.95f);}}
        if(pass==1)text(assets.log,"ЧЁРНЫЙ РЫНОК",W/2,700,WHITE,a*k(t,3.8f,4.3f),1.4f);
    }

    private static final String[] FIN={"skeleton","dracula","pumpkin","voodoo"};
    private void finale(float t,float a){
        heading("ПОБЕДИТЕЛЬ",t,a,GREEN);headingBar(t,a,GREEN);
        float go=k(t,5.4f,5.9f);float a0=a;a*=1-go;
        float[] h={.55f,1f,.4f,.7f};float base=260;
        for(int i=0;i<4;i++){float x=W/2-480+i*320;float g=ease(k(t,.4f+.15f*i,2.6f+.15f*i))*h[i]*420;boolean win=i==1;
            if(pass==0){col(win?GREEN:CYAN,a*.85f);r.rect(x-80,base,160,g);col(INK,.35f*a);r.rect(x-80,base+g-6,160,6);}
            if(pass==2&&win&&t>2.8f)glow(x,base+g,360,GREEN,.4f*a);
            portraitFrame(FIN[i],x,base+g+90,140,a,win&&t>2.8f?GREEN:CYAN);
            if(pass==1)text(assets.ap,MathUtils.round(g/420*260)+" AP",x,base-24,WHITE,a,1.1f);
            if(win&&t>2.8f&&pass==0){float cy=base+g+190+6*MathUtils.sin(t*3);crown(x,cy,AMBER,a*k(t,2.8f,3.2f));}}
        a=a0;
        if(go>0){
            if(pass==2)glow(W/2,H/2,900,RED,.3f*a*go);
            if(pass==1){text(assets.stage,decode("ГОТОВЫ?",k(t,5.4f,6.1f),t),W/2,H/2+110,WHITE,a*go,1.1f);
                text(assets.stage,decode("ВЗЛАМЫВАЕМ!",k(t,6.3f,7.2f),t),W/2,H/2-40,RED,a*k(t,6.2f,6.5f),1.25f);}}
    }

    // ---------- chrome ----------
    private void chromeShapes(int s,float t){
        // subtitle plate
        float a=ease(k(t,.3f,.7f))*(1-ease(k(t,END[s]-START[s]-.35f,END[s]-START[s])));
        if(s>0){col(Color.BLACK,.62f*a);r.rect(W/2-820,40,1640,110);col(CYAN,.8f*a);r.rect(W/2-820,148,1640,2);}
        // progress pips
        for(int i=1;i<9;i++){float x=W/2-(8*34)/2f+(i-1)*34+17;col(i<s?CYAN:i==s?WHITE:new Color(.2f,.3f,.4f,1),i==s?1:.8f);r.rect(x-12,H-40,24,4);}
        // scene transition wipe
        float into=t,outOf=END[s]-START[s]-t;float w=Math.min(into,outOf);
        if(w<.25f&&time<LENGTH-.3f){float f=1-w/.25f;col(CYAN,.35f*f);float y=(into<outOf?1-into/.25f:outOf/.25f)*H;r.rect(0,y-2,W,4);col(CYAN,.08f*f);r.rect(0,y-40,W,80);}
        // fade to black at the end
        if(time>LENGTH-1){col(Color.BLACK,k(time,LENGTH-1,LENGTH));r.rect(0,0,W,H);}
    }
    private void chromeText(int s,float t){
        if(s==0)return;float a=ease(k(t,.3f,.7f))*(1-ease(k(t,END[s]-START[s]-.35f,END[s]-START[s])));
        String full=SUB[s];int n=Math.min(full.length(),(int)(Math.max(0,t-.3f)*55));
        BitmapFont f=assets.stageName;float sc=.62f;f.getData().setScale(sc);gl.setText(f,full,Color.WHITE,1560,com.badlogic.gdx.utils.Align.center,true);
        float y=95+gl.height/2;f.setColor(WHITE.r,WHITE.g,WHITE.b,a);f.draw(b,full.substring(0,n),W/2-780,y,1560,com.badlogic.gdx.utils.Align.center,true);
        f.getData().setScale(1);f.setColor(Color.WHITE);
        text(assets.log,"SYSTEM BREACH  ·  ПРАВИЛА",120,H-30,CYAN,.7f,1,false);
    }

    // ---------- primitives ----------
    private void portraitFrame(String id,float x,float y,float s,float a,Color c){
        if(pass==0){col(c,a);r.rect(x-s/2-5,y-s/2-5,s+10,s+10);col(INK,a);r.rect(x-s/2,y-s/2,s,s);
            col(c,a);float k=24;r.rect(x-s/2-12,y+s/2+4,k,4);r.rect(x+s/2+12-k,y-s/2-8,k,4);}
        if(pass==2)glow(x,y,s*1.6f,c,.18f*a);
        if(pass==1){Texture tex=assets.portrait(id);if(tex!=null){b.setColor(1,1,1,a);b.draw(tex,x-s/2,y-s/2,s,s);b.setColor(Color.WHITE);}}
    }
    private void panel(float x,float y,float w,float h,Color c,float a){
        if(a<=0)return;col(PANEL,.92f*a);r.rect(x,y,w,h);col(c,a);r.rect(x,y,w,2);r.rect(x,y+h-2,w,2);r.rect(x,y,2,h);r.rect(x+w-2,y,2,h);
        float k=18;r.rect(x-4,y+h-4,k,6);r.rect(x+w-k+4,y-2,k,6);
    }
    private void round(float x,float y,float w,float h,float rad,Color c,float a){
        col(c,a);r.rect(x+rad,y,w-2*rad,h);r.rect(x,y+rad,rad,h-2*rad);r.rect(x+w-rad,y+rad,rad,h-2*rad);
        r.circle(x+rad,y+rad,rad,16);r.circle(x+w-rad,y+rad,rad,16);r.circle(x+rad,y+h-rad,rad,16);r.circle(x+w-rad,y+h-rad,rad,16);
    }
    private void hexRing(float x,float y,float rad,float a,float rot){
        if(pass!=0||a<=0)return;col(CYAN,a);for(int i=0;i<6;i++){float a0=rot+i*MathUtils.PI/3,a1=a0+MathUtils.PI/3;r.rectLine(x+MathUtils.cos(a0)*rad,y+MathUtils.sin(a0)*rad,x+MathUtils.cos(a1)*rad,y+MathUtils.sin(a1)*rad,4);}
    }
    private void arcLine(float x,float y,float rad,float from,float to,float w){
        for(int i=0;i<12;i++){float a0=(from+(to-from)*i/12f)*MathUtils.degRad,a1=(from+(to-from)*(i+1)/12f)*MathUtils.degRad;r.rectLine(x+MathUtils.cos(a0)*rad,y+MathUtils.sin(a0)*rad,x+MathUtils.cos(a1)*rad,y+MathUtils.sin(a1)*rad,w);}
    }
    private void keyShape(float x,float y,float s,Color c,float a){
        if(pass!=0||a<=0)return;col(c,a);r.circle(x-60*s,y,38*s,28);col(INK,a);r.circle(x-60*s,y,18*s,20);col(c,a);
        r.rect(x-26*s,y-9*s,110*s,18*s);r.rect(x+50*s,y-36*s,14*s,30*s);r.rect(x+72*s,y-30*s,12*s,24*s);
    }
    private void bolt(float x,float y,float s){r.triangle(x-10*s,y+60*s,x+30*s,y+60*s,x-5*s,y);r.triangle(x-20*s,y+5*s,x+20*s,y+5*s,x-15*s,y-60*s);}
    private void crown(float x,float y,Color c,float a){col(c,a);r.rect(x-50,y-20,100,26);r.triangle(x-50,y+6,x-30,y+6,x-50,y+50);r.triangle(x-15,y+6,x+15,y+6,x,y+60);r.triangle(x+30,y+6,x+50,y+6,x+50,y+50);}
    private void glow(float x,float y,float s,Color c,float a){if(a<=0)return;b.setColor(c.r,c.g,c.b,Math.min(1,a));b.draw(assets.glow,x-s/2,y-s/2,s,s);b.setColor(Color.WHITE);}
    private void col(Color c,float a){r.setColor(c.r,c.g,c.b,Math.max(0,Math.min(1,a)));}
    private void text(BitmapFont f,String s,float cx,float y,Color c,float a,float sc){text(f,s,cx,y,c,a,sc,true);}
    private void text(BitmapFont f,String s,float x,float y,Color c,float a,float sc,boolean center){
        if(a<=0||sc<=0||s.isEmpty())return;f.getData().setScale(sc);f.setColor(c.r,c.g,c.b,Math.min(1,a));gl.setText(f,s);
        f.draw(b,s,center?x-gl.width/2:x,y);f.getData().setScale(1);f.setColor(Color.WHITE);
    }
    private static String decode(String s,float p,float t){
        if(p>=1)return s;if(p<=0)return "";StringBuilder o=new StringBuilder();int n=s.length(),solid=(int)(p*n);
        for(int i=0;i<n;i++){char c=s.charAt(i);if(i<solid||c==' ')o.append(c);else if(i<solid+4)o.append(GLYPHS.charAt((int)(hash(i*31+(int)(t*24))*GLYPHS.length())));}
        return o.toString();
    }
    private static float hash(int i){int h=i*374761393+668265263;h=(h^(h>>>13))*1274126177;return ((h^(h>>>16))&0xffffff)/(float)0x1000000;}
    private static float k(float t,float a,float b){return MathUtils.clamp((t-a)/(b-a),0,1);}
    private static float ease(float x){return x*x*(3-2*x);}
    @Override public void dispose(){batch.dispose();shapes.dispose();if(ownAssets)assets.dispose();}
}
