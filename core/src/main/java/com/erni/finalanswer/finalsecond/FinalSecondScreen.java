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

    /** Target as players read it: "7,00" (no leading zero). */
    static String target(long ms){long cs=Math.round(ms/10.0);return (cs/100)+","+String.format("%02d",cs%100);}

    @Override public void render(float dt){
        String phase=phase();if(!phase.equals(lastPhase)){lastPhase=phase;lastReveal=-1;}
        int stops=list("stopped").size();if(stops>lastStops&&phase.equals("RUNNING")){scene.press();for(String id:list("stopped"))lit.putIfAbsent(id,0f);}lastStops=stops;
        for(var e:lit.entrySet())e.setValue(Math.min(1,e.getValue()+dt*2.5f));
        scene.update(dt);clock+=dt;
        String tgt=target(l("targetMs"));String shown=null;scene.rawDigits=null;scene.displayFlicker=1;scene.power=1;float t=since("phaseStartedAt");
        switch(phase){
            case "INTRO"->{ // power-up: dark → lamps stutter on → segment self-test
                scene.power=ease((t-.2f)/1.3f);scene.plaque("ДОБРО ПОЖАЛОВАТЬ В","THE FINAL SECOND",false);
                if(t>1.5f&&t<2.4f){scene.rawDigits="8888";scene.rawComma=true;scene.displayFlicker=((int)(t*14))%2==0?1:.4f;}}
            case "TARGET"->scene.plaque("ОСТАНОВИ ТАЙМЕР НА",typewriter(tgt+" СЕКУНД",t),true);
            case "COUNTDOWN"->{int n=Math.max(1,3-(int)t);float f=t%1;scene.rawDigits="  "+n+" ";scene.rawComma=false;scene.displayFlicker=f>.82f?.25f:1;
                scene.plaque("ОСТАНОВИ ТАЙМЕР НА",tgt+" СЕКУНД",true);}
            case "RUNNING"->{long el=now()-l("runStart");long vis=l("visibleMs");scene.plaque("ОСТАНОВИ ТАЙМЕР НА",tgt+" СЕКУНД",true);
                if(el<vis)shown=fmt(el);
                else if(el<vis+420){shown=fmt(vis);scene.displayFlicker=MathUtils.random()<.55f?.08f:.9f;}}   // the digits die with a stutter
            case "REVEAL"->shown=revealDisplay(t);
            case "RESULTS"->{scene.rawDigits="----";scene.plaque("ИТОГИ","ЦЕЛЬ "+tgt+" С",false);}
            default->{}
        }
        ScreenUtils.clear(0,0,0,1);vp.apply();batch.setProjectionMatrix(cam.combined);batch.begin();
        scene.draw(batch,tgt,shown,phase.equals("RUNNING")?.06f:.12f);
        switch(phase){
            case "INTRO"->ribbon("СОБЕРИТЕСЬ У ЭКРАНА",t-1.2f);
            case "TARGET"->ribbon("ПОСЛЕ ТРЁХ СЕКУНД ЦИФРЫ ПОГАСНУТ — СЧИТАЙТЕ ПРО СЕБЯ",t-.8f);
            case "COUNTDOWN"->{ribbon("КНОПКА «СТОП» — НА ВАШИХ ТЕЛЕФОНАХ",t);players(1,null,false);}
            case "RUNNING"->players(1,null,false);
            case "REVEAL"->reveal(t);
            case "RESULTS"->results(t);
            default->{}
        }
        batch.end();
    }
    private final Map<String,Float> lit=new HashMap<>();private float clock;
    private static String typewriter(String s,float t){int n=MathUtils.clamp((int)((t-.35f)*18),0,s.length());return n<=0?" ":s.substring(0,n);}

    // ---------- overlays ----------
    /** A slim gilt ribbon at the very bottom for one line of guidance. */
    private void ribbon(String text,float t){
        float k=ease(t/.5f);if(k<=0)return;float y=20,h=70,w=Math.min(1600,widthOf(body,text,.8f)+200),x=960-w/2;
        batch.setColor(0,0,0,.72f*k);batch.draw(soft,x-140,y-30,w+280,h+60);
        batch.setColor(.05f,.025f,.025f,.86f*k);batch.draw(pixel,x,y,w,h);
        batch.setColor(GOLD.r,GOLD.g,GOLD.b,.8f*k);batch.draw(pixel,x,y,w,2);batch.draw(pixel,x,y+h-2,w,2);
        diamond(x,y+h/2,7,k);diamond(x+w,y+h/2,7,k);
        text(body,text,960,y+h/2+19,.8f,IVORY,k);
    }
    /**
     * Players as medallions on both sides of the machine. A ring lamp ignites (red) the moment a player stops; during the
     * reveal the current player's medallion grows and glows, and the eliminated one fades into the dark.
     */
    private void players(float alpha,String focus,boolean revealMode){
        List<String> seats=list("seats");int n=seats.size(),left=(n+1)/2;
        for(int i=0;i<n;i++){String id=seats.get(i);boolean l=i<left;int row=l?i:i-left,rows=l?left:n-left;
            float cx=l?170:1750,cy=600+(rows-1)*112-row*224,r=80;
            float on=lit.getOrDefault(id,0f);boolean f=id.equals(focus);
            JsonObject res=revealMode?resultOf(id):null;boolean shownYet=revealMode&&revealedYet(id);boolean dead=shownYet&&res!=null&&res.get("eliminated").getAsBoolean();
            float scale=f?1.25f:1,a=alpha*(dead?.35f:1);r*=scale;
            batch.setColor(0,0,0,.6f*a);batch.draw(soft,cx-r*1.7f,cy-r*1.8f,r*3.4f,r*3.4f);
            if(on>0||f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(f?GOLD.r:1f,f?GOLD.g*.8f:.12f,f?GOLD.b*.5f:.08f,(f?.55f:.5f*on)*a*(.85f+.15f*MathUtils.sin(clock*4+i)));
                batch.draw(soft,cx-r*1.9f,cy-r*1.9f,r*3.8f,r*3.8f);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            Texture face=face(character(id));
            if(face!=null){float g=dead?.45f:1;batch.setColor(g,g*(dead?.6f:1),g*(dead?.6f:1),a);batch.draw(face,cx-r*.86f,cy-r*.86f,r*1.72f,r*1.72f);}
            ring(cx,cy,r,a,on>0&&!revealMode?new Color(1f,.2f,.14f,1):f?GOLD:new Color(.55f,.42f,.24f,1));
            body.getData().setScale(.66f*Math.min(scale,1.1f));gl.setText(body,name(id));body.setColor(0,0,0,.8f*a);body.draw(batch,name(id),cx-gl.width/2+2,cy-r-12);
            body.setColor(f?GOLD.r:IVORY.r,f?GOLD.g:IVORY.g,f?GOLD.b:IVORY.b,a);body.draw(batch,name(id),cx-gl.width/2,cy-r-10);body.getData().setScale(1);
            if(!revealMode){String st=on>0?"ГОТОВО":"…";body.getData().setScale(.46f);gl.setText(body,st);body.setColor(on>0?1f:DIM.r,on>0?.35f:DIM.g,on>0?.28f:DIM.b,a);body.draw(batch,st,cx-gl.width/2,cy-r-56);body.getData().setScale(1);}
        }
        batch.setColor(Color.WHITE);
    }
    private void ring(float cx,float cy,float r,float a,Color c){
        for(int k=0;k<72;k++){float ang=k*5;float x=cx+MathUtils.cosDeg(ang)*r,y=cy+MathUtils.sinDeg(ang)*r;float shade=.7f+.3f*MathUtils.cosDeg(ang-120);
            batch.setColor(c.r*shade,c.g*shade,c.b*shade,a);batch.draw(pixel,x-3.5f,y-3.5f,3.5f,3.5f,7,7,1,1,ang,0,0,1,1,false,false);}
    }
    private void diamond(float x,float y,float r,float a){batch.setColor(GOLD.r,GOLD.g,GOLD.b,a);batch.draw(pixel,x-r*.7f,y-r*.7f,r*.7f,r*.7f,r*1.4f,r*1.4f,1,1,45,0,0,1,1,false,false);}
    private float widthOf(BitmapFont f,String s,float sc){f.getData().setScale(sc);gl.setText(f,s);f.getData().setScale(1);return gl.width;}

    private List<JsonObject> rows(){List<JsonObject> r=new ArrayList<>();for(var e:fs.getAsJsonArray("results"))r.add(e.getAsJsonObject());return r;}
    private JsonObject resultOf(String id){for(var r:rows())if(r.get("playerId").getAsString().equals(id))return r;return null;}
    private int revealIndex(float t){float intro=l("revealIntroMs")/1000f,step=l("revealStepMs")/1000f;if(t<intro)return -1;return Math.min(rows().size()-1,(int)((t-intro)/step));}
    /** Has this player's result already been shown (reveal goes worst → best)? */
    private boolean revealedYet(String id){var rs=rows();int i=revealIndex(since("phaseStartedAt"));for(int k=0;k<=i&&k<rs.size();k++)if(rs.get(rs.size()-1-k).get("playerId").getAsString().equals(id))return true;return false;}
    private String revealDisplay(float t){
        int i=revealIndex(t);if(i<0){scene.plaque("РЕЗУЛЬТАТЫ","КТО БЫЛ ТОЧНЕЕ?",false);return null;}
        var rs=rows();var r=rs.get(rs.size()-1-i);String id=r.get("playerId").getAsString();
        float step=l("revealStepMs")/1000f,u=((t-l("revealIntroMs")/1000f)-i*step)/step;
        boolean dead=r.get("eliminated").getAsBoolean();
        scene.plaque("МЕСТО "+r.get("rank").getAsInt(),name(id).toUpperCase(Locale.ROOT),dead&&u>.55f);
        if(i!=lastReveal){lastReveal=i;scene.press();}
        if(!r.get("stopped").getAsBoolean()){scene.rawDigits="----";scene.rawComma=false;return null;}
        // the time "rolls" onto the display, then settles
        long ms=r.get("stoppedMs").getAsLong();if(u<.22f)ms=(long)(ms*ease(u/.22f));
        if(dead&&u>.55f){float g=(u-.55f)/.45f;scene.displayFlicker=MathUtils.random()<.35f+.4f*g?.12f:1;if(g>.6f){scene.rawDigits="Err ";scene.rawComma=false;}}
        return fmt(ms);
    }
    private void reveal(float t){
        int i=revealIndex(t);String focus=null;
        if(i>=0){var rs=rows();var r=rs.get(rs.size()-1-i);focus=r.get("playerId").getAsString();
            float step=l("revealStepMs")/1000f,u=((t-l("revealIntroMs")/1000f)-i*step)/step;boolean dead=r.get("eliminated").getAsBoolean();
            String line=r.get("stopped").getAsBoolean()?"ОШИБКА  "+fmtErr(r.get("errorMs").getAsLong())+" С":"НЕ НАЖАЛ";
            ribbon(dead&&u>.55f?line+"   ·   МАШИНА ЗАБИРАЕТ ИГРОКА":line,(u-.22f)*1.4f);
            if(dead&&u>.55f){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(1f,.08f,.05f,.14f*MathUtils.random());batch.draw(pixel,0,0,1920,1080);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        }else ribbon("ОТ ХУДШЕГО К ЛУЧШЕМУ",t);
        players(1,focus,true);
    }
    static String fmtErr(long ms){long cs=Math.round(ms/10.0);return (cs/100)+","+String.format("%02d",cs%100);}
    private void results(float t){
        var rs=rows();float a=ease(t/.5f);batch.setColor(0,0,0,.55f*a);batch.draw(pixel,0,0,1920,1080);
        int n=rs.size();float rowH=78,w=980,h=n*rowH+60,x=960-w/2,top=760;
        // gilt panel
        batch.setColor(0,0,0,.6f*a);batch.draw(soft,x-160,top-h-120,w+320,h+240);
        batch.setColor(.05f,.025f,.025f,.92f*a);batch.draw(pixel,x,top-h,w,h);
        batch.setColor(GOLD.r,GOLD.g,GOLD.b,.85f*a);batch.draw(pixel,x,top-h,w,2);batch.draw(pixel,x,top-2,w,2);batch.draw(pixel,x,top-h,2,h);batch.draw(pixel,x+w-2,top-h,2,h);
        batch.setColor(GOLD.r,GOLD.g,GOLD.b,.3f*a);batch.draw(pixel,x+8,top-h+8,w-16,1);batch.draw(pixel,x+8,top-9,w-16,1);
        diamond(x,top,9,a);diamond(x+w,top,9,a);diamond(x,top-h,9,a);diamond(x+w,top-h,9,a);
        for(int i=0;i<n;i++){var r=rs.get(i);float ra=ease((t-.35f-i*.16f)/.4f);if(ra<=0)continue;float y=top-30-(i+1)*rowH+(1-ra)*-24;boolean dead=r.get("eliminated").getAsBoolean();
            String id=r.get("playerId").getAsString();boolean first=r.get("rank").getAsInt()==1;
            if(first){batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);batch.setColor(GOLD.r,GOLD.g*.8f,GOLD.b*.5f,.12f*ra);batch.draw(pixel,x+12,y+6,w-24,rowH-12);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(i>0){batch.setColor(GOLD.r,GOLD.g,GOLD.b,.18f*ra);batch.draw(pixel,x+40,y+rowH,w-80,1);}
            Color rc=first?GOLD:r.get("rank").getAsInt()==2?new Color(.82f,.84f,.88f,1):r.get("rank").getAsInt()==3?new Color(.80f,.52f,.30f,1):DIM;
            text(title,String.valueOf(r.get("rank").getAsInt()),x+52,y+rowH*.74f,.62f,rc,ra);
            Texture face=face(character(id));float fr=rowH*.4f;if(face!=null){batch.setColor(dead?.5f:1,dead?.3f:1,dead?.3f:1,ra);batch.draw(face,x+110-fr,y+rowH/2-fr,fr*2,fr*2);}ring(x+110,y+rowH/2,fr,ra,rc);
            body.getData().setScale(.72f);body.setColor(dead?RED.r:IVORY.r,dead?RED.g:IVORY.g,dead?RED.b:IVORY.b,ra);body.draw(batch,name(id),x+160,y+rowH*.68f);
            body.getData().setScale(.42f);body.setColor(DIM.r,DIM.g,DIM.b,ra);body.draw(batch,dead?"ЗАБРАН МАШИНОЙ":r.get("stopped").getAsBoolean()?"ОСТАНОВИЛ НА "+fmt(r.get("stoppedMs").getAsLong())+" С":"НЕ НАЖАЛ",x+160,y+rowH*.34f);
            String err=r.get("stopped").getAsBoolean()?"±"+fmtErr(r.get("errorMs").getAsLong()):"—";body.getData().setScale(.8f);gl.setText(body,err);body.setColor(rc.r,rc.g,rc.b,ra);body.draw(batch,err,x+w-40-gl.width,y+rowH*.66f);body.getData().setScale(1);}
        batch.setColor(Color.WHITE);if(t>2)ribbon("ENTER — ВЕРНУТЬСЯ В ЛОББИ",(t-2)*.8f);
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
