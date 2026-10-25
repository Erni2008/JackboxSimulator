package com.erni.finalanswer.lwjgl3;
import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.erni.finalanswer.lastcommand.*;
import com.erni.finalanswer.shotgun.ShotgunRenderer;
/** Isolated source-model inspection, never changes runtime placements or materials. */
public final class LastCommandModelInspection extends ApplicationAdapter {
 private TheLastCommandMachine machine;private PerspectiveCamera camera;private ShotgunRenderer renderer;private int frame;
 @Override public void create(){machine=new TheLastCommandMachine();if(!machine.complete())throw new IllegalStateException(machine.status.toString());camera=new PerspectiveCamera(40,1000,900);renderer=new ShotgunRenderer(camera,false);}
 @Override public void render(){
  int view=frame/12; int part=view<3?0:view==3?1:2;var instance=machine.scenes[part].modelInstance;instance.transform.idt();
  BoundingBox box=instance.calculateBoundingBox(new BoundingBox());Vector3 center=box.getCenter(new Vector3());float radius=box.getDimensions(new Vector3()).len()*.5f;
  Vector3 direction=switch(view){case 0->new Vector3(0,0,3);case 1->new Vector3(3,0,0);case 2,3->new Vector3(0,3,.001f);default->new Vector3(0,.3f,3);};
  camera.position.set(center).mulAdd(direction,radius);camera.up.set(view==2||view==3?Vector3.Z:Vector3.Y);camera.lookAt(center);camera.near=.001f;camera.far=100;camera.update();
  renderer.provider(machine.scenes[part]);Gdx.gl.glClearColor(.035f,.04f,.045f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);renderer.render(0);
  if(frame%12==10){Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());PixmapIO.writePNG(Gdx.files.absolute("/tmp/last-command-view-"+view+".png"),p,-1,true);p.dispose();}
  if(++frame>=60)Gdx.app.exit();
 }
 @Override public void dispose(){renderer.dispose();machine.dispose();}
 public static void main(String[] args){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1000,900);c.disableAudio(true);new Lwjgl3Application(new LastCommandModelInspection(),c);}
}
