package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.*;
import com.erni.finalanswer.cursedcards.CursedCardsPrototype;

/** Development-only entry point for the local THE CURSED CARDS prototype; the game's menus are untouched. */
public final class CursedCardsDemoLauncher {
    public static void main(String[] args){
        if(StartupHelper.startNewJvmIfRequired())return;
        var config=new Lwjgl3ApplicationConfiguration();config.setTitle("Final Answer — THE CURSED CARDS (LOCAL PROTOTYPE)");
        config.setWindowedMode(1440,900);config.useVsync(true);config.setForegroundFPS(0);config.setBackBufferConfig(8,8,8,8,24,0,4);
        // vsync paces frames at the display rate (120 Hz ProMotion included); a 60 FPS cap judders there.
        new Lwjgl3Application(new CursedCardsPrototype(),config);
    }
}
