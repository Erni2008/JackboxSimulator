package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.JsonReader;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.network.*;
import com.erni.finalanswer.cursedboxes.*;
import com.finalanswer.server.*;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

/** Real room server + existing desktop + browser phones. Test-only local files, never an admin HTTP route. */
public final class CursedBoxesPhoneCheck {
    private static Throwable failure;
    private static final boolean FULL_ROUND=Boolean.getBoolean("cursed.phone.fullRound");
    private static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    public static void main(String[] args)throws Exception{
        com.erni.finalanswer.lwjgl3.display.DesktopBorderless.install();
        Path directory=Path.of(System.getProperty("cursed.phone.dir"));java.nio.file.Files.createDirectories(directory);
        for(String name:List.of("ready.json","cleanup.json","processed.json"))java.nio.file.Files.deleteIfExists(directory.resolve(name));
        var rooms=new RoomService();var server=new RoomServer(new ServerConfig("127.0.0.1",0,"",Set.of(),"",10),rooms).start();
        String url="http://127.0.0.1:"+server.port();var host=JsonParser.parseString(rooms.create(Map.of("name","CURSED BOXES / PHONE CHECK","maxPlayers","8"))).getAsJsonObject();
        String code=host.get("code").getAsString(),token=host.get("token").getAsString();
        var config=new Lwjgl3ApplicationConfiguration();config.setTitle(FULL_ROUND?"FINAL ANSWER — FULL ROUND / 2 HIDERS + 2 SHOOTERS":"FINAL ANSWER — CURSED BOXES / PHONE CHECK");config.setWindowedMode(1280,800);config.useVsync(true);config.setForegroundFPS(60);
        config.setPreferencesConfig(directory.resolve("preferences").toString(),com.badlogic.gdx.Files.FileType.Absolute);
        try{new Lwjgl3Application(new FinalAnswerGame(HostingAccess.external(url)){
            String processed="";double elapsed;float poll,startWait;boolean rendering,finished;int impacts,reactions,checkedFrames,flashFrames,reloadFrames;
            CursedBoxesPerformanceCheck.AuditGL audit;
            final ExecutorService snapshots=Executors.newSingleThreadExecutor();
            Future<?> snapshot;
            @Override public void create(){try{
                super.create();activateRoom(RoomApiClient.parse(new JsonReader().parse(host.toString()),token));
                var control=directory.resolve("control.json");if(java.nio.file.Files.exists(control))processed=JsonParser.parseString(java.nio.file.Files.readString(control)).getAsJsonObject().get("id").getAsString();
                java.nio.file.Files.writeString(directory.resolve("ready.json"),ProtocolJson(Map.of("url",url,"code",code)));
            }catch(Throwable e){failure=e;Gdx.app.exit();}}
            JsonObject inspect(){
                JsonObject report=new JsonObject();
                report.addProperty("applicationAudioLoaded",getAudio().loaded());report.addProperty("ambiencePlaying",getAudio().ambiencePlaying());
                try{var field=com.erni.finalanswer.audio.GameAudio.class.getDeclaredField("ambience");field.setAccessible(true);var music=(com.badlogic.gdx.audio.Music)field.get(getAudio());if(music!=null)report.addProperty("ambiencePosition",music.getPosition());}catch(ReflectiveOperationException e){throw new AssertionError(e);}var appCues=new JsonObject();for(var cue:com.erni.finalanswer.audio.GameAudio.Cue.values())appCues.addProperty(cue.name(),getAudio().playCount(cue));report.add("applicationAudioCues",appCues);
                var root=getRealtime()==null?null:getRealtime().snapshot();if(root!=null)report.add("state",root);
                report.addProperty("screen",getScreen().getClass().getSimpleName());report.addProperty("impactMask",impacts);report.addProperty("reactionMask",reactions);report.addProperty("renderChecks",checkedFrames);report.addProperty("flashFrames",flashFrames);report.addProperty("reloadFrames",reloadFrames);
                if(getScreen() instanceof CursedBoxesScreen scene){
                    var cues=new JsonObject();for(var cue:CursedBoxesSoundManager.Cue.values())cues.addProperty(cue.name(),scene.sounds().playCount(cue));report.add("soundCues",cues);report.addProperty("loadedRounds",scene.loadedRounds());report.addProperty("loadingRounds",scene.loadingRounds());report.addProperty("mechanism",scene.mechanismState().name());report.addProperty("flash",scene.muzzleFlashIntensity());
                    report.addProperty("soundShots",scene.sounds().playCount(CursedBoxesSoundManager.Cue.SHOT));report.addProperty("soundWood",scene.sounds().playCount(CursedBoxesSoundManager.Cue.WOOD_BREAK));report.addProperty("soundReload",scene.sounds().playCount(CursedBoxesSoundManager.Cue.MECHANISM));report.addProperty("soundInsertion",scene.sounds().playCount(CursedBoxesSoundManager.Cue.INSERT_ROUND));report.addProperty("soundHeartbeat",scene.sounds().heartbeatActive());report.addProperty("survivorState",scene.survivorTimeline().state().name());report.addProperty("survivorMask",scene.survivorTimeline().mask());report.addProperty("nativeReady",true);report.addProperty("selected",scene.selected());report.addProperty("gun",scene.weaponState().name());report.addProperty("models",scene.loadedModels());report.addProperty("turnLimit",scene.turn.shotLimit());report.addProperty("developerTest",scene.characterTest()!=null);
                    var slots=new JsonArray();for(CrateSlot box:scene.slots){var value=new JsonObject();value.addProperty("id",box.id);value.addProperty("state",box.state.name());value.addProperty("survivorOpening",box.survivorOpening);value.addProperty("panelOpacity",box.survivorPanelOpacity);value.addProperty("pose",scene.characterState(box.id).name());if(box.character!=null){value.addProperty("characterId",box.character.name().toLowerCase(Locale.ROOT));value.addProperty("nickname",box.occupantNickname);}slots.add(value);}report.add("slots",slots);
                }else report.addProperty("nativeReady",false);
                return report;
            }
            void capture(String name){
                Pixmap pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                snapshot=snapshots.submit(()->{try{PixmapIO.writePNG(Gdx.files.absolute(directory.resolve(name+".png").toString()),pixels,1,true);}finally{pixels.dispose();}});
            }
            void controls()throws Exception{
                Path file=directory.resolve("control.json");if(!java.nio.file.Files.exists(file))return;
                var data=JsonParser.parseString(java.nio.file.Files.readString(file)).getAsJsonObject();String id=data.get("id").getAsString();if(id.equals(processed))return;String previous=processed;processed=id;
                switch(data.get("command").getAsString()){
                    case "START"->{
                        // Click the real room-lobby button, preserving all existing row controls.
                        check(Gdx.input.getInputProcessor() instanceof com.badlogic.gdx.scenes.scene2d.Stage,"Lobby input is not active");
                        var stage=(com.badlogic.gdx.scenes.scene2d.Stage)Gdx.input.getInputProcessor();
                        com.badlogic.gdx.scenes.scene2d.ui.TextButton button=stage.getRoot().findActor("cageLobbyCURSEDBOXES");
                        if(button==null||button.isDisabled()){
                            startWait+=.1f;processed=previous;
                            check(startWait<8,"Cursed button unavailable: screen="+getScreen().getClass().getSimpleName()+" missing="+(button==null)+" host="+getActiveRoom().host()+" players="+getActiveRoom().players()+" status="+getLobbyStatus());return;
                        }
                        var point=button.localToStageCoordinates(new com.badlogic.gdx.math.Vector2(button.getWidth()/2,button.getHeight()/2));stage.stageToScreenCoordinates(point);
                        check(stage.touchDown(Math.round(point.x),Math.round(point.y),0,Input.Buttons.LEFT),"Lobby tap was outside the viewport: "+point);
                        stage.touchUp(Math.round(point.x),Math.round(point.y),0,Input.Buttons.LEFT);
                    }
                    case "AMBIENCE_SEEK_END"->{
                        // Test-only seek near the real MP3 boundary; the next frames exercise backend looping.
                        var field=com.erni.finalanswer.audio.GameAudio.class.getDeclaredField("ambience");field.setAccessible(true);
                        var music=(com.badlogic.gdx.audio.Music)field.get(getAudio());check(music!=null&&music.isPlaying(),"Room ambience active");music.setPosition(47.1f);
                    }
                    case "UI_AUDIO_CHECK"->{
                        var stage=(com.badlogic.gdx.scenes.scene2d.Stage)Gdx.input.getInputProcessor();
                        com.badlogic.gdx.scenes.scene2d.ui.Button button=stage.getRoot().findActor("chooseNetwork");
                        var point=button.localToStageCoordinates(new com.badlogic.gdx.math.Vector2(button.getWidth()/2,button.getHeight()/2));stage.stageToScreenCoordinates(point);
                        long hover=getAudio().playCount(com.erni.finalanswer.audio.GameAudio.Cue.HOVER),press=getAudio().playCount(com.erni.finalanswer.audio.GameAudio.Cue.PRESS);
                        stage.mouseMoved(Math.round(point.x),Math.round(point.y));stage.act(.1f);stage.mouseMoved(Math.round(point.x),Math.round(point.y));stage.act(.016f);
                        check(getAudio().playCount(com.erni.finalanswer.audio.GameAudio.Cue.HOVER)==hover+1,"Hover fires once on enter");
                        stage.touchDown(Math.round(point.x),Math.round(point.y),0,Input.Buttons.LEFT);stage.touchUp(Math.round(point.x),Math.round(point.y),0,Input.Buttons.LEFT);
                        check(getAudio().playCount(com.erni.finalanswer.audio.GameAudio.Cue.PRESS)==press+1,"Accepted real Scene2D click sounds once");
                    }
                    case "START_QUESTIONS"->getRealtime().send("START_GAME",Map.of());
                    case "RECONNECT_HOST"->activateRoom(RoomApiClient.parse(new JsonReader().parse(host.toString()),token));
                    case "END"->{var root=getRealtime().snapshot();getRealtime().send("CURSED_RETURN_TO_LOBBY",Map.of("roomCode",code,"sessionId",root.getAsJsonObject("cursedBoxes").get("sessionId").getAsString()));}
                    case "CAPTURE"->capture("native-final");
                    case "CAPTURE_LOBBY"->capture("native-lobby");
                    case "INSPECT"->{}
                    case "EXIT"->{finished=true;Gdx.app.exit();}
                    default->throw new AssertionError("Unknown local fixture command");
                }
                var report=inspect();report.addProperty("id",id);java.nio.file.Files.writeString(directory.resolve("processed.json"),report.toString());
            }
            @Override public void render(){if(rendering||failure!=null)return;rendering=true;try{
                boolean sceneBefore=getScreen() instanceof CursedBoxesScreen;
                if(sceneBefore)((CursedBoxesScreen)getScreen()).sounds().levels.master=FULL_ROUND?.65f:.12f;
                if(sceneBefore&&audit==null){audit=new CursedBoxesPerformanceCheck.AuditGL();Gdx.graphics.setGL20(audit);Gdx.gl=Gdx.gl20=audit;}
                if(audit!=null)audit.clear();super.render();elapsed+=Gdx.graphics.getDeltaTime();poll+=Gdx.graphics.getDeltaTime();
                if(!FULL_ROUND&&elapsed>600)throw new AssertionError("Phone fixture timed out");
                if(sceneBefore&&getScreen() instanceof CursedBoxesScreen scene){
                    if(scene.muzzleFlashIntensity()>0)flashFrames++;if(scene.mechanismState()==com.erni.finalanswer.shotgun.ShotgunAnimator.State.RELOAD)reloadFrames++;
                    check(scene.characterTest()==null&&scene.turn.shotLimit()==(FULL_ROUND?1:2),"Developer nine-shot mode entered multiplayer");
                    check(scene.loadedModels()==11,"Shared models lost");check(scene.sounds().loaded()==CursedBoxesSoundManager.cueCount(),"Missing preloaded WAVs");check(audit.compiles==0&&audit.uploads==0&&audit.staticBuffers==0,"Runtime GL loading during multiplayer render");checkedFrames++;
                    var root=getRealtime().snapshot();var mini=root.getAsJsonObject("cursedBoxes");if(mini!=null){
                        int mask=mini.get("destroyedCrateIds").getAsInt();
                        for(int i=0;i<16;i++){
                            check(scene.slots[i].id==i,"Phone index mismatch");
                            if(i%4>0)check(scene.slots[i].position.x>scene.slots[i-1].position.x,"Shelf column order mismatch");
                            if(i>=4)check(scene.slots[i].position.y<scene.slots[i-4].position.y,"Shelf row order mismatch");
                            if((mask&(1<<i))!=0){check(scene.slots[i].state==CrateSlot.State.DESTROYED,"Phone destruction precedes native geometry");if(scene.slots[i].character!=null)check(scene.characterState(i)!=CursedCharacterController.State.HIDDEN,"Revealed character disappeared");}
                        }
                        if(mini.has("pendingShot")){int box=mini.getAsJsonObject("pendingShot").get("boxId").getAsInt();if(scene.activeDebris()>0&&scene.slots[box].state==CrateSlot.State.DESTROYED)impacts|=1<<box;if(scene.characterState(box)==CursedCharacterController.State.REACTING)reactions|=1<<box;}
                    }
                }
                if(poll>=.1f){poll=0;controls();}
                if(Gdx.gl.glGetError()!=GL20.GL_NO_ERROR)throw new AssertionError("OpenGL error");
            }catch(Throwable e){failure=e;Gdx.app.exit();}finally{rendering=false;}}
            @Override public void dispose(){try{super.dispose();snapshots.shutdown();if(snapshot!=null)snapshot.get(15,TimeUnit.SECONDS);if(!FULL_ROUND&&!finished&&failure==null)failure=new AssertionError("Fixture closed before browser check finished");}catch(Throwable e){failure=e;}}
        },config);}finally{server.close();}
        if(failure!=null)throw new AssertionError("Cursed phone/native integration",failure);
        java.nio.file.Files.writeString(directory.resolve("cleanup.json"),ProtocolJson(Map.of("passed",true,"portReleased",true)));
    }
    private static String ProtocolJson(Object value){return com.finalanswer.protocol.Protocol.JSON.toJson(value);}
}
