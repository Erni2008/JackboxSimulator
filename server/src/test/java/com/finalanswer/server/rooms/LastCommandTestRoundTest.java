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
    @Test void fullMechanicsWinAndRestart(){var s=new LastCommandSession(42);act(s,"CODE_PANEL","TEST_ROUND","mechanisms");var t=new LastCommandTestRound(42,0,"mechanisms",now);act(s,"LEVER_MODULE","SET",t.lever);act(s,"BIG_BUTTON","PRESS","");act(s,"BIG_BUTTON","RELEASE","");act(s,"ADJUSTER","SET",""+t.angle);act(s,"BIG_BUTTON","PRESS","");act(s,"BIG_BUTTON","RELEASE","");act(s,"HIDDEN_HATCH","SET","OPEN");assertEquals(t.code,s.snapshot(now).get("hint"));act(s,"CODE_PANEL","SET",t.code);act(s,"BIG_BUTTON","PRESS","");act(s,"BIG_BUTTON","RELEASE","");act(s,"ANIMAL_PANEL","SELECT",t.animal);act(s,"SYMBOL_PANEL","SELECT",t.symbol);act(s,"LIGHT_MODULE","SET",t.light);act(s,"SMALL_BUTTON_"+t.button,"PRESS","");act(s,"SMALL_BUTTON_"+t.button,"RELEASE","");act(s,"BIG_BUTTON","PRESS","");assertEquals("WON",((Map<?,?>)s.snapshot(now).get("testRound")).get("status"));act(s,"CODE_PANEL","TEST_ROUND","memory");assertEquals("0000",s.snapshot(now).get("code"));assertEquals(List.of(),s.snapshot(now).get("held"));}
    @Test void incorrectAttemptsAndDeadlineLose(){var r=new LastCommandTestRound(4,0,"mechanisms",now);r.step=3;for(int i=0;i<3;i++)r.action("BIG_BUTTON","PRESS","",Map.of("code","xxxx"),now);assertEquals("LOST",r.status);var t=new LastCommandTestRound(4,0,"memory",now);assertTrue(t.timeout(t.deadline));assertFalse(t.timeout(t.deadline+1));}
    @Test void memoryRejectsEarlyThenAcceptsSequence(){var r=new LastCommandTestRound(9,0,"memory",now);r.action(r.signals.get(0),"PRESS","",Map.of(),now);assertEquals(0,r.step);for(String signal:r.signals)r.action(signal,"PRESS","",Map.of(),r.inputAt+1);assertEquals("WON",r.status);}
    @Test void permissionsAndDedupRemain(){var s=new LastCommandSession(3);assertThrows(RoomService.Failure.class,()->s.action("guest",false,"r1",command(s,"CODE_PANEL","TEST_ROUND","memory"),now));var d=command(s,"CODE_PANEL","STEP","0:+1");assertTrue(s.action("guest",false,"same",d,now));assertFalse(s.action("guest",false,"same",d,now));assertEquals("1000",s.snapshot(now).get("code"));assertThrows(RoomService.Failure.class,()->act(s,"ANIMAL_PANEL","SELECT","DRAGON"));}
    @Test void inspectionRequiresExplicitConfirmationAndAllStates(){var r=new LastCommandTestRound(51,0,"inspection",now);Map<String,Object> panel=Map.of("lever",r.lever,"adjuster",r.angle,"hatch",true,"code",r.code,"animal",r.animal,"symbol",r.symbol,"light",r.light);r.action("LIGHT_MODULE","SET",r.light,panel,now);assertEquals(7,r.step);assertEquals("PLAYING",r.status);r.action("BIG_BUTTON","PRESS","",panel,now);assertEquals("WON",r.status);assertEquals(7,((List<?>)r.snapshot(now,panel).get("objectives")).size());}
    @Test void replayIsBoundedAndDoesNotExtendDeadline(){var r=new LastCommandTestRound(9,0,"memory",now);long deadline=r.deadline;assertFalse(r.replay(now));assertTrue(r.replay(r.inputAt+1));assertEquals(1,r.replays);assertTrue(r.replay(r.inputAt+1));assertFalse(r.replay(r.inputAt+1));assertEquals(deadline,r.deadline);}
    @Test void resultTimeIsFrozenForWinTimeoutAndMistakes(){
        var win=new LastCommandTestRound(9,0,"memory",now);long ended=win.inputAt+100;
        for(String signal:win.signals)win.action(signal,"PRESS","",Map.of(),ended);
        assertEquals("COMPLETED",win.finishReason);assertEquals(ended,win.finishedAt);assertEquals(ended-now,win.snapshot(ended+50000).get("elapsedMs"));
        var timeout=new LastCommandTestRound(9,0,"memory",now);timeout.timeout(timeout.deadline+500);assertEquals("TIMEOUT",timeout.finishReason);assertEquals(180000L,timeout.snapshot(timeout.deadline+90000).get("elapsedMs"));
        var fail=new LastCommandTestRound(9,0,"inspection",now);for(int i=1;i<=3;i++)fail.action("BIG_BUTTON","PRESS","",Map.of(),now+i*1000);assertEquals("MISTAKES",fail.finishReason);assertEquals(3000L,fail.snapshot(now+9000).get("elapsedMs"));
    }
    @Test void retryKeepsVariantButCreatesNewAttemptAndResetsPanel(){
        var session=new LastCommandSession(42);act(session,"CODE_PANEL","TEST_ROUND","memory");var before=(Map<?,?>)session.snapshot(now).get("testRound");
        act(session,"BIG_BUTTON","PRESS","");now+=1000;act(session,"CODE_PANEL","RETRY_ROUND","");var after=(Map<?,?>)session.snapshot(now).get("testRound");
        assertEquals(before.get("round"),after.get("round"));assertEquals(before.get("signals"),after.get("signals"));assertNotEquals(before.get("attemptId"),after.get("attemptId"));assertEquals(now,after.get("startedAt"));assertEquals(0,after.get("mistakes"));assertEquals(List.of(),session.snapshot(now).get("held"));
        act(session,"CODE_PANEL","TEST_ROUND","memory");assertEquals(1,((Map<?,?>)session.snapshot(now).get("testRound")).get("round"));
    }
    @Test void invalidScenarioDoesNotConsumeVariant(){var session=new LastCommandSession(42);assertThrows(RoomService.Failure.class,()->act(session,"CODE_PANEL","TEST_ROUND","INVALID"));act(session,"CODE_PANEL","TEST_ROUND","memory");assertEquals(0,((Map<?,?>)session.snapshot(now).get("testRound")).get("round"));}
    @Test void retryPermissionsValidationAndDedup(){var session=new LastCommandSession(42);act(session,"CODE_PANEL","TEST_ROUND","memory");JsonObject retry=command(session,"CODE_PANEL","RETRY_ROUND","");assertThrows(RoomService.Failure.class,()->session.action("guest",false,"guestRetry",retry,now));assertThrows(RoomService.Failure.class,()->act(session,"CODE_PANEL","RETRY_ROUND","memory"));assertTrue(session.action("host",true,"sameRetry",retry,now));var attempt=((Map<?,?>)session.snapshot(now).get("testRound")).get("attemptId");assertFalse(session.action("host",true,"sameRetry",retry,now));assertEquals(attempt,((Map<?,?>)session.snapshot(now).get("testRound")).get("attemptId"));}
    @Test void mechanicalSettingsNeverAdvanceWithoutConfirmation(){
        var r=new LastCommandTestRound(42,0,"mechanisms",now);
        for(String value:List.of("UP","MIDDLE","DOWN"))r.action("LEVER_MODULE","SET",value,Map.of("lever",value),now);
        assertEquals(0,r.step);assertEquals(0,r.mistakes);
        r.action("BIG_BUTTON","PRESS","",Map.of("lever","UP"),now);assertEquals(0,r.step);assertEquals(1,r.mistakes);
        r.action("BIG_BUTTON","PRESS","",Map.of("lever",r.lever),now);assertEquals(1,r.step);
        for(int angle:List.of(0,45,90,135))r.action("ADJUSTER","SET",""+angle,Map.of("adjuster",angle),now);
        assertEquals(1,r.step);r.action("BIG_BUTTON","PRESS","",Map.of("adjuster",r.angle),now);assertEquals(2,r.step);
    }
    @Test void diagnosticDialStepsDoNotScoreAndAreDeduplicated(){
        var session=new LastCommandSession(42);act(session,"CODE_PANEL","TEST_ROUND","inspection");
        for(int i=0;i<7;i++)act(session,"ADJUSTER","STEP","+1");assertEquals(135,session.snapshot(now).get("adjuster"));assertEquals("PLAYING",((Map<?,?>)session.snapshot(now).get("testRound")).get("status"));
        var d=command(session,"ADJUSTER","STEP","-1");assertTrue(session.action("host",true,"one-step",d,now));assertFalse(session.action("host",true,"one-step",d,now));assertEquals(90,session.snapshot(now).get("adjuster"));assertThrows(RoomService.Failure.class,()->act(session,"ADJUSTER","STEP","+2"));assertEquals(90,session.snapshot(now).get("adjuster"));
    }
}
