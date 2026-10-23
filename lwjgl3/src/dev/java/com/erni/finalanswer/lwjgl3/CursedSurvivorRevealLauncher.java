package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.cursedboxes.*;
import com.finalanswer.protocol.CursedSurvivorTimeline;

/** Isolated local fixture; never joins a room or changes multiplayer scores. F8 cycles survivor counts. */
public final class CursedSurvivorRevealLauncher {
    private static Throwable failure;
    private static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    public static void main(String[] args){
        com.erni.finalanswer.lwjgl3.display.DesktopBorderless.install();
        var cfg=new Lwjgl3ApplicationConfiguration();cfg.setTitle("FINAL ANSWER — SURVIVOR REVEAL");cfg.setWindowedMode(1280,800);
        boolean qa=Boolean.getBoolean("cursed.survivorQA");cfg.useVsync(!qa);cfg.setForegroundFPS(qa?0:60);
        new Lwjgl3Application(new Game(){
            CursedBoxesScreen scene;CursedBoxesPerformanceCheck.AuditGL audit;
            final int[] counts={0,1,3,5,8};int test=-1,frames,textures,models,current=-1;float finishedAge;
            long starts,ends,hearts;
            boolean done,rendering,capturedFade;double maxCpu,totalCpu;long measured;
            void capture(String name){if(!Boolean.getBoolean("cursed.survivorCaptures"))return;Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("cursed.survivorOutput")+"/"+name+".png"),p,-1,true);}finally{p.dispose();}}
            @Override public void create(){try{
                if(qa){audit=new CursedBoxesPerformanceCheck.AuditGL();Gdx.graphics.setGL20(audit);Gdx.gl=Gdx.gl20=audit;}
                setScreen(new CursedBoxesLoadingScreen(s->{scene=s;setScreen(s);if(!qa)scene.developerSurvivors(5);},()->Gdx.app.exit()));
            }catch(Throwable t){failure=t;Gdx.app.exit();}}
            void next(){
                test++;if(test==counts.length){done=true;Gdx.app.log("Survivor reveal","PASS: 0/1/3/5/8 survivors, individual panels, preserved damage/eliminated representation, eight animated identities, permanent reveals, reset, zero cold GPU resources; CPU mean="+(totalCpu/Math.max(1,measured))+" ms max="+maxCpu+" ms");Gdx.app.exit();return;}
                starts=scene.sounds().playCount(CursedBoxesSoundManager.Cue.REVEAL_START);ends=scene.sounds().playCount(CursedBoxesSoundManager.Cue.APPEARANCE_2);hearts=scene.sounds().playCount(CursedBoxesSoundManager.Cue.HEARTBEAT);
                check(scene.developerSurvivors(counts[test]),"Fixture start");current=-1;capturedFade=false;finishedAge=0;
                check(scene.survivorTimeline().count()==counts[test],"Exact survivor count");
            }
            @Override public void render(){if(done||failure!=null||rendering)return;rendering=true;try{
                if(scene==null||!qa){super.render();return;}
                if(test<0){scene.sounds().levels.master=.12f;check(scene.sounds().loaded()==CursedBoxesSoundManager.cueCount(),"All original and additional WAVs preloaded");scene.slots[0].state=CrateSlot.State.DAMAGED;scene.slots[15].character=CursedCharacterType.VOODOO;scene.slots[15].occupantNickname="Already revealed / excluded";scene.networkReveal(15);textures=Texture.getNumManagedTextures();models=scene.loadedModels();next();}
                audit.clear();long start=System.nanoTime();scene.render(1f/60);double cpu=(System.nanoTime()-start)/1e6;maxCpu=Math.max(maxCpu,cpu);totalCpu+=cpu;measured++;frames++;
                check(Gdx.gl.glGetError()==GL20.GL_NO_ERROR,"OpenGL error");
                check(audit.compiles==0&&audit.uploads==0&&audit.staticBuffers==0,"Cold shader/texture/static mesh during reveal: "+audit.compiles+"/"+audit.uploads+"/"+audit.staticBuffers);
                check(Texture.getNumManagedTextures()==textures&&scene.loadedModels()==models,"Resource growth");
                check(scene.slots[0].state==CrateSlot.State.DAMAGED,"Damaged survivor repaired");
                check(scene.slots[15].state==CrateSlot.State.DESTROYED&&!scene.slots[15].survivorOpening&&scene.characterState(15)==CursedCharacterController.State.REVEALED,"Eliminated representation removed or included");
                var clock=scene.survivorTimeline();
                for(CrateSlot box:scene.slots){
                    if(!clock.eligible(box.id))check(!box.survivorOpening&&box.survivorPanelOpacity==1,"Unrelated panel changed");
                    else if(clock.localAge(box.id)>clock.timings.anticipation+clock.timings.smoke+clock.timings.panel)check(box.survivorOpening&&box.survivorPanelOpacity==0,"Panel restored");
                }
                if(clock.currentBox()!=current){current=clock.currentBox();capturedFade=false;}
                if(current>=0&&!capturedFade&&clock.state()==CursedSurvivorTimeline.State.PANEL_FADING&&clock.panelOpacity(current)<.55f){capture(counts[test]+"-survivors-box-"+current+"-fading");capturedFade=true;}
                if(clock.state()==CursedSurvivorTimeline.State.COMPLETED){finishedAge+=1f/60;if(finishedAge>1){check(scene.sounds().playCount(CursedBoxesSoundManager.Cue.REVEAL_START)-starts==counts[test]&&scene.sounds().playCount(CursedBoxesSoundManager.Cue.APPEARANCE_2)-ends==counts[test],"Exactly one start and visible cue per survivor");check(scene.sounds().playCount(CursedBoxesSoundManager.Cue.HEARTBEAT)-hearts==counts[test]&&!scene.sounds().heartbeatActive(),"Single heartbeat per anticipation, stopped at completion");capture(counts[test]+"-survivors-complete");
                    scene.hide();scene.show();
                    check(scene.survivorTimeline()==clock&&clock.state()==CursedSurvivorTimeline.State.COMPLETED,"Scene reentry reset the reveal clock");
                    for(CrateSlot box:scene.slots)if(clock.eligible(box.id)){box.revealPanel(1);check(box.survivorOpening&&box.survivorPanelOpacity==0,"Opened front was restored by reentry or a stale fade");}
                    scene.render(1f/60);next();}}
                if(frames>6000)throw new AssertionError("Reveal test timed out");
            }catch(Throwable t){failure=t;Gdx.app.exit();}finally{rendering=false;}}
            @Override public void dispose(){super.dispose();if(scene!=null)scene.dispose();if(qa&&Texture.getNumManagedTextures()!=0)failure=new AssertionError("Survivor texture leak "+Texture.getNumManagedTextures());}
        },cfg);
        if(failure!=null)throw new AssertionError("Survivor native QA failed",failure);
    }
}
