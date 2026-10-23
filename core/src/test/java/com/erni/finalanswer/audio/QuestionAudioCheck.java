package com.erni.finalanswer.audio;

import com.badlogic.gdx.audio.*;
import java.lang.reflect.*;
import java.util.*;

/** Uses the real controller with injected libGDX audio interfaces; no audio device or render thread required. */
public final class QuestionAudioCheck {
    private static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    private static void near(float a,float b){check(Math.abs(a-b)<.001f,"Expected "+a+", got "+b);}
    private static final class Media implements InvocationHandler {
        boolean playing,loop;int plays,stops,pauses,disposals;float volume,position;long id;
        public Object invoke(Object proxy,Method method,Object[] args){
            switch(method.getName()){
                case "play"->{playing=true;plays++;if(args!=null&&args.length>0)volume=(float)args[0];if(method.getReturnType()==long.class)return ++id;}
                case "stop"->{stops++;playing=false;}
                case "pause"->{pauses++;playing=false;}
                case "dispose"->disposals++;
                case "setLooping"->loop=(boolean)args[0];
                case "isPlaying"->{return playing;}
                case "setVolume"->volume=(float)args[args.length-1];
                case "setPosition"->position=(float)args[0];
            }
            if(method.getReturnType()==boolean.class)return false;if(method.getReturnType()==float.class)return 0f;if(method.getReturnType()==long.class)return 0L;return null;
        }
        <T>T as(Class<T> type){return type.cast(Proxy.newProxyInstance(type.getClassLoader(),new Class<?>[]{type},this));}
    }
    private static final class Fixture {
        final Map<String,Media> files=new HashMap<>();final AudioMix mix=new AudioMix();final List<String> warnings=new ArrayList<>();
        final QuestionAudio audio=new QuestionAudio(new PresentationAudio.Backend(){public Music music(String path){var m=new Media();files.put(path,m);return m.as(Music.class);}public Sound sound(String path){var m=new Media();files.put(path,m);return m.as(Sound.class);}},mix,warnings::add,20);
        Media media(String path){return files.get(path);}
        void update(float dt){audio.update(dt);check(!(media(QuestionAudio.FIRST).playing&&media(QuestionAudio.SECOND).playing),"Two question compositions overlap");}
    }
    public static void main(String[] args){
        for(int fps:new int[]{10,30,60,144}){
            Fixture f=new Fixture();var a=f.audio;var tick=f.media(QuestionAudio.CLOCK);var lock=f.media(QuestionAudio.LOCK);
            a.question("game:q1",1);a.phase(false,false,0,20);
            for(int i=0;i<fps;i++)f.update(1f/fps);
            check(f.media(QuestionAudio.FIRST).plays==1&&f.media(QuestionAudio.SECOND).plays==0,"First question uses first track");check(tick.plays==0,"No ticking during question introduction");
            a.phase(true,false,0,20);f.update(.01f);check(tick.plays==1&&tick.loop,"One looping ticking stream starts with timer");
            for(int i=0;i<fps*2;i++){a.question("game:q1",1);a.phase(true,false,i/(double)fps,20-i/(double)fps);f.update(1f/fps);}
            check(tick.plays==1&&lock.plays==0,"No duplicate streams or premature lock on updates");
            a.phase(false,true,20,0);check(!tick.playing&&lock.plays==1,"Tick stops immediately and lock plays at actual closure");
            for(int i=0;i<fps*2;i++){a.question("game:q1",1);a.phase(false,true,21,0);f.update(1f/fps);}
            check(lock.plays==1&&lock.stops==0,"One lock event, tail never truncated by phase refresh");
            check(!f.media(QuestionAudio.FIRST).playing,"Music fades out at end of question");
            a.question("game:q2",2);a.phase(false,false,0,20);for(int i=0;i<fps;i++)f.update(1f/fps);
            check(f.media(QuestionAudio.SECOND).plays==1,"Second question uses second composition");
            a.question("game:q3",3);for(int i=0;i<fps*2;i++)f.update(1f/fps);check(a.currentTrack()==0,"Alternates back after fade-out, no overlap");
            a.phase(true,false,32.5,10);f.update(.01f);near(tick.position,12.5f);
            a.pause(true);f.update(.2f);check(!tick.playing&&!f.media(QuestionAudio.FIRST).playing,"Pause stops timer and pauses background");
            a.pause(false);a.phase(true,false,33,9);f.update(.2f);near(tick.position,13);
            f.mix.master=.5f;f.mix.music=.4f;f.mix.sfx=.6f;for(int i=0;i<fps;i++)f.update(1f/fps);
            near(f.media(QuestionAudio.FIRST).volume,.35f*.5f*.4f);near(tick.volume,.55f*.5f*.6f);
            f.update(8);a.phase(false,true,40,0);near(lock.volume,.85f*.5f*.6f);
            int stopped=lock.stops;a.leave();f.update(1);check(lock.stops==stopped,"Screen handoff preserves metallic tail");
            a.close();a.close();for(Media m:f.files.values())check(m.disposals==1,"Owned audio disposed exactly once");check(f.warnings.isEmpty(),"No device errors");
        }
        Fixture rapid=new Fixture();rapid.audio.question("rapid1",1);rapid.audio.phase(true,false,0,1);rapid.audio.phase(false,true,1,0);
        rapid.audio.question("rapid2",2);rapid.audio.phase(true,false,0,1);rapid.audio.phase(false,true,1,0);
        check(rapid.media(QuestionAudio.LOCK).plays==1&&rapid.media(QuestionAudio.LOCK).stops==0,"Rapid distinct locks preserve current tail without overlapping voices");rapid.audio.close();
        Fixture late=new Fixture();late.audio.question("late",3);late.audio.phase(false,true,25,0);late.update(1);check(late.media(QuestionAudio.LOCK).plays==0,"Late restoration skips historical lock");late.audio.close();
        List<String> warnings=new ArrayList<>();var missing=new QuestionAudio(new PresentationAudio.Backend(){public Sound sound(String path){return null;}public Music music(String path){return null;}},new AudioMix(),warnings::add,20);
        missing.question("missing",1);missing.phase(true,false,0,20);missing.update(1);missing.phase(false,true,20,0);missing.leave();missing.close();check(warnings.size()==4,"Missing optional assets warn without crashing");
        System.out.println("PASS: 10/30/60/144 FPS music alternation/fades with no overlap; timer gating/loop/seek; one lock and full tail; duplicate/late snapshots; pause, independent gains, missing assets and disposal");
    }
}
