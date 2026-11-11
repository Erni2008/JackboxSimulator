package com.erni.finalanswer.finalsecond;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Disposable;
import com.badlogic.gdx.utils.JsonReader;
import com.badlogic.gdx.utils.JsonValue;

/**
 * THE FINAL SECOND — the machine on the host screen, in 1920×1080 world units. The painted machine (target plaque,
 * timer housing, red button, laboratory) is a clean plate with its text, digits and button cap removed; everything
 * that changes is drawn live on top: the target text, a seven-segment readout, the button cap with its press
 * travel, flickering tube lamps and candles, and a subtle shake. Visual only — timing lives elsewhere.
 */
public final class FinalSecondScene implements Disposable {
    public static final float W=1920,H=1080;
    private final Texture plate,cap,soft;private final float sx,sy;private final float[] capR,glass,plaque;
    private final SevenSegment seg=new SevenSegment();private Texture lip;private float[] lipR;private final BitmapFont title,big;private final GlyphLayout layout=new GlyphLayout();
    private float time,press,pressV,shake,flash,pressT=-1;

    public FinalSecondScene(){
        plate=tex("final_second/machine_plate.png");cap=tex("final_second/button_cap.png");soft=softTex(128);
        JsonValue j=new JsonReader().parse(Gdx.files.internal("final_second/layout.json"));
        sx=W/j.get("size").getInt(0);sy=H/j.get("size").getInt(1);
        capR=rect(j.get("cap"));lipR=rect(j.get("lip"));lip=tex("final_second/collar_front.png");glass=rect(j.get("glass"));plaque=rect(j.get("plaque"));
        title=com.erni.finalanswer.ui.UiFonts.gothic(46);big=com.erni.finalanswer.ui.UiFonts.gothic(84);
    }
    /** Painting px rect (top-left origin) → world rect {x,y,w,h} with bottom-left origin. */
    private float[] rect(JsonValue r){float x=r.getFloat(0)*sx,w=r.getFloat(2)*sx,h=r.getFloat(3)*sy,y=H-r.getFloat(1)*sy-h;return new float[]{x,y,w,h};}

    /** Press the big red button (visual): the cap travels down, glows, the machine shudders. */
    public void press(){pressT=0;shake=1;flash=1;}
    /** 0 = machine off (dark), 1 = fully powered; lamps flicker on as it rises. */
    public float power=1;
    public void update(float dt){
        time+=dt;plaqueFade=Math.min(1,plaqueFade+dt*3.2f);
        // spring for the cap: driven down quickly, eases back with a slight mechanical settle
        if(pressT>=0){pressT+=dt;if(pressT>1)pressT=-1;}
        shake=Math.max(0,shake-dt*4.5f);flash=Math.max(0,flash-dt*2.6f);
    }

    /**
     * Draw the machine. {@code target} e.g. "7,00"; {@code shown} the readout ("03,42"), or null for a dark display;
     * {@code ghost} how visible the unlit segments are.
     */
    /** Display override: four characters (digits, '-', ' ', 'E', 'r') and whether the decimal comma is lit; null = normal. */
    public String rawDigits;public boolean rawComma;public float displayFlicker=1;
    public void draw(SpriteBatch b,String target,String shown,float ghost){
        float jx=shake>0?MathUtils.sin(time*95)*2.2f*shake:0,jy=shake>0?MathUtils.cos(time*83)*1.4f*shake:0;
        float pw=Math.max(0,Math.min(1,power));
        b.setColor(.25f+.75f*pw,.25f+.75f*pw,.25f+.75f*pw,1);b.draw(plate,jx,jy,W,H);b.setColor(Color.WHITE);
        if(pw>.15f)lamps(b,jx,jy,pw<1&&MathUtils.random()<.25f*(1-pw)?.1f:pw);
        plaque(b,target,jx,jy);
        readout(b,shown,ghost,jx,jy);
        button(b,jx,jy);
    }

    private void lamps(SpriteBatch b,float jx,float jy,float pw){
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        float f1=flick(1.3f)*pw,f2=flick(4.7f)*pw,boost=1+flash*.8f;
        for(float[] l:new float[][]{{309,375,f1},{1368,375,f2}}){float x=l[0]*sx+jx,y=H-l[1]*sy+jy;
            b.setColor(1f,.12f,.08f,.22f*l[2]*boost);b.draw(soft,x-150,y-170,300,340);
            b.setColor(1f,.35f,.25f,.30f*l[2]*boost);b.draw(soft,x-34,y-70,68,140);}
        for(float[] c:new float[][]{{37,388},{88,375},{121,425}}){float x=c[0]*sx+jx,y=H-c[1]*sy+jy,f=flick(c[0]);
            b.setColor(1f,.62f,.28f,.16f*f);b.draw(soft,x-60,y-60,120,120);}
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);b.setColor(Color.WHITE);
    }
    private float flick(float s){return .82f+.10f*MathUtils.sin(time*7.1f+s)+.06f*MathUtils.sin(time*13.3f+s*2)+.04f*MathUtils.sin(time*29f+s);}

    /** What the machine's plaque says: a small upper line and a big main line (red or ivory). Changes crossfade. */
    public void plaque(String top,String main,boolean red){
        String k=top+"|"+main+"|"+red;if(k.equals(plaqueKey))return;
        prevTop=curTop;prevMain=curMain;prevRed=curRed;curTop=top;curMain=main;curRed=red;plaqueKey=k;plaqueFade=prevTop==null?1:0;}
    private String plaqueKey="",curTop,curMain,prevTop,prevMain;private boolean curRed,prevRed;private float plaqueFade=1;
    private void plaque(SpriteBatch b,String target,float jx,float jy){
        if(curTop==null)plaque("ОСТАНОВИ ТАЙМЕР НА",target+" СЕКУНД",true);
        float cx=plaque[0]+plaque[2]/2+jx,top=plaque[1]+plaque[3]+jy;
        float k=plaqueFade*plaqueFade*(3-2*plaqueFade);
        if(prevTop!=null&&k<1)plaqueLines(b,prevTop,prevMain,prevRed,cx,top,1-k,-8*k);
        plaqueLines(b,curTop,curMain,curRed,cx,top,k,8*(1-k));
    }
    private void plaqueLines(SpriteBatch b,String t1,String t2,boolean red,float cx,float top,float a,float dy){
        if(a<=0)return;
        text(b,title,t1,cx,top-16+dy,1.22f,new Color(.93f,.85f,.72f,a),.0f);
        float sc=Math.min(1.3f,1.3f*620f/Math.max(1,width(big,t2)*1.3f));
        Color c=red?new Color(1f,.26f,.2f,a):new Color(.97f,.90f,.78f,a);
        if(red){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);big.getData().setScale(sc);layout.setText(big,t2);big.getData().setScale(1);
            b.setColor(1f,.15f,.1f,.35f*a);b.draw(soft,cx-layout.width*.62f,top-150+dy,layout.width*1.24f,110);b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        text(b,big,t2,cx,top-70+dy,sc,c,red?.5f*a:0);
    }
    private float width(BitmapFont f,String s){f.getData().setScale(1);layout.setText(f,s);return layout.width;}
    private void text(SpriteBatch b,BitmapFont f,String s,float cx,float y,float scale,Color c,float glow){
        f.getData().setScale(scale);layout.setText(f,s);float x=cx-layout.width/2;
        f.setColor(0,0,0,.75f);f.draw(b,s,x+2,y-3);
        if(glow>0){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);f.setColor(c.r,c.g*.6f,c.b*.6f,glow*.35f);
            for(int i=0;i<4;i++)f.draw(b,s,x+MathUtils.cosDeg(i*90)*2.5f,y+MathUtils.sinDeg(i*90)*2.5f);b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        f.setColor(c);f.draw(b,s,x,y);f.getData().setScale(1);
    }

    private void readout(SpriteBatch b,String shown,float ghost,float jx,float jy){
        float gx=glass[0]+jx,gy=glass[1]+jy,gw=glass[2],gh=glass[3];
        float dh=gh*.84f,dw=dh*.56f,gap=dw*.26f,comma=dw*.40f;
        float total=4*dw+3*gap+comma+dw*.45f,x=gx+(gw-total)/2,y=gy+(gh-dh)/2;
        String s=rawDigits!=null?rawDigits:shown==null?"    ":shown.replace(",","").replace(".","");
        boolean any=rawDigits!=null||shown!=null;
        float lit=any?(.9f+.1f*flick(9))*(1+flash*.25f)*displayFlicker:0;
        for(int i=0;i<4;i++){
            char c=i<s.length()?s.charAt(i):' ';
            seg.digit(b,SevenSegment.mask(c),x,y,dw,dh,lit,ghost);
            x+=dw+gap;if(i==1){seg.dot(b,x-gap*.55f,y-dh*.02f,dh*.09f,rawDigits!=null&&!rawComma?0:lit,ghost);x+=comma;}}
        // unit "с"
        text(b,title,"с",x+dw*.12f,y+dh*.30f,.9f,new Color(1f,.26f,.2f,shown==null?.18f:1f),shown==null?0:.4f);
        // glass sheen
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(1f,.9f,.85f,.035f);b.draw(soft,gx+gw*.05f,gy+gh*.55f,gw*.9f,gh*.6f);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);b.setColor(Color.WHITE);
    }

    /**
     * The photographed cap, pressed like a real switch: it sinks into the brass collar (the collar's front lip is drawn
     * over it, so its skirt disappears behind the ring), compresses slightly, loses the light from above as it goes in,
     * and its internal red light flares; on release it springs back with a small overshoot and settles.
     */
    private void button(SpriteBatch b,float jx,float jy){
        float e=pressCurve();
        float travel=capR[3]*.16f*e,squash=1-.035f*e;
        float x=capR[0]+jx,w=capR[2],h=capR[3]*squash,y=capR[1]+jy-travel+(capR[3]-h);
        float glow=.55f+.25f*MathUtils.sin(time*2.2f)+flash*1.4f;
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        b.setColor(1f,.1f,.06f,.16f*glow);b.draw(soft,x-w*.25f,capR[1]+jy-capR[3]*.4f,w*1.5f,capR[3]*1.6f);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        float shade=1-.28f*Math.max(0,e);                       // deeper in the collar = less light from above
        b.setColor(shade,shade*.96f,shade*.96f,1);b.draw(cap,x,y,w,h);
        if(flash>0){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(1f,.2f,.12f,.45f*flash);b.draw(cap,x,y,w,h);b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        // the collar's front lip in front of the cap
        b.setColor(1,1,1,1);b.draw(lip,lipR[0]+jx,lipR[1]+jy,lipR[2],lipR[3]);
        if(flash>0){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(1f,.55f,.3f,.25f*flash);b.draw(lip,lipR[0]+jx,lipR[1]+jy,lipR[2],lipR[3]);b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        b.setColor(Color.WHITE);
    }
    /** 0 at rest, 1 fully down: a fast hard stroke (≈70 ms), a short hold, then a spring return with overshoot. */
    private float pressCurve(){
        float t=pressT;if(t<0)return 0;
        if(t<.07f){float k=t/.07f;return 1-(1-k)*(1-k)*(1-k);}
        if(t<.16f)return 1;
        float r=(t-.16f)/.42f;if(r>=1)return 0;
        return (float)(Math.exp(-5*r)*Math.cos(r*MathUtils.PI*1.6f))*(1-r*.15f);   // springs up, overshoots a hair, settles
    }
    private static Texture tex(String p){Texture t=new Texture(Gdx.files.internal(p),true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;}
    private static Texture softTex(int n){Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float d=(float)Math.hypot(x-c,y-c)/c;float a=d>=1?0:(1-d);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    @Override public void dispose(){plate.dispose();cap.dispose();lip.dispose();soft.dispose();seg.dispose();title.dispose();big.dispose();}
}
