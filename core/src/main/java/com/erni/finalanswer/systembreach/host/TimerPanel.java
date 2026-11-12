package com.erni.finalanswer.systembreach.host;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.MathUtils;
import java.util.Locale;
import static com.erni.finalanswer.systembreach.host.SystemBreachLayout.TIMER;

/** Upper-left: the server phase deadline. Green, amber in the last 30 s, red with a gentle pulse in the last 10 s. */
final class TimerPanel {
    private final Color color=new Color(),icon=new Color();private long shownSec=-1;private String shown="";
    private Color color(SystemBreachHostViewModel vm){long ms=vm.remainingMs();return color.set(!vm.phase().equals("ACTIVE")?SbPaint.GREEN:ms<=10_000?SbPaint.RED:ms<=30_000?SbPaint.AMBER:SbPaint.GREEN);}
    private float pulse(SystemBreachHostViewModel vm,float time){return vm.phase().equals("ACTIVE")&&vm.remainingMs()<=10_000&&vm.remainingMs()>0?.75f+.25f*MathUtils.sin(time*6.3f):1;}
    private String label(SystemBreachHostViewModel vm){return switch(vm.phase()){case "INITIALIZATION"->"STARTING IN";case "ACTIVE"->"TIME LEFT";default->"OPERATION OVER";};}

    void shapes(SbPaint p,SystemBreachHostViewModel vm,float time){
        Color c=color(vm);p.frame(TIMER.x,TIMER.y,TIMER.width,TIMER.height,22,c,.55f*pulse(vm,time));
        p.clock(TIMER.x+74,TIMER.y+98,26,icon.set(c).mul(1,1,1,pulse(vm,time)));
        p.bar(TIMER.x+36,TIMER.y+30,TIMER.width-72,24,vm.phase().equals("RESULTS")||vm.finished()?0:vm.remainingFraction(),c,22);
    }
    void glow(SpriteBatch b,SystemBreachHostAssets as,SystemBreachHostViewModel vm,float time){
        Color c=color(vm);b.setColor(c.r,c.g,c.b,.16f*pulse(vm,time));b.draw(as.glow,TIMER.x+60,TIMER.y+40,TIMER.width-60,140);
    }
    void text(SpriteBatch b,SbPaint p,SystemBreachHostAssets as,SystemBreachHostViewModel vm,float time){
        Color c=color(vm);long s=(vm.remainingMs()+999)/1000;
        p.centered(b,as.label,label(vm),TIMER.x+TIMER.width/2,TIMER.y+TIMER.height-22,SbPaint.IVORY,.92f);
        if(s!=shownSec){shownSec=s;shown=String.format(Locale.ROOT,"%02d:%02d",s/60,s%60);}
        as.digits.setColor(c.r,c.g,c.b,.07f);{float gx=TIMER.x+TIMER.width/2+42-p.width(as.digits,"88:88")/2;as.digits.draw(b,"88:88",gx,TIMER.y+140);}
        p.centered(b,as.digits,shown,TIMER.x+TIMER.width/2+42,TIMER.y+140,c,pulse(vm,time));
    }
}
