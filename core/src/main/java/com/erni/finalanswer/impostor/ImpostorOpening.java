package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.Stage;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.erni.finalanswer.ui.UiFonts;

/** Separate stage: the opening never reveals the room or accepts its controls. */
final class ImpostorOpening implements AutoCloseable {
    // The original introduction effect is 7.78449 seconds; leave a short black tail.
    private static final float DURATION=8.35f;
    private final Stage stage=new Stage(new FitViewport(1920,1080));
    private final BitmapFont titleFont=UiFonts.question(148),smallFont=UiFonts.body(22);
    private final Label title,english,tagline,skip;
    private float elapsed;
    private boolean started,finished;

    ImpostorOpening(){
        english=label("T H E   I M P O S T O R",smallFont,Color.valueOf("AB998C"),640,50);
        title=label("ИМПОСТОР",titleFont,Color.valueOf("A72D36"),440,190);
        skip=label("ENTER / ПРОБЕЛ — ПРОДОЛЖИТЬ",smallFont,Color.valueOf("80756D"),100,40);
        tagline=label("У КАЖДОГО ЕСТЬ РОЛЬ. У ОДНОГО — ТАЙНА.",smallFont,Color.valueOf("C8BDB3"),340,50);
    }
    private Label label(String text,BitmapFont font,Color color,float y,float height){
        Label label=new Label(text,new Label.LabelStyle(font,color));
        label.setAlignment(Align.center);label.setBounds(60,y,1800,height);stage.addActor(label);return label;
    }
    boolean canSkip(){return elapsed>=1.2f;}
    boolean active(){return !finished;}
    Stage input(){return stage;}
    void render(float delta,boolean paused,boolean reduced,Runnable play){
        if(!started){started=true;play.run();delta=0;}
        if(!paused&&Float.isFinite(delta))elapsed+=Math.max(0,delta);
        float fadeIn=smooth(elapsed/.95f),fadeOut=smooth((DURATION-elapsed)/.65f);
        skip.getColor().a=smooth((elapsed-1.2f)/.5f)*fadeOut;
        title.getColor().a=fadeIn*fadeOut;
        english.getColor().a=smooth((elapsed-.35f)/.9f)*fadeOut;
        tagline.getColor().a=smooth((elapsed-1.25f)/1.1f)*fadeOut;
        title.setOrigin(900,95);title.setFontScale(reduced?1:1+.018f*Math.min(1,elapsed/DURATION));
        stage.getViewport().apply();stage.act(paused?0:delta);stage.draw();
        if(elapsed>=DURATION)finished=true;
    }
    private static float smooth(float value){float t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);}
    void resize(int width,int height){stage.getViewport().update(width,height,true);}
    void cancel(){finished=true;}
    @Override public void close(){stage.dispose();titleFont.dispose();smallFont.dispose();}
}
