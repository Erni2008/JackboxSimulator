package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.math.Vector3;
import net.mgsx.gltf.scene3d.scene.Scene;
/** Fixed geometry remains an occluder during picking. */
final class StaticMechanism extends PanelControl {
    StaticMechanism(PanelElementId id,Scene s,PickGeometry g,PanelConfiguration.Mount mount){super(id,s,g,mount);}
    public void update(float delta){}
    public void reset(){scene.modelInstance.transform.set(rest);setLocked(false);}
    boolean activeSurface(Vector3 p){return false;}
}
