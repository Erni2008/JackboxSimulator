package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.glutils.ShaderProgram;
import com.erni.finalanswer.ui.UiFonts;

/** Screen-owned resources, allocated once. Two type families; no per-frame textures or shaders. */
final class VotingResources implements AutoCloseable {
    final BitmapFont heading,name,body,caption;
    final float fontScale;
    final Texture pixel;
    final ShaderProgram opaquePaper;
    VotingResources(){
        float density=Math.max(1,Math.min(2,com.badlogic.gdx.Gdx.graphics.getBackBufferWidth()/(float)Math.max(1,com.badlogic.gdx.Gdx.graphics.getWidth())));
        fontScale=1/density;heading=UiFonts.question(Math.round(76*density));name=UiFonts.body(Math.round(32*density));body=UiFonts.body(Math.round(28*density));caption=UiFonts.body(Math.round(20*density));
        Pixmap map=new Pixmap(1,1,Pixmap.Format.RGBA8888);map.setColor(Color.WHITE);map.fill();pixel=new Texture(map);map.dispose();
        opaquePaper=new ShaderProgram("""
            attribute vec4 a_position; attribute vec4 a_color; attribute vec2 a_texCoord0;
            uniform mat4 u_projTrans; varying vec4 v_color; varying vec2 v_texCoords;
            void main(){v_color=a_color;v_color.a*=255.0/254.0;v_texCoords=a_texCoord0;gl_Position=u_projTrans*a_position;}
            """, """
            #ifdef GL_ES
            precision mediump float;
            #endif
            varying vec4 v_color; varying vec2 v_texCoords; uniform sampler2D u_texture;
            void main(){vec4 texel=texture2D(u_texture,v_texCoords);
              // The supplied paper's intact interior is 252–254 alpha. Keep torn edges/holes.
              float coverage=texel.a>=0.94?1.0:texel.a;
              gl_FragColor=vec4(texel.rgb*v_color.rgb,coverage*v_color.a);}
            """);
        if(!opaquePaper.isCompiled()){String log=opaquePaper.getLog();close();throw new IllegalStateException("Voting parchment shader: "+log);}
    }
    @Override public void close(){heading.dispose();name.dispose();body.dispose();caption.dispose();pixel.dispose();opaquePaper.dispose();}
}
