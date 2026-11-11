package com.finalanswer.server.rooms;

import java.util.*;

/**
 * Server-authoritative THE FINAL SECOND. Phases on the server clock:
 * INTRO → TARGET → COUNTDOWN (3·2·1) → RUNNING (the timer is visible for 3 s, then hidden) → REVEAL (one player at a
 * time) → RESULTS. Each seated player stops once.
 *
 * Timing: the phone measures its own press against the shared start instant (its clock is synced to the server) and
 * sends that elapsed time; the server accepts it only within a bounded window behind the moment the message arrives
 * ({@link Config#maxCompensationMs}), so latency isn't punished but a client can't claim an earlier press than is
 * plausible. Nobody sees anyone's time before REVEAL; nobody sees their own exact time either.
 */
final class FinalSecondSession {
    enum Phase {INTRO,TARGET,COUNTDOWN,RUNNING,REVEAL,RESULTS}
    /** All tunables in one place. */
    record Config(long targetMs,long visibleMs,long introMs,long targetRevealMs,long countdownMs,long graceAfterTargetMs,long revealStepMs,long revealIntroMs,long maxCompensationMs,int eliminate){
        static final Config DEFAULT=new Config(7000,3000,3000,3500,3000,6000,2600,2200,450,1);}
    static final int MIN_PLAYERS=2,MAX_PLAYERS=8;
    record Result(String playerId,long stoppedMs,long errorMs,int rank,boolean stopped,boolean eliminated){}

    final String id=UUID.randomUUID().toString();
    final List<String> seats;final Config cfg;
    private Phase phase=Phase.INTRO;private long phaseStarted,phaseEnds,runStart;
    private final Map<String,Long> stops=new LinkedHashMap<>();private final Set<String> handled=new HashSet<>();
    private List<Result> results=List.of();
    /** Set by the room once eliminations have been written to the players. */
    boolean eliminationApplied;

    FinalSecondSession(List<String> seats,long now){this(seats,now,Config.DEFAULT);}
    FinalSecondSession(List<String> seats,long now,Config cfg){
        if(seats.size()<MIN_PLAYERS||seats.size()>MAX_PLAYERS)throw new RoomService.Failure(409,"FS_PLAYER_COUNT");
        if(new HashSet<>(seats).size()!=seats.size())throw new RoomService.Failure(400,"FS_INVALID_ROSTER");
        this.seats=List.copyOf(seats);this.cfg=cfg;enter(Phase.INTRO,now,cfg.introMs());
    }
    Phase phase(){return phase;}
    List<Result> results(){return results;}
    long runStart(){return runStart;}
    private void enter(Phase p,long now,long dur){phase=p;phaseStarted=now;phaseEnds=dur<0?Long.MAX_VALUE:now+dur;
        if(p==Phase.RUNNING)runStart=now;if(p==Phase.REVEAL)score();}
    private long maxRunMs(){return cfg.targetMs()+cfg.graceAfterTargetMs();}

    boolean tick(long now){
        boolean changed=false;
        while(now>=phaseEnds){changed=true;switch(phase){
            case INTRO->enter(Phase.TARGET,phaseEnds,cfg.targetRevealMs());
            case TARGET->enter(Phase.COUNTDOWN,phaseEnds,cfg.countdownMs());
            case COUNTDOWN->enter(Phase.RUNNING,phaseEnds,maxRunMs());
            case RUNNING->enter(Phase.REVEAL,phaseEnds,cfg.revealIntroMs()+cfg.revealStepMs()*seats.size());
            case REVEAL->enter(Phase.RESULTS,phaseEnds,-1);
            default->{return changed;}}}
        return changed;
    }

    /**
     * A player's STOP. {@code clientElapsedMs} is the phone's measurement since the shared start (may be null). The
     * accepted time is clamped to [arrival − maxCompensation, arrival]. Idempotent per request; one stop per player.
     */
    boolean stop(String member,String requestId,Long clientElapsedMs,long now){
        if(!handled.add(requestId))return false;
        tick(now);
        if(!seats.contains(member))throw new RoomService.Failure(403,"FS_NOT_A_PLAYER");
        if(phase!=Phase.RUNNING)throw new RoomService.Failure(409,phase.ordinal()<Phase.RUNNING.ordinal()?"FS_NOT_STARTED":"FS_CLOSED");
        if(stops.containsKey(member))throw new RoomService.Failure(409,"FS_ALREADY_STOPPED");
        long arrival=now-runStart;
        long t=clientElapsedMs==null?arrival:Math.max(arrival-cfg.maxCompensationMs(),Math.min(arrival,clientElapsedMs));
        stops.put(member,Math.max(0,t));
        if(stops.keySet().containsAll(seats))phaseEnds=Math.min(phaseEnds,now+900);
        return true;
    }
    /** Close early when every still-connected player has stopped. */
    boolean everyoneStopped(Collection<String> connected,long now){
        if(phase!=Phase.RUNNING||stops.isEmpty())return false;
        for(String s:seats)if(connected.contains(s)&&!stops.containsKey(s))return false;
        long close=now+900;if(close<phaseEnds){phaseEnds=close;return true;}return false;
    }

    /** Rank by |time − target|; equal errors share a rank. Players who never stopped come last. The worst {@code eliminate} are eliminated. */
    private void score(){
        List<String> order=new ArrayList<>(seats);
        Map<String,Long> err=new HashMap<>();for(String s:seats)err.put(s,stops.containsKey(s)?Math.abs(stops.get(s)-cfg.targetMs()):Long.MAX_VALUE);
        order.sort(Comparator.<String>comparingLong(err::get).thenComparingInt(seats::indexOf));
        // eliminate the worst N, but never everyone; ties at the cut-off are spared (no hidden tie-breakers)
        int n=Math.min(cfg.eliminate(),seats.size()-1);Set<String> out=new HashSet<>();
        if(n>0){long cut=err.get(order.get(order.size()-n));long below=order.size()-n-1>=0?err.get(order.get(order.size()-n-1)):-1;
            if(cut!=below)for(int i=order.size()-n;i<order.size();i++)out.add(order.get(i));}
        List<Result> r=new ArrayList<>();int rank=0;long prev=-1;
        for(int i=0;i<order.size();i++){String s=order.get(i);long e=err.get(s);if(e!=prev){rank=i+1;prev=e;}
            r.add(new Result(s,stops.getOrDefault(s,-1L),e==Long.MAX_VALUE?-1:e,rank,stops.containsKey(s),out.contains(s)));}
        results=List.copyOf(r);
    }

    Map<String,Object> snapshot(String self,boolean host,long now){
        Map<String,Object> v=new LinkedHashMap<>();
        v.put("sessionId",id);v.put("phase",phase.name());v.put("serverTime",now);v.put("phaseStartedAt",phaseStarted);v.put("phaseEndsAt",phaseEnds==Long.MAX_VALUE?-1:phaseEnds);
        v.put("targetMs",cfg.targetMs());v.put("visibleMs",cfg.visibleMs());v.put("seats",seats);
        int me=seats.indexOf(self);v.put("role",host?"HOST":me>=0?"PLAYER":"SPECTATOR");
        if(phase.ordinal()>=Phase.RUNNING.ordinal())v.put("runStart",runStart);
        v.put("stopped",seats.stream().filter(stops::containsKey).toList());
        if(me>=0)v.put("myStopped",stops.containsKey(self));
        if(phase==Phase.REVEAL||phase==Phase.RESULTS){
            v.put("revealIntroMs",cfg.revealIntroMs());v.put("revealStepMs",cfg.revealStepMs());
            List<Map<String,Object>> rows=new ArrayList<>();
            for(Result r:results){Map<String,Object> m=new LinkedHashMap<>();m.put("playerId",r.playerId());m.put("stoppedMs",r.stoppedMs());m.put("errorMs",r.errorMs());
                m.put("rank",r.rank());m.put("stopped",r.stopped());m.put("eliminated",r.eliminated());rows.add(m);}
            v.put("results",rows);
        }
        return v;
    }
}
