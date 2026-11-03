package com.erni.finalanswer.cursedcards;

import com.erni.finalanswer.gameplay.cursedcards.CursedCard;
import com.erni.finalanswer.network.RealtimeClient;
import com.google.gson.*;
import java.util.*;
import java.util.function.Consumer;

/**
 * Shared-screen adapter for a server-run THE CURSED CARDS match. It replays the server's public event log into the
 * table (each event exactly once, in order) and forwards the turn clock and the audience curse. The host screen never
 * receives hand values; it learns a card's value only when the server reveals it (a burnt pair, the final DEATH).
 */
public final class CursedCardsNetworkBridge implements AutoCloseable {
    private final RealtimeClient client;private final CursedCardsTable table;private final String room;
    private final Consumer<JsonObject> listener=this::receive;
    private String session="";private int applied=-1;private boolean started,cursedShown;private List<String> seats=List.of();

    public CursedCardsNetworkBridge(RealtimeClient client,CursedCardsTable table,JsonObject snapshot){
        this.client=client;this.table=table;room=snapshot.get("code").getAsString();client.addEventListener(listener);apply(snapshot);
    }
    private void receive(JsonObject event){JsonObject data=event.getAsJsonObject("payload");if(data!=null&&data.has("cursedCards"))apply(data);}
    private void apply(JsonObject snapshot){
        JsonObject c=snapshot.getAsJsonObject("cursedCards");if(c==null)return;
        String id=c.get("sessionId").getAsString();if(!id.equals(session)){session=id;applied=-1;started=cursedShown=false;}
        seats=new ArrayList<>();for(var e:c.getAsJsonArray("seats"))seats.add(e.getAsString());
        String phase=c.get("phase").getAsString();
        if(phase.equals("CURSE_VOTE")){table.networkCurseVote(true,c.get("voteEndsAt").getAsLong());return;}
        if(!c.has("events"))return;JsonArray events=c.getAsJsonArray("events");
        if(!started){started=true;
            List<Integer> ids=new ArrayList<>(),seatOf=new ArrayList<>();
            for(var e:events){var o=e.getAsJsonObject();if(o.get("type").getAsString().equals("dealt")){ids.add(o.get("card").getAsInt());seatOf.add(o.get("seat").getAsInt());}}
            table.startNetworkMatch(seats.size(),names(snapshot),c.get("deckSize").getAsInt());
            table.networkDealOrder(ids.stream().mapToInt(Integer::intValue).toArray(),seatOf.stream().mapToInt(Integer::intValue).toArray());}
        if(c.has("cursedPlayer")&&!cursedShown){cursedShown=true;table.networkCursed(seats.indexOf(c.get("cursedPlayer").getAsString()));}
        long offset=snapshot.has("serverTime")?snapshot.get("serverTime").getAsLong()-System.currentTimeMillis():0;
        if(c.has("turnDeadline"))table.networkTurnClock(c.get("turnReadyAt").getAsLong(),c.get("turnDeadline").getAsLong(),offset);
        for(var e:events){var o=e.getAsJsonObject();int seq=o.get("seq").getAsInt();if(seq<=applied)continue;applied=seq;replay(o);}
    }
    private void replay(JsonObject o){
        switch(o.get("type").getAsString()){
            case "dealt"->table.dealt(new CursedCard(o.get("card").getAsInt(),-1),o.get("seat").getAsInt());
            case "pair"->{CursedCard a=card(o.getAsJsonObject("a")),b=card(o.getAsJsonObject("b"));table.networkReveal(a.id(),a.value());table.networkReveal(b.id(),b.value());table.pairRemoved(o.get("seat").getAsInt(),a,b);}
            case "turn"->table.turnChanged(o.get("drawer").getAsInt(),o.get("source").getAsInt());
            case "transfer"->table.transferred(new CursedCard(o.get("card").getAsInt(),-1),o.get("from").getAsInt(),o.get("to").getAsInt());
            case "safe"->table.playerSafe(o.get("seat").getAsInt());
            case "timeout"->table.hud.toast("TIME — FATE CHOOSES");
            case "finished"->{table.networkReveal(o.get("death").getAsInt(),CursedCard.DEATH);List<Integer> alive=new ArrayList<>();for(var s:o.getAsJsonArray("survivors"))alive.add(s.getAsInt());table.finished(o.get("loser").getAsInt(),alive);}
            default->{}
        }
    }
    private static CursedCard card(JsonObject o){return new CursedCard(o.get("id").getAsInt(),o.get("value").getAsInt());}
    private String[] names(JsonObject snapshot){Map<String,String> byId=new HashMap<>();for(var p:snapshot.getAsJsonArray("players")){var o=p.getAsJsonObject();byId.put(o.get("id").getAsString(),(o.has("nickname")?o.get("nickname"):o.get("name")).getAsString().toUpperCase(Locale.ROOT));}
        String[] out=new String[seats.size()];for(int i=0;i<out.length;i++)out[i]=byId.getOrDefault(seats.get(i),"PLAYER "+(i+1));return out;}
    public String session(){return session;}
    /** Host ends the match and returns the room to the lobby. */
    public void end(){client.send("END_CARDS",Map.of("roomCode",room,"sessionId",session));}
    @Override public void close(){client.removeEventListener(listener);}
}
