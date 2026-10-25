package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import java.util.List;
import java.util.Map;

/** Public, already-revealed clues only. Rebuilds on data changes rather than frames. */
final class EvidenceBoard extends Table implements AutoCloseable {
    private final Texture pixel;
    private final BitmapFont font=com.erni.finalanswer.ui.UiFonts.body(30);
    private List<Map<String,String>> history=List.of();
    private List<ImpostorParticipant> roster=List.of();
    EvidenceBoard(BitmapFont borrowedHeadingFont){
        setName("impostorEvidenceBoard");setBounds(250,140,1260,350);setTouchable(Touchable.disabled);
        Pixmap image=new Pixmap(1,1,Pixmap.Format.RGBA8888);image.setColor(Color.WHITE);image.fill();pixel=new Texture(image);image.dispose();
        setBackground(new TextureRegionDrawable(pixel).tint(new Color(.025f,.015f,.022f,.94f)));pad(18);setVisible(false);
    }
    void update(List<ImpostorParticipant> players,List<Map<String,String>> rounds){
        if(roster.equals(players)&&history.equals(rounds))return;
        roster=List.copyOf(players);history=rounds.stream().map(Map::copyOf).toList();clearChildren();
        if(players.isEmpty()||rounds.isEmpty())return;
        add(label("ДОСЬЕ · РАСКРЫТЫЕ СЛОВА", "D8B688",.78f)).colspan(players.size()+1).height(38).row();
        Image rule=new Image(new TextureRegionDrawable(pixel));rule.setColor(.57f,.42f,.25f,.65f);add(rule).colspan(players.size()+1).height(1).fillX().padBottom(10).row();
        add(label("РАУНД","AD998B",.65f)).width(110);
        float width=1080f/players.size();
        for(var player:players){Label name=label(player.player().name(),"E8D5B8",.72f);name.setEllipsis("...");add(name).width(width).height(44);}row();
        for(int r=0;r<rounds.size();r++){
            add(label(String.format(java.util.Locale.ROOT,"%02d",r+1),"AD998B",.72f)).height(62);
            for(var player:players){String value=rounds.get(r).getOrDefault(player.player().id(),"—");
                Label word=label(value,"F3E4CC",.88f);word.setWrap(true);
                // Fit the exact public clue, including long Cyrillic words, rather than clipping it.
                float scale=.88f;word.setSize(width-16,58);word.validate();
                while((word.getPrefHeight()>54||word.getGlyphLayout().width>width-16)&&scale>.28f){scale-=.04f;word.setFontScale(scale);word.invalidate();word.validate();}
                Table cell=new Table();cell.setBackground(new TextureRegionDrawable(pixel).tint(new Color(.60f,.43f,.26f,r%2==0?.06f:.025f)));cell.add(word).width(width-16).height(58);
                add(cell).width(width).height(62);}row();
        }
    }
    boolean hasClues(){return !history.isEmpty();}
    private Label label(String text,String color,float scale){Label label=new Label(text,new Label.LabelStyle(font,Color.valueOf(color)));label.setAlignment(Align.center);label.setFontScale(scale);return label;}
    @Override public void close(){pixel.dispose();font.dispose();}
}
