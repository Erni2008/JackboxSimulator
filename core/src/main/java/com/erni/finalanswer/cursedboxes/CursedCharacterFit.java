package com.erni.finalanswer.cursedboxes;

/** Shared fitting with clearance for idle, breathing and the maximum reaction roll. */
public record CursedCharacterFit(float width,float height,float centerY) {
    public static final float MAX_ROLL=1.8f,BREATH=.008f,HOVER=.006f;
    public static CursedCharacterFit calculate(CursedCharacterType type,int pixelsWide,int pixelsHigh,float desiredHeight){
        if(pixelsWide<=0||pixelsHigh<=0||!Float.isFinite(desiredHeight)||desiredHeight<=0)throw new IllegalArgumentException(type.diagnostic("invalid fitting dimensions"));
        float aspect=pixelsWide/(float)pixelsHigh,center=-.012f+type.verticalOffset;
        double angle=Math.toRadians(MAX_ROLL),sin=Math.sin(angle),cos=Math.cos(angle);
        float height=Math.min(desiredHeight*type.scale,Math.min(
            (float)((1.24-2*(HOVER+Math.abs(center)))/((cos+aspect*sin)*(1+BREATH))),
            (float)(1.8/((aspect*cos+sin)*(1+BREATH)))));
        if(height<=0)throw new IllegalArgumentException(type.diagnostic("profile exceeds compartment clearance"));
        return new CursedCharacterFit(height*aspect,height,center);
    }
}
