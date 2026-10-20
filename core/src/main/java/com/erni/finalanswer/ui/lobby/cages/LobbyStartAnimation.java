package com.erni.finalanswer.ui.lobby.cages;

/** Shared absolute-time clock for blackout and launch-only cage movement. */
public final class LobbyStartAnimation {
    public static final float FADE_START=.4f,FADE_DURATION=2.1f,FADE_END=FADE_START+FADE_DURATION;
    private LobbyStartAnimation(){}
    public static float darkness(float seconds){float p=Math.max(0,Math.min(1,(seconds-FADE_START)/FADE_DURATION));return p*p*(3-2*p);}
    public static float rotation(float seconds,float phase){
        if(seconds<=0)return 0;
        // Continuous sinusoid throughout STARTING, including the blackout/title handoff.
        float time=seconds,p=Math.min(1,time/.35f),envelope=p*p*(3-2*p);
        return envelope*(float)Math.sin(time*5+phase)*3.8f;
    }
}
