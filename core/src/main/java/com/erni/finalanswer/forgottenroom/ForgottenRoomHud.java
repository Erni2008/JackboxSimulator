package com.erni.finalanswer.forgottenroom;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Align;
import java.util.*;

/**
 * Typography and gilt furniture over the room: title card, countdown ring, player plaques, reveal captions and the
 * results table. Everything sits in the top band or the bottom band so it never covers the objects during play.
 */
final class ForgottenRoomHud {
    static final float W=ForgottenRoomRenderer.W,H=ForgottenRoomRenderer.H;
    static final Color GOLD=new Color(.93f,.80f,.53f,1),IVORY=new Color(.97f,.92f,.82f,1),DIM=new Color(.62f,.54f,.44f,1),EMBER=new Color(.92f,.32f,.27f,1);
    private final ForgottenRoomArt art;private final BitmapFont title,body;private final GlyphLayout layout=new GlyphLayout();
    private final TextureRegion dot;

    ForgottenRoomHud(ForgottenRoomArt art,BitmapFont title,BitmapFont body){this.art=art;this.title=title;this.body=body;dot=new TextureRegion(art.pixel);}

    static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}

    // ---------- primitives ----------
    void text(SpriteBatch b,BitmapFont f,String s,float cx,float y,float scale,Color c,float alpha){
        f.getData().setScale(scale);f.setColor(0,0,0,.7f*alpha);layout.setText(f,s);f.draw(b,s,cx-layout.width/2+2,y-2);
        f.setColor(c.r,c.g,c.b,alpha);f.draw(b,s,cx-layout.width/2,y);f.getData().setScale(1);}
    void wrapped(SpriteBatch b,BitmapFont f,String s,float cx,float y,float width,float scale,Color c,float alpha){
        f.getData().setScale(scale);f.setColor(c.r,c.g,c.b,alpha);layout.setText(f,s,f.getColor(),width,Align.center,true);f.draw(b,layout,cx-width/2,y);f.getData().setScale(1);}
    void diamond(SpriteBatch b,float cx,float cy,float r,Color c,float alpha){b.setColor(c.r,c.g,c.b,alpha);b.draw(dot,cx-r*.707f,cy-r*.707f,r*.707f,r*.707f,r*1.414f,r*1.414f,1,1,45);b.setColor(1,1,1,1);}
    /** A gilt rule with a diamond in the middle. */
    void rule(SpriteBatch b,float cx,float y,float width,float alpha){
        for(int i=0;i<24;i++){float t=i/23f,a=alpha*(1-Math.abs(t-.5f)*2)*.9f;b.setColor(GOLD.r,GOLD.g,GOLD.b,a);b.draw(art.pixel,cx-width/2+t*width-width/48,y,width/24+1,1.5f);}
        diamond(b,cx,y+.75f,6,GOLD,alpha);}
    /** Dark lacquered plaque with a double gilt border and corner diamonds. */
    void plaque(SpriteBatch b,float x,float y,float w,float h,float alpha,boolean lit){
        b.setColor(0,0,0,.45f*alpha);b.draw(art.pixel,x+5,y-7,w,h);
        b.setColor(.05f,.03f,.035f,.9f*alpha);b.draw(art.pixel,x,y,w,h);
        for(int k=0;k<6;k++){b.setColor(lit?.34f:.16f,lit?.09f:.10f,lit?.08f:.08f,(.08f+.05f*k)*alpha);b.draw(art.pixel,x,y+h*(.45f+k*.09f),w,h*.09f+1);}
        b.setColor(GOLD.r,GOLD.g,GOLD.b,alpha);float t=2;b.draw(art.pixel,x,y,w,t);b.draw(art.pixel,x,y+h-t,w,t);b.draw(art.pixel,x,y,t,h);b.draw(art.pixel,x+w-t,y,t,h);
        b.setColor(GOLD.r,GOLD.g,GOLD.b,.35f*alpha);float i=7;b.draw(art.pixel,x+i,y+i,w-2*i,1);b.draw(art.pixel,x+i,y+h-i,w-2*i,1);b.draw(art.pixel,x+i,y+i,1,h-2*i);b.draw(art.pixel,x+w-i,y+i,1,h-2*i);
        diamond(b,x,y,6,GOLD,alpha);diamond(b,x+w,y,6,GOLD,alpha);diamond(b,x,y+h,6,GOLD,alpha);diamond(b,x+w,y+h,6,GOLD,alpha);b.setColor(1,1,1,1);}
    /** Countdown ring: gilt ticks, a draining arc (ember in the last seconds) and the seconds in the middle. */
    void ring(SpriteBatch b,float cx,float cy,float r,float fraction,int seconds,float alpha){
        boolean urgent=seconds<=3;float pulse=urgent?1+.06f*MathUtils.sin(System.nanoTime()/1e9f*12):1;
        b.setColor(0,0,0,.55f*alpha);b.draw(art.soft,cx-r*1.6f,cy-r*1.6f,r*3.2f,r*3.2f);
        for(int i=0;i<60;i++){float a=90-i*6;boolean on=i<Math.round(fraction*60);float rr=r*pulse;
            Color c=on?(urgent?EMBER:GOLD):DIM;float len=i%5==0?11:6;b.setColor(c.r,c.g,c.b,(on?1:.35f)*alpha);
            b.draw(dot,cx+MathUtils.cosDeg(a)*rr-1.5f,cy+MathUtils.sinDeg(a)*rr-len/2,1.5f,len/2,3,len,1,1,a-90);}
        text(b,title,String.valueOf(seconds),cx,cy+26,.95f*pulse,urgent?EMBER:IVORY,alpha);}

    // ---------- scenes ----------
    void intro(SpriteBatch b,float t,String roomName){
        float a=ease(t/1.2f)*(1-ease((t-3.6f)/.9f));if(a<=0)return;
        b.setColor(0,0,0,.55f*a);b.draw(art.soft,W/2-900,H/2-420,1800,840);b.setColor(1,1,1,1);
        float s=1.06f-.06f*ease(t/2.5f);
        text(b,title,"THE FORGOTTEN ROOM",W/2,H/2+90,1.55f*s,GOLD,a);
        rule(b,W/2,H/2+8,520,a);
        text(b,body,"REMEMBER EVERYTHING.  TRUST NOTHING.",W/2,H/2-30,.95f,IVORY,a*ease((t-.6f)/1f));
        text(b,body,roomName.toUpperCase(Locale.ROOT),W/2,H/2-82,.7f,DIM,a*ease((t-1.2f)/1f));
    }
    void topBand(SpriteBatch b,float alpha){b.setColor(0,0,0,.6f*alpha);b.draw(art.soft,W/2-1000,H-170,2000,340);b.setColor(1,1,1,1);}
    void observation(SpriteBatch b,float fraction,int seconds,float alpha){
        topBand(b,alpha);text(b,body,"ЗАПОМИНАЙТЕ",W/2,H-30,.8f,GOLD,alpha);ring(b,W/2,H-100,46,fraction,seconds,alpha);}
    void changedRoom(SpriteBatch b,float t){float a=ease((t-.3f)/.8f);topBand(b,a);text(b,title,"СВЕТ ВЕРНУЛСЯ",W/2,H-44,.85f,GOLD,a);text(b,body,"ЧТО-ТО ИЗМЕНИЛОСЬ",W/2,H-104,.78f,IVORY,a*ease((t-.7f)/.6f));}
    void answering(SpriteBatch b,ForgottenRoomModel m,float fraction,int seconds){
        topBand(b,1);text(b,body,"ЧТО ИЗМЕНИЛОСЬ?  ОТВЕЧАЙТЕ НА ТЕЛЕФОНАХ",W/2,H-30,.72f,GOLD,1);ring(b,W/2,H-100,46,fraction,seconds,1);
        text(b,body,m.submitted.size()+" / "+m.seats.size()+"  ОТВЕТИЛИ",W/2,H-168,.62f,IVORY,1);
        players(b,m);}
    /** Player plaques along the bottom: a gilt seal once the answer is in (never whether it is right). */
    void players(SpriteBatch b,ForgottenRoomModel m){
        int n=m.seats.size();float pw=Math.min(210,(W-160)/n-14),ph=58,gap=14,total=n*pw+(n-1)*gap,x0=(W-total)/2,y=26;
        b.setColor(0,0,0,.55f);b.draw(art.soft,W/2-total*.7f,-90,total*1.4f,250);
        for(int i=0;i<n;i++){String id=m.seats.get(i);boolean done=m.submitted.contains(id);float x=x0+i*(pw+gap);
            plaque(b,x,y,pw,ph,done?1:.75f,done);
            text(b,body,m.name(id),x+pw/2+(done?12:0),y+38,.62f,done?IVORY:DIM,1);
            if(done)diamond(b,x+22,y+ph/2,9,GOLD,1);}
    }
    void revealTitle(SpriteBatch b,float t){float a=ease(t/.6f);text(b,title,"WHAT DID YOU MISS?",W/2,H/2+40,1.35f,GOLD,a);rule(b,W/2,H/2-30,460,a);
        text(b,body,"ЧТО ВЫ ПРОПУСТИЛИ",W/2,H/2-60,.75f,IVORY,a*ease((t-.4f)/.6f));}
    void revealCaption(SpriteBatch b,ForgottenRoomModel m,ForgottenRoomModel.Change c,int index,float t){
        float a=ease((t-.15f)/.5f)*(1-ease((t-.93f)/.07f));if(a<=0)return;
        // keep the caption away from the change: bottom band normally, top band when the change sits low in the room
        float low=0;for(String slot:c.slots()){var p=m.places.get(slot);if(p!=null)low=Math.max(low,p.y());}
        float w=1220,h=172,x=(W-w)/2,y=low>.62f?H-h-30:26;
        plaque(b,x,y,w,h,a,!c.foundBy().isEmpty());
        text(b,body,"ИЗМЕНЕНИЕ "+(index+1)+" ИЗ "+m.changes.size(),W/2,y+h-20,.5f,DIM,a);
        text(b,title,c.caption(),W/2,y+h-50,.68f,GOLD,a);
        String found=c.foundBy().isEmpty()?"НИКТО НЕ ЗАМЕТИЛ":"ЗАМЕТИЛИ:  "+String.join(",  ",c.foundBy().stream().map(m::name).toList());
        text(b,body,found,W/2,y+68,.72f,c.foundBy().isEmpty()?EMBER:IVORY,a*ease((t-.45f)/.3f));
        if(!c.closeBy().isEmpty())text(b,body,"ПОЧТИ УГАДАЛИ:  "+String.join(",  ",c.closeBy().stream().map(m::name).toList()),W/2,y+36,.56f,DIM,a*ease((t-.55f)/.3f));
    }
    /** Final table with points counting up, rows arriving one after another. */
    void results(SpriteBatch b,ForgottenRoomModel m,float t){
        float a=ease(t/.6f);b.setColor(0,0,0,.72f*a);b.draw(art.pixel,0,0,W,H);b.setColor(1,1,1,1);
        text(b,title,"THE FORGOTTEN ROOM",W/2,H-90,1.1f,GOLD,a);rule(b,W/2,H-150,420,a);text(b,body,"ИТОГИ",W/2,H-176,.7f,IVORY,a);
        int n=m.results.size();float rowH=Math.min(86,640f/Math.max(1,n)),w=980,x=(W-w)/2,top=H-230;
        for(int i=0;i<n;i++){var r=m.results.get(i);float ra=ease((t-.5f-i*.22f)/.45f);if(ra<=0)continue;float y=top-(i+1)*rowH;
            plaque(b,x,y+6,w,rowH-14,ra,r.rank()==1);
            text(b,title,String.valueOf(r.rank()),x+56,y+rowH*.72f,.72f,r.rank()==1?GOLD:IVORY,ra);
            float nameX=x+120;body.getData().setScale(.78f);body.setColor(IVORY.r,IVORY.g,IVORY.b,ra);body.draw(b,m.name(r.playerId()),nameX,y+rowH*.68f);
            body.getData().setScale(.52f);body.setColor(DIM.r,DIM.g,DIM.b,ra);body.draw(b,"ВЕРНО "+r.correct()+(r.partial()>0?"  ·  ПОЧТИ "+r.partial():"")+(r.submitted()?"":"  ·  НЕ ОТВЕТИЛ"),nameX,y+rowH*.36f);body.getData().setScale(1);
            int shown=Math.round(r.points()*ease((t-.8f-i*.22f)/1.4f));
            text(b,title,shown+"",x+w-110,y+rowH*.72f,.72f,r.rank()==1?GOLD:IVORY,ra);}
        if(t>2.5f)text(b,body,"ENTER — ВЕРНУТЬСЯ В ЛОББИ",W/2,46,.55f,DIM,ease((t-2.5f)/.6f)*(.6f+.4f*MathUtils.sin(t*3)));
    }
}
