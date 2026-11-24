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
                int tier,double share,int earned,boolean jackpot,int jackpotSouls,boolean eliminated,boolean resurrected,long fromSouls,long souls,
                String live,boolean locked,float lockAge,int skulls,boolean zone){
        /** a lane during the answer window: cars parked at their souls, live typing in the left column */
        static Lane waiting(String name,String character,boolean ghost,long souls,String live,boolean locked,float lockAge,int skulls,boolean zone){
            return new Lane(name,character,"",false,false,false,0,ghost,0,0,0,false,0,false,false,souls,souls,live,locked,lockAge,skulls,zone);}
    }
    /** Each character always drives the same colour (never recoloured by state: easy to follow across the match). */
    static Color carColor(String character){return switch(character==null?"":character){
        case "skeleton"->new Color(.92f,.90f,.84f,1);case "ghost"->new Color(.45f,.85f,1f,1);case "zombie"->new Color(.45f,.85f,.35f,1);case "dracula"->new Color(.85f,.12f,.16f,1);
        case "pumpkin"->new Color(1f,.55f,.12f,1);case "plague_doctor"->new Color(.62f,.42f,.95f,1);case "voodoo"->new Color(.98f,.80f,.25f,1);case "puppeteer"->new Color(.25f,.45f,1f,1);
        default->new Color(.8f,.8f,.8f,1);};}
    /** smoothed lane slot per player (lanes are ordered by souls and slide when someone overtakes) */
    private final Map<String,Float> slot=new HashMap<>();private final Map<String,Integer> lastRank=new HashMap<>();private final Map<String,Float> upAt=new HashMap<>();private float lastClock=-1;
    static final float START=.9f,STAGGER=.12f,DRIVE=2.4f;
    /** shares at the zone boundaries (same as the server tiers) and the scale ends */
    private static final double TOP=.25,BOTTOM=.0015;private static final double[] EDGES={.080,.045,.022,.010,.004};
    static float arrival(int lane){return START+lane*STAGGER+DRIVE;}

    private final RareMindsArt art;RareMindsRace(RareMindsArt art){this.art=art;}
    private static float pos(double share){return MathUtils.clamp((float)((Math.log(TOP)-Math.log(Math.max(share,1e-6)))/(Math.log(TOP)-Math.log(BOTTOM))),0,1);}
    private static float easeOut(float t){t=MathUtils.clamp(t,0,1);float u=1-t;return 1-u*u*u;}

    void draw(float x,float y,float w,float h,String title,List<Lane> lanes,String[] tierNames,boolean fin,float t,float clock,String lockedText,String noJackpot){draw(x,y,w,h,title,lanes,tierNames,fin,t,clock,lockedText,noJackpot,false);}
    void draw(float x,float y,float w,float h,String title,List<Lane> lanes,String[] tierNames,boolean fin,float t,float clock,String lockedText,String noJackpot,boolean live){
        art.panel(x,y,w,h,1,fin?RareMindsArt.RED:null);
        if(live)art.text(art.big,title,x+w/2,y+h-14,.82f,RareMindsArt.IVORY,1,w-80);else art.text(art.mid,title,x+w/2,y+h-22,.78f,RareMindsArt.IVORY,1,w-80);
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
        float dt=lastClock<0?1:Math.min(.1f,clock-lastClock);lastClock=clock;
        if(live)t=99;float lockA=live?0:MathUtils.clamp(1-(t-START+.2f)*3,0,1);
        float tt=live?99:t;float[] cur=new float[lanes.size()];
        for(int i=0;i<lanes.size();i++){Lane l=lanes.get(i);float q=(tt-START-i*STAGGER)/DRIVE;cur[i]=l.fromSouls()+(l.souls()-l.fromSouls())*easeOut(q);}
        Integer[] idx=new Integer[lanes.size()];for(int i=0;i<idx.length;i++)idx[i]=i;
        Arrays.sort(idx,(a,b)->cur[a]!=cur[b]?Float.compare(cur[b],cur[a]):Integer.compare(a,b));
        int[] rank=new int[lanes.size()];for(int k=0;k<idx.length;k++)rank[idx[k]]=k;
        for(int i=0;i<lanes.size();i++){String key=lanes.get(i).name();Integer before=lastRank.get(key);if(before!=null&&rank[i]<before)upAt.put(key,clock);lastRank.put(key,rank[i]);
            float sv=slot.getOrDefault(key,(float)rank[i]);sv+=(rank[i]-sv)*Math.min(1,dt*5.5f);slot.put(key,sv);}
        for(int i=0;i<lanes.size();i++){Lane l=lanes.get(i);float sl=slot.get(l.name());float ry=laneTop-(sl+1)*rowH,cy=ry+rowH/2;
            Float up=upAt.get(l.name());if(up!=null&&clock-up<1.4f){float a=1-(clock-up)/1.4f;art.rect(x+16,ry,w-32,rowH,new Color(.3f,1f,.45f,1),.10f*a);art.text(art.mid,"▲",x+28+2,cy+14+(1-a)*12,.7f,new Color(.35f,1f,.5f,1),a,0);}
            if(rank[i]%2==0)art.rect(x+16,ry,w-32,rowH,Color.WHITE,.025f);
            float lt=(t-START-i*STAGGER)/DRIVE;boolean arrived=lt>=1;
            // left column: portrait, name, answer
            Texture face=art.face(l.character());float fs=rowH-14;
            if(face!=null){batch().setColor(l.ghost()?.6f:1,l.ghost()?.8f:1,1,l.ghost()?.7f:1);batch().draw(face,x+24,ry+7,fs,fs);}
            art.textLeft(art.small,l.name(),x+34+fs,cy+24,.82f,l.ghost()?RareMindsArt.GHOST:RareMindsArt.IVORY,1);
            if(live){
                // skulls next to the name, then what the player is typing right now
                float sx=x+34+fs+art.width(art.small,l.name(),.82f)+14;
                for(int k=0;k<3;k++){Color sc=k<l.skulls()?(l.ghost()?RareMindsArt.GHOST:RareMindsArt.RED):new Color(.3f,.24f,.22f,1);batch().setColor(sc);batch().draw(art.skull,sx+k*24,cy+4,22,22);}
                String txt=l.live()==null?"":l.live();boolean blink=((int)(clock*2))%2==0;
                String shown=txt.isEmpty()?(l.locked()?"":"…"):txt+(l.locked()||!blink?"":"|");
                art.textLeft(art.small,ellipsize(shown,20),x+34+fs,cy-4,.78f,l.locked()?RareMindsArt.GOLD:Color.WHITE,txt.isEmpty()?.4f:1);
                if(l.locked())art.textRight(art.tiny,art_tr("ГОТОВ","LOCKED"),tx0-16,cy-6,.72f,RareMindsArt.GOLD,1);
                if(l.zone())art.textRight(art.tiny,art_tr("ЗОНА СМЕРТИ","DEATH ZONE"),tx0-16,cy+26,.62f,RareMindsArt.RED_SOFT,.7f+.3f*MathUtils.sin(clock*5));
            }else{
            String ans=!l.answered()?art_tr("нет ответа","no answer"):l.answer();
            art.textLeft(art.tiny,ellipsize(ans,22),x+34+fs,cy-6,.8f,!l.valid()?RareMindsArt.DIM:l.collided()?RareMindsArt.RED_SOFT:RareMindsArt.TIER[l.tier()],Math.min(1,Math.max(0,lt*3)));}
            // the racer
            float from=l.fromSouls()/scale,to=l.souls()/scale,f=from+(to-from)*easeOut(lt);
            float rx=tx0+f*(tx1-tx0),shake=l.collided()&&arrived?MathUtils.sin(clock*60)*Math.max(0,1-(lt-1)*2)*5:0;
            Color c=carColor(l.character());if(l.collided()&&arrived)art.glow(rx,cy,160,90,RareMindsArt.RED,.5f*Math.max(0,1-(lt-1)));
            if(lt>0&&lt<1.6f&&to>from){float fx=tx0+from*(tx1-tx0),tw=rx-fx;batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
                for(int k=0;k<10;k++){float a=.035f*(k+1);batch().setColor(c.r,c.g,c.b,a);batch().draw(art.pixel,fx+tw*k/10f,cy-3,tw/10f+1,6);}
                batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(live){
                // engine revs: idle shiver; on locking in the car leaps forward and settles, exhaust flaring
                c=carColor(l.character());
                float age=l.lockAge(),leap=l.locked()&&age>=0&&age<1.2f?MathUtils.sin(Math.min(1,age/1.2f)*MathUtils.PI)*38:0;
                float idle=l.locked()?0:MathUtils.sin(clock*38+i)*1.2f;
                if(leap>0){batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);for(int k=0;k<4;k++){batch().setColor(1f,.55f,.2f,.25f*(1-age/1.2f));batch().draw(art.soft,rx+leap-70-k*22,cy-10-k*2,40+k*14,24+k*6);}batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
                car(rx+leap+idle,cy+(l.locked()?0:Math.abs(idle)*.6f),Math.min(1.1f,rowH/62f),c,l.ghost(),leap>0);
                continue;
            }
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
