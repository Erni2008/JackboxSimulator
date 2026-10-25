package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.math.*;
import net.mgsx.gltf.scene3d.scene.Scene;
import java.util.function.BiConsumer;
/** Kinematic hinge: anchor is the axle/hinge, not the geometry center. */
public class PivotMechanism extends PanelControl {
    private final Vector3 axis;
    private final float seconds;
    private final float[] angles;
    private final BiConsumer<Integer,PanelAction.Cause> changed;
    private float angle,start,elapsed;
    private int position;
    private boolean moving;
    public PivotMechanism(PanelElementId id,Scene scene,PickGeometry geometry,PanelConfiguration.Mount mount,Vector3 axis,float seconds,float[] angles,BiConsumer<Integer,PanelAction.Cause> changed){
        super(id,scene,geometry,mount);this.axis=new Vector3(axis).nor();this.seconds=seconds;this.angles=angles.clone();this.changed=changed;
        if(this.axis.isZero()||!Float.isFinite(this.axis.x)||!Float.isFinite(this.axis.y)||!Float.isFinite(this.axis.z)||!Float.isFinite(seconds)||seconds<=0||angles.length<2)throw new IllegalArgumentException("Invalid hinge");for(float angle:angles)if(!Float.isFinite(angle))throw new IllegalArgumentException("Invalid hinge angle");reset();
    }
    public int position(){return position;}
    public float angle(){return angle;}
    public float targetAngle(){return angles[position];}
    public boolean setPosition(int value){return setPosition(value,PanelAction.Cause.PROGRAM);}
    public boolean setPosition(int value,PanelAction.Cause cause){
        if(value<0||value>=angles.length)throw new IllegalArgumentException("Invalid hinge position");
        if(value==position)return false;com.badlogic.gdx.Gdx.graphics.requestRendering();position=value;start=angle;elapsed=0;moving=true;changed.accept(value,cause);return true;
    }
    public boolean step(PanelAction.Cause cause){return !locked()&&visible()&&setPosition((position+1)%angles.length,cause);}
    @Override public boolean animating(){return moving;}
    @Override public void update(float delta){if(!Float.isFinite(delta)||delta<0||!moving)return;elapsed+=Math.max(0,delta);angle=MathUtils.lerp(start,angles[position],Interpolation.smooth.apply(Math.min(1,elapsed/seconds)));apply();if(elapsed>=seconds)moving=false;}
    private void apply(){scene.modelInstance.transform.set(anchor).rotate(axis,angle).translate(-mount.pivot.x,-mount.pivot.y,-mount.pivot.z);}
    @Override public void reset(){setLocked(false);position=0;angle=start=angles[0];elapsed=0;moving=false;apply();}
    @Override boolean activeSurface(Vector3 point){return true;}
}
