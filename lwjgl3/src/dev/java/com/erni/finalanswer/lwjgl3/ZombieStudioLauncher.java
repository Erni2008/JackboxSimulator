package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.lobby.cages.*;

/** Original PNG assembly and five appearance beats, without gate occlusion. */
public final class ZombieStudioLauncher {
    public static void main(String[] args) {
        if(StartupHelper.startNewJvmIfRequired()) return;
        var config=new Lwjgl3ApplicationConfiguration();
        config.setTitle("Zombie studio — N neutral / R reappear / ESC close");
        config.setWindowedMode(1440,900); config.disableAudio(true); config.setForegroundFPS(60);
        new Lwjgl3Application(new ApplicationAdapter() {
            SpriteBatch batch; BitmapFont font; ZombieAssets assets; ZombieCharacter[] zombies;
            final FitViewport viewport=new FitViewport(1440,900);
            final boolean check=Boolean.getBoolean("zombie.studio.check");
            float elapsed; int shot; boolean neutral=true;
            final float[] captures={.016f,.25f,.65f,1.02f,1.55f,2.19f,2.25f,6,10};
            @Override public void create() { batch=new SpriteBatch(); font=UiFonts.body(22); assets=new ZombieAssets(); reset(); }
            void reset() { zombies=new ZombieCharacter[8]; for(int i=0;i<8;i++) zombies[i]=new ZombieCharacter(assets); elapsed=0; }
            @Override public void render() {
                float dt=check?1f/60:Math.min(.1f,Gdx.graphics.getDeltaTime());
                if(Gdx.input.isKeyJustPressed(Input.Keys.R)) { reset(); neutral=false; }
                if(Gdx.input.isKeyJustPressed(Input.Keys.N)) neutral=!neutral;
                if(Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) Gdx.app.exit();
                elapsed+=dt;
                ScreenUtils.clear(.065f,.075f,.09f,1); viewport.apply();
                batch.setProjectionMatrix(viewport.getCamera().combined); batch.begin();
                for(int i=0;i<8;i++) {
                    if(!neutral || check&&shot>0) zombies[i].advance(dt,i*2.39996f,false);
                    float x=i==0?345:850+(i%3)*190, y=i==0?125:100+(i/3)*235, scale=i==0?4.2f:1.2f;
                    if(neutral && (!check||shot==0)) zombies[i].drawNeutralAt(batch,x,y,scale,1);
                    else zombies[i].drawAt(batch,x,y,scale,1);
                }
                font.draw(batch,"ZOMBIE / "+(neutral&&(!check||shot==0)?"NEUTRAL":zombies[0].animator().state())+"     N neutral   R reappear",40,855);
                font.draw(batch,"Six unchanged PNGs / neck and shoulder pivots / grounded IK legs",40,52);
                batch.end();
                if(check&&shot<captures.length&&elapsed>=captures[shot]) {
                    var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("zombie.output")+"/studio-"+shot+".png"),pixels,-1,true);
                    pixels.dispose();shot++; if(shot==captures.length) Gdx.app.exit();
                }
            }
            @Override public void resize(int w,int h) { viewport.update(w,h,true); }
            @Override public void dispose() { batch.dispose();font.dispose();assets.dispose(); }
        },config);
    }
}
