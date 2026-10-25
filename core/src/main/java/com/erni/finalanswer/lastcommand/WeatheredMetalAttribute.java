package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.graphics.g3d.Attribute;

/** Additional PBR layer; the GLB's color, normal and metallic/roughness maps remain intact. */
public final class WeatheredMetalAttribute extends Attribute {
    public static final long TYPE = register("lastCommandWeatheredMetal");
    public final float coverage, relief, roughness, part;
    public WeatheredMetalAttribute(float coverage, float relief, float roughness, float part) {
        super(TYPE);
        this.coverage=coverage;this.relief=relief;this.roughness=roughness;this.part=part;
    }
    @Override public Attribute copy() { return new WeatheredMetalAttribute(coverage,relief,roughness,part); }
    @Override public int compareTo(Attribute other) {
        if(type!=other.type)return Long.compare(type,other.type);
        WeatheredMetalAttribute value=(WeatheredMetalAttribute)other;
        int result=Float.compare(coverage,value.coverage);
        if(result==0)result=Float.compare(relief,value.relief);
        if(result==0)result=Float.compare(roughness,value.roughness);
        return result==0?Float.compare(part,value.part):result;
    }
}
