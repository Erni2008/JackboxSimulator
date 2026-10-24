package com.erni.finalanswer.intro;

import com.badlogic.gdx.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.ClickListener;
import com.badlogic.gdx.utils.Align;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.audio.*;
import com.erni.finalanswer.gameplay.intro.IntroDefinition;
import java.util.*;
import java.util.function.Consumer;

/** Existing-basement presentation. Borrowed pixel/font; gameplay progression is a host-only callback. */
public final class BasementIntro extends Group {
    private final FinalAnswerGame game;
    private final IntroDefinition definition=IntroDefinition.RUSSIAN;
    private final java.util.List<String> lineIds;
    private final Image darkness,accent;
    private final Label notice;
    private final Label subtitle,subtitleShadow;
    private final Image subtitlePlate;
    private final TextButton skip;
    private IntroSequenceController controller;
    private Consumer<String> progression;
    private String gameId="",completedEvent;
    private float loadAge,initialAge,retry;
    private boolean review,paused,checked,authorized;
    private boolean discardDelta;
    private float stepDelta;
    public float stepDelta(){return stepDelta;}
    private String pendingSubtitle;
    private float subtitleStarted=-100,subtitleEnded=-100,finalStart=68;

    public BasementIntro(FinalAnswerGame game,Texture pixel,BitmapFont font,TextButton.TextButtonStyle style){
        this.game=game;setName("basementIntro");setSize(1920,1080);setVisible(false);
        lineIds=definition.scenes().stream().flatMap(scene->scene.lines().stream()).map(IntroDefinition.Line::id).toList();
        accent=new Image(pixel);accent.setBounds(0,0,1920,1080);accent.setTouchable(Touchable.disabled);accent.setColor(1,.85f,.65f,0);addActor(accent);
        darkness=new Image(pixel);darkness.setBounds(0,0,1920,1080);darkness.setTouchable(Touchable.disabled);darkness.setColor(0,0,0,1);addActor(darkness);
        subtitlePlate=new Image(pixel);subtitlePlate.setBounds(260,112,1400,126);subtitlePlate.setColor(.012f,.009f,.016f,0);subtitlePlate.setTouchable(Touchable.disabled);addActor(subtitlePlate);
        subtitleShadow=caption(font,Color.BLACK,312,122);subtitle=caption(font,Color.valueOf("EEE7DB"),310,124);
        subtitle.setName("introSubtitle");darkness.setName("introDarkness");
        notice=new Label("",new Label.LabelStyle(font,Color.valueOf("C8B7A8")));notice.setFontScale(.65f);notice.setBounds(45,34,1300,60);notice.setAlignment(Align.left);addActor(notice);
        skip=new TextButton("SKIP INTRO »",style);skip.setName("skipIntro");skip.setBounds(1570,32,310,60);
        skip.addListener(new ClickListener(){@Override public void clicked(InputEvent event,float x,float y){skip();}});addActor(skip);
        addListener(new InputListener(){@Override public boolean keyDown(InputEvent event,int key){
            if(isVisible()&&authorized&&completedEvent==null&&key==Input.Keys.P){pause(!paused);progression.accept(paused?"INTRO_PAUSE":"INTRO_RESUME");return true;}
            if(isVisible()&&authorized&&(key==Input.Keys.ESCAPE||key==Input.Keys.SPACE||key==Input.Keys.ENTER)){skip();return true;}return false;
        }});
    }
    private Label caption(BitmapFont font,Color color,float x,float y){Label result=new Label("",new Label.LabelStyle(font,color));result.setFontScale(1.12f);result.setWrap(true);result.setAlignment(Align.center);result.setBounds(x,y,1300,110);result.setTouchable(Touchable.disabled);result.getColor().a=0;addActor(result);return result;}
    public void begin(String id,float elapsed,boolean allowReview,Consumer<String> progression){
        if(isVisible()&&gameId.equals(id))return;
        end();gameId=id;this.progression=progression;initialAge=elapsed;loadAge=retry=0;review=allowReview;
        completedEvent=null;checked=paused=false;authorized=true;setVisible(true);skip.setDisabled(false);notice.setText("");darkness.setColor(0,0,0,1);
        discardDelta=false;stepDelta=0;
        pendingSubtitle=null;subtitleStarted=subtitleEnded=-100;subtitle.getColor().a=subtitleShadow.getColor().a=subtitlePlate.getColor().a=0;
        if(getStage()!=null)getStage().setKeyboardFocus(skip);
        game.getAudio().hostVoice().scopeGain(definition.mix().host());game.getAudio().hostVoice().prepareIntro(lineIds,allowReview);game.getAudio().beginIntro();
    }
    public float age(){return controller==null?0:controller.age();}
    public boolean awaitingTransition(){return completedEvent!=null;}
    public boolean paused(){return paused;}
    public boolean ambience(){return isVisible()&&controller!=null&&age()>=definition.fadeStart()&&completedEvent==null;}
    public float ambienceGain(){return definition.mix().ambience();}
    public void frame(float delta){
        if(!isVisible())return;
        if(discardDelta){delta=0;discardDelta=false;}stepDelta=paused?0:Math.max(0,delta);
        if(completedEvent!=null){retry-=delta;if(retry<=0){retry=.75f;progression.accept(completedEvent);}return;}
        if(!paused)loadAge+=Math.max(0,delta);
        var host=game.getAudio().hostVoice();
        if(controller==null&&!checked&&host.introPrepared()&&game.getAudio().intro().ready()){
            checked=true;var durations=new LinkedHashMap<String,Float>();boolean approved=true;
            for(String id:lineIds){var entry=host.introEntry(id);if(entry!=null){durations.put(id,entry.duration);approved&="ready".equals(entry.status);}else approved=false;}
            if(!review&&!approved){notice.setText("INTRO NARRATION AWAITS REVIEW — SKIP INTRO TO CONTINUE");return;}
            var plan=new IntroTimeline(definition,durations);
            for(var scene:plan.scenes)if(scene.id().equals("show_begins"))finalStart=scene.actual();
            controller=new IntroSequenceController(plan,new IntroSequenceController.Output(){
                public void speak(IntroTimeline.Speech speech,float offset,Consumer<Boolean> done){
                    pendingSubtitle=speech.line().caption();
                    host.playIntro(speech.line().id(),gameId+":"+speech.line().id(),offset,result->{
                        if(result!=HostVoiceManager.Result.COMPLETED&&result!=HostVoiceManager.Result.CANCELLED){subtitle.setText(speech.line().caption());subtitleShadow.setText(speech.line().caption());pendingSubtitle=null;subtitleStarted=age();subtitleEnded=age()+speech.duration();}
                        else subtitleEnded=age();done.accept(result==HostVoiceManager.Result.COMPLETED);
                    });
                }
                public void sound(IntroTimeline.Sound sound){game.getAudio().intro().play(sound.cue().id());}
                public void stopSound(String id){game.getAudio().intro().stop(id);}
                public void finished(boolean skipped){complete(skipped);}
                public void warning(String message){Gdx.app.error("Cinematic intro",message);if(message.startsWith("INTRO_"))notice.setText("INTRO UNAVAILABLE — SKIP INTRO TO CONTINUE");}
            });
            controller.start(initialAge+loadAge);if(paused)controller.pause();
        }else if(controller!=null)controller.update(paused?0:Math.max(0,delta));
        if(controller!=null){
            float fade=com.badlogic.gdx.math.Interpolation.smoother.apply(Math.max(0,Math.min(1,(age()-definition.fadeStart())/definition.fadeDuration())));
            float opacity=Math.max(1-fade,controller.exitProgress());
            if(age()>=9&&controller.exitProgress()==0)opacity=Math.max(opacity,.018f+.007f*(float)Math.sin(age()*.65f));
            darkness.setColor(0,0,0,opacity);
            accent.getColor().a=age()>=finalStart?.025f*(float)Math.exp(-(age()-finalStart)*2):0;
            if(pendingSubtitle!=null&&host.playing()){subtitle.setText(pendingSubtitle);subtitleShadow.setText(pendingSubtitle);pendingSubtitle=null;subtitleStarted=age();subtitleEnded=-100;}
            float alpha=subtitleStarted<0?0:Math.min(1,(age()-subtitleStarted)/.18f);
            if(subtitleEnded>=0)alpha*=Math.min(1,Math.max(0,1-(age()-subtitleEnded)/.18f));
            subtitle.getColor().a=subtitleShadow.getColor().a=alpha;subtitlePlate.getColor().a=alpha*.65f;
        }
    }
    private void complete(boolean skipped){completedEvent=skipped?"SKIP_INTRO":"INTRO_READY";game.getAudio().finishIntro();darkness.setColor(0,0,0,1);skip.setDisabled(true);retry=0;subtitle.getColor().a=subtitleShadow.getColor().a=subtitlePlate.getColor().a=0;pendingSubtitle=null;}
    public void pause(boolean value){
        if(!isVisible()||completedEvent!=null||paused==value)return;paused=value;
        if(!value)discardDelta=true;
        if(controller!=null){if(value)controller.pause();else controller.resume();}
        if(value)game.getAudio().hostVoice().pause();else game.getAudio().hostVoice().resume();
        game.getAudio().intro().pause(value);
    }
    public void skip(){
        if(!isVisible()||!authorized||completedEvent!=null)return;
        if(controller!=null)controller.skip();else complete(true);
    }
    public void end(){
        if(!isVisible())return;if(controller!=null)controller.cancel();controller=null;setVisible(false);game.getAudio().finishIntro();authorized=false;
    }
}
