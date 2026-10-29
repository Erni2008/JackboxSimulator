package com.finalanswer.server.rooms;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
class LastCommandGameTest {
    long now=1_000_000;
    void settle(LastCommandGame g){now+=6000;g.tick(now);now+=1000;}
    void solve(LastCommandGame g,String actor){now=Math.max(now,g.readyAt+1);String type=g.task.type();Object answer=g.task.solution();var p=new HashMap<String,Object>();
        switch(type){
            case "REMEMBER"->{now=g.inputAt;g.tick(now);return;}
            case "ENTER_CODE"->p.put("code",answer);
            case "ANIMAL","SYMBOL","COLOR","LEVER","ADJUSTER"->p.put(switch(type){case "COLOR"->"light";case "LEVER"->"lever";case "ADJUSTER"->"adjuster";default->type.toLowerCase(Locale.ROOT);},answer);
            case "HATCH"->{g.action(actor,"HIDDEN_HATCH","SET","OPEN",p,now);return;}
            case "BUTTON"->{g.action(actor,answer.toString(),"PRESS","",p,now);return;}
            case "LIGHT_SEQUENCE"->{now=Math.max(now,g.inputAt);for(String signal:g.signals)g.action(actor,signal,"PRESS","",p,now);return;}
        }
        g.action(actor,"BIG_BUTTON","PRESS","",p,now);
    }
    @Test void completeTwentyAndFrozenResult(){var g=new LastCommandGame(42,now);assertEquals("READY",g.status);g.start(now);for(int i=0;i<80&&!g.status.equals("WON");i++){solve(g,"alice");settle(g);}assertEquals("WON",g.status);assertEquals(20,g.progress);assertEquals("alice",g.winner);assertEquals(20,g.scores.get("alice"));long duration=(long)g.snapshot(now).get("elapsedMs");assertEquals(duration,g.snapshot(now+60000).get("elapsedMs"));assertFalse(g.accepts("BIG_BUTTON","PRESS",now));}
    @Test void deterministicGenerationAndDelayedRecall(){var a=new LastCommandGame(66,now);var b=new LastCommandGame(66,now);a.start(now);b.start(now);Set<String> types=new HashSet<>();int recalled=0;for(int i=0;i<60;i++){assertEquals(a.task.type(),b.task.type());assertEquals(a.task.solution(),b.task.solution());types.add(a.task.type());if(a.task.instruction().contains("EARLIER"))recalled++;long t=now;solve(a,"a");now=t;solve(b,"a");now+=6000;a.tick(now);b.tick(now);if(a.status.equals("WON"))break;}assertTrue(types.containsAll(List.of("ENTER_CODE","ANIMAL","SYMBOL","LEVER","ADJUSTER","HATCH","BUTTON","COLOR","REMEMBER","LIGHT_SEQUENCE")));assertTrue(recalled>0);}
    @Test void errorsPreserveScoreAndReplaceTask(){var g=new LastCommandGame(3,now);g.start(now);while(!g.task.type().equals("ENTER_CODE")){solve(g,"a");settle(g);}int before=g.progress;String id=g.task.id();now=Math.max(now,g.readyAt+1);String wrong=g.task.solution().equals("0000")?"1111":"0000";g.action("a","BIG_BUTTON","PRESS","",Map.of("code",wrong),now);assertEquals(before,g.progress);assertEquals(1,g.mistakes);assertEquals("WRONG COMMAND",g.feedback);assertFalse(g.accepts("BIG_BUTTON","PRESS",now+100));settle(g);assertNotEquals(id,g.task.id());}
    @Test void hiddenAndEarlyActionsRejectedAndScoresBelongToActors(){var g=new LastCommandGame(12,now);assertFalse(g.accepts("BIG_BUTTON","PRESS",now));g.start(now);assertFalse(g.accepts(g.task.mechanisms().get(0),"PRESS",now));assertFalse(g.accepts("UNKNOWN","PRESS",now+1000));for(int i=0;i<14;i++){solve(g,i%2==0?"a":"b");settle(g);}assertTrue(g.scores.getOrDefault("a",0)>0);assertTrue(g.scores.getOrDefault("b",0)>0);assertEquals(Collections.max(g.scores.values()),g.progress);}
    @Test void hundredsOfSeedsAreSolvableAndCoverAllMemoryKinds(){Set<String> kinds=new HashSet<>();for(int seed=0;seed<120;seed++){var g=new LastCommandGame(seed,now);g.start(now);for(int i=0;i<65&&!g.status.equals("WON");i++){if(g.task.type().equals("REMEMBER"))kinds.add(g.memories.peekLast().kind());solve(g,"operator");settle(g);}assertEquals("WON",g.status,"seed="+seed);}assertEquals(Set.of("NUMBER","ANIMAL","SYMBOL","COLOR","LIGHTS"),kinds);}
    @Test void sequenceIgnoresInputDuringDisplay(){var g=new LastCommandGame(15,now);g.start(now);while(!g.task.type().equals("LIGHT_SEQUENCE")){solve(g,"a");settle(g);}assertFalse(g.accepts(g.signals.get(0),"PRESS",g.readyAt));assertTrue(g.accepts(g.signals.get(0),"PRESS",g.inputAt));}
}
