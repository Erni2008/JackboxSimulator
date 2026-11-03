package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;

/**
 * Living backdrop in one pass over the painted hall: velvet curtains sway in slow folds, branches and mist move behind the
 * window tracery, moonbeams fall across the hall (masks in {@code background_masks.png}), the moon's halo breathes, rare double lightning flashes light the glass and the room,
 * and an unseen candle makes the table light flicker very gently. No extra render targets; falls back to the plain image.
 */
public final class BackdropFx implements Disposable {
    public static final String MASK="cursed_cards/background_masks.png";
    private static final String VERT="""
        attribute vec4 a_position;attribute vec4 a_color;attribute vec2 a_texCoord0;uniform mat4 u_projTrans;varying vec2 v_uv;
        void main(){v_uv=a_texCoord0;gl_Position=u_projTrans*a_position;}""";
    private static final String FRAG="""
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec2 v_uv;uniform sampler2D u_texture;uniform sampler2D u_mask;uniform sampler2D u_noise;uniform sampler2D u_front;uniform float u_useFront;
        uniform float u_time;uniform float u_flash;uniform float u_flicker;uniform vec2 u_moon;uniform float u_aspect;uniform float u_wind;
        // Slow, domain-warped cloud field (three octaves); everything drifts at real-sky speeds.
        float clouds(vec2 uv){
            vec2 p=vec2(uv.x*u_aspect*.9,uv.y*2.4);
            float warp=texture2D(u_noise,p*.31+vec2(u_time*.0018,u_time*.0007)).r;
            float n=texture2D(u_noise,p+vec2(u_time*.0055,0.)+warp*.55).r*.55
                   +texture2D(u_noise,p*2.27+vec2(u_time*.0095,.31)+warp*.35).r*.30
                   +texture2D(u_noise,p*4.9+vec2(u_time*.016,.77)).r*.15;
            return n;}
        void main(){
            vec2 uv=v_uv;vec3 m=texture2D(u_mask,uv).rgb;float w=m.r,curtain=m.g,hang=m.b;
            // velvet curtains: slow travelling folds, stronger toward the hem, pinned at the rod
            float fold=sin(uv.y*11.-u_time*.9+uv.x*7.)*.6+sin(uv.y*5.3-u_time*.55)*.4;
            vec2 suv=uv+vec2(fold*.0032*hang*hang*(.6+.4*u_wind),0.)*curtain;
            vec3 c=texture2D(u_texture,suv).rgb;
            c*=1.+curtain*fold*.07*hang;
            // Sky behind the glass: clouds pass only over the lit sky, never over the painted trees and castle,
            // so the silhouettes stay crisp and the weather reads as far behind them.
            float lum=dot(c,vec3(.3,.5,.2));float sky=w*smoothstep(.05,.17,lum)*smoothstep(.62,.30,uv.y);
            vec2 d=(uv-u_moon)*vec2(u_aspect,1.);float moonNear=exp(-dot(d,d)*11.);
            float cl=clouds(uv),dens=smoothstep(.46,.74,cl),rim=smoothstep(.36,.50,cl)*(1.-smoothstep(.52,.70,cl));
            c=mix(c,c*.50+vec3(.035,.045,.07),dens*sky*.6);
            c+=sky*rim*moonNear*vec3(.62,.68,.85)*.55;
            c+=sky*dens*u_flash*vec3(.55,.6,.9)*.45;
            // the moon dims when a cloud crosses it
            float atMoon=smoothstep(.48,.74,clouds(u_moon));
            float halo=exp(-dot(d,d)*70.)*(.09+.03*sin(u_time*.31))*(1.-atMoon*.7);
            c*=1.-w*atMoon*moonNear*.18;
            c+=halo*vec3(.62,.70,1.)*(1.-w*.3);
            // low ground mist rolling slowly in front of the distant trees
            float mistN=texture2D(u_noise,vec2(uv.x*u_aspect*1.3+u_time*.008,uv.y*5.)).r*.6+texture2D(u_noise,vec2(uv.x*u_aspect*2.7-u_time*.005,uv.y*9.+.4)).r*.4;
            float mist=w*smoothstep(.20,.42,uv.y)*smoothstep(.45,.75,mistN);
            c=mix(c,vec3(.20,.24,.34),mist*.32);
            // moonbeams: soft shafts from the moon falling across the hall, slowly breathing
            vec2 r=uv-u_moon;float ang=atan(r.x*u_aspect,r.y),dist=length(r*vec2(u_aspect,1.));
            float shafts=texture2D(u_noise,vec2(ang*.9+u_time*.004,.5)).r;shafts=smoothstep(.55,.95,shafts);
            float beam=shafts*smoothstep(1.1,.15,dist)*smoothstep(.05,.25,dist)*smoothstep(.0,.35,r.y)*(1.-w)*(1.-atMoon*.6);
            c+=beam*vec3(.42,.50,.75)*(.075+.025*sin(u_time*.3));
            c+=w*u_flash*vec3(.70,.76,1.)*.4+u_flash*.07*vec3(.72,.78,1.)+beam*u_flash*.5;
            float table=smoothstep(.42,.95,uv.y);
            c*=1.+u_flicker*.055*table*vec3(1.,.85,.6);
            gl_FragColor=vec4(c,u_useFront>.5?texture2D(u_front,uv).r:1.);
        }""";

    private final ShaderProgram shader;private final Texture mask,noise;private final Vector2 moon;
    private float time,flash,nextFlash,flashAge=99;private final RandomXS128 random=new RandomXS128(13);

    public BackdropFx(float moonU,float moonV){
        moon=new Vector2(moonU,moonV);ShaderProgram.pedantic=false;
        var program=new ShaderProgram(VERT,FRAG);
        if(!program.isCompiled()){Gdx.app.error("CursedCards","backdrop shader: "+program.getLog());program.dispose();program=null;}
        shader=program;
        var f=Gdx.files.internal(MASK);mask=f.exists()?new Texture(f):null;if(mask!=null)mask.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        noise=tileableNoise(256);nextFlash=14+random.nextFloat()*12;
    }
    public boolean enabled(){return shader!=null&&mask!=null;}
    /** Trigger a lightning strike now (checks, scripted moments). */
    public void strike(){flashAge=0;}
    /** Current lightning brightness 0..1 (the 3D scene may borrow it). */
    public float flash(){return flash;}

    public void update(float dt){
        time+=dt;flashAge+=dt;
        if(time>=nextFlash){flashAge=0;nextFlash=time+18+random.nextFloat()*24;}
        // two quick strikes and a fading afterglow
        float a=flashAge;flash=a<.09f?a/.09f:a<.2f?1-(a-.09f)/.11f*.85f:a<.27f?.15f+(a-.2f)/.07f*.75f:a<1.1f?.9f*(float)Math.exp(-(a-.27f)*5):0;
    }
    public void draw(SpriteBatch batch,Texture background,float x,float y,float w,float h){draw(batch,background,null,x,y,w,h);}
    /**
     * With {@code front} (a table-silhouette alpha mask) only the painted table is drawn, blended over what is already there:
     * the foreground layer that seats characters behind the table. Same shader, so the table keeps its animated light.
     */
    public void draw(SpriteBatch batch,Texture background,Texture front,float x,float y,float w,float h){
        if(!enabled()){if(front!=null)return;batch.disableBlending();batch.draw(background,x,y,w,h);batch.enableBlending();return;}
        batch.setShader(shader);if(front==null)batch.disableBlending();else{batch.enableBlending();front.bind(3);}
        mask.bind(1);noise.bind(2);Gdx.gl.glActiveTexture(GL20.GL_TEXTURE0);
        shader.setUniformi("u_mask",1);shader.setUniformi("u_noise",2);shader.setUniformi("u_front",3);shader.setUniformf("u_useFront",front==null?0:1);shader.setUniformf("u_time",time);shader.setUniformf("u_flash",flash);
        float flicker=MathUtils.sin(time*7.1f)*.5f+MathUtils.sin(time*12.7f+1.3f)*.3f+MathUtils.sin(time*3.3f)*.2f;
        shader.setUniformf("u_flicker",flicker);shader.setUniformf("u_wind",.65f+.35f*MathUtils.sin(time*.13f)*MathUtils.sin(time*.07f+1));shader.setUniformf("u_moon",moon);shader.setUniformf("u_aspect",w/h);
        batch.draw(background,x,y,w,h);batch.flush();
        batch.enableBlending();batch.setShader(null);
    }
    /** Smooth, wrap-around value noise (two octaves) for the drifting mist. */
    private static Texture tileableNoise(int n){
        var rnd=new RandomXS128(5);int[] gs={4,8,16,32};float[] amp={.5f,.27f,.15f,.08f};float[][] grids=new float[gs.length][];
        for(int o=0;o<gs.length;o++){grids[o]=new float[gs[o]*gs[o]];for(int i=0;i<grids[o].length;i++)grids[o][i]=rnd.nextFloat();}
        Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float v=0;for(int o=0;o<gs.length;o++)v+=amp[o]*sample(grids[o],gs[o],x*gs[o]/(float)n,y*gs[o]/(float)n);p.drawPixel(x,y,Color.rgba8888(v,v,v,1));}
        var t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);t.setWrap(Texture.TextureWrap.Repeat,Texture.TextureWrap.Repeat);p.dispose();return t;
    }
    private static float sample(float[] grid,int g,float x,float y){
        int x0=(int)x,y0=(int)y;float fx=x-x0,fy=y-y0;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
        float a=grid[(y0%g)*g+x0%g],b=grid[(y0%g)*g+(x0+1)%g],c=grid[((y0+1)%g)*g+x0%g],d=grid[((y0+1)%g)*g+(x0+1)%g];
        return MathUtils.lerp(MathUtils.lerp(a,b,fx),MathUtils.lerp(c,d,fx),fy);
    }
    @Override public void dispose(){if(shader!=null)shader.dispose();if(mask!=null)mask.dispose();noise.dispose();}
}
