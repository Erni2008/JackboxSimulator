package com.finalanswer.server.game.systembreach;

import com.erni.finalanswer.gameplay.systembreach.*;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.erni.finalanswer.gameplay.systembreach.SystemBreachConfig.Parameter.*;

/** Independent solvers consume the exact public DTO. They never read the private answer field. */
class SystemBreachChallengeContractTest {
    final Gson gson=new Gson();
    JsonElement solve(SystemBreachView.Challenge view){
        JsonObject d=gson.toJsonTree(view.data()).getAsJsonObject();
        return switch(view.type()){
            case "PASSWORD_DECRYPTION"->{StringBuilder word=new StringBuilder();for(String token:d.get("encoded").getAsString().split(" "))word.append(d.getAsJsonObject("substitutions").get(token).getAsString());yield new JsonPrimitive(word.toString());}
            case "CIRCUIT_BYPASS"->{var nodes=d.getAsJsonArray("nodes");JsonArray turns=new JsonArray();for(int i=0;i<nodes.size();i++){var at=nodes.get(i).getAsJsonObject();int mask=(i==0?8:direction(at,nodes.get(i-1).getAsJsonObject()))|(i==nodes.size()-1?2:direction(at,nodes.get(i+1).getAsJsonObject()));int initial=at.get("connections").getAsInt(),rotation=0;while(rotation<4&&ChallengeFactory.rotate(initial,rotation)!=mask)rotation++;assertTrue(rotation<4);turns.add(rotation);}yield turns;}
            case "SIGNAL_INTERCEPTION"->new JsonObject();
            case "DATA_ANALYSIS"->{var criteria=d.getAsJsonObject("criteria");JsonArray ids=new JsonArray();for(var e:d.getAsJsonArray("logs")){var log=e.getAsJsonObject();if(log.get("event").equals(criteria.get("event"))&&log.get("verification").equals(criteria.get("verification")))ids.add(log.get("id"));}yield ids;}
            case "PORT_DETECTION"->{var criteria=d.getAsJsonObject("criteria");JsonElement answer=null;int matches=0;for(var e:d.getAsJsonArray("ports")){var port=e.getAsJsonObject();if(port.get("state").equals(criteria.get("state"))&&port.get("service").equals(criteria.get("service"))){answer=port.get("port");matches++;}}assertEquals(1,matches);yield answer;}
            case "RECONNECT_WIRES"->{JsonObject pairs=new JsonObject();for(var left:d.getAsJsonArray("left"))for(var right:d.getAsJsonArray("right"))if(left.getAsJsonObject().get("label").equals(right.getAsJsonObject().get("label")))pairs.add(left.getAsJsonObject().get("id").getAsString(),right.getAsJsonObject().get("id"));yield pairs;}
            case "COOLING_SYSTEM"->gson.toJsonTree(Map.of("level",3));
            case "FILE_RECOVERY"->{JsonObject operations=new JsonObject();for(var e:d.getAsJsonArray("files")){var file=e.getAsJsonObject();operations.addProperty(file.get("id").getAsString(),file.get("backupVerified").getAsBoolean()?"RESTORE_BACKUP":file.get("indexIntact").getAsBoolean()?"REBUILD_INDEX":"DISCARD");}yield operations;}
            case "SIGNAL_ROUTING"->{Map<String,List<String>> edges=new HashMap<>();for(var edge:d.getAsJsonArray("edges")){var pair=edge.getAsJsonArray();edges.computeIfAbsent(pair.get(0).getAsString(),k->new ArrayList<>()).add(pair.get(1).getAsString());}var route=route(d.get("source").getAsString(),d.get("destination").getAsString(),edges,new HashSet<>());assertNotNull(route);yield gson.toJsonTree(route);}
            case "DATA_PURGE"->{int threshold=d.getAsJsonObject("criteria").get("sizeGreaterThanMB").getAsInt();JsonArray ids=new JsonArray();for(var e:d.getAsJsonArray("files")){var file=e.getAsJsonObject();if(file.get("sizeMB").getAsInt()>threshold&&file.get("verification").getAsString().equals("UNKNOWN"))ids.add(file.get("id"));}yield ids;}
            case "QUICK_QUESTION","QUICK_REBOOT"->null;   // answer key is server-only by design
            default->throw new AssertionError(view.type());
        };
    }
    static int direction(JsonObject from,JsonObject to){int dx=to.get("x").getAsInt()-from.get("x").getAsInt(),dy=to.get("y").getAsInt()-from.get("y").getAsInt();assertEquals(1,Math.abs(dx)+Math.abs(dy));return dx==1?2:dx==-1?8:dy==1?4:1;}
    static List<String> route(String from,String to,Map<String,List<String>> edges,Set<String> seen){if(!seen.add(from))return null;if(from.equals(to))return List.of(from);for(String next:edges.getOrDefault(from,List.of())){var suffix=route(next,to,edges,new HashSet<>(seen));if(suffix!=null){var path=new ArrayList<String>();path.add(from);path.addAll(suffix);return path;}}return null;}
    @Test void everyPublicPuzzleCanBeSolvedAcrossSeedsAndDifficulties(){
        for(int difficulty=1;difficulty<=3;difficulty++){
            var factory=new ChallengeFactory(new Random(404+difficulty),new SystemBreachConfig(),difficulty);
            for(int seed=0;seed<50;seed++){
                List<BreachChallenge> challenges=new ArrayList<>();for(var type:ChallengeType.values())challenges.add(factory.earning(type,10000));for(var type:RecoveryType.values())challenges.add(factory.recovery(type,10000));
                for(var c:challenges){var view=c.view(10000);assertFalse(gson.toJson(view).contains("solution"));var answer=solve(view);if(answer==null)answer=c.solution;long now=10000;
                    if(c.type.equals("SIGNAL_INTERCEPTION"))now=((Number)view.data().get("windowOpensAt")).longValue();
                    if(c.cooling()){assertFalse(c.validate(answer,now));double rate=3*((Number)view.data().get("coolingPerLevelPerSecond")).doubleValue()-((Number)view.data().get("passiveHeatingPerSecond")).doubleValue();long needed=(long)Math.ceil((((Number)view.data().get("temperature")).doubleValue()-((Number)view.data().get("target")).doubleValue())*1000/rate)+((Number)view.data().get("stableMs")).longValue();assertTrue(c.cooled(now+needed));}
                    else assertTrue(c.validate(answer,now),c.type+" difficulty "+difficulty);
                }
            }
        }
    }
    @Test void endOfRoundDoesNotSellAnUnusableAttemptOrOfferAnImpossibleSignal(){var f=new SystemBreachSessionTest.F();f.active();f.advance(237000);SystemBreachSessionTest.failure("ROUND_ENDING",()->f.challenge("a",ChallengeType.SIGNAL_INTERCEPTION));var c=f.challenge("a",ChallengeType.PORT_DETECTION);assertEquals(340000,c.expires);f.advance(1600);int before=f.p("b").ap();SystemBreachSessionTest.failure("ROUND_ENDING",()->f.act("b","ATTACK_REQUEST",Map.of("targetId","a")));assertEquals(before,f.p("b").ap());}
    @Test void lastValidAttackWindowIsCappedAtTheActualMatchEnd(){var f=new SystemBreachSessionTest.F();f.active();f.advance(237000);f.attack();assertEquals(340000,f.p("a").attack.expires);}
    @Test void publicChallengeViewsCannotMutateTheAuthoritativePuzzle(){
        var c=new ChallengeFactory(new Random(3),new SystemBreachConfig(),1).earning(ChallengeType.DATA_ANALYSIS,0);var view=c.view(0);
        @SuppressWarnings("unchecked") var logs=(List<Map<String,Object>>)view.data().get("logs");int size=logs.size();assertThrows(UnsupportedOperationException.class,logs::clear);assertThrows(UnsupportedOperationException.class,()->logs.getFirst().put("event","ALTERED"));
        assertEquals(size,((List<?>)c.data.get("logs")).size());assertTrue(c.validate(solve(view),1));
    }

}
