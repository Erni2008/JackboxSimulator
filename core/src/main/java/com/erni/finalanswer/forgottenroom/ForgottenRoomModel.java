package com.erni.finalanswer.forgottenroom;

import com.google.gson.*;
import java.util.*;

/** The host's read-only picture of the server's THE FORGOTTEN ROOM state (parsed once per update, never mutated by rendering). */
public final class ForgottenRoomModel {
    record Place(String id,float x,float y,String surface,String label){}
    record Obj(String id,String name,String slot,String size,boolean rotated,int variant,boolean lit,boolean light){}
    record Change(String type,String objectId,String name,String caption,Obj before,Obj after,List<String> slots,List<String> foundBy,List<String> closeBy){}
    record Row(String playerId,int rank,int points,int correct,int partial,boolean submitted){}

    public String session(){return session;}
    final String session,phase,background,roomName,difficulty;
    final long phaseStartedAt,phaseEndsAt,revealIntroMs,revealStepMs;
    final int guessLimit;
    final Map<String,Place> places=new LinkedHashMap<>();
    final List<Obj> objects=new ArrayList<>(),original=new ArrayList<>();
    final List<Change> changes=new ArrayList<>();
    final List<Row> results=new ArrayList<>();
    final List<String> seats=new ArrayList<>();final Set<String> submitted=new HashSet<>();
    final Map<String,String> names=new HashMap<>(),characters=new HashMap<>();

    ForgottenRoomModel(JsonObject snapshot){
        JsonObject f=snapshot.getAsJsonObject("forgottenRoom");
        session=str(f,"sessionId");phase=str(f,"phase");background=str(f,"background");roomName=str(f,"roomName");difficulty=str(f,"difficulty");
        phaseStartedAt=lng(f,"phaseStartedAt");phaseEndsAt=lng(f,"phaseEndsAt");revealIntroMs=lng(f,"revealIntroMs");revealStepMs=lng(f,"revealStepMs");
        guessLimit=f.has("guessLimit")?f.get("guessLimit").getAsInt():0;
        for(var e:arr(f,"places")){var o=e.getAsJsonObject();places.put(str(o,"id"),new Place(str(o,"id"),o.get("x").getAsFloat(),o.get("y").getAsFloat(),str(o,"surface"),str(o,"label")));}
        for(var e:arr(f,"objects"))objects.add(obj(e.getAsJsonObject()));
        for(var e:arr(f,"original"))original.add(obj(e.getAsJsonObject()));
        for(var e:arr(f,"seats"))seats.add(e.getAsString());
        for(var e:arr(f,"submitted"))submitted.add(e.getAsString());
        for(var e:arr(f,"changes")){var o=e.getAsJsonObject();
            changes.add(new Change(str(o,"type"),str(o,"object"),str(o,"name"),str(o,"caption"),o.has("before")&&o.get("before").isJsonObject()?obj(o.getAsJsonObject("before")):null,
                o.has("after")&&o.get("after").isJsonObject()?obj(o.getAsJsonObject("after")):null,strings(o,"slots"),strings(o,"foundBy"),strings(o,"closeBy")));}
        for(var e:arr(f,"results")){var o=e.getAsJsonObject();
            results.add(new Row(str(o,"playerId"),o.get("rank").getAsInt(),o.get("points").getAsInt(),o.get("correct").getAsInt(),o.get("partial").getAsInt(),o.get("submitted").getAsBoolean()));}
        for(var e:arr(snapshot,"players")){var o=e.getAsJsonObject();names.put(str(o,"id"),str(o,"name"));characters.put(str(o,"id"),str(o,"characterId"));}
    }
    /** Object records inside reveal changes carry no name/size; borrow them from the room lists. */
    private Obj obj(JsonObject o){
        String id=str(o,"id");Obj known=null;for(Obj k:objects)if(k.id().equals(id))known=k;if(known==null)for(Obj k:original)if(k.id().equals(id))known=k;
        String name=o.has("name")?str(o,"name"):known!=null?known.name():id,size=o.has("size")?str(o,"size"):known!=null?known.size():"MEDIUM";
        boolean light=o.has("light")?o.get("light").getAsBoolean():known!=null&&known.light();
        return new Obj(id,name,str(o,"slot"),size,o.get("rotated").getAsBoolean(),o.get("variant").getAsInt(),o.get("lit").getAsBoolean(),light);
    }
    String name(String player){return names.getOrDefault(player,"?");}
    private static String str(JsonObject o,String k){return o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsString():"";}
    private static long lng(JsonObject o,String k){return o.has(k)&&!o.get(k).isJsonNull()?o.get(k).getAsLong():0;}
    private static JsonArray arr(JsonObject o,String k){return o.has(k)&&o.get(k).isJsonArray()?o.getAsJsonArray(k):new JsonArray();}
    private static List<String> strings(JsonObject o,String k){List<String> out=new ArrayList<>();for(var e:arr(o,k))out.add(e.getAsString());return out;}
}
