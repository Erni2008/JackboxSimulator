package com.erni.finalanswer.rareminds;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.MathUtils;
import java.util.*;

/**
 * THE REVEAL. All answers open at once as cards (identical answers share one card with every player who gave it),
 * then a rarity spectrum rises along the bottom — COMMON on the left to LEGENDARY on the right, on a log scale of
 * the share of players who give an answer — and every card flies down onto its own spot on it. Once landed, each card
 * shows its share, rarity and souls; duplicates are stamped COLLISION, and the rarest unique answer is crowned.
 */
final class RareMindsSpectrum {
    static final float OPEN=.0f,FLY=1.1f,FLY_TIME=1.0f,STAGGER=.12f,SETTLE=.45f;
    /** when everything has landed and been labelled */
    static float duration(int n){return FLY+STAGGER*Math.max(0,n-1)+FLY_TIME+SETTLE+1.2f;}
    private static final double TOP=.25,BOTTOM=.0015;private static final double[] EDGES={.060,.025,.008};
    private final RareMindsArt art;RareMindsSpectrum(RareMindsArt art){this.art=art;}
    static float pos(double share){return MathUtils.clamp((float)((Math.log(TOP)-Math.log(Math.max(share,1e-6)))/(Math.log(TOP)-Math.log(BOTTOM))),0,1);}

    void draw(float x,float y,float w,float h,String title,List<RareMindsAnswerBoard.Group> groups,String[] tierNames,boolean fin,float t,float clock){
        art.panel(x,y,w,h,1,fin?RareMindsArt.RED:null);
        art.text(art.mid,title,x+w/2,y+h-22,.78f,RareMindsArt.IVORY,1,w-80);
        int n=groups.size();if(n==0)return;
        // the spectrum bar
        float bx0=x+50,bx1=x+w-50,by=y+64,bh=22;float bar=ease((t-FLY+.5f)/.5f);
        if(bar>0){float prev=bx0;
            for(int z=0;z<4;z++){float e=z<3?bx0+pos(EDGES[z])*(bx1-bx0):bx1;Color c=RareMindsArt.TIER[z];float zw=(e-prev)*bar;
                art.rect(prev,by,zw,bh,c,.85f);art.rect(prev,by+bh,zw,2,Color.WHITE,.25f);
                art.text(art.tiny,tierNames[z],prev+(e-prev)/2,by-12,.86f,c,bar,e-prev-6);prev=e;}
}
        // every answer is a cluster of character icons (one per player who gave it)
        float D=n>6?62:74,gapI=6;float[] cwid=new float[n];for(int i=0;i<n;i++)cwid[i]=Math.max(150,groups.get(i).members().size()*(D+gapI)-gapI);
        float lh=D+86;float[] landX=new float[n],landY=new float[n];List<float[]> placed=new ArrayList<>();
        Integer[] order=new Integer[n];for(int i=0;i<n;i++)order[i]=i;Arrays.sort(order,(a,b)->Double.compare(groups.get(b).share(),groups.get(a).share()));
        for(int k=0;k<n;k++){int i=order[k];var g=groups.get(i);float half=cwid[i]/2;float px=g.valid()?bx0+pos(g.share())*(bx1-bx0):bx0+half;px=MathUtils.clamp(px,bx0+half,bx1-half);
            float py=by+bh+18+lh/2;boolean moved=true;while(moved){moved=false;for(float[] o:placed)if(Math.abs(o[0]-px)<(o[2]+half)+10&&Math.abs(o[1]-py)<lh){py=o[1]+lh;moved=true;}}
            placed.add(new float[]{px,py,half});landX[i]=px;landY[i]=py;}
        // opening row: all answers at once across the top
        float total=0;for(float c:cwid)total+=c;total+=28*(n-1);float rowScale=Math.min(1,(w-60)/total),rx=x+w/2-total*rowScale/2,rowY=y+h-140;float[] gx=new float[n];
        for(int i=0;i<n;i++){gx[i]=rx+cwid[i]*rowScale/2;rx+=(cwid[i]+28)*rowScale;}
        for(int k=0;k<n;k++){int i=order[k];var g=groups.get(i);float landed=ease((t-FLY-k*STAGGER-FLY_TIME)/SETTLE);
            if(landed>0&&g.valid()){Color tc=RareMindsArt.TIER[g.tier()];art.rect(landX[i]-1,by+bh,2,landY[i]-lh/2+6-by-bh,tc,.7f*landed);}}
        for(int k=0;k<n;k++){int i=order[k];var g=groups.get(i);
            float pop=ease((t-OPEN)/.35f),fly=ease((t-FLY-k*STAGGER)/FLY_TIME);
            float cx=MathUtils.lerp(gx[i],landX[i],fly),cy=MathUtils.lerp(rowY,landY[i],fly)+MathUtils.sin(fly*MathUtils.PI)*50;
            float sc=MathUtils.lerp(rowScale,1,fly)*(pop<1?.6f+.4f*pop:1);float landed=ease((t-FLY-k*STAGGER-FLY_TIME)/SETTLE);
            cluster(g,cx,cy,D*sc,gapI*sc,pop,landed,tierNames,clock);
        }
    }
    /** one answer: the answer above, the players' character icons side by side, the result underneath */
    private void cluster(RareMindsAnswerBoard.Group g,float cx,float cy,float D,float gap,float a,float landed,String[] tierNames,float clock){
        if(a<=0)return;boolean col=g.collided()&&landed>0;Color tc=g.valid()?RareMindsArt.TIER[g.tier()]:RareMindsArt.DIM;
        Color ring=col?RareMindsArt.RED:landed>0?tc:RareMindsArt.GOLD;int m=g.members().size();float cw=m*(D+gap)-gap,x0=cx-cw/2;
        if(g.jackpot()&&landed>0)art.glow(cx,cy,cw+D*2.4f,D*3f,RareMindsArt.GOLD,.38f*landed*(.85f+.15f*MathUtils.sin(clock*4)));
        if(col)art.glow(cx,cy,cw+D*1.6f,D*2.2f,RareMindsArt.RED,.25f*landed);
        for(int i=0;i<m;i++){var mb=g.members().get(i);float px=x0+i*(D+gap);
            art.shade(px+D/2,cy-D*.12f,D*1.6f,D*1.4f,.7f*a);
            batch().setColor(.05f,.03f,.03f,a);batch().draw(art.soft,px-D*.05f,cy-D*.55f,D*1.1f,D*1.1f);
            Texture face=art.face(mb.character());if(face!=null){float al=g.valid()||landed<=0?1:.55f;batch().setColor(al,al,al,a);batch().draw(face,px,cy-D/2,D,D);}
            batch().setColor(ring.r,ring.g,ring.b,a);for(int r=0;r<4;r++)batch().draw(art.ring,px-3+r*.5f,cy-D/2-3+r*.5f,D+6-r,D+6-r);
            art.text(art.tiny,mb.name(),px+D/2,cy-D/2-8,.66f,RareMindsArt.IVORY,a*.9f,D+gap+30);}
        String ans=g.empty()?tr("нет ответа","no answer"):g.answer();float aw=Math.min(Math.max(cw,140)+40,art.width(art.small,ans,.92f)+28);
        art.rect(cx-aw/2,cy+D/2+8,aw,36,RareMindsArt.PANEL,a);art.rect(cx-aw/2,cy+D/2+8,aw,3,ring,a);
        art.text(art.small,ans,cx,cy+D/2+38,.92f,g.valid()?RareMindsArt.IVORY:RareMindsArt.DIM,a,aw-12);
        if(g.jackpot()&&landed>0){batch().setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,landed);batch().draw(art.crown,cx-24,cy+D/2+40+(1-landed)*14,48,48);}
        if(landed>0){String info=!g.valid()?(g.empty()?"0":tr("не принято","not accepted")):(col?tr("СОВПАДЕНИЕ","COLLISION"):tierNames[g.tier()])+" · "+pct(g.share())+"  +"+g.souls();
            art.text(art.tiny,info,cx,cy-D/2-30,.76f,col?RareMindsArt.RED_SOFT:tc,landed,cw+80);
            if(g.typed()!=null)art.text(art.tiny,g.typed()+" → "+tr("исправлено","corrected"),cx,cy-D/2-52,.58f,RareMindsArt.DIM,landed*.8f,cw+80);}
    }
    private static String pct(double share){double p=share*100;return p>=1?Math.round(p)+"%":p>=.1?String.format(Locale.ROOT,"%.1f%%",p):"<0.1%";}
    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
    private com.badlogic.gdx.graphics.g2d.SpriteBatch batch(){return art.batch;}
    private static String tr(String ru,String en){return com.erni.finalanswer.localization.Localization.tr(ru,en);}
}
