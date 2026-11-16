package com.erni.finalanswer.deaths;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.PolygonSpriteBatch;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.Disposable;

/**
 * Cinematic finish for the death stage: bloom on everything bright, a refracting shockwave, chromatic split on the
 * impact, desaturation once the character is gone, vignette and film grain. The scene is drawn into {@link #begin()}
 * / {@link #end()} at a fixed 1920×1080.
 */
public final class DeathPost implements Disposable {
    public static final int SW=1920,SH=1080,BW=480,BH=270;
    private final FrameBuffer scene=new FrameBuffer(Pixmap.Format.RGBA8888,SW,SH,false);
    private final FrameBuffer a=new FrameBuffer(Pixmap.Format.RGBA8888,BW,BH,false),b=new FrameBuffer(Pixmap.Format.RGBA8888,BW,BH,false);
    private final ShaderProgram bright,blur,composite;
    private final Matrix4 unit=new Matrix4().setToOrtho2D(0,0,1,1);
    public float shock=-1,shockStrength,aberration,desat,time,cx=.5f,cy=.5f;

    public DeathPost(){
        ShaderProgram.pedantic=false;
        for(var f:new FrameBuffer[]{scene,a,b})f.getColorBufferTexture().setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        bright=compile(BRIGHT);blur=compile(BLUR);composite=compile(COMPOSITE);
    }
    private static ShaderProgram compile(String frag){var s=new ShaderProgram(DeathTextures.VERT,frag);if(!s.isCompiled())throw new IllegalStateException(s.getLog());return s;}
    public void begin(){scene.begin();Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);}
    public void end(){scene.end();}

    /** Bloom passes, then the composite into the currently applied viewport. */
    public void present(PolygonSpriteBatch batch){
        var oldProj=batch.getProjectionMatrix().cpy();
        batch.setProjectionMatrix(unit);batch.setBlendFunction(GL20.GL_ONE,GL20.GL_ZERO);
        pass(batch,a,bright,scene.getColorBufferTexture(),0,0);
        pass(batch,b,blur,a.getColorBufferTexture(),1f/BW,0);
        pass(batch,a,blur,b.getColorBufferTexture(),0,1f/BH);
        pass(batch,b,blur,a.getColorBufferTexture(),2f/BW,0);
        pass(batch,a,blur,b.getColorBufferTexture(),0,2f/BH);
        // composite to screen
        batch.setShader(composite);batch.begin();
        a.getColorBufferTexture().bind(1);Gdx.gl.glActiveTexture(GL20.GL_TEXTURE0);
        composite.setUniformi("u_bloom",1);composite.setUniformf("u_time",time);composite.setUniformf("u_center",cx,cy);
        composite.setUniformf("u_shock",shock,shockStrength);composite.setUniformf("u_ab",aberration);composite.setUniformf("u_desat",desat);
        quad(batch,scene.getColorBufferTexture());batch.end();batch.setShader(null);
        batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.setProjectionMatrix(oldProj);
    }
    private void pass(PolygonSpriteBatch batch,FrameBuffer target,ShaderProgram s,Texture src,float dx,float dy){
        target.begin();Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
        batch.setShader(s);batch.begin();if(s==blur)s.setUniformf("u_dir",dx,dy);quad(batch,src);batch.end();batch.setShader(null);
        target.end();
    }
    private final float[] v=new float[30];private static final short[] T={0,1,2,3,4,5};
    private void quad(PolygonSpriteBatch batch,Texture t){
        float w=com.badlogic.gdx.graphics.Color.WHITE_FLOAT_BITS;float[] q={0,0,1,0,1,1,0,0,1,1,0,1};
        for(int i=0;i<6;i++){int o=i*5;v[o]=q[i*2];v[o+1]=q[i*2+1];v[o+2]=w;v[o+3]=q[i*2];v[o+4]=q[i*2+1];}
        batch.draw(t,v,0,30,T,0,6);
    }
    @Override public void dispose(){scene.dispose();a.dispose();b.dispose();bright.dispose();blur.dispose();composite.dispose();}

    private static final String HEAD="""
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec4 v_color;varying vec2 v_uv;uniform sampler2D u_texture;
        """;
    static final String BRIGHT=HEAD+"""
        void main(){vec3 c=texture2D(u_texture,v_uv).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(.72,1.0,l),1.0);}
        """;
    static final String BLUR=HEAD+"""
        uniform vec2 u_dir;
        void main(){vec3 s=texture2D(u_texture,v_uv).rgb*.227;
            s+=texture2D(u_texture,v_uv+u_dir*1.38).rgb*.316;s+=texture2D(u_texture,v_uv-u_dir*1.38).rgb*.316;
            s+=texture2D(u_texture,v_uv+u_dir*3.23).rgb*.07;s+=texture2D(u_texture,v_uv-u_dir*3.23).rgb*.07;
            gl_FragColor=vec4(s,1.0);}
        """;
    static final String COMPOSITE=HEAD+"""
        uniform sampler2D u_bloom;uniform float u_time,u_ab,u_desat;uniform vec2 u_center,u_shock;
        float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
        void main(){
            vec2 uv=v_uv;vec2 d=uv-u_center;vec2 da=d*vec2(1.7778,1.0);float dist=length(da);
            if(u_shock.x>=0.0){float x=(dist-u_shock.x)/.045;float ring=exp(-x*x)*u_shock.y;uv-=normalize(d+1e-5)*ring*.035;}
            vec2 ab=d*u_ab*.03;
            vec3 c=vec3(texture2D(u_texture,uv+ab).r,texture2D(u_texture,uv).g,texture2D(u_texture,uv-ab).b);
            c+=texture2D(u_bloom,uv).rgb*.4;
            float l=dot(c,vec3(.299,.587,.114));c=mix(c,vec3(l)*vec3(1.02,.98,.95),u_desat);
            vec2 vq=(v_uv-.5)*vec2(1.25,1.05);c*=smoothstep(1.05,.32,length(vq));
            c+=(h(v_uv*vec2(1920.0,1080.0)+fract(u_time*7.0)*100.0)-.5)*.045;
            gl_FragColor=vec4(c,1.0);
        }
        """;
}
