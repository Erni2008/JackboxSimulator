package com.erni.finalanswer.shotgun;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g3d.decals.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;

/** Short depth-tested muzzle flash. Procedural effect texture is created once, never character art. */
final class ShotgunEffects implements Disposable {
    private final Camera camera;
    private final CameraGroupStrategy strategy;
    private final DecalBatch batch;
    private final Texture texture;
    private final Decal core,ray;
    private final Vector3 muzzle=new Vector3(),screenA=new Vector3(),screenB=new Vector3();
    ShotgunEffects(Camera camera){
        this.camera=camera;strategy=new CameraGroupStrategy(camera);batch=new DecalBatch(8,strategy);
        Pixmap pixels=new Pixmap(64,64,Pixmap.Format.RGBA8888);
        try{
            for(int y=0;y<64;y++)for(int x=0;x<64;x++){
                float dx=(x-31.5f)/31.5f,dy=(y-31.5f)/31.5f,r2=dx*dx+dy*dy;
                float center=(float)Math.exp(-r2*24),glow=(float)Math.exp(-r2*6);
                float star=Math.max(0,1-Math.abs(dx*dy)*55)*(float)Math.exp(-r2*5);
                pixels.setColor(1,.48f+.52f*center,.12f+.88f*center,MathUtils.clamp((center+glow*.25f+star*.35f)*(1-r2),0,1));pixels.drawPixel(x,y);
            }
            texture=new Texture(pixels);texture.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        }finally{pixels.dispose();}
        TextureRegion region=new TextureRegion(texture);
        core=Decal.newDecal(.13f,.13f,region,GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        ray=Decal.newDecal(.23f,.035f,region,GL20.GL_SRC_ALPHA,GL20.GL_ONE);
    }
    void render(ModularShotgun gun){
        float intensity=gun.animator.flash();if(intensity<=0)return;
        gun.muzzle(muzzle);screenA.set(muzzle);camera.project(screenA);
        gun.barrelDirection(screenB).scl(.1f).add(muzzle);camera.project(screenB);
        float angle=MathUtils.atan2(screenB.y-screenA.y,screenB.x-screenA.x)*MathUtils.radiansToDegrees;
        gun.transform.getScale(screenB);float scale=Math.max(screenB.x,Math.max(screenB.y,screenB.z));
        core.setDimensions(.13f*scale,.13f*scale);ray.setDimensions(.23f*scale,.035f*scale);
        core.setPosition(muzzle);core.lookAt(camera.position,camera.up);core.rotateZ(angle+(gun.animator.shotSerial()%5-2)*9);
        ray.setPosition(muzzle);ray.lookAt(camera.position,camera.up);ray.rotateZ(angle);
        core.setColor(1,1,1,intensity);ray.setColor(1,.8f,.5f,intensity*.8f);
        batch.add(ray);batch.add(core);batch.flush();
        Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    @Override public void dispose(){batch.dispose();strategy.dispose();texture.dispose();}
}
