package com.erni.finalanswer.impostor;

import com.badlogic.gdx.scenes.scene2d.Actor;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import java.util.List;

/** Executed inside the existing native GL check; only tests layout/state, no replacement artwork. */
public final class DeathWindowCheck {
    private static Throwable failure;
    public static void main(String[] args){
        var config=new com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration();
        config.setWindowedMode(640,360);config.disableAudio(true);
        new com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application(new com.badlogic.gdx.ApplicationAdapter(){
            com.badlogic.gdx.scenes.scene2d.Stage stage;
            com.erni.finalanswer.ui.lobby.cages.CageLobby characters;
            BitmapFont font;
            ImpostorDeathWindow window;
            int frame;
            @Override public void create(){
                font=com.erni.finalanswer.ui.UiFonts.body(24);
                try{
                    var roster=new java.util.ArrayList<ImpostorParticipant>();
                    String[] identities={"dracula","ghost","zombie","voodoo"};
                    for(int i=0;i<4;i++)roster.add(new ImpostorParticipant(new com.erni.finalanswer.rooms.RoomSession.Player("death-"+i,"Player "+i,false,identities[i],"ONLINE",false,0),List.of("","","")));
                    verify(font,roster);
                    characters=new com.erni.finalanswer.ui.lobby.cages.CageLobby();
                    stage=new com.badlogic.gdx.scenes.scene2d.Stage(new com.badlogic.gdx.utils.viewport.FitViewport(1920,1080));
                    window=new ImpostorDeathWindow(font);window.roster(roster,player->new ImpostorCharacterActor(characters,player));stage.addActor(window);
                }catch(Throwable error){failure=error;com.badlogic.gdx.Gdx.app.exit();}
            }
            @Override public void render(){
                if(failure!=null)return;
                try{
                    com.badlogic.gdx.utils.ScreenUtils.clear(0,0,0,1);
                    window.present("death-0",frame/60f,false);stage.act(1f/60);stage.draw();
                    if(frame==20||frame==100){
                        var pixels=com.badlogic.gdx.graphics.Pixmap.createFromFrameBuffer(0,0,com.badlogic.gdx.Gdx.graphics.getBackBufferWidth(),com.badlogic.gdx.Gdx.graphics.getBackBufferHeight());
                        try{com.badlogic.gdx.graphics.PixmapIO.writePNG(com.badlogic.gdx.Gdx.files.local("../generated/previews/impostor-"+(frame==20?"death-window":"ghost-window")+".png"),pixels,-1,true);}finally{pixels.dispose();}
                    }
                    if(com.badlogic.gdx.Gdx.gl.glGetError()!=com.badlogic.gdx.graphics.GL20.GL_NO_ERROR)throw new AssertionError("Death window GL error");
                    if(++frame==130){System.out.println("PASS: isolated window renders original Dracula rig, persistent ghost, no GL errors");com.badlogic.gdx.Gdx.app.exit();}
                }catch(Throwable error){failure=error;com.badlogic.gdx.Gdx.app.exit();}
            }
            @Override public void dispose(){
                if(window!=null)window.dispose();if(stage!=null)stage.dispose();if(characters!=null)characters.dispose();if(font!=null)font.dispose();
            }
        },config);
        if(failure!=null)throw new AssertionError(failure);
    }
    private static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    public static void verify(BitmapFont font,List<ImpostorParticipant> roster){
        var window=new ImpostorDeathWindow(font);var root=new Group();root.addActor(window);
        try{
            window.roster(roster,player->{Actor actor=new Actor();actor.setSize(100,200);actor.setName("death:"+player.id());return actor;});
            String id=roster.getFirst().player().id();
            window.present(id,-1,false);check(!window.isVisible(),"Death window waits for authoritative death marker");
            window.present(id,.3f,false);check(window.isVisible(),"Death window appears during death");
            int visible=0;
            for(var participant:roster){
                Actor actor=window.findActor("death:"+participant.player().id());
                if(actor.getParent().isVisible())visible++;
            }
            check(visible==1,"Death window shows only one participant");
            Actor victim=window.findActor("death:"+id);
            window.present(id,2,false);check(Math.abs(victim.getParent().getColor().a-.48f)<.01f,"Only victim becomes ghost");
            window.present(id,3.3f,false);check(!window.isVisible(),"Death window returns to results after its hold");
            window.present("unknown",0,false);check(!window.isVisible(),"Missing victim cannot reveal unrelated players");
            window.present(id,1,true);window.reset();check(!window.isVisible(),"Interrupted window resets cleanly");
            check(victim.getParent().getColor().a==1,"Reset restores borrowed artwork");
            System.out.println("PASS: isolated death window, one victim, ghost transition, hold, missing identity and reset");
        }finally{window.dispose();}
    }
}
