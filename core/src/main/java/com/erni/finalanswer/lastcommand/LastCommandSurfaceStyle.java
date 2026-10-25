package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.utils.Json;

/** Artist-facing corrosion controls, independent from placement and button mechanics. */
public final class LastCommandSurfaceStyle {
    public boolean enabled=true;
    public float exposure=1.12f;
    public boolean legacyLook;
    public Lighting lighting=new Lighting();
    public Surface body=new Surface(.22f,.95f,.36f);
    public Surface base=new Surface(.14f,.85f,.32f);
    public Surface cap=new Surface(.08f,1.05f,.32f);
    public Surface floor=new Surface(.25f,.55f,.90f);
    public static final class Lighting {
        public float ambient=.16f,shadowBias=.0025f,shadowSpan=3.1f,shadowDepth=5f;
        public com.badlogic.gdx.math.Vector3 keyDirection=new com.badlogic.gdx.math.Vector3(-.55f,-.76f,-.4f);
        public float[] keyColor={2.55f,2.45f,2.25f},fillColor={.36f,.44f,.56f},rimColor={.55f,.65f,.78f};
        void validate(){
            if(!Float.isFinite(ambient)||ambient<0||ambient>1||!Float.isFinite(shadowBias)||shadowBias<0||shadowBias>.01f||!Float.isFinite(shadowSpan)||shadowSpan<2.5f||shadowSpan>6||!Float.isFinite(shadowDepth)||shadowDepth<3||shadowDepth>10||keyDirection==null||keyDirection.isZero()||!Float.isFinite(keyDirection.len2()))throw new IllegalArgumentException("Invalid lighting settings");
            for(float[] color:new float[][]{keyColor,fillColor,rimColor}){if(color==null||color.length!=3)throw new IllegalArgumentException("Light needs RGB");for(float c:color)if(!Float.isFinite(c)||c<0||c>8)throw new IllegalArgumentException("Invalid light color");}
        }
    }
    public static final class Surface {
        public float coverage,relief,roughness;
        public Surface() {}
        public Surface(float coverage,float relief,float roughness){this.coverage=coverage;this.relief=relief;this.roughness=roughness;}
        WeatheredMetalAttribute attribute(int part){
            if(!Float.isFinite(coverage)||coverage<0||coverage>1||!Float.isFinite(relief)||relief<0||relief>3||!Float.isFinite(roughness)||roughness<0||roughness>1)
                throw new IllegalArgumentException("Invalid corrosion surface values");
            return new WeatheredMetalAttribute(coverage,relief,roughness,part);
        }
    }
    public static LastCommandSurfaceStyle load(){
        var file=Gdx.files.internal(TheLastCommandMachine.ROOT+"surface.json");
        LastCommandSurfaceStyle style=file.exists()?new Json().fromJson(LastCommandSurfaceStyle.class,file):new LastCommandSurfaceStyle();
        style.legacyLook="legacy".equals(System.getProperty("lc.look"));
        if(style.legacyLook){style.exposure=1.15f;style.body=new Surface(.50f,1.3f,.79f);style.base=new Surface(.44f,1.1f,.76f);style.cap=new Surface(.38f,.9f,.73f);}
        style.lighting.validate();
        if(!Float.isFinite(style.exposure)||style.exposure<=0||style.exposure>4)throw new IllegalArgumentException("Invalid surface exposure");
        style.body.attribute(0);style.base.attribute(1);style.cap.attribute(2);style.floor.attribute(3);
        return style;
    }
}
