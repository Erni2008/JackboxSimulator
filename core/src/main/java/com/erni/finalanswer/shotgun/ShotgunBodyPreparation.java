package com.erni.finalanswer.shotgun;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.model.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.FloatArray;
import java.util.*;

/** Reversible, source-specific preparation. Original meshes/textures are never edited.
 * Clips polygon surfaces exactly at authored boundaries, interpolating every vertex attribute.
 * Only the port interior is removed. Guide surfaces retain geometry and borrow BOLT's metal maps. */
final class ShotgunBodyPreparation {
    private final ShotgunConfig.Preparation config;
    private final FloatArray retained=new FloatArray(),guide=new FloatArray();
    private final VertexAttributes attributes;
    private final int stride,position,normal,tangent,binormal;
    private double sourceArea,removedArea,retainedArea,guideArea;
    private final Vector3 a=new Vector3(),b=new Vector3(),c=new Vector3();
    private ShotgunBodyPreparation(VertexAttributes attributes,ShotgunConfig.Preparation config){
        this.attributes=attributes;this.config=config;stride=attributes.vertexSize/4;
        position=offset(VertexAttributes.Usage.Position);normal=offset(VertexAttributes.Usage.Normal);
        tangent=offset(VertexAttributes.Usage.Tangent);binormal=offset(VertexAttributes.Usage.BiNormal);
        if(position<0||offset(VertexAttributes.Usage.BoneWeight)>=0)throw new IllegalArgumentException("Preparation requires rigid position geometry");
    }
    private int offset(int usage){var attribute=attributes.findByUsage(usage);return attribute==null?-1:attribute.offset/4;}
    static Model prepare(ModelInstance original,Material metal,ShotgunConfig.Preparation config){
        if(original.nodes.size!=1||original.nodes.first().parts.size!=1)throw new IllegalArgumentException("Unexpected BODY hierarchy; source-specific preparation refused");
        var node=original.nodes.first();var part=node.parts.first();
        if(part.meshPart.primitiveType!=GL20.GL_TRIANGLES)throw new IllegalArgumentException("BODY must contain triangles");
        var mesh=part.meshPart.mesh;var preparation=new ShotgunBodyPreparation(mesh.getVertexAttributes(),config);
        float[] vertices=new float[mesh.getNumVertices()*preparation.stride];mesh.getVertices(vertices);
        short[] indices=new short[mesh.getNumIndices()];if(indices.length>0)mesh.getIndices(indices);
        int start=part.meshPart.offset,count=part.meshPart.size;
        for(int i=start;i<start+count;i+=3){
            List<float[]> polygon=new ArrayList<>(3);
            for(int j=0;j<3;j++){
                int index=indices.length==0?i+j:indices[i+j]&0xffff;
                float[] vertex=Arrays.copyOfRange(vertices,index*preparation.stride,(index+1)*preparation.stride);
                preparation.transform(vertex,node.globalTransform);polygon.add(vertex);
            }
            preparation.sourceArea+=preparation.area(polygon);
            // Exact box subtraction keeps pieces outside the authored receiver window.
            preparation.partition(polygon,config.portMin,config.portMax,false);
        }
        if(preparation.removedArea<=.000001||preparation.guideArea<=.000001||
                preparation.removedArea>preparation.sourceArea*config.maxPortAreaFraction)
            throw new IllegalArgumentException("BODY preparation area safety check failed");
        if(Math.abs(preparation.sourceArea-preparation.removedArea-preparation.retainedArea-preparation.guideArea)>preparation.sourceArea*.0001)
            throw new IllegalArgumentException("BODY preparation lost unrelated surface area");
        Model model=new Model();
        try{
            Material bodyMaterial=part.material.copy();bodyMaterial.id="shotgun-body-retained";
            Material guideMaterial=metal.copy();guideMaterial.id="shotgun-metal-guide";
            preparation.add(model,"receiver-and-body",preparation.retained,bodyMaterial);
            preparation.add(model,"metal-magazine-guide",preparation.guide,guideMaterial);
            model.calculateTransforms();return model;
        }catch(RuntimeException error){model.dispose();throw error;}
    }
    private void transform(float[] vertex,Matrix4 transform){
        a.set(vertex[position],vertex[position+1],vertex[position+2]).mul(transform);
        put(vertex,position,a);
        Matrix3 normals=new Matrix3().set(transform).inv().transpose();
        for(int offset:new int[]{normal,tangent,binormal})if(offset>=0){a.set(vertex[offset],vertex[offset+1],vertex[offset+2]).mul(normals).nor();put(vertex,offset,a);}
    }
    private static void put(float[] vertex,int offset,Vector3 value){vertex[offset]=value.x;vertex[offset+1]=value.y;vertex[offset+2]=value.z;}
    /** Sequential half-space partition. Outside fragments cannot overlap or erase other surfaces. */
    private void partition(List<float[]> polygon,float[] min,float[] max,boolean guidePass){
        List<float[]> inside=polygon;
        for(int plane=0;plane<6&&!inside.isEmpty();plane++){
            int axis=plane/2;boolean lower=plane%2==0;float boundary=lower?min[axis]:max[axis];
            List<float[]> yes=new ArrayList<>(8),no=new ArrayList<>(8);
            for(int i=0;i<inside.size();i++){
                float[] previous=inside.get((i+inside.size()-1)%inside.size()),current=inside.get(i);
                float pd=(previous[position+axis]-boundary)*(lower?1:-1),cd=(current[position+axis]-boundary)*(lower?1:-1);
                boolean pi=pd>=0,ci=cd>=0;
                if(pi!=ci){float t=pd/(pd-cd);float[] intersection=new float[stride];for(int k=0;k<stride;k++)intersection[k]=previous[k]+(current[k]-previous[k])*t;yes.add(intersection);no.add(intersection);}
                (ci?yes:no).add(current);
            }
            if(no.size()>=3){if(guidePass)emit(no,retained,false);else partition(no,config.guideMin,config.guideMax,true);}
            inside=yes;
        }
        if(inside.size()>=3){if(guidePass)emit(inside,guide,true);else removedArea+=area(inside);}
    }
    private double area(List<float[]> polygon){
        double area=0;float[] first=polygon.get(0);
        for(int i=1;i+1<polygon.size();i++){
            float[] second=polygon.get(i),third=polygon.get(i+1);
            a.set(first[position],first[position+1],first[position+2]);
            b.set(second[position],second[position+1],second[position+2]).sub(a);
            c.set(third[position],third[position+1],third[position+2]).sub(a);area+=b.crs(c).len()*.5;
        }return area;
    }
    private void emit(List<float[]> polygon,FloatArray out,boolean metallic){
        double area=area(polygon);if(area<1e-12)return;
        if(metallic)guideArea+=area;else retainedArea+=area;
        for(int i=1;i+1<polygon.size();i++){out.addAll(polygon.get(0));out.addAll(polygon.get(i));out.addAll(polygon.get(i+1));}
    }
    private void add(Model model,String id,FloatArray vertices,Material material){
        if(vertices.size==0)return;
        Mesh mesh=new Mesh(true,vertices.size/stride,0,attributes);model.manageDisposable(mesh);model.meshes.add(mesh);
        mesh.setVertices(vertices.items,0,vertices.size);
        MeshPart part=new MeshPart(id,mesh,0,vertices.size/stride,GL20.GL_TRIANGLES);part.update();
        Node node=new Node();node.id=id;node.parts.add(new NodePart(part,material));
        model.nodes.add(node);model.meshParts.add(part);model.materials.add(material);
    }
}
