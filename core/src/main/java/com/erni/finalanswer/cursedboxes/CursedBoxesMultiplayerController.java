package com.erni.finalanswer.cursedboxes;

import com.erni.finalanswer.network.RealtimeClient;
import com.finalanswer.protocol.CursedBoxesProtocol;
import com.google.gson.*;
import java.util.*;
import java.util.function.Consumer;

/** Bridges authoritative jobs to the existing real animation; never owns models, textures or a socket. */
public final class CursedBoxesMultiplayerController implements AutoCloseable {
    private final CursedBoxesScreen scene;
    private final RealtimeClient connection;
    private final String sessionId,roomCode;
    private final Consumer<JsonObject> listener=this::event;
    private JsonObject state;
    private String localShot="",lastPlayer="",lastStatus="";
    private int lastRemaining=-1;
    private boolean started,impacted,completed,closed;
    private float retry,readyRetry;
    private final com.finalanswer.protocol.CursedSurvivorTimeline.Timings revealTimings=new com.finalanswer.protocol.CursedSurvivorTimeline.Timings();
    public CursedBoxesMultiplayerController(CursedBoxesScreen scene,RealtimeClient connection){
        this.scene=scene;this.connection=connection;
        JsonObject root=connection.snapshot();state=root.getAsJsonObject("cursedBoxes");sessionId=state.get("sessionId").getAsString();roomCode=root.get("code").getAsString();
        if(!root.get("host").getAsBoolean()||!state.has("hostContents"))throw new IllegalStateException("Only authenticated host may render hidden contents");
        scene.multiplayer(this);scene.networkRules(state.get("shotLimit").getAsInt());
        for(CrateSlot box:scene.slots){box.character=null;box.occupantNickname=null;box.occupantPlayerId=null;}
        connection.addEventListener(listener);apply();send("CURSED_SCENE_READY",Map.of());
    }
    private void applyContents(){
        for(JsonElement element:state.getAsJsonArray("hostContents")){
            var person=element.getAsJsonObject();CrateSlot box=scene.slots[person.get("boxId").getAsInt()];
            box.character=CursedCharacterType.valueOf(person.get("characterId").getAsString().toUpperCase(Locale.ROOT));box.occupantNickname=person.get("nickname").getAsString();box.occupantPlayerId=person.get("playerId").getAsString();
        }
    }
    private void send(String type,Map<String,?> extra){
        if(!connection.connected())return;
        Map<String,Object> payload=new HashMap<>(extra);payload.put("roomCode",roomCode);payload.put("sessionId",sessionId);connection.send(type,payload);
    }
    private void event(JsonObject event){
        JsonObject root=event.getAsJsonObject("payload");
        if(root.has("cursedBoxes")&&sessionId.equals(root.getAsJsonObject("cursedBoxes").get("sessionId").getAsString())){state=root.getAsJsonObject("cursedBoxes");apply();}
    }
    private boolean finalPhase(){String phase=state.get("phase").getAsString();return phase.equals("REVEALING")||phase.equals("FINISHED");}
    private void applyReveal(){
        if(!finalPhase()||scene.networkBusy()||!state.has("survivors"))return;
        int mask=0;
        for(JsonElement e:state.getAsJsonArray("survivors")){
            var person=e.getAsJsonObject();int box=person.get("boxId").getAsInt();
            if(box<0||box>=16||!person.get("playerId").getAsString().equals(scene.slots[box].occupantPlayerId))throw new IllegalStateException("Mismatched authoritative survivor assignment");
            mask|=1<<box;
        }
        var t=revealTimings;
        if(state.has("revealTimings")){var j=state.getAsJsonObject("revealTimings");t.anticipation=j.get("anticipation").getAsFloat();t.smoke=j.get("smoke").getAsFloat();t.panel=j.get("panel").getAsFloat();t.character=j.get("character").getAsFloat();t.idle=j.get("idle").getAsFloat();t.gap=j.get("gap").getAsFloat();}
        scene.networkSurvivors(mask,Math.max(0,(connection.serverNow()-state.get("revealStartedAt").getAsLong())/1000f),t);
    }
    private void apply(){
        applyContents();
        int destroyed=state.get("destroyedCrateIds").getAsInt();
        for(int i=0;i<16;i++)if((destroyed&(1<<i))!=0)scene.networkReveal(i);
        applyReveal();
        String player=state.get("activePlayerName").getAsString();
        String status=!connection.connected()?"RECONNECTING — SHOTS SAVED":!state.get("hostReady").getAsBoolean()?"PREPARING / RESTORING THE GALLERY":!state.get("activePlayerOnline").getAsBoolean()?"WAITING FOR PLAYER TO RECONNECT":state.get("phase").getAsString().equals("REVEALING")?"SURVIVOR REVEAL / WATCH THE SHELF":state.get("phase").getAsString().equals("FINISHED")?"SURVIVORS REVEALED / ESC RETURN TO LOBBY":state.get("phase").getAsString().equals("HIDING_SELECTION")?"HIDING PLAYERS / CHOOSE YOUR SECRET BOX":state.has("pendingShot")?"FIRING — WATCH THE TARGET":"SELECT A BOX ON YOUR PHONE";
        int remaining=state.get("shotsRemaining").getAsInt();
        if(!player.equals(lastPlayer)||!status.equals(lastStatus)||remaining!=lastRemaining){lastPlayer=player;lastStatus=status;lastRemaining=remaining;scene.networkStatus(player,status,remaining);}
    }
    public void update(float dt){
        if(closed)return;retry+=dt;readyRetry+=dt;
        if(!connection.connected()){apply();return;}
        if(finalPhase()){applyReveal();return;}
        if(!state.get("hostReady").getAsBoolean()){
            if(readyRetry>=1){readyRetry=0;send("CURSED_SCENE_READY",Map.of());}return;
        }
        if(!state.get("hidingLocked").getAsBoolean())return;
        if(state.has("pendingShot")){
            JsonObject job=state.getAsJsonObject("pendingShot");String id=job.get("id").getAsString();
            if(!id.equals(localShot)){
                if(scene.networkBusy())return;
                localShot=id;retry=0;started=impacted=completed=false;
                if(job.get("impactedAt").getAsLong()>0){started=impacted=completed=true;}
                else scene.networkShot(job.get("playerId").getAsString(),state.get("shotsRemaining").getAsInt()+1,state.get("destroyedCrateIds").getAsInt(),job.get("boxId").getAsInt());
            }
            if(retry>=.15f){
                retry=0;long now=connection.serverNow(),at=job.get("startedAt").getAsLong();
                if(started&&at==0)send("CURSED_SHOT_STARTED",Map.of("shotId",localShot));
                else if(impacted&&job.get("impactedAt").getAsLong()==0&&at>0&&now>=at+CursedBoxesProtocol.IMPACT_MILLIS)send("CURSED_SHOT_IMPACT",Map.of("shotId",localShot));
                else if(completed&&job.get("impactedAt").getAsLong()>0&&now>=at+CursedBoxesProtocol.SHOT_MILLIS)send("CURSED_SHOT_COMPLETE",Map.of("shotId",localShot));
            }
        }else if(!scene.networkBusy()){
            scene.networkTurn(state.get("activePlayerId").getAsString(),state.get("shotsRemaining").getAsInt(),state.get("destroyedCrateIds").getAsInt(),state.get("selectedCrateId").getAsInt());
            scene.networkAim(state.get("selectedCrateId").getAsInt());
        }
    }
    public boolean canStartShot(){return connection.connected()&&state.get("hostReady").getAsBoolean()&&state.has("pendingShot")&&localShot.equals(state.getAsJsonObject("pendingShot").get("id").getAsString());}
    public void shotStarted(){started=true;retry=.15f;send("CURSED_SHOT_STARTED",Map.of("shotId",localShot));}
    public void shotImpacted(){impacted=true;retry=.15f;}
    public void shotCompleted(){completed=true;retry=.15f;}
    @Override public void close(){if(closed)return;closed=true;connection.removeEventListener(listener);}
}
