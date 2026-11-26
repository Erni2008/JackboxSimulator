package com.erni.finalanswer.thinkordie;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.GlyphLayout;
import com.badlogic.gdx.graphics.g2d.NinePatch;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.freetype.FreeTypeFontGenerator;
import com.badlogic.gdx.math.Interpolation;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.Disposable;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.util.*;
import java.util.function.LongSupplier;

/**
 * THINK OR DIE as a challenge inside the main match, drawn over the current floor (the room stays visible under a warm
 * red light). Layout: metal logo on a red ribbon, a cut-corner category plate with a CATEGORY tab, a stopwatch timer on
 * the right, three rule cards with drawn icons, the ghost rule and the four soul badges; then the grouped answer reveal.
 * The characters stay in the classic top bar ({@code QuestionPlayers} card mode); this actor never draws there.
 * Reads server snapshots only; no network, no blocking work on the render thread.
 */
public final class ThinkOrDieChallenge extends Actor implements Disposable {
    static final Color RED=new Color(1f,.18f,.22f,1),EMBER=new Color(1f,.42f,.16f,1),VIOLET=new Color(.62f,.24f,1f,1),BLUE=new Color(.20f,.55f,1f,1),
        BLACK=new Color(.03f,.01f,.01f,1),METAL=new Color(.93f,.91f,.90f,1),DIM=new Color(.70f,.64f,.62f,1),STEEL=new Color(.55f,.53f,.55f,1),
        GOLD=new Color(1f,.74f,.20f,1),GREEN=new Color(.25f,.85f,.32f,1),CYAN=new Color(.30f,.88f,1f,1),ORANGE=new Color(1f,.56f,.16f,1),GREY=new Color(.55f,.56f,.64f,1),
        CARD=new Color(.07f,.025f,.025f,.93f);
    private final ThinkOrDieArt art=new ThinkOrDieArt();
    private final LongSupplier now;
    private JsonObject tod;private final Map<String,String> character=new HashMap<>(),names=new HashMap<>();
    private String session="",phase="",lang="en";
    private float mix,clock;private boolean active;
    private int lastSecond=-1;
    private final float[] px=new float[40],py=new float[40],ps=new float[40];
    private long blipAt;
    private final Texture octFill,octEdge;private final NinePatch oct,octRim;
    private final BitmapFont serif;private final GlyphLayout gl=new GlyphLayout();private final Matrix4 saved=new Matrix4(),shear=new Matrix4();

    public ThinkOrDieChallenge(LongSupplier serverNow){
        now=serverNow;setTouchable(Touchable.disabled);setName("thinkOrDieChallenge");
        for(int i=0;i<px.length;i++){px[i]=MathUtils.random();py[i]=MathUtils.random();ps[i]=.3f+MathUtils.random();}
        octFill=octagon(false);octEdge=octagon(true);oct=new NinePatch(octFill,30,30,30,30);octRim=new NinePatch(octEdge,30,30,30,30);
        serif=serifFont();
    }
    /** Cut-corner plate (the frame of the mock-up): filled and rim-only versions, 96 px with 24 px bevels. */
    private static Texture octagon(boolean edge){int n=96;float c=24;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float fx=x+.5f,fy=y+.5f,r=(float)Math.sqrt(.5);
            float d=Math.min(Math.min(Math.min(fx,fy),Math.min(n-fx,n-fy)),Math.min(Math.min((fx+fy-c)*r,(n-fx+fy-c)*r),Math.min((fx+n-fy-c)*r,(n-fx+n-fy-c)*r)));
            float a=edge?MathUtils.clamp(1-Math.abs(d-2.6f)/1.7f,0,1):MathUtils.clamp(d+.5f,0,1);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    private static BitmapFont serifFont(){
        var fh=Gdx.files.internal("ui/fonts/CormorantSC-Bold.ttf");if(!fh.exists())fh=Gdx.files.internal("ui/fonts/NotoSans-SemiCondensedSemiBold.ttf");
        var g=new FreeTypeFontGenerator(fh);
        try{var p=new FreeTypeFontGenerator.FreeTypeFontParameter();p.size=64;p.kerning=true;
            StringBuilder c=new StringBuilder(FreeTypeFontGenerator.DEFAULT_CHARS);for(char ch='Ѐ';ch<='ӿ';ch++)c.append(ch);p.characters=c.append("–—«»…’").toString();
            p.minFilter=Texture.TextureFilter.Linear;p.magFilter=Texture.TextureFilter.Linear;return g.generateFont(p);}finally{g.dispose();}
    }
    /** @param root the room snapshot (players + thinkOrDie); null ends the challenge (the light fades back). */
    public void apply(JsonObject root){
        JsonObject t=root==null||!root.has("thinkOrDie")?null:root.getAsJsonObject("thinkOrDie");
        if(t==null||!t.has("integrated")||!t.get("integrated").getAsBoolean()){active=false;return;}
        if(root.has("players"))for(JsonElement e:root.getAsJsonArray("players")){JsonObject p=e.getAsJsonObject();String id=p.get("id").getAsString();
            if(p.has("characterId"))character.put(id,p.get("characterId").getAsString());if(p.has("name"))names.put(id,p.get("name").getAsString());}
        String s=t.get("sessionId").getAsString();
        if(!s.equals(session)){session=s;lastSecond=-1;}
        String ph=t.get("phase").getAsString();
        if(!ph.equals(phase)){onPhase(ph);phase=ph;}
        tod=t;active=true;lang=t.has("lang")?t.get("lang").getAsString():"en";
    }
    public boolean visible(){return active||mix>0;}
    public boolean running(){return active;}
    public String phase(){return active?phase:"";}
    /** Answer-counter sound, throttled so eight fast typists never become noise. */
    public void blip(){long t=System.currentTimeMillis();if(t-blipAt<140)return;blipAt=t;art.play("sounds/impostor/vote_sent.wav",.22f);}
    private void onPhase(String ph){
        switch(ph){
            case "INTRO"->art.play("sounds/cursed_boxes/appearance.wav",.7f);
            case "CATEGORY_REVEAL"->art.play("sounds/impostor/vote_started.wav",.6f);
            case "ANSWER_VALIDATION"->art.play("sounds/questions/door_lock(done).wav",.6f);
            case "ANSWER_REVEAL"->art.play("sounds/results/winner_impact.wav",.55f);
            case "ROUND_RESULTS"->art.play("sounds/results/count_tick.wav",.6f);
            default->{}
        }
    }
    private String tr(String ru,String en){return "ru".equals(lang)?ru:en;}
    private long ms(String k){return tod!=null&&tod.has(k)?tod.get(k).getAsLong():0;}
    private float since(){return Math.max(0,(now.getAsLong()-ms("phaseStartedAt"))/1000f);}
    private float left(){long e=ms("phaseEndsAt");return e<0?0:Math.max(0,(e-now.getAsLong())/1000f);}
    private int points(String k,int d){return tod!=null&&tod.has("points")&&tod.getAsJsonObject("points").has(k)?tod.getAsJsonObject("points").get(k).getAsInt():d;}

    @Override public void act(float delta){
        super.act(delta);clock+=delta;
        mix=MathUtils.clamp(mix+(active?1:-1)*delta/(active?.9f:1.1f),0,1);
        for(int i=0;i<px.length;i++){py[i]+=delta*.03f*ps[i];if(py[i]>1.05f){py[i]=-.05f;px[i]=MathUtils.random();}}
        if(active&&"ANSWERING".equals(phase)){int s=(int)Math.ceil(left());if(s!=lastSecond){lastSecond=s;if(s>0&&s<=5)art.play("sounds/results/count_tick.wav",.35f+.08f*(5-s));}}
    }
    @Override public void draw(Batch batch,float parentAlpha){
        if(mix<=0||!(batch instanceof SpriteBatch sb))return;
        art.batch=sb;Color keep=new Color(batch.getColor());saved.set(batch.getTransformMatrix());
        float w=getStage().getViewport().getWorldWidth(),h=getStage().getViewport().getWorldHeight(),a=mix*parentAlpha;
        try{
            atmosphere(w,h,a);
            if(tod==null)return;
            float t=since();
            switch(phase){
                case "INTRO"->{boolean rules=tod.has("rules")&&tod.get("rules").getAsBoolean();
                    float slam=Math.min(1,t/.45f),move=rules?MathUtils.clamp((t-1.6f)/.5f,0,1):0;
                    logo(w/2,MathUtils.lerp(h*.50f,613,Interpolation.pow2.apply(move)),MathUtils.lerp(1.45f,1f,Interpolation.pow2.apply(move))*(1.35f-.35f*Interpolation.pow3Out.apply(slam)),a*Math.min(1,t/.2f));
                    if(t<.6f)art.glow(w/2,h*.5f,w*(.5f+t),h*.6f,RED,.4f*(1-t/.6f)*a);
                    if(rules&&t>=2f){float k=Math.min(1,(t-2f)/.35f);rulesBlock(w,a,t-2f);
                        categoryPlate(w,a*k,tr("ПРИГОТОВЬСЯ · СЕЙЧАС ПОЯВИТСЯ КАТЕГОРИЯ","GET READY · THE CATEGORY IS COMING"),.75f,true);}}
                case "CATEGORY_REVEAL"->{logo(w/2,613,1,a);categoryPlate(w,a,categoryText(),Interpolation.swingOut.apply(Math.min(1,t/.55f)),false);rulesBlock(w,a,9);}
                case "ANSWERING"->{logo(w/2,613,1,a);categoryPlate(w,a,categoryText(),1,false);stopwatch(a);rulesBlock(w,a,9);edgePulse(w,h,a);}
                case "ANSWER_VALIDATION","DISPUTE"->{logo(w/2,613,1,a);categoryPlate(w,a*.85f,categoryText(),1,false);checking(a);rulesBlock(w,a*.6f,9);}
                case "ANSWER_REVEAL","ROUND_RESULTS","FINAL_RESULTS","COMPLETED"->reveal(w,h,a);
                default->{}
            }
        }finally{batch.setTransformMatrix(saved);batch.setColor(keep);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
    }

    // ---------------------------------------------------------------- primitives
    private final com.erni.finalanswer.ui.play.NeonFrame frame=new com.erni.finalanswer.ui.play.NeonFrame();
    private void octPlate(float x,float y,float w,float h,Color fill,Color rim,float a){
        if(a<=0||w<=8||h<=8)return;frame.clean(art.batch,x,y,w,h,fill,rim,a);
    }
    private void draw9(NinePatch n,float x,float y,float w,float h,float r,float g,float b,float al,float k){
        art.batch.setColor(r,g,b,al);if(k<1){n.scale(k,k);n.draw(art.batch,x,y,w,h);n.scale(1/k,1/k);}else n.draw(art.batch,x,y,w,h);}
    /** Kept for the reveal cards. */
    private void neonPlate(float x,float y,float w,float h,Color fill,Color rim,float a){octPlate(x,y,w,h,fill,rim,a);}
    private void circle(float cx,float cy,float r,float wd,Color c,float a){arc(cx,cy,r,0,360,wd,c,a);}
    private void arc(float cx,float cy,float r,float a0,float a1,float wd,Color c,float a){int n=Math.max(8,(int)(Math.abs(a1-a0)/10));
        for(int i=0;i<n;i++){float u=a0+(a1-a0)*i/n,v=a0+(a1-a0)*(i+1)/n;art.line(cx+MathUtils.cosDeg(u)*r,cy+MathUtils.sinDeg(u)*r,cx+MathUtils.cosDeg(v)*r,cy+MathUtils.sinDeg(v)*r,wd,c,a,false);}}

    /** Warm red light over the floor: the room stays visible, edges glow, slow embers drift up. */
    private void atmosphere(float w,float h,float a){
        art.rect(0,0,w,h,BLACK,.40f*a);
        float pulse=.5f+.5f*MathUtils.sin(clock*.9f);
        art.glow(0,h*.40f,w*.50f,h*1.1f,RED,(.20f+.05f*pulse)*a);
        art.glow(w,h*.40f,w*.50f,h*1.1f,RED,(.18f+.05f*(1-pulse))*a);
        art.glow(w/2,h*.38f,w*.75f,h*.55f,EMBER,.10f*a);
        art.glow(w/2,-30,w*1.2f,230,RED,.28f*a);
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<px.length;i++){Color c=i%2==0?EMBER:RED;float s=2.5f+3.5f*ps[i];
            art.batch.setColor(c.r,c.g,c.b,.35f*a*(.4f+.6f*MathUtils.sin(clock*2+i)));art.batch.draw(art.soft,px[i]*w-s*3,py[i]*h*.80f-s*3,s*6,s*6);}
        art.batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }

    /** Metal THINK / DIE with a red OR on a red ribbon, a drawn top hat above. */
    private void logo(float cx,float cy,float s,float a){
        if(a<=0||s<=.05f)return;
        if(art.logo!=null){ // the artwork logo (stone THINK / DIE, red OR, top hat, blood splash)
            float lw=560*s,lh=lw*art.logo.getHeight()/art.logo.getWidth(),ly=cy-12*s;
            art.glow(cx,ly,lw*1.05f,lh*1.1f,BLACK,.50f*a);
            art.batch.setColor(1,1,1,a);art.batch.draw(art.logo,cx-lw/2,ly-lh/2,lw,lh);art.batch.setColor(1,1,1,1);return;}
        float sc=.62f*s;
        String l="THINK ",m="OR",r=" DIE";float wl=art.width(art.display,l,sc),wm=art.width(art.display,m,sc*.78f),wr=art.width(art.display,r,sc),tw=wl+wm+wr,th=art.display.getLineHeight()*sc;
        art.glow(cx,cy,tw*1.1f,th*1.4f,BLACK,.55f*a);
        for(int k=0;k<5;k++){float yy=cy-th*.10f+(k-2)*th*.09f,x0=cx-tw*(.42f+.05f*(k%3)),x1=cx+tw*(.40f+.06f*((k+1)%3));art.line(x0,yy-k*2,x1,yy+6-k,th*(.05f+.02f*(k%2)),new Color(.55f+.1f*(k%2),.02f,.04f,1),.55f*a,false);}
        art.glow(cx,cy-th*.1f,tw*1.2f,th*.9f,RED,.35f*a);
        art.glow(cx,cy,tw*1.4f,th*2.2f,RED,.28f*a);
        // top hat: tapered crown with a red band and a soft highlight, curved brim with rounded ends
        float hw=th*.80f*Math.min(1,s),hx=cx,hy=cy+th*.42f;
        art.glow(hx,hy+hw*.35f,hw*2.2f,hw*1.3f,RED,.18f*a);
        for(int k=0;k<12;k++){float f=k/11f,wd=hw*(.78f-.08f*f);art.rect(hx-wd/2,hy+hw*.12f+f*hw*.62f,wd,hw*.62f/11f+1,new Color(.10f+.05f*f,.09f+.05f*f,.11f+.05f*f,1),a);}
        art.rect(hx-hw*.39f,hy+hw*.16f,hw*.78f,hw*.13f,RED,a);art.rect(hx-hw*.39f,hy+hw*.27f,hw*.78f,2,new Color(1f,.55f,.55f,1),a*.6f);
        art.rect(hx-hw*.20f,hy+hw*.32f,hw*.06f,hw*.38f,new Color(1,1,1,1),.10f*a);
        art.line(hx-hw*.82f,hy+hw*.13f,hx+hw*.82f,hy+hw*.13f,hw*.14f,new Color(.08f,.07f,.08f,1),a,false);
        circle(hx-hw*.82f,hy+hw*.15f,hw*.035f,hw*.07f,new Color(.08f,.07f,.08f,1),a);circle(hx+hw*.82f,hy+hw*.15f,hw*.035f,hw*.07f,new Color(.08f,.07f,.08f,1),a);
        // letters: dark bevel, steel body, light top edge (sheared like the mock-up)
        float x=cx-tw/2,y=cy+th*.36f;
        italic(x+tw/2,cy,.20f);
        metal(art.display,l,x,y,sc,a);
        art.glow(x+wl+wm/2,cy,wm*1.8f,th*1.2f,RED,.45f*a);art.left(art.display,m,x+wl,y-th*.08f,sc*.78f,new Color(1f,.16f,.20f,1),a,0);
        art.display.getData().setScale(sc*.78f);art.display.setColor(1f,.75f,.75f,.35f*a);art.display.draw(art.batch,m,x+wl,y-th*.08f+1.5f);art.display.getData().setScale(1);
        metal(art.display,r,x+wl+wm,y,sc,a);
        art.batch.setTransformMatrix(saved);
    }
    private void metal(BitmapFont f,String s,float x,float y,float sc,float a){
        art.left(f,s,x+2,y-3,sc,new Color(.20f,.18f,.19f,1),a,0);
        art.left(f,s,x,y,sc,new Color(.70f,.69f,.72f,1),a,0);
        art.batch.setColor(1,1,1,1);
        f.getData().setScale(sc);f.setColor(1,1,1,.45f*a);f.draw(art.batch,s,x,y+1.5f);f.getData().setScale(1);
    }
    private void italic(float ox,float oy,float k){shear.set(saved).translate(ox,oy,0);Matrix4 m=new Matrix4();m.val[Matrix4.M01]=k;shear.mul(m).translate(-ox,-oy,0);art.batch.setTransformMatrix(shear);}

    private String categoryText(){return tod.has("textRu")?("ru".equals(lang)?tod.get("textRu").getAsString():tod.get("textEn").getAsString()):"";}
    /** The category plate: cut corners, double red rim, rivets, a CATEGORY tab, sheared serif text. */
    private void categoryPlate(float w,float a,String text,float zoom,boolean muted){
        if(a<=0)return;float z=Math.max(.05f,zoom),cx=800,cy=407,pw=900*z,ph=172*z;
        if(art.plate!=null){ // the artwork plate (bronze frame, red glow, CATEGORY tab); the category text goes inside
            float W=920*z,H=W*art.plate.getHeight()/art.plate.getWidth(),top=411.5f+H/2;
            art.batch.setColor(1,1,1,a);art.batch.draw(art.plate,800-W/2,top-H,W,H);art.batch.setColor(1,1,1,1);
            if(z<.7f)return;
            float boxW=W*.84f,boxTop=top-H*.29f,boxBot=top-H*.87f,maxH=boxTop-boxBot,sc=.92f;
            for(int i=0;i<10;i++){serif.getData().setScale(sc);gl.setText(serif,text,METAL,boxW,Align.center,true);if(gl.height<=maxH)break;sc*=.9f;}
            float ty=(boxTop+boxBot)/2+gl.height/2;
            italic(800,(boxTop+boxBot)/2,.12f);
            serif.setColor(0,0,0,.85f*a);serif.draw(art.batch,text,800-boxW/2+3,ty-3,boxW,Align.center,true);
            serif.setColor(muted?DIM.r:METAL.r,muted?DIM.g:METAL.g,muted?DIM.b:METAL.b,a);serif.draw(art.batch,text,800-boxW/2,ty,boxW,Align.center,true);
            serif.getData().setScale(1);art.batch.setTransformMatrix(saved);return;}
        art.glow(cx,cy,pw*1.15f,ph*1.6f,RED,.22f*a);frame.bronze(art.batch,cx-pw/2,cy-ph/2,pw,ph,new Color(.07f,.035f,.035f,.97f),RED,a);
        if(z<.7f)return;
        float tabW=280,tabH=40,ty=cy+ph/2-tabH/2+4;
        tabW=250;tabH=40;frame.bronze(art.batch,cx-tabW/2,ty-tabH/2,tabW,tabH,new Color(.42f,.04f,.06f,1),new Color(1f,.35f,.30f,1),a);
        art.text(art.tiny,spaced(tr("КАТЕГОРИЯ","CATEGORY")),cx,ty+9,.95f,new Color(1f,.86f,.70f,1),a,0);
        // sheared serif category text, shrunk until it fits
        float boxW=pw-110,maxH=ph-64,sc=.92f;
        for(int i=0;i<10;i++){serif.getData().setScale(sc);gl.setText(serif,text,METAL,boxW,Align.center,true);if(gl.height<=maxH)break;sc*=.9f;}
        float top=cy-14+gl.height/2;
        italic(cx,cy,.16f);
        serif.setColor(0,0,0,.85f*a);serif.draw(art.batch,text,cx-boxW/2+3,top-3,boxW,Align.center,true);
        serif.setColor(muted?DIM.r:METAL.r,muted?DIM.g:METAL.g,muted?DIM.b:METAL.b,a);serif.draw(art.batch,text,cx-boxW/2,top,boxW,Align.center,true);
        serif.getData().setScale(1);art.batch.setTransformMatrix(saved);
    }
    private static String spaced(String s){StringBuilder b=new StringBuilder();for(int i=0;i<s.length();i++){if(i>0)b.append(' ');b.append(s.charAt(i));}return b.toString();}

    /** Stopwatch timer: steel case and crown, red tick track for the remaining time, digital mm:ss. */
    private void stopwatch(float a){
        float total=Math.max(1,ms("answerMs")/1000f),rem=left(),frac=MathUtils.clamp(rem/total,0,1);
        boolean hot=rem<=5;float k=hot?(5-rem)/5:0,beat=hot?.5f+.5f*MathUtils.sin(clock*(8+6*k)):0;
        float cx=1402,cy=393,r=112*(1+(hot?.025f*beat*k:0));
        art.glow(cx,cy,r*3.0f,r*3.0f,RED,(.18f+.30f*k*beat)*a);
        // crown and side button
        art.rect(cx-12,cy+r+6,24,24,STEEL,a);art.rect(cx-20,cy+r+28,40,10,new Color(.75f,.73f,.74f,1),a);
        art.line(cx+MathUtils.cosDeg(45)*(r+4),cy+MathUtils.sinDeg(45)*(r+4),cx+MathUtils.cosDeg(45)*(r+22),cy+MathUtils.sinDeg(45)*(r+22),14,STEEL,a,false);
        art.batch.setColor(.04f,.01f,.01f,.96f*a);art.batch.draw(art.soft,cx-r*1.25f,cy-r*1.25f,r*2.5f,r*2.5f);
        circle(cx,cy,r+6,12,new Color(.36f,.34f,.36f,1),a);circle(cx,cy,r+12,3,new Color(.80f,.78f,.80f,1),a*.8f);circle(cx,cy,r-2,3,new Color(.12f,.10f,.10f,1),a);
        int ticks=60;for(int i=0;i<ticks;i++){float f=i/(float)ticks,ang=90-360*f;boolean on=f<frac;float r0=r-30,r1=r-12-(i%5==0?0:4);
            art.line(cx+MathUtils.cosDeg(ang)*r0,cy+MathUtils.sinDeg(ang)*r0,cx+MathUtils.cosDeg(ang)*r1,cy+MathUtils.sinDeg(ang)*r1,i%5==0?5:3.4f,on?RED:new Color(.25f,.05f,.06f,1),on?a:a*.8f,on);}
        int s=(int)Math.ceil(rem);String t=String.format(Locale.ROOT,"%02d:%02d",s/60,s%60);
        float sc=.40f*(hot?1+.06f*beat:1);
        art.glow(cx,cy,r*1.5f,r*.8f,RED,.25f*a);
        art.text(art.display,t,cx,cy+art.display.getLineHeight()*sc*.36f,sc,hot?new Color(1f,.30f,.30f,1):new Color(1f,.90f,.86f,1),a,r*1.5f);
    }
    /** Last five seconds: a soft red pulse grows from the screen edges. */
    private void edgePulse(float w,float h,float a){
        float rem=left();if(rem>5)return;float k=(5-rem)/5,beat=.5f+.5f*MathUtils.sin(clock*(7+7*k));float al=(.10f+.32f*k)*(.55f+.45f*beat)*a;
        art.glow(w/2,0,w*1.4f,220+120*k,RED,al);art.glow(w/2,h,w*1.4f,220+120*k,RED,al);
        art.glow(0,h/2,260+140*k,h*1.4f,RED,al);art.glow(w,h/2,260+140*k,h*1.4f,RED,al);
    }
    private void checking(float a){
        float cx=1402,cy=393;
        for(int i=0;i<12;i++){float ang=-clock*240+i*30;float al=(i/12f)*a;
            art.line(cx+MathUtils.cosDeg(ang)*60,cy+MathUtils.sinDeg(ang)*60,cx+MathUtils.cosDeg(ang)*92,cy+MathUtils.sinDeg(ang)*92,7,RED,al,true);}
        art.text(art.small,tr("ПРОВЕРКА","CHECKING"),cx,cy-122,.9f,METAL,a,0);
    }

    /** Three rule cards with drawn icons, the ghost rule and the four soul badges (values from the server config). */
    private void rulesBlock(float w,float a,float t){
        if(a<=0)return;
        float sec=Math.round(ms("answerMs")/1000f);
        String[] txt={tr("ОДНА КАТЕГОРИЯ\nДЛЯ ВСЕХ","ONE CATEGORY\nFOR EVERYONE"),tr((int)sec+" СЕКУНД\nОТВЕЧАЙ С ТЕЛЕФОНА",(int)sec+" SECONDS\nANSWER ON YOUR PHONE"),tr("ПИШИ ВЕРНЫЕ ОТВЕТЫ\nКАК МОЖНО БОЛЬШЕ","WRITE CORRECT ANSWERS\nAS MANY AS YOU CAN")};
        float[][] box={{350,219,315,73},{690,219,250,73},{965,219,285,73}};
        if(art.rules!=null){ // the artwork rules bar (icons and dividers baked in); the three texts go next to the icons
            float d0=MathUtils.clamp(t/.3f,0,1),W=940,H=W*art.rules.getHeight()/art.rules.getWidth(),cy=258;
            if(d0>0){art.batch.setColor(1,1,1,a*d0);art.batch.draw(art.rules,800-W/2,cy-H/2,W,H);art.batch.setColor(1,1,1,1);}
            float[][] col={{535,180},{826,208},{1133,208}};
            for(int i=0;i<3;i++){float d=MathUtils.clamp((t-i*.15f)/.3f,0,1);if(d<=0)continue;String[] ln=txt[i].split("\n");
                art.text(art.tiny,ln[0],col[i][0],cy+18,.82f,METAL,a*d,col[i][1]);art.text(art.tiny,ln[1],col[i][0],cy-6,.78f,METAL,a*d,col[i][1]);}
        }else{
        {float d0=MathUtils.clamp(t/.3f,0,1);if(d0>0){frame.bronze(art.batch,340,214,920,84,new Color(.06f,.03f,.03f,.93f),new Color(.55f,.30f,.15f,1),a*d0);
            for(float dx:new float[]{677,957}){art.rect(dx-1,228,2,56,new Color(.75f,.52f,.28f,1),.8f*a*d0);}}}
        for(int i=0;i<3;i++){float d=MathUtils.clamp((t-i*.15f)/.3f,0,1);if(d<=0)continue;float[] b=box[i];
            float ix=b[0]+46,iy=b[1]+b[3]/2;icon(i,ix,iy,a*d);
            String[] ln=txt[i].split("\n");float tx=b[0]+84+(b[2]-96)/2;
            art.text(art.tiny,ln[0],tx,iy+18,.82f,METAL,a*d,b[2]-100);art.text(art.tiny,ln[1],tx,iy-4,.82f,METAL,a*d,b[2]-100);}
        }
        float d=MathUtils.clamp((t-.5f)/.3f,0,1);
        if(d>0){art.rect(470,184,140,2,RED,a*d*.8f);art.rect(990,184,140,2,RED,a*d*.8f);circle(612,185,3,3,RED,a*d);circle(988,185,3,3,RED,a*d);
            art.text(art.small,tr("ПРИЗРАК ОЖИВАЕТ:","THE GHOST AWAKES:"),800,197,.95f,RED,a*d,0);
            art.text(art.tiny,tr("ПЯТЬ УНИКАЛЬНЫХ ВЕРНЫХ ОТВЕТОВ ЗА РАУНД, И ОН ВОЗВРАЩАЕТСЯ!","FIVE UNIQUE CORRECT ANSWERS IN A ROUND, AND THEY RETURN!"),800,160,.85f,METAL,a*d,900);}
        Object[][] badges={{"+"+points("unique",200),tr("ТОЛЬКО ТЫ","ONLY YOU"),GOLD},{"+"+points("two",100),tr("У ДВОИХ","TWO PLAYERS"),GREEN},
            {"+"+points("three",25),tr("У ТРОИХ","THREE PLAYERS"),BLUE},{String.valueOf(points("crowd",0)),tr("4+ ИЛИ ОШИБКА","FOUR+ OR WRONG"),RED}};
        float[] cxs={435,677,923,1166};
        for(int i=0;i<4;i++){float e=MathUtils.clamp((t-.7f-i*.12f)/.3f,0,1);if(e<=0)continue;Color c=(Color)badges[i][2];float bw=210,bh=77,bx=cxs[i]-bw/2,by=43;
            art.glow(cxs[i],by+bh/2,bw*1.25f,bh*1.8f,c,.30f*a*e);
            frame.bronze(art.batch,bx,by,bw,bh,new Color(c.r*.50f,c.g*.50f,c.b*.50f,1),new Color(Math.min(1,c.r*1.25f+.15f),Math.min(1,c.g*1.25f+.15f),Math.min(1,c.b*1.25f+.15f),1),a*e);
            Color lc=new Color(Math.min(1,c.r*.6f+.4f),Math.min(1,c.g*.6f+.4f),Math.min(1,c.b*.6f+.3f),1);
            frame.laurel(art.batch,bx+34,by+bh/2,24,-1,lc,a*e*.9f);frame.laurel(art.batch,bx+bw-34,by+bh/2,24,1,lc,a*e*.9f);
            art.text(art.big,(String)badges[i][0],cxs[i],by+bh-10,.58f,METAL,a*e,bw-30);
            art.text(art.tiny,(String)badges[i][1],cxs[i],by+24,.82f,METAL,a*e,bw-30);}
    }
    /** Drawn icons: 0 people, 1 stopwatch, 2 stacked layers. */
    private void icon(int kind,float cx,float cy,float a){
        Color c=GOLD;
        switch(kind){
            case 0->{for(int k=-1;k<=1;k++){float ox=k*15,s=k==0?1f:.8f,oy=k==0?2:0;circle(cx+ox,cy+8*s+oy,6*s,2.6f,c,a);arc(cx+ox,cy-10*s+oy,12*s,20,160,2.6f,c,a);}}
            case 1->{circle(cx,cy-2,15,2.8f,c,a);art.rect(cx-4,cy+15,8,5,c,a);art.line(cx,cy-2,cx,cy+8,2.6f,c,a,false);art.line(cx,cy-2,cx+7,cy-6,2.6f,c,a,false);}
            default->{for(int k=0;k<3;k++){float y=cy-10+k*9;art.line(cx-16,y,cx,y+7,2.6f,c,a,false);art.line(cx,y+7,cx+16,y,2.6f,c,a,false);art.line(cx+16,y,cx,y-7,2.6f,c,a,false);art.line(cx,y-7,cx-16,y,2.6f,c,a,false);}}
        }
    }

    // ---------------------------------------------------------------- reveal
    private Color statusColor(String st){return switch(st){case "UNIQUE"->GOLD;case "SHARED"->GREEN;case "MANY"->ORANGE;case "CROWD","INVALID","REJECTED"->RED;default->GREY;};}
    private String statusName(String st){return switch(st){case "UNIQUE"->tr("УНИКАЛЬНО","UNIQUE");case "SHARED"->tr("У ДВОИХ","TWO PLAYERS");case "MANY"->tr("У ТРОИХ","THREE PLAYERS");
        case "CROWD"->tr("У ВСЕХ","EVERYONE");case "INVALID"->tr("НЕВЕРНО","WRONG");case "REJECTED"->tr("ОТКЛОНЕНО","REJECTED");default->tr("СПОРНО","UNDECIDED");};}

    private void reveal(float w,float h,float a){
        JsonArray rv=tod.has("reveal")?tod.getAsJsonArray("reveal"):new JsonArray();
        boolean results=!phase.equals("ANSWER_REVEAL");
        float t=phase.equals("ANSWER_REVEAL")?since():6+since();
        float top=h-205,bottom=results?250:118,left=60,right=w-60,gap=14;
        int n=rv.size();
        if(n==0){art.text(art.big,tr("НИКТО НЕ ОТВЕТИЛ","NO ANSWERS"),w/2,h*.5f,.8f,METAL,a,0);}
        else{
            int cols=n<=2?n:n<=6?3:n<=12?4:n<=20?5:6;int rowsFit=Math.max(1,(int)((top-bottom+gap)/(62+gap)));
            int perPage=cols*rowsFit,pages=(n+perPage-1)/perPage;float pageLen=6f/pages;
            int page=Math.min(pages-1,(int)(Math.min(t,5.99f)/pageLen));if(results)page=0;
            int from=page*perPage,count=Math.min(perPage,n-from);int rows=(count+cols-1)/cols;
            float cw=(right-left-(cols-1)*gap)/cols,ch=Math.min(104,(top-bottom-(rows-1)*gap)/rows);
            float blockH=rows*ch+(rows-1)*gap,y0=(top+bottom)/2+blockH/2;
            float pageT=results?9:t-page*pageLen;
            for(int i=0;i<count;i++){JsonObject c=rv.get(from+i).getAsJsonObject();
                int r=i/cols,col=i%cols;float d=MathUtils.clamp((pageT-i*.035f)/.28f,0,1);if(d<=0)continue;
                float e=Interpolation.swingOut.apply(d),x=left+col*(cw+gap),y=y0-(r+1)*ch-r*gap;
                float sw=cw*(.85f+.15f*e),sh=ch*(.85f+.15f*e);
                card(c,x+(cw-sw)/2,y+(ch-sh)/2,sw,sh,a*d*(results?.55f:1));}
            if(pages>1&&!results)art.text(art.tiny,(page+1)+" / "+pages,w/2,bottom-14,.9f,DIM,a,0);
        }
        if(results)soulsBanner(w,h,a);
    }
    private void card(JsonObject c,float x,float y,float w,float h,float a){
        String st=c.get("status").getAsString();Color col=statusColor(st);boolean wrong=st.equals("INVALID")||st.equals("REJECTED");
        neonPlate(x,y,w,h,CARD,col,a);
        art.rect(x+10,y+10,5,h-20,col,a);
        int pts=c.get("points").getAsInt();String souls=wrong||st.equals("UNCERTAIN")?"":(pts>0?"+"+pts:"0");
        float soulsW=souls.isEmpty()?0:art.width(art.mid,souls,.62f)+18;
        String label=c.get("label").getAsString();float textScale=Math.min(.62f,(h-30)/art.mid.getLineHeight()*1.1f);
        float lx=x+28,ly=y+h-16,maxW=w-56-soulsW;
        art.left(art.mid,label,lx,ly,textScale,wrong?DIM:METAL,a,maxW);
        if(wrong){float lw=Math.min(maxW,art.width(art.mid,label,textScale));art.rect(lx-4,ly-art.mid.getLineHeight()*textScale*.38f,lw+8,3,RED,a);}
        if(!souls.isEmpty())art.right(art.mid,souls,x+w-16,y+h/2+art.mid.getLineHeight()*.62f*.32f,.62f,pts>0?col:DIM,a);
        // the players who gave it: small overlapping faces, then the status word
        JsonArray who=c.has("players")?c.getAsJsonArray("players"):new JsonArray();float fr=Math.min(14,h*.16f),fx=lx+fr,fy=y+fr+10;
        if(h>=60){for(int i=0;i<who.size()&&i<8;i++){String id=who.get(i).getAsString();art.portrait(character.getOrDefault(id,""),fx+i*fr*1.45f,fy,fr,com.erni.finalanswer.ui.PlayerColors.light(character.getOrDefault(id,"")),false,a);}
            art.left(art.tiny,statusName(st),fx+Math.min(8,who.size())*fr*1.45f+6,fy+8,.72f,col,a,0);}
    }
    private void soulsBanner(float w,float h,float a){
        float t=since(),k=Math.min(1,t/.3f);
        boolean revived=false;if(tod.has("players"))for(JsonElement e:tod.getAsJsonArray("players")){var p=e.getAsJsonObject();if(p.has("roundResurrected")&&p.get("roundResurrected").getAsBoolean())revived=true;}
        float cy=150;neonPlate(w/2-360,cy-52,720,104,CARD,GOLD,a*k);
        art.text(art.big,tr("ДУШИ НАЧИСЛЕНЫ","SOULS AWARDED"),w/2,cy+24,.7f,GOLD,a*k,660);
        if(revived){float r=Math.min(1,Math.max(0,(t-.35f)/.3f));float beat=.5f+.5f*MathUtils.sin(clock*9);
            art.rect(0,0,w,h-190,BLACK,.45f*a*r);
            octPlate(w/2-560,h*.47f-70,1120,140,new Color(.10f,.03f,.16f,.96f),VIOLET,a*r);
            art.glow(w/2,h*.47f,1100,320,VIOLET,(.35f+.2f*beat)*a*r);
            art.text(art.display,"RESURRECTION",w/2,h*.47f+40,.62f,METAL,a*r,1200);}
    }
    @Override public void dispose(){art.dispose();frame.dispose();serif.dispose();octFill.dispose();octEdge.dispose();}
}
