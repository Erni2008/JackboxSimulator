package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;
import com.erni.finalanswer.ui.lobby.cages.*;

/** Close inspection without cage bars; excluded from release source sets. */
public final class GhostStudioLauncher {
    public static void main(String[] args) {
        if(StartupHelper.startNewJvmIfRequired()) return;
        var config=new Lwjgl3ApplicationConfiguration();
        config.setTitle("Ghost studio — I idle / S scared / H hit / D death / F flip / R reset");
        config.setWindowedMode(1440,900); config.disableAudio(true); config.setForegroundFPS(60);
        new Lwjgl3Application(new ApplicationAdapter() {
            SpriteBatch batch; BitmapFont font; GhostAssets assets; GhostCharacter[] ghosts;
            final FitViewport viewport=new FitViewport(1440,900);
            final boolean check=Boolean.getBoolean("ghost.studio.check");
            float elapsed; int shot; boolean flip;
            final float[] captures={1,2.35f,3.3f,4.15f,4.75f,5.45f,6.3f,7};
            @Override public void create() { batch=new SpriteBatch();font=UiFonts.body(22);assets=new GhostAssets();reset(); }
            void reset() { ghosts=new GhostCharacter[8]; for(int i=0;i<8;i++) ghosts[i]=new GhostCharacter(assets); }
            void state(GhostAnimator.State state) { for(var ghost:ghosts) ghost.setState(state); }
            @Override public void render() {
                float dt=check?1f/60:Math.min(.1f,Gdx.graphics.getDeltaTime()); float before=elapsed;elapsed+=dt;
                if(Gdx.input.isKeyJustPressed(Input.Keys.R)) reset();
                if(Gdx.input.isKeyJustPressed(Input.Keys.F)) flip=!flip;
                if(Gdx.input.isKeyJustPressed(Input.Keys.I)) state(GhostAnimator.State.IDLE);
                if(Gdx.input.isKeyJustPressed(Input.Keys.S)||check&&before<2&&elapsed>=2) state(GhostAnimator.State.SCARED);
                if(Gdx.input.isKeyJustPressed(Input.Keys.H)||check&&before<3&&elapsed>=3) state(GhostAnimator.State.HIT);
                if(Gdx.input.isKeyJustPressed(Input.Keys.D)||check&&before<4&&elapsed>=4) state(GhostAnimator.State.DEATH);
                if(Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) Gdx.app.exit();
                ScreenUtils.clear(.065f,.075f,.09f,1);viewport.apply();batch.setProjectionMatrix(viewport.getCamera().combined);batch.begin();
                for(int i=0;i<8;i++) {
                    ghosts[i].advance(dt,i*.67f,false);
                    ghosts[i].drawAt(batch,i==0?370:850+(i%3)*190,i==0?460:220+(i/3)*235,i==0?3.7f:1.25f,i==0?flip:i%2==0,1);
                }
                font.draw(batch,"GHOST / "+ghosts[0].animator().state()+"     I idle   S scared   H hit   D death   F mirror   R reset",40,855);
                font.draw(batch,"Original transparent PNGs / shoulder pivots / pinned fabric / eye-only glow",40,52);
                batch.end();
                if(check&&shot<captures.length&&elapsed>=captures[shot]) {
                    var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("ghost.studio.output")+"/studio-"+shot+".png"),pixels,-1,true);pixels.dispose();shot++;
                    if(shot==captures.length) Gdx.app.exit();
                }
            }
            @Override public void resize(int w,int h) { viewport.update(w,h,true); }
            @Override public void dispose() { batch.dispose();font.dispose();assets.dispose(); }
        },config);
    }
}
