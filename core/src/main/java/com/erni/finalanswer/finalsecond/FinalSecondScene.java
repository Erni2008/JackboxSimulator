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
    private final SevenSegment seg=new SevenSegment();private final BitmapFont title,big;private final GlyphLayout layout=new GlyphLayout();
    private float time,press,pressV,shake,flash;

    public FinalSecondScene(){
        plate=tex("final_second/machine_plate.png");cap=tex("final_second/button_cap.png");soft=softTex(128);
        JsonValue j=new JsonReader().parse(Gdx.files.internal("final_second/layout.json"));
        sx=W/j.get("size").getInt(0);sy=H/j.get("size").getInt(1);
        capR=rect(j.get("cap"));glass=rect(j.get("glass"));plaque=rect(j.get("plaque"));
        title=com.erni.finalanswer.ui.UiFonts.gothic(46);big=com.erni.finalanswer.ui.UiFonts.gothic(84);
    }
    /** Painting px rect (top-left origin) → world rect {x,y,w,h} with bottom-left origin. */
    private float[] rect(JsonValue r){float x=r.getFloat(0)*sx,w=r.getFloat(2)*sx,h=r.getFloat(3)*sy,y=H-r.getFloat(1)*sy-h;return new float[]{x,y,w,h};}

    /** Press the big red button (visual): the cap travels down, glows, the machine shudders. */
    public void press(){pressV=9f;shake=1;flash=1;}
    public void update(float dt){
        time+=dt;
        // spring for the cap: driven down quickly, eases back with a slight mechanical settle
        press+=pressV*dt;if(press>=1){press=1;pressV=-2.6f;}if(press<=0&&pressV<0){press=0;pressV=0;}
        shake=Math.max(0,shake-dt*3.2f);flash=Math.max(0,flash-dt*2.2f);
    }

    /**
     * Draw the machine. {@code target} e.g. "7,00"; {@code shown} the readout ("03,42"), or null for a dark display;
     * {@code ghost} how visible the unlit segments are.
     */
    public void draw(SpriteBatch b,String target,String shown,float ghost){
        float jx=shake>0?MathUtils.sin(time*95)*2.2f*shake:0,jy=shake>0?MathUtils.cos(time*83)*1.4f*shake:0;
        b.setColor(Color.WHITE);b.draw(plate,jx,jy,W,H);
        lamps(b,jx,jy);
        plaque(b,target,jx,jy);
        readout(b,shown,ghost,jx,jy);
        button(b,jx,jy);
    }

    private void lamps(SpriteBatch b,float jx,float jy){
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        float f1=flick(1.3f),f2=flick(4.7f),boost=1+flash*.8f;
        for(float[] l:new float[][]{{309,375,f1},{1368,375,f2}}){float x=l[0]*sx+jx,y=H-l[1]*sy+jy;
            b.setColor(1f,.12f,.08f,.22f*l[2]*boost);b.draw(soft,x-150,y-170,300,340);
            b.setColor(1f,.35f,.25f,.30f*l[2]*boost);b.draw(soft,x-34,y-70,68,140);}
        for(float[] c:new float[][]{{37,388},{88,375},{121,425}}){float x=c[0]*sx+jx,y=H-c[1]*sy+jy,f=flick(c[0]);
            b.setColor(1f,.62f,.28f,.16f*f);b.draw(soft,x-60,y-60,120,120);}
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);b.setColor(Color.WHITE);
    }
    private float flick(float s){return .82f+.10f*MathUtils.sin(time*7.1f+s)+.06f*MathUtils.sin(time*13.3f+s*2)+.04f*MathUtils.sin(time*29f+s);}

    private void plaque(SpriteBatch b,String target,float jx,float jy){
        float cx=plaque[0]+plaque[2]/2+jx,top=plaque[1]+plaque[3]+jy;
        text(b,title,"ОСТАНОВИ ТАЙМЕР НА",cx,top-16,1.22f,new Color(.93f,.85f,.72f,1),.0f);
        String t=target+" СЕКУНД";
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);big.getData().setScale(1.3f);layout.setText(big,t);big.getData().setScale(1);
        b.setColor(1f,.15f,.1f,.35f);b.draw(soft,cx-layout.width*.62f,top-150,layout.width*1.24f,110);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        text(b,big,t,cx,top-70,1.3f,new Color(1f,.26f,.2f,1),.5f);
    }
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
        String s=shown==null?"    ":shown.replace(",","").replace(".","");
        float lit=shown==null?0:(.9f+.1f*flick(9))*(1+flash*.25f);
        for(int i=0;i<4;i++){
            char c=i<s.length()?s.charAt(i):' ';
            seg.digit(b,SevenSegment.mask(c),x,y,dw,dh,lit,ghost);
            x+=dw+gap;if(i==1){seg.dot(b,x-gap*.55f,y-dh*.02f,dh*.09f,lit,ghost);x+=comma;}}
        // unit "с"
        text(b,title,"с",x+dw*.12f,y+dh*.30f,.9f,new Color(1f,.26f,.2f,shown==null?.18f:1f),shown==null?0:.4f);
        // glass sheen
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(1f,.9f,.85f,.035f);b.draw(soft,gx+gw*.05f,gy+gh*.55f,gw*.9f,gh*.6f);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);b.setColor(Color.WHITE);
    }

    private void button(SpriteBatch b,float jx,float jy){
        float e=press*press*(3-2*press),travel=16*e;
        float x=capR[0]+jx,y=capR[1]+jy-travel,w=capR[2],h=capR[3]*(1-.05f*e);
        float glow=.55f+.25f*MathUtils.sin(time*2.2f)+flash*1.2f;
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        b.setColor(1f,.1f,.06f,.18f*glow);b.draw(soft,x-w*.25f,y-h*.35f,w*1.5f,h*1.5f);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        float k=1+.25f*flash;b.setColor(Math.min(1,k),Math.min(1,.92f*k),Math.min(1,.92f*k),1);b.draw(cap,x,y,w,h);
        if(flash>0){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(1f,.25f,.18f,.35f*flash);b.draw(cap,x,y,w,h);b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        b.setColor(Color.WHITE);
    }

    private static Texture tex(String p){Texture t=new Texture(Gdx.files.internal(p),true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;}
    private static Texture softTex(int n){Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);p.setBlending(Pixmap.Blending.None);float c=(n-1)/2f;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float d=(float)Math.hypot(x-c,y-c)/c;float a=d>=1?0:(1-d);a=a*a*(3-2*a);p.drawPixel(x,y,Color.rgba8888(1,1,1,a));}
        Texture t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);p.dispose();return t;}
    @Override public void dispose(){plate.dispose();cap.dispose();soft.dispose();seg.dispose();title.dispose();big.dispose();}
}
