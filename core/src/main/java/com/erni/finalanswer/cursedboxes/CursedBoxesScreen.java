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
    public final CursedBoxesTurn turn=new CursedBoxesTurn("local-player-1");
    public final CursedBoxesPerformance performance=new CursedBoxesPerformance();
    private final CursedBoxesGalleryConfig gallery=CursedBoxesGalleryConfig.load();
    private final CursedBoxesRoomLayout roomLayout=new CursedBoxesRoomLayout(gallery);
    private final CinematicCameraController camera=new CinematicCameraController();
    private final GhostController ghost;
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
    public CursedBoxesScreen(Runnable back,CursedBoxesAssets assets,DisplayManager.TemporaryFullscreen display){
        if(!assets.ready())throw new IllegalStateException("Gameplay requires complete preloading");
        this.assets=assets;this.display=display;this.back=back;selected=config.ghostSlot;
        ghost=new GhostController(assets,gallery.ghostHeight);debris=new DebrisSystem(assets,config);shotgun=new ShotgunController(assets,config,gallery);
        for(int i=0;i<16;i++)slots[i]=new CrateSlot(i,assets,config.ghostSlot);

        renderer=new CursedBoxesRenderer(assets,camera.camera,slots,debris,shotgun,gallery,roomLayout);
    }
    public Vector3 slotScreenPosition(int id,Vector3 out){camera.camera.project(out.set(slots[id].position));out.y=Gdx.graphics.getHeight()-out.y;return out;}
    public boolean presentationFullscreen(){return display.fullscreen();}
    public int selected(){return turn.selectedCrateId();}
    public boolean ghostWounded(){return ghost.wounded();}
    public ShotgunController.State weaponState(){return shotgun.state();}
    public boolean aimedAtSelected(){return shotgun.aimedAt(slots[selected]);}
    public int activeDebris(){return debris.activeDebris();}
    public int activeParticles(){return debris.activeParticles();}
    public int loadedModels(){return assets.models.loadedCount();}
    public void select(int id){
        if(pendingFire||!turn.select(id))return;
        slots[selected].selected=false;selected=id;slots[id].selected=true;shotgun.select(slots[id]);
    }
    public boolean fire(){
        if(turn.active()||turn.shotsRemaining()==0||turn.selectedCrateId()<0||turn.destroyed(selected)||pendingFire)return false;
        pendingFire=true;return true;
    }
    private void trigger(){
        if(!shotgun.fire())return;
        if(!turn.begin())throw new IllegalStateException("Shot started without a valid turn selection");
        pendingFire=false;shotTarget=selected;shotAge=0;events=0;debris.smoke(shotgun.gun.muzzle(intersection));
    }
    public void reset(){
        pendingFire=false;for(CrateSlot s:slots){s.reset();s.selected=s.hovered=false;}
        turn.reset();ghost.reset();debris.reset();shotgun.reset();shotAge=9;shotTarget=-1;events=0;selected=config.ghostSlot;
    }
    @Override public void show(){
        if(!Boolean.getBoolean("cursed.windowed"))display.enter();
        prepare();activeScreen=true;Gdx.input.setInputProcessor(this);
    }
    public void prepare(){
        resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());camera.update(0,time,slots[selected]);
        if(!warmed){renderer.warmup(slots,ghost,debris,shotgun);reset();warmed=true;}
    }
    private void updateTimeline(){
        if(shotTarget<0||!turn.active())return;
        CrateSlot slot=slots[shotTarget];
        if((events&1)==0&&shotAge>=config.impactAt){
            events|=1;slot.state=CrateSlot.State.DESTROYED;
            debris.impact(slot.position);debris.burst(slot.position,false);debris.burst(slot.position,true);
            // Direct source BOX3 + source GHOST3, with no intermediate frame or custom mesh.
            if(slot.ghost)ghost.damage();
        }
        if(shotAge>=config.shotDuration){
            turn.complete();slots[selected].selected=false;
            if(turn.shotsRemaining()==0)shotgun.returnToTable();
        }
    }
    @Override public void render(float delta){
        if(disposed||!activeScreen||rendering)return;rendering=true;
        try{
        performance.begin(delta);
        float dt=Float.isFinite(delta)?MathUtils.clamp(delta,0,.25f):0;time+=dt;shotAge+=dt;
        // Advance existing particles before spawning timeline events so new bursts begin at age zero.
        ghost.update(dt);debris.update(dt);updateTimeline();
        camera.update(dt,time,slots[selected]);shotgun.update(dt,slots[turn.active()?shotTarget:selected]);
        if(pendingFire&&shotgun.aimedAt(slots[selected]))trigger();
        renderer.render(dt,time,slots,slots[selected],ghost,debris,shotgun,turn,performance);
        performance.end();
        }finally{rendering=false;}
    }
    @Override public boolean mouseMoved(int x,int y){int hit=pick(x,y);for(CrateSlot slot:slots)slot.hovered=slot.id==hit;return hit>=0;}
    private int pick(int x,int y){
        Ray ray=camera.camera.getPickRay(x,y);int hit=-1;float nearest=Float.MAX_VALUE;
        for(CrateSlot slot:slots)if(!turn.destroyed(slot.id)&&Intersector.intersectRayBounds(ray,slot.pickBounds,intersection)){
            float d=intersection.dst2(ray.origin);if(d<nearest){nearest=d;hit=slot.id;}
        }
        return hit;
    }
    @Override public boolean touchDown(int x,int y,int pointer,int button){if(button!=Input.Buttons.LEFT)return false;int hit=pick(x,y);if(hit>=0)select(hit);return hit>=0;}
    @Override public boolean keyDown(int key){switch(key){
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
    @Override public void dispose(){if(disposed)return;disposed=true;hide();performance.dispose();renderer.dispose();shotgun.dispose();assets.dispose();}
}
