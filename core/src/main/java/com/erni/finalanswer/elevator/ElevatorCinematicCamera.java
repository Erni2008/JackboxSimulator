package com.erni.finalanswer.elevator;

import com.badlogic.gdx.math.MathUtils;

/**
 * The cinematic "camera" of the elevator sequence. Because every shot is built from flat paintings, a camera move is
 * expressed as a per-layer transform: a layer is scaled by {@code s} about a focus point {@code F} (in world units)
 * and that focus is placed at screen point {@code S}. Giving the far layer a smaller scale change than the near layer
 * produces parallax. Shake is a bounded sum of sines around the stable transform — it never accumulates — with
 * separate envelopes for a low-frequency start judder, a steady hum and damped one-shot bumps.
 */
public final class ElevatorCinematicCamera {
    /** Reused, allocation-free transform. */
    public static final class Layer {
        public float s=1,fx,fy,sx,sy;
        public Layer set(float s,float fx,float fy,float sx,float sy){this.s=s;this.fx=fx;this.fy=fy;this.sx=sx;this.sy=sy;return this;}
        public float x(float worldX){return sx+(worldX-fx)*s;}
        public float y(float worldY){return sy+(worldY-fy)*s;}
    }
    private float time,hum,judder,bumpAge=99,bumpStrength;
    private float shakeX,shakeY;

    public void update(float dt){
        time+=dt;bumpAge+=dt;
        float j=judder*(MathUtils.sin(time*9.1f)*.7f+MathUtils.sin(time*5.3f+1)*.3f);
        float h=hum*(MathUtils.sin(time*31.7f)*.55f+MathUtils.sin(time*19.3f+.4f)*.45f);
        float b=bumpAge<1.2f?bumpStrength*(float)Math.exp(-bumpAge*5.5f)*MathUtils.sin(bumpAge*17):0;
        shakeX=hum*.45f*MathUtils.sin(time*23.9f+2)+judder*.25f*MathUtils.sin(time*6.7f);
        shakeY=j+h+b;
    }
    /** Steady motion hum amplitude (world px). */
    public void hum(float amplitude){hum=amplitude;}
    /** Low-frequency start/stop judder amplitude (world px). */
    public void judder(float amplitude){judder=amplitude;}
    /** One damped vertical bump (arrival settle, door impact). */
    public void bump(float strength){bumpAge=0;bumpStrength=strength;}
    public void reset(){hum=judder=0;bumpAge=99;shakeX=shakeY=0;}
    public float shakeX(){return shakeX;}
    public float shakeY(){return shakeY;}

    public static float smoother(float t){t=MathUtils.clamp(t,0,1);return t*t*t*(t*(t*6-15)+10);}
    /** Exponential (perceptually even) interpolation of a zoom factor. */
    public static float zoom(float from,float to,float t){return (float)(from*Math.pow(to/from,MathUtils.clamp(t,0,1)));}
}
