package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.LOG;

/** Upper-right: the last four public events, newest at the bottom, sliding in with a colour-coded icon. */
final class EventLogPanel {
    private static final float ROW=34,FIRST=LOG.y+LOG.height-58;
    private float row(int index,int size){return FIRST-index*ROW;}
    private float ease(float age){float k=Math.min(1,age/.45f);return 1-(1-k)*(1-k)*(1-k);}

    void shapes(SbPaint p,SystemBreachHostViewModel vm){
        p.frame(LOG.x,LOG.y,LOG.width,LOG.height,22,SbPaint.GREEN,.35f);
        for(int j=1;j<4;j++){p.shapes().setColor(SbPaint.TRIM.r,SbPaint.TRIM.g,SbPaint.TRIM.b,.35f);p.shapes().rect(LOG.x+30,FIRST+8-j*ROW-2,LOG.width-60,1);}
        int i=0,n=vm.logSize();
        for(var line:vm.log()){
                        i++;
        }
    }
    void text(SpriteBatch b,SbPaint p,SystemBreachHostAssets as,SystemBreachHostViewModel vm){
        p.centered(b,as.label,vm.ru()?"ЖУРНАЛ СОБЫТИЙ":"EVENT LOG",LOG.x+LOG.width/2,LOG.y+LOG.height-20,SbPaint.IVORY,.92f);
        int i=0,n=vm.logSize();
        for(var line:vm.log()){
            float k=ease(vm.logAge(n-1-i));Color c=line.tone()==SystemBreachHostViewModel.Tone.HACK?SbPaint.RED:SbPaint.IVORY;
            float age=vm.logAge(n-1-i);p.icon(b,as.iconSmall,switch(line.tone()){case HACK->SbIcons.HACK;case RECOVERY->SbIcons.RECOVERY;case FIREWALL->SbIcons.FIREWALL;case REWARD->SbIcons.PAID;default->SbIcons.LINK_OFF;},LOG.x+44-(1-k)*30,row(i,n)-9,SbPaint.tone(line.tone()),k,.85f,0);String full=p.fit(as.log,line.text(),LOG.width-160);int shown=Math.min(full.length(),(int)(age*70));
            p.text(b,as.hex,line.stamp(),LOG.x+64-(1-k)*30,row(i,n)-4,SbPaint.GREEN,.55f*k);
            p.text(b,as.log,shown<full.length()?full.substring(0,shown)+"_":i==n-1&&(int)(System.nanoTime()/450_000_000L)%2==0?full+"_":full,LOG.x+118-(1-k)*30,row(i,n),c,k*(line.tone()==SystemBreachHostViewModel.Tone.MUTED?.6f:.95f));
            i++;
        }
        if(n==0)p.centered(b,as.log,vm.ru()?"Ожидание активности…":"Waiting for activity…",LOG.x+LOG.width/2,LOG.y+LOG.height/2+6,SbPaint.GRAY,.7f);
    }
}
