package com.erni.finalanswer.shotgun;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.RenderableProvider;
import com.badlogic.gdx.utils.Disposable;
import net.mgsx.gltf.scene3d.attributes.*;
import net.mgsx.gltf.scene3d.lights.DirectionalLightEx;
import net.mgsx.gltf.scene3d.scene.SceneManager;
import net.mgsx.gltf.scene3d.utils.IBLBuilder;

/** Reusable PBR pass; materials are kept intact. Render before the host's 2D/UI pass. */
public final class ShotgunRenderer implements Disposable {
    private final SceneManager manager;
    private final Cubemap diffuse,specular;
    private final Texture brdf;
    private final ShotgunEffects effects;
    private ModularShotgun weapon;
    public ShotgunRenderer(PerspectiveCamera camera){
        effects=new ShotgunEffects(camera);
        manager=new SceneManager();manager.setCamera(camera);
        DirectionalLightEx key=new DirectionalLightEx();key.direction.set(-.35f,-.8f,-.6f).nor();key.color.set(.85f,.79f,.70f,1);
        manager.environment.add(key);
        DirectionalLightEx fill=new DirectionalLightEx();fill.direction.set(.5f,-.3f,.7f).nor();fill.color.set(.16f,.19f,.24f,1);manager.environment.add(fill);
        IBLBuilder builder=IBLBuilder.createIndoor(key);
        try{diffuse=builder.buildIrradianceMap(32);specular=builder.buildRadianceMap(7);}finally{builder.dispose();}
        brdf=new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        manager.setAmbientLight(.3f);
        manager.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuse));
        manager.environment.set(PBRCubemapAttribute.createSpecularEnv(specular));
        manager.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture,brdf));
    }
    public com.badlogic.gdx.graphics.g3d.Environment environment(){return manager.environment;}
    public void provider(RenderableProvider provider){weapon=provider instanceof ModularShotgun gun?gun:null;manager.getRenderableProviders().clear();if(provider!=null)manager.getRenderableProviders().add(provider);}
    /** Draw the effect shader once while the host is still loading. */
    public void renderEffects(ModularShotgun gun){effects.render(gun);}
    public void warmupEffects(){effects.warmup();}
    public void render(float delta){manager.update(Math.max(0,delta));manager.render();if(weapon!=null)effects.render(weapon);}
    @Override public void dispose(){effects.dispose();manager.dispose();diffuse.dispose();specular.dispose();brdf.dispose();}
}
