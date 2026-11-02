package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.graphics.g3d.*;
import net.mgsx.gltf.scene3d.attributes.PBRTextureAttribute;

/** Runtime card: shares the single card mesh; owns only its material copies and pose. */
public final class Card3D {
    public final int id;
    public final ModelInstance instance;
    public final CardPose pose=new CardPose();
    public CardValue value;
    public boolean visible=true;
    /** 0..1 progress of a discard disappearance (presentation only). */
    public float vanish;
    final java.util.ArrayDeque<CardMotion> queue=new java.util.ArrayDeque<>();
    private final Material front;

    Card3D(int id,Model shared,CardFaces faces,CardValue value){
        this.id=id;instance=new ModelInstance(shared);front=instance.getMaterial(CardGeometry.FRONT);
        instance.getMaterial(CardGeometry.BACK).set(PBRTextureAttribute.createBaseColorTexture(faces.back));
        setValue(faces,value);
    }
    public void setValue(CardFaces faces,CardValue value){this.value=value;front.set(PBRTextureAttribute.createBaseColorTexture(faces.front(value)));}
    public boolean busy(){return !queue.isEmpty();}
    private com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute glowFront,glowBack;
    /** Supernatural emissive tint (pair burning, DEATH); 0 removes it so ordinary cards keep the plain shader. */
    public void glow(float r,float g,float b,float amount){
        if(amount<=0){if(glowFront!=null){front.remove(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.Emissive);instance.getMaterial(CardGeometry.BACK).remove(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.Emissive);glowFront=glowBack=null;}return;}
        if(glowFront==null){front.set(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.createEmissive(0,0,0,1));instance.getMaterial(CardGeometry.BACK).set(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.createEmissive(0,0,0,1));
            glowFront=(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute)front.get(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.Emissive);glowBack=(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute)instance.getMaterial(CardGeometry.BACK).get(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.Emissive);}
        glowFront.color.set(r*amount,g*amount,b*amount,1);glowBack.color.set(r*amount,g*amount,b*amount,1);
    }
    private com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute fadeFront,fadeBack;
    /** 1 = opaque (no blending cost); below 1 the card is drawn translucent (vanishing discards). */
    public void opacity(float a){
        if(a>=1){if(fadeFront!=null){front.remove(com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute.Type);instance.getMaterial(CardGeometry.BACK).remove(com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute.Type);fadeFront=fadeBack=null;}return;}
        if(fadeFront==null){fadeFront=new com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute(a);fadeBack=new com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute(a);front.set(fadeFront);instance.getMaterial(CardGeometry.BACK).set(fadeBack);}
        fadeFront.opacity=fadeBack.opacity=Math.max(0,a);
    }
    void sync(){pose.apply(instance.transform);}
}
