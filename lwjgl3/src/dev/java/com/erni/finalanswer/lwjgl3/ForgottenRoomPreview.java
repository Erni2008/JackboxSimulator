package com.erni.finalanswer.lwjgl3;

import com.badlogic.gdx.*;
import com.badlogic.gdx.backends.lwjgl3.*;
import com.badlogic.gdx.graphics.*;
import com.badlogic.gdx.utils.ScreenUtils;
import com.erni.finalanswer.forgottenroom.ForgottenRoomScreen;
import com.erni.finalanswer.gameplay.forgottenroom.*;
import com.google.gson.*;
import java.util.*;

/**
 * Developer preview of THE FORGOTTEN ROOM host screen without a room server: a real seeded round from the shared
 * generator, shaped exactly like the server snapshot, played through every phase on a scripted clock.
 * {@code -Proom.capture=true} writes one PNG per phase into {@code -Proom.output} and exits; otherwise it loops.
 * Never part of production distributions.
 */
public final class ForgottenRoomPreview {
    private static Throwable failure;
    public static void main(String[] args){
        var c=new Lwjgl3ApplicationConfiguration();c.setTitle("Final Answer / THE FORGOTTEN ROOM / Preview");c.setWindowedMode(1920,1080);c.setForegroundFPS(60);c.setBackBufferConfig(8,8,8,8,16,0,4);
        boolean capture=Boolean.getBoolean("room.capture");String out=System.getProperty("room.output","/tmp");
        long seed=Long.getLong("room.seed",11);RoomDifficulty difficulty=RoomDifficulty.parse(System.getProperty("room.difficulty","MEDIUM"));
        new Lwjgl3Application(new Game(){
            final RoomGenerator.Round round=System.getProperty("room.layout","").isEmpty()?RoomGenerator.generate(seed,difficulty):RoomGenerator.generate(seed,difficulty,RoomCatalog.layout(System.getProperty("room.layout")));
            final String[] phases={"INTRO","OBSERVATION","BLACKOUT","CHANGED_ROOM","ANSWER_PHASE","REVEAL","RESULTS"};
            final long[] durations={4500,10000,1200,1500,20000,2500+4500L*round.changes().size(),-1};
            long now=0,phaseStart=0;int phase=0;ForgottenRoomScreen screen;int shot;
            // capture moments: phase index, seconds into the phase, file name
            final List<Object[]> shots=new ArrayList<>();
            @Override public void create(){try{
                shots.add(new Object[]{0,2.2f,"1-intro"});shots.add(new Object[]{1,3.5f,"2-observation"});shots.add(new Object[]{2,.6f,"3-blackout"});
                shots.add(new Object[]{3,1.2f,"4-lights-return"});shots.add(new Object[]{4,9f,"5-answering"});shots.add(new Object[]{5,1.4f,"6-reveal-title"});
                for(int i=0;i<round.changes().size();i++)shots.add(new Object[]{5,2.5f+4.5f*i+2.6f,"7-reveal-"+(i+1)});
                shots.add(new Object[]{6,3.4f,"8-results"});
                screen=new ForgottenRoomScreen(snapshot(),()->now,m->Gdx.app.exit());setScreen(screen);}catch(Throwable e){failure=e;Gdx.app.exit();}}
            @Override public void render(){try{
                now+=capture?16:(long)(Gdx.graphics.getDeltaTime()*1000);
                long d=durations[phase];
                if(d>0&&now-phaseStart>=d){phaseStart+=d;phase=Math.min(phases.length-1,phase+1);screen.apply(snapshot());}
                if(phase==4&&now-phaseStart>4000)screen.apply(snapshot()); // answers trickle in
                super.render();
                if(capture&&shot<shots.size()){Object[] s=shots.get(shot);
                    if((int)s[0]==phase&&now-phaseStart>=(long)((float)s[1]*1000)){grab((String)s[2]);shot++;}
                    if(shot>=shots.size())Gdx.app.exit();}
                if(!capture&&phase==6&&now-phaseStart>12000){phase=0;phaseStart=now;screen.apply(snapshot());}
            }catch(Throwable e){failure=e;Gdx.app.exit();}}
            void grab(String name){Pixmap p=ScreenUtils.getFrameBufferPixmap(0,0,Gdx.graphics.getBackBufferWidth(),Gdx.graphics.getBackBufferHeight());
                try{PixmapIO.writePNG(Gdx.files.absolute(out+"/"+name+".png"),p,-1,true);}finally{p.dispose();}}

            /** The server's snapshot shape for the host, for the current scripted phase. */
            JsonObject snapshot(){
                String ph=phases[phase];JsonObject f=new JsonObject();
                f.addProperty("sessionId","preview");f.addProperty("phase",ph);f.addProperty("phaseStartedAt",phaseStart);
                f.addProperty("phaseEndsAt",durations[phase]<0?-1:phaseStart+durations[phase]);f.addProperty("difficulty",difficulty.name());
                f.addProperty("room",round.layout().id());f.addProperty("background",round.layout().background());f.addProperty("roomName",round.layout().nameRu());
                f.addProperty("guessLimit",round.guessLimit());f.addProperty("revealIntroMs",2500);f.addProperty("revealStepMs",4500);
                JsonArray places=new JsonArray();for(var s:round.layout().slots()){JsonObject o=new JsonObject();o.addProperty("id",s.id());o.addProperty("x",s.x());o.addProperty("y",s.y());o.addProperty("surface",s.surface().name());o.addProperty("label",s.labelRu());places.add(o);}
                f.add("places",places);
                String[] players={"p0","p1","p2","p3"};JsonArray seats=new JsonArray();for(String p:players)seats.add(p);f.add("seats",seats);
                JsonArray submitted=new JsonArray();if(phase>4||phase==4&&now-phaseStart>4000){submitted.add("p1");submitted.add("p3");}if(phase>4){submitted.add("p0");submitted.add("p2");}f.add("submitted",submitted);
                f.add("objects",ph.equals("BLACKOUT")?new JsonArray():objects(phase<=1?round.original():round.changed()));
                if(phase>=5){f.add("original",objects(round.original()));JsonArray key=new JsonArray();int i=0;
                    for(var ch:round.changes()){JsonObject k=new JsonObject();k.addProperty("type",ch.type().name());k.addProperty("object",ch.objectId());k.addProperty("name",RoomCatalog.object(ch.objectId()).nameRu());
                        k.addProperty("caption",ch.captionRu());k.add("before",placed(ch.before()));k.add("after",placed(ch.after()));JsonArray sl=new JsonArray();ch.slots().forEach(sl::add);k.add("slots",sl);
                        JsonArray found=new JsonArray(),close=new JsonArray();if(i%2==0){found.add("p1");found.add("p3");}k.add("foundBy",found);k.add("closeBy",close);key.add(k);i++;}
                    f.add("changes",key);JsonArray rows=new JsonArray();int[] pts={3,2,1,0};String[] order={"p1","p3","p0","p2"};
                    for(int r=0;r<4;r++){JsonObject o=new JsonObject();o.addProperty("playerId",order[r]);o.addProperty("rank",r+1);o.addProperty("points",pts[r]);o.addProperty("correct",pts[r]);o.addProperty("partial",0);o.addProperty("wrong",0);o.addProperty("submitted",true);rows.add(o);}
                    f.add("results",rows);}
                JsonObject root=new JsonObject();root.add("forgottenRoom",f);root.addProperty("code","PREVIEW");
                JsonArray ps=new JsonArray();String[] names={"Алиса","Борис","Вика","Гоша"};for(int i=0;i<4;i++){JsonObject o=new JsonObject();o.addProperty("id",players[i]);o.addProperty("name",names[i]);o.addProperty("characterId",new String[]{"dracula","pumpkin","ghost","skeleton"}[i]);ps.add(o);}
                root.add("players",ps);return root;
            }
            JsonArray objects(RoomState st){JsonArray a=new JsonArray();for(var p:st.bySlot().values()){var d=RoomCatalog.object(p.objectId());JsonObject o=new JsonObject();
                o.addProperty("id",p.objectId());o.addProperty("name",d.nameRu());o.addProperty("slot",p.slotId());o.addProperty("size",d.size().name());o.addProperty("turn",d.turn().name());o.addProperty("rotated",p.rotated());
                o.addProperty("variant",p.variant());o.addProperty("lit",p.lit());o.addProperty("light",d.light());a.add(o);}return a;}
            JsonElement placed(RoomState.Placed p){if(p==null)return JsonNull.INSTANCE;JsonObject o=new JsonObject();o.addProperty("id",p.objectId());o.addProperty("slot",p.slotId());o.addProperty("rotated",p.rotated());o.addProperty("variant",p.variant());o.addProperty("lit",p.lit());return o;}
        },c);
        if(failure!=null){failure.printStackTrace();System.exit(1);}
    }
}
