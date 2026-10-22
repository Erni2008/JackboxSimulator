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
    public final CursedBoxesSoundManager sounds=new CursedBoxesSoundManager();
    public final CursedSurvivorAssets survivors=new CursedSurvivorAssets();
    public final Texture[] characters=new Texture[8],debris=new Texture[2];
    public final CursedCharacterImage.Info[] characterInfo=new CursedCharacterImage.Info[8];
    private static final CursedCharacterType[] TYPES=CursedCharacterType.values();
    public static final String MISSING_SHELF="cursed_boxes/shelf.glb";
    public static final String[] BACKGROUNDS={ROOT+"backgrounds/background1.png",ROOT+"backgrounds/background2.png",ROOT+"backgrounds/background3.png"};
    public final Texture[] backgrounds=new Texture[3],lighting=new Texture[3];
    private static final String[] STAGES={"Intact wood","Destroyed wood","Wood fragments I","Wood fragments II","Shotgun body","Shotgun pump","Shotgun bolt","Shotgun shell","Weapon mechanism","Ghost","Dracula","Plague Doctor","Puppeteer","Skeleton","Zombie","Pumpkin","Voodoo","Cabinet","Fine debris I","Fine debris II","Gallery I","Lantern light I","Gallery II","Lantern light II","Gallery III","Lantern light III","Soft effects","Survivor intact panel","Survivor damaged panel","Survivor destroyed panel","Survivor Ghost","Survivor Dracula","Survivor Doctor","Survivor Skeleton","Survivor Pumpkin","Survivor Puppeteer","Survivor Zombie","Survivor Voodoo","Cursed smoke","Cursed glow","Shot audio","Mechanism audio","Shell contact audio","Wood impact audio","Heartbeat audio","Reveal start audio","Reveal finish audio","Cartridge insertion audio","Extra wood impact audio","Appearance I","Appearance II","Appearance III","Appearance IV","Special horror I","Special horror II","Optional host announcement"};
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
            case 9:case 10:case 11:case 12:case 13:case 14:case 15:case 16:loadCharacter(TYPES[loaded-9]);break;
            case 17:shelf=texture("shelf.png");break;
            case 18:debris[0]=texture("debris_a.png");break;
            case 19:debris[1]=texture("debris_b.png");break;
            case 20:case 22:case 24:backgrounds[(loaded-20)/2]=texture("backgrounds/background"+((loaded-20)/2+1)+".png");break;
            case 21:case 23:case 25:lighting[(loaded-21)/2]=texture("backgrounds/lighting"+((loaded-21)/2+1)+".png");break;
            case 26:
                var pixels=new com.badlogic.gdx.graphics.Pixmap(32,32,com.badlogic.gdx.graphics.Pixmap.Format.RGBA8888);
                try{for(int y=0;y<32;y++)for(int x=0;x<32;x++){float dx=(x-15.5f)/15.5f,dy=(y-15.5f)/15.5f,r=dx*dx+dy*dy;pixels.setColor(1,1,1,(float)Math.exp(-r*5)*Math.max(0,1-r));pixels.drawPixel(x,y);}dust=new Texture(pixels);}finally{pixels.dispose();}
                dust.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);break;
            default:if(loaded<40)survivors.load(loaded-27,this);else if(loaded<40+CursedBoxesSoundManager.Cue.values().length)sounds.loadNext();else sounds.loadHostVoice();break;
        }
        loaded++;Gdx.app.log("Cursed loading",label+": "+Math.round((System.nanoTime()-start)/1e6)+" ms");
    }
    private void loadCharacter(CursedCharacterType type){
        var file=Gdx.files.internal(type.path);
        type.requireAsset(file.exists());
        com.badlogic.gdx.graphics.Pixmap pixels;
        try{pixels=new com.badlogic.gdx.graphics.Pixmap(file);}catch(RuntimeException e){throw new IllegalStateException(type.diagnostic("PNG cannot be decoded"),e);}
        try{
            characterInfo[type.ordinal()]=CursedCharacterImage.inspect(type,pixels.getWidth(),pixels.getHeight(),(x,y)->pixels.getPixel(x,y)&255);
            // File-backed managed texture: reuse this decoded pixmap and retain safe context reload support.
            var data=new com.badlogic.gdx.graphics.glutils.FileTextureData(file,pixels,null,true);
            Texture texture=new Texture(data);characters[type.ordinal()]=texture;
            texture.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);
            texture.setWrap(Texture.TextureWrap.ClampToEdge,Texture.TextureWrap.ClampToEdge);
        }catch(RuntimeException e){throw new IllegalStateException(type.diagnostic("invalid character asset"),e);}
        finally{if(!pixels.isDisposed())pixels.dispose();}
    }
    private SceneAsset required(String name){
        SceneAsset asset=requiredPath(ROOT+name);
        // These four source wood meshes are closed, outward-wound volumes (including BOX3).
        // Their exported doubleSided flag otherwise runs PBR shading on hidden back faces.
        for(var material:asset.scene.model.materials)material.set(com.badlogic.gdx.graphics.g3d.attributes.IntAttribute.createCullFace(com.badlogic.gdx.graphics.GL20.GL_BACK));
        return asset;
    }
    private SceneAsset requiredPath(String path){SceneAsset asset=models.load(path);if(asset==null)throw new IllegalStateException(models.failures().toString());return asset;}
    private Texture texture(String name){Texture t=new Texture(ROOT+name);t.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);t.setWrap(Texture.TextureWrap.ClampToEdge,Texture.TextureWrap.ClampToEdge);return t;}
    public static ModelInstance fit(SceneAsset asset,float width,float height,float depth){return fit(asset.scene.model,width,height,depth);}
    public static ModelInstance fit(com.badlogic.gdx.graphics.g3d.Model model,float width,float height,float depth){
        ModelInstance m=new ModelInstance(model);BoundingBox box=new BoundingBox();m.calculateBoundingBox(box);
        Vector3 size=box.getDimensions(new Vector3()),center=box.getCenter(new Vector3());m.transform.idt().scale(width/size.x,height/size.y,depth/size.z).translate(-center.x,-center.y,-center.z);return m;
    }
    private void release(Texture[] textures){for(Texture t:textures)if(t!=null)t.dispose();}
    @Override public void dispose(){if(disposed)return;disposed=true;sounds.dispose();survivors.dispose();models.dispose();if(shelf!=null)shelf.dispose();if(dust!=null)dust.dispose();release(characters);release(debris);release(backgrounds);release(lighting);}
}
