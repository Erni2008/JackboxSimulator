package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.scenes.scene2d.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.screens.*;
import com.erni.finalanswer.gameplay.round.*;
import com.erni.finalanswer.gameplay.presentation.QuestionPresentationController.State;
import com.erni.finalanswer.gameplay.clock.ClockTimeline;
import com.erni.finalanswer.gameplay.questions.Question;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.ui.play.*;
import com.erni.finalanswer.ui.clock.ClockTimerActor;
import java.util.List;

/** Isolated graphical regression. No live room or network session is installed in production. */
public final class PlayCheck extends FinalAnswerGame {
    private PlayScreen play;
    private int handoffs;
    private int step, baselineTextures, loadedTextures, baselineShaders, loadedShaders;
    private String baselineMeshes, loadedMeshes;
    private float layoutWidth, layoutHeight;
    public static void main(String[] args) {
        var c = new Lwjgl3ApplicationConfiguration(); c.setWindowedMode(1280,720); c.disableAudio(true);
        c.setPreferencesConfig(System.getProperty("play.qa.dir"), Files.FileType.Absolute);
        new Lwjgl3Application(new PlayCheck(), c);
    }
    private static Object field(Object object, String name) {
        try {var f=object.getClass().getDeclaredField(name);f.setAccessible(true);return f.get(object);}
        catch(Exception e) {throw new RuntimeException(e);}
    }
    private static void check(boolean value,String message) {if(!value)throw new AssertionError(message);}
    private RoundController round() {return (RoundController)field(play,"round");}
    private Stage stage() {return (Stage)field(play,"stage");}
    private CinematicQuestion question() {return (CinematicQuestion)field(play,"question");}
    private QuizBackground background() {return (QuizBackground)field(play,"background");}
    private ClockTimeline clock() {return ((ClockTimerActor)field(play,"clock")).timeline();}
    private AnswerView answer(int index) {return stage().getRoot().findActor("answer"+index);}
    private void assertAnswerBounds() {
        var bounds = new com.badlogic.gdx.math.Rectangle[4];
        for(int i=0;i<4;i++) {
            bounds[i]=new com.badlogic.gdx.math.Rectangle(); answer(i).visualBounds(bounds[i]);
            check(bounds[i].x>=0 && bounds[i].y>=0 && bounds[i].x+bounds[i].width<=1600
                && bounds[i].y+bounds[i].height<=900*.66f,"Answer fits safe scene area");
            if(answer(i).isVisible()) for(int j=0;j<i;j++)
                if(answer(j).isVisible())check(!bounds[i].overlaps(bounds[j]),"Visible answers do not overlap");
        }
    }
    private void advance(double seconds) {play.render((float)Math.max(0,seconds));}
    private void to(double seconds) {advance(seconds-round().elapsedSeconds());}
    private void key(int key) {stage().keyDown(key);stage().keyUp(key);}
    private void capture(String name) {
        if(!Boolean.getBoolean("play.qa.capture"))return;
        Pixmap image=com.badlogic.gdx.utils.ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
        PixmapIO.writePNG(Gdx.files.absolute("/tmp/play-"+name+".png"),image,-1,true);image.dispose();
    }
    @Override public void render() {
        if(play==null) {
            super.render();check(getScreen() instanceof MainMenu,"Main menu opens");showPlayScreen();
            check(getScreen() instanceof MainMenu,"Room gate retained");
            baselineTextures=Texture.getNumManagedTextures();baselineMeshes=Mesh.getManagedStatus();
            baselineShaders=com.badlogic.gdx.graphics.glutils.ShaderProgram.getNumManagedShaderPrograms();
            try {var f=FinalAnswerGame.class.getDeclaredField("activeRoom");f.setAccessible(true);
                f.set(this,new RoomSession("TEST","QA",4,"standard","qa-only",true,List.of()));showPlayScreen();f.set(this,null);
            }catch(Exception e){throw new RuntimeException(e);}
            play=(PlayScreen)getScreen();loadedTextures=Texture.getNumManagedTextures();loadedMeshes=Mesh.getManagedStatus();
            loadedShaders=com.badlogic.gdx.graphics.glutils.ShaderProgram.getNumManagedShaderPrograms();return;
        }
        if(getScreen()!=play) {
            super.render();check(getScreen() instanceof MainMenu,"ESC returns to menu");
            play.dispose();play.dispose();
            check(Texture.getNumManagedTextures()==baselineTextures,"All textures released");
            check(Mesh.getManagedStatus().equals(baselineMeshes),"All meshes released");
            check(com.badlogic.gdx.graphics.glutils.ShaderProgram.getNumManagedShaderPrograms()==baselineShaders,"Lighting shader released");
            check(Gdx.gl.glGetError()==0,"No OpenGL errors");
            System.out.println("PASS: cinematic glyphs, cached wrapping, movement, voice hold, answers, clock, pause, long words, fallback, resource lifetime and menu");
            Gdx.app.exit();return;
        }
        var p=round().presentation();
        switch(step++) {
            case 0 -> {advance(.25);check(question().glyphCount()>0,"Cached glyphs prepared");capture("typing");key(Input.Keys.SPACE);check(round().number()==1,"No early skip");}
            case 1 -> {
                to(p.typingEndSeconds()+.01);check(p.state()==State.QUESTION_WAITING,"Question stabilizes");
                layoutWidth=question().layoutWidth();layoutHeight=question().layoutHeight();
                check(clock().state()==ClockTimeline.State.WAITING,"Clock waits during voice hold");capture("large-question");
            }
            case 2 -> {to(p.moveStartsAt()-.01);check(p.state()==State.QUESTION_WAITING,"Full two-second hold");}
            case 3 -> {to(p.moveStartsAt()+.37);check(question().getScaleX()<1&&question().getScaleX()>.6,"Smooth shrink");capture("moving-question");}
            case 4 -> {
                to(p.answersStartSeconds()+.08);check(stage().getRoot().findActor("answer0").isVisible(),"A visible");
                check(!stage().getRoot().findActor("answer1").isVisible(),"B hidden");
                check(question().layoutWidth()==layoutWidth&&question().layoutHeight()==layoutHeight,"No rewrap during transition");capture("answer-a");
            }
            case 5 -> {advance(.18);check(stage().getRoot().findActor("answer1").isVisible()&&!stage().getRoot().findActor("answer2").isVisible(),"B stagger");}
            case 6 -> {advance(.18);check(stage().getRoot().findActor("answer2").isVisible()&&!stage().getRoot().findActor("answer3").isVisible(),"C stagger");}
            case 7 -> {
                to(p.timerStartSeconds()+.01);check(clock().state()==ClockTimeline.State.RUNNING,"Clock after final fade");
                check(background().visibility()==1,"First room background");
                for(int i=0;i<4;i++)check(answer(i).getColor().a==1 && answer(i).getScaleX()==1,"All options fully shown before countdown");
                assertAnswerBounds(); capture("full");
                double t=round().elapsedSeconds(),bt=background().elapsedSeconds();float angle=clock().angleDegrees();
                key(Input.Keys.P);advance(5);check(round().elapsedSeconds()==t&&background().elapsedSeconds()==bt&&clock().angleDegrees()==angle,"Pause freezes all layers");
                key(Input.Keys.P);play.pause();advance(3);play.resume();check(round().elapsedSeconds()==t,"Platform pause");
            }
            case 8 -> {
                advance(20);check(round().phase()==RoundPhase.REVEAL&&clock().angleDegrees()==0,"Timer reaches XII");
                for(int i=0;i<4;i++)check(answer(i).isVisible()&&answer(i).getColor().a==1&&answer(i).getScaleX()==1,"No early reveal at zero");
                capture("timer-zero");
            }
            case 9 -> {
                advance(.22);capture("clock-closed");
                for(int i=0;i<4;i++)check(answer(i).getColor().a==1,"No reveal during clock closure");
                advance(.49);check(clock().state()==ClockTimeline.State.FINISHED,"Clock falls offscreen");
                advance(.15);check(answer(0).getColor().a>0&&answer(0).getColor().a<1,"Wrong options fade");
                check(answer(1).getScaleX()>1&&answer(1).getScaleX()<1.4,"Correct group grows smoothly");capture("reveal-mid");
                key(Input.Keys.P);float alpha=answer(0).getColor().a;advance(2);
                check(answer(0).getColor().a==alpha,"Result fade pauses");key(Input.Keys.P);
                advance(.46);
                for(int i=0;i<4;i++)check(answer(i).isVisible()==(i==1),"Only indexed correct answer remains");
                check(Math.abs(answer(1).getScaleX()-1.4)<.00001,"Exactly 40 percent growth");
                assertAnswerBounds();capture("result");
                play.setResultsHandler(q -> {handoffs++;check(q.correctAnswerIndex()==1,"Handoff contains actual question");});
                advance(2.45);check(handoffs==0,"Hold completed result before handoff");
                advance(.06);advance(.5);check(handoffs==1,"One result handoff per round");
                play.setResultsHandler(null);
            }
            case 10 -> {
                key(Input.Keys.SPACE);check(round().number()==2&&p.state()==State.QUESTION_TYPING,"Next question reset");
                check(clock().state()==ClockTimeline.State.WAITING&&clock().angleDegrees()==120,"Clock reset");
                for(int i=0;i<4;i++)check(!answer(i).isVisible() && answer(i).getScaleX()<=1,"Next round clears result transforms");
                check(background().isActiveForQuestion(),"Room background retained for question two");
                advance(15);key(Input.Keys.SPACE);advance(1);check(!background().isActiveForQuestion()&&background().visibility()==0,"Later room fades to black");
            }
            case 11 -> {
                question().prepare(new Question("stress","W".repeat(240),List.of("A","B","C","D"),0),1600,900,false);
                check(question().layoutWidth()<=1281&&question().layoutHeight()<=244,"Long words fit bounds");
                question().prepare(new Question("ru","Какое существо, согласно легендам, боится солнечного света?",List.of("А","Б","В","Г"),0),1600,900,false);
                question().setTime(20);advance(0);capture("cyrillic-fallback");
                check(Texture.getNumManagedTextures()==loadedTextures&&Mesh.getManagedStatus().equals(loadedMeshes),"No new GPU resources during animation");
                check(com.badlogic.gdx.graphics.glutils.ShaderProgram.getNumManagedShaderPrograms()==loadedShaders,"No per-frame shader creation");
            }
            case 12 -> {
                advance(15); // Finish the real question transition before checking text against its safe area.
                var answers=(AnswersPresentationActor)field(play,"answers");
                var stress = new Question("answers-long", "Stress", List.of("W".repeat(220),
                    "The distance light travels in one year, measured far beyond the edge of our solar system",
                    "The brightness of the star compared with the Sun", "Русский текст ответа с переносами строк"), 0);
                answers.prepare(stress,1600,900);
                for(int correct=0;correct<4;correct++) {
                    for(int i=0;i<4;i++)answer(i).present(1,i==correct,-1,false);
                    assertAnswerBounds();
                    for(int i=0;i<4;i++)answer(i).present(1,i==correct,.6,false);
                    assertAnswerBounds();
                    check(Math.abs(answer(correct).getScaleX()-1.4)<.00001,"Every answer can grow without clipping");
                }
                for(int i=0;i<4;i++)answer(i).present(1,false,-1,false);
                com.badlogic.gdx.utils.ScreenUtils.clear(9/255f,9/255f,9/255f,1);
                stage().draw();capture("long-answers");
                for(int i=0;i<4;i++)answer(i).present(1,i==0,.6,true);
                check(answer(0).getRotation()==0&&answer(0).getScaleX()==1.4f,"Reduced motion keeps correct emphasis");
                Gdx.graphics.setWindowedMode(960,540);
            }
            case 13 -> {
                advance(0); assertAnswerBounds(); capture("small-window");
                advance(25); check(round().number()==4,"Default result completion advances demo automatically");
                check(!answer(0).isVisible()&&clock().state()==ClockTimeline.State.WAITING,"Automatic transition resets answers and clock");
            }
            default -> {advance(0);key(Input.Keys.ESCAPE);}
        }
    }
    @Override public void dispose(){if(play!=null)play.dispose();super.dispose();}
}
