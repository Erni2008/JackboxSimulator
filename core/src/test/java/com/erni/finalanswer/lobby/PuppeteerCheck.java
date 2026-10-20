package com.erni.finalanswer.lobby;

import com.erni.finalanswer.ui.lobby.cages.*;
import com.badlogic.gdx.utils.Json;
import java.nio.file.*;

/** Timing/transition invariants independent of a window or GPU. */
public final class PuppeteerCheck {
    static void check(boolean value,String why){if(!value)throw new AssertionError(why);}
    static void advance(PuppeteerAnimator a,float seconds,int fps){for(int i=0;i<Math.round(seconds*fps);i++)a.update(1f/fps,.7f,false);}
    static void same(PuppeteerAnimator a,PuppeteerAnimator b){check(a.state()==b.state()&&a.behavior()==b.behavior(),"Same schedule at different FPS");for(int i=0;i<a.pose.length;i++)check(Math.abs(a.pose[i]-b.pose[i])<.003f,"FPS-independent channel "+i+": "+a.pose[i]+" / "+b.pose[i]);}
    public static void main(String[] args)throws Exception {
        var c=PuppeteerConfig.parse(Files.readString(Path.of(args[0])));PuppeteerConfig.parse(new Json().toJson(c));
        check(c.parts.size==14,"Complete calibrated rig, no extra hat");for(var p:c.parts)check(!p.name.equals("hat"),"No separate hat");
        var reveal=new PuppeteerAnimator(c,42);check(reveal.appearanceAlpha()==0,"Puppeteer initially invisible");advance(reveal,.5f,60);check(reveal.appearanceAlpha()>0&&reveal.appearanceAlpha()<1,"Visible gradual reveal");advance(reveal,.5f,60);check(reveal.appearanceAlpha()==1,"Reveal finishes before gate closes");
        var a=new PuppeteerAnimator(c,42);check(a.state()==PuppeteerAnimator.State.INTRO,"Fresh occupant intro");advance(a,7,60);check(a.state()==PuppeteerAnimator.State.IDLE,"Intro completes");
        for(int fps:new int[]{30,60,144}){var b=new PuppeteerAnimator(c,42);var reference=new PuppeteerAnimator(c,42);advance(b,90,fps);advance(reference,90,120);same(b,reference);}
        for(var state:PuppeteerAnimator.State.values()){
            a=new PuppeteerAnimator(c,8);advance(a,7,60);float[] before=a.pose.clone();a.play(state);
            for(int i=0;i<before.length;i++)check(before[i]==a.pose[i],"State change preserves current pose");
            a.update(1f/120,.7f,false);for(int i=0;i<before.length;i++)check(Math.abs(before[i]-a.pose[i])<1,"No transition snap");
            advance(a,8,60);check(a.state()==(state==PuppeteerAnimator.State.WALK?state:PuppeteerAnimator.State.IDLE),"State completion: "+state);
        }
        a=new PuppeteerAnimator(c,8);advance(a,7,60);a.play(PuppeteerAnimator.State.SCARE);advance(a,.6f,60);check(a.pose[PuppeteerAnimator.HEAD]>15,"Scare retains its head tilt while eyes focus");
        for(var behavior:PuppeteerAnimator.Behavior.values()){
            a=new PuppeteerAnimator(c,11);advance(a,7,60);check(a.trigger(behavior),"Behavior allowed in idle");advance(a,2,60);check(a.state()!=PuppeteerAnimator.State.SCARE,"Manual-only scare");advance(a,2,60);check(a.behavior()==null,"Behavior returns");
            a.play(PuppeteerAnimator.State.LAUGH);check(!a.trigger(behavior),"Major animation excludes behavior");
        }
        a=new PuppeteerAnimator(c,42);var b=new PuppeteerAnimator(c,42);advance(a,7,60);advance(b,7,60);float[] paused=a.pose.clone();a.update(0,1,false);check(java.util.Arrays.equals(paused,a.pose),"Zero delta pause");
        a.play(PuppeteerAnimator.State.SCARE);b.update(.1f,0,false);check(b.state()==PuppeteerAnimator.State.IDLE,"Independent state");
        a=new PuppeteerAnimator(c,100);advance(a,7,60);a.eyeTracking=false;a.idleMovement=false;advance(a,1,60);check(a.pose[PuppeteerAnimator.EYE_LX]==0&&a.pose[PuppeteerAnimator.BODY]==0,"Debug layer toggles");
        System.out.println("PASS: Puppeteer rig config, 30/60/144 FPS, eight states, seven behaviors, blend continuity, pause and independent instances");
    }
}
