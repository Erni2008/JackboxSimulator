package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.utils.*;

/** Fixed architectural detail with crossfaded low-frequency illumination from all supplied frames. */
public final class CursedBoxesBackground implements Disposable {
    public static final class Settings {
        public float frameHoldTime=1.5f,crossfadeDuration=.5f,brightness=.92f,lightingStrength=.65f;
        public boolean loop=true;
        public void validate(){
            if(!Float.isFinite(frameHoldTime)||frameHoldTime<0||!Float.isFinite(crossfadeDuration)||crossfadeDuration<=0||!Float.isFinite(brightness)||brightness<=0||brightness>1||!Float.isFinite(lightingStrength)||lightingStrength<0||lightingStrength>1)
                throw new IllegalArgumentException("Invalid Cursed Boxes background timing/brightness");
        }
        public static Settings load(){
            var file=Gdx.files.internal(CursedBoxesAssets.ROOT+"background.json");
            Settings s=file.exists()?new Json().fromJson(Settings.class,file):new Settings();s.validate();return s;
        }
    }
    /** Independent clock: ping-pong 1 -> 2 -> 3 -> 2 -> 1 without duplicating endpoints. */
    public static final class Timeline {
        private final double hold,fade,segment,cycle;
        private final boolean loop;
        private final int count,steps;
        private double elapsed;
        public Timeline(Settings settings){this(settings,3);}
        public Timeline(Settings settings,int count){settings.validate();if(count<1)throw new IllegalArgumentException("No background frames");this.count=count;steps=Math.max(1,2*(count-1));hold=settings.frameHoldTime;fade=settings.crossfadeDuration;segment=hold+fade;cycle=steps*segment;loop=settings.loop;}
        public void update(float delta){if(!Float.isFinite(delta)||delta<=0)return;elapsed+=delta;if(loop)elapsed%=cycle;else elapsed=Math.min(elapsed,(count-1)*segment);}
        private int frame(int step){return step<count?step:steps-step;}
        public int current(){return frame(Math.min(steps-1,(int)(elapsed/segment)));}
        public int next(){if(!loop&&current()==count-1)return count-1;return frame(((int)(elapsed/segment)+1)%steps);}
        public float alpha(){
            if(count==1||!loop&&current()==count-1)return 0;
            double p=Math.max(0,Math.min(1,((elapsed%segment)-hold)/fade));return (float)(p*p*p*(p*(p*6-15)+10));
        }
        public double elapsed(){return elapsed;}
    }
    private final Texture[] frames,lighting;
    private final Settings settings;
    private final ShaderProgram shader;
    public final Timeline timeline;
    public CursedBoxesBackground(Texture[] frames,Texture[] lighting,Settings settings){
        if(frames.length!=3||lighting.length!=3)throw new IllegalArgumentException("Gallery frames 1/2/3 required");
        for(int i=0;i<3;i++)if(frames[i]==null||lighting[i]==null)throw new IllegalArgumentException("Missing preloaded gallery frame/lightmap");
        this.frames=frames;this.lighting=lighting;this.settings=settings;timeline=new Timeline(settings);
        shader=new ShaderProgram("attribute vec4 a_position; attribute vec4 a_color; attribute vec2 a_texCoord0; uniform mat4 u_projTrans; varying vec4 v_color; varying vec2 v_texCoords; void main(){v_color=a_color;v_color.a*=255.0/254.0;v_texCoords=a_texCoord0;gl_Position=u_projTrans*a_position;}",
            "#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec4 v_color; varying vec2 v_texCoords;\nuniform sampler2D u_texture,u_referenceLight,u_lightA,u_lightB; uniform float u_alpha,u_strength,u_time,u_motion,u_low;\nfloat hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\nfloat noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}\nfloat fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+17.1;a*=0.5;}return v;}\nfloat flame(float t,float seed){float n=noise(vec2(t*3.1,seed))*0.6+noise(vec2(t*9.7,seed+5.0))*0.4;float dip=smoothstep(0.88,1.0,noise(vec2(t*0.6,seed+11.0)));return mix(1.0,(0.82+0.3*n)*(1.0-0.55*dip),u_motion);}\nvoid main(){\n  vec2 uv=v_texCoords; float t=u_time;\n  // wet floor: below the skirting the boards ripple slightly, so reflections shimmer\n  float floorMask=smoothstep(0.52,0.62,uv.y)*(1.0-smoothstep(0.75,0.78,uv.y));\n  vec2 suv=uv; suv.x+=floorMask*u_motion*0.0025*sin(uv.y*160.0+t*2.2)*(0.5+0.5*noise(vec2(uv.x*20.0,t*0.5)));\n  vec4 base=texture2D(u_texture,suv);\n  vec3 ref=texture2D(u_referenceLight,uv).rgb;\n  vec3 light=mix(texture2D(u_lightA,uv).rgb,texture2D(u_lightB,uv).rgb,u_alpha);\n  vec3 ratio=clamp((light+0.04)/(ref+0.04),vec3(0.78),vec3(1.22));\n  vec3 col=base.rgb*mix(vec3(1.0),ratio,u_strength);\n  // four lanterns, each with its own flame\n  vec2 L0=vec2(0.066,0.14),L1=vec2(0.273,0.296),L2=vec2(0.726,0.296),L3=vec2(0.932,0.14);\n  float f0=flame(t,1.0),f1=flame(t*1.07,7.0),f2=flame(t*0.93,13.0),f3=flame(t*1.11,19.0);\n  vec2 asp=vec2(1.777,1.0);\n  float d0=length((uv-L0)*asp),d1=length((uv-L1)*asp),d2=length((uv-L2)*asp),d3=length((uv-L3)*asp);\n  // relight the painting by each lamp's flame (its own pool of wall and floor)\n  float reach=exp(-d0*d0*9.0)*(f0-1.0)+exp(-d1*d1*14.0)*(f1-1.0)+exp(-d2*d2*14.0)*(f2-1.0)+exp(-d3*d3*9.0)*(f3-1.0);\n  col*=1.0+0.9*reach;\n  vec3 warm=vec3(1.0,0.55,0.2);\n  float halo=exp(-d0*d0*260.0)*f0+exp(-d1*d1*420.0)*f1+exp(-d2*d2*420.0)*f2+exp(-d3*d3*260.0)*f3;\n  float bloom=exp(-d0*d0*40.0)*f0+exp(-d1*d1*70.0)*f1+exp(-d2*d2*70.0)*f2+exp(-d3*d3*40.0)*f3;\n  col+=warm*(halo*0.35+bloom*0.06);\n  // reflections of the lamps in the wet floor follow their flames\n  float r0=exp(-pow((uv.x-L0.x)*7.0,2.0))*f0,r1=exp(-pow((uv.x-L1.x)*12.0,2.0))*f1,r2=exp(-pow((uv.x-L2.x)*12.0,2.0))*f2,r3=exp(-pow((uv.x-L3.x)*7.0,2.0))*f3;\n  float streak=(r0+r1+r2+r3)*floorMask*(0.6+0.4*noise(vec2(uv.x*40.0,uv.y*90.0-t*0.8)));\n  col+=warm*streak*0.07*smoothstep(0.0,0.4,dot(base.rgb,vec3(0.33)));\n  // haze in the depth of the gallery, breathing darkness at the far wall\n  float corridor=smoothstep(0.2,0.0,abs(uv.x-0.5)-0.15)*smoothstep(0.12,0.3,uv.y)*(1.0-smoothstep(0.5,0.6,uv.y));\n  float breath=0.5+0.5*sin(t*0.23); breath=mix(0.5,breath,u_motion);\n  col*=1.0-corridor*0.22*breath;\n  float hz=fbm(vec2(uv.x*4.0+t*0.03,uv.y*6.0-t*0.02));\n  col=mix(col,vec3(0.32,0.24,0.18),corridor*hz*0.18);\n  // creeping floor fog (skipped in low quality)\n  if(u_low<0.5){\n    float fogBand=smoothstep(0.42,0.56,uv.y)*(1.0-smoothstep(0.72,0.78,uv.y));\n    float fog=fbm(vec2(uv.x*2.6-t*0.035,uv.y*7.0+t*0.012))*fbm(vec2(uv.x*1.3+t*0.02,uv.y*3.0));\n    col=mix(col,vec3(0.5,0.42,0.36)*(0.8+0.25*(f1+f2)*0.5),fogBand*fog*0.45);\n  }\n  // dust motes lit near the lamps\n  vec2 g=uv*vec2(90.0,50.0); g.y+=t*0.25*u_motion; g.x+=sin(t*0.4+uv.y*8.0)*0.5*u_motion;\n  vec2 cell=floor(g),fp=fract(g)-0.5; float h=hash(cell); vec2 o=vec2(hash(cell+3.1),hash(cell+7.7))-0.5;\n  float mote=step(0.9,h)*smoothstep(0.1,0.0,length(fp-o*0.6))*(0.6+0.4*sin(t*(1.0+h*3.0)+h*40.0));\n  col+=vec3(1.0,0.8,0.55)*mote*clamp(bloom*1.4,0.0,1.0)*0.8;\n  // vignette and grain\n  vec2 v=uv-0.5; v.x*=1.2; col*=mix(0.6,1.0,smoothstep(0.85,0.3,length(v)));\n  col+=(hash(uv*900.0+fract(t*23.0)*37.0)-0.5)*0.035*u_motion;\n  gl_FragColor=vec4(col,base.a)*v_color;\n}");
        if(!shader.isCompiled())throw new IllegalStateException(shader.getLog());
    }
    private double time;
    /** reduced motion freezes the room at a calm frame; low quality drops the floor fog */
    public boolean reducedMotion,lowQuality;
    public void update(float delta){timeline.update(delta);if(Float.isFinite(delta)&&delta>0)time=(time+delta)%3600;}
    /** Host batch must be outside begin/end. Restore its shader before shelf/UI submission. */
    public void draw(SpriteBatch batch,float width,float height){
        var previous=batch.getShader();batch.setShader(shader);
        lighting[0].bind(1);lighting[timeline.current()].bind(2);lighting[timeline.next()].bind(3);Gdx.gl.glActiveTexture(GL20.GL_TEXTURE0);
        batch.begin();shader.setUniformi("u_referenceLight",1);shader.setUniformi("u_lightA",2);shader.setUniformi("u_lightB",3);shader.setUniformf("u_alpha",timeline.alpha());shader.setUniformf("u_strength",settings.lightingStrength);shader.setUniformf("u_time",reducedMotion?7.5f:(float)time);shader.setUniformf("u_motion",reducedMotion?0f:1f);shader.setUniformf("u_low",lowQuality?1f:0f);
        float scale=coverScale(width,height,frames[0].getWidth(),frames[0].getHeight());float w=frames[0].getWidth()*scale,h=frames[0].getHeight()*scale;
        batch.setColor(settings.brightness,settings.brightness,settings.brightness,1);batch.draw(frames[0],(width-w)*.5f,0,w,h);batch.end();batch.setColor(Color.WHITE);batch.setShader(previous);
    }
    public static float coverScale(float width,float height,float textureWidth,float textureHeight){return Math.max(width/textureWidth,height/textureHeight);}
    @Override public void dispose(){shader.dispose();}
}
