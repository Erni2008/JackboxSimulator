package com.erni.finalanswer.ui.effects;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.Disposable;

/**
 * Film look for a 2D scene: the scene is drawn into an off-screen frame, then composited with soft bloom on the bright
 * areas (candles, moonlight, gilt), a gentle filmic grade (cool shadows, warm highlights), fine animated grain, a lens
 * vignette and a trace of edge fringing. Presentation only. If shaders or frame buffers are unavailable the scene is
 * drawn directly, unchanged. Usage per frame: {@code begin(); …draw scene…; end(x,y,w,h);}
 */
public final class CinematicPost implements Disposable {
    /** Tunable look; defaults suit dark candle-lit interiors. */
    public static final class Look {
        public float bloom=.85f,threshold=.62f,grain=.045f,vignette=.42f,fringe=.0012f,contrast=1.08f,saturation=1.06f,exposure=1f;
        /** Cool tint added to shadows and warm tint added to highlights. */
        public final float[] shadows={-.012f,.0f,.022f},highlights={.035f,.012f,-.03f};
    }
    public final Look look=new Look();
    private static final String VERT="""
        attribute vec4 a_position;attribute vec4 a_color;attribute vec2 a_texCoord0;
        uniform mat4 u_projTrans;varying vec2 v_uv;
        void main(){v_uv=a_texCoord0;gl_Position=u_projTrans*a_position;}
        """;
    private static final String BRIGHT="""
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec2 v_uv;uniform sampler2D u_texture;uniform float u_threshold;uniform vec2 u_texel;
        void main(){
            vec3 c=(texture2D(u_texture,v_uv+u_texel*vec2(-1.0,-1.0)).rgb+texture2D(u_texture,v_uv+u_texel*vec2(1.0,-1.0)).rgb
                   +texture2D(u_texture,v_uv+u_texel*vec2(-1.0,1.0)).rgb+texture2D(u_texture,v_uv+u_texel*vec2(1.0,1.0)).rgb)*0.25;
            float l=max(c.r,max(c.g,c.b));float k=smoothstep(u_threshold,u_threshold+0.35,l);
            gl_FragColor=vec4(c*k,1.0);
        }
        """;
    private static final String BLUR="""
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec2 v_uv;uniform sampler2D u_texture;uniform vec2 u_dir;
        void main(){
            vec3 c=texture2D(u_texture,v_uv).rgb*0.2270270;
            c+=(texture2D(u_texture,v_uv+u_dir*1.3846154).rgb+texture2D(u_texture,v_uv-u_dir*1.3846154).rgb)*0.3162162;
            c+=(texture2D(u_texture,v_uv+u_dir*3.2307692).rgb+texture2D(u_texture,v_uv-u_dir*3.2307692).rgb)*0.0702703;
            gl_FragColor=vec4(c,1.0);
        }
        """;
    private static final String FINAL="""
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec2 v_uv;uniform sampler2D u_texture;uniform sampler2D u_bloom;
        uniform float u_bloomK,u_grain,u_vignette,u_fringe,u_contrast,u_saturation,u_exposure,u_time;
        uniform vec3 u_shadows,u_highlights;
        float hash(vec2 p){p=fract(p*vec2(443.897,441.423));p+=dot(p,p.yx+19.19);return fract((p.x+p.y)*p.x);}
        void main(){
            vec2 d=v_uv-0.5;float r2=dot(d,d);
            vec2 off=d*r2*u_fringe*8.0;
            vec3 c=vec3(texture2D(u_texture,v_uv+off).r,texture2D(u_texture,v_uv).g,texture2D(u_texture,v_uv-off).b);
            vec3 b=texture2D(u_bloom,v_uv).rgb;
            c=c+b*u_bloomK;                                   // soft glow
            c*=u_exposure;
            float l=dot(c,vec3(0.299,0.587,0.114));
            c=mix(vec3(l),c,u_saturation);
            c=(c-0.5)*u_contrast+0.5;
            c+=u_shadows*(1.0-smoothstep(0.0,0.45,l))+u_highlights*smoothstep(0.35,1.0,l);
            c=c/(1.0+max(c-0.85,0.0)*0.9);                    // gentle highlight roll-off
            c*=1.0-u_vignette*smoothstep(0.18,0.75,r2*1.55);
            float g=hash(v_uv*vec2(1920.0,1080.0)+fract(u_time)*61.0)-0.5;
            c+=g*u_grain*(1.0-l*0.6);
            gl_FragColor=vec4(max(c,0.0),1.0);
        }
        """;
    private FrameBuffer scene,small,smallB,tiny,tinyB;private ShaderProgram bright,blur,fin;
    private final SpriteBatch batch;private final Matrix4 unit=new Matrix4().setToOrtho2D(0,0,1,1);
    private boolean ok=true,active;private float time;private int width,height;

    public CinematicPost(){
        SpriteBatch b=null;
        try{bright=new ShaderProgram(VERT,BRIGHT);blur=new ShaderProgram(VERT,BLUR);fin=new ShaderProgram(VERT,FINAL);
            if(!bright.isCompiled()||!blur.isCompiled()||!fin.isCompiled()){Gdx.app.error("CinematicPost","shader: "+bright.getLog()+blur.getLog()+fin.getLog());ok=false;}
            b=new SpriteBatch(4);}
        catch(RuntimeException e){Gdx.app.error("CinematicPost","unavailable: "+e.getMessage());ok=false;}
        batch=b;
    }
    public boolean available(){return ok;}
    public void update(float dt){time+=dt;}

    private void ensure(int w,int h){
        if(w==width&&h==height&&scene!=null)return;
        disposeBuffers();width=w;height=h;
        try{scene=buffer(w,h);small=buffer(Math.max(8,w/4),Math.max(8,h/4));smallB=buffer(small.getWidth(),small.getHeight());
            tiny=buffer(Math.max(4,w/10),Math.max(4,h/10));tinyB=buffer(tiny.getWidth(),tiny.getHeight());}
        catch(RuntimeException e){Gdx.app.error("CinematicPost","frame buffer: "+e.getMessage());ok=false;disposeBuffers();}
    }
    private static FrameBuffer buffer(int w,int h){FrameBuffer f=new FrameBuffer(Pixmap.Format.RGBA8888,w,h,false);
        f.getColorBufferTexture().setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        f.getColorBufferTexture().setWrap(Texture.TextureWrap.ClampToEdge,Texture.TextureWrap.ClampToEdge);return f;}

    /** Logical (window) pixels → back-buffer pixels; differs on Retina/HiDPI screens. */
    private static float hdpi(){return Gdx.graphics.getWidth()<=0?1:Gdx.graphics.getBackBufferWidth()/(float)Gdx.graphics.getWidth();}
    /** Start drawing the scene; {@code w×h} is the size in window pixels the scene will occupy on screen. */
    public void begin(int w,int h){float k=hdpi();w=Math.round(w*k);h=Math.round(h*k);
        active=false;if(!ok)return;ensure(Math.max(16,Math.min(w,2880)),Math.max(16,Math.min(h,1620)));if(!ok)return;
        scene.begin();Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);active=true;
    }
    /** Finish the scene and composite it onto the back buffer rectangle {@code x,y,w,h} (pixels). */
    public void end(int x,int y,int w,int h){
        if(!active)return;active=false;scene.end();
        batch.setProjectionMatrix(unit);batch.disableBlending();
        // bright areas → quarter size → blurred; a second, wider glow at a tenth
        pass(small,scene.getColorBufferTexture(),bright,s->{s.setUniformf("u_threshold",look.threshold);s.setUniformf("u_texel",1f/width,1f/height);});
        for(int i=0;i<2;i++){float r=1+i*.9f;
            pass(smallB,small.getColorBufferTexture(),blur,s->s.setUniformf("u_dir",r/small.getWidth(),0));
            pass(small,smallB.getColorBufferTexture(),blur,s->s.setUniformf("u_dir",0,r/small.getHeight()));}
        pass(tiny,small.getColorBufferTexture(),blur,s->s.setUniformf("u_dir",1f/tiny.getWidth(),0));
        for(int i=0;i<2;i++){
            pass(tinyB,tiny.getColorBufferTexture(),blur,s->s.setUniformf("u_dir",1.4f/tiny.getWidth(),0));
            pass(tiny,tinyB.getColorBufferTexture(),blur,s->s.setUniformf("u_dir",0,1.4f/tiny.getHeight()));}
        // tight glow + wide glow, summed into smallB
        smallB.begin();Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);batch.setShader(null);batch.enableBlending();batch.setBlendFunction(GL20.GL_ONE,GL20.GL_ONE);
        batch.begin();batch.setColor(.65f,.65f,.65f,1);batch.draw(small.getColorBufferTexture(),0,0,1,1,0,0,1,1);batch.setColor(.75f,.75f,.75f,1);batch.draw(tiny.getColorBufferTexture(),0,0,1,1,0,0,1,1);batch.end();
        batch.setColor(Color.WHITE);batch.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.disableBlending();smallB.end();
        float k=hdpi();Gdx.gl.glViewport(Math.round(x*k),Math.round(y*k),Math.round(w*k),Math.round(h*k));
        batch.setShader(fin);batch.begin();
        smallB.getColorBufferTexture().bind(1);fin.setUniformi("u_bloom",1);Gdx.gl.glActiveTexture(GL20.GL_TEXTURE0);
        fin.setUniformf("u_bloomK",look.bloom);fin.setUniformf("u_grain",look.grain);fin.setUniformf("u_vignette",look.vignette);fin.setUniformf("u_fringe",look.fringe);
        fin.setUniformf("u_contrast",look.contrast);fin.setUniformf("u_saturation",look.saturation);fin.setUniformf("u_exposure",look.exposure);fin.setUniformf("u_time",time);
        fin.setUniformf("u_shadows",look.shadows[0],look.shadows[1],look.shadows[2]);fin.setUniformf("u_highlights",look.highlights[0],look.highlights[1],look.highlights[2]);
        batch.draw(scene.getColorBufferTexture(),0,0,1,1,0,0,1,1);batch.end();batch.setShader(null);batch.enableBlending();
    }
    private void pass(FrameBuffer target,Texture source,ShaderProgram shader,java.util.function.Consumer<ShaderProgram> uniforms){
        target.begin();batch.setShader(shader);batch.begin();uniforms.accept(shader);batch.draw(source,0,0,1,1,0,0,1,1);batch.end();target.end();
    }
    private void disposeBuffers(){for(FrameBuffer f:new FrameBuffer[]{scene,small,smallB,tiny,tinyB})if(f!=null)f.dispose();scene=small=smallB=tiny=tinyB=null;}
    @Override public void dispose(){disposeBuffers();if(bright!=null)bright.dispose();if(blur!=null)blur.dispose();if(fin!=null)fin.dispose();if(batch!=null)batch.dispose();}
}
