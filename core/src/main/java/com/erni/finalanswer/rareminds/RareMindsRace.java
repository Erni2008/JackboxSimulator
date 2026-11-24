package com.erni.finalanswer.rareminds;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.MathUtils;
import java.util.*;

/**
 * THE SOUL RACE — one race that lasts the whole match. One lane per player; the distance is the souls earned in this
 * mini-game, so after every question each racer drives on from where it stopped by what its answer earned (rare
 * answers are long boosts, an elimination rolls the car back by the death penalty). Racers with the same answer crash into each other at the finish, invalid answers stall on the grid, ghosts
 * drive translucent, and the jackpot winner gets the crown. Pure presentation: every number comes from the server.
 */
final class RareMindsRace {
    /** one lane as the screen hands it over */
    record Lane(String name,String character,String answer,boolean answered,boolean valid,boolean collided,int sharedWith,boolean ghost,
                int tier,double share,int earned,boolean jackpot,int jackpotSouls,boolean eliminated,boolean resurrected,long fromSouls,long souls){}
    static final float START=.9f,STAGGER=.12f,DRIVE=2.4f;
    /** shares at the zone boundaries (same as the server tiers) and the scale ends */
    private static final double TOP=.25,BOTTOM=.0015;private static final double[] EDGES={.080,.045,.022,.010,.004};
    static float arrival(int lane){return START+lane*STAGGER+DRIVE;}

    private final RareMindsArt art;RareMindsRace(RareMindsArt art){this.art=art;}
    private static float pos(double share){return MathUtils.clamp((float)((Math.log(TOP)-Math.log(Math.max(share,1e-6)))/(Math.log(TOP)-Math.log(BOTTOM))),0,1);}
    private static float easeOut(float t){t=MathUtils.clamp(t,0,1);float u=1-t;return 1-u*u*u;}

    void draw(float x,float y,float w,float h,String title,List<Lane> lanes,String[] tierNames,boolean fin,float t,float clock,String lockedText,String noJackpot){
        art.panel(x,y,w,h,1,fin?RareMindsArt.RED:null);
        art.text(art.mid,title,x+w/2,y+h-22,.78f,RareMindsArt.IVORY,1,w-80);
        float tx0=x+330,tx1=x+w-120,top=y+h-96,bottom=y+40;int n=Math.max(1,lanes.size());float rowH=Math.min(76,(top-bottom)/n);
        float laneTop=top,laneBottom=top-rowH*n;
        // distance scale: souls, rescaled so the leader stays near the flag
        long far=2000;for(Lane l:lanes)far=Math.max(far,Math.max(l.souls(),l.fromSouls()));float scale=far*1.12f;
        long step=far>12000?4000:far>6000?2000:1000;
        for(long m=0;m<=scale;m+=step){float gx=tx0+(m/scale)*(tx1-tx0);art.rect(gx,laneBottom,1,laneTop-laneBottom,Color.WHITE,m==0?.35f:.08f);
            art.text(art.tiny,m==0?art_tr("СТАРТ","START"):String.format(Locale.ROOT,"%,d",m).replace(',',' '),gx,laneTop+24,.6f,RareMindsArt.DIM,1,0);}
        art.rect(tx0,laneTop,tx1-tx0,2,RareMindsArt.GOLD,.6f);
        art.text(art.tiny,art_tr("ДУШИ ЗА ИГРУ","SOULS THIS GAME"),tx1-60,laneBottom-10,.6f,RareMindsArt.DIM,.8f,0);
        // places after this question
        List<Lane> order=new ArrayList<>(lanes);order.sort((a,b)->Long.compare(b.souls(),a.souls()));
        for(int k=0;k<6;k++)tierNames[k]=tierNames[k];
        float lockA=MathUtils.clamp(1-(t-START+.2f)*3,0,1);
        for(int i=0;i<lanes.size();i++){Lane l=lanes.get(i);float ry=laneTop-(i+1)*rowH,cy=ry+rowH/2;
            if(i%2==0)art.rect(x+16,ry,w-32,rowH,Color.WHITE,.025f);
            if(arrivedAll(t,n))art.textRight(art.num,"#"+(order.indexOf(l)+1),tx0-12,cy+14,.5f,order.indexOf(l)==0?RareMindsArt.GOLD:RareMindsArt.DIM,1);
            float lt=(t-START-i*STAGGER)/DRIVE;boolean arrived=lt>=1;
            // left column: portrait, name, answer
            Texture face=art.face(l.character());float fs=rowH-14;
            if(face!=null){batch().setColor(l.ghost()?.6f:1,l.ghost()?.8f:1,1,l.ghost()?.7f:1);batch().draw(face,x+24,ry+7,fs,fs);}
            art.textLeft(art.small,l.name(),x+34+fs,cy+24,.82f,l.ghost()?RareMindsArt.GHOST:RareMindsArt.IVORY,1);
            String ans=!l.answered()?art_tr("нет ответа","no answer"):l.answer();
            art.textLeft(art.tiny,ellipsize(ans,22),x+34+fs,cy-6,.8f,!l.valid()?RareMindsArt.DIM:l.collided()?RareMindsArt.RED_SOFT:RareMindsArt.TIER[l.tier()],Math.min(1,Math.max(0,lt*3)));
            // the racer
            float from=l.fromSouls()/scale,to=l.souls()/scale,f=from+(to-from)*easeOut(lt);
            float rx=tx0+f*(tx1-tx0),shake=l.collided()&&arrived?MathUtils.sin(clock*60)*Math.max(0,1-(lt-1)*2)*5:0;
            Color c=!l.valid()?RareMindsArt.DIM:l.collided()&&arrived?RareMindsArt.RED:l.ghost()?RareMindsArt.GHOST:RareMindsArt.TIER[l.tier()];
            if(lt>0&&lt<1.6f&&to>from){float fx=tx0+from*(tx1-tx0),tw=rx-fx;batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
                for(int k=0;k<10;k++){float a=.035f*(k+1);batch().setColor(c.r,c.g,c.b,a);batch().draw(art.pixel,fx+tw*k/10f,cy-3,tw/10f+1,6);}
                batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            car(rx+shake,cy,Math.min(1.1f,rowH/62f),c,l.ghost(),lt>0&&lt<1);
            if(l.jackpot()&&t>arrival(n-1)+.3f){float a=easeOut((t-arrival(n-1)-.3f)*2);art.glow(rx,cy,220,140,RareMindsArt.GOLD,.35f*a);
                batch().setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,a);batch().draw(art.crown,rx-20,cy+16,40,40);}
            // result tag at the finish
            if(arrived){float a=easeOut((lt-1)*4);String tag;Color tc;
                if(!l.answered()){tag=art_tr("нет ответа","no answer");tc=RareMindsArt.DIM;}
                else if(!l.valid()){tag=art_tr("не принят","not accepted");tc=RareMindsArt.DIM;}
                else if(l.collided()){tag=art_tr("СОВПАДЕНИЕ ×","CRASH ×")+l.sharedWith()+"  +"+l.earned();tc=RareMindsArt.RED_SOFT;}
                else {tag=tierNames[l.tier()]+" · "+pct(l.share())+"  +"+(l.earned()+l.jackpotSouls());tc=RareMindsArt.TIER[l.tier()];}
                if(l.eliminated())tag+=art_tr("  · ВЫБЫЛ","  · OUT");if(l.resurrected())tag=art_tr("ВОСКРЕС!","BACK TO LIFE!");
                float lx=rx+68;if(lx+art.width(art.small,tag,.72f)>x+w-20)lx=rx-70-art.width(art.small,tag,.72f);
                art.textLeft(art.small,tag,lx,cy+12,.72f,tc,a);}
        }
        if(lockA>0){art.rect(x+2,y+2,w-4,h-4,RareMindsArt.PANEL,lockA*.9f);art.text(art.big,lockedText,x+w/2,y+h/2+30,1,RareMindsArt.IVORY,lockA,0);}
        boolean any=lanes.stream().anyMatch(Lane::jackpot);
        if(!any&&t>arrival(n-1)+.4f)art.text(art.small,noJackpot,x+w/2,y+24,.72f,RareMindsArt.DIM,1,0);
    }
    /** A low racing car seen from the side, in the lane's colour (procedural, no external art). */
    private void car(float cx,float cy,float s,Color c,boolean ghost,boolean moving){
        float a=ghost?.6f:1,w=118*s,h=w*40/128f;
        art.shade(cx,cy-h*.45f,w*1.3f,h*.9f,.7f);
        if(moving)art.glow(cx-w*.55f,cy,w*.9f,h*1.2f,c,.4f);
        batch().setColor(c.r,c.g,c.b,a);batch().draw(art.car,cx-w/2,cy-h/2,w,h);
        batch().setColor(1,1,1,.18f*a);batch().draw(art.car,cx-w/2,cy-h/2+h*.12f,w,h*.25f);
        batch().setColor(.05f,.05f,.07f,a);batch().draw(art.wheels,cx-w/2,cy-h/2,w,h);
        art.glow(cx+w*.48f,cy-h*.05f,26*s,14*s,Color.WHITE,.6f*a);
    }
    private static boolean arrivedAll(float t,int n){return t>=arrival(n-1);}
    private static String pct(double share){double p=share*100;return p>=1?Math.round(p)+"%":p>=.1?String.format(Locale.ROOT,"%.1f%%",p):"<0.1%";}
    private static String ellipsize(String s,int n){return s.length()<=n?s:s.substring(0,n-1)+"…";}
    private SpriteBatch batch(){return art.batch;}
    private static String art_tr(String ru,String en){return com.erni.finalanswer.localization.Localization.tr(ru,en);}
}
