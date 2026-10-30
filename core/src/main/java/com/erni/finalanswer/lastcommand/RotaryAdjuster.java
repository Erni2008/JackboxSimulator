package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.math.*;
import java.util.function.BiConsumer;
import net.mgsx.gltf.scene3d.scene.Scene;

/** The shaft is buried in the existing socket; only its knob is exposed above the panel. */
public final class RotaryAdjuster extends PanelControl {
    private final PanelSurfaceAttribute surface=new PanelSurfaceAttribute(3);
    private final Matrix4 patternAnchor,patternInverse,patternWork=new Matrix4();
    private float[] angles;
    private float angle,start,elapsed,seconds;
    private int index;private int direction=1;
    private final Vector3 axis;
    private final float pickMinY;
    private boolean turning;
    private PanelAction.Cause cause=PanelAction.Cause.PROGRAM;
    private final BiConsumer<Float,PanelAction.Cause> changed;
    RotaryAdjuster(Scene scene,PickGeometry geometry,PanelConfiguration.AdjusterMount mount,BiConsumer<Float,PanelAction.Cause> changed){
        super(PanelElementId.ADJUSTER,scene,geometry,mount);
        patternAnchor=new Matrix4(anchor).setTranslation(0,0,0);patternInverse=new Matrix4(patternAnchor).inv();
        for(var material:scene.modelInstance.materials)material.set(surface);
        this.changed=changed;axis=new Vector3(mount.axis).nor();pickMinY=mount.pickMinY;seconds=mount.turnSeconds;
        if(axis.isZero()||!Float.isFinite(axis.x)||!Float.isFinite(axis.y)||!Float.isFinite(axis.z)||!Float.isFinite(seconds)||seconds<=0)throw new IllegalArgumentException("Invalid adjuster axis/duration");
        setAllowedAngles(mount.angles);
    }
    public float angle(){return angle;}
    public float targetAngle(){return angles[index];}
    public int position(){return index;}
    public boolean turning(){return turning;}
    public float[] allowedAngles(){return angles.clone();}
    public void setAllowedAngles(float... values){
        if(values==null||values.length<1||values.length>32)throw new IllegalArgumentException("Use 1–32 detents");
        float[] replacement=values.clone();
        for(int i=0;i<values.length;i++){
            if(!Float.isFinite(values[i]))throw new IllegalArgumentException("Invalid detent");
            replacement[i]=((values[i]%360)+360)%360;
            for(int j=0;j<i;j++)if(Math.abs(replacement[i]-replacement[j])<.001f)throw new IllegalArgumentException("Duplicate detent");
        }
        boolean wasLocked=locked();angles=replacement;reset();super.setLocked(wasLocked);
    }
    public boolean setAngle(float value){
        for(int i=0;i<angles.length;i++)if(Math.abs(angles[i]-value)<.001f)return setPosition(i,PanelAction.Cause.PROGRAM);
        throw new IllegalArgumentException("Angle is not a configured detent: "+value);
    }
    public boolean setPosition(int position){return setPosition(position,PanelAction.Cause.PROGRAM);}
    boolean setPosition(int position,PanelAction.Cause cause){
        if(position<0||position>=angles.length)throw new IllegalArgumentException("Invalid detent index");
        if(position==index)return false;
        com.badlogic.gdx.Gdx.graphics.requestRendering();start=angle;index=position;elapsed=0;turning=true;this.cause=cause;return true;
    }
    boolean step(PanelAction.Cause cause){return !locked()&&setPosition(Math.floorMod(index+direction,angles.length),cause);}
    @Override public boolean animating(){return turning;}
    @Override public void update(float delta){
        if(!Float.isFinite(delta)||delta<0)return;
        if(turning){
            elapsed+=delta;
            float difference=((angles[index]-start+540)%360)-180;
            angle=start+difference*Interpolation.smooth.apply(Math.min(1,elapsed/seconds));
            if(elapsed>=seconds){angle=angles[index];turning=false;changed.accept(angle,cause);}
        }
        apply();
    }
    private void apply(){
        scene.modelInstance.transform.set(anchor).rotate(axis,angle).translate(-mount.pivot.x,-mount.pivot.y,-mount.pivot.z);
        surface.patternFrame.set(patternWork.set(patternAnchor).rotate(axis,-angle).mul(patternInverse));
    }
    @Override public void reset(){super.setLocked(false);index=0;angle=start=angles[0];elapsed=0;turning=false;apply();}
    @Override boolean activeSurface(Vector3 point){direction=(point.x-mount.pivot.x)*MathUtils.cosDeg(angle)+(point.z-mount.pivot.z)*MathUtils.sinDeg(angle)<0?-1:1;return point.y>=pickMinY;}
}
