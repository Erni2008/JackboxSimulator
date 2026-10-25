package com.erni.finalanswer.lwjgl3;
import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.utils.JsonReader;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.network.*;
import com.erni.finalanswer.lastcommand.*;
import com.finalanswer.server.*;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import java.nio.file.*;
import java.nio.file.Files;
import java.util.*;
/** Real native desktop + real HTTP/WebSocket + phone browsers. File control stays dev-only. */
public final class LastCommandPhoneCheck {
    static volatile boolean done;static Throwable failure;
    public static void main(String[]args)throws Exception{
        Path dir=Path.of(System.getProperty("lc.phone.dir"));Files.createDirectories(dir);for(String f:List.of("ready.json","processed.json","cleanup.json","control.json"))Files.deleteIfExists(dir.resolve(f));
        var rooms=new RoomService();try(var server=new RoomServer(new ServerConfig("127.0.0.1",0,"",Set.of(),"",10),rooms).start()){
            String url="http://127.0.0.1:"+server.port();var host=JsonParser.parseString(rooms.create(Map.of("name","LAST COMMAND / native QA","maxPlayers","8"))).getAsJsonObject();String token=host.get("token").getAsString();
            var config=new Lwjgl3ApplicationConfiguration();config.setWindowedMode(1100,750);config.disableAudio(true);config.setForegroundFPS(60);config.useVsync(true);config.setPreferencesConfig(dir.resolve("preferences").toString(),com.badlogic.gdx.Files.FileType.Absolute);
            new Lwjgl3Application(new FinalAnswerGame(HostingAccess.external(url)){
                long rendered;
                @Override public void create(){try{super.create();activateRoom(RoomApiClient.parse(new JsonReader().parse(host.toString()),token));Files.writeString(dir.resolve("ready.json"),new Gson().toJson(Map.of("url",url,"code",host.get("code").getAsString())));
                    Thread watcher=new Thread(()->{String previous="";long deadline=System.nanoTime()+600_000_000_000L;while(!done&&System.nanoTime()<deadline){try{Path file=dir.resolve("control.json");if(Files.exists(file)){var data=JsonParser.parseString(Files.readString(file)).getAsJsonObject();String id=data.get("id").getAsString();if(!id.equals(previous)){previous=id;Gdx.app.postRunnable(()->control(data));}}Thread.sleep(30);}catch(Exception e){failure=e;Gdx.app.postRunnable(()->Gdx.app.exit());return;}}},"lc-qa-controls");watcher.setDaemon(true);watcher.start();
                }catch(Throwable e){failure=e;Gdx.app.exit();}}
                void control(JsonObject data){try{
                    String type=data.get("command").getAsString();switch(type){
                        case "START"->startLastCommand();case "INSPECT"->{}
                        case "LOCAL"->{showTheLastCommand();var scene=(TheLastCommandScreen)getScreen();scene.mechanisms().code().setCode("6248");scene.mechanisms().setLeverState(AdditionalMechanisms.LeverState.MIDDLE);scene.mechanisms().hatch().setOpen(true);scene.panel().setLightColor(LightModule.State.BLUE);scene.panel().setButtonColor(PanelElementId.SMALL_BUTTON_2,com.badlogic.gdx.graphics.Color.BLUE);scene.panel().setLocked(PanelElementId.SMALL_BUTTON_1,true);}
                        case "QUALITY"->((TheLastCommandScreen)getScreen()).changeQuality(GraphicsProfile.current()==GraphicsProfile.HIGH?GraphicsProfile.MEDIUM:GraphicsProfile.HIGH);
                        case "RESET"->getRealtime().send("LAST_COMMAND_ACTION",Map.of("roomCode",getActiveRoom().code(),"sessionId",getRealtime().snapshot().getAsJsonObject("lastCommand").get("sessionId").getAsString(),"element","CODE_PANEL","action","RESET","value",""));
                        case "END"->getRealtime().send("END_LAST_COMMAND",Map.of("roomCode",getActiveRoom().code(),"sessionId",getRealtime().snapshot().getAsJsonObject("lastCommand").get("sessionId").getAsString()));
                        case "EXIT"->{done=true;Gdx.app.exit();}default->throw new AssertionError(type);
                    }
                    Map<String,Object> report=new LinkedHashMap<>();report.put("id",data.get("id").getAsString());report.put("screen",getScreen().getClass().getSimpleName());report.put("renderedFrames",rendered);report.put("continuous",Gdx.graphics.isContinuousRendering());
                    if(getScreen() instanceof TheLastCommandScreen scene){var modules=scene.mechanisms();report.put("nativeCode",modules.code().code());report.put("nativeLever",modules.leverState().name());report.put("nativeHatch",modules.hatch().open());report.put("nativeLight",scene.panel().light().color().name());report.put("nativeSmallHeld",scene.panel().button(PanelElementId.SMALL_BUTTON_1).held());report.put("loadedModels",10);report.put("quality",GraphicsProfile.current().name());report.put("nativeGreenColor",scene.panel().button(PanelElementId.SMALL_BUTTON_2).color().toString());report.put("nativeRedLocked",scene.panel().button(PanelElementId.SMALL_BUTTON_1).locked());report.put("actionHistory",scene.panel().history().size());}
                    report.put("state",getRealtime().snapshot());Files.writeString(dir.resolve("processed.json"),new Gson().toJson(report));
                }catch(Throwable e){failure=e;Gdx.app.exit();}}
                @Override public void render(){try{super.render();rendered++;}catch(Throwable e){failure=e;Gdx.app.exit();}}
                @Override public void dispose(){super.dispose();done=true;}
            },config);
        }
        if(failure!=null)throw new AssertionError("Native/phone integration",failure);Files.writeString(dir.resolve("cleanup.json"),"{\"passed\":true}");
    }
}
