package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.Gdx;
import com.erni.finalanswer.network.RealtimeClient;
import com.google.gson.*;
import java.util.*;
import java.util.function.Consumer;
/** Desktop adapter: authoritative small snapshots over the existing authenticated WebSocket. */
final class LastCommandNetworkBridge implements AutoCloseable {
    private final RealtimeClient client;private final TheLastCommandMachine machine;
    private final String room,session;private boolean applying;private long resetSequence=-1;
    private final Consumer<JsonObject> remote=this::receive;
    private final Consumer<PanelAction> local=this::send;
    LastCommandNetworkBridge(RealtimeClient client,TheLastCommandMachine machine,JsonObject snapshot){
        this.client=client;this.machine=machine;room=snapshot.get("code").getAsString();session=snapshot.getAsJsonObject("lastCommand").get("sessionId").getAsString();
        client.addEventListener(remote);machine.panel().addListener(local);receivePayload(snapshot);
    }
    private void receive(JsonObject event){JsonObject data=event.getAsJsonObject("payload");if(data!=null&&data.has("lastCommand"))receivePayload(data);else if(event.get("type").getAsString().equals("ERROR")&&(!data.has("code")||!data.get("code").getAsString().equals("RATE_LIMITED")))client.send("SYNC",Map.of());}
    private void receivePayload(JsonObject snapshot){
        var panel=snapshot.getAsJsonObject("lastCommand");if(!session.equals(panel.get("sessionId").getAsString()))return;
        applying=true;
        try{
            var last=panel.getAsJsonObject("lastAction");if(last.has("action")&&last.get("action").getAsString().equals("RESET")&&last.get("sequence").getAsLong()!=resetSequence){machine.panel().reset();resetSequence=last.get("sequence").getAsLong();}
            Set<String> locks=new HashSet<>(),held=new HashSet<>();for(var id:panel.getAsJsonArray("locked"))locks.add(id.getAsString());for(var id:panel.getAsJsonArray("held"))held.add(id.getAsString());
            machine.setCentralLocked(locks.contains("BIG_BUTTON"));
            for(var control:machine.panel().controls())control.setLocked(locks.contains(control.id().name()));
            for(var id:new PanelElementId[]{PanelElementId.BIG_BUTTON,PanelElementId.SMALL_BUTTON_1,PanelElementId.SMALL_BUTTON_2,PanelElementId.SMALL_BUTTON_3,PanelElementId.SMALL_BUTTON_4}){
                if(held.contains(id.name()))machine.beginInteraction(id);else machine.endInteraction(id);
            }
            var modules=machine.mechanisms();if(modules!=null){modules.setLeverState(AdditionalMechanisms.LeverState.valueOf(panel.get("lever").getAsString()));modules.hatch().setOpen(panel.get("hatch").getAsBoolean());modules.code().setCode(panel.get("code").getAsString());}
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
    private void action(PanelElementId element,String action,String value){client.send("LAST_COMMAND_ACTION",Map.of("roomCode",room,"sessionId",session,"element",element.name(),"action",action,"value",value));}
    void reset(){action(PanelElementId.CODE_PANEL,"RESET","");}
    void end(){client.send("END_LAST_COMMAND",Map.of("roomCode",room,"sessionId",session));}
    @Override public void close(){machine.panel().removeListener(local);client.removeEventListener(remote);}
}
