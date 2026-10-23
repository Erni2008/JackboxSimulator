package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.utils.Json;

/** Source-image anchors in pixels, measured from its top-left; world units for the virtual counter. */
public final class CursedBoxesGalleryConfig {
    public float imageWidth=1672,imageHeight=941,shelfFloorY=675,shelfImageHeight=594,counterFrontY=884;
    public float restImageX=1060,restImageY=827,restWorldZ=6,weaponScale=3.5f,restYaw=145;
    public float pickupDuration=.65f,aimDuration=.3f,returnDuration=.8f;
    public float ghostHeight=1.18f;
    public int dustCount=28;
    public float fogOpacity=.15f,fogSpeed=.018f;
    public static CursedBoxesGalleryConfig load(){
        var file=Gdx.files.internal(CursedBoxesAssets.ROOT+"gallery.json");var c=file.exists()?new Json().fromJson(CursedBoxesGalleryConfig.class,file):new CursedBoxesGalleryConfig();
        for(float v:new float[]{c.imageWidth,c.imageHeight,c.shelfFloorY,c.shelfImageHeight,c.counterFrontY,c.restImageX,c.restImageY,c.restWorldZ,c.weaponScale,c.restYaw,c.pickupDuration,c.aimDuration,c.returnDuration})if(!Float.isFinite(v))throw new IllegalArgumentException("Non-finite shooting-gallery setting");
        if(!Float.isFinite(c.fogOpacity)||c.fogOpacity<0||c.fogOpacity>.3f||!Float.isFinite(c.fogSpeed)||c.fogSpeed<0||c.fogSpeed>.08f)throw new IllegalArgumentException("Invalid gallery mist settings");
        if(!Float.isFinite(c.ghostHeight)||c.ghostHeight<=0||c.imageWidth<=0||c.imageHeight<=0||c.shelfImageHeight<=0||c.weaponScale<=0||c.pickupDuration<=0||c.aimDuration<=0||c.returnDuration<=0||c.dustCount<0||c.dustCount>35||c.counterFrontY<=c.restImageY||c.counterFrontY>=c.imageHeight)throw new IllegalArgumentException("Invalid shooting-gallery placement/timing");return c;
    }
}
