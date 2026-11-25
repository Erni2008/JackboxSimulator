package com.erni.finalanswer.thinkordie;

import com.erni.finalanswer.localization.Localization;
import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.google.gson.*;
import java.util.*;
import java.util.function.*;

/**
 * THINK OR DIE — the shared host screen, driven only by server snapshots. While answering every player is a car on
 * a lane that moves with each answer (the text stays hidden unless the server runs with hiddenAnswers=false); then
 * a scan while answers are checked, the anonymous dispute board, the answer reveal (gold unique, green shared by two,
 * orange common, red wrong, grey disputed), the round scoreboard, resurrections and the final podium.
 * ENTER or ESC on the final screen returns to the lobby.
 */
public final class ThinkOrDieScreen extends ScreenAdapter {
    private static final float W=1920,H=1080;
    private final OrthographicCamera cam=new OrthographicCamera();private final FitViewport vp=new FitViewport(W,H,cam);
    private SpriteBatch batch;private ThinkOrDieArt art;private boolean created;
    private static final class Ember{float x,y,vx,vy,life,max,size;Color c;}
    private final List<Ember> embers=new ArrayList<>();private int typed=-1;
    private JsonObject state,t;private final LongSupplier serverNow;private final Consumer<String> onEnd;
    private float clock,shake,phaseT;private String lastPhase="";private int lastRound=-1,lastSecond=-1,soundedTiles=-1;

    private static final class Lane{float shown,bump,flash;int count;String puff="";float puffT=9;float last=-99;int prev;float roll=1;}
    private final Map<String,Lane> lanes=new HashMap<>();

    public ThinkOrDieScreen(JsonObject snapshot,LongSupplier serverNow,Consumer<String> onEnd){this.serverNow=serverNow;this.onEnd=onEnd;apply(snapshot);}
    public String session(){return s(t,"sessionId");}
    public void apply(JsonObject snapshot){if(!snapshot.has("thinkOrDie"))return;state=snapshot;t=snapshot.getAsJsonObject("thinkOrDie");}

    @Override public void show(){
        if(!created){created=true;batch=new SpriteBatch();art=new ThinkOrDieArt();art.batch=batch;}
        Gdx.input.setInputProcessor(new InputAdapter(){@Override public boolean keyDown(int k){
            if((k==Input.Keys.ENTER||k==Input.Keys.ESCAPE)&&(phase().equals("FINAL_RESULTS")||phase().equals("COMPLETED"))){onEnd.accept(session());return true;}
            return false;}});
    }
    @Override public void resize(int w,int h){vp.update(w,h,true);}

    // ---------------------------------------------------------------- snapshot helpers
    private String phase(){return s(t,"phase");}
    private long now(){return serverNow.getAsLong();}
    private static long l(JsonObject o,String k){return o!=null&&o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsLong():0;}
    private static int i(JsonObject o,String k){return (int)l(o,k);}
    private static boolean b(JsonObject o,String k){return o!=null&&o.has(k)&&!o.get(k).isJsonNull()&&o.get(k).getAsBoolean();}
    private static String s(JsonObject o,String k){return o!=null&&o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsString():"";}
    private static boolean ru(){return Localization.russian();}
    private static String tr(String r,String e){return ru()?r:e;}
    private List<JsonObject> arr(JsonObject o,String k){List<JsonObject> out=new ArrayList<>();if(o!=null&&o.has(k)&&o.get(k).isJsonArray())for(var e:o.getAsJsonArray(k))out.add(e.getAsJsonObject());return out;}
    private List<JsonObject> players(){return arr(t,"players");}
    private JsonObject roster(String id){for(var o:arr(state,"players"))if(s(o,"id").equals(id))return o;return new JsonObject();}
    private String name(String id){String n=s(roster(id),"name");return n.isEmpty()?"?":n;}
    private String character(String id){return s(roster(id),"characterId");}
    private int seat(String id){var ps=players();for(int k=0;k<ps.size();k++)if(s(ps.get(k),"id").equals(id))return k;return 0;}
    private Color seatColor(String id){return ThinkOrDieArt.SEAT[seat(id)%ThinkOrDieArt.SEAT.length];}
    private float left(){long e=l(t,"phaseEndsAt");return e<=0?0:Math.max(0,(e-now())/1000f);}
    private float total(){long e=l(t,"phaseEndsAt"),st=l(t,"phaseStartedAt");return e<=0?1:Math.max(.001f,(e-st)/1000f);}
    private String category(){return ru()?s(t,"textRu"):s(t,"textEn");}
    private static float ease(float x){x=MathUtils.clamp(x,0,1);return 1-(1-x)*(1-x)*(1-x);}
    private static float back(float x){x=MathUtils.clamp(x,0,1);float c=1.70158f;return 1+(c+1)*(float)Math.pow(x-1,3)+c*(float)Math.pow(x-1,2);}

    // ---------------------------------------------------------------- frame
    @Override public void render(float dt){
        dt=Math.min(dt,1/20f);clock+=dt;phaseT+=dt;shake=Math.max(0,shake-dt*2.4f);
        String ph=phase();
        if(!ph.equals(lastPhase)||i(t,"round")!=lastRound){onPhase(ph);lastPhase=ph;lastRound=i(t,"round");phaseT=0;}
        updateLanes(dt);
        ScreenUtils.clear(0.06f,0.02f,0.16f,1,true);

        cam.position.set(W/2+MathUtils.sin(clock*63)*shake*12,H/2+MathUtils.cos(clock*57)*shake*9,0);vp.apply();batch.setProjectionMatrix(cam.combined);
        batch.begin();
        stage();
        countdown();
        switch(ph){
            case "INTRO"->intro();
            case "CATEGORY_REVEAL"->categoryReveal();
            case "ANSWERING","ANSWER_VALIDATION"->{race(ph.equals("ANSWER_VALIDATION"));topBand();header(true);}
            case "DISPUTE"->{header(true);disputes();}
            case "ANSWER_REVEAL"->{header(false);reveal();}
            case "ROUND_RESULTS"->{boolean risen=players().stream().anyMatch(p->b(p,"roundResurrected"));
                if(risen&&phaseT<3.6f)resurrection();else{header(false);float keep=phaseT;if(risen)phaseT-=3.6f;scoreboard();phaseT=keep;}}
            case "FINAL_RESULTS","COMPLETED"->podium();
            default->{}
        }
        embers(dt);
        batch.end();
    }
    /** Confetti: bursts on category reveal and results, a steady rain at the final; cyan sparkles for resurrections. */
    private void embers(float dt){
        String ph=phase();boolean risen=ph.equals("ROUND_RESULTS")&&phaseT<4&&players().stream().anyMatch(p->b(p,"roundResurrected"));
        boolean fin=ph.startsWith("FINAL")||ph.equals("COMPLETED");
        int rate=risen?5:fin?4:ph.equals("CATEGORY_REVEAL")&&phaseT<.6f?14:ph.equals("ROUND_RESULTS")&&phaseT<1f?6:ph.equals("INTRO")&&phaseT<1f?8:0;
        for(int k=0;k<rate;k++){Ember e=new Ember();e.x=MathUtils.random(W);e.y=H+20;e.vx=MathUtils.random(-80f,80f);e.vy=-MathUtils.random(160f,360f);
            e.max=e.life=MathUtils.random(3f,6f);e.size=MathUtils.random(8f,16f);e.c=risen?ThinkOrDieArt.GHOST:ThinkOrDieArt.SEAT[MathUtils.random(ThinkOrDieArt.SEAT.length-1)];embers.add(e);}
        for(Iterator<Ember> it=embers.iterator();it.hasNext();){Ember e=it.next();e.life-=dt;if(e.life<=0||e.y<-40){it.remove();continue;}
            e.x+=(e.vx+MathUtils.sin(clock*3+e.max*7)*60)*dt;e.y+=e.vy*dt;float a=Math.min(1,e.life/e.max*3);
            float spin=MathUtils.sin(clock*8+e.max*11);batch.setColor(e.c.r,e.c.g,e.c.b,a);
            batch.draw(art.pixel,e.x,e.y,e.size/2,e.size/4,e.size,e.size*.5f*Math.abs(spin)+1,1,1,clock*200*e.max%360,0,0,1,1,false,false);}
    }
    /** the last five seconds of answering: a huge number pulses behind the stage */
    private void countdown(){
        if(!phase().equals("ANSWERING"))return;float lf=left();if(lf>5||lf<=0)return;
        int sec=(int)Math.ceil(lf);float frac=sec-lf,k=1-frac;float sc=3.6f-1.2f*ease(Math.min(1,frac*4)),a=Math.min(1,(1-frac)*2.5f)*.35f;
        art.glow(W/2,640,900,900,ThinkOrDieArt.MAGENTA,.25f*a);
        art.text(art.display,String.valueOf(sec),W/2,640+48*sc,sc,ThinkOrDieArt.GOLD,a,0);
        if(k>.9f)impulse(.15f);
    }
    private void impulse(float k){shake=Math.max(shake,k*.4f);}
    private void onPhase(String ph){
        switch(ph){
            case "CATEGORY_REVEAL"->{art.play("sounds/impostor/vote_started.wav",.6f);shake=.5f;impulse(.9f);soundedTiles=-1;for(Lane ln:lanes.values()){ln.count=0;ln.shown=0;}}
            case "ANSWERING"->art.play("sounds/questions/door_lock(done).wav",.45f);
            case "ANSWER_VALIDATION"->{art.play("sounds/questions/door_lock(done).wav",.6f);shake=.35f;}
            case "DISPUTE"->art.play("sounds/cursed_boxes/appearance.wav",.55f);
            case "ROUND_RESULTS"->{boolean risen=players().stream().anyMatch(p->b(p,"roundResurrected"));if(risen){art.play("sounds/cursed_boxes/horror_appearance.wav",.75f);shake=.8f;impulse(1f);}}
            case "FINAL_RESULTS"->{art.play("sounds/results/winner_impact.wav",.85f);shake=1f;impulse(1f);}
            default->{}
        }
    }
    private void updateLanes(float dt){
        for(JsonObject p:players()){String id=s(p,"id");Lane ln=lanes.computeIfAbsent(id,k->new Lane());int c=i(p,"answers");
            if(c>ln.count&&phase().equals("ANSWERING")){ln.prev=ln.count;ln.roll=0;ln.last=clock;ln.bump=1;ln.flash=1;ln.puffT=0;ln.puff="+"+(c-ln.count);
                String latest=latest(id);if(!latest.isEmpty())ln.puff=latest;
                art.play("sounds/impostor/vote_sent.wav",.18f);}
            ln.count=Math.max(c,phase().equals("ANSWERING")||phase().equals("ANSWER_VALIDATION")?ln.count:c);
            ln.shown+=(ln.count-ln.shown)*Math.min(1,dt*6);ln.bump=Math.max(0,ln.bump-dt*3);ln.flash=Math.max(0,ln.flash-dt*2.2f);ln.puffT+=dt;ln.roll=Math.min(1,ln.roll+dt*5);}
    }
    private int raceMax(){int max=15;for(Lane ln:lanes.values())max=Math.max(max,ln.count+4);return max;}
    /** live mode only: the newest answer text of a player (absent when answers are hidden) */
    private String latest(String id){for(var o:arr(t,"live"))if(s(o,"id").equals(id)){var r=o.getAsJsonArray("recent");return r==null||r.isEmpty()?"":r.get(r.size()-1).getAsString();}return "";}

    // ---------------------------------------------------------------- stage
    private void stage(){
        String ph=phase();
        float energy=ph.equals("ANSWERING")?(left()<5.5f?1f:.6f):ph.equals("CATEGORY_REVEAL")||ph.startsWith("FINAL")?.9f:.35f;
        Color acc=ph.equals("ANSWERING")&&left()<5.5f?ThinkOrDieArt.MAGENTA:ThinkOrDieArt.ACID;
        art.studio(W,H,clock,energy,acc);
    }
    private void topBand(){}
    /** Logo chip top left, round chip under it, the category on a big magenta plate, the timer top right. */
    private void header(boolean timed){
        logo(70,1010,.34f);
        art.chip(art.tiny,(tr("РАУНД ","ROUND ")+i(t,"round")+" / "+i(t,"rounds")),148,940,1,ThinkOrDieArt.VIOLET,ThinkOrDieArt.INK,1);
        String cat=category();
        if(!cat.isEmpty()){float a=ease(phaseT*2.2f),sc=.5f;float w=Math.min(1240,art.width(art.display,cat,sc)+90);float pop=1+.06f*(1-back(phaseT*2));
            float pw=w*pop,ph=118*pop;art.plate(W/2-pw/2,975-ph/2,pw,ph,ThinkOrDieArt.MAGENTA,ThinkOrDieArt.GOLD,a);
            art.text(art.display,cat,W/2,975+28,sc,ThinkOrDieArt.INK,a,w-60);}
        if(timed)timer(1810,975,70);
    }
    private void logo(float x,float y,float sc){
        String a="THINK ",b2="OR ",c="DIE";float wa=art.width(art.horror,a,sc),wb=art.width(art.horror,b2,sc),wc=art.width(art.horror,c,sc);
        float pad=26,h=art.horror.getLineHeight()*sc+10;art.plate(x-pad,y-h+14,wa+wb+wc+pad*2,h+6,ThinkOrDieArt.NIGHT,ThinkOrDieArt.GOLD,1);
        art.left(art.horror,a,x,y,sc,ThinkOrDieArt.GOLD,1,0);art.left(art.horror,b2,x+wa,y,sc,ThinkOrDieArt.INK,1,0);art.left(art.horror,c,x+wa+wb,y,sc,ThinkOrDieArt.MAGENTA,1,0);
    }
    private void timer(float cx,float cy,float r){
        float lf=left(),fr=MathUtils.clamp(lf/total(),0,1);boolean hurry=phase().equals("ANSWERING")&&lf<5.5f;
        Color c=hurry?ThinkOrDieArt.MAGENTA:fr>.5f?ThinkOrDieArt.ACID:ThinkOrDieArt.GOLD;
        int sec=(int)Math.ceil(lf);
        if(hurry&&sec!=lastSecond&&sec>0){art.play("sounds/results/count_tick.wav",.5f);shake=Math.max(shake,.18f);}
        lastSecond=sec;
        float pulse=hurry?.5f+.5f*MathUtils.sin(clock*12):0,rr=r*(1+.06f*pulse);
        batch.setColor(0,0,0,.5f);batch.draw(art.soft,cx-rr*1.4f,cy-rr*1.55f,rr*2.8f,rr*2.8f);
        batch.setColor(ThinkOrDieArt.NIGHT);batch.draw(art.round,cx-rr,cy-rr,rr*2,rr*2);
        int n=120;for(int k=0;k<n;k++){float f=k/(float)n;float ang=90-f*360;float x=cx+MathUtils.cosDeg(ang)*(rr-9),y=cy+MathUtils.sinDeg(ang)*(rr-9);
            boolean on=f<=fr;batch.setColor(on?c.r:1,on?c.g:1,on?c.b:1,on?1:.10f);batch.draw(art.pixel,x-7,y-5,7,5,14,10,1,1,ang+90,0,0,1,1,false,false);}
        art.glow(cx,cy,rr*3,rr*3,c,.18f+.25f*pulse);
        art.text(art.big,String.valueOf(Math.max(0,sec)),cx,cy+24,1f+.15f*pulse,hurry?ThinkOrDieArt.GOLD:ThinkOrDieArt.INK,1,0);
    }

    // ---------------------------------------------------------------- INTRO / CATEGORY
    private void intro(){
        float a=ease(phaseT*1.4f),slam=back(phaseT*1.6f);
        float ls=1.05f*Math.max(.2f,slam);logo(W/2-art.width(art.horror,"THINK OR DIE",ls)/2,900,ls);
        art.chip(art.small,tr("ДУМАЙ БЫСТРО. ИЛИ УМРИ.","THINK FAST. OR DIE."),W/2,680,1,ThinkOrDieArt.MAGENTA,ThinkOrDieArt.INK,a);
        String[] rules={tr("Одна категория на всех. 30 секунд.","One category for everyone. 30 seconds."),
            tr("Пиши как можно больше верных ответов.","Type as many correct answers as you can."),
            tr("Ответы скрыты. Списать не выйдет.","Answers stay hidden. No copying.")};
        for(int k=0;k<rules.length;k++){float ka=back((phaseT-.5f-k*.25f)*2.2f),x=W/2-560+k*560;if(ka<=0)continue;
            art.plate(x-250,470-90*ka,500,180*Math.min(1,ka),ThinkOrDieArt.PANEL,ThinkOrDieArt.SEAT[(k*2+1)%8],Math.min(1,ka));
            art.text(art.display,String.valueOf(k+1),x-190,515,.6f,ThinkOrDieArt.SEAT[(k*2+1)%8],Math.min(1,ka),0);
            art.paragraph(art.small,rules[k],x+40,522,350,.95f,120,ThinkOrDieArt.INK,Math.min(1,ka));}
        JsonObject pts=t.has("points")?t.getAsJsonObject("points"):new JsonObject();
        Object[][] legend={{"+"+i(pts,"unique"),tr("только у тебя","only you"),ThinkOrDieArt.GOLD},{"+"+i(pts,"two"),tr("у двоих","two players"),ThinkOrDieArt.GREEN},{"+"+i(pts,"many"),tr("у трёх и больше","three or more"),ThinkOrDieArt.ORANGE},{String.valueOf(i(pts,"invalid")),tr("неверно","wrong"),ThinkOrDieArt.NEUTRAL}};
        for(int k=0;k<4;k++){float ka=back((phaseT-1.4f-k*.15f)*2.4f),cx=W/2-540+k*360;if(ka<=0)continue;float al=Math.min(1,ka);
            art.plate(cx-150,150,300,150*Math.min(1,ka),(Color)legend[k][2],null,al);
            art.text(art.display,(String)legend[k][0],cx,270,.62f,ThinkOrDieArt.NIGHT,al,0);
            art.text(art.small,(String)legend[k][1],cx,195,.85f,ThinkOrDieArt.NIGHT,al,270);}
    }
    private void categoryReveal(){
        art.chip(art.mid,tr("РАУНД ","ROUND ")+i(t,"round"),W/2,880,1.1f,ThinkOrDieArt.GOLD,ThinkOrDieArt.NIGHT,ease(phaseT*3));
        String full=category();
        float k=back(phaseT*1.5f),al=Math.min(1,phaseT*3);
        float w=1560*Math.max(.05f,k),h=360*Math.max(.05f,k);
        art.plate(W/2-w/2,600-h/2,w,h,ThinkOrDieArt.MAGENTA,ThinkOrDieArt.GOLD,al);
        if(phaseT>.25f)art.paragraph(art.display,full,W/2,690,1420,.92f,250,ThinkOrDieArt.INK,Math.min(1,(phaseT-.25f)*4));
        if(phaseT<.05f)art.play("sounds/results/winner_impact.wav",.35f);
        art.text(art.small,tr("ПРИГОТОВЬТЕСЬ!","GET READY!"),W/2,330,1.1f,ThinkOrDieArt.GOLD,.6f+.4f*MathUtils.sin(clock*6),0);
        timer(W/2,190,62);
    }

    // ---------------------------------------------------------------- ANSWERING: the line-up
    /**
     * The contestants stand on neon podium discs, each over a big counter chip in their colour. Every answer makes the
     * character jump and pops a +1; the leader gets a gold spotlight and a crown chip; whoever goes quiet greys out.
     * Answers stay hidden: only the counts are public.
     */
    private void race(boolean checking){
        var ps=players();int n=Math.max(1,ps.size());
        int best=0;for(Lane ln:lanes.values())best=Math.max(best,ln.count);
        float span=Math.min(236,1740f/n),x0=W/2-span*(n-1)/2f,floor=330;
        float charH=Math.min(420,span*1.95f);
        for(int k=0;k<ps.size();k++){JsonObject p=ps.get(k);String id=s(p,"id");Lane ln=lanes.computeIfAbsent(id,x->new Lane());
            boolean ghost=b(p,"ghost");Color c=ghost?ThinkOrDieArt.GHOST:seatColor(id);float a=ease(phaseT*2.2f-k*.07f);
            float cx=x0+k*span;
            boolean leader=best>0&&ln.count==best;
            float idle=clock-ln.last;boolean quiet=!checking&&phase().equals("ANSWERING")&&(ln.count==0?phaseT>7f:idle>6f);
            float life=quiet?.5f:1f;
            if(leader){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1f,.9f,.4f,.28f*a);
                batch.draw(art.beam,cx-span*.7f,floor-20,span*1.4f,H-floor);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            art.disc(cx,floor,span*.86f,quiet?ThinkOrDieArt.NEUTRAL:c,a);
            Texture body=art.body(character(id));
            float hop=ln.bump>0?MathUtils.sin((1-ln.bump)*MathUtils.PI)*charH*.12f:0;
            float squash=ln.bump>.85f?1-(ln.bump-.85f)*.8f:1+MathUtils.sin(clock*2.4f+k)*.015f;
            float bob=ghost?MathUtils.sin(clock*1.6f+k)*10+14:0;
            if(body!=null){float h=charH*squash,w=charH*body.getWidth()/body.getHeight()*(2-squash);
                float g=quiet?.55f:1f;
                batch.setColor(ghost?new Color(.65f,.9f,1f,.7f*a):new Color(g,g,g*(quiet?1.1f:1),a));
                batch.draw(body,cx-w/2,floor+hop+bob,w,h);}
            else art.portrait(character(id),cx,floor+charH*.5f,span*.3f,c,ghost,a);
            if(ln.flash>0)art.glow(cx,floor+charH*.5f+hop,span*1.5f,charH*1.3f,c,.35f*ln.flash);
            if(ln.puffT<.9f){float pa=1-ln.puffT/.9f,pop=back(ln.puffT*4);
                art.chip(art.big,"+1",cx,floor+charH+40+ln.puffT*80,.7f*Math.max(.3f,pop),ThinkOrDieArt.GOLD,ThinkOrDieArt.NIGHT,pa);}
            if(leader&&!checking)art.chip(art.tiny,tr("★ ЛИДЕР","★ LEADER"),cx,floor+charH+(ln.puffT<.9f?110:30),1,ThinkOrDieArt.GOLD,ThinkOrDieArt.NIGHT,a);
            // counter chip
            float r=ease(ln.roll),cw=Math.min(span*.82f,190),ch=104,cy=floor-112;
            art.plate(cx-cw/2,cy-ch/2,cw,ch,quiet?ThinkOrDieArt.PANEL:c,leader?ThinkOrDieArt.GOLD:Color.WHITE,a);
            Color num=quiet?ThinkOrDieArt.DIM:ThinkOrDieArt.NIGHT;
            if(r<1&&ln.prev!=ln.count)art.text(art.big,String.valueOf(ln.prev),cx,cy+24+r*40,.95f,num,(1-r)*a,0);
            art.text(art.big,String.valueOf(ln.count),cx,cy+24-(1-r)*40,.95f*(1+.2f*(1-r)),num,a*(r<1?r:1),0);
            art.text(art.small,name(id),cx,cy-ch/2-22,.85f,ghost?ThinkOrDieArt.GHOST:ThinkOrDieArt.INK,a,span-10);
            String st=checking?tr("ПРОВЕРКА","CHECKING"):quiet?tr("МОЛЧИТ","SILENT"):ghost?tr("ПРИЗРАК","GHOST"):"";
            if(!st.isEmpty())art.text(art.tiny,st,cx,cy-ch/2-62,.95f,quiet?ThinkOrDieArt.MAGENTA:ThinkOrDieArt.DIM,a,0);
            if(checking){long done=l(p,"checked");float f=ln.count==0?1:Math.min(1,done/(float)ln.count);float bw=cw;
                art.rect(cx-bw/2,cy-ch/2-84,bw,6,Color.WHITE,.15f*a);art.rect(cx-bw/2,cy-ch/2-84,bw*f,6,ThinkOrDieArt.ACID,a);}
        }
        if(checking)art.chip(art.mid,tr("ПРОВЕРЯЕМ ОТВЕТЫ…","CHECKING ANSWERS…"),W/2,830,1,ThinkOrDieArt.ACID,ThinkOrDieArt.NIGHT,.75f+.25f*MathUtils.sin(clock*5));
        else art.text(art.tiny,tr("ОТВЕЧАЙ НА ТЕЛЕФОНЕ  ·  ОТВЕТЫ СКРЫТЫ","ANSWER ON YOUR PHONE  ·  ANSWERS STAY HIDDEN"),W/2,34,1,ThinkOrDieArt.DIM,.9f,0);
    }

    // ---------------------------------------------------------------- DISPUTE
    private void disputes(){
        var ds=arr(t,"disputes");
        art.text(art.big,tr("СПОРНЫЕ ОТВЕТЫ","DISPUTED ANSWERS"),W/2,900,.85f,ThinkOrDieArt.ACID,ease(phaseT*2),0);
        art.text(art.small,tr("Голосуйте на телефонах: подходит ли ответ? Автор скрыт.","Vote on your phones: does it fit? The author stays hidden."),W/2,830,.9f,ThinkOrDieArt.DIM,ease(phaseT*2),0);
        float rowH=Math.min(110,560f/Math.max(1,ds.size()));
        for(int k=0;k<ds.size();k++){JsonObject d=ds.get(k);float a=ease(phaseT*2.5f-k*.2f),y=760-(k+1)*rowH;
            art.plate(360,y+8,1200,rowH-16,ThinkOrDieArt.PANEL,ThinkOrDieArt.ACID,a);
            art.left(art.mid,"«"+s(d,"text")+"»",400,y+rowH/2+16,.85f,ThinkOrDieArt.INK,a,760);
            int v=i(d,"votes"),n=Math.max(1,i(d,"voters"));
            for(int m=0;m<n;m++){float x=1250+m*36;art.rect(x,y+rowH/2-12,24,24,m<v?ThinkOrDieArt.ACID:Color.WHITE,(m<v?1:.12f)*a);}
        }
    }

    // ---------------------------------------------------------------- ANSWER_REVEAL
    private Color statusColor(String st){return switch(st){case "UNIQUE"->ThinkOrDieArt.GOLD;case "SHARED"->ThinkOrDieArt.GREEN;case "MANY"->ThinkOrDieArt.ORANGE;case "INVALID","REJECTED"->ThinkOrDieArt.RED;default->ThinkOrDieArt.NEUTRAL;};}
    private String statusName(String st){return switch(st){case "UNIQUE"->tr("УНИКАЛЬНО","UNIQUE");case "SHARED"->tr("У ДВОИХ","SHARED");case "MANY"->tr("У МНОГИХ","COMMON");case "INVALID"->tr("НЕВЕРНО","WRONG");case "REJECTED"->tr("ОТКЛОНЕНО","VOTED DOWN");default->tr("НЕ ПРОВЕРЕНО","UNCHECKED");};}
    private void reveal(){
        var tiles=arr(t,"reveal");int n=tiles.size();
        if(n==0){art.chip(art.big,tr("НИКТО НЕ ОТВЕТИЛ","NOBODY ANSWERED"),W/2,560,1,ThinkOrDieArt.RED,ThinkOrDieArt.INK,ease(phaseT*2));return;}
        int cols=n<=6?2:n<=15?3:n<=28?4:5;
        float areaTop=880,areaBottom=50,gx=22,gy=16,tw=(1800-gx*(cols-1))/cols;
        int rowsFit=(int)Math.max(1,(areaTop-areaBottom+gy)/(78+gy));int maxTiles=rowsFit*cols;boolean overflow=n>maxTiles;int shownN=overflow?maxTiles-1:n;
        int rows=(int)Math.ceil(Math.min(n,maxTiles)/(float)cols);float th=Math.min(104,(areaTop-areaBottom-gy*(rows-1))/rows);
        float dur=total(),step=Math.min(.09f,Math.max(.035f,(dur-2.5f)/Math.max(1,shownN)));
        for(int k=0;k<shownN;k++){float appear=.25f+k*step,lt=phaseT-appear;if(lt<0)continue;
            if(k>soundedTiles){soundedTiles=k;String st=s(tiles.get(k),"status");
                art.play(st.equals("UNIQUE")?"sounds/results/points_land.wav":st.equals("INVALID")||st.equals("REJECTED")?"sounds/impostor/wooden_stumb_hit.wav":"sounds/results/row_whoosh.wav",st.equals("UNIQUE")?.5f:.3f);
                if(st.equals("UNIQUE"))shake=Math.max(shake,.2f);}
            JsonObject tile=tiles.get(k);int col=k%cols,row=k/cols;float x=60+col*(tw+gx),y=areaTop-(row+1)*th-row*gy;
            float pop=back(lt*4.5f),a=Math.min(1,lt*6);String st=s(tile,"status");Color c=statusColor(st);boolean wrong=st.equals("INVALID")||st.equals("REJECTED");
            float cx=x+tw/2,cy=y+th/2,w=tw*Math.max(.2f,pop),h=th*Math.max(.2f,pop);
            boolean neutral=!wrong&&!(st.equals("UNIQUE")||st.equals("SHARED")||st.equals("MANY"));
            Color fill=wrong||neutral?ThinkOrDieArt.PANEL:c;
            art.plate(cx-w/2,cy-h/2,w,h,fill,wrong?ThinkOrDieArt.RED:neutral?ThinkOrDieArt.NEUTRAL:Color.WHITE,a);
            if(pop<.8f)continue;
            float fs=Math.min(1,th/96f);Color ink=wrong?ThinkOrDieArt.DIM:neutral?ThinkOrDieArt.INK:ThinkOrDieArt.NIGHT;
            String label=s(tile,"label");float lx=x+22;
            var who=tile.getAsJsonArray("players");
            if(who!=null){int nw=Math.min(4,who.size());for(int m=nw-1;m>=0;m--){String id=who.get(m).getAsString();art.portrait(character(id),lx+m*16+16,cy,Math.min(17,th*.2f),Color.WHITE,b(playerById(id),"ghost"),a);}lx+=nw*16+36;}
            art.left(art.mid,label,lx,cy+16*fs,.78f*fs,ink,a,tw-(lx-x)-150);
            if(wrong){float lw=Math.min(tw-(lx-x)-150,art.width(art.mid,label,.78f*fs));art.rect(lx-4,cy-3,lw+8,5,ThinkOrDieArt.RED,a);}
            int pts=i(tile,"points");String ps=(pts>0?"+":"")+pts;
            art.chip(art.small,ps,x+tw-70,cy+12*fs,.9f*fs,ThinkOrDieArt.NIGHT,wrong||neutral?ThinkOrDieArt.DIM:c,a);
            art.text(art.tiny,statusName(st),x+tw-70,cy-22*fs,.72f*fs,ink,a,140);
            if(lt<.3f&&st.equals("UNIQUE"))art.glow(cx,cy,tw*1.3f,th*2.2f,ThinkOrDieArt.GOLD,.45f*(1-lt/.3f));
        }
        if(overflow&&phaseT>.5f+shownN*step)art.chip(art.small,"+"+(n-shownN)+tr(" ещё"," more"),W-170,areaBottom+10,1,ThinkOrDieArt.VIOLET,ThinkOrDieArt.INK,1);
    }
    private JsonObject playerById(String id){for(var p:players())if(s(p,"id").equals(id))return p;return null;}

    // ---------------------------------------------------------------- ROUND RESULTS
    private void scoreboard(){
        var ps=new ArrayList<>(players());ps.sort((a,c)->Long.compare(l(c,"points"),l(a,"points")));
        art.chip(art.mid,tr("ИТОГИ РАУНДА","ROUND RESULTS"),W/2,860,1.1f,ThinkOrDieArt.GOLD,ThinkOrDieArt.NIGHT,ease(phaseT*2.5f));
        long best=1;for(var p:ps)best=Math.max(best,l(p,"points"));
        float rowH=Math.min(96,740f/Math.max(1,ps.size()));
        for(int k=0;k<ps.size();k++){JsonObject p=ps.get(k);String id=s(p,"id");float ka=back(phaseT*2.6f-k*.12f),a=Math.min(1,Math.max(0,ka)),y=790-(k+1)*rowH;boolean ghost=b(p,"ghost");Color c=ghost?ThinkOrDieArt.GHOST:seatColor(id);
            if(a<=0)continue;float slide=(1-Math.min(1,ka))*-400;
            art.plate(150+slide,y+8,1620,rowH-16,ThinkOrDieArt.PANEL,k==0?ThinkOrDieArt.GOLD:null,a);
            float bx=150+slide;
            batch.setColor(k==0?ThinkOrDieArt.GOLD:c);batch.draw(art.round,bx+18,y+rowH/2-30,60,60);
            art.text(art.big,String.valueOf(k+1),bx+48,y+rowH/2+20,.55f,ThinkOrDieArt.NIGHT,a,0);
            art.portrait(character(id),bx+130,y+rowH/2,rowH*.33f,c,ghost,a);
            art.left(art.mid,name(id),bx+185,y+rowH/2+18,.75f,ThinkOrDieArt.INK,a,300);
            art.left(art.tiny,tr("верно ","correct ")+i(p,"roundCorrect")+tr("  ·  уникально ","  ·  unique ")+i(p,"roundUnique")+tr("  ·  ошибок ","  ·  wrong ")+i(p,"roundIncorrect"),bx+187,y+rowH/2-18,.9f,ThinkOrDieArt.DIM,a,0);
            int rp=i(p,"roundPoints");float shownRp=rp*ease(phaseT*1.2f-.4f);
            art.chip(art.small,(rp>0?"+":"")+Math.round(shownRp),bx+700,y+rowH/2,1,ThinkOrDieArt.GREEN,ThinkOrDieArt.NIGHT,a);
            float tot=l(p,"points");float bw=680*Math.max(0,tot)/best*ease(phaseT*1.5f-.3f);
            batch.setColor(1,1,1,.08f*a);art.np(art.plateFill,bx+800,y+rowH/2-16,680,32);
            if(bw>32){batch.setColor(c.r,c.g,c.b,a);art.np(art.plateFill,bx+800,y+rowH/2-16,bw,32);}
            art.right(art.big,String.valueOf(Math.round(tot)),bx+1595,y+rowH/2+22,.62f,ThinkOrDieArt.INK,a);
        }
    }
    /** Ghosts who came back this round (first seconds of the round results). */
    private void resurrection(){
        List<JsonObject> risen=new ArrayList<>();for(var p:players())if(b(p,"roundResurrected"))risen.add(p);
        if(risen.isEmpty()||phaseT>3.6f)return;
        float a=phaseT<.3f?phaseT/.3f:phaseT>3f?(3.6f-phaseT)/.6f:1;
        art.rect(0,0,W,H,ThinkOrDieArt.NIGHT,.6f*a);
        art.glow(W/2,560,1400,1000,ThinkOrDieArt.GHOST,.35f*a);
        for(int k=0;k<risen.size();k++){String id=s(risen.get(k),"id");float cx=W/2+(k-(risen.size()-1)/2f)*360;float rise=back(phaseT*1.3f);
            Texture body=art.body(character(id));
            if(body!=null){float h=420,w=h*body.getWidth()/body.getHeight();batch.setColor(1,1,1,a);batch.draw(body,cx-w/2,180+rise*60,w,h);}
            art.chip(art.mid,name(id),cx,150+rise*60,.9f,ThinkOrDieArt.GHOST,ThinkOrDieArt.NIGHT,a);}
        art.chip(art.big,tr("ВОСКРЕС!","BACK FROM THE DEAD!"),W/2,880,1.1f,ThinkOrDieArt.GHOST,ThinkOrDieArt.NIGHT,a);
        art.text(art.small,tr("Пять верных ответов, и ни одного общего","Five correct answers, not one shared"),W/2,780,1,ThinkOrDieArt.INK,a,0);
    }

    // ---------------------------------------------------------------- FINAL
    private void podium(){
        var st=arr(t,"standings");
        logo(70,1010,.34f);
        art.chip(art.big,tr("ПОБЕДИТЕЛИ","THE WINNERS"),W/2,980,1,ThinkOrDieArt.GOLD,ThinkOrDieArt.NIGHT,ease(phaseT*2));
        float[] px={W/2,W/2-470,W/2+470},ph={300,210,150};Color[] pc={ThinkOrDieArt.GOLD,new Color(.82f,.86f,.95f,1),new Color(1f,.6f,.3f,1)};
        int shown=0;
        for(int k=0;k<st.size()&&shown<3;k++,shown++){JsonObject s=st.get(k);String id=s(s,"playerId");int place=Math.min(3,i(s,"rank"))-1;int slot=shown;
            float rise=back(phaseT*1.4f-(2-slot)*.5f),a=Math.min(1,Math.max(0,rise)),h=ph[slot]*Math.max(0,rise),x=px[slot];
            Color c=pc[Math.max(0,place)];if(a<=0)continue;
            art.plate(x-180,110,360,h,c,Color.WHITE,a);
            art.text(art.display,String.valueOf(i(s,"rank")),x,110+h-30,.85f,ThinkOrDieArt.NIGHT,a,0);
            Texture body=art.body(character(id));float bh=slot==0?400:330;
            if(body!=null){float bw=bh*body.getWidth()/body.getHeight(),hop=slot==0?Math.abs(MathUtils.sin(clock*3))*18:0;batch.setColor(1,1,1,a);batch.draw(body,x-bw/2,110+h+hop,bw,bh);}
            else art.portrait(character(id),x,110+h+110,78,c,false,a);
            art.chip(art.mid,name(id),x,110+h+bh+40,.8f,c,ThinkOrDieArt.NIGHT,a);
            art.text(art.small,l(s,"points")+tr(" очков"," points"),x,90,.95f,ThinkOrDieArt.INK,a,330);
            if(l(s,"souls")>0)art.chip(art.tiny,"+"+l(s,"souls")+tr(" душ"," souls"),x,48,1,ThinkOrDieArt.MAGENTA,ThinkOrDieArt.INK,a);
            if(slot==0&&phaseT>1.4f)art.glow(x,110+h+200,700,700,c,.18f+.06f*MathUtils.sin(clock*4));
        }
        float y=860;int k=0;
        for(JsonObject s:st){if(k>=3){String id=s(s,"playerId");String line=i(s,"rank")+".  "+name(id)+"   "+l(s,"points")+(b(s,"resurrected")?tr("   ВОСКРЕС","   RISEN"):"");
                float a=ease(phaseT*1.2f-2f-k*.1f);art.left(art.small,line,1500,y-(k-3)*44,.8f,b(s,"resurrected")?ThinkOrDieArt.GHOST:ThinkOrDieArt.DIM,a,380);}
            k++;}
        if(phase().equals("COMPLETED")||phaseT>4)art.text(art.tiny,tr("ENTER: вернуться в лобби","ENTER: back to the lobby"),W/2,16,1,ThinkOrDieArt.DIM,.6f+.4f*MathUtils.sin(clock*3),0);
    }

    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){if(created){batch.dispose();art.dispose();}}
}
