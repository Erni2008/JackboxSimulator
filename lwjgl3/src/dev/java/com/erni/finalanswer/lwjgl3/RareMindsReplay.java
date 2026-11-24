package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.rareminds.RareMindsScreen;
import com.google.gson.*;
import java.util.*;

/**
 * Plays back a recorded RARE MINDS host stream (tools/dev/rare_minds_showcase.cjs) on the real host screen, in real
 * time: every snapshot is applied at the moment the host received it, the screen's clock is the server clock.
 * -Drm.stream=file; -Drm.frames=dir renders a fixed 30 fps frame sequence instead (for a video) and exits.
 */
public final class RareMindsReplay {
    record Ev(long at,JsonObject state){}
    public static void main(String[] a) throws Exception{
        List<Ev> evs=new ArrayList<>();
        for(String line:java.nio.file.Files.readAllLines(java.nio.file.Path.of(System.getProperty("rm.stream")))){if(line.isBlank())continue;var o=JsonParser.parseString(line).getAsJsonObject();if(o.getAsJsonObject("state").has("rareMinds"))evs.add(new Ev(o.get("at").getAsLong(),o.getAsJsonObject("state")));}
        String frames=System.getProperty("rm.frames","");
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / RARE MINDS / replay");c.setWindowedMode(1280,720);c.setForegroundFPS(frames.isEmpty()?60:0);c.useVsync(frames.isEmpty());
        new Lwjgl3Application(new Game(){
            RareMindsScreen s;int next;long t;Ev cur;int frame;
            /** server clock at replay time t: last snapshot's server time plus the time since it arrived */
            long now(){return cur.state.get("serverTime").getAsLong()+(t-cur.at);}
            @Override public void create(){cur=evs.get(0);t=cur.at;s=new RareMindsScreen(cur.state,this::now,x->{},()->{});setScreen(s);next=1;}
            @Override public void render(){
                t+=frames.isEmpty()?(long)(Gdx.graphics.getDeltaTime()*1000):33;
                while(next<evs.size()&&evs.get(next).at<=t){cur=evs.get(next++);s.apply(cur.state);}
                if(frames.isEmpty())super.render();else s.render(1/30f);
                if(!frames.isEmpty()){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());var px=p.getPixels();for(int i=3;i<px.limit();i+=4)px.put(i,(byte)255);
                    PixmapIO.writePNG(Gdx.files.absolute(String.format("%s/f%05d.png",frames,frame++)),p,1,true);p.dispose();}
                if(next>=evs.size()&&t>evs.get(evs.size()-1).at+1500)Gdx.app.exit();
            }
        },c);
    }
}
