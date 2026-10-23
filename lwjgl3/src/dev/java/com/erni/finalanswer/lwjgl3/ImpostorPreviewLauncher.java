package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.impostor.ImpostorScreen;

/** Development source set only: excluded from production jars and distributions. */
public final class ImpostorPreviewLauncher {
    public static void main(String[] args) {
        if (StartupHelper.startNewJvmIfRequired()) return;
        var config = new Lwjgl3ApplicationConfiguration();
        config.setTitle("Final Answer - THE IMPOSTOR / Stage 6 / F: final act / V: suspicion / F3-F4: players / F5: other characters / R: reveal / B: back / N: reset");
        config.setWindowedMode(1280, 720);
        config.disableAudio(false);
        new Lwjgl3Application(new FinalAnswerGame() {
            private ImpostorScreen preview;
            private com.erni.finalanswer.ui.lobby.cages.CageLobby characters;
            @Override public com.erni.finalanswer.ui.lobby.cages.CageLobby getRoomCharacters(){return characters;}
            private ImpostorSuspicionPreview suspicion;
            private ImpostorCluePreview clues;
            private ImpostorFinalPreview finalAct;
            private com.erni.finalanswer.network.RealtimeClient live;
            @Override public void create() {
                super.create();
                characters = new com.erni.finalanswer.ui.lobby.cages.CageLobby();
                preview = new ImpostorScreen(this);
                preview.setParticipants(ImpostorPreviewData.participants(4));
                setScreen(preview);
                String configFile=System.getProperty("impostor.connection","");
                if(configFile.isBlank()){preview.presentPhase(com.erni.finalanswer.gameplay.impostor.ImpostorPhase.INTRO,0,0);suspicion=ImpostorPreviewData.installControls(preview);clues=new ImpostorCluePreview(preview);finalAct=new ImpostorFinalPreview(preview);}
                else {
                    try {
                        var config=com.google.gson.JsonParser.parseString(java.nio.file.Files.readString(java.nio.file.Path.of(configFile))).getAsJsonObject();
                        live=new com.erni.finalanswer.network.RealtimeClient(config.get("url").getAsString(),config.get("code").getAsString(),
                            config.get("token").getAsString(),event->{},status->com.badlogic.gdx.Gdx.app.log("Impostor",status));
                        preview.connectSuspicion(live);
                    }catch(java.io.IOException error){throw new IllegalStateException("Cannot read local Impostor host credentials",error);}
                }
            }
            @Override public void render() {
                if(getScreen()==preview && suspicion!=null)suspicion.update(com.badlogic.gdx.Gdx.graphics.getDeltaTime());
                if(getScreen()==preview && clues!=null)clues.update(com.badlogic.gdx.Gdx.graphics.getDeltaTime());
                if(getScreen()==preview && finalAct!=null)finalAct.update(com.badlogic.gdx.Gdx.graphics.getDeltaTime());
                super.render();
            }
            @Override public void dispose() {
                // Hide the active screen before releasing any owned resources.
                if (preview != null && getScreen() == preview) showMainMenu();
                if(live!=null)live.close();
                if (preview != null) preview.dispose();
                super.dispose();
                if(characters!=null)characters.dispose();
            }
        }, config);
    }
}
