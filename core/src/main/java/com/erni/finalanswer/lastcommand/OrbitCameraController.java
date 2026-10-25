package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.PerspectiveCamera;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;

/** Button gestures own their pointer; orbit gestures can never turn into a press. */
public final class OrbitCameraController extends InputAdapter {
    private final PerspectiveCamera camera;
    private final TheLastCommandMachine machine;
    private final Vector3 center = new Vector3(), target = new Vector3();
    private final Vector3 dragRight=new Vector3(),panShift=new Vector3(),orbitDirection=new Vector3(),collisionOffset=new Vector3();
    private float radius, distance, yaw, pitch, ground;
    private int active = -1, pointer = -1, lastX, lastY;
    private PanelElementId captured;
    public OrbitCameraController(PerspectiveCamera camera, TheLastCommandMachine machine) {
        this.camera=camera;this.machine=machine;
        BoundingBox bounds=machine.bounds; bounds.getCenter(center);
        radius=Math.max(.1f,bounds.getDimensions(new Vector3()).len()*.5f);
        ground=bounds.min.y+radius*.035f;
        reset();
    }
    public record State(float distance,float yaw,float pitch,Vector3 target){}
    public State snapshot(){return new State(distance,yaw,pitch,new Vector3(target));}
    public void restore(State state){cancel();distance=state.distance();yaw=state.yaw();pitch=state.pitch();target.set(state.target());update();}
    public void reset() { cancel();target.set(center);distance=radius*3.2f;yaw=25;pitch=15;update(); }
    public void cancel(){if(captured!=null)machine.endInteraction(captured);captured=null;pointer=-1;active=-1;}
    @Override public boolean touchDown(int x,int y,int p,int button) {
        if(pointer!=-1 || button!=Input.Buttons.LEFT&&button!=Input.Buttons.RIGHT)return false;
        pointer=p;active=button;lastX=x;lastY=y;
        captured=button==Input.Buttons.LEFT?machine.pick(camera.getPickRay(x,y)):null;
        if(captured!=null)machine.beginInteraction(captured);
        Gdx.graphics.requestRendering();return true;
    }
    @Override public boolean touchDragged(int x,int y,int p) {
        if(p!=pointer)return false;
        float dx=x-lastX,dy=y-lastY;lastX=x;lastY=y;
        if(captured!=null){Gdx.graphics.requestRendering();return true;}
        if(active==Input.Buttons.LEFT){yaw-=dx*.3f;pitch=MathUtils.clamp(pitch+dy*.3f,-85,85);}
        else {
            float amount=distance*.0015f;
            Vector3 right=dragRight.set(camera.direction).crs(camera.up).nor();
            target.mulAdd(right,-dx*amount).mulAdd(camera.up,dy*amount);
            Vector3 shift=panShift.set(target).sub(center);if(shift.len()>radius*2)target.set(center).mulAdd(shift.nor(),radius*2);
        }
        update();Gdx.graphics.requestRendering();return true;
    }
    @Override public boolean touchUp(int x,int y,int p,int button){if(p!=pointer||button!=active)return false;cancel();Gdx.graphics.requestRendering();return true;}
    @Override public boolean scrolled(float x,float y){distance=MathUtils.clamp(distance*(float)Math.exp(y*.12f),radius*1.2f,radius*12);update();Gdx.graphics.requestRendering();return true;}
    private void update(){
        Vector3 direction=orbitDirection.set(MathUtils.sinDeg(yaw)*MathUtils.cosDeg(pitch),MathUtils.sinDeg(pitch),MathUtils.cosDeg(yaw)*MathUtils.cosDeg(pitch));
        camera.position.set(target).mulAdd(direction,distance);
        // Conservative enclosing sphere protects the machine even when the camera is panned.
        Vector3 offset=collisionOffset.set(camera.position).sub(center);
        if(offset.len()<radius*1.15f)camera.position.set(center).mulAdd(offset.isZero()?Vector3.Z:offset.nor(),radius*1.15f);
        camera.position.y=Math.max(ground,camera.position.y);
        camera.up.set(Vector3.Y);camera.lookAt(target);camera.near=radius*.01f;camera.far=radius*40;camera.update();Gdx.graphics.requestRendering();
    }
}
