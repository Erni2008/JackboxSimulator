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
    private final BitmapFont font;
    private List<Map<String,String>> history=List.of();
    private List<ImpostorParticipant> roster=List.of();
    EvidenceBoard(BitmapFont font){
        this.font=font;setName("impostorEvidenceBoard");setBounds(250,140,1260,340);setTouchable(Touchable.disabled);
        Pixmap image=new Pixmap(1,1,Pixmap.Format.RGBA8888);image.setColor(Color.WHITE);image.fill();pixel=new Texture(image);image.dispose();
        setBackground(new TextureRegionDrawable(pixel).tint(new Color(.025f,.015f,.022f,.94f)));pad(20);setVisible(false);
    }
    void update(List<ImpostorParticipant> players,List<Map<String,String>> rounds){
        if(roster.equals(players)&&history.equals(rounds))return;
        roster=List.copyOf(players);history=rounds.stream().map(Map::copyOf).toList();clearChildren();
        if(players.isEmpty()||rounds.isEmpty())return;
        add(label("ИСТОРИЯ ПОДСКАЗОК", "D8B688",.85f)).colspan(players.size()+1).height(42).row();
        add(label("РАУНД","AD998B",.65f)).width(110);
        float width=1080f/players.size();
        for(var player:players){Label name=label(player.player().name(),"E8D5B8",.8f);name.setEllipsis("...");add(name).width(width).height(44);}row();
        for(int r=0;r<rounds.size();r++){
            add(label(String.valueOf(r+1),"AD998B",.8f)).height(58);
            for(var player:players){Label word=label(rounds.get(r).getOrDefault(player.player().id(),"—"),"F3E4CC",1);word.setWrap(true);add(word).width(width).height(58);}row();
        }
    }
    boolean hasClues(){return !history.isEmpty();}
    private Label label(String text,String color,float scale){Label label=new Label(text,new Label.LabelStyle(font,Color.valueOf(color)));label.setAlignment(Align.center);label.setFontScale(scale);return label;}
    @Override public void close(){pixel.dispose();}
}
