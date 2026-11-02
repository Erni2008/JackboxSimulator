package com.erni.finalanswer.cursedcards;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.audio.Sound;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g3d.Material;
import com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.badlogic.gdx.utils.*;
import net.mgsx.gltf.loaders.glb.GLBLoader;
import net.mgsx.gltf.scene3d.attributes.PBRTextureAttribute;
import net.mgsx.gltf.scene3d.lights.PointLightEx;
import net.mgsx.gltf.scene3d.scene.*;
import java.nio.*;

/**
 * shufle.glb controller. The model's materials are kept; the red lamps are animated through an emissive mask
 * derived once from the model's own base-colour texture (only strongly red texels glow), so the body never flashes.
 */
public final class DealerMachine implements Disposable {
    public enum State {IDLE,STARTING,RUNNING,STOPPING}
    private static final float IDLE_GLOW=.18f,START_TIME=.55f,STOP_TIME=.7f;
    public final DealerConfig config;
    public final Scene scene;
    public final PointLightEx slotLight=new PointLightEx();
    private final SceneAsset asset;
    private final Texture glowMask;
    private final Array<ColorAttribute> emissive=new Array<>();
    private final Matrix4 base=new Matrix4();
    private final BoundingBox localBounds=new BoundingBox(),worldBounds=new BoundingBox();
    private final Sound start,click,stop;
    private State state=State.IDLE;
    private float stateTime,activity,recoil,recoilVelocity,flash,time;
    public final float scale;private final float tableTop;
    /** Stand the machine on the table at (x, z) facing {@code yaw} (0 = slot toward +Z). Attachment points follow. */
    public void place(float x,float z,float yaw){base.setToTranslation(x,tableTop-localBounds.min.y*scale,z).rotate(Vector3.Y,yaw).scale(scale,scale,scale);worldBounds.set(localBounds).mul(base);apply();}

    public DealerMachine(DealerConfig config,float tableTop,CursedCardsQuality quality){this(config,tableTop,quality,quality.model);}
    /** @param model explicit GLB (benchmarks against the full-resolution source). */
    public DealerMachine(DealerConfig config,float tableTop,CursedCardsQuality quality,String model){
        this.config=config;asset=new GLBLoader().load(Gdx.files.internal(model));scene=new Scene(asset.scene);
        scene.modelInstance.calculateBoundingBox(localBounds);scale=config.machineScale();
        this.tableTop=tableTop;place(0,0,0);
        FileHandle glow=Gdx.files.internal(quality.glow);glowMask=glow.exists()?mipmapped(new Texture(glow,true)):buildGlowMask(Gdx.files.internal(quality.model));
        for(Material m:scene.modelInstance.materials){
            if(glowMask!=null)m.set(PBRTextureAttribute.createEmissiveTexture(glowMask));
            var c=ColorAttribute.createEmissive(0,0,0,1);m.set(c);emissive.add((ColorAttribute)m.get(ColorAttribute.Emissive));}
        slotLight.set(new Color(1,.16f,.08f,1),worldPoint(config.spawn,new Vector3()).add(0,.02f,.18f),0,1.6f);
        start=sound("sounds/last_command/lever.wav");click=sound("sounds/last_command/small_button_click.wav");stop=sound("sounds/last_command/machine_shutdown .wav");
        apply();
    }
    private static Sound sound(String path){if(Gdx.audio==null)return null;FileHandle f=Gdx.files.internal(path);try{return f.exists()?Gdx.audio.newSound(f):null;}catch(RuntimeException e){return null;}}
    private static void play(Sound s,float volume){if(s!=null)s.play(volume);}

    public State state(){return state;}
    public boolean active(){return state!=State.IDLE;}
    public void activate(){if(state==State.RUNNING||state==State.STARTING)return;state=State.STARTING;stateTime=0;play(start,.55f);}
    public void shutdown(){if(state==State.IDLE||state==State.STOPPING)return;state=State.STOPPING;stateTime=0;play(stop,.45f);}
    /** Card leaves the slot: small backward kick, lamp flash, click. */
    public void dispense(){recoilVelocity-=1.4f;flash=1;play(click,.7f);}
    public void reset(){state=State.IDLE;stateTime=activity=recoil=recoilVelocity=flash=0;apply();}
    private float presence=1;private final Array<com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute> fades=new Array<>();
    /** 0..1: the machine evaporates (rises, shrinks, glows, fades) once it has dealt; 0 = not drawn at all. */
    public void presence(float p){presence=MathUtils.clamp(p,0,1);
        if(presence<1&&fades.isEmpty())for(Material m:scene.modelInstance.materials){var b=new com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute(1);m.set(b);fades.add((com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute)m.get(com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute.Type));}
        if(presence>=1&&fades.notEmpty()){for(Material m:scene.modelInstance.materials)m.remove(com.badlogic.gdx.graphics.g3d.attributes.BlendingAttribute.Type);fades.clear();}
        for(var b:fades)b.opacity=presence*presence;apply();}
    public float presence(){return presence;}
    public boolean visible(){return presence>0;}

    public void update(float dt){
        time+=dt;stateTime+=dt;
        switch(state){
            case STARTING->{activity=Math.min(1,stateTime/START_TIME);if(stateTime>=START_TIME)state=State.RUNNING;}
            case RUNNING->activity=1;
            case STOPPING->{activity=Math.max(0,1-stateTime/STOP_TIME);if(stateTime>=STOP_TIME)state=State.IDLE;}
            case IDLE->activity=0;
        }
        // Critically damped spring for the recoil offset.
        float k=260,d=2*(float)Math.sqrt(k);recoilVelocity+=(-k*recoil-d*recoilVelocity)*dt;recoil+=recoilVelocity*dt;flash=Math.max(0,flash-dt*3.2f);
        apply();
    }
    private void apply(){if(emissive==null||scene==null)return;
        float pulse=.5f+.5f*MathUtils.sin(time*6.2f),startFlicker=state==State.STARTING&&MathUtils.sin(stateTime*55)>.2f?.35f:1;
        float glow=(IDLE_GLOW+activity*(.55f+.55f*pulse)*startFlicker+flash*.9f)+(1-presence)*2.2f;
        for(ColorAttribute c:emissive)c.color.set(glow,glow*.85f,glow*.85f,1);
        slotLight.intensity=presence<=0?0:.04f+activity*(.18f+.12f*pulse)+flash*.35f+(1-presence)*.6f;
        float hum=activity*.0011f,jx=hum*(MathUtils.sin(time*71)+.5f*MathUtils.sin(time*113)),jy=hum*.6f*MathUtils.sin(time*89);
        Matrix4 m=scene.modelInstance.transform.set(base);
        m.trn(jx,jy+(1-presence)*1.4f,recoil*.18f);m.rotate(Vector3.X,recoil*-20);float s=.55f+.45f*presence;m.scale(s,s,s);
    }
    /** Transform a model-local point/direction (unjittered placement). */
    public Vector3 worldPoint(Vector3 local,Vector3 out){return out.set(local).mul(base);}
    public Vector3 worldDirection(Vector3 local,Vector3 out){return out.set(local).rot(base).nor();}
    public BoundingBox worldBounds(){return worldBounds;}

    private static Texture mipmapped(Texture t){t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;}
    /** Fallback when the precomputed mask is missing (tools/assets/cursed_cards_glow.py). Emissive mask from the embedded base-colour image: strongly red, bright texels keep their colour, everything else black. */
    private static Texture buildGlowMask(FileHandle glb){
        try{
            ByteBuffer b=ByteBuffer.wrap(glb.readBytes()).order(ByteOrder.LITTLE_ENDIAN);int jsonLength=b.getInt(12);
            JsonValue json=new JsonReader().parse(new String(b.array(),20,jsonLength,java.nio.charset.StandardCharsets.UTF_8));int bin=20+jsonLength+8;
            int texture=json.get("materials").get(0).get("pbrMetallicRoughness").get("baseColorTexture").getInt("index");
            int image=json.get("textures").get(texture).getInt("source");JsonValue view=json.get("bufferViews").get(json.get("images").get(image).getInt("bufferView"));
            Pixmap source=new Pixmap(b.array(),bin+view.getInt("byteOffset",0),view.getInt("byteLength"));
            int size=1024;Pixmap mask=new Pixmap(size,size,Pixmap.Format.RGBA8888);
            try{mask.setFilter(Pixmap.Filter.BiLinear);mask.setBlending(Pixmap.Blending.None);mask.drawPixmap(source,0,0,source.getWidth(),source.getHeight(),0,0,size,size);}finally{source.dispose();}
            Color c=new Color();int lit=0;
            for(int y=0;y<size;y++)for(int x=0;x<size;x++){Color.rgba8888ToColor(c,mask.getPixel(x,y));
                float red=c.r-Math.max(c.g,c.b),w=MathUtils.clamp((red-.34f)*5,0,1)*MathUtils.clamp((c.r-.55f)*5,0,1);
                if(w>0)lit++;mask.drawPixel(x,y,Color.rgba8888(c.r*w,c.g*w*.6f,c.b*w*.6f,1));}
            Gdx.app.log("CursedCards","glow mask: "+lit+" lit texels of "+size*size);
            try{var t=new Texture(mask,true);t.setFilter(Texture.TextureFilter.MipMapLinearLinear,Texture.TextureFilter.Linear);return t;}finally{mask.dispose();}
        }catch(RuntimeException e){Gdx.app.error("CursedCards","glow mask unavailable, lamps will not pulse: "+e.getMessage());return null;}
    }
    @Override public void dispose(){asset.dispose();if(glowMask!=null)glowMask.dispose();for(Sound s:new Sound[]{start,click,stop})if(s!=null)s.dispose();}
}
