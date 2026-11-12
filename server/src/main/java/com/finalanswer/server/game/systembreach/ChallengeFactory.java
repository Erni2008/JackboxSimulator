package com.finalanswer.server.game.systembreach;

import com.erni.finalanswer.gameplay.systembreach.*;
import java.util.*;
import static com.erni.finalanswer.gameplay.systembreach.SystemBreachConfig.Parameter.*;

/** All ten puzzles are fictional, generated on the server, and solve without memory sequences. */
final class ChallengeFactory {
    static final List<String> WORDS=List.of("DARK","SHADOW","PHANTOM","REAPER","CIPHER","VECTOR","GHOST","RAVEN","VAULT","NEXUS","EMBER","ORBIT","FROST","ONYX","SPECTRE","VORTEX","ECHO","NIGHT","COBALT","DELTA","QUARTZ","SILVER","TRACE","WARDEN");
    private final Random random;private final SystemBreachConfig cfg;private final int difficulty;private final QuizBank quiz;
    ChallengeFactory(Random random,SystemBreachConfig cfg,int difficulty){this.random=random;this.quiz=new QuizBank(random);this.cfg=cfg;this.difficulty=difficulty;}
    long minimumWindow(ChallengeType type){return type==ChallengeType.SIGNAL_INTERCEPTION?Math.max(cfg.get(MIN_ACTION_WINDOW_MS),cfg.get(SIGNAL_DELAY_MS)+cfg.get(SIGNAL_JITTER_MS)+Math.max(150,cfg.get(SIGNAL_WINDOW_MS)/difficulty)+cfg.get(SIGNAL_TOLERANCE_MS)+1):cfg.get(MIN_ACTION_WINDOW_MS);}
    BreachChallenge earning(ChallengeType type,long now){return earning(type,now,Long.MAX_VALUE);}
    BreachChallenge earning(ChallengeType type,long now,long matchDeadline){
        Map<String,Object> d=new LinkedHashMap<>();Object solution;
        switch(type){
            case PASSWORD_DECRYPTION->{
                String word=WORDS.get(random.nextInt(WORDS.size()));Map<String,String> rules=new LinkedHashMap<>();StringBuilder encoded=new StringBuilder();
                for(char c:word.toCharArray()){String key=String.valueOf(100+c+random.nextInt(3)*100);rules.put(key,String.valueOf(c));encoded.append(encoded.isEmpty()?"":" ").append(key);}
                d.put("encoded",encoded.toString());d.put("substitutions",rules);d.put("rule","Decode each space-separated token using the substitution table.");solution=word;
            }
            case CIRCUIT_BYPASS->{
                int n=3+difficulty;List<Map<String,Object>> nodes=new ArrayList<>();List<Integer> required=new ArrayList<>();List<int[]> positions=new ArrayList<>();int x=0,y=0;positions.add(new int[]{x,y});
                for(int i=1;i<n;i++){if(random.nextBoolean())x++;else y++;positions.add(new int[]{x,y});}
                for(int i=0;i<n;i++){
                    int[] at=positions.get(i);int in=i==0?8:positions.get(i-1)[0]<at[0]?8:1,out=i==n-1?2:positions.get(i+1)[0]>at[0]?2:4,mask=in|out;required.add(mask);
                    nodes.add(Map.of("id","n"+i,"x",at[0],"y",at[1],"connections",rotate(mask,random.nextInt(4))));
                }
                if(java.util.stream.IntStream.range(0,n).allMatch(i->((Number)nodes.get(i).get("connections")).intValue()==required.get(i))){var first=new LinkedHashMap<>(nodes.getFirst());first.put("connections",rotate(required.getFirst(),1));nodes.set(0,first);}
                d.put("directionBits",Map.of("N",1,"E",2,"S",4,"W",8));d.put("rotationDegrees",90);d.put("nodes",nodes);d.put("source","n0:W");d.put("destination","n"+(n-1)+":E");d.put("rule","Submit clockwise quarter-turns per node in node order. Bits N=1 E=2 S=4 W=8. Connect consecutive nodes and both terminals.");solution=required;
            }
            case SIGNAL_INTERCEPTION->{long delay=cfg.get(SIGNAL_DELAY_MS)+random.nextInt(cfg.get(SIGNAL_JITTER_MS)+1);d.put("windowOpensAt",now+delay);d.put("windowClosesAt",now+delay+Math.max(150,cfg.get(SIGNAL_WINDOW_MS)/difficulty));d.put("rule","Submit an empty object while the server signal window is open. Client timestamps are not accepted.");solution=null;}
            case DATA_ANALYSIS->{
                int count=4+difficulty,guaranteed=random.nextInt(count);String suspiciousEvent=List.of("UNKNOWN_DEVICE","ACCESS_DENIED","CONFIG_CHANGE").get(random.nextInt(3));List<Map<String,Object>> logs=new ArrayList<>();List<String> suspicious=new ArrayList<>();
                String[] kinds={"UNKNOWN_DEVICE","LOGIN_SUCCESS","ACCESS_DENIED","CONFIG_CHANGE"};
                for(int i=0;i<count;i++){
                    String event=kinds[random.nextInt(kinds.length)],verified=random.nextBoolean()?"UNKNOWN":"VERIFIED";
                    if(i==guaranteed){event=suspiciousEvent;verified="UNKNOWN";}
                    if(i==(guaranteed+1)%count){event=suspiciousEvent;verified="VERIFIED";}
                    if(i==(guaranteed+2)%count){event="LOGIN_SUCCESS";verified="UNKNOWN";}
                    String id="l"+i;logs.add(Map.of("id",id,"time","10:32:"+String.format("%02d",i*3),"event",event,"verification",verified));if(event.equals(suspiciousEvent)&&verified.equals("UNKNOWN"))suspicious.add(id);
                }
                d.put("logs",logs);d.put("criteria",Map.of("event",suspiciousEvent,"verification","UNKNOWN"));d.put("rule","Select ALL log IDs where event="+suspiciousEvent+" AND verification=UNKNOWN.");solution=suspicious;
            }
            case PORT_DETECTION->{
                List<Map<String,Object>> ports=new ArrayList<>();int count=4+difficulty,chosen=random.nextInt(count),base=1000+random.nextInt(1000);String requiredService=List.of("CONTROL","BACKUP","TELEMETRY").get(random.nextInt(3));
                for(int i=0;i<count;i++){
                    String state=i==chosen?"OPEN":i%2==0?"FILTERED":"CLOSED",service=i==chosen?requiredService:"ARCHIVE";
                    if(i==(chosen+1)%count){service=requiredService;state="FILTERED";}if(i==(chosen+2)%count){service="ARCHIVE";state="OPEN";}
                    ports.add(Map.of("port",base+i*7,"state",state,"service",service));
                }
                Collections.shuffle(ports,random);d.put("ports",ports);d.put("criteria",Map.of("state","OPEN","service",requiredService));d.put("rule","Select the port number where state=OPEN AND service="+requiredService+". This is a virtual network.");solution=base+chosen*7;
            }
            case QUICK_QUESTION->{var q=quiz.next(difficulty);d.put("question",q.text());d.put("options",q.options());d.put("rule","Pick the right answer.");solution=q.answer();}
            default->throw new IllegalStateException();
        }
        return new BreachChallenge(type.name(),false,now,(int)Math.min(cfg.get(CHALLENGE_MS),matchDeadline-now),cfg.reward(type),d,solution,cfg);
    }
    BreachChallenge recovery(RecoveryType type,long now){
        Map<String,Object> d=new LinkedHashMap<>();Object solution;
        switch(type){
            case RECONNECT_WIRES->{
                List<Integer> order=new ArrayList<>();for(int i=0;i<3+difficulty;i++)order.add(i);Collections.shuffle(order,random);
                List<Map<String,Object>> left=new ArrayList<>(),right=new ArrayList<>();Map<String,String> pairs=new LinkedHashMap<>();
                for(int i=0;i<order.size();i++){left.add(Map.of("id","L"+i,"label","CHANNEL_"+i));right.add(Map.of("id","R"+i,"label","CHANNEL_"+order.get(i)));pairs.put("L"+order.get(i),"R"+i);}
                d.put("left",left);d.put("right",right);d.put("rule","Map every left endpoint ID to a right endpoint ID with the same CHANNEL label, using each endpoint once.");solution=pairs;
            }
            case COOLING_SYSTEM->{d.put("target",cfg.get(COOLING_TARGET));d.put("stableMs",cfg.get(COOLING_STABLE_MS));d.put("passiveHeatingPerSecond",cfg.get(COOLING_PASSIVE_PER_SECOND));d.put("coolingPerLevelPerSecond",cfg.get(COOLING_CONTROL_PER_SECOND));d.put("rule","Submit {level:0..3}. Hold temperature at or below target for stableMs. Server simulation continues between actions.");solution=null;}
            case FILE_RECOVERY->{
                List<Map<String,Object>> files=new ArrayList<>();Map<String,String> operations=new LinkedHashMap<>();
                for(int i=0;i<3+difficulty;i++){boolean backup=random.nextBoolean(),index=random.nextBoolean();String id="f"+i;files.add(Map.of("id",id,"name","archive_"+i+".dat","backupVerified",backup,"indexIntact",index));operations.put(id,backup?"RESTORE_BACKUP":index?"REBUILD_INDEX":"DISCARD");}
                d.put("operations",List.of("RESTORE_BACKUP","REBUILD_INDEX","DISCARD"));d.put("files",files);d.put("rule","For each file ID: verified backup => RESTORE_BACKUP; otherwise intact index => REBUILD_INDEX; otherwise DISCARD.");solution=operations;
            }
            case SIGNAL_ROUTING->{
                int length=3+difficulty,branches=2+difficulty;List<String> ids=new ArrayList<>();for(int i=0;i<length+branches;i++)ids.add("n"+(10+i*7));Collections.shuffle(ids,random);
                List<String> path=List.copyOf(ids.subList(0,length));List<List<String>> edges=new ArrayList<>();for(int i=1;i<path.size();i++)edges.add(List.of(path.get(i-1),path.get(i)));
                for(int i=0;i<branches;i++)edges.add(List.of(path.get(random.nextInt(length-1)),ids.get(length+i)));
                for(int i=1;i<branches;i++)if(random.nextBoolean())edges.add(List.of(ids.get(length+i-1),ids.get(length+i)));
                Collections.shuffle(edges,random);Collections.shuffle(ids,random);d.put("nodes",List.copyOf(ids));d.put("edges",edges);d.put("source",path.getFirst());d.put("destination",path.getLast());
                d.put("rule","Submit the ordered node IDs of the directed route from source to destination, without repeated nodes. Dead-end branches do not reach the destination.");solution=path;
            }
            case DATA_PURGE->{
                List<Map<String,Object>> files=new ArrayList<>();List<String> infected=new ArrayList<>();int threshold=30+random.nextInt(21),count=4+difficulty,guaranteed=random.nextInt(count);
                for(int i=0;i<count;i++){
                    String id="f"+i,status=random.nextBoolean()?"UNKNOWN":"VERIFIED";int size=10+random.nextInt(70);
                    if(i==guaranteed){status="UNKNOWN";size=threshold+10;}
                    if(i==(guaranteed+1)%count){status="VERIFIED";size=threshold+10;}
                    if(i==(guaranteed+2)%count){status="UNKNOWN";size=threshold;}
                    files.add(Map.of("id",id,"filename","cache_"+i,"extension",i%2==0?"bin":"log","sizeMB",size,"verification",status));if(size>threshold&&status.equals("UNKNOWN"))infected.add(id);
                }
                Collections.shuffle(files,random);d.put("criteria",Map.of("sizeGreaterThanMB",threshold,"verification","UNKNOWN"));d.put("files",files);d.put("rule","Delete ALL file IDs where sizeMB > "+threshold+" AND verification=UNKNOWN.");solution=infected;
            }
            case QUICK_REBOOT->{var q=quiz.next(difficulty);d.put("question",q.text());d.put("options",q.options());d.put("rule","Answer to reboot the computer.");solution=q.answer();}
            default->throw new IllegalStateException();
        }
        return new BreachChallenge(type.name(),true,now,cfg.get(RECOVERY_MS),0,d,solution,cfg);
    }
    static int rotate(int mask,int turns){for(int i=0;i<turns;i++)mask=((mask<<1)&15)|(mask>>3);return mask;}
}
