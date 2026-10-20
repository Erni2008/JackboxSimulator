package com.erni.finalanswer.ui.lobby.cages;

import com.google.gson.JsonObject;
import java.util.HashMap;
import java.util.Map;

/** Reads existing snapshots only. A wrong answer is DEFEAT, never DEATH or ELIMINATION. */
public final class VoodooRoomEvents {
    @FunctionalInterface public interface Sink {void play(String playerId,VoodooAnimationController.State state,String sequence,long seed,float age);}
    private final Map<String,Boolean> alive=new HashMap<>();
    public void clear(){alive.clear();}
    public void accept(JsonObject payload,long serverNow,Sink sink) {
        var present=new java.util.HashSet<String>();
        if(payload.has("players"))for(var element:payload.getAsJsonArray("players")) {
            var p=element.getAsJsonObject();String id=text(p,"id","");boolean now=!p.has("isAlive")||p.get("isAlive").getAsBoolean();
            present.add(id);alive.put(id,now);
            if(!now)emit(sink,id,VoodooAnimationController.State.DEATH,"death:"+text(payload,"gameId",text(payload,"roomId",""))+":"+id,0);
        }
        if(payload.has("players"))alive.keySet().retainAll(present);
        String phase=text(payload,"phase","");
        if(payload.has("results")&&(phase.equals("RESULTS")||phase.equals("GAME_FINISHED")&&text(payload,"finishReason","").equals("COMPLETED"))) {
            String question=payload.has("question")?text(payload.getAsJsonObject("question"),"id",""):"";
            String sequence="quiz:"+text(payload,"gameId","")+":"+question;
            float age=age(payload,"phaseStartedAt",serverNow);
            for(var element:payload.getAsJsonArray("results")) {var result=element.getAsJsonObject();
                emit(sink,text(result,"playerId",""),result.get("isCorrect").getAsBoolean()?VoodooAnimationController.State.VICTORY:VoodooAnimationController.State.DEFEAT,sequence,age);
            }
        }
        if(payload.has("impostor")) {
            var mini=payload.getAsJsonObject("impostor");
            if(mini.has("result")&&mini.get("result").isJsonObject()) {
                var result=mini.getAsJsonObject("result");String sequence="impostor:"+text(result,"matchId","");float age=age(result,"completedAt",serverNow);
                for(var element:result.getAsJsonArray("participants")){var p=element.getAsJsonObject();
                    emit(sink,text(p,"playerId",""),p.get("winner").getAsBoolean()?VoodooAnimationController.State.VICTORY:VoodooAnimationController.State.DEFEAT,sequence,age);
                }
            }
        }
    }
    private static void emit(Sink sink,String id,VoodooAnimationController.State state,String sequence,float age){sink.play(id,state,sequence,((long)sequence.hashCode()<<32)^id.hashCode(),age);}
    private static String text(JsonObject data,String key,String fallback){return data.has(key)&&!data.get(key).isJsonNull()?data.get(key).getAsString():fallback;}
    private static float age(JsonObject data,String key,long now){return data.has(key)?Math.max(0,(now-data.get(key).getAsLong())/1000f):0;}
}
