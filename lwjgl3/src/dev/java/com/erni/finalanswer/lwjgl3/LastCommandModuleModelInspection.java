package com.erni.finalanswer.lwjgl3;
import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.erni.finalanswer.shotgun.ShotgunRenderer;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.scene.*;
/** Inspect original panel geometry and authored PBR materials without editing assets. */
public final class LastCommandModuleModelInspection extends ApplicationAdapter {
 private SceneAsset[] assets=new SceneAsset[1];private Scene[] scenes=new Scene[1];private int current=-1;private final String[] names={"level_handler","lever","secret_hole","door","code_display"};private PerspectiveCamera camera;private ShotgunRenderer renderer;private int frame;
 @Override public void create(){camera=new PerspectiveCamera(40,1000,900);renderer=new ShotgunRenderer(camera,false);}

 @Override public void render(){
  int view=frame/12,part=view/3;
  if(current!=part){if(assets[0]!=null)assets[0].dispose();assets[0]=new GLBLoader().load(Gdx.files.internal("../"+names[part]+".glb"));scenes[0]=new Scene(assets[0].scene);current=part;}
  var instance=scenes[0].modelInstance;
  BoundingBox box=instance.calculateBoundingBox(new BoundingBox());Vector3 center=box.getCenter(new Vector3());float radius=box.getDimensions(new Vector3()).len()*.5f;
  Vector3 direction=switch(view%3){case 0->new Vector3(.5f,.6f,3);case 1->new Vector3(0,3,.001f);default->new Vector3(3,.2f,0);};
  camera.position.set(center).mulAdd(direction,radius);camera.up.set(view%3==1?Vector3.Z:Vector3.Y);camera.lookAt(center);camera.near=.001f;camera.far=100;camera.update();
  renderer.provider(scenes[0]);Gdx.gl.glClearColor(.025f,.03f,.035f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);renderer.render(0);
  if(frame%12==10){Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());PixmapIO.writePNG(Gdx.files.absolute("/tmp/lc-module-"+names[part]+"-"+(view%3)+".png"),p,-1,true);p.dispose();}
  if(++frame>=180)Gdx.app.exit();
 }
 @Override public void dispose(){renderer.dispose();for(SceneAsset asset:assets)asset.dispose();}
 public static void main(String[] args){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1000,900);c.disableAudio(true);new Lwjgl3Application(new LastCommandModuleModelInspection(),c);}
}
