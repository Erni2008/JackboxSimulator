package com.erni.finalanswer.forgottenroom;

import com.badlogic.gdx.graphics.PerspectiveCamera;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.Ray;
import com.erni.finalanswer.gameplay.forgottenroom.RoomSceneDefinition;

/** Fixed camera and image-to-surface calibration. Coordinates on the artwork start at its top left. */
public final class RoomCameraSystem {
    public final PerspectiveCamera camera;
    public RoomCameraSystem(RoomSceneDefinition definition){
        var c=definition.camera();camera=new PerspectiveCamera(c.fov(),1920,1080);
        camera.position.set(c.position());camera.lookAt(new Vector3(c.target()));camera.near=c.near();camera.far=c.far();camera.update();
    }
    /** Intersect a pixel anchor with its horizontal support; never silently place a model behind the camera. */
    public Vector3 position(float u,float v,float surfaceHeight){
        // Explicit inverse projection avoids dependence on the current window size or letterbox viewport.
        Vector3 near=new Vector3(u*2-1,1-v*2,-1).prj(camera.invProjectionView);
        Vector3 far=new Vector3(u*2-1,1-v*2,1).prj(camera.invProjectionView);
        Ray ray=new Ray(near,far.sub(near).nor());Vector3 out=new Vector3();
        if(!Intersector.intersectRayPlane(ray,new Plane(Vector3.Y,-surfaceHeight),out))throw new IllegalArgumentException("Anchor misses support plane");
        return out;
    }
}
