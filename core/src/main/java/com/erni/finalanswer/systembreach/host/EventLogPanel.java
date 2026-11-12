package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.LOG;

/** Upper-right: the last four public events, newest at the bottom, sliding in with a colour-coded icon. */
final class EventLogPanel {
    private static final float ROW=42,FIRST=LOG.y+LOG.height-84;
    private float row(int index,int size){return FIRST-index*ROW;}
    private float ease(float age){float k=Math.min(1,age/.45f);return 1-(1-k)*(1-k)*(1-k);}

    void shapes(SbPaint p,SystemBreachHostViewModel vm){
        p.frame(LOG.x,LOG.y,LOG.width,LOG.height,22,SbPaint.GREEN,.35f);
        int i=0,n=vm.logSize();
        for(var line:vm.log()){
            float k=ease(vm.logAge(n-1-i)),x=LOG.x+42-(1-k)*30,y=row(i,n)-12;Color c=SbPaint.tone(line.tone());
            switch(line.tone()){
                case HACK->p.crosshair(x,y,11,c);case RECOVERY->p.gear(x,y,11,c);case FIREWALL->p.shield(x,y+2,12,c);
                case REWARD->p.coins(x,y,10);default->p.ring(x,y,7,2.5f);
            }
            i++;
        }
    }
    void text(SpriteBatch b,SbPaint p,SystemBreachHostAssets as,SystemBreachHostViewModel vm){
        p.centered(b,as.label,"EVENT LOG",LOG.x+LOG.width/2,LOG.y+LOG.height-24,SbPaint.IVORY,.92f);
        int i=0,n=vm.logSize();
        for(var line:vm.log()){
            float k=ease(vm.logAge(n-1-i));Color c=line.tone()==SystemBreachHostViewModel.Tone.HACK?SbPaint.RED:SbPaint.IVORY;
            float age=vm.logAge(n-1-i);String full=p.fit(as.log,line.text(),LOG.width-170);int shown=Math.min(full.length(),(int)(age*70));
            long sec=line.at()/1000;p.text(b,as.hex,String.format(java.util.Locale.ROOT,"%02d:%02d",sec/60,sec%60),LOG.x+64-(1-k)*30,row(i,n)-4,SbPaint.GREEN,.55f*k);
            p.text(b,as.log,full.substring(0,shown)+(shown<full.length()||i==n-1&&(int)(System.nanoTime()/450_000_000L)%2==0?"_":""),LOG.x+118-(1-k)*30,row(i,n),c,k*(line.tone()==SystemBreachHostViewModel.Tone.MUTED?.6f:.95f));
            i++;
        }
        if(n==0)p.centered(b,as.log,"Waiting for activity…",LOG.x+LOG.width/2,LOG.y+LOG.height/2+6,SbPaint.GRAY,.7f);
    }
}
