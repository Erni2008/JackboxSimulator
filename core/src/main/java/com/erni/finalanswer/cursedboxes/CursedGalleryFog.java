package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g3d.decals.*;
import com.badlogic.gdx.math.*;

/** Pooled world-space floor mist. Borrows the already loaded shotgun smoke texture and decal batch. */
final class CursedGalleryFog {
    private final Decal[] wisps=new Decal[8];
    private final Vector3 position=new Vector3();
    private final CursedBoxesGalleryConfig config;
    CursedGalleryFog(Texture smoke,CursedBoxesGalleryConfig config){
        this.config=config;TextureRegion region=new TextureRegion(smoke);
        for(int i=0;i<wisps.length;i++)wisps[i]=Decal.newDecal(1,1,region,true);
    }
    void render(DecalBatch batch,Camera camera,Vector3 shelf,float time,boolean low){
        if(config.fogOpacity<=0)return;
        float floor=shelf.y+CursedBoxesShelf.RIGHT_FOOT_Y;
        for(int i=0,n=low?4:wisps.length;i<n;i++){
            float phase=time*config.fogSpeed*(.7f+i*.045f)+i*.173f;phase-=MathUtils.floor(phase);
            boolean edge=i>=6;
            float x=edge?(i==6?-5.9f:5.9f):(-7.4f+phase*14.8f);
            float y=floor+(edge?2.15f:.38f+(i%3)*.24f)+MathUtils.sin(time*.09f+i)*.14f;
            position.set(shelf.x+x,y,shelf.z+.75f+(i%3)*.65f);
            Decal mist=wisps[i];mist.setPosition(position);mist.lookAt(camera.position,camera.up);
            mist.rotateZ(MathUtils.sin(time*.035f+i)*7);
            float breathe=1+.10f*MathUtils.sin(time*.12f+i*1.7f);
            mist.setDimensions((edge?3.8f:6.1f)*breathe,(edge?3.1f:1.55f)*breathe);
            float fade=MathUtils.sin(phase*MathUtils.PI);fade*=fade;
            mist.setColor(.62f,.61f,.57f,config.fogOpacity*fade*(edge?.7f:1));batch.add(mist);
        }
    }
}
