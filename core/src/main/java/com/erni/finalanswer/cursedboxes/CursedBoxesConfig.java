package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.utils.Json;

/** Small local presentation contract, independent of multiplayer rules. */
public final class CursedBoxesConfig {
    public float impactAt=.03f,pumpAt=.45f,shotDuration=1.1f;
    public float debrisForwardSpeed=8.5f,debrisSideSpeed=4f;
    public int largeFragments=4,smallSplinters=7,dustClouds=2;
    public int ghostSlot=5;
    public long characterSeed;
    public boolean lowEffects;
    public com.finalanswer.protocol.CursedBoxesCinematicConfig cinematic=new com.finalanswer.protocol.CursedBoxesCinematicConfig();
    public static CursedBoxesConfig load(){
        var file=Gdx.files.internal(CursedBoxesAssets.ROOT+"scene.json");
        CursedBoxesConfig c=file.exists()?new Json().fromJson(CursedBoxesConfig.class,file):new CursedBoxesConfig();
        c.cinematic.validate();float last=0;
        for(float t:new float[]{c.impactAt,c.pumpAt,c.shotDuration}){
            if(!Float.isFinite(t)||t<last)throw new IllegalArgumentException("Invalid destruction timeline");last=t;
        }
        if(!Float.isFinite(c.debrisForwardSpeed)||c.debrisForwardSpeed<=0||c.debrisForwardSpeed>15||!Float.isFinite(c.debrisSideSpeed)||c.debrisSideSpeed<=0||c.debrisSideSpeed>8)throw new IllegalArgumentException("Invalid debris launch speed");
        if(c.shotDuration<1||c.ghostSlot<0||c.ghostSlot>=16||c.largeFragments<0||c.largeFragments>5||c.smallSplinters<0||c.smallSplinters>10||c.dustClouds<0||c.dustClouds>3)throw new IllegalArgumentException("Invalid Cursed Boxes quality or slot");
        return c;
    }
}
