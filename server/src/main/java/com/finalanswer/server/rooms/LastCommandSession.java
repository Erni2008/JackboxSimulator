package com.finalanswer.server.rooms;
import com.google.gson.JsonObject;
import com.finalanswer.protocol.Protocol;
import java.util.*;
/** Authoritative lightweight panel state. Never references libGDX or sends model/texture data. */
public final class LastCommandSession {
    private CommandRace race; boolean classic; boolean development; private LastCommandGame game; private LastCommandTestRound testRound; private int roundIndex; private String animal="",symbol="";
    final String id=UUID.randomUUID().toString();final long seed;
    private final Map<String,Set<String>> held=new LinkedHashMap<>();
    private final Set<String> locked=new HashSet<>();
    private final LinkedHashSet<String> requests=new LinkedHashSet<>();
    private final ArrayDeque<Map<String,Object>> history=new ArrayDeque<>();
    private final int[] digits=new int[4];private int lever,adjuster;private String light="OFF";private boolean hatch;
    private long sequence;private Map<String,Object> lastAction=Map.of();
    private static final Set<String> IDS=Set.of("BIG_BUTTON","SMALL_BUTTON_1","SMALL_BUTTON_2","SMALL_BUTTON_3","SMALL_BUTTON_4","LEVER_MODULE","ADJUSTER","LIGHT_MODULE","HIDDEN_HATCH","CODE_PANEL","ANIMAL_PANEL","SYMBOL_PANEL");
    LastCommandSession(long seed){this.seed=seed;}
    boolean action(String actor,boolean host,String requestId,JsonObject data){return action(actor,host,requestId,data,System.currentTimeMillis());}
    boolean action(String actor,boolean host,String requestId,JsonObject data,long now){
        String expandedAction=Protocol.string(data,"action");
        if(expandedAction.equals("PREVIEW_TASK")){
            if(!development)throw new RoomService.Failure(403,"DEVELOPMENT_ONLY");
            if(race==null||!Protocol.string(data,"element").equals("CODE_PANEL")||!data.keySet().equals(Set.of("roomCode","sessionId","taskId","element","action","value")))throw new RoomService.Failure(400,"INVALID_LAST_COMMAND_ACTION");
            if(!Protocol.string(data,"taskId").equals(race.taskId(race.player(actor,now))))return false;
            String key=actor+":"+requestId;if(!requests.add(key))return false;while(requests.size()>2048)requests.remove(requests.iterator().next());
            race.preview(actor,Protocol.string(data,"value"),now);return true;
        }
        if(!classic&&Set.of("START_GAME","PREPARE_GAME").contains(expandedAction)){
            if(!host&&!development)throw new RoomService.Failure(403,"HOST_REQUIRED");
            if(!data.keySet().equals(Set.of("roomCode","sessionId","element","action","value"))&&!data.keySet().equals(Set.of("roomCode","sessionId","taskId","element","action","value")))throw new RoomService.Failure(400,"INVALID_LAST_COMMAND_ACTION");
            if(!Protocol.string(data,"element").equals("CODE_PANEL")||!Protocol.string(data,"value").isEmpty())throw new RoomService.Failure(400,"INVALID_LAST_COMMAND_ACTION");
            String key=actor+":"+requestId;if(requests.contains(key))return false;requests.add(key);if(requests.size()>2048)requests.remove(requests.iterator().next());
            race=new CommandRace(seed+roundIndex*104729L,now,true);race.player(actor,now);if(expandedAction.equals("START_GAME")){roundIndex++;race.start(now);}game=null;testRound=null;return true;
        }
        if(race!=null&&!Set.of("TEST_ROUND","RETRY_ROUND").contains(expandedAction)){
            if(!data.keySet().equals(Set.of("roomCode","sessionId","taskId","element","action","value")))return false;
            return race.action(actor,actor+":"+requestId,Protocol.string(data,"taskId"),Protocol.string(data,"element"),expandedAction,Protocol.string(data,"value"),now);
        }
        if(!data.keySet().equals(Set.of("roomCode","sessionId","element","action","value"))||requestId.isBlank())throw new RoomService.Failure(400,"INVALID_LAST_COMMAND_ACTION");
        String key=actor+":"+requestId;if(requests.contains(key))return false;
        String element=Protocol.string(data,"element"),action=Protocol.string(data,"action"),value=Protocol.string(data,"value");
        if(!IDS.contains(element)||value.length()>32)throw new RoomService.Failure(400,"INVALID_LAST_COMMAND_ACTION");
        if(locked.contains(element)&&!action.equals("RELEASE")&&!host)throw new RoomService.Failure(409,"MECHANISM_LOCKED");
        if(game!=null&&!Set.of("START_GAME","PREPARE_GAME","TEST_ROUND","RETRY_ROUND","LOCK","RESET","REPLAY","RELEASE").contains(action)&&!game.accepts(element,action,now))return false;
        boolean changed=true;
        try{
            if(action.equals("START_GAME")||action.equals("PREPARE_GAME")){
                if(!host&&!development)throw new RoomService.Failure(403,"HOST_REQUIRED");
                if(!element.equals("CODE_PANEL")||!value.isEmpty())throw new IllegalArgumentException();
                game=new LastCommandGame(seed+roundIndex*104729L,now);testRound=null;
                if(action.equals("START_GAME"))roundIndex++;
                if(action.equals("START_GAME"))game.start(now);
                held.clear();locked.clear();Arrays.fill(digits,0);lever=adjuster=0;light="OFF";hatch=false;animal=symbol="";
            }
            else if(action.equals("TEST_ROUND")||action.equals("RETRY_ROUND")){
                if(!host&&!development)throw new RoomService.Failure(403,"HOST_REQUIRED");
                if(!element.equals("CODE_PANEL"))throw new IllegalArgumentException();
                if(action.equals("RETRY_ROUND")){
                    if(testRound==null||!value.isEmpty())throw new IllegalArgumentException();
                    testRound=new LastCommandTestRound(seed,testRound.round,testRound.scenario,now);
                }else{var next=new LastCommandTestRound(seed,roundIndex,value,now);roundIndex++;testRound=next;}
                race=null;game=null;held.clear();locked.clear();Arrays.fill(digits,0);lever=adjuster=0;light="OFF";hatch=false;animal=symbol="";
            }
            else if(action.equals("REPLAY")){if(!element.equals("LIGHT_MODULE")||!value.isEmpty()||testRound==null||!testRound.replay(now))throw new RoomService.Failure(409,"SIGNAL_REPLAY_UNAVAILABLE");}
            else if(action.equals("RESET")){if(!host)throw new RoomService.Failure(403,"HOST_REQUIRED");if(!element.equals("CODE_PANEL")||!value.isEmpty())throw new IllegalArgumentException();held.clear();locked.clear();Arrays.fill(digits,0);lever=adjuster=0;light="OFF";hatch=false;}
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
                case "ANIMAL_PANEL","SYMBOL_PANEL"->{if(!action.equals("SELECT")||!(element.equals("ANIMAL_PANEL")?Set.of("CAT","OWL","WOLF","DEER"):Set.of("SUN","MOON","STAR","KEY")).contains(value))throw new IllegalArgumentException();if(element.equals("ANIMAL_PANEL"))animal=value;else symbol=value;}
                case "CODE_PANEL"->{
                    if(action.equals("STEP")){if(!value.matches("[0-3]:[+-]1"))throw new IllegalArgumentException();int i=value.charAt(0)-'0';digits[i]=Math.floorMod(digits[i]+(value.charAt(2)=='+'?1:-1),10);}
                    else if(action.equals("SET")&&host&&value.matches("[0-9]{4}")){for(int i=0;i<4;i++)digits[i]=value.charAt(i)-'0';}
                    else throw new IllegalArgumentException();
                }
                default->throw new IllegalArgumentException();
            }
        }catch(IllegalArgumentException error){throw new RoomService.Failure(400,"INVALID_LAST_COMMAND_ACTION");}
        if(changed&&testRound!=null&&!Set.of("TEST_ROUND","RETRY_ROUND","RESET","LOCK").contains(action))testRound.action(element,action,value,panelSnapshot(),now);
        if(changed&&game!=null&&!Set.of("START_GAME","PREPARE_GAME").contains(action))game.action(actor,element,action,value,panelSnapshot(),now);
        requests.add(key);if(requests.size()>2048)requests.remove(requests.iterator().next());
        if(changed){lastAction=Map.of("sequence",++sequence,"actor",actor,"element",element,"action",action,"value",value);history.addLast(lastAction);if(history.size()>128)history.removeFirst();}return changed;
    }
    void disconnect(String actor){disconnect(actor,System.currentTimeMillis());}
    void disconnect(String actor,long now){if(race!=null)race.disconnect(actor,now);for(var entry:held.entrySet())entry.getValue().remove(actor);held.entrySet().removeIf(e->e.getValue().isEmpty());}
    void registerActors(Collection<String> actors,long now){if(race!=null)for(String actor:actors)race.player(actor,now);}
    public List<Map<String,Object>> history(){return List.copyOf(history);}
    public boolean timeout(long now){return race!=null?race.tick(now):game!=null?game.tick(now):testRound!=null&&testRound.timeout(now);}
    public Map<String,Object> snapshot(String actor,long now){if(race==null)return snapshot(now);var r=actor.isBlank()?panelSnapshot():race.snapshot(actor,now);if(actor.isBlank())r.put("testRound",Map.of("campaign",true,"expanded",true,"status",race.winner.isEmpty()?(race.started?"PLAYING":"READY"):"WON","scores",race.scores(),"winner",race.winner));r.put("sessionId",id);r.put("seed",Long.toString(seed));r.put("development",development);r.put("placementId",new Random(seed).nextInt(2)==0?"back":"right");return r;}
    public Map<String,Object> snapshot(){return snapshot(System.currentTimeMillis());}
    public Map<String,Object> snapshot(long now){if(race!=null)return snapshot("",now);var r=panelSnapshot();r.put("development",development);r.put("placementId",new Random(seed).nextInt(2)==0?"back":"right");r.put("animal",animal);r.put("symbol",symbol);if(game!=null)r.put("testRound",game.snapshot(now));if(testRound!=null){r.put("testRound",testRound.snapshot(now,panelSnapshot()));r.put("hint",hatch?testRound.code:"?");}return r;}
    private Map<String,Object> panelSnapshot(){
        Map<String,Object> result=new LinkedHashMap<>();result.put("sessionId",id);result.put("seed",Long.toString(seed));result.put("sequence",sequence);result.put("held",List.copyOf(held.keySet()));result.put("locked",locked.stream().sorted().toList());
        result.put("lever",List.of("UP","MIDDLE","DOWN").get(lever));result.put("adjuster",adjuster);result.put("light",light);result.put("hatch",hatch);result.put("code",""+digits[0]+digits[1]+digits[2]+digits[3]);result.put("lastAction",lastAction);result.put("animal",animal);result.put("symbol",symbol);return result;
    }
}
