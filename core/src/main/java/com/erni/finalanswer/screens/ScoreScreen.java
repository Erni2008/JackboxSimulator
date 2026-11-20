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
import com.badlogic.gdx.graphics.g2d.GlyphLayout;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;
import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ROUND RESULTS after every mode. Rows slide in from the bottom of the table up, so the round's winner lands last;
 * each row counts its "+points" up with ticks, the number pops with a burst of sparks and a coin chime, a gold chip
 * flies into the running total, which rolls up and flashes. When the winner lands: crown, light rays and an impact.
 * Embers drift over a dark crimson backdrop (a painted scene can go behind it later). Leaves on its own, or on a key /
 * click once everything has landed.
 */
public final class ScoreScreen extends ScreenAdapter {
    private static final float W=1920,H=1080,PANEL_W=1280,STAGGER=.55f,ROW_IN=.5f,COUNT_DELAY=.35f,COUNT=1.05f,FLY=.5f,ROLL=.6f,HOLD=7f;
    private static final Color GOLD=new Color(1f,.79f,.36f,1),SILVER=new Color(.82f,.85f,.9f,1),BRONZE=new Color(.84f,.53f,.3f,1),
        INK=new Color(.08f,.04f,.05f,1),PAPER=new Color(.95f,.92f,.88f,1),MUTED=new Color(.66f,.58f,.56f,1),BLOOD=new Color(.55f,.13f,.17f,1);
    private record Row(String name,String character,int earned,int total,int rank){}
    private static final class Spark{float x,y,vx,vy,life,max,size;Color c;}
    private static final class Ember{float x,y,speed,phase,size;}

    private final Runnable done;
    private final String mode;
    private final List<Row> rows=new ArrayList<>();
    private final Map<String,Texture> portraits=new HashMap<>();
    private final FitViewport view=new FitViewport(W,H);
    private final SpriteBatch batch=new SpriteBatch();private final ShapeRenderer shapes=new ShapeRenderer();
    private final BitmapFont title=UiFonts.question(84),eyebrow=UiFonts.nameplate(28),name=UiFonts.nameplate(40),points=UiFonts.question(62),
        medal=UiFonts.question(34),total=UiFonts.question(40),small=UiFonts.nameplate(22),banner=UiFonts.nameplate(30);
    private final GlyphLayout glyphs=new GlyphLayout();
    private final List<Spark> sparks=new ArrayList<>();private final List<Ember> embers=new ArrayList<>();
    private final boolean[] landed,flashed,whooshed;private final float[] tickAt;
    private final float rowH,gap;
    private Sound whoosh,tick,land,impact,flash;
    private boolean winnerHit;
    private float time;private boolean left;

    public ScoreScreen(JsonObject summary,Runnable done){
        this.done=done;
        mode=summary.has("mode")?summary.get("mode").getAsString():"";
        int rank=0,prev=Integer.MIN_VALUE,i=0;
        if(summary.has("rows"))for(var e:summary.getAsJsonArray("rows")){var p=e.getAsJsonObject();i++;
            int earned=p.has("earned")?p.get("earned").getAsInt():0;if(earned!=prev){rank=i;prev=earned;}
            rows.add(new Row(p.has("name")?p.get("name").getAsString():"?",p.has("characterId")?p.get("characterId").getAsString():"",
                earned,p.has("total")?p.get("total").getAsInt():0,rank));}
        int n=rows.size();rowH=n>6?84:n>4?96:108;gap=n>6?10:14;
        landed=new boolean[n];flashed=new boolean[n];whooshed=new boolean[n];tickAt=new float[n];
        for(Row r:rows){var f=Gdx.files.internal("forgotten_room/portraits/"+r.character+".png");
            if(!r.character.isEmpty()&&!portraits.containsKey(r.character)&&f.exists()){var t=new Texture(f,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);portraits.put(r.character,t);}}
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
            case "impostor"->Localization.tr("САМОЗВАНЕЦ","THE IMPOSTOR");
            case "questions"->Localization.tr("ВОПРОСЫ","QUESTIONS");
            case "breach"->"SYSTEM BREACH";
            case "forgotten"->Localization.tr("ЗАБЫТАЯ КОМНАТА","THE FORGOTTEN ROOM");
            default->"";
        };
    }

    // ---- timeline (row 0 = winner, arrives last) ----
    private float start(int i){return 1.2f+STAGGER*(rows.size()-1-i);}
    private float landAt(int i){return start(i)+COUNT_DELAY+COUNT;}
    private float rollAt(int i){return landAt(i)+FLY;}
    private float settled(){return rows.isEmpty()?1.5f:rollAt(0)+ROLL+1.2f;}
    private void leave(){if(left)return;left=true;Gdx.app.postRunnable(done);}

    @Override public void show(){
        Gdx.input.setInputProcessor(new InputAdapter(){
            @Override public boolean keyDown(int k){if(time>settled())leave();return true;}
            @Override public boolean touchDown(int x,int y,int p,int b){if(time>settled())leave();return true;}
        });
    }
    @Override public void resize(int w,int h){view.update(w,h,true);}

    private float tableTop(){float n=rows.size();return H/2+(n*rowH+Math.max(0,n-1)*gap)/2-70;}
    private float rowY(int i){return tableTop()-i*(rowH+gap)-rowH;}
    private float px(){return W/2-PANEL_W/2;}
    private float pointsX(){return px()+PANEL_W-740;}
    private float totalX(){return px()+PANEL_W-250;}

    private void events(){
        for(int i=0;i<rows.size();i++){Row r=rows.get(i);
            if(!whooshed[i]&&time>=start(i)){whooshed[i]=true;play(whoosh,.35f);}
            if(time>=start(i)+COUNT_DELAY&&time<landAt(i)&&r.earned>0&&time>=tickAt[i]){tickAt[i]=time+.075f;play(tick,.18f);}
            if(!landed[i]&&time>=landAt(i)){landed[i]=true;
                if(r.earned>0){play(land,i==0?.7f:.45f);burst(pointsX()+320,rowY(i)+rowH/2,i==0&&r.rank==1?46:24,r.rank);}}
            if(!flashed[i]&&time>=rollAt(i)+ROLL){flashed[i]=true;if(r.earned>0)play(flash,.22f);}
        }
        if(!winnerHit&&!rows.isEmpty()&&time>=landAt(0)+.05f){winnerHit=true;if(rows.get(0).earned>0){play(impact,.8f);burst(px()+70,rowY(0)+rowH/2,60,1);}}
    }
    private void burst(float x,float y,int count,int rank){
        Color base=rank==1?GOLD:rank==2?SILVER:rank==3?BRONZE:new Color(1f,.7f,.4f,1);
        for(int k=0;k<count;k++){Spark s=new Spark();float a=MathUtils.random(MathUtils.PI2),v=MathUtils.random(140f,520f);
            s.x=x;s.y=y;s.vx=MathUtils.cos(a)*v;s.vy=MathUtils.sin(a)*v+120;s.max=s.life=MathUtils.random(.5f,1.1f);s.size=MathUtils.random(2f,5f);
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
        shapes.setProjectionMatrix(view.getCamera().combined);shapes.begin(ShapeRenderer.ShapeType.Filled);
        backdrop(intro);
        float top=tableTop();
        winnerRays(out);
        for(int i=rows.size()-1;i>=0;i--)panel(i,out);
        headerShapes(top,intro);
        for(int i=0;i<rows.size();i++)medalShape(i,out);
        chips(out);
        // sparks and embers glow additively on top of the panels
        shapes.end();Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE);shapes.begin(ShapeRenderer.ShapeType.Filled);
        for(Ember e:embers){float f=.35f+.65f*(.5f+.5f*MathUtils.sin(time*3.1f+e.phase*3));shapes.setColor(1f,.45f,.15f,.35f*f*intro);shapes.circle(e.x,e.y,e.size*2.2f,10);shapes.setColor(1f,.8f,.5f,.6f*f*intro);shapes.circle(e.x,e.y,e.size*.8f,8);}
        for(Spark s:sparks){float a=s.life/s.max;shapes.setColor(s.c.r,s.c.g,s.c.b,a*out);shapes.circle(s.x,s.y,s.size*(.5f+a),8);shapes.setColor(s.c.r,s.c.g,s.c.b,.25f*a*out);shapes.circle(s.x,s.y,s.size*3,10);}
        shapes.end();Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);

        batch.setProjectionMatrix(view.getCamera().combined);batch.begin();
        header(top,intro);
        for(int i=0;i<rows.size();i++)rowText(i,out);
        chipText(out);
        if(rows.isEmpty()){small.setColor(MUTED.r,MUTED.g,MUTED.b,intro);small.draw(batch,Localization.tr("Нет игроков","No players"),0,H/2,W,Align.center,false);}
        if(time>settled()){float a=MathUtils.clamp((time-settled())/.6f,0,1)*(.45f+.25f*MathUtils.sin(time*3))*out;small.setColor(.75f,.7f,.68f,a);
            small.draw(batch,Localization.tr("НАЖМИТЕ ЛЮБУЮ КЛАВИШУ","PRESS ANY KEY"),0,64,W,Align.center,false);}
        batch.end();
    }

    // ---------- shapes ----------
    private void backdrop(float a){
        Color top=new Color(.09f,.02f,.03f,1),bottom=new Color(.015f,.008f,.01f,1);
        shapes.rect(0,0,W,H,bottom,bottom,top,top);
        // warm glow behind the title and the table
        for(int k=0;k<18;k++){float r=980-k*48;shapes.setColor(.55f,.12f,.1f,.018f*a);shapes.ellipse(W/2-r,H*.56f-r*.55f,r*2,r*1.1f,48);}
        // vignette
        Color clear=new Color(0,0,0,0),dark=new Color(0,0,0,.75f);
        shapes.rect(0,0,W,220,dark,dark,clear,clear);shapes.rect(0,H-160,W,160,clear,clear,dark,dark);
        shapes.rect(0,0,260,H,dark,clear,clear,dark);shapes.rect(W-260,0,260,H,clear,dark,dark,clear);
    }
    private void winnerRays(float out){
        if(rows.isEmpty()||rows.get(0).earned<=0)return;float k=MathUtils.clamp((time-landAt(0))/.8f,0,1)*out;if(k<=0)return;
        float cx=px()+70,cy=rowY(0)+rowH/2;
        for(int r=0;r<14;r++){float ang=time*.18f+r*MathUtils.PI2/14,len=520*ease(k),w=.07f;
            shapes.setColor(1f,.75f,.3f,.05f*k);
            shapes.triangle(cx,cy,cx+MathUtils.cos(ang-w)*len,cy+MathUtils.sin(ang-w)*len,cx+MathUtils.cos(ang+w)*len,cy+MathUtils.sin(ang+w)*len);}
    }
    private void panel(int i,float out){Row r=rows.get(i);float a=appear(i)*out;if(a<=0)return;
        float y=rowY(i),x=px()+(1-ease(a))*220;boolean lead=i==0&&r.rank==1&&r.earned>0&&time>=landAt(0);
        Color l=lead?new Color(.3f,.17f,.07f,.95f*a):new Color(.17f,.08f,.09f,.92f*a),m=new Color(.09f,.04f,.05f,.88f*a),e=new Color(.05f,.02f,.03f,.55f*a);
        shapes.rect(x,y,PANEL_W*.55f,rowH,l,m,m,l);shapes.rect(x+PANEL_W*.55f,y,PANEL_W*.45f,rowH,m,e,e,m);
        Color edge=r.rank==1&&r.earned>0?GOLD:r.rank==2?SILVER:r.rank==3?BRONZE:r.earned<=0?BLOOD:MUTED;
        shapes.setColor(edge.r,edge.g,edge.b,a);shapes.rect(x,y,6,rowH);
        shapes.setColor(edge.r,edge.g,edge.b,.35f*a);shapes.rect(x,y+rowH-1.5f,PANEL_W*.7f,1.5f,new Color(edge.r,edge.g,edge.b,.5f*a),new Color(edge.r,edge.g,edge.b,0),new Color(edge.r,edge.g,edge.b,0),new Color(edge.r,edge.g,edge.b,.5f*a));
        if(lead){float s=((time-landAt(0))*.45f)%1.6f;float sx=x+s*PANEL_W*1.2f-200;
            shapes.setColor(1f,.9f,.6f,.09f*a);shapes.triangle(sx,y,sx+90,y,sx+150,y+rowH);shapes.triangle(sx,y,sx+150,y+rowH,sx+60,y+rowH);
            float g=.5f+.5f*MathUtils.sin(time*3);shapes.setColor(GOLD.r,GOLD.g,GOLD.b,(.55f+.35f*g)*a);
            shapes.rect(x,y,PANEL_W,2);shapes.rect(x,y+rowH-2,PANEL_W,2);shapes.rect(x+PANEL_W-2,y,2,rowH);}
        // portrait frame
        float ps=rowH-18,pxl=x+118;shapes.setColor(edge.r*.7f,edge.g*.7f,edge.b*.7f,a);shapes.rect(pxl-3,y+6,ps+6,ps+6);shapes.setColor(INK.r,INK.g,INK.b,a);shapes.rect(pxl,y+9,ps,ps);
        // total plate
        shapes.setColor(0,0,0,.35f*a);shapes.rect(totalX()-24,y+12,240,rowH-24);
        float f=flashK(i);if(f>0){shapes.setColor(1f,.85f,.45f,.35f*f*a);shapes.rect(totalX()-24,y+12,240,rowH-24);}
    }
    private void medalShape(int i,float out){Row r=rows.get(i);float a=appear(i)*out;if(a<=0)return;
        float x=px()+(1-ease(a))*220+62,y=rowY(i)+rowH/2;
        Color c=r.earned<=0?new Color(.3f,.12f,.14f,1):r.rank==1?GOLD:r.rank==2?SILVER:r.rank==3?BRONZE:new Color(.32f,.26f,.26f,1);
        float pop=landed[i]&&r.rank<=3&&r.earned>0?1+.25f*bump(time-landAt(i)):1,rad=30*pop;
        shapes.setColor(c.r*.45f,c.g*.45f,c.b*.45f,a);shapes.circle(x,y,rad+5,36);
        shapes.setColor(c.r,c.g,c.b,a);shapes.circle(x,y,rad,36);
        shapes.setColor(Math.min(1,c.r*1.15f),Math.min(1,c.g*1.15f),Math.min(1,c.b*1.15f),.55f*a);shapes.circle(x-rad*.25f,y+rad*.3f,rad*.45f,20);
        if(i==0&&r.rank==1&&r.earned>0){float k=MathUtils.clamp((time-landAt(0))/.45f,0,1);if(k>0)crown(x,y+rad+8+(1-easeBack(k))*80,a*k);}
    }
    private void crown(float cx,float by,float a){
        shapes.setColor(GOLD.r,GOLD.g,GOLD.b,a);float w=46,h=30;
        shapes.rect(cx-w/2,by,w,9);
        shapes.triangle(cx-w/2,by+8,cx-w/2+12,by+8,cx-w/2,by+h);shapes.triangle(cx-11,by+8,cx+11,by+8,cx,by+h+6);shapes.triangle(cx+w/2-12,by+8,cx+w/2,by+8,cx+w/2,by+h);
        shapes.setColor(1f,.95f,.8f,a);shapes.circle(cx-w/2,by+h,3.5f,10);shapes.circle(cx,by+h+6,4,10);shapes.circle(cx+w/2,by+h,3.5f,10);
    }
    private void headerShapes(float top,float a){
        float k=ease(MathUtils.clamp((time-.35f)/.8f,0,1));float y=top+92,half=330*k;
        Color g=new Color(GOLD.r,GOLD.g,GOLD.b,.85f*a),c=new Color(GOLD.r,GOLD.g,GOLD.b,0);
        shapes.rect(W/2-half-40,y,half,2,c,g,g,c);shapes.rect(W/2+40,y,half,2,g,c,c,g);
        diamond(W/2,y+1,9*k,a);diamond(W/2-half-48,y+1,5*k,a);diamond(W/2+half+48,y+1,5*k,a);
    }
    private void diamond(float x,float y,float r,float a){shapes.setColor(GOLD.r,GOLD.g,GOLD.b,a);shapes.triangle(x-r,y,x,y+r,x+r,y);shapes.triangle(x-r,y,x,y-r,x+r,y);}
    private void chips(float out){
        for(int i=0;i<rows.size();i++){Row r=rows.get(i);if(r.earned<=0)continue;float k=(time-landAt(i))/FLY;if(k<0||k>1)continue;
            float[] p=chipPos(i,k);shapes.setColor(1f,.75f,.3f,.25f*(1-k)*out);shapes.circle(p[0],p[1],34*(1-k*.5f),24);}
    }
    private float[] chipPos(int i,float k){float e=ease(k),y0=rowY(i)+rowH/2,x0=pointsX()+320,x1=totalX()+90;return new float[]{MathUtils.lerp(x0,x1,e),y0+MathUtils.sin(k*MathUtils.PI)*60};}

    // ---------- text ----------
    private void header(float top,float a){
        float k=easeBack(MathUtils.clamp(time/.7f,0,1));
        String t=Localization.tr("ИТОГИ РАУНДА","ROUND RESULTS");
        title.getData().setScale(.85f+.15f*k);
        // soft glow, then the title
        for(int o=0;o<6;o++){float ang=o*MathUtils.PI2/6;title.setColor(1f,.55f,.2f,.06f*a);title.draw(batch,t,MathUtils.cos(ang)*4,top+235+MathUtils.sin(ang)*4,W,Align.center,false);}
        title.setColor(GOLD.r,GOLD.g,GOLD.b,a);title.draw(batch,t,0,top+235,W,Align.center,false);title.getData().setScale(1);
        String mn=modeName(mode);float ma=MathUtils.clamp((time-.5f)/.6f,0,1)*a;
        if(!mn.isEmpty()){eyebrow.setColor(.82f,.74f,.66f,ma);eyebrow.draw(batch,spaced(mn),0,top+134,W,Align.center,false);}
    }
    private void rowText(int i,float out){Row r=rows.get(i);float a=appear(i)*out;if(a<=0)return;
        float y=rowY(i),x=px()+(1-ease(a))*220,mid=y+rowH/2;boolean zero=r.earned<=0;
        // rank in the medal
        medal.setColor(r.rank<=3&&!zero?INK.r:PAPER.r,r.rank<=3&&!zero?INK.g:PAPER.g,r.rank<=3&&!zero?INK.b:PAPER.b,a);
        medal.draw(batch,String.valueOf(r.rank),x+62-40,mid+medal.getCapHeight()/2,80,Align.center,false);
        Texture t=portraits.get(r.character);float ps=rowH-18;
        if(t!=null){batch.setColor(1,1,1,a*(zero?.6f:1));batch.draw(t,x+118,y+9,ps,ps);batch.setColor(Color.WHITE);}
        name.setColor(zero?.62f:PAPER.r,zero?.56f:PAPER.g,zero?.56f:PAPER.b,a);
        glyphs.setText(name,r.name,0,r.name.length(),name.getColor(),pointsX()+120-(x+140+ps),Align.left,false,"…");
        name.draw(batch,glyphs,x+140+ps,mid+name.getCapHeight()/2);
        // +points: count up, pop on landing
        float c=MathUtils.clamp((time-start(i)-COUNT_DELAY)/COUNT,0,1);int shown=Math.round(r.earned*easeIn(c));
        float pop=landed[i]&&!zero?1+.35f*bump(time-landAt(i)):1;
        points.getData().setScale(pop);
        Color pc=zero?new Color(.6f,.32f,.34f,a):i==0&&r.rank==1?new Color(GOLD.r,GOLD.g,GOLD.b,a):new Color(1f,.88f,.62f,a);
        if(landed[i]&&!zero){points.setColor(1f,.6f,.2f,.18f*a*(1-MathUtils.clamp((time-landAt(i))/1.2f,0,1)));points.draw(batch,"+"+shown,pointsX()-6,mid+points.getCapHeight()*pop/2+3,380,Align.right,false);}
        points.setColor(pc);points.draw(batch,(zero?"":"+")+shown,pointsX(),mid+points.getCapHeight()*pop/2,380,Align.right,false);points.getData().setScale(1);
        // running total: rolls from the old total once the chip arrives
        float rk=MathUtils.clamp((time-rollAt(i))/ROLL,0,1);int before=r.total-Math.max(0,r.earned),tv=Math.round(before+(r.total-before)*ease(rk));
        small.setColor(MUTED.r,MUTED.g,MUTED.b,.9f*a);small.draw(batch,Localization.tr("ВСЕГО","TOTAL"),totalX(),mid+rowH*.24f+small.getCapHeight()/2,200,Align.left,false);
        float f=flashK(i);total.setColor(MathUtils.lerp(PAPER.r,1f,f),MathUtils.lerp(PAPER.g,.86f,f),MathUtils.lerp(PAPER.b,.45f,f),a);
        total.draw(batch,String.format("%,d",tv).replace(',',' '),totalX(),mid-rowH*.08f+total.getCapHeight()/2,200,Align.left,false);
        if(i==0&&r.rank==1&&!zero&&time>=landAt(0)+.3f){float ba=MathUtils.clamp((time-landAt(0)-.3f)/.5f,0,1)*out;
            banner.setColor(GOLD.r,GOLD.g,GOLD.b,ba);banner.draw(batch,Localization.tr("ПОБЕДИТЕЛЬ РАУНДА","ROUND WINNER"),x+140+ps,y+rowH+banner.getCapHeight()+10,600,Align.left,false);}
    }
    private void chipText(float out){
        for(int i=0;i<rows.size();i++){Row r=rows.get(i);if(r.earned<=0)continue;float k=(time-landAt(i))/FLY;if(k<0||k>1)continue;
            float[] p=chipPos(i,k);small.setColor(1f,.9f,.6f,(1-k*.6f)*out);small.draw(batch,"+"+r.earned,p[0]-60,p[1]+small.getCapHeight()/2,120,Align.center,false);}
    }

    // ---------- curves ----------
    private float appear(int i){return MathUtils.clamp((time-start(i))/ROW_IN,0,1);}
    private float flashK(int i){float d=time-(rollAt(i)+ROLL);return d<0?0:Math.max(0,1-d/.7f);}
    private static float ease(float t){float u=1-t;return 1-u*u*u;}
    private static float easeIn(float t){return t*t*(3-2*t);}
    private static float easeBack(float t){float c=1.70158f;float u=t-1;return 1+(c+1)*u*u*u+c*u*u;}
    /** 0 → 1 → 0 bump over ~.45 s, for pops. */
    private static float bump(float d){if(d<0||d>.45f)return 0;float k=d/.45f;return MathUtils.sin(k*MathUtils.PI)*(1-k*.3f);}
    private static String spaced(String s){StringBuilder b=new StringBuilder();for(char ch:s.toCharArray()){if(b.length()>0)b.append(' ');b.append(ch);}return b.toString();}

    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){batch.dispose();shapes.dispose();
        for(BitmapFont f:new BitmapFont[]{title,eyebrow,name,points,medal,total,small,banner})f.dispose();
        for(var t:portraits.values())t.dispose();
        for(Sound s:new Sound[]{whoosh,tick,land,impact,flash})if(s!=null)s.dispose();}
}
