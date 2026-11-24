package com.erni.finalanswer.rareminds;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.MathUtils;
import java.util.*;

/**
 * TEAM VS TEAM presentation. {@link #draft}: the random team draw on the intro — every portrait spins in a ring in the
 * centre, then one by one each flies into its team's column. {@link #merge}: after the answers, each player's souls
 * for this question pop up beside their portrait and fly into their team's total, which counts up as they land.
 */
final class RareMindsTeams {
    record Seat(String name,String character,int team,boolean ghost){}
    record Gain(String name,String character,int team,int souls,boolean clash){}
    static final float RING=1.3f,PICK=.55f;
    static float draftDone(int n){return RING+PICK*n+.6f;}
    static float mergeDone(int n){return .5f+.28f*n+1.4f;}
    private final RareMindsArt art;RareMindsTeams(RareMindsArt art){this.art=art;}

    private void column(float x,float y,float w,float h,int team,float a,float lit){
        Color c=RareMindsScreen.teamColor(team);
        art.glow(x+w/2,y+h-40,w*1.2f,160,c,(.10f+.22f*lit)*a);
        art.rect(x,y,w,h,new Color(0,0,0,.45f),a);art.rect(x,y+h-6,w,6,c,a);art.rect(x,y,2,h,c,.5f*a);art.rect(x+w-2,y,2,h,c,.5f*a);
        art.text(art.big,team==0?tr("АЛЫЕ","CRIMSON"):tr("ЛАЗУРНЫЕ","AZURE"),x+w/2,y+h-22,.78f,c,a,w-30);
    }
    private void icon(String character,float cx,float cy,float d,Color ring,float a){
        Texture face=art.face(character);art.shade(cx,cy-d*.1f,d*1.7f,d*1.5f,.7f*a);
        batch().setColor(.05f,.03f,.03f,a);batch().draw(art.soft,cx-d*.55f,cy-d*.55f,d*1.1f,d*1.1f);
        if(face!=null){batch().setColor(1,1,1,a);batch().draw(face,cx-d/2,cy-d/2,d,d);}
        batch().setColor(ring.r,ring.g,ring.b,a);for(int r=0;r<4;r++)batch().draw(art.ring,cx-d/2-3+r*.5f,cy-d/2-3+r*.5f,d+6-r,d+6-r);
    }

    /** the random team draw (intro of a TEAMS match) */
    void draft(float x,float y,float w,float h,List<Seat> seats,float t,float clock){
        art.panel(x,y,w,h,1,null);int n=seats.size();
        art.text(art.mid,tr("ЖЕРЕБЬЁВКА КОМАНД","DRAWING THE TEAMS"),x+w/2,y+h-22,.82f,RareMindsArt.GOLD,1,0);
        float cw=w*.30f,colH=h-120,lx=x+24,rx=x+w-24-cw,cy0=y+30;
        int[] picked=new int[2];for(int i=0;i<n;i++)if(t>=RING+PICK*i+.45f)picked[seats.get(i).team()]++;
        column(lx,cy0,cw,colH,0,1,picked[0]>0?1:0);column(rx,cy0,cw,colH,1,1,picked[1]>0?1:0);
        float ccx=x+w/2,ccy=y+h/2-40,R=Math.min(150,70+n*12),d=74;int[] slot=new int[2];
        for(int i=0;i<n;i++){Seat s=seats.get(i);float start=RING+PICK*i,ft=ease((t-start)/.45f);
            float ang=clock*1.6f+i*MathUtils.PI2/n;float ringX=ccx+MathUtils.cos(ang)*R,ringY=ccy+MathUtils.sin(ang)*R*.55f;
            int k=slot[s.team()]++;float colX=s.team()==0?lx+cw/2:rx+cw/2,slotY=cy0+colH-110-k*(d+34);
            float px=MathUtils.lerp(ringX,colX,ft),py=MathUtils.lerp(ringY,slotY,ft)+MathUtils.sin(ft*MathUtils.PI)*60;
            Color ring=ft>0?RareMindsScreen.teamColor(s.team()):RareMindsArt.GOLD;
            if(ft>0&&ft<1)art.glow(px,py,d*2.4f,d*2.4f,ring,.45f*(1-ft));
            if(ft>=1&&t-start<.9f)art.glow(px,py,d*2.6f,d*2.6f,ring,.5f*(1-(t-start-.45f)/.45f));
            icon(s.character(),px,py,d*(ft>0?1:.9f),ring,1);
            art.text(art.tiny,s.name(),px,py-d/2-8,.8f,ft>0?ring:RareMindsArt.IVORY,1,d+60);}
        if(t>=draftDone(n)-.6f){float a=ease((t-draftDone(n)+.6f)/.4f);art.text(art.mid,tr("КОМАНДЫ СОБРАНЫ!","TEAMS ARE SET!"),ccx,ccy+18,1,RareMindsArt.IVORY,a,0);
            art.text(art.tiny,tr("Совпадение с напарником не приносит душ","Matching a teammate pays nothing"),ccx,ccy-30,.8f,RareMindsArt.DIM,a,w*.36f);}
        else if(t<RING+PICK*n)art.text(art.mid,tr("Кто с кем?","Who is with whom?"),ccx,y+h-80,.9f,RareMindsArt.IVORY,ease(t/.4f),0);
    }

    /** this question's souls flowing into the team totals */
    void merge(float x,float y,float w,float h,List<Gain> gains,long[] before,long[] after,float t,float clock){
        art.panel(x,y,w,h,1,null);int n=gains.size();
        art.text(art.mid,tr("ДУШИ В КОМАНДНЫЙ СЧЁТ","SOULS INTO THE TEAM SCORE"),x+w/2,y+h-22,.82f,RareMindsArt.GOLD,1,0);
        float cw=w*.42f,colH=h-110,lx=x+30,rx=x+w-30-cw,cy0=y+30,d=60;
        // totals count up as each player's souls land
        long[] shown={before[0],before[1]};float[] lit=new float[2];int[] slot=new int[2];
        for(int i=0;i<n;i++){Gain g=gains.get(i);float land=.5f+.28f*i+.6f;if(t>=land){shown[g.team()]+=g.souls();lit[g.team()]=Math.max(lit[g.team()],1-(t-land)/.5f);}}
        for(int tm=0;tm<2;tm++){float cx=tm==0?lx:rx;column(cx,cy0,cw,colH,tm,1,Math.max(0,lit[tm]));
            Color c=RareMindsScreen.teamColor(tm);float sc=1+.12f*Math.max(0,lit[tm]);
            art.text(art.num,String.format(Locale.ROOT,"%,d",shown[tm]).replace(',',' '),cx+cw/2,cy0+colH-80,1.05f*sc,c,1,0);}
        for(int i=0;i<n;i++){Gain g=gains.get(i);int k=slot[g.team()]++;float cx=g.team()==0?lx:rx;float iy=cy0+colH-180-k*(d+20),ix=cx+50;
            Color c=RareMindsScreen.teamColor(g.team());icon(g.character(),ix,iy,d,c,1);art.textLeft(art.small,g.name(),ix+d/2+14,iy+12,.82f,RareMindsArt.IVORY,1);
            float start=.5f+.28f*i,chipA=ease((t-start+.3f)/.3f);String chip=g.clash()?tr("0 · напарник","0 · teammate"):"+"+g.souls();
            float fx=cx+cw-60,ft=ease((t-start)/.6f);
            if(ft<=0)art.textRight(art.small,chip,fx,iy+12,.86f,g.clash()?RareMindsArt.RED_SOFT:RareMindsArt.GOLD,chipA);
            else if(ft<1&&g.souls()>0){float tx=cx+cw/2,ty=cy0+colH-96;float px=MathUtils.lerp(fx-20,tx,ft),py=MathUtils.lerp(iy+4,ty,ft)+MathUtils.sin(ft*MathUtils.PI)*70;
                art.glow(px,py,70,70,c,.6f);art.text(art.small,"+"+g.souls(),px,py+12,.86f,RareMindsArt.GOLD,1-ft*.3f,0);}
            else if(g.clash())art.textRight(art.small,chip,fx,iy+12,.86f,RareMindsArt.RED_SOFT,.6f);}
        // tug of war between the columns
        float share=shown[0]+shown[1]<=0?.5f:shown[0]/(float)(shown[0]+shown[1]);float bx=x+w/2,bw=w*.10f,by0=cy0+40,bh=colH-120;
        art.rect(bx-bw/4,by0,bw/2,bh*share,RareMindsScreen.teamColor(0),.9f);art.rect(bx-bw/4,by0+bh*share,bw/2,bh*(1-share),RareMindsScreen.teamColor(1),.9f);
        art.text(art.big,"VS",bx,by0+bh+60,.7f,RareMindsArt.IVORY,1,0);
        if(t>mergeDone(n)-1){float a=ease((t-mergeDone(n)+1)/.4f);int lead=after[0]==after[1]?-1:after[0]>after[1]?0:1;
            art.text(art.small,lead<0?tr("РАВНЫЙ СЧЁТ","LEVEL"):(lead==0?tr("АЛЫЕ","CRIMSON"):tr("ЛАЗУРНЫЕ","AZURE"))+tr(" ВПЕРЕДИ"," LEAD"),bx,by0-24,.8f,lead<0?RareMindsArt.IVORY:RareMindsScreen.teamColor(lead),a,0);}
    }
    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
    private com.badlogic.gdx.graphics.g2d.SpriteBatch batch(){return art.batch;}
    private static String tr(String ru,String en){return com.erni.finalanswer.localization.Localization.tr(ru,en);}
}
