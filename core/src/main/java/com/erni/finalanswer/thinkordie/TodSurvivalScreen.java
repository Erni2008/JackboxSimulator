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
    private final GlyphLayout gl=new GlyphLayout();private final Matrix4 shakeM=new Matrix4();private final Matrix4 saved=new Matrix4(),shear=new Matrix4();
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
            heartTex=heartTexture();ropeTex=ropeTexture();vig=vignetteTex();disc=discTexture();
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
        if(fade>0){fade=Math.max(0,fade-dt*3.2f);var b=stage.getBatch();b.setProjectionMatrix(stage.getCamera().combined);b.begin();b.setColor(0,0,0,Interpolation.pow2.apply(fade));b.draw(pixel,0,0,W,H);b.setColor(Color.WHITE);b.end();}
    }
    @Override public void hide(){Gdx.input.setInputProcessor(null);}
    @Override public void dispose(){if(!created)return;stage.dispose();art.dispose();pixel.dispose();serif.dispose();background.dispose();for(Texture f:frames)if(f!=null)f.dispose();neon.dispose();heartTex.dispose();ropeTex.dispose();vig.dispose();disc.dispose();}

    private float fade;
    private void onPhase(String ph){
        if(ph.equals("BRACKET")||ph.equals("MATCH_INTRO")||ph.equals("FINAL_RESULTS")||ph.equals("INTRO"))fade=1;
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
            float st=clock-shakeAt;if(st<.45f){float k=1-st/.45f;batch.setTransformMatrix(shakeM.set(saved).translate(MathUtils.sin(st*83)*11*k,MathUtils.cos(st*71)*7*k,0));saved.set(batch.getTransformMatrix());}
            try{
                art.rect(0,0,W,H,BLACK,.30f);art.glow(W/2,-30,W*1.2f,240,RED,.22f);
                String ph=phase();
                if(!ph.equals("BRACKET")&&!ph.equals("MATCH_INTRO")&&!ph.equals("FINAL_RESULTS")&&!ph.equals("COMPLETED"))players(sb);
                switch(ph){
                    case "INTRO"->intro();
                    case "BRACKET"->bracket();
                    case "MATCH_INTRO"->versus();
                    case "MATCH_RESULT"->matchResult();
                    case "CATEGORY_REVEAL"->{logo(586,1);plate(Interpolation.swingOut.apply(Math.min(1,phaseClock/.55f)));plaque(GOLD,Math.min(1,phaseClock/.4f),0);countdown();wall();}
                    case "TURN"->{stage();logo(586,1);plate(1);turn();wall();closingRibbon();}
                    case "TURN_CHECK"->{stage();logo(586,1);plate(1);checking();wall();closingRibbon();}
                    case "TURN_RESULT"->{stage();logo(586,1);plate(1);verdict();wall();closingRibbon();}
                    case "FINAL_RESULTS","COMPLETED"->finale();
                    default->{}
                }
                vignette();
            }finally{batch.setTransformMatrix(saved);batch.setColor(Color.WHITE);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        }
    }
    /**
     * Survival: the player whose turn it is stands full size on the right of the stage under a spotlight (the right
     * column of the answer wall is still empty then): breathes while thinking, hops on an accepted answer, recoils on a
     * lost life. A new player slides in from the right edge.
     */
    private String stageId="";private float stageIn=-9;
    private void stage(){
        if(duel())return;JsonArray u=survival().has("used")?survival().getAsJsonArray("used"):new JsonArray();if(u.size()>8)return;
        String id=phase().equals("TURN_RESULT")?s(survival().getAsJsonObject("last"),"player"):s(survival(),"turnPlayer");if(id.isEmpty())return;
        if(!id.equals(stageId)){stageId=id;stageIn=clock;}
        Texture body=art.body(character(id));if(body==null)return;
        float in=Interpolation.pow3Out.apply(MathUtils.clamp((clock-stageIn)/.55f,0,1));
        JsonObject last=survival().has("last")?survival().getAsJsonObject("last"):new JsonObject();boolean res=phase().equals("TURN_RESULT"),ok=res&&s(last,"outcome").equals("CORRECT");
        float pt=clock-slamAt,hop=res&&ok&&pt<.6f?MathUtils.sin(pt/.6f*MathUtils.PI)*40:0,recoil=res&&!ok&&pt<.5f?MathUtils.sin(pt*50)*14*(1-pt/.5f):0;
        float bh=470,bw=bh*body.getWidth()/body.getHeight();if(bw>270){bh*=270/bw;bw=270;}float cx=1408+(1-in)*420+recoil,base=70+hop,breathe=1+.012f*MathUtils.sin(clock*2.4f);
        // spotlight cone and a pool of light on the floor
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        art.batch.setColor(1f,.85f,.6f,.10f*in);art.batch.draw(art.soft,cx-230,base-40,460,H-base+80);
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        art.glow(cx,base+6,340,70,res?(ok?GREEN:RED):new Color(1f,.7f,.4f,1),.35f*in);
        art.batch.setColor(0,0,0,.5f*in);art.batch.draw(art.soft,cx-130,base-16,260,40);
        if(res&&!ok)art.batch.setColor(1f,.72f,.72f,in);else art.batch.setColor(1,1,1,in);
        art.batch.draw(body,cx-bw*breathe/2,base,bw*breathe,bh*(2-breathe));art.batch.setColor(Color.WHITE);
    }
    /**
     * After a timeout the category is in its last lap: a red ribbon hangs from the bottom of the category plate,
     * "LAST ROUND · N MORE", or "NEXT: A NEW CATEGORY" when nobody is left to answer in this lap. It swings in once.
     */
    private boolean wasClosing;private float closingAt=-9;
    private void closingRibbon(){
        JsonObject sv=survival();boolean sd=sv.has("suddenDeath")&&sv.get("suddenDeath").getAsBoolean();
        boolean closing=sd||sv.has("closing")&&sv.get("closing").getAsBoolean();
        if(closing&&!wasClosing){closingAt=clock;art.play("sounds/impostor/vote_started.wav",.45f);}wasClosing=closing;if(!closing)return;
        int rem=sv.has("remaining")?sv.get("remaining").getAsInt():0;
        boolean result=phase().equals("TURN_RESULT");
        String txt=sd?tr("ВНЕЗАПНАЯ СМЕРТЬ · ОДНА ОШИБКА И ТЫ ВЫБЫЛ","SUDDEN DEATH · ONE MISS AND YOU ARE OUT"):rem<=0||(result&&rem==0)?tr("ДАЛЕЕ · НОВАЯ КАТЕГОРИЯ","NEXT · A NEW CATEGORY"):tr("ПОСЛЕДНИЙ КРУГ · ЕЩЁ ","LAST ROUND · ")+rem+(ru()?"":(rem==1?" MORE":" MORE"));
        float t=clock-closingAt,k=Math.max(.05f,Interpolation.swingOut.apply(MathUtils.clamp(t/.45f,0,1)));
        float w=art.width(art.cond,txt,.36f)+96,h=38,y=301; // on the plate's lower edge, clear of the turn plaque
        float pulse=.5f+.5f*MathUtils.sin(clock*4);
        art.glow(W/2,y,w*1.3f,h*2.4f,RED,(.20f+.12f*pulse)*k);
        art.panel(W/2-w*k/2,y-h/2,w*k,h,RED,1);
        if(k>.6f)art.text(art.cond,txt,W/2,y+10,.36f,new Color(1f,.90f,.82f,1),MathUtils.clamp((k-.6f)/.4f,0,1),0);
    }
    private boolean ru(){return "ru".equals(lang());}
    /** Cinematic vignette: darker corners and edges so the eye goes to the plate and the turn. */
    private void vignette(){
        art.batch.setColor(0,0,0,.55f);art.batch.draw(vig,0,0,W,H);art.batch.setColor(Color.WHITE);
    }
    private Texture vig,disc;
    private static Texture discTexture(){int n=64;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=x+.5f-n/2f,dy=y+.5f-n/2f,d=n/2f-(float)Math.sqrt(dx*dx+dy*dy);p.drawPixel(x,y,Color.rgba8888(1,1,1,MathUtils.clamp(d,0,1)));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    private Texture vignetteTex(){int w=160,h=90;Pixmap p=new Pixmap(w,h,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){float dx=(x+.5f)/w-.5f,dy=((y+.5f)/h-.52f)*1.15f,d=(float)Math.sqrt(dx*dx+dy*dy)*1.55f;float a=MathUtils.clamp((d-.42f)/.5f,0,1);p.drawPixel(x,y,Color.rgba8888(1,1,1,a*a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    private void logo(float cy,float s){
        if(art.logo==null)return;float lw=420*s,lh=lw*art.logo.getHeight()/art.logo.getWidth();
        art.batch.setColor(Color.WHITE);art.batch.draw(art.logo,W/2-lw/2,cy-lh/2,lw,lh);
    }
    /** the category plate, text set inside (one line when it fits large, otherwise wrapped and shrunk) */
    private void plate(float z){
        if(art.plate==null)return;z=Math.max(.05f,z);float pw=820*z,ph=pw*art.plate.getHeight()/art.plate.getWidth(),top=500-(1-z)*ph/2;
        // the plate without the baked-in English "CATEGORY": the label is drawn in the room's language
        Texture tex=art.plateBlank!=null?art.plateBlank:art.plate;
        art.batch.setColor(Color.WHITE);art.batch.draw(tex,W/2-pw/2,top-ph,pw,ph);if(z<.7f)return;
        if(art.plateBlank!=null)serifText(spaced(tr("КАТЕГОРИЯ","CATEGORY")),W/2,top-ph*47/405f+9*z,.36f*z,new Color(.93f,.80f,.55f,1),1);
        // the text box stops above the plate's lower edge, where the LAST ROUND ribbon sits
        String text=categoryText();float boxW=pw*.80f,boxTop=top-ph*.30f,boxBot=top-ph*.80f,maxH=boxTop-boxBot,mid=(boxTop+boxBot)/2;
        serif.getData().setScale(1);gl.setText(serif,text);float one=Math.min(1,boxW/Math.max(1,gl.width));boolean wrap=one<.80f;float sc=wrap?1:one;
        for(int i=0;i<18;i++){serif.getData().setScale(sc);gl.setText(serif,text,IVORY,boxW,Align.center,wrap);if(gl.height<=maxH&&gl.width<=boxW+1)break;sc*=.94f;}
        float ty=mid+gl.height/2;italic(W/2,mid,.10f);
        serif.setColor(0,0,0,.85f);serif.draw(art.batch,text,W/2-boxW/2+2.5f,ty-2.5f,boxW,Align.center,wrap);
        serif.setColor(IVORY);serif.draw(art.batch,text,W/2-boxW/2,ty,boxW,Align.center,wrap);
        serif.getData().setScale(1);art.batch.setTransformMatrix(saved);
    }
    private static String spaced(String s){StringBuilder b=new StringBuilder();for(int i=0;i<s.length();i++){if(i>0)b.append(' ');b.append(s.charAt(i));}return b.toString();}
    private void italic(float ox,float oy,float k){shear.set(saved).translate(ox,oy,0);Matrix4 m=new Matrix4();m.val[Matrix4.M01]=k;shear.mul(m).translate(-ox,-oy,0);art.batch.setTransformMatrix(shear);}
    private void serifText(String s,float cx,float y,float sc,Color c,float a){
        if(a<=0||sc<=.01f||s==null||s.isEmpty())return;
        serif.getData().setScale(sc);gl.setText(serif,s);float x=cx-gl.width/2;
        serif.setColor(0,0,0,.85f*a);serif.draw(art.batch,s,x+2,y-2);serif.setColor(c.r,c.g,c.b,a);serif.draw(art.batch,s,x,y);serif.getData().setScale(1);
    }
    private void turnLine(String s,Color c,float sc){serifText(s,W/2,236,sc,c,1);}

    /** A centred bronze plaque for the turn line (name, verdict, checking); returns its centre y. */
    private static final float PLAQUE_W=780,PLAQUE_H=116,PLAQUE_CY=224;
    private void plaque(Color accent,float a,float dx){art.panel(W/2-PLAQUE_W/2+dx,PLAQUE_CY-PLAQUE_H/2,PLAQUE_W,PLAQUE_H,accent,a);}
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
        JsonArray at=survival().has("attempts")?survival().getAsJsonArray("attempts"):new JsonArray();
        String ak=id+":"+at.size();if(!ak.equals(attemptKey)){if(at.size()>0&&attemptKey.startsWith(id+":")){attemptAt=clock;art.play("sounds/questions/door_lock(done).wav",.45f);}attemptKey=ak;}
        float since=clock-attemptAt,shake=since<.4f?MathUtils.sin(since*70)*9*(1-since/.4f):0;
        plaque(since<.5f?RED:hot?RED:BRONZE,in,shake);
        String typed=s(survival(),"typing");
        if(typed.isEmpty()){spacedLabel(tr("ОТВЕЧАЕТ","NOW ANSWERING"),W/2+shake,PLAQUE_CY+38,.50f,DIM,in);
            serifText(name(id).toUpperCase(Locale.ROOT),W/2+shake,PLAQUE_CY+12,.80f,new Color(pc.r,pc.g,pc.b,1),in);}
        else{ // the letters as they are typed on the phone, with a blinking caret
            art.left(art.cond,name(id).toUpperCase(Locale.ROOT),W/2-PLAQUE_W/2+28+shake,PLAQUE_CY+46,.32f,new Color(pc.r,pc.g,pc.b,1),in,260);
            art.right(art.inter,tr("ПИШЕТ…","TYPING…"),W/2+PLAQUE_W/2-26+shake,PLAQUE_CY+44,.42f,DIM,in);
            float sc=.74f;serif.getData().setScale(sc);gl.setText(serif,typed);if(gl.width>PLAQUE_W-90){sc*=(PLAQUE_W-90)/gl.width;serif.getData().setScale(sc);gl.setText(serif,typed);}serif.getData().setScale(1);
            serifText(typed,W/2+shake,PLAQUE_CY+8,sc,IVORY,in);
            if(((int)(clock*2.2f))%2==0)art.rect(W/2+gl.width/2+8+shake,PLAQUE_CY-26,3,gl.height+6,GOLD,in);}
        fuse(f,rem,hot,beat);
        attempts(at,since);
    }
    private String attemptKey="";private float attemptAt=-9;
    /** Refused tries of this turn: struck red words under the fuse, the newest pops in (the clock keeps running). */
    private void attempts(JsonArray at,float since){
        if(at.size()==0)return;int from=Math.max(0,at.size()-5);float sc=.56f,gap=12,total=0;float[] w=new float[at.size()];
        for(int i=from;i<at.size();i++){w[i]=art.width(art.inter,s(at.get(i).getAsJsonObject(),"text"),sc)+30;total+=w[i]+gap;}
        float x=W/2-(total-gap)/2,y=58;
        for(int i=from;i<at.size();i++){JsonObject a=at.get(i).getAsJsonObject();boolean newest=i==at.size()-1;float k=newest?Math.max(.05f,Interpolation.swingOut.apply(Math.min(1,since/.3f))):1;
            float al=newest?1:.55f;float cx=x+w[i]/2;
            art.panel(cx-w[i]*k/2,y-17*k,w[i]*k,34*k,RED,al);
            String tx=s(a,"text");art.text(art.inter,tx,cx,y+8*k,sc*k,new Color(1f,.75f,.72f,1),al,0);
            float lw=art.width(art.inter,tx,sc*k);art.rect(cx-lw/2-3,y-1,lw+6,2,RED,al);
            if(s(a,"outcome").equals("REPEAT"))art.text(art.inter,tr("было","said"),cx,y-22,.36f,DIM,al,0);
            x+=w[i]+gap;}
    }
    private void fuse(float f,float rem,boolean hot,float beat){
        float fw=640,fx=W/2-fw/2-36,fy=120,th=12,tip=fx+fw*f;
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
        String typed=s(survival(),"typing");
        if(typed.isEmpty())serifText(tr("ДУМАЕМ НАД ОТВЕТОМ…","WEIGHING THE ANSWER…"),W/2,PLAQUE_CY+14,.48f,IVORY,1);
        else{float sc=.74f;serif.getData().setScale(sc);gl.setText(serif,typed);if(gl.width>PLAQUE_W-90)sc*=(PLAQUE_W-90)/gl.width;serif.getData().setScale(1);
            serifText(typed,W/2,PLAQUE_CY+8,sc,new Color(1f,.92f,.75f,.75f+.25f*MathUtils.sin(clock*6)),1);}
        for(int i=0;i<12;i++){float ang=-clock*260+i*30;art.line(W/2+MathUtils.cosDeg(ang)*20,114+MathUtils.sinDeg(ang)*20,W/2+MathUtils.cosDeg(ang)*32,114+MathUtils.sinDeg(ang)*32,4,EMBER,(i/12f),true);}
    }
    /** The last turn on the plaque: a green check for an accepted answer; a red cross, a short shake and a red edge for a
     *  lost life; an elimination adds a violet flash and a banner. */
    private void verdict(){
        JsonObject l=survival().has("last")?survival().getAsJsonObject("last"):new JsonObject();String o=s(l,"outcome"),id=s(l,"player");
        String shown=!s(l,"label").isEmpty()?s(l,"label"):s(l,"text");float k=Math.min(1,phaseClock/.25f),pop=Math.max(.05f,Interpolation.swingOut.apply(k));
        boolean ok=o.equals("CORRECT");Color c=ok?GREEN:RED;
        String sk=s(t,"phaseStartedAt");if(!sk.equals(slamKey)){slamKey=sk;slamAt=clock;}
        if(ok){float sa=clock-slamAt;
            for(int ring=0;ring<2;ring++){float rt=sa-ring*.12f;if(rt<0||rt>.7f)continue;float rr=60+rt*900,al=.55f*(1-rt/.7f);int nseg=64;
                for(int q=0;q<nseg;q++){float u=360f*q/nseg,v=360f*(q+1)/nseg;art.line(W/2+MathUtils.cosDeg(u)*rr,PLAQUE_CY+MathUtils.sinDeg(u)*rr*.45f,W/2+MathUtils.cosDeg(v)*rr,PLAQUE_CY+MathUtils.sinDeg(v)*rr*.45f,4,GOLD,al,true);}}
            if(sa<.35f){art.glow(W/2,PLAQUE_CY,900,300,GOLD,.5f*(1-sa/.35f));}}
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
            art.panel(W/2-300,96,600,52,VIOLET,e);
            serifText(name(id).toUpperCase(Locale.ROOT)+tr(" ВЫБЫВАЕТ"," IS OUT"),W/2,133,.46f,VIOLET,e);}
    }
    // ---------------------------------------------------------------- the answer wall
    private static final Color[] SIDE={new Color(1f,.38f,.30f,1),new Color(.45f,.68f,1f,1),new Color(.48f,.92f,.52f,1)}; // red, blue, green (a three way duel)
    private final List<Float> born=new ArrayList<>();private String wallKey="";
    /**
     * The answers of this category as engraved bronze plaques in two columns at the sides of the screen. In a duel each
     * side's answers stack under that side's banner (left / right); in survival the newest answer enters at the top of
     * the left column and older ones flow down into the right one. A new plaque flies in from the centre with a gold flash.
     */
    private void wall(){
        JsonArray u=survival().has("used")?survival().getAsJsonArray("used"):new JsonArray();
        String key=s(t,"categoryId")+":"+round();if(!key.equals(wallKey)){wallKey=key;born.clear();for(int i=0;i<u.size();i++)born.add(-9f);}
        while(born.size()<u.size())born.add(clock);while(born.size()>u.size())born.remove(born.size()-1);
        boolean duel=duel()&&(!survival().has("match")||survival().getAsJsonArray("match").size()==2);JsonArray m=duel&&survival().has("match")?survival().getAsJsonArray("match"):new JsonArray();
        float colW=310,rowH=58,top=536,xl=44,xr=W-44-colW;int rows=8;
        // column banners
        boolean sw=swapped();
        if(duel&&m.size()==2)for(int c=0;c<2;c++){JsonObject sd=m.get(sw?1-c:c).getAsJsonObject();float x=c==0?xl:xr;
            art.panel(x,top+2,colW,58,SIDE[c],1);
            art.left(art.cond,sideName(sd),x+24,top+44,.44f,SIDE[c],1,colW-120);
            int lv=sd.get("lives").getAsInt(),max=survival().has("lives")?survival().get("lives").getAsInt():2;
            for(int h=0;h<max;h++){if(h<lv)art.batch.setColor(Color.WHITE);else art.batch.setColor(.3f,.25f,.25f,.8f);art.batch.draw(heartTex,x+colW-40-h*28-12,top+19,24,24);}art.batch.setColor(Color.WHITE);}
        else if(u.size()>0){spacedLabel(tr("УЖЕ НАЗВАНО","ALREADY SAID"),xl+colW/2,top+30,.44f,DIM,.9f);spacedLabel(tr("УЖЕ НАЗВАНО","ALREADY SAID"),xr+colW/2,top+30,.44f,DIM,u.size()>rows?.9f:0);}
        int[] fill={0,0};
        for(int i=u.size()-1;i>=0;i--){JsonObject a=u.get(i).getAsJsonObject();int col,row;
            if(duel){int sid=a.has("side")?a.get("side").getAsInt():0;col=m.size()==2&&m.get(1).getAsJsonObject().get("id").getAsInt()==sid?1:0;if(sw)col=1-col;row=fill[col]++;}
            else{int k=u.size()-1-i;col=k<rows?0:1;row=k<rows?k:k-rows;}
            if(row>=rows)continue;
            float age=clock-born.get(i),e=Interpolation.pow3Out.apply(MathUtils.clamp(age/.55f,0,1));
            float tx=col==0?xl:xr,ty=top-14-(row+1)*rowH,x=MathUtils.lerp(W/2-colW/2,tx,e),y=MathUtils.lerp(PLAQUE_CY-20,ty,e),al=MathUtils.clamp(age/.15f,0,1)*(1-row*.035f);
            boolean fresh=age<1.6f;Color edge=fresh?GOLD:duel?SIDE[Math.min(col,2)]:BRONZE;
            art.panel(x,y,colW,rowH-6,edge,al);
            String pid=s(a,"player");Texture face=art.face(character(pid));
            if(face!=null){art.batch.setColor(1,1,1,al);art.batch.draw(face,x+20,y+11,rowH-28,rowH-28);art.batch.setColor(Color.WHITE);}
            art.left(art.inter,s(a,"label"),x+rowH+6,y+(rowH-6)/2+10,.66f,fresh?IVORY:new Color(.88f,.82f,.74f,1),al,colW-rowH-96);
            art.right(art.inter,name(pid),x+colW-36,y+(rowH-6)/2+7,.40f,DIM,al); // clear of the frame's bevel
            if(age<.5f)art.glow(x+colW/2,y+rowH/2,colW*1.1f,rowH*2,GOLD,.35f*(1-age/.5f));}
    }
    private int round(){return t!=null&&t.has("round")?t.get("round").getAsInt():0;}
    private boolean duel(){String f=s(survival(),"format");return f.equals("DUEL")||f.equals("TEAMS");}
    /** The screen column (0 left, 1 right) of the player's side in the current duel, else -1. The side whose players hang
     *  further left in the frame row gets the left column, so colours and columns always match the frames above. */
    private int sideIndex(String id){JsonArray m=survival().has("match")?survival().getAsJsonArray("match"):null;if(m==null)return -1;
        for(int c=0;c<m.size();c++)for(JsonElement e:m.get(c).getAsJsonObject().getAsJsonArray("players"))if(e.getAsString().equals(id))return m.size()==2&&swapped()?1-c:c;return -1;}
    private int seatOf(String id){List<JsonObject> ps=players();for(int i=0;i<ps.size();i++)if(s(ps.get(i),"id").equals(id))return i;return 99;}
    private boolean swapped(){JsonArray m=survival().has("match")?survival().getAsJsonArray("match"):null;if(m==null||m.size()<2)return false;
        int a=99,b=99;for(JsonElement e:m.get(0).getAsJsonObject().getAsJsonArray("players"))a=Math.min(a,seatOf(e.getAsString()));
        for(JsonElement e:m.get(1).getAsJsonObject().getAsJsonArray("players"))b=Math.min(b,seatOf(e.getAsString()));return a>b;}
    private String sideName(JsonObject sd){StringBuilder b=new StringBuilder();for(JsonElement e:sd.getAsJsonArray("players")){if(b.length()>0)b.append(" & ");b.append(name(e.getAsString()));}return b.toString().toUpperCase(Locale.ROOT);}

    // ---------------------------------------------------------------- knockout: bracket, versus, duel result
    /** The bracket: one column per round (future rounds as empty slots up to the champion), lines between them, the next
     *  duel glowing gold, winners in gold, knocked-out sides struck through. */
    private void bracket(){
        logo(800,.62f);
        JsonArray br=survival().has("bracket")?survival().getAsJsonArray("bracket"):new JsonArray();if(br.size()==0)return;
        int first=br.get(0).getAsJsonArray().size(),total=1;{int n=first;while(n>1){n=n/2;total++;}} // an odd side joins a duel (three way), so a round halves down
        int ri=survival().get("roundIndex").getAsInt();
        String title=total-ri<=1?tr("ФИНАЛ","THE FINAL"):tr("РАУНД "+(ri+1),"ROUND "+(ri+1));
        float k=Math.min(1,phaseClock/.5f);spacedLabel(title,W/2,722,.60f,GOLD,k);
        float x0=120,x1=W-120,colW=Math.min(300,(x1-x0)/total-40),gapX=total>1?((x1-x0)-colW*total)/(total-1):0;
        float areaTop=680,areaBot=80;
        float[][] centers=new float[total][];
        for(int c=0;c<total;c++){int n=c<br.size()?br.get(c).getAsJsonArray().size():Math.max(1,(int)(first/Math.pow(2,c)));centers[c]=new float[n];
            for(int m=0;m<n;m++)centers[c][m]=c==0?areaTop-(areaTop-areaBot)*(m+.5f)/n:(m*2+1<centers[c-1].length?(centers[c-1][m*2]+centers[c-1][m*2+1])/2:centers[c-1][Math.min(m*2,centers[c-1].length-1)]);}
        for(int c=0;c<total;c++){float x=x0+c*(colW+gapX);float d=MathUtils.clamp((phaseClock-c*.18f)/.4f,0,1);
            for(int m=0;m<centers[c].length;m++){float cy=centers[c][m];JsonObject mt=c<br.size()&&m<br.get(c).getAsJsonArray().size()?br.get(c).getAsJsonArray().get(m).getAsJsonObject():null;
                boolean next=c==ri&&mt!=null&&!mt.has("winner")&&!mt.has("bye")&&isNextMatch(br,ri,m);
                if(c+1<total){float nx=x+colW+gapX,ny=centers[c+1][Math.min(m/2,centers[c+1].length-1)];art.rect(x+colW,cy-1,gapX/2,2,BRONZE,.6f*d);art.rect(x+colW+gapX/2-1,Math.min(cy,ny),2,Math.abs(ny-cy)+2,BRONZE,.6f*d);art.rect(x+colW+gapX/2,ny-1,gapX/2,2,BRONZE,.6f*d);}
                int ns=mt!=null?mt.getAsJsonArray("sides").size():1;float bh=ns==3?94:ns==2?64:34;
                if(next)art.glow(x+colW/2,cy,colW*1.3f,bh*2.2f,GOLD,.25f+.1f*MathUtils.sin(clock*4));
                art.panel(x,cy-bh/2,colW,bh,next?GOLD:BRONZE,d);
                if(mt==null){art.text(art.inter,"?",x+colW/2,cy+8,.6f,DIM,d,0);continue;}
                JsonArray sd=mt.getAsJsonArray("sides");int win=mt.has("winner")?mt.get("winner").getAsInt():-1;
                for(int q=0;q<sd.size();q++){JsonObject one=sd.get(q).getAsJsonObject();float ly=sd.size()==3?cy+30-q*30:sd.size()==2?cy+(q==0?14:-16):cy+1;boolean w=one.get("id").getAsInt()==win,lost=win>=0&&!w;
                    String nm=sideName(one);Color c2=w?GOLD:lost?new Color(.5f,.45f,.42f,1):IVORY;
                    art.left(art.inter,nm,x+14,ly+8,.54f,c2,d,colW-28);if(lost){float lw=Math.min(colW-28,art.width(art.inter,nm,.54f));art.rect(x+14,ly-1,lw,1.5f,RED,.8f*d);}}
                if(sd.size()==2)art.rect(x+10,cy-1,colW-20,1,BRONZE,.4f*d);
                if(sd.size()==3){art.rect(x+10,cy+15,colW-20,1,BRONZE,.4f*d);art.rect(x+10,cy-15,colW-20,1,BRONZE,.4f*d);}
                if(mt.has("bye"))art.right(art.inter,tr("проходит","bye"),x+colW-12,cy+7,.40f,DIM,d);}}
        // the champion slot
        art.text(art.inter,tr("ЧЕМПИОН","CHAMPION"),x0+(total-1)*(colW+gapX)+colW/2,centers[total-1][0]+62,.46f,GOLD,1,0);
    }
    private boolean isNextMatch(JsonArray br,int ri,int m){JsonArray r=br.get(ri).getAsJsonArray();for(int i=0;i<r.size();i++){JsonObject o=r.get(i).getAsJsonObject();if(o.has("winner")||o.has("bye"))continue;return i==m;}return false;}
    /** Versus: both sides' characters slide in from the edges, a burning VS between them, names on plaques. */
    private void versus(){
        JsonArray m=survival().has("match")?survival().getAsJsonArray("match"):new JsonArray();if(m.size()<2)return;
        int ri=survival().get("roundIndex").getAsInt();
        float k=Interpolation.pow3Out.apply(Math.min(1,phaseClock/.6f)),v=Interpolation.swingOut.apply(MathUtils.clamp((phaseClock-.35f)/.5f,0,1));
        logo(812,.55f);
        int n=Math.min(3,m.size());boolean three=n==3;
        spacedLabel(three?tr("РАУНД "+(ri+1)+" · ТРОЙНАЯ ДУЭЛЬ","ROUND "+(ri+1)+" · THREE WAY DUEL"):tr("РАУНД "+(ri+1)+" · ДУЭЛЬ","ROUND "+(ri+1)+" · DUEL"),W/2,724,.56f,DIM,k);
        if(three)spacedLabel(tr("ДАЛЬШЕ ПРОХОДИТ ОДИН","ONLY ONE MOVES ON"),W/2,40,.42f,GOLD,k);
        for(int c=0;c<n;c++){JsonObject sd=m.get(c).getAsJsonObject();JsonArray pl=sd.getAsJsonArray("players");float baseX=three?(c==0?300:c==1?800:1300):c==0?420:1180,dir=three&&c==1?0:c==0?-1:1;
            float x=baseX+dir*(1-k)*600;art.glow(x,330,620,520,SIDE[c],.22f*k);
            for(int q=0;q<pl.size();q++){Texture body=art.body(character(pl.get(q).getAsString()));if(body==null)continue;float bh=(pl.size()==1?440:360)*(three?.82f:1),bw=bh*body.getWidth()/body.getHeight();
                float ox=pl.size()==1?0:(q-(pl.size()-1)/2f)*(three?140:200);float y=three&&c==1?120+(1-k)*-500:120;art.batch.setColor(1,1,1,k);art.batch.draw(body,x+ox-bw/2,y,bw,bh);}
            art.batch.setColor(Color.WHITE);
            float pw=three?360:400;art.panel(x-pw/2,70,pw,56,SIDE[c],k);art.text(art.cond,sideName(sd),x,111,.46f,SIDE[c],k,pw-30);}
        if(v>0)for(float vx:three?new float[]{550,1050}:new float[]{W/2}){art.glow(vx,360,three?300:420,320,RED,.45f*v);serifText("VS",vx,410,(three?1.1f:1.6f)*v,new Color(1f,.86f,.6f,1),Math.min(1,v));}
    }
    /** The duel result: the winning side in gold with rays, the loser struck out. */
    private void matchResult(){
        JsonObject w=survival().has("winner")?survival().getAsJsonObject("winner"):null;logo(586,1);if(w==null)return;
        float k=Math.max(.05f,Interpolation.swingOut.apply(Math.min(1,phaseClock/.5f)));
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);for(int i=0;i<12;i++){float ang=clock*8+i*30;art.line(W/2,300,W/2+MathUtils.cosDeg(ang)*460,300+MathUtils.sinDeg(ang)*240,30,GOLD,.03f,true);}
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        plaque(GOLD,1,0);spacedLabel(tr("ПОБЕДА В ДУЭЛИ","WINS THE DUEL"),W/2,PLAQUE_CY+38,.50f,GOLD,1);
        serifText(sideName(w),W/2,PLAQUE_CY+12,.80f*k,GOLD,1);
        spacedLabel(tr("ПРОХОДИТ ДАЛЬШЕ","MOVES ON"),W/2,120,.46f,DIM,MathUtils.clamp((phaseClock-.6f)/.3f,0,1));
    }
    /** Intro: the logo, SURVIVAL between laurels and three rule cards with drawn icons. */
    private void intro(){
        float k=Math.min(1,phaseClock/.5f);logo(590,1.15f-.10f*Interpolation.pow3Out.apply(k));
        int lives=survival().has("lives")?survival().get("lives").getAsInt():3;float a=MathUtils.clamp((phaseClock-.7f)/.4f,0,1);
        serifText(tr("ВЫЖИВАНИЕ","SURVIVAL"),W/2,452,.70f,GOLD,a);
        serif.getData().setScale(.70f);gl.setText(serif,tr("ВЫЖИВАНИЕ","SURVIVAL"));float hw=gl.width/2;serif.getData().setScale(1);
        String[][] cards={{tr("ПО ОЧЕРЕДИ","IN TURN"),tr("Назови новый верный\nответ, пока горит фитиль","Name a new correct answer\nbefore the fuse burns out")},
            {tr(lives+" ЖИЗНИ",lives+" LIVES"),tr("Ошибки не страшны: жизнь\nуходит, только если вышло время","Wrong tries are free: a life goes\nonly when the time runs out")},
            {tr("КРУГ И СМЕНА","ROUND AND SWITCH"),tr("Не успел: остальные доотвечают\nкруг, и категория сменится","Out of time: the others finish\nthe round, then a new category")}};
        for(int i=0;i<3;i++){float d=MathUtils.clamp((phaseClock-1.0f-i*.18f)/.35f,0,1);if(d<=0)continue;float cx=W/2+(i-1)*370,cy=250,cw=340,ch=200;
            art.panel(cx-cw/2,cy-ch/2,cw,ch,i==1?RED:BRONZE,d);
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
    /** The category is shown, then the last three seconds count down in big numbers on the plaque (one tick each). */
    private int lastCount=-1;
    private void countdown(){
        float rem=left();int n=(int)Math.ceil(rem);
        if(n>3||n<1){spacedLabel(tr("НОВАЯ КАТЕГОРИЯ","A NEW CATEGORY"),W/2,PLAQUE_CY+12,.60f,GOLD,Math.min(1,phaseClock/.4f));return;}
        if(n!=lastCount){lastCount=n;art.play("sounds/results/count_tick.wav",.55f);}
        float f=rem-(n-1),pop=Interpolation.pow3Out.apply(MathUtils.clamp((1-f)/.25f,0,1));
        spacedLabel(tr("ПРИГОТОВЬСЯ","GET READY"),W/2,PLAQUE_CY+40,.46f,DIM,1);
        art.glow(W/2,PLAQUE_CY,260,160,GOLD,.25f*(1-pop*.5f));
        serifText(String.valueOf(n),W/2,PLAQUE_CY+28,1.1f*(1.5f-.5f*pop),GOLD,Math.min(1,f*3));
    }
    /** Final: the top three on stone pedestals (first in the middle, raised, under a gold light), names and souls on
     *  plaques; the others in a short line below. In a duel bracket team mates share their place. */
    private void finale(){
        JsonArray st=t.has("standings")?t.getAsJsonArray("standings"):new JsonArray();
        logo(800,.62f);if(st.size()==0)return;
        boolean team=s(survival(),"format").equals("TEAMS");
        spacedLabel(duel()?tr(team?"ЧЕМПИОНЫ":"ЧЕМПИОН",team?"THE CHAMPIONS":"THE CHAMPION"):tr("ПОСЛЕДНИЙ ВЫЖИВШИЙ","THE LAST SURVIVOR"),W/2,716,.56f,GOLD,Math.min(1,phaseClock/.5f));
        // group by rank: place -> players
        Map<Integer,List<JsonObject>> by=new TreeMap<>();for(JsonElement e:st){JsonObject r=e.getAsJsonObject();by.computeIfAbsent(r.get("rank").getAsInt(),k->new ArrayList<>()).add(r);}
        List<Integer> ranks=new ArrayList<>(by.keySet());
        float[] px={W/2,W/2-400,W/2+400},ph={190,130,90};Color[] medal={GOLD,new Color(.82f,.84f,.88f,1),new Color(.85f,.55f,.32f,1)};
        int[] order={1,2,0}; // draw sides first, the winner last
        for(int oi:order){if(oi>=ranks.size())continue;List<JsonObject> group=by.get(ranks.get(oi));float d=MathUtils.clamp((phaseClock-(oi==0?1.2f:.4f+oi*.3f))/.5f,0,1);if(d<=0)continue;
            float cx=px[oi],top=110+ph[oi]*Interpolation.pow3Out.apply(d),k=Interpolation.swingOut.apply(d);
            if(oi==0){art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);art.batch.setColor(1f,.85f,.5f,.10f*d);art.batch.draw(art.soft,cx-260,top-40,520,H-top+60);
                for(int q=0;q<10;q++){float ang=clock*7+q*36;art.line(cx,top+180,cx+MathUtils.cosDeg(ang)*360,top+180+MathUtils.sinDeg(ang)*220,26,GOLD,.03f*d,true);}
                art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            // pedestal: a stone block with a bronze rim and the place number
            art.panel(cx-150,110,300,top-110,medal[oi],d);
            serifText(String.valueOf(oi+1),cx,top-18,.9f,medal[oi],d);
            // the characters stand on it
            for(int q=0;q<group.size();q++){String id=s(group.get(q),"playerId");Texture body=art.body(character(id));if(body==null)continue;
                float bh=(oi==0?300:230)*k,bw=bh*body.getWidth()/body.getHeight(),ox=group.size()==1?0:(q-(group.size()-1)/2f)*Math.min(150,260f/group.size()*1.4f);
                art.batch.setColor(1,1,1,d);art.batch.draw(body,cx+ox-bw/2,top-6,bw,bh);}
            art.batch.setColor(Color.WHITE);
            StringBuilder nm=new StringBuilder();for(JsonObject g:group){if(nm.length()>0)nm.append(" & ");nm.append(name(s(g,"playerId")));}
            float ny=top+(oi==0?318:246);art.panel(cx-170,ny-26,340,52,medal[oi],d);
            art.text(art.cond,nm.toString().toUpperCase(Locale.ROOT),cx,ny+12,.42f,medal[oi],d,310);
            long souls=group.get(0).has("souls")?group.get(0).get("souls").getAsLong():0;
            if(souls>0)art.text(art.cond,"+"+souls+tr(" душ"," souls"),cx,72,.40f,GOLD,d,0);}
        // the rest
        StringBuilder rest=new StringBuilder();for(int i=3;i<ranks.size();i++)for(JsonObject g:by.get(ranks.get(i))){if(rest.length()>0)rest.append("   ·   ");rest.append(ranks.get(i)).append(". ").append(name(s(g,"playerId")));}
        if(rest.length()>0)art.text(art.inter,rest.toString(),W/2,40,.48f,DIM,MathUtils.clamp((phaseClock-2f)/.5f,0,1),W-200);
        art.text(art.inter,tr("ENTER · В ЛОББИ","ENTER · BACK TO THE LOBBY"),W-170,24,.40f,DIM,.8f,0);
    }

    /** Players in their hanging frames; the one whose turn it is hangs a little lower and glows, the eliminated fade. */
    // ---------------------------------------------------------------- frame reactions and particles
    private static final class Fx{int lives=-1,correct=-1;boolean out;float born,hitAt=-9,goodAt=-9,outAt=-9;}
    private final Map<String,Fx> fx=new HashMap<>();private float shakeAt=-9,slamAt=-9;private String slamKey="";
    /** one pool of particles: 0 heart shard (falls, spins), 1 gold spark (additive), 2 ghost smoke (rises, grows) */
    private final int PN=220;private final float[] qx=new float[PN],qy=new float[PN],qvx=new float[PN],qvy=new float[PN],ql=new float[PN],qm=new float[PN],qs=new float[PN],qr=new float[PN];private final int[] qt=new int[PN];private int qi;
    private void emit(int type,float x,float y,float vx,float vy,float life,float size){int k=qi=(qi+1)%PN;qt[k]=type;qx[k]=x;qy[k]=y;qvx[k]=vx;qvy[k]=vy;ql[k]=qm[k]=life;qs[k]=size;qr[k]=MathUtils.random(360);}
    private void particles(SpriteBatch b){
        float dt=Math.min(.05f,Gdx.graphics.getDeltaTime());
        for(int pass=0;pass<2;pass++){if(pass==1)b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
            for(int k=0;k<PN;k++){if(ql[k]<=0)continue;boolean add=qt[k]==1;if(add!=(pass==1))continue;
                if(pass==0||add){ql[k]-=dt*(pass==1||!add?1:0)+(pass==0&&!add?0:0);}
                float a=MathUtils.clamp(ql[k]/qm[k],0,1);
                switch(qt[k]){
                    case 0->{qvy[k]-=900*dt;qx[k]+=qvx[k]*dt;qy[k]+=qvy[k]*dt;qr[k]+=qvx[k]*dt*2;b.setColor(.85f,.08f,.10f,a);b.draw(shard,qx[k]-qs[k]/2,qy[k]-qs[k]/2,qs[k]/2,qs[k]/2,qs[k],qs[k]*.7f,1,1,qr[k]);}
                    case 1->{qvy[k]-=260*dt;qvx[k]*=.97f;qx[k]+=qvx[k]*dt;qy[k]+=qvy[k]*dt;b.setColor(1f,.78f+.2f*a,.35f,a);b.draw(art.soft,qx[k]-qs[k],qy[k]-qs[k],qs[k]*2,qs[k]*2);}
                    default->{qx[k]+=qvx[k]*dt;qy[k]+=qvy[k]*dt;float g=qs[k]*(1.8f-a);b.setColor(.62f,.48f,.90f,.32f*a);b.draw(art.soft,qx[k]-g,qy[k]-g,g*2,g*2);}
                }}}
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);b.setColor(Color.WHITE);
    }
    private com.badlogic.gdx.graphics.g2d.TextureRegion shard;
    private void players(SpriteBatch b){
        if(shard==null)shard=new com.badlogic.gdx.graphics.g2d.TextureRegion(pixel);
        List<JsonObject> ps=players();int n=ps.size();if(n==0)return;
        float cell=Math.min(240,(W-120)/n),left=(W-cell*n)/2;String turn=s(survival(),"turnPlayer");boolean turning=phase().startsWith("TURN");
        int lives=survival().has("lives")?survival().get("lives").getAsInt():3;
        boolean duel=duel();
        for(int i=0;i<n;i++){JsonObject p=ps.get(i);String id=s(p,"id");boolean out=duel?p.has("ghost")&&p.get("ghost").getAsBoolean():p.has("lives")&&p.get("lives").getAsInt()<=0;boolean active=turning&&id.equals(turn);
            int side=duel?sideIndex(id):-1;boolean watching=duel&&side<0&&!phase().equals("FINAL_RESULTS")&&!phase().equals("COMPLETED");
            int k=out?1:new int[]{0,2,3,4}[i%4];Texture ft=frames[k];if(ft==null)continue;float[] g=QuestionPlayers.GEO[k];
            // reactions: drop in on arrival, hop on a correct answer, jolt on a lost life, a long swing when knocked out
            int lvNow=p.has("lives")?p.get("lives").getAsInt():0,cNow=p.has("correct")?p.get("correct").getAsInt():0;
            Fx f=fx.computeIfAbsent(id,x->{Fx q=new Fx();q.born=clock+0.08f*fx.size();return q;});
            boolean lostLife=f.lives>=0&&lvNow<f.lives,gotOne=f.correct>=0&&cNow>f.correct,justOut=out&&!f.out&&f.lives>=0;
            if(lostLife){f.hitAt=clock;shakeAt=clock;}if(gotOne)f.goodAt=clock;if(justOut)f.outAt=clock;
            float tb=clock-f.born,drop=(1-Interpolation.swingOut.apply(MathUtils.clamp(tb/.8f,0,1)))*300,tg=clock-f.goodAt,th=clock-f.hitAt,to=clock-f.outAt;
            float dy=drop+(tg<.5f?MathUtils.sin(tg/.5f*MathUtils.PI)*22:0),dx=(th<.5f?MathUtils.sin(th*60)*9*(1-th/.5f):0)+(to<3f?MathUtils.sin(to*7)*26*(float)Math.exp(-to*1.4f):0);
            float cx=left+(i+.5f)*cell+dx,fw=Math.min(212,cell-10)*(active?1.08f:1),fh=fw*ft.getHeight()/ft.getWidth();
            float plateMid=722-(active?8:0)+dy,top=plateMid+fh*(g[2]+g[3])/2,x0=cx-fw/2,hy=top-fh*g[0],hr=fw*g[1];
            if(gotOne)for(int q=0;q<26;q++){float ang=MathUtils.random(360),sp=MathUtils.random(120,380);emit(1,cx+MathUtils.cosDeg(ang)*hr,hy+MathUtils.sinDeg(ang)*hr,MathUtils.cosDeg(ang)*sp,MathUtils.sinDeg(ang)*sp+120,MathUtils.random(.5f,1f),MathUtils.random(3,6));}
            if(justOut)for(int q=0;q<18;q++)emit(2,cx+MathUtils.random(-hr,hr),hy+MathUtils.random(-hr,hr*.5f),MathUtils.random(-20,20),MathUtils.random(30,80),MathUtils.random(1.6f,2.6f),MathUtils.random(20,40));
            if(tg<.6f)art.glow(cx,hy,hr*5,hr*5,GOLD,.45f*(1-tg/.6f));
            if(th<.4f)art.glow(cx,hy,hr*5,hr*5,RED,.45f*(1-th/.4f));
            if(to<1.2f)art.glow(cx,hy,hr*6,hr*6,new Color(.6f,.35f,1f,1),.5f*(1-to/1.2f));
            float a=out?.70f:1,dim=out?.55f:watching?.42f:turning&&!active?.62f:1; // waiting frames are darker, never see-through
            if(side>=0&&!out){Color sc=SIDE[side];art.glow(cx,722+fw*.15f,fw*1.25f,fw*1.25f,sc,.16f);}
            if(active){ // a spotlight from above on the player who answers
                art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
                art.batch.setColor(1f,.82f,.55f,.10f);art.batch.draw(art.soft,cx-hr*2.2f,hy-hr*2.6f,hr*4.4f,H-(hy-hr*2.6f)+hr*2);
                art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
                art.glow(cx,hy,hr*4.4f,hr*4.4f,new Color(1f,.60f,.30f,1),.26f+.10f*MathUtils.sin(clock*5));}
            b.setColor(.05f,.02f,.03f,.85f*a);b.draw(pixel,cx-hr*.74f,hy-hr*.74f,hr*1.48f,hr*1.48f);
            b.setColor(dim,dim,dim,a);b.draw(ft,x0,top-fh,fw,fh);
            // the character stands in front of the ring, legs behind the name plate (redrawn on top)
            Texture body=art.body(character(id));float nameMid=top-fh*(g[2]+g[3])/2;
            if(body!=null){float bh=(hy+hr*1.70f)-nameMid,bw=bh*body.getWidth()/body.getHeight();
                if(out)b.setColor(.82f*dim,.74f*dim,1f*dim,.70f*a);else b.setColor(dim,dim,dim,a);b.draw(body,cx-bw/2,nameMid,bw,bh);}
            float cut=g[2]-.012f;int sy=(int)(ft.getHeight()*cut);b.setColor(dim,dim,dim,a);b.draw(ft,x0,top-fh,fw,fh*(1-cut),0,sy,ft.getWidth(),ft.getHeight()-sy,false,false);
            Color pc=out?VIOLET:new Color(com.erni.finalanswer.ui.PlayerColors.light(character(id)));
            float nTop=top-fh*g[2],nBot=top-fh*g[3];
            art.text(art.cond,name(id),cx,(nTop+nBot)/2+fw*.042f,fw*.082f/Math.max(1,art.cond.getData().capHeight),new Color(pc.r,pc.g,pc.b,1),a,fw*.58f);
            // lives in the lower plate: hearts, spent ones dark
            float cTop=top-fh*g[4],cBot=top-fh*g[5];int lv=p.has("lives")?p.get("lives").getAsInt():0;float hs=fw*.040f,step=fw*.105f;
            float hsz=Math.min(cTop-cBot,fw*.13f)*.78f,stp=hsz*1.12f;
            for(int j=0;j<lives;j++){float hx=cx+(j-(lives-1)/2f)*stp,hy2=(cTop+cBot)/2;
                if(lostLife&&j>=lv&&j<f.lives)for(int q=0;q<12;q++)emit(0,hx,hy2,MathUtils.random(-160,160),MathUtils.random(80,320),MathUtils.random(.7f,1.1f),MathUtils.random(4,8)); // the heart shatters
                boolean breaking=j>=lv&&th<.25f&&j<lv+1;float hsc=breaking?1+(.25f-th)*2.4f:1;
                if(j<lv)b.setColor(1,1,1,a);else b.setColor(.28f,.24f,.24f,.75f*a);b.draw(heartTex,hx-hsz*hsc/2,hy2-hsz*hsc/2,hsz*hsc,hsz*hsc);}
            // this lap: a gold check on frames that already answered, a soft red pulse on the ones still to answer after a timeout
            if(turning&&!out&&!watching&&!active){JsonArray done=survival().has("lapDone")?survival().getAsJsonArray("lapDone"):new JsonArray();boolean played=false;for(JsonElement e:done)if(e.getAsString().equals(id))played=true;
                boolean closing=survival().has("closing")&&survival().get("closing").getAsBoolean();
                if(played){float bx=cx+hr*.92f,by=hy+hr*.92f,R=17;
                    b.setColor(0,0,0,.65f);b.draw(disc,bx-R-2,by-R-4,2*R+4,2*R+4);
                    b.setColor(.55f,.36f,.12f,1);b.draw(disc,bx-R,by-R,2*R,2*R);b.setColor(1f,.82f,.42f,1);b.draw(disc,bx-R+2.5f,by-R+2.5f,2*R-5,2*R-5);
                    b.setColor(1f,.95f,.75f,.6f);b.draw(disc,bx-R*.55f,by,R*.9f,R*.55f);
                    Color ink=new Color(.20f,.09f,.02f,1);art.line(bx-7.5f,by+.5f,bx-2,by-6,3.8f,ink,1,false);art.line(bx-2,by-6,bx+8,by+7,3.8f,ink,1,false);}
                else if(closing){float pu=.5f+.5f*MathUtils.sin(clock*5);art.glow(cx,hy,hr*4.6f,hr*4.6f,RED,.26f+.16f*pu);}}
            f.lives=lvNow;f.correct=cNow;f.out=out;
        }
        particles(b);
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
