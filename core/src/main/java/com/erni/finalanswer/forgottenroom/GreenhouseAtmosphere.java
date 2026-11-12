package com.erni.finalanswer.forgottenroom;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.Disposable;

/** A locked-off living photograph. Only permanent foliage and emissive lamp pixels move; furniture stays fixed. */
final class GreenhouseAtmosphere implements Disposable {
    private static final float[][] LAMPS={{.071f,.17f,145},{.310f,.354f,85},{.460f,.403f,66},{.632f,.412f,68},{.848f,.389f,88}};
    private static final String VERT="""
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec2 a_texCoord0;
        uniform mat4 u_projTrans;
        varying vec4 v_color;
        varying vec2 v_uv;
        void main(){v_color=a_color;v_color.a*=255.0/254.0;v_uv=a_texCoord0;gl_Position=u_projTrans*a_position;}
        """;
    private static final String FRAG="""
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec4 v_color;
        varying vec2 v_uv;
        uniform sampler2D u_texture;
        uniform float u_time;
        uniform float u_motion;
        float oval(vec2 p,vec2 center,vec2 radius){return 1.0-smoothstep(.45,1.0,length((p-center)/radius));}
        float lamp(vec2 p,vec2 center,vec2 radius,float seed){
            float pulse=sin(u_time*2.1+seed)*.028+sin(u_time*4.7+seed*2.0)*.012;
            return oval(p,center,radius)*pulse;
        }
        void main(){
            vec2 uv=v_uv;
            vec3 original=texture2D(u_texture,uv).rgb;
            float greenery=smoothstep(.005,.04,min(original.g-original.r*.92,original.g-original.b*1.12));
            float leaves=max(oval(uv,vec2(.145,.22),vec2(.068,.33)),oval(uv,vec2(.51,.035),vec2(.48,.09)));
            leaves=max(leaves,oval(uv,vec2(.966,.84),vec2(.05,.15)));
            float wind=sin(u_time*.58+uv.y*17.0)+.32*sin(u_time*.97+uv.x*22.0);
            uv.x+=leaves*greenery*wind*.00072*u_motion;
            uv.y+=leaves*greenery*sin(u_time*.43+uv.x*14.0)*.00018*u_motion;
            vec4 c=texture2D(u_texture,clamp(uv,vec2(.0001),vec2(.9999)));
            float light=lamp(v_uv,vec2(.071,.17),vec2(.052,.105),1.0)
                +lamp(v_uv,vec2(.310,.354),vec2(.025,.064),2.7)
                +lamp(v_uv,vec2(.460,.403),vec2(.022,.049),4.2)
                +lamp(v_uv,vec2(.632,.412),vec2(.022,.049),5.8)
                +lamp(v_uv,vec2(.848,.389),vec2(.025,.06),7.1);
            c.rgb*=1.0+light*u_motion*smoothstep(.22,.75,max(c.r,max(c.g,c.b)));
            gl_FragColor=c*v_color;
        }
        """;
    private ShaderProgram shader;private boolean attempted;
    private float time;
    private static boolean reduced(){return Gdx.app.getApplicationListener() instanceof com.erni.finalanswer.FinalAnswerGame game&&game.getSettings().reducedMotion();}
    void update(float dt){if(!reduced())time+=Math.min(Math.max(0,dt),.1f);}
    void background(SpriteBatch batch,Texture background){
        if(!attempted){attempted=true;shader=new ShaderProgram(VERT,FRAG);
            if(!shader.isCompiled()){Gdx.app.error("GreenhouseAtmosphere",shader.getLog());shader.dispose();shader=null;}}
        ShaderProgram previous=batch.getShader();
        if(shader!=null){batch.setShader(shader);shader.setUniformf("u_time",reduced()?0:time);shader.setUniformf("u_motion",reduced()?0f:1f);}
        batch.setColor(Color.WHITE);batch.draw(background,0,0,1920,1080);
        if(shader!=null)batch.setShader(previous);
    }
    /** Soft overlapping sources, never a global exposure pulse. Draw behind the interactive models. */
    void light(SpriteBatch b,ForgottenRoomArt art){
        float time=reduced()?0:this.time;
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE);
        for(int i=0;i<LAMPS.length;i++){
            float[] p=LAMPS[i];float radius=p[2];float pulse=.88f+.07f*MathUtils.sin(time*2.1f+i*1.7f)+.025f*MathUtils.sin(time*4.7f+i*2.3f);
            b.setColor(1,.59f,.27f,.085f*pulse);b.draw(art.soft,p[0]*1920-radius,(1-p[1])*1080-radius,radius*2,radius*2);
            float core=i==0?19:9;b.setColor(1,.82f,.51f,.10f*pulse);b.draw(art.soft,p[0]*1920-core,(1-p[1])*1080-core,core*2,core*2);
        }
        // The moon illuminates the upper glazing, without moving the scene or adding a fog overlay.
        b.setColor(.51f,.68f,1,.043f+.005f*MathUtils.sin(time*.16f));b.draw(art.soft,1080,640,680,560);
        for(int i=0;i<3;i++){
            float width=56+i*25,alpha=.014f+.003f*MathUtils.sin(time*.24f+i*1.8f);
            b.setColor(.60f,.75f,1,alpha);
            b.draw(art.soft,1420+i*35,905-width/2,0,width/2,800+i*65,width,1,1,-133-i*3,0,0,art.soft.getWidth(),art.soft.getHeight(),false,false);
        }
        // Sparse dust in the upper light: stays above the furniture and every future object anchor.
        for(int i=0;i<22;i++){
            float x=700+(i*137%850)+MathUtils.sin(time*.16f+i*2.4f)*15;
            float y=705+(i*71%220)+MathUtils.sin(time*.12f+i*1.6f)*10;
            float a=.035f*(.5f+.5f*MathUtils.sin(time*.6f+i));
            float r=1.3f+(i%3)*.4f;b.setColor(.76f,.84f,1,a);b.draw(art.soft,x-r,y-r,r*2,r*2);
        }
        b.setBlendFunction(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);b.setColor(Color.WHITE);
    }
    @Override public void dispose(){if(shader!=null)shader.dispose();}
}
