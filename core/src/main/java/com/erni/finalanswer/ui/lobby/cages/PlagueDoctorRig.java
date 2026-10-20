package com.erni.finalanswer.ui.lobby.cages;

/** Source-calibrated geometry shared by rendering, hand attachment and pendulum support motion. */
public final class PlagueDoctorRig {
    public static final float HIP_HEIGHT=41, NECK_X=1, NECK_Y=24;
    public static final float RIGHT_SHOULDER_X=16, RIGHT_SHOULDER_Y=25;
    public static final float ARM_SCALE=.028f, LANTERN_SCALE=.025f;
    public static final float RIGHT_PIVOT_X=360, RIGHT_PIVOT_Y=160;
    public static final float GRIP_SOURCE_X=1225, GRIP_SOURCE_Y=525;
    public static final float GRIP_X=(GRIP_SOURCE_X-RIGHT_PIVOT_X)*ARM_SCALE;
    public static final float GRIP_Y=(RIGHT_PIVOT_Y-GRIP_SOURCE_Y)*ARM_SCALE;
    public static final float RING_X=655,RING_Y=70,FLAME_X=585,FLAME_Y=800;
    private PlagueDoctorRig() {}
    public static void locateHand(PlagueDoctorAnimator.Pose p) {
        double arm=Math.toRadians(p.rightArm),body=Math.toRadians(p.bodyAngle);
        double x=RIGHT_SHOULDER_X+GRIP_X*Math.cos(arm)-GRIP_Y*Math.sin(arm);
        double y=RIGHT_SHOULDER_Y+GRIP_X*Math.sin(arm)+GRIP_Y*Math.cos(arm);
        p.handX=p.hipX+(float)(x*Math.cos(body)-y*Math.sin(body))*p.bodyScale;
        p.handY=HIP_HEIGHT+p.hipY+(float)(x*Math.sin(body)+y*Math.cos(body))*p.bodyScale;
    }
}
