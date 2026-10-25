package com.erni.finalanswer.impostor;

import com.badlogic.gdx.scenes.scene2d.Actor;
import com.erni.finalanswer.gameplay.impostor.*;

/** A visual offset over an existing portrait; eligibility is solely the public server outcome. */
public final class ImpostorElimination {
    public static final long AFTER_NAME_MILLIS=2400;
    private final Actor actor;
    private final float x,y,sx,sy,rotation,alpha,height;
    public ImpostorElimination(Actor actor){this.actor=actor;x=actor.getX();y=actor.getY();sx=actor.getScaleX();sy=actor.getScaleY();rotation=actor.getRotation();alpha=actor.getColor().a;height=actor.getHeight()*sy;}
    public static float age(FinalActSnapshot state,long now){
        if(state==null||!"IMPOSTOR_CAUGHT".equals(state.outcome())||state.impostorId().isEmpty()
            ||state.phase()!=ImpostorPhase.IMPOSTOR_REVEAL&&state.phase()!=ImpostorPhase.RESULT)return -1;
        long start=state.phaseStartedAt()-(state.phase()==ImpostorPhase.RESULT?4000:0);
        long elapsed=now-start-FinalRevealTiming.IDENTITY_NAME_MILLIS-AFTER_NAME_MILLIS;
        return elapsed<0?-1:elapsed/1000f;
    }
    private static float smooth(float value){value=Math.max(0,Math.min(1,value));return value*value*(3-2*value);}
    public void apply(float age,boolean reduced,float idle){
        if(!Float.isFinite(age)||age<0){actor.setPosition(x,y+idle);actor.setScale(sx,sy);actor.setRotation(rotation);actor.getColor().a=alpha;return;}
        float fall=smooth(age/.6f),spirit=smooth((age-.6f)/.9f);
        float pulse=reduced?0:(float)Math.sin(age*31)*.008f*height*(1-fall);
        float floatY=reduced?0:(float)Math.sin(age*1.8f)*height*.012f*spirit;
        actor.setPosition(x+pulse,reduced?y:y+height*(-.13f*fall+.19f*spirit)+floatY);
        actor.setRotation(rotation+(reduced?0:-11*fall*(1-spirit)));
        actor.setScale(reduced?sx:sx*(1-.06f*fall*(1-spirit)),reduced?sy:sy*(1-.18f*fall*(1-spirit)));
        actor.getColor().a=alpha*((1-.78f*fall)*(1-spirit)+.48f*spirit);
    }
}
