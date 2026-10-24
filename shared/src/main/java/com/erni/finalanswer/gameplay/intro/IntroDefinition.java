package com.erni.finalanswer.gameplay.intro;

import com.google.gson.Gson;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** Shared immutable script/timing metadata; no rendering or audio dependencies. */
public record IntroDefinition(String introId,String language,float targetDurationSeconds,float maximumDurationSeconds,
                              float fadeStart,float fadeDuration,float exitFade,Mix mix,List<Scene> scenes,List<Cue> cues) {
    public IntroDefinition {scenes=List.copyOf(scenes);cues=List.copyOf(cues);}
    public record Mix(float host,float ambience,float sfx,float music){}
    public record Line(String id,String text,String subtitleText,String spokenText,float pauseAfter){
        public String caption(){return subtitleText==null||subtitleText.isBlank()?text:subtitleText;}
    }
    public record Direction(String after,String type,String file){}
    public record Scene(String id,float start,float end,String emotion,List<Line> lines,List<Direction> directions){public Scene{lines=List.copyOf(lines);directions=List.copyOf(directions);}}
    public record Cue(String id,float at,float until,String file,String category,float gain){}
    public static final IntroDefinition RUSSIAN=load();
    private static IntroDefinition load(){
        try(var input=IntroDefinition.class.getResourceAsStream("/cinematics/intro_ru.json")){
            if(input==null)throw new IllegalStateException("Missing cinematic intro definition");
            var value=new Gson().fromJson(new InputStreamReader(input,StandardCharsets.UTF_8),IntroDefinition.class);
            if(value.maximumDurationSeconds()>80||value.targetDurationSeconds()>value.maximumDurationSeconds()||value.fadeDuration()<=0||value.exitFade()<=0)throw new IllegalStateException("Invalid intro duration budget");
            for(float gain:new float[]{value.mix().host(),value.mix().ambience(),value.mix().sfx(),value.mix().music()})if(!Float.isFinite(gain)||gain<0||gain>1)throw new IllegalStateException("Invalid intro mix");
            var ids=new HashSet<String>();
            for(Scene scene:value.scenes()){
                if(scene.start()<0||scene.end()<scene.start())throw new IllegalStateException("Invalid intro scene: "+scene.id());
                for(Line line:scene.lines())if(line.text().isBlank()||!ids.add(line.id())||line.pauseAfter()<0)throw new IllegalStateException("Invalid/duplicate intro line");
            }
            return value;
        }catch(IOException error){throw new UncheckedIOException(error);}
    }
}
