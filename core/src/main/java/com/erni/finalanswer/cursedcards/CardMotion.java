package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.math.*;

/** One timed leg of a card animation. Starts from wherever the card is when the leg begins. */
public final class CardMotion {
    public enum Ease {
        LINEAR, ACCELERATE, DECELERATE, SMOOTH, SETTLE;
        float apply(float t){return switch(this){
            case LINEAR->t;
            case ACCELERATE->t*t*t;
            case DECELERATE->1-(1-t)*(1-t)*(1-t);
            case SMOOTH->t*t*(3-2*t);
            case SETTLE->{float c=1.6f,u=t-1;yield 1+(c+1)*u*u*u+c*u*u;}
        };}
    }
    final CardPose target=new CardPose();
    /** Arc apex above the straight path, world units; 0 = straight line. */
    float arc;
    /** Extra nose-up pitch at mid flight (degrees), a lifting feel without changing the final pose. */
    float lift;
    /** Sideways wobble of yaw at mid flight (degrees). */
    float wobble;
    /** Card half extents; mid-motion rotation is lifted clear of the resting surface by this much. */
    public static float halfWidth=.3f,halfHeight=.44f;
    float delay,duration;
    Ease ease=Ease.SMOOTH;
    Boolean visible;
    Runnable onStart,onEnd;
    // runtime
    final CardPose from=new CardPose();float elapsed;boolean started;

    public static CardMotion to(CardPose target,float duration,Ease ease){var m=new CardMotion();m.target.set(target);m.duration=duration;m.ease=ease;return m;}
    public CardMotion arc(float h){arc=h;return this;}
    public CardMotion lift(float degrees){lift=degrees;return this;}
    public CardMotion wobble(float degrees){wobble=degrees;return this;}
    /** Bending illusion: a small roll that peaks mid-flight, as if the card stock flexed in the air. */
    public CardMotion flex(float degrees){flex=degrees;return this;}
    float flex;
    public CardMotion delay(float seconds){delay=seconds;return this;}
    public CardMotion visible(boolean v){visible=v;return this;}
    public CardMotion onStart(Runnable r){onStart=r;return this;}
    public CardMotion onEnd(Runnable r){onEnd=r;return this;}

    private static float reach(CardPose p){return p.scale*halfWidth*Math.abs(MathUtils.sinDeg(p.roll))*Math.abs(MathUtils.cosDeg(p.pitch))+p.scale*halfHeight*Math.abs(MathUtils.sinDeg(p.pitch));}
    /** Advance by dt; returns leftover time once finished, or -1 while running. */
    float step(Card3D card,float dt){
        if(delay>0){delay-=dt;if(delay>0)return -1;dt=-delay;delay=0;}
        if(!started){started=true;from.set(card.pose);if(visible!=null)card.visible=visible;if(onStart!=null)onStart.run();}
        elapsed+=dt;float t=duration<=0?1:Math.min(1,elapsed/duration),e=ease.apply(t),bump=MathUtils.sin(t*MathUtils.PI);
        Vector3 p=card.pose.position.set(from.position).lerp(target.position,e);
        if(arc!=0)p.y+=arc*4*e*(1-e);
        card.pose.yaw=MathUtils.lerp(from.yaw,target.yaw,e)+wobble*bump;
        card.pose.pitch=MathUtils.lerp(from.pitch,target.pitch,e)+lift*bump;
        card.pose.roll=MathUtils.lerp(from.roll,target.roll,e)+flex*MathUtils.sin(t*MathUtils.PI2)*bump;card.pose.scale=MathUtils.lerp(from.scale,target.scale,e);
        // A tilted/rolling card reaches further down than its centre: lift by whatever exceeds the end poses, so it never cuts into the table.
        float extra=reach(card.pose)-MathUtils.lerp(reach(from),reach(target),e);if(extra>0)p.y+=extra;
        if(t<1)return -1;
        card.pose.set(target);if(onEnd!=null)onEnd.run();return duration<=0?dt:Math.max(0,elapsed-duration);
    }
}
