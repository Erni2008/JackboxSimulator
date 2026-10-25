package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.utils.Align;
import com.erni.finalanswer.localization.Localization;
import com.erni.finalanswer.rooms.RoomSession;
import java.util.function.Function;

/** Nickname only at the musical accent. No frame, avatar, or additional role caption. */
final class IdentityReveal extends Group {
    private final Label name,shadow;
    private final VotingResources resources;
    private String shownName="";
    IdentityReveal(ImpostorAssets assets,VotingResources resources){
        this.resources=resources;setName("impostorIdentityReveal");setTouchable(Touchable.disabled);setSize(1000,210);setOrigin(500,105);setVisible(false);
        shadow=label("identityNameShadow","180B0B",3,47);
        name=label("identityName","E8D8B5",0,50);
    }
    private Label label(String id,String color,float x,float y){var label=new Label("",new Label.LabelStyle(resources.heading,Color.valueOf(color)));label.setName(id);label.setBounds(x,y,1000,110);label.setAlignment(Align.center);label.setFontScale(resources.fontScale);addActor(label);return label;}
    void identity(RoomSession.Player player,Function<RoomSession.Player,Actor> ignored,Localization texts){
        if(shownName.equals(player.name()))return;shownName=player.name();
        name.setText(shownName);shadow.setText(shownName);name.setFontScale(resources.fontScale);name.invalidate();
        float scale=resources.fontScale*Math.min(1,name.getWidth()/Math.max(1,name.getPrefWidth()));name.setFontScale(scale);shadow.setFontScale(scale);
    }
    void present(float progress,boolean dense,boolean reduced){
        float p=Math.max(0,Math.min(1,progress)),ease=1-(float)Math.pow(1-p,3);
        float size=dense?.76f:1;setScale(size*(reduced?1:.97f+.03f*ease));
        setPosition(460,dense?570:530);moveBy(0,reduced?0:12*(1-ease));getColor().a=p*p*(3-2*p);setVisible(p>0);
    }
    void reset(){setVisible(false);shownName="";}
}
