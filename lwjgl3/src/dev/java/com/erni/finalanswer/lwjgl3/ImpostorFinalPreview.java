package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.scenes.scene2d.*;
import com.erni.finalanswer.impostor.*;
import com.erni.finalanswer.gameplay.impostor.*;
import java.util.*;

/** Offline final-act demonstration only. Real games use server snapshots through the network adapter. */
public final class ImpostorFinalPreview {
    private final ImpostorScreen screen;
    private double elapsed;
    private boolean active;
    private int generation;
    private ImpostorPhase shownPhase;
    private int shownSubmitted=-1;
    public ImpostorFinalPreview(ImpostorScreen screen){this.screen=screen;
        ((Stage)Gdx.input.getInputProcessor()).addListener(new InputListener(){
            @Override public boolean keyDown(InputEvent e,int key){
                if(key==Input.Keys.F){start();return true;}
                if(key==Input.Keys.N || key==Input.Keys.F3 || key==Input.Keys.F4 || key==Input.Keys.D || key==Input.Keys.V || key==Input.Keys.R || key==Input.Keys.B)cancel();
                return false;
            }
        });
    }
    public void start(){elapsed=0;active=true;generation++;shownPhase=null;shownSubmitted=-1;screen.clearSuspicion();present();}
    public void cancel(){if(active){screen.clearFinal();if(screen.state().phase()!=ImpostorPhase.ROUND_CLUE_INPUT)screen.presentPhase(ImpostorPhase.INTRO,0,0);}active=false;}
    public void update(float delta){if(active && Float.isFinite(delta) && delta>0){elapsed+=delta;present();}}
    private void present(){
        var players=screen.participants();if(players.size()<3){cancel();return;}
        long now=(long)(elapsed*1000)+1000;
        long voting=4000,locked=8000,reveal=8700,announcement=reveal+FinalRevealTiming.duration(players.size()),identity=announcement+3500,result=identity+4000;
        ImpostorPhase phase=now<voting?ImpostorPhase.EVIDENCE_REVIEW:now<locked?ImpostorPhase.FINAL_VOTING:now<reveal?ImpostorPhase.VOTING_LOCKED:
            now<announcement?ImpostorPhase.FINAL_VOTE_REVEAL:now<identity?ImpostorPhase.SUSPECT_ANNOUNCEMENT:now<result?ImpostorPhase.IMPOSTOR_REVEAL:ImpostorPhase.RESULT;
        long started=switch(phase){case EVIDENCE_REVIEW->1000;case FINAL_VOTING->voting;case VOTING_LOCKED->locked;case FINAL_VOTE_REVEAL->reveal;case SUSPECT_ANNOUNCEMENT->announcement;case IMPOSTOR_REVEAL->identity;default->result;};
        long deadline=switch(phase){case EVIDENCE_REVIEW->voting;case FINAL_VOTING->locked;case VOTING_LOCKED->reveal;case FINAL_VOTE_REVEAL->announcement;case SUSPECT_ANNOUNCEMENT->identity;case IMPOSTOR_REVEAL->result;default->0;};
        int count=players.size();String chosen=players.get(1).player().id();
        int submitted=now>=locked?count:phase==ImpostorPhase.FINAL_VOTING?Math.min(count-1,(int)((now-voting)/1000)):0;
        if(shownPhase==phase && shownSubmitted==submitted)return;
        shownPhase=phase;shownSubmitted=submitted;
        boolean publicVotes=now>=reveal,publicIdentity=now>=identity;
        Map<String,Integer> counts=new LinkedHashMap<>();for(var player:players)counts.put(player.player().id(),player.player().id().equals(chosen)?count-1:player==players.getFirst()?1:0);
        List<String> targets=new ArrayList<>();targets.add(players.getFirst().player().id());for(int i=1;i<count;i++)targets.add(chosen);
        screen.presentPhase(phase,deadline,now);
        screen.presentFinal(new FinalActSnapshot("dev-final-"+generation,phase,started,deadline,reveal,
            submitted,count,
            publicVotes?"dev-final-"+generation+":1":"",publicVotes?targets:List.of(),publicVotes?counts:Map.of(),
            now>=announcement?List.of(chosen):List.of(),publicIdentity?chosen:"",publicIdentity?"IMPOSTOR_CAUGHT":""),now);
    }
}
