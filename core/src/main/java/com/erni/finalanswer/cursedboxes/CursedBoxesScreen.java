package com.erni.finalanswer.cursedboxes;

import com.badlogic.gdx.*;
import com.badlogic.gdx.math.*;
import com.badlogic.gdx.math.collision.Ray;
import com.erni.finalanswer.utils.DisplayManager;

/** Local input/timeline adapter; turn rules are independent of rendering and room authority. */
public final class CursedBoxesScreen extends InputAdapter implements Screen {
    private final CursedBoxesConfig config=CursedBoxesConfig.load();
    private final CursedBoxesAssets assets;
    public final CrateSlot[] slots=new CrateSlot[16];
    public final CursedBoxesTurn turn;
    public final CursedBoxesPerformance performance=new CursedBoxesPerformance();
    private final CursedBoxesGalleryConfig gallery=CursedBoxesGalleryConfig.load();
    private final CursedBoxesRoomLayout roomLayout=new CursedBoxesRoomLayout(gallery);
    private final CinematicCameraController camera=new CinematicCameraController();
    private final CursedCharacterController characters;
    private final CursedCharacterTestMode characterTest;
    private CursedBoxesMultiplayerController multiplayer;
    private final DebrisSystem debris;
    private final ShotgunController shotgun;
    private final CursedBoxesRenderer renderer;
    private final DisplayManager.TemporaryFullscreen display;
    private final Runnable back;
    private final Vector3 intersection=new Vector3();
    private int networkShotBudget=-1;
    private int selected,shotTarget=-1,events,developerRevealIndex;
    private static final int[] DEVELOPER_SURVIVORS={1,3,5,8,0};
    private float time,shotAge=9;
    private boolean disposed,pendingFire,warmed,activeScreen,rendering;
    public CursedBoxesScreen(Runnable back){this(back,new CursedBoxesAssets(),new DisplayManager.TemporaryFullscreen());}
    public CursedBoxesScreen(Runnable back,CursedBoxesAssets assets,DisplayManager.TemporaryFullscreen display){this(back,assets,display,false);}
    public CursedBoxesScreen(Runnable back,CursedBoxesAssets assets,DisplayManager.TemporaryFullscreen display,boolean developerCharacterTest){
        if(!assets.ready())throw new IllegalStateException("Gameplay requires complete preloading");
        this.assets=assets;this.display=display;this.back=back;selected=config.ghostSlot;
        turn=developerCharacterTest?new CursedBoxesTurn("character-test",9):new CursedBoxesTurn("local-player-1");
        characters=new CursedCharacterController(assets,gallery.ghostHeight);debris=new DebrisSystem(assets,config);shotgun=new ShotgunController(assets,config,gallery);
        for(int i=0;i<16;i++){slots[i]=new CrateSlot(i,assets,config.ghostSlot);slots[i].character=CursedCharacterAssignment.at(i,config.ghostSlot,config.characterSeed);slots[i].occupantNickname=slots[i].character==null?null:"Player 1";}
        characterTest=developerCharacterTest?new CursedCharacterTestMode(this,config.characterSeed):null;

        renderer=new CursedBoxesRenderer(assets,camera.camera,slots,debris,shotgun,gallery,roomLayout);renderer.characterTest(characterTest);
    }
    public Vector3 slotScreenPosition(int id,Vector3 out){camera.camera.project(out.set(slots[id].position));out.y=Gdx.graphics.getHeight()-out.y;return out;}
    public boolean presentationFullscreen(){return display.fullscreen();}
    public int selected(){return turn.selectedCrateId();}
    public boolean ghostWounded(){return characters.wounded(config.ghostSlot);}
    public CursedCharacterTestMode characterTest(){return characterTest;}
    public CursedCharacterController.State characterState(int slot){return characters.state(slot);}
    public com.erni.finalanswer.shotgun.ShotgunAnimator.State mechanismState(){return shotgun.gun.animator.state();}
    public float muzzleFlashIntensity(){return shotgun.gun.animator.flash();}
    public ShotgunController.State weaponState(){return shotgun.state();}
    public boolean aimedAtSelected(){return shotgun.aimedAt(slots[selected]);}
    public int activeDebris(){return debris.activeDebris();}
    public int activeParticles(){return debris.activeParticles();}
    public CursedBoxesSoundManager sounds(){return assets.sounds;}
    public int loadedModels(){return assets.models.loadedCount();}
    public boolean networkBusy(){return pendingFire||turn.active();}
    public com.finalanswer.protocol.CursedSurvivorTimeline survivorTimeline(){return renderer.survivors.clock;}
    public com.finalanswer.protocol.CursedEliminationTimeline eliminationTimeline(){return renderer.eliminations;}
    public void networkEliminations(int mask,float age,com.finalanswer.protocol.CursedEliminationTimeline.Timings timings){
        if(networkBusy())return;
        var clock=eliminationTimeline();
        if(!clock.started()){
            clock.timings.announcement=timings.announcement;clock.timings.fall=timings.fall;clock.timings.rise=timings.rise;clock.timings.hold=timings.hold;clock.start(mask);shotgun.returnToTable();
        }else if(clock.mask()!=mask)throw new IllegalStateException("Authoritative eliminated assignment changed");
        clock.seek(age);
    }
    public void networkSurvivors(int mask,float age,com.finalanswer.protocol.CursedSurvivorTimeline.Timings timings){
        if(networkBusy())return;
        var clock=survivorTimeline();if(!clock.started()){clock.timings.anticipation=timings.anticipation;clock.timings.smoke=timings.smoke;clock.timings.panel=timings.panel;clock.timings.character=timings.character;clock.timings.idle=timings.idle;clock.timings.gap=timings.gap;clock.timings.validate();renderer.survivors.start(mask,slots);shotgun.returnToTable();}
        clock.seek(age);
    }
    /** Local-only end-of-turn preview; multiplayer always uses the server's victim list. */
    public boolean developerEliminations(){
        if(multiplayer!=null||networkBusy()||!turn.ended()||eliminationTimeline().started())return false;
        int mask=0;for(CrateSlot slot:slots)if(slot.state==CrateSlot.State.DESTROYED&&slot.character!=null)mask|=1<<slot.id;
        eliminationTimeline().start(mask);return true;
    }
    public boolean developerSurvivors(int count){
        if(multiplayer!=null||characterTest!=null||networkBusy()||count<0||count>8)return false;
        renderer.resetSurvivors(slots);assets.sounds.reset();int mask=0,index=0;
        // Isolated local roster; damaged/destroyed geometry and existing visible hit characters are retained.
        for(CrateSlot slot:slots)if(slot.state!=CrateSlot.State.DESTROYED&&index<8){slot.character=CursedCharacterType.values()[index];slot.occupantNickname="Survivor "+(index+1);slot.occupantPlayerId="developer-"+index;if(index++<count)mask|=1<<slot.id;}
        renderer.survivors.start(mask,slots);shotgun.returnToTable();return true;
    }
    public void multiplayer(CursedBoxesMultiplayerController controller){
        if(characterTest!=null)throw new IllegalStateException("Nine-shot developer test cannot join multiplayer");
        multiplayer=controller;reset();
    }
    public void networkRules(int limit){turn.multiplayerLimit(limit);shotgun.cinematicReload(true);}
    public void networkShotBudget(int remaining){networkShotBudget=remaining;}
    public void restoreMagazine(int fired,int remaining){shotgun.restoreMagazine(fired,remaining);}
    public int loadedRounds(){return shotgun.magazine.rounds();}
    public int loadingRounds(){return shotgun.magazine.loadingTarget();}
    public void networkTurn(String player,int remaining,int destroyed,int selection){
        if(networkBusy())return;
        turn.synchronize(player,remaining,destroyed);
        for(CrateSlot slot:slots)slot.selected=false;
        if(selection>=0)select(selection);
    }
    public void networkAim(int id){if(id>=0&&!networkBusy())shotgun.select(slots[id]);}
    public void networkReveal(int id){slots[id].state=CrateSlot.State.DESTROYED;if(slots[id].character!=null)characters.reveal(id);}
    public void networkStatus(String player,String message,int remaining){renderer.multiplayerStatus(player,message,remaining);}
    public void networkShot(String player,int remaining,int destroyed,int target){
        if(networkBusy())throw new IllegalStateException("Overlapping server shots");
        networkTurn(player,remaining,destroyed&~(1<<target),target);
        if(!fire())throw new IllegalStateException("Validated server shot rejected by scene");
    }
    public void select(int id){
        if(characterTest!=null&&!characterTest.accepts(id))return;
        if(characterTest!=null&&characterTest.automatic()&&id!=characterTest.slot())return;
        if(survivorTimeline().started()||pendingFire||!turn.select(id))return;
        if(characterTest!=null)characterTest.selectedSlot(id);
        slots[selected].selected=false;selected=id;slots[id].selected=true;shotgun.select(slots[id]);
    }
    public boolean fire(){
        if(survivorTimeline().started()||turn.active()||turn.shotsRemaining()==0||turn.selectedCrateId()<0||turn.destroyed(selected)||pendingFire)return false;
        pendingFire=true;slots[selected].previewHidden=false;return true;
    }
    private void trigger(){
        if(!shotgun.fire())return;
        if(!turn.begin())throw new IllegalStateException("Shot started without a valid turn selection");
        pendingFire=false;shotTarget=selected;shotAge=0;events=0;renderer.shot(shotgun);camera.shot();
        if(multiplayer!=null)multiplayer.shotStarted();
    }
    public void reset(){
        assets.sounds.reset();pendingFire=false;for(CrateSlot s:slots){s.reset();s.selected=s.hovered=false;s.previewHidden=false;s.character=CursedCharacterAssignment.at(s.id,config.ghostSlot,config.characterSeed);s.occupantNickname=s.character==null?null:"Player 1";}
        renderer.resetSurvivors(slots);renderer.eliminations.reset();renderer.resetEffects();camera.reset();turn.reset();characters.reset();debris.reset();shotgun.reset();shotAge=9;shotTarget=-1;events=0;selected=config.ghostSlot;
        if(characterTest!=null)characterTest.assign();
    }
    @Override public void show(){
        if(!Boolean.getBoolean("cursed.windowed"))display.enter();
        prepare();assets.sounds.paused(false);if(characterTest!=null)characterTest.start();activeScreen=true;Gdx.input.setInputProcessor(this);
    }
    public void prepare(){
        resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());camera.update(0,time,slots[selected]);
        if(!warmed){renderer.warmup(slots,characters,debris,shotgun);reset();warmed=true;}
    }
    private void updateTimeline(){
        if(shotTarget<0||!turn.active())return;
        CrateSlot slot=slots[shotTarget];
        if((events&1)==0&&shotAge>=config.impactAt){
            events|=1;slot.state=CrateSlot.State.DESTROYED;assets.sounds.impact(shotgun.gun.animator.shotSerial());
            debris.impact(slot.position);debris.burst(slot.position,false);debris.burst(slot.position,true);
            // Preserve direct source BOX3. The transparent opening already belongs to the selected PNG.
            if(slot.character!=null)characters.damage(slot.id);
            if(multiplayer!=null)multiplayer.shotImpacted();
        }
        if(shotAge>=config.shotDuration&&shotgun.cycleSettled()){
            turn.complete();slots[selected].selected=false;
            if(turn.shotsRemaining()==0)shotgun.returnToTable();
            if(multiplayer!=null)multiplayer.shotCompleted();
        }
    }
    @Override public void render(float delta){
        if(disposed||!activeScreen||rendering)return;rendering=true;
        try{
        performance.begin(delta);
        float dt=Float.isFinite(delta)?MathUtils.clamp(delta,0,.25f):0;time+=dt;shotAge+=dt;
        if(multiplayer!=null)multiplayer.update(dt);
        // Advance existing particles before spawning timeline events so new bursts begin at age zero.
        if(characterTest!=null)characterTest.update(dt);
        renderer.updateEffects(dt);renderer.eliminations.update(dt);renderer.survivors.update(dt,slots);characters.update(dt);debris.update(dt);updateTimeline();
        if(multiplayer==null&&turn.ended())developerEliminations();
        // A new server turn may arrive while the previous player's gun is returning.
        // Keep the accepted shot queued and begin pickup as soon as that return finishes.
        if(pendingFire&&shotgun.resting())shotgun.select(slots[selected]);
        shotgun.remainingShots(multiplayer==null?turn.shotsRemaining():networkShotBudget+(pendingFire?1:0));
        camera.update(dt,time,slots[selected]);shotgun.update(dt,slots[turn.active()?shotTarget:selected]);
        if(pendingFire&&(multiplayer==null||multiplayer.canStartShot())&&shotgun.aimedAt(slots[selected]))trigger();
        assets.sounds.elimination(eliminationTimeline(),dt);assets.sounds.reveal(survivorTimeline(),dt);
        camera.applyShake();
        try{renderer.render(dt,time,slots,slots[selected],characters,debris,shotgun,turn,performance);}finally{camera.restore();}
        performance.end();
        }finally{rendering=false;}
    }
    @Override public boolean mouseMoved(int x,int y){if(multiplayer!=null)return false;int hit=pick(x,y);for(CrateSlot slot:slots)slot.hovered=slot.id==hit;return hit>=0;}
    private int pick(int x,int y){
        Ray ray=camera.camera.getPickRay(x,y);int hit=-1;float nearest=Float.MAX_VALUE;
        for(CrateSlot slot:slots)if(!turn.destroyed(slot.id)&&Intersector.intersectRayBounds(ray,slot.pickBounds,intersection)){
            float d=intersection.dst2(ray.origin);if(d<nearest){nearest=d;hit=slot.id;}
        }
        return hit;
    }
    @Override public boolean touchDown(int x,int y,int pointer,int button){if(multiplayer!=null||button!=Input.Buttons.LEFT)return false;int hit=pick(x,y);if(hit>=0)select(hit);return hit>=0;}
    @Override public boolean keyDown(int key){if(multiplayer!=null&&(key==Input.Keys.R||key==Input.Keys.SPACE))return true;if(characterTest!=null&&characterTest.keyDown(key))return true;switch(key){
        case Input.Keys.F8:if(developerSurvivors(DEVELOPER_SURVIVORS[developerRevealIndex]))developerRevealIndex=(developerRevealIndex+1)%DEVELOPER_SURVIVORS.length;return true;
        case Input.Keys.SPACE:fire();return true;
        case Input.Keys.R:reset();return true;
        case Input.Keys.Q:debris.lowQuality=!debris.lowQuality;return true;
        case Input.Keys.F3:performance.toggle();return true;
        case Input.Keys.F11:display.toggle();return true;
        case Input.Keys.ESCAPE:back.run();return true;
        default:return false;
    }}
    @Override public void resize(int w,int h){if(w>0&&h>0){
        camera.resize(w,h);camera.update(0,time,slots[selected]);roomLayout.update(camera.camera,w,h);
        for(CrateSlot slot:slots)slot.place(roomLayout.origin);renderer.placeShelf(roomLayout.origin);shotgun.placeTable(roomLayout.tableAnchor);shotgun.audioFloor(roomLayout.origin.y+CursedBoxesShelf.RIGHT_FOOT_Y);
    }}
    @Override public void hide(){activeScreen=false;assets.sounds.paused(true);renderer.resetSurvivors(slots);renderer.resetEffects();camera.reset();if(Gdx.input.getInputProcessor()==this)Gdx.input.setInputProcessor(null);if(performance.visible)performance.toggle();display.restore();}
    @Override public void pause(){assets.sounds.paused(true);}
    @Override public void resume(){if(activeScreen)assets.sounds.paused(false);}
    @Override public void dispose(){if(disposed)return;disposed=true;hide();if(multiplayer!=null)multiplayer.close();performance.dispose();renderer.dispose();shotgun.dispose();assets.dispose();}
}
