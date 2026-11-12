package com.finalanswer.server.game.systembreach;

import com.erni.finalanswer.gameplay.systembreach.*;
import com.google.gson.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import static com.erni.finalanswer.gameplay.systembreach.SystemBreachConfig.Parameter.*;
import static com.finalanswer.server.game.systembreach.SystemBreachSessionTest.*;
import static org.junit.jupiter.api.Assertions.*;

class SystemBreachReliabilityTest {
    @Test void overdueAttackPenaltyIsAppliedBeforeFinalScoreOnAStalledServer(){
        var cfg=new SystemBreachConfig().with(INITIAL_AP,200).with(GAME_MS,30000);F coarse=new F(cfg),fine=new F(cfg);coarse.active();fine.active();coarse.attack();fine.attack();
        coarse.advance(30000);for(int i=0;i<300;i++)fine.advance(100);
        assertEquals(180,coarse.p("a").ap());assertEquals(fine.p("a").ap(),coarse.p("a").ap());assertEquals(fine.s.outcome(Map.of()).rankings(),coarse.s.outcome(Map.of()).rankings());
    }
    @Test void recoveryTimeoutPenaltyIsNotLostWhenTickCrossesRoundEnd(){var cfg=new SystemBreachConfig().with(INITIAL_AP,200).with(GAME_MS,30000);var f=new F(cfg);f.active();f.breach();f.advance(30000);assertEquals(175,f.p("b").ap());assertEquals(175,f.s.outcome(Map.of()).rankings().stream().filter(r->r.playerId().equals("b")).findFirst().orElseThrow().accessPoints());}
    @Test void delayedAndFrequentTicksProduceTheSameEmergencyRecoveryAndEventTimeline(){
        var cfg=new SystemBreachConfig().with(INITIAL_AP,200).with(GAME_MS,90000);F coarse=new F(cfg),fine=new F(cfg);coarse.active();fine.active();coarse.breach();fine.breach();coarse.advance(90000);for(int i=0;i<900;i++)fine.advance(100);
        assertEquals(fine.s.outcome(Map.of()).rankings(),coarse.s.outcome(Map.of()).rankings());assertEquals(fine.s.eventsAfter(0),coarse.s.eventsAfter(0));
        long previous=0;for(var event:coarse.s.eventsAfter(0)){assertTrue(event.at()>=previous);previous=event.at();}
    }
    @Test void coolingCompletionHasAnExactFrameIndependentTimestamp(){
        var cfg=new SystemBreachConfig();var factory=new ChallengeFactory(new Random(5),cfg,1);BreachChallenge a=factory.recovery(RecoveryType.COOLING_SYSTEM,10000),b=factory.recovery(RecoveryType.COOLING_SYSTEM,10000);
        var control=JsonParser.parseString("{\"level\":3}");a.validate(control,10000);b.validate(control,10000);for(long t=10000;t<=15000;t+=17)a.advance(t);
        assertEquals(a.completedAt(15000),b.completedAt(15000));assertEquals(12026,b.completedAt(15000));
    }
    @Test void coolingSuccessIsNotLostIfTheComputerHeatsAgainBetweenTicks(){
        var c=new ChallengeFactory(new Random(2),new SystemBreachConfig(),1).recovery(RecoveryType.COOLING_SYSTEM,10000);
        c.validate(JsonParser.parseString("{\"level\":3}"),10000);c.advance(11500);c.validate(JsonParser.parseString("{\"level\":0}"),11500);
        assertEquals(12026,c.completedAt(25000));
    }
    @Test void reusedRequestIdWithDifferentBodyOrActionIsRejectedWithoutSpending(){var f=new F();f.active();f.named("a","same","FIREWALL_UPGRADE",Map.of());int balance=f.p("a").ap();failure("REQUEST_CONFLICT",()->f.named("a","same","SPECIAL_ATTACK",Map.of("type","TROJAN","targetId","b")));failure("REQUEST_CONFLICT",()->f.named("a","same","FIREWALL_UPGRADE",Map.of("accessPoints",99999)));assertEquals(balance,f.p("a").ap());}
    @Test void serverReceiptsReconcileLostRepliesWithoutLeakingSubmittedPasswords(){
        var f=new F();f.active();f.breach();var view=new Gson().toJsonTree(f.view("a")).getAsJsonObject();var receipt=view.getAsJsonObject("self").getAsJsonObject("lastAction");
        assertEquals("ATTACK_SUBMIT",receipt.get("action").getAsString());assertEquals("SUCCESS",receipt.get("status").getAsString());assertEquals(185,receipt.getAsJsonObject("details").get("balanceBefore").getAsInt());assertEquals(205,receipt.getAsJsonObject("details").get("balanceAfter").getAsInt());assertEquals(20,receipt.getAsJsonObject("details").get("apDelta").getAsInt());assertFalse(receipt.has("payload"));assertFalse(receipt.has("password"));assertFalse(new Gson().toJson(f.view("host")).contains("lastAction"));
    }
    @Test void availabilityQuotesMatchAuthoritativeCostsAndReasons(){var f=new F();f.active();f.act("b","FIREWALL_UPGRADE",Map.of());var self=new Gson().toJsonTree(f.view("a")).getAsJsonObject().getAsJsonObject("self");var target=self.getAsJsonObject("actions").getAsJsonArray("targets").get(0).getAsJsonObject();assertEquals(20,target.getAsJsonObject("attack").get("cost").getAsInt());assertTrue(target.getAsJsonObject("attack").get("allowed").getAsBoolean());int before=f.p("a").ap();f.attack();assertEquals(before-20,f.p("a").ap());f.online.remove("b");f.s.tick(f.now,f.online);self=new Gson().toJsonTree(f.view("a")).getAsJsonObject().getAsJsonObject("self");assertEquals("SB_ATTACK_COOLDOWN",self.getAsJsonObject("actions").getAsJsonArray("targets").get(0).getAsJsonObject().getAsJsonObject("attack").get("reason").getAsString());}
    @Test void zeroBalanceAndRecoveryHaveExplicitUnavailableReasons(){var f=new F(new SystemBreachConfig());f.active();var actions=new Gson().toJsonTree(f.view("a")).getAsJsonObject().getAsJsonObject("self").getAsJsonObject("actions");assertEquals("SB_INSUFFICIENT_AP",actions.getAsJsonObject("firewall").get("reason").getAsString());assertTrue(actions.getAsJsonObject("challenge").get("allowed").getAsBoolean());var funded=new F();funded.active();funded.breach();actions=new Gson().toJsonTree(funded.view("b")).getAsJsonObject().getAsJsonObject("self").getAsJsonObject("actions");assertEquals("SB_RECOVERY_REQUIRED",actions.getAsJsonObject("challenge").get("reason").getAsString());assertTrue(actions.getAsJsonObject("recovery").get("allowed").getAsBoolean());}
    @Test void eventCursorsDescribeTheBoundedEventHistory(){var f=new F(new SystemBreachConfig().with(INITIAL_AP,10000).with(TRACE_COST,1).with(SPECIAL_COOLDOWN_MS,1).with(REQUESTS_PER_SECOND,20));f.active();for(int i=0;i<40;i++){f.advance(70);f.act("a","SPECIAL_ATTACK",Map.of("type","TRACE_ATTACK","targetId","b"));}var view=f.view("host");assertEquals(1,view.get("schemaVersion"));assertEquals(40L,view.get("lastEventSequence"));assertEquals(9L,view.get("firstEventSequence"));assertEquals(32,f.s.eventsAfter(0).size());}
    @Test void requestFingerprintsIgnoreObjectKeyOrderButRejectDifferentValues(){
        var f=new F();f.active();Map<String,Object> first=new LinkedHashMap<>();first.put("targetId","b");first.put("type","TRACE_ATTACK");
        var result=f.named("a","digest","SPECIAL_ATTACK",first);Map<String,Object> reordered=new LinkedHashMap<>();reordered.put("type","TRACE_ATTACK");reordered.put("targetId","b");
        assertEquals(result,f.named("a","digest","SPECIAL_ATTACK",reordered));reordered.put("type","TROJAN");failure("REQUEST_CONFLICT",()->f.named("a","digest","SPECIAL_ATTACK",reordered));
    }

}
