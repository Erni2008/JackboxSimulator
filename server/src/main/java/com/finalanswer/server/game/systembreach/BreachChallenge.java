package com.finalanswer.server.game.systembreach;

import com.erni.finalanswer.gameplay.systembreach.*;
import com.google.gson.*;
import java.util.*;
import static com.erni.finalanswer.gameplay.systembreach.SystemBreachConfig.Parameter.*;

/** Private answer and mutable simulation state never enter the wire projection. */
final class BreachChallenge {
    final String id=UUID.randomUUID().toString(),type;
    final boolean recovery;final long created,expires;final int reward;
    final Map<String,Object> data;final JsonElement solution;
    private final SystemBreachConfig cfg;
    private long coolingAt,controlAt,stableAt=-1,coolingCompletedAt=Long.MAX_VALUE;private double temperature,temperatureAtControl;private int control;
    BreachChallenge(String type,boolean recovery,long now,int duration,int reward,Map<String,Object> data,Object solution,SystemBreachConfig cfg){
        this.type=type;this.recovery=recovery;created=now;expires=now+duration;this.reward=reward;
        this.data=Map.copyOf(data);this.solution=new Gson().toJsonTree(solution);this.cfg=cfg;coolingAt=controlAt=now;temperature=temperatureAtControl=cfg.get(COOLING_START);
    }
    boolean cooling(){return recovery&&type.equals("COOLING_SYSTEM");}
    void advance(long now){
        if(!cooling()||now<=coolingAt)return;
        long until=Math.min(now,expires);if(until<=coolingAt)return;
        double rate=cfg.get(COOLING_PASSIVE_PER_SECOND)-control*cfg.get(COOLING_CONTROL_PER_SECOND);
        double next=Math.max(0,Math.min(100,temperatureAtControl+(until-controlAt)*rate/1000.));
        if(rate<0&&temperatureAtControl>cfg.get(COOLING_TARGET)&&next<=cfg.get(COOLING_TARGET))stableAt=controlAt+(long)Math.ceil((temperatureAtControl-cfg.get(COOLING_TARGET))/-rate*1000);
        if(temperatureAtControl<=cfg.get(COOLING_TARGET)&&stableAt<0)stableAt=controlAt;
        if(stableAt>=0){
            long candidate=stableAt+cfg.get(COOLING_STABLE_MS);
            double crossesAbove=rate>0?controlAt+(cfg.get(COOLING_TARGET)-temperatureAtControl)/rate*1000:Double.POSITIVE_INFINITY;
            if(candidate<=until&&candidate<=crossesAbove)coolingCompletedAt=Math.min(coolingCompletedAt,candidate);
        }
        if(next>cfg.get(COOLING_TARGET))stableAt=-1;
        temperature=next;coolingAt=until;
    }
    long completedAt(long now){advance(now);return coolingCompletedAt<=Math.min(now,expires)?coolingCompletedAt:Long.MAX_VALUE;}
    boolean cooled(long now){return completedAt(now)!=Long.MAX_VALUE;}
    boolean validate(JsonElement answer,long now){
        if(now>=expires)return false;
        if(cooling()){
            if(answer==null||!answer.isJsonObject()||!answer.getAsJsonObject().keySet().equals(Set.of("level")))throw BreachFailure.invalid();
            int level=integer(answer.getAsJsonObject().get("level"),0,3);advance(now);control=level;controlAt=now;temperatureAtControl=temperature;return cooled(now);
        }
        if(type.equals("SIGNAL_INTERCEPTION")){
            if(answer==null||!answer.isJsonObject()||!answer.getAsJsonObject().isEmpty())throw BreachFailure.invalid();
            long opens=((Number)data.get("windowOpensAt")).longValue(),closes=((Number)data.get("windowClosesAt")).longValue();
            return now>=opens-cfg.get(SIGNAL_TOLERANCE_MS)&&now<=closes+cfg.get(SIGNAL_TOLERANCE_MS);
        }
        if(type.equals("PASSWORD_DECRYPTION"))return answer!=null&&answer.isJsonPrimitive()&&answer.getAsJsonPrimitive().isString()&&answer.getAsString().length()<=32&&answer.getAsString().toUpperCase(Locale.ROOT).equals(solution.getAsString());
        if(type.equals("CIRCUIT_BYPASS")){
            if(answer==null||!answer.isJsonArray()||answer.getAsJsonArray().size()!=solution.getAsJsonArray().size())return false;
            @SuppressWarnings("unchecked") var nodes=(List<Map<String,Object>>)data.get("nodes");
            for(int i=0;i<nodes.size();i++){int turns=integer(answer.getAsJsonArray().get(i),0,3);int mask=((Number)nodes.get(i).get("connections")).intValue();if(ChallengeFactory.rotate(mask,turns)!=solution.getAsJsonArray().get(i).getAsInt())return false;}return true;
        }
        if(type.equals("DATA_ANALYSIS")||type.equals("DATA_PURGE")){
            if(answer==null||!answer.isJsonArray())return false;Set<String> selected=new HashSet<>();
            for(var e:answer.getAsJsonArray()){if(!e.isJsonPrimitive()||!e.getAsJsonPrimitive().isString()||!selected.add(e.getAsString()))return false;}
            Set<String> expected=new HashSet<>();for(var e:solution.getAsJsonArray())expected.add(e.getAsString());return selected.equals(expected);
        }
        return solution.equals(answer);
    }
    SystemBreachView.Challenge view(long now){
        Map<String,Object> payload=new LinkedHashMap<>(data);
        if(cooling()){payload.put("temperature",Math.round(temperature*10)/10.);payload.put("control",control);payload.put("stableSince",stableAt);}
        return new SystemBreachView.Challenge(id,type,recovery,created,expires,payload);
    }
    static int integer(JsonElement e,int min,int max){
        if(e==null||!e.isJsonPrimitive()||!e.getAsJsonPrimitive().isNumber()||!e.toString().matches("-?[0-9]{1,9}"))throw BreachFailure.invalid();
        int n=e.getAsInt();if(n<min||n>max)throw BreachFailure.invalid();return n;
    }
}
