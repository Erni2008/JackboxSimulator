package com.finalanswer.server.rooms;

import java.util.*;

/** Seeded task manager. Answers, delayed memory, scoring and transition clocks live on the server. */
final class LastCommandGame {
    record Task(String id,String type,String instruction,List<String> mechanisms,Map<String,Object> parameters,Object solution,String successCondition,Map<String,Object> display,long seed) {}
    record Memory(String kind,Object value,int due) {}
    final long seed,startedAt;final String attemptId=UUID.randomUUID().toString();
    final Random random;final List<String> bag=new ArrayList<>();final ArrayDeque<Memory> memories=new ArrayDeque<>();
    final Map<String,Integer> scores=new LinkedHashMap<>();
    Task task;int progress,mistakes,serial,sequenceIndex;long readyAt,nextAt,finishedAt;String status="READY",feedback="",winner="";
    List<String> signals=List.of();long signalStartedAt,inputAt;
    LastCommandGame(long seed,long now){this.seed=seed;random=new Random(seed);startedAt=now;}
    void start(long now){if(!status.equals("READY"))return;status="PLAYING";next(now);}
    private String choose(){if(bag.isEmpty()){bag.addAll(List.of("ENTER_CODE","ANIMAL","SYMBOL","LEVER","ADJUSTER","HATCH","COLOR","BUTTON","LIGHT_SEQUENCE","REMEMBER"));Collections.shuffle(bag,random);}return bag.remove(bag.size()-1);}
    private Object memoryValue(String kind){return switch(kind){case "NUMBER"->String.format(Locale.ROOT,"%04d",random.nextInt(10000));case "ANIMAL"->pick(List.of("CAT","OWL","WOLF","DEER"));case "SYMBOL"->pick(List.of("SUN","MOON","STAR","KEY"));case "COLOR"->pick(List.of("RED","GREEN","BLUE","YELLOW"));default->pattern();};}
    private <T>T pick(List<T> values){return values.get(random.nextInt(values.size()));}
    private List<String> pattern(){var p=new ArrayList<String>();for(int i=0;i<4;i++)p.add("SMALL_BUTTON_"+(1+random.nextInt(4)));return List.copyOf(p);}
    @SuppressWarnings("unchecked") private void next(long now){
        serial++;sequenceIndex=0;signals=List.of();inputAt=0;signalStartedAt=0;nextAt=0;feedback="";readyAt=now+900;
        String type=choose(),instruction;if(type.equals("REMEMBER")&&!memories.isEmpty())type="ENTER_CODE";Object solution="";List<String> mechanisms;
        Memory memory=memories.peekFirst();boolean recall=memory!=null&&memory.due<=serial;
        if(recall){memories.removeFirst();type=switch(memory.kind){case "NUMBER"->"ENTER_CODE";case "LIGHTS"->"LIGHT_SEQUENCE";default->memory.kind;};solution=memory.value;}
        switch(type){
            case "ENTER_CODE"->{if(!recall)solution=memoryValue("NUMBER");instruction=recall?"ENTER THE NUMBER YOU SAW EARLIER":"ENTER CODE: "+solution;mechanisms=List.of("CODE_PANEL","BIG_BUTTON");}
            case "ANIMAL","SYMBOL","COLOR"->{if(!recall)solution=memoryValue(type);instruction=recall?"SELECT THE "+type+" YOU SAW EARLIER":"SELECT "+type+": "+solution;mechanisms=List.of(type.equals("ANIMAL")?"ANIMAL_PANEL":type.equals("SYMBOL")?"SYMBOL_PANEL":"LIGHT_MODULE","BIG_BUTTON");}
            case "LEVER"->{solution=pick(List.of("UP","MIDDLE","DOWN"));instruction="TURN THE LEVER "+solution+" / CONFIRM";mechanisms=List.of("LEVER_MODULE","BIG_BUTTON");}
            case "ADJUSTER"->{solution=pick(List.of(0,45,90,135));instruction="SET ADJUSTER: "+solution+"° / CONFIRM";mechanisms=List.of("ADJUSTER","BIG_BUTTON");}
            case "HATCH"->{solution="OPEN";instruction="FIND AND OPEN THE SECRET HATCH";mechanisms=List.of("HIDDEN_HATCH");}
            case "BUTTON"->{solution="SMALL_BUTTON_"+(1+random.nextInt(4));instruction="PRESS THE "+List.of("RED","GREEN","BLUE","YELLOW").get(Integer.parseInt(solution.toString().substring(13))-1)+" BUTTON";mechanisms=List.of("SMALL_BUTTON_1","SMALL_BUTTON_2","SMALL_BUTTON_3","SMALL_BUTTON_4");}
            case "LIGHT_SEQUENCE"->{if(!recall)solution=pattern();signals=(List<String>)solution;instruction=recall?"REPEAT THE LIGHTS YOU SAW EARLIER":"REMEMBER THE LIGHTS";mechanisms=List.of("LIGHT_MODULE","SIGNAL_PANEL","SMALL_BUTTON_1","SMALL_BUTTON_2","SMALL_BUTTON_3","SMALL_BUTTON_4");signalStartedAt=readyAt;inputAt=recall?readyAt:readyAt+3900;}
            default->{String kind=pick(List.of("NUMBER","ANIMAL","SYMBOL","COLOR","LIGHTS"));solution=memoryValue(kind);memories.addLast(new Memory(kind,solution,serial+3));instruction=kind.equals("LIGHTS")?"REMEMBER THE LIGHTS FOR LATER":"REMEMBER THIS "+kind+": "+solution;mechanisms=kind.equals("LIGHTS")?List.of("LIGHT_MODULE","SIGNAL_PANEL"):List.of();if(kind.equals("LIGHTS")){signals=(List<String>)solution;signalStartedAt=readyAt;}inputAt=readyAt+4500;}
        }
        task=new Task(attemptId+":"+serial,type,instruction,mechanisms,Map.of("confirmationRequired",mechanisms.contains("BIG_BUTTON"),"sequenceLength",signals.size()),solution,type.equals("REMEMBER")?"STORE_AND_WAIT":type.equals("LIGHT_SEQUENCE")?"MATCH_ORDER":mechanisms.contains("BIG_BUTTON")?"MATCH_AND_CONFIRM":"MATCH_ACTION",Map.of("text",instruction,"goal",20),seed+serial*104729L);
    }
    boolean tick(long now){if(!status.equals("PLAYING"))return false;if(nextAt>0&&now>=nextAt){next(now);return true;}if(nextAt==0&&task.type.equals("REMEMBER")&&now>=inputAt){next(now);return true;}return false;}
    boolean accepts(String element,String action,long now){if(action.equals("RELEASE"))return true;return status.equals("PLAYING")&&nextAt==0&&now>=readyAt&&task.mechanisms.contains(element)&&!task.type.equals("REMEMBER")&&(!task.type.equals("LIGHT_SEQUENCE")||now>=inputAt&&element.startsWith("SMALL_BUTTON_"));}
    void action(String actor,String element,String action,String value,Map<String,Object> panel,long now){
        if(!accepts(element,action,now)||action.equals("RELEASE"))return;
        boolean submit=element.equals("BIG_BUTTON")&&action.equals("PRESS"),correct=false;
        switch(task.type){
            case "ENTER_CODE"->{if(submit)correct=task.solution.equals(panel.get("code"));}
            case "ANIMAL","SYMBOL","COLOR","LEVER","ADJUSTER"->{String key=switch(task.type){case "COLOR"->"light";case "LEVER"->"lever";case "ADJUSTER"->"adjuster";default->task.type.toLowerCase(Locale.ROOT);};if(submit)correct=task.solution.equals(panel.get(key));}
            case "HATCH"->{submit=element.equals("HIDDEN_HATCH")&&value.equals("OPEN");correct=submit;}
            case "BUTTON"->{submit=action.equals("PRESS");correct=task.solution.equals(element);}
            case "LIGHT_SEQUENCE"->{if(!action.equals("PRESS")||!element.startsWith("SMALL_BUTTON_"))return;if(!signals.get(sequenceIndex).equals(element)){submit=true;}else{sequenceIndex++;if(sequenceIndex==signals.size()){submit=true;correct=true;}}}
        }
        if(!submit)return;
        if(correct){int score=scores.merge(actor,1,Integer::sum);progress=Math.max(progress,score);feedback="COMMAND ACCEPTED";if(score==20){status="WON";winner=actor;finishedAt=now;return;}}
        else{mistakes++;feedback="WRONG COMMAND";}
        nextAt=now+1400;
    }
    Map<String,Object> snapshot(long now){
        var r=new LinkedHashMap<String,Object>();r.put("campaign",true);r.put("gameSeed",Long.toString(seed));r.put("attemptId",attemptId);r.put("scenario","campaign");r.put("round",0);r.put("status",status);r.put("step",progress);r.put("steps",20);r.put("mistakes",mistakes);r.put("scores",Map.copyOf(scores));r.put("winner",winner);r.put("startedAt",startedAt);r.put("finishedAt",finishedAt);r.put("elapsedMs",Math.max(0,(status.equals("WON")?finishedAt:now)-startedAt));r.put("finishReason",status.equals("WON")?"COMPLETED":"");r.put("deadline",0);r.put("feedback",feedback);r.put("replays",0);r.put("signals",signals);r.put("signalStartedAt",signalStartedAt);r.put("inputAt",inputAt);r.put("readyAt",readyAt);r.put("nextAt",nextAt);r.put("sequenceIndex",sequenceIndex);
        r.put("instruction",status.equals("READY")?"THE LAST COMMAND / PRESS START":status.equals("WON")?"20 / 20 — PROTOCOL COMPLETE":nextAt>0?feedback:task.type.equals("LIGHT_SEQUENCE")&&now>=inputAt?"REPEAT THE LIGHT SEQUENCE":task.instruction);
        r.put("requiredMechanisms",status.equals("PLAYING")&&nextAt==0?task.mechanisms:List.of());r.put("focusId",task==null||task.mechanisms.isEmpty()?"SCREEN":task.mechanisms.get(0));
        if(task!=null){r.put("taskId",task.id);r.put("taskType",task.type);r.put("taskSeed",Long.toString(task.seed));r.put("taskParameters",task.parameters);r.put("display",task.display);}
        return r;
    }
}
