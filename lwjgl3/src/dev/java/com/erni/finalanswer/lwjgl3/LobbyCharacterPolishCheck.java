package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.rooms.RoomSession;
import com.erni.finalanswer.screens.CageLobbyScreen;
import com.erni.finalanswer.ui.lobby.cages.*;
import java.util.ArrayList;

/** Real lobby plus transparent framing measurements, using exactly the production character draw calls. */
public final class LobbyCharacterPolishCheck {
    static final String[] IDS={"skeleton","ghost","zombie","dracula","pumpkin","plague_doctor","voodoo","puppeteer"};
    public static void main(String[] args){if(StartupHelper.startNewJvmIfRequired())return;var window=new Lwjgl3ApplicationConfiguration();window.setWindowedMode(1600,900);window.setTitle("Final Answer / character framing QA");window.disableAudio(true);window.setForegroundFPS(60);
        new Lwjgl3Application(new FinalAnswerGame(){
            final boolean interactive=Boolean.getBoolean("polish.interactive");RoomSession room;
            CageLobbyScreen preview;FrameBuffer framebuffer;SpriteBatch batch;CageCharacterPresentation.Settings settings;final CageCharacterPresentation framing=new CageCharacterPresentation();
            final float[] times={.4f,1,1.5f,2,3,4,5,7,9,12};long renderNanos;int renderSamples;float time;int shot;boolean capturing;final int[][] union=new int[8][4];
            @Override public void create(){super.create();preview=new CageLobbyScreen(this);setScreen(preview);var players=new ArrayList<RoomSession.Player>();for(int i=0;i<8;i++){players.add(new RoomSession.Player("qa"+i,IDS[i].replace('_',' '),false,IDS[i],"ONLINE",false,0));union[i]=new int[]{300,333,0,0};}
                room=new RoomSession("ABC123","THE WAITING ROOM",8,"standard","preview",false,players);preview.synchronize(room,"");settings=CageCharacterPresentation.Settings.load();framebuffer=new FrameBuffer(Pixmap.Format.RGBA8888,300,333,false);batch=new SpriteBatch();batch.setProjectionMatrix(new Matrix4().setToOrtho2D(0,0,300,333));}
            @Override public void render(){if(capturing)return;float delta=interactive?Math.min(.1f,Gdx.graphics.getDeltaTime()):1f/60;time+=delta;long drawStart=System.nanoTime();preview.draw(delta);if(time>=7){renderNanos+=System.nanoTime()-drawStart;renderSamples++;}
                if(interactive){if(Gdx.input.isKeyJustPressed(com.badlogic.gdx.Input.Keys.R)){preview.synchronize(null,"");preview.synchronize(room,"");}if(Gdx.input.isKeyJustPressed(com.badlogic.gdx.Input.Keys.ESCAPE))Gdx.app.exit();return;}
                if(shot<times.length&&time>=times[shot]){capturing=true;
                    var screen=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("polish.output")+"/lobby-"+shot+".png"),screen,-1,true);}finally{screen.dispose();}
                    for(int i=0;i<8;i++)measure(i);
                    if(Gdx.gl.glGetError()!=0)throw new AssertionError("Character polish GL error");shot++;
                    if(shot==7)Gdx.graphics.setWindowedMode(960,540);if(shot==8)Gdx.graphics.setWindowedMode(1024,768);capturing=false;
                    if(shot==times.length){var report=new StringBuilder("character,minX,minY,maxX,maxY,scale,brightness\n");for(int i=0;i<8;i++){System.out.println("FRAMING "+IDS[i]+" "+java.util.Arrays.toString(union[i]));var p=settings.profile(IDS[i]);report.append(IDS[i]);for(int value:union[i])report.append(',').append(value);report.append(',').append(p.scale).append(',').append(p.brightness).append('\n');}Gdx.files.absolute(System.getProperty("polish.output")+"/framing.csv").writeString(report.toString(),false,"UTF-8");System.out.println("IDLE_RENDER_CPU_MS="+(renderNanos/1e6/Math.max(1,renderSamples)));System.out.println("PASS: mixed character framing, original renderers, three resolutions and GL state");Gdx.app.exit();}
                }
            }
            void measure(int slot){framebuffer.begin();ScreenUtils.clear(0,0,0,0);batch.setTransformMatrix(new Matrix4());batch.begin();var before=new Matrix4(batch.getTransformMatrix());var beforeColor=new Color(batch.getColor());framing.draw(batch,preview.cages().cage(slot).character(),settings.profile(IDS[slot]),1,time);if(!java.util.Arrays.equals(before.val,batch.getTransformMatrix().val)||!beforeColor.equals(batch.getColor()))throw new AssertionError("Presentation leaked Batch state");batch.end();
                Pixmap pixels=ScreenUtils.getFrameBufferPixmap(0,0,300,333);try{
                    for(int y=0;y<333;y++)for(int x=0;x<300;x++)if((pixels.getPixel(x,y)&255)>100){int yy=y;union[slot][0]=Math.min(union[slot][0],x);union[slot][1]=Math.min(union[slot][1],yy);union[slot][2]=Math.max(union[slot][2],x);union[slot][3]=Math.max(union[slot][3],yy);}
                    if(shot==7 && (slot==5||slot==7))compareGrade(slot,pixels);
                    if(shot==7)PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("polish.output")+"/rig-"+IDS[slot]+".png"),pixels,-1,true);
                }finally{pixels.dispose();framebuffer.end();}
            }
            void compareGrade(int slot,Pixmap graded){
                var profile=settings.profile(IDS[slot]);float exposure=profile.exposure,contrast=profile.contrast;
                profile.exposure=profile.contrast=1;
                ScreenUtils.clear(0,0,0,0);batch.begin();framing.draw(batch,preview.cages().cage(slot).character(),profile,1,time);batch.end();
                profile.exposure=exposure;profile.contrast=contrast;
                Pixmap baseline=ScreenUtils.getFrameBufferPixmap(0,0,300,333);
                try{double oldSum=0,newSum=0;int count=0;
                    for(int y=0;y<333;y++)for(int x=0;x<300;x++){
                        int a=baseline.getPixel(x,y),b=graded.getPixel(x,y);
                        if((a&255)!=(b&255))throw new AssertionError("Grading changed alpha: "+IDS[slot]);
                        float before=((a>>>24)*.2126f+((a>>>16)&255)*.7152f+((a>>>8)&255)*.0722f);
                        float after=((b>>>24)*.2126f+((b>>>16)&255)*.7152f+((b>>>8)&255)*.0722f);
                        if((a&255)>230 && before>8 && before<100){oldSum+=before;newSum+=after;count++;}
                    }
                    double gain=newSum/oldSum;
                    if(count<100||gain<1.45)throw new AssertionError("Insufficient visibility gain: "+IDS[slot]+" "+gain);
                    System.out.println("VISIBILITY "+IDS[slot]+" shadow/midtone luminance gain="+gain+" pixels="+count+" alpha unchanged");
                    PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("polish.output")+"/before-"+IDS[slot]+".png"),baseline,-1,true);
                }finally{baseline.dispose();}
            }
            @Override public void dispose(){showMainMenu();preview.dispose();settings.dispose();batch.dispose();framebuffer.dispose();super.dispose();}
        },window);
    }
}
