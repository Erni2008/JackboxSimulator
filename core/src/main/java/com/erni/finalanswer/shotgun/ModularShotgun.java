package com.erni.finalanswer.shotgun;

import com.badlogic.gdx.graphics.g3d.*;
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
    private final Vector3 offset=new Vector3();
    private int inspection=-1;
    public ModularShotgun(ShotgunAssets assets,ShotgunConfig config){
        this.config=config;animator=new ShotgunAnimator(config);
        for(int i=0;i<4;i++){var asset=assets.load(config.part(i).asset);if(asset!=null)parts[i]=new Scene(asset.scene);}
        update(0);
    }
    public ModelInstance model(int part){return parts[part]==null?null:parts[part].modelInstance;}
    public void visible(int part,boolean value){visible[part]=value;}
    public boolean visible(int part){return visible[part];}
    /** Inspection may show one original part, without overlaying it on the merged body. */
    public void inspection(int part){if(part< -1||part>3)throw new IllegalArgumentException("Part -1..3");inspection=part;}
    public boolean blocked(int part){
        boolean bodyShown=parts[0]!=null&&visible[0]&&config.body.visible;
        return inspection<0&&bodyShown&&(part==1&&config.bodyHasFixedPump||part==2&&config.bodyHasClosedPort);
    }
    public boolean mechanismReady(){return !blocked(1)&&!blocked(2)&&parts[1]!=null&&parts[2]!=null;}
    public boolean rendered(int part){
        if(parts[part]==null||!visible[part]||!config.part(part).visible||blocked(part)||inspection>=0&&inspection!=part)return false;
        return part!=3||animator.shellState()==ShotgunAnimator.ShellState.VISIBLE||animator.shellState()==ShotgunAnimator.ShellState.MOVING;
    }
    public boolean complete(){for(Scene scene:parts)if(scene==null)return false;return true;}
    public void update(float delta){
        animator.update(delta);
        for(int i=0;i<4;i++){
            if(parts[i]==null)continue;
            offset.setZero();
            if(i==1)offset.set(config.pumpDirection).nor().scl(config.pumpTravel*animator.pump());
            if(i==2)offset.set(config.boltDirection).nor().scl(config.boltTravel*animator.bolt());
            if(i==3)offset.set(config.shellStart).lerp(shellEnd(),animator.shellProgress());
            config.part(i).transform(local,i==3?config.shellScale:1);
            parts[i].modelInstance.transform.set(transform).translate(offset).mul(local);
        }
    }
    private final Vector3 end=new Vector3();
    private Vector3 shellEnd(){return end.set(config.shellEnd);}
    @Override public void getRenderables(Array<Renderable> out,Pool<Renderable> pool){
        for(int i=0;i<4;i++)if(rendered(i))parts[i].getRenderables(out,pool);
    }
}
