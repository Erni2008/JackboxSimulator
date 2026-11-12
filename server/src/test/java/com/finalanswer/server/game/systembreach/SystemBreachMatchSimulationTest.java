package com.finalanswer.server.game.systembreach;

import com.erni.finalanswer.gameplay.systembreach.*;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.lang.reflect.Field;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.erni.finalanswer.gameplay.systembreach.SystemBreachConfig.Parameter.*;

/** Full-length matches on a virtual clock, mixing eight independent actors and connection changes. */
class SystemBreachMatchSimulationTest {
    @SuppressWarnings("unchecked") static Map<String,SystemBreachPlayerState> players(SystemBreachSession s){try{Field f=SystemBreachSession.class.getDeclaredField("players");f.setAccessible(true);return (Map<String,SystemBreachPlayerState>)f.get(s);}catch(Exception e){throw new AssertionError(e);}}
    static JsonElement answer(BreachChallenge c){
        if(c.type.equals("SIGNAL_INTERCEPTION"))return new JsonObject();
        if(!c.type.equals("CIRCUIT_BYPASS"))return c.solution;
        JsonArray rotations=new JsonArray();@SuppressWarnings("unchecked") var nodes=(List<Map<String,Object>>)c.data.get("nodes");
        for(int i=0;i<nodes.size();i++){int mask=((Number)nodes.get(i).get("connections")).intValue(),wanted=c.solution.getAsJsonArray().get(i).getAsInt(),turn=0;while(ChallengeFactory.rotate(mask,turn)!=wanted&&turn<4)turn++;assertTrue(turn<4);rotations.add(turn);}return rotations;
    }
    @Test void completeMatchesWithEightPlayersMaintainAllInvariants(){
        Set<String> exercised=new HashSet<>();List<SystemBreachView.Outcome> reports=new ArrayList<>();
        for(int seed=1;seed<=5;seed++){
            var cfg=new SystemBreachConfig();var ids=java.util.stream.IntStream.range(0,8).mapToObj(i->"p"+i).toList();var session=new SystemBreachSession(ids,0,cfg,new Random(seed),1+(seed%3));var roster=players(session);var decisions=new Random(seed*71L);long nonce=0;Set<String> online=new HashSet<>(ids);session.tick(20000,online);
            for(long now=20000;now<260000;now+=500){
                int step=(int)((now-20000)/500);online=new HashSet<>(ids);if(step%60<8)online.remove(ids.get((step/60)%8));session.tick(now,online);
                for(String id:ids){if(!online.contains(id))continue;var p=roster.get(id);String action=null;Map<String,Object> fields=new LinkedHashMap<>();
                    if(p.recovery!=null){
                        var c=p.recovery;if(c.cooling()){if(((Number)c.view(now).data().get("control")).intValue()==3)continue;fields.put("answer",Map.of("level",3));}
                        else fields.put("answer",decisions.nextInt(10)==0?new JsonArray():c.solution);
                        action="RECOVERY_SUBMIT";fields.put("challengeId",c.id);
                    }else if(p.blocked(now))continue;
                    else if(p.attack!=null){action="ATTACK_SUBMIT";fields.put("attackId",p.attack.id);fields.put("password",decisions.nextInt(4)==0?p.attack.options.getFirst():roster.get(p.attack.target).password);}
                    else if(p.challenge!=null){var c=p.challenge;if(c.type.equals("SIGNAL_INTERCEPTION")&&now<((Number)c.data.get("windowOpensAt")).longValue())continue;action="CHALLENGE_SUBMIT";fields.put("challengeId",c.id);fields.put("answer",answer(c));}
                    else{
                        int choice=decisions.nextInt(10);String target=ids.get(decisions.nextInt(ids.size()));
                        if(choice==0&&p.firewall<3&&p.ap()>=cfg.get(p.firewall==1?FIREWALL_2_COST:FIREWALL_3_COST))action="FIREWALL_UPGRADE";
                        else if(choice==1&&p.ap()>=25&&now>=p.specialReadyAt&&now>=p.attackReadyAt){action="SPECIAL_ATTACK";fields.put("type",SpecialAttackType.values()[decisions.nextInt(5)].name());fields.put("targetId",target);}
                        else if(choice<=3&&p.ap()>=25&&now>=p.attackReadyAt){action="ATTACK_REQUEST";fields.put("targetId",target);}
                        else if(now>=p.challengeReadyAt){action="CHALLENGE_REQUEST";fields.put("type",ChallengeType.values()[decisions.nextInt(5)].name());}
                    }
                    if(action!=null)try{session.act(id,"sim-"+(++nonce),action,new Gson().toJsonTree(fields).getAsJsonObject(),now,online);exercised.add(action);if(action.equals("SPECIAL_ATTACK"))exercised.add((String)fields.get("type"));}
                    catch(BreachFailure e){assertTrue(Set.of("SB_SELF_ATTACK","SB_TARGET_DISCONNECTED","SB_TARGET_PROTECTED","SB_TARGET_BUSY","SB_INSUFFICIENT_AP","SB_RATE_LIMITED","SB_STALE_RECOVERY","SB_ROUND_ENDING").contains(e.getMessage()),e.getMessage());}
                }
                Set<String> reserved=new HashSet<>();for(var p:roster.values()){
                    assertTrue(p.ap()>=0&&p.ap()<=cfg.get(MAX_AP));var stats=p.statistics();assertEquals(cfg.get(INITIAL_AP)+stats.earned()+stats.stolen()-stats.lost()-stats.spent()-stats.penalties(),p.ap());assertEquals(stats.spent(),stats.defenseSpent()+stats.attackSpent()+stats.specialSpent());assertTrue(p.integrity>=0&&p.integrity<=100);assertTrue(p.infection>=0&&p.infection<=100);
                    if(p.compromised)assertNotNull(p.recovery,"Compromised computer always has a recovery path");if(p.attack!=null)assertTrue(reserved.add(p.attack.target),"Single reservation per target");
                }
            }
            session.tick(270000,new HashSet<>(ids));assertEquals(SystemBreachPhase.FINISHED,session.phase());var outcome=session.outcome(Map.of());reports.add(outcome);assertEquals(8,outcome.rankings().size());assertEquals(1,outcome.rankings().stream().filter(SystemBreachView.Result::winner).count());
            int previous=Integer.MAX_VALUE;for(var row:outcome.rankings()){assertTrue(row.accessPoints()<=previous);previous=row.accessPoints();}
            for(var p:roster.values()){assertNull(p.password);assertNull(p.recovery);assertNull(p.attack);assertTrue(p.recoveryBag.isEmpty());}session.close();
        }
        try{var directory=java.nio.file.Path.of("build/reports/system-breach");java.nio.file.Files.createDirectories(directory);java.nio.file.Files.writeString(directory.resolve("balance-simulation.json"),new Gson().toJson(Map.of("kind","deterministic simulation, not a human playtest","matches",reports)));}catch(java.io.IOException e){throw new AssertionError(e);}
        assertTrue(exercised.containsAll(List.of("CHALLENGE_REQUEST","CHALLENGE_SUBMIT","ATTACK_REQUEST","ATTACK_SUBMIT","RECOVERY_SUBMIT","FIREWALL_UPGRADE","TROJAN","DATA_LEAK","SYSTEM_OVERLOAD","FIREWALL_BREAKER","TRACE_ATTACK")),exercised.toString());
    }
    @Test void aCompromisedAttackerImmediatelyReleasesTheirReservedTarget(){
        var ids=List.of("a","b","c");var cfg=new SystemBreachConfig().with(INITIAL_AP,100);var s=new SystemBreachSession(ids,0,cfg,new Random(9),1);Set<String> online=new HashSet<>(ids);s.tick(20000,online);var players=players(s);
        s.act("b","b-start","ATTACK_REQUEST",JsonParser.parseString("{\"targetId\":\"c\"}" ).getAsJsonObject(),20001,online);
        s.act("a","a-start","ATTACK_REQUEST",JsonParser.parseString("{\"targetId\":\"b\"}").getAsJsonObject(),20001,online);
        JsonObject submit=new JsonObject();submit.addProperty("attackId",players.get("a").attack.id);submit.addProperty("password",players.get("b").password);
        s.act("a","a-stop","ATTACK_SUBMIT",submit,20002,online);assertNull(players.get("b").attack);assertEquals(85,players.get("b").ap()+20);assertTrue(players.get("b").compromised);assertTrue(s.eventsAfter(0).stream().anyMatch(e->e.type().equals("ATTACK_INTERRUPTED")&&e.targetId().equals("c")));
    }
    @Test void recoveryBagAvoidsConsecutiveRepeatsAndCoversEveryType(){SystemBreachSession.QUIZ_RECOVERY=false;try{
        var f=new SystemBreachSessionTest.F(new SystemBreachConfig().with(INITIAL_AP,10000).with(RECOVERY_RETRIES,10));f.active();f.breach();String previous="";Set<String> firstFive=new HashSet<>();
        for(int i=0;i<8;i++){var c=f.p("b").recovery;assertNotEquals(previous,c.type);previous=c.type;if(i<5)firstFive.add(c.type);f.advance(f.cfg.get(RECOVERY_MS));}
        assertEquals(5,firstFive.size());}finally{SystemBreachSession.QUIZ_RECOVERY=true;}
    }
    @Test void publicRoutingGraphsHaveExactlyOneRouteAndUnpredictableIds(){
        var factory=new ChallengeFactory(new Random(42),new SystemBreachConfig(),3);Set<String> sources=new HashSet<>();
        for(int i=0;i<100;i++){var c=factory.recovery(RecoveryType.SIGNAL_ROUTING,0);sources.add((String)c.data.get("source"));@SuppressWarnings("unchecked") var edges=(List<List<String>>)c.data.get("edges");assertEquals(1,routes((String)c.data.get("source"),(String)c.data.get("destination"),edges,new HashSet<>()));assertTrue(c.validate(c.solution,1));}
        assertTrue(sources.size()>5);
    }

    @Test void circuitsHaveDifferentLayoutsAndNeverStartAlreadySolved(){
        var factory=new ChallengeFactory(new Random(123),new SystemBreachConfig(),3);Set<String> layouts=new HashSet<>();
        for(int i=0;i<100;i++){var c=factory.earning(ChallengeType.CIRCUIT_BYPASS,0);@SuppressWarnings("unchecked") var nodes=(List<Map<String,Object>>)c.data.get("nodes");StringBuilder layout=new StringBuilder();boolean unsolved=false;
            for(int n=0;n<nodes.size();n++){var node=nodes.get(n);layout.append(node.get("x")).append(',').append(node.get("y")).append(';');if(((Number)node.get("connections")).intValue()!=c.solution.getAsJsonArray().get(n).getAsInt())unsolved=true;}
            assertTrue(unsolved);assertTrue(c.validate(answer(c),1));layouts.add(layout.toString());
        }assertTrue(layouts.size()>10);
    }
    @Test void rulePuzzlesRequireBothConditionsAndDoNotAlwaysExposeTheFirstRow(){
        var factory=new ChallengeFactory(new Random(37),new SystemBreachConfig(),2);Set<String> logRules=new HashSet<>(),portRules=new HashSet<>();boolean logWithoutFirst=false,purgeWithoutFirst=false;
        for(int i=0;i<100;i++){
            var log=factory.earning(ChallengeType.DATA_ANALYSIS,0);@SuppressWarnings("unchecked") var criteria=(Map<String,String>)log.data.get("criteria");logRules.add(criteria.get("event"));@SuppressWarnings("unchecked") var logs=(List<Map<String,Object>>)log.data.get("logs");
            assertTrue(logs.stream().anyMatch(l->l.get("event").equals(criteria.get("event"))&&!l.get("verification").equals(criteria.get("verification"))));assertTrue(logs.stream().anyMatch(l->!l.get("event").equals(criteria.get("event"))&&l.get("verification").equals(criteria.get("verification"))));
            if(!log.solution.getAsJsonArray().contains(new JsonPrimitive("l0")))logWithoutFirst=true;
            var ports=factory.earning(ChallengeType.PORT_DETECTION,0);@SuppressWarnings("unchecked") var rule=(Map<String,String>)ports.data.get("criteria");portRules.add(rule.get("service"));@SuppressWarnings("unchecked") var entries=(List<Map<String,Object>>)ports.data.get("ports");
            assertEquals(1,entries.stream().filter(p->p.get("service").equals(rule.get("service"))&&p.get("state").equals(rule.get("state"))).count());
            assertTrue(entries.stream().anyMatch(p->p.get("service").equals(rule.get("service"))&&!p.get("state").equals(rule.get("state"))));
            var purge=factory.recovery(RecoveryType.DATA_PURGE,0);if(!purge.solution.getAsJsonArray().contains(new JsonPrimitive("f0")))purgeWithoutFirst=true;
        }assertEquals(3,logRules.size());assertEquals(3,portRules.size());assertTrue(logWithoutFirst);assertTrue(purgeWithoutFirst);
    }
    static int routes(String current,String goal,List<List<String>> edges,Set<String> seen){if(current.equals(goal))return 1;if(!seen.add(current))return 0;int n=0;for(var edge:edges)if(edge.getFirst().equals(current))n+=routes(edge.getLast(),goal,edges,new HashSet<>(seen));return n;}
}
