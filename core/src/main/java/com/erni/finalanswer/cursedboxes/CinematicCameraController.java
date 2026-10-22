package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.PerspectiveCamera;
import com.badlogic.gdx.math.Vector3;

/** Fixed room view. Aiming and recoil belong to the weapon, never to the cabinet/camera. */
public final class CinematicCameraController {
    public final PerspectiveCamera camera=new PerspectiveCamera(34,1280,720);
    public CinematicCameraController(){camera.near=.08f;camera.far=70;resize(1280,720);}
    public void resize(int w,int h){camera.viewportWidth=w;camera.viewportHeight=h;}
    public void update(float delta,float time,CrateSlot target){
        float z=Math.max(14.5f,6.2f/(float)Math.tan(Math.toRadians(17))*camera.viewportHeight/camera.viewportWidth);
        camera.position.set(0,.1f,z);camera.up.set(Vector3.Y);camera.lookAt(0,0,0);camera.update();
    }
}
