package com.erni.finalanswer.intro;

import com.erni.finalanswer.gameplay.intro.IntroDefinition;
import java.util.*;
import java.util.function.Consumer;

public final class IntroCheck {
    private static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    private static final class Output implements IntroSequenceController.Output {
        float clock,due;int finished,warnings,stopped;
        Consumer<Boolean> pending;
        final Set<String> voices=new HashSet<>(),sounds=new HashSet<>();
        public void speak(IntroTimeline.Speech speech,float offset,Consumer<Boolean> done){check(pending==null,"No overlapping voice");check(voices.add(speech.line().id()),"No duplicate line");pending=done;due=clock+speech.duration()-offset;}
        public void sound(IntroTimeline.Sound cue){check(sounds.add(cue.cue().id()),"No duplicate cue");}
        public void stopSound(String id){stopped++;}
        public void finished(boolean skipped){finished++;}
        public void warning(String message){warnings++;}
        void advance(float delta){clock+=delta;if(pending!=null&&clock>=due){var callback=pending;pending=null;callback.accept(true);}}
    }
    public static void main(String[] args){
        var definition=IntroDefinition.RUSSIAN;var durations=new LinkedHashMap<String,Float>();
        for(var scene:definition.scenes())for(var line:scene.lines())durations.put(line.id(),1f);
        check(durations.size()==24,"Neutral confirmation and sarcastic question have independent clips");
        check(definition.scenes().stream().flatMap(scene->scene.lines().stream()).anyMatch(line->line.id().equals("intro_02_01")&&line.text().equals("Точно.")),"Confirmation is a separate neutral statement");
        check(definition.scenes().stream().flatMap(scene->scene.lines().stream()).anyMatch(line->line.id().equals("intro_02_01b")&&line.text().equals("Где же мои манеры?")),"The rhetorical question has its own clip");
        check(definition.cues().stream().filter(cue->cue.id().equals("chain")).findFirst().orElseThrow().gain()==.15f,"Intro chains use half the previous .30 gain");
        check(definition.scenes().stream().flatMap(scene->scene.lines().stream()).noneMatch(line->line.text().contains("FINAL ANSWER")),"Removed title announcement never returns");
        var plan=new IntroTimeline(definition,durations);check(plan.fits&&plan.duration<=80,"Measured script fits budget");
        for(float fps:new float[]{10,30,60,144}){
            var output=new Output();var controller=new IntroSequenceController(plan,output);controller.start(0);
            for(int frame=0;frame<fps*82&&output.finished==0;frame++){controller.update(1/fps);output.advance(1/fps);}
            check(output.finished==1&&output.voices.size()==durations.size(),"Every line once at "+fps+" FPS");
            check(output.sounds.size()==definition.cues().size()&&output.stopped==1,"Complete cue sequence and one clock stop");
            controller.skip();controller.update(20);check(output.finished==1,"Completion cannot start question twice");
        }
        for(float age:new float[]{0,12,58,67}){
            var output=new Output();var controller=new IntroSequenceController(plan,output);controller.start(age);controller.skip();controller.skip();int spoken=output.voices.size();
            if(output.pending!=null)output.pending.accept(true);controller.update(100);
            check(output.finished==1&&output.voices.size()==spoken,"Skip cancels late voice callbacks at "+age);
        }
        var output=new Output();var controller=new IntroSequenceController(plan,output);controller.start(5);controller.pause();controller.update(100);check(controller.age()==5,"Pause holds timeline");controller.resume();controller.update(.5f);check(controller.age()==5.5f,"Resume continues timeline");controller.cancel();controller.update(100);check(output.finished==0,"Disposal does not progress gameplay");
        var ending=new Output();var endingController=new IntroSequenceController(plan,ending);
        var address=plan.speech.stream().filter(speech->speech.line().id().equals("intro_05_01")).findFirst().orElseThrow();
        endingController.start(address.start());endingController.update(5);
        check(!ending.voices.contains("intro_05_03")&&ending.finished==0,"First Question cannot interrupt an unfinished exhibits address, even after its planned end");
        var completedAddress=ending.pending;ending.pending=null;completedAddress.accept(true);
        endingController.update(address.line().pauseAfter()-.1f);check(!ending.voices.contains("intro_05_03"),"Full post-address pause is preserved");
        endingController.update(.11f);check(ending.voices.contains("intro_05_03"),"First Question follows actual completion and pause");
        durations.replaceAll((id,duration)->10f);var conflict=new IntroSequenceController(new IntroTimeline(definition,durations),new Output());conflict.start(0);check(conflict.state()==IntroSequenceController.State.TIMING_CONFLICT,"Overlong speech is reported, not truncated");
        System.out.println("PASS: revised exact script, 10/30/60/144 FPS, one voice/cue, pause, skip at four stages, stale callbacks, cancellation and timing conflict");
    }
}
