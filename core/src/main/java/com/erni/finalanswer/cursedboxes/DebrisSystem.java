package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.decals.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.*;

/** Fixed pools: a complete blast uses 4 original 3D splinters, 7 sprite splinters, 2 clouds. */
public final class DebrisSystem implements RenderableProvider {
    private static final class Fragment {
        ModelInstance model;
        final Matrix4 base=new Matrix4();
        final Vector3 p=new Vector3(),v=new Vector3();
        float age=9,spin;
    }
    private static final class Particle {
        Decal sprite;
        final Vector3 p=new Vector3(),v=new Vector3();
        float age=9,lifetime,size,spin;
        int kind; // 0 splinter, 1 dust, 2 smoke
    }
    private final Fragment[] fragments=new Fragment[5];
    private final Particle[] small=new Particle[10],clouds=new Particle[5];
    private final CursedBoxesConfig config;
    private int cursor,smallCursor,cloudCursor;
    public boolean lowQuality;
    public DebrisSystem(CursedBoxesAssets assets,CursedBoxesConfig config){
        this.config=config;lowQuality=config.lowEffects;
        for(int i=0;i<fragments.length;i++){
            Fragment f=new Fragment();f.model=CursedBoxesAssets.fit(assets.splinters[i%2],.22f,.12f,.12f);f.base.set(f.model.transform);fragments[i]=f;
        }
        for(int i=0;i<small.length;i++)small[i]=particle(assets.debris[i%2]);
        for(int i=0;i<clouds.length;i++)clouds[i]=particle(assets.dust);
    }
    private Particle particle(com.badlogic.gdx.graphics.Texture texture){Particle p=new Particle();p.sprite=Decal.newDecal(1,1,new TextureRegion(texture),true);return p;}
    public void impact(Vector3 origin){spawnSmall(origin,2);}
    public void burst(Vector3 origin,boolean finalStage){
        int total=lowQuality?Math.min(3,config.largeFragments):config.largeFragments;
        int count=finalStage?total-total/2:total/2;
        for(int i=0;i<count;i++){
            Fragment f=fragments[cursor++%fragments.length];f.age=0;f.p.set(origin).add(0,0,.5f);
            f.v.set(MathUtils.random(-config.debrisSideSpeed,config.debrisSideSpeed),MathUtils.random(1.3f,3.7f),MathUtils.random(config.debrisForwardSpeed*.8f,config.debrisForwardSpeed*1.2f));f.spin=MathUtils.random(-340f,340f);
        }
        int smallTotal=lowQuality?Math.min(5,config.smallSplinters):config.smallSplinters;
        // Two initial impact sprites count toward the total.
        int remaining=Math.max(0,smallTotal-2);spawnSmall(origin,finalStage?remaining-remaining/2:remaining/2);
        int dustTotal=lowQuality?Math.min(1,config.dustClouds):config.dustClouds;
        int dustCount=finalStage?dustTotal-dustTotal/2:dustTotal/2;
        for(int i=0;i<dustCount;i++){
            Particle p=clouds[cloudCursor++%clouds.length];init(p,origin,1,.65f,.9f);
            p.v.set(MathUtils.random(-.55f,.55f),MathUtils.random(.2f,.4f),.45f);
        }
    }
    private void spawnSmall(Vector3 origin,int count){for(int i=0;i<count;i++){
        Particle p=small[smallCursor++%small.length];init(p,origin,0,.08f,.7f);
        p.v.set(MathUtils.random(-config.debrisSideSpeed*.75f,config.debrisSideSpeed*.75f),MathUtils.random(.6f,2.8f),MathUtils.random(config.debrisForwardSpeed*.35f,config.debrisForwardSpeed*.7f));p.spin=MathUtils.random(-380f,380f);
    }}
    public void smoke(Vector3 origin){Particle p=clouds[cloudCursor++%clouds.length];init(p,origin,2,.19f,.7f);p.v.set(.04f,.25f,.02f);}
    private void init(Particle p,Vector3 origin,int kind,float size,float lifetime){p.age=0;p.kind=kind;p.size=size;p.lifetime=lifetime;p.p.set(origin);if(kind!=2)p.p.z+=.5f;}
    public int activeDebris(){int n=0;for(Fragment f:fragments)if(f.age<.95f)n++;return n;}
    public int activeParticles(){int n=0;for(Particle p:small)if(p.age<p.lifetime)n++;for(Particle p:clouds)if(p.age<p.lifetime)n++;return n;}
    public void reset(){for(Fragment f:fragments)f.age=9;for(Particle p:small)p.age=9;for(Particle p:clouds)p.age=9;cursor=smallCursor=cloudCursor=0;}
    public void update(float dt){
        for(Fragment f:fragments)if(f.age<.95f){
            f.age+=dt;f.v.y-=4.8f*dt;f.p.mulAdd(f.v,dt);float scale=MathUtils.clamp((.95f-f.age)*7,0,1);
            f.model.transform.idt().translate(f.p).rotate(Vector3.X,f.spin*f.age).rotate(Vector3.Z,f.spin*.7f*f.age).scale(scale,scale,scale).mul(f.base);
        }
        updateParticles(small,dt);updateParticles(clouds,dt);
    }
    private void updateParticles(Particle[] particles,float dt){for(Particle p:particles)if(p.age<p.lifetime){p.age+=dt;if(p.kind==0)p.v.y-=3.4f*dt;p.p.mulAdd(p.v,dt);}}
    public void renderDust(DecalBatch batch,Camera camera){renderParticles(small,batch,camera);renderParticles(clouds,batch,camera);}
    private void renderParticles(Particle[] particles,DecalBatch batch,Camera camera){for(Particle p:particles)if(p.age<p.lifetime){
        float life=p.age/p.lifetime;p.sprite.setPosition(p.p);p.sprite.lookAt(camera.position,camera.up);
        p.sprite.setScale(p.size*(p.kind==0?1:1+life*2));if(p.kind==0)p.sprite.rotateZ(p.spin*p.age);
        p.sprite.setColor(p.kind==2?.6f:.5f,p.kind==2?.57f:.38f,p.kind==2?.53f:.26f,(1-life)*(p.kind==0?.85f:.38f));batch.add(p.sprite);
    }}
    @Override public void getRenderables(Array<Renderable> out,Pool<Renderable> pool){for(Fragment f:fragments)if(f.age<.95f)f.model.getRenderables(out,pool);}
}
