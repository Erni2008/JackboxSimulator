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
    private int selected,shotTarget=-1,events;
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
    public ShotgunController.State weaponState(){return shotgun.state();}
    public boolean aimedAtSelected(){return shotgun.aimedAt(slots[selected]);}
    public int activeDebris(){return debris.activeDebris();}
    public int activeParticles(){return debris.activeParticles();}
    public int loadedModels(){return assets.models.loadedCount();}
    public boolean networkBusy(){return pendingFire||turn.active();}
    public void multiplayer(CursedBoxesMultiplayerController controller){
        if(characterTest!=null)throw new IllegalStateException("Nine-shot developer test cannot join multiplayer");
        multiplayer=controller;reset();
    }
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
        if(pendingFire||!turn.select(id))return;
        if(characterTest!=null)characterTest.selectedSlot(id);
        slots[selected].selected=false;selected=id;slots[id].selected=true;shotgun.select(slots[id]);
    }
    public boolean fire(){
        if(turn.active()||turn.shotsRemaining()==0||turn.selectedCrateId()<0||turn.destroyed(selected)||pendingFire)return false;
        pendingFire=true;slots[selected].previewHidden=false;return true;
    }
    private void trigger(){
        if(!shotgun.fire())return;
        if(!turn.begin())throw new IllegalStateException("Shot started without a valid turn selection");
        pendingFire=false;shotTarget=selected;shotAge=0;events=0;debris.smoke(shotgun.gun.muzzle(intersection));
        if(multiplayer!=null)multiplayer.shotStarted();
    }
    public void reset(){
        pendingFire=false;for(CrateSlot s:slots){s.reset();s.selected=s.hovered=false;s.previewHidden=false;s.character=CursedCharacterAssignment.at(s.id,config.ghostSlot,config.characterSeed);s.occupantNickname=s.character==null?null:"Player 1";}
        turn.reset();characters.reset();debris.reset();shotgun.reset();shotAge=9;shotTarget=-1;events=0;selected=config.ghostSlot;
        if(characterTest!=null)characterTest.assign();
    }
    @Override public void show(){
        if(!Boolean.getBoolean("cursed.windowed"))display.enter();
        prepare();if(characterTest!=null)characterTest.start();activeScreen=true;Gdx.input.setInputProcessor(this);
    }
    public void prepare(){
        resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());camera.update(0,time,slots[selected]);
        if(!warmed){renderer.warmup(slots,characters,debris,shotgun);reset();warmed=true;}
    }
    private void updateTimeline(){
        if(shotTarget<0||!turn.active())return;
        CrateSlot slot=slots[shotTarget];
        if((events&1)==0&&shotAge>=config.impactAt){
            events|=1;slot.state=CrateSlot.State.DESTROYED;
            debris.impact(slot.position);debris.burst(slot.position,false);debris.burst(slot.position,true);
            // Preserve direct source BOX3. The transparent opening already belongs to the selected PNG.
            if(slot.character!=null)characters.damage(slot.id);
            if(multiplayer!=null)multiplayer.shotImpacted();
        }
        if(shotAge>=config.shotDuration){
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
        characters.update(dt);debris.update(dt);updateTimeline();
        camera.update(dt,time,slots[selected]);shotgun.update(dt,slots[turn.active()?shotTarget:selected]);
        if(pendingFire&&(multiplayer==null||multiplayer.canStartShot())&&shotgun.aimedAt(slots[selected]))trigger();
        renderer.render(dt,time,slots,slots[selected],characters,debris,shotgun,turn,performance);
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
        for(CrateSlot slot:slots)slot.place(roomLayout.origin);renderer.placeShelf(roomLayout.origin);shotgun.placeTable(roomLayout.tableAnchor);
    }}
    @Override public void hide(){activeScreen=false;if(Gdx.input.getInputProcessor()==this)Gdx.input.setInputProcessor(null);if(performance.visible)performance.toggle();display.restore();}
    @Override public void pause(){}
    @Override public void resume(){}
    @Override public void dispose(){if(disposed)return;disposed=true;hide();if(multiplayer!=null)multiplayer.close();performance.dispose();renderer.dispose();shotgun.dispose();assets.dispose();}
}
