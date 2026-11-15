package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.PixmapIO;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.screens.BalanceScreen;
import com.google.gson.JsonParser;

/** Dev preview of the between-games soul balance board. -Pbal.capture=/abs/file.png grabs the settled board and exits. */
public final class BalancePreview {
    public static void main(String[] args){
        String capture=System.getProperty("bal.capture","");
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("FINAL ANSWER / баланс душ");c.setWindowedMode(1600,900);c.setForegroundFPS(60);
        String json="{\"players\":[{\"name\":\"Тыква\",\"characterId\":\"pumpkin\",\"souls\":40},{\"name\":\"Skelly\",\"characterId\":\"skeleton\",\"souls\":120},"
            +"{\"name\":\"Призрак\",\"characterId\":\"ghost\",\"souls\":0},{\"name\":\"Доктор\",\"characterId\":\"plague_doctor\",\"souls\":75},"
            +"{\"name\":\"Граф\",\"characterId\":\"dracula\",\"souls\":40},{\"name\":\"Вуду\",\"characterId\":\"voodoo\",\"souls\":10}]}";
        new Lwjgl3Application(new Game(){
            float t;
            void open(){setScreen(new BalanceScreen(JsonParser.parseString(json).getAsJsonObject(),true,this::open));}
            @Override public void create(){open();}
            @Override public void render(){super.render();t+=Gdx.graphics.getDeltaTime();
                if(!capture.isEmpty()&&t>4.5f){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    var px=p.getPixels();for(int i=3;i<px.limit();i+=4)px.put(i,(byte)255);PixmapIO.writePNG(Gdx.files.absolute(capture),p,-1,true);p.dispose();Gdx.app.exit();}}
        },c);
    }
}
