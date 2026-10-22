package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.math.Affine2;

/** Small, reusable 2D parent/pivot hierarchy. Bind pivots are immutable; pose fields are temporary. */
final class CursedSpriteSkeleton {
    static final class Bone {
        final Affine2 world=new Affine2();
        final float pivotX,pivotY;
        final int parent,order;
        float x,y,rotation,scaleX=1,scaleY=1,opacity=1,worldOpacity=1;
        private boolean ready;
        Bone(float px,float py,int parent,int order){pivotX=px;pivotY=py;this.parent=parent;this.order=order;}
    }
    final Bone[] bones=new Bone[8];
    CursedSpriteSkeleton(CursedSurvivorAssets.Profile profile,float width,float height){
        for(int i=0;i<8;i++){
            int parent=profile.parents[i];if(parent>=i||parent< -1)throw new IllegalArgumentException("Survivor bones must be parent-first");
            bones[i]=new Bone(profile.pivots[i*2]*width,profile.pivots[i*2+1]*height,parent,profile.order[i]);
        }
        update();
    }
    void update(){
        for(Bone b:bones)b.ready=false;
        for(Bone b:bones)world(b);
    }
    private void world(Bone b){
        if(b.ready)return;
        if(b.parent<0){b.world.idt().translate(b.pivotX+b.x,b.pivotY+b.y);b.worldOpacity=b.opacity;}
        else{Bone p=bones[b.parent];world(p);b.world.set(p.world).translate(b.pivotX-p.pivotX+b.x,b.pivotY-p.pivotY+b.y);b.worldOpacity=p.worldOpacity*b.opacity;}
        b.world.rotate(b.rotation).scale(b.scaleX,b.scaleY);b.ready=true;
    }
}
