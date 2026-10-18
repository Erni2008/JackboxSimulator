package com.erni.finalanswer.lwjgl3.hosting;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.network.HostingAccess;
import com.erni.finalanswer.rooms.*;
import com.google.gson.Gson;
import java.nio.file.*;
import java.net.*;
import java.net.http.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.*;

/** Opt-in distribution diagnostic (-Dfinalanswer.selfCheck=true), never used in normal play. */
public final class ApplicationSelfCheck extends FinalAnswerGame {
    private final HostingAccess hosting;
    private final long began=System.nanoTime();
    private long lobbyAt;
    private boolean opened,captured,verified;
    private volatile boolean httpReady;
    private volatile String failure="";
    private int port;
    private final ExecutorService check=Executors.newSingleThreadExecutor(r->{Thread t=new Thread(r,"FinalAnswer-self-check");t.setDaemon(true);return t;});
    public ApplicationSelfCheck(HostingAccess hosting){super(hosting);this.hosting=hosting;}
    @Override public void create(){super.create();getRoomApi().create(new RoomConfiguration("Connection self-check",8,"",GameMode.STANDARD),"",this::activateRoom,error->failure=error);}
    @Override public void render(){super.render();
        if(!opened&&getActiveRoom()!=null&&getRealtime()!=null&&getRealtime().connected()){
            opened=true;lobbyAt=System.nanoTime();port=URI.create(hosting.apiUrl()).getPort();showImpostorLobby();
            check.execute(()->{try(HttpClient client=HttpClient.newHttpClient()){
                for(String path:List.of("/health","/","/controller-theme.css","/art/ui/buttons/player_count/button_up.png")){
                    var result=client.send(HttpRequest.newBuilder(URI.create(hosting.apiUrl()+path)).timeout(Duration.ofSeconds(3)).GET().build(),HttpResponse.BodyHandlers.discarding());if(result.statusCode()!=200)throw new IllegalStateException("Bundled route unavailable: "+path);
                }
                httpReady=true;
            }catch(Exception e){failure=e.getMessage();}});
        }
        if(opened&&!captured&&System.nanoTime()-lobbyAt>1_000_000_000L){
            try{Path target=DesktopPaths.dataDirectory();java.nio.file.Files.createDirectories(target);Pixmap image=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(target.resolve("self-check-lobby.png").toString()),image,-1,true);}finally{image.dispose();}captured=true;}catch(Exception e){failure=e.getMessage();}
        }
        if(!failure.isEmpty()||System.nanoTime()-began>30_000_000_000L){if(failure.isEmpty())failure="Self-check timed out";Gdx.app.exit();}
        if(captured&&httpReady){verified=true;Gdx.app.exit();}
    }
    @Override public void dispose(){
        String room=getActiveRoom()==null?"":getActiveRoom().code();var addresses=hosting.addresses();check.shutdownNow();super.dispose();
        boolean released;try(var socket=new java.net.Socket()){socket.connect(new InetSocketAddress("127.0.0.1",port),300);released=false;}catch(Exception expected){released=true;}
        verified=verified&&released;
        try{Path target=DesktopPaths.dataDirectory();java.nio.file.Files.createDirectories(target);java.nio.file.Files.writeString(target.resolve("self-check.json"),new Gson().toJson(Map.of("passed",verified,"error",failure,"port",port,"portReleased",released,"roomCode",room,"addresses",addresses,"javaHome",System.getProperty("java.home"),"workingDirectory",System.getProperty("user.dir"))));}catch(Exception e){verified=false;}
    }
    public void verify(){if(!verified)throw new IllegalStateException("Standalone self-check failed; inspect the application data directory.");}
}
