package com.finalanswer.server.rooms;
import com.google.gson.JsonObject;
import com.finalanswer.protocol.Protocol;
import java.util.*;
/** Authoritative lightweight panel state. Never references libGDX or sends model/texture data. */
public final class LastCommandSession {
    final String id=UUID.randomUUID().toString();final long seed;
    private final Map<String,Set<String>> held=new LinkedHashMap<>();
    private final Set<String> locked=new HashSet<>();
    private final LinkedHashSet<String> requests=new LinkedHashSet<>();
    private final ArrayDeque<Map<String,Object>> history=new ArrayDeque<>();
    private final int[] digits=new int[4];private int lever,adjuster;private String light="OFF";private boolean hatch;
    private long sequence;private Map<String,Object> lastAction=Map.of();
    private static final Set<String> IDS=Set.of("BIG_BUTTON","SMALL_BUTTON_1","SMALL_BUTTON_2","SMALL_BUTTON_3","SMALL_BUTTON_4","LEVER_MODULE","ADJUSTER","LIGHT_MODULE","HIDDEN_HATCH","CODE_PANEL");
    LastCommandSession(long seed){this.seed=seed;}
    boolean action(String actor,boolean host,String requestId,JsonObject data){
        if(!data.keySet().equals(Set.of("roomCode","sessionId","element","action","value"))||requestId.isBlank())throw new RoomService.Failure(400,"INVALID_LAST_COMMAND_ACTION");
        String key=actor+":"+requestId;if(requests.contains(key))return false;
        String element=Protocol.string(data,"element"),action=Protocol.string(data,"action"),value=Protocol.string(data,"value");
        if(!IDS.contains(element)||value.length()>32)throw new RoomService.Failure(400,"INVALID_LAST_COMMAND_ACTION");
        if(locked.contains(element)&&!action.equals("RELEASE")&&!host)throw new RoomService.Failure(409,"MECHANISM_LOCKED");
        boolean changed=true;
        try{
            if(action.equals("RESET")){if(!host)throw new RoomService.Failure(403,"HOST_REQUIRED");if(!element.equals("CODE_PANEL")||!value.isEmpty())throw new IllegalArgumentException();held.clear();locked.clear();Arrays.fill(digits,0);lever=adjuster=0;light="OFF";hatch=false;}
            else if(action.equals("LOCK")){if(!host)throw new RoomService.Failure(403,"HOST_REQUIRED");if(!Set.of("true","false").contains(value))throw new IllegalArgumentException();if(Boolean.parseBoolean(value)){locked.add(element);held.remove(element);}else locked.remove(element);}
            else if(locked.contains(element)&&!action.equals("RELEASE"))throw new RoomService.Failure(409,"MECHANISM_LOCKED");
            else switch(element){
                case "BIG_BUTTON","SMALL_BUTTON_1","SMALL_BUTTON_2","SMALL_BUTTON_3","SMALL_BUTTON_4"->{
                    if(!value.isEmpty()||!Set.of("PRESS","RELEASE").contains(action))throw new IllegalArgumentException();
                    Set<String> owners=held.computeIfAbsent(element,k->new LinkedHashSet<>());changed=action.equals("PRESS")?owners.add(actor):owners.remove(actor);if(owners.isEmpty())held.remove(element);
                }
                case "LEVER_MODULE"->{if(!action.equals("SET"))throw new IllegalArgumentException();int next=List.of("UP","MIDDLE","DOWN").indexOf(value);if(next<0)throw new IllegalArgumentException();changed=lever!=next;lever=next;}
                case "ADJUSTER"->{if(!action.equals("SET")||!Set.of("0","45","90","135").contains(value))throw new IllegalArgumentException();int next=Integer.parseInt(value);changed=adjuster!=next;adjuster=next;}
                case "LIGHT_MODULE"->{if(!action.equals("SET")||!Set.of("OFF","RED","GREEN","YELLOW","BLUE").contains(value))throw new IllegalArgumentException();changed=!light.equals(value);light=value;}
                case "HIDDEN_HATCH"->{if(!action.equals("SET")||!Set.of("OPEN","CLOSED").contains(value))throw new IllegalArgumentException();boolean next=value.equals("OPEN");changed=hatch!=next;hatch=next;}
                case "CODE_PANEL"->{
                    if(action.equals("STEP")){if(!value.matches("[0-3]:[+-]1"))throw new IllegalArgumentException();int i=value.charAt(0)-'0';digits[i]=Math.floorMod(digits[i]+(value.charAt(2)=='+'?1:-1),10);}
                    else if(action.equals("SET")&&host&&value.matches("[0-9]{4}")){for(int i=0;i<4;i++)digits[i]=value.charAt(i)-'0';}
                    else throw new IllegalArgumentException();
                }
                default->throw new IllegalArgumentException();
            }
        }catch(IllegalArgumentException error){throw new RoomService.Failure(400,"INVALID_LAST_COMMAND_ACTION");}
        requests.add(key);if(requests.size()>2048)requests.remove(requests.iterator().next());
        if(changed){lastAction=Map.of("sequence",++sequence,"actor",actor,"element",element,"action",action,"value",value);history.addLast(lastAction);if(history.size()>128)history.removeFirst();}return changed;
    }
    void disconnect(String actor){for(var entry:held.entrySet())entry.getValue().remove(actor);held.entrySet().removeIf(e->e.getValue().isEmpty());}
    public List<Map<String,Object>> history(){return List.copyOf(history);}
    public Map<String,Object> snapshot(){
        Map<String,Object> result=new LinkedHashMap<>();result.put("sessionId",id);result.put("seed",Long.toString(seed));result.put("sequence",sequence);result.put("held",List.copyOf(held.keySet()));result.put("locked",locked.stream().sorted().toList());
        result.put("lever",List.of("UP","MIDDLE","DOWN").get(lever));result.put("adjuster",adjuster);result.put("light",light);result.put("hatch",hatch);result.put("code",""+digits[0]+digits[1]+digits[2]+digits[3]);result.put("lastAction",lastAction);return result;
    }
}
