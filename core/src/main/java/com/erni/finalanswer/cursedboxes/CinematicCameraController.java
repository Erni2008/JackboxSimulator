package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.PerspectiveCamera;
import com.badlogic.gdx.math.Vector3;

/** Authoritative fixed room view with a reversible render-only shot translation. */
public final class CinematicCameraController {
    public final PerspectiveCamera camera=new PerspectiveCamera(34,1280,720);
    private float shakeAge=1;
    private final Vector3 basePosition=new Vector3();
    public void shot(){shakeAge=0;}
    public void reset(){shakeAge=1;}
    public void applyShake(){
        basePosition.set(camera.position);
        if(shakeAge<.16f){float t=shakeAge/.16f,d=(1-t)*(1-t);
            camera.position.add((float)Math.sin(t*39)*.018f*d,.027f*d*(float)Math.cos(t*23),0);camera.update();}
    }
    public void restore(){camera.position.set(basePosition);camera.update();}
    public CinematicCameraController(){camera.near=.08f;camera.far=70;resize(1280,720);}
    public void resize(int w,int h){camera.viewportWidth=w;camera.viewportHeight=h;}
    public void update(float delta,float time,CrateSlot target){
        shakeAge+=Math.max(0,delta);
        float z=Math.max(14.5f,6.2f/(float)Math.tan(Math.toRadians(17))*camera.viewportHeight/camera.viewportWidth);
        camera.position.set(0,.1f,z);camera.up.set(Vector3.Y);camera.lookAt(0,0,0);camera.update();
    }
}
