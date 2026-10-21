package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.shotgun.*;

/** Development launcher and real-GL asset/animation smoke check. Never in production distributions. */
public final class ShotgunPreviewLauncher {
    private static Throwable failure;
    public static void main(String[] args){
        var configuration=new Lwjgl3ApplicationConfiguration();configuration.setTitle("Final Answer / Modular Shotgun / Developer Preview");
        configuration.setWindowedMode(1440,900);configuration.setBackBufferConfig(8,8,8,8,24,8,0);configuration.disableAudio(true);configuration.setForegroundFPS(60);
        boolean qa=Boolean.getBoolean("shotgun.qa");
        new Lwjgl3Application(new Game(){
            private ShotgunPreviewScreen preview;private int step;private float age;private boolean pumpRear;
            @Override public void create(){
                try{preview=new ShotgunPreviewScreen(Gdx.files.internal(ShotgunConfig.PATH),Gdx.files.absolute(System.getProperty("shotgun.config")));setScreen(preview);
                    if(qa){if(!preview.shotgun().complete())throw new AssertionError("Four GLB assets must load");checkHierarchy();preview.inspectPart(0);preview.highlight(true);}}
                catch(Throwable error){failure=error;Gdx.app.exit();}
            }
            private void checkHierarchy(){
                var rig=preview.shotgun();var cfg=preview.config();
                rig.transform.idt().translate(2,3,4).rotate(com.badlogic.gdx.math.Vector3.Y,90).scale(2,2,2);rig.update(0);
                var rest=rig.model(1).transform.getTranslation(new com.badlogic.gdx.math.Vector3());
                rig.animator.playPumpAnimation();rig.update(cfg.pumpDuration*.5f);
                var movement=rig.model(1).transform.getTranslation(new com.badlogic.gdx.math.Vector3()).sub(rest);
                var expected=new com.badlogic.gdx.math.Vector3(cfg.pumpDirection).nor().scl(cfg.pumpTravel).rot(rig.transform);
                if(!movement.epsilonEquals(expected,.0001f))throw new AssertionError("Local pump axis failed under rotated/scaled root");
                rig.animator.resetShotgun();rig.transform.idt();rig.update(0);
                // A real geometric regression: the source attachment follows the assembly target
                // without resizing the grip, and its swept X envelope stays on the magazine guide.
                var anchor=new com.badlogic.gdx.math.Vector3(cfg.pump.anchor).mul(rig.model(1).transform);
                if(!anchor.epsilonEquals(new com.badlogic.gdx.math.Vector3(cfg.pump.position),.0001f))throw new AssertionError("Pump attachment does not match target");
                var pumpBounds=new com.badlogic.gdx.math.collision.BoundingBox();
                rig.animator.playPumpAnimation();
                for(int sample=0;sample<=60;sample++){
                    rig.update(sample==0?0:cfg.pumpDuration/60f);
                    rig.model(1).calculateBoundingBox(pumpBounds);pumpBounds.mul(rig.model(1).transform);
                    if(pumpBounds.min.x<.148f||pumpBounds.max.x>.635f)throw new AssertionError("Pump leaves guide at pose "+sample+": "+pumpBounds);
                }
                rig.animator.resetShotgun();rig.update(0);
                for(int i=0;i<4;i++)for(var material:rig.model(i).materials){
                    if(!material.has(net.mgsx.gltf.scene3d.attributes.PBRTextureAttribute.BaseColorTexture))throw new AssertionError("Missing original base color texture");
                    if(!material.has(net.mgsx.gltf.scene3d.attributes.PBRTextureAttribute.NormalTexture))throw new AssertionError("Missing original normal map");
                }
                var dimensions=new com.badlogic.gdx.math.Vector3();
                float multiplier=cfg.shellScale;cfg.shellScale=1;rig.update(0);
                rig.model(3).calculateBoundingBox(pumpBounds);pumpBounds.mul(rig.model(3).transform);pumpBounds.getDimensions(dimensions);
                cfg.shellScale=multiplier;rig.update(0);
                rig.model(3).calculateBoundingBox(pumpBounds);pumpBounds.mul(rig.model(3).transform);
                var scaled=pumpBounds.getDimensions(new com.badlogic.gdx.math.Vector3());
                if(!scaled.epsilonEquals(dimensions.scl(multiplier),.00001f))throw new AssertionError("Shell uniform multiplier failed");
                var bodyBounds=new com.badlogic.gdx.math.collision.BoundingBox();rig.model(0).calculateBoundingBox(bodyBounds);bodyBounds.mul(rig.model(0).transform);
                if(bodyBounds.intersects(pumpBounds))throw new AssertionError("Enlarged shell intersects BODY at its shown start position");
                float[] pumpRest=rig.model(1).transform.val.clone(),boltRest=rig.model(2).transform.val.clone();
                for(int cycle=0;cycle<100;cycle++){rig.animator.playPumpAnimation();rig.update(cfg.pumpDuration+1);}
                if(!java.util.Arrays.equals(pumpRest,rig.model(1).transform.val)||!java.util.Arrays.equals(boltRest,rig.model(2).transform.val))throw new AssertionError("Mechanical transforms drift after 100 cycles");
                if(!rig.blocked(1)||!rig.blocked(2)||rig.rendered(1)||rig.rendered(2)||!rig.rendered(0))throw new AssertionError("Merged body must suppress duplicates without hiding BODY");
                preview.keyDown(Input.Keys.P);preview.keyDown(Input.Keys.L);
                if(rig.animator.isAnimating())throw new AssertionError("Preview falsely animates obstructed assembly");
                rig.inspection(1);if(!rig.rendered(1)||rig.rendered(0))throw new AssertionError("Inspection must show one independent source");rig.inspection(-1);
                var saved=Gdx.files.absolute(System.getProperty("shotgun.output")+"/qa-config.json");cfg.save(saved);
                var roundTrip=ShotgunConfig.load(saved);
                if(!java.util.Arrays.equals(cfg.pump.position,roundTrip.pump.position))throw new AssertionError("Alignment save/load failed");
                var renderables=new com.badlogic.gdx.utils.Array<com.badlogic.gdx.graphics.g3d.Renderable>();
                var pool=new com.badlogic.gdx.utils.Pool<com.badlogic.gdx.graphics.g3d.Renderable>(){
                    @Override protected com.badlogic.gdx.graphics.g3d.Renderable newObject(){return new com.badlogic.gdx.graphics.g3d.Renderable();}
                };
                rig.getRenderables(renderables,pool);int hidden=renderables.size;pool.freeAll(renderables);renderables.clear();
                rig.animator.showShell();rig.update(0);rig.getRenderables(renderables,pool);
                if(renderables.size<=hidden)throw new AssertionError("Visible shell not rendered");pool.freeAll(renderables);renderables.clear();
                rig.animator.playReloadAnimation();rig.update(5);rig.getRenderables(renderables,pool);
                if(renderables.size!=hidden)throw new AssertionError("Loaded shell still intersects receiver visually");pool.freeAll(renderables);
                rig.animator.resetShotgun();rig.update(0);
            }
            private void shot(String name){var image=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("shotgun.output")+"/"+name+".png"),image,-1,true);}finally{image.dispose();}}
            @Override public void render(){
                if(failure!=null)return;
                try{super.render();if(!qa)return;
                    if(Gdx.gl.glGetError()!=GL20.GL_NO_ERROR)throw new AssertionError("OpenGL error");
                    age+=Gdx.graphics.getDeltaTime();
                    if(step<4&&age>.35f){shot("source-"+step);step++;age=0;if(step<4)preview.inspectPart(step);else{
                        preview.highlight(false);preview.keyDown(Input.Keys.TAB);
                        preview.config().body.visible=false;preview.shotgun().update(0);
                        preview.keyDown(Input.Keys.P);
                        if(!preview.shotgun().animator.isAnimating())throw new AssertionError("Isolated independent mechanism cannot animate");
                    }}
                    else if(step==4){
                        if(age>.35f&&!pumpRear){shot("isolated-pump-back");pumpRear=true;}
                        if(age>1){if(preview.shotgun().animator.isAnimating()||preview.shotgun().animator.pump()!=0)throw new AssertionError("Pump did not settle");preview.shotgun().animator.playReloadAnimation();step++;age=0;}}
                    else if(step==5&&age>2.1f){
                        var a=preview.shotgun().animator;if(a.isAnimating()||a.shellState()!=ShotgunAnimator.ShellState.LOADED)throw new AssertionError("Reload did not finish");
                        shot("isolated-mechanism");preview.config().body.visible=true;
                        preview.shotgun().animator.showShell();preview.shotgun().update(0);preview.highlight(true);
                        preview.viewDirection(0,0,1);step=6;age=0;
                    }else if(step>=6&&age>.2f){
                        shot(step==6?"assembly-side":step==7?"assembly-reverse":"assembly-top");
                        if(step==6){preview.viewDirection(0,0,-1);step++;age=0;}
                        else if(step==7){preview.viewDirection(0,1,0);step++;age=0;}
                        else{Gdx.app.log("Shotgun","PASS: four textured GLBs, PBR render, isolated views, rotated parent/local travel, original PBR maps, blocked merged-body assembly, duplicate suppression, isolated pump/bolt cycling, uniform shell multiplier, config round-trip, reload/hidden shell, GL error check");Gdx.app.exit();}}
                }catch(Throwable error){failure=error;Gdx.app.exit();}
            }
            @Override public void dispose(){
                if(preview!=null){preview.dispose();preview.dispose();}
                if(qa&&preview!=null&&Texture.getNumManagedTextures()!=0){failure=new AssertionError("Shotgun resources leaked: "+Texture.getNumManagedTextures()+" vs 0");}
                else if(qa&&preview!=null)Gdx.app.log("Shotgun","PASS: all owned model, font, PBR and preview textures disposed; repeated disposal safe");
            }
        },configuration);
        if(failure!=null)throw new AssertionError("Shotgun preview check",failure);
    }
}
