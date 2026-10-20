package com.erni.finalanswer.lobby;

import com.erni.finalanswer.ui.lobby.cages.*;
import com.google.gson.JsonParser;
import com.badlogic.gdx.utils.Json;
import java.nio.file.*;
import java.util.*;

public final class VoodooCheck {
    static void check(boolean ok,String why){if(!ok)throw new AssertionError(why);}
    static void near(float a,float b,float tolerance){check(Math.abs(a-b)<tolerance,"Expected "+a+", got "+b);}
    static void advance(VoodooAnimationController a,float seconds,int fps){for(int i=0;i<Math.round(seconds*fps);i++)a.update(1f/fps,.7f,false);}
    static void same(VoodooAnimationController a,VoodooAnimationController b,float tolerance){
        near(a.pose.bodyAngle,b.pose.bodyAngle,tolerance);near(a.pose.headAngle,b.pose.headAngle,tolerance);
        near(a.pose.leftArm,b.pose.leftArm,tolerance);near(a.pose.bodySX,b.pose.bodySX,tolerance);
        near(a.pose.heartScale,b.pose.heartScale,tolerance);near(a.pose.rootScale,b.pose.rootScale,tolerance);
    }
    public static void main(String[] args)throws Exception {
        VoodooConfig c=VoodooConfig.parse(Files.readString(Path.of(args[0])));
        check(c.embeddedHeart,"No duplicate heart overlay");check(c.parts.size==17,"Complete configured hierarchy");
        VoodooConfig.parse(new Json().toJson(c));
        var a=new VoodooAnimationController(c,42);var b=new VoodooAnimationController(c,42);
        check(a.state()==VoodooAnimationController.State.SELECTED,"Selection on new occupant");
        float head=a.pose.headAngle;a.update(.25f,0,false);near(head,a.pose.headAngle,.00001f);
        a=new VoodooAnimationController(c,42);
        advance(a,120,60);advance(b,120,30);same(a,b,.02f);check(a.gestureCount()==b.gestureCount(),"Same seed/event sampling at different frame rates");
        check(a.state()==VoodooAnimationController.State.IDLE&&a.gestureCount()>8,"Idle continues with periodic gestures");
        for(var state:VoodooAnimationController.State.values()) {
            a=new VoodooAnimationController(c,7);advance(a,3,60);a.play(state,19);float previous=a.pose.headAngle;
            a.update(0,.7f,false);near(previous,a.pose.headAngle,.0001f);
            advance(a,6,60);
            if(state==VoodooAnimationController.State.DEATH||state==VoodooAnimationController.State.ELIMINATION) {
                check(a.state()==state&&a.finished(),"Terminal state holds");
                float x=a.pose.bodyAngle,y=a.pose.headAngle;advance(a,2,60);near(x,a.pose.bodyAngle,.00001f);near(y,a.pose.headAngle,.00001f);
                if(state==VoodooAnimationController.State.ELIMINATION)near(0,a.pose.alpha,.00001f);
                check(!a.play(VoodooAnimationController.State.VICTORY,5),"Results cannot revive a terminal doll");
            }else check(a.state()==VoodooAnimationController.State.IDLE,"Transient returns to idle");
        }
        a=new VoodooAnimationController(c,1);a.play(VoodooAnimationController.State.DEATH,77);b=new VoodooAnimationController(c,2);b.play(VoodooAnimationController.State.DEATH,77);
        Set<Float> releases=new HashSet<>();for(int i=0;i<4;i++){near(a.needleReleaseAt(i),b.needleReleaseAt(i),.00001f);releases.add(a.needleReleaseAt(i));}check(releases.size()==4,"Seeded sequential needle detachments");
        for(var state:new VoodooAnimationController.State[]{VoodooAnimationController.State.SELECTED,VoodooAnimationController.State.VICTORY,VoodooAnimationController.State.DEFEAT}){
            a=new VoodooAnimationController(c,3);a.play(state,4);a.update(.9f,.7f,false);head=a.pose.headAngle;a.play(VoodooAnimationController.State.DEATH,5);a.update(0,.7f,false);near(head,a.pose.headAngle,.0001f);
        }
        a=new VoodooAnimationController(c,42);float time=a.stateTime();a.update(Float.NaN,0,false);a.update(-1,0,false);near(time,a.stateTime(),.00001f);
        var events=new VoodooRoomEvents();var received=new ArrayList<String>();
        VoodooRoomEvents.Sink sink=(id,state,seq,seed,age)->received.add(id+":"+state+":"+age);
        events.accept(JsonParser.parseString("{\"phase\":\"RESULTS\",\"gameId\":\"g\",\"phaseStartedAt\":1000,\"question\":{\"id\":\"q\"},\"results\":[{\"playerId\":\"a\",\"isCorrect\":true},{\"playerId\":\"b\",\"isCorrect\":false}]}").getAsJsonObject(),1500,sink);
        check(received.equals(List.of("a:VICTORY:0.5","b:DEFEAT:0.5")),"Real quiz results map correctly");received.clear();
        events.accept(JsonParser.parseString("{\"impostor\":{\"result\":{\"matchId\":\"m\",\"completedAt\":1000,\"participants\":[{\"playerId\":\"a\",\"winner\":false}]}}}").getAsJsonObject(),1500,sink);
        check(received.equals(List.of("a:DEFEAT:0.5")),"Real Impostor winner field maps to defeat, not death");received.clear();
        events.accept(JsonParser.parseString("{\"players\":[{\"id\":\"a\",\"isAlive\":true}]}").getAsJsonObject(),0,sink);
        events.accept(JsonParser.parseString("{\"players\":[{\"id\":\"a\",\"isAlive\":false}]}").getAsJsonObject(),0,sink);
        check(received.size()==1&&received.get(0).contains("DEATH"),"Only authoritative alive=false signals death");received.clear();
        events.accept(JsonParser.parseString("{\"players\":[]}").getAsJsonObject(),0,sink);check(received.isEmpty(),"Leaving does not invent elimination");
        System.out.println("PASS: Voodoo configuration, six states, transition continuity, terminal persistence, deterministic timing/needles and existing result mapping");
    }
}
