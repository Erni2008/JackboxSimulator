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
public final class VoodooLobbyCheck {
    private static void check(boolean ok,String message) { if(!ok) throw new AssertionError(message); }
    public static void main(String[] args) {
        if(StartupHelper.startNewJvmIfRequired()) return;
        var config=new Lwjgl3ApplicationConfiguration(); config.setTitle("Voodoo lobby verification");
        config.setWindowedMode(1600,900); config.disableAudio(true); config.setForegroundFPS(60);
        new Lwjgl3Application(new FinalAnswerGame() {
            CageLobbyScreen preview; RoomSession room; VoodooCharacter removed;
            float elapsed,removedAt; int step; boolean capturing;
            final float[] times={.28f,.75f,1.25f,1.75f,3.6f,4.2f,5.3f,6.4f,7.5f,8.6f,9.7f,11};
            RoomSession roster(int count,int missing,String first) {
                var players=new ArrayList<RoomSession.Player>();
                for(int i=0;i<count;i++) if(i!=missing) players.add(new RoomSession.Player("z"+i,"Voodoo "+(i+1),false,i==0?first:"voodoo","ONLINE",false,0));
                return new RoomSession("ABC123","THE WAITING ROOM",8,"standard","preview",false,players);
            }
            @Override public void create() {
                super.create(); preview=new CageLobbyScreen(this);setScreen(preview);
                room=roster(8,-1,"voodoo"); preview.synchronize(room,"");
                for(int i=0;i<8;i++) check(voodoo(i).controller().state()==VoodooAnimationController.State.SELECTED,"New instance appears");
            }
            VoodooCharacter voodoo(int i) { return (VoodooCharacter)preview.cages().cage(i).character(); }
            @Override public void render() {
                if(capturing) return;
                elapsed+=1f/60;
                preview.synchronize(room,"VOODOO · APPEAR / IDLE"); preview.draw(1f/60);
                if(step<times.length && elapsed>=times[step]) {
                    capturing=true;
                    check(Gdx.gl.glGetError()==0,"No OpenGL errors");
                    if(step==4) {
                        var batch=new com.badlogic.gdx.graphics.g2d.SpriteBatch();
                        try {
                            batch.begin();batch.setColor(.7f,.6f,.5f,.8f);
                            var original=new com.badlogic.gdx.graphics.Color(batch.getColor());
                            var matrix=new com.badlogic.gdx.math.Matrix4(batch.getTransformMatrix());
                            int blend=batch.getBlendDstFunc();voodoo(0).drawAt(batch,-1000,-1000,1,1);
                            check(batch.getColor().equals(original),"Batch color restored");
                            check(java.util.Arrays.equals(matrix.val,batch.getTransformMatrix().val),"Batch transform restored");
                            check(blend==batch.getBlendDstFunc(),"Blend restored");batch.end();
                        } finally {batch.dispose();}
                        for(int i=0;i<8;i++) check(voodoo(i).controller().state()==VoodooAnimationController.State.IDLE,"Entrance finishes in every slot");
                        CageCharacter[] before=new CageCharacter[8];for(int i=0;i<8;i++) before[i]=preview.cages().cage(i).character();
                        room=roster(8,-1,"voodoo");preview.synchronize(room,"Fresh roster");
                        for(int i=0;i<8;i++) check(before[i]==preview.cages().cage(i).character(),"Refresh preserves instance");
                    }
                    if(step==5) {
                        var payload=com.google.gson.JsonParser.parseString("{\"phase\":\"RESULTS\",\"gameId\":\"g\",\"phaseStartedAt\":1000,\"question\":{\"id\":\"q\"},\"results\":[{\"playerId\":\"z1\",\"isCorrect\":true},{\"playerId\":\"z2\",\"isCorrect\":false}]}").getAsJsonObject();
                        preview.cages().onRoomEvent(payload,1000);
                        check(voodoo(1).controller().state()==VoodooAnimationController.State.VICTORY,"Real quiz result victory");
                        check(voodoo(2).controller().state()==VoodooAnimationController.State.DEFEAT,"Wrong answer is defeat");
                        voodoo(1).advance(.1f,0,false);float resultTime=voodoo(1).controller().stateTime();
                        preview.cages().onRoomEvent(payload,1000);
                        check(resultTime==voodoo(1).controller().stateTime(),"Duplicate snapshot does not replay result");
                        VoodooCharacter other=voodoo(1); float time=other.controller().eventElapsed();
                        room=roster(8,-1,"zombie");preview.synchronize(room,"");
                        check(preview.cages().cage(0).character() instanceof ZombieCharacter,"Switch to zombie");
                        check(other==voodoo(1)&&time==other.controller().eventElapsed(),"Other occupant is unchanged");
                    }
                    if(step==6) {
                        float cageTime=preview.cages().cage(0).animation().time();
                        room=roster(8,-1,"voodoo");preview.synchronize(room,"");
                        check(voodoo(0).controller().state()==VoodooAnimationController.State.SELECTED,"Selection change starts fresh APPEAR");
                        check(voodoo(0).controller().eventElapsed()==0,"Appearance independent of existing cage time");
                        check(cageTime==preview.cages().cage(0).animation().time(),"Selection leaves cage timeline alone");
                        removed=voodoo(3);removedAt=removed.controller().eventElapsed();
                        room=roster(8,3,"voodoo");preview.synchronize(room,"");
                        Gdx.graphics.setWindowedMode(960,540);
                    }
                    if(step==7) {
                        check(removed.controller().eventElapsed()==removedAt,"Removed instance stops updating");
                        check(preview.cages().cage(3).character()==null,"Vacant slot has no character");
                        room=roster(8,-1,"voodoo");preview.synchronize(room,"");
                        check(voodoo(3)!=removed&&voodoo(3).controller().state()==VoodooAnimationController.State.SELECTED,"Rejoin replays entrance");
                        Gdx.graphics.setWindowedMode(1024,768);
                    }
                    if(step==8) {
                        var mixed=new ArrayList<RoomSession.Player>();
                        String[] choices={"skeleton","ghost","zombie","dracula","pumpkin","plague_doctor","voodoo","voodoo"};
                        for(int i=0;i<8;i++) mixed.add(new RoomSession.Player("z"+i,"Player "+(i+1),false,choices[i],"ONLINE",false,0));
                        room=new RoomSession("ABC123","THE WAITING ROOM",8,"standard","preview",false,mixed);preview.synchronize(room,"");
                        check(preview.cages().cage(0).character() instanceof SkeletonCharacter,"Skeleton retained");
                        check(preview.cages().cage(1).character() instanceof GhostCharacter,"Ghost retained");
                        check(preview.cages().cage(2).character() instanceof ZombieCharacter,"Zombie retained");
                        check(preview.cages().cage(3).character() instanceof DraculaCharacter,"Dracula retained");
                        check(preview.cages().cage(4).character() instanceof PumpkinCharacter,"Pumpkin retained");
                        check(preview.cages().cage(5).character() instanceof PlagueDoctorCharacter,"Doctor retained");
                    }
                    if(step==9) { room=roster(0,-1,"voodoo");preview.synchronize(room,""); }
                    if(step==10) { room=roster(1,-1,"voodoo");preview.synchronize(room,""); }
                    var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("voodoo.output")+"/lifecycle-"+step+".png"),pixels,-1,true);pixels.dispose();step++;capturing=false;
                    if(step==times.length) { System.out.println("PASS: eight voodoos, one-shot APPEAR, roster preservation, character changes, removal/rejoin, resize, all existing characters coexist and GL state");Gdx.app.exit(); }
                }
            }
            @Override public void dispose() { showMainMenu();preview.dispose();super.dispose(); }
        },config);
    }
}
