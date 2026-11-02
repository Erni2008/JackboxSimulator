package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.math.MathUtils;

/**
 * One shared procedural card mesh: rounded rectangle; a front part (+Y) and one back part (-Y) that also covers the edge
 * (edge UVs sample the back art's outer border), so a card costs two draw calls.
 * Card lies in the XZ plane, width along X, height along Z (printed top at -Z), centred at the origin. Back UVs are mirrored
 * so both printed sides read correctly; corner pixels outside the rounded outline are never sampled.
 */
public final class CardGeometry {
    public static final String FRONT="front",BACK="back";
    /** Point on the back art's cream outer border used for the whole edge. */
    static final float EDGE_U=.012f,EDGE_V=.5f;
    private CardGeometry(){}

    public static Model build(float width,float height,float thickness,float cornerRadius,int cornerSegments){
        int ring=4*(cornerSegments+1);
        float[] ox=new float[ring],oz=new float[ring],nx=new float[ring],nz=new float[ring];
        float r=Math.min(cornerRadius,Math.min(width,height)*.5f),hx=width*.5f-r,hz=height*.5f-r;
        float[][] centres={{hx,hz},{-hx,hz},{-hx,-hz},{hx,-hz}};
        for(int c=0,i=0;c<4;c++)for(int s=0;s<=cornerSegments;s++,i++){
            float a=(c+s/(float)cornerSegments)*MathUtils.HALF_PI,cx=MathUtils.cos(a),cz=MathUtils.sin(a);
            ox[i]=centres[c][0]+cx*r;oz[i]=centres[c][1]+cz*r;nx[i]=cx;nz[i]=cz;
        }
        // Layout: front fan (1+ring), back fan (1+ring), edge strip (2*(ring+1)). 8 floats: pos, normal, uv.
        int frontVerts=1+ring,edgeVerts=2*(ring+1),total=2*frontVerts+edgeVerts;
        float[] v=new float[total*8];int k=0;float y=thickness*.5f;
        for(int side=0;side<2;side++){float sy=side==0?y:-y,ny=side==0?1:-1;
            k=put(v,k,0,sy,0,0,ny,0,.5f,.5f);
            for(int i=0;i<ring;i++){float u=ox[i]/width+.5f;k=put(v,k,ox[i],sy,oz[i],0,ny,0,side==0?u:1-u,.5f+oz[i]/height);}
        }
        for(int i=0;i<=ring;i++){int j=i%ring;float u=i/(float)ring;
            k=put(v,k,ox[j],y,oz[j],nx[j],0,nz[j],EDGE_U,EDGE_V);k=put(v,k,ox[j],-y,oz[j],nx[j],0,nz[j],EDGE_U,EDGE_V);}
        short[] idx=new short[ring*3*2+ring*6];int n=0;
        for(int i=0;i<ring;i++){int a=1+i,b=1+(i+1)%ring;idx[n++]=0;idx[n++]=(short)a;idx[n++]=(short)b;}
        for(int i=0;i<ring;i++){int o=frontVerts,a=o+1+i,b=o+1+(i+1)%ring;idx[n++]=(short)o;idx[n++]=(short)b;idx[n++]=(short)a;}
        int frontCount=ring*3,edgeStart=2*frontVerts;
        for(int i=0;i<ring;i++){int t0=edgeStart+2*i,b0=t0+1,t1=t0+2,b1=t0+3;
            idx[n++]=(short)t0;idx[n++]=(short)b1;idx[n++]=(short)b0;idx[n++]=(short)t0;idx[n++]=(short)t1;idx[n++]=(short)b1;}
        // Fans were emitted clockwise; swap to counter-clockwise. The edge strip already faces outward.
        for(int i=0;i<frontCount;i+=3){short t=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=t;}
        for(int i=frontCount;i<2*frontCount;i+=3){short t=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=t;}
        Mesh mesh=new Mesh(true,total,idx.length,VertexAttribute.Position(),VertexAttribute.Normal(),VertexAttribute.TexCoords(0));
        mesh.setVertices(v);mesh.setIndices(idx);
        ModelBuilder builder=new ModelBuilder();builder.begin();
        builder.part(FRONT,mesh,GL20.GL_TRIANGLES,0,frontCount,new Material(FRONT));
        builder.part(BACK,mesh,GL20.GL_TRIANGLES,frontCount,frontCount+ring*6,new Material(BACK));
        Model model=builder.end();model.manageDisposable(mesh);return model;
    }
    private static int put(float[] v,int k,float x,float y,float z,float nx,float ny,float nz,float u,float w){
        v[k++]=x;v[k++]=y;v[k++]=z;v[k++]=nx;v[k++]=ny;v[k++]=nz;v[k++]=u;v[k++]=w;return k;}
}
