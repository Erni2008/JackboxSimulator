package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.Image;
import com.badlogic.gdx.scenes.scene2d.ui.Label;
import com.badlogic.gdx.utils.Align;
import com.badlogic.gdx.utils.Disposable;
import com.erni.finalanswer.rooms.RoomSession;
import java.util.*;
import java.util.function.Function;

/** Isolated death presentation. Actors borrow the original character artwork, never gameplay state. */
final class ImpostorDeathWindow extends Group implements Disposable {
    static final float DURATION=3.2f;
    private final Texture pixel;
    private final Group portraits=new Group(){
        private final Color previous=new Color();
        @Override public void draw(com.badlogic.gdx.graphics.g2d.Batch batch,float parentAlpha){
            // Borrowed character renderers multiply the incoming batch color; do not inherit the dark panel tint.
            previous.set(batch.getColor());batch.setColor(1,1,1,1);
            try{super.draw(batch,parentAlpha);}finally{batch.setColor(previous);}
        }
    };
    private final Map<String,Group> characters=new LinkedHashMap<>();
    private final Map<String,ImpostorElimination> animations=new LinkedHashMap<>();
    private final Label nickname,status;
    private final Map<String,String> names=new LinkedHashMap<>();

    ImpostorDeathWindow(BitmapFont font){
        setName("impostorDeathWindow");setSize(1920,1080);setTouchable(Touchable.enabled);
        Pixmap image=new Pixmap(1,1,Pixmap.Format.RGBA8888);image.setColor(Color.WHITE);image.fill();
        pixel=new Texture(image);image.dispose();
        panel(0,0,1920,1080,new Color(.008f,.006f,.009f,1));
        panel(540,132,840,816,new Color(.16f,.035f,.045f,1));
        panel(543,135,834,810,new Color(.025f,.016f,.022f,1));
        addActor(portraits);
        nickname=label(font,750,835,420,52);nickname.setEllipsis("...");
        status=label(font,640,187,640,44);status.setFontScale(.8f);
        setVisible(false);
    }
    private void panel(float x,float y,float width,float height,Color color){
        Image image=new Image(pixel);image.setBounds(x,y,width,height);image.setColor(color);addActor(image);
    }
    private Label label(BitmapFont font,float x,float y,float width,float height){
        Label label=new Label("",new Label.LabelStyle(font,Color.valueOf("E5D6D0")));
        label.setBounds(x,y,width,height);label.setAlignment(Align.center);addActor(label);return label;
    }
    void roster(List<ImpostorParticipant> roster,Function<RoomSession.Player,Actor> factory){
        reset();portraits.clearChildren();characters.clear();animations.clear();names.clear();
        for(var participant:roster){
            var player=participant.player();Actor artwork=factory.apply(player);
            if(artwork==null||artwork.getWidth()<=0||artwork.getHeight()<=0)continue;
            Group portrait=new Group();float scale=Math.min(430/artwork.getWidth(),510/artwork.getHeight());
            portrait.setBounds(960-artwork.getWidth()*scale/2,300,artwork.getWidth(),artwork.getHeight());
            portrait.setScale(scale);artwork.setPosition(0,0);portrait.addActor(artwork);portrait.setVisible(false);
            portraits.addActor(portrait);characters.put(player.id(),portrait);
            animations.put(player.id(),new ImpostorElimination(portrait));names.put(player.id(),player.name());
        }
    }
    void present(String victim,float age,boolean reduced){
        boolean active=age>=0&&age<DURATION&&characters.containsKey(victim);setVisible(active);
        if(!active)return;
        for(var entry:characters.entrySet())entry.getValue().setVisible(entry.getKey().equals(victim));
        animations.get(victim).apply(age,reduced,0);
        nickname.setText(names.get(victim));
        status.setText(age<.6f?"ELIMINATED":age<1.5f?"BECOMING A GHOST":"A GHOST — STILL IN THE GAME");
        toFront();
    }
    void reset(){setVisible(false);for(var entry:animations.entrySet())entry.getValue().apply(-1,true,0);}
    @Override public void dispose(){reset();characters.clear();animations.clear();names.clear();pixel.dispose();}
}
