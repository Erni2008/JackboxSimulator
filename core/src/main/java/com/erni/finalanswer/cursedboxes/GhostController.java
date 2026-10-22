package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.Camera;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.g3d.decals.*;
import com.badlogic.gdx.math.MathUtils;

/** Transparent decals test opaque depth; their zero-alpha torso pixels never write depth. */
public final class GhostController {
    // Keeps the enlarged silhouette inside the compartment even at the extremes of the idle pose.
    private static final float CENTER_Y=-.012f,HOVER=.006f,ROLL=.6f,BREATH=.008f;
    private final Decal[] frames=new Decal[3];
    private float reaction;
    private boolean wounded;
    public GhostController(CursedBoxesAssets assets,float height){
        for(int i=0;i<3;i++){
            var t=assets.ghosts[i];float width=height*t.getWidth()/t.getHeight();
            float angle=ROLL*MathUtils.degreesToRadians;
            float envelope=(height*MathUtils.cos(angle)+width*MathUtils.sin(angle))*(1+BREATH)+2*(HOVER+Math.abs(CENTER_Y));
            if(envelope>1.24f||width*(1+BREATH)>1.8f)throw new IllegalArgumentException("Ghost height exceeds compartment clearance: "+height);
            frames[i]=Decal.newDecal(width,height,new TextureRegion(t),true);
        }
    }
    public void hit(){reaction=.22f;}
    public void damage(){reaction=0;wounded=true;}
    public void reset(){reaction=0;wounded=false;}
    public boolean wounded(){return wounded;}
    public void update(float delta){reaction=Math.max(0,reaction-delta);}
    public void render(DecalBatch batch,Camera camera,CrateSlot slot,float time){
        // Always submit behind the front: intact wood occludes through the actual depth buffer.
        int base=wounded?2:0;float mix=MathUtils.clamp(reaction/.12f,0,1);
        draw(frames[base],batch,camera,slot,time,1-mix);
        if(mix>0)draw(frames[1],batch,camera,slot,time,mix);
    }
    private void draw(Decal frame,DecalBatch batch,Camera camera,CrateSlot slot,float time,float alpha){
        if(alpha<=0)return;
        frame.setPosition(slot.position.x+MathUtils.sin(time*61)*reaction*.025f,slot.position.y+CENTER_Y+MathUtils.sin(time*1.7f)*HOVER,slot.position.z+.09f-reaction*.08f);
        frame.lookAt(camera.position,camera.up);frame.rotateZ(MathUtils.sin(time*1.1f)*ROLL);
        frame.setScale(1+MathUtils.sin(time*1.8f)*BREATH-reaction*.06f);frame.setColor(.92f,.88f,.8f,alpha);batch.add(frame);
    }
}
