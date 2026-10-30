package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.Gdx;
import com.erni.finalanswer.network.RealtimeClient;
import com.google.gson.*;
import java.util.*;
import java.util.function.Consumer;
/** Desktop adapter: authoritative small snapshots over the existing authenticated WebSocket. */
final class LastCommandNetworkBridge implements AutoCloseable {
    private final RealtimeClient client;private final TheLastCommandMachine machine;
    private com.google.gson.JsonObject commandRound;private long serverTime,receivedAt;
    com.google.gson.JsonObject commandRound(){return commandRound;}long serverTime(){return serverTime;}long estimatedServerTime(){return serverTime+System.currentTimeMillis()-receivedAt;}
    void ready(){if(expanded&&commandRound!=null&&commandRound.has("awaitingReady")&&commandRound.get("awaitingReady").getAsBoolean())touch("CLIENT_READY","");}
    void visibility(boolean visible){if(expanded)touch("VISIBILITY",visible?"VISIBLE":"HIDDEN");}
    void touch(String action,String value){var payload=new java.util.LinkedHashMap<String,String>();payload.put("roomCode",room);payload.put("sessionId",session);payload.put("taskId",taskId);payload.put("element","TOUCH_PANEL");payload.put("action",action);payload.put("value",value);client.send("LAST_COMMAND_ACTION",payload);}
    private final String room,session;private String clockChallenge="";private String taskId="";private boolean expanded;private boolean applying;private long resetSequence=-1;
    private final Consumer<JsonObject> remote=this::receive;
    private final Consumer<PanelAction> local=this::send;
    LastCommandNetworkBridge(RealtimeClient client,TheLastCommandMachine machine,JsonObject snapshot){
        this.client=client;this.machine=machine;room=snapshot.get("code").getAsString();session=snapshot.getAsJsonObject("lastCommand").get("sessionId").getAsString();
        client.addEventListener(remote);machine.panel().addListener(local);receivePayload(snapshot);
    }
    private void receive(JsonObject event){JsonObject data=event.getAsJsonObject("payload");if(data!=null&&data.has("lastCommand"))receivePayload(data);else if(event.get("type").getAsString().equals("ERROR")&&(!data.has("code")||!data.get("code").getAsString().equals("RATE_LIMITED")))client.send("SYNC",Map.of());}
    private void receivePayload(JsonObject snapshot){
        var panel=snapshot.getAsJsonObject("lastCommand");if(!session.equals(panel.get("sessionId").getAsString()))return;
        receivedAt=System.currentTimeMillis();commandRound=panel.has("testRound")?panel.getAsJsonObject("testRound").deepCopy():null;if(commandRound!=null&&commandRound.has("winner")){String winner=commandRound.get("winner").getAsString(),name="HOST";if(snapshot.has("selfId")&&winner.equals(snapshot.get("selfId").getAsString()))name="YOU";else if(snapshot.has("players"))for(var player:snapshot.getAsJsonArray("players")){var entry=player.getAsJsonObject();if(entry.get("id").getAsString().equals(winner))name=entry.has("nickname")?entry.get("nickname").getAsString():entry.get("name").getAsString();}commandRound.addProperty("winnerName",name);}serverTime=snapshot.has("serverTime")?snapshot.get("serverTime").getAsLong():System.currentTimeMillis();
        if(panel.has("clockRttMs"))serverTime+=panel.get("clockRttMs").getAsLong()/2;
        expanded=panel.has("testRound")&&panel.getAsJsonObject("testRound").has("expanded");if(expanded)taskId=panel.getAsJsonObject("testRound").get("taskId").getAsString();
        if(panel.has("clockChallenge")){String nonce=panel.get("clockChallenge").getAsString();if(!nonce.isEmpty()&&!nonce.equals(clockChallenge)){clockChallenge=nonce;touch("CLOCK_SYNC",nonce);}}
        if(expanded){Set<String> required=new HashSet<>();for(var control:commandRound.getAsJsonArray("requiredMechanisms"))required.add(control.getAsString());machine.setCentralVisible(required.contains("BIG_BUTTON"));for(var control:machine.panel().controls())control.setVisible(required.contains(control.id().name()));if(machine.mechanisms()!=null)for(var id:new PanelElementId[]{PanelElementId.LEVER_MODULE,PanelElementId.HIDDEN_HATCH,PanelElementId.CODE_PANEL})machine.mechanisms().setVisible(id,required.contains(id.name()));}else{machine.setCentralVisible(true);for(var control:machine.panel().controls())control.setVisible(true);if(machine.mechanisms()!=null)for(var id:new PanelElementId[]{PanelElementId.LEVER_MODULE,PanelElementId.HIDDEN_HATCH,PanelElementId.CODE_PANEL})machine.mechanisms().setVisible(id,true);}
        applying=true;
        try{
            var last=panel.getAsJsonObject("lastAction");if(last.has("action")&&last.get("action").getAsString().equals("RESET")&&last.get("sequence").getAsLong()!=resetSequence){machine.panel().reset();resetSequence=last.get("sequence").getAsLong();}
            Set<String> locks=new HashSet<>(),held=new HashSet<>();for(var id:panel.getAsJsonArray("locked"))locks.add(id.getAsString());for(var id:panel.getAsJsonArray("held"))held.add(id.getAsString());
            boolean paused=expanded&&commandRound.has("paused")&&commandRound.get("paused").getAsBoolean();machine.setCentralLocked(paused||locks.contains("BIG_BUTTON"));
            for(var control:machine.panel().controls())control.setLocked(paused||locks.contains(control.id().name()));
            for(var id:new PanelElementId[]{PanelElementId.BIG_BUTTON,PanelElementId.SMALL_BUTTON_1,PanelElementId.SMALL_BUTTON_2,PanelElementId.SMALL_BUTTON_3,PanelElementId.SMALL_BUTTON_4}){
                if(held.contains(id.name()))machine.beginInteraction(id);else machine.endInteraction(id);
            }
            var modules=machine.mechanisms();if(modules!=null){modules.setLeverState(AdditionalMechanisms.LeverState.valueOf(panel.get("lever").getAsString()));modules.hatch().setOpen(panel.get("hatch").getAsBoolean());modules.code().setCode(panel.get("code").getAsString());if(expanded&&commandRound.get("taskType").getAsString().equals("HATCH"))modules.hatch().setNote(panel.has("hint")?panel.get("hint").getAsString():"");}
            machine.panel().adjuster().setAngle(panel.get("adjuster").getAsFloat());machine.panel().light().setColor(LightModule.State.valueOf(panel.get("light").getAsString()));
        }finally{applying=false;}Gdx.graphics.requestRendering();
    }
    private void send(PanelAction event){
        if(applying||event.cause()!=PanelAction.Cause.PLAYER)return;
        switch(event.kind()){
            case PRESSED->action(event.element(),"PRESS","");case RELEASED->action(event.element(),"RELEASE","");
            case LEVER_CHANGED,HATCH_CHANGED,LIGHT_CHANGED->action(event.element(),"SET",event.value());
            case ADJUSTER_CHANGED->action(event.element(),"SET",Integer.toString(Math.round(Float.parseFloat(event.value()))));
            case CODE_UPDATED->{var code=machine.mechanisms().code();action(PanelElementId.CODE_PANEL,"STEP",code.lastChangedIndex()+":"+(code.lastDirection()>0?"+1":"-1"));}
            default->{}
        }
    }
    private void action(PanelElementId element,String action,String value){var payload=new java.util.LinkedHashMap<String,String>();payload.put("roomCode",room);payload.put("sessionId",session);payload.put("element",element.name());payload.put("action",action);payload.put("value",value);if(expanded)payload.put("taskId",taskId);client.send("LAST_COMMAND_ACTION",payload);}
    void reset(){action(PanelElementId.CODE_PANEL,"RESET","");}
    void end(){client.send("END_LAST_COMMAND",Map.of("roomCode",room,"sessionId",session));}
    @Override public void close(){machine.panel().removeListener(local);client.removeEventListener(remote);}
}
