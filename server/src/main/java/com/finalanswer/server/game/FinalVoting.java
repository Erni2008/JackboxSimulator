package com.finalanswer.server.game;

import java.util.*;
import com.erni.finalanswer.gameplay.impostor.FinalRevealTiming;
import com.finalanswer.server.rooms.RoomService.Failure;

/** Server-only immutable final result. Preliminary suspicions never enter this calculation. */
public final class FinalVoting {
    public enum Outcome { IMPOSTOR_CAUGHT, IMPOSTOR_ESCAPED, NO_CONSENSUS }
    public record Snapshot(Map<String,Integer> counts,List<String> stampTargets,List<String> leaders,Outcome outcome,Map<String,String> ballots) {
        public Snapshot {counts=Collections.unmodifiableMap(new LinkedHashMap<>(counts));stampTargets=List.copyOf(stampTargets);leaders=List.copyOf(leaders);ballots=Collections.unmodifiableMap(new LinkedHashMap<>(ballots));}
    }
    public record Timing(long discussionMillis,long votingMillis) {
        public Timing {if(discussionMillis<1000 || discussionMillis>300_000 || votingMillis<1000 || votingMillis>300_000)
            throw new IllegalArgumentException("Impostor discussion/voting durations must be 1000..300000 milliseconds");}
        public static Timing configured(){return new Timing(duration("discussion",30_000),duration("voting",20_000));}
        private static long duration(String key,long fallback){return Long.parseLong(System.getProperty("impostor."+key+"Millis",
            System.getenv().getOrDefault("IMPOSTOR_"+key.toUpperCase(Locale.ROOT)+"_MILLIS",Long.toString(fallback))));}
    }
    public static final long LOCK_MILLIS=700, LEAD_MILLIS=FinalRevealTiming.LEAD, STAMP_MILLIS=FinalRevealTiming.INTERVAL, IMPACT_MILLIS=FinalRevealTiming.IMPACT,
        HOLD_MILLIS=FinalRevealTiming.HOLD, ANNOUNCEMENT_MILLIS=3500, IDENTITY_MILLIS=4000;
    private final Set<String> eligible;
    private final Map<String,String> votes=new LinkedHashMap<>();
    private final long deadline;
    private Snapshot snapshot;
    public FinalVoting(Set<String> participants,long deadline){eligible=Collections.unmodifiableSet(new LinkedHashSet<>(participants));this.deadline=deadline;}
    public void submit(String voter,String target,long now){
        if(snapshot!=null || now>=deadline)throw new Failure(409,"FINAL_VOTING_CLOSED");
        if(!eligible.contains(voter))throw new Failure(403,"NOT_ELIGIBLE");
        if(!eligible.contains(target))throw new Failure(400,"INVALID_SUSPECT");
        if(voter.equals(target))throw new Failure(400,"SELF_VOTE");
        if(votes.containsKey(voter))throw new Failure(409,"FINAL_VOTE_ALREADY_SUBMITTED");
        votes.put(voter,target);
    }
    public int submitted(){return votes.size();}
    public int eligibleCount(){return eligible.size();}
    public String ownVote(String id){return votes.get(id);}
    public boolean allSubmitted(){return votes.size()==eligible.size();}
    public Snapshot snapshot(){return snapshot;}
    public Snapshot close(String impostor){
        if(snapshot!=null)return snapshot;
        Map<String,Integer> counts=new LinkedHashMap<>();for(String id:eligible)counts.put(id,0);
        for(String target:votes.values())counts.compute(target,(id,n)->n+1);
        int highest=counts.values().stream().mapToInt(Integer::intValue).max().orElse(0);
        List<String> leaders=counts.entrySet().stream().filter(e->e.getValue()==highest).map(Map.Entry::getKey).toList();
        Outcome outcome=highest==0 || leaders.size()!=1?Outcome.NO_CONSENSUS:
            leaders.getFirst().equals(impostor)?Outcome.IMPOSTOR_CAUGHT:Outcome.IMPOSTOR_ESCAPED;
        // Round-robin targets animate movement without disclosing voter-to-target associations.
        List<String> stamps=new ArrayList<>();for(int i=0;i<highest;i++)for(String id:eligible)if(counts.get(id)>i)stamps.add(id);
        snapshot=new Snapshot(counts,stamps,leaders,outcome,votes);return snapshot;
    }
}
