package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.Group;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.utils.Align;

/** A single aggregate envelope; all textures and fonts remain owned by the screen scope. */
public final class SuspicionEnvelope extends Group {
    public enum State { HIDDEN, OPEN, CLOSED, SEALED }
    private final Image[] faces=new Image[3];
    private final Label progress;
    private State state=State.HIDDEN;
    private SuspicionSnapshot snapshot;
    private float elapsed;
    public SuspicionEnvelope(ImpostorAssets assets,BitmapFont font) {
        setName("suspicionEnvelope");setBounds(660,380,600,330);setOrigin(300,165);setVisible(false);
        ImpostorAsset[] keys={ImpostorAsset.ENVELOPE_OPEN,ImpostorAsset.ENVELOPE_CLOSED,ImpostorAsset.ENVELOPE_SEALED};
        for(int i=0;i<keys.length;i++) {
            var texture=assets.texture(keys[i]).orElse(null);
            if(texture==null)continue;
            Image face=new Image(texture);face.setName("envelope"+i);face.setBounds(60,50,480,480f*946/1662);
            faces[i]=face;addActor(face);
        }
        progress=new Label("",new Label.LabelStyle(font,Color.valueOf("E4D9C8")));
        progress.setName("suspicionProgress");progress.setAlignment(Align.center);progress.setFontScale(1.25f);
        progress.setBounds(0,0,600,40);addActor(progress);
    }
    public State state(){return state;}
    public boolean active(){return state!=State.HIDDEN;}
    public void clear(){state=State.HIDDEN;snapshot=null;setVisible(false);}
    public void accept(SuspicionSnapshot next) {
        boolean fresh=snapshot==null || !snapshot.sessionId().equals(next.sessionId()) || snapshot.round()!=next.round();
        if(fresh) {elapsed=0;state=State.OPEN;setVisible(true);}
        if(next.finalized() && (fresh || !snapshot.finalized())) {state=State.CLOSED;elapsed=0;setVisible(true);}
        snapshot=next;
        progress.setText("SUSPICIONS RECEIVED: "+next.submitted()+"/"+next.eligible());
        updateFaces();
    }
    public void update(float delta) {
        if(!active())return;
        if(Float.isFinite(delta))elapsed+=Math.max(0,delta);
        if(snapshot.finalized()) {
            state=elapsed<.35f?State.CLOSED:State.SEALED;
            setColor(1,1,1,Math.min(1,Math.max(0,(1.85f-elapsed)/.3f)));
            setScale(1);
            if(elapsed>=1.85f){state=State.HIDDEN;setVisible(false);}
        } else {
            float p=Math.min(1,elapsed/.25f);p=p*p*(3-2*p);
            setScale(.96f+.04f*p);setColor(1,1,1,p);
        }
        updateFaces();
    }
    private void updateFaces(){for(int i=0;i<faces.length;i++)if(faces[i]!=null)faces[i].setVisible(
        state==State.OPEN&&i==0 || state==State.CLOSED&&i==1 || state==State.SEALED&&i==2);}
}
