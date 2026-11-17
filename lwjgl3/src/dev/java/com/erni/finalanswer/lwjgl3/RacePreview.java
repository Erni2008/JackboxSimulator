package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.math.Vector3;
import com.erni.finalanswer.race.*;

/** Obstacle race prototype: you (WASD + SPACE) against 5 bots. R restarts. -Psb.capture=dir -Psb.at=s,s simulates to each time and writes PNGs. */
public final class RacePreview {
    public static void main(String[] args){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("FINAL ANSWER / obstacle race prototype");
        c.setWindowedMode(Integer.getInteger("sb.width",1600),Integer.getInteger("sb.height",900));c.setForegroundFPS(120);c.useVsync(true);c.setBackBufferConfig(8,8,8,8,24,0,4);
        String capture=System.getProperty("sb.capture","");String[] at=System.getProperty("sb.at","").isEmpty()?new String[0]:System.getProperty("sb.at").split(",");
        new Lwjgl3Application(new ApplicationAdapter(){
            RaceGame game;RaceView view;RaceRunner me;SpriteBatch batch;BitmapFont big,small;int shot;final Vector3 v=new Vector3();
            String[] names={"Вы","Скелет","Дракула","Тыква","Вуду","Призрак"};
            void start(){if(view!=null)view.dispose();game=new RaceGame();for(int i=0;i<names.length;i++){var r=game.add("p"+i,names[i],"",i>0||!capture.isEmpty());if(i==0)me=r;}view=new RaceView(game.course);for(var r:game.runners)view.addRunner(r);view.resize(Gdx.graphics.getWidth(),Gdx.graphics.getHeight());}
            @Override public void create(){batch=new SpriteBatch();big=com.erni.finalanswer.ui.UiFonts.gothic(64);small=com.erni.finalanswer.ui.UiFonts.body(26);start();}
            @Override public void resize(int w,int h){view.resize(w,h);batch.getProjectionMatrix().setToOrtho2D(0,0,w,h);}
            @Override public void render(){
                if(!capture.isEmpty()){
                    if(shot>=at.length){Gdx.app.exit();return;}
                    float target=Float.parseFloat(at[shot]);while(game.clock<target){game.update(1/60f);view.render(1/60f,me);} // view.render advances smoothing
                    draw(0);Pixmap p=Pixmap.createFromFrameBuffer(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                    PixmapIO.writePNG(Gdx.files.absolute(capture+"/race_"+at[shot]+".png"),p,-1,true);p.dispose();shot++;return;}
                if(Gdx.input.isKeyJustPressed(Input.Keys.R))start();
                var in=Gdx.input;me.inX=(in.isKeyPressed(Input.Keys.A)?1:0)-(in.isKeyPressed(Input.Keys.D)?1:0);me.inZ=(in.isKeyPressed(Input.Keys.W)?1:0)-(in.isKeyPressed(Input.Keys.S)?1:0);
                if(in.isKeyJustPressed(Input.Keys.SPACE))me.jump=true;me.holdJump=in.isKeyPressed(Input.Keys.SPACE);
                float dt=Gdx.graphics.getDeltaTime();game.update(dt);draw(dt);
            }
            void draw(float dt){
                view.render(dt,me);int w=Gdx.graphics.getWidth(),h=Gdx.graphics.getHeight();batch.begin();
                for(var r:game.runners){v.set(r.pos).add(0,2.1f,0);view.project(v);if(v.z<1){small.setColor(r==me?new Color(1,.9f,.5f,1):Color.WHITE);var gl=new GlyphLayout(small,r.name);small.draw(batch,gl,v.x-gl.width/2,v.y+gl.height);}}
                small.setColor(Color.WHITE);
                if(game.clock<RaceGame.COUNTDOWN){int n=(int)Math.ceil(RaceGame.COUNTDOWN-.5f-game.clock);String s=n>0?String.valueOf(n):"ВПЕРЁД!";var gl=new GlyphLayout(big,s);big.draw(batch,gl,w/2f-gl.width/2,h*.62f);}
                float t=game.timeLeft();String clock=String.format("%d:%02d",(int)t/60,(int)t%60);var gl=new GlyphLayout(big,clock);big.draw(batch,gl,w/2f-gl.width/2,h-24);
                int i=1;for(var r:game.standings()){small.setColor(r==me?new Color(1,.9f,.5f,1):Color.WHITE);small.draw(batch,i+". "+r.name+(r.finished?"  ✓ "+String.format("%.1f",r.finishTime-RaceGame.COUNTDOWN):""),30,h-30-(i-1)*34);i++;}
                if(me.finished){var f=new GlyphLayout(big,"ФИНИШ!");big.draw(batch,f,w/2f-f.width/2,h*.55f);}
                batch.end();
            }
            @Override public void dispose(){view.dispose();batch.dispose();}
        },c);
    }
}
