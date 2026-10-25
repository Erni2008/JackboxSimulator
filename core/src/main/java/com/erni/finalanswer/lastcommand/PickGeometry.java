package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.math.collision.*;
import com.badlogic.gdx.utils.*;

/** One indexed CPU picking cache per loaded GLB, shared by all its instances. */
final class PickGeometry {
    final BoundingBox bounds=new BoundingBox();
    private final Array<TrianglePickMesh> meshes=new Array<>();
    private final Vector3 hit=new Vector3();
    PickGeometry(ModelInstance source){
        source.calculateBoundingBox(bounds);
        Array<Renderable> renderables=new Array<>();
        source.getRenderables(renderables,new Pool<Renderable>(){protected Renderable newObject(){return new Renderable();}});
        for(Renderable r:renderables)if(r.meshPart.primitiveType==GL20.GL_TRIANGLES)meshes.add(new TrianglePickMesh(r));
    }
    boolean hit(Ray ray,Vector3 result){
        if(!com.badlogic.gdx.math.Intersector.intersectRayBoundsFast(ray,bounds))return false;
        float nearest=Float.POSITIVE_INFINITY;boolean found=false;
        for(TrianglePickMesh mesh:meshes)if(mesh.hit(ray,hit)){
            float distance=hit.dst2(ray.origin);
            if(distance<nearest){nearest=distance;result.set(hit);found=true;}
        }
        return found;
    }
    void clear(){meshes.clear();}
}
