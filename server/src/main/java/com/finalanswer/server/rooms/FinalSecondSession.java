package com.finalanswer.server.rooms;

import java.util.*;

/** Server-authoritative timing. Every task uses two taps: START, then STOP. */
final class FinalSecondSession {
    enum Phase {INTRO,TARGET,COUNTDOWN,RUNNING,REVEAL,RESULTS}
    enum Task {NORMAL,BLIND,CHAIN,SPEED_SHIFT}
    record Config(long targetMs,long visibleMs,long introMs,long targetRevealMs,long countdownMs,long graceAfterTargetMs,long revealStepMs,long revealIntroMs,long maxCompensationMs,int eliminate){
        static final Config DEFAULT=new Config(7000,3000,3000,3500,3000,6000,2600,2200,450,1);
        static final Config CHAIN=new Config(2000,0,3000,4500,3000,6000,2600,2200,450,1);
    }
    static final int MIN_PLAYERS=2,MAX_PLAYERS=8;
    static final long START_WINDOW_MS=10_000,CHAIN_WAIT_MS=12_000,MAX_TURN_MS=2000;
    /** A shuffled bag contains each task once; the same task cannot repeat at the bag boundary. */
    static final class TaskBag {
        private final ArrayDeque<Task> tasks=new ArrayDeque<>();private Task lastTask;
        Task drawTask(Random r){
            if(tasks.isEmpty()){
                List<Task> next=new ArrayList<>(List.of(Task.values()));Collections.shuffle(next,r);
                if(next.get(0)==lastTask)Collections.swap(next,0,1);tasks.addAll(next);
            }
            return lastTask=tasks.removeFirst();
        }

    }
    record Result(String playerId,long stoppedMs,long errorMs,int rank,boolean stopped,boolean eliminated){}
    record Slice(String playerId,long durationMs,long totalMs){}
    final String id=UUID.randomUUID().toString();final List<String> seats;final Config cfg;final Task task;final boolean blind;
    private Phase phase=Phase.INTRO;private long phaseStarted,phaseEnds,runStart;
    private final Map<String,Long> starts=new LinkedHashMap<>(),stops=new LinkedHashMap<>();
    private final long speedShiftAtMs;private final double speedMultiplier;private final Set<String> timedOut=new HashSet<>();
    private final Set<String> handled=new HashSet<>();private List<Result> results=List.of();boolean eliminationApplied;
    private int turnIndex,turnId=1,pressCount;private long turnReadyAt,segmentStarted=-1,totalMs;
    private String loser="",lossReason="";private final List<Slice> history=new ArrayList<>();

    FinalSecondSession(List<String>s,long now){this(s,now,Config.DEFAULT,Task.NORMAL);}
    FinalSecondSession(List<String>s,long now,boolean blind){this(s,now,Config.DEFAULT,blind?Task.BLIND:Task.NORMAL);}
    FinalSecondSession(List<String>s,long now,Config cfg){this(s,now,cfg,Task.NORMAL);}
    FinalSecondSession(List<String>s,long now,Config cfg,boolean blind){this(s,now,cfg,blind?Task.BLIND:Task.NORMAL);}
    FinalSecondSession(List<String>s,long now,Task task){this(s,now,task==Task.CHAIN?Config.CHAIN:Config.DEFAULT,task);}
    FinalSecondSession(List<String>s,long now,Config cfg,Task task){this(s,now,cfg,task,new Random());}
    FinalSecondSession(List<String>s,long now,Task task,Random random){this(s,now,task==Task.CHAIN?Config.CHAIN:Config.DEFAULT,task,random);}
    FinalSecondSession(List<String>s,long now,Config cfg,Task task,Random random){
        if(s.size()<MIN_PLAYERS||s.size()>MAX_PLAYERS)throw new RoomService.Failure(409,"FS_PLAYER_COUNT");
        if(new HashSet<>(s).size()!=s.size())throw new RoomService.Failure(400,"FS_INVALID_ROSTER");
        this.seats=List.copyOf(s);this.cfg=cfg;this.task=task;blind=task==Task.BLIND||task==Task.CHAIN;
        speedMultiplier=speedShift()?new double[]{.5,1.5,2}[random.nextInt(3)]:1;
        long first=Math.max(1,cfg.targetMs()/5),last=Math.max(first,cfg.targetMs()*3/5);
        speedShiftAtMs=speedShift()?first+random.nextLong(last-first+1):0;enter(Phase.INTRO,now,cfg.introMs());
    }
    Phase phase(){return phase;}List<Result> results(){return results;}long runStart(){return runStart;}
    private boolean chain(){return task==Task.CHAIN;}
    private boolean speedShift(){return task==Task.SPEED_SHIFT;}
    /** Integrates real-time deltas on either side of the single boundary, independent of tick/frame rate. */
    private long scaled(long realMs){return Math.round(Math.min(realMs,speedShiftAtMs)+Math.max(0,realMs-speedShiftAtMs)*speedMultiplier);}
    private long speedDeadline(){return speedShiftAtMs+(long)Math.ceil((cfg.targetMs()-speedShiftAtMs)/speedMultiplier);}
    private String current(){return seats.get(turnIndex);}
    private long maxRunMs(){return speedShift()?cfg.targetMs()*2:cfg.targetMs()+cfg.graceAfterTargetMs();}
    private void enter(Phase p,long now,long duration){
        phase=p;phaseStarted=now;phaseEnds=duration<0?Long.MAX_VALUE:now+duration;
        if(p==Phase.RUNNING){runStart=now;turnReadyAt=now;}
        if(p==Phase.REVEAL)score();
    }
    private void reveal(long now){enter(Phase.REVEAL,now,cfg.revealIntroMs()+cfg.revealStepMs()*seats.size());}
    boolean tick(long now){
        boolean changed=false;
        while(now>=phaseEnds){changed=true;long at=phaseEnds;switch(phase){
            case INTRO->enter(Phase.TARGET,at,cfg.targetRevealMs());
            case TARGET->enter(Phase.COUNTDOWN,at,cfg.countdownMs());
            case COUNTDOWN->enter(Phase.RUNNING,at,chain()?CHAIN_WAIT_MS:START_WINDOW_MS+maxRunMs()+cfg.maxCompensationMs());
            case RUNNING->{
                if(chain()){
                    if(segmentStarted<0)lose(current(),"NO_START",at,totalMs);
                    else{
                        long remaining=cfg.targetMs()-totalMs;
                        long duration=Math.min(remaining+1,MAX_TURN_MS+1);
                        lose(current(),remaining<=MAX_TURN_MS?"LIMIT":"TURN_LIMIT",at,totalMs+duration);
                    }
                }else reveal(at);
            }
            case REVEAL->enter(Phase.RESULTS,at,-1);
            default->{return changed;}
        }}
        if(speedShift()&&phase==Phase.RUNNING){
            for(var start:starts.entrySet())if(!stops.containsKey(start.getKey())&&now>=start.getValue()+speedDeadline()){
                stops.put(start.getKey(),cfg.targetMs());timedOut.add(start.getKey());changed=true;
            }
            if(stops.keySet().containsAll(seats))phaseEnds=Math.min(phaseEnds,now+900);
        }
        return changed;
    }
    private void requirePlayer(String member){if(!seats.contains(member))throw new RoomService.Failure(403,"FS_NOT_A_PLAYER");}
    private void requireRunning(){if(phase!=Phase.RUNNING)throw new RoomService.Failure(409,phase.ordinal()<Phase.RUNNING.ordinal()?"FS_NOT_STARTED":"FS_CLOSED");}
    private void requireTurn(String member,Integer turn){
        if(turn==null||turn!=turnId)throw new RoomService.Failure(409,"FS_STALE_TURN");
        if(!current().equals(member))throw new RoomService.Failure(409,"FS_NOT_YOUR_TURN");
    }
    private long acceptedAt(Long client,long floor,long arrival){return Math.max(floor,client==null?arrival:Math.max(arrival-cfg.maxCompensationMs(),Math.min(arrival,client)));}
    private String requestKey(String member,String request){return member+":"+request;}

    boolean start(String member,String request,Long clientAt,Integer turn,long now){
        requirePlayer(member);String key=requestKey(member,request);if(handled.contains(key))return false;
        tick(now);requireRunning();
        if(chain()){
            requireTurn(member,turn);if(segmentStarted>=0)throw new RoomService.Failure(409,"FS_ALREADY_STARTED");
            segmentStarted=acceptedAt(clientAt,turnReadyAt,now);
            phaseEnds=segmentStarted+Math.min(cfg.targetMs()-totalMs+1,MAX_TURN_MS+1)+cfg.maxCompensationMs();
        }else{
            if(starts.containsKey(member))throw new RoomService.Failure(409,"FS_ALREADY_STARTED");
            if(now>runStart+START_WINDOW_MS+cfg.maxCompensationMs())throw new RoomService.Failure(409,"FS_START_EXPIRED");
            starts.put(member,acceptedAt(clientAt,runStart,now));
        }
        handled.add(key);pressCount++;return true;
    }
    boolean stop(String member,String request,Long clientElapsed,long now){return stop(member,request,clientElapsed,null,null,now);}
    boolean stop(String member,String request,Long clientElapsed,Long clientAt,Integer turn,long now){
        requirePlayer(member);String key=requestKey(member,request);if(handled.contains(key))return false;
        tick(now);requireRunning();
        if(chain()){
            requireTurn(member,turn);if(segmentStarted<0)throw new RoomService.Failure(409,"FS_TIMER_NOT_STARTED");
            long at=acceptedAt(clientAt,segmentStarted,now),duration=at-segmentStarted;
            handled.add(key);pressCount++;
            if(totalMs+duration>cfg.targetMs()){lose(member,"LIMIT",now,totalMs+duration);return true;}
            if(duration>MAX_TURN_MS){lose(member,"TURN_LIMIT",now,totalMs+duration);return true;}
            totalMs+=duration;history.add(new Slice(member,duration,totalMs));stops.put(member,totalMs);
            segmentStarted=-1;turnIndex=(turnIndex+1)%seats.size();turnId++;turnReadyAt=now;phaseEnds=now+CHAIN_WAIT_MS;
        }else{
            if(stops.containsKey(member)&&!timedOut.contains(member))throw new RoomService.Failure(409,"FS_ALREADY_STOPPED");
            Long start=starts.get(member);if(start==null)throw new RoomService.Failure(409,"FS_TIMER_NOT_STARTED");
            long claimed=clientAt!=null?clientAt:clientElapsed==null?now:start+clientElapsed;
            long duration=acceptedAt(claimed,start,now)-start;
            if(duration>maxRunMs())throw new RoomService.Failure(409,"FS_CLOSED");
            if(speedShift()){
                if(now>start+speedDeadline()+cfg.maxCompensationMs())throw new RoomService.Failure(409,"FS_CLOSED");
                if(duration>speedDeadline()){stops.put(member,cfg.targetMs());timedOut.add(member);}
                else{stops.put(member,Math.min(cfg.targetMs(),scaled(duration)));timedOut.remove(member);}
            }else stops.put(member,duration);
            handled.add(key);pressCount++;
            if(stops.keySet().containsAll(seats))phaseEnds=Math.min(phaseEnds,now+900);
        }
        return true;
    }
    boolean everyoneStopped(Collection<String> connected,long now){
        if(chain()||phase!=Phase.RUNNING||stops.isEmpty())return false;
        for(String s:seats)if(connected.contains(s)&&!stops.containsKey(s))return false;
        long close=now+900;if(close<phaseEnds){phaseEnds=close;return true;}return false;
    }
    private void lose(String member,String reason,long now,long total){
        loser=member;lossReason=reason;totalMs=total;
        if(segmentStarted>=0){long duration=total-history.stream().mapToLong(Slice::durationMs).sum();history.add(new Slice(member,duration,total));stops.put(member,total);}
        segmentStarted=-1;reveal(now);
    }
    private void score(){
        if(chain()){
            List<Result> rows=new ArrayList<>();for(String member:seats)if(!member.equals(loser))rows.add(new Result(member,stops.getOrDefault(member,-1L),0,1,stops.containsKey(member),false));
            rows.add(new Result(loser,stops.getOrDefault(loser,-1L),Math.max(0,totalMs-cfg.targetMs()),2,stops.containsKey(loser),true));results=List.copyOf(rows);return;
        }
        List<String> order=new ArrayList<>(seats);Map<String,Long> err=new HashMap<>();for(String s:seats)err.put(s,stops.containsKey(s)&&!timedOut.contains(s)?Math.abs(stops.get(s)-cfg.targetMs()):Long.MAX_VALUE);
        order.sort(Comparator.<String>comparingLong(err::get).thenComparingInt(seats::indexOf));
        int n=Math.min(cfg.eliminate(),seats.size()-1);Set<String> out=new HashSet<>();
        if(n>0){long cut=err.get(order.get(order.size()-n)),below=order.size()-n-1>=0?err.get(order.get(order.size()-n-1)):-1;if(cut!=below)for(int i=order.size()-n;i<order.size();i++)out.add(order.get(i));}
        List<Result> rows=new ArrayList<>();int rank=0;long prev=-1;
        for(int i=0;i<order.size();i++){String s=order.get(i);long e=err.get(s);if(e!=prev){rank=i+1;prev=e;}rows.add(new Result(s,stops.getOrDefault(s,-1L),e==Long.MAX_VALUE?-1:e,rank,stops.containsKey(s)&&!timedOut.contains(s),out.contains(s)));}results=List.copyOf(rows);
    }
    Map<String,Object> snapshot(String self,boolean host,long now){
        Map<String,Object> v=new LinkedHashMap<>();v.put("sessionId",id);v.put("phase",phase.name());v.put("serverTime",now);v.put("phaseStartedAt",phaseStarted);
        v.put("phaseEndsAt",chain()&&phase==Phase.RUNNING||phaseEnds==Long.MAX_VALUE?-1:phaseEnds);
        v.put("targetMs",cfg.targetMs());v.put("visibleMs",speedShift()?cfg.targetMs():blind?0:cfg.visibleMs());v.put("blind",blind);v.put("task",task.name());v.put("manualStart",true);v.put("seats",seats);v.put("pressCount",pressCount);
        int me=seats.indexOf(self);v.put("role",host?"HOST":me>=0?"PLAYER":"SPECTATOR");
        if(phase.ordinal()>=Phase.RUNNING.ordinal()&&!chain())v.put("runStart",runStart);
        v.put("started",chain()?List.of():List.copyOf(starts.keySet()));v.put("stopped",seats.stream().filter(stops::containsKey).toList());
        if(chain()){
            v.put("turnId",turnId);v.put("activePlayer",current());v.put("turnRunning",segmentStarted>=0);v.put("maxTurnMs",MAX_TURN_MS);
        }else if(me>=0){v.put("myStarted",starts.containsKey(self));if(starts.containsKey(self))v.put("myStartedAt",starts.get(self));v.put("myStopped",stops.containsKey(self));v.put("myStartExpired",!starts.containsKey(self)&&phase==Phase.RUNNING&&now>runStart+START_WINDOW_MS);v.put("myTimedOut",timedOut.contains(self)||starts.containsKey(self)&&!stops.containsKey(self)&&now>starts.get(self)+maxRunMs()+cfg.maxCompensationMs());
            if(speedShift()&&starts.containsKey(self)){
                v.put("speedShiftAtMs",speedShiftAtMs);v.put("speedMultiplier",speedMultiplier);v.put("myDeadlineAt",starts.get(self)+speedDeadline());
                if(stops.containsKey(self))v.put("myStoppedMs",stops.get(self));
            }}
        if(phase==Phase.REVEAL||phase==Phase.RESULTS){
            v.put("revealIntroMs",cfg.revealIntroMs());v.put("revealStepMs",cfg.revealStepMs());
            if(chain()){v.put("chainTotalMs",totalMs);v.put("lossReason",lossReason);v.put("loserId",loser);v.put("turnHistory",history);}
            List<Map<String,Object>> rows=new ArrayList<>();for(Result r:results){Map<String,Object> m=new LinkedHashMap<>();m.put("playerId",r.playerId());m.put("stoppedMs",r.stoppedMs());m.put("errorMs",r.errorMs());m.put("rank",r.rank());m.put("stopped",r.stopped());m.put("eliminated",r.eliminated());rows.add(m);}v.put("results",rows);
        }
        return v;
    }
}
