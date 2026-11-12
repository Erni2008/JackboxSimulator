package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Status;
import java.util.List;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/**
 * The terminal layer: scrolling hex dumps on every podium screen, CRT scanlines, data links between an attacker and
 * its target with packets running along them, and a short RGB-split glitch. All decorative; it reads only public state.
 * Strings are prebuilt so nothing is allocated per frame.
 */
final class HackerFx {
    private static final int LINES=64;private final String[] hex=new String[LINES];
    private final Color c=new Color();
    HackerFx(){
        var r=new java.util.Random(7);String d="0123456789ABCDEF";
        for(int i=0;i<LINES;i++){StringBuilder b=new StringBuilder();for(int w=0;w<4;w++){if(w>0)b.append(' ');for(int k=0;k<2;k++)b.append(d.charAt(r.nextInt(16)));}hex[i]=b.toString();}
    }

    /** Hex dump scrolling up behind the status icon; faster and red while under attack. */
    void podiumCode(SpriteBatch b,SystemBreachHostAssets as,SystemBreachHostViewModel.Slot s,int seat,float x,float time,Color tone){
        if(s.status==Status.DISCONNECTED)return;
        float speed=s.status==Status.BEING_HACKED?60:s.status==Status.RECOVERY||s.status==Status.UPGRADING?34:14,rows=6,lh=17,top=PANEL_Y+PlayerPodium.SCREEN_Y+PlayerPodium.SCREEN_H-2;
        float scroll=(time*speed+seat*53)%lh;int first=(int)((time*speed+seat*53)/lh);
        for(int i=0;i<rows;i++){float y=top-i*lh+scroll;if(y>top||y-lh<PANEL_Y+PlayerPodium.SCREEN_Y+4)continue;
            float a=.09f*(1-Math.abs(i-rows/2f)/(rows/2f+1));
            as.hex.setColor(tone.r,tone.g,tone.b,a);as.hex.draw(b,hex[(first+i+seat*9)%LINES],x-PANEL_W/2+26,y);}
    }

    /** CRT scanlines across a screen rectangle (filled mode). */
    void scanlines(ShapeRenderer r,float x,float y,float w,float h,float alpha,float time){
        r.setColor(0,0,0,alpha);for(float yy=y;yy<y+h;yy+=3)r.rect(x,yy,w,1.1f);
        float band=y+((time*40)%(h+30))-15;if(band>y&&band<y+h-6){r.setColor(1,1,1,.035f);r.rect(x,band,w,6);}
    }

    private float bez(float a,float b,float c2,float t){float u=1-t;return u*u*a+2*u*t*c2+t*t*b;}
    /** Data links over the line-up: a red arc from attacker to target, packets travelling toward the target. */
    void attackLinks(ShapeRenderer r,List<SystemBreachHostViewModel.Attack> attacks,SystemBreachHostViewModel vm,int n,float time){
        float y0=panelTop()+6;
        for(var at:attacks){
            int from=vm.seat(at.attackerId()),to=vm.seat(at.targetId());if(from<0||to<0)continue;
            float ax=slotX(from,n),bx=slotX(to,n),cx=(ax+bx)/2,cy=y0+90+Math.abs(bx-ax)*.22f;
            int seg=36;float px=ax,py=y0;
            for(int i=1;i<=seg;i++){float t=i/(float)seg,x=bez(ax,bx,cx,t),y=bez(y0,y0,cy,t);
                float flick=.55f+.45f*MathUtils.sin(time*14-t*20);
                r.setColor(1,.15f,.1f,.30f*flick);r.rectLine(px,py,x,y,5);r.setColor(1,.55f,.45f,.75f*flick);r.rectLine(px,py,x,y,1.6f);px=x;py=y;}
            for(int k=0;k<5;k++){float t=((time*.55f)+k/5f)%1f,x=bez(ax,bx,cx,t),y=bez(y0,y0,cy,t);
                r.setColor(1,.9f,.8f,.95f);r.rect(x-3,y-3,6,6);r.setColor(1,.2f,.15f,.6f);r.rect(x-6,y-1,3,2);}
            r.setColor(1,.25f,.2f,.9f);p(r,bx,y0);
        }
    }
    private void p(ShapeRenderer r,float x,float y){r.triangle(x-9,y+14,x+9,y+14,x,y+2);}
    void attackGlow(SpriteBatch b,SystemBreachHostAssets as,List<SystemBreachHostViewModel.Attack> attacks,SystemBreachHostViewModel vm,int n,float time){
        float y0=panelTop()+6;
        for(var at:attacks){int from=vm.seat(at.attackerId()),to=vm.seat(at.targetId());if(from<0||to<0)continue;
            float ax=slotX(from,n),bx=slotX(to,n);
            for(int k=0;k<5;k++){float t=((time*.55f)+k/5f)%1f,cx=(ax+bx)/2,cy=y0+90+Math.abs(bx-ax)*.22f,x=bez(ax,bx,cx,t),y=bez(y0,y0,cy,t);
                b.setColor(1,.2f,.12f,.45f);b.draw(as.glow,x-22,y-22,44,44);}
            b.setColor(1,.15f,.1f,.35f+.15f*MathUtils.sin(time*9));b.draw(as.glow,bx-70,y0-40,140,90);}
    }

    /** 0 most of the time; a short burst every few seconds drives the RGB-split title glitch. */
    static float glitch(float time){float t=time%5.3f;return t<.18f?1-t/.18f:t>2.6f&&t<2.68f?.6f:0;}
}
