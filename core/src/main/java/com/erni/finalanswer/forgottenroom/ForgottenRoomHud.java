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
    private float clock,phaseAge;private String roomName="",phase="";
    void update(ForgottenRoomModel model,float delta){clock+=Math.min(delta,.1f);if(!phase.equals(model.phase)){phase=model.phase;phaseAge=0;}else phaseAge+=delta;roomName=model.roomName;}

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
    /** A player's face in a gilt medallion (falls back to an initial on velvet). {@code lit} adds a warm glow. */
    void medallion(SpriteBatch b,ForgottenRoomModel m,String player,float cx,float cy,float r,float alpha,boolean lit){
        b.setColor(0,0,0,.55f*alpha);b.draw(art.soft,cx-r*1.35f,cy-r*1.5f,r*2.7f,r*2.7f);
        if(lit){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(GOLD.r,GOLD.g,GOLD.b,.28f*alpha);b.draw(art.soft,cx-r*1.7f,cy-r*1.7f,r*3.4f,r*3.4f);b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
        Texture face=art.portrait(m.characters.get(player));
        if(face!=null){b.setColor(lit?1:.78f,lit?1:.74f,lit?1:.72f,alpha);b.draw(face,cx-r*.86f,cy-r*.86f,r*1.72f,r*1.72f);}
        else{b.setColor(.16f,.07f,.08f,alpha);b.draw(art.soft,cx-r*.9f,cy-r*.9f,r*1.8f,r*1.8f);String n=m.name(player);text(b,title,n.isEmpty()?"?":n.substring(0,1),cx,cy+r*.45f,r/70f,IVORY,alpha);}
        b.setColor(1,1,1,alpha);b.draw(art.medal,cx-r,cy-r,r*2,r*2);b.setColor(1,1,1,1);
    }
    /** Dark lacquered plaque with a double gilt border and corner diamonds. */
    void plaque(SpriteBatch b,float x,float y,float w,float h,float alpha,boolean lit){
        b.setColor(0,0,0,.28f*alpha);b.draw(art.soft,x-30,y-36,w+60,h+60);
        b.setColor(.025f,.035f,.037f,.91f*alpha);b.draw(art.pixel,x,y,w,h);
        b.setColor(GOLD.r,GOLD.g,GOLD.b,(lit?.65f:.24f)*alpha);
        b.draw(art.pixel,x,y+h-1,w,1);b.draw(art.pixel,x,y,w,1);
        b.setColor(GOLD.r,GOLD.g,GOLD.b,.12f*alpha);b.draw(art.pixel,x,y,1,h);b.draw(art.pixel,x+w-1,y,1,h);
        if(lit){b.setColor(GOLD.r,GOLD.g,GOLD.b,.85f*alpha);b.draw(art.pixel,x,y,3,h);}
        b.setColor(1,1,1,1);
    }
    /** Countdown ring: gilt ticks, a draining arc (ember in the last seconds) and the seconds in the middle. */
    /**
     * The antique dial timer: brass bezel and enamel face (pre-rendered), a glowing arc of light that drains clockwise
     * from twelve, a gilt hand at the leading edge, and the seconds in the centre. Turns ember red and beats softly in
     * the last three seconds.
     */
    void ring(SpriteBatch b,float cx,float cy,float r,float fraction,int seconds,float alpha){
        float now=clock;boolean urgent=seconds<=3&&seconds>0;
        float beat=urgent?1+.035f*(float)Math.pow(Math.max(0,MathUtils.sin(now*MathUtils.PI2)),8):1;
        float R=r*beat;Color glow=urgent?EMBER:GOLD;
        // shadow and a faint halo behind the dial
        b.setColor(0,0,0,.65f*alpha);b.draw(art.soft,cx-R*1.75f,cy-R*1.9f,R*3.5f,R*3.5f);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(glow.r,glow.g,glow.b,(urgent?.22f:.12f)*alpha);b.draw(art.soft,cx-R*1.6f,cy-R*1.6f,R*3.2f,R*3.2f);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        b.setColor(1,1,1,alpha);b.draw(art.dial,cx-R,cy-R,R*2,R*2);
        // draining arc of light: full circle at the start, shrinking clockwise toward twelve
        float track=R*.665f,f=MathUtils.clamp(fraction,0,1);int steps=180;
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<steps;i++){float s=i/(float)steps;if(s>f)break;float a=90+s*360;   // counter-clockwise from 12 = the time still left
            float fade=.6f+.4f*Math.min(1,(f-s)*6);float x=cx+MathUtils.cosDeg(a)*track,y=cy+MathUtils.sinDeg(a)*track;
            b.setColor(glow.r,glow.g*.92f,glow.b*.8f,.22f*fade*alpha);b.draw(art.soft,x-R*.10f,y-R*.10f,R*.20f,R*.20f);
            b.setColor(1f,.92f,.76f,.42f*fade*alpha);b.draw(art.soft,x-R*.03f,y-R*.03f,R*.06f,R*.06f);}
        if(f>0){float a=90+f*360,x=cx+MathUtils.cosDeg(a)*track,y=cy+MathUtils.sinDeg(a)*track;
            float tw=.75f+.25f*MathUtils.sin(now*9);b.setColor(1f,.95f,.82f,.85f*tw*alpha);b.draw(art.soft,x-R*.14f,y-R*.14f,R*.28f,R*.28f);}
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        // seconds, optically centred, with a small caption beneath
        String num=String.valueOf(Math.max(0,seconds));float sc=R/62f*beat;
        title.getData().setScale(sc);layout.setText(title,num);float nh=layout.height;title.getData().setScale(1);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(glow.r,glow.g,glow.b,.18f*alpha);b.draw(art.soft,cx-R*.42f,cy-R*.3f,R*.84f,R*.7f);
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
        text(b,title,num,cx,cy+nh*.5f+R*.16f,sc*.92f,urgent?EMBER:IVORY,alpha);
        text(b,body,"СЕКУНД",cx,cy-R*.36f,R/250f,urgent?EMBER:DIM,.85f*alpha);
        b.setColor(1,1,1,1);}

    // ---------- scenes ----------
    void intro(SpriteBatch b,float t,String roomName){
        float a=ease(t/.9f)*(1-ease((t-3.65f)/.65f));if(a<=0)return;
        // One quiet title card; the location has priority over the game logo.
        float lift=(1-ease(t/1.5f))*16;
        b.setColor(.005f,.014f,.016f,.36f*a);b.draw(art.pixel,0,0,W,H);
        b.setColor(0,0,0,.5f*a);b.draw(art.soft,160,130,1600,820);
        text(b,body,"FINAL ANSWER  /  FORGOTTEN ROOMS",W/2,694+lift,.62f,GOLD,a);
        rule(b,W/2,638+lift,320,a*.6f);
        wrapped(b,title,roomName.toUpperCase(Locale.ROOT),W/2,590+lift,1500,1.03f,IVORY,a);
        text(b,body,"Запомните комнату. Найдите то, что изменилось.",W/2,451+lift,.82f,IVORY,a*ease((t-.45f)/.7f));
        float appear=a*ease((t-.9f)/.8f);
        String[] steps={"01   НАБЛЮДАЙТЕ","02   ЗАПОМИНАЙТЕ","03   НАХОДИТЕ"};
        for(int i=0;i<3;i++)text(b,body,steps[i],W/2+(i-1)*360,330,.56f,GOLD,appear*.9f);
        b.setColor(1,1,1,1);
    }
    void topBand(SpriteBatch b,float alpha){
        // Broad enough for text, but fades to clear before the first furniture surface.
        for(int i=0;i<30;i++){float u=i/29f;b.setColor(.008f,.018f,.022f,.78f*(1-u)*(1-u)*alpha);b.draw(art.pixel,0,H-(i+1)*5,W,5);}
        b.setColor(1,1,1,1);
    }
    private void leftText(SpriteBatch b,BitmapFont f,String text,float x,float y,float scale,Color color,float a,float maxWidth){
        f.getData().setScale(scale);layout.setText(f,text);
        if(layout.width>maxWidth)f.getData().setScale(scale*maxWidth/layout.width);
        f.setColor(0,0,0,.6f*a);f.draw(b,text,x+1,y-2);f.setColor(color.r,color.g,color.b,a);f.draw(b,text,x,y);f.getData().setScale(1);
    }
    private void header(SpriteBatch b,String stage,String instruction,float fraction,int seconds,float alpha){
        float a=alpha*ease((phaseAge+.12f)/.45f);topBand(b,a);
        b.setColor(GOLD.r,GOLD.g,GOLD.b,.65f*a);b.draw(art.pixel,48,H-94,2,48);
        leftText(b,body,"FORGOTTEN ROOMS  /  "+roomName.toUpperCase(Locale.ROOT),68,H-30,.43f,GOLD,a,1100);
        leftText(b,body,instruction,68,H-62,.77f,IVORY,a,1260);
        text(b,body,stage,1590,H-43,.46f,GOLD,a);
        text(b,body,seconds<=3&&seconds>0?"ВРЕМЯ ИСТЕКАЕТ":"ОСТАЛОСЬ ВРЕМЕНИ",1590,H-70,.38f,DIM,a);
        ring(b,W-92,H-61,44,fraction,seconds,a);
        // A single quiet progress track across the header. The scene beneath is never dimmed by it.
        b.setColor(1,1,1,.10f*a);b.draw(art.pixel,68,H-108,W-136,1);
        Color accent=seconds<=3?EMBER:GOLD;b.setColor(accent.r,accent.g,accent.b,.72f*a);
        b.draw(art.pixel,68,H-108,(W-136)*MathUtils.clamp(fraction,0,1),2);b.setColor(1,1,1,1);
    }
    void observation(SpriteBatch b,float fraction,int seconds,float alpha){
        header(b,"01 / НАБЛЮДЕНИЕ","Запомните предметы и их расположение",fraction,seconds,alpha);
    }
    void changedRoom(SpriteBatch b,float t){
        float a=ease((t-.25f)/.45f);topBand(b,a);
        leftText(b,body,"02 / КОМНАТА ИЗМЕНИЛАСЬ",68,H-32,.48f,GOLD,a,1200);
        leftText(b,body,"Присмотритесь. Что стало иначе?",68,H-66,.8f,IVORY,a,1300);
    }
    void answering(SpriteBatch b,ForgottenRoomModel m,float fraction,int seconds){
        header(b,"03 / РАССЛЕДОВАНИЕ","Найдите изменения · отметьте их на телефонах",fraction,seconds,1);
        players(b,m);
    }
    /** Player plaques along the bottom: face in a medallion, name, and a gilt seal once the answer is in (never whether it is right). */
    void players(SpriteBatch b,ForgottenRoomModel m){
        int n=m.seats.size();if(n==0)return;
        float gap=12,pw=Math.min(254,(W-136-gap*(n-1))/n),ph=62,total=n*pw+(n-1)*gap,x0=(W-total)/2,y=24;
        for(int i=0;i<n;i++){
            String id=m.seats.get(i);boolean done=m.submitted.contains(id);float x=x0+i*(pw+gap);
            plaque(b,x,y,pw,ph,.9f,done);
            medallion(b,m,id,x+29,y+31,24,1,done);
            leftText(b,body,m.name(id),x+62,y+45,.55f,done?IVORY:DIM,1,pw-76);
            leftText(b,body,done?"ОТВЕТ ПРИНЯТ":"ИЩЕТ ИЗМЕНЕНИЯ",x+62,y+21,.32f,done?GOLD:DIM,.85f,pw-76);
        }
        text(b,body,m.submitted.size()+" / "+n+"  ОТВЕТОВ ПРИНЯТО",W/2,110,.4f,IVORY,.86f);
    }
    void revealTitle(SpriteBatch b,float t){float a=ease(t/.6f);text(b,title,"ТАЙНЫ КОМНАТЫ",W/2,H/2+40,1.35f,GOLD,a);rule(b,W/2,H/2-30,460,a);
        text(b,body,"Посмотрим, что изменилось",W/2,H/2-60,.75f,IVORY,a*ease((t-.4f)/.6f));}
    void revealCaption(SpriteBatch b,ForgottenRoomModel m,ForgottenRoomModel.Change c,int index,float t){
        float a=ease((t-.15f)/.5f)*(1-ease((t-.93f)/.07f));if(a<=0)return;
        // keep the caption away from the change: bottom band normally, top band when the change sits low in the room
        float low=0;for(String slot:c.slots()){var p=m.places.get(slot);if(p!=null)low=Math.max(low,p.y());}
        float w=1240,h=196,x=(W-w)/2,y=low>.62f?H-h-30:28;boolean found=!c.foundBy().isEmpty();
        plaque(b,x,y,w,h,a,found);
        text(b,body,"ИЗМЕНЕНИЕ  "+(index+1)+"  ИЗ  "+m.changes.size(),W/2,y+h-18,.48f,DIM,a);
        text(b,title,c.caption(),W/2,y+h-44,.78f,GOLD,a);
        rule(b,W/2,y+h-112,360,a*.8f);
        float fa=a*ease((t-.4f)/.3f);
        if(!found)text(b,body,"НИКТО НЕ ЗАМЕТИЛ",W/2,y+62,.82f,EMBER,fa);
        else{ // who found it: faces in medallions with names
            int k=c.foundBy().size();float r=26,slotW=190,sx=W/2-(k-1)*slotW/2;
            for(int i=0;i<k;i++){String id=c.foundBy().get(i);float px=sx+i*slotW;medallion(b,m,id,px-48,y+50,r,fa,true);
                body.getData().setScale(.6f);body.setColor(IVORY.r,IVORY.g,IVORY.b,fa);body.draw(b,m.name(id),px-14,y+64);body.getData().setScale(1);}
            text(b,body,"ЗАМЕТИЛИ",W/2,y+104,.46f,DIM,fa);}
    }
    /** Final table: a gilt panel, rows arrive one by one, faces in medallions, podium colours for the top three, points counting up. */
    void results(SpriteBatch b,ForgottenRoomModel m,float t){
        float a=ease(t/.6f);b.setColor(0,0,0,.62f*a);b.draw(art.pixel,0,0,W,H);b.setColor(1,1,1,1);
        int n=m.results.size();float rowH=Math.min(112,600f/Math.max(1,n)),w=1060,x=(W-w)/2,top=H-250,panelH=n*rowH+300;
        plaque(b,x-40,top-n*rowH-40,w+80,panelH-60,a*.85f,false);
        text(b,title,"ИТОГИ РАССЛЕДОВАНИЯ",W/2,H-96,1.0f,GOLD,a);rule(b,W/2,H-160,460,a);text(b,body,roomName.toUpperCase(Locale.ROOT),W/2,H-188,.62f,IVORY,a);
        Color[] podium={GOLD,new Color(.82f,.84f,.88f,1),new Color(.80f,.52f,.30f,1)};
        for(int i=0;i<n;i++){var r=m.results.get(i);float ra=ease((t-.5f-i*.22f)/.45f);if(ra<=0)continue;
            float y=top-(i+1)*rowH,slide=(1-ra)*40;boolean first=r.rank()==1;Color pc=r.rank()<=3?podium[r.rank()-1]:DIM;
            plaque(b,x+slide,y+8,w,rowH-16,ra,first);
            float mid=y+rowH/2;
            diamond(b,x+58+slide,mid,26,pc,ra);text(b,title,String.valueOf(r.rank()),x+58+slide,mid+24,.62f,new Color(.12f,.07f,.04f,1),ra);
            medallion(b,m,r.playerId(),x+146+slide,mid,rowH*.36f,ra,first);
            float nx=x+204+slide;body.getData().setScale(.92f);body.setColor(IVORY.r,IVORY.g,IVORY.b,ra);body.draw(b,m.name(r.playerId()),nx,mid+34);
            body.getData().setScale(.5f);body.setColor(DIM.r,DIM.g,DIM.b,ra);
            body.draw(b,(r.submitted()?"НАЙДЕНО  "+r.correct()+"  ИЗ  "+m.changes.size():"НЕ ОТВЕТИЛ"),nx,mid-8);body.getData().setScale(1);
            int shown=Math.round(r.points()*ease((t-.8f-i*.22f)/1.4f));
            text(b,title,String.valueOf(shown),x+w-120+slide,mid+34,.9f,first?GOLD:IVORY,ra);
            text(b,body,"ОЧК.",x+w-50+slide,mid+10,.44f,DIM,ra);}
        if(t>2.5f)text(b,body,"ENTER — ВЕРНУТЬСЯ В ЛОББИ",W/2,46,.55f,DIM,ease((t-2.5f)/.6f)*.85f);
    }
}
