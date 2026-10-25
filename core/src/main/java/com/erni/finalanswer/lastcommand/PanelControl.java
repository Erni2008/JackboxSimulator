package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.math.*;
import net.mgsx.gltf.scene3d.scene.Scene;

/** Instances own only transforms/material attributes; the machine owns all GLB resources. */
public abstract class PanelControl {
    final Scene scene;
    final PickGeometry geometry;
    final Matrix4 anchor, rest;
    final PanelConfiguration.Mount mount;
    private final PanelElementId id;
    private boolean locked;
    protected PanelControl(PanelElementId id,Scene scene,PickGeometry geometry,PanelConfiguration.Mount mount){
        this.id=id;this.scene=scene;this.geometry=geometry;this.mount=mount;
        anchor=mount.matrix();rest=mount.rest();scene.modelInstance.transform.set(rest);
    }
    public final PanelElementId id(){return id;}
    public final Scene scene(){return scene;}
    public final boolean locked(){return locked;}
    public void setLocked(boolean value){locked=value;}
    public Matrix4 restTransform(){return new Matrix4(rest);}
    public abstract void update(float delta);
    public abstract void reset();
    abstract boolean activeSurface(Vector3 sourcePoint);
}
