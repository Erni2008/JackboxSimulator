package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.elevator.ElevatorTestScreen;
import java.util.ArrayList;
import java.util.List;

/**
 * Stand-alone elevator test scene (not wired into any game mode).
 * Interactive: ./gradlew :lwjgl3:elevatorPreview
 * Screenshot QA: ./gradlew :lwjgl3:elevatorPreview -Pel.capture=/abs/dir   (writes every key state and exits)
 */
public final class ElevatorPreview {
    public static void main(String[] args){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("FINAL ANSWER / ELEVATOR test scene (temporary art)");
        c.setWindowedMode(1600,900);c.setForegroundFPS(60);
        String capture=System.getProperty("el.capture","");if(!capture.isEmpty())c.disableAudio(true);
        new Lwjgl3Application(new Game(){
            ElevatorTestScreen screen;
            record Shot(String name,Runnable action,float hold){}
            final List<Shot> shots=new ArrayList<>();int index=-1;float waited;
            @Override public void create(){
                screen=new ElevatorTestScreen();setScreen(screen);
                if(capture.isEmpty())return;var ctl=screen.controller;
                shots.add(new Shot("01_doors_0_closed",()->{},.3f));
                for(int p:new int[]{25,50,75,100})shots.add(new Shot(String.format("%02d_doors_%d",1+p/25,p),()->ctl.driveDoorsTo(p/100f),2.2f));
                shots.add(new Shot("06_closing_midway",()->ctl.driveDoorsTo(0),.9f));
                shots.add(new Shot("07_reversed_reopen",()->ctl.driveDoorsTo(1),2.2f));
                shots.add(new Shot("08_button_pressed",()->ctl.requestFloor(3),.08f));
                shots.add(new Shot("09_ride_active_button_needle",()->{},3.2f));
                shots.add(new Shot("10_arrival_floor3_open",()->{},6f));
                shots.add(new Shot("11_ride_to_5",()->ctl.requestFloor(5),3.6f));
                shots.add(new Shot("12_emergency_stop",()->ctl.emergencyStop(),1.2f));
                shots.add(new Shot("13_resumed_arrival_floor5",()->ctl.resume(),9f));
                for(int f:new int[]{4,2,1})shots.add(new Shot("14_floor_"+f,()->ctl.requestFloor(f),12f));
                shots.add(new Shot("15_camera_exit_half",()->screen.renderer.startExit(),.75f));
                shots.add(new Shot("16_camera_exit_done",()->{},1.2f));
            }
            @Override public void render(){
                if(capture.isEmpty()){super.render();return;}
                float dt=1/60f;
                if(index<0||waited>=shots.get(index).hold()){
                    if(index>=0){screen.draw();grab(capture+"/"+shots.get(index).name()+".png");}
                    index++;waited=0;if(index>=shots.size()){Gdx.app.exit();return;}
                    shots.get(index).action().run();
                }
                screen.step(dt);waited+=dt;screen.draw();
            }
            void grab(String file){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                try{p.setBlending(Pixmap.Blending.None);var px=p.getPixels();for(int i=3;i<px.limit();i+=4)px.put(i,(byte)255);PixmapIO.writePNG(Gdx.files.absolute(file),p,-1,true);}finally{p.dispose();}}
            @Override public void dispose(){screen.dispose();super.dispose();}
        },c);
    }
}
