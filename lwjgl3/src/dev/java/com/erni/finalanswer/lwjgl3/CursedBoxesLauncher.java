package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.cursedboxes.*;

/** Fullscreen interactive demo and real OpenGL rules/timeline/composition checks. */
public final class CursedBoxesLauncher {
    private static Throwable failure;
    public static void main(String[] args){
        com.erni.finalanswer.lwjgl3.display.DesktopBorderless.install();
        var cfg=new Lwjgl3ApplicationConfiguration();cfg.setTitle("FINAL ANSWER — CURSED BOXES");
        cfg.setWindowedMode(1280,800);cfg.useVsync(true);cfg.setForegroundFPS(60);cfg.setIdleFPS(15);
        boolean qa=Boolean.getBoolean("cursed.qa");
        new Lwjgl3Application(new Game(){
            CursedBoxesScreen demo;float age;int phase,shotFrame,aimTarget;boolean rendering,finished;
            @Override public void create(){try{setScreen(new CursedBoxesLoadingScreen(scene->{demo=scene;setScreen(scene);},()->Gdx.app.exit()));}catch(Throwable e){failure=e;Gdx.app.exit();}}
            void capture(String name){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("cursed.output")+"/"+name+".png"),p,-1,true);}finally{p.dispose();}}
            void checkSlots(){
                Vector3 point=new Vector3();
                for(int i=0;i<16;i++){
                    demo.slotScreenPosition(i,point);
                    if(point.x<0||point.x>Gdx.graphics.getWidth()||point.y<0||point.y>Gdx.graphics.getHeight())throw new AssertionError("Clipped slot "+i);
                    demo.touchDown(Math.round(point.x),Math.round(point.y),0,Input.Buttons.LEFT);
                    if(demo.selected()!=i)throw new AssertionError("Ray pick "+i);
                    for(int state=0;state<3;state++){
                        if(demo.slots[i].models[state].model!=demo.slots[0].models[state].model)throw new AssertionError("Model duplicated");
                        BoundingBox box=new BoundingBox();demo.slots[i].models[state].calculateBoundingBox(box);box.mul(demo.slots[i].models[state].transform);
                        if(!box.getDimensions(new Vector3()).epsilonEquals(new Vector3(1.82f,1.17f,.72f),.001f)||!box.getCenter(new Vector3()).epsilonEquals(demo.slots[i].position,.001f))throw new AssertionError("State moved id="+i+" state="+state+" bounds="+box);
                    }
                }
                Pixmap png=new Pixmap(Gdx.files.internal("cursed_boxes/ghost_damaged.png"));try{if((png.getPixel(png.getWidth()/2,png.getHeight()/2)&255)!=0)throw new AssertionError("Torso alpha");}finally{png.dispose();}
            }
            @Override public void render(){if(failure!=null||rendering||finished)return;rendering=true;try{
                if(demo==null){super.render();return;}if(qa)demo.render(1f/60);else super.render();if(!qa)return;
                if(Gdx.gl.glGetError()!=GL20.GL_NO_ERROR)throw new AssertionError("OpenGL error");age+=1f/60;
                switch(phase){
                    case 0:if(age>1.5f){
                        if(!demo.presentationFullscreen())throw new AssertionError("Initial fullscreen");if(demo.weaponState()!=ShotgunController.State.RESTING)throw new AssertionError("Initial resting shotgun");capture("00-counter-rest");checkSlots();capture("01-intact");demo.select(5);phase=1;age=0;
                    }break;
                    case 1:if(age>1.2f){
                        if(!demo.aimedAtSelected()){capture("aim-diagnostic");throw new AssertionError("Aim not settled: state="+demo.weaponState()+" selected="+demo.selected()+" active="+demo.turn.active()+" shots="+demo.turn.shotsRemaining());}
                        if(!demo.fire()||demo.fire())throw new AssertionError("Duplicate trigger rules: state="+demo.weaponState()+" active="+demo.turn.active());phase=2;shotFrame=0;
                    }break;
                    case 2:
                        shotFrame++;
                        if(shotFrame==1)capture("02-muzzle-flash");
                        if(shotFrame==18)capture("03-barrel-smoke");
                        if(shotFrame==6){if(demo.slots[5].state!=CrateSlot.State.DESTROYED||!demo.ghostWounded())throw new AssertionError("Direct source box3/ghost3");capture("02-first-impact");}
                        if(shotFrame==12){if(demo.slots[5].state!=CrateSlot.State.DESTROYED)throw new AssertionError("160 ms stage");capture("03-revealed");}
                        if(shotFrame==15)capture("04-ghost-reaction");
                        if(shotFrame==26){if(!demo.ghostWounded())throw new AssertionError("300 ms damaged ghost");capture("05-transparent-hole");}
                        if(shotFrame==30){int selected=demo.selected();demo.select(0);if(demo.selected()!=selected||demo.fire())throw new AssertionError("Shot overlap allowed");}
                        if(shotFrame==80){
                            demo.select(5);if(demo.selected()==5||demo.turn.shotsRemaining()!=1)throw new AssertionError("Destroyed crate selectable");demo.select(0);phase=3;age=0;
                        }
                        break;
                    case 3:if(age>1.2f){if(!demo.aimedAtSelected()||!demo.fire())throw new AssertionError("Second target/fire");phase=4;age=0;}break;
                    case 4:if(age>2.2f){
                        if(demo.weaponState()!=ShotgunController.State.RESTING)throw new AssertionError("Return to counter");
                        if(!demo.turn.ended()||demo.turn.shotsRemaining()!=0||Integer.bitCount(demo.turn.destroyedCrateIds())!=2||demo.fire())throw new AssertionError("Turn limit");
                        demo.select(2);if(demo.selected()!=-1)throw new AssertionError("Selection after turn");
                        demo.keyDown(Input.Keys.F3);if(!demo.performance.visible)throw new AssertionError("F3");capture("06-corner-aim");phase=5;age=0;
                    }break;
                    case 5:if(age>.3f){capture("07-performance-overlay");demo.keyDown(Input.Keys.F3);phase=6;age=0;demo.keyDown(Input.Keys.F11);}break;
                    case 6:if(age>.5f){if(demo.presentationFullscreen())throw new AssertionError("F11 windowed");demo.reset();checkSlots();phase=7;age=0;demo.keyDown(Input.Keys.F11);}break;
                    case 7:if(age>.5f){
                        if(!demo.presentationFullscreen()||demo.turn.shotsRemaining()!=2||demo.turn.destroyedCrateIds()!=0)throw new AssertionError("Fullscreen/reset");
                        for(var s:demo.slots)if(s.state!=CrateSlot.State.INTACT)throw new AssertionError("Reset geometry");
                        phase=8;age=0;aimTarget=0;demo.reset();demo.select(aimTarget);
                    }break;
                    case 8:if(age>1.2f){
                        if(!demo.aimedAtSelected()||!demo.fire())throw new AssertionError("Target fire "+aimTarget);
                        phase=9;age=0;
                    }break;
                    case 9:if(age>1.9f){
                        if(demo.slots[aimTarget].state!=CrateSlot.State.DESTROYED)throw new AssertionError("Target impact "+aimTarget);
                        if(++aimTarget==16){Gdx.app.log("Cursed Boxes","PASS: fullscreen/F11, all sixteen targets aimed/fired/destroyed, two-shot rules, alpha, reset and OpenGL");Gdx.app.exit();}
                        else{demo.reset();demo.select(aimTarget);phase=8;age=0;}
                    }break;
                }
            }catch(Throwable e){failure=e;Gdx.app.exit();}finally{rendering=false;}}
            @Override public void dispose(){finished=true;super.dispose();if(demo!=null){demo.dispose();demo.dispose();}if(qa&&Texture.getNumManagedTextures()!=0)failure=new AssertionError("Texture leak: "+Texture.getNumManagedTextures());}
        },cfg);
        if(failure!=null)throw new AssertionError("Cursed Boxes QA failed",failure);
    }
}
