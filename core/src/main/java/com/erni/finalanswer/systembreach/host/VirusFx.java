package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Slot;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/**
 * A quiet echo, on the host screen, of the sabotage virus a player is fighting on their phone: a red tag with the
 * virus name and a light, type-specific effect around their character (bars of interference, tiny pop-up windows,
 * a lock, swapping tiles, orbiting digits). Deliberately weaker than on the phone — readable, never noisy.
 * Character motion for viruses lives in {@link PodiumCharacters}. No allocation per frame.
 */
final class VirusFx {
    private static final Color RED=new Color(1f,.25f,.2f,1),CYAN=new Color(.35f,.95f,1f,1),DARK=new Color(.08f,.01f,.01f,.92f),tmp=new Color();
    private static float clamp(float v){return Math.max(0,Math.min(1,v));}
    private static float hash(int i){float v=MathUtils.sin(i*127.1f+311.7f)*43758.5f;return v-(float)Math.floor(v);}
    private static float bottom(){return panelTop()-CHARACTER_SINK;}
    static final float TAG_Y=panelTop()+4;

    void glow(SpriteBatch b,SystemBreachHostAssets assets,Slot s,float x,float time){
        if(s.virus.isEmpty())return;float k=clamp(s.virusAge/.6f),p=.75f+.25f*MathUtils.sin(time*3.1f);
        var c=s.virus.equals("GHOST_BUTTONS")?CYAN:RED;b.setColor(c.r,c.g,c.b,.16f*k*p);b.draw(assets.glow,x-150,bottom()-30,300,CHARACTER_H+80);
        if(s.virusAge<.8f){float f=1-s.virusAge/.8f;b.setColor(1,.3f,.2f,.5f*f);b.draw(assets.glow,x-220,bottom()-80,440,CHARACTER_H+180);}   // infection flash
    }

    void shapes(SbPaint paint,ShapeRenderer sh,SystemBreachHostAssets assets,Slot s,float x,float time){
        if(s.virus.isEmpty())return;float k=clamp(s.virusAge/.5f),y0=bottom();
        // name tag above the head
        String name=tag(s);float tw=paint.width(assets.labelSmall,name)+30;
        paint.plate(x-tw/2,TAG_Y,tw,24,7,tmp.set(.55f,.06f,.04f,.92f*k),DARK);paint.outline(x-tw/2+2,TAG_Y+2,tw-4,20,6,1.4f,tmp.set(RED.r,RED.g,RED.b,(.6f+.4f*MathUtils.sin(time*4))*k));
        switch(s.virus){
            case "SCREEN_GLITCH"->{float gb=PodiumCharacters.glitchBurst(time);int frame=(int)(time*20);float top=y0+CHARACTER_H;
                y0=panelTop()+10;float span=top-y0;
                if(gb>0){// tearing: horizontal strips shifted sideways, with a thin bright leading edge
                    for(int i=0;i<5;i++){float r=hash(frame*7+i+s.id.hashCode());if(r<.3f)continue;
                        float y=y0+hash(frame*13+i)*(span-14),h=2+hash(frame*5+i)*9,w=90+hash(frame*3+i)*90,bx=x-w/2+(hash(frame+i*9)-.5f)*50;
                        sh.setColor(.02f,.02f,.03f,.3f*gb*k);sh.rect(bx,y,w,h);var c=i%2==0?RED:CYAN;sh.setColor(c.r,c.g,c.b,.55f*gb*k);sh.rect(bx,y+h-1.2f,w,1.2f);}
                    // block noise: small digital macro-blocks
                    for(int i=0;i<9;i++){float r=hash(frame*31+i);if(r<.45f)continue;float bs=4+hash(frame*17+i)*8;
                        sh.setColor(hash(i+frame)>.5f?.9f:.2f,hash(i*3+frame)>.5f?.9f:.3f,1,.35f*gb*k);sh.rect(x-80+hash(frame*11+i)*160,y0+hash(frame*19+i)*span,bs*2,bs);}}}
            case "POPUP_STORM"->{for(int i=0;i<3;i++){float ph=(time*.55f+i/3f)%1f;if(ph>.78f)continue;int cyc=(int)(time*.55f+i/3f);float a=k*Math.min(1,ph/.08f)*Math.min(1,(.78f-ph)/.1f);
                float wx=x-90+hash(cyc*11+i)*130,wy=y0+60+hash(cyc*17+i)*150,w=58,h=36;
                sh.setColor(0,0,0,.6f*a);sh.rect(wx+3,wy-3,w,h);sh.setColor(.10f,.02f,.02f,.92f*a);sh.rect(wx,wy,w,h);sh.setColor(.75f,.08f,.05f,a);sh.rect(wx,wy+h-9,w,9);
                sh.setColor(1,1,1,.8f*a);sh.rect(wx+w-8,wy+h-7,5,5);sh.setColor(1,.6f,.55f,.55f*a);sh.rect(wx+6,wy+14,w-16,3);sh.rect(wx+6,wy+7,w-26,3);}}
            case "LOCKED_ANSWERS"->{float lx=x+58,ly=y0+150+MathUtils.sin(time*2)*4,p=.7f+.3f*MathUtils.sin(time*5);
                sh.setColor(RED.r,RED.g,RED.b,.85f*k*p);sh.rect(lx-5,ly+14,3,12);sh.rect(lx+12,ly+14,3,12);sh.rect(lx-5,ly+24,20,3);sh.rect(lx-9,ly,28,16);
                sh.setColor(.15f,0,0,k);sh.rect(lx+3,ly+4,4,7);}
            case "SHUFFLE_ATTACK"->{int step=(int)time;float f=clamp((time-step)*4);
                for(int i=0;i<4;i++){int from=(i+step)%4,to=(i+step+1)%4;float fx=MathUtils.lerp(from%2,to%2,f),fy=MathUtils.lerp(from/2,to/2,f);
                    sh.setColor(RED.r,RED.g,RED.b,(i==0?.85f:.4f)*k);sh.rect(x+52+fx*16,y0+170+fy*16,13,13);}}
            default->{}
        }
    }

    void text(SpriteBatch b,SbPaint paint,SystemBreachHostAssets assets,Slot s,float x,float time){
        if(s.virus.isEmpty())return;float k=clamp(s.virusAge/.5f);
        paint.centered(b,assets.labelSmall,tag(s),x,TAG_Y+17,SbPaint.IVORY,k);
        if(s.virus.equals("NUMBER_HUNT"))for(int i=0;i<7;i++){float a=time*.6f+i*MathUtils.PI2/7,r=78+8*MathUtils.sin(time*1.7f+i);
            paint.text(b,assets.hex,DIGITS[i],x+MathUtils.cos(a)*r-4,bottom()+CHARACTER_H*.5f+MathUtils.sin(a)*r*.75f,RED,(.45f+.25f*MathUtils.sin(time*3+i))*k);}
    }
    private static final String[] DIGITS={"1","2","3","4","5","6","7"};
    private SystemBreachHostViewModel model;
    VirusFx bind(SystemBreachHostViewModel m){model=m;return this;}
    private String tag(Slot s){return model==null?s.virus:model.virusName(s.virus);}
}
