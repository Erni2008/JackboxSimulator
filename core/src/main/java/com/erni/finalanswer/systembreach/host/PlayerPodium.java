package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Slot;
import com.erni.finalanswer.systembreach.host.SystemBreachHostViewModel.Status;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/** One reusable terminal podium; every slot is drawn by the same code from its {@link Slot}. */
final class PlayerPodium {
    private final Color accent=new Color(),c=new Color();

    /** Status colour with the state's own motion: a controlled pulse while hacked, a fade-in after any change. */
    private float pulse(Slot s,float time){
        float in=Math.min(1,s.statusAge/.35f);
        return switch(s.status){
            case BEING_HACKED->in*(.62f+.38f*(.5f+.5f*MathUtils.sin(time*7.5f)));
            case COMPROMISED->in*(s.statusAge<1.2f?.55f+.45f*MathUtils.sin(s.statusAge*24):.62f);
            case UPGRADING->in*(.75f+.25f*MathUtils.sin(time*5));
            case DISCONNECTED->.35f;
            default->in*.9f;
        };
    }
    private Color accent(Slot s){return accent.set(s.leader&&s.status==Status.ONLINE?SbPaint.GOLD:SbPaint.tone(s.status));}

    /** Plinth, panel, icons and bars (ShapeRenderer, filled). */
    void shapes(SbPaint p,ShapeRenderer r,Slot s,float x,float time){
        float left=x-PANEL_W/2,a=pulse(s,time);Color ac=accent(s);boolean dim=s.status==Status.DISCONNECTED||s.status==Status.COMPROMISED;
        // plinth under the panel, with its light strip
        p.plate(left-8,PANEL_Y-PLINTH_H,PANEL_W+16,PLINTH_H+6,8,SbPaint.TRIM_DARK,c.set(.02f,.02f,.02f,1));
        p.plate(left-2,PANEL_Y-PLINTH_H+6,PANEL_W+4,PLINTH_H-14,6,c.set(.10f,.10f,.10f,1),c.set(.03f,.03f,.03f,1));
        r.setColor(ac.r,ac.g,ac.b,(dim?.35f:.95f)*Math.max(.4f,a));r.rect(x-PANEL_W*.28f,PANEL_Y-PLINTH_H+16,PANEL_W*.56f,5);
        // the panel
        p.frame(left,PANEL_Y,PANEL_W,PANEL_H,16,ac,dim?.45f:.25f+.75f*a);
        if(dim){r.setColor(0,0,0,.35f);r.rect(left+8,PANEL_Y+8,PANEL_W-16,PANEL_H-16);}
        // inner screen behind the status
        float sy=PANEL_Y+22;r.setColor(ac.r*.06f,ac.g*.06f,ac.b*.06f,.9f);r.rect(left+22,sy,PANEL_W-44,128);
        r.setColor(ac.r,ac.g,ac.b,.18f*a);r.rect(left+22,sy+126,PANEL_W-44,2);r.rect(left+22,sy,PANEL_W-44,2);
        // name divider and AP coins
        r.setColor(SbPaint.TRIM.r,SbPaint.TRIM.g,SbPaint.TRIM.b,.7f);r.rect(left+26,PANEL_Y+PANEL_H-50,PANEL_W-52,1.5f);
        p.coins(left+46,PANEL_Y+PANEL_H-76,14);
        // the status icon
        Color ic=c.set(ac).mul(1,1,1,Math.max(.45f,a));float iy=PANEL_Y+112;
        switch(s.status){
            case ONLINE->p.monitor(x,iy,34,ic);
            case BEING_HACKED->p.crosshair(x,iy,19+1.5f*MathUtils.sin(time*7.5f),ic);
            case RECOVERY->{p.gear(x,iy,18,ic);}
            case UPGRADING->p.shield(x,iy+4,20,ic);
            case COMPROMISED->p.warning(x,iy,21,ic);
            case DISCONNECTED->p.unplugged(x,iy,17,ic);
        }
        // upgrade sweep: a short scan line over the screen, no invented progress
        if(s.status==Status.UPGRADING&&s.statusAge<1.4f){float k=s.statusAge/1.4f;r.setColor(SbPaint.BLUE.r,SbPaint.BLUE.g,SbPaint.BLUE.b,.55f*(1-k));r.rect(left+22,sy+128*k,PANEL_W-44,3);}
        if(s.leader)p.crown(x,PANEL_Y+PANEL_H+4,40,SbPaint.GOLD);
    }

    /** Additive light: floor pool, rim glow; brighter for alarms, never blown out. */
    void glow(SpriteBatch b,SystemBreachHostAssets as,Slot s,float x,float time){
        Color ac=accent(s);float a=pulse(s,time),k=s.status==Status.DISCONNECTED?.25f:s.status==Status.BEING_HACKED||s.status==Status.COMPROMISED?.75f:.5f;
        b.setColor(ac.r,ac.g,ac.b,.35f*k*a);b.draw(as.glow,x-PANEL_W*.8f,PANEL_Y-PLINTH_H-40,PANEL_W*1.6f,90);
        b.setColor(ac.r,ac.g,ac.b,.16f*k*a);b.draw(as.glow,x-PANEL_W*.75f,PANEL_Y-40,PANEL_W*1.5f,PANEL_H+80);
        b.setColor(ac.r,ac.g,ac.b,.22f*a);b.draw(as.glow,x-60,PANEL_Y+22,120,128);
        if(s.reaction==SystemBreachHostViewModel.Reaction.HIT&&s.reactionAge<.7f){float f=1-s.reactionAge/.7f;b.setColor(1,.15f,.1f,.5f*f);b.draw(as.glow,x-PANEL_W,PANEL_Y,PANEL_W*2,PANEL_H+260);}
    }

    void text(SpriteBatch b,SbPaint p,SystemBreachHostAssets as,Slot s,float x,float time){
        float left=x-PANEL_W/2,top=PANEL_Y+PANEL_H;Color ac=accent(s);float a=s.status==Status.DISCONNECTED?.55f:1;
        p.centered(b,as.name,p.fit(as.name,s.name,PANEL_W-34),x,top-17,SbPaint.IVORY,a);
        float punch=1+.28f*Math.max(0,1-s.deltaAge/.35f);as.ap.getData().setScale(punch);p.text(b,as.ap,Math.round(s.shownAp)+" AP",left+70,top-58+(punch-1)*14,s.deltaAge<.35f?(s.delta>0?SbPaint.GREEN:SbPaint.RED):SbPaint.GOLD,a);as.ap.getData().setScale(1);
        String label=s.status.label;{
            float w=p.width(as.status,label);float pop=1+.35f*Math.max(0,1-s.statusAge/.28f);float scale=Math.min(1,(PANEL_W-30)/w)*pop;as.status.getData().setScale(scale);
            p.centered(b,as.status,label,x,PANEL_Y+70,ac,Math.max(.55f,pulse(s,time)));as.status.getData().setScale(1);
        }
        if(s.status==Status.UPGRADING)p.centered(b,as.labelSmall,"FIREWALL LV."+s.firewall,x,PANEL_Y+42,SbPaint.BLUE,.95f);
        else if(s.firewall>1&&s.status==Status.ONLINE)p.centered(b,as.labelSmall,"FW LV."+s.firewall,x,PANEL_Y+42,c.set(ac).mul(.8f,.8f,.8f,1),.8f);
        if(s.deltaAge<1.6f&&s.delta!=0){float k=s.deltaAge/1.6f;
            p.centered(b,as.ap,(s.delta>0?"+":"-")+Math.abs(s.delta)+" AP",x+40,top+18+k*46,s.delta>0?SbPaint.GREEN:SbPaint.RED,1-k*k);}
    }
}
