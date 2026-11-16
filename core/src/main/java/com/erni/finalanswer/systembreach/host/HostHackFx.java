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
            case "strike"->{trigger(1,.6f,.1f,.6f);stamp(4);}
            case "thunder"->trigger(1,.85f,.3f,.8f);
            case "complete"->trigger(1,.8f,.3f,.7f);
            default->{}
        }
    }
    private int stampKind=-1;private float stampAge=99;private final char[] buf=new char[32];
    private static final String[][] STAMP={{"ДОСТУП РАЗРЕШЁН","ACCESS GRANTED"},{"ДОСТУП ЗАПРЕЩЁН","ACCESS DENIED"},{"ВИРУС ВНЕДРЁН","VIRUS DEPLOYED"},{"КЛЮЧ ПОЛУЧЕН","KEY ACQUIRED"},{"ЛОВУШКА!","HONEYPOT!"}};
    private void stamp(int kind){stampKind=kind;stampAge=0;}
    /** Big centre stamp after a hack: the letters decode out of noise, RGB-split, shake, then dissolve. */
    private float stampIn(){return stampAge<.18f?stampAge/.18f:stampAge>1.45f?Math.max(0,1-(stampAge-1.45f)/.35f):1;}
    private float[] stampColor(){return switch(stampKind){case 1->new float[]{.35f,.75f,1};case 2->new float[]{1,.22f,.18f};case 3->new float[]{1,.8f,.3f};case 4->new float[]{1,.55f,.12f};default->new float[]{.35f,1,.6f};};}
    /** Cinematic band behind the stamp (filled shapes, under the text). */
    void stampBand(ShapeRenderer r){if(stampKind<0||stampAge>1.8f)return;float k=stampIn(),e=1-(1-k)*(1-k),h=96*e,y=STAMP_Y-h/2;float[] c3=stampColor();
        r.setColor(0,0,0,.72f*k);r.rect(0,y,W,h);r.setColor(c3[0],c3[1],c3[2],.85f*k);float lw=W*e;r.rect(W/2-lw/2,y+h-2,lw,2);r.rect(W/2-lw/2,y,lw,2);
        float sw=(stampAge*1.4f)%1.2f;if(sw<1){r.setColor(c3[0],c3[1],c3[2],.10f*k);r.rect(W*sw-60,y+2,120,h-4);}}
    static final float STAMP_Y=610;
    void stamp(SpriteBatch b,BitmapFont f,boolean ru,float time){
        if(stampKind<0||stampAge>1.9f)return;String s=STAMP[stampKind][ru?0:1];int n=Math.min(s.length(),buf.length);
        float dec=stampAge/.55f;for(int i=0;i<n;i++){char ch=s.charAt(i);buf[i]=ch==' '||i<dec*n?ch:"#$%&@01ABCDEF".charAt(MathUtils.random(12));}
        String txt=new String(buf,0,n);float a=stampIn(),sx=0,sy=0,y=STAMP_Y+f.getCapHeight()/2;float[] c3=stampColor();
        float cr=c3[0],cg=c3[1],cb=c3[2];
        float split=Math.max(0,.35f-stampAge)*40;
        f.setColor(1,0,.1f,.45f*a*(split>0?1:0));f.draw(b,txt,sx-split,y+sy,W,1,false);
        f.setColor(0,.9f,1,.45f*a*(split>0?1:0));f.draw(b,txt,sx+split,y+sy,W,1,false);
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
        stampBand(r);float k=k();if(k<=0)return;
        var rnd=new java.util.Random(burstSeed+(int)(time*30));
        for(int i=0;i<9;i++){float y=rnd.nextFloat()*H,h=6+rnd.nextFloat()*60*k,off=(rnd.nextFloat()-.5f)*140*k;
            r.setColor(burstR,burstG,burstB,.14f*k);r.rect(off,y,W,h);
            r.setColor(1,.1f,.2f,.10f*k);r.rect(off+12*k,y,W*rnd.nextFloat(),Math.max(2,h*.3f));
            r.setColor(.1f,.9f,1,.10f*k);r.rect(off-12*k,y+h*.6f,W*rnd.nextFloat(),Math.max(2,h*.3f));}
        for(int i=0;i<40;i++){r.setColor(burstR,burstG,burstB,.35f*k*rnd.nextFloat());r.rect(rnd.nextFloat()*W,rnd.nextFloat()*H,4+rnd.nextFloat()*40,2+rnd.nextFloat()*5);}
    }
    static final float BUS_Y=214;
    /** NETWORK MAP: a fibre bus under the line-up; each laptop is a node on it beneath its podium. Packets stream
     *  between neighbours, a DDoS floods the target's node red, a system surge lights the whole bus. */
    void network(ShapeRenderer r,SystemBreachHostViewModel vm,float time){
        var slots=vm.slots();int n=slots.size();if(n==0)return;String surge=vm.surge();
        float br=surge.equals("DOUBLE")?1:surge.isEmpty()?.35f:1,bg=surge.equals("DOUBLE")?.78f:surge.isEmpty()?1:.25f,bb=surge.equals("DOUBLE")?.3f:surge.isEmpty()?.62f:.2f;
        float x0=slotX(0,n)-PANEL_W/2,x1=slotX(n-1,n)+PANEL_W/2;
        r.setColor(0,0,0,.55f);r.rect(x0-6,BUS_Y-5,x1-x0+12,10);
        r.setColor(br,bg,bb,surge.isEmpty()?.35f:.6f+.25f*MathUtils.sin(time*6));r.rect(x0,BUS_Y-1,x1-x0,2);
        for(int k=0;k<26;k++){float t=(time*.09f+k/26f)%1f,x=x0+(x1-x0)*((k&1)==0?t:1-t);r.setColor(br,bg,bb,.9f);r.rect(x-6,BUS_Y-1,12,2);}
        for(int i=0;i<n;i++){var sl=slots.get(i);float x=slotX(i,n);boolean dd=vm.ddosed(sl.id);
            r.setColor(br,bg,bb,.4f);r.rect(x-.75f,BUS_Y,1.5f,PANEL_Y-BUS_Y-44);
            if(dd)for(int k=0;k<8;k++){float t=(time*2.2f+k/8f)%1f;float side=(k&1)==0?-1:1,xx=x+side*(1-t)*SLOT_PITCH*.5f;r.setColor(1,.15f,.1f,.95f);r.rect(xx-4,BUS_Y-2,8,4);}
            float c1=dd?1:sl.leader?1:br,c2=dd?.2f:sl.leader?.78f:bg,c3=dd?.15f:sl.leader?.3f:bb;
            r.setColor(0,0,0,.85f);r.rect(x-11,BUS_Y-11,22,22);r.setColor(c1,c2,c3,1);r.rect(x-8,BUS_Y-8,16,16);r.setColor(0,0,0,.9f);r.rect(x-5,BUS_Y-5,10,10);
            float blink=MathUtils.sin(time*(dd?20:3)+i*1.7f)>0?1:.25f;r.setColor(c1,c2,c3,blink);r.rect(x-2,BUS_Y-2,4,4);}
    }
    void networkGlow(SpriteBatch b,SystemBreachHostAssets as,SystemBreachHostViewModel vm,float time){
        var slots=vm.slots();int n=slots.size();if(n==0)return;String surge=vm.surge();
        for(int i=0;i<n;i++){boolean dd=vm.ddosed(slots.get(i).id);float x=slotX(i,n);if(dd)b.setColor(1,.15f,.1f,.5f+.25f*MathUtils.sin(time*14));else b.setColor(.3f,1,.6f,.14f);b.draw(as.glow,x-40,BUS_Y-40,80,80);}
        if(!surge.isEmpty()){float x0=slotX(0,n)-PANEL_W/2,x1=slotX(n-1,n)+PANEL_W/2,a=.25f+.12f*MathUtils.sin(time*6);if(surge.equals("DOUBLE"))b.setColor(1,.8f,.3f,a);else b.setColor(1,.2f,.15f,a);b.draw(as.glow,x0,BUS_Y-30,x1-x0,60);}
        b.setColor(1,1,1,1);
    }
    /** Surge plate under the timer: dark glass, coloured rim, countdown. */
    void surgeShape(SbPaint paint,ShapeRenderer r,SystemBreachHostViewModel vm,float time){String s=vm.surge();if(s.isEmpty())return;
        float x=TIMER.x+10,w=TIMER.width-20,y=TIMER.y-74;Color c2=s.equals("DOUBLE")?SbPaint.GOLD:new Color(1,.28f,.22f,1);
        r.setColor(0,0,0,.75f);r.rect(x-4,y-4,w+8,62);paint.plate(x,y,w,54,12,new Color(c2.r*.25f,c2.g*.25f,c2.b*.25f,.97f),new Color(.03f,.03f,.03f,.97f));paint.outline(x+4,y+4,w-8,46,10,2f,c2);
        float pr=vm.surgeLeftMs()/(float)20_000;r.setColor(c2.r,c2.g,c2.b,.9f);r.rect(x+12,y+6,(w-24)*pr,3);}
    void surgeText(SpriteBatch b,BitmapFont f,SystemBreachHostViewModel vm,float time){String s=vm.surge();if(s.isEmpty())return;
        String t=(vm.ru()?(s.equals("DOUBLE")?"СБОЙ · ОЧКИ ×2":"СБОЙ · ФАЕРВОЛЫ ВЫКЛ"):(s.equals("DOUBLE")?"SURGE · POINTS ×2":"SURGE · FIREWALLS OFF"))+"  "+(vm.surgeLeftMs()/1000+1);
        float a=.85f+.15f*MathUtils.sin(time*8);if(s.equals("DOUBLE"))f.setColor(1,.88f,.45f,a);else f.setColor(1,.45f,.38f,a);f.draw(b,t,TIMER.x,TIMER.y-74+38,TIMER.width,1,false);f.setColor(1,1,1,1);}
    /** DDoS made unmistakable: a torrent of packets from the attacker's podium into the target's, the target's screen
     *  drowned in red interference, shock rings, and a live traffic readout with an overload bar. */
    private float bez(float a,float b,float c2,float t){float u=1-t;return u*u*a+2*u*t*c2+t*t*b;}
    void ddosShapes(ShapeRenderer r,SystemBreachHostViewModel vm,float time){
        var slots=vm.slots();int n=slots.size();
        for(int i=0;i<n;i++){var sl=slots.get(i);if(!vm.ddosed(sl.id))continue;float tx=slotX(i,n),top=panelTop();
            int a=vm.seat(vm.ddosAttacker(sl.id));
            if(a>=0&&a!=i){float ax=slotX(a,n),cx=(ax+tx)/2,cy=top+150+Math.abs(tx-ax)*.12f;
                for(int k=0;k<70;k++){float ph=(k*0.618f)%1f,t=(time*1.6f+ph)%1f,jit=MathUtils.sin(k*12.9f+time*9)*10*(1-Math.abs(t-.5f)*2);
                    float x=bez(ax,tx,cx,t),y=bez(top,top+30,cy,t)+jit;float sz=k%5==0?7:4;
                    r.setColor(1,k%7==0?.9f:.12f,k%7==0?.8f:.08f,.9f);r.rect(x-sz/2,y-sz/2,sz*1.8f,sz);}
                float px=ax,py=top;for(int k=1;k<=30;k++){float t=k/30f,x=bez(ax,tx,cx,t),y=bez(top,top+30,cy,t);r.setColor(1,.1f,.08f,.22f);r.rectLine(px,py,x,y,16);r.setColor(1,.35f,.3f,.5f);r.rectLine(px,py,x,y,3);px=x;py=y;}}
            float x0=tx-PANEL_W/2,y0=PANEL_Y;var rnd=new java.util.Random((long)(time*24)+i*31);
            r.setColor(.5f,0,0,.38f);r.rect(x0,y0,PANEL_W,PANEL_H);
            for(int k=0;k<10;k++){float y=y0+rnd.nextFloat()*PANEL_H,h=2+rnd.nextFloat()*10,off=(rnd.nextFloat()-.5f)*24;r.setColor(1,.15f,.1f,.15f+rnd.nextFloat()*.2f);r.rect(x0+Math.max(0,off),y,PANEL_W-Math.abs(off),h*.5f);}
            float fl=MathUtils.sin(time*22)>0?1:.35f;r.setColor(1,.15f,.1f,fl);float bw=4;r.rect(x0-bw,y0-bw,PANEL_W+bw*2,bw);r.rect(x0-bw,y0+PANEL_H,PANEL_W+bw*2,bw);r.rect(x0-bw,y0,bw,PANEL_H);r.rect(x0+PANEL_W,y0,bw,PANEL_H);
            for(int k=0;k<3;k++){float t=(time*1.3f+k/3f)%1f,rad=40+t*170;r.setColor(1,.2f,.15f,.5f*(1-t));for(int s=0;s<40;s++){float a1=s/40f*MathUtils.PI2,a2=(s+1)/40f*MathUtils.PI2;r.rectLine(tx+MathUtils.cos(a1)*rad,y0+PANEL_H/2+MathUtils.sin(a1)*rad*.55f,tx+MathUtils.cos(a2)*rad,y0+PANEL_H/2+MathUtils.sin(a2)*rad*.55f,2.5f);}}
            float by=PANEL_Y+14,bwid=150;float load=.82f+.16f*MathUtils.sin(time*7+i);
            r.setColor(0,0,0,.88f);r.rect(x0+6,PANEL_Y+PANEL_H*.28f,PANEL_W-12,PANEL_H*.5f);r.setColor(1,.2f,.15f,1);r.rect(x0+6,PANEL_Y+PANEL_H*.78f,PANEL_W-12,2);r.rect(x0+6,PANEL_Y+PANEL_H*.28f,PANEL_W-12,2);
            r.setColor(.25f,.03f,.02f,1);r.rect(tx-bwid/2,by+2,bwid,9);r.setColor(1,.25f,.15f,1);r.rect(tx-bwid/2,by+2,bwid*load,9);
            float tl=vm.ddosLeft(sl.id)/10f;r.setColor(1,.8f,.7f,.7f);r.rect(tx-bwid/2,by-3,bwid*Math.min(1,tl),2);}
    }
    void ddosGlow(SpriteBatch b,SystemBreachHostAssets as,SystemBreachHostViewModel vm,float time){
        var slots=vm.slots();int n=slots.size();
        for(int i=0;i<n;i++){if(!vm.ddosed(slots.get(i).id))continue;float tx=slotX(i,n);float p=.55f+.35f*MathUtils.sin(time*16);
            b.setColor(1,.1f,.06f,.5f*p);b.draw(as.glow,tx-230,PANEL_Y-120,460,PANEL_H+360);b.setColor(1,.3f,.2f,.35f);b.draw(as.glow,tx-90,panelTop()-60,180,120);}
        b.setColor(1,1,1,1);
    }
    private final StringBuilder sbuf=new StringBuilder();
    void ddosText(SpriteBatch b,BitmapFont big,BitmapFont small,SystemBreachHostViewModel vm,float time){
        var slots=vm.slots();int n=slots.size();
        for(int i=0;i<n;i++){var sl=slots.get(i);if(!vm.ddosed(sl.id))continue;float tx=slotX(i,n),by=PANEL_Y+PANEL_H*.36f;
            float j=MathUtils.sin(time*40)>0?2:-2;big.setColor(1,.1f,.1f,.5f);big.draw(b,"DDoS",tx-200+j+3,by+80,400,1,false);big.setColor(1,.92f,.9f,1);big.draw(b,"DDoS",tx-200+j,by+80,400,1,false);
            sbuf.setLength(0);int gb=(int)(80+40*MathUtils.sin(time*5+i)+MathUtils.random(9));sbuf.append("▼ ").append(gb/10).append('.').append(gb%10).append(" Gb/s  ").append((int)Math.ceil(vm.ddosLeft(sl.id))).append(vm.ru()?" с":" s");
            small.setColor(1,.65f,.55f,1);small.draw(b,sbuf,tx-200,by+20,400,1,false);}
        big.setColor(1,1,1,1);small.setColor(1,1,1,1);
    }
    /** Additive flash of the burst (draw with additive blending). */
    void flash(SpriteBatch b,SystemBreachHostAssets as){float k=k();if(k<=0)return;float a=k*k;
        b.setColor(burstR,burstG,burstB,.25f*a);b.draw(as.glow,-300,-300,W+600,H+600);b.setColor(1,1,1,1);}
}
