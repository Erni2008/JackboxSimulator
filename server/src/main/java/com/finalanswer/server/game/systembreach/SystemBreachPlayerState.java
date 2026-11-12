package com.finalanswer.server.game.systembreach;

import com.erni.finalanswer.gameplay.systembreach.*;
import java.util.*;
import static com.erni.finalanswer.gameplay.systembreach.SystemBreachConfig.Parameter.*;

/** Computer-specific state only; membership, identity and connection remain owned by RoomService. */
final class SystemBreachPlayerState {
    final String id;final int seat;final SystemBreachConfig cfg;
    private int ap;long recoveryStartedAt=-1,recoveringMs;
    int defenseSpent,attackSpent,specialSpent;
    final EnumMap<ChallengeType,SystemBreachView.ChallengeMetric> challengeMetrics=new EnumMap<>(ChallengeType.class);
    void recordChallenge(BreachChallenge challenge,boolean solved,long now,int reward){var type=ChallengeType.valueOf(challenge.type);var old=challengeMetrics.getOrDefault(type,new SystemBreachView.ChallengeMetric(0,0,0,0));challengeMetrics.put(type,new SystemBreachView.ChallengeMetric(old.attempts()+1,old.solved()+(solved?1:0),old.totalMs()+Math.max(0,now-challenge.created),old.apEarned()+reward));}
    int earned,stolen,lost,spent,penalties,challengesSolved,challengeFailures,attacksStarted,attacksSucceeded,attacksFailed,attacksInterrupted,recoveries,emergencyRecoveries,recoveryFailuresTotal,specialAttacks,firewallUpgrades;
    final ArrayDeque<Long> hostileHits=new ArrayDeque<>();
    SystemBreachView.Statistics statistics(){Map<String,SystemBreachView.ChallengeMetric> metrics=new LinkedHashMap<>();challengeMetrics.forEach((type,metric)->metrics.put(type.name(),metric));return new SystemBreachView.Statistics(earned,stolen,lost,spent,penalties,challengesSolved,challengeFailures,attacksStarted,attacksSucceeded,attacksFailed,attacksInterrupted,recoveries,emergencyRecoveries,recoveryFailuresTotal,specialAttacks,firewallUpgrades,defenseSpent,attackSpent,specialSpent,recoveringMs,metrics);}
    int keys,keyProgress,firewall=1,integrity,infection,recoveryFailures;
    String password;List<String> passwordOptions;long passwordVersion;
    boolean compromised;BreachChallenge challenge,recovery;
    final ArrayDeque<RecoveryType> recoveryBag=new ArrayDeque<>();RecoveryType lastRecovery;
    long attackReadyAt,specialReadyAt,challengeReadyAt,immuneUntil,effectUntil,traceUntil;
    SpecialAttackType effect;String traceTarget="",trace="";
    SystemBreachSession.Attack attack;
    SystemBreachPlayerState(String id,int seat,List<String> options,SystemBreachConfig cfg){this.id=id;this.seat=seat;this.cfg=cfg;passwordOptions=List.copyOf(options);ap=cfg.get(INITIAL_AP);integrity=cfg.get(INITIAL_INTEGRITY);infection=cfg.get(INITIAL_INFECTION);}
    int ap(){return ap;}
    void spend(int amount){if(amount<0||ap<amount)throw new BreachFailure("INSUFFICIENT_AP");ap-=amount;spent+=amount;}
    int credit(int amount){int add=Math.min(Math.max(0,amount),cfg.get(MAX_AP)-ap);ap+=add;earned+=add;return add;}
    int penalty(int amount){int loss=Math.min(ap,Math.max(0,amount));ap-=loss;penalties+=loss;return loss;}
    static int transfer(SystemBreachPlayerState from,SystemBreachPlayerState to,int amount){int n=Math.min(Math.min(Math.max(0,amount),from.ap),to.cfg.get(MAX_AP)-to.ap);from.ap-=n;to.ap+=n;from.lost+=n;to.stolen+=n;return n;}
    int effectiveFirewall(long now){return effect==SpecialAttackType.FIREWALL_BREAKER&&now<effectUntil?1:firewall;}
    boolean blocked(long now){return effect==SpecialAttackType.TROJAN&&now<effectUntil;}
    boolean disrupted(long now){return compromised||effect!=null&&now<effectUntil;}
    void restore(){compromised=false;recovery=null;recoveryFailures=0;integrity=cfg.get(RECOVERY_INTEGRITY);infection=cfg.get(RECOVERY_INFECTION);}
    void secrets(){password=null;passwordOptions=List.of();challenge=null;recovery=null;attack=null;trace="";traceTarget="";hostileHits.clear();recoveryBag.clear();lastRecovery=null;effect=null;effectUntil=0;}
}
