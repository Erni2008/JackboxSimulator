package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.*;

/**
 * Whole-screen hacker layer for the host: falling code columns behind the stage, live terminal feeds in the corners,
 * CRT scanlines with a rolling band, and a glitch burst (sliced bands, RGB split strips, flash) on every big event.
 * Prebuilt strings and fixed arrays: nothing is allocated per frame.
 */
final class HostHackFx {
    private static final int COLS=56,TRAIL=14;
    private final float[] colY=new float[COLS],colSpeed=new float[COLS];private final int[] colSeed=new int[COLS];
    private static final String[] GLYPH;static{String g="0123456789ABCDEF#$%&*+<>/\\=";GLYPH=new String[g.length()];for(int i=0;i<g.length();i++)GLYPH[i]=String.valueOf(g.charAt(i));}
    private static final String[] FEED={"> ssh root@node-%02d","  handshake ........ OK","  inject payload 0x7F3A","> nmap -sS 10.0.6.0/24","  port 22 open","  port 443 open","> decrypt --aes256 vault.key",
        "  [##########------] 61%","  bypass firewall LV3","> trace --reverse","  packet loss 0.3%","> sudo rm -rf /logs","  access token: 9F-A2-C4","  buffer overflow @ 0x00FF","> spawn trojan.exe","  checksum mismatch","  ROOT ACCESS GRANTED","> wipe --tracks"};
    private final String[][] feed=new String[2][FEED.length];
    private float burst,burstLen=.45f,burstR=.3f,burstG=1,burstB=.5f;private int burstSeed;
    private final Color c=new Color();

    HostHackFx(){
        var r=new java.util.Random(11);
        for(int i=0;i<COLS;i++){colY[i]=r.nextFloat()*H;colSpeed[i]=90+r.nextFloat()*160;colSeed[i]=r.nextInt(999);}
        for(int k=0;k<2;k++)for(int i=0;i<FEED.length;i++)feed[k][i]=FEED[i].contains("%02d")?String.format(FEED[i],r.nextInt(99)):FEED[i];
    }

    /** A big event: start a glitch burst tinted by its kind. */
    void cue(String name){
        switch(name){
            case "hack_success"->{trigger(1,.15f,.12f,.6f);stamp(0);}
            case "sabotage"->{trigger(1,.15f,.12f,.6f);stamp(2);}
            case "hack_start"->trigger(1,.35f,.2f,.35f);
            case "hack_fail"->{trigger(.3f,.7f,1,.35f);stamp(1);}
            case "firewall"->trigger(.3f,.7f,1,.35f);
            case "key","multiplier","clean"->trigger(.35f,1,.55f,.3f);
            case "complete"->trigger(1,.8f,.3f,.7f);
            default->{}
        }
    }
    private int stampKind=-1;private float stampAge=99;private final char[] buf=new char[32];
    private static final String[][] STAMP={{"ДОСТУП РАЗРЕШЁН","ACCESS GRANTED"},{"ДОСТУП ЗАПРЕЩЁН","ACCESS DENIED"},{"ВИРУС ВНЕДРЁН","VIRUS DEPLOYED"},{"КЛЮЧ ПОЛУЧЕН","KEY ACQUIRED"}};
    private void stamp(int kind){stampKind=kind;stampAge=0;}
    /** Big centre stamp after a hack: the letters decode out of noise, RGB-split, shake, then dissolve. */
    void stamp(SpriteBatch b,BitmapFont f,boolean ru,float time){
        if(stampKind<0||stampAge>1.9f)return;String s=STAMP[stampKind][ru?0:1];int n=Math.min(s.length(),buf.length);
        float dec=stampAge/.55f;for(int i=0;i<n;i++){char ch=s.charAt(i);buf[i]=ch==' '||i<dec*n?ch:"#$%&@01ABCDEF".charAt(MathUtils.random(12));}
        String txt=new String(buf,0,n);float a=stampAge<1.5f?1:1-(stampAge-1.5f)/.4f,sh=Math.max(0,.3f-stampAge)*40;
        float sx=MathUtils.random(-sh,sh),sy=MathUtils.random(-sh,sh),y=H*.62f;
        float cr=stampKind==1?.3f:stampKind==3?1:stampKind==2?1:.3f,cg=stampKind==1?.7f:stampKind==3?.8f:stampKind==2?.2f:1,cb=stampKind==1?1:stampKind==3?.3f:stampKind==2?.15f:.55f;
        float split=4+Math.max(0,.5f-stampAge)*30;
        f.setColor(1,0,.1f,.55f*a);f.draw(b,txt,sx-split,y+sy,W,1,false);
        f.setColor(0,.9f,1,.55f*a);f.draw(b,txt,sx+split,y+sy,W,1,false);
        f.setColor(cr,cg,cb,a);f.draw(b,txt,sx,y+sy,W,1,false);f.setColor(1,1,1,1);
    }
    private void trigger(float r,float g,float b,float len){burstR=r;burstG=g;burstB=b;burstLen=len;burst=len;burstSeed=MathUtils.random(9999);}
    void update(float dt){stampAge+=dt;burst=Math.max(0,burst-dt);for(int i=0;i<COLS;i++){colY[i]-=colSpeed[i]*dt;if(colY[i]<-TRAIL*22)colY[i]=H+MathUtils.random(200f);}}
    private float k(){return burst<=0?0:burst/burstLen;}

    /** Code rain behind the stage (draw with normal blending, before the characters). */
    void rain(SpriteBatch b,BitmapFont f,float time,boolean danger){
        float step=W/(float)COLS;
        for(int i=0;i<COLS;i++){float x=i*step+4;
            for(int j=0;j<TRAIL;j++){float y=colY[i]+j*22;if(y<0||y>H)continue;float a=(1-j/(float)TRAIL)*.16f;
                int gi=(colSeed[i]+j*7+(int)(time*(j==0?12:3)))%GLYPH.length;
                if(j==0){f.setColor(.75f,1,.85f,a*2.2f);}else if(danger)f.setColor(1,.25f,.2f,a);else f.setColor(.25f,1,.5f,a);
                f.draw(b,GLYPH[gi],x,y);}}
        f.setColor(1,1,1,1);
    }

    /** Two terminal feeds typing themselves in the upper corners. */
    void feeds(SpriteBatch b,BitmapFont f,float time){
        for(int k=0;k<2;k++){float x=k==0?28:W-330,y=H-150;float t=time*1.6f+k*7;int top=(int)t;
            for(int l=0;l<8;l++){int idx=(top-l+FEED.length*100)%FEED.length;String s=feed[k][idx];float a=(1-l/8f)*.42f;
                if(l==0){int chars=Math.min(s.length(),(int)((t-top)*s.length()*1.6f));if(chars<=0)continue;
                    boolean bad=s.contains("rm ")||s.contains("trojan");f.setColor(bad?1:.45f,bad?.35f:1,bad?.3f:.65f,.75f);f.draw(b,s,x,y,0,chars,0,-1,false);}
                else{f.setColor(.35f,.95f,.55f,a);f.draw(b,s,x,y-l*21);}}}
        f.setColor(1,1,1,1);
    }

    /** CRT scanlines over everything plus the glitch burst bands (filled shapes). */
    void overlay(ShapeRenderer r,float time){
        r.setColor(0,0,0,.07f);for(float y=0;y<H;y+=4)r.rect(0,y,W,1.4f);
        float band=H-((time*90)%(H+200))+100;r.setColor(.6f,1,.75f,.025f);r.rect(0,band,W,70);r.setColor(1,1,1,.02f);r.rect(0,band+30,W,6);
        float k=k();if(k<=0)return;
        var rnd=new java.util.Random(burstSeed+(int)(time*30));
        for(int i=0;i<9;i++){float y=rnd.nextFloat()*H,h=6+rnd.nextFloat()*60*k,off=(rnd.nextFloat()-.5f)*140*k;
            r.setColor(burstR,burstG,burstB,.14f*k);r.rect(off,y,W,h);
            r.setColor(1,.1f,.2f,.10f*k);r.rect(off+12*k,y,W*rnd.nextFloat(),Math.max(2,h*.3f));
            r.setColor(.1f,.9f,1,.10f*k);r.rect(off-12*k,y+h*.6f,W*rnd.nextFloat(),Math.max(2,h*.3f));}
        for(int i=0;i<40;i++){r.setColor(burstR,burstG,burstB,.35f*k*rnd.nextFloat());r.rect(rnd.nextFloat()*W,rnd.nextFloat()*H,4+rnd.nextFloat()*40,2+rnd.nextFloat()*5);}
    }
    /** Additive flash of the burst (draw with additive blending). */
    void flash(SpriteBatch b,SystemBreachHostAssets as){float k=k();if(k<=0)return;float a=k*k;
        b.setColor(burstR,burstG,burstB,.25f*a);b.draw(as.glow,-300,-300,W+600,H+600);b.setColor(1,1,1,1);}
}
