package com.erni.finalanswer.thinkordie;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.graphics.g3d.utils.ModelBuilder;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;
import java.util.*;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.attributes.*;
import net.mgsx.gltf.scene3d.lights.*;
import net.mgsx.gltf.scene3d.scene.*;
import net.mgsx.gltf.scene3d.utils.IBLBuilder;

/**
 * The 3D chamber behind the THINK OR DIE host screen: a stone vault with a castle door, caged lamps swinging on
 * chains, candles and a chandelier, lit by flickering point lights whose colour follows the game (ember red while
 * waiting, acid green while answering, cold blue for a resurrection, gold for the final). The camera drifts slowly
 * and can be kicked by {@link #impulse}. Props are CC0 glb files in assets/think_or_die/3d (any can be replaced).
 * If 3D fails to load (missing files, old GPU) the screen falls back to its 2D stage.
 */
final class ThinkOrDieStage3D implements Disposable {
    private final PerspectiveCamera cam=new PerspectiveCamera(52,1920,1080);
    private final SceneManager manager=new SceneManager();
    private final List<SceneAsset> assets=new ArrayList<>();private final List<Model> models=new ArrayList<>();
    private final Cubemap diffuse,specular;private final Texture brdf;
    private record Lamp(Scene scene,PointLightEx light,Vector3 pivot,float phase,float len){}
    private final List<Lamp> lamps=new ArrayList<>();private final List<PointLightEx> candles=new ArrayList<>();
    private final Color mood=new Color(.9f,.25f,.12f,1),target=new Color(mood);
    private float t,kick,dolly,targetDolly;

    ThinkOrDieStage3D(){
        DirectionalLightEx key=new DirectionalLightEx();key.direction.set(-.2f,-.9f,-.4f).nor();key.color.set(.10f,.09f,.11f,1);manager.environment.add(key);
        IBLBuilder ibl=IBLBuilder.createIndoor(key);
        try{diffuse=ibl.buildIrradianceMap(16);specular=ibl.buildRadianceMap(5);}finally{ibl.dispose();}
        brdf=new Texture(Gdx.files.classpath("net/mgsx/gltf/shaders/brdfLUT.png"));
        manager.setAmbientLight(.05f);
        manager.environment.set(PBRCubemapAttribute.createDiffuseEnv(diffuse));manager.environment.set(PBRCubemapAttribute.createSpecularEnv(specular));
        manager.environment.set(new PBRTextureAttribute(PBRTextureAttribute.BRDFLUTTexture,brdf));
        manager.environment.set(new ColorAttribute(ColorAttribute.Fog,.02f,.012f,.014f,1));
        manager.setCamera(cam);cam.near=.1f;cam.far=80;
        // vault: floor, back wall, side walls (dark stone-like PBR)
        box(0,-.25f,-6,30,.5f,30,new Color(.10f,.085f,.08f,1),.85f);
        box(0,6,-14,30,14,.5f,new Color(.07f,.06f,.06f,1),.95f);
        box(-11,6,-6,.5f,14,30,new Color(.06f,.05f,.05f,1),.95f);box(11,6,-6,.5f,14,30,new Color(.06f,.05f,.05f,1),.95f);
        for(int k=-4;k<=4;k++)box(k*2.6f,0.02f,-6,.04f,.02f,26,new Color(.02f,.02f,.02f,1),1);// floor seams
        // pillars
        for(int s=-1;s<=1;s+=2)for(int k=0;k<3;k++)box(s*8.2f,5,-11+k*4.5f,1.1f,10,1.1f,new Color(.09f,.075f,.07f,1),.9f);
        add("large_castle_door",0,0,-13.6f,3.2f,0);
        add("lantern_chandelier_01",0,7.2f,-7,2.2f,0);
        add("brass_candleholders",-6.5f,0,-9,1.6f,30);add("brass_candleholders",6.5f,0,-9,1.6f,-30);
        add("wine_barrel_01",-8.6f,0,-4,1.3f,10);add("wine_barrel_01",8.4f,0,-5,1.3f,-20);
        float[][] lampPos={{-5,-6},{-2,-3.5f},{2.2f,-3.8f},{5.2f,-6.2f},{0,-9.5f}};
        for(int k=0;k<lampPos.length;k++){Scene sc=add("caged_hanging_light",lampPos[k][0],4.6f,lampPos[k][1],1.4f,k*40);
            PointLightEx pl=new PointLightEx();pl.set(mood,new Vector3(lampPos[k][0],4,lampPos[k][1]),18f,14f);manager.environment.add(pl);
            if(sc!=null)lamps.add(new Lamp(sc,pl,new Vector3(lampPos[k][0],7.5f,lampPos[k][1]),k*1.3f,3f));}
        for(int s=-1;s<=1;s+=2){PointLightEx c=new PointLightEx();c.set(new Color(1f,.6f,.25f,1),new Vector3(s*6.5f,1.8f,-9),9f,7f);manager.environment.add(c);candles.add(c);}
    }
    private Scene add(String name,float x,float y,float z,float scale,float rotY){
        var f=Gdx.files.internal("think_or_die/3d/"+name+".glb");if(!f.exists())return null;
        SceneAsset a=new GLBLoader().load(f);assets.add(a);Scene s=new Scene(a.scene);
        s.modelInstance.transform.setToTranslation(x,y,z).rotate(Vector3.Y,rotY).scale(scale,scale,scale);manager.addScene(s);return s;
    }
    private void box(float x,float y,float z,float w,float h,float d,Color c,float rough){
        Material m=new Material(PBRColorAttribute.createBaseColorFactor(c),PBRFloatAttribute.createMetallic(0f),PBRFloatAttribute.createRoughness(rough));
        Model model=new ModelBuilder().createBox(w,h,d,m,VertexAttributes.Usage.Position|VertexAttributes.Usage.Normal);models.add(model);
        ModelInstance mi=new ModelInstance(model);mi.transform.setToTranslation(x,y,z);manager.getRenderableProviders().add(mi);
    }

    /** Colour of the light for the current phase. */
    void mood(Color c){target.set(c);}
    /** A camera jolt (0..1). */
    void impulse(float k){kick=Math.max(kick,k);}
    /** Move the camera closer (0 = wide, 1 = close). */
    void dolly(float k){targetDolly=k;}

    void render(float dt,int w,int h){
        t+=dt;kick=Math.max(0,kick-dt*2.2f);dolly+=(targetDolly-dolly)*Math.min(1,dt*1.5f);
        mood.lerp(target,Math.min(1,dt*2.5f));
        cam.viewportWidth=w;cam.viewportHeight=h;
        float sx=MathUtils.sin(t*.13f)*1.6f,sy=MathUtils.sin(t*.21f)*.25f,shake=kick*.25f;
        cam.position.set(sx+MathUtils.sin(t*47)*shake,3.4f+sy+MathUtils.cos(t*41)*shake,9.5f-dolly*3.5f);
        cam.lookAt(sx*.25f,3.1f,-8);cam.up.set(0,1,0);cam.update();
        for(Lamp l:lamps){float sw=MathUtils.sin(t*.9f+l.phase)*8f+kick*14*MathUtils.sin(t*9+l.phase);
            l.scene.modelInstance.transform.setToTranslation(l.pivot).rotate(Vector3.Z,sw).rotate(Vector3.X,sw*.4f).translate(0,-l.len,0).scale(1.4f,1.4f,1.4f);
            Vector3 p=new Vector3(0,-l.len-.3f,0).rotate(Vector3.X,sw*.4f).rotate(Vector3.Z,sw).add(l.pivot);
            float flick=.8f+.2f*MathUtils.sin(t*13+l.phase*5)*MathUtils.sin(t*7.3f+l.phase);if(MathUtils.random()<.004f)flick=.15f;
            l.light.set(mood,p,22f*flick*(1+kick),14f);}
        for(int k=0;k<candles.size();k++){float f=.75f+.25f*MathUtils.sin(t*17+k*3)*MathUtils.sin(t*5.1f+k);candles.get(k).intensity=9f*f;}
        manager.update(dt);
        Gdx.gl.glClear(GL20.GL_DEPTH_BUFFER_BIT);
        manager.render();
    }
    @Override public void dispose(){manager.dispose();for(SceneAsset a:assets)a.dispose();for(Model m:models)m.dispose();diffuse.dispose();specular.dispose();brdf.dispose();}
}
