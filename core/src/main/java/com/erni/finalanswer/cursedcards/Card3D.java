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
    final java.util.ArrayDeque<CardMotion> queue=new java.util.ArrayDeque<>();
    private final Material front;

    Card3D(int id,Model shared,CardFaces faces,CardValue value){
        this.id=id;instance=new ModelInstance(shared);front=instance.getMaterial(CardGeometry.FRONT);
        instance.getMaterial(CardGeometry.BACK).set(PBRTextureAttribute.createBaseColorTexture(faces.back));
        setValue(faces,value);
    }
    public void setValue(CardFaces faces,CardValue value){this.value=value;front.set(PBRTextureAttribute.createBaseColorTexture(faces.front(value)));}
    public boolean busy(){return !queue.isEmpty();}
    void sync(){pose.apply(instance.transform);}
}
