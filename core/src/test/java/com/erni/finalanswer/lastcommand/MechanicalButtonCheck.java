package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.math.*;
public final class MechanicalButtonCheck {
    private static void near(float expected,float actual){if(Math.abs(expected-actual)>.0001f)throw new AssertionError(expected+" != "+actual);}
    public static void main(String[] args){
        MechanicalButton b=new MechanicalButton();
        b.held(true);b.update(.05f);near(.5f,b.depression());
        b.update(.05f);near(1,b.depression());b.update(20);near(1,b.depression());
        b.held(false);b.update(.075f);near(.5f,b.depression());
        // Reverse a partially completed release without snapping.
        b.held(true);near(.5f,b.depression());b.update(.1f);near(1,b.depression());
        Matrix4 rest=new Matrix4().setToRotation(Vector3.Y,90).setTranslation(2,3,4),out=new Matrix4();
        b.apply(rest,out);Vector3 position=out.getTranslation(new Vector3());
        near(2-b.travel,position.x);near(3,position.y);near(4,position.z);
        near(2,rest.getTranslation(new Vector3()).x);
        b.held(false);b.update(.15f);near(0,b.depression());
        b.update(Float.NaN);b.update(-1);b.update(Float.POSITIVE_INFINITY);near(0,b.depression());
        System.out.println("MechanicalButtonCheck OK: timing, hold, reversal, local-axis travel, invalid delta");
    }
}
