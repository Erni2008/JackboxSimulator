package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.PixmapIO;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.impostor.*;
import com.erni.finalanswer.network.RealtimeClient;
import com.google.gson.*;
import java.nio.file.Path;
import java.util.HashSet;

/** Real native host + the same local Javalin/browser fixture; test classpath only. */
public final class ImpostorNetworkCheck extends FinalAnswerGame {
    private static Throwable failure;
    private final boolean finalQA=Boolean.getBoolean("impostor.network.final");
    private ImpostorScreen screen;
    private RealtimeClient connection;
    private final HashSet<Integer> completed=new HashSet<>();
    private long started,nextConnect;
    private String code="";
    private boolean waiting;
    public static void main(String[] args){
        var config=new Lwjgl3ApplicationConfiguration();config.setWindowedMode(1280,720);config.disableAudio(true);
        config.setPreferencesConfig(System.getProperty("impostor.network.artifacts")+"/prefs",Files.FileType.Absolute);
        new Lwjgl3Application(new ImpostorNetworkCheck(),config);
        if(failure!=null)throw new AssertionError("Native Impostor network check failed",failure);
    }
    @Override public void create(){super.create();try{
        var config=JsonParser.parseString(java.nio.file.Files.readString(Path.of(System.getProperty("impostor.connection")))).getAsJsonObject();
        screen=new ImpostorScreen(this);setScreen(screen);
        connect(config);started=System.nanoTime();
    }catch(Throwable error){fail(error);}}
    private void connect(JsonObject config){
        if(connection!=null)connection.close();code=config.get("code").getAsString();waiting=false;
        connection=new RealtimeClient(config.get("url").getAsString(),code,config.get("token").getAsString(),
            e->{if(e.get("type").getAsString().equals("ROOM_CLOSED"))waiting=true;},status->{});
        screen.connectSuspicion(connection);
    }
    @Override public void render(){try{
        super.render();
        if(System.nanoTime()-started>180_000_000_000L)throw new AssertionError("Timed out waiting for 3/4 player browser matches");
        if(waiting && System.nanoTime()>=nextConnect){
            nextConnect=System.nanoTime()+250_000_000L;
            var config=JsonParser.parseString(java.nio.file.Files.readString(Path.of(System.getProperty("impostor.connection")))).getAsJsonObject();
            if(!code.equals(config.get("code").getAsString()))connect(config);
        }
        var state=connection.snapshot();if(state==null || !state.has("impostor"))return;
        var mini=state.getAsJsonObject("impostor");
        if(mini.has("role")||mini.has("secretWord")||mini.has("impostorId"))throw new AssertionError("Hidden information leaked to host");
        if(!mini.get("phase").getAsString().equals(finalQA?"RESULT":"EVIDENCE_REVIEW")||screen.paperState()!=PaperFlipState.FACE_UP)return;
        if(finalQA){
            if(connection.serverNow()-mini.get("finalPhaseStartedAt").getAsLong()<600)return;
            var field=ImpostorScreen.class.getDeclaredField("stage");field.setAccessible(true);
            var stage=(com.badlogic.gdx.scenes.scene2d.Stage)field.get(screen);
            FinalVotePresentation view=stage.getRoot().findActor("finalAct");
            ImpostorLifecyclePanel results=stage.getRoot().findActor("impostorLifecycle");
            var title=(com.badlogic.gdx.scenes.scene2d.ui.Label)results.findActor("impostorResultTitle");
            String outcome=mini.get("outcome").getAsString();
            String expected=outcome.equals("IMPOSTOR_ESCAPED")?"THE IMPOSTOR ESCAPED":outcome.replace('_',' ');
            if(!results.isVisible() || title==null || !title.getText().toString().equals(expected))
                throw new AssertionError("Result title must match the server outcome and finish its entry fade");
            int votes=mini.getAsJsonObject("finalVoteSnapshot").getAsJsonArray("stampTargets").size();
            if(view.visibleStampCount()!=votes || view.stampCount()!=votes)throw new AssertionError("Every final vote must have exactly one retained stamp");
        }
        int count=screen.participants().size();if(!completed.add(count))return;
        if(screen.revealedRoundCount()!=3)throw new AssertionError("Host missed reveal history");
        var image=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
        try{var file=Gdx.files.absolute(System.getProperty("impostor.network.artifacts")+"/"+count+"players-real-network"+(finalQA?"-final":"")+".png");file.parent().mkdirs();PixmapIO.writePNG(file,image,-1,true);}finally{image.dispose();}
        Gdx.app.log("THE IMPOSTOR","PASS: real network host "+count+" players, private roles absent, three revealed rounds"+(finalQA?", final result and exact stamp count":""));
        if(completed.size()==2)Gdx.app.exit();
    }catch(Throwable error){fail(error);}}
    private void fail(Throwable error){failure=error;Gdx.app.error("THE IMPOSTOR","Network check failed",error);Gdx.app.exit();}
    @Override public void dispose(){if(connection!=null)connection.close();if(screen!=null){showMainMenu();screen.dispose();}super.dispose();}
}
