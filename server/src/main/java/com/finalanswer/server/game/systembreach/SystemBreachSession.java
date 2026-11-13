package com.finalanswer.server.game.systembreach;

import com.erni.finalanswer.gameplay.systembreach.*;
import com.google.gson.*;
import java.util.*;
import static com.erni.finalanswer.gameplay.systembreach.SystemBreachConfig.Parameter.*;

/** Authoritative, rendering-independent match. RoomService also holds its membership/transaction lock. */
public final class SystemBreachSession {
    /** Party build: a hacked computer reboots by answering one quick question. */
    static boolean QUIZ_RECOVERY=true;
    /** Party build: every {@link #KEY_EVERY} correct answers earn one access key; hacks, firewall and specials each spend a key. */
    public volatile boolean keyGating;public static final int KEY_EVERY=3;
    public final String id=UUID.randomUUID().toString();
    public record ActionResult(String event,String status,Map<String,Object> details){public ActionResult{details=Map.copyOf(details);}}
    static final class Attack {
        final String id=UUID.randomUUID().toString(),target;final List<String> options;final long version,expires;
        Attack(SystemBreachPlayerState target,List<String> options,long expires){this.target=target.id;this.options=List.copyOf(options);version=target.passwordVersion;this.expires=expires;}
    }
    private final LinkedHashMap<String,SystemBreachPlayerState> players=new LinkedHashMap<>();
    private final SystemBreachConfig cfg;private final int difficulty;private final Random random;private final ChallengeFactory factory;
    private record Receipt(String requestId,String action,String fingerprint,ActionResult result,long appliedAt){}
    private final LinkedHashMap<String,Receipt> handled=new LinkedHashMap<>();
    private final Map<String,Receipt> latest=new HashMap<>();
    private final Map<String,ArrayDeque<Long>> requests=new HashMap<>();
    private final ArrayDeque<SystemBreachView.Event> events=new ArrayDeque<>();
    private List<SystemBreachView.Result> results=List.of();private SystemBreachPhase phase=SystemBreachPhase.INITIALIZATION;
    private long phaseStarted,phaseEnds,activeEnds,eventSequence,completedAt;private boolean closed;
    public SystemBreachSession(List<String> ids,long now,SystemBreachConfig cfg,Random random,int difficulty){
        if(ids.size()<2||ids.size()>8||new HashSet<>(ids).size()!=ids.size()||ids.stream().anyMatch(s->s==null||s.isBlank()))throw new BreachFailure("INVALID_ROSTER");
        if(difficulty<1||difficulty>3)throw new BreachFailure("INVALID_DIFFICULTY");
        this.difficulty=difficulty;this.cfg=Objects.requireNonNull(cfg);this.random=Objects.requireNonNull(random);factory=new ChallengeFactory(random,cfg,difficulty);
        phaseStarted=now;phaseEnds=now+cfg.get(INITIALIZATION_MS);
        for(String player:ids)players.put(player,new SystemBreachPlayerState(player,players.size(),options(null),cfg));
    }
    public synchronized List<SystemBreachView.Event> eventsAfter(long sequence){return events.stream().filter(e->e.sequence()>sequence).toList();}
    public synchronized SystemBreachPhase phase(){return phase;}
    public synchronized boolean hasPlayer(String player){return players.containsKey(player);}
    /** Party passwords: symbols, letters, a digit and one easy word — "#&QZ7_owl". */
    private static final String SYM="#$%&@?*!",LET="ABCDEFGHKMNPQRSTUVWXYZ",DIG="23456789";
    private static final String[] EASY={"cat","sun","owl","box","red","fox","sky","ice","key","map","egg","bee"};
    private static final Map<Character,String> LOOK=Map.ofEntries(Map.entry('#',"@%"),Map.entry('@',"#&"),Map.entry('%',"#&"),Map.entry('&',"%$"),Map.entry('$',"S&"),Map.entry('?',"!7"),Map.entry('*',"#+"),Map.entry('!',"?|"),
        Map.entry('Q',"O"),Map.entry('O',"Q"),Map.entry('M',"N"),Map.entry('N',"M"),Map.entry('B',"8"),Map.entry('S',"5"),Map.entry('Z',"2"),Map.entry('G',"C"),Map.entry('C',"G"),Map.entry('E',"F"),Map.entry('F',"E"),Map.entry('P',"R"),Map.entry('R',"P"),Map.entry('V',"U"),Map.entry('U',"V"),
        Map.entry('6',"9"),Map.entry('9',"6"),Map.entry('5',"S"),Map.entry('8',"B"),Map.entry('2',"Z"),Map.entry('3',"8"),Map.entry('7',"1"),Map.entry('4',"A"));
    public volatile boolean symbolPasswords;
    private char pick(String s){return s.charAt(random.nextInt(s.length()));}
    private String forge(){return ""+pick(SYM)+pick(SYM)+pick(LET)+pick(LET)+pick(DIG)+"_"+EASY[random.nextInt(EASY.length)];}
    /** Two passwords look nothing alike: another word, another digit, and different symbols and letters in every slot. */
    static boolean unlike(String a,String b){
        int ua=a.indexOf('_'),ub=b.indexOf('_');if(ua!=5||ub!=5)return !a.equals(b);
        if(a.substring(6).equals(b.substring(6)))return false;
        for(int i=0;i<5;i++)if(a.charAt(i)==b.charAt(i))return false;
        return a.charAt(0)!=b.charAt(1)&&a.charAt(1)!=b.charAt(0)&&a.charAt(2)!=b.charAt(3)&&a.charAt(3)!=b.charAt(2);
    }
    /** A decoy one look-alike away from the real password (or a neighbouring easy word). */
    private String decoy(String real){
        char[] c=real.toCharArray();int us=real.indexOf('_');
        for(int tries=0;tries<20;tries++){int i=random.nextInt(us+1);
            if(i==us){String w=EASY[random.nextInt(EASY.length)];String d=real.substring(0,us+1)+w;if(!d.equals(real))return d;continue;}
            String alt=LOOK.getOrDefault(c[i],"");if(alt.isEmpty())continue;char[] d=c.clone();d[i]=alt.charAt(random.nextInt(alt.length()));return new String(d);}
        return forge();
    }
    /** Turns on the party rules (keys and forged passwords) before anyone has chosen. */
    public synchronized void partyMode(){keyGating=true;symbolPasswords=true;for(var p:players.values())if(p.password==null)p.passwordOptions=options(null);}
    private List<String> options(String required){
        if(symbolPasswords){List<String> o=new ArrayList<>();if(required!=null)o.add(required);int want=required!=null?4:3;for(int tries=0;o.size()<want&&tries<500;tries++){String f=forge();if(o.stream().allMatch(x->unlike(x,f)))o.add(f);}while(o.size()<want)o.add(forge());Collections.shuffle(o,random);return List.copyOf(o);}
        var words=new ArrayList<>(ChallengeFactory.WORDS);Collections.shuffle(words,random);List<String> options=new ArrayList<>();if(required!=null)options.add(required);
        for(String word:words)if(!options.contains(word)&&options.size()<3)options.add(word);Collections.shuffle(options,random);return List.copyOf(options);
    }
    private void rotatePassword(SystemBreachPlayerState p){String old=p.password;var choices=ChallengeFactory.WORDS.stream().filter(word->!word.equals(old)).toList();p.password=symbolPasswords?forge():choices.get(random.nextInt(choices.size()));p.passwordVersion++;p.passwordOptions=List.of();for(var viewer:players.values())if(viewer.traceTarget.equals(p.id)){viewer.trace="";viewer.traceTarget="";}}
    private void enterActive(long now){for(var p:players.values())if(p.password==null){p.password=p.passwordOptions.get(random.nextInt(p.passwordOptions.size()));p.passwordOptions=List.of();p.passwordVersion++;}phase=SystemBreachPhase.ACTIVE;phaseStarted=now;activeEnds=now+cfg.get(GAME_MS);phaseEnds=activeEnds;for(var p:players.values())if(p.integrity==0||p.infection>=100)compromise(p,now);}
    private List<SystemBreachPlayerState> ranked(){var order=new ArrayList<>(players.values());order.sort(Comparator.comparingInt(SystemBreachPlayerState::ap).reversed().thenComparingInt(p->p.seat));return order;}
    private void complete(long now){
        phase=SystemBreachPhase.RESULTS;phaseStarted=now;phaseEnds=now+cfg.get(RESULTS_MS);completedAt=now;
        for(var p:players.values())closeRecoveryInterval(p,now);
        var rows=new ArrayList<SystemBreachView.Result>();int rank=0;for(var p:ranked())rows.add(new SystemBreachView.Result(p.id,"",p.ap(),++rank,rank==1,p.statistics()));results=List.copyOf(rows);
        for(var p:players.values()){p.attack=null;p.challenge=null;p.recovery=null;p.sabotage=null;}
        event(now,"RESULTS","","",0);
    }
    private enum TimerKind {EFFECT,TRACE,CHALLENGE,ATTACK,RECOVERY_SUCCESS,RECOVERY_FAILURE}
    private record Due(long at,SystemBreachPlayerState player,TimerKind kind){}
    /** Drain deadlines chronologically before scoring, including when a tick crosses the match end. */
    private boolean advanceTimers(long horizon,long receivedAt,Set<String> online){
        boolean changed=false;
        for(;;){
            List<Due> due=new ArrayList<>();
            for(var p:players.values()){
                if(p.effect!=null&&p.effectUntil<=horizon)due.add(new Due(p.effectUntil,p,TimerKind.EFFECT));
                if(!p.trace.isEmpty()&&p.traceUntil<=horizon)due.add(new Due(p.traceUntil,p,TimerKind.TRACE));
                if(p.challenge!=null&&p.challenge.expires<=horizon)due.add(new Due(p.challenge.expires,p,TimerKind.CHALLENGE));
                if(p.attack!=null){long at=p.attack.expires;if(receivedAt<activeEnds&&!online.contains(p.attack.target))at=Math.min(at,receivedAt);if(at<=horizon)due.add(new Due(at,p,TimerKind.ATTACK));}
                if(p.recovery!=null){long completed=p.recovery.completedAt(horizon);if(completed!=Long.MAX_VALUE)due.add(new Due(completed,p,TimerKind.RECOVERY_SUCCESS));else if(p.recovery.expires<=horizon)due.add(new Due(p.recovery.expires,p,TimerKind.RECOVERY_FAILURE));}
            }
            var next=due.stream().min(Comparator.comparingLong(Due::at).thenComparingInt(d->d.player.seat).thenComparing(Due::kind)).orElse(null);
            if(next==null)return changed;
            changed=true;var p=next.player;long at=next.at;
            switch(next.kind){
                case EFFECT->{p.effect=null;p.effectUntil=0;event(at,"EFFECT_EXPIRED","",p.id,0);}
                case TRACE->{p.trace="";p.traceTarget="";}
                case CHALLENGE->{p.challengeFailures++;p.recordChallenge(p.challenge,false,at,0);p.challenge=null;p.challengeReadyAt=at+cfg.get(CHALLENGE_GAP_MS);questionResolved(p,at);}
                case ATTACK->{var target=players.get(p.attack.target);if(target.passwordVersion==p.attack.version)rotatePassword(target);int penalty=p.penalty(cfg.get(FAILED_ATTACK_PENALTY));p.attacksFailed++;event(at,"ATTACK_EXPIRED",p.id,target.id,penalty);p.attack=null;}
                case RECOVERY_SUCCESS->finishRecovery(p,at);
                case RECOVERY_FAILURE->failedRecovery(p,at);
            }
        }
    }
    public synchronized boolean tick(long now,Set<String> online){
        if(closed)return false;boolean changed=false;
        if(phase==SystemBreachPhase.INITIALIZATION&&now>=phaseEnds){enterActive(phaseEnds);changed=true;}
        if(phase==SystemBreachPhase.ACTIVE){
            changed=advanceTimers(Math.min(now,activeEnds),now,online)||changed;
            if(now>=activeEnds){complete(activeEnds);changed=true;}
        }
        if(phase==SystemBreachPhase.RESULTS&&now>=phaseEnds){phase=SystemBreachPhase.FINISHED;phaseStarted=phaseEnds;phaseEnds=Long.MAX_VALUE;for(var p:players.values())p.secrets();handled.clear();latest.clear();requests.clear();changed=true;}
        return changed;
    }
    private void event(long now,String type,String attacker,String target,int amount){events.addLast(new SystemBreachView.Event(++eventSequence,now,type,attacker,target,amount));while(events.size()>cfg.get(EVENT_LIMIT))events.removeFirst();}
    private SystemBreachPlayerState player(String id){var p=players.get(id);if(p==null)throw new BreachFailure("NOT_A_PLAYER");return p;}
    private void ordinary(SystemBreachPlayerState p,long now){requireAllowed(ordinaryReason(p,now));}
    private void rate(String member,long now){var q=requests.computeIfAbsent(member,k->new ArrayDeque<>());while(!q.isEmpty()&&q.getFirst()<=now-1000)q.removeFirst();if(q.size()>=cfg.get(REQUESTS_PER_SECOND))throw new BreachFailure("RATE_LIMITED");q.addLast(now);}
    /** Keep a digest, not old submitted passwords/answers, in the round's replay ledger. */
    private static String fingerprint(JsonObject payload){
        try{return HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(canonical(payload).toString().getBytes(java.nio.charset.StandardCharsets.UTF_8)));}
        catch(java.security.NoSuchAlgorithmException impossible){throw new IllegalStateException("SHA-256 unavailable",impossible);}
    }
    private static JsonElement canonical(JsonElement value){
        if(value.isJsonObject()){var sorted=new JsonObject();for(String key:new TreeSet<>(value.getAsJsonObject().keySet()))sorted.add(key,canonical(value.getAsJsonObject().get(key)));return sorted;}
        if(value.isJsonArray()){var array=new JsonArray();for(var element:value.getAsJsonArray())array.add(canonical(element));return array;}return value;
    }
    private static String text(JsonObject data,String key){var e=data.get(key);if(e==null||!e.isJsonPrimitive()||!e.getAsJsonPrimitive().isString()||e.getAsString().isBlank()||e.getAsString().length()>96)throw BreachFailure.invalid();return e.getAsString();}
    private static void fields(JsonObject data,String... allowed){Set<String> keys=new HashSet<>(List.of(allowed));keys.add("roomCode");keys.add("sessionId");if(!keys.containsAll(data.keySet()))throw BreachFailure.invalid();}
    private <T extends Enum<T>> T type(Class<T> cls,JsonObject data,String key){try{return Enum.valueOf(cls,text(data,key));}catch(IllegalArgumentException e){throw BreachFailure.invalid();}}
    private ActionResult result(String event,String status){return new ActionResult(event,status,Map.of());}
    public synchronized ActionResult act(String member,String request,String action,JsonObject data,long now,Set<String> online){
        if(request==null||request.isBlank()||request.length()>128)throw BreachFailure.invalid();
        var p=player(member);String key=member+":"+request;var prior=handled.get(key);if(prior!=null){
            if(!prior.action.equals(action)||!prior.fingerprint.equals(fingerprint(data)))throw new BreachFailure("REQUEST_CONFLICT");
            return prior.result;
        }
        tick(now,online);if(closed||phase==SystemBreachPhase.RESULTS||phase==SystemBreachPhase.FINISHED)throw new BreachFailure("CLOSED");
        if(!online.contains(member))throw new BreachFailure("DISCONNECTED");rate(member,now);int balanceBefore=p.ap();ActionResult result;
        if(action.equals("PASSWORD_SELECT")){
            fields(data,"password");if(phase!=SystemBreachPhase.INITIALIZATION)throw new BreachFailure("INITIALIZATION_CLOSED");if(p.password!=null)throw new BreachFailure("PASSWORD_ALREADY_SELECTED");
            String password=text(data,"password");if(!p.passwordOptions.contains(password))throw BreachFailure.invalid();p.password=password;p.passwordOptions=List.of();p.passwordVersion++;
            if(players.values().stream().allMatch(v->v.password!=null))enterActive(now);result=result("PLAYER_UPDATE","PASSWORD_SELECTED");
        }else{
            if(phase!=SystemBreachPhase.ACTIVE)throw new BreachFailure("NOT_ACTIVE");
            switch(action){
                case "CHALLENGE_REQUEST"->{fields(data,"type");requireAllowed(challengeReason(p,now));var challengeType=type(ChallengeType.class,data,"type");if(activeEnds-now<factory.minimumWindow(challengeType))throw new BreachFailure("ROUND_ENDING");p.challenge=factory.earning(challengeType,now,activeEnds);result=result("PLAYER_UPDATE","CHALLENGE_READY");}
                case "CHALLENGE_SUBMIT"->{
                    fields(data,"challengeId","answer");ordinary(p,now);if(p.answersLocked())throw new BreachFailure("ANSWERS_LOCKED");if(p.challenge==null||!p.challenge.id.equals(text(data,"challengeId")))throw new BreachFailure("STALE_CHALLENGE");
                    if(!data.has("answer"))throw BreachFailure.invalid();boolean correct=p.challenge.validate(data.get("answer"),now);int reward=correct?p.credit(scaledReward(p,p.challenge.reward,now)):0;if(correct)p.challengesSolved++;else p.challengeFailures++;p.recordChallenge(p.challenge,correct,now,reward);if(correct&&keyGating&&++p.keyProgress>=KEY_EVERY){p.keyProgress=0;p.keys++;event(now,"KEY_EARNED","",p.id,p.keys);}if(reward>0)event(now,"CHALLENGE_SOLVED","",p.id,reward);
                    p.challenge=null;p.challengeReadyAt=now+cfg.get(CHALLENGE_GAP_MS);questionResolved(p,now);result=new ActionResult("CHALLENGE_RESULT",correct?"SUCCESS":"FAILED",Map.of("reward",reward));
                }
                case "ATTACK_REQUEST"->{
                    fields(data,"targetId");var target=player(text(data,"targetId"));requireAllowed(attackReason(p,target,now,online));
                    int firewall=target.effectiveFirewall(now),cost=attackCost(target,now);var attempt=new Attack(target,options(target.password),Math.min(activeEnds,now+cfg.get(ATTACK_GUESS_MS)));
                    p.spend(cost);p.attackSpent+=cost;p.attacksStarted++;if(keyGating)p.keys--;p.attack=attempt;event(now,"ATTACK_STARTED",p.id,target.id,0);p.attackReadyAt=now+cfg.get(ATTACK_COOLDOWN_MS)+(firewall-1)*cfg.get(FIREWALL_COOLDOWN_STEP_MS);result=result("PLAYER_UPDATE","ATTACK_READY");
                }
                case "ATTACK_SUBMIT"->{
                    fields(data,"attackId","password");ordinary(p,now);if(p.attack==null||!p.attack.id.equals(text(data,"attackId")))throw new BreachFailure("STALE_ATTACK");
                    var attempt=p.attack;var target=target(p,attempt.target,online,now);if(target.passwordVersion!=attempt.version)throw new BreachFailure("STALE_ATTACK");String guess=text(data,"password");if(!attempt.options.contains(guess))throw BreachFailure.invalid();
                    boolean success=target.password.equals(guess);int transfer=0;if(success){transfer=SystemBreachPlayerState.transfer(target,p,protectedLoss(cfg.get(ATTACK_STEAL),target,now));compromise(target,now);p.attacksSucceeded++;}else{p.penalty(cfg.get(FAILED_ATTACK_PENALTY));p.attacksFailed++;}
                    rotatePassword(target);p.attack=null;event(now,success?"ATTACK_SUCCEEDED":"ATTACK_FAILED",p.id,target.id,transfer);result=new ActionResult("ATTACK_RESULT",success?"SUCCESS":"FAILED",Map.of("amount",transfer));
                }
                case "FIREWALL_UPGRADE"->{
                    fields(data);requireAllowed(firewallReason(p,now));int cost=firewallCost(p);p.spend(cost);p.defenseSpent+=cost;p.firewall++;p.firewallUpgrades++;if(keyGating)p.keys--;event(now,"FIREWALL_UPGRADED","",p.id,p.firewall);result=result("PLAYER_UPDATE","FIREWALL_UPGRADED");
                }
                case "MULTIPLIER_UPGRADE"->{
                    fields(data);requireAllowed(multiplierReason(p,now));int cost=multiplierCost(p);p.spend(cost);if(keyGating)p.keys--;p.multiplier++;
                    event(now,"MULTIPLIER_UPGRADED","",p.id,(int)Math.round(MULTIPLIERS[p.multiplier-1]*10));result=result("PLAYER_UPDATE","MULTIPLIER_UPGRADED");
                }
                case "SPECIAL_ATTACK"->{
                    fields(data,"targetId","type");var target=player(text(data,"targetId"));SpecialAttackType special=type(SpecialAttackType.class,data,"type");
                    requireAllowed(specialReason(p,target,special,now,online));
                    if(keyGating)p.keys--;p.spend(cfg.cost(special));p.specialSpent+=cfg.cost(special);p.specialAttacks++;p.specialReadyAt=now+cfg.get(SPECIAL_COOLDOWN_MS);int amount=0;
                    switch(special){
                        case TROJAN->{target.effect=special;target.effectUntil=now+cfg.get(TROJAN_MS);}
                        case DATA_LEAK->amount=SystemBreachPlayerState.transfer(target,p,protectedLoss(cfg.get(DATA_LEAK_AMOUNT),target,now));
                        case SYSTEM_OVERLOAD->compromise(target,now);
                        case FIREWALL_BREAKER->{target.effect=special;target.effectUntil=now+cfg.get(BREAKER_MS);}
                        case TRACE_ATTACK->{p.traceTarget=target.id;p.trace=target.password.substring(0,1)+"… ("+target.password.length()+" characters)";p.traceUntil=now+cfg.get(TRACE_MS);}
                    }
                    if(special==SpecialAttackType.DATA_LEAK||special==SpecialAttackType.TROJAN)hostileHit(target,now);event(now,special.name(),p.id,target.id,amount);result=new ActionResult("PLAYER_UPDATE","SPECIAL_APPLIED",Map.of("amount",amount));
                }
                case "SABOTAGE"->{
                    fields(data,"targetId");var target=player(text(data,"targetId"));requireAllowed(sabotageReason(p,target,now,online));
                    if(keyGating)p.keys--;p.specialAttacks++;p.specialReadyAt=now+cfg.get(SPECIAL_COOLDOWN_MS);
                    if(Sabotage.getsThrough(target.effectiveFirewall(now),random)){var virus=new Sabotage.Infection(Sabotage.roll(random),p.id,now,random);target.sabotage=virus;
                        event(now,"SABOTAGE_STARTED",p.id,target.id,virus.type.ordinal());result=new ActionResult("SABOTAGE_RESULT","INFECTED",Map.of("type",virus.type.name()));}
                    else{event(now,"SABOTAGE_BLOCKED",p.id,target.id,target.effectiveFirewall(now));result=new ActionResult("SABOTAGE_RESULT","BLOCKED",Map.of("firewall",target.effectiveFirewall(now)));}
                }
                case "SABOTAGE_CLEAR"->{
                    fields(data,"infectionId","answer");if(p.sabotage==null||!p.sabotage.id.equals(text(data,"infectionId")))throw new BreachFailure("STALE_SABOTAGE");
                    if(p.sabotage.solves(data.get("answer"))){event(now,"SABOTAGE_CLEARED",p.sabotage.attacker,p.id,0);p.sabotage=null;result=result("SABOTAGE_RESULT","CLEARED");}
                    else result=result("SABOTAGE_RESULT","WRONG");
                }
                case "RECOVERY_SUBMIT"->{
                    fields(data,"challengeId","answer");if(p.recovery==null||!p.recovery.id.equals(text(data,"challengeId")))throw new BreachFailure("STALE_RECOVERY");if(!data.has("answer"))throw BreachFailure.invalid();
                    boolean success=p.recovery.validate(data.get("answer"),now);
                    if(success){finishRecovery(p,now);result=result("RECOVERY_RESULT","SUCCESS");}
                    else if(p.recovery.cooling())result=result("RECOVERY_RESULT","IN_PROGRESS");
                    else{failedRecovery(p,now);result=result("RECOVERY_RESULT",p.compromised?"RETRY":"EMERGENCY_RESTORED");}
                }
                default->throw BreachFailure.invalid();
            }
        }
        Map<String,Object> details=new LinkedHashMap<>(result.details);details.put("balanceBefore",balanceBefore);details.put("balanceAfter",p.ap());details.put("apDelta",p.ap()-balanceBefore);
        result=new ActionResult(result.event,result.status,details);
        var receipt=new Receipt(request,action,fingerprint(data),result,now);handled.put(key,receipt);latest.put(member,receipt);return result;
    }
    private int protectedLoss(int amount,SystemBreachPlayerState p,long now){return Math.max(0,amount*(100-(p.effectiveFirewall(now)-1)*cfg.get(FIREWALL_LOSS_REDUCTION_PERCENT))/100);}
    private SystemBreachPlayerState target(SystemBreachPlayerState attacker,String id,Set<String> online,long now){
        var target=player(id);requireAllowed(targetReason(attacker,target,now,online,false));return target;
    }
    private BreachChallenge nextRecovery(SystemBreachPlayerState p,long now){
        if(p.recoveryBag.isEmpty()){
            var types=new ArrayList<>(List.of(RecoveryType.values()));types.remove(RecoveryType.QUICK_REBOOT);Collections.shuffle(types,random);
            if(types.getFirst()==p.lastRecovery)Collections.swap(types,0,1);p.recoveryBag.addAll(types);
        }
        p.lastRecovery=p.recoveryBag.removeFirst();
        return factory.recovery(QUIZ_RECOVERY?RecoveryType.QUICK_REBOOT:p.lastRecovery,now);
    }
    /** Each finished question (answered or timed out) wears a sabotage down; it expires after the configured count. */
    private void questionResolved(SystemBreachPlayerState p,long at){
        if(p.sabotage==null||--p.sabotage.questionsLeft>0)return;event(at,"SABOTAGE_EXPIRED",p.sabotage.attacker,p.id,0);p.sabotage=null;
    }
    private void interruptAttack(SystemBreachPlayerState p,long now){
        if(p.attack==null)return;var target=players.get(p.attack.target);
        if(target.passwordVersion==p.attack.version)rotatePassword(target);p.attack=null;p.attacksInterrupted++;
        event(now,"ATTACK_INTERRUPTED",p.id,target.id,0);
    }
    private void compromise(SystemBreachPlayerState p,long now){interruptAttack(p,now);hostileHit(p,now);p.recoveryStartedAt=now;p.integrity=Math.max(0,p.integrity-cfg.get(ATTACK_DAMAGE));p.infection=Math.min(100,p.infection+cfg.get(ATTACK_INFECTION));p.compromised=true;p.effect=null;p.effectUntil=0;p.challenge=null;p.recoveryFailures=0;p.recovery=nextRecovery(p,now);event(now,"RECOVERY_START","",p.id,0);}
    private void closeRecoveryInterval(SystemBreachPlayerState p,long now){if(p.recoveryStartedAt>=0){p.recoveringMs+=Math.max(0,now-p.recoveryStartedAt);p.recoveryStartedAt=-1;}}
    private void finishRecovery(SystemBreachPlayerState p,long now){closeRecoveryInterval(p,now);p.recoveries++;p.restore();p.immuneUntil=Math.max(p.immuneUntil,now+protectionMs(p,now));event(now,"RECOVERY_SUCCEEDED","",p.id,0);}
    private void failedRecovery(SystemBreachPlayerState p,long now){
        p.penalty(cfg.get(RECOVERY_PENALTY));p.integrity=Math.max(0,p.integrity-cfg.get(RECOVERY_FAILURE_DAMAGE));p.infection=Math.min(100,p.infection+cfg.get(ATTACK_INFECTION));p.recoveryFailures++;p.recoveryFailuresTotal++;
        if(p.recoveryFailures>=cfg.get(RECOVERY_RETRIES)){p.emergencyRecoveries++;finishRecovery(p,now);event(now,"EMERGENCY_RESTORED","",p.id,0);}
        else{p.recovery=nextRecovery(p,now);event(now,"RECOVERY_RETRY","",p.id,0);}
    }
    private long protectionMs(SystemBreachPlayerState p,long now){
        while(!p.hostileHits.isEmpty()&&p.hostileHits.getFirst()<=now-cfg.get(PRESSURE_WINDOW_MS))p.hostileHits.removeFirst();
        return Math.min(cfg.get(PRESSURE_MAX_IMMUNITY_MS),cfg.get(TARGET_IMMUNITY_MS)+(long)Math.max(0,p.hostileHits.size()-1)*cfg.get(PRESSURE_STEP_MS));
    }
    private void hostileHit(SystemBreachPlayerState p,long now){p.hostileHits.addLast(now);p.immuneUntil=Math.max(p.immuneUntil,now+protectionMs(p,now));}
    private void requireAllowed(String reason){if(!reason.isEmpty())throw new BreachFailure(reason.substring(3));}
    private int attackCost(SystemBreachPlayerState target,long now){return cfg.get(ATTACK_COST)+(target.effectiveFirewall(now)-1)*cfg.get(FIREWALL_COST_STEP);}
    private int firewallCost(SystemBreachPlayerState p){return p.firewall==1?cfg.get(FIREWALL_2_COST):p.firewall==2?cfg.get(FIREWALL_3_COST):0;}
    private String ordinaryReason(SystemBreachPlayerState p,long now){return phase!=SystemBreachPhase.ACTIVE?"SB_NOT_ACTIVE":p.compromised?"SB_RECOVERY_REQUIRED":p.blocked(now)?"SB_TEMPORARILY_BLOCKED":"";}
    private String challengeReason(SystemBreachPlayerState p,long now){String base=ordinaryReason(p,now);return !base.isEmpty()?base:p.challenge!=null?"SB_CHALLENGE_PENDING":now<p.challengeReadyAt?"SB_CHALLENGE_COOLDOWN":"";}
    /** Answer multiplier ×1 → ×2 → ×3: a key plus 20 / 40 AP. */
    /** Personal answer multiplier steps; {@code p.multiplier} is the 1-based step. */
    public static final double[] MULTIPLIERS={1.0,1.3,1.5,1.8,2.0,2.5};public static final int MAX_MULTIPLIER=MULTIPLIERS.length;
    private static final int[] MULTIPLIER_COST={15,25,35,50,70};
    private int multiplierCost(SystemBreachPlayerState p){return MULTIPLIER_COST[Math.min(MULTIPLIER_COST.length-1,p.multiplier-1)];}
    /** The round heats up: answers are worth +10 % more for every full minute played. */
    public double roundMultiplier(long now){
        if(!keyGating||phase==SystemBreachPhase.INITIALIZATION)return 1;long started=activeEnds-cfg.get(GAME_MS);long minutes=Math.max(0,Math.min(now,activeEnds)-started)/60000;
        return Math.round((1+0.1*minutes)*10)/10.0;
    }
    private int scaledReward(SystemBreachPlayerState p,int base,long now){return keyGating?(int)Math.round(base*MULTIPLIERS[p.multiplier-1]*roundMultiplier(now)):base;}
    private String multiplierReason(SystemBreachPlayerState p,long now){String base=ordinaryReason(p,now);return !base.isEmpty()?base:keyGating&&p.keys<=0?"SB_NEED_KEY":p.multiplier>=MAX_MULTIPLIER?"SB_MAX_MULTIPLIER":p.ap()<multiplierCost(p)?"SB_INSUFFICIENT_AP":"";}
    private String firewallReason(SystemBreachPlayerState p,long now){String base=ordinaryReason(p,now);return !base.isEmpty()?base:keyGating&&p.keys<=0?"SB_NEED_KEY":p.firewall>=3?"SB_MAX_FIREWALL":p.ap()<firewallCost(p)?"SB_INSUFFICIENT_AP":"";}
    private String targetReason(SystemBreachPlayerState p,SystemBreachPlayerState target,long now,Set<String> online,boolean reserve){
        return p.id.equals(target.id)?"SB_SELF_ATTACK":!online.contains(target.id)?"SB_TARGET_DISCONNECTED":target.compromised||target.blocked(now)||now<target.immuneUntil?"SB_TARGET_PROTECTED":reserve&&players.values().stream().anyMatch(a->a.attack!=null&&a.attack.target.equals(target.id))?"SB_TARGET_BUSY":"";
    }
    private String attackReason(SystemBreachPlayerState p,SystemBreachPlayerState target,long now,Set<String> online){
        String base=ordinaryReason(p,now),protection=targetReason(p,target,now,online,true);
        return !base.isEmpty()?base:keyGating&&p.keys<=0?"SB_NEED_KEY":activeEnds-now<cfg.get(MIN_ACTION_WINDOW_MS)?"SB_ROUND_ENDING":p.attack!=null?"SB_ATTACK_PENDING":now<p.attackReadyAt?"SB_ATTACK_COOLDOWN":!protection.isEmpty()?protection:p.ap()<attackCost(target,now)?"SB_INSUFFICIENT_AP":"";
    }
    private String specialReason(SystemBreachPlayerState p,SystemBreachPlayerState target,SpecialAttackType special,long now,Set<String> online){
        String base=ordinaryReason(p,now),protection=targetReason(p,target,now,online,true);
        return !base.isEmpty()?base:keyGating&&p.keys<=0?"SB_NEED_KEY":p.attack!=null?"SB_ATTACK_PENDING":now<p.specialReadyAt||now<p.attackReadyAt?"SB_ATTACK_COOLDOWN":!protection.isEmpty()?protection:target.effect!=null&&now<target.effectUntil&&special!=SpecialAttackType.DATA_LEAK&&special!=SpecialAttackType.TRACE_ATTACK?"SB_TARGET_PROTECTED":p.ap()<cfg.cost(special)?"SB_INSUFFICIENT_AP":"";
    }
    /** Same gates as a hack (online, not self, not protected, a key) plus: one live virus per player, never replaced. */
    private String sabotageReason(SystemBreachPlayerState p,SystemBreachPlayerState target,long now,Set<String> online){
        String base=ordinaryReason(p,now),protection=targetReason(p,target,now,online,false);
        return !base.isEmpty()?base:keyGating&&p.keys<=0?"SB_NEED_KEY":activeEnds-now<cfg.get(MIN_ACTION_WINDOW_MS)?"SB_ROUND_ENDING":p.attack!=null?"SB_ATTACK_PENDING":!protection.isEmpty()?protection:target.sabotage!=null?"SB_TARGET_INFECTED":"";
    }
    private Map<String,Object> permission(String reason,int cost,long readyAt){return Map.of("allowed",reason.isEmpty(),"reason",reason,"cost",cost,"readyAt",readyAt);}
    /** The UI quotes the same predicates/costs the authoritative transaction checks. */
    private Map<String,Object> actionAvailability(SystemBreachPlayerState p,long now,Set<String> online){
        String base=ordinaryReason(p,now);Map<String,Object> actions=new LinkedHashMap<>();
        String earningReason=challengeReason(p,now);if(earningReason.isEmpty()&&activeEnds-now<cfg.get(MIN_ACTION_WINDOW_MS))earningReason="SB_ROUND_ENDING";actions.put("challenge",permission(earningReason,0,p.challengeReadyAt));
        Map<String,Object> challenges=new LinkedHashMap<>();for(var type:ChallengeType.values()){String reason=challengeReason(p,now);if(reason.isEmpty()&&activeEnds-now<factory.minimumWindow(type))reason="SB_ROUND_ENDING";challenges.put(type.name(),permission(reason,0,p.challengeReadyAt));}actions.put("challengeTypes",challenges);
        actions.put("answer",permission(!base.isEmpty()?base:p.challenge==null?"SB_STALE_CHALLENGE":"",0,0));
        actions.put("attackSubmit",permission(!base.isEmpty()?base:p.attack==null?"SB_STALE_ATTACK":"",0,0));
        actions.put("firewall",permission(firewallReason(p,now),firewallCost(p),0));actions.put("multiplier",permission(multiplierReason(p,now),multiplierCost(p),0));
        actions.put("recovery",permission(phase!=SystemBreachPhase.ACTIVE?"SB_NOT_ACTIVE":p.recovery==null?"SB_STALE_RECOVERY":"",0,0));
        List<Map<String,Object>> targets=new ArrayList<>();
        for(var target:players.values())if(!target.id.equals(p.id)){
            Map<String,Object> specials=new LinkedHashMap<>();for(var special:SpecialAttackType.values())specials.put(special.name(),permission(specialReason(p,target,special,now,online),cfg.cost(special),Math.max(p.specialReadyAt,p.attackReadyAt)));
            targets.add(Map.of("playerId",target.id,"attack",permission(attackReason(p,target,now,online),attackCost(target,now),p.attackReadyAt),"specials",specials,"sabotage",permission(sabotageReason(p,target,now,online),0,0)));
        }
        actions.put("targets",List.copyOf(targets));return actions;
    }
    public synchronized SystemBreachView.Outcome outcome(Map<String,String> names){if(results.isEmpty())return null;var rows=results.stream().map(r->new SystemBreachView.Result(r.playerId(),names.getOrDefault(r.playerId(),r.playerId()),r.accessPoints(),r.rank(),r.winner(),r.statistics())).toList();return new SystemBreachView.Outcome(id,completedAt,rows.getFirst().playerId(),rows,difficulty,cfg.profile());}
    public synchronized Map<String,Object> snapshot(String self,boolean host,long now,Set<String> online,Map<String,String> names){
        Map<String,Object> view=new LinkedHashMap<>();view.put("schemaVersion",1);view.put("lastEventSequence",eventSequence);view.put("firstEventSequence",events.isEmpty()?eventSequence+1:events.getFirst().sequence());view.put("sessionId",id);view.put("phase",phase.name());view.put("serverTime",now);view.put("phaseStartedAt",phaseStarted);view.put("deadline",phaseEnds==Long.MAX_VALUE?-1:phaseEnds);view.put("remainingMs",phaseEnds==Long.MAX_VALUE?0:Math.max(0,phaseEnds-now));
        List<SystemBreachView.Player> rows=new ArrayList<>();int rank=0;for(var p:ranked())rows.add(new SystemBreachView.Player(p.id,names.getOrDefault(p.id,p.id),p.ap(),p.firewall,p.effectiveFirewall(now),p.integrity,p.infection,p.integrity==0,p.compromised,p.recovery!=null,!online.contains(p.id),p.effect==null?"":p.effect.name(),p.effectUntil,p.attackReadyAt,++rank,p.immuneUntil,p.statistics()));
        view.put("players",List.copyOf(rows));{Map<String,Object> mult=new LinkedHashMap<>();for(var p:players.values())mult.put(p.id,MULTIPLIERS[p.multiplier-1]);view.put("multipliers",mult);view.put("roundMultiplier",roundMultiplier(now));Map<String,Object> infected=new LinkedHashMap<>();for(var p:players.values())if(p.sabotage!=null)infected.put(p.id,p.sabotage.type.name());view.put("sabotage",infected);}view.put("events",List.copyOf(events));view.put("role",host?"HOST":players.containsKey(self)?"PLAYER":"SPECTATOR");
        if(results.isEmpty())view.put("winnerId","");else{var outcome=outcome(names);view.put("winnerId",outcome.winnerId());view.put("results",outcome);}
        var p=players.get(self);if(p!=null&&!closed&&phase!=SystemBreachPhase.FINISHED){
            Map<String,Object> me=new LinkedHashMap<>();me.put("passwordSelected",p.password!=null);me.put("passwordOptions",phase==SystemBreachPhase.INITIALIZATION?p.passwordOptions:List.of());
            me.put("challenge",p.challenge==null?Map.of():p.challenge.view(now));me.put("recovery",p.recovery==null?Map.of():p.recovery.view(now));
            me.put("attack",p.attack==null?Map.of():Map.of("attackId",p.attack.id,"targetId",p.attack.target,"options",p.attack.options,"expiresAt",p.attack.expires));
            me.put("trace",now<p.traceUntil&&!p.trace.isEmpty()?Map.of("targetId",p.traceTarget,"clue",p.trace,"expiresAt",p.traceUntil):Map.of());me.put("specialReadyAt",p.specialReadyAt);me.put("keyGating",keyGating);me.put("keys",p.keys);me.put("keyProgress",p.keyProgress);me.put("keyEvery",KEY_EVERY);me.put("challengeReadyAt",p.challengeReadyAt);me.put("sabotage",p.sabotage==null?Map.of():p.sabotage.view());
            var receipt=latest.get(self);if(receipt!=null)me.put("lastAction",Map.of("requestId",receipt.requestId,"action",receipt.action,"status",receipt.result.status,"details",receipt.result.details,"appliedAt",receipt.appliedAt));
            me.put("actions",actionAvailability(p,now,online));
            view.put("self",me);
        }
        view.put("rewards",Map.of("PASSWORD_DECRYPTION",cfg.reward(ChallengeType.PASSWORD_DECRYPTION),"CIRCUIT_BYPASS",cfg.reward(ChallengeType.CIRCUIT_BYPASS),"SIGNAL_INTERCEPTION",cfg.reward(ChallengeType.SIGNAL_INTERCEPTION),"DATA_ANALYSIS",cfg.reward(ChallengeType.DATA_ANALYSIS),"PORT_DETECTION",cfg.reward(ChallengeType.PORT_DETECTION)));
        view.put("costs",Map.of("attack",cfg.get(ATTACK_COST),"firewallSurcharge",cfg.get(FIREWALL_COST_STEP),"firewall2",cfg.get(FIREWALL_2_COST),"firewall3",cfg.get(FIREWALL_3_COST),"TROJAN",cfg.cost(SpecialAttackType.TROJAN),"DATA_LEAK",cfg.cost(SpecialAttackType.DATA_LEAK),"SYSTEM_OVERLOAD",cfg.cost(SpecialAttackType.SYSTEM_OVERLOAD),"FIREWALL_BREAKER",cfg.cost(SpecialAttackType.FIREWALL_BREAKER),"TRACE_ATTACK",cfg.cost(SpecialAttackType.TRACE_ATTACK)));
        return view;
    }
    public synchronized void close(){closed=true;phase=SystemBreachPhase.FINISHED;for(var p:players.values())p.secrets();requests.clear();handled.clear();latest.clear();events.clear();}
}
