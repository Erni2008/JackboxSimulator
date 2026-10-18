package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.*;
import com.erni.finalanswer.screens.PlayScreen;

/** Real desktop host against the real server. Join two browsers; no simulated player objects. */
public final class MultiplayerCheck extends FinalAnswerGame {
    private boolean requested,started;
    private String phase="",question="";
    private long began=System.nanoTime();
    private int results;
    @Override public void create(){super.create();}
    @Override public void render(){
        super.render();
        if(System.nanoTime()-began>360_000_000_000L)throw new AssertionError("Multiplayer QA timed out waiting for browsers");
        if(!requested){requested=true;getRoomApi().create(new RoomConfiguration("Browser integration",4,"",GameMode.STANDARD),"",room->{activateRoom(room);System.out.println("MULTIPLAYER_ROOM="+room.code());},error->{throw new AssertionError(error);});}
        var connection=getRealtime();if(connection==null||connection.snapshot()==null)return;
        var s=connection.snapshot();
        if(!started&&s.getAsJsonArray("players").size()>=2&&s.getAsJsonArray("players").asList().stream().allMatch(p->p.getAsJsonObject().get("connectionStatus").getAsString().equals("ONLINE"))){started=true;showPlayScreen();}
        String next=s.get("phase").getAsString(),q=s.has("question")?s.getAsJsonObject("question").get("id").getAsString():"";
        if(!next.equals(phase)||!q.equals(question)){
            phase=next;question=q;System.out.println("HOST_PHASE="+phase+" QUESTION="+q);
            if(s.has("question")&&!(getScreen() instanceof PlayScreen))throw new AssertionError("Host did not enter PlayScreen");
            if(next.equals("ANSWERING"))capture("multiplayer-question-"+s.get("questionNumber").getAsInt());
            if(next.equals("RESULTS")){
                if(s.getAsJsonArray("results").size()!=2)throw new AssertionError("Expected both browser results");
                results++;capture("multiplayer-results-"+results);
                System.out.println("HOST_RESULTS="+s.getAsJsonArray("results"));
            }
            if(results>=2&&s.get("questionNumber").getAsInt()>=3){System.out.println("PASS: real server + desktop host + two browser sessions + results + next questions");leaveRoom();Gdx.app.exit();}
        }
    }
    private void capture(String name){Pixmap p=com.badlogic.gdx.utils.ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());PixmapIO.writePNG(Gdx.files.absolute("/tmp/"+name+".png"),p,-1,true);p.dispose();}
    @Override public void dispose(){leaveRoom();super.dispose();}
    public static void main(String[] args){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1280,720);c.disableAudio(true);c.setPreferencesConfig(System.getProperty("multiplayer.qa.dir"),Files.FileType.Absolute);new Lwjgl3Application(new MultiplayerCheck(),c);}
}
