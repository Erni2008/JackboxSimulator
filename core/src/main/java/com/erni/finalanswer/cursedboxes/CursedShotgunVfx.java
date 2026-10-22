package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g3d.decals.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.shotgun.ModularShotgun;

/** Fixed-capacity presentation pool. All resources are prepared before gameplay. */
final class CursedShotgunVfx implements Disposable {
    enum State { INACTIVE, FLASHING, SMOKING, FINISHED }
    private State state=State.INACTIVE;
    private float age=2;
    private final Camera camera;
    private final CameraGroupStrategy strategy;
    private final DecalBatch batch;
    private final Texture flame=new Texture(Gdx.files.internal("cursed_boxes/effects/muzzle_flash.png"));
    private final Texture smoke=new Texture(Gdx.files.internal("cursed_boxes/effects/gun_smoke.png"));
    private final Decal flash;
    private final Decal[] puffs=new Decal[4],sparks=new Decal[5];
    private final Vector3[] origins=new Vector3[4];
    private final Vector3 start=new Vector3(),direction=new Vector3(),muzzle=new Vector3(),forward=new Vector3(),a=new Vector3(),b=new Vector3();
    CursedShotgunVfx(Camera camera,Texture soft){
        this.camera=camera;strategy=new CameraGroupStrategy(camera);batch=new DecalBatch(16,strategy);
        flame.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        smoke.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        flash=Decal.newDecal(1,1,new TextureRegion(flame),true);
        TextureRegion region=new TextureRegion(smoke),spark=new TextureRegion(soft);
        for(int i=0;i<puffs.length;i++){puffs[i]=Decal.newDecal(1,1,region,true);origins[i]=new Vector3();}
        for(int i=0;i<sparks.length;i++)sparks[i]=Decal.newDecal(.025f,.025f,spark,GL20.GL_SRC_ALPHA,GL20.GL_ONE);
    }
    void fire(ModularShotgun gun){
        age=0;state=State.FLASHING;gun.muzzle(start);gun.barrelDirection(direction);
        for(int i=0;i<origins.length;i++)origins[i].set(start).mulAdd(direction,.015f*i);
    }
    void update(float dt){
        if(state==State.INACTIVE||state==State.FINISHED)return;
        age+=Math.max(0,dt);state=age<.08f?State.FLASHING:age<1.65f?State.SMOKING:State.FINISHED;
    }
    void reset(){age=2;state=State.INACTIVE;}
    private float angle(Vector3 origin,Vector3 forward){
        camera.project(a.set(origin));camera.project(b.set(origin).mulAdd(forward,.2f));
        return MathUtils.atan2(b.y-a.y,b.x-a.x)*MathUtils.radiansToDegrees;
    }
    private void face(Decal decal,Vector3 position,float rotation){decal.setPosition(position);decal.lookAt(camera.position,camera.up);decal.rotateZ(rotation);}
    void render(ModularShotgun gun){
        if(state==State.INACTIVE||state==State.FINISHED)return;
        // Depth-test against the existing room/weapon, but never occlude later transparent layers.
        Gdx.gl.glEnable(GL20.GL_DEPTH_TEST);Gdx.gl.glDepthMask(false);
        if(state==State.FLASHING){
            gun.muzzle(muzzle);gun.barrelDirection(forward);float rotation=angle(muzzle,forward);
            float t=age/.08f,size=.55f+.28f*MathUtils.sin(t*MathUtils.PI*.5f);
            // Source flame starts at its left edge, about 60% down the image, not its center.
            face(flash,muzzle,rotation+(t-.5f)*5);
            a.set(camera.direction).crs(camera.up).nor().scl(MathUtils.cosDeg(rotation));
            b.set(camera.up).scl(MathUtils.sinDeg(rotation));a.add(b).scl(size*.47f);
            flash.setPosition(muzzle.x+a.x,muzzle.y+a.y+size*.065f,muzzle.z+a.z);
            flash.setDimensions(size,size*2/3);flash.setColor(1,1,1,1-t*t);batch.add(flash);
        }
        float rotation=angle(start,direction);
        for(int i=0;i<puffs.length;i++){
            float t=Math.max(0,age-i*.025f),life=1.2f+i*.15f;
            if(t>=life)continue;
            float k=t/life,size=.24f+t*(.40f+i*.02f);
            a.set(origins[i]).mulAdd(direction,t*(.16f+i*.035f));a.y+=t*(.13f+i*.025f);a.x+=MathUtils.sin(i*2.4f)*t*.07f;
            face(puffs[i],a,rotation+(i-1.5f)*9+t*(i%2==0?7:-7));
            puffs[i].setDimensions(size,size*2/3);puffs[i].setColor(.72f,.72f,.70f,(.36f+i*.025f)*(1-k)*(1-k));batch.add(puffs[i]);
        }
        if(age<.19f)for(int i=0;i<sparks.length;i++){
            a.set(start).mulAdd(direction,age*(.8f+i*.12f));a.y+=age*(.16f+i*.09f)-age*age*1.3f;a.x+=MathUtils.sin(i*4.1f)*age*.35f;
            face(sparks[i],a,0);sparks[i].setColor(1,.55f,.13f,(1-age/.19f)*.85f);batch.add(sparks[i]);
        }
        batch.flush();Gdx.gl.glDepthMask(true);Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    void warmup(){
        flash.setPosition(camera.position.x,camera.position.y,camera.position.z-1);flash.lookAt(camera.position,camera.up);flash.setColor(1,1,1,0);
        puffs[0].setPosition(flash.getPosition());puffs[0].lookAt(camera.position,camera.up);puffs[0].setColor(1,1,1,0);
        batch.add(flash);batch.add(puffs[0]);batch.flush();
    }
    @Override public void dispose(){reset();batch.dispose();strategy.dispose();flame.dispose();smoke.dispose();}
}
