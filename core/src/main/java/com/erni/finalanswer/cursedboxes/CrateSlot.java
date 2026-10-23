package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;

/** Row-major IDs, top left = 0. Original damage models and split reveal models are shared; panel materials are per instance. */
public final class CrateSlot {
    public enum State { INTACT, DAMAGED, DESTROYED }
    public final int id;
    public final Vector3 position=new Vector3();
    public final BoundingBox pickBounds=new BoundingBox();
    public CursedCharacterType character;
    public String occupantNickname,occupantPlayerId;
    public boolean survivorOpening;
    public float survivorPanelOpacity=1;
    public final ModelInstance[] survivorModels=new ModelInstance[3];
    private final com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute[] panelBlends=new com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute[3];
    /** Developer inspection only; does not change state, collision, turn rules or original meshes. */
    public boolean previewHidden;
    public boolean selected,hovered;
    public State state=State.INTACT;
    public final ModelInstance[] models=new ModelInstance[3];
    private final Matrix4[] normalized=new Matrix4[3],survivorNormalized=new Matrix4[3];
    public CrateSlot(int id,CursedBoxesAssets assets,int ghostSlot){
        this.id=id;
        position.set((id%4-1.5f)*2.08f,(1.5f-id/4)*1.52f,0);
        for(int i=0;i<3;i++){models[i]=CursedBoxesAssets.fit(assets.crates[i],1.82f,1.17f,.72f);normalized[i]=new Matrix4(models[i].transform);
            survivorModels[i]=CursedBoxesAssets.fit(assets.survivors.boxes[i],1.82f,1.17f,.72f);
            survivorNormalized[i]=new Matrix4(survivorModels[i].transform);
            var panel=survivorModels[i].nodes.first().parts.get(1).material;
            panelBlends[i]=new com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute(com.badlogic.gdx.graphics.GL20.GL_SRC_ALPHA,com.badlogic.gdx.graphics.GL20.GL_ONE_MINUS_SRC_ALPHA,1);panel.set(panelBlends[i]);
            panel.set(new com.badlogic.gdx.graphics.g3d.attributes.DepthTestAttribute(com.badlogic.gdx.graphics.GL20.GL_LEQUAL,0,1,false));}
        pickBounds.set(new Vector3(position).add(-.94f,-.62f,-.4f),new Vector3(position).add(.94f,.62f,.42f));update(0,0);
    }
    public void place(Vector3 origin){
        position.set((id%4-1.5f)*2.08f+origin.x,(1.5f-id/4)*1.52f+origin.y,origin.z);
        pickBounds.min.set(position.x-.94f,position.y-.62f,position.z-.4f);pickBounds.max.set(position.x+.94f,position.y+.62f,position.z+.42f);pickBounds.update();
        update(0,0);
    }
    /** A reveal can only open further; only an explicit round reset restores the front. */
    public void revealPanel(float opacity){
        if(!Float.isFinite(opacity))return;
        survivorOpening=true;survivorPanelOpacity=Math.min(survivorPanelOpacity,MathUtils.clamp(opacity,0,1));
    }
    public boolean impact(){if(state==State.DESTROYED)return false;state=State.DESTROYED;return true;}
    public void reset(){survivorOpening=false;survivorPanelOpacity=1;state=State.INTACT;update(0,0); }
    /** Placement only; targeting and hits never animate a crate transform. */
    public void update(float delta,float time){for(int i=0;i<3;i++){
        models[i].transform.idt().translate(position).mul(normalized[i]);
        survivorModels[i].transform.set(survivorNormalized[i]).trn(position);
    }}
    public void renderParts(com.badlogic.gdx.utils.Array<com.badlogic.gdx.graphics.g3d.Renderable> out,com.badlogic.gdx.utils.Pool<com.badlogic.gdx.graphics.g3d.Renderable> pool,boolean front){
        if(!survivorOpening){if(!front)model().getRenderables(out,pool);return;}
        if(front&&survivorPanelOpacity<=0)return;
        int index=state.ordinal();var model=survivorModels[index];var parts=model.nodes.first().parts;
        panelBlends[index].opacity=survivorPanelOpacity;
        parts.get(0).enabled=!front;parts.get(1).enabled=front;
        model.getRenderables(out,pool);
        parts.get(0).enabled=parts.get(1).enabled=true;
    }
    public ModelInstance model(){return models[state.ordinal()];}
}
