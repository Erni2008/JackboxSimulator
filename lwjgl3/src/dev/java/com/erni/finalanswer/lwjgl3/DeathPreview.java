package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.deaths.DeathCause;
import com.erni.finalanswer.deaths.DeathRecipes;
import com.erni.finalanswer.deaths.DeathScreen;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;
import java.util.ArrayList;
import java.util.List;

/**
 * Dev preview of the death screen. Without options it plays all 32 deaths (8 characters × 4 causes); any key skips.
 * -Pdp.char=skeleton / -Pdp.cause=SHOT narrow it. -Pdp.capture=/abs/dir writes frames of each death and exits.
 */
public final class DeathPreview {
    public static void main(String[] args){
        String only=System.getProperty("dp.char",""),cause=System.getProperty("dp.cause",""),capture=System.getProperty("dp.capture","");
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("FINAL ANSWER / смерти персонажей");c.setWindowedMode(1600,900);c.setForegroundFPS(60);
        if(!capture.isEmpty())c.disableAudio(true);
        String[] names={"Skelly","Тыква","Доктор","Граф","Призрак","Вуду","Зомби","Кукловод"};
        new Lwjgl3Application(new Game(){
            CageLobby lobby;List<DeathScreen.Death> list=new ArrayList<>();int shot,frame;float[] at={1.2f,1.55f,1.75f,2.1f,2.7f,3.6f,4.6f};
            @Override public void create(){
                lobby=new CageLobby();
                for(DeathCause k:DeathCause.values())for(int i=0;i<8;i++){String ch=DeathRecipes.CHARACTERS[i];
                    if(!only.isEmpty()&&!only.equals(ch)||!cause.isEmpty()&&!cause.equals(k.name()))continue;list.add(new DeathScreen.Death(names[i],ch,k));}
                if(!capture.isEmpty()){runCapture();return;}
                open();
            }
            void open(){setScreen(new DeathScreen(list,lobby,true,()->{var old=getScreen();open();old.dispose();}));}
            void runCapture(){
                for(int d=0;d<list.size();d++){var death=list.get(d);var s=new DeathScreen(List.of(death),lobby,true,()->{});s.resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());
                    float t=0;int k=0;while(k<at.length){s.render(1/60f);t+=1/60f;if(t>=at[k]){grab(capture+"/"+death.characterId()+"_"+death.cause()+"_"+k+".png");k++;}}
                    s.dispose();}
                Gdx.app.exit();
            }
            void grab(String file){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                try{var px=p.getPixels();for(int i=3;i<px.limit();i+=4)px.put(i,(byte)255);PixmapIO.writePNG(Gdx.files.absolute(file),p,-1,true);}finally{p.dispose();}}
        },c);
    }
}
