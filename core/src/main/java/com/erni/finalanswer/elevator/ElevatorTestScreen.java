package com.erni.finalanswer.elevator;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.InputAdapter;
import com.badlogic.gdx.ScreenAdapter;
import com.badlogic.gdx.graphics.OrthographicCamera;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;

/**
 * Stand-alone elevator test scene (not connected to any game mode). FitViewport 1920×1080.
 * <pre>
 *  1..5 / click a button   call a floor          O / C   open / close doors
 *  H     hold doors where they are               P       step doors 0 → 25 → 50 → 75 → 100 %
 *  E / R emergency stop / resume                 X       camera exit through the doorway (Z resets)
 *  D     debug outlines                          T       toggle TEMP labels
 * </pre>
 */
public final class ElevatorTestScreen extends ScreenAdapter {
    public final ElevatorGeometry geometry;public final ElevatorController controller;public final ElevatorRenderer renderer;
    private final ElevatorAssets assets;private final ElevatorSounds sounds;
    private final SpriteBatch batch=new SpriteBatch();private final BitmapFont font=new BitmapFont();
    private final OrthographicCamera camera=new OrthographicCamera();private final FitViewport viewport;
    private final OrthographicCamera hudCam=new OrthographicCamera();private final FitViewport hud;
    private final Vector2 touch=new Vector2();private int doorStep;

    public ElevatorTestScreen(){
        geometry=ElevatorGeometry.parse(Gdx.files.internal("elevator/elevator_geometry.json").readString("UTF-8"));
        assets=new ElevatorAssets(geometry);sounds=new ElevatorSounds(geometry);
        controller=new ElevatorController(geometry,1,false);renderer=new ElevatorRenderer(geometry,assets);
        controller.onCue(c->{sounds.accept(c);renderer.cue(c);});
        viewport=new FitViewport(geometry.worldW,geometry.worldH,camera);hud=new FitViewport(geometry.worldW,geometry.worldH,hudCam);
        font.getData().setScale(1.6f);font.setUseIntegerPositions(false);
        if(!sounds.missing.isEmpty())Gdx.app.log("Elevator","sound hooks without files yet: "+sounds.missing);
        if(!assets.temporary.isEmpty())Gdx.app.log("Elevator","TEMPORARY placeholder art for: "+assets.temporary);
    }
    @Override public void show(){Gdx.input.setInputProcessor(new InputAdapter(){
        @Override public boolean keyDown(int k){
            if(k>=Input.Keys.NUM_1&&k<=Input.Keys.NUM_5){controller.requestFloor(k-Input.Keys.NUM_0);return true;}
            switch(k){
                case Input.Keys.O->controller.openDoors();case Input.Keys.C->controller.closeDoors();case Input.Keys.H->controller.holdDoors();
                case Input.Keys.P->{doorStep=(doorStep+1)%5;controller.driveDoorsTo(doorStep*.25f);}
                case Input.Keys.E->controller.emergencyStop();case Input.Keys.R->controller.resume();
                case Input.Keys.X->renderer.startExit();case Input.Keys.Z->renderer.resetExit();
                case Input.Keys.D->renderer.debugOutlines=!renderer.debugOutlines;case Input.Keys.T->renderer.showTempLabels=!renderer.showTempLabels;
                default->{return false;}
            }return true;}
        @Override public boolean touchDown(int x,int y,int p,int b){
            hud.unproject(touch.set(x,y));          // the HUD camera never shakes or zooms
            for(var bt:geometry.buttons){float dx=touch.x-bt.x(),dy=touch.y-bt.y();if(dx*dx+dy*dy<=bt.radius()*bt.radius()*1.3f){controller.requestFloor(bt.floor());return true;}}
            return false;}
    });}
    /** Advances the simulation by an exact step (used by the screenshot capture so frames are deterministic). */
    public void step(float dt){controller.update(dt);renderer.update(controller,dt);}
    @Override public void render(float delta){
        float dt=Float.isFinite(delta)?Math.min(delta,.1f):0;step(dt);draw();
    }
    public void draw(){
        ScreenUtils.clear(0,0,0,1);viewport.apply();renderer.draw(batch,camera,controller,font);
        hud.apply();batch.setProjectionMatrix(hudCam.combined);batch.begin();font.setColor(.9f,.9f,.9f,.9f);
        font.draw(batch,String.format("state %-13s  floor %d -> %d   car %.2f   doors %3.0f%%",controller.state(),controller.currentFloor(),controller.requestedFloor(),controller.carPosition(),controller.doorOpen()*100),20,50);
        font.setColor(.7f,.7f,.7f,.8f);font.draw(batch,"1-5 floor  O/C doors  H hold  P 0/25/50/75/100%  E stop  R resume  X exit  Z reset  D outlines",20,90);
        batch.end();
    }
    @Override public void resize(int w,int h){viewport.update(w,h,true);hud.update(w,h,true);}
    @Override public void dispose(){batch.dispose();font.dispose();assets.dispose();sounds.dispose();}
}
