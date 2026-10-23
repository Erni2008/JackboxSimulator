package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.cursedboxes.*;

/** Development source set only; interactive inspection or the real T sequence with GL captures. */
public final class CursedBoxesCharactersLauncher {
    private static Throwable failure;
    public static void main(String[] args){
        com.erni.finalanswer.lwjgl3.display.DesktopBorderless.install();
        boolean qa=Boolean.getBoolean("cursed.characterQA");
        boolean captures=Boolean.getBoolean("cursed.characterCaptures");
        boolean paced=Boolean.getBoolean("cursed.characterPaced");
        var cfg=new Lwjgl3ApplicationConfiguration();cfg.setTitle("CURSED BOXES — CHARACTER TEST");
        cfg.setWindowedMode(1280,800);cfg.useVsync(true);cfg.setForegroundFPS(60);cfg.setIdleFPS(15);
        new Lwjgl3Application(new Game(){
            CursedBoxesScreen demo;boolean rendering,finished,started;int models,textures,phase,frames;
            CursedBoxesPerformanceCheck.AuditGL audit;
            final java.util.concurrent.atomic.AtomicReference<Throwable> captureError=new java.util.concurrent.atomic.AtomicReference<>();
            final java.util.concurrent.ThreadPoolExecutor writer=captures?new java.util.concurrent.ThreadPoolExecutor(1,1,0,java.util.concurrent.TimeUnit.MILLISECONDS,new java.util.concurrent.ArrayBlockingQueue<>(4),task->{Thread thread=new Thread(task,"cursed-qa-png");thread.setDaemon(true);thread.setPriority(Thread.NORM_PRIORITY-1);return thread;}):null;
            final CursedBoxesPerformanceCheck.Report profile=new CursedBoxesPerformanceCheck.Report();
            final boolean[] previews=new boolean[9],impacts=new boolean[9],settled=new boolean[9];
            void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
            void capture(String name){
                if(!captures)return;
                long start=System.nanoTime();
                Pixmap pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                double readMs=(System.nanoTime()-start)/1e6;
                try{writer.execute(()->{long encode=System.nanoTime();try{
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("cursed.characterOutput")+"/"+name+".png"),pixels,1,true);
                    Gdx.app.log("Cursed QA capture",name+": readback "+Math.round(readMs)+" ms, background PNG "+Math.round((System.nanoTime()-encode)/1e6)+" ms");
                }catch(Throwable e){captureError.compareAndSet(null,e);}finally{pixels.dispose();}});}
                catch(RuntimeException e){pixels.dispose();throw e;}
            }
            @Override public void create(){try{
                if(qa){audit=new CursedBoxesPerformanceCheck.AuditGL();Gdx.graphics.setGL20(audit);Gdx.gl=Gdx.gl20=audit;}
                setScreen(new CursedBoxesLoadingScreen(scene->{demo=scene;setScreen(scene);},()->Gdx.app.exit(),true));
            }catch(Throwable e){failure=e;Gdx.app.exit();}}
            @Override public void render(){if(failure!=null||rendering||finished)return;rendering=true;try{
                if(demo==null){super.render();return;}
                if(!qa){if(!started){started=true;if(Boolean.getBoolean("cursed.characterAuto"))demo.keyDown(Input.Keys.T);}super.render();return;}
                if(demo.mechanismState()==com.erni.finalanswer.shotgun.ShotgunAnimator.State.RELOAD)
                    check(demo.weaponState()==ShotgunController.State.LOADING,"Inserting shells before pickup completed");
                if(!started){
                    started=true;models=demo.loadedModels();textures=Texture.getNumManagedTextures();
                    demo.sounds().levels.master=.12f;check(demo.sounds().loaded()==CursedBoxesSoundManager.cueCount(),"All original and additional WAVs preloaded");
                    profile.renderer=Gdx.gl.glGetString(GL20.GL_RENDERER);profile.version=Gdx.gl.glGetString(GL20.GL_VERSION);profile.resolution=Gdx.graphics.getBackBufferWidth()+"x"+Gdx.graphics.getBackBufferHeight();profile.cycles=1;
                    profile.gcCount=profile.gcMs=-1;
                    profile.note=paced?"Real delta/vsync presentation run, no GPU fence. presentedMs measures frame intervals; cpuMs is submission, totalMs/gpuWaitMs unavailable (-1). Loading excluded; allocation/heap/GC not sampled.":"Nine real developer shots, eight persistent named occupants. Serialized glFinish diagnostic; PNG capture I/O, loading, vsync and presentation excluded. Allocation/heap/GC not sampled here.";
                    check(demo.characterTest()!=null,"Developer mode installed");
                    // Repeated selection must reuse the exact texture/model resources.
                    for(int n=0;n<128;n++)demo.keyDown(Input.Keys.NUM_1+n%8);
                    check(demo.turn.shotsRemaining()==9&&demo.turn.shotLimit()==9,"Nine developer cartridges");
                    int occupied=0,mask=0;
                    for(CrateSlot box:demo.slots)if(box.character!=null){occupied++;mask|=1<<box.character.ordinal();check(box.occupantNickname!=null&&!box.occupantNickname.isBlank(),"Occupant nickname missing");}
                    check(occupied==8&&mask==255&&demo.slots[demo.characterTest().emptySlot()].character==null,"Eight simultaneous distinct occupants and one empty test target");
                    demo.keyDown(Input.Keys.T);
                    for(CrateSlot box:demo.slots)check(box.state==CrateSlot.State.INTACT&&!box.previewHidden&&demo.characterState(box.id)==CursedCharacterController.State.HIDDEN,"Initial scene is hidden/intact");
                    StringBuilder placement=new StringBuilder("[");var point=new com.badlogic.gdx.math.Vector3();
                    for(int i=0;i<9;i++){
                        if(i>0)placement.append(',');int box=demo.characterTest().characterSlot(i);demo.slotScreenPosition(box,point);
                        placement.append("{\"index\":").append(i).append(",\"slot\":").append(box).append(",\"x\":").append(point.x/Gdx.graphics.getWidth()).append(",\"y\":").append(point.y/Gdx.graphics.getHeight()).append('}');
                    }
                    Gdx.files.absolute(System.getProperty("cursed.characterOutput")+"/placement.json").writeString(placement.append(']').toString(),false);
                }
                audit.clear();long start=System.nanoTime();demo.render(paced?Gdx.graphics.getDeltaTime():1f/60);long submitted=System.nanoTime();if(!paced)Gdx.gl.glFinish();long done=System.nanoTime();frames++;
                var sample=new CursedBoxesPerformanceCheck.Sample();sample.frame=profile.samples.size();sample.shot=9-demo.turn.shotsRemaining();
                sample.allocated=sample.heap=-1;
                sample.presentedMs=Gdx.graphics.getRawDeltaTime()*1000;
                sample.cpuMs=(submitted-start)/1e6;sample.gpuWaitMs=paced?-1:(done-submitted)/1e6;sample.totalMs=paced?-1:(done-start)/1e6;
                sample.draws=audit.getDrawCalls();sample.compiles=audit.compiles;sample.uploads=audit.uploads;sample.staticBuffers=audit.staticBuffers;
                sample.models=demo.loadedModels();sample.textures=Texture.getNumManagedTextures();sample.debris=demo.activeDebris();sample.particles=demo.activeParticles();profile.samples.add(sample);
                check(sample.compiles==0&&sample.uploads==0&&sample.staticBuffers==0,"Cold shader/texture/mesh during character test");
                if(phase==0&&frames==1)capture("initial-hidden");
                check(Gdx.gl.glGetError()==GL20.GL_NO_ERROR,"OpenGL error");
                if(captureError.get()!=null)throw new IllegalStateException("QA capture failed",captureError.get());
                check(demo.loadedModels()==models&&Texture.getNumManagedTextures()==textures,"Character switch leaked/loaded resources");
                var test=demo.characterTest();int id=test.targetIndex(),slot=test.slot();String name=id==8?"EMPTY":CursedCharacterType.values()[id].name();
                if(phase==0){
                    if(!previews[id]&&!demo.turn.active()&&(demo.aimedAtSelected()||demo.weaponState()==ShotgunController.State.LOADING)&&demo.slots[slot].state==CrateSlot.State.INTACT){
                        check(demo.turn.shotsRemaining()==9-id&&demo.slots[slot].state==CrateSlot.State.INTACT,"Preview changed gameplay state");
                        previews[id]=true;
                    }
                    if(!impacts[id]&&demo.slots[slot].state==CrateSlot.State.DESTROYED&&demo.activeDebris()>0){
                        check(demo.turn.shotsRemaining()==8-id&&demo.turn.active()&&!test.preview(),"Real shot state/effects");
                        capture(id+"-"+name+"-impact");impacts[id]=true;
                        check(!demo.fire(),"Overlap shot accepted");
                    }
                    if(!settled[id]&&demo.slots[slot].state==CrateSlot.State.DESTROYED&&(id==8?!demo.turn.active():demo.characterState(slot)==CursedCharacterController.State.REVEALED))settled[id]=true;
                    for(int i=0;i<id;i++)if(i<8)check(demo.characterState(test.characterSlot(i))==CursedCharacterController.State.REVEALED,"Previously revealed character disappeared: "+i);
                    if(test.completed()){
                        for(int i=0;i<9;i++)check(previews[i]&&impacts[i]&&settled[i],"Missing hidden preview/real impact/persistent reveal for identity "+i);
                        capture("all-eight-with-nicknames");demo.select(slot);check(demo.selected()!=slot,"Destroyed crate selectable");phase=1;frames=0;
                    }
                }else if(phase==1&&frames>360){
                    check(demo.turn.ended()&&demo.turn.shotsRemaining()==0&&Integer.bitCount(demo.turn.destroyedCrateIds())==9&&!demo.fire(),"Exactly nine distinct test shots; tenth rejected");
                    check(demo.weaponState()==ShotgunController.State.RESTING,"Shotgun returned to the counter");
                    check(demo.eliminationTimeline().state()==com.finalanswer.protocol.CursedEliminationTimeline.State.COMPLETED&&demo.eliminationTimeline().count()==8,"Eight victims finish as persistent ghosts after all nine shots");
                    check(!demo.eliminationTimeline().eligible(test.emptySlot()),"Empty compartment cannot become a ghost");
                    var sound=demo.sounds();
                    check(sound.playCount(CursedBoxesSoundManager.Cue.SHOT)==9&&sound.playCount(CursedBoxesSoundManager.Cue.WOOD_BREAK)==9&&sound.playCount(CursedBoxesSoundManager.Cue.MECHANISM)==11,"Nine cycles plus initial and refill mechanism cues");
                    check(sound.playCount(CursedBoxesSoundManager.Cue.INSERT_ROUND)==9&&demo.loadedRounds()==0,"Five initial shells plus four refill shells, all nine consumed");
                    check(!sound.heartbeatActive(),"Shot test leaves no heartbeat");
                    Gdx.app.log("Cursed audio","PASS: "+sound.loaded()+" WAVs decoded, 9 shots/wood cues, 11 mechanical cues, 5+4 real insertions; visible shell contacts="+sound.playCount(CursedBoxesSoundManager.Cue.SHELL_DROP));
                    Gdx.files.absolute(System.getProperty("cursed.characterOutput")+"/audio.json").writeString("{\"loaded\":"+sound.loaded()+",\"shots\":"+sound.playCount(CursedBoxesSoundManager.Cue.SHOT)+",\"wood\":"+sound.playCount(CursedBoxesSoundManager.Cue.WOOD_BREAK)+",\"cycles\":"+sound.playCount(CursedBoxesSoundManager.Cue.MECHANISM)+",\"visibleShellContacts\":"+sound.playCount(CursedBoxesSoundManager.Cue.SHELL_DROP)+",\"insertions\":"+sound.playCount(CursedBoxesSoundManager.Cue.INSERT_ROUND)+"}",false);
                    int intact=0,destroyed=0;
                    for(CrateSlot box:demo.slots){
                        if(box.state==CrateSlot.State.INTACT)intact++;else if(box.state==CrateSlot.State.DESTROYED)destroyed++;
                        if(box.character!=null)check(demo.characterState(box.id)==CursedCharacterController.State.REVEALED&&!box.previewHidden,"Persistent character missing after six seconds");
                    }
                    check(intact==7&&destroyed==9&&demo.slots[test.emptySlot()].character==null,"Final nine destroyed/seven intact/empty target");
                    capture("persistent-six-seconds-later");int previousFirst=test.characterSlot(0);
                    demo.keyDown(Input.Keys.R);check(demo.turn.shotsRemaining()==9&&!test.preview(),"Test reset hides characters");
                    check(previousFirst!=test.characterSlot(0),"New reset distribution");
                    for(CrateSlot box:demo.slots)check(box.state==CrateSlot.State.INTACT&&!box.previewHidden&&demo.characterState(box.id)==CursedCharacterController.State.HIDDEN,"Reset restores sixteen intact boxes and hidden states");
                    check(demo.activeDebris()==0&&demo.activeParticles()==0&&demo.weaponState()==ShotgunController.State.RESTING,"Reset clears effects and gun");
                    demo.keyDown(Input.Keys.P);check(test.preview(),"P inspection");
                    demo.keyDown(Input.Keys.P);check(!test.preview(),"P restores intact geometry");
                    var json=new com.badlogic.gdx.utils.Json(com.badlogic.gdx.utils.JsonWriter.OutputType.json);json.setUsePrototypes(false);
                    Gdx.files.absolute(System.getProperty("cursed.characterProfile")).writeString(json.prettyPrint(profile),false);
                    Gdx.app.log("Cursed characters","PASS: eight simultaneous named occupants, eight real character shots plus one empty shot, persistent revealed states (including six seconds after completion), 128 selections without resource growth, ninth-shot limit, table return, reset and GL");
                    Gdx.app.exit();
                }
                if(phase==0&&frames>2600)throw new AssertionError("Automatic sequence timed out");
            }catch(Throwable e){failure=e;Gdx.app.exit();}finally{rendering=false;}}
            @Override public void dispose(){
                finished=true;super.dispose();if(demo!=null)demo.dispose();
                if(writer!=null){writer.shutdown();try{if(!writer.awaitTermination(15,java.util.concurrent.TimeUnit.SECONDS))failure=new AssertionError("QA PNG writer did not finish");}catch(InterruptedException e){Thread.currentThread().interrupt();failure=e;}}
                if(captureError.get()!=null)failure=captureError.get();
                if(qa&&Texture.getNumManagedTextures()!=0)failure=new AssertionError("Texture leak on exit: "+Texture.getNumManagedTextures());
            }
        },cfg);
        if(failure!=null)throw new AssertionError("Cursed character native check failed",failure);
    }
}
