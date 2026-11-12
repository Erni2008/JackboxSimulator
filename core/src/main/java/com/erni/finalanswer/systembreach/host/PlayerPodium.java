package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Slot;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Status;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/**
 * One reusable terminal podium drawn from its {@link Slot}: a lit top cap, bronze side rails, a glass screen with
 * corner brackets and reflection, and a plinth with an LED strip that chases while the player is under attack.
 */
final class PlayerPodium {
    /** Offsets inside the panel (from PANEL_Y). */
    static final float SCREEN_Y=18,SCREEN_H=110,ICON_Y=100,STATUS_Y=60,SUB_Y=36;
    private static final int LEDS=9;
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
    Color accent(Slot s){return accent.set(s.leader&&s.status==Status.ONLINE?SbPaint.GOLD:SbPaint.tone(s.status));}

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
        c.set(.20f,.17f,.13f,1);c2.set(.09f,.08f,.07f,1);
        r.triangle(left-4,top,right+4,top,right-12,top+12,c,c,c2);
        r.triangle(left-4,top,right-12,top+12,left+12,top+12,c,c2,c2);
        r.setColor(ac.r,ac.g,ac.b,.55f*a);r.rect(left+12,top+11,PANEL_W-24,1.5f);
        p.frame(left,PANEL_Y,PANEL_W,PANEL_H,14,ac,dim?.4f:.3f+.7f*a);
        for(int side=-1;side<=1;side+=2){float rx=side<0?left-7:right-1;
            r.setColor(SbPaint.TRIM_DARK);r.rect(rx,PANEL_Y+26,8,PANEL_H-52);r.setColor(SbPaint.TRIM);r.rect(rx+1,PANEL_Y+28,6,PANEL_H-56);
            r.setColor(ac.r,ac.g,ac.b,.8f*a);r.rect(rx+3,PANEL_Y+40,2,PANEL_H-80);}
        if(dim){r.setColor(0,0,0,.35f);r.rect(left+7,PANEL_Y+7,PANEL_W-14,PANEL_H-14);}
        float sx=left+20,sy=PANEL_Y+SCREEN_Y,sw=PANEL_W-40;
        c.set(ac.r*.03f,ac.g*.03f,ac.b*.03f,.95f);c2.set(ac.r*.12f,ac.g*.12f,ac.b*.12f,.95f);
        r.rect(sx,sy,sw,SCREEN_H,c,c,c2,c2);
        r.setColor(1,1,1,.05f);r.triangle(sx,sy+SCREEN_H,sx+sw*.55f,sy+SCREEN_H,sx,sy+SCREEN_H*.35f);
        float bl=14;r.setColor(ac.r,ac.g,ac.b,.5f+.5f*a);
        r.rect(sx,sy,bl,2);r.rect(sx,sy,2,bl);r.rect(sx+sw-bl,sy,bl,2);r.rect(sx+sw-2,sy,2,bl);
        r.rect(sx,sy+SCREEN_H-2,bl,2);r.rect(sx,sy+SCREEN_H-bl,2,bl);r.rect(sx+sw-bl,sy+SCREEN_H-2,bl,2);r.rect(sx+sw-2,sy+SCREEN_H-bl,2,bl);
        r.setColor(SbPaint.TRIM.r,SbPaint.TRIM.g,SbPaint.TRIM.b,.7f);r.rect(left+24,top-46,PANEL_W-48,1.5f);
        p.coins(left+44,top-70,13);
        Color ic=c.set(ac).mul(1,1,1,Math.max(.45f,a));float iy=PANEL_Y+ICON_Y;
        switch(s.status){
            case ONLINE->p.monitor(x,iy,30,ic);
            case BEING_HACKED->p.crosshair(x,iy,17+1.5f*MathUtils.sin(time*7.5f),ic);
            case RECOVERY->p.gear(x,iy,16,ic);
            case UPGRADING->p.shield(x,iy+3,18,ic);
            case COMPROMISED->p.warning(x,iy,19,ic);
            case DISCONNECTED->p.unplugged(x,iy,15,ic);
        }
        if(s.status==Status.UPGRADING&&s.statusAge<1.4f){float k=s.statusAge/1.4f;r.setColor(SbPaint.BLUE.r,SbPaint.BLUE.g,SbPaint.BLUE.b,.55f*(1-k));r.rect(sx,sy+SCREEN_H*k,sw,3);}
        if(s.leader)p.crown(x,top+14,34,SbPaint.GOLD);
    }

    void glow(SpriteBatch b,SystemBreachHostAssets as,Slot s,float x,float time){
        Color ac=accent(s);float a=pulse(s,time),k=s.status==Status.DISCONNECTED?.25f:s.status==Status.BEING_HACKED||s.status==Status.COMPROMISED?.8f:.55f;
        b.setColor(ac.r,ac.g,ac.b,.45f*k*a);b.draw(as.glow,x-PANEL_W*.75f,PANEL_Y-PLINTH_H-30,PANEL_W*1.5f,70);
        b.setColor(ac.r,ac.g,ac.b,.14f*k*a);b.draw(as.glow,x-PANEL_W*.7f,PANEL_Y-30,PANEL_W*1.4f,PANEL_H+60);
        b.setColor(ac.r,ac.g,ac.b,.25f*a);b.draw(as.glow,x-56,PANEL_Y+SCREEN_Y,112,SCREEN_H);
        b.setColor(ac.r,ac.g,ac.b,.30f*a);b.draw(as.glow,x-PANEL_W*.55f,PANEL_Y+PANEL_H-4,PANEL_W*1.1f,26);
        if(s.reaction==SystemBreachHostViewModel.Reaction.HIT&&s.reactionAge<.7f){float f=1-s.reactionAge/.7f;b.setColor(1,.15f,.1f,.5f*f);b.draw(as.glow,x-PANEL_W,PANEL_Y,PANEL_W*2,PANEL_H+240);}
    }

    void text(SpriteBatch b,SbPaint p,SystemBreachHostAssets as,Slot s,float x,float time){
        float left=x-PANEL_W/2,top=PANEL_Y+PANEL_H;Color ac=accent(s);float a=s.status==Status.DISCONNECTED?.55f:1;
        p.centered(b,as.name,p.fit(as.name,s.name,PANEL_W-34),x,top-15,SbPaint.IVORY,a);
        float punch=1+.28f*Math.max(0,1-s.deltaAge/.35f);as.ap.getData().setScale(punch);
        p.text(b,as.ap,s.apText(),left+64,top-53+(punch-1)*14,s.deltaAge<.35f?(s.delta>0?SbPaint.GREEN:SbPaint.RED):SbPaint.GOLD,a);as.ap.getData().setScale(1);
        float w=p.width(as.status,s.status.label),pop=1+.35f*Math.max(0,1-s.statusAge/.28f);
        as.status.getData().setScale(Math.min(1,(PANEL_W-34)/w)*pop);p.centered(b,as.status,s.status.label,x,PANEL_Y+STATUS_Y,ac,Math.max(.55f,pulse(s,time)));as.status.getData().setScale(1);
        if(s.status==Status.UPGRADING)p.centered(b,as.labelSmall,s.firewallText(),x,PANEL_Y+SUB_Y,SbPaint.BLUE,.95f);
        else if(s.firewall>1&&s.status==Status.ONLINE)p.centered(b,as.labelSmall,s.firewallText(),x,PANEL_Y+SUB_Y,c.set(ac).mul(.8f,.8f,.8f,1),.8f);
        if(s.deltaAge<1.6f&&s.delta!=0){float k=s.deltaAge/1.6f;
            p.centered(b,as.ap,s.deltaText(),x+40,top+22+k*46,s.delta>0?SbPaint.GREEN:SbPaint.RED,1-k*k);}
    }
}
