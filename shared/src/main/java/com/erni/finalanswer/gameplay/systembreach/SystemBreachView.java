package com.erni.finalanswer.gameplay.systembreach;

import java.util.*;

/** Explicit allowlisted presentation contracts. Never serialize the authoritative session/player objects. */
public final class SystemBreachView {
    private SystemBreachView(){}
    public record Player(String playerId,String nickname,int accessPoints,int firewallLevel,int effectiveFirewall,
                         int systemIntegrity,int infectionLevel,boolean critical,boolean compromised,boolean recovering,
                         boolean disconnected,String effect,long effectUntil,long attackReadyAt,int rank,long protectedUntil,Statistics statistics){}
    private static Map<String,Object> immutableData(Map<String,Object> source){
        Map<String,Object> copy=new LinkedHashMap<>();source.forEach((key,value)->copy.put(key,immutableValue(value)));return Collections.unmodifiableMap(copy);
    }
    private static Object immutableValue(Object value){
        if(value instanceof Map<?,?> map){Map<String,Object> copy=new LinkedHashMap<>();map.forEach((key,item)->copy.put((String)key,immutableValue(item)));return Collections.unmodifiableMap(copy);}
        if(value instanceof List<?> list)return list.stream().map(SystemBreachView::immutableValue).toList();return value;
    }
    public record Challenge(String challengeId,String type,boolean recovery,long createdAt,long expiresAt,Map<String,Object> data){
        public Challenge{data=immutableData(data);}
    }
    public record Event(long sequence,long at,String type,String attackerId,String targetId,int amount){}
    public record ChallengeMetric(int attempts,int solved,long totalMs,int apEarned){}
    public record Statistics(int earned,int stolen,int lost,int spent,int penalties,int challengesSolved,int challengeFailures,int attacksStarted,int attacksSucceeded,int attacksFailed,int attacksInterrupted,int recoveries,int emergencyRecoveries,int recoveryFailures,int specialAttacks,int firewallUpgrades,int defenseSpent,int attackSpent,int specialSpent,long recoveringMs,Map<String,ChallengeMetric> challenges){public Statistics{challenges=Map.copyOf(challenges);}}
    public record Result(String playerId,String nickname,int accessPoints,int rank,boolean winner,Statistics statistics){}
    public record Outcome(String sessionId,long completedAt,String winnerId,List<Result> rankings,int difficulty,Map<String,Integer> balance){public Outcome{rankings=List.copyOf(rankings);balance=Map.copyOf(balance);}}
}
