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
    public SceneAsset load(String path){return load(Gdx.files.internal(path));}
    public SceneAsset load(FileHandle file){
        if(disposed)throw new IllegalStateException("Shotgun assets disposed");
        String key=file.type()+":"+file.path();if(cache.containsKey(key))return cache.get(key);if(failures.containsKey(key))return null;
        if(!file.exists()){failures.put(key,"Missing GLB: "+file.path());return null;}
        try{SceneAsset asset=new GLBLoader().load(file);cache.put(key,asset);return asset;}
        catch(RuntimeException error){failures.put(key,"Cannot load "+file.path()+": "+error.getMessage());return null;}
    }
    public Collection<String> failures(){return Collections.unmodifiableCollection(failures.values());}
    public int loadedCount(){return cache.size();}
    @Override public void dispose(){if(disposed)return;disposed=true;for(SceneAsset asset:cache.values())asset.dispose();cache.clear();failures.clear();}
}
