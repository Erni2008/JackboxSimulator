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
        r.setColor(SbPaint.GOLD.r,SbPaint.GOLD.g,SbPaint.GOLD.b,.8f);r.rectLine(cx-150,CREST_Y-36,cx-18,CREST_Y-36,2);r.rectLine(cx+18,CREST_Y-36,cx+150,CREST_Y-36,2);
        r.triangle(cx-12,CREST_Y-36,cx,CREST_Y-28,cx+12,CREST_Y-36);r.triangle(cx-12,CREST_Y-36,cx,CREST_Y-44,cx+12,CREST_Y-36);
        float glow=.75f+.25f*MathUtils.sin(time*1.3f);
        p.frame(TITLE.x,TITLE.y,TITLE.width,TITLE.height,26,SbPaint.GREEN,.6f*glow);
        // side clamps
        for(int side=-1;side<=1;side+=2){float x=cx+side*(TITLE.width/2+14);p.plate(x-16,TITLE.y+TITLE.height/2-26,32,52,8,SbPaint.TRIM,SbPaint.TRIM_DARK);p.rivet(x,TITLE.y+TITLE.height/2);}
        // circuit traces to the emblem
        r.setColor(SbPaint.GREEN.r,SbPaint.GREEN.g,SbPaint.GREEN.b,.7f*glow);
        for(int side=-1;side<=1;side+=2){
            r.rectLine(cx+side*44,EMBLEM_Y,cx+side*120,EMBLEM_Y,2.5f);r.rectLine(cx+side*120,EMBLEM_Y,cx+side*140,EMBLEM_Y+16,2.5f);r.rectLine(cx+side*140,EMBLEM_Y+16,cx+side*250,EMBLEM_Y+16,2.5f);
            r.circle(cx+side*250,EMBLEM_Y+16,4,8);r.rectLine(cx+side*60,EMBLEM_Y-12,cx+side*160,EMBLEM_Y-12,2);r.circle(cx+side*160,EMBLEM_Y-12,3.5f,8);
        }
        r.triangle(cx-14,EMBLEM_Y-34,cx+14,EMBLEM_Y-34,cx,EMBLEM_Y-50);
        p.skull(cx,EMBLEM_Y+2,26,c.set(SbPaint.GREEN).mul(1,1,1,glow),HOLE);
    }
    void glow(SpriteBatch b,SystemBreachHostAssets as,float time){
        float cx=TITLE.x+TITLE.width/2,k=.75f+.25f*MathUtils.sin(time*1.3f);
        b.setColor(SbPaint.GREEN.r,SbPaint.GREEN.g,SbPaint.GREEN.b,.20f*k);b.draw(as.glow,TITLE.x+30,TITLE.y-10,TITLE.width-60,TITLE.height+20);
        b.setColor(SbPaint.GREEN.r,SbPaint.GREEN.g,SbPaint.GREEN.b,.30f*k);b.draw(as.glow,cx-70,EMBLEM_Y-60,140,120);
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
