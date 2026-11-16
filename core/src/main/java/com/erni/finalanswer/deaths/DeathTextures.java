package com.erni.finalanswer.deaths;

import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.utils.Disposable;

/** Procedural particle sprites and the death shader, shared by every death on a screen. */
public final class DeathTextures implements Disposable {
    public final TextureRegion pixel,soft,dot,ring,smoke,hole;public final ShaderProgram shader,fire;
    public DeathTextures(){
        Pixmap p=new Pixmap(4,4,Pixmap.Format.RGBA8888);p.setColor(1,1,1,1);p.fill();pixel=new TextureRegion(new Texture(p));p.dispose();
        soft=radial(128,(d)->{float k=Math.max(0,1-d);return k*k*(3-2*k)*k;});
        dot=radial(64,(d)->d<.82f?1:Math.max(0,1-(d-.82f)/.18f));
        ring=radial(256,(d)->{float x=Math.abs(d-.86f)/.12f;return Math.max(0,1-x*x);});
        smoke=cloud(128,7);
        {java.util.Random r=new java.util.Random(11);float[] rad=new float[64];for(int i=0;i<64;i++)rad[i]=.72f+r.nextFloat()*.28f;
         hole=radialA(128,(dx,dy)->{double a=Math.atan2(dy,dx);int i=(int)((a+Math.PI)/(2*Math.PI)*64)%64;float rr=rad[i]*.6f+rad[(i+1)%64]*.4f;float d=(float)Math.sqrt(dx*dx+dy*dy)/rr;return d<.92f?1:Math.max(0,1-(d-.92f)/.08f);});}
        ShaderProgram.pedantic=false;
        shader=new ShaderProgram(VERT,FRAG);
        if(!shader.isCompiled())throw new IllegalStateException("Death shader: "+shader.getLog());
        fire=new ShaderProgram(VERT,FIRE);
        if(!fire.isCompiled())throw new IllegalStateException("Fire shader: "+fire.getLog());
    }
    private interface F{float at(float d);}
    private interface F2{float at(float dx,float dy);}
    private static TextureRegion radialA(int n,F2 f){
        Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=(x+.5f)/n*2-1,dy=(y+.5f)/n*2-1;float a=Math.max(0,Math.min(1,f.at(dx,dy)));p.drawPixel(x,y,0xffffff00|(int)(a*255));}
        Texture t=new Texture(p,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);p.dispose();return new TextureRegion(t);
    }
    private static TextureRegion radial(int n,F f){
        Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=(x+.5f)/n*2-1,dy=(y+.5f)/n*2-1;float a=Math.max(0,Math.min(1,f.at((float)Math.sqrt(dx*dx+dy*dy))));
            p.drawPixel(x,y,0xffffff00|(int)(a*255));}
        Texture t=new Texture(p,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);p.dispose();return new TextureRegion(t);
    }
    /** A soft, lumpy smoke puff: fractal noise under a round falloff. */
    private static TextureRegion cloud(int n,long seed){
        java.util.Random r=new java.util.Random(seed);int g=8;float[][] grid=new float[g+1][g+1];for(int i=0;i<=g;i++)for(int j=0;j<=g;j++)grid[i][j]=r.nextFloat();
        float[][] grid2=new float[2*g+1][2*g+1];for(int i=0;i<=2*g;i++)for(int j=0;j<=2*g;j++)grid2[i][j]=r.nextFloat();
        Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float u=(x+.5f)/n,v=(y+.5f)/n;
            float a=.62f*lerp2(grid,u*g,v*g)+.38f*lerp2(grid2,u*2*g,v*2*g);
            float dx=u*2-1,dy=v*2-1,d=(float)Math.sqrt(dx*dx+dy*dy);float fall=Math.max(0,1-d);fall=fall*fall*(3-2*fall);
            float al=Math.max(0,Math.min(1,(a*1.5f-.35f)*fall*1.6f));p.drawPixel(x,y,0xffffff00|(int)(al*255));}
        Texture t=new Texture(p,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);p.dispose();return new TextureRegion(t);
    }
    private static float lerp2(float[][] g,float x,float y){int i=Math.min((int)x,g.length-2),j=Math.min((int)y,g.length-2);float fx=x-i,fy=y-j;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
        return (g[i][j]*(1-fx)+g[i+1][j]*fx)*(1-fy)+(g[i][j+1]*(1-fx)+g[i+1][j+1]*fx)*fy;}
    @Override public void dispose(){hole.getTexture().dispose();smoke.getTexture().dispose();fire.dispose();pixel.getTexture().dispose();soft.getTexture().dispose();dot.getTexture().dispose();ring.getTexture().dispose();shader.dispose();}

    static final String VERT="""
        attribute vec4 a_position;attribute vec4 a_color;attribute vec2 a_texCoord0;
        uniform mat4 u_projTrans;varying vec4 v_color;varying vec2 v_uv;varying vec2 v_pos;
        void main(){v_color=a_color;v_color.a*=255.0/254.0;v_uv=a_texCoord0;v_pos=a_position.xy;gl_Position=u_projTrans*a_position;}
        """;
    static final String FIRE="""
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec4 v_color;varying vec2 v_uv;uniform sampler2D u_texture;
        uniform float u_time,u_fire,u_burn,u_dir,u_offY;uniform vec3 u_col;
        float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
            return mix(mix(h(i),h(i+vec2(1.0,0.0)),f.x),mix(h(i+vec2(0.0,1.0)),h(i+vec2(1.0,1.0)),f.x),f.y);}
        float fbm(vec2 p){return .55*n(p)+.3*n(p*2.03+7.1)+.15*n(p*4.01+3.3);}
        float alive(vec2 uv){
            if(uv.y<0.0||uv.y>1.0||uv.x<0.0||uv.x>1.0)return 0.0;
            float a=texture2D(u_texture,uv).a;
            if(u_burn>0.0){float d=fbm(uv*vec2(7.0,9.0));float g=u_dir>0.5?uv.y:(u_dir<-0.5?1.0-uv.y:d);if(.5*d+.5*g<u_burn-.02)a=0.0;}
            return a;}
        void main(){
            vec2 uv=v_uv;uv.y-=u_offY;
            float m=0.0;
            for(int i=0;i<7;i++){float fi=float(i);
                vec2 o=vec2((n(vec2(uv.y*9.0-u_time*4.0,fi*3.1))-.5)*.035,-fi*.024);
                m=max(m,alive(uv+o)*(1.0-fi/8.0));}
            float f=fbm(vec2(uv.x*10.0,uv.y*7.0-u_time*3.4))*.65+fbm(vec2(uv.x*23.0+3.0,uv.y*15.0-u_time*6.0))*.35;
            float flame=smoothstep(.32,.95,m*f*1.45)*u_fire;
            vec3 col=mix(u_col*.45,u_col,smoothstep(.15,.55,flame));
            col=mix(col,vec3(1.0,.96,.82),smoothstep(.55,1.0,flame));
            gl_FragColor=vec4(col*flame*.95,flame*.8)*v_color.a;
        }
        """;
    static final String FRAG="""
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec4 v_color;varying vec2 v_uv;varying vec2 v_pos;uniform sampler2D u_texture;
        uniform float u_time,u_burn,u_dir,u_char,u_gray,u_melt,u_wave,u_flash,u_glow,u_clip;uniform vec4 u_edge;uniform vec3 u_tint;
        float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
            return mix(mix(h(i),h(i+vec2(1.0,0.0)),f.x),mix(h(i+vec2(0.0,1.0)),h(i+vec2(1.0,1.0)),f.x),f.y);}
        float fbm(vec2 p){return .55*n(p)+.3*n(p*2.03+7.1)+.15*n(p*4.01+3.3);}
        void main(){
            if(v_pos.y<u_clip)discard;
            vec2 uv=v_uv;
            uv.x+=sin(uv.y*26.0+u_time*7.0)*.012*u_wave+sin(uv.y*61.0-u_time*11.0)*.004*u_wave;
            float drip=u_melt*(.35+.65*n(vec2(uv.x*18.0,3.0)));uv.y+=drip*uv.y;
            vec4 c=texture2D(u_texture,uv);
            if(u_burn>0.0){
                float d=fbm(v_uv*vec2(7.0,9.0));
                float g=u_dir>0.5?v_uv.y:(u_dir<-0.5?1.0-v_uv.y:d);
                float k=.5*d+.5*g;
                if(k<u_burn-.02)discard;
                float e=1.0-smoothstep(u_burn-.02,u_burn+u_edge.w,k);
                c.rgb=mix(c.rgb,c.rgb*.15,e*.8);
                c.rgb+=u_edge.rgb*e*1.6*c.a;
            }
            float e=min(min(v_color.r,v_color.g),v_color.b);float lit=max(max(v_color.r,v_color.g),v_color.b);
            c.rgb*=mix(.28,1.0,smoothstep(0.0,.09,e))*lit;
            c.rgb+=vec3(.12)*c.a*(1.0-smoothstep(0.0,.035,v_color.g))*step(e,.5)*lit;
            float l=dot(c.rgb,vec3(.299,.587,.114));
            c.rgb=mix(c.rgb,vec3(l),u_gray);
            c.rgb*=(1.0-u_char*(.55+.45*n(v_uv*14.0)));
            c.rgb*=u_tint;
            c.rgb+=vec3(1.0,.35,.15)*u_glow*c.a+vec3(u_flash)*c.a;
            gl_FragColor=c*v_color.a;
        }
        """;
}
