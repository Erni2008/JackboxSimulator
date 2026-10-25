package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.Vector3;
import net.mgsx.gltf.scene3d.scene.Scene;

/** A cap instance with an independent 0.10/0.15 second mechanism and enamel tint. */
public final class SmallButton extends PanelControl {
    private final MechanicalButton motion=new MechanicalButton();
    private final PanelSurfaceAttribute surface=new PanelSurfaceAttribute(1);
    private final Color initialColor;
    private final float pickMinY;
    private boolean held;
    SmallButton(Scene scene,PickGeometry geometry,PanelConfiguration.ButtonMount mount){
        super(mount.id,scene,geometry,mount);pickMinY=mount.pickMinY;
        motion.localAxis.set(0,-1,0);motion.travel=mount.travel;
        if(!Float.isFinite(mount.travel)||mount.travel<0)throw new IllegalArgumentException("Invalid small-button travel");
        initialColor=colorNamed(mount.color);surface.color.set(initialColor);
        for(var material:scene.modelInstance.materials)material.set(surface);
    }
    public static Color colorNamed(String name){return switch(name){
        case "RED"->Color.valueOf("C42B20");case "GREEN"->Color.valueOf("25904D");
        case "BLUE"->Color.valueOf("246EC6");case "YELLOW"->Color.valueOf("D7AF25");
        default->throw new IllegalArgumentException("Unknown button paint: "+name);
    };}
    public Color color(){return new Color(surface.color);}
    public void setColor(Color color){
        if(color==null||!Float.isFinite(color.r)||!Float.isFinite(color.g)||!Float.isFinite(color.b))throw new IllegalArgumentException("Invalid button color");
        surface.color.set(color).clamp();surface.color.a=1;
    }
    public boolean press(){if(locked()||held)return false;held=true;motion.held(true);return true;}
    public boolean release(){if(!held)return false;held=false;motion.held(false);return true;}
    public boolean held(){return held;}
    public float depression(){return motion.depression();}
    @Override public void setLocked(boolean value){super.setLocked(value);if(value)release();}
    @Override public boolean animating(){return motion.animating();}
    @Override public void update(float delta){motion.update(delta);motion.apply(rest,scene.modelInstance.transform);}
    @Override public void reset(){super.setLocked(false);held=false;motion.reset();surface.color.set(initialColor);scene.modelInstance.transform.set(rest);}
    @Override boolean activeSurface(Vector3 point){return point.y>=pickMinY;}
}
