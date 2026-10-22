package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.g3d.*;
import com.badlogic.gdx.graphics.g3d.decals.*;
import com.badlogic.gdx.graphics.g3d.environment.PointLight;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.shotgun.ShotgunRenderer;

/** Background -> opaque PBR -> depth-tested transparent sprites -> weapon -> UI. */
public final class CursedBoxesRenderer implements Disposable {
    private final ShotgunRenderer world;
    private final CursedShotgunVfx firing;
    public final CursedSurvivorReveal survivors;
    private final com.badlogic.gdx.graphics.g3d.RenderableProvider survivorPanels;
    private final PointLight cursedLight=new PointLight();
    private final Vector3 cursedPosition=new Vector3();
    private CursedCharacterTestMode characterTest;
    private String networkPlayer,networkMessage;
    private int networkRemaining;
    public void multiplayerStatus(String player,String message,int remaining){networkPlayer=player;networkMessage=message;networkRemaining=remaining;}
    private static final String[] COMPLETION={"TEST COMPLETED","9 / 9 SHOTS FIRED","8 / 8 CHARACTERS REVEALED","1 EMPTY BOX DESTROYED","ALL CHARACTERS REMAIN VISIBLE"};
    private static final String[] CHARACTER_KEYS={"[1] Ghost    [2] Dracula","[3] Plague Doctor    [4] Puppeteer","[5] Skeleton    [6] Zombie","[7] Pumpkin    [8] Voodoo    [9] Empty","SPACE real shot   R reset   T test all","P inspection visibility   ESC exit"};
    public void characterTest(CursedCharacterTestMode mode){characterTest=mode;}
    private final CameraGroupStrategy strategy;
    private final DecalBatch decals;
    private final CursedBoxesShelf shelf;
    private final SpriteBatch ui=new SpriteBatch();
    private final BitmapFont font=com.erni.finalanswer.ui.UiFonts.body(18);
    private final BitmapFont title=com.erni.finalanswer.ui.UiFonts.horror(48);
    private final GlyphLayout layout=new GlyphLayout();
    private final StringBuilder status=new StringBuilder(100);
    private final OrthographicCamera overlay=new OrthographicCamera();
    private final PointLight flash=new PointLight();
    private final PerspectiveCamera camera;
    private final Vector3 muzzle=new Vector3(),namePosition=new Vector3();
    private final CursedBoxesBackground background;
    private final CursedBoxesAtmosphere atmosphere;
    private final Texture soft;
    private final CursedBoxesRoomLayout roomLayout;
    private final Decal contactShadow;
    private final Decal[] shelfContacts=new Decal[5];
    private final Vector3 shadowPosition=new Vector3();
    private final Quaternion shadowRotation=new Quaternion(),planeRotation=new Quaternion(Vector3.X,-90);
    public CursedBoxesRenderer(CursedBoxesAssets assets,PerspectiveCamera camera,CrateSlot[] slots,DebrisSystem debris,ShotgunController gun,CursedBoxesGalleryConfig gallery,CursedBoxesRoomLayout roomLayout){
        this.roomLayout=roomLayout;survivors=new CursedSurvivorReveal(assets.survivors,assets.dust);survivorPanels=(out,pool)->{for(CrateSlot slot:slots)if(!slot.previewHidden)slot.renderParts(out,pool,true);};firing=new CursedShotgunVfx(camera,assets.dust);soft=assets.dust;atmosphere=new CursedBoxesAtmosphere(assets.dust,gallery);
        contactShadow=Decal.newDecal(gallery.weaponScale*1.32f,gallery.weaponScale*.243f,new TextureRegion(assets.dust),true);
        for(int i=0;i<shelfContacts.length;i++){
            boolean core=i>=3;
            shelfContacts[i]=Decal.newDecal(i==0?10f:core?1.45f:1.7f,i==0?2f:core?.42f:1.75f,new TextureRegion(assets.dust),true);
            shelfContacts[i].setRotation(planeRotation);shelfContacts[i].setColor(.025f,.012f,.006f,i==0?.25f:core?.95f:.45f);
        }
        background=new CursedBoxesBackground(assets.backgrounds,assets.lighting,CursedBoxesBackground.Settings.load());this.camera=camera;world=new ShotgunRenderer(camera,false);
        world.provider((out,pool)->{for(CrateSlot slot:slots)if(!slot.previewHidden)slot.renderParts(out,pool,false);debris.getRenderables(out,pool);gun.gun.getRenderables(out,pool);});
        world.environment().add(flash);world.environment().add(cursedLight);
        world.environment().set(new com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.AmbientLight,.32f,.255f,.19f,1));
        strategy=new CameraGroupStrategy(camera);decals=new DecalBatch(80,strategy);
        shelf=new CursedBoxesShelf(assets.shelf,ui.getShader());
    }
    public void shot(ShotgunController gun){firing.fire(gun.gun);}
    public void updateEffects(float dt){firing.update(dt);}
    public void resetSurvivors(CrateSlot[] slots){survivors.reset(slots);cursedLight.intensity=0;}
    public void resetEffects(){firing.reset();flash.intensity=0;}
    public void placeShelf(Vector3 origin){
        shelf.position(origin);
        shelfContacts[0].setPosition(origin.x,origin.y+CursedBoxesShelf.RIGHT_FOOT_Y-.007f,origin.z-.35f);
        for(int i=1;i<shelfContacts.length;i++){
            boolean left=i==1||i==3,core=i>=3;
            float x=left?CursedBoxesShelf.LEFT_FOOT_X:CursedBoxesShelf.RIGHT_FOOT_X;
            float y=left?CursedBoxesShelf.LEFT_FOOT_Y:CursedBoxesShelf.RIGHT_FOOT_Y;
            // Dense shadow starts at the exact support tip. The earlier forward offset left a lit gap.
            shelfContacts[i].setPosition(origin.x+x,origin.y+y-.004f,origin.z-.55f+(core?.008f:.08f));
        }
    }
    public void render(float delta,float time,CrateSlot[] slots,CrateSlot selected,CursedCharacterController characters,DebrisSystem debris,ShotgunController gun,CursedBoxesTurn turn,CursedBoxesPerformance performance){
        com.badlogic.gdx.graphics.glutils.HdpiUtils.glViewport(0,0,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());Gdx.gl.glClearColor(.018f,.009f,.014f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT|GL20.GL_DEPTH_BUFFER_BIT);
        overlay.setToOrtho(false,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());ui.setProjectionMatrix(overlay.combined);
        // Color-only pass. Keep gallery pixels out of the 3D depth buffer.
        Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);Gdx.gl.glDepthMask(false);
        background.update(delta);background.draw(ui,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
        atmosphere.draw(ui,Gdx.graphics.getWidth(),Gdx.graphics.getHeight(),time,debris.lowQuality);
        Gdx.gl.glDepthMask(true);
        // Horizontal floor contacts sit under the two supports; the cabinet no longer has a vertical shadow strip.
        Gdx.gl.glDepthMask(false);for(Decal contact:shelfContacts)decals.add(contact);decals.flush();Gdx.gl.glDepthMask(true);
        float pulse=gun.gun.animator.flash();shelf.draw(camera,time,pulse);
        // A soft quad on the virtual tabletop, faded as soon as the gun leaves the surface.
        if(gun.contactOpacity()>0){Gdx.gl.glDepthMask(false);contactShadow.setPosition(gun.shadowPosition(shadowPosition));shadowRotation.set(Vector3.Y,gun.restYaw()).mul(planeRotation);contactShadow.setRotation(shadowRotation);contactShadow.setColor(.04f,.018f,.006f,.5f*gun.contactOpacity());decals.add(contactShadow);decals.flush();Gdx.gl.glDepthMask(true);}
        float intensity=gun.gun.animator.flash();gun.gun.muzzle(muzzle);flash.set(1,.67f,.3f,muzzle,55*intensity);
        float drama=survivors.drama();survivors.lightPosition(cursedPosition,slots);cursedLight.set(1,.035f,.055f,cursedPosition,drama*8);
        world.environment().get(com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.class,com.badlogic.gdx.graphics.g3d.attributes.ColorAttribute.AmbientLight).color.set(.32f-drama*.045f,.255f-drama*.045f,.19f-drama*.025f,1);
        world.render(delta);
        Gdx.gl.glDepthMask(false);
        survivors.renderGlow(decals,camera,slots);
        characters.render(decals,camera,slots,time);
        debris.renderDust(decals,camera);decals.flush();
        survivors.renderCharacters(camera,slots,time);
        world.renderTransparent(survivorPanels);
        survivors.renderSmoke(decals,camera,slots);
        firing.render(gun.gun);
        Gdx.gl.glDisable(GL20.GL_DEPTH_TEST);Gdx.gl.glDepthMask(false);
        // Reuse the exact background pixels as a foreground counter-edge mask: no duplicate table.
        int counterHeight=Math.max(0,Math.min(Gdx.graphics.getHeight(),Math.round(roomLayout.counterFrontScreenY(Gdx.graphics.getWidth(),Gdx.graphics.getHeight()))));
        if(counterHeight>0){Gdx.gl.glEnable(GL20.GL_SCISSOR_TEST);com.badlogic.gdx.graphics.glutils.HdpiUtils.glScissor(0,0,Gdx.graphics.getWidth(),counterHeight);background.draw(ui,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());Gdx.gl.glDisable(GL20.GL_SCISSOR_TEST);}
        Gdx.gl.glDepthMask(true);ui.begin();
        if(intensity>0){ui.setColor(1,.57f,.21f,intensity*.06f);ui.draw(soft,0,0,Gdx.graphics.getWidth(),Gdx.graphics.getHeight());ui.setColor(Color.WHITE);}
        float h=Gdx.graphics.getHeight();
        if(survivors.clock.started()){font.setColor(.9f,.4f,.35f,1);font.getData().setScale(.85f);status.setLength(0);status.append("SURVIVORS  ").append(survivors.clock.count()).append("  /  ").append(survivors.clock.state());layout.setText(font,status);font.draw(ui,layout,(Gdx.graphics.getWidth()-layout.width)/2,h-65);}
        float w=Gdx.graphics.getWidth();
        title.setColor(.76f,.58f,.33f,1);layout.setText(title,"CURSED BOXES");title.draw(ui,layout,(w-layout.width)/2,h-12);
        font.setColor(.57f,.48f,.38f,1);font.getData().setScale(.72f);font.draw(ui,"F I N A L   A N S W E R",30,h-25);
        font.getData().setScale(.8f);font.draw(ui,networkPlayer!=null?(turn.shotLimit()==1?"PHONE CONTROL / ONE SHOT":"PHONE CONTROL / TWO SHOTS"):characterTest==null?"ONE SPIRIT. SIXTEEN BOXES.":"EIGHT PLAYERS. NINE SHOTS.",w-260,h-27);
        if(networkPlayer!=null){font.setColor(.89f,.73f,.49f,1);layout.setText(font,networkPlayer);font.draw(ui,layout,(w-layout.width)/2,h-75);font.getData().setScale(.65f);layout.setText(font,networkMessage);font.draw(ui,layout,(w-layout.width)/2,h-96);}
        font.getData().setScale(.9f);font.setColor(.65f,.57f,.45f,1);
        font.draw(ui,networkPlayer==null?"CLICK select   SPACE fire   R reset   F11 fullscreen   F3 stats   Q effects   F8 survivors   ESC return":"PHONE select / fire   F11 fullscreen   F3 stats   Q effects   F8 survivors   ESC return to lobby",30,28);
        status.setLength(0);status.append("BOX ");if(selected.id<9)status.append('0');status.append(selected.id+1).append("   /   ").append(selected.state).append("   /   ").append(weaponStatus(gun,turn,selected)).append("   /   SHOTS ").append(networkPlayer==null?turn.shotsRemaining():networkRemaining).append(" / ").append(turn.shotLimit());
        font.draw(ui,status,30,51);
        font.getData().setScale(.85f);
        font.draw(ui,networkPlayer!=null?(debris.lowQuality?"MULTIPLAYER / LOW FX":"MULTIPLAYER / FULL FX"):(debris.lowQuality?"LOCAL DEMO  /  LOW FX":"LOCAL DEMO  /  FULL FX"),w-215,28);
        if(performance.visible){
            font.setColor(.92f,.82f,.6f,1);font.getData().setScale(.9f);
            status.setLength(0);status.append("FPS ").append(Gdx.graphics.getFramesPerSecond()).append("  FRAME ").append(Math.round(performance.frameMs*10)/10f).append(" ms  CPU ").append(Math.round(performance.cpuMs*10)/10f).append(" ms");
            font.draw(ui,status,28,h-85);
            status.setLength(0);status.append("DRAWS ").append(performance.draws).append("  DEBRIS ").append(debris.activeDebris()).append("  PARTICLES ").append(debris.activeParticles());font.draw(ui,status,28,h-108);
            status.setLength(0);status.append(selected.state).append("  SHOTS ").append(turn.shotsRemaining()).append("  ").append(turn.currentPlayerId);font.draw(ui,status,28,h-131);
        }
        // Revealed occupants carry a player nickname; intact normal boxes never disclose their content.
        font.getData().setScale(.62f);
        for(CrateSlot slot:slots)if(slot.character!=null&&slot.occupantNickname!=null&&(slot.previewHidden||slot.state==CrateSlot.State.DESTROYED||slot.survivorOpening&&survivors.clock.characterOpacity(slot.id)>.8f)){
            float alpha=1;
            camera.project(namePosition.set(slot.position.x,slot.position.y-.66f,slot.position.z+.12f));
            font.setColor(.025f,.012f,.005f,alpha);layout.setText(font,slot.occupantNickname);float nx=namePosition.x-layout.width*.5f,ny=namePosition.y;
            font.draw(ui,layout,nx+1,ny-1);
            font.setColor(.88f,.74f,.5f,alpha);layout.setText(font,slot.occupantNickname);font.draw(ui,layout,nx,ny);
        }
        if(characterTest!=null){
            float x=w-365,y=h-85;
            font.getData().setScale(.8f);font.setColor(.92f,.76f,.48f,1);
            font.draw(ui,"CHARACTER TEST / DEVELOPER",x,y);y-=23;
            font.draw(ui,characterTest.targetName(),x,y);y-=21;
            font.draw(ui,characterTest.targetNickname(),x,y);y-=23;
            for(String line:CHARACTER_KEYS){font.draw(ui,line,x,y);y-=20;}
            if(characterTest.completed()){
                for(String line:COMPLETION){font.draw(ui,line,x,y-3);y-=21;}
            }else font.draw(ui,characterTest.automatic()?"AUTO / NINE SHOTS":characterTest.preview()?"INSPECTION / BOX HIDDEN":"REAL SHOT / FRONT VISIBLE",x,y-3);
        }
        ui.end();
    }
    private String weaponStatus(ShotgunController gun,CursedBoxesTurn turn,CrateSlot selected){
        if(gun.returning())return "RETURNING";
        if(turn.ended())return "TURN COMPLETE";
        if(gun.resting())return "SELECT A BOX";
        if(!gun.gun.readyToFire())return "CYCLING";
        return gun.aimedAt(selected)?"READY":"LIFT / AIM";
    }
    /** Submit every mesh/material/texture/effect variant, including the spent shell, before input. */
    public void warmup(CrateSlot[] slots,CursedCharacterController characters,DebrisSystem debris,ShotgunController gun){
        CursedBoxesTurn loadingTurn=new CursedBoxesTurn("loading");
        CursedBoxesPerformance loadingStats=new CursedBoxesPerformance();
        gun.warmupAudio(true);
        try{
            gun.prepareWarmup(slots[5]);gun.fire();shot(gun);firing.warmup();
            debris.impact(slots[5].position);debris.burst(slots[5].position,false);debris.burst(slots[5].position,true);debris.smoke(gun.gun.muzzle(muzzle));debris.update(0);
            for(int state=0;state<3;state+=2){
                for(CrateSlot slot:slots)slot.state=CrateSlot.State.values()[state];
                if(state==2)characters.damage(5);
                render(0,0,slots,slots[5],characters,debris,gun,loadingTurn,loadingStats);
            }
            for(CursedCharacterType type:CursedCharacterType.values()){
                slots[5].character=type;render(0,0,slots,slots[5],characters,debris,gun,loadingTurn,loadingStats);
            }
            gun.update(.46f,slots[5]);gun.update(.2f,slots[5]);
            render(0,0,slots,slots[5],characters,debris,gun,loadingTurn,loadingStats);
            // Loading-only fence: driver pipeline setup must finish before the first playable frame.
            survivors.warmup(camera,slots);
            for(int state=0;state<3;state++){for(CrateSlot slot:slots){slot.state=CrateSlot.State.values()[state];slot.survivorOpening=true;slot.survivorPanelOpacity=.5f;}render(0,0,slots,slots[5],characters,debris,gun,loadingTurn,loadingStats);}
            survivors.reset(slots);
            Gdx.gl.glFinish();
        }finally{gun.warmupAudio(false);loadingStats.dispose();}
    }
    @Override public void dispose(){survivors.dispose();background.dispose();firing.dispose();world.dispose();shelf.dispose();decals.dispose();strategy.dispose();ui.dispose();font.dispose();title.dispose();}
}
