package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.erni.finalanswer.shotgun.*;
import com.badlogic.gdx.utils.Disposable;

/** Table placement/pickup is a parent transform; original weapon mechanics remain independent. */
public final class ShotgunController implements Disposable {
    public enum State { RESTING, PICKUP, AIMING, READY, RETURNING }
    public final ModularShotgun gun;
    private final ShotgunAudio audio;
    private final CursedBoxesGalleryConfig gallery;
    private final Vector3 origin=new Vector3(),direction=new Vector3(),offset=new Vector3(),muzzle=new Vector3(),barrel=new Vector3();
    private final Vector3 rest=new Vector3(),held=new Vector3(2.15f,-1.35f,5.2f),transitionStart=new Vector3(),shadow=new Vector3();
    private final Vector3 scale=new Vector3();
    private final Quaternion aim=new Quaternion(),desired=new Quaternion(),restAim=new Quaternion(),transitionAim=new Quaternion();
    private final float muzzleY,restBottom,pumpAt;
    private float shotAge=9,stateAge;
    private boolean cycling;
    private int targetId=-1;
    private State state=State.RESTING;
    public ShotgunController(CursedBoxesAssets assets,CursedBoxesConfig scene,CursedBoxesGalleryConfig gallery){
        this.gallery=gallery;scale.set(gallery.weaponScale,gallery.weaponScale,gallery.weaponScale);
        ShotgunConfig config=assets.weaponConfig;config.startLoaded=true;config.pumpDuration=.45f;config.fireDuration=.44f;config.flashDuration=.08f;config.recoilTravel=.055f;config.recoilAngle=4.2f;pumpAt=scene.pumpAt;
        muzzleY=config.muzzle[1];gun=new ModularShotgun(assets.models,config);if(!gun.complete()||!gun.mechanismReady())throw new IllegalStateException("Existing modular shotgun unavailable: "+assets.models.failures());
        audio=new ShotgunAudio(config);
        // Barrel is local +X. Lay the receiver on its side on a horizontal virtual plane.
        restAim.set(Vector3.Y,gallery.restYaw).mul(new Quaternion(Vector3.X,90));
        gun.transform.set(Vector3.Zero,restAim,scale);gun.update(0);
        BoundingBox bounds=new BoundingBox(),part=new BoundingBox();
        for(int i=0;i<3;i++){gun.model(i).calculateBoundingBox(part);part.mul(gun.model(i).transform);bounds.ext(part);}
        restBottom=bounds.min.y;
        reset();
    }
    public State state(){return state;}
    public boolean resting(){return state==State.RESTING;}
    public boolean returning(){return state==State.RETURNING;}
    public float contactOpacity(){
        if(state==State.RESTING)return 1;
        if(state==State.PICKUP)return MathUtils.clamp(1-stateAge/(gallery.pickupDuration*.35f),0,1);
        if(state==State.RETURNING)return ease((stateAge/gallery.returnDuration-.75f)*4);
        return 0;
    }
    public Vector3 shadowPosition(Vector3 out){return out.set(shadow);}
    public float restYaw(){return gallery.restYaw;}
    public void prepareWarmup(CrateSlot target){select(target);update(gallery.pickupDuration,target);update(gallery.aimDuration,target);}
    public void placeTable(Vector3 anchor){
        rest.set(anchor);rest.y-=restBottom;shadow.set(anchor);shadow.y+=.008f;
        if(resting()){origin.set(rest);aim.set(restAim);gun.transform.set(origin,aim,scale);gun.update(0);}
    }
    public void select(CrateSlot target){
        if(state==State.RETURNING)return;
        if(state==State.RESTING){transitionStart.set(origin);transitionAim.set(aim);state=State.PICKUP;stateAge=0;}
        else if(state!=State.PICKUP&&targetId!=target.id){transitionAim.set(aim);state=State.AIMING;stateAge=0;}
        targetId=target.id;
    }
    public void returnToTable(){if(state==State.RESTING||state==State.RETURNING)return;transitionStart.set(origin);transitionAim.set(aim);state=State.RETURNING;stateAge=0;targetId=-1;}
    public boolean aimedAt(CrateSlot target){
        if(state!=State.READY)return false;
        gun.muzzle(muzzle);gun.barrelDirection(barrel);direction.set(target.position).sub(muzzle).nor();return barrel.dot(direction)>.9997f;
    }
    public boolean fire(){if(state!=State.READY||!gun.readyToFire())return false;if(gun.fire()){cycling=false;shotAge=0;audio.update(gun.animator);return true;}return false;}
    public void reset(){gun.animator.resetShotgun();audio.stop();cycling=false;shotAge=9;stateAge=0;state=State.RESTING;targetId=-1;origin.set(rest);aim.set(restAim);gun.transform.set(origin,aim,scale);gun.update(0);}
    public void warmupAudio(boolean loading){if(loading){audio.warmup();audio.muted(true);}else audio.muted(false);}
    private static float ease(float t){t=MathUtils.clamp(t,0,1);return t*t*t*(t*(t*6-15)+10);}
    public void update(float dt,CrateSlot target){
        shotAge+=dt;stateAge+=dt;
        if(state==State.RETURNING){
            float t=MathUtils.clamp(stateAge/gallery.returnDuration,0,1),e=ease(t);
            origin.set(transitionStart).lerp(rest,e);origin.y+=MathUtils.sin(t*MathUtils.PI)*.25f;aim.set(transitionAim).slerp(restAim,e);
            if(t>=1){state=State.RESTING;origin.set(rest);aim.set(restAim);}
        }else if(state==State.RESTING){origin.set(rest);aim.set(restAim);}
        else{
            float t=state==State.PICKUP?MathUtils.clamp(stateAge/gallery.pickupDuration,0,1):1;
            origin.set(transitionStart).lerp(held,ease(t));if(state==State.PICKUP)origin.y+=MathUtils.sin(t*MathUtils.PI)*.36f;else origin.set(held);
            direction.set(target.position).sub(origin).nor();desired.setFromCross(Vector3.X,direction);
            // Solve the bore line including the authored muzzle offset. Reuses all temporary vectors.
            for(int i=0;i<5;i++){offset.set(0,muzzleY*scale.y,0);desired.transform(offset);direction.set(target.position).sub(origin).sub(offset).nor();desired.setFromCross(Vector3.X,direction);}
            if(state==State.PICKUP){aim.set(transitionAim).slerp(desired,ease(t));if(t>=1){state=State.AIMING;stateAge=0;transitionAim.set(aim);}}
            else if(state==State.AIMING){float e=ease(stateAge/gallery.aimDuration);aim.set(transitionAim).slerp(desired,e);if(stateAge>=gallery.aimDuration)state=State.READY;}
            else aim.slerp(desired,1-(float)Math.exp(-dt*12));
        }
        gun.transform.set(origin,aim,scale);gun.update(dt);audio.update(gun.animator);
        if(shotAge>=pumpAt&&gun.animator.chamber()==ShotgunAnimator.Chamber.SPENT&&!gun.animator.isAnimating()&&!cycling){gun.cycle();cycling=true;}
        if(cycling&&!gun.animator.isAnimating()&&gun.animator.chamber()==ShotgunAnimator.Chamber.EMPTY){gun.animator.chamber(ShotgunAnimator.Chamber.LIVE);cycling=false;}
    }
    @Override public void dispose(){audio.dispose();}
}
