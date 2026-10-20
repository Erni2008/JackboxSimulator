package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.g2d.Batch;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.utils.Array;
import com.badlogic.gdx.utils.Json;

/** Lobby-only framing and material tint. Animation rigs and shared artwork remain unchanged. */
public final class CageCharacterPresentation {
    public static final String PATH="lobby/character_presentation.json";
    public static final class Profile {
        public String id="";public float scale=1,pivotX=174,pivotY=68,x,y,brightness=1,growAt,growDuration;
        public float exposure=1,contrast=1,cageExposure,cageContrast;
        private float exposure(boolean cage){return cage&&cageExposure>0?cageExposure:exposure;}
        private float contrast(boolean cage){return cage&&cageContrast>0?cageContrast:contrast;}
        private transient ShaderProgram grading;
        private ShaderProgram shader(boolean cage){
            if(exposure(cage)==1 && contrast(cage)==1)return null;
            if(grading==null){
                grading=new ShaderProgram("""
                    attribute vec4 a_position;
                    attribute vec4 a_color;
                    attribute vec2 a_texCoord0;
                    uniform mat4 u_projTrans;
                    varying vec4 v_color;
                    varying vec2 v_texCoords;
                    void main(){v_color=a_color;v_color.a*=255.0/254.0;v_texCoords=a_texCoord0;gl_Position=u_projTrans*a_position;}
                    """, """
                    #ifdef GL_ES
                    precision mediump float;
                    #endif
                    varying vec4 v_color;
                    varying vec2 v_texCoords;
                    uniform sampler2D u_texture;
                    uniform float u_brightness;
                    uniform float u_contrast;
                    void main(){
                        vec4 c=v_color*texture2D(u_texture,v_texCoords);
                        float peak=max(c.r,max(c.g,c.b));
                        float lifted=pow(peak,1.0/u_contrast);
                        float mapped=u_brightness*lifted/(1.0+(u_brightness-1.0)*lifted);
                        gl_FragColor=vec4(c.rgb*(mapped/max(peak,0.00001)),c.a);
                    }
                    """);
                if(!grading.isCompiled()){String log=grading.getLog();grading.dispose();grading=null;throw new IllegalStateException("Character readability shader: "+log);}
            }
            return grading;
        }
        public void inverse(Vector2 point){point.set(pivotX+(point.x-pivotX-x)/scale,pivotY+(point.y-pivotY-y)/scale);}
    }
    public static final class Settings {
        public Array<Profile> profiles=new Array<>(Profile.class);
        private final Profile fallback=new Profile();
        public Profile profile(String id){for(int i=0;i<profiles.size;i++)if(profiles.get(i).id.equals(id))return profiles.get(i);return fallback;}
        public static Settings parse(String text){Settings settings=new Json().fromJson(Settings.class,text);var ids=new java.util.HashSet<String>();
            for(Profile p:settings.profiles){if(p.id.isBlank()||!ids.add(p.id))throw new IllegalArgumentException("Duplicate/empty character profile");
                for(float f:new float[]{p.scale,p.pivotX,p.pivotY,p.x,p.y,p.brightness,p.growAt,p.growDuration,p.exposure,p.contrast,p.cageExposure,p.cageContrast})if(!Float.isFinite(f))throw new IllegalArgumentException("Nonfinite character presentation");
                if(p.cageExposure<0||p.cageExposure>4||p.cageContrast<0||p.cageContrast>2)throw new IllegalArgumentException("Invalid cage tone curve");
                if(p.exposure<1||p.exposure>4||p.contrast<1||p.contrast>2)throw new IllegalArgumentException("Invalid character tone curve");
                if(p.growAt<0||p.growDuration<0||p.scale<=0||p.brightness<=0||p.brightness>1)throw new IllegalArgumentException("Invalid character scale/brightness");}
            return settings;}
        public void dispose(){for(Profile p:profiles)if(p.grading!=null){p.grading.dispose();p.grading=null;}}
        public static Settings load(){return parse(Gdx.files.internal(PATH).readString("UTF-8"));}
    }
    private final Matrix4 saved=new Matrix4(),framed=new Matrix4();private final Color color=new Color();
    public void draw(Batch batch,CageCharacter character,Profile p,float alpha,float time){render(batch,character,p,alpha,time,false);}
    public void drawInCage(Batch batch,CageCharacter character,Profile p,float alpha,float time){render(batch,character,p,alpha,time,true);}
    private void render(Batch batch,CageCharacter character,Profile p,float alpha,float time,boolean cage){
        saved.set(batch.getTransformMatrix());color.set(batch.getColor());
        int src=batch.getBlendSrcFunc(),dst=batch.getBlendDstFunc(),srcA=batch.getBlendSrcFuncAlpha(),dstA=batch.getBlendDstFuncAlpha();
        boolean blending=batch.isBlendingEnabled();var shader=batch.getShader();
        float amount=p.growDuration>0?CageAnimator.smooth(CageAnimator.progress(time,p.growAt,p.growDuration)):1;
        float scale=1+(p.scale-1)*amount;
        framed.set(saved).translate(p.pivotX+p.x*amount,p.pivotY+p.y*amount,0).scale(scale,scale,1).translate(-p.pivotX,-p.pivotY,0);
        try{ShaderProgram correction=p.shader(cage);batch.setShader(correction);if(correction!=null){batch.flush();correction.setUniformf("u_brightness",p.exposure(cage));correction.setUniformf("u_contrast",p.contrast(cage));}batch.enableBlending();batch.setBlendFunctionSeparate(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA,GL20.GL_ONE,GL20.GL_ONE_MINUS_SRC_ALPHA);batch.setTransformMatrix(framed);batch.setColor(color.r*p.brightness,color.g*p.brightness,color.b*p.brightness,color.a);character.draw(batch,alpha);}
        finally{batch.setShader(shader);batch.setBlendFunctionSeparate(src,dst,srcA,dstA);if(blending)batch.enableBlending();else batch.disableBlending();batch.setTransformMatrix(saved);batch.setColor(color);}
    }
}
