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
        // grid slots (all cards open together) and landing spots (stacked where they overlap)
        int cols=Math.min(n,4),rows=(n+cols-1)/cols;float cw=Math.min(250,(w-80-18*(cols-1))/cols),ch=128,gap=22,gridTop=y+h-84;
        float lw=Math.min(230,(bx1-bx0)/Math.max(3,n)-8),lh=118;float[] landX=new float[n],landY=new float[n];List<float[]> placed=new ArrayList<>();
        Integer[] order=new Integer[n];for(int i=0;i<n;i++)order[i]=i;Arrays.sort(order,(a,b)->Double.compare(groups.get(b).share(),groups.get(a).share()));
        for(int i=0;i<n;i++){var g=groups.get(i);float px=g.valid()?bx0+pos(g.share())*(bx1-bx0):bx0+lw/2;px=MathUtils.clamp(px,bx0+lw/2,bx1-lw/2);
            float py=by+bh+26+lh/2;boolean moved=true;while(moved){moved=false;for(float[] o:placed)if(Math.abs(o[0]-px)<lw+6&&Math.abs(o[1]-py)<lh+4){py=o[1]+lh+8;moved=true;}}
            placed.add(new float[]{px,py});landX[i]=px;landY[i]=py;}
        for(int k=0;k<n;k++){int i=order[k];var g=groups.get(i);float landed=ease((t-FLY-k*STAGGER-FLY_TIME)/SETTLE);
            if(landed>0&&g.valid()){Color tc=RareMindsArt.TIER[g.tier()];art.rect(landX[i]-1,by+bh,2,landY[i]-lh/2-by-bh,tc,.7f*landed);}}
        for(int k=0;k<n;k++){int i=order[k];var g=groups.get(i);int r=i/cols,c=i%cols;int inRow=Math.min(cols,n-r*cols);
            float gx=x+w/2-(inRow*cw+(inRow-1)*gap)/2+c*(cw+gap)+cw/2,gy=gridTop-r*(ch+gap)-ch/2;
            float pop=ease((t-OPEN)/.35f),fly=ease((t-FLY-k*STAGGER)/FLY_TIME);
            float cx=MathUtils.lerp(gx,landX[i],fly),cy=MathUtils.lerp(gy,landY[i],fly)+MathUtils.sin(fly*MathUtils.PI)*40;
            float cwi=MathUtils.lerp(cw,lw,fly),chi=MathUtils.lerp(ch,lh,fly);float sc=pop<1?.6f+.4f*pop:1;
            float landed=ease((t-FLY-k*STAGGER-FLY_TIME)/SETTLE);
            card(g,cx,cy,cwi*sc,chi*sc,pop,landed,tierNames,clock,fly);
        }
    }
    private void card(RareMindsAnswerBoard.Group g,float cx,float cy,float w,float h,float a,float landed,String[] tierNames,float clock,float fly){
        if(a<=0)return;boolean col=g.collided()&&landed>0;Color tc=g.valid()?RareMindsArt.TIER[g.tier()]:RareMindsArt.DIM;
        if(g.jackpot()&&landed>0)art.glow(cx,cy,w*2.2f,h*2.6f,RareMindsArt.GOLD,.35f*landed*(.85f+.15f*MathUtils.sin(clock*4)));
        art.shade(cx,cy-6,w+40,h+30,.6f*a);
        art.rect(cx-w/2,cy-h/2,w,h,RareMindsArt.PANEL,a);
        Color edge=col?RareMindsArt.RED:landed>0?tc:RareMindsArt.GOLD;
        art.rect(cx-w/2,cy+h/2-3,w,3,edge,a);art.rect(cx-w/2,cy-h/2,w,1.5f,edge,.6f*a);art.rect(cx-w/2,cy-h/2,1.5f,h,edge,.6f*a);art.rect(cx+w/2-1.5f,cy-h/2,1.5f,h,edge,.6f*a);
        float s=w/250f;
        art.text(art.small,g.empty()?tr("нет ответа","no answer"):g.answer(),cx,cy+h/2-10,Math.max(.8f,1.15f*s),g.valid()?RareMindsArt.IVORY:RareMindsArt.DIM,a,w-14);
        int m=g.members().size();float fs=Math.min(40,Math.max(26,h*.36f)),fx=cx-(m*(fs+4)-4)/2;
        for(int i=0;i<m;i++){var mb=g.members().get(i);Texture face=art.face(mb.character());float px=fx+i*(fs+4),py=cy-fs/2+(landed>0?2:-6);
            if(face!=null){batch().setColor(1,1,1,a);batch().draw(face,px,py,fs,fs);}batch().setColor(edge.r,edge.g,edge.b,a);batch().draw(art.ring,px-1.5f,py-1.5f,fs+3,fs+3);}
        if(landed>0){String info=!g.valid()?(g.empty()?"0":tr("не принято","not accepted")):(col?tr("СОВПАДЕНИЕ","COLLISION"):tierNames[g.tier()])+" · "+pct(g.share())+"  +"+g.souls();
            art.rect(cx-w/2+2,cy-h/2+2,w-4,26,col?RareMindsArt.RED:tc,.22f*landed);art.text(art.tiny,info,cx,cy-h/2+22,.72f,col?RareMindsArt.RED_SOFT:tc,landed,w-10);
            if(g.jackpot()){batch().setColor(RareMindsArt.GOLD.r,RareMindsArt.GOLD.g,RareMindsArt.GOLD.b,landed);batch().draw(art.crown,cx-20,cy+h/2-4+(1-landed)*14,40,40);}
            if(g.typed()!=null)art.text(art.tiny,g.typed()+" → "+tr("исправлено","corrected"),cx,cy+h/2+18,.56f,RareMindsArt.DIM,landed*.8f,w+40);}
    }
    private static String pct(double share){double p=share*100;return p>=1?Math.round(p)+"%":p>=.1?String.format(Locale.ROOT,"%.1f%%",p):"<0.1%";}
    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
    private com.badlogic.gdx.graphics.g2d.SpriteBatch batch(){return art.batch;}
    private static String tr(String ru,String en){return com.erni.finalanswer.localization.Localization.tr(ru,en);}
}
