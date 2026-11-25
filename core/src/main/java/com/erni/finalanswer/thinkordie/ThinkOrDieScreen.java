package com.erni.finalanswer.thinkordie;

import com.erni.finalanswer.localization.Localization;
import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.MathUtils;
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
    private JsonObject state,t;private final LongSupplier serverNow;private final Consumer<String> onEnd;
    private float clock,shake,phaseT;private String lastPhase="";private int lastRound=-1,lastSecond=-1,soundedTiles=-1;

    private static final class Lane{float shown,bump,flash;int count;String puff="";float puffT=9;}
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
        ScreenUtils.clear(0.02f,0.015f,0.017f,1);
        cam.position.set(W/2+MathUtils.sin(clock*63)*shake*12,H/2+MathUtils.cos(clock*57)*shake*9,0);vp.apply();batch.setProjectionMatrix(cam.combined);
        batch.begin();
        stage();
        switch(ph){
            case "INTRO"->intro();
            case "CATEGORY_REVEAL"->categoryReveal();
            case "ANSWERING","ANSWER_VALIDATION"->{header(true);race(ph.equals("ANSWER_VALIDATION"));}
            case "DISPUTE"->{header(true);disputes();}
            case "ANSWER_REVEAL"->{header(false);reveal();}
            case "ROUND_RESULTS"->{header(false);scoreboard();resurrection();}
            case "FINAL_RESULTS","COMPLETED"->podium();
            default->{}
        }
        art.grain(W,H,clock,.9f);
        batch.end();
    }
    private void onPhase(String ph){
        switch(ph){
            case "CATEGORY_REVEAL"->{art.play("sounds/impostor/vote_started.wav",.6f);shake=.5f;soundedTiles=-1;for(Lane ln:lanes.values()){ln.count=0;ln.shown=0;}}
            case "ANSWERING"->art.play("sounds/questions/door_lock(done).wav",.45f);
            case "ANSWER_VALIDATION"->{art.play("sounds/questions/door_lock(done).wav",.6f);shake=.35f;}
            case "DISPUTE"->art.play("sounds/cursed_boxes/appearance.wav",.55f);
            case "ROUND_RESULTS"->{boolean risen=players().stream().anyMatch(p->b(p,"roundResurrected"));if(risen){art.play("sounds/cursed_boxes/horror_appearance.wav",.75f);shake=.8f;}}
            case "FINAL_RESULTS"->{art.play("sounds/results/winner_impact.wav",.85f);shake=1f;}
            default->{}
        }
    }
    private void updateLanes(float dt){
        for(JsonObject p:players()){String id=s(p,"id");Lane ln=lanes.computeIfAbsent(id,k->new Lane());int c=i(p,"answers");
            if(c>ln.count&&phase().equals("ANSWERING")){ln.bump=1;ln.flash=1;ln.puffT=0;ln.puff="+"+(c-ln.count);
                String latest=latest(id);if(!latest.isEmpty())ln.puff=latest;
                art.play("sounds/impostor/vote_sent.wav",.18f);}
            ln.count=Math.max(c,phase().equals("ANSWERING")||phase().equals("ANSWER_VALIDATION")?ln.count:c);
            ln.shown+=(ln.count-ln.shown)*Math.min(1,dt*6);ln.bump=Math.max(0,ln.bump-dt*3);ln.flash=Math.max(0,ln.flash-dt*2.2f);ln.puffT+=dt;}
    }
    /** live mode only: the newest answer text of a player (absent when answers are hidden) */
    private String latest(String id){for(var o:arr(t,"live"))if(s(o,"id").equals(id)){var r=o.getAsJsonArray("recent");return r==null||r.isEmpty()?"":r.get(r.size()-1).getAsString();}return "";}

    // ---------------------------------------------------------------- stage
    private void stage(){
        if(art.background!=null){batch.setColor(1,1,1,1);batch.draw(art.background,0,0,W,H);}
        else{
            for(int k=0;k<24;k++){float f=k/23f;art.rect(0,H*f,W,H/23f+1,new Color(.03f+.07f*f,.018f+.02f*f,.02f+.02f*f,1),1);}
            for(int k=0;k<5;k++){float x=(clock*18*(k%2==0?1:-1)+k*430)%(W+800)-400;art.glow(x,200+k*170,900,520,new Color(.45f,.05f,.04f,1),.07f);}
        }
        boolean ghostHeavy=players().stream().filter(p->b(p,"ghost")).count()*2>players().size();
        art.glow(W/2,H*.62f,1700,900,ghostHeavy?ThinkOrDieArt.GHOST:new Color(.6f,.08f,.06f,1),.06f+.02f*MathUtils.sin(clock*1.3f));
        art.shade(W/2,H/2,W*1.9f,H*2.2f,0);
        // vignette
        for(int k=0;k<6;k++){float a=.10f;art.rect(0,0,W,40+k*24,Color.BLACK,a);art.rect(0,H-(40+k*24),W,40+k*24,Color.BLACK,a);}
    }
    private void header(boolean timed){
        art.left(art.horror,"THINK OR DIE",56,1046,.36f,ThinkOrDieArt.INK,.9f,0);
        art.left(art.tiny,(tr("РАУНД ","ROUND ")+i(t,"round")+" / "+i(t,"rounds")),60,966,1,ThinkOrDieArt.DIM,1,0);
        String cat=category();
        if(!cat.isEmpty()){float a=ease(phaseT*2);art.paragraph(art.display,cat,W/2,1040,1240,.56f,120,ThinkOrDieArt.INK,a);}
        if(timed)timer(1800,980,62);
    }
    private void timer(float cx,float cy,float r){
        float lf=left(),fr=MathUtils.clamp(lf/total(),0,1);boolean hurry=phase().equals("ANSWERING")&&lf<5.5f;
        Color c=hurry?ThinkOrDieArt.BLOOD:ThinkOrDieArt.ACID;
        int sec=(int)Math.ceil(lf);
        if(hurry&&sec!=lastSecond&&sec>0){art.play("sounds/results/count_tick.wav",.5f);shake=Math.max(shake,.18f);}
        lastSecond=sec;
        art.shade(cx,cy-8,r*3,r*3,.7f);
        art.rect(cx-r*.82f,cy-r*.82f,r*1.64f,r*1.64f,Color.BLACK,0);
        int n=90;for(int k=0;k<n;k++){float f=k/(float)n;float ang=90-f*360;float x=cx+MathUtils.cosDeg(ang)*r,y=cy+MathUtils.sinDeg(ang)*r;
            boolean on=f<=fr;batch.setColor(on?c.r:1,on?c.g:1,on?c.b:1,on?1:.08f);batch.draw(art.pixel,x-5,y-2,5,2,10,4,1,1,ang+90,0,0,1,1,false,false);}
        float pulse=hurry?.5f+.5f*MathUtils.sin(clock*12):0;
        art.glow(cx,cy,r*3.2f,r*3.2f,c,.12f+.2f*pulse);
        art.text(art.big,String.valueOf(Math.max(0,sec)),cx,cy+22,hurry?1.05f+.1f*pulse:.95f,hurry?ThinkOrDieArt.BLOOD:ThinkOrDieArt.INK,1,0);
    }

    // ---------------------------------------------------------------- INTRO / CATEGORY
    private void intro(){
        float a=ease(phaseT*1.2f),flick=MathUtils.random()<.04f?.55f:1;
        art.glow(W/2,760,1500,520,ThinkOrDieArt.BLOOD,.18f*a);
        art.text(art.horror,"THINK OR DIE",W/2,880,1.05f+.03f*MathUtils.sin(clock*2),ThinkOrDieArt.INK,a*flick,1700);
        art.text(art.small,tr("ДУМАЙ БЫСТРО. ИЛИ УМРИ.","THINK FAST. OR DIE."),W/2,700,1,ThinkOrDieArt.BLOOD,a,0);
        String[] rules={tr("Одна категория на всех. 30 секунд. Пиши столько верных ответов, сколько успеешь.","One category for everyone. 30 seconds. Type as many correct answers as you can."),
            tr("Ответы на экране скрыты, пока идёт время. Списать не выйдет.","Answers stay hidden on screen while the clock runs. No copying."),
            tr("Призрак оживает: пять верных ответов за раунд, и все только его.","A ghost comes back: five correct answers in one round, all of them theirs alone.")};
        for(int k=0;k<rules.length;k++){float ka=ease((phaseT-.6f-k*.35f)*2);art.text(art.mid,rules[k],W/2,580-k*70,.82f,ThinkOrDieArt.INK,ka,1600);}
        JsonObject pts=t.has("points")?t.getAsJsonObject("points"):new JsonObject();
        float ka=ease((phaseT-1.8f)*2),y=300;
        Object[][] legend={{"+"+i(pts,"unique"),tr("только у тебя","only you"),ThinkOrDieArt.GOLD},{"+"+i(pts,"two"),tr("у двоих","two players"),ThinkOrDieArt.GREEN},{"+"+i(pts,"many"),tr("у трёх и больше","three or more"),ThinkOrDieArt.ORANGE},{String.valueOf(i(pts,"invalid")),tr("неверно","wrong"),ThinkOrDieArt.RED}};
        for(int k=0;k<4;k++){float cx=W/2-570+k*380;art.slab(cx-160,y-70,320,120,(Color)legend[k][2],ka);art.text(art.big,(String)legend[k][0],cx,y+30,.9f,(Color)legend[k][2],ka,0);art.text(art.tiny,(String)legend[k][1],cx,y-30,1,ThinkOrDieArt.DIM,ka,0);}
    }
    private void categoryReveal(){
        float k=ease(phaseT*1.6f);
        art.text(art.big,tr("РАУНД ","ROUND ")+i(t,"round"),W/2,860,.8f,ThinkOrDieArt.BLOOD,ease(phaseT*3),0);
        String cat=category();float sc=.95f+.6f*(1-back(phaseT*1.4f));
        for(int g=2;g>=1;g--)art.paragraph(art.display,cat,W/2+g*14*(1-k),720,1500,sc,320,ThinkOrDieArt.BLOOD,.25f*(1-k));
        art.paragraph(art.display,cat,W/2,720,1500,sc,320,ThinkOrDieArt.INK,k);
        art.text(art.small,tr("ПРИГОТОВЬТЕСЬ","GET READY"),W/2,260,1,ThinkOrDieArt.DIM,.6f+.4f*MathUtils.sin(clock*5),0);
        timer(W/2,170,46);
    }

    // ---------------------------------------------------------------- ANSWERING: the race
    private void race(boolean checking){
        var ps=players();int n=Math.max(1,ps.size());
        float top=880,bottom=70,laneH=Math.min(100,(top-bottom)/n),gap=laneH*.14f;
        int max=8;for(Lane ln:lanes.values())max=Math.max(max,ln.count+3);
        float trackL=470,trackR=1700;
        for(int k=0;k<ps.size();k++){JsonObject p=ps.get(k);String id=s(p,"id");Lane ln=lanes.computeIfAbsent(id,x->new Lane());
            float y=top-(k+1)*laneH+gap/2,h=laneH-gap,cy=y+h/2;boolean ghost=b(p,"ghost");Color c=ghost?ThinkOrDieArt.GHOST:seatColor(id);
            float a=ease(phaseT*3-k*.12f);
            art.slab(60,y,1800,h,c,a);
            art.portrait(character(id),112,cy,h*.36f,c,ghost,a);
            art.left(art.mid,name(id),160,cy+16,.72f,ghost?ThinkOrDieArt.GHOST:ThinkOrDieArt.INK,a,280);
            if(ghost)art.left(art.tiny,tr("ПРИЗРАК","GHOST"),162,cy-14,.9f,ThinkOrDieArt.GHOST,a,0);
            // track: dashed centre line and checkpoints every 5 answers
            for(float x=trackL;x<trackR;x+=36)art.rect(x,cy-1,18,2,Color.WHITE,.08f*a);
            for(int m=5;m<max;m+=5){float x=trackL+(trackR-trackL)*m/(float)max;art.rect(x,y+6,2,h-12,Color.WHITE,.12f*a);art.text(art.tiny,String.valueOf(m),x,y+h-6,.7f,ThinkOrDieArt.DIM,.6f*a,0);}
            float carW=Math.min(150,h*1.55f),prog=ln.shown/max,cx=trackL+(trackR-trackL-carW)*prog;
            float bounce=ln.bump*8*MathUtils.sin(ln.bump*12);
            if(ln.flash>0)art.glow(cx+carW/2,cy,carW*2.6f,h*2.2f,c,.35f*ln.flash);
            // exhaust streak behind a moving car
            float spd=Math.max(0,ln.count-ln.shown);if(spd>.05f)for(int s=1;s<6;s++)art.rect(cx-s*22,cy-6+MathUtils.random(-2f,2f),16,3,c,.25f*a*(1-s/6f)*Math.min(1,spd));
            art.car(cx,cy-carW*40/128f/2+bounce,carW,c,a,ghost);
            if(ln.puffT<1.4f&&!ln.puff.isEmpty()){float pa=1-ln.puffT/1.4f;art.text(art.small,ln.puff,cx+carW/2,cy+h*.55f+ln.puffT*40,.85f,c,pa*a,360);}
            art.right(art.big,String.valueOf(ln.count),1840,cy+24,.9f,ThinkOrDieArt.INK,a);
            if(checking){long done=l(p,"checked");float f=ln.count==0?1:Math.min(1,done/(float)ln.count);art.rect(trackL,y+4,(trackR-trackL)*f,3,ThinkOrDieArt.ACID,.7f*a);}
        }
        if(checking){float sweep=(clock*900)%(W+400)-200;art.glow(sweep,(top+bottom)/2,260,top-bottom+80,ThinkOrDieArt.ACID,.10f);
            art.text(art.big,tr("ПРОВЕРЯЕМ ОТВЕТЫ…","CHECKING ANSWERS…"),W/2,940,.7f,ThinkOrDieArt.ACID,.7f+.3f*MathUtils.sin(clock*6),0);}
        else if(b(t,"hiddenAnswers"))art.text(art.tiny,tr("ОТВЕТЫ СКРЫТЫ ДО РАСКРЫТИЯ","ANSWERS STAY HIDDEN UNTIL THE REVEAL"),W/2,940,1,ThinkOrDieArt.DIM,.8f,0);
    }

    // ---------------------------------------------------------------- DISPUTE
    private void disputes(){
        var ds=arr(t,"disputes");
        art.text(art.big,tr("СПОРНЫЕ ОТВЕТЫ","DISPUTED ANSWERS"),W/2,900,.85f,ThinkOrDieArt.ACID,ease(phaseT*2),0);
        art.text(art.small,tr("Голосуйте на телефонах: подходит ли ответ? Автор скрыт.","Vote on your phones: does it fit? The author stays hidden."),W/2,830,.9f,ThinkOrDieArt.DIM,ease(phaseT*2),0);
        float rowH=Math.min(110,560f/Math.max(1,ds.size()));
        for(int k=0;k<ds.size();k++){JsonObject d=ds.get(k);float a=ease(phaseT*2.5f-k*.2f),y=760-(k+1)*rowH;
            art.slab(360,y+8,1200,rowH-16,ThinkOrDieArt.NEUTRAL,a);
            art.left(art.mid,"«"+s(d,"text")+"»",400,y+rowH/2+16,.85f,ThinkOrDieArt.INK,a,760);
            int v=i(d,"votes"),n=Math.max(1,i(d,"voters"));
            for(int m=0;m<n;m++){float x=1250+m*36;art.rect(x,y+rowH/2-12,24,24,m<v?ThinkOrDieArt.ACID:Color.WHITE,(m<v?1:.12f)*a);}
        }
    }

    // ---------------------------------------------------------------- ANSWER_REVEAL
    private Color statusColor(String st){return switch(st){case "UNIQUE"->ThinkOrDieArt.GOLD;case "SHARED"->ThinkOrDieArt.GREEN;case "MANY"->ThinkOrDieArt.ORANGE;case "INVALID","REJECTED"->ThinkOrDieArt.RED;default->ThinkOrDieArt.NEUTRAL;};}
    private String statusName(String st){return switch(st){case "UNIQUE"->tr("УНИКАЛЬНО","UNIQUE");case "SHARED"->tr("У ДВОИХ","SHARED");case "MANY"->tr("У МНОГИХ","COMMON");case "INVALID"->tr("НЕВЕРНО","WRONG");case "REJECTED"->tr("ОТКЛОНЕНО","VOTED DOWN");default->tr("СПОРНО","DISPUTED");};}
    private void reveal(){
        var tiles=arr(t,"reveal");int n=tiles.size();
        if(n==0){art.text(art.big,tr("НИКТО НЕ ОТВЕТИЛ","NOBODY ANSWERED"),W/2,560,1,ThinkOrDieArt.RED,ease(phaseT*2),0);return;}
        int cols=n<=6?2:n<=15?3:n<=28?4:5;
        float areaTop=900,areaBottom=60,gx=24,gy=14,tw=(1800-gx*(cols-1))/cols;
        int rowsFit=(int)Math.max(1,(areaTop-areaBottom+gy)/(78+gy));int maxTiles=rowsFit*cols;boolean overflow=n>maxTiles;int shownN=overflow?maxTiles-1:n;
        int rows=(int)Math.ceil(Math.min(n,maxTiles)/(float)cols);float th=Math.min(110,(areaTop-areaBottom-gy*(rows-1))/rows);
        float dur=total(),step=Math.min(.42f,Math.max(.08f,(dur-2.5f)/Math.max(1,shownN)));
        for(int k=0;k<shownN;k++){float appear=.5f+k*step,lt=phaseT-appear;if(lt<0)continue;
            if(k>soundedTiles){soundedTiles=k;String st=s(tiles.get(k),"status");
                art.play(st.equals("UNIQUE")?"sounds/results/points_land.wav":st.equals("INVALID")||st.equals("REJECTED")?"sounds/impostor/wooden_stumb_hit.wav":"sounds/results/row_whoosh.wav",st.equals("UNIQUE")?.5f:.32f);
                if(st.equals("UNIQUE"))shake=Math.max(shake,.25f);}
            JsonObject tile=tiles.get(k);int col=k%cols,row=k/cols;float x=60+col*(tw+gx),y=areaTop-(row+1)*th-row*gy;
            float sc=back(lt*3.2f),a=Math.min(1,lt*4);String st=s(tile,"status");Color c=statusColor(st);
            float cw=tw*sc,ch=th*sc,ox=x+(tw-cw)/2,oy=y+(th-ch)/2;
            art.slab(ox,oy,cw,ch,c,a);if(lt<.35f)art.glow(ox+cw/2,oy+ch/2,cw*1.2f,ch*2.2f,c,.5f*(1-lt/.35f));
            if(st.equals("UNIQUE"))art.glow(ox+cw/2,oy+ch/2,cw*1.1f,ch*1.8f,ThinkOrDieArt.GOLD,.08f+.05f*MathUtils.sin(clock*4+k));
            boolean wrong=st.equals("INVALID")||st.equals("REJECTED");
            art.left(art.mid,s(tile,"label"),ox+20,oy+ch-14,.66f*Math.min(1,th/90f),wrong?new Color(1,.75f,.72f,1):ThinkOrDieArt.INK,a,cw-200);
            if(wrong)art.rect(ox+20,oy+ch-34*Math.min(1,th/90f),Math.min(cw-220,art.width(art.mid,s(tile,"label"),.66f*Math.min(1,th/90f))),3,ThinkOrDieArt.RED,a);
            int pts=i(tile,"points");art.right(art.big,(pts>0?"+":"")+pts,ox+cw-18,oy+ch/2+22,.62f,c,a);
            art.left(art.tiny,statusName(st),ox+cw-170,oy+18,.75f,c,.8f*a,0);
            var who=tile.getAsJsonArray("players");float px=ox+34;
            if(who!=null)for(int m=0;m<who.size()&&m<8;m++){String id=who.get(m).getAsString();art.portrait(character(id),px,oy+22,Math.min(15,th*.16f),seatColor(id),b(playerById(id),"ghost"),a);px+=36;}
        }
        if(overflow&&phaseT>.5f+shownN*step)art.text(art.small,"+"+(n-shownN)+tr(" ещё"," more"),W-200,areaBottom+20,1,ThinkOrDieArt.DIM,1,0);
    }
    private JsonObject playerById(String id){for(var p:players())if(s(p,"id").equals(id))return p;return null;}

    // ---------------------------------------------------------------- ROUND RESULTS
    private void scoreboard(){
        var ps=new ArrayList<>(players());ps.sort((a,c)->Long.compare(l(c,"points"),l(a,"points")));
        art.text(art.big,tr("ИТОГИ РАУНДА","ROUND RESULTS"),W/2,900,.85f,ThinkOrDieArt.INK,ease(phaseT*2),0);
        long best=1;for(var p:ps)best=Math.max(best,l(p,"points"));
        float rowH=Math.min(92,760f/Math.max(1,ps.size()));
        for(int k=0;k<ps.size();k++){JsonObject p=ps.get(k);String id=s(p,"id");float a=ease(phaseT*2.5f-k*.12f),y=830-(k+1)*rowH;boolean ghost=b(p,"ghost");Color c=ghost?ThinkOrDieArt.GHOST:seatColor(id);
            art.slab(160,y+6,1600,rowH-12,c,a);
            art.text(art.big,String.valueOf(k+1),215,y+rowH/2+20,.6f,ThinkOrDieArt.DIM,a,0);
            art.portrait(character(id),300,y+rowH/2,rowH*.32f,c,ghost,a);
            art.left(art.mid,name(id),350,y+rowH/2+16,.7f,ThinkOrDieArt.INK,a,300);
            art.left(art.tiny,i(p,"roundCorrect")+" ✓   "+i(p,"roundUnique")+" ★   "+i(p,"roundIncorrect")+" ✕",352,y+rowH/2-16,.95f,ThinkOrDieArt.DIM,a,0);
            int rp=i(p,"roundPoints");float shownRp=rp*ease(phaseT*1.2f-.4f);
            art.text(art.big,(rp>0?"+":"")+Math.round(shownRp),820,y+rowH/2+22,.7f,rp<0?ThinkOrDieArt.RED:ThinkOrDieArt.ACID,a,0);
            float tot=l(p,"points");float bw=760*Math.max(0,tot)/best*ease(phaseT*1.5f-.3f);
            art.rect(950,y+rowH/2-10,760,20,Color.WHITE,.06f*a);art.rect(950,y+rowH/2-10,bw,20,c,.85f*a);
            art.right(art.big,String.valueOf(Math.round(tot)),1740,y+rowH/2+22,.62f,ThinkOrDieArt.INK,a);
        }
    }
    /** Cinematic overlay for ghosts who came back this round (first seconds of the round results). */
    private void resurrection(){
        List<JsonObject> risen=new ArrayList<>();for(var p:players())if(b(p,"roundResurrected"))risen.add(p);
        if(risen.isEmpty()||phaseT>3.6f)return;
        float a=phaseT<.3f?phaseT/.3f:phaseT>3f?(3.6f-phaseT)/.6f:1;
        art.rect(0,0,W,H,Color.BLACK,.82f*a);
        art.glow(W/2,560,1400,1000,ThinkOrDieArt.GHOST,.3f*a);
        for(int k=0;k<risen.size();k++){String id=s(risen.get(k),"id");float cx=W/2+(k-(risen.size()-1)/2f)*320;float rise=ease(phaseT*1.2f);
            art.portrait(character(id),cx,420+rise*120,110,ThinkOrDieArt.GHOST,phaseT<1.2f,a);
            art.text(art.mid,name(id),cx,260+rise*120,.9f,ThinkOrDieArt.INK,a,300);}
        art.text(art.big,tr("ВОСКРЕС ИЗ МЁРТВЫХ","RISEN FROM THE DEAD"),W/2,900,1.05f,ThinkOrDieArt.GHOST,a*(MathUtils.random()<.05f?.5f:1),1600);
        art.text(art.small,tr("Пять верных ответов, и ни одного общего","Five correct answers, not one shared"),W/2,820,1,ThinkOrDieArt.INK,a,0);
    }

    // ---------------------------------------------------------------- FINAL
    private void podium(){
        var st=arr(t,"standings");
        art.text(art.horror,"THINK OR DIE",W/2,1050,.42f,ThinkOrDieArt.INK,.8f,0);
        art.text(art.big,tr("ФИНАЛ","FINAL RESULTS"),W/2,940,.9f,ThinkOrDieArt.GOLD,ease(phaseT*2),0);
        float[] px={W/2,W/2-460,W/2+460},ph={330,240,170};Color[] pc={ThinkOrDieArt.GOLD,new Color(.8f,.82f,.86f,1),new Color(.85f,.55f,.3f,1)};
        int shown=0;
        for(int k=0;k<st.size()&&shown<3;k++,shown++){JsonObject s=st.get(k);String id=s(s,"playerId");int place=Math.min(3,i(s,"rank"))-1;int slot=shown;
            float a=ease(phaseT*1.6f-(2-slot)*.5f),h=ph[slot]*ease(phaseT*1.4f-(2-slot)*.5f),x=px[slot];
            Color c=pc[Math.max(0,place)];
            art.slab(x-170,170,340,h,c,a);art.glow(x,170+h,520,260,c,.18f*a);
            art.text(art.display,String.valueOf(i(s,"rank")),x,170+h-24,.7f,c,a,0);
            art.portrait(character(id),x,170+h+110,78,c,false,a);
            art.text(art.mid,name(id),x,170+h+232,.8f,ThinkOrDieArt.INK,a,330);
            art.text(art.big,l(s,"points")+tr(" очк."," pts"),x,150,.55f,ThinkOrDieArt.INK,a,330);
            if(l(s,"souls")>0)art.text(art.small,"+"+l(s,"souls")+tr(" душ"," souls"),x,98,.9f,ThinkOrDieArt.GOLD,a,0);
            if(slot==0&&phaseT>1.4f)for(int m=0;m<3;m++)art.glow(x+MathUtils.sin(clock*2+m*2)*220,600+MathUtils.cos(clock*1.7f+m)*120,180,180,c,.12f);
        }
        // everyone: correct / unique / wrong / resurrected
        float y=900-90;int k=0;
        for(JsonObject s:st){String id=s(s,"playerId");String line=i(s,"rank")+".  "+name(id)+"   "+i(s,"correct")+" ✓  "+i(s,"unique")+" ★  "+i(s,"incorrect")+" ✕"+(b(s,"resurrected")?tr("   ВОСКРЕС","   RISEN"):"");
            float a=ease(phaseT*1.2f-2f-k*.1f);
            if(k<4)art.left(art.tiny,line,60,y-k*34,1,b(s,"resurrected")?ThinkOrDieArt.GHOST:ThinkOrDieArt.DIM,a,520);
            else art.right(art.tiny,line,1860,y-(k-4)*34,1,ThinkOrDieArt.DIM,a);
            k++;}
        if(phase().equals("COMPLETED")||phaseT>4)art.text(art.tiny,tr("ENTER: вернуться в лобби","ENTER: back to the lobby"),W/2,40,1,ThinkOrDieArt.DIM,.6f+.4f*MathUtils.sin(clock*3),0);
    }

    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){if(created){batch.dispose();art.dispose();}}
}
