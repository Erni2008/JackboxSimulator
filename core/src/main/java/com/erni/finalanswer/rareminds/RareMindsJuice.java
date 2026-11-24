package com.erni.finalanswer.rareminds;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.MathUtils;
import java.util.*;

/**
 * Game feel for RARE MINDS: confetti and spark bursts, a screen shake, and the big centre countdown. Purely visual;
 * callers fire one-shot events with {@link #confetti}, {@link #sparks} or {@link #shake}.
 */
final class RareMindsJuice {
    private static final class P{float x,y,vx,vy,rot,vr,life,max,w,h;Color c;boolean spark;}
    private final List<P> ps=new ArrayList<>();private final RareMindsArt art;private float shake;
    RareMindsJuice(RareMindsArt art){this.art=art;}
    static final Color[] CONFETTI={new Color(1f,.8f,.25f,1),new Color(.95f,.25f,.2f,1),new Color(.3f,.7f,1f,1),new Color(.75f,.45f,1f,1),new Color(1f,1f,1f,1),new Color(.4f,.95f,.55f,1)};

    void confetti(float x,float y,int n){for(int i=0;i<n;i++){P p=new P();p.x=x;p.y=y;float a=MathUtils.random(20f,160f),s=MathUtils.random(260f,720f);
        p.vx=MathUtils.cosDeg(a)*s;p.vy=MathUtils.sinDeg(a)*s;p.rot=MathUtils.random(360f);p.vr=MathUtils.random(-720f,720f);p.max=p.life=MathUtils.random(1.6f,2.8f);
        p.w=MathUtils.random(8f,14f);p.h=MathUtils.random(4f,8f);p.c=CONFETTI[MathUtils.random(CONFETTI.length-1)];ps.add(p);}}
    void sparks(float x,float y,Color c,int n){for(int i=0;i<n;i++){P p=new P();p.x=x;p.y=y;float a=MathUtils.random(360f),s=MathUtils.random(180f,560f);
        p.vx=MathUtils.cosDeg(a)*s;p.vy=MathUtils.sinDeg(a)*s;p.max=p.life=MathUtils.random(.35f,.8f);p.w=p.h=MathUtils.random(5f,10f);p.c=c;p.spark=true;ps.add(p);}}
    void shake(float amount){shake=Math.max(shake,amount);}
    /** current camera offset of the shake */
    float shakeX(float clock){return MathUtils.sin(clock*71)*shake*14;}
    float shakeY(float clock){return MathUtils.cos(clock*63)*shake*10;}

    void update(float dt){shake=Math.max(0,shake-dt*2.6f);
        for(Iterator<P> it=ps.iterator();it.hasNext();){P p=it.next();p.life-=dt;if(p.life<=0){it.remove();continue;}
            if(p.spark){p.vx*=.9f;p.vy*=.9f;}else{p.vy-=900*dt;p.vx*=.985f;p.vy=Math.max(p.vy,-260);}
            p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;}}
    void draw(){
        var b=art.batch;
        for(P p:ps){float a=Math.min(1,p.life/(p.max*.35f));
            if(p.spark){b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);b.setColor(p.c.r,p.c.g,p.c.b,a);b.draw(art.soft,p.x-p.w*1.5f,p.y-p.w*1.5f,p.w*3,p.w*3);b.setColor(1,1,1,a*.8f);b.draw(art.soft,p.x-p.w*.5f,p.y-p.w*.5f,p.w,p.w);b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);}
            else{float flip=Math.abs(MathUtils.cosDeg(p.rot*1.7f));b.setColor(p.c.r*(.6f+.4f*flip),p.c.g*(.6f+.4f*flip),p.c.b*(.6f+.4f*flip),a);b.draw(art.pixel,p.x-p.w/2,p.y-p.h/2,p.w/2,p.h/2,p.w,p.h*flip+1,1,1,p.rot,0,0,1,1,false,false);}}
        b.setColor(Color.WHITE);
    }
    /** the last seconds of the answer window: a huge number that punches in each second */
    void countdown(float cx,float cy,int sec,float frac,boolean fin){
        if(sec<=0||sec>5)return;float k=1-frac;float sc=1.9f-.9f*ease(Math.min(1,k*3)),a=Math.min(1,(1-k)*2.2f)*.85f;
        Color c=fin||sec<=3?RareMindsArt.RED_SOFT:RareMindsArt.GOLD;
        art.glow(cx,cy,420*sc,420*sc,c,.18f*a);
        art.text(art.title,String.valueOf(sec),cx,cy+60*sc,1.15f*sc,c,a*.9f,0);
    }
    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*(3-2*t);}
}
