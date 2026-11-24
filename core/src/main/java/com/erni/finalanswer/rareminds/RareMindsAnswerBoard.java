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
    record Member(String name,String character,boolean ghost,int team){Member(String name,String character,boolean ghost){this(name,character,ghost,-1);}}
    /** one 1-on-1 duel of the DUELS format: who won this question (0 draw) and the running score */
    record Duel(String a,String b,String charA,String charB,int result,int bonus,int winsA,int winsB){}
    record Group(String answer,boolean valid,boolean empty,int tier,double share,int souls,int penaltyPct,boolean jackpot,int jackpotSouls,List<Member> members,String typed,boolean col){
        /** the server's verdict (teammates sharing an answer is not a collision) */
        boolean collided(){return col;}
    }
    static final float INTRO=.45f,STEP=.55f,FLIP=.38f,POINTS_GAP=.8f,POINT_STEP=.5f;
    /** second pass: the moment souls start being handed out */
    static float pointsAt(int n){return INTRO+STEP*Math.max(0,n-1)+FLIP+POINTS_GAP;}
    /** when the board is done (answers shown, then every tile scored, jackpot crowned) */
    static float duration(int n){return pointsAt(n)+POINT_STEP*Math.max(0,n-1)+1.4f;}
    static float duration(int n,boolean duels){return duration(n)+(duels?1.6f:0);}
    private final RareMindsArt art;RareMindsAnswerBoard(RareMindsArt art){this.art=art;}

    void draw(float x,float y,float w,float h,String title,List<Group> groups,String[] tierNames,boolean fin,float t,float clock){draw(x,y,w,h,title,groups,tierNames,fin,t,clock,List.of());}
    void draw(float x,float y,float w,float h,String title,List<Group> groups,String[] tierNames,boolean fin,float t,float clock,List<Duel> duels){
        art.panel(x,y,w,h,1,fin?RareMindsArt.RED:null);
        float ta=MathUtils.clamp(t/.35f,0,1);
        art.text(art.mid,title,x+w/2,y+h-22,.78f,RareMindsArt.IVORY,ta,w-80);
        art.text(art.tiny,tr("ОТВЕТЫ","THE ANSWERS"),x+w/2,y+h-70,.8f,RareMindsArt.GOLD,ta,0);
        int n=groups.size();if(n==0)return;
        int cols=n<=3?n:n<=4?2:3,rows=(n+cols-1)/cols;float gap=22,top=y+h-96,bottom=y+(duels.isEmpty()?28:118);
        float tw=Math.min(310,(w-60-gap*(cols-1))/cols),th=Math.min(200,(top-bottom-gap*(rows-1))/rows);
        for(int i=0;i<n;i++){Group g=groups.get(i);int r=i/cols,c=i%cols;int inRow=Math.min(cols,n-r*cols);
            float rowW=inRow*tw+(inRow-1)*gap,tx=x+w/2-rowW/2+c*(tw+gap),ty=top-(r+1)*th-r*gap;
            float lt=(t-INTRO-i*STEP)/FLIP;tile(g,tx,ty,tw,th,lt,clock,tierNames,t-pointsAt(n)-i*POINT_STEP);}
        if(!duels.isEmpty())duelStrip(x,y+14,w,duels,t-duration(n),clock);
        if(t>pointsAt(n)-.5f)art.text(art.tiny,tr("РАЗДАЁМ ДУШИ","HANDING OUT SOULS"),x+w/2,y+h-70,.8f,RareMindsArt.GOLD,0,0);
    }
    /** a tile turning over: its back (gilt, a question mark) narrows to an edge, then the face widens */
    private void tile(Group g,float x,float y,float w,float h,float lt,float clock,String[] tierNames,float after){
        float cx=x+w/2;
        if(lt<.5f){float k=lt<=0?1:1-ease(lt*2);float ww=w*k;if(ww<2)return;
            art.panel(cx-ww/2,y,ww,h,1,null);art.text(art.big,"?",cx,y+h/2+28,1,RareMindsArt.GOLD_DEEP,Math.min(1,k*1.5f),0);return;}
        float k=ease((lt-.5f)*2),ww=w*k;
        Color accent=g.collided()&&after>=.15f?RareMindsArt.RED:null;
        art.panel(cx-ww/2,y,ww,h,1,accent);if(k<.6f)return;float a=ease((k-.6f)/.4f);
        boolean scored=after>=0;float pa=scored?ease(Math.min(1,after*3)):0;
        Color tc=g.valid()?RareMindsArt.TIER[g.tier()]:RareMindsArt.DIM;
        // the answer itself (and, if the game corrected a spelling, what was actually typed)
        art.text(art.mid,g.empty()?"—":g.answer(),cx,y+h-26,.95f,g.valid()?RareMindsArt.IVORY:RareMindsArt.DIM,a,w-30);
        if(g.typed()!=null&&!g.typed().isEmpty()){String o=g.typed()+"  →  "+tr("исправлено","corrected");art.text(art.tiny,o,cx,y+h-68,.64f,RareMindsArt.DIM,a,w-24);
            float ow=Math.min(w-24,art.width(art.tiny,g.typed(),.64f));float ox=cx-art.width(art.tiny,o,.64f)/2;art.rect(ox,y+h-77,ow,1.5f,RareMindsArt.DIM,a);}
        // who said it
        int m=g.members().size();float fs=Math.min(40,(w-30)/Math.max(1,m)-6),fx=cx-(m*(fs+6)-6)/2;
        for(int i=0;i<m;i++){Member mb=g.members().get(i);Texture face=art.face(mb.character());float px=fx+i*(fs+6),py=y+52;
            if(face!=null){batch().setColor(mb.ghost()?.6f:1,mb.ghost()?.8f:1,1,a);batch().draw(face,px,py,fs,fs);}
            Color rc=scored?tc:RareMindsArt.GOLD_DEEP;batch().setColor(rc.r,rc.g,rc.b,a);batch().draw(art.ring,px-2,py-2,fs+4,fs+4);}
        art.text(art.tiny,String.join(" · ",g.members().stream().map(Member::name).toList()),cx,y+46,.62f,RareMindsArt.DIM,a,w-24);
        if(!scored)return;
        // second pass — the points: rarity ribbon, share of players, souls counting up
        art.rect(x+10,y+10,w-20,26,tc,.22f*pa);art.rect(x+10,y+10,4,26,tc,pa);
        String ribbon=g.empty()?tr("НЕТ ОТВЕТА","NO ANSWER"):!g.valid()?tr("НЕ ПРИНЯТО","NOT ACCEPTED"):tierNames[g.tier()]+"  ·  "+pct(g.share());
        art.textLeft(art.tiny,ribbon,x+22,y+31,.72f,tc,pa);
        int shown=Math.round(g.souls()*ease(Math.min(1,after/.6f)));
        String sv=g.valid()?"+"+shown+(g.collided()&&g.penaltyPct()>0?"  −"+g.penaltyPct()+"%":""):"0";
        art.textRight(art.small,sv,x+w-16,y+31,.78f,g.collided()?RareMindsArt.RED_SOFT:RareMindsArt.GOLD,pa);
        if(g.collided()&&after>.15f){float st=ease(Math.min(1,(after-.15f)*4));float sc=1.6f-.6f*st;
            art.text(art.big,tr("СОВПАДЕНИЕ","COLLISION"),cx,y+h/2+16,.6f*sc,RareMindsArt.RED,st*.9f,w*sc);}
        if(g.jackpot()&&after>.3f){float c=ease((after-.3f)*2.5f);art.glow(cx,y+h/2,w*1.9f,h*1.9f,RareMindsArt.GOLD,.28f*c*(.85f+.15f*MathUtils.sin(clock*4)));
            batch().setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,c);batch().draw(art.crown,cx-28,y+h-6+(1-c)*20,56,56);
            art.text(art.small,tr("ДЖЕКПОТ +","JACKPOT +")+g.jackpotSouls(),cx,y-10,.8f,RareMindsArt.GOLD,c,0);}
    }
    /** the duel scoreboard under the tiles: each pair face to face, the winner lit and paid */
    private void duelStrip(float x,float y,float w,List<Duel> duels,float t,float clock){
        if(t<-.2f){art.text(art.tiny,tr("ДУЭЛИ 1 НА 1","1-ON-1 DUELS"),x+w/2,y+86,.72f,RareMindsArt.DIM,1,0);}
        int n=duels.size();float gap=14,cw=Math.min(330,(w-60-gap*(n-1))/n),h=74;
        for(int i=0;i<n;i++){Duel d=duels.get(i);float cx=x+w/2-(n*cw+(n-1)*gap)/2+i*(cw+gap)+cw/2;float a=ease((t-i*.25f)/.35f);
            art.rect(cx-cw/2,y,cw,h,new Color(0,0,0,.55f),1);art.rect(cx-cw/2,y+h-3,cw,3,RareMindsArt.GOLD,.6f);
            boolean aw=a>0&&d.result()>0,bw=a>0&&d.result()<0;
            side(d.a(),d.charA(),cx-cw/2+10,y,true,aw,a>0&&d.result()<0);side(d.b(),d.charB(),cx+cw/2-10,y,false,bw,a>0&&d.result()>0);
            art.text(art.small,"VS",cx,y+h/2+12,.8f,RareMindsArt.RED_SOFT,1,0);
            if(a>0){art.text(art.num,d.winsA()+" : "+d.winsB(),cx,y+20,.4f,RareMindsArt.IVORY,a,0);
                if(d.result()!=0){art.glow(d.result()>0?cx-cw/4:cx+cw/4,y+h/2,cw*.7f,h*1.6f,RareMindsArt.GOLD,.25f*a);
                    art.text(art.tiny,"+"+d.bonus(),d.result()>0?cx-cw/4:cx+cw/4,y+h+20,.8f,RareMindsArt.GOLD,a,0);}
                else art.text(art.tiny,tr("НИЧЬЯ","DRAW"),cx,y+h+20,.72f,RareMindsArt.DIM,a,0);}}
    }
    private void side(String name,String character,float x,float y,boolean left,boolean won,boolean lost){
        Texture face=art.face(character);float fs=44,fx=left?x:x-fs;float al=lost?.45f:1;
        if(face!=null){batch().setColor(al,al,al,1);batch().draw(face,fx,y+15,fs,fs);}
        Color rc=won?RareMindsArt.GOLD:RareMindsArt.GOLD_DEEP;batch().setColor(rc);batch().draw(art.ring,fx-2,y+13,fs+4,fs+4);
        if(left)art.textLeft(art.tiny,name,fx+fs+8,y+46,.78f,won?RareMindsArt.GOLD:RareMindsArt.IVORY,al);else art.textRight(art.tiny,name,fx-8,y+46,.78f,won?RareMindsArt.GOLD:RareMindsArt.IVORY,al);
    }
    private static String pct(double share){double p=share*100;return p>=1?Math.round(p)+"%":p>=.1?String.format(Locale.ROOT,"%.1f%%",p):"<0.1%";}
    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
    private com.badlogic.gdx.graphics.g2d.SpriteBatch batch(){return art.batch;}
    private static String tr(String ru,String en){return com.erni.finalanswer.localization.Localization.tr(ru,en);}
}
