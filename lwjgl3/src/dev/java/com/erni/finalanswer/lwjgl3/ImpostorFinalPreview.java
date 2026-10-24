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
    private String outcome="IMPOSTOR_CAUGHT";
    private ImpostorPhase shownPhase;
    private int shownSubmitted=-1;
    public ImpostorFinalPreview(ImpostorScreen screen){this.screen=screen;
        screen.addPreviewListener(new InputListener(){
            @Override public boolean keyDown(InputEvent e,int key){
                if(key==Input.Keys.NUM_1||key==Input.Keys.NUM_2||key==Input.Keys.NUM_3){
                    outcome=key==Input.Keys.NUM_1?"IMPOSTOR_CAUGHT":key==Input.Keys.NUM_2?"IMPOSTOR_ESCAPED":"NO_CONSENSUS";
                    start();elapsed=30;shownPhase=null;present();return true;
                }
                if(key==Input.Keys.F){start();return true;}
                if(key==Input.Keys.N || key==Input.Keys.F3 || key==Input.Keys.F4 || key==Input.Keys.D || key==Input.Keys.V || key==Input.Keys.R || key==Input.Keys.B)cancel();
                return false;
            }
        });
    }
    public void previewOutcome(String value){outcome=switch(value.toLowerCase(java.util.Locale.ROOT)){case "caught"->"IMPOSTOR_CAUGHT";case "escaped"->"IMPOSTOR_ESCAPED";case "tie"->"NO_CONSENSUS";default->throw new IllegalArgumentException("Use caught, escaped or tie");};start();elapsed=30;shownPhase=null;present();}
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
        if(phase==ImpostorPhase.RESULT){phase=ImpostorPhase.IMPOSTOR_REVEAL;started=identity;}
        int count=players.size();String chosen=players.get(1).player().id(),first=players.getFirst().player().id();
        boolean tie=outcome.equals("NO_CONSENSUS");List<String> targets=new ArrayList<>();
        if(tie){for(int i=0;i<count/2;i++){targets.add(first);targets.add(chosen);}}else{for(int i=1;i<count;i++)targets.add(chosen);if(count>2)targets.add(first);}
        int submitted=now>=locked?targets.size():phase==ImpostorPhase.FINAL_VOTING?Math.min(targets.size()-1,(int)((now-voting)/1000)):0;
        if(shownPhase==phase&&shownSubmitted==submitted)return;shownPhase=phase;shownSubmitted=submitted;
        boolean publicVotes=now>=reveal,publicIdentity=now>=identity;
        Map<String,Integer> counts=new LinkedHashMap<>();for(var player:players)counts.put(player.player().id(),Collections.frequency(targets,player.player().id()));
        String impostor=outcome.equals("IMPOSTOR_CAUGHT")?chosen:first;
        screen.presentPhase(phase,deadline,now);
        screen.presentFinal(new FinalActSnapshot("dev-final-"+generation,phase,started,deadline,reveal,submitted,count,
            publicVotes?"dev-final-"+generation+":1":"",publicVotes?targets:List.of(),publicVotes?counts:Map.of(),
            now>=announcement?(tie?List.of(chosen,first):List.of(chosen)):List.of(),publicIdentity?impostor:"",publicIdentity?outcome:""),now);
    }
}
