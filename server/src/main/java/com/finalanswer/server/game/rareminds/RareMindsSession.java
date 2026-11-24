package com.finalanswer.server.game.rareminds;

import com.finalanswer.server.game.rareminds.RareRules.*;
import java.util.*;

/**
 * RARE MINDS — DEADLY ANSWERS. One server-authoritative match: 8 open questions, free-text answers, the server clock
 * as the only timer. Phones send drafts (throttled) and one locked answer per question; everything that scores is
 * computed here by {@link RareRules}.
 *
 * <p>States: INITIALIZING (rules on the big screen) → QUESTION_ACTIVE → ANSWERS_LOCKED (validation, collisions,
 * rarity and rewards are applied in one step on entering it) → REVEALING_RESULTS → the next question, or
 * FINAL_RESULTS after question 8 → COMPLETED. Ghost status and resurrection progress live in the player state.
 *
 * <p>Privacy: {@link #snapshot} (sent to every phone and to the public big screen) never carries another player's
 * draft or unrevealed answer; drafts only leave through {@link #monitor}, served to the host's private view.
 */
public final class RareMindsSession {
    /** CLASSIC, or DUELS: with an even number of players, sometimes (15 %) everyone also plays a fixed 1-on-1 duel */
    public enum Format {CLASSIC,DUELS}
    public static final double DUEL_CHANCE=.15;
    public final Format format;
    public enum Phase {INITIALIZING,QUESTION_ACTIVE,ANSWERS_LOCKED,REVEALING_RESULTS,FINAL_RESULTS,COMPLETED}
    public record Timing(long introMs,long answerMs,long lockedMs,long revealMs,long finalRevealMs,long resultsMs,long graceMs){
        public static final Timing DEFAULT=new Timing(7000,18000,3200,6500,7500,16000,350);
    }
    public static final class Failure extends RuntimeException{public final int status;public Failure(int status,String code){super(code);this.status=status;}}
    private record Draft(String text,boolean risk,long at){}

    public final String id=UUID.randomUUID().toString();
    private final List<RareQuestion> questions;private final AnswerValidator validator;private final CuratedAnswerValidator candidates;
    private final RarityStats stats;private final Timing timing;
    private final List<Player> players=new ArrayList<>();private final Map<String,Player> byId=new LinkedHashMap<>();
    private Phase phase=Phase.INITIALIZING;private long phaseStarted,phaseEnds;private int question;// 1-based, 0 before the first
    private final Map<String,Submission> subs=new HashMap<>();private final Map<String,Draft> drafts=new HashMap<>();
    private final Set<String> handled=new HashSet<>();
    private final List<Outcome> outcomes=new ArrayList<>();private List<Standing> standings=List.of();
    /** set by the room once the match souls went into the SOULS wallet */
    public boolean paid;

    public RareMindsSession(List<String> seats,RareQuestionBank bank,RarityStats stats,Random random,long now){this(seats,bank,stats,random,now,null);}
    /** @param forced a format to use (QA); null rolls it: DUELS with {@link #DUEL_CHANCE} when the player count is even */
    public RareMindsSession(List<String> seats,RareQuestionBank bank,RarityStats stats,Random random,long now,Format forced){
        this(seats,bank.draw(RareRules.QUESTIONS,random),bank.validator(),stats,Timing.DEFAULT,now,forced!=null?forced:seats.size()%2==0&&random.nextDouble()<DUEL_CHANCE?Format.DUELS:Format.CLASSIC,random);}
    public RareMindsSession(List<String> seats,List<RareQuestion> questions,CuratedAnswerValidator validator,RarityStats stats,Timing timing,long now){this(seats,questions,validator,stats,timing,now,Format.CLASSIC,new Random(0));}
    public RareMindsSession(List<String> seats,List<RareQuestion> questions,CuratedAnswerValidator validator,RarityStats stats,Timing timing,long now,Format format,Random random){
        if(seats.size()<RareRules.MIN_PLAYERS||seats.size()>RareRules.MAX_PLAYERS)throw new Failure(409,"RM_PLAYER_COUNT");
        if(new HashSet<>(seats).size()!=seats.size())throw new Failure(400,"RM_INVALID_ROSTER");
        if(questions.size()!=RareRules.QUESTIONS)throw new IllegalArgumentException("need "+RareRules.QUESTIONS+" questions");
        this.questions=List.copyOf(questions);this.validator=validator;this.candidates=validator;this.stats=stats;this.timing=timing;
        for(int i=0;i<seats.size();i++){Player p=new Player(seats.get(i),i);players.add(p);byId.put(p.id,p);}
        if(format==Format.DUELS&&seats.size()%2!=0)throw new Failure(409,"RM_DUELS_NEED_EVEN");
        this.format=format;
        if(format==Format.DUELS){List<Player> order=new ArrayList<>(players);Collections.shuffle(order,random);
            for(int i=0;i+1<order.size();i+=2){order.get(i).opponent=order.get(i+1).id;order.get(i+1).opponent=order.get(i).id;}}
        enter(Phase.INITIALIZING,now,timing.introMs());
    }

    public Phase phase(){return phase;}
    public int question(){return question;}
    public List<String> seats(){return players.stream().map(p->p.id).toList();}
    public Player player(String id){return byId.get(id);}
    public List<Outcome> outcomes(){return List.copyOf(outcomes);}
    public List<Standing> standings(){return standings;}
    public RareQuestion currentQuestion(){return question<1?null:questions.get(question-1);}

    private void enter(Phase p,long now,long duration){phase=p;phaseStarted=now;phaseEnds=duration<0?Long.MAX_VALUE:now+duration;}

    /** Advance time. @return true when the phase changed (the room then broadcasts). */
    public boolean tick(long now){
        boolean changed=false;
        while(now>=phaseEnds){long at=phaseEnds;changed=true;switch(phase){
            case INITIALIZING->startQuestion(1,at);
            case QUESTION_ACTIVE->lock(at);
            case ANSWERS_LOCKED->enter(Phase.REVEALING_RESULTS,at,(question==RareRules.QUESTIONS?timing.finalRevealMs():timing.revealMs())); /* duels add their scoreboard */
            case REVEALING_RESULTS->{if(question<RareRules.QUESTIONS)startQuestion(question+1,at);else{standings=RareRules.finish(players);enter(Phase.FINAL_RESULTS,at,timing.resultsMs());}}
            case FINAL_RESULTS->enter(Phase.COMPLETED,at,-1);
            default->{return changed;}
        }}
        return changed;
    }
    private void startQuestion(int n,long now){question=n;subs.clear();drafts.clear();enter(Phase.QUESTION_ACTIVE,now,timing.answerMs());}

    /** Lock answers (a draft left unsent at the deadline is time-locked), then validate, score and record statistics. */
    private void lock(long now){
        for(Player p:players)if(!subs.containsKey(p.id)){Draft d=drafts.get(p.id);if(d!=null&&!d.text.isEmpty())subs.put(p.id,new Submission(d.text,d.risk,d.at,true));}
        RareQuestion q=currentQuestion();
        Outcome o=RareRules.resolve(question,q,players,Map.copyOf(subs),validator,stats);
        outcomes.add(o);stats.record(q.id(),o.recordedAnswers());
        enter(Phase.ANSWERS_LOCKED,now,timing.lockedMs());
    }

    /** Close the answer window early once every connected seated player has locked an answer. */
    public boolean everyoneAnswered(Collection<String> connected,long now){
        if(phase!=Phase.QUESTION_ACTIVE||subs.isEmpty())return false;
        for(Player p:players)if(connected.contains(p.id)&&!subs.containsKey(p.id))return false;
        long close=now+600;if(close<phaseEnds){phaseEnds=close;return true;}return false;
    }

    private Player seat(String member){Player p=byId.get(member);if(p==null)throw new Failure(403,"RM_NOT_A_PLAYER");return p;}
    private String text(String raw){
        String s=RareText.clean(raw);
        if(s==null)throw new Failure(400,"RM_INVALID_ANSWER");
        if(s.codePointCount(0,s.length())>RareText.MAX_ANSWER)throw new Failure(400,"RM_ANSWER_TOO_LONG");
        return s;
    }
    private void open(int forQuestion,long now){
        if(phase!=Phase.QUESTION_ACTIVE)throw new Failure(409,phase==Phase.INITIALIZING?"RM_NOT_STARTED":"RM_ANSWERS_CLOSED");
        if(forQuestion!=question)throw new Failure(409,"RM_STALE_QUESTION");
        if(now>phaseEnds+timing.graceMs())throw new Failure(409,"RM_TOO_LATE");
    }

    /** Live typing (debounced on the phone). Never broadcast; read only by the host's private monitor. */
    public void draft(String member,int forQuestion,String raw,boolean risk,long now){
        Player p=seat(member);
        if(phase!=Phase.QUESTION_ACTIVE||forQuestion!=question||subs.containsKey(p.id))return; // late or stale drafts are dropped quietly
        String s=text(raw);drafts.put(p.id,new Draft(s,risk&&canRisk(p),now));liveDirty=true;
    }

    /**
     * Lock this player's answer for the question. Idempotent per request id (a retried message is ignored, never
     * scored twice). @return false for a duplicate request
     */
    public boolean submit(String member,String requestId,int forQuestion,String raw,boolean risk,long now){
        Player p=seat(member);if(!handled.add(member+":"+requestId))return false;
        try{
            tick(now);open(forQuestion,now);
            if(subs.containsKey(p.id))throw new Failure(409,"RM_ALREADY_SUBMITTED");
            String s=text(raw);if(s.isEmpty())throw new Failure(400,"RM_EMPTY_ANSWER");
            subs.put(p.id,new Submission(s,risk&&canRisk(p),Math.min(now,phaseEnds),false));drafts.remove(p.id);
            return true;
        }catch(Failure f){handled.remove(member+":"+requestId);throw f;}
    }
    private static boolean canRisk(Player p){return p.deathZone();}

    // ---------------------------------------------------------------- views
    private long ends(){return phaseEnds==Long.MAX_VALUE?-1:phaseEnds;}

    /** Public state for phones and the shared screen; {@code self} adds only that player's own data. */
    public Map<String,Object> snapshot(String self,long now){return snapshot(self,false,now);}
    /** {@code host}: the host's own game client also gets live typing (the host shows it on the big screen by choice). */
    public Map<String,Object> snapshot(String self,boolean host,long now){
        Map<String,Object> v=new LinkedHashMap<>();
        v.put("sessionId",id);v.put("format",format.name());v.put("duelBonus",question==RareRules.QUESTIONS?RareRules.FINAL_DUEL_BONUS:RareRules.DUEL_BONUS);v.put("phase",phase.name());v.put("serverTime",now);v.put("phaseStartedAt",phaseStarted);v.put("phaseEndsAt",ends());
        v.put("question",question);v.put("questions",RareRules.QUESTIONS);v.put("finalQuestion",question==RareRules.QUESTIONS);
        v.put("answerMs",timing.answerMs());v.put("maxAnswer",RareText.MAX_ANSWER);
        v.put("jackpot",question==RareRules.QUESTIONS?RareRules.FINAL_JACKPOT:RareRules.JACKPOT);v.put("multiplier",question==RareRules.QUESTIONS?2:1);
        List<Map<String,Object>> tiers=new ArrayList<>();for(var t:Rarity.Tier.values())tiers.add(Map.of("id",t.name(),"en",t.en,"ru",t.ru,"souls",t.souls));v.put("tiers",tiers);
        RareQuestion q=currentQuestion();
        if(q!=null&&phase!=Phase.INITIALIZING){v.put("questionId",q.id());v.put("category",q.category());v.put("textEn",q.textEn());v.put("textRu",q.textRu());}
        List<Map<String,Object>> ps=new ArrayList<>();
        for(Player p:players){Map<String,Object> m=new LinkedHashMap<>();
            m.put("id",p.id);m.put("souls",p.souls);m.put("collisions",p.collisions);m.put("alive",p.alive);m.put("deathZone",p.deathZone());
            m.put("submitted",phase==Phase.QUESTION_ACTIVE&&subs.containsKey(p.id));
            m.put("eliminatedAt",p.eliminatedAt);m.put("resurrectionPossible",p.resurrectionPossible);m.put("resurrected",p.resurrected);
            m.put("ghostUnique",p.ghostUnique);m.put("ghostRemaining",p.ghostRemaining(RareRules.QUESTIONS));m.put("jackpotStreak",p.jackpotStreak);m.put("jackpots",p.jackpots);if(p.opponent!=null){m.put("opponent",p.opponent);m.put("duelWins",p.duelWins);}
            ps.add(m);}
        v.put("players",ps);
        if(!outcomes.isEmpty()&&(phase==Phase.ANSWERS_LOCKED||phase==Phase.REVEALING_RESULTS||phase==Phase.FINAL_RESULTS||phase==Phase.COMPLETED))v.put("reveal",outcomeView(outcomes.get(outcomes.size()-1)));
        if(!standings.isEmpty()){List<Map<String,Object>> st=new ArrayList<>();for(var s:standings)st.add(Map.of("playerId",s.playerId(),"rank",s.rank(),"souls",s.souls(),"alive",s.alive(),"winner",s.winner(),"winnerBonus",s.winnerBonus()));v.put("standings",st);}
        Player me=self==null?null:byId.get(self);
        if(me!=null){Map<String,Object> m=new LinkedHashMap<>();
            Submission s=phase==Phase.QUESTION_ACTIVE?subs.get(me.id):null;
            m.put("submitted",s!=null);if(s!=null){m.put("answer",s.text());m.put("riskIt",s.riskIt());}
            m.put("canRisk",canRisk(me));v.put("me",m);}
        if(host)v.put("live",live());
        return v;
    }
    private Map<String,Object> outcomeView(Outcome o){
        RareQuestion q=questions.get(o.question()-1);
        Map<String,Object> v=new LinkedHashMap<>();v.put("question",o.question());v.put("final",o.finalQuestion());v.put("jackpotWinner",o.jackpotWinner());
        List<Map<String,Object>> rows=new ArrayList<>();
        for(Row r:o.rows()){Map<String,Object> m=new LinkedHashMap<>();
            m.put("playerId",r.playerId());m.put("text",r.text());m.put("status",r.status().name());m.put("valid",r.valid());m.put("corrected",r.status()==AnswerValidator.Status.VALID_TYPO);
            if(r.valid()){var a=q.answer(r.answerId());m.put("answerId",r.answerId());m.put("labelEn",a.labelEn());m.put("labelRu",a.labelRu());m.put("tier",r.tier().name());m.put("share",Math.exp(-r.rarityScore()/1_000_000.0));}
            m.put("ghost",r.ghost());m.put("collided",r.collided());m.put("sharedWith",r.sharedWith());m.put("penaltyPct",r.collisionPenaltyPct());
            m.put("base",r.baseSouls());m.put("earned",r.earned());m.put("jackpot",r.jackpot());m.put("jackpotSouls",r.jackpotSouls());m.put("jackpotStreak",r.jackpotStreak());
            m.put("risk",r.risk().name());m.put("eliminated",r.eliminated());m.put("deathPenalty",r.deathPenalty());m.put("ghostSuccess",r.ghostSuccess());
            m.put("resurrectionLost",r.resurrectionLost());m.put("resurrected",r.resurrected());m.put("souls",r.soulsAfter());m.put("collisions",r.collisionsAfter());
            m.put("alive",r.aliveAfter());m.put("ghostRemaining",r.ghostRemaining());m.put("duel",r.duelResult());m.put("duelBonus",r.duelBonus());
            rows.add(m);}
        v.put("rows",rows);return v;
    }

    /**
     * HOST-ONLY live monitor: what everyone is typing, what they locked, whether it validates, and provisional
     * collisions (drafts or answers that could become the same canonical answer). Never part of {@link #snapshot}.
     */
    public Map<String,Object> monitor(long now){Map<String,Object> v=snapshot(null,now);v.put("live",live());return v;}
    /** set when a draft or answer changed since the host last got live data */
    public boolean liveDirty;
    private List<Map<String,Object>> live(){
        RareQuestion q=currentQuestion();
        Map<String,Set<String>> cand=new HashMap<>();
        if(q!=null&&phase==Phase.QUESTION_ACTIVE)for(Player p:players){String t=subs.containsKey(p.id)?subs.get(p.id).text():drafts.containsKey(p.id)?drafts.get(p.id).text:"";cand.put(p.id,t.isEmpty()?Set.of():candidates.candidates(q,t));}
        List<Map<String,Object>> live=new ArrayList<>();
        for(Player p:players){Map<String,Object> m=new LinkedHashMap<>();m.put("id",p.id);
            Submission s=subs.get(p.id);Draft d=drafts.get(p.id);String t=s!=null?s.text():d!=null?d.text:"";
            m.put("text",phase==Phase.QUESTION_ACTIVE?t:"");m.put("locked",phase==Phase.QUESTION_ACTIVE&&s!=null);m.put("riskIt",s!=null?s.riskIt():d!=null&&d.risk);
            m.put("updatedAt",s!=null?s.receivedAt():d!=null?d.at:0);
            if(q!=null&&phase==Phase.QUESTION_ACTIVE&&!t.isEmpty()){var r=validator.validate(q,t);m.put("check",r.status().name());if(r.valid()){m.put("answerId",r.answerId());m.put("tier",Rarity.estimate(q,r.answerId(),stats).tier().name());var a=q.answer(r.answerId());m.put("labelEn",a.labelEn());m.put("labelRu",a.labelRu());}}
            List<String> with=new ArrayList<>();Set<String> mine=cand.getOrDefault(p.id,Set.of());
            if(!mine.isEmpty())for(Player o:players)if(o!=p&&!Collections.disjoint(mine,cand.getOrDefault(o.id,Set.of())))with.add(o.id);
            m.put("possibleCollision",with);live.add(m);}
        return live;
    }
}
