package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.graphics.g2d.*;
import com.badlogic.gdx.graphics.glutils.FrameBuffer;
import com.badlogic.gdx.math.Matrix4;
import com.badlogic.gdx.utils.*;
import com.erni.finalanswer.FinalAnswerGame;
import com.erni.finalanswer.ui.play.QuestionPlayers;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;
import com.google.gson.*;

/** Actual eight rigs, shaders and draw-time effects: frozen slots must be pixel-identical. */
public final class QuestionPlayersRenderCheck {
    static final String[] IDS={"ghost","dracula","plague_doctor","puppeteer","skeleton","zombie","pumpkin","voodoo"};
    static void check(boolean value,String why){if(!value)throw new AssertionError(why);}
    static JsonObject snapshot(int count,int revision,int question,int submitted){
        var state=new JsonObject();state.addProperty("revision",revision);state.addProperty("gameId","test");state.addProperty("questionNumber",question);state.addProperty("phase","ANSWERING");state.addProperty("deadline",20000);
        var q=new JsonObject();q.addProperty("id","q"+question);state.add("question",q);var ids=new JsonArray();var rows=new JsonArray();
        for(int i=0;i<count;i++){ids.add("p"+i);var p=new JsonObject();p.addProperty("id","p"+i);p.addProperty("characterId",IDS[i]);p.addProperty("name",i==0?"ОченьДлинныйНикИгрока123":IDS[i]);p.addProperty("connectionStatus","ONLINE");p.addProperty("hasSubmittedAnswer",(submitted&(1<<i))!=0);rows.add(p);}state.add("participantIds",ids);state.add("players",rows);return state;
    }
    public static void main(String[] args){if(StartupHelper.startNewJvmIfRequired())return;var config=new Lwjgl3ApplicationConfiguration();config.setWindowedMode(1280,720);config.disableAudio(true);
        new Lwjgl3Application(new FinalAnswerGame(){
            CageLobby assets;SpriteBatch batch;FrameBuffer frame;Texture uiPixel;
            @Override public void create(){super.create();assets=new CageLobby();var pixel=new Pixmap(1,1,Pixmap.Format.RGBA8888);pixel.setColor(Color.WHITE);pixel.fill();uiPixel=new Texture(pixel);pixel.dispose();batch=new SpriteBatch();frame=new FrameBuffer(Pixmap.Format.RGBA8888,1600,200,false);batch.setProjectionMatrix(new Matrix4().setToOrtho2D(0,0,1600,200));
                for(int count:new int[]{2,4,6,8})test(count);System.out.println("PASS: actual 2/4/6/8 rigs, choice-timed shiver, 35 percent growth, independent post-answer idle, timer freeze, next-question reuse, state restoration and GL");Gdx.app.exit();}
            Pixmap capture(QuestionPlayers strip){frame.begin();ScreenUtils.clear(.025f,.02f,.025f,1);batch.begin();var transform=new Matrix4(batch.getTransformMatrix());var color=new Color(batch.getColor());strip.draw(batch,1);check(java.util.Arrays.equals(transform.val,batch.getTransformMatrix().val)&&color.equals(batch.getColor()),"Draw state restored");batch.end();var pixels=ScreenUtils.getFrameBufferPixmap(0,0,1600,200);frame.end();return pixels;}
            void test(int count){
                var strip=new QuestionPlayers(assets,uiPixel);strip.setBounds(0,0,1600,180);
                strip.synchronize(snapshot(count,1,1,0),0);strip.advance(.5f,false);Object rig=strip.character("p0");
                float initial=strip.animationTime("p0");check(!strip.shaking("p0"),"No shiver before choices");
                var before=capture(strip);strip.advance(.5f,false);var after=capture(strip);equal(before,after);before.dispose();after.dispose();
                strip.answersVisible(true);strip.advance(.3f,false);check(strip.shaking("p0")&&strip.animationTime("p0")==initial,"Choices begin shiver without playing authored idle");
                strip.synchronize(snapshot(count,2,1,1),500);strip.advance(.4f,false);
                check(strip.presentationScale("p0")==1&&strip.presentationScale("p1")==QuestionPlayers.THINKING_SCALE,"Answered character is 35 percent larger");
                check(!strip.shaking("p0")&&strip.shaking("p1"),"Accepted answer ends only its shiver");
                float playing=strip.animationTime("p0"),held=strip.animationTime("p1");before=capture(strip);strip.advance(.75f,false);after=capture(strip);
                check(strip.animationTime("p0")>playing&&strip.animationTime("p1")==held,"Only accepted rig starts its existing animation");
                int cell=(int)Math.min(240,1480f/count),left=(1600-cell*count)/2,changed=0;
                for(int y=0;y<200;y++)for(int x=left;x<left+cell;x++)if(before.getPixel(x,y)!=after.getPixel(x,y))changed++;
                check(changed>0,"Answered animation is visibly playing");
                PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("questionPlayers.output")+"/answer-status-"+count+".png"),after,-1,true);before.dispose();after.dispose();
                strip.synchronize(snapshot(count,3,1,(1<<count)-1),1000);strip.advance(.4f,false);after=capture(strip);
                PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("questionPlayers.output")+"/players-"+count+".png"),after,-1,true);after.dispose();
                float resetTime=strip.animationTime("p0");strip.answersVisible(false);strip.synchronize(snapshot(count,4,2,0),1000);strip.advance(.4f,false);
                check(strip.character("p0")==rig&&strip.animationTime("p0")==resetTime&&!strip.shaking("p0"),"Next question reuses rigs and waits for choices");
                strip.answersVisible(true);strip.advance(.3f,false);check(strip.shaking("p0"),"Next choice reveal starts shiver again");
                strip.synchronize(snapshot(count,5,2,0),20000);strip.advance(.4f,false);before=capture(strip);strip.advance(.5f,false);after=capture(strip);equal(before,after);before.dispose();after.dispose();
                var result=snapshot(count,6,2,(1<<count)-1);result.addProperty("phase","RESULTS");result.addProperty("phaseStartedAt",20000);var results=new JsonArray();var correct=new JsonObject();correct.addProperty("playerId","p0");correct.addProperty("isCorrect",true);correct.addProperty("answeredInTime",true);results.add(correct);result.add("results",results);
                strip.synchronize(result,20000);var immediate=capture(strip);int green=0;
                for(int y=130;y<175;y++)for(int x=left+cell/2;x<left+cell;x++){int rgb=immediate.getPixel(x,y);int r=rgb>>>24,g=(rgb>>>16)&255,b=(rgb>>>8)&255;if(g>180&&g>r*1.2f&&g>b*1.1f)green++;}
                check(green>20,"Correct check appears immediately");immediate.dispose();
                held=strip.animationTime("p0");strip.advance(.6f,false);check(strip.animationTime("p0")==held,"Results stop rig playback");after=capture(strip);
                PixmapIO.writePNG(Gdx.files.absolute(System.getProperty("questionPlayers.output")+"/correct-"+count+".png"),after,-1,true);after.dispose();
                strip.dispose();check(Gdx.gl.glGetError()==0,"No GL error");
            }
            void equal(Pixmap a,Pixmap b){for(int y=0;y<200;y++)for(int x=0;x<1600;x++)check(a.getPixel(x,y)==b.getPixel(x,y),"Frozen rig pixels changed");}
            @Override public void dispose(){frame.dispose();uiPixel.dispose();batch.dispose();assets.dispose();super.dispose();}
        },config);
    }
}
