package com.erni.finalanswer.impostor;

import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.scenes.scene2d.Touchable;
import com.badlogic.gdx.scenes.scene2d.ui.*;
import com.badlogic.gdx.scenes.scene2d.utils.TextureRegionDrawable;
import com.badlogic.gdx.utils.Align;
import com.erni.finalanswer.ui.UiFonts;

/** Public instructions only; one readable sentence at a time, below the characters. */
final class RoleSubtitles extends Table implements AutoCloseable {
    private final BitmapFont font=UiFonts.body(34),captionFont=UiFonts.body(16);
    private final Texture pixel;
    private final Label sentence;
    private final Image progress;
    private int index=-1;
    private float revealAge;
    private static final String[] LINES={"Карточки с ролями", "Перед вами — карточки с ролями.",
        "Внимательно прочитайте свою карточку.", "И помните: ваша роль должна остаться тайной."};
    RoleSubtitles(){
        Pixmap map=new Pixmap(1,1,Pixmap.Format.RGBA8888);map.setColor(Color.WHITE);map.fill();pixel=new Texture(map);map.dispose();
        setName("impostorRoleInstruction");setTouchable(Touchable.disabled);setBounds(250,150,1300,154);
        setBackground(new TextureRegionDrawable(pixel).tint(new Color(.018f,.012f,.016f,.91f)));
        pad(18,32,22,32);
        Label caption=new Label("Р А З Д А Ч А   Р О Л Е Й",new Label.LabelStyle(captionFont,Color.valueOf("C68A73")));
        add(caption).padBottom(13).row();
        sentence=new Label("",new Label.LabelStyle(font,Color.valueOf("F6EEE4")));sentence.setAlignment(Align.center);sentence.setWrap(true);
        add(sentence).width(1236).height(76);
        progress=new Image(new TextureRegionDrawable(pixel).tint(Color.valueOf("AE6655")));progress.setBounds(0,0,0,2);addActor(progress);setVisible(false);
    }
    void present(float position,boolean dealing,float delta,boolean reduced){
        progress.setWidth(getWidth()*Math.max(0,Math.min(1,position/8.64f)));
        int next=dealing?0:position<3.16f?1:position<5.65f?2:3;
        if(next!=index){index=next;sentence.setText(LINES[index]);revealAge=0;}
        revealAge+=Math.max(0,Math.min(delta,.1f));
        getColor().a=reduced?1:Math.min(1,revealAge/.18f);setVisible(true);
    }
    void large(boolean large){sentence.setFontScale(large?1.2f:1f);}
    void dismiss(){setVisible(false);index=-1;revealAge=0;}
    @Override public void close(){font.dispose();captionFont.dispose();pixel.dispose();}
}
