package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g3d.decals.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.ui.lobby.cages.*;
import com.finalanswer.protocol.CursedSurvivorTimeline;
import java.util.Arrays;

/** Survivor presentation only. Eligibility arrives from server state (or an isolated developer fixture). */
public final class CursedSurvivorReveal implements Disposable {
    public final CursedSurvivorTimeline clock=new CursedSurvivorTimeline();
    private final CursedSurvivorAssets assets;
    private final CursedPortraitRig[][] portraits=new CursedPortraitRig[16][8];
    private final CageCharacter[][] layered=new CageCharacter[16][8];
    private final boolean[] entered=new boolean[16];
    private final float[] animatedAge=new float[16];
    private final SpriteBatch sprites=new SpriteBatch(4096);
    private final Matrix4 root=new Matrix4();
    private final Decal[] glows=new Decal[16];
    private final Decal[] smoke=new Decal[4],motes=new Decal[6];
    private final Vector3 a=new Vector3(),b=new Vector3();
    public CursedSurvivorReveal(CursedSurvivorAssets assets,Texture soft){
        this.assets=assets;
        for(int slot=0;slot<16;slot++)for(CursedCharacterType type:CursedCharacterType.values()){
            if(assets.profile(type)!=null)portraits[slot][type.ordinal()]=new CursedPortraitRig(assets,type);
            else{
                CageCharacter rig=switch(type){
                    case PUPPETEER->new PuppeteerCharacter(assets.puppet,assets.puppetConfig,slot+31);
                    case ZOMBIE->new ZombieCharacter(assets.zombie);
                    case VOODOO->new VoodooCharacter(assets.voodoo,assets.voodooConfig,slot+71);
                    default->throw new IllegalStateException("Missing original survivor artwork "+type);
                };
                rig.update(8,8,slot*.61f,false);layered[slot][type.ordinal()]=rig;
            }
        }
        TextureRegion glowRegion=new TextureRegion(assets.glow);for(int i=0;i<glows.length;i++)glows[i]=Decal.newDecal(1.25f,.95f,glowRegion,true);
        TextureRegion region=new TextureRegion(assets.smoke),dot=new TextureRegion(soft);
        for(int i=0;i<smoke.length;i++)smoke[i]=Decal.newDecal(1,1,region,true);
        for(int i=0;i<motes.length;i++)motes[i]=Decal.newDecal(.025f,.025f,dot,GL20.GL_SRC_ALPHA,GL20.GL_ONE);
    }
    public boolean start(int mask,CrateSlot[] slots){
        // Validate the complete request before changing a single panel.
        for(int i=0;i<16;i++)if((mask&(1<<i))!=0&&slots[i].character==null)throw new IllegalArgumentException("Empty survivor compartment "+i);
        return clock.start(mask);
    }
    public void reset(CrateSlot[] slots){clock.reset();Arrays.fill(entered,false);Arrays.fill(animatedAge,0);for(CrateSlot slot:slots){slot.survivorOpening=false;slot.survivorPanelOpacity=1;}}
    public void update(float dt,CrateSlot[] slots){
        clock.update(dt);
        for(CrateSlot box:slots)if(clock.eligible(box.id)&&clock.localAge(box.id)>=0){
            box.survivorOpening=true;box.survivorPanelOpacity=clock.panelOpacity(box.id);
            if(clock.characterOpacity(box.id)<=0)continue;
            CageCharacter rig=layered[box.id][box.character.ordinal()];if(rig==null)continue;
            float entrance=clock.entranceAge(box.id),span=clock.entranceDuration();
            if(!entered[box.id]){
                entered[box.id]=true;animatedAge[box.id]=0;
                if(rig instanceof PuppeteerCharacter p)p.animator().play(PuppeteerAnimator.State.INTRO);
                if(rig instanceof VoodooCharacter v)v.play(VoodooAnimationController.State.SELECTED,box.id+71);
            }
            float scale=rig instanceof PuppeteerCharacter?assets.puppetConfig.introSeconds/span:rig instanceof VoodooCharacter?assets.voodooConfig.timings.selected/span:1;
            float target=Math.min(entrance,span)*scale+Math.max(0,entrance-span);
            rig.update(Math.max(0,target-animatedAge[box.id]),target,box.id*.61f,false);animatedAge[box.id]=target;
            if(rig instanceof ZombieCharacter z){float kick=MathUtils.sin(MathUtils.clamp(entrance/span,0,1)*MathUtils.PI)*(1-MathUtils.clamp(entrance/span,0,1));var p=z.animator().pose;p.headAngle+=kick*12;p.leftArm-=kick*18;p.rightArm+=kick*14;}
        }
    }
    public float drama(){int id=clock.currentBox();if(id<0)return 0;float t=clock.localAge(id);return MathUtils.sin(Math.min(1,t/clock.timings.period())*MathUtils.PI)*.8f;}
    public void lightPosition(Vector3 out,CrateSlot[] slots){int id=clock.currentBox();if(id>=0)out.set(slots[id].position).add(0,0,.2f);else out.setZero();}
    public void renderGlow(DecalBatch decals,Camera camera,CrateSlot[] slots){
        for(CrateSlot box:slots)if(clock.eligible(box.id)&&clock.localAge(box.id)>=0){
            Decal glow=glows[box.id];float t=clock.localAge(box.id),fade=MathUtils.clamp(t/.4f,0,1);
            float intensity=t<clock.timings.period()? .25f+.3f*MathUtils.sin(Math.min(1,t/clock.timings.period())*MathUtils.PI):.065f;
            glow.setPosition(box.position.x,box.position.y,box.position.z+.025f);glow.lookAt(camera.position,camera.up);glow.setColor(.8f,.11f,.12f,fade*intensity);decals.add(glow);
        }
        decals.flush();
    }
    public void renderCharacters(Camera camera,CrateSlot[] slots,float time){
        Gdx.gl.glEnable(GL20.GL_DEPTH_TEST);Gdx.gl.glDepthMask(false);sprites.setProjectionMatrix(camera.combined);sprites.begin();
        for(CrateSlot box:slots)if(clock.eligible(box.id)&&box.character!=null){
            float alpha=clock.characterOpacity(box.id);if(alpha<=0)continue;
            // World-space depth plus per-compartment screen clipping keep large cloth/accessories contained.
            sprites.flush();camera.project(a.set(box.position).add(-.84f,-.54f,.1f));camera.project(b.set(box.position).add(.84f,.54f,.1f));
            Gdx.gl.glEnable(GL20.GL_SCISSOR_TEST);com.badlogic.gdx.graphics.glutils.HdpiUtils.glScissor((int)a.x,(int)a.y,Math.max(1,(int)(b.x-a.x)),Math.max(1,(int)(b.y-a.y)));
            root.idt().translate(box.position.x,box.position.y,box.position.z+.09f);sprites.setTransformMatrix(root);sprites.setColor(1,1,1,1);
            CursedPortraitRig flat=portraits[box.id][box.character.ordinal()];
            if(flat!=null)flat.draw(sprites,time,clock.entranceAge(box.id),clock.entranceDuration(),alpha);
            else{
                float height=switch(box.character){case PUPPETEER->160;case ZOMBIE->160;case VOODOO->153;default->160;};
                float floor=box.character==CursedCharacterType.VOODOO?63:68,scale=1.01f/height;
                root.translate(0,-.51f,0).scale(scale,scale,1).translate(-174,-floor,0);sprites.setTransformMatrix(root);
                layered[box.id][box.character.ordinal()].draw(sprites,alpha);
            }
            sprites.flush();Gdx.gl.glDisable(GL20.GL_SCISSOR_TEST);
        }
        sprites.end();sprites.setTransformMatrix(root.idt());Gdx.gl.glDepthMask(false);
    }
    public void renderSmoke(DecalBatch decals,Camera camera,CrateSlot[] slots){
        int id=clock.currentBox();if(id<0)return;CrateSlot box=slots[id];float t=clock.localAge(id)-clock.timings.anticipation;
        if(t<0)return;
        float fade=MathUtils.clamp(t/.4f,0,1)*(1-MathUtils.clamp((t-1.2f)/1.1f,0,1));
        if(fade<=0)return;
        Gdx.gl.glEnable(GL20.GL_DEPTH_TEST);Gdx.gl.glDepthMask(false);
        for(int i=0;i<smoke.length;i++){
            float size=.6f+Math.min(t,1.8f)*.3f;
            smoke[i].setPosition(box.position.x+(i%2==0?-.25f:.25f),box.position.y+(i<2?-.14f:.16f)+t*.045f,box.position.z+.40f+i*.008f);
            smoke[i].lookAt(camera.position,camera.up);smoke[i].rotateZ((i-1.5f)*14+t*(i%2==0?4:-4));smoke[i].setDimensions(size,size*2/3);smoke[i].setColor(.35f,.15f,.17f,fade*.50f);decals.add(smoke[i]);
        }
        for(int i=0;i<motes.length;i++){
            motes[i].setPosition(box.position.x+MathUtils.sin(i*2.4f)*(.15f+t*.18f),box.position.y-.25f+(i%3)*.14f+t*.14f,box.position.z+.44f);
            motes[i].lookAt(camera.position,camera.up);motes[i].setColor(1,.025f,.035f,fade*.7f);decals.add(motes[i]);
        }
        decals.flush();Gdx.gl.glBlendFunc(GL20.GL_SRC_ALPHA,GL20.GL_ONE_MINUS_SRC_ALPHA);
    }
    /** Submit every texture and dynamic vertex layout before play; never allocate a rig at reveal time. */
    public void warmup(Camera camera,CrateSlot[] slots){
        CursedCharacterType saved=slots[0].character;boolean opening=slots[0].survivorOpening;float opacity=slots[0].survivorPanelOpacity;
        slots[0].character=CursedCharacterType.GHOST;clock.start(1);clock.seek(2);update(0,slots);
        for(CursedCharacterType type:CursedCharacterType.values()){slots[0].character=type;renderCharacters(camera,slots,0);}
        slots[0].character=saved;reset(slots);slots[0].survivorOpening=opening;slots[0].survivorPanelOpacity=opacity;
    }
    @Override public void dispose(){sprites.dispose();}
}
