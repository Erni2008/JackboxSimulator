package com.erni.finalanswer.lobby;

import com.erni.finalanswer.ui.play.QuestionPlayerStates;
import com.google.gson.*;

/** No GL: authoritative accepted flags, latency/deadline and per-question playback. */
public final class QuestionPlayersCheck {
    static void check(boolean okay,String why){if(!okay)throw new AssertionError(why);}
    static JsonObject snapshot(int count,long revision,int question,String phase,int submitted){
        var root=new JsonObject();root.addProperty("revision",revision);root.addProperty("gameId","match");root.addProperty("questionNumber",question);root.addProperty("phase",phase);root.addProperty("deadline",20000);
        var q=new JsonObject();q.addProperty("id","question"+question);root.add("question",q);
        var ids=new JsonArray();var players=new JsonArray();for(int i=0;i<count;i++){
            ids.add("player"+i);var p=new JsonObject();p.addProperty("id","player"+i);p.addProperty("name","Игрок "+i);p.addProperty("characterId","ghost");p.addProperty("host",false);p.addProperty("connectionStatus","ONLINE");p.addProperty("hasSubmittedAnswer",(submitted&(1<<i))!=0);players.add(p);
        }root.add("participantIds",ids);root.add("players",players);return root;
    }
    public static void main(String[] args){for(int count:new int[]{2,4,6,8}){
        var states=new QuestionPlayerStates();states.synchronize(snapshot(count,1,1,"QUESTION_PRESENTATION",0),0);check(states.players().size()==count,"Roster size");for(var p:states.players())check(!p.playing&&p.thinking,"Before acceptance authored idle is held");
        var first=states.players().get(0);states.synchronize(snapshot(count,2,1,"ANSWERING",1),500);
        check(states.players().get(0)==first&&first.submitted&&first.playing&&!first.thinking,"Accepted answer starts only its existing rig");check(!states.players().get(1).playing&&states.players().get(1).thinking,"Other players remain nervous");
        states.synchronize(snapshot(count,1,1,"ANSWERING",0),600);check(first.playing,"Ignore old revision");
        states.synchronize(snapshot(count,3,1,"ANSWERING",0),600);check(first.playing,"Accepted status remains monotonic within question");
        states.update(20000);for(var p:states.players())check(!p.playing,"Local deadline stops all before delayed broadcast");
        states.update(19999);for(var p:states.players())check(!p.playing,"Clock correction cannot restart an expired question");
        var result=snapshot(count,4,1,"RESULTS",1);var results=new JsonArray();
        var correct=new JsonObject();correct.addProperty("playerId","player0");correct.addProperty("isCorrect",true);correct.addProperty("answeredInTime",true);results.add(correct);result.add("results",results);
        var early=result.deepCopy();early.addProperty("phase","ANSWERING");early.addProperty("revision",3);states.synchronize(early,19999);check(!first.correct,"No correctness indicator before server reveal");
        states.synchronize(result,20500);check(first.correct&&!states.players().get(1).correct,"Checkmark belongs only to correct player");for(var p:states.players())check(!p.playing,"Results remain static");
        states.synchronize(snapshot(count,5,2,"QUESTION_PRESENTATION",0),21000);check(states.players().get(0)==first,"No per-question replacement");for(var p:states.players())check(!p.playing&&p.thinking&&!p.submitted&&!p.correct,"Next question holds idle and clears checkmarks");
        var offline=snapshot(count,6,2,"ANSWERING",1);offline.getAsJsonArray("players").get(1).getAsJsonObject().addProperty("connectionStatus","OFFLINE");states.synchronize(offline,1000);check(!states.players().get(1).playing&&first.playing,"Disconnect isolated");
        states.synchronize(snapshot(count,7,2,"ANSWERING",0),1001);check(states.players().get(1).thinking&&!states.players().get(1).playing,"Unanswered reconnect returns to thinking");
    }System.out.println("PASS: 2/4/6/8 participants, authoritative post-answer playback, stale snapshots, deadline, results, next-question reuse and reconnect");}
}
