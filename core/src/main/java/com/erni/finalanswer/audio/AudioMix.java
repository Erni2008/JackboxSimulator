package com.erni.finalanswer.audio;

/** Shared category gains. Existing screen-specific volume/mute controls multiply these gains. */
public final class AudioMix {
    public enum Category { MASTER, MUSIC, SFX, UI, ENVIRONMENT, CAGES, BOX_DESTRUCTION, CHARACTER_REVEAL }
    public static final AudioMix GLOBAL=new AudioMix();
    public float master=1,music=1,sfx=1,ui=1,environment=1,cages=1,boxDestruction=1,characterReveal=1;
    private float duckRemaining,duck=1;
    public static float unit(float value){return Float.isFinite(value)?Math.max(0,Math.min(1,value)):0;}
    public float gain(Category category){return unit(master)*(category==Category.MUSIC?unit(music):category==Category.MASTER?1:unit(sfx))*unit(switch(category){case MASTER,MUSIC,SFX->1;case UI->ui;case ENVIRONMENT->environment;case CAGES->cages;case BOX_DESTRUCTION->boxDestruction;case CHARACTER_REVEAL->characterReveal;});}
    public void important(float seconds){if(Float.isFinite(seconds)&&seconds>0)duckRemaining=Math.max(duckRemaining,seconds);}
    public float ambienceDuck(){return duck;}
    public void update(float dt){if(!Float.isFinite(dt)||dt<=0)return;duckRemaining=Math.max(0,duckRemaining-dt);float target=duckRemaining>0?.48f:1;duck+=(target-duck)*(1-(float)Math.exp(-dt/(target<duck?.04f:.4f)));}
    public void resetDuck(){duckRemaining=0;duck=1;}
}
