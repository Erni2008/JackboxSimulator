package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.Renderable;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.*;

/** Compact indexed CPU geometry, with coarse triangle blocks to bound picking work.
 * Authored node transforms are baked into this cache, assembly transforms are not.
 */
final class TrianglePickMesh {
    private static final int BLOCK_INDICES = 768;
    private final float[] positions;
    private final short[] indices;
    private final int offset, count;
    private final BoundingBox[] blocks;
    private final Vector3 a = new Vector3(), b = new Vector3(), c = new Vector3(), point = new Vector3();
    TrianglePickMesh(Renderable renderable) {
        Mesh mesh = renderable.meshPart.mesh;
        int stride = mesh.getVertexSize()/4;
        int position = mesh.getVertexAttribute(VertexAttributes.Usage.Position).offset/4;
        float[] source = new float[mesh.getNumVertices()*stride]; mesh.getVertices(source);
        positions = new float[mesh.getNumVertices()*3];
        for(int v=0;v<mesh.getNumVertices();v++){
            a.set(source[v*stride+position], source[v*stride+position+1], source[v*stride+position+2]).mul(renderable.worldTransform);
            positions[v*3]=a.x;positions[v*3+1]=a.y;positions[v*3+2]=a.z;
        }
        indices = new short[mesh.getNumIndices()];if(indices.length>0)mesh.getIndices(indices);
        offset=renderable.meshPart.offset;count=renderable.meshPart.size;
        blocks = new BoundingBox[(count+BLOCK_INDICES-1)/BLOCK_INDICES];
        for(int block=0;block<blocks.length;block++){
            BoundingBox bounds=blocks[block]=new BoundingBox();
            for(int i=block*BLOCK_INDICES;i<Math.min(count,(block+1)*BLOCK_INDICES);i++)bounds.ext(vertex(i,a));
        }
    }
    private Vector3 vertex(int index,Vector3 output){
        int v=(indices.length==0?offset+index:indices[offset+index]&0xffff)*3;
        return output.set(positions[v],positions[v+1],positions[v+2]);
    }
    boolean hit(Ray ray,Vector3 output){
        float nearest=Float.POSITIVE_INFINITY;boolean found=false;
        for(int block=0;block<blocks.length;block++){
            if(!Intersector.intersectRayBoundsFast(ray,blocks[block]))continue;
            for(int i=block*BLOCK_INDICES;i+2<Math.min(count,(block+1)*BLOCK_INDICES);i+=3){
                if(Intersector.intersectRayTriangle(ray,vertex(i,a),vertex(i+1,b),vertex(i+2,c),point)){
                    float distance=point.dst2(ray.origin);
                    if(distance<nearest){nearest=distance;output.set(point);found=true;}
                }
            }
        }
        return found;
    }
}
