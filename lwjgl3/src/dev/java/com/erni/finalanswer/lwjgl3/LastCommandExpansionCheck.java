package com.erni.finalanswer.lwjgl3;
import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.JsonReader;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.network.*;
import com.erni.finalanswer.lastcommand.TheLastCommandScreen;
import com.finalanswer.server.*;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import java.util.*;
/** Native GL/FBO smoke check over the real authenticated room connection. */
public final class LastCommandExpansionCheck {
    static Throwable failure;
    public static void main(String[] args)throws Exception{
        var rooms=new RoomService();try(var server=new RoomServer(new ServerConfig("127.0.0.1",0,"",Set.of(),"",10),rooms).start()){
            var credential=JsonParser.parseString(rooms.lastCommandDevelopment("","Native expansion QA",136,"campaign")).getAsJsonObject();String token=credential.get("token").getAsString();var config=new Lwjgl3ApplicationConfiguration();config.setWindowedMode(1280,900);config.disableAudio(true);config.setForegroundFPS(60);config.useVsync(true);
            new Lwjgl3Application(new FinalAnswerGame(HostingAccess.external("http://127.0.0.1:"+server.port())){
                int frames,active;boolean started;
                @Override public void create(){try{super.create();activateRoom(RoomApiClient.parse(new JsonReader().parse(credential.toString()),token));}catch(Throwable error){failure=error;Gdx.app.exit();}}
                @Override public void render(){try{super.render();frames++;if(frames>1800)throw new AssertionError("Native expansion timed out");var state=getRealtime()==null?null:getRealtime().snapshot();if(state==null||!state.has("lastCommand"))return;var panel=state.getAsJsonObject("lastCommand");var r=panel.getAsJsonObject("testRound");if(r==null)return;if(!started&&r.get("status").getAsString().equals("READY")){getRealtime().send("LAST_COMMAND_ACTION",Map.of("roomCode",state.get("code").getAsString(),"sessionId",panel.get("sessionId").getAsString(),"element","CODE_PANEL","action","START_GAME","value",""));started=true;}if(getScreen() instanceof TheLastCommandScreen&&r.get("status").getAsString().equals("PLAYING")&&!r.get("paused").getAsBoolean()){if(!r.get("taskType").getAsString().equals("MATH"))throw new AssertionError("Expected generated math terminal");++active;if(active==45){var field=TheLastCommandScreen.class.getDeclaredField("camera");field.setAccessible(true);var camera=(com.badlogic.gdx.graphics.PerspectiveCamera)field.get(getScreen());var point=new com.badlogic.gdx.math.Vector3(-.142f+113f/768*.278f,.5775f-209f/448*.165f,.117f);camera.project(point);int x=Math.round(point.x),y=Gdx.graphics.getHeight()-Math.round(point.y);Gdx.input.getInputProcessor().touchDown(x,y,0,Input.Buttons.LEFT);Gdx.input.getInputProcessor().touchUp(x,y,0,Input.Buttons.LEFT);}if(active==90){if(!r.getAsJsonObject("touchscreen").get("input").getAsString().equals("1"))throw new AssertionError("Native CRT touch did not reach authoritative input");var image=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("lc.expansion.image")),image,-1,true);}finally{image.dispose();}if(Gdx.gl.glGetError()!=0)throw new AssertionError("OpenGL error");System.out.println("NATIVE_EXPANSION_OK: live room, generated CRT task, real projected touch, authoritative keypad input, FBO rendering, no GL error");Gdx.app.exit();}}}catch(Throwable error){failure=error;Gdx.app.exit();}}
            },config);
        }
        if(failure!=null)throw new AssertionError("Native expansion",failure);
    }
}
