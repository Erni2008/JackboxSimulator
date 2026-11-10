package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.finalsecond.FinalSecondScene;
import com.erni.finalanswer.ui.effects.CinematicPost;

/**
 * THE FINAL SECOND — milestone 1 visual preview. Loops a demo round: the readout counts up from 00,00 for three seconds,
 * goes dark (the clock keeps running, measured with System.nanoTime), SPACE presses the big red button and shows the
 * stopped time. {@code -Dfs.capture=dir} writes frames (visible / hidden / pressed) and exits.
 */
public final class FinalSecondPreview {
    public static void main(String[] args){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / THE FINAL SECOND / preview");c.setWindowedMode(1600,900);c.setForegroundFPS(60);c.disableAudio(true);
        String cap=System.getProperty("fs.capture","");
        new Lwjgl3Application(new ApplicationAdapter(){
            SpriteBatch batch;FinalSecondScene scene;CinematicPost post;OrthographicCamera cam=new OrthographicCamera();FitViewport vp;
            long start;float stopped=-1,wall;int shot;
            @Override public void create(){batch=new SpriteBatch();scene=new FinalSecondScene();post=new CinematicPost();post.look.bloom=.35f;vp=new FitViewport(1920,1080,cam);start=System.nanoTime();}
            @Override public void resize(int w,int h){vp.update(w,h,true);}
            float elapsed(){return (System.nanoTime()-start)/1e9f;}
            @Override public void render(){
                float dt=Math.min(Gdx.graphics.getDeltaTime(),1/30f);wall+=dt;scene.update(dt);post.update(dt);
                if(Gdx.input.isKeyJustPressed(Input.Keys.SPACE)&&stopped<0){stopped=elapsed();scene.press();}
                if(stopped>=0&&elapsed()-stopped>4||elapsed()>14){start=System.nanoTime();stopped=-1;}
                float t=stopped>=0?stopped:elapsed();
                String shown=stopped>=0?fmt(stopped):t<3?fmt(t):null;
                ScreenUtils.clear(0,0,0,1);vp.apply();post.beginFrame();batch.setProjectionMatrix(cam.combined);batch.begin();
                scene.draw(batch,"7,00",shown,.16f);batch.end();post.endFrame();
                if(!cap.isEmpty()){
                    if(shot==0&&wall>1.9f){grab("1-visible");shot++;}
                    else if(shot==1&&wall>5f){grab("2-hidden");shot++;stopped=6.98f;scene.press();}
                    else if(shot==2&&wall>5.1f){grab("3-pressing");shot++;}
                    else if(shot==3&&wall>6.5f){grab("4-stopped");Gdx.app.exit();}}
            }
            String fmt(float s){int cs=Math.min(9999,Math.round(s*100));return String.format("%02d,%02d",cs/100,cs%100);}
            void grab(String n){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(cap+"/"+n+".png"),p,-1,true);}finally{p.dispose();}}
            @Override public void dispose(){batch.dispose();scene.dispose();post.dispose();}
        },c);
    }
}
