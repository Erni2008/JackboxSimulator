package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.rareminds.RareMindsScreen;
import com.google.gson.*;
import java.nio.file.*;

/**
 * RARE MINDS host screen on real public snapshots recorded by tools/dev/rare_minds_play.cjs (host-snapshots.json).
 * -Drm.snapshots=file -Drm.capture=dir writes one frame per recorded moment and exits.
 */
public final class RareMindsScreenPreview {
    public static void main(String[] a) throws Exception{
        JsonObject all=JsonParser.parseString(java.nio.file.Files.readString(Path.of(System.getProperty("rm.snapshots")))).getAsJsonObject();
        String cap=System.getProperty("rm.capture","");
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / RARE MINDS / host preview");c.setWindowedMode(1920,1080);c.disableAudio(true);
        String[] keys=all.keySet().stream().filter(k->all.get(k).isJsonObject()).toArray(String[]::new);
        new Lwjgl3Application(new Game(){
            int k,frames;long now;RareMindsScreen s;
            void load(){JsonObject snap=all.getAsJsonObject(keys[k]);now=snap.get("serverTime").getAsLong();if(s==null){s=new RareMindsScreen(snap,()->now,x->{},()->{});setScreen(s);}else s.apply(snap);frames=0;}
            @Override public void create(){load();}
            @Override public void render(){now+=16;super.render();
                if(++frames==150){if(!cap.isEmpty()){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());var px=p.getPixels();for(int i=3;i<px.limit();i+=4)px.put(i,(byte)255);PixmapIO.writePNG(Gdx.files.absolute(cap+"/host-"+keys[k]+".png"),p,-1,true);p.dispose();}
                    if(++k>=keys.length){if(!cap.isEmpty())Gdx.app.exit();k=0;}load();}}
        },c);
    }
}
