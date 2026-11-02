package com.erni.finalanswer.lwjgl3;
import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.erni.finalanswer.shotgun.ShotgunRenderer;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.scene.*;
/** Isolated shufle.glb inspection: six orthogonal-ish views to out dir. Never changes the model. */
public final class CursedCardsModelInspection extends ApplicationAdapter {
 private SceneAsset asset;private Scene scene;private PerspectiveCamera camera;private ShotgunRenderer renderer;private int frame;private final String out=System.getProperty("out","/tmp");
 @Override public void create(){asset=new GLBLoader().load(Gdx.files.internal("models/cursed_cards/shufle_high.glb"));scene=new Scene(asset.scene);camera=new PerspectiveCamera(35,1000,900);renderer=new ShotgunRenderer(camera,false);renderer.provider(scene);
  BoundingBox box=scene.modelInstance.calculateBoundingBox(new BoundingBox());System.out.println("BOUNDS "+box+" parts="+scene.modelInstance.nodes.first().parts.size);}
 @Override public void render(){int view=frame/8;
  BoundingBox box=scene.modelInstance.calculateBoundingBox(new BoundingBox());Vector3 c=box.getCenter(new Vector3());float r=box.getDimensions(new Vector3()).len()*.5f;
  Vector3 d=switch(view){case 0->new Vector3(0,0,1);case 1->new Vector3(0,0,-1);case 2->new Vector3(1,0,0);case 3->new Vector3(-1,0,0);case 4->new Vector3(0,1,.001f);default->new Vector3(.6f,.35f,.8f);};
  camera.position.set(c).mulAdd(d.nor(),r*3.2f);camera.up.set(Vector3.Y);camera.lookAt(c);camera.near=.01f;camera.far=50;camera.update();
  Gdx.gl.glClearColor(.05f,.05f,.06f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);renderer.render(Gdx.graphics.getDeltaTime());
  if(frame%8==6){Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());PixmapIO.writePNG(Gdx.files.absolute(out+"/shufle-view-"+view+".png"),p,-1,true);p.dispose();}
  if(++frame>=48)Gdx.app.exit();}
 @Override public void dispose(){renderer.dispose();asset.dispose();}
 public static void main(String[] args){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1000,900);c.disableAudio(true);new Lwjgl3Application(new CursedCardsModelInspection(),c);}
}
