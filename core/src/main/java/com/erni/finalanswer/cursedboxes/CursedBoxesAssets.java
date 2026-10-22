package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g3d.ModelInstance;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.shotgun.*;
import net.mgsx.gltf.scene3d.scene.SceneAsset;

/** Screen-owned registry. Production uses one preload stage per presented loading frame. */
public final class CursedBoxesAssets implements Disposable {
    public static final String ROOT="cursed_boxes/";
    public final ShotgunAssets models=new ShotgunAssets();
    public final ShotgunConfig weaponConfig=ShotgunConfig.load(Gdx.files.internal(ShotgunConfig.PATH));
    public final SceneAsset[] crates=new SceneAsset[3],splinters=new SceneAsset[2];
    public Texture shelf,dust;
    public final Texture[] ghosts=new Texture[3],debris=new Texture[2];
    public static final String MISSING_SHELF="cursed_boxes/shelf.glb";
    public static final String[] BACKGROUNDS={ROOT+"backgrounds/background1.png",ROOT+"backgrounds/background2.png",ROOT+"backgrounds/background3.png"};
    public final Texture[] backgrounds=new Texture[3],lighting=new Texture[3];
    private static final String[] STAGES={"Intact wood","Destroyed wood","Wood fragments I","Wood fragments II","Shotgun body","Shotgun pump","Shotgun bolt","Shotgun shell","Weapon mechanism","Spirit I","Spirit II","Spirit III","Cabinet","Fine debris I","Fine debris II","Gallery I","Lantern light I","Gallery II","Lantern light II","Gallery III","Lantern light III","Soft effects"};
    private int loaded;
    private boolean disposed;
    public CursedBoxesAssets(){this(false);}
    public CursedBoxesAssets(boolean staged){
        // Exact original part geometry; only the tiny bolt/shell's oversized 4K maps are bounded to 1K.
        weaponConfig.bolt.asset=ROOT+"shotgun/shotgun_bolt.glb";weaponConfig.shell.asset=ROOT+"shotgun/shotgun_shell.glb";
        if(!staged)while(!ready())loadNext();
    }
    public boolean ready(){return loaded==STAGES.length;}
    public float progress(){return loaded/(float)STAGES.length;}
    public String stage(){return ready()?"Ready":STAGES[loaded];}
    public void loadNext(){
        if(disposed)throw new IllegalStateException("Loading disposed assets");if(ready())return;
        long start=System.nanoTime();String label=stage();
        switch(loaded){
            case 0:crates[0]=required("intact.glb");crates[1]=crates[0];break;
            case 1:crates[2]=required("destroyed.glb");break;
            case 2:splinters[0]=required("splinter_a.glb");break;
            case 3:splinters[1]=required("splinter_b.glb");break;
            case 4:requiredPath(weaponConfig.body.asset);break;
            case 5:requiredPath(weaponConfig.pump.asset);break;
            case 6:requiredPath(weaponConfig.bolt.asset);break;
            case 7:requiredPath(weaponConfig.shell.asset);break;
            case 8:if(models.preparedBody(weaponConfig)==null)throw new IllegalStateException(models.failures().toString());break;
            case 9:ghosts[0]=texture("ghost_idle.png");break;
            case 10:ghosts[1]=texture("ghost_hit.png");break;
            case 11:ghosts[2]=texture("ghost_damaged.png");break;
            case 12:shelf=texture("shelf.png");break;
            case 13:debris[0]=texture("debris_a.png");break;
            case 14:debris[1]=texture("debris_b.png");break;
            case 15:case 17:case 19:backgrounds[(loaded-15)/2]=texture("backgrounds/background"+((loaded-15)/2+1)+".png");break;
            case 16:case 18:case 20:lighting[(loaded-16)/2]=texture("backgrounds/lighting"+((loaded-16)/2+1)+".png");break;
            case 21:
                var pixels=new com.badlogic.gdx.graphics.Pixmap(32,32,com.badlogic.gdx.graphics.Pixmap.Format.RGBA8888);
                try{for(int y=0;y<32;y++)for(int x=0;x<32;x++){float dx=(x-15.5f)/15.5f,dy=(y-15.5f)/15.5f,r=dx*dx+dy*dy;pixels.setColor(1,1,1,(float)Math.exp(-r*5)*Math.max(0,1-r));pixels.drawPixel(x,y);}dust=new Texture(pixels);}finally{pixels.dispose();}
                dust.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);break;
            default:throw new IllegalStateException("Unknown loading stage");
        }
        loaded++;Gdx.app.log("Cursed loading",label+": "+Math.round((System.nanoTime()-start)/1e6)+" ms");
    }
    private SceneAsset required(String name){return requiredPath(ROOT+name);}
    private SceneAsset requiredPath(String path){SceneAsset asset=models.load(path);if(asset==null)throw new IllegalStateException(models.failures().toString());return asset;}
    private Texture texture(String name){Texture t=new Texture(ROOT+name);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);t.setWrap(Texture.TextureWrap.ClampToEdge,Texture.TextureWrap.ClampToEdge);return t;}
    public static ModelInstance fit(SceneAsset asset,float width,float height,float depth){return fit(asset.scene.model,width,height,depth);}
    public static ModelInstance fit(com.badlogic.gdx.graphics.g3d.Model model,float width,float height,float depth){
        ModelInstance m=new ModelInstance(model);BoundingBox box=new BoundingBox();m.calculateBoundingBox(box);
        Vector3 size=box.getDimensions(new Vector3()),center=box.getCenter(new Vector3());m.transform.idt().scale(width/size.x,height/size.y,depth/size.z).translate(-center.x,-center.y,-center.z);return m;
    }
    private void release(Texture[] textures){for(Texture t:textures)if(t!=null)t.dispose();}
    @Override public void dispose(){if(disposed)return;disposed=true;models.dispose();if(shelf!=null)shelf.dispose();if(dust!=null)dust.dispose();release(ghosts);release(debris);release(backgrounds);release(lighting);}
}
