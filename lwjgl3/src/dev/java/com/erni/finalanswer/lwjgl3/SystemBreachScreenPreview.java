package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.systembreach.host.SystemBreachHostScreen;
import com.erni.finalanswer.ui.lobby.cages.CageLobby;
import com.google.gson.*;
import java.util.*;

/**
 * Visual fixture for the SYSTEM BREACH host: a scripted stream shaped exactly like the server's public snapshot
 * (players + bounded event list + deadline). No gameplay rules live here; it only replays plausible public events.
 * -Psb.players=2..8, -Psb.phase=ACTIVE|RESULTS|FINISHED, -Psb.capture=dir (writes shots and exits), -Psb.long=1 (long names).
 */
public final class SystemBreachScreenPreview {
    public static void main(String[] args){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("FINAL ANSWER / SYSTEM BREACH / host");
        c.setWindowedMode(Integer.getInteger("sb.width",1600),Integer.getInteger("sb.height",900));c.setForegroundFPS(60);c.disableAudio(true);
        String capture=System.getProperty("sb.capture","");int count=Math.max(2,Math.min(8,Integer.getInteger("sb.players",8)));String phase=System.getProperty("sb.phase","ACTIVE");
        new Lwjgl3Application(new Game(){
            final String[] names=Boolean.getBoolean("sb.long")?new String[]{"Александра","Maximilian","Кристиночка","Vladislav","Евгения","Konstantin","Станислав","Bartholomew"}
                :new String[]{"Эрни","Алиса","Борис","Вика","Гоша","Даша","Женя","Лёша"};
            final String[] chars={"skeleton","plague_doctor","dracula","voodoo","zombie","pumpkin","ghost","puppeteer"};
            final int[] ap=new int[count],fw=new int[count];final boolean[] compromised=new boolean[count],recovering=new boolean[count];
            final List<JsonObject> events=new ArrayList<>();long seq,start=1_000_000,now=start,next=start+600;int step,shot;
            final long duration=300_000;SystemBreachHostScreen screen;CageLobby lobby;
            @Override public void create(){
                for(int i=0;i<count;i++){ap[i]=40+((i*37)%90);fw[i]=1;}
                lobby=new CageLobby();screen=new SystemBreachHostScreen(snapshot(),lobby,id->Gdx.app.exit());setScreen(screen);
            }
            void event(String type,int a,int t,int amount){JsonObject e=new JsonObject();e.addProperty("sequence",++seq);e.addProperty("at",now);e.addProperty("type",type);
                e.addProperty("attackerId",a<0?"":"p"+a);e.addProperty("targetId",t<0?"":"p"+t);e.addProperty("amount",amount);events.add(e);if(events.size()>32)events.removeFirst();}
            /** A repeating script of public events across rotating players. */
            void script(){
                int k=step++,a=k%count,t=(k*3+1)%count;if(t==a)t=(t+1)%count;
                switch(k%7){
                    case 0->{ap[a]+=15;event("CHALLENGE_SOLVED",-1,a,15);}
                    case 1->event("ATTACK_STARTED",a,t,0);
                    case 2->{int p=(k-1)%count,q=((k-1)*3+1)%count;if(q==p)q=(q+1)%count;int n=Math.min(20,ap[q]);ap[q]-=n;ap[p]+=n;compromised[q]=true;event("ATTACK_SUCCEEDED",p,q,n);}
                    case 3->{int q=((k-2)*3+1)%count,p=(k-2)%count;if(q==p)q=(q+1)%count;recovering[q]=true;event("RECOVERY_START",-1,q,0);}
                    case 4->{if(fw[a]<3&&ap[a]>=30){ap[a]-=30;fw[a]++;event("FIREWALL_UPGRADED",-1,a,fw[a]);}else{ap[a]+=10;event("CHALLENGE_SOLVED",-1,a,10);}}
                    case 5->{event("ATTACK_STARTED",a,t,0);}
                    default->{for(int i=0;i<count;i++)if(recovering[i]){recovering[i]=false;compromised[i]=false;event("RECOVERY_SUCCEEDED",-1,i,0);break;}
                        int p=(k-1)%count,q=((k-1)*3+1)%count;if(q==p)q=(q+1)%count;ap[p]=Math.max(0,ap[p]-5);event("ATTACK_FAILED",p,q,0);}
                }
            }
            JsonObject snapshot(){
                JsonObject sb=new JsonObject();sb.addProperty("sessionId","preview");sb.addProperty("phase",phase);sb.addProperty("serverTime",now);sb.addProperty("phaseStartedAt",start);
                sb.addProperty("deadline",phase.equals("ACTIVE")?start+duration:-1);sb.addProperty("lastEventSequence",seq);sb.addProperty("winnerId","");
                Integer[] order=new Integer[count];for(int i=0;i<count;i++)order[i]=i;Arrays.sort(order,(x,y)->ap[y]-ap[x]);
                JsonArray rows=new JsonArray();int rank=0;
                for(int i:order){JsonObject p=new JsonObject();p.addProperty("playerId","p"+i);p.addProperty("nickname",names[i]);p.addProperty("accessPoints",ap[i]);p.addProperty("firewallLevel",fw[i]);
                    p.addProperty("compromised",compromised[i]);p.addProperty("recovering",recovering[i]);p.addProperty("disconnected",count==8&&i==6);p.addProperty("rank",++rank);rows.add(p);}
                if(!phase.equals("ACTIVE"))sb.addProperty("winnerId","p"+order[0]);
                sb.add("players",rows);JsonArray ev=new JsonArray();for(var e:events)ev.add(e);sb.add("events",ev);
                JsonObject root=new JsonObject();root.add("systemBreach",sb);JsonArray players=new JsonArray();
                for(int i=0;i<count;i++){JsonObject p=new JsonObject();p.addProperty("id","p"+i);p.addProperty("name",names[i]);p.addProperty("characterId",chars[i]);players.add(p);}
                root.add("players",players);return root;
            }
            @Override public void render(){
                now+=capture.isEmpty()?(long)(Gdx.graphics.getDeltaTime()*1000):16;
                if(phase.equals("ACTIVE")&&now>=next){script();next=now+1400;}
                screen.apply(snapshot());super.render();
                if(!capture.isEmpty()){long[] at={2500,6100,9800};if(shot<at.length&&now-start>=at[shot]){grab(capture+"/sb-"+count+"-"+(++shot)+".png");if(shot==at.length)Gdx.app.exit();}}
            }
            void grab(String file){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());try{PixmapIO.writePNG(Gdx.files.absolute(file),p,-1,true);}finally{p.dispose();}}
            @Override public void dispose(){screen.dispose();lobby.dispose();super.dispose();}
        },c);
    }
}
