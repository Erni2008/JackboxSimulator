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
                String live,boolean locked,float lockAge,int skulls,boolean zone,int duelBonus){
        /** a lane during the answer window: cars parked at their souls, live typing in the left column */
        static Lane waiting(String name,String character,boolean ghost,long souls,String live,boolean locked,float lockAge,int skulls,boolean zone){
            return new Lane(name,character,"",false,false,false,0,ghost,0,0,0,false,0,false,false,souls,souls,live,locked,lockAge,skulls,zone,0);}
    }
    /** Each character always drives the same colour (never recoloured by state: easy to follow across the match). */
    static Color carColor(String character){return switch(character==null?"":character){
        case "skeleton"->new Color(.92f,.90f,.84f,1);case "ghost"->new Color(.45f,.85f,1f,1);case "zombie"->new Color(.45f,.85f,.35f,1);case "dracula"->new Color(.85f,.12f,.16f,1);
        case "pumpkin"->new Color(1f,.55f,.12f,1);case "plague_doctor"->new Color(.62f,.42f,.95f,1);case "voodoo"->new Color(.98f,.80f,.25f,1);case "puppeteer"->new Color(.25f,.45f,1f,1);
        default->new Color(.8f,.8f,.8f,1);};}
    /** smoothed lane slot per player (lanes are ordered by souls and slide when someone overtakes) */
    private final Map<String,Float> slot=new HashMap<>();private final Map<String,Integer> lastRank=new HashMap<>();private final Map<String,Float> upAt=new HashMap<>();private float lastClock=-1,maxScale=0;private final Map<String,String> typed=new HashMap<>();private final Map<String,Integer> stable=new HashMap<>();private final Map<String,Float> typedAt=new HashMap<>(),fixedAt=new HashMap<>();
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
        float tx0=x+380,tx1=x+w-110,top=y+h-92,bottom=y+44;int n=Math.max(1,lanes.size());float rowH=Math.min(96,(top-bottom)/n);
        float laneTop=top,laneBottom=top-rowH*n;
        // distance scale: souls, rescaled so the leader stays near the flag
        long far=2000;for(Lane l:lanes)far=Math.max(far,Math.max(l.souls(),l.fromSouls()));
        /* the scale only ever grows during a match (no jumps between the answer window and the reveal) */
        float want=far*1.12f;if(want>maxScale)maxScale=want;float scale=maxScale;
        long step=far>12000?4000:far>6000?2000:1000;
        for(long m=0;m<=scale;m+=step){float gx=tx0+(m/scale)*(tx1-tx0);art.rect(gx,laneBottom,1,laneTop-laneBottom,Color.WHITE,m==0?.35f:.08f);
            art.text(art.tiny,m==0?art_tr("СТАРТ","START"):String.format(Locale.ROOT,"%,d",m).replace(',',' '),gx,laneTop+24,.6f,RareMindsArt.DIM,1,0);}
        art.rect(tx0,laneTop,tx1-tx0,2,RareMindsArt.GOLD,.6f);
        art.text(art.tiny,art_tr("ДУШИ ЗА ИГРУ","SOULS THIS GAME"),tx1-60,laneBottom-10,.6f,RareMindsArt.DIM,.8f,0);
        // places after this question
        float dt=lastClock<0?1:Math.min(.1f,clock-lastClock);lastClock=clock;
        if(live)t=99;float lockA=0; /* the answer board now covers the lock moment */
        float tt=live?99:t;float[] cur=new float[lanes.size()];
        /* order holds while the cars drive; once everyone has arrived the standings re-sort in one smooth move */
        boolean settled=live||tt>=arrival(lanes.size()-1)+.35f;
        for(int i=0;i<lanes.size();i++){Lane l=lanes.get(i);cur[i]=settled?l.souls():l.fromSouls();}
        Integer[] idx=new Integer[lanes.size()];for(int i=0;i<idx.length;i++)idx[i]=i;
        Arrays.sort(idx,(a,b)->cur[a]!=cur[b]?Float.compare(cur[b],cur[a]):Integer.compare(a,b));
        int[] rank=new int[lanes.size()];for(int k=0;k<idx.length;k++)rank[idx[k]]=k;
        for(int i=0;i<lanes.size();i++){String key=lanes.get(i).name();Integer before=lastRank.get(key);if(before!=null&&rank[i]<before)upAt.put(key,clock);lastRank.put(key,rank[i]);
            float sv=slot.getOrDefault(key,(float)rank[i]);sv+=(rank[i]-sv)*Math.min(1,dt*4f);slot.put(key,sv);}
        for(int i=0;i<lanes.size();i++){Lane l=lanes.get(i);float sl=slot.get(l.name());float ry=laneTop-(sl+1)*rowH,cy=ry+rowH/2;
            Float up=upAt.get(l.name());if(up!=null&&clock-up<1.4f){float a=1-(clock-up)/1.4f;art.rect(x+16,ry,w-32,rowH,new Color(.3f,1f,.45f,1),.10f*a);art.text(art.mid,"▲",x+28+2,cy+14+(1-a)*12,.7f,new Color(.35f,1f,.5f,1),a,0);}
            // asphalt lane: dark tarmac with a faint sheen, dashed white lane line, white start line
            art.rect(tx0-6,ry+3,tx1-tx0+12,rowH-6,new Color(.075f,.068f,.07f,1),.92f);
            art.rect(tx0-6,ry+rowH-9,tx1-tx0+12,3,Color.WHITE,.035f);
            for(float dx=tx0;dx<tx1;dx+=46)art.rect(dx,ry+1,24,2,Color.WHITE,.22f);
            art.rect(tx0-2,ry+3,4,rowH-6,Color.WHITE,.55f);
            // place medallion
            {float bx=x+34,by=cy;Color mc=rank[i]==0?RareMindsArt.GOLD:rank[i]==1?new Color(.80f,.82f,.86f,1):rank[i]==2?new Color(.80f,.52f,.30f,1):new Color(.45f,.40f,.38f,1);
             art.shade(bx,by-3,50,50,.7f);batch().setColor(.08f,.05f,.04f,1);batch().draw(art.soft,bx-17,by-17,34,34);batch().setColor(mc);batch().draw(art.ring,bx-17,by-17,34,34);batch().draw(art.ring,bx-16,by-16,32,32);
             art.text(art.num,String.valueOf(rank[i]+1),bx,by+11,.48f,mc,1,0);}
            float lt=(t-START-i*STAGGER)/DRIVE;boolean arrived=lt>=1;
            // left column: portrait, name, answer
            Texture face=art.face(l.character());float fs=Math.min(64,rowH-14);
            if(face!=null){batch().setColor(l.ghost()?.6f:1,l.ghost()?.8f:1,1,l.ghost()?.7f:1);batch().draw(face,x+62,cy-fs/2,fs,fs);}
            art.textLeft(art.small,l.name(),x+72+fs,cy+24,.82f,l.ghost()?RareMindsArt.GHOST:RareMindsArt.IVORY,1);
            if(live){
                // skulls next to the name, then what the player is typing right now
                float sx=x+72+fs+art.width(art.small,l.name(),.82f)+14;
                for(int k=0;k<3;k++){Color sc=k<l.skulls()?(l.ghost()?RareMindsArt.GHOST:RareMindsArt.RED):new Color(.3f,.24f,.22f,1);batch().setColor(sc);batch().draw(art.skull,sx+k*24,cy+4,22,22);}
                String txt=l.live()==null?"":l.live();boolean blink=((int)(clock*2))%2==0;
                // letters arrive like typing: the newest characters fade and slide in instead of popping
                String prev=typed.getOrDefault(l.name(),"");if(!txt.equals(prev)&&l.locked()&&!prev.isEmpty()&&!txt.equalsIgnoreCase(prev))fixedAt.put(l.name(),clock);
                if(!txt.equals(prev)){int keep=0;while(keep<Math.min(prev.length(),txt.length())&&prev.charAt(keep)==txt.charAt(keep))keep++;stable.put(l.name(),keep);typedAt.put(l.name(),clock);typed.put(l.name(),txt);}
                Color tc=l.locked()?RareMindsArt.GOLD:Color.WHITE;float tx=x+72+fs;
                if(txt.isEmpty())art.textLeft(art.small,l.locked()?"":"…",tx,cy-4,.78f,tc,.4f);
                else{String vis=ellipsize(txt,20);int keep=Math.min(stable.getOrDefault(l.name(),0),vis.length());float k=Math.min(1,(clock-typedAt.getOrDefault(l.name(),0f))/.22f);
                    String head=vis.substring(0,keep),tail=vis.substring(keep);art.textLeft(art.small,head,tx,cy-4,.78f,tc,1);
                    float hx=tx+art.width(art.small,head,.78f);if(!tail.isEmpty())art.textLeft(art.small,tail,hx+(1-k)*8,cy-4,.78f,tc,k);
                    Float fixed=fixedAt.get(l.name());if(fixed!=null&&clock-fixed<2.2f){float fa=Math.min(1,(clock-fixed)*4)*Math.min(1,(2.2f-(clock-fixed))*2);float ex=hx+art.width(art.small,tail,.78f)+12;
                        art.rect(ex,cy-26,art.width(art.tiny,art_tr("исправлено","corrected"),.6f)+12,20,new Color(.3f,1f,.45f,1),.18f*fa);art.textLeft(art.tiny,art_tr("исправлено","corrected"),ex+6,cy-11,.6f,new Color(.45f,1f,.55f,1),fa);}
                    if(!l.locked()&&blink)art.rect(hx+art.width(art.small,tail,.78f)+3,cy-30,2,26,RareMindsArt.GOLD,1);}
                if(l.locked()){float bx=sx+3*24+10;art.rect(bx,cy+5,art.width(art.tiny,art_tr("ПРИНЯТ","LOCKED"),.62f)+14,20,RareMindsArt.GOLD,.18f);art.textLeft(art.tiny,art_tr("ПРИНЯТ","LOCKED"),bx+7,cy+21,.62f,RareMindsArt.GOLD,1);}
                if(l.zone())art.textRight(art.tiny,art_tr("ЗОНА СМЕРТИ","DEATH ZONE"),tx0-16,cy+26,.62f,RareMindsArt.RED_SOFT,.7f+.3f*MathUtils.sin(clock*5));
            }else{
            String ans=!l.answered()?art_tr("нет ответа","no answer"):l.answer();
            art.textLeft(art.tiny,ellipsize(ans,22),x+72+fs,cy-6,.8f,!l.valid()?RareMindsArt.DIM:l.collided()?RareMindsArt.RED_SOFT:RareMindsArt.TIER[l.tier()],Math.min(1,Math.max(0,lt*3)));}
            // the racer
            float from=l.fromSouls()/scale,to=l.souls()/scale,f=from+(to-from)*easeOut(lt);
            float carW=124*Math.min(1.25f,rowH/62f);float rx=tx0+carW/2+4+f*(tx1-tx0-carW-8),shake=l.collided()&&arrived?MathUtils.sin(clock*60)*Math.max(0,1-(lt-1)*2)*5:0;
            Color c=carColor(l.character());if(l.collided()&&arrived)art.glow(rx,cy,160,90,RareMindsArt.RED,.5f*Math.max(0,1-(lt-1)));
            if(lt>0&&lt<1.6f&&to>from){float fx=tx0+carW/2+4+from*(tx1-tx0-carW-8)-carW/2,tw=rx-carW/2-fx;batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
                for(int k=0;k<10;k++){float a=.035f*(k+1);batch().setColor(c.r,c.g,c.b,a);batch().draw(art.pixel,fx+tw*k/10f,cy-3,tw/10f+1,6);}
                batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            if(live){
                // engine revs: idle shiver; on locking in the car leaps forward and settles, exhaust flaring
                c=carColor(l.character());
                float age=l.lockAge(),leap=l.locked()&&age>=0&&age<1.2f?MathUtils.sin(Math.min(1,age/1.2f)*MathUtils.PI)*38:0;
                float idle=l.locked()?0:MathUtils.sin(clock*38+i)*1.2f;
                if(leap>0){batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);for(int k=0;k<4;k++){batch().setColor(1f,.55f,.2f,.25f*(1-age/1.2f));batch().draw(art.soft,rx+leap-70-k*22,cy-10-k*2,40+k*14,24+k*6);}batch().setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
                car(rx+leap+idle,cy+(l.locked()?0:Math.abs(idle)*.6f),Math.min(1.25f,rowH/62f),c,l.ghost(),leap>0);
                continue;
            }
            car(rx+shake,cy,Math.min(1.25f,rowH/62f),c,l.ghost(),lt>0&&lt<1);
            if(l.jackpot()&&t>arrival(n-1)+.3f){float a=easeOut((t-arrival(n-1)-.3f)*2);art.glow(rx,cy,220,140,RareMindsArt.GOLD,.35f*a);
                batch().setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,a);batch().draw(art.crown,rx-20,cy+16,40,40);}
            // result tag at the finish
            if(arrived){float a=easeOut((lt-1)*4);String tag;Color tc;
                if(!l.answered()){tag=art_tr("нет ответа","no answer");tc=RareMindsArt.DIM;}
                else if(!l.valid()){tag=art_tr("не принят","not accepted");tc=RareMindsArt.DIM;}
                else if(l.collided()){tag=art_tr("СОВПАДЕНИЕ ×","CRASH ×")+l.sharedWith()+"  +"+l.earned();tc=RareMindsArt.RED_SOFT;}
                else {tag=tierNames[l.tier()]+" · "+pct(l.share())+"  +"+(l.earned()+l.jackpotSouls());tc=RareMindsArt.TIER[l.tier()];}
                if(l.duelBonus()>0)tag+=art_tr("  · ДУЭЛЬ +","  · DUEL +")+l.duelBonus();
                if(l.eliminated())tag+=art_tr("  · ВЫБЫЛ","  · OUT");if(l.resurrected())tag=art_tr("ВОСКРЕС!","BACK TO LIFE!");
                float cw2=59*Math.min(1.25f,rowH/62f)+14;float lx=rx+cw2;if(lx+art.width(art.small,tag,.72f)>x+w-20)lx=rx-cw2-art.width(art.small,tag,.72f);
                art.textLeft(art.small,tag,lx,cy+12,.72f,tc,a);}
        }
        if(lockA>0){art.rect(x+2,y+2,w-4,h-4,RareMindsArt.PANEL,lockA*.9f);art.text(art.big,lockedText,x+w/2,y+h/2+30,1,RareMindsArt.IVORY,lockA,0);}
        boolean any=lanes.stream().anyMatch(Lane::jackpot);
        if(!any&&t>arrival(n-1)+.4f)art.text(art.small,noJackpot,x+w/2,y+24,.72f,RareMindsArt.DIM,1,0);
    }
    /** A low racing car seen from the side, in the lane's colour (procedural, no external art). */
    private void car(float cx,float cy,float s,Color c,boolean ghost,boolean moving){car(cx,cy,s,c,ghost,moving,-1);}
    /** A side-view race car: tinted body, darker underside, a hard specular stripe, tyres, glass, headlight and race number. */
    private void car(float cx,float cy,float s,Color c,boolean ghost,boolean moving,int number){
        float a=ghost?.55f:1,w=124*s,h=w*160/512f,x=cx-w/2,y=cy-h/2;
        art.shade(cx,y+h*.08f,w*1.2f,h*.45f,.85f);
        if(moving)art.glow(cx-w*.62f,cy-h*.05f,w*.8f,h*.9f,c,.40f);
        batch().setColor(c.r,c.g,c.b,a);batch().draw(art.carBody,x,y,w,h);
        batch().setColor(1,1,1,a);batch().draw(art.carDetail,x,y,w,h);
    }
    private static boolean arrivedAll(float t,int n){return t>=arrival(n-1);}
    private static String pct(double share){double p=share*100;return p>=1?Math.round(p)+"%":p>=.1?String.format(Locale.ROOT,"%.1f%%",p):"<0.1%";}
    private static String ellipsize(String s,int n){return s.length()<=n?s:s.substring(0,n-1)+"…";}
    private SpriteBatch batch(){return art.batch;}
    private static String art_tr(String ru,String en){return com.erni.finalanswer.localization.Localization.tr(ru,en);}
}
