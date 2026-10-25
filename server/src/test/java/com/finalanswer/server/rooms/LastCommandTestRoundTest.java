package com.finalanswer.server.rooms;
import com.google.gson.JsonObject;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
class LastCommandTestRoundTest {
    long now=1_000_000;int serial;
    JsonObject command(LastCommandSession s,String element,String action,String value){JsonObject d=new JsonObject();d.addProperty("roomCode","TEST");d.addProperty("sessionId",s.id);d.addProperty("element",element);d.addProperty("action",action);d.addProperty("value",value);return d;}
    void act(LastCommandSession s,String element,String action,String value){s.action("host",true,"r"+(++serial),command(s,element,action,value),now);}
    @Test void deterministicAndDistinctRounds(){var a=new LastCommandTestRound(42,0,"mechanisms",now);var b=new LastCommandTestRound(42,0,"mechanisms",now);assertEquals(a.code,b.code);assertEquals(a.signals,b.signals);assertNotEquals(a.code,new LastCommandTestRound(42,1,"mechanisms",now).code);}
    @Test void fullMechanicsWinAndRestart(){var s=new LastCommandSession(42);act(s,"CODE_PANEL","TEST_ROUND","mechanisms");var t=new LastCommandTestRound(42,0,"mechanisms",now);act(s,"LEVER_MODULE","SET",t.lever);act(s,"ADJUSTER","SET",""+t.angle);act(s,"HIDDEN_HATCH","SET","OPEN");assertEquals(t.code,s.snapshot(now).get("hint"));act(s,"CODE_PANEL","SET",t.code);act(s,"BIG_BUTTON","PRESS","");act(s,"BIG_BUTTON","RELEASE","");act(s,"ANIMAL_PANEL","SELECT",t.animal);act(s,"SYMBOL_PANEL","SELECT",t.symbol);act(s,"LIGHT_MODULE","SET",t.light);act(s,"SMALL_BUTTON_"+t.button,"PRESS","");act(s,"SMALL_BUTTON_"+t.button,"RELEASE","");act(s,"BIG_BUTTON","PRESS","");assertEquals("WON",((Map<?,?>)s.snapshot(now).get("testRound")).get("status"));act(s,"CODE_PANEL","TEST_ROUND","memory");assertEquals("0000",s.snapshot(now).get("code"));assertEquals(List.of(),s.snapshot(now).get("held"));}
    @Test void incorrectAttemptsAndDeadlineLose(){var r=new LastCommandTestRound(4,0,"mechanisms",now);r.step=3;for(int i=0;i<3;i++)r.action("BIG_BUTTON","PRESS","",Map.of("code","xxxx"),now);assertEquals("LOST",r.status);var t=new LastCommandTestRound(4,0,"memory",now);assertTrue(t.timeout(t.deadline));assertFalse(t.timeout(t.deadline+1));}
    @Test void memoryRejectsEarlyThenAcceptsSequence(){var r=new LastCommandTestRound(9,0,"memory",now);r.action(r.signals.get(0),"PRESS","",Map.of(),now);assertEquals(0,r.step);for(String signal:r.signals)r.action(signal,"PRESS","",Map.of(),r.inputAt+1);assertEquals("WON",r.status);}
    @Test void permissionsAndDedupRemain(){var s=new LastCommandSession(3);assertThrows(RoomService.Failure.class,()->s.action("guest",false,"r1",command(s,"CODE_PANEL","TEST_ROUND","memory"),now));var d=command(s,"CODE_PANEL","STEP","0:+1");assertTrue(s.action("guest",false,"same",d,now));assertFalse(s.action("guest",false,"same",d,now));assertEquals("1000",s.snapshot(now).get("code"));assertThrows(RoomService.Failure.class,()->act(s,"ANIMAL_PANEL","SELECT","DRAGON"));}
}
