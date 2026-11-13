package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/** Upper centre: crowned FINAL ANSWER crest, the iron SYSTEM BREACH plate and a skull emblem on circuit traces. */
final class SystemBreachTitle {
    private final Color c=new Color();private static final Color HOLE=new Color(.02f,.05f,.03f,1);
    void shapes(SbPaint p,ShapeRenderer r,float time){
        float cx=TITLE.x+TITLE.width/2;
        p.crown(cx,CREST_Y+28,46,SbPaint.GOLD);
        // gilt flourishes under the crest
        for(int side=-1;side<=1;side+=2){r.setColor(SbPaint.GOLD.r,SbPaint.GOLD.g,SbPaint.GOLD.b,.85f);r.triangle(cx+side*16,CREST_Y-34.5f,cx+side*16,CREST_Y-37.5f,cx+side*170,CREST_Y-36);diamond(r,cx+side*112,CREST_Y-36,3.5f,SbPaint.GOLD);}
        diamond(r,cx,CREST_Y-36,9,SbPaint.GOLD);diamond(r,cx,CREST_Y-36,4.5f,SbPaint.TRIM_DARK);
        float glow=.75f+.25f*MathUtils.sin(time*1.3f);
        p.frame(TITLE.x,TITLE.y,TITLE.width,TITLE.height,26,SbPaint.GREEN,.6f*glow);
        // side clamps
        for(int side=-1;side<=1;side+=2){float x=cx+side*(TITLE.width/2+14);p.plate(x-16,TITLE.y+TITLE.height/2-26,32,52,8,SbPaint.TRIM,SbPaint.TRIM_DARK);p.rivet(x,TITLE.y+TITLE.height/2);}
        // the seal: a hexagonal medallion hung from the plate, with tapered gilt filigree running out to both sides
        float sy=TITLE.y-6;
        for(int side=-1;side<=1;side+=2){
            r.setColor(SbPaint.GOLD.r,SbPaint.GOLD.g,SbPaint.GOLD.b,.85f);r.triangle(cx+side*46,sy+2.2f,cx+side*46,sy-2.2f,cx+side*290,sy);
            r.setColor(SbPaint.GREEN.r,SbPaint.GREEN.g,SbPaint.GREEN.b,.55f*glow);r.triangle(cx+side*58,sy-9,cx+side*58,sy-11,cx+side*200,sy-10);
            diamond(r,cx+side*168,sy,6,SbPaint.GOLD);diamond(r,cx+side*296,sy,3.5f,SbPaint.GOLD);diamond(r,cx+side*206,sy-10,3,c.set(SbPaint.GREEN).mul(1,1,1,glow));
        }
        hex(r,cx,sy,40,SbPaint.TRIM_LIGHT);hex(r,cx,sy,37,SbPaint.TRIM);hex(r,cx,sy,33,c.set(.03f,.06f,.045f,1));
        r.setColor(SbPaint.GREEN.r,SbPaint.GREEN.g,SbPaint.GREEN.b,.75f*glow);hexLine(r,cx,sy,29,1.6f);
        p.skull(cx,sy+1,19,c.set(SbPaint.GREEN).mul(1,1,1,.85f+.15f*glow),HOLE);
    }
    private static void diamond(ShapeRenderer r,float x,float y,float s,Color col){r.setColor(col);r.triangle(x-s,y,x,y+s,x+s,y);r.triangle(x-s,y,x,y-s,x+s,y);}
    private static void hex(ShapeRenderer r,float x,float y,float rad,Color col){r.setColor(col);for(int i=0;i<6;i++){float a=MathUtils.PI/6+i*MathUtils.PI/3,b=a+MathUtils.PI/3;r.triangle(x,y,x+MathUtils.cos(a)*rad,y+MathUtils.sin(a)*rad,x+MathUtils.cos(b)*rad,y+MathUtils.sin(b)*rad);}}
    private static void hexLine(ShapeRenderer r,float x,float y,float rad,float w){for(int i=0;i<6;i++){float a=MathUtils.PI/6+i*MathUtils.PI/3,b=a+MathUtils.PI/3;r.rectLine(x+MathUtils.cos(a)*rad,y+MathUtils.sin(a)*rad,x+MathUtils.cos(b)*rad,y+MathUtils.sin(b)*rad,w);}}
    void glow(SpriteBatch b,SystemBreachHostAssets as,float time){
        {float t=(time%5.5f)/1.1f;if(t<1){float sx=TITLE.x-80+(TITLE.width+160)*t,a=MathUtils.sin(t*MathUtils.PI);
            b.setColor(.75f,1,.85f,.35f*a);b.draw(as.glow,sx-60,TITLE.y+4,120,TITLE.height-8);b.setColor(1,1,1,.25f*a);b.draw(as.glow,sx-14,TITLE.y+8,28,TITLE.height-16);}}
        float cx=TITLE.x+TITLE.width/2,k=.75f+.25f*MathUtils.sin(time*1.3f);
        b.setColor(SbPaint.GREEN.r,SbPaint.GREEN.g,SbPaint.GREEN.b,.20f*k);b.draw(as.glow,TITLE.x+30,TITLE.y-10,TITLE.width-60,TITLE.height+20);
        b.setColor(SbPaint.GREEN.r,SbPaint.GREEN.g,SbPaint.GREEN.b,.22f*k);b.draw(as.glow,cx-70,TITLE.y-66,140,120);
        b.setColor(SbPaint.GOLD.r,SbPaint.GOLD.g,SbPaint.GOLD.b,.18f);b.draw(as.glow,cx-260,CREST_Y-60,520,130);
    }
    void text(SpriteBatch b,SbPaint p,SystemBreachHostAssets as,float time){
        float cx=TITLE.x+TITLE.width/2;
        p.centered(b,as.crest,"FINAL ANSWER",cx,CREST_Y+16,SbPaint.GOLD,1);
        // a faint offset ghost line gives the phosphor its depth without blurring the face
        p.centered(b,as.title,"SYSTEM BREACH",cx+3,TITLE.y+TITLE.height/2+as.title.getCapHeight()/2-3,c.set(0,.08f,.03f,1),.9f);
        float g=HackerFx.glitch(time);if(g>0){float ty=TITLE.y+TITLE.height/2+as.title.getCapHeight()/2;p.centered(b,as.title,"SYSTEM BREACH",cx-9*g,ty+2*g,c.set(1,.1f,.15f,1),.7f*g);p.centered(b,as.title,"SYSTEM BREACH",cx+9*g,ty-2*g,c.set(.1f,.9f,1,1),.6f*g);}
        p.centered(b,as.title,"SYSTEM BREACH",cx+(g>0?MathUtils.random(-3f,3f)*g:0),TITLE.y+TITLE.height/2+as.title.getCapHeight()/2,SbPaint.GREEN,1);
    }
}
