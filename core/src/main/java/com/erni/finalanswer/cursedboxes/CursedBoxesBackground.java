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
            "#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec4 v_color; varying vec2 v_texCoords; uniform sampler2D u_texture,u_referenceLight,u_lightA,u_lightB; uniform float u_alpha,u_strength; void main(){vec4 base=texture2D(u_texture,v_texCoords);vec3 ref=texture2D(u_referenceLight,v_texCoords).rgb;vec3 light=mix(texture2D(u_lightA,v_texCoords).rgb,texture2D(u_lightB,v_texCoords).rgb,u_alpha);vec3 ratio=clamp((light+0.04)/(ref+0.04),vec3(0.78),vec3(1.22));gl_FragColor=vec4(base.rgb*mix(vec3(1.0),ratio,u_strength),base.a)*v_color;}");
        if(!shader.isCompiled())throw new IllegalStateException(shader.getLog());
    }
    public void update(float delta){timeline.update(delta);}
    /** Host batch must be outside begin/end. Restore its shader before shelf/UI submission. */
    public void draw(SpriteBatch batch,float width,float height){
        var previous=batch.getShader();batch.setShader(shader);
        lighting[0].bind(1);lighting[timeline.current()].bind(2);lighting[timeline.next()].bind(3);Gdx.gl.glActiveTexture(GL20.GL_TEXTURE0);
        batch.begin();shader.setUniformi("u_referenceLight",1);shader.setUniformi("u_lightA",2);shader.setUniformi("u_lightB",3);shader.setUniformf("u_alpha",timeline.alpha());shader.setUniformf("u_strength",settings.lightingStrength);
        float scale=coverScale(width,height,frames[0].getWidth(),frames[0].getHeight());float w=frames[0].getWidth()*scale,h=frames[0].getHeight()*scale;
        batch.setColor(settings.brightness,settings.brightness,settings.brightness,1);batch.draw(frames[0],(width-w)*.5f,0,w,h);batch.end();batch.setColor(Color.WHITE);batch.setShader(previous);
    }
    public static float coverScale(float width,float height,float textureWidth,float textureHeight){return Math.max(width/textureWidth,height/textureHeight);}
    @Override public void dispose(){shader.dispose();}
}
