package com.erni.finalanswer.screens;

import com.erni.finalanswer.audio.AudioMix;
import com.erni.finalanswer.localization.Localization;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.InputAdapter;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;
import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ROUND RESULTS after every mode: the characters themselves, standing on stone pillars whose height is their score.
 * The pillars rise to the totals before this round (characters drop onto them), "+points" pop above each head, the
 * pillars grow by what was earned while the totals roll; heights are relative to the leader, so whoever fell behind
 * visibly sinks. Then everyone slides into the new order and the leader gets a crown, light rays and an impact.
 * Embers drift over a dark crimson backdrop (a painted scene can go behind it later). Leaves on its own, or on a key /
 * click once everything has settled.
 */
public final class ScoreScreen extends ScreenAdapter {
    private static final float W=1920,H=1080,FLOOR=150,MIN_P=70,MAX_P=420,
        RISE=.9f,POPS=1.9f,GROW=3.1f,GROW_T=1.3f,SWAP=4.9f,SWAP_T=.9f,CROWN=6.0f,HOLD=7f;
    private static final Color GOLD=new Color(1f,.79f,.36f,1),SILVER=new Color(.82f,.85f,.9f,1),BRONZE=new Color(.84f,.53f,.3f,1),
        PAPER=new Color(.95f,.92f,.88f,1),MUTED=new Color(.66f,.58f,.56f,1);
    private static final class Runner{String name,character;int earned,total,before,oldSlot,newSlot,rank;Texture body;float phase;}
    private static final class Spark{float x,y,vx,vy,life,max,size;Color c;}
    private static final class Ember{float x,y,speed,phase,size;}

    private final Runnable done;
    private final String mode;
    private final List<Runner> runners=new ArrayList<>();
    private final Map<String,Texture> bodies=new HashMap<>();
    private final FitViewport view=new FitViewport(W,H);
    private final SpriteBatch batch=new SpriteBatch();private final ShapeRenderer shapes=new ShapeRenderer();
    private final BitmapFont title=UiFonts.question(78),eyebrow=UiFonts.nameplate(26),name=UiFonts.nameplate(30),plus=UiFonts.question(58),
        total=UiFonts.question(40),small=UiFonts.nameplate(20),medal=UiFonts.question(30);
    private final List<Spark> sparks=new ArrayList<>();private final List<Ember> embers=new ArrayList<>();
    private final float slotW,bodyH;
    private Sound whoosh,tick,land,impact,flash;
    private boolean popped,grown,swapped,crowned;private float tickAt;
    private float time;private boolean left;

    public ScoreScreen(JsonObject summary,Runnable done){
        this.done=done;
        mode=summary.has("mode")?summary.get("mode").getAsString():"";
        if(summary.has("rows"))for(var e:summary.getAsJsonArray("rows")){var p=e.getAsJsonObject();Runner r=new Runner();
            r.name=p.has("name")?p.get("name").getAsString():"?";r.character=p.has("characterId")?p.get("characterId").getAsString():"";
            r.earned=Math.max(0,p.has("earned")?p.get("earned").getAsInt():0);r.total=Math.max(0,p.has("total")?p.get("total").getAsInt():0);
            r.before=Math.max(0,r.total-r.earned);r.phase=MathUtils.random(MathUtils.PI2);runners.add(r);}
        // old order by the totals before this round, new order by the totals after it
        List<Runner> old=new ArrayList<>(runners);old.sort(Comparator.<Runner>comparingInt(r->-r.before).thenComparing(r->r.name,String.CASE_INSENSITIVE_ORDER));
        for(int i=0;i<old.size();i++)old.get(i).oldSlot=i;
        List<Runner> now=new ArrayList<>(runners);now.sort(Comparator.<Runner>comparingInt(r->-r.total).thenComparingInt(r->r.oldSlot));
        int rank=0,prev=-1;for(int i=0;i<now.size();i++){Runner r=now.get(i);r.newSlot=i;if(r.total!=prev){rank=i+1;prev=r.total;}r.rank=rank;}
        int n=Math.max(1,runners.size());slotW=Math.min(300,1640f/n);bodyH=Math.min(300,slotW*1.25f);
        for(Runner r:runners){if(r.character.isEmpty())continue;Texture t=bodies.get(r.character);
            if(t==null){var f=Gdx.files.internal("results/characters/"+r.character+".png");if(f.exists()){t=new Texture(f,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);bodies.put(r.character,t);}}
            r.body=t;}
        for(int k=0;k<70;k++){Ember e=new Ember();e.x=MathUtils.random(W);e.y=MathUtils.random(H);e.speed=MathUtils.random(18f,60f);e.phase=MathUtils.random(MathUtils.PI2);e.size=MathUtils.random(1.5f,4f);embers.add(e);}
        whoosh=sound("row_whoosh");tick=sound("count_tick");land=sound("points_land");impact=sound("winner_impact");flash=sound("total_flash");
    }
    private static Sound sound(String n){try{var f=Gdx.files.internal("sounds/results/"+n+".wav");return f.exists()?Gdx.audio.newSound(f):null;}catch(RuntimeException e){return null;}}
    private static void play(Sound s,float v){if(s!=null)try{s.play(v*AudioMix.GLOBAL.gain(AudioMix.Category.SFX));}catch(RuntimeException ignored){}}

    /** Mode name for the header, English and Russian. */
    static String modeName(String mode){
        return switch(mode){
            case "race"->Localization.tr("ПРОКЛЯТЫЙ ЗАБЕГ","CURSED RUN");
            case "cage"->Localization.tr("АДСКАЯ КЛЕТКА","HELL CAGE");
            case "boxes"->Localization.tr("ПРОКЛЯТЫЕ КОРОБКИ","CURSED BOXES");
            case "cards"->Localization.tr("ПРОКЛЯТЫЕ КАРТЫ","CURSED CARDS");
            case "final-second"->Localization.tr("ПОСЛЕДНЯЯ СЕКУНДА","FINAL SECOND");
            case "rare-minds"->"RARE MINDS";
            case "impostor"->Localization.tr("САМОЗВАНЕЦ","THE IMPOSTOR");
            case "questions"->Localization.tr("ВОПРОСЫ","QUESTIONS");
            case "breach"->"SYSTEM BREACH";
            case "forgotten"->Localization.tr("ЗАБЫТАЯ КОМНАТА","THE FORGOTTEN ROOM");
            default->"";
        };
    }

    private float settled(){return CROWN+1.6f;}
    private void leave(){if(left)return;left=true;Gdx.app.postRunnable(done);}
    @Override public void show(){
        Gdx.input.setInputProcessor(new InputAdapter(){
            @Override public boolean keyDown(int k){if(time>settled())leave();return true;}
            @Override public boolean touchDown(int x,int y,int p,int b){if(time>settled())leave();return true;}
        });
    }
    @Override public void resize(int w,int h){view.update(w,h,true);}

    // ---- animated state ----
    private float grow(){return ease(MathUtils.clamp((time-GROW)/GROW_T,0,1));}
    private float value(Runner r){return r.before+(r.total-r.before)*grow();}
    private float top(){float m=1;for(Runner r:runners)m=Math.max(m,value(r));return m;}
    private float pillarH(Runner r){float rise=easeBack(MathUtils.clamp((time-.3f-r.oldSlot*.08f)/RISE,0,1));return (MIN_P+(MAX_P-MIN_P)*value(r)/top())*rise;}
    private float slotX(float slot){int n=runners.size();return W/2-(n-1)*slotW/2+slot*slotW;}
    private float x(Runner r){float k=easeInOut(MathUtils.clamp((time-SWAP)/SWAP_T,0,1));return slotX(MathUtils.lerp(r.oldSlot,r.newSlot,k));}
    private boolean leader(Runner r){return r.rank==1&&r.total>0;}
    private float crownK(){return MathUtils.clamp((time-CROWN)/.5f,0,1);}

    private void events(){
        if(!popped&&time>=POPS){popped=true;play(whoosh,.3f);}
        if(time>=POPS&&time<GROW+GROW_T&&time>=tickAt){tickAt=time+.08f;if(time>=GROW)play(tick,.16f);}
        if(!grown&&time>=GROW+GROW_T){grown=true;play(land,.55f);play(flash,.25f);
            for(Runner r:runners)if(r.earned>0)burst(x(r),FLOOR+pillarH(r)+bodyH*.5f,18,r.rank);}
        if(!swapped&&time>=SWAP){swapped=true;boolean moves=false;for(Runner r:runners)moves|=r.oldSlot!=r.newSlot;if(moves)play(whoosh,.5f);}
        if(!crowned&&time>=CROWN){crowned=true;for(Runner r:runners)if(leader(r)){play(impact,.8f);burst(x(r),FLOOR+pillarH(r)+bodyH+30,60,1);}}
    }
    private void burst(float x,float y,int count,int rank){
        Color base=rank==1?GOLD:rank==2?SILVER:rank==3?BRONZE:new Color(1f,.7f,.4f,1);
        for(int k=0;k<count;k++){Spark s=new Spark();float a=MathUtils.random(MathUtils.PI2),v=MathUtils.random(140f,480f);
            s.x=x;s.y=y;s.vx=MathUtils.cos(a)*v;s.vy=MathUtils.sin(a)*v+140;s.max=s.life=MathUtils.random(.5f,1.1f);s.size=MathUtils.random(2f,5f);
            s.c=new Color(base).lerp(Color.WHITE,MathUtils.random(.35f));sparks.add(s);}
    }

    @Override public void render(float dt){
        dt=Math.min(dt,.1f);time+=dt;
        if(time>settled()+HOLD)leave();
        events();
        for(int k=sparks.size()-1;k>=0;k--){Spark s=sparks.get(k);s.life-=dt;if(s.life<=0){sparks.remove(k);continue;}s.vy-=620*dt;s.vx*=1-1.4f*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;}
        for(Ember e:embers){e.y+=e.speed*dt;e.x+=MathUtils.sin(time*.6f+e.phase)*12*dt;if(e.y>H+10){e.y=-10;e.x=MathUtils.random(W);}}

        Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
        view.apply();
        float out=left?0:1,intro=MathUtils.clamp(time/.8f,0,1)*out;
        Gdx.gl.glEnable(GL20.GL_BLEND);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        shapes.setProjectionMatrix(view.getCamera().combined);batch.setProjectionMatrix(view.getCamera().combined);
        shapes.begin(ShapeRenderer.ShapeType.Filled);
        backdrop(intro);
        for(Runner r:runners)if(leader(r))rays(r,out);
        // back to front: the leader is drawn last so the crown and rays sit on top
        List<Runner> order=new ArrayList<>(runners);order.sort(Comparator.comparingInt(r->leader(r)?1:0));
        for(Runner r:order)pillar(r,out);
        headerShapes(intro);
        shapes.end();

        batch.begin();
        header(intro);
        for(Runner r:order)character(r,out);
        batch.end();

        shapes.begin(ShapeRenderer.ShapeType.Filled);
        for(Runner r:order)medalShape(r,out);
        for(Runner r:runners)if(leader(r))crown(x(r),FLOOR+pillarH(r)+bodyH+bob(r)+14+(1-easeBack(crownK()))*90,crownK()*out);
        shapes.end();Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE);shapes.begin(ShapeRenderer.ShapeType.Filled);
        for(Ember e:embers){float f=.35f+.65f*(.5f+.5f*MathUtils.sin(time*3.1f+e.phase*3));shapes.setColor(1f,.45f,.15f,.3f*f*intro);shapes.circle(e.x,e.y,e.size*2.2f,10);shapes.setColor(1f,.8f,.5f,.55f*f*intro);shapes.circle(e.x,e.y,e.size*.8f,8);}
        for(Spark s:sparks){float a=s.life/s.max;shapes.setColor(s.c.r,s.c.g,s.c.b,a*out);shapes.circle(s.x,s.y,s.size*(.5f+a),8);shapes.setColor(s.c.r,s.c.g,s.c.b,.25f*a*out);shapes.circle(s.x,s.y,s.size*3,10);}
        shapes.end();Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);

        batch.begin();
        for(Runner r:order)labels(r,out);
        if(runners.isEmpty()){small.setColor(MUTED.r,MUTED.g,MUTED.b,intro);small.draw(batch,Localization.tr("Нет игроков","No players"),0,H/2,W,Align.center,false);}
        if(time>settled()){float a=MathUtils.clamp((time-settled())/.6f,0,1)*(.45f+.25f*MathUtils.sin(time*3))*out;small.setColor(.75f,.7f,.68f,a);
            small.draw(batch,Localization.tr("НАЖМИТЕ ЛЮБУЮ КЛАВИШУ","PRESS ANY KEY"),0,30,W,Align.center,false);}
        batch.end();
    }

    // ---------- shapes ----------
    private void backdrop(float a){
        Color top=new Color(.09f,.02f,.03f,1),bottom=new Color(.015f,.008f,.01f,1);
        shapes.rect(0,0,W,H,bottom,bottom,top,top);
        for(int k=0;k<18;k++){float r=980-k*48;shapes.setColor(.55f,.12f,.1f,.018f*a);shapes.ellipse(W/2-r,H*.5f-r*.55f,r*2,r*1.1f,48);}
        // stone floor the pillars stand on
        Color f1=new Color(.13f,.07f,.07f,1),f2=new Color(.04f,.02f,.02f,1);shapes.rect(0,0,W,FLOOR,f2,f2,f1,f1);
        shapes.setColor(GOLD.r,GOLD.g,GOLD.b,.25f*a);shapes.rect(0,FLOOR-2,W,2);
        Color clear=new Color(0,0,0,0),dark=new Color(0,0,0,.75f);
        shapes.rect(0,H-160,W,160,clear,clear,dark,dark);shapes.rect(0,0,260,H,dark,clear,clear,dark);shapes.rect(W-260,0,260,H,clear,dark,dark,clear);
    }
    private void rays(Runner r,float out){float k=crownK()*out;if(k<=0)return;
        float cx=x(r),cy=FLOOR+pillarH(r)+bodyH*.55f;
        for(int i=0;i<16;i++){float ang=time*.2f+i*MathUtils.PI2/16,len=620*ease(k),w=.06f;shapes.setColor(1f,.75f,.3f,.06f*k);
            shapes.triangle(cx,cy,cx+MathUtils.cos(ang-w)*len,cy+MathUtils.sin(ang-w)*len,cx+MathUtils.cos(ang+w)*len,cy+MathUtils.sin(ang+w)*len);}
        for(int i=0;i<8;i++){float rr=200-i*22;shapes.setColor(1f,.7f,.3f,.035f*k);shapes.circle(cx,cy,rr,40);}
    }
    private Color tier(Runner r){return !swapped?MUTED:r.rank==1&&r.total>0?GOLD:r.rank==2?SILVER:r.rank==3?BRONZE:MUTED;}
    private void pillar(Runner r,float out){
        float h=pillarH(r);if(h<=1)return;float w=slotW*.62f,cx=x(r),x0=cx-w/2;
        // shadow, body with side shading, cap and base, gold trim for the leader
        shapes.setColor(0,0,0,.45f*out);shapes.ellipse(cx-w*.75f,FLOOR-16,w*1.5f,30,30);
        Color l=new Color(.36f,.27f,.25f,out),m=new Color(.25f,.18f,.17f,out),d=new Color(.11f,.07f,.07f,out);
        shapes.rect(x0,FLOOR,w*.35f,h,l,m,m,l);shapes.rect(x0+w*.35f,FLOOR,w*.65f,h,m,d,d,m);
        shapes.setColor(0,0,0,.18f*out);for(float y=FLOOR+46;y<FLOOR+h-20;y+=46)shapes.rect(x0,y,w,2);
        Color t=tier(r);float g=swapped?1:0;
        shapes.setColor(.42f,.33f,.3f,out);shapes.rect(x0-10,FLOOR+h-16,w+20,16);shapes.setColor(.5f,.4f,.36f,out);shapes.rect(x0-10,FLOOR+h-4,w+20,4);
        shapes.setColor(.3f,.22f,.2f,out);shapes.rect(x0-8,FLOOR,w+16,14);
        if(g>0){shapes.setColor(t.r,t.g,t.b,.85f*out);shapes.rect(x0-10,FLOOR+h-18,w+20,2);}
        // light the top of the pillar while it grows
        float glow=MathUtils.clamp((time-GROW)/GROW_T,0,1);if(r.earned>0&&glow>0&&glow<1){shapes.setColor(1f,.75f,.35f,.35f*MathUtils.sin(glow*MathUtils.PI)*out);shapes.rect(x0,FLOOR+h-60,w,60);}
    }
    private void medalShape(Runner r,float out){float k=MathUtils.clamp((time-SWAP-SWAP_T)/.4f,0,1)*out;if(k<=0)return;
        Color c=tier(r);float cx=x(r),cy=FLOOR-88,rad=24*easeBack(k);
        shapes.setColor(c.r*.45f,c.g*.45f,c.b*.45f,k);shapes.circle(cx,cy,rad+4,32);shapes.setColor(c.r,c.g,c.b,k);shapes.circle(cx,cy,rad,32);
        shapes.setColor(Math.min(1,c.r*1.15f),Math.min(1,c.g*1.15f),Math.min(1,c.b*1.15f),.5f*k);shapes.circle(cx-rad*.25f,cy+rad*.3f,rad*.42f,16);
    }
    private void crown(float cx,float by,float a){if(a<=0)return;
        shapes.setColor(GOLD.r,GOLD.g,GOLD.b,a);float w=64,h=40;
        shapes.rect(cx-w/2,by,w,12);
        shapes.triangle(cx-w/2,by+10,cx-w/2+16,by+10,cx-w/2,by+h);shapes.triangle(cx-15,by+10,cx+15,by+10,cx,by+h+8);shapes.triangle(cx+w/2-16,by+10,cx+w/2,by+10,cx+w/2,by+h);
        shapes.setColor(1f,.95f,.8f,a);shapes.circle(cx-w/2,by+h,5,10);shapes.circle(cx,by+h+8,5.5f,10);shapes.circle(cx+w/2,by+h,5,10);
        shapes.setColor(.75f,.1f,.15f,a);shapes.circle(cx,by+6,4,10);
    }
    private void headerShapes(float a){
        float k=ease(MathUtils.clamp((time-.35f)/.8f,0,1)),y=H-178,half=330*k;
        Color g=new Color(GOLD.r,GOLD.g,GOLD.b,.85f*a),c=new Color(GOLD.r,GOLD.g,GOLD.b,0);
        shapes.rect(W/2-half-40,y,half,2,c,g,g,c);shapes.rect(W/2+40,y,half,2,g,c,c,g);
        diamond(W/2,y+1,9*k,a);
    }
    private void diamond(float x,float y,float r,float a){shapes.setColor(GOLD.r,GOLD.g,GOLD.b,a);shapes.triangle(x-r,y,x,y+r,x+r,y);shapes.triangle(x-r,y,x,y-r,x+r,y);}

    // ---------- sprites and text ----------
    private float bob(Runner r){return leader(r)&&crowned?Math.abs(MathUtils.sin(time*4f))*14*crownK():MathUtils.sin(time*1.6f+r.phase)*3;}
    private void character(Runner r,float out){
        float drop=easeBack(MathUtils.clamp((time-.7f-r.oldSlot*.08f)/.6f,0,1));if(drop<=0)return;
        float baseY=FLOOR+pillarH(r)-6+(1-drop)*260+bob(r),cx=x(r);
        // fell behind this round: slumps and fades a little
        boolean sad=grown&&r.earned<=0;float tint=sad?.62f:1;
        if(r.body!=null){float s=bodyH/r.body.getHeight(),w=r.body.getWidth()*s*(1+(leader(r)&&crowned?.04f*MathUtils.sin(time*8):0));
            batch.setColor(0,0,0,.35f*out*drop);batch.draw(r.body,cx-w/2+8,baseY-4,w,bodyH*.98f);
            batch.setColor(tint,tint*.96f,tint*.94f,out*drop);batch.draw(r.body,cx-w/2,baseY,w,bodyH);batch.setColor(Color.WHITE);}
    }
    private void header(float a){
        float k=easeBack(MathUtils.clamp(time/.7f,0,1));String t=Localization.tr("ИТОГИ РАУНДА","ROUND RESULTS");
        title.getData().setScale(.85f+.15f*k);
        for(int o=0;o<6;o++){float ang=o*MathUtils.PI2/6;title.setColor(1f,.55f,.2f,.06f*a);title.draw(batch,t,MathUtils.cos(ang)*4,H-52+MathUtils.sin(ang)*4,W,Align.center,false);}
        title.setColor(GOLD.r,GOLD.g,GOLD.b,a);title.draw(batch,t,0,H-52,W,Align.center,false);title.getData().setScale(1);
        String mn=modeName(mode);float ma=MathUtils.clamp((time-.5f)/.6f,0,1)*a;
        if(!mn.isEmpty()){eyebrow.setColor(.82f,.74f,.66f,ma);eyebrow.draw(batch,spaced(mn),0,H-196,W,Align.center,false);}
    }
    private void labels(Runner r,float out){
        float cx=x(r),h=pillarH(r);if(h<=1)return;float lw=slotW-12;
        // total on the pillar face, rolling while it grows
        float fl=grown?Math.max(0,1-(time-GROW-GROW_T)/.8f):0;
        total.setColor(MathUtils.lerp(PAPER.r,1f,fl),MathUtils.lerp(PAPER.g,.86f,fl),MathUtils.lerp(PAPER.b,.45f,fl),out);
        total.draw(batch,String.format("%,d",Math.round(value(r))).replace(',',' '),cx-lw/2,FLOOR+Math.max(h-30,42),lw,Align.center,false);
        // name and rank under the floor line
        name.setColor(r.earned<=0&&grown?.7f:PAPER.r,r.earned<=0&&grown?.62f:PAPER.g,r.earned<=0&&grown?.6f:PAPER.b,out);
        name.draw(batch,r.name,cx-lw/2,FLOOR-14,lw,Align.center,true);
        float mk=MathUtils.clamp((time-SWAP-SWAP_T)/.4f,0,1)*out;
        if(mk>0){medal.setColor(.1f,.05f,.04f,mk);medal.draw(batch,String.valueOf(r.rank),cx-30,FLOOR-88+medal.getCapHeight()/2,60,Align.center,false);}
        // "+points" pops above the head, then rides up with the pillar and fades once it has been added
        float pk=MathUtils.clamp((time-POPS-r.oldSlot*.07f)/.35f,0,1);
        float fade=1-MathUtils.clamp((time-GROW-GROW_T-.6f)/.6f,0,1);
        if(pk>0&&fade>0){float s=easeBack(pk);plus.getData().setScale(.6f+.4f*s);
            float y=FLOOR+h+bodyH+60+bob(r);String txt=r.earned>0?"+"+Math.round(r.earned*(time<GROW?1:1)):"+0";
            Color c=r.earned<=0?new Color(.65f,.35f,.38f,1):GOLD;
            plus.setColor(1f,.55f,.2f,.15f*fade*out);plus.draw(batch,txt,cx-lw/2+3,y-3,lw,Align.center,false);
            plus.setColor(c.r,c.g,c.b,fade*out);plus.draw(batch,txt,cx-lw/2,y,lw,Align.center,false);plus.getData().setScale(1);}
        if(leader(r)&&crowned){float ba=crownK()*out;small.setColor(GOLD.r,GOLD.g,GOLD.b,ba);
            small.draw(batch,Localization.tr("ЛИДЕР","LEADER"),cx-lw/2,FLOOR+h+bodyH+bob(r)+132,lw,Align.center,false);}
    }

    // ---------- curves ----------
    private static float ease(float t){float u=1-t;return 1-u*u*u;}
    private static float easeInOut(float t){return t<.5f?4*t*t*t:1-(float)Math.pow(-2*t+2,3)/2;}
    private static float easeBack(float t){float c=1.70158f;float u=t-1;return 1+(c+1)*u*u*u+c*u*u;}
    private static String spaced(String s){StringBuilder b=new StringBuilder();for(char ch:s.toCharArray()){if(b.length()>0)b.append(' ');b.append(ch);}return b.toString();}

    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){batch.dispose();shapes.dispose();
        for(BitmapFont f:new BitmapFont[]{title,eyebrow,name,plus,total,small,medal})f.dispose();
        for(var t:bodies.values())t.dispose();
        for(Sound s:new Sound[]{whoosh,tick,land,impact,flash})if(s!=null)s.dispose();}
}
