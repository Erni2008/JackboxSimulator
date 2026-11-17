package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.BufferUtils;
import com.badlogic.gdx.utils.ScreenUtils;


/** Plays the SYSTEM BREACH rules film in a window (loops; SPACE restarts). -Psb.capture=dir -Psb.at=s,s writes PNG frames and exits. */
public final class FinalSecondRulesPreview {
    public static void main(String[] args){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("FINAL ANSWER / THE FINAL SECOND / rules film");
        c.setWindowedMode(Integer.getInteger("sb.width",1600),Integer.getInteger("sb.height",900));c.setForegroundFPS(60);
        String capture=System.getProperty("sb.capture","");String[] at=System.getProperty("sb.at","").isEmpty()?new String[0]:System.getProperty("sb.at").split(",");
        new Lwjgl3Application(new ApplicationAdapter(){
            com.erni.finalanswer.finalsecond.FinalSecondRulesFilm film;int shot;
            @Override public void create(){film=new com.erni.finalanswer.finalsecond.FinalSecondRulesFilm();}
            @Override public void resize(int w,int h){film.resize(w,h);}
            @Override public void render(){
                if(!capture.isEmpty()){
                    if(shot>=at.length){Gdx.app.exit();return;}
                    film.seek(Float.parseFloat(at[shot]));film.render(0);
                    Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(capture+"/rules_"+at[shot]+".png"),p,-1,true);p.dispose();shot++;return;}
                if(Gdx.input.isKeyJustPressed(Input.Keys.SPACE)||film.done())film.seek(0);
                film.render(Gdx.graphics.getDeltaTime());
            }
            @Override public void dispose(){film.dispose();}
        },c);
    }
}
