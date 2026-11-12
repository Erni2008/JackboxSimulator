package com.erni.finalanswer.forgottenroom;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.gameplay.forgottenroom.RoomSceneDefinition;
import com.erni.finalanswer.gameplay.forgottenroom.SupportPlacement;
import com.badlogic.gdx.graphics.g3d.model.Node;
import java.util.*;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.lights.DirectionalLightEx;
import net.mgsx.gltf.scene3d.lights.DirectionalShadowLight;
import net.mgsx.gltf.scene3d.lights.PointLightEx;
import net.mgsx.gltf.scene3d.scene.*;
import net.mgsx.gltf.scene3d.shaders.*;
import net.mgsx.gltf.scene3d.utils.IBLBuilder;
import net.mgsx.gltf.scene3d.attributes.PBRCubemapAttribute;
import net.mgsx.gltf.scene3d.attributes.PBRTextureAttribute;
import net.mgsx.gltf.scene3d.attributes.PBRFloatAttribute;

/** Whole-room perspective pass. No flat substitute is created for an absent GLB. Models load only for this room. */
final class GreenhouseScene implements Disposable {
    private final RoomSceneDefinition definition;
    private final Map<String,SceneAsset> assets=new HashMap<>();
    private final Map<String,Scene> scenes=new HashMap<>();
    private final Set<String> missing=new HashSet<>();
    private final Map<String,BoundingBox> baseFootprints=new HashMap<>();
    private final Map<String,Vector3> supportedAt=new HashMap<>();
    private final Map<String,Float> supportedRadius=new HashMap<>();
    private Texture contactShadow,brdf;
    private Cubemap diffuseEnvironment,specularEnvironment;
    private DirectionalShadowLight warmShadow;
    private PointLightEx roseFill,sunflowerFill,ficusFill;
    private SceneManager manager;private FrameBuffer buffer;private TextureRegion image;private RoomCameraSystem cameras;
    GreenhouseScene(RoomSceneDefinition definition){this.definition=definition;}
    private void init(){
        if(manager!=null)return;
        cameras=new RoomCameraSystem(definition);
        Pixmap shadow=new Pixmap(128,128,Pixmap.Format.RGBA8888);
        for(int y=0;y<128;y++)for(int x=0;x<128;x++){
            float dx=(x-63.5f)/63.5f,dy=(y-63.5f)/63.5f;
            float falloff=Math.max(0,1-dx*dx-dy*dy);
            shadow.setColor(0,0,0,falloff*falloff*.38f);shadow.drawPixel(x,y);
        }
        contactShadow=new Texture(shadow);contactShadow.setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);shadow.dispose();
        PBRShaderConfig cfg=PBRShaderProvider.createDefaultConfig();cfg.numDirectionalLights=3;cfg.numPointLights=3;cfg.numSpotLights=0;
        manager=new SceneManager(new PBRShaderProvider(cfg),new PBRDepthShaderProvider(PBRShaderProvider.createDefaultDepthConfig()));
        manager.environment.set(new PBRFloatAttribute(PBRFloatAttribute.ShadowBias,.0015f));
        manager.setCamera(cameras.camera);var l=definition.lighting();manager.setAmbientLight(l.ambient());
        DirectionalLightEx moon=new DirectionalLightEx();moon.set(color(l.moonColor()),new Vector3(l.moonDirection()).nor(),l.moonIntensity());manager.environment.add(moon);
        warmShadow=new DirectionalShadowLight(2048,2048,24,24,.1f,60);warmShadow.setCenter(0,1,0);
        warmShadow.set(color(l.warmColor()),new Vector3(l.warmDirection()).nor(),l.warmIntensity());manager.environment.add(warmShadow);
        DirectionalLightEx frontFill=new DirectionalLightEx();frontFill.set(new Color(.72f,.81f,.88f,1),new Vector3(0,-.35f,-1).nor(),2.8f);manager.environment.add(frontFill);
        roseFill=new PointLightEx();sunflowerFill=new PointLightEx();ficusFill=new PointLightEx();
        roseFill.set(new Color(1,.85f,.68f,1),new Vector3(),0f,4f);sunflowerFill.set(new Color(1,.9f,.75f,1),new Vector3(),0f,4f);
        ficusFill.set(new Color(.86f,.92f,.82f,1),new Vector3(),0f,5f);
        manager.environment.add(roseFill);manager.environment.add(sunflowerFill);manager.environment.add(ficusFill);
        IBLBuilder ibl=IBLBuilder.createIndoor(warmShadow);
        ibl.nearGroundColor.set(.45f,.31f,.18f,1);ibl.farGroundColor.set(.20f,.16f,.10f,1);
        ibl.nearSkyColor.set(.72f,.70f,.64f,1);ibl.farSkyColor.set(.34f,.40f,.49f,1);
        try{diffuseEnvironment=ibl.buildIrradianceMap(64);specularEnvironment=ibl.buildRadianceMap(7);}finally{ibl.dispose();}
        brdf=new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        manager.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuseEnvironment));
        manager.environment.set(PBRCubemapAttribute.createSpecularEnv(specularEnvironment));
        manager.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture,brdf));
        var framebufferBuilder=new FrameBuffer.FrameBufferBuilder(2560,1440);
        framebufferBuilder.addBasicColorTextureAttachment(Pixmap.Format.RGBA8888);
        framebufferBuilder.addDepthRenderBuffer(GL30.GL_DEPTH_COMPONENT24);buffer=framebufferBuilder.build();
        buffer.getColorBufferTexture().setFilter(Texture.TextureFilter.Linear,Texture.TextureFilter.Linear);
        image=new TextureRegion(buffer.getColorBufferTexture());image.flip(false,true);
    }
    private static Color color(float[] c){return new Color(c[0],c[1],c[2],1);}
    /** All objects share one camera and depth buffer. The existing host state decides presence and changes. */
    void draw(SpriteBatch batch,List<ForgottenRoomModel.Obj> objects){
        List<RoomSceneDefinition.Prop> visible=definition.objects().stream().filter(RoomSceneDefinition.Prop::enabled)
            .filter(p->objects.stream().anyMatch(o->o.id().equals(p.id()))).toList();
        if(visible.isEmpty())return;
        if(manager==null){
            java.nio.IntBuffer fb=com.badlogic.gdx.utils.BufferUtils.newIntBuffer(1),vp=com.badlogic.gdx.utils.BufferUtils.newIntBuffer(4);
            Gdx.gl.glGetIntegerv(GL20.GL_FRAMEBUFFER_BINDING,fb);Gdx.gl.glGetIntegerv(GL20.GL_VIEWPORT,vp);
            batch.end();
            try{init();}finally{Gdx.gl.glBindFramebuffer(GL20.GL_FRAMEBUFFER,fb.get(0));Gdx.gl.glViewport(vp.get(0),vp.get(1),vp.get(2),vp.get(3));batch.begin();}
        }
        supportedAt.clear();supportedRadius.clear();
        ficusFill.set(new Color(.86f,.92f,.82f,1),new Vector3(),0f,5f);
        roseFill.set(new Color(1,.85f,.68f,1),new Vector3(),0f,4f);sunflowerFill.set(new Color(1,.9f,.75f,1),new Vector3(),0f,4f);
        for(Scene s:scenes.values())manager.removeScene(s);
        for(var prop:visible){
            var object=objects.stream().filter(o->o.id().equals(prop.id())).findFirst().orElseThrow();
            var anchor=definition.slots().stream().filter(a->a.id().equals(object.slot())).findFirst().orElse(null);
            if(anchor==null||!prop.slots().contains(anchor.id()))continue;
            var surface=definition.surfaces().stream().filter(s->s.id().equals(anchor.surfaceId())).findFirst().orElseThrow();
            String model=object.variant()>0&&object.variant()<=prop.variants().size()?prop.variants().get(object.variant()-1):prop.model();
            if(missing.contains(model))continue;
            var file=Gdx.files.internal(model);
            if(!file.exists()){missing.add(model);Gdx.app.error("Greenhouse","Missing GLB: "+model);continue;}
            SceneAsset asset=assets.computeIfAbsent(model,k->new GLBLoader().load(file));
            Scene scene=scenes.computeIfAbsent(prop.id()+":"+model,k->new Scene(asset.scene));
            var transform=scene.modelInstance.transform;
            transform.idt().rotate(Vector3.Y,prop.yaw()+(object.rotated()?180:0));
            BoundingBox bounds=new BoundingBox();scene.modelInstance.calculateBoundingBox(bounds);bounds.mul(transform);
            float height=surface.maxObjectHeight()>0?Math.min(prop.heightMeters(),surface.maxObjectHeight()):prop.heightMeters();
            float scale=height/Math.max(.001f,bounds.getHeight());
            Vector3 at=cameras.position(anchor.x(),anchor.y(),surface.height());
            BoundingBox localBase=baseFootprints.computeIfAbsent(model,k->{
                BoundingBox whole=new BoundingBox();scene.modelInstance.calculateBoundingBox(whole);
                BoundingBox base=new BoundingBox();for(Node node:scene.modelInstance.nodes)collectBase(node,whole.min.y+whole.getHeight()*.12f,base);
                return base.isValid()?base:whole;
            });
            BoundingBox base=new BoundingBox(localBase).mul(new Matrix4().setToRotation(Vector3.Y,prop.yaw()+(object.rotated()?180:0)));
            if(surface.supportPolygon()!=null&&surface.supportPolygon().length>=3){
                float[][] polygon=new float[surface.supportPolygon().length][2];
                for(int i=0;i<polygon.length;i++){float[] uv=surface.supportPolygon()[i];Vector3 point=cameras.position(uv[0],uv[1],surface.height());polygon[i][0]=point.x;polygon[i][1]=point.z;}
                SupportPlacement.Fit fit;try{fit=SupportPlacement.fit(polygon,at.x,at.z,
                    (base.min.x-bounds.getCenterX())*scale,(base.max.x-bounds.getCenterX())*scale,
                    (base.min.z-bounds.getCenterZ())*scale,(base.max.z-bounds.getCenterZ())*scale);}catch(IllegalArgumentException error){throw new IllegalArgumentException(prop.id()+" on "+surface.id()+": "+error.getMessage(),error);}
                at.x=fit.x();at.z=fit.z();scale*=fit.scale();
            }
            if(prop.id().equals("red_roses")||prop.id().equals("sunflowers")){
                PointLightEx fill=prop.id().equals("red_roses")?roseFill:sunflowerFill;
                fill.set(new Color(1,.9f,.78f,1),new Vector3(at).add(-.22f,bounds.getHeight()*scale+.08f,.8f),prop.id().equals("sunflowers")?.8f:5.5f,3.5f);
            }
            if(prop.id().equals("ficus_elastica"))ficusFill.set(new Color(.9f,.94f,.84f,1),new Vector3(at).add(-.35f,bounds.getHeight()*scale*.65f,1.2f),9f,5f);
            supportedAt.put(prop.id(),new Vector3(at));supportedRadius.put(prop.id(),Math.max(base.getWidth(),base.getDepth())*scale*.5f);
            // Offset the actual rotated model bounds, not the exporter origin. Its lowest point touches the support.
            transform.idt().translate(at.x-bounds.getCenterX()*scale,at.y-bounds.min.y*scale,at.z-bounds.getCenterZ()*scale)
                .scale(scale,scale,scale).rotate(Vector3.Y,prop.yaw()+(object.rotated()?180:0));
            manager.addScene(scene);
        }
        // Contact shadows share the calibrated support anchor and the scene projection.
        batch.setColor(Color.WHITE);
        for(var prop:visible){
            var object=objects.stream().filter(o->o.id().equals(prop.id())).findFirst().orElseThrow();
            var anchor=definition.slots().stream().filter(a->a.id().equals(object.slot())).findFirst().orElse(null);
            if(anchor==null||anchor.surface().equals("HANG"))continue;
            var surface=definition.surfaces().stream().filter(v->v.id().equals(anchor.surfaceId())).findFirst().orElseThrow();
            Vector3 at=supportedAt.get(prop.id());if(at==null)continue;
            Vector3 center=cameras.camera.project(new Vector3(at),0,0,1920,1080);
            Vector3 edge=cameras.camera.project(new Vector3(at).add(supportedRadius.get(prop.id()),0,0),0,0,1920,1080);
            float width=Math.abs(edge.x-center.x)*2.4f,height=Math.max(5,width*.24f);
            batch.draw(contactShadow,center.x-width/2,center.y-height*.5f,width,height);
        }
        java.nio.IntBuffer viewport=com.badlogic.gdx.utils.BufferUtils.newIntBuffer(4);
        Gdx.gl.glGetIntegerv(GL20.GL_VIEWPORT,viewport);
        java.nio.IntBuffer previousFramebuffer=com.badlogic.gdx.utils.BufferUtils.newIntBuffer(1);
        Gdx.gl.glGetIntegerv(GL20.GL_FRAMEBUFFER_BINDING,previousFramebuffer);
        batch.end();
        try{manager.update(0);manager.renderShadows();buffer.begin();try{Gdx.gl.glClearColor(0,0,0,0);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);manager.renderColors();}finally{buffer.end();}}
        finally{Gdx.gl.glBindFramebuffer(GL20.GL_FRAMEBUFFER,previousFramebuffer.get(0));Gdx.gl.glViewport(viewport.get(0),viewport.get(1),viewport.get(2),viewport.get(3));Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);Gdx.gl.glDepthMask(false);batch.begin();}
        batch.setColor(Color.WHITE);batch.draw(image,0,0,1920,1080);
    }
    private static void collectBase(Node node,float ceiling,BoundingBox out){
        for(var part:node.parts){
            Mesh mesh=part.meshPart.mesh;float[] vertices=new float[mesh.getNumVertices()*mesh.getVertexSize()/4];mesh.getVertices(vertices);
            int stride=mesh.getVertexSize()/4,offset=mesh.getVertexAttribute(VertexAttributes.Usage.Position).offset/4;
            for(int i=offset;i+2<vertices.length;i+=stride){Vector3 v=new Vector3(vertices[i],vertices[i+1],vertices[i+2]).mul(node.globalTransform);if(v.y<=ceiling)out.ext(v);}
        }
        for(Node child:node.getChildren())collectBase(child,ceiling,out);
    }
    @Override public void dispose(){if(warmShadow!=null)warmShadow.dispose();if(diffuseEnvironment!=null)diffuseEnvironment.dispose();if(specularEnvironment!=null)specularEnvironment.dispose();if(brdf!=null)brdf.dispose();if(contactShadow!=null)contactShadow.dispose();if(manager!=null)manager.dispose();if(buffer!=null)buffer.dispose();assets.values().forEach(SceneAsset::dispose);assets.clear();scenes.clear();}
}
