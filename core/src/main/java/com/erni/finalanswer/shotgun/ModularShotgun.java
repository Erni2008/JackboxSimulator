package com.erni.finalanswer.shotgun;

import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.*;
import net.mgsx.gltf.scene3d.scene.Scene;

/** root * local animation translation * configured alignment * original glTF node transforms. */
public final class ModularShotgun implements RenderableProvider {
    public static final String[] PART_NAMES={"BODY","PUMP","BOLT","SHELL"};
    public final Matrix4 transform=new Matrix4();
    public final ShotgunAnimator animator;
    private final ShotgunConfig config;
    private final Scene[] parts=new Scene[4];
    private final boolean[] visible={true,true,true,true};
    private final Matrix4 local=new Matrix4();
    private final Vector3 offset=new Vector3(),ejectedStart=new Vector3(),ejectedVelocity=new Vector3(),ejectedPosition=new Vector3();
    private final Matrix4 pose=new Matrix4(),ejectedBase=new Matrix4();
    private final Scene ejected;
    private final com.badlogic.gdx.math.collision.BoundingBox shellLocalBounds=new com.badlogic.gdx.math.collision.BoundingBox(),shellWorldBounds=new com.badlogic.gdx.math.collision.BoundingBox();
    private long seenEjection;
    private float ejectionFloor=Float.NEGATIVE_INFINITY;
    private boolean shellLanded;
    private int inspection=-1;
    private final boolean preparedBody;
    private final Scene originalBody;
    public ModularShotgun(ShotgunAssets assets,ShotgunConfig config){
        this.config=config;animator=new ShotgunAnimator(config);
        for(int i=0;i<4;i++){var asset=assets.load(config.part(i).asset);if(asset!=null)parts[i]=new Scene(asset.scene);}
        ejected=parts[3]==null?null:new Scene(parts[3].modelInstance.model);
        if(ejected!=null)ejected.modelInstance.calculateBoundingBox(shellLocalBounds);
        if(ejected!=null)for(var material:ejected.modelInstance.materials)material.set(new com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA,1));
        originalBody=parts[0];var prepared=assets.preparedBody(config);preparedBody=prepared!=null;
        if(preparedBody)parts[0]=new Scene(prepared);
        update(0);
    }
    public boolean fire(){return complete()&&mechanismReady()&&animator.fire();}
    public boolean cycle(){return mechanismReady()&&animator.playPumpAnimation();}
    public boolean reload(){return complete()&&mechanismReady()&&animator.playReloadAnimation();}
    public boolean readyToFire(){return complete()&&mechanismReady()&&!animator.isAnimating()&&animator.bolt()==0&&animator.chamber()==ShotgunAnimator.Chamber.LIVE;}
    public Vector3 barrelDirection(Vector3 out){return out.set(Vector3.X).rot(pose).nor();}
    public Vector3 muzzle(Vector3 out){return out.set(config.muzzle).mul(pose);}
    public ModelInstance ejectedShell(){return ejected==null?null:ejected.modelInstance;}
    /** Read-only contact query on the same transformed bounds used by the rendered, ballistic shell.
     * A shell that has already faded out cannot produce a fictitious landing event. */
    public boolean visibleShellTouchesFloor(float worldFloorY){
        if(ejected==null||!Float.isFinite(worldFloorY)||!animator.ejecting()||ejectedStart.y<=worldFloorY)return false;
        return shellLanded||shellWorldBounds.set(shellLocalBounds).mul(ejected.modelInstance.transform).min.y<=worldFloorY;
    }
    /** Optional scene floor; the existing ejected model settles on its actual transformed bounds. */
    public void ejectionFloor(float y){ejectionFloor=y;}
    public void ejectionGravity(float gravity){if(!Float.isFinite(gravity)||gravity<=0)throw new IllegalArgumentException("Invalid shell gravity");config.ejectionGravity=gravity;}
    public void ejectionLifetime(float seconds){if(!Float.isFinite(seconds)||seconds<=0)throw new IllegalArgumentException("Invalid shell lifetime");config.ejectionLifetime=seconds;}
    public boolean bodyPrepared(){return preparedBody;}
    public ModelInstance model(int part){var scene=part==0&&inspection==0?originalBody:parts[part];return scene==null?null:scene.modelInstance;}
    public void visible(int part,boolean value){visible[part]=value;}
    public boolean visible(int part){return visible[part];}
    /** Inspection may show one original part, without overlaying it on the merged body. */
    public void inspection(int part){if(part< -1||part>3)throw new IllegalArgumentException("Part -1..3");inspection=part;}
    public boolean blocked(int part){
        boolean bodyShown=parts[0]!=null&&visible[0]&&config.body.visible;
        return inspection<0&&!preparedBody&&bodyShown&&(part==1&&config.bodyHasFixedPump||part==2&&config.bodyHasClosedPort);
    }
    public boolean mechanismReady(){return !blocked(1)&&!blocked(2)&&parts[0]!=null&&parts[1]!=null&&parts[2]!=null;}
    public boolean rendered(int part){
        if(parts[part]==null||!visible[part]||!config.part(part).visible||blocked(part)||inspection>=0&&inspection!=part)return false;
        return part!=3||animator.shellState()==ShotgunAnimator.ShellState.VISIBLE||animator.shellState()==ShotgunAnimator.ShellState.MOVING;
    }
    public boolean complete(){for(Scene scene:parts)if(scene==null)return false;return true;}
    public void update(float delta){
        animator.update(delta);
        float recoil=animator.recoil();offset.set(config.pumpDirection).nor().scl(config.recoilTravel*recoil);
        pose.set(transform).translate(config.recoilPivot[0],config.recoilPivot[1],config.recoilPivot[2]).translate(offset)
                .rotate(Vector3.Z,config.recoilAngle*recoil).translate(-config.recoilPivot[0],-config.recoilPivot[1],-config.recoilPivot[2]);
        for(int i=0;i<4;i++){
            if(parts[i]==null)continue;
            offset.setZero();
            if(i==1)offset.set(config.pumpDirection).nor().scl(config.pumpTravel*animator.pump());
            if(i==2)offset.set(config.boltDirection).nor().scl(config.boltTravel*animator.bolt());
            if(i==3)offset.set(config.shellStart).lerp(shellEnd(),animator.shellProgress());
            config.part(i).transform(local,i==3?config.shellScale:1);
            parts[i].modelInstance.transform.set(pose).translate(offset).mul(local);
            if(i==0&&originalBody!=null&&preparedBody)originalBody.modelInstance.transform.set(parts[0].modelInstance.transform);
        }
        if(ejected!=null&&seenEjection!=animator.ejectionSerial()){
            seenEjection=animator.ejectionSerial();shellLanded=false;
            var shell=config.shell;
            ejectedBase.set(pose).translate(config.ejectionSocket[0]+shell.position[0],config.ejectionSocket[1]+shell.position[1],config.ejectionSocket[2]+shell.position[2])
                .rotate(Vector3.Z,shell.rotation[2]).rotate(Vector3.Y,shell.rotation[1]).rotate(Vector3.X,shell.rotation[0]);
            ejectedBase.getTranslation(ejectedStart);ejectedVelocity.set(config.ejectionVelocity).rot(pose);
        }
        if(ejected!=null&&animator.ejecting()){
            float t=animator.ejectionAge();
            float opacity=MathUtils.clamp((config.ejectionLifetime-t)/.18f,0,1);
            for(var material:ejected.modelInstance.materials)material.get(com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute.class,com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute.Type).opacity=opacity;
            if(!shellLanded){
                ejectedPosition.set(ejectedStart).mulAdd(ejectedVelocity,t);ejectedPosition.y-=.5f*config.ejectionGravity*t*t;
                ejected.modelInstance.transform.set(ejectedBase).rotate(Vector3.X,config.ejectionSpin[0]*t)
                    .setTranslation(ejectedPosition).rotate(Vector3.Y,config.ejectionSpin[1]*t).rotate(Vector3.Z,config.ejectionSpin[2]*t)
                    .scale(config.shell.scale[0]*config.shellScale,config.shell.scale[1]*config.shellScale,config.shell.scale[2]*config.shellScale)
                    .translate(-config.shell.anchor[0],-config.shell.anchor[1],-config.shell.anchor[2]);
                if(Float.isFinite(ejectionFloor)&&ejectedStart.y>ejectionFloor){
                    float bottom=shellWorldBounds.set(shellLocalBounds).mul(ejected.modelInstance.transform).min.y;
                    if(bottom<=ejectionFloor){ejected.modelInstance.transform.getTranslation(ejectedPosition);ejectedPosition.y+=ejectionFloor-bottom;ejected.modelInstance.transform.setTranslation(ejectedPosition);shellLanded=true;}
                }
            }
        }
    }
    private final Vector3 end=new Vector3();
    private Vector3 shellEnd(){return end.set(config.shellEnd);}
    @Override public void getRenderables(Array<Renderable> out,Pool<Renderable> pool){
        for(int i=0;i<4;i++)if(rendered(i)){if(i==0&&inspection==0)originalBody.getRenderables(out,pool);else parts[i].getRenderables(out,pool);}
        if(ejected!=null&&inspection<0&&visible[3]&&animator.ejecting())ejected.getRenderables(out,pool);
    }
}
