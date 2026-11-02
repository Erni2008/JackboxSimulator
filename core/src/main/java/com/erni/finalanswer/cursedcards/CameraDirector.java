package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.graphics.PerspectiveCamera;
import com.badlogic.gdx.math.*;

/**
 * Cinematic shots for the table (MAIN, DEALING, TURN, EXCHANGE, ELIMINATION). Each shot is an orbit target,
 * distance, pitch and yaw; the camera eases toward it frame-rate independently and never drops below
 * {@code minHeight} (above chairs and characters).
 */
public final class CameraDirector {
    public enum Shot {MAIN,DEALING,TURN,EXCHANGE,ELIMINATION}
    private final TableConfig.Camera config;
    private final Vector3 target=new Vector3(),goalTarget=new Vector3();
    private float distance,pitch,yaw,goalDistance,goalPitch,goalYaw;
    private Shot shot=Shot.MAIN;private boolean manual;
    public CameraDirector(TableConfig.Camera config){this.config=config;main();snap();}

    public Shot shot(){return shot;}
    public void main(){shot=Shot.MAIN;goalTarget.set(0,config.main.targetY,config.main.targetZ);goalDistance=config.main.distance;goalPitch=config.main.pitch;goalYaw=0;manual=false;}
    public void dealing(Vector3 machine){set(Shot.DEALING,machine.x,1.2f,machine.z+.6f,config.dealing.distance,config.dealing.pitch,0);}
    /** Frames the drawer's and source's hands together, viewed from the near side. */
    public void between(Shot shot,Vector3 a,Vector3 b){
        float mx=(a.x+b.x)*.5f,mz=(a.z+b.z)*.5f,span=a.dst(b);
        set(shot,mx,0,mz+.6f,Math.max(config.turn.minDistance,span*1.25f+5),config.turn.pitch,MathUtils.clamp(mx*1.6f,-22,22));
    }
    /** Close on the loser's hand from the loser's own side, where the revealed DEATH card is raised toward the camera. */
    public void elimination(SeatLayout.Seat seat){
        set(Shot.ELIMINATION,seat.hand.x-seat.normal.x*.5f,.9f,seat.hand.z-seat.normal.z*.5f,config.elimination.distance,config.elimination.pitch,seat.handYaw);
    }
    public void manual(float dYaw,float dPitch,float zoom){if(config.fixed)return;manual=true;goalYaw+=dYaw;goalPitch=MathUtils.clamp(goalPitch+dPitch,15,85);goalDistance=MathUtils.clamp(goalDistance*zoom,6,45);}
    public void release(){manual=false;}
    public boolean manualControl(){return manual;}
    private void set(Shot s,float x,float y,float z,float d,float p,float yw){if(manual||config.fixed)return;shot=s;goalTarget.set(x,y,z);goalDistance=d;goalPitch=p;goalYaw=yw;}
    /** Where the camera ends up for the current shot (orient props toward the viewer before it arrives). */
    public Vector3 goalPosition(Vector3 out){out.set(goalTarget).add(goalDistance*MathUtils.cosDeg(goalPitch)*MathUtils.sinDeg(goalYaw),goalDistance*MathUtils.sinDeg(goalPitch),goalDistance*MathUtils.cosDeg(goalPitch)*MathUtils.cosDeg(goalYaw));if(out.y<config.minHeight)out.y=config.minHeight;return out;}
    public void snap(){target.set(goalTarget);distance=goalDistance;pitch=goalPitch;yaw=goalYaw;}
    /** Ease toward the shot; returns true while still moving noticeably. */
    public boolean update(float dt,PerspectiveCamera camera){
        float k=1-(float)Math.exp(-config.smoothing*dt);
        target.lerp(goalTarget,k);distance+=(goalDistance-distance)*k;pitch+=(goalPitch-pitch)*k;
        float dy=((goalYaw-yaw)%360+540)%360-180;yaw+=dy*k;
        camera.position.set(target).add(distance*MathUtils.cosDeg(pitch)*MathUtils.sinDeg(yaw),distance*MathUtils.sinDeg(pitch),distance*MathUtils.cosDeg(pitch)*MathUtils.cosDeg(yaw));
        if(camera.position.y<config.minHeight)camera.position.y=config.minHeight;
        camera.up.set(Vector3.Y);camera.lookAt(target);camera.update();
        return target.dst2(goalTarget)>1e-4f||Math.abs(goalDistance-distance)>.01f||Math.abs(goalPitch-pitch)>.05f||Math.abs(dy)>.05f;
    }
}
