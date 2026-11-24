package com.erni.finalanswer.rareminds;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.MathUtils;
import java.util.*;

/**
 * ACT ONE of the reveal — the answer board. Identical answers are grouped into one tile carrying every player who gave
 * it. Tiles turn over one by one from the most popular answer to the rarest (refused answers first), each with its
 * rarity ribbon, the share of players who say it, the souls it paid and, for duplicates, a red COLLISION stamp. The
 * rarest unique answer turns last and takes the jackpot crown.
 */
final class RareMindsAnswerBoard {
    record Member(String name,String character,boolean ghost){}
    record Group(String answer,boolean valid,boolean empty,int tier,double share,int souls,int penaltyPct,boolean jackpot,int jackpotSouls,List<Member> members){
        boolean collided(){return valid&&members.size()>1;}
    }
    static final float INTRO=.45f,STEP=.55f,FLIP=.38f;
    /** when the board is done (all tiles turned, jackpot shown) for {@code n} tiles */
    static float duration(int n){return INTRO+STEP*Math.max(0,n-1)+FLIP+1.1f;}
    private final RareMindsArt art;RareMindsAnswerBoard(RareMindsArt art){this.art=art;}

    void draw(float x,float y,float w,float h,String title,List<Group> groups,String[] tierNames,boolean fin,float t,float clock){
        art.panel(x,y,w,h,1,fin?RareMindsArt.RED:null);
        float ta=MathUtils.clamp(t/.35f,0,1);
        art.text(art.mid,title,x+w/2,y+h-22,.78f,RareMindsArt.IVORY,ta,w-80);
        art.text(art.tiny,tr("ОТВЕТЫ","THE ANSWERS"),x+w/2,y+h-70,.8f,RareMindsArt.GOLD,ta,0);
        int n=groups.size();if(n==0)return;
        int cols=n<=3?n:n<=4?2:3,rows=(n+cols-1)/cols;float gap=22,top=y+h-96,bottom=y+28;
        float tw=Math.min(310,(w-60-gap*(cols-1))/cols),th=Math.min(200,(top-bottom-gap*(rows-1))/rows);
        for(int i=0;i<n;i++){Group g=groups.get(i);int r=i/cols,c=i%cols;int inRow=Math.min(cols,n-r*cols);
            float rowW=inRow*tw+(inRow-1)*gap,tx=x+w/2-rowW/2+c*(tw+gap),ty=top-(r+1)*th-r*gap;
            float lt=(t-INTRO-i*STEP)/FLIP;tile(g,tx,ty,tw,th,lt,clock,tierNames,t-INTRO-i*STEP-FLIP);}
    }
    /** a tile turning over: its back (gilt, a question mark) narrows to an edge, then the face widens */
    private void tile(Group g,float x,float y,float w,float h,float lt,float clock,String[] tierNames,float after){
        float cx=x+w/2;
        if(lt<.5f){float k=lt<=0?1:1-ease(lt*2);float ww=w*k;if(ww<2)return;
            art.panel(cx-ww/2,y,ww,h,1,null);art.text(art.big,"?",cx,y+h/2+28,1,RareMindsArt.GOLD_DEEP,Math.min(1,k*1.5f),0);return;}
        float k=ease((lt-.5f)*2),ww=w*k;
        Color accent=g.collided()?RareMindsArt.RED:null;
        if(g.jackpot()&&after>.25f){float a=ease((after-.25f)*2.5f);art.glow(cx,y+h/2,w*1.9f,h*1.9f,RareMindsArt.GOLD,.30f*a*(.85f+.15f*MathUtils.sin(clock*4)));}
        art.panel(cx-ww/2,y,ww,h,1,accent);if(k<.6f)return;float a=ease((k-.6f)/.4f);
        Color tc=g.valid()?RareMindsArt.TIER[g.tier()]:RareMindsArt.DIM;
        // rarity ribbon
        art.rect(x+10,y+h-38,w-20,26,tc,.22f*a);art.rect(x+10,y+h-38,4,26,tc,a);
        String ribbon=g.empty()?tr("НЕТ ОТВЕТА","NO ANSWER"):!g.valid()?tr("НЕ ПРИНЯТО","NOT ACCEPTED"):tierNames[g.tier()]+"  ·  "+pct(g.share());
        art.textLeft(art.tiny,ribbon,x+22,y+h-17,.74f,tc,a);
        // the answer itself
        art.text(art.mid,g.empty()?"—":g.answer(),cx,y+h-52,.92f,g.valid()?RareMindsArt.IVORY:RareMindsArt.DIM,a,w-30);
        // who said it
        int m=g.members().size();float fs=Math.min(44,(w-30)/Math.max(1,m)-6),fx=cx-(m*(fs+6)-6)/2;
        for(int i=0;i<m;i++){Member mb=g.members().get(i);Texture face=art.face(mb.character());float px=fx+i*(fs+6),py=y+34;
            if(face!=null){batch().setColor(mb.ghost()?.6f:1,mb.ghost()?.8f:1,1,a);batch().draw(face,px,py,fs,fs);}
            batch().setColor(tc.r,tc.g,tc.b,a);batch().draw(art.ring,px-2,py-2,fs+4,fs+4);}
        String names=String.join(" · ",g.members().stream().map(Member::name).toList());
        art.text(art.tiny,names,cx,y+28,.66f,RareMindsArt.DIM,a,w-24);
        // souls
        if(g.valid()){String sv="+"+g.souls();if(g.collided()&&g.penaltyPct()>0)sv+="  (−"+g.penaltyPct()+"%)";art.textRight(art.small,sv,x+w-16,y+h-17,.74f,g.collided()?RareMindsArt.RED_SOFT:RareMindsArt.GOLD,a);}
        // collision stamp
        if(g.collided()&&after>0){float s=ease(Math.min(1,after*4));float sc=1.6f-.6f*s;
            art.text(art.big,tr("СОВПАДЕНИЕ","COLLISION"),cx,y+h/2+12,.62f*sc,RareMindsArt.RED,s*.92f,w*sc);}
        // jackpot crown
        if(g.jackpot()&&after>.25f){float c=ease((after-.25f)*2.5f);batch().setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,c);batch().draw(art.crown,cx-28,y+h-6+(1-c)*20,56,56);
            art.text(art.small,tr("ДЖЕКПОТ +","JACKPOT +")+g.jackpotSouls(),cx,y-10,.8f,RareMindsArt.GOLD,c,0);}
    }
    private static String pct(double share){double p=share*100;return p>=1?Math.round(p)+"%":p>=.1?String.format(Locale.ROOT,"%.1f%%",p):"<0.1%";}
    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
    private com.badlogic.gdx.graphics.g2d.SpriteBatch batch(){return art.batch;}
    private static String tr(String ru,String en){return com.erni.finalanswer.localization.Localization.tr(ru,en);}
}
