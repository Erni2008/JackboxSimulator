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

/** Production room screen and roster lifecycle; no networking or lobby replacement. */
public final class PuppeteerLobbyCheck {
    static void check(boolean ok,String why){if(!ok)throw new AssertionError(why);}
    public static void main(String[] args){if(StartupHelper.startNewJvmIfRequired())return;
        var window=new Lwjgl3ApplicationConfiguration();window.setTitle("Puppeteer actual lobby check");window.setWindowedMode(1600,900);window.disableAudio(true);window.setForegroundFPS(60);
        new Lwjgl3Application(new FinalAnswerGame(){
            CageLobbyScreen preview;RoomSession room;float time,removedTime;int shot;boolean capturing;PuppeteerCharacter removed;
            final float[] captures={.5f,3,6.9f,7.8f,8.8f,9.8f,10.8f,12};
            RoomSession roster(int missing,boolean mixed){var players=new ArrayList<RoomSession.Player>();String[] ids={"skeleton","ghost","zombie","dracula","pumpkin","plague_doctor","voodoo","puppeteer"};
                for(int i=0;i<8;i++)if(i!=missing)players.add(new RoomSession.Player("p"+i,"Puppeteer "+i,false,mixed?ids[i]:"puppeteer","ONLINE",false,0));
                return new RoomSession("ABC123","THE WAITING ROOM",8,"standard","preview",false,players);}
            PuppeteerCharacter puppet(int i){return (PuppeteerCharacter)preview.cages().cage(i).character();}
            @Override public void create(){super.create();preview=new CageLobbyScreen(this);setScreen(preview);room=roster(-1,false);preview.synchronize(room,"");for(int i=0;i<8;i++)check(puppet(i).animator().state()==PuppeteerAnimator.State.INTRO,"New occupant intro");}
            @Override public void render(){if(capturing)return;time+=1f/60;preview.synchronize(room,"");preview.draw(1f/60);
                if(shot<captures.length&&time>=captures[shot]){capturing=true;
                    check(Gdx.gl.glGetError()==0,"No lobby rendering errors");
                    if(shot==2){for(int i=0;i<8;i++)check(puppet(i).animator().state()==PuppeteerAnimator.State.IDLE,"All introductions finish");
                        var old=new CageCharacter[8];for(int i=0;i<8;i++)old[i]=puppet(i);room=roster(-1,false);preview.synchronize(room,"");for(int i=0;i<8;i++)check(old[i]==puppet(i),"Fresh roster must preserve occupants");
                        removed=puppet(3);removedTime=removed.animator().motionTime();room=roster(3,false);preview.synchronize(room,"");Gdx.graphics.setWindowedMode(960,540);}
                    if(shot==3){check(preview.cages().cage(3).character()==null,"Vacancy cleared");check(removed.animator().motionTime()==removedTime,"Removed instance stops updating");check(preview.cages().cage(4).playerId().equals("p4"),"Remaining IDs retain slots");room=roster(-1,false);preview.synchronize(room,"");check(puppet(3)!=removed&&puppet(3).animator().state()==PuppeteerAnimator.State.INTRO,"Rejoin creates fresh entrance");Gdx.graphics.setWindowedMode(1024,768);}
                    if(shot==4){var other=puppet(7);room=roster(-1,true);preview.synchronize(room,"");check(other==puppet(7),"Changing other characters preserves Puppeteer");check(preview.cages().cage(0).character() instanceof SkeletonCharacter,"Skeleton retained");check(preview.cages().cage(1).character() instanceof GhostCharacter,"Ghost retained");check(preview.cages().cage(2).character() instanceof ZombieCharacter,"Zombie retained");check(preview.cages().cage(3).character() instanceof DraculaCharacter,"Dracula retained");check(preview.cages().cage(4).character() instanceof PumpkinCharacter,"Pumpkin retained");check(preview.cages().cage(5).character() instanceof PlagueDoctorCharacter,"Doctor retained");check(preview.cages().cage(6).character() instanceof VoodooCharacter,"Voodoo retained");}
                    if(shot==5){for(int j=0;j<12;j++){preview.synchronize(roster(3,false),"");preview.synchronize(roster(-1,false),"");}check(puppet(3).animator().state()==PuppeteerAnimator.State.INTRO,"Repeated leave/rejoin");}
                    var pixels=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("puppeteer.output")+"/lobby-"+shot+".png"),pixels,-1,true);}finally{pixels.dispose();}shot++;capturing=false;
                    if(shot==captures.length){System.out.println("PASS: Puppeteer actual eight-slot lobby, roster stability, leave/rejoin, three resolutions and all existing characters");Gdx.app.exit();}
                }
            }
            @Override public void dispose(){showMainMenu();preview.dispose();super.dispose();}
        },window);
    }
}
