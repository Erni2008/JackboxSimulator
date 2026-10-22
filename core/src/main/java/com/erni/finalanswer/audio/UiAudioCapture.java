package com.erni.finalanswer.audio;

import com.badlogic.gdx.math.Vector2;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.Button;

/** Observes Scene2D input without consuming it or replacing existing button listeners. */
public final class UiAudioCapture extends InputListener {
    private final GameAudio audio;
    private final Vector2 point=new Vector2();
    public UiAudioCapture(GameAudio audio){this.audio=audio;}
    public void attach(Stage stage){if(!stage.getRoot().getCaptureListeners().contains(this,true))stage.addCaptureListener(this);}
    private Button button(Actor actor){while(actor!=null){if(actor instanceof Button b)return b;actor=actor.getParent();}return null;}
    @Override public void enter(InputEvent event,float x,float y,int pointer,Actor from){
        if(pointer!=-1)return;Button b=button(event.getTarget());if(b!=null&&!b.isDisabled()&&button(from)!=b)audio.hover();
    }
    @Override public boolean touchDown(InputEvent event,float x,float y,int pointer,int mouseButton){
        Button b=button(event.getTarget());if(b==null||b.isDisabled())return false;
        if(b.getClickListener().getButton()!=-1&&b.getClickListener().getButton()!=mouseButton)return false;
        // Scene2D sends releases directly to touch-focus listeners, bypassing ancestor capture.
        // Observe the same release before the original button action; do not consume its press.
        event.getStage().addTouchFocus(this,event.getListenerActor(),event.getTarget(),pointer,mouseButton);
        return false;
    }
    @Override public void touchUp(InputEvent event,float x,float y,int pointer,int mouseButton){
        if(event.isTouchFocusCancel())return;
        Button b=button(event.getTarget());if(b==null||b.isDisabled())return;
        var click=b.getClickListener();if(!click.isPressed()||click.getPressedPointer()!=pointer||click.getPressedButton()!=mouseButton)return;
        b.stageToLocalCoordinates(point.set(event.getStageX(),event.getStageY()));
        if(b.hit(point.x,point.y,true)!=null)audio.press();
    }
}
