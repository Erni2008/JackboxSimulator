package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.forgottenroom3d.RoomRenderer3D;

/**
 * THE FORGOTTEN ROOM 3D — milestone 1 preview: the study rendered in the real libGDX/gdx-gltf pipeline from the fixed
 * camera. {@code -Droom3d.capture=dir} writes one frame and exits; otherwise the window stays open and logs FPS.
 */
public final class ForgottenRoom3DPreview {
    public static void main(String[] args){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / THE FORGOTTEN ROOM / 3D room");c.setWindowedMode(1600,900);
        c.setBackBufferConfig(8,8,8,8,24,0,4);c.setForegroundFPS(60);c.disableAudio(true);
        String capture=System.getProperty("room3d.capture","");
        new Lwjgl3Application(new ApplicationAdapter(){
            RoomRenderer3D room;com.erni.finalanswer.ui.effects.CinematicPost post;float t,sec,ms;int frames;
            @Override public void create(){room=new RoomRenderer3D();post=new com.erni.finalanswer.ui.effects.CinematicPost();post.look.bloom=.25f;post.look.vignette=.25f;post.look.grain=.025f;}
            @Override public void resize(int w,int h){room.resize(Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());}
            @Override public void render(){
                float dt=Gdx.graphics.getDeltaTime();t+=dt;long t0=System.nanoTime();
                post.update(dt);post.beginFrame();room.render(dt);post.endFrame();Gdx.gl.glFinish();ms+=(System.nanoTime()-t0)/1e6f;frames++;
                if((sec+=dt)>=1){Gdx.app.log("Room3D",String.format("FPS %d  frame %.1f ms",Gdx.graphics.getFramesPerSecond(),ms/frames));sec=0;ms=0;frames=0;}
                if(!capture.isEmpty()&&t>1.5f){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    try{PixmapIO.writePNG(Gdx.files.absolute(capture+"/room3d.png"),p,-1,true);}finally{p.dispose();}Gdx.app.exit();}
            }
            @Override public void dispose(){room.dispose();post.dispose();}
        },c);
    }
}
