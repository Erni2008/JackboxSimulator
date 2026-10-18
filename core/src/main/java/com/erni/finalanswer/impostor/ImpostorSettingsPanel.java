package com.erni.finalanswer.impostor;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.*;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.gameplay.impostor.ImpostorSettings;
import java.util.*;
import java.util.function.Consumer;

/** Host-lobby overlay; borrows font, owns its original artwork and one UI pixel. */
public final class ImpostorSettingsPanel extends Group implements Disposable {
    private final java.util.List<Texture> textures=new ArrayList<>();
    private final Table panel=new Table();
    private final TextField rounds,discussion,voting,clue;
    private final TextButton sound,effects,motion,apply;
    private final ImageButton open;
    private final Label error;
    private ImpostorSettings settings=ImpostorSettings.defaults();
    private final Consumer<ImpostorSettings> save;
    private boolean allowed;
    private Texture load(String path){Texture texture=new Texture(Gdx.files.internal(path));textures.add(texture);return texture;}
    public ImpostorSettingsPanel(BitmapFont font,Consumer<ImpostorSettings> save){
        this.save=save;setName("impostorSettingsPanel");setBounds(0,0,1920,1080);setTouchable(Touchable.childrenOnly);
        var openStyle=new ImageButton.ImageButtonStyle();
        openStyle.imageUp=new TextureRegionDrawable(load("ui/buttons/settings/settings_up.png"));openStyle.imageOver=new TextureRegionDrawable(load("ui/buttons/settings/settings_hover.png"));openStyle.imageDown=new TextureRegionDrawable(load("ui/buttons/settings/settings_pressed.png"));
        open=new ImageButton(openStyle);open.setName("openImpostorSettings");open.setBounds(1510,160,330,110);open.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor actor){if(allowed){populate();panel.setVisible(true);panel.toFront();}}});addActor(open);
        Pixmap pixmap=new Pixmap(1,1,Pixmap.Format.RGBA8888);pixmap.setColor(Color.WHITE);pixmap.fill();Texture pixel=new Texture(pixmap);pixmap.dispose();textures.add(pixel);
        var solid=new TextureRegionDrawable(pixel);panel.setBackground(solid.tint(new Color(.065f,.025f,.04f,.99f)));panel.setBounds(430,85,1060,900);panel.pad(28);panel.defaults().pad(5);addActor(panel);panel.setVisible(false);
        Label title=new Label("THE IMPOSTOR — ROOM SETTINGS",new Label.LabelStyle(font,Color.valueOf("E7C7A4")));panel.add(title).colspan(2).height(44).row();
        TextField.TextFieldStyle input=new TextField.TextFieldStyle(font,Color.valueOf("F2DDC6"),solid.tint(Color.WHITE),solid.tint(Color.valueOf("783B49")),new TextureRegionDrawable(load("ui/windows/create_room/field.png")));
        rounds=field("ROUNDS (1–3)","impostorSettingRounds",input,font);discussion=field("DISCUSSION SECONDS (5–300)","impostorSettingDiscussion",input,font);voting=field("VOTING SECONDS (5–120)","impostorSettingVoting",input,font);clue=field("CLUE SECONDS (5–120)","impostorSettingClue",input,font);
        var buttonStyle=new TextButton.TextButtonStyle();buttonStyle.font=font;buttonStyle.fontColor=Color.valueOf("F2DDC6");
        String[] files={"up","hover","pressed"};int[][] crops={{293,198,1191,483},{161,273,1208,452},{167,263,1198,456}};
        TextureRegionDrawable[] state=new TextureRegionDrawable[3];for(int i=0;i<3;i++){var t=load("ui/buttons/player_count/button_"+files[i]+".png");int[] c=crops[i];state[i]=new TextureRegionDrawable(new TextureRegion(t,c[0],c[1],c[2],c[3]));state[i].setMinWidth(0);state[i].setMinHeight(0);}
        buttonStyle.up=state[0];buttonStyle.over=state[1];buttonStyle.down=state[2];buttonStyle.disabled=state[0].tint(Color.GRAY);
        panel.add(new Label("SECRET WORD CATEGORY",new Label.LabelStyle(font,Color.valueOf("D6B9A4")))).left();panel.add(new Label("DEFAULT — existing word pool",new Label.LabelStyle(font,Color.valueOf("F2DDC6")))).row();
        sound=toggle("SOUND",buttonStyle,font);effects=toggle("VISUAL EFFECTS",buttonStyle,font);motion=toggle("REDUCED MOTION",buttonStyle,font);
        error=new Label("",new Label.LabelStyle(font,Color.valueOf("F5A3A3")));error.setWrap(true);panel.add(error).colspan(2).width(950).height(40).row();
        apply=new TextButton("APPLY SETTINGS",buttonStyle);apply.setName("applyImpostorSettings");apply.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor a){if(!allowed)return;try{save.accept(new ImpostorSettings(Integer.parseInt(rounds.getText()),Integer.parseInt(discussion.getText()),Integer.parseInt(voting.getText()),Integer.parseInt(clue.getText()),"DEFAULT",sound.isChecked(),effects.isChecked(),motion.isChecked()));}catch(IllegalArgumentException invalid){error.setText("Use the displayed ranges. Settings were not sent.");}}});
        TextButton close=new TextButton("CLOSE",buttonStyle);close.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor a){panel.setVisible(false);}});panel.add(apply).width(300).height(122);panel.add(close).width(300).height(122);
    }
    private TextField field(String label,String name,TextField.TextFieldStyle style,BitmapFont font){panel.add(new Label(label,new Label.LabelStyle(font,Color.valueOf("D6B9A4")))).left().width(550);TextField field=new TextField("",style);field.setName(name);field.setMaxLength(3);field.setAlignment(com.badlogic.gdx.utils.Align.center);field.setTextFieldFilter(new TextField.TextFieldFilter.DigitsOnlyFilter());panel.add(field).width(300).height(54).row();return field;}
    private TextButton toggle(String label,TextButton.TextButtonStyle style,BitmapFont font){panel.add(new Label(label,new Label.LabelStyle(font,Color.valueOf("D6B9A4")))).left();TextButton button=new TextButton("ON",style);button.addListener(new ChangeListener(){public void changed(ChangeEvent e,Actor a){button.setText(button.isChecked()?"ON":"OFF");}});panel.add(button).width(150).height(60).row();return button;}
    private void populate(){rounds.setText(""+settings.roundCount());discussion.setText(""+settings.discussionSeconds());voting.setText(""+settings.votingSeconds());clue.setText(""+settings.clueSeconds());sound.setChecked(settings.soundEnabled());effects.setChecked(settings.visualEffectsEnabled());motion.setChecked(settings.reducedMotion());sound.setText(sound.isChecked()?"ON":"OFF");effects.setText(effects.isChecked()?"ON":"OFF");motion.setText(motion.isChecked()?"ON":"OFF");error.setText("");}
    public void update(ImpostorSettings settings,boolean allowed){boolean changed=!settings.equals(this.settings);this.settings=settings;this.allowed=allowed;open.setVisible(allowed);apply.setDisabled(!allowed);if(!allowed)panel.setVisible(false);else if(changed){populate();error.setText("Settings saved by server.");}}
    public void status(String text){if(panel.isVisible())error.setText(text);}
    @Override public void dispose(){for(Texture texture:textures)texture.dispose();textures.clear();}
}
