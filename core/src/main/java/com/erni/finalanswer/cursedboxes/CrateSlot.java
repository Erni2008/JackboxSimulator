package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;

/** Row-major IDs, top left = 0. Every instance borrows the same three model resources. */
public final class CrateSlot {
    public enum State { INTACT, DAMAGED, DESTROYED }
    public final int id;
    public final Vector3 position=new Vector3();
    public final BoundingBox pickBounds=new BoundingBox();
    public CursedCharacterType character;
    public String occupantNickname;
    /** Developer inspection only; does not change state, collision, turn rules or original meshes. */
    public boolean previewHidden;
    public boolean selected,hovered;
    public State state=State.INTACT;
    public final ModelInstance[] models=new ModelInstance[3];
    private final Matrix4[] normalized=new Matrix4[3];
    public CrateSlot(int id,CursedBoxesAssets assets,int ghostSlot){
        this.id=id;
        position.set((id%4-1.5f)*2.08f,(1.5f-id/4)*1.52f,0);
        for(int i=0;i<3;i++){models[i]=CursedBoxesAssets.fit(assets.crates[i],1.82f,1.17f,.72f);normalized[i]=new Matrix4(models[i].transform);}
        pickBounds.set(new Vector3(position).add(-.94f,-.62f,-.4f),new Vector3(position).add(.94f,.62f,.42f));update(0,0);
    }
    public void place(Vector3 origin){
        position.set((id%4-1.5f)*2.08f+origin.x,(1.5f-id/4)*1.52f+origin.y,origin.z);
        pickBounds.min.set(position.x-.94f,position.y-.62f,position.z-.4f);pickBounds.max.set(position.x+.94f,position.y+.62f,position.z+.42f);pickBounds.update();
        update(0,0);
    }
    public boolean impact(){if(state==State.DESTROYED)return false;state=State.DESTROYED;return true;}
    public void reset(){state=State.INTACT;update(0,0); }
    /** Placement only; targeting and hits never animate a crate transform. */
    public void update(float delta,float time){for(int i=0;i<3;i++)models[i].transform.idt().translate(position).mul(normalized[i]);}
    public ModelInstance model(){return models[state.ordinal()];}
}
