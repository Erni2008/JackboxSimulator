package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Application;
import com.badlogic.gdx.Gdx;

/**
 * Render budget for THE CURSED CARDS. LOW targets weak phones: 16k-triangle machine, 512 px machine maps, no shadow
 * pass, one point light, half-size card faces. Chosen with -Dcursedcards.quality=high|medium|low, otherwise by platform.
 */
public enum CursedCardsQuality {
    //   model                              glow                                  shadow  ibl  pointLights  faceHeight  pulse
    HIGH("models/cursed_cards/shufle_high.glb","models/cursed_cards/shufle_glow_1024.png",2048,32,2,1152,true),
    MEDIUM("models/cursed_cards/shufle_medium.glb","models/cursed_cards/shufle_glow_1024.png",1024,16,2,768,true),
    LOW("models/cursed_cards/shufle_low.glb","models/cursed_cards/shufle_glow_512.png",0,8,1,576,false);

    public final String model,glow;
    /** Shadow map size; 0 disables the shadow pass. */
    public final int shadowMap,irradiance,pointLights,faceHeight;
    /** Animated turn outline (forces continuous frames while waiting for a draw). */
    public final boolean pulse;
    CursedCardsQuality(String model,String glow,int shadowMap,int irradiance,int pointLights,int faceHeight,boolean pulse){
        this.model=model;this.glow=glow;this.shadowMap=shadowMap;this.irradiance=irradiance;this.pointLights=pointLights;this.faceHeight=faceHeight;this.pulse=pulse;}
    public static CursedCardsQuality detect(){
        String forced=System.getProperty("cursedcards.quality","");
        for(var q:values())if(q.name().equalsIgnoreCase(forced))return q;
        var type=Gdx.app==null?Application.ApplicationType.Desktop:Gdx.app.getType();
        return type==Application.ApplicationType.Desktop?HIGH:LOW;
    }
}
