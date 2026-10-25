package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.utils.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;
import net.mgsx.gltf.scene3d.attributes.*;
import net.mgsx.gltf.scene3d.lights.*;
import net.mgsx.gltf.scene3d.scene.SceneManager;
import net.mgsx.gltf.scene3d.utils.IBLBuilder;
import net.mgsx.gltf.scene3d.shaders.PBRShaderProvider;

/** PBR metal, indoor image-based reflections and a PCF-filtered key shadow.
 * Industrial floor is one draw call; weathering is a reversible shader layer over source maps.
 */
public final class TheLastCommandRenderer implements Disposable {
    private final SceneManager manager;
    private final DirectionalShadowLight key;
    private final Cubemap diffuse, specular;
    private final Texture brdf;
    private final Model floor;
    private boolean disposed;
    public TheLastCommandRenderer(PerspectiveCamera camera, TheLastCommandMachine machine) {
        LastCommandSurfaceStyle style=LastCommandSurfaceStyle.load();
        manager=new SceneManager(new WeatheredMetalShaderProvider(style),PBRShaderProvider.createDefaultDepth(0));
        LastCommandSurfaceStyle.Surface[] surfaces={style.body,style.base,style.cap};
        for(int part=0;part<machine.scenes.length;part++)if(machine.scenes[part]!=null)
            for(Material material:machine.scenes[part].modelInstance.materials)
                if(style.enabled)material.set(surfaces[part].attribute(part));
                else material.remove(WeatheredMetalAttribute.TYPE);
        if(machine.panel()!=null)for(PanelControl control:machine.panel().controls())
            for(Material material:control.scene().modelInstance.materials)
                if(style.enabled)material.set((control instanceof SmallButton?style.cap:style.base).attribute(control instanceof SmallButton?2:1));
                else material.remove(WeatheredMetalAttribute.TYPE);
        manager.setCamera(camera);
        float radius = machine.bounds.getDimensions(new Vector3()).len()*.5f;
        key = new DirectionalShadowLight(2048,2048,radius*4,radius*4,.01f,radius*6);
        key.direction.set(-.6f,-.65f,-.45f).nor();key.color.set(2.2f,2.05f,1.83f,1);
        key.setCenter(machine.bounds.getCenter(new Vector3()));manager.environment.add(key);
        DirectionalLightEx fill = new DirectionalLightEx();
        fill.direction.set(.6f,-.25f,.8f).nor();fill.color.set(.26f,.31f,.38f,1);manager.environment.add(fill);
        DirectionalLightEx rim=new DirectionalLightEx();
        rim.direction.set(.3f,-.35f,.8f).nor();rim.color.set(.65f,.78f,.93f,1);manager.environment.add(rim);
        IBLBuilder ibl = IBLBuilder.createIndoor(key);
        try { diffuse=ibl.buildIrradianceMap(32);specular=ibl.buildRadianceMap(7); } finally { ibl.dispose(); }
        brdf=new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        manager.setAmbientLight(.23f);
        manager.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuse));
        manager.environment.set(PBRCubemapAttribute.createSpecularEnv(specular));
        manager.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture,brdf));
        manager.environment.set(new PBRFloatAttribute(PBRFloatAttribute.ShadowBias,.0008f));
        manager.environment.set(new com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute(
            com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.Fog, Color.BLACK));
        manager.environment.set(FogAttribute.createFog(radius*3.5f,radius*8,1.5f));
        for(var scene:machine.scenes)if(scene!=null)manager.getRenderableProviders().add(scene);
        if(machine.panel()!=null)for(PanelControl control:machine.panel().controls())manager.getRenderableProviders().add(control.scene());
        Material iron=new Material(PBRColorAttribute.createBaseColorFactor(new Color(.012f,.016f,.02f,1)),
            PBRFloatAttribute.createMetallic(.65f),PBRFloatAttribute.createRoughness(.83f));
        if(style.enabled)iron.set(style.floor.attribute(3));
        ModelBuilder builder=new ModelBuilder();builder.begin();
        MeshPartBuilder plates=builder.part("industrial-floor",GL20.GL_TRIANGLES,
            VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal,iron);
        float step=radius*.55f, gap=radius*.004f, y=machine.bounds.min.y-radius*.025f;
        for(int x=-15;x<=15;x++)for(int z=-15;z<=15;z++)
            plates.box(x*step,y,z*step,step-gap,radius*.04f,step-gap);
        floor=builder.end();manager.getRenderableProviders().add(new ModelInstance(floor));
    }
    public void render(float delta) { manager.update(Math.max(0,delta));manager.render(); }
    @Override public void dispose() {
        if(disposed)return;disposed=true;
        manager.dispose();key.dispose();floor.dispose();diffuse.dispose();specular.dispose();brdf.dispose();
    }
}
