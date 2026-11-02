package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Application;
import com.badlogic.gdx.Gdx;

/**
 * Render budget for THE CURSED CARDS. LOW targets weak phones: ~32k triangles for machine, table and eight chairs,
 * 512 px maps, no shadow pass, one point light, half-size card faces, 3D layer at 67% resolution. Chosen with -Dcursedcards.quality=high|medium|low, otherwise by platform.
 */
public enum CursedCardsQuality {
    //   model                              glow                                  shadow  ibl  pointLights  faceHeight  pulse
    HIGH("high","models/cursed_cards/shufle_glow_1024.png",2048,32,2,1152,true,1f),
    MEDIUM("medium","models/cursed_cards/shufle_glow_1024.png",1024,16,1,768,true,.8f),
    LOW("low","models/cursed_cards/shufle_glow_512.png",0,8,1,576,false,.67f);

    public final String model,glow;
    /** 3D layer resolution relative to the screen (upscaled; the 2D backdrop and HUD stay sharp). */
    public final float renderScale;
    /** Shadow map size; 0 disables the shadow pass. */
    public final int shadowMap,irradiance,pointLights,faceHeight;
    /** Animated turn outline (forces continuous frames while waiting for a draw). */
    public final boolean pulse;
    CursedCardsQuality(String tier,String glow,int shadowMap,int irradiance,int pointLights,int faceHeight,boolean pulse,float renderScale){
        model="models/cursed_cards/shufle_"+tier+".glb";this.renderScale=renderScale;this.glow=glow;this.shadowMap=shadowMap;this.irradiance=irradiance;this.pointLights=pointLights;this.faceHeight=faceHeight;this.pulse=pulse;}
    public static CursedCardsQuality detect(){
        String forced=System.getProperty("cursedcards.quality","");
        for(var q:values())if(q.name().equalsIgnoreCase(forced))return q;
        var type=Gdx.app==null?Application.ApplicationType.Desktop:Gdx.app.getType();
        return type==Application.ApplicationType.Desktop?HIGH:LOW;
    }
}
