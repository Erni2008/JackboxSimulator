package com.erni.finalanswer.shotgun;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.utils.Disposable;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.scene.SceneAsset;
import java.util.*;

/** GL-thread owner. Instances borrow cached models, embedded textures and meshes. */
public final class ShotgunAssets implements Disposable {
    private final Map<String,SceneAsset> cache=new LinkedHashMap<>();
    private final Map<String,String> failures=new LinkedHashMap<>();
    private boolean disposed;
    private final Map<String,com.badlogic.gdx.graphics.g3d.Model> prepared=new LinkedHashMap<>();
    public SceneAsset load(String path){return load(Gdx.files.internal(path));}
    public SceneAsset load(FileHandle file){
        if(disposed)throw new IllegalStateException("Shotgun assets disposed");
        String key=file.type()+":"+file.path();if(cache.containsKey(key))return cache.get(key);if(failures.containsKey(key))return null;
        if(!file.exists()){failures.put(key,"Missing GLB: "+file.path());return null;}
        try{SceneAsset asset=new GLBLoader().load(file);cache.put(key,asset);return asset;}
        catch(RuntimeException error){failures.put(key,"Cannot load "+file.path()+": "+error.getMessage());return null;}
    }
    public com.badlogic.gdx.graphics.g3d.Model preparedBody(ShotgunConfig config){
        if(!config.preparation.enabled)return null;
        String key="prepared:"+config.body.asset+":"+config.bolt.asset+":"+new com.badlogic.gdx.utils.Json().toJson(config.preparation);
        if(prepared.containsKey(key))return prepared.get(key);if(failures.containsKey(key))return null;
        try{
            byte[] source=Gdx.files.internal(config.body.asset).readBytes();
            String hash=java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(source));
            if(!hash.equals(config.preparation.sourceSha256))throw new IllegalArgumentException("BODY checksum differs; authored preparation refused");
            SceneAsset body=load(config.body.asset),bolt=load(config.bolt.asset);
            if(body==null||bolt==null)throw new IllegalArgumentException("BODY/BOLT source unavailable");
            var model=ShotgunBodyPreparation.prepare(new com.badlogic.gdx.graphics.g3d.ModelInstance(body.scene.model),bolt.scene.model.materials.first(),config.preparation);
            prepared.put(key,model);return model;
        }catch(Exception error){failures.put(key,"BODY preparation failed: "+error.getMessage());return null;}
    }
    public Collection<String> failures(){return Collections.unmodifiableCollection(failures.values());}
    public int loadedCount(){return cache.size();}
    @Override public void dispose(){if(disposed)return;disposed=true;for(var model:prepared.values())model.dispose();prepared.clear();for(SceneAsset asset:cache.values())asset.dispose();cache.clear();failures.clear();}
}
