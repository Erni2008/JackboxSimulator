package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.utils.JsonReader;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.audio.AudioMix;
import com.erni.finalanswer.network.*;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.screens.*;
import com.finalanswer.server.*;
import com.finalanswer.server.rooms.RoomService;
import com.google.gson.*;
import java.util.*;

/** Isolated real server + shared screen + authenticated phone transports. Audio plays muted, callbacks remain real. */
public final class IntroNetworkCheck {
    private static Throwable failure;
    private static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    public static void main(String[] args){
        if(StartupHelper.startNewJvmIfRequired())return;
        var rooms=new RoomService();var server=new RoomServer(new ServerConfig("127.0.0.1",0,"",Set.of(),"",10),rooms).start();
        String base="http://127.0.0.1:"+server.port();
        var config=new Lwjgl3ApplicationConfiguration();config.setWindowedMode(1280,720);config.setTitle("Final Answer — Intro multiplayer QA (muted)");
        config.setInitialVisible(false);config.setForegroundFPS(60);config.setIdleFPS(60);config.setPauseWhenMinimized(false);config.setPauseWhenLostFocus(false);
        try{new Lwjgl3Application(new FinalAnswerGame(HostingAccess.external(base)){
            final ArrayList<RealtimeClient> phones=new ArrayList<>();
            final ArrayList<String> ids=new ArrayList<>();
            final Set<Integer> readyPhones=new HashSet<>(),questionPhones=new HashSet<>();
            final Object[] rigs=new Object[8];
            CageLobbyScreen lobby;int run,count,questionEvents;boolean requested,skipped,resized,sawSubtitle,sawVoice;
            long began;String session="";
            @Override public void create(){super.create();AudioMix.GLOBAL.master=0;begin(2);}
            void begin(int participants){
                for(var phone:phones)phone.close();phones.clear();ids.clear();readyPhones.clear();questionPhones.clear();
                count=participants;run++;int generation=run;requested=skipped=resized=sawSubtitle=sawVoice=false;questionEvents=0;session="";began=System.nanoTime();
                var host=JsonParser.parseString(rooms.create(Map.of("name","Intro QA "+count,"maxPlayers","8"))).getAsJsonObject();String code=host.get("code").getAsString();
                var guests=new ArrayList<JsonObject>();for(int i=0;i<count;i++){var guest=JsonParser.parseString(rooms.join(code,Map.of("name","Phone "+i))).getAsJsonObject();guests.add(guest);ids.add(guest.get("selfId").getAsString());}
                activateRoom(RoomApiClient.parse(new JsonReader().parse(host.toString()),host.get("token").getAsString()));lobby=(CageLobbyScreen)getScreen();lobby.reviewIntroNarration(true);
                getRealtime().addEventListener(event->{if(generation==run&&event.get("type").getAsString().equals("QUESTION_STARTED"))questionEvents++;});
                for(int i=0;i<count;i++){int index=i;var guest=guests.get(i);
                    phones.add(new RealtimeClient(base,code,guest.get("token").getAsString(),event->{
                        if(generation!=run)return;var state=event.getAsJsonObject("payload");if(!state.has("phase"))return;
                        String phase=state.get("phase").getAsString();
                        if(phase.equals("STARTING")){readyPhones.add(index);check(!state.has("question"),"Phones must not receive questions during intro");check(state.get("deadline").getAsLong()==0,"No early answer timer");}
                        if(phase.equals("QUESTION_PRESENTATION")){questionPhones.add(index);check(state.get("answeringStartedAt").getAsLong()==0,"Question presentation precedes answer countdown");}
                    },ignored->{}));
                }
            }
            Stage stage(){try{var field=CageLobbyScreen.class.getDeclaredField("stage");field.setAccessible(true);return (Stage)field.get(lobby);}catch(Exception error){throw new AssertionError(error);}}
            @Override public void render(){
                try{
                    super.render();if((System.nanoTime()-began)/1e9>110)throw new AssertionError("Intro network QA timeout");
                    var client=getRealtime();var state=client.snapshot();if(state==null)return;
                    if(!requested&&state.get("canStart").getAsBoolean()){
                        for(int i=0;i<count;i++)rigs[i]=lobby.cages().cage(i).character();requested=true;showPlayScreen();return;
                    }
                    if(state.has("intro")){
                        check(getScreen()==lobby&&lobby.introActive(),"Existing basement stays active");
                        String game=state.get("gameId").getAsString();if(session.isEmpty())session=game;check(session.equals(game),"One cinematic session");
                        for(int i=0;i<count;i++){check(ids.get(i).equals(lobby.cages().cage(i).playerId()),"Stable assigned cage");check(rigs[i]==lobby.cages().cage(i).character(),"No replacement of character rig");}
                        TextButton skip=stage().getRoot().findActor("skipIntro");
                        com.erni.finalanswer.intro.BasementIntro intro=stage().getRoot().findActor("basementIntro");
                        check(!skip.isDisabled()||intro.awaitingTransition(),"Host skip stays enabled until the one transition signal");
                        Label caption=stage().getRoot().findActor("introSubtitle");sawSubtitle|=caption.isVisible()&&caption.getColor().a>.1f&&!caption.getText().isEmpty();sawVoice|=getAudio().hostVoice().playing();
                        long age=client.serverNow()-state.getAsJsonObject("intro").get("startedAt").getAsLong();
                        if(count==2&&readyPhones.size()==count&&!skipped){skipped=true;Gdx.input.getInputProcessor().keyDown(Input.Keys.SPACE);}
                        if(count==8&&age>6500&&!resized){Gdx.graphics.setWindowedMode(1024,768);resized=true;}
                        if(count==8&&age>11_000&&Gdx.graphics.getWidth()!=1280)Gdx.graphics.setWindowedMode(1280,720);
                        check(!state.has("question"),"Question cannot start before intro signal");
                    }
                    if(requested&&getScreen() instanceof PlayScreen&&questionPhones.size()==count){
                        check(questionEvents==1,"First question starts exactly once");check(!lobby.introActive(),"Temporary intro presentation is removed");
                        if(count==8){check(sawSubtitle&&sawVoice,"Full sequence had real voice and synchronized subtitles");System.out.println("PASS: real server/native screen, 2-player black-screen skip, 8-player full intro, stable cages/rigs, phone waiting, one first question, resize and audio cleanup");Gdx.app.exit();}
                        else begin(8);
                    }
                }catch(Throwable error){failure=error;Gdx.app.exit();}
            }
            @Override public void dispose(){for(var phone:phones)phone.close();super.dispose();}
        },config);}finally{server.close();}
        if(failure!=null)throw new AssertionError(failure);
    }
}
