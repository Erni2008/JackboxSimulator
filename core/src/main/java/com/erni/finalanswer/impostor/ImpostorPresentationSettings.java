package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.*;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.*;
import com.badlogic.gdx.utils.Align;

/** On-demand local controls, not part of the ceremony composition. Owns one UI pixel only. */
final class ImpostorPresentationSettings extends Group implements AutoCloseable {
    private final Texture pixel;
    private final Table panel=new Table();
    ImpostorPresentationSettings(BitmapFont font,String title,String close){
        setName("impostorPresentationSettings");setBounds(0,0,1920,1080);setVisible(false);
        Pixmap map=new Pixmap(1,1,Pixmap.Format.RGBA8888);map.setColor(Color.WHITE);map.fill();pixel=new Texture(map);map.dispose();var solid=new TextureRegionDrawable(pixel);
        Image shade=new Image(solid.tint(new Color(0,0,0,.72f)));shade.setSize(1920,1080);shade.addListener(new ClickListener(){@Override public void clicked(InputEvent event,float x,float y){hidePanel();}});addActor(shade);
        panel.setBounds(625,270,670,540);panel.setBackground(solid.tint(Color.valueOf("1D141B")));panel.pad(28);addActor(panel);
        Label heading=new Label(title,new Label.LabelStyle(font,Color.valueOf("E8D8B5")));heading.setAlignment(Align.center);panel.add(heading).width(610).height(54).row();
        var style=new TextButton.TextButtonStyle();style.font=font;style.fontColor=Color.valueOf("D4B67E");style.overFontColor=Color.valueOf("FFF0D7");style.up=solid.tint(Color.valueOf("30212B"));
        TextButton done=new TextButton(close,style);done.addListener(new ChangeListener(){@Override public void changed(ChangeEvent event,Actor actor){hidePanel();}});panel.add(done).width(610).height(54).padTop(12).row();
    }
    void option(Label label){label.setAlignment(Align.center);panel.add(label).width(610).height(49).padTop(3).row();}
    void toggle(){setVisible(!isVisible());if(isVisible())toFront();}
    boolean hidePanel(){if(!isVisible())return false;setVisible(false);if(getStage()!=null)getStage().setKeyboardFocus(null);return true;}
    @Override public void close(){pixel.dispose();}
}
