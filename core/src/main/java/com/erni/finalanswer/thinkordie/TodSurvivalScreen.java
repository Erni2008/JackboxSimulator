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
    @Override public void dispose(){if(!created)return;stage.dispose();art.dispose();pixel.dispose();serif.dispose();background.dispose();for(Texture f:frames)if(f!=null)f.dispose();}

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
                    case "CATEGORY_REVEAL"->{logo(586,1);plate(Interpolation.swingOut.apply(Math.min(1,phaseClock/.55f)));turnLine(tr("КАТЕГОРИЯ МЕНЯЕТСЯ","A NEW CATEGORY"),DIM,.32f);used();}
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

    /** Whose turn: the name in the player's colour, a burning fuse for the clock, seconds in big numbers. */
    private void turn(){
        String id=s(survival(),"turnPlayer");float total=Math.max(1,survival().has("turnMs")?survival().get("turnMs").getAsLong()/1000f:10),rem=left(),f=MathUtils.clamp(rem/total,0,1);
        boolean hot=rem<=3;float beat=hot?.5f+.5f*MathUtils.sin(clock*14):0;
        Color pc=new Color(com.erni.finalanswer.ui.PlayerColors.light(character(id)));
        serifText(tr("ОТВЕЧАЕТ","NOW ANSWERING"),W/2,262,.34f,DIM,1);
        serifText(name(id).toUpperCase(Locale.ROOT),W/2,226,.72f,pc,1);
        // fuse: a dark groove, the burning part shrinks from both ends towards the centre, a spark at each end
        float fw=700,fx=W/2-fw/2,fy=150;
        art.rect(fx-3,fy-5,fw+6,10,new Color(.10f,.05f,.04f,1),.95f);
        float bw=fw*f;Color fc=hot?RED:EMBER;
        art.rect(W/2-bw/2,fy-3,bw,6,fc,1);art.glow(W/2,fy,bw+40,40,fc,.30f+.25f*beat);
        for(int sgn=-1;sgn<=1;sgn+=2){float sx=W/2+sgn*bw/2;art.glow(sx,fy,46,46,new Color(1f,.85f,.5f,1),.85f);art.glow(sx,fy,18,18,Color.WHITE,.9f);}
        String sec=String.valueOf((int)Math.ceil(rem));
        art.text(art.cond,sec,fx+fw+52,fy+22,.70f*(hot?1+.08f*beat:1),hot?RED:IVORY,1,0);
    }
    private void checking(){
        serifText(tr("ПРОВЕРЯЕМ ОТВЕТ…","CHECKING THE ANSWER…"),W/2,226,.50f,DIM,1);
        for(int i=0;i<12;i++){float ang=-clock*240+i*30;art.line(W/2+MathUtils.cosDeg(ang)*26,140+MathUtils.sinDeg(ang)*26,W/2+MathUtils.cosDeg(ang)*40,140+MathUtils.sinDeg(ang)*40,5,RED,(i/12f),true);}
    }
    /** The last turn: the answer and its fate; an elimination gets its own line. */
    private void verdict(){
        JsonObject l=survival().has("last")?survival().getAsJsonObject("last"):new JsonObject();String o=s(l,"outcome"),id=s(l,"player");
        String shown=!s(l,"label").isEmpty()?s(l,"label"):s(l,"text");float k=Math.min(1,phaseClock/.25f),pop=Interpolation.swingOut.apply(k);
        switch(o){
            case "CORRECT"->{serifText(shown.toUpperCase(Locale.ROOT),W/2,238,.78f*pop,GREEN,k);serifText(tr("ПРИНЯТО","ACCEPTED"),W/2,166,.36f,DIM,k);}
            case "WRONG"->{serifText(shown.toUpperCase(Locale.ROOT),W/2,238,.70f*pop,RED,k);serifText(tr("НЕВЕРНО · МИНУС ЖИЗНЬ","WRONG · ONE LIFE LOST"),W/2,166,.36f,RED,k);}
            case "REPEAT"->{serifText(shown.toUpperCase(Locale.ROOT),W/2,238,.70f*pop,RED,k);serifText(tr("УЖЕ БЫЛО · МИНУС ЖИЗНЬ","ALREADY SAID · ONE LIFE LOST"),W/2,166,.36f,RED,k);}
            default->{serifText(tr("ВРЕМЯ ВЫШЛО","TIME IS UP"),W/2,238,.74f*pop,RED,k);serifText(name(id)+tr(" · МИНУС ЖИЗНЬ"," · ONE LIFE LOST"),W/2,166,.36f,RED,k);}
        }
        if(l.has("eliminated")&&l.get("eliminated").getAsBoolean()){float e=MathUtils.clamp((phaseClock-.5f)/.3f,0,1);
            art.glow(W/2,118,900,90,new Color(.55f,.30f,.95f,1),.25f*e);serifText(name(id).toUpperCase(Locale.ROOT)+tr(" ВЫБЫВАЕТ"," IS OUT"),W/2,128,.54f,VIOLET,e);}
    }
    /** Answers already used in this category, newest first, as small ivory tags along the bottom. */
    private void used(){
        JsonArray u=survival().has("used")?survival().getAsJsonArray("used"):new JsonArray();if(u.size()==0)return;
        float sc=.52f,y=46,gap=14,x;List<String> tags=new ArrayList<>();
        for(int i=u.size()-1;i>=0&&tags.size()<14;i--)tags.add(s(u.get(i).getAsJsonObject(),"label"));
        float total=0;float[] w=new float[tags.size()];for(int i=0;i<tags.size();i++){w[i]=art.width(art.inter,tags.get(i),sc)+30;total+=w[i]+gap;}
        while(total>W-120&&!tags.isEmpty()){total-=w[tags.size()-1]+gap;tags.remove(tags.size()-1);}
        x=W/2-(total-gap)/2;
        art.text(art.inter,tr("УЖЕ НАЗВАНО","ALREADY SAID"),W/2,y+52,.50f,DIM,1,0);
        for(int i=0;i<tags.size();i++){float a=i==0?1:.82f;art.rect(x,y-24,w[i],32,new Color(.08f,.04f,.04f,.85f),a);art.rect(x,y-24,w[i],1.5f,new Color(.70f,.52f,.30f,1),a*.8f);
            art.text(art.inter,tags.get(i),x+w[i]/2,y-2,sc,IVORY,a,0);x+=w[i]+gap;}
    }
    private void intro(){
        float k=Math.min(1,phaseClock/.5f);logo(560,1.25f-.15f*Interpolation.pow3Out.apply(k));
        int lives=survival().has("lives")?survival().get("lives").getAsInt():3;float a=MathUtils.clamp((phaseClock-.8f)/.4f,0,1);
        serifText(tr("РЕЖИМ ВЫЖИВАНИЯ","SURVIVAL"),W/2,372,.62f,GOLD,a);
        art.text(art.inter,tr("Отвечайте по очереди: назовите новый верный ответ, пока горит фитиль.","Take turns: name a new correct answer before the fuse burns out."),W/2,300,.80f,IVORY,a,1200);
        art.text(art.inter,tr("Ошибка, повтор или конец времени: минус жизнь. У каждого "+lives+" жизни, время хода сокращается.","A wrong answer, a repeat or running out of time costs a life. Everyone has "+lives+" lives and the turns get shorter."),W/2,262,.68f,DIM,a,1300);
        art.text(art.inter,tr("Последний выживший побеждает.","The last survivor wins."),W/2,214,.80f,GOLD,a,1200);
    }
    private void finale(){
        JsonArray st=t.has("standings")?t.getAsJsonArray("standings"):new JsonArray();
        logo(620,.9f);
        if(st.size()>0){String win=s(st.get(0).getAsJsonObject(),"playerId");float k=Interpolation.swingOut.apply(Math.min(1,phaseClock/.6f));
            serifText(tr("ПОСЛЕДНИЙ ВЫЖИВШИЙ","THE LAST SURVIVOR"),W/2,470,.40f,DIM,1);
            serifText(name(win).toUpperCase(Locale.ROOT),W/2,420,.95f*k,GOLD,1);
            float y=300;for(int i=0;i<st.size()&&i<8;i++){JsonObject r=st.get(i).getAsJsonObject();String id=s(r,"playerId");
                String line=s(r,"rank")+".  "+name(id)+"   "+s(r,"correct")+tr(" верных"," correct")+(r.has("souls")&&r.get("souls").getAsLong()>0?"   +"+s(r,"souls")+tr(" душ"," souls"):"");
                art.text(art.inter,line,W/2,y-i*34,.72f,i==0?GOLD:IVORY,MathUtils.clamp((phaseClock-.6f-i*.12f)/.3f,0,1),1100);}}
        art.text(art.inter,tr("ENTER · В ЛОББИ","ENTER · BACK TO THE LOBBY"),W/2,40,.56f,DIM,.8f,0);
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
            float a=out?.62f:turning&&!active?.80f:1;
            if(active){art.glow(cx,hy,hr*4.2f,hr*4.2f,new Color(1f,.55f,.25f,1),.30f+.12f*MathUtils.sin(clock*5));}
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
            for(int j=0;j<lives;j++){float hx=cx+(j-(lives-1)/2f)*step;heart(hx,(cTop+cBot)/2+hs*.15f,hs,j<lv?RED:new Color(.25f,.12f,.12f,1),a);}
        }
        b.setColor(Color.WHITE);
    }
    private void heart(float cx,float cy,float s,Color c,float a){
        art.batch.setColor(c.r,c.g,c.b,c.a*a);
        art.batch.draw(art.soft,cx-s*1.05f,cy-s*.15f,s*1.2f,s*1.2f);art.batch.draw(art.soft,cx-s*.15f,cy-s*.15f,s*1.2f,s*1.2f);
        art.line(cx-s*.85f,cy+s*.30f,cx,cy-s*.85f,s*.9f,c,a,false);art.line(cx+s*.85f,cy+s*.30f,cx,cy-s*.85f,s*.9f,c,a,false);
    }
}
