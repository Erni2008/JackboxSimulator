package com.erni.finalanswer.forgottenroom;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.badlogic.gdx.utils.BufferUtils;
import com.badlogic.gdx.utils.Disposable;
import java.nio.ByteBuffer;
import java.util.*;
import net.mgsx.gltf.loaders.gltf.GLTFLoader;
import net.mgsx.gltf.scene3d.attributes.PBRCubemapAttribute;
import net.mgsx.gltf.scene3d.attributes.PBRTextureAttribute;
import net.mgsx.gltf.scene3d.lights.DirectionalLightEx;
import net.mgsx.gltf.scene3d.scene.Scene;
import net.mgsx.gltf.scene3d.scene.SceneAsset;
import net.mgsx.gltf.scene3d.scene.SceneManager;
import net.mgsx.gltf.scene3d.shaders.PBRShaderConfig;
import net.mgsx.gltf.scene3d.shaders.PBRShaderProvider;
import net.mgsx.gltf.scene3d.utils.IBLBuilder;

/**
 * Real 3D props on the 2D painted rooms. A CC0 glTF model (assets/forgotten_room/props3d/&lt;model&gt;) is rendered once,
 * off-screen, with PBR and the room's own light — key direction and colour from its window, warm fill from its candles —
 * from a camera angle that matches the painting. The result is a cut-out texture that the 2D room draws exactly like a
 * painted object (same placement, shadows, reveal). Rendering happens on load, never per frame.
 */
final class Prop3DRenderer implements Disposable {
    /** Game object id → Poly Haven model folder. Objects not listed keep their painted art. */
    static final Map<String,String> MODELS=Map.ofEntries(
        Map.entry("clock","vintage_grandfather_clock_01"),Map.entry("chest","treasure_chest"),Map.entry("bust","marble_bust_01"),
        Map.entry("candelabra","brass_candleholders"),Map.entry("compass","seadogs_compass"),Map.entry("dagger","ornate_medieval_dagger"),
        Map.entry("oil_lamp","vintage_oil_lamp"),Map.entry("goblet","brass_goblets"));
    /** How each prop faces the camera (degrees around Y). */
    private static final Map<String,Float> YAW=Map.of("clock",-12f,"chest",-28f,"bust",-30f,"candelabra",0f,"compass",-20f,"dagger",90f,"oil_lamp",-20f,"goblet",-10f);
    /** Room lighting: key colour/direction (from the window), fill colour, overall ambient. */
    record RoomLight(Color key,Vector3 dir,float keyI,Color fill,float fillI,float ambient){}
    static RoomLight light(String room){
        return room.equals("room_02")
            ?new RoomLight(new Color(.52f,.68f,1f,1),new Vector3(-.25f,-.85f,-.5f).nor(),2.1f,new Color(1f,.59f,.26f,1),2.6f,.23f)   // greenhouse moon and warm lanterns
            :new RoomLight(new Color(.62f,.72f,1f,1),new Vector3(.85f,-.35f,-.40f).nor(),2.6f,new Color(1f,.62f,.32f,1),2.4f,.22f); // moon left, candles right
    }
    private final Map<String,Texture> cache=new HashMap<>();private final Map<String,SceneAsset> assets=new HashMap<>();
    private boolean broken;

    /** The rendered prop for this room, or null when there is no model (or 3D isn't available) — then painted art is used. */
    Texture get(String objectId,String room){
        String model=MODELS.get(objectId);if(model==null||broken)return null;
        String key=objectId+"@"+room;Texture t=cache.get(key);if(t!=null)return t;
        try{t=render(objectId,model,light(room));}catch(RuntimeException e){Gdx.app.error("Prop3D","cannot render "+model+": "+e);broken=true;return null;}
        if(t!=null)cache.put(key,t);return t;
    }

    private Texture render(String id,String model,RoomLight L){
        var f=Gdx.files.internal("forgotten_room/props3d/"+model+"/"+model+".gltf");if(!f.exists())return null;
        SceneAsset asset=assets.computeIfAbsent(model,m->new GLTFLoader().load(f));
        Scene scene=new Scene(asset.scene);
        scene.modelInstance.transform.idt().rotate(Vector3.Y,YAW.getOrDefault(id,0f));
        BoundingBox b=new BoundingBox();scene.modelInstance.calculateBoundingBox(b);b.mul(scene.modelInstance.transform);
        Vector3 c=b.getCenter(new Vector3());float size=Math.max(b.getHeight(),Math.max(b.getWidth(),b.getDepth()));
        // camera a little above the object looking slightly down, like the painted rooms' eye level
        int px=640;PerspectiveCamera cam=new PerspectiveCamera(22,px,px);
        float dist=size*2.9f;cam.position.set(c.x,c.y+dist*.22f,c.z+dist);cam.lookAt(c);cam.near=dist*.05f;cam.far=dist*4;cam.update();

        PBRShaderConfig cfg=PBRShaderProvider.createDefaultConfig();cfg.numBones=0;cfg.numDirectionalLights=2;cfg.numPointLights=0;cfg.numSpotLights=0;
        var depth=PBRShaderProvider.createDefaultDepthConfig();depth.numBones=0;
        SceneManager sm=new SceneManager(new PBRShaderProvider(cfg),new net.mgsx.gltf.scene3d.shaders.PBRDepthShaderProvider(depth));
        sm.setCamera(cam);sm.addScene(scene);
        DirectionalLightEx key=new DirectionalLightEx();key.set(L.key(),L.dir(),L.keyI());sm.environment.add(key);
        DirectionalLightEx fill=new DirectionalLightEx();fill.set(L.fill(),new Vector3(-L.dir().x,-.25f,-.5f).nor(),L.fillI());sm.environment.add(fill);
        IBLBuilder ib=IBLBuilder.createIndoor(key);ib.nearGroundColor.set(.28f,.18f,.12f,1);ib.farGroundColor.set(.10f,.07f,.05f,1);ib.nearSkyColor.set(.45f,.38f,.30f,1);ib.farSkyColor.set(.22f,.20f,.20f,1);
        Cubemap diffuse=ib.buildIrradianceMap(32),specular=ib.buildRadianceMap(6);ib.dispose();
        Texture brdf=new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        sm.setAmbientLight(L.ambient());
        sm.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuse));sm.environment.set(PBRCubemapAttribute.createSpecularEnv(specular));
        sm.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture,brdf));

        FrameBuffer fb=new FrameBuffer(Pixmap.Format.RGBA8888,px,px,true);
        Pixmap out;
        try{
            fb.begin();Gdx.gl.glClearColor(0,0,0,0);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
            sm.update(0);sm.renderColors();
            ByteBuffer pixels=BufferUtils.newByteBuffer(px*px*4);Gdx.gl.glPixelStorei(GL20.GL_PACK_ALIGNMENT,1);
            Gdx.gl.glReadPixels(0,0,px,px,GL20.GL_RGBA,GL20.GL_UNSIGNED_BYTE,pixels);
            fb.end();
            out=crop(pixels,px);
        }finally{fb.dispose();sm.dispose();diffuse.dispose();specular.dispose();brdf.dispose();}
        if(out==null)return null;
        Texture t=new Texture(out,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);out.dispose();return t;
    }
    /** Flip the GL read-back upright and crop to the object's own pixels (with a small margin). */
    private static Pixmap crop(ByteBuffer p,int n){
        int x0=n,y0=n,x1=-1,y1=-1;
        for(int y=0;y<n;y++)for(int x=0;x<n;x++){int a=p.get((y*n+x)*4+3)&255;if(a>8){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}}
        if(x1<0)return null;int m=4;x0=Math.max(0,x0-m);y0=Math.max(0,y0-m);x1=Math.min(n-1,x1+m);y1=Math.min(n-1,y1+m);
        int w=x1-x0+1,h=y1-y0+1;Pixmap out=new Pixmap(w,h,Pixmap.Format.RGBA8888);out.setBlending(Pixmap.Blending.None);
        for(int y=0;y<h;y++)for(int x=0;x<w;x++){int i=((y0+y)*n+x0+x)*4;
            int r=p.get(i)&255,g=p.get(i+1)&255,b=p.get(i+2)&255,a=p.get(i+3)&255;
            out.drawPixel(x,h-1-y,(r<<24)|(g<<16)|(b<<8)|a);}
        return out;
    }
    @Override public void dispose(){for(Texture t:cache.values())t.dispose();cache.clear();for(SceneAsset a:assets.values())a.dispose();assets.clear();}
}
