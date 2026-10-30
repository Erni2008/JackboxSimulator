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
    private boolean disposed,shadowPass,shadowReady;
    private final TheLastCommandMachine machine;
    private final PerspectiveCamera camera;
    private final GraphicsProfile profile;
    private final boolean legacy=Boolean.getBoolean("lc.legacyRendering");
    private int shadowHash;
    private final com.badlogic.gdx.math.collision.BoundingBox cullBounds=new com.badlogic.gdx.math.collision.BoundingBox();
    private final Matrix4 cullTransform=new Matrix4();
    private final Vector3 cullNormal=new Vector3(),cullCenter=new Vector3(),cullView=new Vector3();
    public TheLastCommandRenderer(PerspectiveCamera camera, TheLastCommandMachine machine) {
        this.machine=machine;this.camera=camera;profile=GraphicsProfile.current();
        LastCommandSurfaceStyle style=LastCommandSurfaceStyle.load();
        String diagnostic=System.getProperty("lc.diagnostic","");
        if(!diagnostic.isEmpty())style.enabled=false;
        if(diagnostic.equals("no-normal")){for(var scene:machine.scenes)if(scene!=null)for(var material:scene.modelInstance.materials)material.remove(PBRTextureAttribute.NormalTexture);if(machine.panel()!=null)for(var control:machine.panel().controls())for(var material:control.scene().modelInstance.materials)material.remove(PBRTextureAttribute.NormalTexture);}
        manager=new SceneManager(new WeatheredMetalShaderProvider(style),PBRShaderProvider.createDefaultDepth(0));
        LastCommandSurfaceStyle.Surface[] surfaces={style.body,style.base,style.cap};
        for(int part=0;part<machine.scenes.length;part++)if(machine.scenes[part]!=null)
            for(Material material:machine.scenes[part].modelInstance.materials)
                if(style.enabled)material.set(surfaces[part].attribute(part));
                else material.remove(WeatheredMetalAttribute.TYPE);
        if(machine.panel()!=null)for(PanelControl control:machine.panel().controls())
            for(Material material:control.scene().modelInstance.materials)
                if(style.enabled&&(control instanceof SmallButton||control instanceof RotaryAdjuster||control instanceof LightModule))material.set((control instanceof SmallButton?style.cap:style.base).attribute(control instanceof SmallButton?2:1));
                else material.remove(WeatheredMetalAttribute.TYPE);
        manager.setCamera(camera);
        if(!style.legacyLook){
            for(var scene:machine.scenes)if(scene!=null)calibrateSpecular(scene.modelInstance);
            if(machine.panel()!=null)for(var control:machine.panel().controls())calibrateSpecular(control.scene().modelInstance);
        }
        float radius = machine.bounds.getDimensions(new Vector3()).len()*.5f;
        key = new DirectionalShadowLight(legacy?2048:Math.max(256,profile.shadowSize),legacy?2048:Math.max(256,profile.shadowSize),radius*(style.legacyLook?4:style.lighting.shadowSpan),radius*(style.legacyLook?4:style.lighting.shadowSpan),.01f,radius*(style.legacyLook?6:style.lighting.shadowDepth));
        if(style.legacyLook){key.direction.set(-.6f,-.65f,-.45f).nor();key.color.set(2.2f,2.05f,1.83f,1);}
        else {key.direction.set(style.lighting.keyDirection).nor();setLinearColor(key.color,style.lighting.keyColor);}
        key.setCenter(machine.bounds.getCenter(new Vector3()));if((legacy||profile.shadowSize>0)&&!diagnostic.equals("no-shadow"))manager.environment.add(key);
        else {DirectionalLightEx lowKey=new DirectionalLightEx();lowKey.direction.set(key.direction);lowKey.color.set(key.color);manager.environment.add(lowKey);}
        DirectionalLightEx fill = new DirectionalLightEx();
        fill.direction.set(.6f,-.25f,.8f).nor();if(style.legacyLook)fill.color.set(.26f,.31f,.38f,1);else setLinearColor(fill.color,style.lighting.fillColor);if(legacy||profile.lights>=2)manager.environment.add(fill);
        DirectionalLightEx rim=new DirectionalLightEx();
        rim.direction.set(.3f,-.35f,.8f).nor();if(style.legacyLook)rim.color.set(.65f,.78f,.93f,1);else setLinearColor(rim.color,style.lighting.rimColor);if(legacy||profile.lights>=3)manager.environment.add(rim);
        IBLBuilder ibl = IBLBuilder.createIndoor(key);
        if(!style.legacyLook){
            // Neutral industrial room, with broad cool/warm emitter reflections baked only at load.
            ibl.nearGroundColor.set(.035f,.037f,.04f,1);ibl.farGroundColor.set(.08f,.085f,.095f,1);
            ibl.nearSkyColor.set(.34f,.37f,.42f,1);ibl.farSkyColor.set(.10f,.115f,.14f,1);
            ibl.lights.clear();environmentEmitter(ibl,key.direction,.88f,.9f,.92f,28);
            environmentEmitter(ibl,fill.direction,.24f,.30f,.40f,10);
            environmentEmitter(ibl,new Vector3(.3f,-.55f,.85f),.24f,.21f,.16f,16);
        }
        try { diffuse=ibl.buildIrradianceMap(32);specular=ibl.buildRadianceMap(!style.legacyLook&&profile==GraphicsProfile.HIGH?8:7); } finally { ibl.dispose(); }
        brdf=new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        manager.setAmbientLight(style.legacyLook?.23f:style.lighting.ambient);
        manager.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuse));
        manager.environment.set(PBRCubemapAttribute.createSpecularEnv(specular));
        manager.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture,brdf));
        manager.environment.set(new PBRFloatAttribute(PBRFloatAttribute.ShadowBias,style.legacyLook?.0008f:style.lighting.shadowBias));
        manager.environment.set(new com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute(
            com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.Fog, Color.BLACK));
        manager.environment.set(FogAttribute.createFog(radius*3.5f,radius*8,1.5f));
        for(var scene:machine.scenes)if(scene!=null)addProvider(scene,scene.modelInstance,null,false);
        if(machine.panel()!=null)for(PanelControl control:machine.panel().controls())addProvider(control.scene(),control.scene().modelInstance,control,false);
        if(machine.mechanisms()!=null)for(var display:machine.mechanisms().displays())addProvider(display.instance(),display.instance(),display.owner(),true);
        Material iron=new Material(PBRColorAttribute.createBaseColorFactor(new Color(.012f,.016f,.02f,1)),
            PBRFloatAttribute.createMetallic(.65f),PBRFloatAttribute.createRoughness(.83f));
        if(style.enabled)iron.set(style.floor.attribute(3));
        ModelBuilder builder=new ModelBuilder();builder.begin();
        MeshPartBuilder plates=builder.part("industrial-floor",GL20.GL_TRIANGLES,
            VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal,iron);
        float step=radius*.55f, gap=radius*.004f, y=machine.bounds.min.y-radius*.025f;
        for(int x=-15;x<=15;x++)for(int z=-15;z<=15;z++)
            plates.box(x*step,y,z*step,step-gap,radius*.04f,step-gap);
        floor=builder.end();manager.getRenderableProviders().add(new RenderableProvider(){final ModelInstance instance=new ModelInstance(floor);public void getRenderables(com.badlogic.gdx.utils.Array<Renderable> output,com.badlogic.gdx.utils.Pool<Renderable> pool){if(!shadowPass||legacy)instance.getRenderables(output,pool);}});
    }
    private static void setLinearColor(Color color,float[] rgb){color.set(rgb[0],rgb[1],rgb[2],1);}
    private static void environmentEmitter(IBLBuilder ibl,Vector3 direction,float r,float g,float b,float exponent){var light=new IBLBuilder.Light();light.direction.set(direction).nor();light.color.set(r,g,b,1);light.exponent=exponent;ibl.lights.add(light);}
    private static void calibrateSpecular(ModelInstance instance){for(var material:instance.materials){var spec=material.get(PBRHDRColorAttribute.class,PBRHDRColorAttribute.Specular);if(spec!=null)spec.set(MathUtils.clamp(spec.r,0,1),MathUtils.clamp(spec.g,0,1),MathUtils.clamp(spec.b,0,1));}}
    public SceneManager sceneManager(){return manager;}
    private void addProvider(RenderableProvider source,ModelInstance instance,PanelControl control,boolean display){
        final var localBounds=instance.calculateBoundingBox(new com.badlogic.gdx.math.collision.BoundingBox());
        manager.getRenderableProviders().add((output,pool)->{
            if(control!=null&&!control.visible()||display&&shadowPass)return;
            cullTransform.set(machine.transform).mul(instance.transform);cullBounds.set(localBounds).mul(cullTransform);
            if(!legacy&&!shadowPass){
                if(!camera.frustum.boundsInFrustum(cullBounds))return;
                // Opaque flush-mounted devices are hidden by the body when viewed from its opposite side.
                // Open doors and extended handles retain conservative frustum-only culling.
                if(control!=null&&surfaceNormal(control,cullNormal)){
                    cullNormal.rot(cullTransform).nor();cullBounds.getCenter(cullCenter);cullView.set(camera.position).sub(cullCenter).nor();
                    if(cullView.dot(cullNormal)<-.15f)return;
                }
            }
            int first=output.size;source.getRenderables(output,pool);
            for(int i=first;i<output.size;i++)output.get(i).worldTransform.mulLeft(machine.transform);
        });
    }
    private boolean surfaceNormal(PanelControl control,Vector3 out){
        if(control instanceof SmallButton||control instanceof RotaryAdjuster){out.set(Vector3.Y);return true;}
        if(control instanceof CodePanel||control.id()==PanelElementId.HATCH_FRAME){out.set(Vector3.Z);return true;}
        if(control instanceof HiddenHatch hatch&&!hatch.open()&&!hatch.animating()){out.set(Vector3.Z);return true;}
        return false;
    }
    private int geometryHash(){int h=1;for(float f:machine.transform.val)h=31*h+Float.floatToIntBits(f);
        for(var scene:machine.scenes)if(scene!=null)for(float f:scene.modelInstance.transform.val)h=31*h+Float.floatToIntBits(f);
        if(machine.panel()!=null){var controls=machine.panel().controls();for(int i=0;i<controls.size();i++){var control=controls.get(i);h=31*h+(control.visible()?1:0);for(float f:control.scene().modelInstance.transform.val)h=31*h+Float.floatToIntBits(f);}}return h;}
    public void invalidateShadows(){shadowReady=false;}
    public void render(float delta) {
        manager.update(Math.max(0,delta));int hash=geometryHash();
        if(legacy||!shadowReady||hash!=shadowHash){shadowPass=true;manager.renderShadows();shadowPass=false;shadowHash=hash;shadowReady=true;}
        manager.renderColors();
    }
    void addCommandDisplay(net.mgsx.gltf.scene3d.scene.Scene scene){manager.addScene(scene);}
    @Override public void dispose() {
        if(disposed)return;disposed=true;
        manager.dispose();key.dispose();floor.dispose();diffuse.dispose();specular.dispose();brdf.dispose();
    }
}
