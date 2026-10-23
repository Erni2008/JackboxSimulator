package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.cursedboxes.*;
import com.erni.finalanswer.impostor.*;

/** Runs away from assets/: libGDX must resolve distribution resources from the classpath. */
public final class PackagedAssetsCheck extends FinalAnswerGame {
    private static Throwable failure;
    private CursedBoxesScreen cursed;
    private ImpostorScreen impostor;
    private int frames;
    @Override public void create(){
        try{
            super.create();
            if(Gdx.files.internal("clock/clock1.png").exists())throw new AssertionError("Check must use staged resources, not source artwork");
            if(!com.erni.finalanswer.ui.RuntimeTextures.exists("clock/clock1.png"))throw new AssertionError("Prepared clock missing");
            var assets=new ImpostorAssets();
            try{assets.load();if(!assets.failures().isEmpty())throw new AssertionError(assets.failures());}finally{assets.dispose();}
            impostor=new ImpostorScreen(this);impostor.setParticipants(ImpostorPreviewData.participants(4));setScreen(impostor);
        }catch(Throwable error){failure=error;Gdx.app.exit();}
    }
    @Override public void render(){
        if(failure!=null)return;
        try{
            super.render();
            if(++frames==30){cursed=new CursedBoxesScreen(this::showMainMenu);setScreen(cursed);}
            if(frames==90){System.out.println("PASS: prepared-only desktop assets load/render menu, all Impostor art and complete Cursed Boxes scene without original UI files");Gdx.app.exit();}
        }catch(Throwable error){failure=error;Gdx.app.exit();}
    }
    @Override public void dispose(){if(cursed!=null)cursed.dispose();if(impostor!=null)impostor.dispose();super.dispose();}
    public static void main(String[] args){
        System.setProperty("cursed.windowed","true");
        var config=new Lwjgl3ApplicationConfiguration();config.setTitle("FINAL ANSWER — Distribution resources");config.setWindowedMode(1280,720);config.setForegroundFPS(60);
        config.setPreferencesConfig(System.getProperty("packaging.qa.dir"),Files.FileType.Absolute);
        new Lwjgl3Application(new PackagedAssetsCheck(),config);
        if(failure!=null)throw new AssertionError("Packaged resources regression",failure);
    }
}
