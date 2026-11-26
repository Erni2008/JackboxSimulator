package com.erni.finalanswer.thinkordie;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.play.QuestionPlayers;
import com.erni.finalanswer.ui.play.QuizBackground;
import com.google.gson.*;
import java.util.*;
import java.util.function.*;

/**
 * THINK OR DIE survival on the host screen (the standalone mode). The floor-one hall stays animated behind; on top: the
 * players in their hanging frames with lives, the logo, the category plate, whose turn it is with a burning fuse for the
 * turn clock, the verdict of the last turn and the answers already used in this category. Server snapshots only.
 */
public final class TodSurvivalScreen extends ScreenAdapter {
    private static final float W=1600,H=900;
    private static final Color IVORY=new Color(.94f,.91f,.85f,1),DIM=new Color(.72f,.68f,.62f,1),RED=new Color(1f,.22f,.24f,1),GREEN=new Color(.45f,.90f,.50f,1),
        GOLD=new Color(1f,.80f,.36f,1),VIOLET=new Color(.80f,.68f,1f,1),BLACK=new Color(.02f,.01f,.01f,1),EMBER=new Color(1f,.45f,.18f,1);
    private final LongSupplier serverNow;private final Consumer<String> onEnd;
    private JsonObject state,t;
    private Stage stage;private ThinkOrDieArt art;private Texture pixel;private QuizBackground background;private BitmapFont serif;
    private final GlyphLayout gl=new GlyphLayout();private final Matrix4 saved=new Matrix4(),shear=new Matrix4();
    private final Texture[] frames=new Texture[QuestionPlayers.FRAMES.length];
    private String lastPhase="",lastOutcomeKey="";private int lastSecond=-1;private float clock,phaseClock;
    private boolean created;
    private final com.erni.finalanswer.ui.play.NeonFrame neon=new com.erni.finalanswer.ui.play.NeonFrame();
    private Texture heartTex,ropeTex;
    /** fuse sparks: position, velocity, life */
    private final float[] spx=new float[60],spy=new float[60],svx=new float[60],svy=new float[60],sl=new float[60];private int spark;
    private static final Color PLAQUE=new Color(.055f,.03f,.03f,.94f),BRONZE=new Color(.72f,.50f,.28f,1),C_TMP=new Color();

    public TodSurvivalScreen(JsonObject snapshot,LongSupplier serverNow,Consumer<String> onEnd){this.serverNow=serverNow;this.onEnd=onEnd;apply(snapshot);}
    public String session(){return s(t,"sessionId");}
    public void apply(JsonObject snapshot){if(!snapshot.has("thinkOrDie"))return;state=snapshot;t=snapshot.getAsJsonObject("thinkOrDie");}
    public static boolean isSurvival(JsonObject snapshot){var x=snapshot.getAsJsonObject("thinkOrDie");return x!=null&&x.has("mode")&&"survival".equals(x.get("mode").getAsString());}

    @Override public void show(){
        if(!created){created=true;
            stage=new Stage(new FitViewport(W,H));art=new ThinkOrDieArt();
            Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();
            background=new QuizBackground(pixel);background.setBounds(0,0,W,H);background.showImmediately(1,false);stage.addActor(background); // floor one, the Grand Hall, animated
            stage.addActor(new View());serif=serifFont();serif.getData().setLineHeight(serif.getData().lineHeight*.85f);
            heartTex=heartTexture();ropeTex=ropeTexture();
            for(int i=0;i<frames.length;i++){var f=Gdx.files.internal("think_or_die/frame_"+QuestionPlayers.FRAMES[i]+".png");if(f.exists()){frames[i]=new Texture(f,true);frames[i].setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);}}}
        Gdx.input.setInputProcessor(new InputAdapter(){@Override public boolean keyDown(int k){
            if((k==Input.Keys.ENTER||k==Input.Keys.ESCAPE)&&(phase().equals("FINAL_RESULTS")||phase().equals("COMPLETED"))){onEnd.accept(session());return true;}
            return false;}});
    }
    @Override public void resize(int w,int h){if(stage!=null)stage.getViewport().update(w,h,true);}
    @Override public void render(float dt){
        ScreenUtils.clear(0,0,0,1);clock+=dt;phaseClock+=dt;
        String ph=phase();if(!ph.equals(lastPhase)){onPhase(ph);lastPhase=ph;phaseClock=0;}
        if("TURN".equals(ph)){int sec=(int)Math.ceil(left());if(sec!=lastSecond){lastSecond=sec;if(sec>0&&sec<=3)art.play("sounds/results/count_tick.wav",.45f);}}
        stage.act(dt);stage.draw();
    }
    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){if(!created)return;stage.dispose();art.dispose();pixel.dispose();serif.dispose();background.dispose();for(Texture f:frames)if(f!=null)f.dispose();neon.dispose();heartTex.dispose();ropeTex.dispose();}

    private void onPhase(String ph){
        switch(ph){
            case "INTRO"->art.play("sounds/cursed_boxes/appearance.wav",.7f);
            case "CATEGORY_REVEAL"->art.play("sounds/impostor/vote_started.wav",.6f);
            case "TURN_RESULT"->{JsonObject l=survival().has("last")?survival().getAsJsonObject("last"):new JsonObject();String o=s(l,"outcome");
                if(l.has("eliminated")&&l.get("eliminated").getAsBoolean())art.play("sounds/results/winner_impact.wav",.6f);
                else art.play(o.equals("CORRECT")?"sounds/impostor/vote_sent.wav":"sounds/questions/door_lock(done).wav",.55f);}
            case "FINAL_RESULTS"->art.play("sounds/results/winner_impact.wav",.7f);
            default->{}
        }
    }

    // ---------------------------------------------------------------- data
    private static String s(JsonObject o,String k){return o!=null&&o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsString():"";}
    private String phase(){return s(t,"phase");}
    private String lang(){return s(t,"lang");}
    private String tr(String ru,String en){return "ru".equals(lang())?ru:en;}
    private JsonObject survival(){return t!=null&&t.has("survival")?t.getAsJsonObject("survival"):new JsonObject();}
    private long ms(String k){return t!=null&&t.has(k)?t.get(k).getAsLong():0;}
    private float left(){long e=ms("phaseEndsAt");return e<0?0:Math.max(0,(e-serverNow.getAsLong())/1000f);}
    private JsonObject roster(String id){if(state!=null&&state.has("players"))for(JsonElement e:state.getAsJsonArray("players")){JsonObject p=e.getAsJsonObject();if(s(p,"id").equals(id))return p;}return new JsonObject();}
    private String name(String id){String n=s(roster(id),"name");return n.isEmpty()?"?":n;}
    private String character(String id){return s(roster(id),"characterId");}
    private List<JsonObject> players(){List<JsonObject> l=new ArrayList<>();if(t!=null&&t.has("players"))for(JsonElement e:t.getAsJsonArray("players"))l.add(e.getAsJsonObject());return l;}
    private String categoryText(){return t!=null&&t.has("textEn")?("ru".equals(lang())?s(t,"textRu"):s(t,"textEn")):"";}

    private static BitmapFont serifFont(){
        var fh=Gdx.files.internal("ui/fonts/CormorantSC-Bold.ttf");var g=new FreeTypeFontGenerator(fh);
        try{var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=64;p.kerning=true;
            StringBuilder c=new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);for(char ch='Ѐ';ch<='ӿ';ch++)c.append(ch);p.characters=c.append("–—«»…’").toString();
            p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;return g.generateFont(p);}finally{g.dispose();}
    }

    // ---------------------------------------------------------------- drawing
    private final class View extends Actor{
        @Override public void draw(Batch batch,float parentAlpha){
            if(t==null||!(batch instanceof SpriteBatch sb))return;
            art.batch=sb;saved.set(batch.getTransformMatrix());
            try{
                art.rect(0,0,W,H,BLACK,.30f);art.glow(W/2,-30,W*1.2f,240,RED,.22f);
                String ph=phase();
                players(sb);
                switch(ph){
                    case "INTRO"->intro();
                    case "CATEGORY_REVEAL"->{logo(586,1);plate(Interpolation.swingOut.apply(Math.min(1,phaseClock/.55f)));plaque(GOLD,Math.min(1,phaseClock/.4f),0);spacedLabel(tr("НОВАЯ КАТЕГОРИЯ","A NEW CATEGORY"),W/2,PLAQUE_CY+12,.60f,GOLD,Math.min(1,phaseClock/.4f));used();}
                    case "TURN"->{logo(586,1);plate(1);turn();used();}
                    case "TURN_CHECK"->{logo(586,1);plate(1);checking();used();}
                    case "TURN_RESULT"->{logo(586,1);plate(1);verdict();used();}
                    case "FINAL_RESULTS","COMPLETED"->finale();
                    default->{}
                }
            }finally{batch.setTransformMatrix(saved);batch.setColor(Color.WHITE);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        }
    }
    private void logo(float cy,float s){
        if(art.logo==null)return;float lw=420*s,lh=lw*art.logo.getHeight()/art.logo.getWidth();
        art.batch.setColor(Color.WHITE);art.batch.draw(art.logo,W/2-lw/2,cy-lh/2,lw,lh);
    }
    /** the category plate, text set inside (one line when it fits large, otherwise wrapped and shrunk) */
    private void plate(float z){
        if(art.plate==null)return;z=Math.max(.05f,z);float pw=820*z,ph=pw*art.plate.getHeight()/art.plate.getWidth(),top=500-(1-z)*ph/2;
        art.batch.setColor(Color.WHITE);art.batch.draw(art.plate,W/2-pw/2,top-ph,pw,ph);if(z<.7f)return;
        String text=categoryText();float boxW=pw*.80f,boxTop=top-ph*.30f,boxBot=top-ph*.86f,maxH=boxTop-boxBot,mid=(boxTop+boxBot)/2;
        serif.getData().setScale(1);gl.setText(serif,text);float one=Math.min(1,boxW/Math.max(1,gl.width));boolean wrap=one<.80f;float sc=wrap?1:one;
        for(int i=0;i<18;i++){serif.getData().setScale(sc);gl.setText(serif,text,IVORY,boxW,Align.center,wrap);if(gl.height<=maxH&&gl.width<=boxW+1)break;sc*=.94f;}
        float ty=mid+gl.height/2;italic(W/2,mid,.10f);
        serif.setColor(0,0,0,.85f);serif.draw(art.batch,text,W/2-boxW/2+2.5f,ty-2.5f,boxW,Align.center,wrap);
        serif.setColor(IVORY);serif.draw(art.batch,text,W/2-boxW/2,ty,boxW,Align.center,wrap);
        serif.getData().setScale(1);art.batch.setTransformMatrix(saved);
    }
    private void italic(float ox,float oy,float k){shear.set(saved).translate(ox,oy,0);Matrix4 m=new Matrix4();m.val[Matrix4.M01]=k;shear.mul(m).translate(-ox,-oy,0);art.batch.setTransformMatrix(shear);}
    private void serifText(String s,float cx,float y,float sc,Color c,float a){
        if(a<=0||sc<=.01f||s==null||s.isEmpty())return;
        serif.getData().setScale(sc);gl.setText(serif,s);float x=cx-gl.width/2;
        serif.setColor(0,0,0,.85f*a);serif.draw(art.batch,s,x+2,y-2);serif.setColor(c.r,c.g,c.b,a);serif.draw(art.batch,s,x,y);serif.getData().setScale(1);
    }
    private void turnLine(String s,Color c,float sc){serifText(s,W/2,236,sc,c,1);}

    /** A centred bronze plaque for the turn line (name, verdict, checking); returns its centre y. */
    private static final float PLAQUE_W=780,PLAQUE_H=116,PLAQUE_CY=224;
    private void plaque(Color accent,float a,float dx){neon.bronze(art.batch,W/2-PLAQUE_W/2+dx,PLAQUE_CY-PLAQUE_H/2,PLAQUE_W,PLAQUE_H,PLAQUE,accent,a);}
    private void spacedLabel(String s,float cx,float y,float sc,Color c,float a){
        StringBuilder b=new StringBuilder();for(int i=0;i<s.length();i++){if(i>0)b.append(' ');b.append(s.charAt(i));}
        art.text(art.inter,b.toString(),cx,y,sc,c,a,0);
        float w=art.width(art.inter,b.toString(),sc);art.rect(cx-w/2-70,y-7,50,1.2f,c,.6f*a);art.rect(cx+w/2+20,y-7,50,1.2f,c,.6f*a);
    }

    /** Whose turn: bronze plaque with the name; below it a braided fuse that burns from right to left, sparks at the
     *  tip, the seconds in a bronze medallion at its end. The last three seconds pulse red at the screen edges. */
    private void turn(){
        String id=s(survival(),"turnPlayer");float total=Math.max(1,survival().has("turnMs")?survival().get("turnMs").getAsLong()/1000f:10),rem=left(),f=MathUtils.clamp(rem/total,0,1);
        boolean hot=rem<=3;float beat=hot?.5f+.5f*MathUtils.sin(clock*14):0,in=Interpolation.pow3Out.apply(Math.min(1,phaseClock/.35f));
        Color pc=C_TMP.set(com.erni.finalanswer.ui.PlayerColors.light(character(id)));
        if(hot){float al=(.10f+.22f*(3-rem)/3)*(.6f+.4f*beat);art.glow(W/2,0,W*1.4f,260,RED,al);art.glow(W/2,H,W*1.4f,200,RED,al*.7f);art.glow(0,H/2,280,H*1.3f,RED,al);art.glow(W,H/2,280,H*1.3f,RED,al);}
        plaque(hot?RED:BRONZE,in,0);
        spacedLabel(tr("ОТВЕЧАЕТ","NOW ANSWERING"),W/2,PLAQUE_CY+38,.50f,DIM,in);
        serifText(name(id).toUpperCase(Locale.ROOT),W/2,PLAQUE_CY+12,.80f,new Color(pc.r,pc.g,pc.b,1),in);
        fuse(f,rem,hot,beat);
    }
    private void fuse(float f,float rem,boolean hot,float beat){
        float fw=640,fx=W/2-fw/2-36,fy=114,th=12,tip=fx+fw*f;
        // burnt part: ash, thin and grey; unburnt part: braided rope
        art.rect(tip,fy-2,fx+fw-tip,4,new Color(.16f,.14f,.13f,1),.85f);
        if(tip>fx){art.batch.setColor(Color.WHITE);float u=(tip-fx)/th;art.batch.draw(ropeTex,fx,fy-th/2,tip-fx,th,0,0,u*1f,1f);}
        art.batch.setColor(Color.WHITE);
        // smoke above the tip and the ember
        for(int i=0;i<4;i++){float k=((clock*.6f+i*.25f)%1f);art.glow(tip-6+MathUtils.sin(clock*2+i)*8,fy+14+k*46,26+k*30,26+k*30,new Color(.45f,.40f,.38f,1),.10f*(1-k));}
        art.glow(tip,fy,90,60,hot?RED:EMBER,.45f+.2f*beat);art.glow(tip,fy,30,30,new Color(1f,.9f,.6f,1),.95f);art.glow(tip,fy,12,12,Color.WHITE,1);
        // sparks: a few per frame from the tip, falling under gravity
        float dt=Math.min(.05f,Gdx.graphics.getDeltaTime());
        for(int e=0;e<3;e++){int k=spark=(spark+1)%spx.length;spx[k]=tip;spy[k]=fy;float ang=MathUtils.random(20,160);float sp=MathUtils.random(60,170);svx[k]=MathUtils.cosDeg(ang)*sp;svy[k]=MathUtils.sinDeg(ang)*sp;sl[k]=MathUtils.random(.25f,.6f);}
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int k=0;k<spx.length;k++){if(sl[k]<=0)continue;sl[k]-=dt;spx[k]+=svx[k]*dt;spy[k]+=svy[k]*dt;svy[k]-=380*dt;float a=MathUtils.clamp(sl[k]/.4f,0,1);
            art.batch.setColor(1f,.75f+.25f*a,.35f,a);art.batch.draw(art.soft,spx[k]-3,spy[k]-3,6,6);}
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        // the seconds: a bronze medallion at the far end of the fuse
        float mx=fx+fw+56,my=fy,r=34*(hot?1+.05f*beat:1);
        neon.medallionBack(art.batch,mx,my,r,hot?RED:BRONZE,1);neon.medallionRing(art.batch,mx,my,r,hot?RED:new Color(1f,.75f,.4f,1),1);
        art.text(art.cond,String.valueOf((int)Math.ceil(rem)),mx,my+18,.62f,hot?RED:IVORY,1,0);
    }
    private void checking(){
        plaque(BRONZE,1,0);
        spacedLabel(tr("ПРОВЕРКА","CHECKING"),W/2,PLAQUE_CY+40,.52f,DIM,1);
        serifText(tr("ДУМАЕМ НАД ОТВЕТОМ…","WEIGHING THE ANSWER…"),W/2,PLAQUE_CY+14,.48f,IVORY,1);
        for(int i=0;i<12;i++){float ang=-clock*260+i*30;art.line(W/2+MathUtils.cosDeg(ang)*20,114+MathUtils.sinDeg(ang)*20,W/2+MathUtils.cosDeg(ang)*32,114+MathUtils.sinDeg(ang)*32,4,EMBER,(i/12f),true);}
    }
    /** The last turn on the plaque: a green check for an accepted answer; a red cross, a short shake and a red edge for a
     *  lost life; an elimination adds a violet flash and a banner. */
    private void verdict(){
        JsonObject l=survival().has("last")?survival().getAsJsonObject("last"):new JsonObject();String o=s(l,"outcome"),id=s(l,"player");
        String shown=!s(l,"label").isEmpty()?s(l,"label"):s(l,"text");float k=Math.min(1,phaseClock/.25f),pop=Math.max(.05f,Interpolation.swingOut.apply(k));
        boolean ok=o.equals("CORRECT");Color c=ok?GREEN:RED;
        float shake=ok?0:MathUtils.sin(phaseClock*70)*10*Math.max(0,1-phaseClock/.35f);
        if(!ok){float al=.35f*Math.max(0,1-phaseClock/.6f);art.glow(0,H/2,320,H*1.3f,RED,al);art.glow(W,H/2,320,H*1.3f,RED,al);}
        plaque(c,1,shake);
        String head=switch(o){case "CORRECT"->tr("ПРИНЯТО","ACCEPTED");case "WRONG"->tr("НЕВЕРНО · МИНУС ЖИЗНЬ","WRONG · ONE LIFE LOST");case "REPEAT"->tr("УЖЕ БЫЛО · МИНУС ЖИЗНЬ","ALREADY SAID · ONE LIFE LOST");default->tr("ВРЕМЯ ВЫШЛО · МИНУС ЖИЗНЬ","TIME IS UP · ONE LIFE LOST");};
        spacedLabel(head,W/2+shake,PLAQUE_CY+38,.48f,c,k);
        String big=o.equals("TIMEOUT")||shown.isEmpty()?name(id).toUpperCase(Locale.ROOT):shown.toUpperCase(Locale.ROOT);
        serifText(big,W/2+shake,PLAQUE_CY+12,.76f*pop,ok?IVORY:new Color(1f,.80f,.78f,1),k);
        // the mark on the left of the plaque
        float mx=W/2-PLAQUE_W/2+64+shake,my=PLAQUE_CY-2,ms=22*pop;
        neon.medallionBack(art.batch,mx,my,34,c,k);neon.medallionRing(art.batch,mx,my,34,c,k);
        if(ok){art.line(mx-ms*.55f,my,mx-ms*.1f,my-ms*.45f,6,c,k,false);art.line(mx-ms*.1f,my-ms*.45f,mx+ms*.6f,my+ms*.5f,6,c,k,false);}
        else{art.line(mx-ms*.5f,my-ms*.5f,mx+ms*.5f,my+ms*.5f,6,c,k,false);art.line(mx-ms*.5f,my+ms*.5f,mx+ms*.5f,my-ms*.5f,6,c,k,false);}
        if(l.has("eliminated")&&l.get("eliminated").getAsBoolean()){float e=MathUtils.clamp((phaseClock-.55f)/.3f,0,1);
            if(phaseClock>.55f&&phaseClock<1f)art.rect(0,0,W,H,new Color(.55f,.30f,.95f,1),.18f*(1-(phaseClock-.55f)/.45f));
            neon.bronze(art.batch,W/2-300,96,600,52,new Color(.08f,.03f,.12f,.95f),VIOLET,e);
            serifText(name(id).toUpperCase(Locale.ROOT)+tr(" ВЫБЫВАЕТ"," IS OUT"),W/2,133,.46f,VIOLET,e);}
    }
    /** Answers already used in this category, newest first: small bronze tags, the newest with a gold edge. */
    private void used(){
        JsonArray u=survival().has("used")?survival().getAsJsonArray("used"):new JsonArray();if(u.size()==0)return;
        float sc=.50f,y=40,gap=12;List<String> tags=new ArrayList<>();
        for(int i=u.size()-1;i>=0&&tags.size()<12;i--)tags.add(s(u.get(i).getAsJsonObject(),"label"));
        float total=0;float[] w=new float[tags.size()];for(int i=0;i<tags.size();i++){w[i]=art.width(art.inter,tags.get(i),sc)+34;total+=w[i]+gap;}
        while(total>W-160&&tags.size()>1){total-=w[tags.size()-1]+gap;tags.remove(tags.size()-1);}
        float x=W/2-(total-gap)/2;
        spacedLabel(tr("УЖЕ НАЗВАНО","ALREADY SAID"),W/2,y+46,.44f,DIM,.9f);
        for(int i=0;i<tags.size();i++){float a=i==0?1:.86f;neon.bronze(art.batch,x,y-20,w[i],34,PLAQUE,i==0?GOLD:BRONZE,a);
            art.text(art.inter,tags.get(i),x+w[i]/2,y+3,sc,i==0?IVORY:DIM,a,0);x+=w[i]+gap;}
    }
    /** Intro: the logo, SURVIVAL between laurels and three rule cards with drawn icons. */
    private void intro(){
        float k=Math.min(1,phaseClock/.5f);logo(590,1.15f-.10f*Interpolation.pow3Out.apply(k));
        int lives=survival().has("lives")?survival().get("lives").getAsInt():3;float a=MathUtils.clamp((phaseClock-.7f)/.4f,0,1);
        serifText(tr("ВЫЖИВАНИЕ","SURVIVAL"),W/2,452,.70f,GOLD,a);
        serif.getData().setScale(.70f);gl.setText(serif,tr("ВЫЖИВАНИЕ","SURVIVAL"));float hw=gl.width/2;serif.getData().setScale(1);
        String[][] cards={{tr("ПО ОЧЕРЕДИ","IN TURN"),tr("Назови новый верный\nответ, пока горит фитиль","Name a new correct answer\nbefore the fuse burns out")},
            {tr(lives+" ЖИЗНИ",lives+" LIVES"),tr("Ошибка, повтор или конец\nвремени отнимают жизнь","A wrong answer, a repeat or\nrunning out of time costs one")},
            {tr("ПОСЛЕДНИЙ ЖИВОЙ","LAST ONE STANDING"),tr("Время хода сокращается.\nПобеждает выживший","Turns get shorter.\nThe survivor wins")}};
        for(int i=0;i<3;i++){float d=MathUtils.clamp((phaseClock-1.0f-i*.18f)/.35f,0,1);if(d<=0)continue;float cx=W/2+(i-1)*370,cy=250,cw=340,ch=200;
            neon.bronze(art.batch,cx-cw/2,cy-ch/2,cw,ch,PLAQUE,i==1?RED:BRONZE,d);
            ruleIcon(i,cx,cy+56,d);
            art.text(art.inter,cards[i][0],cx,cy+12,.66f,GOLD,d,cw-30);
            String[] ln=cards[i][1].split("\n");art.text(art.inter,ln[0],cx,cy-26,.56f,IVORY,d,cw-30);art.text(art.inter,ln[1],cx,cy-50,.56f,IVORY,d,cw-30);}
    }
    private void ruleIcon(int i,float cx,float cy,float a){
        switch(i){
            case 0->{art.batch.setColor(1,1,1,a);art.batch.draw(ropeTex,cx-40,cy-5,62,10,0,0,5f,1f);art.glow(cx+24,cy,40,40,EMBER,.7f*a);art.glow(cx+24,cy,12,12,Color.WHITE,a);}
            case 1->{for(int j=0;j<3;j++){art.batch.setColor(j<2?1:.3f,j<2?1:.3f,j<2?1:.3f,a);art.batch.draw(heartTex,cx-48+j*34-14,cy-14,28,28);}}
            default->{float s=18;art.line(cx-s,cy-s*.5f,cx-s,cy+s*.4f,4,GOLD,a,false);art.line(cx-s,cy+s*.4f,cx-s*.45f,cy-s*.05f,4,GOLD,a,false);art.line(cx-s*.45f,cy-s*.05f,cx,cy+s*.6f,4,GOLD,a,false);
                art.line(cx,cy+s*.6f,cx+s*.45f,cy-s*.05f,4,GOLD,a,false);art.line(cx+s*.45f,cy-s*.05f,cx+s,cy+s*.4f,4,GOLD,a,false);art.line(cx+s,cy+s*.4f,cx+s,cy-s*.5f,4,GOLD,a,false);art.line(cx-s,cy-s*.5f,cx+s,cy-s*.5f,4,GOLD,a,false);}
        }
        art.batch.setColor(Color.WHITE);
    }
    /** Final: the survivor's name in gold over slow rays, then ranked bronze rows with medal discs and souls. */
    private void finale(){
        JsonArray st=t.has("standings")?t.getAsJsonArray("standings"):new JsonArray();
        logo(612,.82f);
        if(st.size()==0)return;
        String win=s(st.get(0).getAsJsonObject(),"playerId");float k=Math.max(.05f,Interpolation.swingOut.apply(Math.min(1,phaseClock/.6f)));
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<12;i++){float ang=clock*6+i*30;art.line(W/2,430,W/2+MathUtils.cosDeg(ang)*480,430+MathUtils.sinDeg(ang)*260,34,GOLD,.028f,true);}
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        spacedLabel(tr("ПОСЛЕДНИЙ ВЫЖИВШИЙ","THE LAST SURVIVOR"),W/2,490,.52f,DIM,1);
        serifText(name(win).toUpperCase(Locale.ROOT),W/2,462,1.0f*k,GOLD,1);
        serif.getData().setScale(1.0f*k);gl.setText(serif,name(win).toUpperCase(Locale.ROOT));float hw=gl.width/2;serif.getData().setScale(1);
        int n=Math.min(8,st.size());float rowH=Math.min(44,250f/n),rw=640,y0=330;
        for(int i=0;i<n;i++){JsonObject r=st.get(i).getAsJsonObject();String id=s(r,"playerId");int rank=r.get("rank").getAsInt();
            float d=MathUtils.clamp((phaseClock-.7f-i*.12f)/.3f,0,1);if(d<=0)continue;float y=y0-i*(rowH+6);
            Color medal=rank==1?GOLD:rank==2?new Color(.82f,.84f,.88f,1):rank==3?new Color(.85f,.55f,.32f,1):BRONZE;
            neon.bronze(art.batch,W/2-rw/2,y-rowH/2,rw,rowH,PLAQUE,rank<=3?medal:BRONZE,d);
            float mx=W/2-rw/2+30;art.batch.setColor(medal.r*.55f,medal.g*.55f,medal.b*.55f,d);art.batch.draw(art.soft,mx-16,y-16,32,32);
            art.text(art.cond,String.valueOf(rank),mx,y+11,.36f,medal,d,0);
            art.left(art.inter,name(id),mx+30,y+9,.62f,rank==1?GOLD:IVORY,d,260);
            art.text(art.inter,s(r,"correct")+tr(" верных"," correct"),W/2+90,y+9,.54f,DIM,d,0);
            long souls=r.has("souls")?r.get("souls").getAsLong():0;
            if(souls>0)art.right(art.cond,"+"+souls,W/2+rw/2-24,y+12,.40f,GOLD,d);}
        art.text(art.inter,tr("ENTER · В ЛОББИ","ENTER · BACK TO THE LOBBY"),W/2,30,.50f,DIM,.8f,0);
    }

    /** Players in their hanging frames; the one whose turn it is hangs a little lower and glows, the eliminated fade. */
    private void players(SpriteBatch b){
        List<JsonObject> ps=players();int n=ps.size();if(n==0)return;
        float cell=Math.min(240,(W-120)/n),left=(W-cell*n)/2;String turn=s(survival(),"turnPlayer");boolean turning=phase().startsWith("TURN");
        int lives=survival().has("lives")?survival().get("lives").getAsInt():3;
        for(int i=0;i<n;i++){JsonObject p=ps.get(i);String id=s(p,"id");boolean out=p.has("lives")&&p.get("lives").getAsInt()<=0;boolean active=turning&&id.equals(turn);
            int k=out?1:new int[]{0,2,3,4}[i%4];Texture ft=frames[k];if(ft==null)continue;float[] g=QuestionPlayers.GEO[k];
            float cx=left+(i+.5f)*cell,fw=Math.min(212,cell-10)*(active?1.08f:1),fh=fw*ft.getHeight()/ft.getWidth();
            float plateMid=722-(active?8:0),top=plateMid+fh*(g[2]+g[3])/2,x0=cx-fw/2,hy=top-fh*g[0],hr=fw*g[1];
            float a=out?.62f:turning&&!active?.62f:1;
            if(active){ // a spotlight from above on the player who answers
                art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
                art.batch.setColor(1f,.82f,.55f,.10f);art.batch.draw(art.soft,cx-hr*2.2f,hy-hr*2.6f,hr*4.4f,H-(hy-hr*2.6f)+hr*2);
                art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
                art.glow(cx,hy,hr*4.4f,hr*4.4f,new Color(1f,.60f,.30f,1),.26f+.10f*MathUtils.sin(clock*5));}
            b.setColor(.05f,.02f,.03f,.85f*a);b.draw(pixel,cx-hr*.74f,hy-hr*.74f,hr*1.48f,hr*1.48f);
            b.setColor(1,1,1,a);b.draw(ft,x0,top-fh,fw,fh);
            // the character stands in front of the ring, legs behind the name plate (redrawn on top)
            Texture body=art.body(character(id));float nameMid=top-fh*(g[2]+g[3])/2;
            if(body!=null){float bh=(hy+hr*1.70f)-nameMid,bw=bh*body.getWidth()/body.getHeight();
                if(out)b.setColor(.82f,.74f,1f,.70f*a);else b.setColor(1,1,1,a);b.draw(body,cx-bw/2,nameMid,bw,bh);}
            float cut=g[2]-.012f;int sy=(int)(ft.getHeight()*cut);b.setColor(1,1,1,a);b.draw(ft,x0,top-fh,fw,fh*(1-cut),0,sy,ft.getWidth(),ft.getHeight()-sy,false,false);
            Color pc=out?VIOLET:new Color(com.erni.finalanswer.ui.PlayerColors.light(character(id)));
            float nTop=top-fh*g[2],nBot=top-fh*g[3];
            art.text(art.cond,name(id),cx,(nTop+nBot)/2+fw*.042f,fw*.082f/Math.max(1,art.cond.getData().capHeight),new Color(pc.r,pc.g,pc.b,1),a,fw*.58f);
            // lives in the lower plate: hearts, spent ones dark
            float cTop=top-fh*g[4],cBot=top-fh*g[5];int lv=p.has("lives")?p.get("lives").getAsInt():0;float hs=fw*.040f,step=fw*.105f;
            float hsz=Math.min(cTop-cBot,fw*.13f)*.78f,stp=hsz*1.12f;
            for(int j=0;j<lives;j++){float hx=cx+(j-(lives-1)/2f)*stp;if(j<lv)b.setColor(1,1,1,a);else b.setColor(.28f,.24f,.24f,.75f*a);b.draw(heartTex,hx-hsz/2,(cTop+cBot)/2-hsz/2,hsz,hsz);}
        }
        b.setColor(Color.WHITE);
    }
    /** A glossy ruby heart (procedural, 64 px): dark rim, red body lit from the top left, a small highlight. */
    private static Texture heartTexture(){
        int n=64;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float u=(x+.5f)/n*2.6f-1.3f,v=(1-(y+.5f)/n)*2.6f-1.25f;
            float q=u*u+v*v-1,f=q*q*q-u*u*v*v*v;
            float edge=0;for(int k=0;k<1;k++)edge=f;
            if(f>0.02f){p.drawPixel(x,y,0);continue;}
            float a=MathUtils.clamp(-f/0.02f,0,1);boolean rim=f>-0.035f;
            float lit=MathUtils.clamp(.55f+.45f*(-u*.5f+v*.6f),0,1);
            float r=rim?.35f:.55f+.45f*lit,g=rim?.02f:.04f+.10f*lit,b=rim?.04f:.07f+.10f*lit;
            float hx=u+.38f,hy=v-.42f;if(!rim&&hx*hx+hy*hy<.05f){r=1;g=.75f;b=.75f;}
            p.drawPixel(x,y,Color.rgba8888(r,g,b,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
    /** A braided fuse cord, tiling horizontally: two twisted strands with dark grooves. */
    private static Texture ropeTexture(){
        int w=32,h=16;Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){float v=(y+.5f)/h,edge=Math.abs(v-.5f)*2;if(edge>.95f){p.drawPixel(x,y,0);continue;}
            float twist=((x+y*1.6f)%16)/16f,band=MathUtils.sin(twist*MathUtils.PI2);float shade=.55f+.30f*band-.35f*edge*edge;
            float r=.62f*shade+.08f,g=.42f*shade+.04f,b=.24f*shade+.02f;p.drawPixel(x,y,Color.rgba8888(r,g,b,1));}
        Texture t=new Texture(p);t.setWrap(Texture.TextureWrap.Repeat,Texture.TextureWrap.ClampToEdge);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;
    }
}
