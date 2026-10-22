package com.finalanswer.protocol;

/** Shared timing contract. All values are seconds, independent of frame rate. */
public final class CursedBoxesCinematicConfig {
    public int boxCount=7;
    public float introDuration=.8f,selectionDuration=30,selectionLockedHold=1.2f;
    public float hostSubtitleFadeIn=.25f,hostSubtitleFallbackDuration=2.8f;
    public float cameraMoveToBox=.75f,identificationDuration=1.2f;
    public float firstBoxAimDuration=.9f,normalBoxAimDuration=.6f,lastBoxAimDuration=.9f;
    public float firstBoxSuspense=.45f,normalBoxSuspense=.25f,lastBoxSuspense=.55f;
    public float shotCameraRecoilDuration=.18f,impactPresentationDuration=.45f;
    public float revealPreparationDuration=.65f,panelFadeDuration=1,revealHoldDuration=1.2f;
    public float resultHoldDuration=1.25f,nextBoxTransitionDuration=.55f,finalResultsDuration=3;
    public void validate(){
        if(boxCount!=7)throw new IllegalArgumentException("Cinematic Cursed Boxes requires seven boxes");
        for(float value:new float[]{introDuration,selectionDuration,selectionLockedHold,hostSubtitleFadeIn,hostSubtitleFallbackDuration,cameraMoveToBox,identificationDuration,firstBoxAimDuration,normalBoxAimDuration,lastBoxAimDuration,firstBoxSuspense,normalBoxSuspense,lastBoxSuspense,shotCameraRecoilDuration,impactPresentationDuration,revealPreparationDuration,panelFadeDuration,revealHoldDuration,resultHoldDuration,nextBoxTransitionDuration,finalResultsDuration})
            if(!Float.isFinite(value)||value<=0||value>120)throw new IllegalArgumentException("Invalid Cursed Boxes cinematic duration");
    }
    public float aimDuration(int index,int count){return index==0?firstBoxAimDuration:index==count-1?lastBoxAimDuration:normalBoxAimDuration;}
    public float suspenseDuration(int index,int count){return index==count-1?lastBoxSuspense:index==0?firstBoxSuspense:normalBoxSuspense;}
}
