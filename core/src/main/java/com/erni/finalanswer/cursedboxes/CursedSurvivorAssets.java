package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.ui.lobby.cages.*;
import net.mgsx.gltf.scene3d.scene.SceneAsset;

/** Scene-owned survivor resources; each heavy identity is loaded on its own loading frame. */
public final class CursedSurvivorAssets implements Disposable {
    public static final class Profile {
        public String id,texture;
        public int[] bounds;
        public float[] pivots;
        public int[] parents={-1,0,0,2,0,4,0,0},order={3,7,1,4,2,5,0,0};
        public boolean legs;
    }
    public static final class Config {public Array<Profile> rigs=new Array<>(Profile.class);}
    public final Config config=new Json().fromJson(Config.class,Gdx.files.internal("cursed_boxes/survivors/rigs.json"));
    public final SceneAsset[] boxes=new SceneAsset[3];
    public final Texture[] portraits=new Texture[8];
    public Texture smoke,glow;
    public PuppeteerConfig puppetConfig;
    public PuppeteerAssets puppet;
    public ZombieAssets zombie;
    public VoodooConfig voodooConfig;
    public VoodooAssets voodoo;
    public Profile profile(CursedCharacterType type){for(Profile p:config.rigs)if(p.id.equals(type.name()))return p;return null;}
    public void load(int stage,CursedBoxesAssets owner){
        if(stage<3){String[] names={"intact","damaged","destroyed"};boxes[stage]=owner.models.load("cursed_boxes/survivors/"+names[stage]+"_split.glb");if(boxes[stage]==null)throw new IllegalStateException("Missing split survivor box");}
        else if(stage<8){Profile p=config.rigs.get(stage-3);if(p.bounds.length!=4||p.pivots.length!=16)throw new IllegalArgumentException("Invalid survivor rig "+p.id);portraits[CursedCharacterType.valueOf(p.id).ordinal()]=load(p.texture);}
        else switch(stage){
            case 8:puppetConfig=PuppeteerConfig.load();puppet=new PuppeteerAssets(puppetConfig);break;
            case 9:zombie=new ZombieAssets();break;
            case 10:voodooConfig=VoodooConfig.load();voodoo=new VoodooAssets(voodooConfig);break;
            case 11:smoke=load("cursed_boxes/effects/cursed_smoke.png");break;
            case 12:glow=load("cursed_boxes/effects/cursed_glow.png");break;
            default:throw new IllegalArgumentException("Unknown survivor loading stage");
        }
    }
    private static Texture load(String path){Texture t=new Texture(Gdx.files.internal(path),true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;}
    @Override public void dispose(){for(Texture t:portraits)if(t!=null)t.dispose();if(puppet!=null)puppet.dispose();if(zombie!=null)zombie.dispose();if(voodoo!=null)voodoo.dispose();if(smoke!=null)smoke.dispose();if(glow!=null)glow.dispose();}
}
