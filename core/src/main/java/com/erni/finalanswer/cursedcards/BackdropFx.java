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
        void main(){
            vec2 uv=v_uv;vec3 m=texture2D(u_mask,uv).rgb;float w=m.r,curtain=m.g,hang=m.b;
            // velvet curtains: slow travelling folds, stronger toward the hem, pinned at the rod
            float fold=sin(uv.y*11.-u_time*.9+uv.x*7.)*.6+sin(uv.y*5.3-u_time*.55)*.4;
            vec2 suv=uv+vec2(fold*.0032*hang*hang*(.6+.4*u_wind),0.)*curtain;
            // branches and fog behind the glass drift with the wind
            float gust=sin(u_time*.6+uv.y*24.)*.5+sin(u_time*1.3+uv.x*31.)*.25;
            float bough=sin(u_time*.35+uv.x*3.)*.6+sin(u_time*.9+uv.y*9.)*.4;
            suv+=vec2((gust*.0013+bough*.0016*smoothstep(.15,.6,uv.y))*u_wind,bough*.0006*u_wind)*w;
            vec3 c=texture2D(u_texture,suv).rgb;
            // folds catch the candlelight
            c*=1.+curtain*fold*.07*hang;
            vec2 q=vec2(uv.x*2.4,uv.y*4.2);
            float n=texture2D(u_noise,q+vec2(u_time*.010,0.)).r*.62+texture2D(u_noise,q*2.1+vec2(-u_time*.018,u_time*.003)).r*.38;
            float mist=smoothstep(.48,.92,n);
            c*=mix(1.,.80+.20*smoothstep(.25,.75,n),w*.7);
            c+=w*mist*vec3(.30,.36,.52)*.42;
            vec2 d=(uv-u_moon)*vec2(u_aspect,1.);float halo=exp(-dot(d,d)*70.)*(.09+.04*sin(u_time*.45));
            // drifting storm clouds behind the glass: two layers at different speeds (parallax), lit silver near the moon
            vec2 cq=vec2(uv.x*1.6,uv.y*2.6);
            float cl=texture2D(u_noise,cq+vec2(u_time*.016,0.)).r*.6+texture2D(u_noise,cq*1.9+vec2(u_time*.028,.37)).r*.4;
            float cloud=smoothstep(.45,.8,cl),edge=smoothstep(.38,.55,cl)-smoothstep(.55,.75,cl);
            float nearMoon=exp(-dot(d,d)*9.);
            c*=mix(1.,.62,cloud*w*.8);
            c+=w*edge*nearMoon*vec3(.55,.62,.9)*.55;
            float atMoon=texture2D(u_noise,vec2(u_moon.x*1.6,u_moon.y*2.6)+vec2(u_time*.016,0.)).r;
            halo*=1.-smoothstep(.5,.85,atMoon)*.55;
            // faint stars in the clear dark patches, each with its own slow twinkle
            vec2 cell=floor(uv*vec2(320.,180.));float hs=fract(sin(dot(cell,vec2(12.9898,78.233)))*43758.5453);
            vec2 inCell=fract(uv*vec2(320.,180.))-.5;float star=step(.993,hs)*smoothstep(.35,0.,length(inCell))*(.5+.5*sin(u_time*(1.+hs*3.)+hs*40.));
            c+=w*star*(1.-cloud)*smoothstep(.25,.05,dot(c,vec3(.33)))*vec3(.8,.85,1.)*.9;
            c+=w*cloud*u_flash*vec3(.6,.66,1.)*.6;
            c+=halo*vec3(.62,.70,1.)*(1.-w*.3);
            // moonbeams: soft shafts from the moon falling across the hall, slowly breathing
            vec2 r=uv-u_moon;float ang=atan(r.x*u_aspect,r.y),dist=length(r*vec2(u_aspect,1.));
            float shafts=texture2D(u_noise,vec2(ang*.9+u_time*.004,.5)).r;shafts=smoothstep(.55,.95,shafts);
            float beam=shafts*smoothstep(1.1,.15,dist)*smoothstep(.05,.25,dist)*smoothstep(.0,.35,r.y)*(1.-w);
            c+=beam*vec3(.42,.50,.75)*(.075+.025*sin(u_time*.3));
            c+=w*u_flash*vec3(.70,.76,1.)*.85+u_flash*.07*vec3(.72,.78,1.)+beam*u_flash*.5;
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
        noise=tileableNoise(128);nextFlash=14+random.nextFloat()*12;
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
        var rnd=new RandomXS128(5);int g=8;float[] grid=new float[g*g];for(int i=0;i<grid.length;i++)grid[i]=rnd.nextFloat();
        int g2=16;float[] fine=new float[g2*g2];for(int i=0;i<fine.length;i++)fine[i]=rnd.nextFloat();
        Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float v=.7f*sample(grid,g,x*g/(float)n,y*g/(float)n)+.3f*sample(fine,g2,x*g2/(float)n,y*g2/(float)n);p.drawPixel(x,y,Color.rgba8888(v,v,v,1));}
        var t=new Texture(p);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);t.setWrap(Texture.TextureWrap.Repeat,Texture.TextureWrap.Repeat);p.dispose();return t;
    }
    private static float sample(float[] grid,int g,float x,float y){
        int x0=(int)x,y0=(int)y;float fx=x-x0,fy=y-y0;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
        float a=grid[(y0%g)*g+x0%g],b=grid[(y0%g)*g+(x0+1)%g],c=grid[((y0+1)%g)*g+x0%g],d=grid[((y0+1)%g)*g+(x0+1)%g];
        return MathUtils.lerp(MathUtils.lerp(a,b,fx),MathUtils.lerp(c,d,fx),fy);
    }
    @Override public void dispose(){if(shader!=null)shader.dispose();if(mask!=null)mask.dispose();noise.dispose();}
}
