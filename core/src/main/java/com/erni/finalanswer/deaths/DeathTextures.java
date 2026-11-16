package com.erni.finalanswer.deaths;

import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.utils.Disposable;

/** Procedural particle sprites and the death shader, shared by every death on a screen. */
public final class DeathTextures implements Disposable {
    public final TextureRegion pixel,soft,dot,ring;public final ShaderProgram shader;
    public DeathTextures(){
        Pixmap p=new Pixmap(4,4,Pixmap.Format.RGBA8888);p.setColor(1,1,1,1);p.fill();pixel=new TextureRegion(new Texture(p));p.dispose();
        soft=radial(128,(d)->{float k=Math.max(0,1-d);return k*k*(3-2*k)*k;});
        dot=radial(64,(d)->d<.82f?1:Math.max(0,1-(d-.82f)/.18f));
        ring=radial(256,(d)->{float x=Math.abs(d-.86f)/.12f;return Math.max(0,1-x*x);});
        ShaderProgram.pedantic=false;
        shader=new ShaderProgram(VERT,FRAG);
        if(!shader.isCompiled())throw new IllegalStateException("Death shader: "+shader.getLog());
    }
    private interface F{float at(float d);}
    private static TextureRegion radial(int n,F f){
        Pixmap p=new Pixmap(n,n,Pixmap.Format.RGBA8888);
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){float dx=(x+.5f)/n*2-1,dy=(y+.5f)/n*2-1;float a=Math.max(0,Math.min(1,f.at((float)Math.sqrt(dx*dx+dy*dy))));
            p.drawPixel(x,y,0xffffff00|(int)(a*255));}
        Texture t=new Texture(p,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);p.dispose();return new TextureRegion(t);
    }
    @Override public void dispose(){pixel.getTexture().dispose();soft.getTexture().dispose();dot.getTexture().dispose();ring.getTexture().dispose();shader.dispose();}

    static final String VERT="""
        attribute vec4 a_position;attribute vec4 a_color;attribute vec2 a_texCoord0;
        uniform mat4 u_projTrans;varying vec4 v_color;varying vec2 v_uv;varying vec2 v_pos;
        void main(){v_color=a_color;v_color.a*=255.0/254.0;v_uv=a_texCoord0;v_pos=a_position.xy;gl_Position=u_projTrans*a_position;}
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
            float l=dot(c.rgb,vec3(.299,.587,.114));
            c.rgb=mix(c.rgb,vec3(l),u_gray);
            c.rgb*=(1.0-u_char*(.55+.45*n(v_uv*14.0)));
            c.rgb*=u_tint;
            c.rgb+=vec3(1.0,.35,.15)*u_glow*c.a+vec3(u_flash)*c.a;
            gl_FragColor=c*v_color.a;
        }
        """;
}
