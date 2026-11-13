package com.finalanswer.server.game.systembreach;

import com.erni.finalanswer.gameplay.systembreach.*;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.erni.finalanswer.gameplay.systembreach.SystemBreachConfig.Parameter.*;

class SystemBreachSabotageTest {
    static final class F {
        long now=100000;int request;final SystemBreachConfig cfg=new SystemBreachConfig().with(INITIAL_AP,200);final SystemBreachSession s;final Set<String> online;final List<String> ids;
        F(int seed,String... ids){this.ids=List.of(ids.length==0?new String[]{"a","b"}:ids);online=new HashSet<>(this.ids);s=new SystemBreachSession(this.ids,now,cfg,new Random(seed),2);s.partyMode();
            for(String id:this.ids)act(id,"PASSWORD_SELECT",Map.of("password",p(id).passwordOptions.getFirst()));}
        F(){this(42);}
        SystemBreachSession.ActionResult act(String who,String action,Map<String,?> fields){return named(who,"r"+(++request),action,fields);}
        SystemBreachSession.ActionResult named(String who,String id,String action,Map<String,?> fields){return s.act(who,id,action,new Gson().toJsonTree(fields).getAsJsonObject(),now,online);}
        @SuppressWarnings("unchecked") SystemBreachPlayerState p(String id){try{Field f=SystemBreachSession.class.getDeclaredField("players");f.setAccessible(true);return ((Map<String,SystemBreachPlayerState>)f.get(s)).get(id);}catch(Exception e){throw new AssertionError(e);}}
        void advance(long ms){now+=ms;s.tick(now,online);}
        SystemBreachSession.ActionResult sabotage(String from,String to){return act(from,"SABOTAGE",Map.of("targetId",to));}
        BreachChallenge question(String id){advance(cfg.get(CHALLENGE_GAP_MS));act(id,"CHALLENGE_REQUEST",Map.of("type","QUICK_QUESTION"));return p(id).challenge;}
        SystemBreachSession.ActionResult answer(String id,boolean right){var c=question(id);return act(id,"CHALLENGE_SUBMIT",Map.of("challengeId",c.id,"answer",right?c.solution.getAsString():"definitely wrong"));}
        /** A guaranteed infection of the given type, for effect-specific tests. */
        Sabotage.Infection plant(String target,Sabotage.Type type){var v=new Sabotage.Infection(type,"a",now,new Random(7));p(target).sabotage=v;return v;}
        Map<String,Object> view(String id){return s.snapshot(id,id.equals("host"),now,online,Map.of());}
    }
    static void failure(String code,Runnable call){assertEquals("SB_"+code,assertThrows(BreachFailure.class,call::run).getMessage());}
    static JsonArray json(List<String> values){var a=new JsonArray();values.forEach(a::add);return a;}

    @Test void threeCorrectAnswersEarnTheSabotageKey(){
        var f=new F();failure("NEED_KEY",()->f.sabotage("a","b"));
        f.answer("a",true);f.answer("a",false);f.answer("a",true);assertEquals(0,f.p("a").keys);f.answer("a",true);assertEquals(1,f.p("a").keys);
        @SuppressWarnings("unchecked") var targets=(List<Map<String,Object>>)((Map<String,Object>)((Map<String,Object>)f.view("a").get("self")).get("actions")).get("targets");
        assertEquals(true,((Map<?,?>)targets.getFirst().get("sabotage")).get("allowed"));
        assertEquals("INFECTED",f.sabotage("a","b").status());assertEquals(0,f.p("a").keys);assertNotNull(f.p("b").sabotage);
    }
    @Test void invalidTargetsAreRejectedWithoutSpendingTheKey(){
        var f=new F(1,"a","b","c");f.p("a").keys=1;
        failure("SELF_ATTACK",()->f.sabotage("a","a"));
        failure("NOT_A_PLAYER",()->f.sabotage("a","zz"));
        f.online.remove("b");failure("TARGET_DISCONNECTED",()->f.sabotage("a","b"));f.online.add("b");
        f.p("c").compromised=true;failure("TARGET_PROTECTED",()->f.sabotage("a","c"));
        assertEquals(1,f.p("a").keys);
    }
    @Test void firewallDecidesWhetherTheVirusGetsThrough(){
        int blocked=0,infected=0;
        for(int seed=0;seed<200;seed++){var f=new F(seed);f.p("b").firewall=3;f.p("a").keys=1;var r=f.sabotage("a","b");assertEquals(0,f.p("a").keys,"a blocked attempt still spends the key");
            if(r.status().equals("BLOCKED")){blocked++;assertNull(f.p("b").sabotage);}else{infected++;assertNotNull(f.p("b").sabotage);}}
        assertTrue(blocked>60&&infected>60,"firewall 3 stops roughly half: "+blocked+"/"+infected);
        for(int seed=0;seed<50;seed++){var f=new F(seed);f.p("a").keys=1;assertEquals("INFECTED",f.sabotage("a","b").status(),"firewall 1 never blocks");}
        var f=new F();f.p("b").firewall=3;f.p("b").effect=SpecialAttackType.FIREWALL_BREAKER;f.p("b").effectUntil=f.now+10000;f.p("a").keys=1;assertEquals("INFECTED",f.sabotage("a","b").status(),"a broken firewall counts as level 1");
    }
    @Test void onlyOneInfectionAndTheSecondAttackerKeepsTheirKey(){
        var f=new F(3,"a","b","c");f.p("a").keys=1;f.p("c").keys=1;f.sabotage("a","b");var first=f.p("b").sabotage;
        failure("TARGET_INFECTED",()->f.sabotage("c","b"));assertEquals(1,f.p("c").keys);assertSame(first,f.p("b").sabotage);
    }
    @Test void infectionIsVisibleOnlyToTheTargetAndAsATypeToTheHost(){
        var f=new F();f.p("a").keys=1;f.sabotage("a","b");var v=f.p("b").sabotage;
        @SuppressWarnings("unchecked") var mine=(Map<String,Object>)((Map<String,Object>)f.view("b").get("self")).get("sabotage");assertEquals(v.id,mine.get("infectionId"));assertEquals(3,mine.get("questionsLeft"));
        @SuppressWarnings("unchecked") var theirs=(Map<String,Object>)((Map<String,Object>)f.view("a").get("self")).get("sabotage");assertTrue(theirs.isEmpty());
        assertEquals(Map.of("b",v.type.name()),f.view("host").get("sabotage"));
        assertTrue(f.s.eventsAfter(0).stream().anyMatch(e->e.type().equals("SABOTAGE_STARTED")&&e.attackerId().equals("a")&&e.targetId().equals("b")));
    }
    @Test void expiresAfterThreeQuestionsAnsweredOrTimedOut(){
        var f=new F();var v=f.plant("b",Sabotage.Type.SHUFFLE_ATTACK);
        f.answer("b",true);f.answer("b",false);assertSame(v,f.p("b").sabotage,"question changes keep the infection and its id");assertEquals(1,v.questionsLeft);
        f.question("b");f.advance(f.cfg.get(CHALLENGE_MS));assertNull(f.p("b").sabotage);
        assertTrue(f.s.eventsAfter(0).stream().anyMatch(e->e.type().equals("SABOTAGE_EXPIRED")));
    }
    @Test void everyVirusHasASolvableRemovalAndRejectsWrongInput(){
        for(var type:Sabotage.Type.values())for(int seed=0;seed<30;seed++){
            var v=new Sabotage.Infection(type,"a",0,new Random(seed));assertTrue(v.solves(json(v.solution)),type.name());
            var reversed=new ArrayList<>(v.solution);Collections.reverse(reversed);if(!reversed.equals(v.solution))assertEquals(!type.ordered(),v.solves(json(reversed)),type+" order rule");
            assertFalse(v.solves(json(v.solution.subList(1,v.solution.size()))));assertFalse(v.solves(JsonParser.parseString("\"x\"")));assertFalse(v.solves(null));
        }
        var f=new F();var v=f.plant("b",Sabotage.Type.LOCKED_ANSWERS);var wrong=new ArrayList<>(v.solution);Collections.swap(wrong,0,1);
        assertEquals("WRONG",f.act("b","SABOTAGE_CLEAR",Map.of("infectionId",v.id,"answer",wrong)).status());assertSame(v,f.p("b").sabotage);
        failure("STALE_SABOTAGE",()->f.act("b","SABOTAGE_CLEAR",Map.of("infectionId","old","answer",v.solution)));
        assertEquals("CLEARED",f.act("b","SABOTAGE_CLEAR",Map.of("infectionId",v.id,"answer",v.solution)).status());assertNull(f.p("b").sabotage);
        failure("STALE_SABOTAGE",()->f.act("b","SABOTAGE_CLEAR",Map.of("infectionId",v.id,"answer",v.solution)));
    }
    @Test void generatedPuzzlesMatchTheConfiguredCounts(){
        var r=new Random(5);
        assertEquals(Sabotage.Config.NUMBER_HUNT_COUNT,new Sabotage.Infection(Sabotage.Type.NUMBER_HUNT,"a",0,r).solution.size());
        assertEquals(Sabotage.Config.POPUP_COUNT,((List<?>)new Sabotage.Infection(Sabotage.Type.POPUP_STORM,"a",0,r).data.get("windows")).size());
        assertEquals(Sabotage.Config.GHOST_VIRUS_SYMBOL_COUNT,new Sabotage.Infection(Sabotage.Type.GHOST_BUTTONS,"a",0,r).solution.size());
        assertEquals(Sabotage.Config.SCREEN_GLITCH_CONTROL_COUNT,new Sabotage.Infection(Sabotage.Type.SCREEN_GLITCH,"a",0,r).solution.size());
        assertEquals(Sabotage.Config.MAGNETIC_INDICATOR_COUNT,new Sabotage.Infection(Sabotage.Type.MAGNETIC_BUTTONS,"a",0,r).solution.size());
        for(int i=0;i<50;i++){var lock=new Sabotage.Infection(Sabotage.Type.LOCKED_ANSWERS,"a",0,r);@SuppressWarnings("unchecked") var shown=(List<Integer>)lock.data.get("numbers");
            assertEquals(Sabotage.Config.LOCKED_ANSWERS_NUMBER_COUNT,new HashSet<>(shown).size());assertNotEquals(shown.stream().sorted().toList(),shown,"never already in order");}
    }
    @Test void lockedAnswersRefuseSubmissionUntilUnlocked(){
        var f=new F();var v=f.plant("b",Sabotage.Type.LOCKED_ANSWERS);var c=f.question("b");int ap=f.p("b").ap();
        failure("ANSWERS_LOCKED",()->f.act("b","CHALLENGE_SUBMIT",Map.of("challengeId",c.id,"answer",c.solution.getAsString())));
        assertSame(c,f.p("b").challenge,"the question is untouched");assertEquals(ap,f.p("b").ap());
        f.act("b","SABOTAGE_CLEAR",Map.of("infectionId",v.id,"answer",v.solution));
        assertEquals("SUCCESS",f.act("b","CHALLENGE_SUBMIT",Map.of("challengeId",c.id,"answer",c.solution.getAsString())).status());
    }
    @Test void scoringAndMultipliersAreUnchangedWhileInfected(){
        var clean=new F(9);var sick=new F(9);sick.plant("b",Sabotage.Type.POPUP_STORM);clean.p("b").multiplier=sick.p("b").multiplier=3;
        int a=clean.p("b").ap(),b=sick.p("b").ap();clean.answer("b",true);sick.answer("b",true);
        assertEquals(clean.p("b").ap()-a,sick.p("b").ap()-b);assertEquals(clean.p("b").keyProgress,sick.p("b").keyProgress);
        var c=sick.question("b");sick.act("b","CHALLENGE_SUBMIT",Map.of("challengeId",c.id,"answer",c.solution.getAsString()));
        failure("STALE_CHALLENGE",()->sick.act("b","CHALLENGE_SUBMIT",Map.of("challengeId",c.id,"answer",c.solution.getAsString())));
    }
    @Test void disconnectAndReconnectKeepTheInfection(){
        var f=new F();f.p("a").keys=1;f.sabotage("a","b");var v=f.p("b").sabotage;f.online.remove("b");f.advance(5000);assertSame(v,f.p("b").sabotage);
        failure("DISCONNECTED",()->f.act("b","SABOTAGE_CLEAR",Map.of("infectionId",v.id,"answer",v.solution)));
        f.online.add("b");assertTrue(new Gson().toJson(f.view("b")).contains(v.id));
    }
    @Test void duplicateMessagesSpendOnce(){
        var f=new F();f.p("a").keys=2;var first=f.named("a","same","SABOTAGE",Map.of("targetId","b"));assertEquals(first,f.named("a","same","SABOTAGE",Map.of("targetId","b")));assertEquals(1,f.p("a").keys);
        var v=f.p("b").sabotage;var clear=Map.of("infectionId",v.id,"answer",v.solution);f.named("b","c1","SABOTAGE_CLEAR",clear);assertEquals("CLEARED",f.named("b","c1","SABOTAGE_CLEAR",clear).status());
    }
    @Test void simultaneousSabotageInfectsExactlyOnce()throws Exception{
        var f=new F(4,"a","b","c","d");for(String id:List.of("a","c","d"))f.p(id).keys=1;var pool=Executors.newFixedThreadPool(3);
        try{var jobs=new ArrayList<Callable<Boolean>>();for(String id:List.of("a","c","d"))jobs.add(()->{try{return f.named(id,"s-"+id,"SABOTAGE",Map.of("targetId","b")).status().equals("INFECTED");}catch(BreachFailure e){assertEquals("SB_TARGET_INFECTED",e.getMessage());return false;}});
            int wins=0;for(var r:pool.invokeAll(jobs))if(r.get())wins++;assertEquals(1,wins);
            assertEquals(2,List.of("a","c","d").stream().mapToInt(id->f.p(id).keys).sum(),"only the winner spent a key");}
        finally{pool.shutdownNow();}
    }
    @Test void matchEndAndShutdownClearInfections(){
        var f=new F();f.plant("b",Sabotage.Type.SCREEN_GLITCH);f.advance(f.cfg.get(GAME_MS));assertNull(f.p("b").sabotage);
        var g=new F();g.plant("b",Sabotage.Type.MAGNETIC_BUTTONS);g.s.close();assertNull(g.p("b").sabotage);assertFalse(g.view("b").containsKey("self"));
    }
    @Test void hackOptionsAreCompletelyDifferentPasswords(){
        for(int seed=0;seed<40;seed++){var f=new F(seed);f.p("a").keys=1;f.act("a","ATTACK_REQUEST",Map.of("targetId","b"));var o=f.p("a").attack.options;
            assertEquals(4,o.size());assertTrue(o.contains(f.p("b").password));
            for(int i=0;i<o.size();i++)for(int j=i+1;j<o.size();j++)assertTrue(SystemBreachSession.unlike(o.get(i),o.get(j)),o.get(i)+" vs "+o.get(j));}
    }
    @Test void unchosenPasswordIsPickedAndShownOnlyToItsOwner(){
        var cfg=new SystemBreachConfig();var s=new SystemBreachSession(List.of("a","b"),0,cfg,new Random(3),2);s.partyMode();
        @SuppressWarnings("unchecked") var opts=(List<String>)((Map<String,Object>)s.snapshot("a",false,0,Set.of("a","b"),Map.of()).get("self")).get("passwordOptions");
        s.act("a","r1","PASSWORD_SELECT",new Gson().toJsonTree(Map.of("password",opts.getFirst())).getAsJsonObject(),0,Set.of("a","b"));
        s.tick(cfg.get(INITIALIZATION_MS),Set.of("a","b"));assertEquals(SystemBreachPhase.ACTIVE,s.phase());
        @SuppressWarnings("unchecked") var b=(Map<String,Object>)s.snapshot("b",false,cfg.get(INITIALIZATION_MS),Set.of("a","b"),Map.of()).get("self");
        @SuppressWarnings("unchecked") var a=(Map<String,Object>)s.snapshot("a",false,cfg.get(INITIALIZATION_MS),Set.of("a","b"),Map.of()).get("self");
        assertEquals(true,b.get("passwordAuto"));assertEquals(8,((String)b.get("myPassword")).length());assertEquals(false,a.get("passwordAuto"));assertEquals(opts.getFirst(),a.get("myPassword"));
        assertFalse(new Gson().toJson(s.snapshot("a",false,cfg.get(INITIALIZATION_MS),Set.of("a","b"),Map.of())).contains((String)b.get("myPassword")),"never leaked to others");
    }
}
