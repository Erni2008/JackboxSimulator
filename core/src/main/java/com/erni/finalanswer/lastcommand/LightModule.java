package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.math.*;
import net.mgsx.gltf.scene3d.scene.Scene;

/** One original lamp mesh. A source-space lens mask keeps its brass/threaded housing untouched. */
public final class LightModule extends PanelControl {
    public enum State {
        OFF("777873"), RED("E02C20"), GREEN("25C65A"), YELLOW("E8C438"), BLUE("2C79E0");
        private final Color color;
        State(String hex){color=Color.valueOf(hex);}
    }
    private State state=State.OFF;
    private final PanelSurfaceAttribute surface=new PanelSurfaceAttribute(2);
    private final Vector3 lensAxis;
    private final float lensStart;
    private final Color startTint=new Color(),targetTint=new Color();
    private float tintElapsed,brightness=1,intensityStart,intensityTarget,intensityElapsed,intensityDuration=.15f;
    private boolean blinking;
    private float period=1,duty=.5f,phase;
    LightModule(Scene scene,PickGeometry geometry,PanelConfiguration.LightMount mount){
        super(PanelElementId.LIGHT_MODULE,scene,geometry,mount);
        lensAxis=new Vector3(mount.lensAxis).nor();lensStart=mount.lensStart;
        if(lensAxis.isZero()||!Float.isFinite(lensAxis.x)||!Float.isFinite(lensAxis.y)||!Float.isFinite(lensAxis.z)||!Float.isFinite(lensStart))throw new IllegalArgumentException("Invalid lamp lens mask");
        // Original root node rotates raw (x,y,z) to source (x,-z,y).
        surface.maskAxis.set(lensAxis.x,lensAxis.z,-lensAxis.y);surface.maskStart=lensStart;
        for(var material:scene.modelInstance.materials)material.set(surface);
        reset();
    }
    public State color(){return state;}
    public float brightness(){return brightness;}
    public float intensity(){return surface.emission;}
    public boolean blinking(){return blinking;}
    public float blinkPeriod(){return period;}
    public float blinkDuty(){return duty;}
    public void setColor(State value){
        if(value==null)throw new IllegalArgumentException("Missing lamp color");
        if(state==value)return;
        state=value;startTint.set(surface.color);targetTint.set(state.color);tintElapsed=0;
        fadeTo(desiredIntensity(),.15f);
    }
    public void on(State color){if(color==State.OFF)throw new IllegalArgumentException("Use a lit color");setColor(color);}
    public void off(){setColor(State.OFF);}
    public void setBrightness(float value){
        if(!Float.isFinite(value)||value<0||value>3)throw new IllegalArgumentException("Brightness must be 0–3");
        brightness=value;fadeTo(desiredIntensity(),.15f);
    }
    public void setBlinking(boolean enabled,float seconds,float dutyCycle){
        if(!Float.isFinite(seconds)||seconds<.1f||!Float.isFinite(dutyCycle)||dutyCycle<=0||dutyCycle>=1)throw new IllegalArgumentException("Invalid blink period/duty cycle");
        blinking=enabled;period=seconds;duty=dutyCycle;phase=0;fadeTo(desiredIntensity(),.15f);
    }
    public void setBlinking(boolean enabled){setBlinking(enabled,period,duty);}
    private float desiredIntensity(){return state!=State.OFF&&(!blinking||phase<period*duty)?brightness:0;}
    private void fadeTo(float target,float duration){com.badlogic.gdx.Gdx.graphics.requestRendering();intensityStart=surface.emission;intensityTarget=target;intensityElapsed=0;intensityDuration=duration;}
    @Override public boolean animating(){return blinking&&state!=State.OFF&&brightness>0||tintElapsed<.15f||intensityElapsed<intensityDuration;}
    @Override public void update(float delta){
        if(!Float.isFinite(delta)||delta<0)return;
        if(blinking){phase=(phase+delta)%period;float target=desiredIntensity();if(target!=intensityTarget)fadeTo(target,.045f);}
        intensityElapsed+=delta;tintElapsed+=delta;
        surface.emission=MathUtils.lerp(intensityStart,intensityTarget,Interpolation.smooth.apply(Math.min(1,intensityElapsed/intensityDuration)));
        surface.color.set(startTint).lerp(targetTint,Interpolation.smooth.apply(Math.min(1,tintElapsed/.15f)));
    }
    @Override public void reset(){
        super.setLocked(false);state=State.OFF;brightness=1;blinking=false;phase=0;
        startTint.set(state.color);targetTint.set(state.color);surface.color.set(state.color);surface.emission=0;
        tintElapsed=.15f;intensityStart=intensityTarget=intensityElapsed=0;scene.modelInstance.transform.set(rest);
    }
    @Override boolean activeSurface(Vector3 point){return lensAxis.dot(point)>lensStart;}
}
