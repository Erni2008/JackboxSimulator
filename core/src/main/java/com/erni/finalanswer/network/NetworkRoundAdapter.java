package com.erni.finalanswer.network;

import com.erni.finalanswer.gameplay.questions.Question;
import com.erni.finalanswer.gameplay.round.RoundController;
import com.finalanswer.protocol.Protocol;
import com.google.gson.*;
import java.util.*;

/** Maps authoritative snapshots onto the existing local animation timeline. No game decisions here. */
public final class NetworkRoundAdapter {
    private final RoundController round;
    private final RealtimeClient connection;
    private String gameId="",questionId="";
    private long lastReady;
    public NetworkRoundAdapter(RoundController round,RealtimeClient connection){this.round=round;this.connection=connection;}
    public boolean synchronize() {
        JsonObject state=connection.snapshot();
        if(state==null||!state.has("question"))return false;
        JsonObject q=state.getAsJsonObject("question");String id=q.get("id").getAsString(),game=state.get("gameId").getAsString();
        String phase=state.get("phase").getAsString();
        boolean changed=!id.equals(questionId)||!game.equals(gameId);
        if(changed){
            gameId=game;questionId=id;lastReady=0;
            List<String> answers=new ArrayList<>();for(JsonElement a:q.getAsJsonArray("answers"))answers.add(a.getAsString());
            round.startNetworkQuestion(new Question(id,q.get("text").getAsString(),answers,-1),state.get("questionNumber").getAsInt());
            if(!phase.equals("QUESTION_PRESENTATION"))round.restoreNetworkPresentation();
        }
        long now=connection.serverNow();
        if(state.get("answeringStartedAt").getAsLong()>0) {
            boolean ended=Set.of("REVEALING","RESULTS","GAME_FINISHED").contains(phase);
            double elapsed=ended?20+(now-state.get("answeringEndedAt").getAsLong())/1000.0
                :(now-state.get("answeringStartedAt").getAsLong())/1000.0;
            round.synchronizeNetworkAnswer(Math.max(0,elapsed),ended,q.has("correctAnswerIndex")?q.get("correctAnswerIndex").getAsInt():-1);
        }
        return changed;
    }
    /** Called after drawing: a phone cannot reveal before the host actually displayed the reveal frame. */
    public void afterDraw() {
        if(!connection.connected()||System.nanoTime()-lastReady<750_000_000L)return;
        JsonObject state=connection.snapshot();if(state==null||!state.has("question"))return;
        String phase=state.get("phase").getAsString(),event=null;
        if(phase.equals("QUESTION_PRESENTATION")&&round.elapsedSeconds()>=round.presentation().timerStartSeconds())event="PRESENTATION_READY";
        if(phase.equals("REVEALING")&&round.resultElapsedSeconds()>=0)event="REVEAL_READY";
        if(phase.equals("RESULTS")&&round.revealComplete()&&connection.serverNow()>=state.get("phaseStartedAt").getAsLong()+Protocol.RESULT_ANIMATION_MILLIS+Protocol.RESULT_HOLD_MILLIS)event="NEXT_READY";
        if(event!=null){lastReady=System.nanoTime();connection.send(event,Map.of("gameId",gameId,"questionId",questionId));}
    }
    public String playerStatus() {
        JsonObject s=connection.snapshot();if(s==null)return "CONNECTING…";
        if(!connection.connected())return "CONNECTION LOST — RECONNECTING…";
        if(s.get("phase").getAsString().equals("GAME_FINISHED"))return "GAME FINISHED — ESC / LOBBY";
        StringJoiner status=new StringJoiner("    |    ");
        boolean results=s.get("phase").getAsString().equals("RESULTS");
        for(JsonElement item:s.getAsJsonArray("players")){
            JsonObject p=item.getAsJsonObject();String state=p.get("connectionStatus").getAsString().equals("OFFLINE")?"OFFLINE":p.get("hasSubmittedAnswer").getAsBoolean()?"ANSWERED":"WAITING";
            if(results&&s.has("results"))for(JsonElement result:s.getAsJsonArray("results")){
                JsonObject r=result.getAsJsonObject();if(r.get("playerId").getAsString().equals(p.get("id").getAsString()))state=r.get("isCorrect").getAsBoolean()?"CORRECT":"WRONG";
            }
            status.add(p.get("name").getAsString()+" · "+state);
        }
        return status.toString();
    }
}
