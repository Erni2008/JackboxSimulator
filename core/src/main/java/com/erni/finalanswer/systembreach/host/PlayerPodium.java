package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Slot;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Status;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/**
 * One reusable player card. Broadcast layout, top to bottom: name, AP, status emblem (vector icon in a lit ring),
 * status badge; under it a plinth with an LED strip. One accent colour per state drives every lit part.
 */
final class PlayerPodium {
    static final float RING_Y=94,RING_R=25,BADGE_Y=30,BADGE_H=28;
    private static final int LEDS=9;
    private static final Color BADGE_TEXT=new Color(.03f,.04f,.03f,1);
    private final Color accent=new Color(),c=new Color(),c2=new Color();

    float pulse(Slot s,float time){
        float in=Math.min(1,s.statusAge/.35f);
        return switch(s.status){
            case BEING_HACKED->in*(.62f+.38f*(.5f+.5f*MathUtils.sin(time*7.5f)));
            case COMPROMISED->in*(s.statusAge<1.2f?.55f+.45f*MathUtils.sin(s.statusAge*24):.62f);
            case UPGRADING->in*(.75f+.25f*MathUtils.sin(time*5));
            case DISCONNECTED->.35f;
            default->in*.9f;
        };
    }
    /** Podium colours for the top three while they are online: gold, silver, bronze. */
    Color accent(Slot s){
        if(s.status==Status.ONLINE&&s.ap>0){if(s.leader)return accent.set(SbPaint.GOLD);if(s.rank==2)return accent.set(SbPaint.SILVER);if(s.rank==3)return accent.set(SbPaint.BRONZE);}
        return accent.set(SbPaint.tone(s.status));
    }
    static char glyph(Status s){
        return switch(s){case ONLINE->SbIcons.ONLINE;case BEING_HACKED->SbIcons.HACK;case RECOVERY->SbIcons.RECOVERY;
            case UPGRADING->SbIcons.FIREWALL;case COMPROMISED->SbIcons.COMPROMISED;case DISCONNECTED->SbIcons.OFFLINE;};
    }

    void shapes(SbPaint p,ShapeRenderer r,Slot s,float x,float time){
        float left=x-PANEL_W/2,right=x+PANEL_W/2,top=PANEL_Y+PANEL_H,a=pulse(s,time);Color ac=accent(s);
        boolean dim=s.status==Status.DISCONNECTED||s.status==Status.COMPROMISED;
        r.setColor(0,0,0,.45f);r.ellipse(x-PANEL_W*.72f,PANEL_Y-PLINTH_H-16,PANEL_W*1.44f,34,24);
        float py=PANEL_Y-PLINTH_H;c.set(.13f,.11f,.09f,1);
        r.triangle(left-16,py,right+16,py,right+6,PANEL_Y,SbPaint.TRIM_DARK,SbPaint.TRIM_DARK,c);
        r.triangle(left-16,py,right+6,PANEL_Y,left-6,PANEL_Y,SbPaint.TRIM_DARK,c,c);
        r.setColor(SbPaint.TRIM_LIGHT.r,SbPaint.TRIM_LIGHT.g,SbPaint.TRIM_LIGHT.b,.55f);r.rect(left-6,PANEL_Y-2,PANEL_W+12,2);
        r.setColor(.02f,.02f,.02f,1);r.rect(left+14,py+12,PANEL_W-28,14);
        float lw=(PANEL_W-40)/LEDS;int chase=(int)(time*14);
        for(int i=0;i<LEDS;i++){
            float on=switch(s.status){
                case BEING_HACKED->Math.floorMod(chase-i,LEDS)<2?1:.18f;
                case RECOVERY,UPGRADING->.25f+.75f*Math.max(0,MathUtils.sin(time*4-i*.6f));
                case DISCONNECTED->.08f;case COMPROMISED->(int)(time*3)%2==0?.9f:.2f;
                default->.75f;};
            r.setColor(ac.r*on,ac.g*on,ac.b*on,1);r.rect(left+20+i*lw+1,py+15,lw-3,8);
        }
        p.frame(left,PANEL_Y,PANEL_W,PANEL_H,14,ac,dim?.35f:.25f+.6f*a);
        r.setColor(ac.r,ac.g,ac.b,dim?.35f:.85f);r.rect(left+22,top-9,PANEL_W-44,3);
        if(dim){r.setColor(0,0,0,.35f);r.rect(left+7,PANEL_Y+7,PANEL_W-14,PANEL_H-14);}
        r.setColor(0,0,0,.5f);r.rect(left+18,top-84,PANEL_W-36,32);
        r.setColor(SbPaint.GOLD.r,SbPaint.GOLD.g,SbPaint.GOLD.b,.22f);r.rect(left+18,top-53,PANEL_W-36,1);r.rect(left+18,top-84,PANEL_W-36,1);
        float cy=PANEL_Y+RING_Y;
        r.setColor(0,0,0,.65f);r.circle(x,cy,RING_R+4,40);
        c.set(ac.r*.22f,ac.g*.22f,ac.b*.22f,1);c2.set(ac.r*.05f,ac.g*.05f,ac.b*.05f,1);
        r.setColor(c);r.circle(x,cy,RING_R-1,40);r.setColor(c2);r.circle(x,cy-3,RING_R-6,40);
        r.setColor(ac.r,ac.g,ac.b,.35f+.65f*a);p.ring(x,cy,RING_R,2.5f);
        if(s.status==Status.BEING_HACKED||s.status==Status.RECOVERY||s.status==Status.UPGRADING){
            float start=time*(s.status==Status.BEING_HACKED?260:140);r.setColor(ac.r,ac.g,ac.b,.95f);
            for(int k=0;k<2;k++){float a0=(start+k*180)*MathUtils.degRad;for(int j=0;j<10;j++){float u=a0+j*.07f,v=u+.07f;
                r.rectLine(x+MathUtils.cos(u)*(RING_R+6),cy+MathUtils.sin(u)*(RING_R+6),x+MathUtils.cos(v)*(RING_R+6),cy+MathUtils.sin(v)*(RING_R+6),3);}}
        }
        float bw=PANEL_W-40,bx=x-bw/2,by=PANEL_Y+BADGE_Y;float fill=s.status==Status.DISCONNECTED?.35f:.6f+.4f*a;
        p.plate(bx,by,bw,BADGE_H,9,c.set(ac.r*fill,ac.g*fill,ac.b*fill,.97f),c2.set(ac.r*fill*.6f,ac.g*fill*.6f,ac.b*fill*.6f,.97f));
        r.setColor(1,1,1,.2f);r.rect(bx+9,by+BADGE_H-6,bw-18,2);
        if(s.leader)p.crown(x,top+6,30,SbPaint.GOLD);
        // place badge: hexagon on the top-left corner, podium colours for the top three
        {Color rc=s.rank==1?SbPaint.GOLD:s.rank==2?SbPaint.SILVER:s.rank==3?SbPaint.BRONZE:c2.set(.35f,.55f,.45f,1);float hx=left+4,hy=top-4,k=1+.35f*Math.max(0,1-s.rankAge/.4f),R=17*k;
         r.setColor(0,0,0,.6f);hex(r,hx+1,hy-2,R+3);r.setColor(rc);hex(r,hx,hy,R+1.5f);r.setColor(.05f,.05f,.05f,1);hex(r,hx,hy,R-1.5f);}
        // multiplier chip on the top-right corner
        if(s.multiplier>1){float k=1+.5f*Math.max(0,1-s.multAge/.5f),w=40*k,h=24*k,mx=right-w/2-2,my=top-2;
         r.setColor(0,0,0,.6f);r.rect(mx-w/2+2,my-h/2-3,w,h);p.plate(mx-w/2,my-h/2,w,h,6,SbPaint.GOLD,c2.set(.75f,.5f,.1f,1));}
    }

    void glow(SpriteBatch b,SystemBreachHostAssets as,Slot s,float x,float time){
        Color ac=accent(s);float a=pulse(s,time),k=s.status==Status.DISCONNECTED?.25f:s.status==Status.BEING_HACKED||s.status==Status.COMPROMISED?.8f:.55f;
        b.setColor(ac.r,ac.g,ac.b,.45f*k*a);b.draw(as.glow,x-PANEL_W*.75f,PANEL_Y-PLINTH_H-30,PANEL_W*1.5f,70);
        b.setColor(ac.r,ac.g,ac.b,.12f*k*a);b.draw(as.glow,x-PANEL_W*.7f,PANEL_Y-30,PANEL_W*1.4f,PANEL_H+60);
        b.setColor(ac.r,ac.g,ac.b,.40f*a);b.draw(as.glow,x-54,PANEL_Y+RING_Y-54,108,108);
        b.setColor(ac.r,ac.g,ac.b,.30f*a);b.draw(as.glow,x-PANEL_W*.55f,PANEL_Y+PANEL_H-14,PANEL_W*1.1f,26);
        if(s.reaction==SystemBreachHostViewModel.Reaction.HIT&&s.reactionAge<.7f){float f=1-s.reactionAge/.7f;b.setColor(1,.15f,.1f,.5f*f);b.draw(as.glow,x-PANEL_W,PANEL_Y,PANEL_W*2,PANEL_H+240);}
    }

    void text(SpriteBatch b,SbPaint p,SystemBreachHostAssets as,Slot s,float x,float time){
        float top=PANEL_Y+PANEL_H;Color ac=accent(s);float a=s.status==Status.DISCONNECTED?.55f:1;
        p.centered(b,as.name,p.fit(as.name,s.name,PANEL_W-34),x,top-15,SbPaint.IVORY,a);
        float punch=1+.28f*Math.max(0,1-s.deltaAge/.35f);as.ap.getData().setScale(punch);
        String ap=s.apText();float tw=p.width(as.ap,ap),gw=26,gx=x-(tw+gw+6)/2;
        p.icon(b,as.iconSmall,SbIcons.COIN,gx+gw/2,top-68,SbPaint.GOLD,a,1,0);
        p.text(b,as.ap,ap,gx+gw+6,top-55+(punch-1)*14,s.deltaAge<.35f?(s.delta>0?SbPaint.GREEN:SbPaint.RED):SbPaint.GOLD,a);as.ap.getData().setScale(1);
        float pop=1+.25f*Math.max(0,1-s.statusAge/.28f);
        p.icon(b,as.icon,glyph(s.status),x,PANEL_Y+RING_Y,ac,Math.max(.6f,pulse(s,time))*a,pop*.78f,s.status==Status.RECOVERY?-time*120:0);
        if(s.firewall>1&&s.status!=Status.DISCONNECTED){
            p.icon(b,as.iconTiny,SbIcons.FIREWALL,x+RING_R+22,PANEL_Y+RING_Y+12,SbPaint.BLUE,.95f,1,0);
            p.centered(b,as.labelSmall,s.firewallShort(),x+RING_R+22,PANEL_Y+RING_Y-6,SbPaint.BLUE,.95f);}
        String label=s.status.label(s.russianText);float w=p.width(as.status,label);
        as.status.getData().setScale(Math.min(1,(PANEL_W-60)/w)*(1+.2f*Math.max(0,1-s.statusAge/.28f)));
        p.centered(b,as.status,label,x,PANEL_Y+BADGE_Y+BADGE_H/2+as.status.getCapHeight()/2,s.status==Status.DISCONNECTED?SbPaint.IVORY:BADGE_TEXT,s.status==Status.DISCONNECTED?.7f:1);
        as.status.getData().setScale(1);
        if(s.deltaAge<1.6f&&s.delta!=0){float k=s.deltaAge/1.6f;
            p.centered(b,as.ap,s.deltaText(),x+40,top+22+k*46,s.delta>0?SbPaint.GREEN:SbPaint.RED,1-k*k);}
        {Color rc=s.rank==1?SbPaint.GOLD:s.rank==2?SbPaint.SILVER:s.rank==3?SbPaint.BRONZE:SbPaint.IVORY;p.centered(b,as.status,s.rankText(),x-PANEL_W/2+4,top-4+as.status.getCapHeight()/2,rc,1);}
        if(s.multiplier>1)p.centered(b,as.status,s.multText(),x+PANEL_W/2-22,top-2+as.status.getCapHeight()/2,c.set(.12f,.07f,0,1),1);
    }
    private static void hex(ShapeRenderer r,float x,float y,float R){for(int i=0;i<6;i++){float a=i*60*MathUtils.degRad,b=(i+1)*60*MathUtils.degRad;r.triangle(x,y,x+MathUtils.cos(a)*R,y+MathUtils.sin(a)*R,x+MathUtils.cos(b)*R,y+MathUtils.sin(b)*R);}}
}
