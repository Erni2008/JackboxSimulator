package com.erni.finalanswer.intro;

import com.erni.finalanswer.gameplay.intro.IntroDefinition;
import java.util.*;

/** Measured schedule: scenes may move later; speech is never shortened or sped up. */
public final class IntroTimeline {
    public record Speech(IntroDefinition.Line line,float start,float duration) {public float end(){return start+duration;}}
    public record SceneTiming(String id,float target,float actual,float speechEnd,float budgetOverrun){}
    public record Sound(IntroDefinition.Cue cue,float at,float until){}
    public final List<Speech> speech;
    public final List<SceneTiming> scenes;
    public final List<Sound> sounds;
    public final float duration;
    public final float exitFade;
    public final boolean completeMetadata,fits;
    public IntroTimeline(IntroDefinition definition,Map<String,Float> durations){
        exitFade=definition.exitFade();
        var lines=new ArrayList<Speech>();var timings=new ArrayList<SceneTiming>();
        float cursor=0;boolean known=true;
        for(var scene:definition.scenes()){
            float start=Math.max(cursor,scene.start());cursor=start;
            for(var line:scene.lines()){
                Float measured=durations.get(line.id());
                if(measured==null||!Float.isFinite(measured)||measured<=0){known=false;measured=0f;}
                lines.add(new Speech(line,cursor,measured));cursor+=measured+line.pauseAfter();
            }
            timings.add(new SceneTiming(scene.id(),scene.start(),start,cursor,Math.max(0,cursor-scene.end())));
        }
        duration=Math.max(definition.targetDurationSeconds(),cursor+definition.exitFade());
        completeMetadata=known;fits=known&&duration<=definition.maximumDurationSeconds();
        speech=List.copyOf(lines);scenes=List.copyOf(timings);
        var cues=new ArrayList<Sound>();
        for(var cue:definition.cues())cues.add(new Sound(cue,remap(cue.at(),definition,timings),cue.until()>0?remap(cue.until(),definition,timings):0));
        sounds=List.copyOf(cues);
    }
    private static float remap(float at,IntroDefinition definition,List<SceneTiming> scenes){
        for(int i=scenes.size()-1;i>=0;i--)if(at>=definition.scenes().get(i).start())return scenes.get(i).actual()+at-definition.scenes().get(i).start();
        return at;
    }
}
