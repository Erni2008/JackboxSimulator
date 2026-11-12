package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.finalsecond.FinalSecondScreen;
import com.google.gson.*;

/**
 * THE FINAL SECOND host screen without a server: a scripted round (4 players, one eliminated) shaped exactly like the
 * server snapshot. {@code -Dfs.capture=dir} writes one frame per moment and exits; otherwise it loops.
 */
public final class FinalSecondScreenPreview {
    public static void main(String[] a){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / THE FINAL SECOND / host preview");c.setWindowedMode(1600,900);c.setForegroundFPS(60);c.disableAudio(true);
        String cap=System.getProperty("fs.capture","");
        new Lwjgl3Application(new Game(){
            final String[] ph={"INTRO","TARGET","COUNTDOWN","RUNNING","REVEAL","RESULTS"};final long[] dur={3000,3500,3000,9000,2200+2600*4,-1};
            long now=0,start=0;int i;FinalSecondScreen s;int shot;
            final Object[][] shots={{0,1.6f,"1-intro"},{1,1.2f,"2-target"},{2,1.3f,"3-count"},{3,1.5f,"4-run-visible"},{3,5.2f,"5-run-hidden"},{4,1.2f,"6-reveal-intro"},{4,3.6f,"7-reveal-worst"},{4,4.4f,"8-reveal-malfunction"},{4,11.6f,"9-reveal-best"},{5,3.2f,"10-results"}};
            @Override public void create(){s=new FinalSecondScreen(snap(),()->now,x->{});setScreen(s);}
            @Override public void render(){
                now+=cap.isEmpty()?(long)(Gdx.graphics.getDeltaTime()*1000):16;
                if(dur[i]>0&&now-start>=dur[i]){start+=dur[i];i=Math.min(ph.length-1,i+1);}s.apply(snap());
                super.render();
                if(!cap.isEmpty()&&shot<shots.length&&(int)shots[shot][0]==i&&now-start>=(long)((float)shots[shot][1]*1000)){grab((String)shots[shot][2]);if(++shot>=shots.length)Gdx.app.exit();}
                if(cap.isEmpty()&&i==5&&now-start>8000){i=0;start=now;}
            }
            void grab(String n){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(cap+"/"+n+".png"),p,-1,true);}finally{p.dispose();}}
            JsonObject snap(){
                JsonObject f=new JsonObject();f.addProperty("sessionId","p");f.addProperty("phase",ph[i]);f.addProperty("phaseStartedAt",start);f.addProperty("phaseEndsAt",dur[i]<0?-1:start+dur[i]);
                boolean chain=Boolean.getBoolean("fs.chain");boolean blind=chain||Boolean.getBoolean("fs.blind")||(System.getProperty("fs.capture","").isEmpty()&&(start/30000)%2==1);f.addProperty("task",chain?"CHAIN":blind?"BLIND":"NORMAL");f.addProperty("manualStart",true);f.addProperty("targetMs",chain?2000:7000);f.addProperty("visibleMs",blind?0:3000);f.addProperty("blind",blind);f.addProperty("revealIntroMs",2200);f.addProperty("revealStepMs",2600);
                String[] ids={"a","b","c","d"};JsonArray seats=new JsonArray();for(String id:ids)seats.add(id);f.add("seats",seats);
                long runStart=3000+3500+3000;if(i>=3)f.addProperty("runStart",runStart);
                JsonArray started=new JsonArray();if(i>=3)for(String id:ids)started.add(id);f.add("started",started);
                long passed=Math.max(0,now-runStart);int turn=(int)(passed/1800);f.addProperty("pressCount",i>=3?turn*2+(passed%1800>600?1:0):0);
                if(chain){f.addProperty("activePlayer",ids[turn%4]);f.addProperty("turnId",turn+1);f.addProperty("turnRunning",i==3&&passed%1800>600);f.addProperty("maxTurnMs",2000);}
                JsonArray st=new JsonArray();long el=now-runStart;if(i>3||el>6400)st.add("b");if(i>3||el>6900)st.add("a");if(i>3||el>7500)st.add("c");if(i>3)st.add("d");f.add("stopped",st);
                if(i>=4){JsonArray rs=new JsonArray();Object[][] r={{"a",6980,20,1,false},{"b",7050,50,2,false},{"c",7420,420,3,false},{"d",8310,1310,4,true}};
                    for(Object[] x:r){JsonObject o=new JsonObject();o.addProperty("playerId",(String)x[0]);o.addProperty("stoppedMs",chain?((boolean)x[4]?2050:800+(int)x[3]*250):(int)x[1]);o.addProperty("errorMs",chain?((boolean)x[4]?50:0):(int)x[2]);o.addProperty("rank",chain?((boolean)x[4]?2:1):(int)x[3]);o.addProperty("stopped",true);o.addProperty("eliminated",(boolean)x[4]);rs.add(o);}
                    if(chain){f.addProperty("chainTotalMs",2050);f.addProperty("lossReason","LIMIT");f.addProperty("loserId","d");}f.add("results",rs);}
                JsonObject root=new JsonObject();root.add("finalSecond",f);JsonArray ps=new JsonArray();String[] n={"Алиса","Борис","Вика","Гоша"},ch={"ghost","dracula","pumpkin","skeleton"};
                for(int k=0;k<4;k++){JsonObject o=new JsonObject();o.addProperty("id",ids[k]);o.addProperty("name",n[k]);o.addProperty("characterId",ch[k]);ps.add(o);}root.add("players",ps);return root;
            }
        },c);
    }
}
