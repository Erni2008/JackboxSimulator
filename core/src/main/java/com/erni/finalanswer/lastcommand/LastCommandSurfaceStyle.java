package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.utils.Json;

/** Artist-facing corrosion controls, independent from placement and button mechanics. */
public final class LastCommandSurfaceStyle {
    public boolean enabled=true;
    public float exposure=1.15f;
    public Surface body=new Surface(.88f,1.3f,.79f);
    public Surface base=new Surface(.77f,1.1f,.76f);
    public Surface cap=new Surface(.65f,.9f,.73f);
    public Surface floor=new Surface(.25f,.55f,.90f);
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
        if(!Float.isFinite(style.exposure)||style.exposure<=0||style.exposure>4)throw new IllegalArgumentException("Invalid surface exposure");
        style.body.attribute(0);style.base.attribute(1);style.cap.attribute(2);style.floor.attribute(3);
        return style;
    }
}
