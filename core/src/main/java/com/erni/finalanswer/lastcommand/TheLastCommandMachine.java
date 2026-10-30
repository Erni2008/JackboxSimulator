package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.*;
import com.badlogic.gdx.utils.Disposable;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.scene.*;

/** One GLB load/cache per source; panel instances share meshes, maps and indexed pick geometry. */
public final class TheLastCommandMachine implements Disposable {
    public static final String ROOT="models/last_command/";
    public static final String[] FILES={"computer.glb","hole_final.glb","button.glb","adjuster.glb","light.glb","level_handler.glb","lever.glb","secret_hole.glb","door.glb","code_display.glb"};
    public static class Placement {
        public Vector3 position=new Vector3(),rotation=new Vector3(),scale=new Vector3(1,1,1);
        Matrix4 matrix(){
            if(!finite(position)||!finite(rotation)||!finite(scale)||Math.abs(scale.x*scale.y*scale.z)<1e-12f)throw new IllegalArgumentException("Placement needs finite coordinates and nonzero scale");
            return new Matrix4().set(position,new Quaternion().setEulerAngles(rotation.y,rotation.x,rotation.z),scale);
        }
    }
    private static boolean finite(Vector3 v){return v!=null&&Float.isFinite(v.x)&&Float.isFinite(v.y)&&Float.isFinite(v.z);}
    public static class Config {
        public Placement body=new Placement(),base=new Placement(),cap=new Placement();
        public Vector3 pressAxis=new Vector3(0,0,-1);
        public float travel=.025f,capPickMinY=.48f;
    }
    /** Existing body, base and central cap API is unchanged. */
    public final Scene[] scenes=new Scene[3];
    public final MechanicalButton button=new MechanicalButton();
    public final BoundingBox bounds=new BoundingBox();
    public final StringBuilder status=new StringBuilder();
    private final SceneAsset[] assets=new SceneAsset[FILES.length];
    private final PickGeometry[] geometry=new PickGeometry[FILES.length];
    private final Matrix4 capRest=new Matrix4(),inverse=new Matrix4();
    private final Vector3 localHit=new Vector3(),worldHit=new Vector3();
    private final Ray localRay=new Ray();
    private float capPickMinY;
    private FrontPanel panel;
    private AdditionalMechanisms mechanisms;
    public final Matrix4 transform=new Matrix4();
    private final Matrix4 worldTransform=new Matrix4();
    public AdditionalMechanisms mechanisms(){return mechanisms;}
    private boolean centralVisible=true;private boolean disposed,bigHeld,bigLocked;
    public void setCentralVisible(boolean visible){centralVisible=visible;for(int i=1;i<3;i++)if(scenes[i]!=null)for(var node:scenes[i].modelInstance.nodes)setNodeVisible(node,visible);}
    private void setNodeVisible(com.badlogic.gdx.graphics.g3d.model.Node node,boolean visible){for(var part:node.parts)part.enabled=visible;for(var child:node.getChildren())setNodeVisible(child,visible);}
    public boolean centralLocked(){return bigLocked;}
    public void setCentralLocked(boolean locked){bigLocked=locked;if(locked)endInteraction(PanelElementId.BIG_BUTTON);}
    public TheLastCommandMachine(){this(Long.getLong("lc.seed",20261025L));}
    public TheLastCommandMachine(long seed){
        try{
            Config c=Gdx.files.internal(ROOT+"assembly.json").exists()?new com.badlogic.gdx.utils.Json().fromJson(Config.class,Gdx.files.internal(ROOT+"assembly.json")):new Config();
            Placement[] placements={c.body,c.base,c.cap};
            if(!finite(c.pressAxis)||c.pressAxis.isZero()||!Float.isFinite(c.travel)||c.travel<0)throw new IllegalArgumentException("Invalid pressAxis/travel");
            for(Placement p:placements)p.matrix();
            button.localAxis.set(c.pressAxis).nor();button.travel=c.travel;capPickMinY=c.capPickMinY;capRest.set(c.cap.matrix());
            for(int i=0;i<FILES.length;i++){
                String selected=Boolean.getBoolean("lc.originalAssets")?ROOT+FILES[i]:ROOT+(i==0?"high":GraphicsProfile.current().name().toLowerCase(java.util.Locale.ROOT))+"/"+FILES[i];
                var file=Gdx.files.internal(selected);
                if(!file.exists())file=Gdx.files.internal(ROOT+FILES[i]);
                if(!file.exists())file=Gdx.files.internal("../"+FILES[i]);
                if(i>=5&&Boolean.getBoolean("lc.existingOnly"))continue;
                if(!file.exists()){status.append("Missing: ").append(file.path()).append('\n');continue;}
                try{
                    assets[i]=new GLBLoader().load(file);Scene source=newInstance(i);geometry[i]=new PickGeometry(source.modelInstance);
                    if(i<3){scenes[i]=source;source.modelInstance.transform.set(placements[i].matrix());bounds.ext(new BoundingBox(geometry[i].bounds).mul(source.modelInstance.transform));}
                    Gdx.app.log("THE LAST COMMAND","Loaded "+file.path()+" bounds="+geometry[i].bounds);
                }catch(RuntimeException error){
                    if(assets[i]!=null){assets[i].dispose();assets[i]=null;}scenesSafeClear(i);geometry[i]=null;
                    status.append("Load failed: ").append(FILES[i]).append(" / ").append(error.getMessage()).append('\n');
                }
            }
            if(assets[0]!=null&&assets[1]!=null&&assets[2]!=null&&assets[3]!=null&&assets[4]!=null)try{panel=new FrontPanel(this,PanelConfiguration.load());
                if(loadedAssetCount()==FILES.length&&!Boolean.getBoolean("lc.existingOnly")){mechanisms=new AdditionalMechanisms(this,new java.util.Random(seed));panel.addControls(mechanisms.controls());}}catch(RuntimeException error){status.append("Panel configuration: ").append(error.getMessage());Gdx.app.error("THE LAST COMMAND","Cannot assemble front panel",error);}
        }catch(RuntimeException error){status.append("Invalid assembly.json: ").append(error.getMessage());}
        if(!bounds.isValid())bounds.set(new Vector3(-1,-1,-1),new Vector3(1,1,1));
    }
    private void scenesSafeClear(int index){if(index<3)scenes[index]=null;}
    Scene newInstance(int source){return new Scene(assets[source].scene);}
    PickGeometry sourceGeometry(int source){return geometry[source];}
    public SceneAsset[] loadedSources(){return assets.clone();}
    public int loadedAssetCount(){int count=0;for(SceneAsset asset:assets)if(asset!=null)count++;return count;}
    public FrontPanel panel(){return panel;}
    public boolean complete(){return scenes[0]!=null&&scenes[1]!=null&&scenes[2]!=null;}
    public boolean panelReady(){return panel!=null;}
    public void update(float delta){button.update(delta);if(scenes[2]!=null)button.apply(capRest,scenes[2].modelInstance.transform);if(panel!=null)panel.update(delta);}
    private float hit(Ray worldRay,ModelInstance instance,PickGeometry shape){
        worldTransform.set(transform).mul(instance.transform);
        localRay.set(worldRay);localRay.mul(inverse.set(worldTransform).inv());
        if(!shape.hit(localRay,localHit))return Float.POSITIVE_INFINITY;
        return worldHit.set(localHit).mul(worldTransform).dst2(worldRay.origin);
    }
    /** Closest solid surface wins. Locked controls remain solid, rather than allowing click-through. */
    public PanelElementId pick(Ray worldRay){
        float nearest=Float.POSITIVE_INFINITY;PanelElementId selected=null;
        for(int i=0;i<3;i++)if(scenes[i]!=null&&(i==0||centralVisible)){
            float distance=hit(worldRay,scenes[i].modelInstance,geometry[i]);
            if(distance<nearest){nearest=distance;selected=i==2&&localHit.y>=capPickMinY?PanelElementId.BIG_BUTTON:null;}
        }
        if(panel!=null)for(PanelControl control:panel.controls()){
            if(!control.visible())continue;
            float distance=hit(worldRay,control.scene.modelInstance,control.geometry);
            if(distance<nearest){nearest=distance;selected=control.hitId(localHit);}
        }
        return selected;
    }
    public boolean animating(){if(button.animating())return true;if(panel!=null){var controls=panel.controls();for(int i=0;i<controls.size();i++)if(controls.get(i).animating())return true;}return false;}
    public boolean hitCap(Ray worldRay){return pick(worldRay)==PanelElementId.BIG_BUTTON;}
    public void beginInteraction(PanelElementId id){
        if(id==PanelElementId.BIG_BUTTON){if(bigLocked)return;if(!bigHeld){bigHeld=true;button.held(true);if(panel!=null)panel.bigButton(true);}}
        else if(panel!=null&&id!=null)panel.pointerDown(id);
    }
    public void endInteraction(PanelElementId id){
        if(id==PanelElementId.BIG_BUTTON){if(bigHeld){bigHeld=false;button.held(false);if(panel!=null)panel.bigButton(false);}}
        else if(panel!=null&&id!=null)panel.pointerUp(id);
    }
    void resetCentralButton(){bigLocked=false;bigHeld=false;button.reset();if(scenes[2]!=null)scenes[2].modelInstance.transform.set(capRest);}
    @Override public void dispose(){
        if(disposed)return;disposed=true;if(panel!=null)panel.clear();
        for(SceneAsset asset:assets)if(asset!=null)asset.dispose();for(PickGeometry shape:geometry)if(shape!=null)shape.clear();
    }
}
