package com.erni.finalanswer.forgottenroom3d;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.ModelBatch;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.utils.Disposable;
import net.mgsx.gltf.scene3d.attributes.PBRCubemapAttribute;
import net.mgsx.gltf.scene3d.attributes.PBRTextureAttribute;
import net.mgsx.gltf.scene3d.lights.DirectionalShadowLight;
import net.mgsx.gltf.scene3d.lights.PointLightEx;
import net.mgsx.gltf.scene3d.scene.SceneManager;
import net.mgsx.gltf.scene3d.shaders.PBRShaderConfig;
import net.mgsx.gltf.scene3d.shaders.PBRShaderProvider;
import net.mgsx.gltf.scene3d.utils.IBLBuilder;

/**
 * Renders the 3D study with gdx-gltf PBR: a fixed camera, afternoon sun through the window with soft shadow-mapped
 * light on the floor, warm bounce from an indoor IBL, and a dim interior fill. Presentation only.
 */
public final class RoomRenderer3D implements Disposable {
    public final PerspectiveCamera camera;
    private final SceneManager scene;private final DirectionalShadowLight sun;private final PointLightEx fill,bounce;
    private final Cubemap diffuse,specular;private final Texture brdf;private final ModelBatch unlit=new ModelBatch();
    public final RoomEnvironment room;

    public RoomRenderer3D(){
        room=new RoomEnvironment();
        camera=new PerspectiveCamera(52,1920,1080);
        // fixed composition: from the front-right corner of the room, seeing window, cabinet, door, desk and floor
        camera.position.set(1.15f,1.62f,RoomEnvironment.D-.25f);camera.lookAt(-.55f,1.15f,.9f);camera.up.set(Vector3.Y);
        camera.near=.05f;camera.far=30;camera.update();

        PBRShaderConfig cfg=PBRShaderProvider.createDefaultConfig();cfg.numBones=0;cfg.numDirectionalLights=1;cfg.numPointLights=2;cfg.numSpotLights=0;
        var depth=PBRShaderProvider.createDefaultDepthConfig();depth.numBones=0;
        scene=new SceneManager(new PBRShaderProvider(cfg),new net.mgsx.gltf.scene3d.shaders.PBRDepthShaderProvider(depth));
        scene.setCamera(camera);

        sun=new DirectionalShadowLight(2048,2048,8f,8f,.1f,30f);
        sun.set(new Color(1f,.86f,.68f,1),new Vector3(.72f,-.48f,-.30f).nor(),9.5f);
        sun.setCenter(-.4f,1f,2.2f);
        scene.environment.add(sun);
        fill=new PointLightEx();fill.set(new Color(1f,.84f,.66f,1),new Vector3(.4f,2.7f,3.0f),10f,14f);scene.environment.add(fill);
        bounce=new PointLightEx();bounce.set(new Color(1f,.80f,.58f,1),new Vector3(-1.2f,.5f,2.1f),10f,7f);scene.environment.add(bounce);

        IBLBuilder ib=IBLBuilder.createIndoor(sun);
        ib.nearGroundColor.set(.30f,.20f,.13f,1);ib.farGroundColor.set(.12f,.08f,.05f,1);ib.nearSkyColor.set(.55f,.47f,.38f,1);ib.farSkyColor.set(.28f,.26f,.24f,1);
        try{diffuse=ib.buildIrradianceMap(64);specular=ib.buildRadianceMap(7);}finally{ib.dispose();}
        brdf=new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        scene.setAmbientLight(.18f);
        scene.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuse));scene.environment.set(PBRCubemapAttribute.createSpecularEnv(specular));
        scene.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture,brdf));

        for(var i:room.instances)scene.getRenderableProviders().add(i);
        for(var s:room.scenes)scene.addScene(s);
    }
    public void resize(int w,int h){camera.viewportWidth=w;camera.viewportHeight=h;camera.update();scene.updateViewport(w,h);}
    public void render(float dt){
        scene.update(dt);
        scene.renderShadows();
        Gdx.gl.glClearColor(0,0,0,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        unlit.begin(camera);if(room.sky!=null)unlit.render(room.sky);unlit.end();
        scene.renderColors();
    }
    @Override public void dispose(){scene.dispose();sun.dispose();diffuse.dispose();specular.dispose();brdf.dispose();unlit.dispose();room.dispose();}
}
