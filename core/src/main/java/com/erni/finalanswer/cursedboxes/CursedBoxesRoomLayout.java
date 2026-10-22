package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.PerspectiveCamera;
import com.badlogic.gdx.math.Vector3;

/** Source-pixel anchors keep feet at the rear-wall seam and the gun on the pictured countertop. */
public final class CursedBoxesRoomLayout {
    public final Vector3 origin=new Vector3(),tableAnchor=new Vector3();
    private final CursedBoxesGalleryConfig config;
    private final Vector3 direction=new Vector3();
    public CursedBoxesRoomLayout(CursedBoxesGalleryConfig config){this.config=config;}
    public void update(PerspectiveCamera camera,int width,int height){
        float scale=CursedBoxesBackground.coverScale(width,height,config.imageWidth,config.imageHeight);
        float tan=(float)Math.tan(Math.toRadians(camera.fieldOfView*.5));
        float visibleSourceHeight=height/scale;
        float cabinetPixels=Math.min(config.shelfImageHeight,config.shelfFloorY-Math.max(0,config.imageHeight-visibleSourceHeight)-45);
        float distance=CursedBoxesShelf.HEIGHT*height/(2*tan*Math.max(180,cabinetPixels)*scale);
        float shelfZ=camera.position.z-distance;
        float floorY=(config.imageHeight-config.shelfFloorY)*scale;
        pointOnPlane(camera,width*.5f,floorY,shelfZ,width,height,origin);
        origin.y-=CursedBoxesShelf.RIGHT_FOOT_Y;origin.z+=.55f;
        float x=(width-config.imageWidth*scale)*.5f+config.restImageX*scale;
        float y=(config.imageHeight-config.restImageY)*scale;
        pointOnPlane(camera,x,y,config.restWorldZ,width,height,tableAnchor);
    }
    private void pointOnPlane(PerspectiveCamera camera,float x,float y,float z,int width,int height,Vector3 out){
        // Unproject explicit viewport coordinates; independent of the window size during resize/tests.
        direction.set(x/width*2-1,y/height*2-1,0).prj(camera.invProjectionView).sub(camera.position);
        out.set(camera.position).mulAdd(direction,(z-camera.position.z)/direction.z);
    }
    public float counterFrontScreenY(int width,int height){float scale=CursedBoxesBackground.coverScale(width,height,config.imageWidth,config.imageHeight);return (config.imageHeight-config.counterFrontY)*scale;}
}
