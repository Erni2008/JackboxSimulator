package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.math.*;

/** Card placement: world position plus yaw (about Y), pitch (nose tilt) and roll (flip about the long axis), degrees. Roll 180 = face down. */
public final class CardPose {
    public final Vector3 position=new Vector3();
    public float yaw,pitch,roll;
    public CardPose set(CardPose o){position.set(o.position);yaw=o.yaw;pitch=o.pitch;roll=o.roll;return this;}
    public CardPose set(Vector3 p,float yaw,float pitch,float roll){position.set(p);this.yaw=yaw;this.pitch=pitch;this.roll=roll;return this;}
    public boolean faceDown(){return Math.abs(((roll%360)+360)%360-180)<90;}
    public Matrix4 apply(Matrix4 m){return m.setToTranslation(position).rotate(Vector3.Y,yaw).rotate(Vector3.X,pitch).rotate(Vector3.Z,roll);}
}
