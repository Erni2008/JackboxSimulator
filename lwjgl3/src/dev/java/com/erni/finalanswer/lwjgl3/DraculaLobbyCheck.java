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
public final class DraculaLobbyCheck {
    private static void check(boolean ok,String message) { if(!ok) throw new AssertionError(message); }
    public static void main(String[] args) {
        if(StartupHelper.startNewJvmIfRequired()) return;
        var config=new Lwjgl3ApplicationConfiguration(); config.setTitle("Dracula lobby verification");
        config.setWindowedMode(1600,900); config.disableAudio(true); config.setForegroundFPS(60);
        new Lwjgl3Application(new FinalAnswerGame() {
            CageLobbyScreen preview; RoomSession room; DraculaCharacter removed;
            float elapsed,removedAt; int step; boolean capturing;
            final float[] times={.28f,.75f,1.25f,1.75f,3.1f,4.2f,5.3f,6.4f,7.5f,8.6f,9.7f,11};
            RoomSession roster(int count,int missing,String first) {
                var players=new ArrayList<RoomSession.Player>();
                for(int i=0;i<count;i++) if(i!=missing) players.add(new RoomSession.Player("z"+i,"Dracula "+(i+1),false,i==0?first:"dracula","ONLINE",false,0));
                return new RoomSession("ABC123","THE WAITING ROOM",8,"standard","preview",false,players);
            }
            @Override public void create() {
                super.create(); preview=new CageLobbyScreen(this);setScreen(preview);
                room=roster(8,-1,"dracula"); preview.synchronize(room,"");
                for(int i=0;i<8;i++) check(dracula(i).animator().state()==DraculaAnimationState.DRACULA_APPEAR,"New instance appears");
            }
            DraculaCharacter dracula(int i) { return (DraculaCharacter)preview.cages().cage(i).character(); }
            @Override public void render() {
                if(capturing) return;
                elapsed+=1f/60;
                preview.synchronize(room,"DRACULA · APPEAR / IDLE"); preview.draw(1f/60);
                if(step<times.length && elapsed>=times[step]) {
                    capturing=true;
                    check(Gdx.gl.glGetError()==0,"No OpenGL errors");
                    if(step==4) {
                        for(int i=0;i<8;i++) check(dracula(i).animator().state()==DraculaAnimationState.DRACULA_IDLE,"Entrance finishes in every slot");
                        CageCharacter[] before=new CageCharacter[8];for(int i=0;i<8;i++) before[i]=preview.cages().cage(i).character();
                        room=roster(8,-1,"dracula");preview.synchronize(room,"Fresh roster");
                        for(int i=0;i<8;i++) check(before[i]==preview.cages().cage(i).character(),"Refresh preserves instance");
                    }
                    if(step==5) {
                        DraculaCharacter other=dracula(1); float time=other.animator().elapsed();
                        room=roster(8,-1,"ghost");preview.synchronize(room,"");
                        check(preview.cages().cage(0).character() instanceof GhostCharacter,"Switch to ghost");
                        check(other==dracula(1)&&time==other.animator().elapsed(),"Other occupant is unchanged");
                    }
                    if(step==6) {
                        float cageTime=preview.cages().cage(0).animation().time();
                        room=roster(8,-1,"dracula");preview.synchronize(room,"");
                        check(dracula(0).animator().state()==DraculaAnimationState.DRACULA_APPEAR,"Selection change starts fresh APPEAR");
                        check(dracula(0).animator().elapsed()==0,"Appearance independent of existing cage time");
                        check(cageTime==preview.cages().cage(0).animation().time(),"Selection leaves cage timeline alone");
                        removed=dracula(3);removedAt=removed.animator().elapsed();
                        room=roster(8,3,"dracula");preview.synchronize(room,"");
                        Gdx.graphics.setWindowedMode(960,540);
                    }
                    if(step==7) {
                        check(removed.animator().elapsed()==removedAt,"Removed instance stops updating");
                        check(preview.cages().cage(3).character()==null,"Vacant slot has no character");
                        room=roster(8,-1,"dracula");preview.synchronize(room,"");
                        check(dracula(3)!=removed&&dracula(3).animator().state()==DraculaAnimationState.DRACULA_APPEAR,"Rejoin replays entrance");
                        Gdx.graphics.setWindowedMode(1024,768);
                    }
                    if(step==8) { room=roster(8,-1,"skeleton");preview.synchronize(room,"");check(preview.cages().cage(0).character() instanceof SkeletonCharacter,"Mixed skeleton and draculas"); }
                    if(step==9) { room=roster(0,-1,"dracula");preview.synchronize(room,""); }
                    if(step==10) { room=roster(1,-1,"dracula");preview.synchronize(room,""); }
                    var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("dracula.output")+"/lifecycle-"+step+".png"),pixels,-1,true);pixels.dispose();step++;capturing=false;
                    if(step==times.length) { System.out.println("PASS: eight draculas, one-shot APPEAR, roster preservation, character changes, removal/rejoin, resize, skeleton/ghost coexistence and GL state");Gdx.app.exit(); }
                }
            }
            @Override public void dispose() { showMainMenu();preview.dispose();super.dispose(); }
        },config);
    }
}
