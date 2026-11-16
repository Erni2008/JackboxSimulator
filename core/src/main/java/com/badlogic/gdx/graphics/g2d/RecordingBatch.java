package com.badlogic.gdx.graphics.g2d;

import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.math.Matrix4;
import java.util.ArrayList;
import java.util.List;

/**
 * A SpriteBatch that, while {@link #recording}, also remembers every quad it flushes in world space (transform matrix
 * applied), grouped by flush. Each character rig flushes once per body part (texture or transform change), so the
 * groups are the character's parts exactly as the rig posed them. Lives in libGDX's package to read the vertex buffer.
 */
public class RecordingBatch extends SpriteBatch {
    public static final class Quad{public Texture texture;public com.badlogic.gdx.graphics.glutils.ShaderProgram shader;public final float[] v=new float[20];public int group,src,dst;}
    public boolean recording;public final List<Quad> quads=new ArrayList<>();private int group;
    public RecordingBatch(){super(1000);}
    public void clearRecording(){quads.clear();group=0;}
    @Override public void flush(){
        if(recording&&idx>0&&lastTexture!=null){
            float[] m=getTransformMatrix().val;
            for(int i=0;i+20<=idx;i+=20){Quad q=new Quad();q.texture=lastTexture;q.group=group;q.shader=getShader();q.src=getBlendSrcFunc();q.dst=getBlendDstFunc();
                for(int k=0;k<4;k++){int o=i+k*5,p=k*5;float x=vertices[o],y=vertices[o+1];
                    q.v[p]=m[Matrix4.M00]*x+m[Matrix4.M01]*y+m[Matrix4.M03];q.v[p+1]=m[Matrix4.M10]*x+m[Matrix4.M11]*y+m[Matrix4.M13];
                    q.v[p+2]=vertices[o+2];q.v[p+3]=vertices[o+3];q.v[p+4]=vertices[o+4];}
                quads.add(q);}
            group++;
        }
        super.flush();
    }
}
