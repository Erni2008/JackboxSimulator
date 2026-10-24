package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.Input;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.scenes.scene2d.*;
import com.erni.finalanswer.gameplay.impostor.ImpostorPhase;
import com.erni.finalanswer.impostor.*;
import java.util.LinkedHashMap;
import java.util.Map;

/** Offline visual fixture only. C simulates one accepted submission; D starts a timeout demo. */
public final class ImpostorCluePreview {
    private final ImpostorScreen screen;
    private final Map<String,String> accepted=new LinkedHashMap<>();
    private float elapsed;
    private boolean active;
    public ImpostorCluePreview(ImpostorScreen screen){
        this.screen=screen;
        screen.addPreviewListener(new InputListener(){
            @Override public boolean keyDown(InputEvent event,int key){
                if(key==Input.Keys.D){start();return true;}
                if(key==Input.Keys.C){submitNext();return true;}
                if(key==Input.Keys.F6 || key==Input.Keys.N || key==Input.Keys.F3 || key==Input.Keys.F4 || key==Input.Keys.R || key==Input.Keys.V || key==Input.Keys.F)cancel();
                return false;
            }
        });
    }
    private void start(){
        if(screen.paperState()!=PaperFlipState.FACE_DOWN || screen.revealedRoundCount()>=3)return;
        accepted.clear();screen.networkReady(accepted.keySet());elapsed=0;active=true;screen.clearSuspicion();
        screen.presentPhase(ImpostorPhase.ROUND_CLUE_INPUT,10_000,0);
    }
    private void submitNext(){
        if(!active)return;
        var samples=ImpostorPreviewData.clues(screen.revealedRoundCount()+1,screen.participants());
        for(var participant:screen.participants())if(!accepted.containsKey(participant.player().id())){
            accepted.put(participant.player().id(),samples.get(participant.player().id()));break;
        }
        screen.networkReady(accepted.keySet());
        if(accepted.size()==screen.participants().size())finish();
    }
    public void update(float delta){if(active && Float.isFinite(delta) && delta>0){elapsed+=delta;if(elapsed>=10)finish();}}
    private void finish(){active=false;screen.presentPhase(ImpostorPhase.ROUND_CLUE_REVEAL,0,0);screen.revealClues(accepted);}
    public void cancel(){if(active)screen.presentPhase(ImpostorPhase.INTRO,0,0);active=false;accepted.clear();}
}
