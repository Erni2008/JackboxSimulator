package com.erni.finalanswer.rareminds;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.MathUtils;
import java.util.*;

/**
 * Scores after a question (matches without the Soul Race): one row per player in the old order, each row's souls
 * count up with a "+gained" chip, then the table re-sorts in one smooth move; overtakers flash ▲.
 */
final class RareMindsLeaderboard {
    record Row(String name,String character,long from,long to,int skulls,boolean ghost,boolean collided,boolean jackpot,int team){}
    private final RareMindsArt art;RareMindsLeaderboard(RareMindsArt art){this.art=art;}
    void draw(float x,float y,float w,float h,String title,List<Row> rows,float t){
        art.panel(x,y,w,h,1,null);art.text(art.mid,title,x+w/2,y+h-22,.78f,RareMindsArt.IVORY,1,w-80);
        int n=rows.size();if(n==0)return;float top=y+h-80,rowH=Math.min(76,(top-y-24)/n);
        float count=ease((t-.3f)/1.2f),sort=ease((t-1.8f)/.8f);
        Integer[] before=order(rows,false),after=order(rows,true);int[] rb=new int[n],ra=new int[n];for(int k=0;k<n;k++){rb[before[k]]=k;ra[after[k]]=k;}
        for(int i=0;i<n;i++){Row r=rows.get(i);float slot=MathUtils.lerp(rb[i],ra[i],sort);float ry=top-(slot+1)*rowH,cy=ry+rowH/2;
            boolean up=ra[i]<rb[i]&&sort>0;
            art.rect(x+24,ry+3,w-48,rowH-6,up?new Color(.3f,1f,.45f,1):Color.WHITE,up?.08f*(1-Math.abs(sort-.5f)*2+.3f):.035f);
            int place=(sort>.5f?ra[i]:rb[i])+1;Color mc=place==1?RareMindsArt.GOLD:place==2?new Color(.8f,.82f,.86f,1):place==3?new Color(.8f,.52f,.3f,1):RareMindsArt.DIM;
            art.text(art.num,String.valueOf(place),x+62,cy+16,.62f,mc,1,0);
            Texture face=art.face(r.character());float fs=rowH-16;if(face!=null){batch().setColor(r.ghost()?.6f:1,r.ghost()?.8f:1,1,1);batch().draw(face,x+100,cy-fs/2,fs,fs);}
            batch().setColor(mc);batch().draw(art.ring,x+98,cy-fs/2-2,fs+4,fs+4);
            art.textLeft(art.small,r.name(),x+116+fs,cy+18,.95f,r.team()>=0?RareMindsScreen.teamColor(r.team()):r.ghost()?RareMindsArt.GHOST:RareMindsArt.IVORY,1);
            if(r.team()>=0)art.rect(x+24,ry+3,5,rowH-6,RareMindsScreen.teamColor(r.team()),.9f);
            for(int k=0;k<3;k++){batch().setColor(k<r.skulls()?(r.ghost()?RareMindsArt.GHOST:RareMindsArt.RED):new Color(.3f,.24f,.22f,1));batch().draw(art.skull,x+118+fs+k*26,cy-24,22,22);}
            long shown=r.from()+Math.round((r.to()-r.from())*count);
            art.textRight(art.num,String.format(Locale.ROOT,"%,d",shown).replace(',',' '),x+w-60,cy+18,.62f,RareMindsArt.GOLD,1);
            long gain=r.to()-r.from();if(gain!=0&&t>.2f){String chip=(gain>0?"+":"−")+Math.abs(gain);float a=ease((t-.2f)/.3f)*(1-ease((t-3f)/.6f));
                art.textRight(art.small,chip,x+w-260,cy+16,.8f,gain>0?(r.jackpot()?RareMindsArt.GOLD:new Color(.45f,1f,.55f,1)):RareMindsArt.RED_SOFT,a);}
            if(up&&sort<1)art.text(art.mid,"▲",x+w-300,cy+16,.6f,new Color(.35f,1f,.5f,1),1,0);
        }
    }
    private static Integer[] order(List<Row> rows,boolean after){Integer[] o=new Integer[rows.size()];for(int i=0;i<o.length;i++)o[i]=i;
        Arrays.sort(o,(a,b)->{long va=after?rows.get(a).to():rows.get(a).from(),vb=after?rows.get(b).to():rows.get(b).from();return va!=vb?Long.compare(vb,va):Integer.compare(a,b);});return o;}
    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
    private com.badlogic.gdx.graphics.g2d.SpriteBatch batch(){return art.batch;}
}
