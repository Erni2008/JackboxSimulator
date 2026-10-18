package com.erni.finalanswer.lwjgl3.hosting;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.*;
import com.google.gson.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

/** Test classpath only. Real desktop host + real owned server; commands use the normal authenticated socket. */
public final class DesktopHostingQA extends FinalAnswerGame {
    private static Throwable failure;
    private final LocalServerManager hosting;
    private final Path directory=Path.of(System.getProperty("desktop.qa.dir"));
    private final ScheduledExecutorService files=Executors.newSingleThreadScheduledExecutor(r->{Thread t=new Thread(r,"desktop-qa-files");t.setDaemon(true);return t;});
    private boolean opened;
    private String previous="",request="",commandId="",capture="";
    private int port;
    public DesktopHostingQA(LocalServerManager hosting){super(hosting);this.hosting=hosting;}
    public static void main(String[] args)throws Exception{
        Path directory=Path.of(System.getProperty("desktop.qa.dir"));java.nio.file.Files.createDirectories(directory);java.nio.file.Files.deleteIfExists(directory.resolve("cleanup.json"));
        var hosting=new LocalServerManager(Integer.getInteger("desktop.qa.port",0),"");
        var configuration=new Lwjgl3ApplicationConfiguration();configuration.setTitle("Final Answer — standalone multiplayer QA");configuration.setWindowedMode(1280,720);configuration.disableAudio(true);configuration.setPreferencesConfig(directory.resolve("prefs").toString()+java.io.File.separator,com.badlogic.gdx.Files.FileType.Absolute);
        var game=new DesktopHostingQA(hosting);new Lwjgl3Application(game,configuration);
        boolean released;try(var socket=new java.net.Socket()){socket.connect(new java.net.InetSocketAddress("127.0.0.1",game.port),300);released=false;}catch(java.io.IOException expected){released=true;}
        java.nio.file.Files.writeString(directory.resolve("cleanup.json"),new Gson().toJson(Map.of("portReleased",released,"port",game.port)));
        if(failure!=null)throw new AssertionError("Desktop hosting QA failed",failure);if(!released)throw new AssertionError("Owned server still listening after game disposal");
    }
    @Override public void create(){super.create();
        getRoomApi().create(new RoomConfiguration("Standalone multiplayer QA",8,"",GameMode.STANDARD),"",this::activateRoom,error->fail(new IllegalStateException(error)));
    }
    @Override public void render(){try{super.render();
        if(!opened&&getActiveRoom()!=null&&getRealtime()!=null&&getRealtime().connected()){
            opened=true;showImpostorLobby();port=java.net.URI.create(hosting.apiUrl()).getPort();
            getRealtime().addEventListener(event->{if(!request.isEmpty()&&request.equals(event.get("requestId").getAsString())){request="";write("processed.json",Map.of("id",commandId,"type",event.get("type").getAsString(),"code",event.getAsJsonObject("payload").has("code")?event.getAsJsonObject("payload").get("code").getAsString():""));}});
            write("ready.json",Map.of("url",hosting.apiUrl(),"code",getActiveRoom().code(),"addresses",hosting.addresses()));
            try{Path old=directory.resolve("control.json");if(java.nio.file.Files.exists(old))previous=JsonParser.parseString(java.nio.file.Files.readString(old)).getAsJsonObject().get("id").getAsString();}catch(Exception ignored){}
            files.scheduleWithFixedDelay(this::readCommand,0,50,TimeUnit.MILLISECONDS);
        }
        if(!capture.isEmpty()){
            Pixmap image=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
            try{com.badlogic.gdx.graphics.PixmapIO.writePNG(Gdx.files.absolute(directory.resolve(capture+".png").toString()),image,-1,true);}finally{image.dispose();}
            capture="";write("processed.json",Map.of("id",commandId,"type","CAPTURED"));
        }
    }catch(Throwable error){fail(error);}}
    private void readCommand(){try{
        Path file=directory.resolve("control.json");if(!java.nio.file.Files.exists(file))return;JsonObject data=JsonParser.parseString(java.nio.file.Files.readString(file)).getAsJsonObject();String id=data.get("id").getAsString();if(id.equals(previous))return;previous=id;
        Gdx.app.postRunnable(()->{commandId=id;String type=data.get("type").getAsString();
            if(type.equals("EXIT")){write("processed.json",Map.of("id",id,"type","EXIT"));Gdx.app.exit();}
            else if(type.equals("CAPTURE")){String name=data.get("name").getAsString();if(!name.matches("[a-zA-Z0-9_-]{1,80}")){fail(new IllegalArgumentException("Invalid capture name"));return;}capture=name;}
            else {Map<String,JsonElement> payload=new LinkedHashMap<>();data.getAsJsonObject("payload").entrySet().forEach(entry->payload.put(entry.getKey(),entry.getValue()));request=getRealtime().send(type,payload);}
        });
    }catch(Throwable error){Gdx.app.postRunnable(()->fail(error));}}
    private void write(String name,Object value){try{java.nio.file.Files.writeString(directory.resolve(name),new Gson().toJson(value));}catch(java.io.IOException e){fail(e);}}
    private void fail(Throwable error){failure=error;Gdx.app.error("Desktop QA","Failed",error);Gdx.app.exit();}
    @Override public void dispose(){files.shutdownNow();super.dispose();}
}
