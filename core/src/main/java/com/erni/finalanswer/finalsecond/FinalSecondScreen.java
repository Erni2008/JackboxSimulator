package com.erni.finalanswer.finalsecond;

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
 * THE FINAL SECOND on the host's shared screen, driven entirely by the room server's snapshot and clock:
 * the machine powers up, the target is shown, the display counts 3·2·1, the timer runs (visible for three seconds,
 * then dark), each player's STOP thumps the big button (never revealing the time), then results are revealed one by
 * one from the worst to the best on the machine's own display — the eliminated player is swallowed by a malfunction —
 * and a final ranking. ENTER/ESC on the ranking returns to the lobby.
 */
public final class FinalSecondScreen extends ScreenAdapter {
    private final OrthographicCamera cam=new OrthographicCamera();private final FitViewport vp=new FitViewport(1920,1080,cam);
    private SpriteBatch batch;private FinalSecondScene scene;private BitmapFont title,body;private Texture soft,pixel;private final GlyphLayout gl=new GlyphLayout();
    private final Map<String,Texture> faces=new HashMap<>();
    private JsonObject state;private JsonObject fs;private final LongSupplier serverNow;private final Consumer<String> onEnd;
    private int lastStops;private String lastPhase="";private int lastReveal=-1;private boolean created;
    static final Color GOLD=new Color(.93f,.80f,.53f,1),IVORY=new Color(.96f,.91f,.82f,1),DIM=new Color(.62f,.54f,.44f,1),RED=new Color(1f,.24f,.18f,1);

    public FinalSecondScreen(JsonObject snapshot,LongSupplier serverNow,Consumer<String> onEnd){this.serverNow=serverNow;this.onEnd=onEnd;apply(snapshot);}
    public String session(){return fs.get("sessionId").getAsString();}
    public String phase(){return fs.get("phase").getAsString();}
    public void apply(JsonObject snapshot){if(!snapshot.has("finalSecond"))return;state=snapshot;fs=snapshot.getAsJsonObject("finalSecond");}

    @Override public void show(){
        if(!created){created=true;batch=new SpriteBatch();scene=new FinalSecondScene();title=com.erni.finalanswer.ui.UiFonts.gothic(72);body=com.erni.finalanswer.ui.UiFonts.gothic(40);
            soft=radial();Pixmap p=new Pixmap(1,1,Pixmap.Format.RGBA8888);p.setColor(Color.WHITE);p.fill();pixel=new Texture(p);p.dispose();}
        Gdx.input.setInputProcessor(new InputAdapter(){@Override public boolean keyDown(int k){
            if((k==Input.Keys.ENTER||k==Input.Keys.ESCAPE)&&phase().equals("RESULTS")){onEnd.accept(session());return true;}return false;}});
    }
    @Override public void resize(int w,int h){vp.update(w,h,true);}

    private long now(){return serverNow.getAsLong();}
    private float since(String key){return Math.max(0,(now()-fs.get(key).getAsLong())/1000f);}
    private long l(String k){return fs.get(k).getAsLong();}
    private List<String> list(String k){List<String> o=new ArrayList<>();if(fs.has(k))for(var e:fs.getAsJsonArray(k))o.add(e.getAsString());return o;}
    private String name(String id){for(var e:state.getAsJsonArray("players")){var o=e.getAsJsonObject();if(o.get("id").getAsString().equals(id))return o.get("name").getAsString();}return "?";}
    private String character(String id){for(var e:state.getAsJsonArray("players")){var o=e.getAsJsonObject();if(o.get("id").getAsString().equals(id)&&o.has("characterId"))return o.get("characterId").getAsString();}return "";}
    static String fmt(long ms){long cs=Math.max(0,Math.min(9999,Math.round(ms/10.0)));return String.format("%02d,%02d",cs/100,cs%100);}

    @Override public void render(float dt){
        String phase=phase();if(!phase.equals(lastPhase)){lastPhase=phase;lastReveal=-1;}
        int stops=list("stopped").size();if(stops>lastStops&&phase.equals("RUNNING"))scene.press();lastStops=stops;
        scene.update(dt);
        String target=fmt(l("targetMs"));String shown=null;scene.rawDigits=null;scene.displayFlicker=1;float t=since("phaseStartedAt");
        switch(phase){
            case "COUNTDOWN"->{int n=Math.max(1,3-(int)t);scene.rawDigits="  "+n+" ";scene.rawComma=false;scene.displayFlicker=1-.6f*Math.max(0,(t%1)-.75f)*4;}
            case "RUNNING"->{long el=now()-l("runStart");if(el<l("visibleMs"))shown=fmt(el);}
            case "REVEAL"->shown=revealDisplay(t);
            case "RESULTS"->scene.rawDigits="----";
            default->{}
        }
        ScreenUtils.clear(0,0,0,1);vp.apply();batch.setProjectionMatrix(cam.combined);batch.begin();
        scene.draw(batch,target,shown,phase.equals("RUNNING")?.06f:.12f);
        switch(phase){
            case "INTRO"->intro(t);
            case "TARGET"->banner("ОСТАНОВИ ТАЙМЕР ТОЧНО НА "+target+" С","ПОСЛЕ ТРЁХ СЕКУНД ЦИФРЫ ПОГАСНУТ",t);
            case "COUNTDOWN"->banner("ПРИГОТОВЬТЕСЬ","КНОПКА «СТОП» — НА ВАШИХ ТЕЛЕФОНАХ",t);
            case "RUNNING"->players(false);
            case "REVEAL"->reveal(t);
            case "RESULTS"->results(t);
            default->{}
        }
        batch.end();
    }

    // ---------- overlays ----------
    private void intro(float t){
        float a=1-ease(t/1.6f);if(a>0){batch.setColor(0,0,0,a);batch.draw(pixel,0,0,1920,1080);}
        float k=ease((t-.4f)/.8f)*(1-ease((t-2.4f)/.6f));banner("THE FINAL SECOND","ПОСЛЕДНЯЯ СЕКУНДА",k<=0?-1:t);
    }
    private void banner(String a,String b,float t){
        if(t<0)return;float k=ease(t/.5f);
        batch.setColor(0,0,0,.72f*k);batch.draw(soft,960-760,-80,1520,300);batch.setColor(Color.WHITE);
        text(title,a,960,128,.72f,IVORY,k);text(body,b,960,64,.62f,DIM,k*ease((t-.25f)/.4f));
    }
    /** Player plaques along the bottom: a red lamp lights when that player has stopped — never their time. */
    private void players(boolean all){
        List<String> seats=list("seats"),stopped=list("stopped");int n=seats.size();float w=Math.min(220,1700f/n-16),gap=16,x0=960-(n*w+(n-1)*gap)/2,y=28;
        batch.setColor(0,0,0,.6f);batch.draw(soft,960-(n*w)*.7f,-120,n*w*1.4f,300);
        for(int i=0;i<n;i++){String id=seats.get(i);boolean on=stopped.contains(id);float x=x0+i*(w+gap);
            batch.setColor(.06f,.035f,.035f,.92f);batch.draw(pixel,x,y,w,60);batch.setColor(GOLD.r,GOLD.g,GOLD.b,on?.9f:.35f);
            batch.draw(pixel,x,y,w,2);batch.draw(pixel,x,y+58,w,2);batch.draw(pixel,x,y,2,60);batch.draw(pixel,x+w-2,y,2,60);
            float lx=x+26,ly=y+30;batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1f,.15f,.1f,on?.9f:.12f);batch.draw(soft,lx-18,ly-18,36,36);
            batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.setColor(on?1:.3f,on?.25f:.08f,on?.2f:.06f,1);batch.draw(soft,lx-7,ly-7,14,14);
            body.getData().setScale(.55f);body.setColor(on?IVORY:DIM);gl.setText(body,name(id),body.getColor(),w-56,com.badlogic.gdx.utils.Align.left,false);body.draw(batch,gl,x+48,y+42);body.getData().setScale(1);}
        batch.setColor(Color.WHITE);
        text(body,stopped.size()+" / "+n+"  ОСТАНОВИЛИ",960,1060-1000,.5f,DIM,0);
    }
    private List<JsonObject> rows(){List<JsonObject> r=new ArrayList<>();for(var e:fs.getAsJsonArray("results"))r.add(e.getAsJsonObject());return r;}
    /** Reveal order: worst first, best last. */
    private int revealIndex(float t){float intro=l("revealIntroMs")/1000f,step=l("revealStepMs")/1000f;if(t<intro)return -1;return Math.min(rows().size()-1,(int)((t-intro)/step));}
    private String revealDisplay(float t){
        int i=revealIndex(t);if(i<0)return null;var rs=rows();var r=rs.get(rs.size()-1-i);
        float step=l("revealStepMs")/1000f,u=((t-l("revealIntroMs")/1000f)-i*step)/step;
        if(i!=lastReveal){lastReveal=i;scene.press();}
        if(!r.get("stopped").getAsBoolean()){scene.rawDigits="----";scene.rawComma=false;return null;}
        if(r.get("eliminated").getAsBoolean()&&u>.55f){ // malfunction: the display glitches, then swallows the player
            float g=(u-.55f)/.45f;scene.displayFlicker=MathUtils.random()<.35f+.4f*g?.15f:1;if(g>.6f){scene.rawDigits="Err ";scene.rawComma=false;}return fmt(r.get("stoppedMs").getAsLong());}
        return fmt(r.get("stoppedMs").getAsLong());
    }
    private void reveal(float t){
        float intro=l("revealIntroMs")/1000f,step=l("revealStepMs")/1000f;
        if(t<intro){banner("КТО БЫЛ ТОЧНЕЕ?","РЕЗУЛЬТАТЫ — ОТ ХУДШЕГО К ЛУЧШЕМУ",t);return;}
        int i=revealIndex(t);var rs=rows();var r=rs.get(rs.size()-1-i);float u=((t-intro)-i*step)/step;
        boolean dead=r.get("eliminated").getAsBoolean();String id=r.get("playerId").getAsString();
        float k=ease(u/.15f),pull=dead?ease((u-.6f)/.35f):0;
        // character card at the bottom: portrait, name, stopped at, error
        float cx=960,y=40;batch.setColor(0,0,0,.75f*k);batch.draw(soft,cx-700,-100,1400,330);
        Texture face=face(character(id));
        if(face!=null){float s=150*(1-pull*.8f),fx=cx-470+(pull*470),fy=y+6+pull*560;batch.setColor(1,1,1,k*(1-pull));batch.draw(face,fx-s/2,fy,s,s);}
        text(title,name(id),cx-200,y+170,.7f,dead?RED:IVORY,k);
        String line=r.get("stopped").getAsBoolean()?"ОСТАНОВИЛ НА "+fmt(r.get("stoppedMs").getAsLong())+" С   ·   ОШИБКА "+fmt(r.get("errorMs").getAsLong())+" С":"НЕ НАЖАЛ";
        text(body,line,cx-200,y+92,.6f,GOLD,k*ease((u-.12f)/.2f));
        text(body,"МЕСТО "+r.get("rank").getAsInt()+(dead?"   ·   МАШИНА ЗАБИРАЕТ ИГРОКА":""),cx-200,y+40,.5f,dead?RED:DIM,k*ease((u-.2f)/.2f));
        if(dead&&u>.55f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1f,.08f,.05f,.18f*MathUtils.random());batch.draw(pixel,0,0,1920,1080);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        batch.setColor(Color.WHITE);
    }
    private void results(float t){
        var rs=rows();float a=ease(t/.5f);batch.setColor(0,0,0,.7f*a);batch.draw(pixel,0,0,1920,1080);batch.setColor(Color.WHITE);
        text(title,"THE FINAL SECOND",960,1000,.9f,GOLD,a);text(body,"ИТОГИ  ·  ЦЕЛЬ "+fmt(l("targetMs"))+" С",960,930,.6f,IVORY,a);
        float rowH=Math.min(92,640f/rs.size()),top=860;
        for(int i=0;i<rs.size();i++){var r=rs.get(i);float ra=ease((t-.4f-i*.18f)/.4f);if(ra<=0)continue;float y=top-(i+1)*rowH;boolean dead=r.get("eliminated").getAsBoolean();
            batch.setColor(dead?.16f:.07f,.04f,.04f,.9f*ra);batch.draw(pixel,440,y+6,1040,rowH-12);batch.setColor(GOLD.r,GOLD.g,GOLD.b,(i==0?.9f:.35f)*ra);batch.draw(pixel,440,y+6,1040,2);batch.draw(pixel,440,y+rowH-8,1040,2);
            Texture face=face(character(r.get("playerId").getAsString()));if(face!=null){batch.setColor(1,1,1,ra*(dead?.5f:1));batch.draw(face,530,y+12,rowH-24,rowH-24);}
            text(title,String.valueOf(r.get("rank").getAsInt()),480,y+rowH*.72f,.6f,i==0?GOLD:IVORY,ra);
            body.getData().setScale(.7f);body.setColor(dead?RED.r:IVORY.r,dead?RED.g:IVORY.g,dead?RED.b:IVORY.b,ra);body.draw(batch,name(r.get("playerId").getAsString())+(dead?"  — ВЫБЫЛ":""),530+rowH,y+rowH*.66f);body.getData().setScale(1);
            String right=r.get("stopped").getAsBoolean()?fmt(r.get("stoppedMs").getAsLong())+" С   ±"+fmt(r.get("errorMs").getAsLong()):"НЕ НАЖАЛ";
            body.getData().setScale(.6f);gl.setText(body,right);body.setColor(GOLD.r,GOLD.g,GOLD.b,ra);body.draw(batch,right,1450-gl.width,y+rowH*.64f);body.getData().setScale(1);}
        batch.setColor(Color.WHITE);if(t>2)text(body,"ENTER — ВЕРНУТЬСЯ В ЛОББИ",960,40,.5f,DIM,ease((t-2)/.5f));
    }

    private Texture face(String character){
        if(character==null||character.isEmpty())return null;return faces.computeIfAbsent(character,c->{var f=Gdx.files.internal("forgotten_room/portraits/"+c+".png");return f.exists()?new Texture(f,true):null;});
    }
    private void text(BitmapFont f,String s,float cx,float y,float scale,Color c,float a){if(a<=0)return;f.getData().setScale(scale);gl.setText(f,s);float x=cx-gl.width/2;f.setColor(0,0,0,.7f*a);f.draw(batch,s,x+2,y-2);f.setColor(c.r,c.g,c.b,a);f.draw(batch,s,x,y);f.getData().setScale(1);}
    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
    private static Texture radial(){int n=128;Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float d=(float)Math.hypot(x-c,y-c)/c;float a=d>=1?0:(1-d);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}Texture t=new Texture(p);p.dispose();return t;}
    @Override public void dispose(){if(!created)return;batch.dispose();scene.dispose();title.dispose();body.dispose();soft.dispose();pixel.dispose();for(Texture t:faces.values())if(t!=null)t.dispose();}
}
