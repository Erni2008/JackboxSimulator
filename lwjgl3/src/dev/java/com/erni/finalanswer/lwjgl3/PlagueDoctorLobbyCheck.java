package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.screens.CageLobbyScreen;
import com.erni.finalanswer.ui.lobby.cages.*;
import java.util.ArrayList;

/** Real Stage/Batch lifecycle checks using roster snapshots, not a second lobby implementation. */
public final class PlagueDoctorLobbyCheck {
    private static void check(boolean ok,String message) { if(!ok) throw new AssertionError(message); }
    public static void main(String[] args) {
        if(StartupHelper.startNewJvmIfRequired()) return;
        var config=new Lwjgl3ApplicationConfiguration(); config.setTitle("PlagueDoctor lobby verification");
        config.setWindowedMode(1600,900); config.disableAudio(true); config.setForegroundFPS(60);
        new Lwjgl3Application(new FinalAnswerGame() {
            CageLobbyScreen preview; RoomSession room; PlagueDoctorCharacter removed;
            float elapsed,removedAt; int step; boolean capturing;
            final float[] times={.28f,.75f,1.25f,2.85f,4.05f,5.1f,6.2f,7.3f,8.4f,9.5f,10.6f,12};
            RoomSession roster(int count,int missing,String first) {
                var players=new ArrayList<RoomSession.Player>();
                for(int i=0;i<count;i++) if(i!=missing) players.add(new RoomSession.Player("z"+i,"PlagueDoctor "+(i+1),false,i==0?first:"plague_doctor","ONLINE",false,0));
                return new RoomSession("ABC123","THE WAITING ROOM",8,"standard","preview",false,players);
            }
            @Override public void create() {
                super.create(); preview=new CageLobbyScreen(this);setScreen(preview);
                room=roster(8,-1,"plague_doctor"); preview.synchronize(room,"");
                for(int i=0;i<8;i++) check(plague_doctor(i).animator().state()==PlagueDoctorAnimationState.PLAGUE_DOCTOR_APPEAR,"New instance appears");
            }
            PlagueDoctorCharacter plague_doctor(int i) { return (PlagueDoctorCharacter)preview.cages().cage(i).character(); }
            @Override public void render() {
                if(capturing) return;
                elapsed+=1f/60;
                preview.synchronize(room,"PLAGUE_DOCTOR · APPEAR / IDLE"); preview.draw(1f/60);
                if(step<times.length && elapsed>=times[step]) {
                    capturing=true;
                    check(Gdx.gl.glGetError()==0,"No OpenGL errors");
                    if(step==4) {
                        for(int i=0;i<8;i++) check(plague_doctor(i).animator().state()==PlagueDoctorAnimationState.PLAGUE_DOCTOR_IDLE,"Entrance finishes in every slot");
                        CageCharacter[] before=new CageCharacter[8];for(int i=0;i<8;i++) before[i]=preview.cages().cage(i).character();
                        room=roster(8,-1,"plague_doctor");preview.synchronize(room,"Fresh roster");
                        for(int i=0;i<8;i++) check(before[i]==preview.cages().cage(i).character(),"Refresh preserves instance");
                    }
                    if(step==5) {
                        PlagueDoctorCharacter other=plague_doctor(1); float time=other.animator().elapsed();
                        room=roster(8,-1,"zombie");preview.synchronize(room,"");
                        check(preview.cages().cage(0).character() instanceof ZombieCharacter,"Switch to zombie");
                        check(other==plague_doctor(1)&&time==other.animator().elapsed(),"Other occupant is unchanged");
                    }
                    if(step==6) {
                        float cageTime=preview.cages().cage(0).animation().time();
                        room=roster(8,-1,"plague_doctor");preview.synchronize(room,"");
                        check(plague_doctor(0).animator().state()==PlagueDoctorAnimationState.PLAGUE_DOCTOR_APPEAR,"Selection change starts fresh APPEAR");
                        check(plague_doctor(0).animator().elapsed()==0,"Appearance independent of existing cage time");
                        check(cageTime==preview.cages().cage(0).animation().time(),"Selection leaves cage timeline alone");
                        removed=plague_doctor(3);removedAt=removed.animator().elapsed();
                        room=roster(8,3,"plague_doctor");preview.synchronize(room,"");
                        Gdx.graphics.setWindowedMode(960,540);
                    }
                    if(step==7) {
                        check(removed.animator().elapsed()==removedAt,"Removed instance stops updating");
                        check(preview.cages().cage(3).character()==null,"Vacant slot has no character");
                        room=roster(8,-1,"plague_doctor");preview.synchronize(room,"");
                        check(plague_doctor(3)!=removed&&plague_doctor(3).animator().state()==PlagueDoctorAnimationState.PLAGUE_DOCTOR_APPEAR,"Rejoin replays entrance");
                        Gdx.graphics.setWindowedMode(1024,768);
                    }
                    if(step==8) {
                        var mixed=new ArrayList<RoomSession.Player>();
                        String[] choices={"skeleton","ghost","zombie","dracula","pumpkin","plague_doctor","plague_doctor","plague_doctor"};
                        for(int i=0;i<8;i++) mixed.add(new RoomSession.Player("z"+i,"Player "+(i+1),false,choices[i],"ONLINE",false,0));
                        room=new RoomSession("ABC123","THE WAITING ROOM",8,"standard","preview",false,mixed);preview.synchronize(room,"");
                        check(preview.cages().cage(0).character() instanceof SkeletonCharacter,"Skeleton retained");
                        check(preview.cages().cage(1).character() instanceof GhostCharacter,"Ghost retained");
                        check(preview.cages().cage(2).character() instanceof ZombieCharacter,"Zombie retained");
                        check(preview.cages().cage(3).character() instanceof DraculaCharacter,"Dracula retained");
                        check(preview.cages().cage(4).character() instanceof PumpkinCharacter,"Pumpkin retained");
                    }
                    if(step==9) { room=roster(0,-1,"plague_doctor");preview.synchronize(room,""); }
                    if(step==10) { room=roster(1,-1,"plague_doctor");preview.synchronize(room,""); }
                    var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("plagueDoctor.output")+"/lifecycle-"+step+".png"),pixels,-1,true);pixels.dispose();step++;capturing=false;
                    if(step==times.length) { System.out.println("PASS: eight plague_doctors, one-shot APPEAR, roster preservation, character changes, removal/rejoin, resize, Skeleton/Ghost/Zombie/Dracula/Pumpkin coexistence and GL state");Gdx.app.exit(); }
                }
            }
            @Override public void dispose() { showMainMenu();preview.dispose();super.dispose(); }
        },config);
    }
}
