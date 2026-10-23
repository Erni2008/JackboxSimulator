package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.impostor.*;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;

/** Real GL coverage of all eight borrowed rigs in the production Impostor portrait assembly. */
public final class ImpostorCharactersCheck extends ApplicationAdapter {
    private static Throwable failure;
    private Stage stage;
    private CageLobby characters;
    private ImpostorAssets assets;
    private com.badlogic.gdx.graphics.g2d.BitmapFont font;
    private int frames;
    @Override public void create() {
        try {
            characters=new CageLobby();assets=new ImpostorAssets();assets.load();
            font=com.erni.finalanswer.ui.UiFonts.body(24);
            stage=new Stage(new FitViewport(1600,900));
            String[] ids={"ghost","dracula","plague_doctor","puppeteer","skeleton","zombie","pumpkin","voodoo"};
            for(int i=0;i<ids.length;i++){
                var player=new RoomSession.Player("check-"+i,ids[i],false,ids[i],"ONLINE",false,0);
                var actor=new ImpostorCharacterActor(characters,player);
                var participant=new ImpostorParticipant(player,java.util.List.of("","",""));
                var view=new ImpostorParticipantView(participant,actor,assets,font);
                view.setPosition(40+(i%4)*390,100+(1-i/4)*400);stage.addActor(view);
                if(actor.getParent()==null)throw new AssertionError("Missing portrait: "+ids[i]);
            }
        }catch(Throwable error){failure=error;Gdx.app.exit();}
    }
    @Override public void render(){
        if(failure!=null)return;
        try{
            Gdx.gl.glClearColor(.035f,.025f,.03f,1);Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);
            for(int i=0;i<stage.getActors().size;i++){
                var view=(ImpostorParticipantView)stage.getActors().get(i);view.updatePortrait(1f/60,false,i==1&&frames>=60?(frames-60)/60f:-1);
                if(frames>=155){Actor portrait=view.findActor("avatar");if(i==1&&Math.abs(portrait.getColor().a-.48f)>.01f)throw new AssertionError("Caught real rig does not retain ghost opacity");if(i!=1&&portrait.getColor().a!=1)throw new AssertionError("Unrelated rig was eliminated");}
            }
            stage.act(1f/60);stage.draw();
            if(Gdx.gl.glGetError()!=GL20.GL_NO_ERROR)throw new AssertionError("Portrait GL error");
            if(++frames==180){
                var file=Gdx.files.local("../generated/previews/impostor-characters.png");
                var pixels=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                try{PixmapIO.writePNG(file,pixels,-1,true);}finally{pixels.dispose();}
                Gdx.app.log("Impostor characters","PASS: eight real rigs, production portraits, caught-only elimination with persistent ghost opacity, three seconds of animation, no GL errors");
                Gdx.app.exit();
            }
        }catch(Throwable error){failure=error;Gdx.app.exit();}
    }
    @Override public void dispose(){if(stage!=null)stage.dispose();if(font!=null)font.dispose();if(assets!=null)assets.dispose();if(characters!=null)characters.dispose();}
    public static void main(String[] args){var c=new Lwjgl3ApplicationConfiguration();c.setWindowedMode(1280,720);c.disableAudio(true);new Lwjgl3Application(new ImpostorCharactersCheck(),c);if(failure!=null)throw new AssertionError(failure);}
}
