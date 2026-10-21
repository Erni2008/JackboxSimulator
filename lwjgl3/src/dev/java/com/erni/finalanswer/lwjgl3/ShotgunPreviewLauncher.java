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
        configuration.setWindowedMode(1440,900);configuration.setBackBufferConfig(8,8,8,8,24,8,0);configuration.disableAudio(Boolean.getBoolean("shotgun.qa")&&!Boolean.getBoolean("shotgun.audioQA"));configuration.setForegroundFPS(60);
        boolean qa=Boolean.getBoolean("shotgun.qa");
        new Lwjgl3Application(new Game(){
            private ShotgunPreviewScreen preview;private int step;private float age;private boolean flashShot,ejectionShot,loadingShot;
            @Override public void create(){
                try{preview=new ShotgunPreviewScreen(Gdx.files.internal(ShotgunConfig.PATH),Gdx.files.absolute(System.getProperty("shotgun.config")));setScreen(preview);
                    if(qa){preview.config().audioVolume=0;if(Boolean.getBoolean("shotgun.audioQA")&&!preview.audioAvailable())throw new AssertionError("Native audio backend or decoded clips unavailable");if(!preview.shotgun().complete())throw new AssertionError("Four GLB assets must load");checkHierarchy();preview.inspectPart(0);preview.highlight(true);}}
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
                if(!rig.bodyPrepared()||!rig.mechanismReady()||!rig.rendered(1)||!rig.rendered(2))throw new AssertionError("Prepared BODY mechanism unavailable");
                // The prepared body has actual empty space at the authored port, rather than an overlay.
                for(var mesh:rig.model(0).model.meshes){
                    float[] data=new float[mesh.getNumVertices()*mesh.getVertexSize()/4];mesh.getVertices(data);
                    int stride=mesh.getVertexSize()/4,offset=mesh.getVertexAttributes().findByUsage(com.badlogic.gdx.graphics.VertexAttributes.Usage.Position).offset/4;
                    for(int v=0;v+stride*2<data.length;v+=stride*3){
                        boolean strictlyInside=true;
                        for(int axis=0;axis<3;axis++){float center=(data[v+offset+axis]+data[v+stride+offset+axis]+data[v+stride*2+offset+axis])/3;
                            if(center<=cfg.preparation.portMin[axis]+.00001f||center>=cfg.preparation.portMax[axis]-.00001f)strictlyInside=false;}
                        if(strictlyInside)throw new AssertionError("BODY still closes the ejection port");
                    }
                }
                rig.animator.resetShotgun();rig.animator.chamber(ShotgunAnimator.Chamber.SPENT);rig.cycle();rig.update(cfg.pumpDuration*cfg.ejectionAt+.000001f);
                var shellBounds=new com.badlogic.gdx.math.collision.BoundingBox();rig.ejectedShell().calculateBoundingBox(shellBounds);shellBounds.mul(rig.ejectedShell().transform);
                var boltBounds=new com.badlogic.gdx.math.collision.BoundingBox();rig.model(2).calculateBoundingBox(boltBounds);boltBounds.mul(rig.model(2).transform);
                if(shellBounds.min.x<boltBounds.max.x-.001f||shellBounds.min.x<cfg.preparation.portMin[0]-.001f||shellBounds.max.x>cfg.preparation.portMax[0]+.001f||shellBounds.min.y<cfg.preparation.portMin[1]-.001f||shellBounds.max.y>cfg.preparation.portMax[1]+.001f)throw new AssertionError("Ejection does not fit the opened port");
                var position=new com.badlogic.gdx.math.Vector3(cfg.shell.anchor).mul(rig.ejectedShell().transform);
                var start=new com.badlogic.gdx.math.Vector3(cfg.ejectionSocket);float age0=rig.animator.ejectionAge();
                rig.transform.translate(5,0,0);rig.update(.1f);
                var centerAfter=new com.badlogic.gdx.math.Vector3(cfg.shell.anchor).mul(rig.ejectedShell().transform);
                float age1=rig.animator.ejectionAge();start.mulAdd(new com.badlogic.gdx.math.Vector3(cfg.ejectionVelocity),age1);start.y-=.5f*cfg.ejectionGravity*age1*age1;
                if(!centerAfter.epsilonEquals(start,.0001f))throw new AssertionError("Ejected shell follows the gun or spins around the wrong origin");
                rig.transform.idt();rig.animator.resetShotgun();rig.update(0);
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
                rig.animator.chamber(ShotgunAnimator.Chamber.EMPTY);rig.animator.playReloadAnimation();rig.update(5);rig.getRenderables(renderables,pool);
                if(renderables.size!=hidden)throw new AssertionError("Loaded shell still intersects receiver visually");pool.freeAll(renderables);
                rig.animator.resetShotgun();rig.update(0);
            }
            private void shot(String name){var image=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("shotgun.output")+"/"+name+".png"),image,-1,true);}finally{image.dispose();}}
            @Override public void render(){
                if(failure!=null)return;
                try{if(qa)preview.render(1f/60);else super.render();if(!qa)return;
                    if(Gdx.gl.glGetError()!=GL20.GL_NO_ERROR)throw new AssertionError("OpenGL error");
                    age+=1f/60;
                    var gun=preview.shotgun();var animator=gun.animator;
                    if(step<4&&age>.3f){
                        shot("source-"+step);step++;age=0;
                        if(step<4)preview.inspectPart(step);
                        else{preview.highlight(false);preview.keyDown(Input.Keys.TAB);preview.keyDown(Input.Keys.R);preview.keyDown(Input.Keys.ENTER);
                            if(animator.chamber()!=ShotgunAnimator.Chamber.SPENT)throw new AssertionError("Preview trigger failed");}
                    }else if(step==4){
                        if(!flashShot&&animator.flash()>0){shot("firing-flash-recoil");flashShot=true;}
                        if(age>.35f){if(!flashShot)throw new AssertionError("Muzzle flash not rendered");preview.keyDown(Input.Keys.P);step=5;age=0;}
                    }else if(step==5){
                        if(!ejectionShot&&animator.ejecting()&&animator.ejectionAge()>.12f){
                            if(animator.bolt()<.4f)throw new AssertionError("Case ejected through a closed port");
                            shot("ejection-open-port");ejectionShot=true;
                        }
                        if(age>1.1f){if(!ejectionShot||animator.chamber()!=ShotgunAnimator.Chamber.EMPTY)throw new AssertionError("Spent case was not ejected");preview.keyDown(Input.Keys.L);step=6;age=0;}
                    }else if(step==6){
                        if(!loadingShot&&animator.shellState()==ShotgunAnimator.ShellState.MOVING){shot("reload-cartridge");loadingShot=true;}
                        if(age>2.1f){if(!loadingShot||!gun.readyToFire())throw new AssertionError("Reload did not return to ready");preview.viewDirection(0,0,1);step=7;age=0;}
                    }else if(step==7&&age>.2f){shot("assembled-closed");preview.keyDown(Input.Keys.O);step=8;age=0;}
                    else if(step==8&&age>.4f){shot("assembled-open");preview.keyDown(Input.Keys.C);step=9;age=0;}
                    else if(step==9&&age>.4f){shot("assembled-closed-again");preview.keyDown(Input.Keys.F5);step=10;age=0;}
                    else if(step==10&&age>4){
                        if(!gun.readyToFire())throw new AssertionError("Full cinematic demo did not finish ready");
                        shot("demo-finished");preview.viewDirection(0,0,-1);step=11;age=0;
                    }else if(step==11&&age>.2f){shot("assembly-reverse");preview.viewDirection(0,1,0);step=12;age=0;}
                    else if(step==12&&age>.2f){
                        shot("assembly-top");Gdx.app.log("Shotgun","PASS: source-preserving prepared BODY, real port, one wooden pump, full fire/recoil/flash/cycle/ejection/reload demo, chamber rules, parent-local motion, GL and texture cleanup checks");Gdx.app.exit();
                    }
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
