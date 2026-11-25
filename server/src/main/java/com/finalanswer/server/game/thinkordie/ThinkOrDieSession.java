package com.finalanswer.server.game.thinkordie;

import com.finalanswer.server.validation.*;
import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * THINK OR DIE — one server-authoritative match. Every player (alive or ghost) gets the same category and types as
 * many answers as they can before the server deadline. Quantity of correct answers is the main goal; originality adds
 * to it (one player: 150, two: 100, three or more: 50, wrong: −25 by default).
 *
 * <pre>
 * INTRO → CATEGORY_REVEAL → ANSWERING → ANSWER_VALIDATION → [DISPUTE] → ANSWER_REVEAL → ROUND_RESULTS
 *       → (next CATEGORY_REVEAL | FINAL_RESULTS) → COMPLETED
 * </pre>
 * Validation starts the moment an answer arrives (deterministic steps immediately, the optional AI judge on its own
 * thread). After the deadline the session waits at most {@code validationMaxMs}; anything still undecided goes to the
 * vote, and a vote without a majority is neutral. Nothing here blocks: {@link #tick} only reads finished futures.
 *
 * <p>Privacy: {@link #snapshot} never carries another player's answer text before ANSWER_REVEAL (the host's own
 * client gets live text only when {@code hiddenAnswers} is off), and never any verified answer of the category.
 */
public final class ThinkOrDieSession {
    public enum Phase {INTRO,CATEGORY_REVEAL,ANSWERING,ANSWER_VALIDATION,DISPUTE,ANSWER_REVEAL,ROUND_RESULTS,FINAL_RESULTS,COMPLETED}
    public static final class Failure extends RuntimeException{public final int status;public Failure(int status,String code){super(code);this.status=status;}}
    public static final int MIN_PLAYERS=2,MAX_PLAYERS=8;
    /**
     * An answer the AI judge called wrong costs nothing unless -Dthinkordie.aiPenalties=true: measured accuracy is
     * 93 % with 0 false accepts but 2.4 % false rejects (docs/think-or-die/AI_PACK.md), so the AI never takes points.
     */
    static final boolean AI_PENALTIES=Boolean.getBoolean("thinkordie.aiPenalties");

    static final class Sub{
        final String id,player,text,key;final long at;Verdict verdict;CompletableFuture<Verdict> pending;
        /** final status used for scoring: VALID, INVALID, DUPLICATE, UNCERTAIN (neutral), REJECTED (voted down) */
        String result="";int points;String canonical;
        Sub(String id,String player,String text,String key,long at,Verdict v){this.id=id;this.player=player;this.text=text;this.key=key;this.at=at;verdict=v;}
    }
    static final class Dispute{final String id,key,text;final Set<String> authors=new HashSet<>();final Map<String,Boolean> votes=new HashMap<>();String outcome="";
        Dispute(String id,String key,String text){this.id=id;this.key=key;this.text=text;}}
    public static final class Player{
        public final String id;public final int seat;public boolean ghost;public boolean resurrected;
        public long points;public int correct,unique,incorrect,roundPoints,roundCorrect,roundUnique,roundIncorrect;public boolean roundResurrected;
        long lastSubmit;int roundCount;
        Player(String id,int seat,boolean ghost){this.id=id;this.seat=seat;this.ghost=ghost;}
    }
    public record Standing(String playerId,int rank,long points,int correct,int unique,int incorrect,long souls,boolean resurrected){}

    public final String id=UUID.randomUUID().toString();
    public final String lang;
    private final ThinkOrDieConfig cfg;private final ValidationEngine engine;private final List<Category> categories;
    private final List<Player> players=new ArrayList<>();private final Map<String,Player> byId=new LinkedHashMap<>();
    private Phase phase;private long phaseStarted,phaseEnds;private int round;
    private final List<Sub> subs=new ArrayList<>();private final List<Dispute> disputes=new ArrayList<>();
    private final Set<String> handled=new HashSet<>();private final Deque<String> revivals=new ArrayDeque<>();
    private List<Map<String,Object>> reveal=List.of();private List<Standing> standings=List.of();
    private int subSeq;
    /** set by the room once rewards went into the SOULS wallet */
    public boolean paid;

    /**
     * @param ghosts players who start as ghosts (they play normally and can resurrect)
     */
    public ThinkOrDieSession(List<String> seats,Set<String> ghosts,List<Category> categories,ValidationEngine engine,ThinkOrDieConfig cfg,String lang,long now){
        if(seats.size()<MIN_PLAYERS||seats.size()>MAX_PLAYERS)throw new Failure(409,"TOD_PLAYER_COUNT");
        if(new HashSet<>(seats).size()!=seats.size())throw new Failure(400,"TOD_INVALID_ROSTER");
        if(categories.size()<cfg.rounds())throw new IllegalArgumentException("need "+cfg.rounds()+" categories");
        this.cfg=cfg;this.engine=engine;this.categories=List.copyOf(categories.subList(0,cfg.rounds()));this.lang="ru".equals(lang)?"ru":"en";
        for(int i=0;i<seats.size();i++){Player p=new Player(seats.get(i),i,ghosts.contains(seats.get(i)));players.add(p);byId.put(p.id,p);}
        enter(Phase.INTRO,now,cfg.introMs());
    }

    public Phase phase(){return phase;}
    public int round(){return round;}
    public ThinkOrDieConfig config(){return cfg;}
    public Player player(String id){return byId.get(id);}
    public List<Standing> standings(){return standings;}
    public Category category(){return round<1?null:categories.get(round-1);}
    /** Players who came back to life since the last call (the room flips them to alive exactly once). */
    public List<String> takeRevivals(){List<String> r=new ArrayList<>(revivals);revivals.clear();return r;}

    private void enter(Phase p,long now,long d){phase=p;phaseStarted=now;phaseEnds=d<0?Long.MAX_VALUE:now+d;}

    /** Advance time; @return true when the phase changed (the room broadcasts). */
    public boolean tick(long now){
        boolean changed=false;
        for(int guard=0;guard<20;guard++){
            if(phase==Phase.ANSWER_VALIDATION&&now>=phaseStarted+cfg.validationMinMs()&&allSettled()){finishValidation(now);changed=true;continue;}
            if(phase==Phase.DISPUTE&&now<phaseEnds&&disputes.stream().allMatch(d->d.votes.size()>=eligible(d).size())){phaseEnds=now;}
            if(now<phaseEnds)break;
            long at=phaseEnds;changed=true;
            switch(phase){
                case INTRO->startRound(1,at);
                case CATEGORY_REVEAL->{for(Player p:players)p.lastSubmit=0;enter(Phase.ANSWERING,at,cfg.answerMs());}
                case ANSWERING->enter(Phase.ANSWER_VALIDATION,at,cfg.validationMaxMs());
                case ANSWER_VALIDATION->finishValidation(at);
                case DISPUTE->{closeDisputes();scoreRound();enterReveal(at);}
                case ANSWER_REVEAL->enter(Phase.ROUND_RESULTS,at,cfg.roundResultsMs());
                case ROUND_RESULTS->{if(round<cfg.rounds())startRound(round+1,at);else{standings=rank();enter(Phase.FINAL_RESULTS,at,cfg.finalMs());}}
                case FINAL_RESULTS->enter(Phase.COMPLETED,at,-1);
                default->{return changed;}
            }
        }
        return changed;
    }
    private void startRound(int n,long now){
        round=n;subs.clear();disputes.clear();reveal=List.of();
        for(Player p:players){p.roundPoints=p.roundCorrect=p.roundUnique=p.roundIncorrect=p.roundCount=0;p.roundResurrected=false;}
        enter(Phase.CATEGORY_REVEAL,now,cfg.categoryMs());
    }
    private boolean allSettled(){for(Sub s:subs)if(s.verdict.status()==ValidationStatus.PENDING&&(s.pending==null||!s.pending.isDone()))return false;return true;}

    /** Collect AI results, mark anything still pending as uncertain, then dispute or score. */
    private void finishValidation(long now){
        for(Sub s:subs)if(s.verdict.status()==ValidationStatus.PENDING){
            Verdict v=s.pending!=null&&s.pending.isDone()?s.pending.getNow(null):null;
            s.verdict=v==null?Verdict.uncertain(Verdict.Source.FALLBACK):v;}
        markPersonalDuplicates();
        Map<String,Dispute> byKey=new LinkedHashMap<>();
        for(Sub s:subs)if(s.result.isEmpty()&&s.verdict.status()==ValidationStatus.UNCERTAIN){
            Dispute d=byKey.computeIfAbsent(s.key,k->new Dispute("d"+(byKey.size()+1),k,s.text));d.authors.add(s.player);}
        int n=0;for(Dispute d:byKey.values()){if(n++<cfg.maxDisputes()&&!eligibleFor(d).isEmpty())disputes.add(d);}
        if(disputes.isEmpty()){scoreRound();enterReveal(now);}
        else enter(Phase.DISPUTE,now,cfg.voteMs());
    }
    /** A player's second answer with the same canonical id (or the same text) scores 0 and never counts globally. */
    private void markPersonalDuplicates(){
        Map<String,Set<String>> seen=new HashMap<>();
        for(Sub s:subs){Set<String> mine=seen.computeIfAbsent(s.player,k->new HashSet<>());
            boolean dup=mine.contains("t:"+s.key)||s.verdict.valid()&&mine.contains("c:"+s.verdict.canonicalId());
            mine.add("t:"+s.key);if(s.verdict.valid())mine.add("c:"+s.verdict.canonicalId());
            if(dup)s.result="DUPLICATE";}
    }
    private Set<String> eligibleFor(Dispute d){Set<String> e=new HashSet<>();for(Player p:players)if(!d.authors.contains(p.id))e.add(p.id);return e;}
    private Set<String> eligible(Dispute d){Set<String> e=eligibleFor(d);e.retainAll(connected);return e.isEmpty()?eligibleFor(d):e;}
    private Set<String> connected=Set.of();
    /** The room tells the session who is online (voting ends early once every online eligible voter voted). */
    public void connected(Collection<String> online){connected=Set.copyOf(online);}

    private void closeDisputes(){
        for(Dispute d:disputes){long yes=d.votes.values().stream().filter(b->b).count(),no=d.votes.size()-yes;
            d.outcome=yes>no?"ACCEPTED":no>yes?"REJECTED":"NEUTRAL";
            for(Sub s:subs)if(s.key.equals(d.key)&&s.result.isEmpty()&&s.verdict.status()==ValidationStatus.UNCERTAIN){
                if(d.outcome.equals("ACCEPTED"))s.verdict=Verdict.valid("vote:"+d.key,Verdict.Source.VOTE);
                else if(d.outcome.equals("REJECTED"))s.result="REJECTED";}}
    }

    private void scoreRound(){
        // a vote-accepted or AI answer can now equal an earlier canonical of the same player
        for(Sub s:subs)if("DUPLICATE".equals(s.result))s.result="";
        markPersonalDuplicates();
        Map<String,Set<String>> owners=new HashMap<>();
        for(Sub s:subs)if(s.result.isEmpty()&&s.verdict.valid())owners.computeIfAbsent(s.verdict.canonicalId(),k->new LinkedHashSet<>()).add(s.player);
        for(Sub s:subs){Player p=byId.get(s.player);
            if(s.result.equals("DUPLICATE")){s.points=0;continue;}
            if(s.result.equals("REJECTED")){s.points=cfg.voteRejectPenalty();p.roundIncorrect++;}
            else if(s.verdict.valid()){int n=owners.get(s.verdict.canonicalId()).size();s.canonical=s.verdict.canonicalId();s.result=n==1?"UNIQUE":n==2?"SHARED":"MANY";s.points=cfg.pointsFor(n);p.roundCorrect++;if(n==1)p.roundUnique++;}
            else if(s.verdict.status()==ValidationStatus.INVALID){s.result="INVALID";s.points=s.verdict.source()==Verdict.Source.AI&&!AI_PENALTIES?0:cfg.pointsInvalid();p.roundIncorrect++;}
            else{s.result="UNCERTAIN";s.points=0;}
            p.roundPoints+=s.points;}
        for(Player p:players){p.points+=p.roundPoints;p.correct+=p.roundCorrect;p.unique+=p.roundUnique;p.incorrect+=p.roundIncorrect;}
        for(Player p:players)if(p.ghost&&!p.resurrected&&qualifies(p)){p.resurrected=true;p.roundResurrected=true;p.ghost=false;revivals.add(p.id);}
        reveal=buildReveal(owners);
    }
    /** Ghost rule: at least N distinct answers this round, every one VALID and unique; nothing wrong or unresolved. */
    private boolean qualifies(Player p){
        int good=0;
        for(Sub s:subs){if(!s.player.equals(p.id)||s.result.equals("DUPLICATE"))continue;
            if(!s.result.equals("UNIQUE"))return false;good++;}
        return good>=cfg.resurrectMinAnswers();
    }
    private void enterReveal(long now){
        long groups=reveal.size();
        enter(Phase.ANSWER_REVEAL,now,Math.min(cfg.revealMaxMs(),cfg.revealBaseMs()+groups*cfg.revealPerAnswerMs()));
    }
    private List<Map<String,Object>> buildReveal(Map<String,Set<String>> owners){
        Category c=category();List<Map<String,Object>> out=new ArrayList<>();Set<String> done=new HashSet<>();
        // correct answers, rarest first, then wrong and neutral ones
        List<Sub> order=new ArrayList<>(subs);
        order.sort(Comparator.comparingInt((Sub s)->switch(s.result){case "UNIQUE"->0;case "SHARED"->1;case "MANY"->2;case "UNCERTAIN"->3;case "REJECTED"->4;case "INVALID"->5;default->6;}).thenComparingLong(s->s.at));
        for(Sub s:order){if(s.result.equals("DUPLICATE"))continue;
            String group=s.canonical!=null?"c:"+s.canonical:"t:"+s.result+":"+s.key;if(!done.add(group))continue;
            Map<String,Object> m=new LinkedHashMap<>();
            Category.Answer a=s.canonical==null?null:c.answer(s.canonical);
            m.put("label",a==null?s.text:"ru".equals(lang)?a.labelRu():a.labelEn());
            m.put("status",s.result);m.put("points",s.points);
            List<String> who=new ArrayList<>();for(Sub o:subs)if(!o.result.equals("DUPLICATE")&&(s.canonical!=null?s.canonical.equals(o.canonical):o.canonical==null&&o.result.equals(s.result)&&o.key.equals(s.key))&&!who.contains(o.player))who.add(o.player);
            m.put("players",who);m.put("corrected",s.verdict.corrected());m.put("source",s.verdict.source().name());
            out.add(m);}
        return List.copyOf(out);
    }

    /** Final ranking: points, then correct answers, then unique answers; full ties share a rank and its reward. */
    private List<Standing> rank(){
        List<Player> order=new ArrayList<>(players);
        Comparator<Player> cmp=Comparator.comparingLong((Player p)->-p.points).thenComparingInt(p->-p.correct).thenComparingInt(p->-p.unique);
        order.sort(cmp.thenComparingInt(p->p.seat));
        List<Standing> out=new ArrayList<>();int rank=0;Player prev=null;
        for(int i=0;i<order.size();i++){Player p=order.get(i);if(prev==null||cmp.compare(prev,p)!=0)rank=i+1;prev=p;
            long souls=rank==1?cfg.rewardFirst():rank==2?cfg.rewardSecond():rank==3?cfg.rewardThird():0;
            out.add(new Standing(p.id,rank,p.points,p.correct,p.unique,p.incorrect,souls,p.resurrected));}
        return List.copyOf(out);
    }

    // ---------------------------------------------------------------- commands
    private Player seat(String member){Player p=byId.get(member);if(p==null)throw new Failure(403,"TOD_NOT_A_PLAYER");return p;}

    /**
     * One answer. Idempotent per request id; validated at once (deterministic) and queued for the AI judge when the
     * engine says PENDING. @return the submission id, or null for a retried request that was already accepted
     */
    public String submit(String member,String requestId,int forRound,String raw,long now){
        Player p=seat(member);
        if(requestId==null||requestId.isEmpty()||requestId.length()>64)throw new Failure(400,"TOD_INVALID_MESSAGE");
        if(!handled.add(member+":"+requestId))return null;
        try{
            tick(now);
            if(phase!=Phase.ANSWERING)throw new Failure(409,phase.ordinal()<Phase.ANSWERING.ordinal()?"TOD_NOT_OPEN":"TOD_ANSWERS_CLOSED");
            if(forRound!=round)throw new Failure(409,"TOD_STALE_ROUND");
            if(now>phaseEnds+cfg.graceMs())throw new Failure(409,"TOD_TOO_LATE");
            if(p.roundCount>=cfg.maxAnswersPerRound())throw new Failure(429,"TOD_TOO_MANY_ANSWERS");
            if(p.lastSubmit>0&&now-p.lastSubmit<cfg.minSubmitIntervalMs())throw new Failure(429,"TOD_TOO_FAST");
            if(raw!=null&&raw.length()>400)throw new Failure(400,"TOD_ANSWER_TOO_LONG");
            AnswerInput in=AnswerInput.of(raw);
            if(in==null)throw new Failure(400,raw==null||raw.isBlank()?"TOD_EMPTY_ANSWER":"TOD_ANSWER_TOO_LONG");
            Category c=category();Verdict v=engine.validate(c,in);
            Sub s=new Sub("s"+(++subSeq),p.id,in.clean(),in.key(),Math.min(now,phaseEnds),v);
            for(Sub o:subs)if(o.player.equals(p.id)&&(o.key.equals(in.key())||v.valid()&&o.verdict.valid()&&o.verdict.canonicalId().equals(v.canonicalId()))){s.verdict=v.duplicate();break;}
            if(s.verdict.status()==ValidationStatus.PENDING)s.pending=engine.judgeLater(c,lang,in);
            subs.add(s);p.roundCount++;p.lastSubmit=now;liveDirty=true;
            return s.id;
        }catch(Failure f){handled.remove(member+":"+requestId);throw f;}
    }

    /** A dispute vote: any player but the answer's authors, once per dispute (a second vote replaces the first). */
    public void vote(String member,String disputeId,boolean accept,long now){
        Player p=seat(member);tick(now);
        if(phase!=Phase.DISPUTE)throw new Failure(409,"TOD_NO_VOTE");
        Dispute d=disputes.stream().filter(x->x.id.equals(disputeId)).findFirst().orElseThrow(()->new Failure(404,"TOD_UNKNOWN_DISPUTE"));
        if(d.authors.contains(p.id))throw new Failure(403,"TOD_OWN_ANSWER");
        d.votes.put(p.id,accept);
    }

    // ---------------------------------------------------------------- views
    public boolean liveDirty;
    private long ends(){return phaseEnds==Long.MAX_VALUE?-1:phaseEnds;}
    /** Server deadline of the current phase (-1 when open-ended). */
    public long snapshotEnds(){return ends();}

    /** @param self the phone's player id (adds only that player's own answers); @param host the host's game client */
    public Map<String,Object> snapshot(String self,boolean host,long now){
        Map<String,Object> v=new LinkedHashMap<>();
        v.put("sessionId",id);v.put("phase",phase.name());v.put("serverTime",now);v.put("phaseStartedAt",phaseStarted);v.put("phaseEndsAt",ends());
        v.put("round",round);v.put("rounds",cfg.rounds());v.put("lang",lang);v.put("answerMs",cfg.answerMs());v.put("hiddenAnswers",cfg.hiddenAnswers());
        v.put("maxAnswer",AnswerInput.MAX_LENGTH);v.put("resurrectMin",cfg.resurrectMinAnswers());
        v.put("points",Map.of("unique",cfg.pointsUnique(),"two",cfg.pointsTwo(),"many",cfg.pointsMany(),"invalid",cfg.pointsInvalid()));
        v.put("rewards",List.of(cfg.rewardFirst(),cfg.rewardSecond(),cfg.rewardThird()));
        Category c=category();
        if(c!=null&&phase!=Phase.INTRO){v.put("categoryId",c.id());v.put("categoryType",c.type().name());v.put("textEn",c.textEn());v.put("textRu",c.textRu());}
        boolean validating=phase==Phase.ANSWER_VALIDATION;
        List<Map<String,Object>> ps=new ArrayList<>();
        for(Player p:players){Map<String,Object> m=new LinkedHashMap<>();
            m.put("id",p.id);m.put("ghost",p.ghost);m.put("resurrected",p.resurrected);m.put("points",p.points);m.put("answers",p.roundCount);
            boolean shown=phase.ordinal()>=Phase.ANSWER_REVEAL.ordinal();
            if(shown){m.put("roundPoints",p.roundPoints);m.put("roundCorrect",p.roundCorrect);m.put("roundUnique",p.roundUnique);m.put("roundIncorrect",p.roundIncorrect);m.put("roundResurrected",p.roundResurrected);}
            m.put("correct",p.correct);m.put("unique",p.unique);m.put("incorrect",p.incorrect);
            if(validating){long done=subs.stream().filter(s->s.player.equals(p.id)&&(s.verdict.status()!=ValidationStatus.PENDING||s.pending!=null&&s.pending.isDone())).count();m.put("checked",done);}
            ps.add(m);}
        v.put("players",ps);
        if(phase==Phase.DISPUTE){List<Map<String,Object>> ds=new ArrayList<>();
            for(Dispute d:disputes){Map<String,Object> m=new LinkedHashMap<>();m.put("id",d.id);m.put("text",d.text);m.put("votes",d.votes.size());m.put("voters",eligible(d).size());
                if(self!=null){m.put("mine",d.authors.contains(self));if(d.votes.containsKey(self))m.put("myVote",d.votes.get(self));}ds.add(m);}
            v.put("disputes",ds);}
        if(phase.ordinal()>=Phase.ANSWER_REVEAL.ordinal()&&phase!=Phase.COMPLETED||phase==Phase.COMPLETED&&!reveal.isEmpty())v.put("reveal",reveal);
        if(!standings.isEmpty()){List<Map<String,Object>> st=new ArrayList<>();for(Standing s:standings)st.add(Map.of("playerId",s.playerId(),"rank",s.rank(),"points",s.points(),"correct",s.correct(),"unique",s.unique(),"incorrect",s.incorrect(),"souls",s.souls(),"resurrected",s.resurrected()));v.put("standings",st);}
        Player me=self==null?null:byId.get(self);
        if(me!=null){List<Map<String,Object>> mine=new ArrayList<>();
            for(Sub s:subs)if(s.player.equals(me.id)){Map<String,Object> m=new LinkedHashMap<>();m.put("id",s.id);m.put("text",s.text);m.put("state",ownState(s));if(!s.result.isEmpty()&&phase.ordinal()>=Phase.ANSWER_REVEAL.ordinal())m.put("points",s.points);mine.add(m);}
            v.put("me",Map.of("ghost",me.ghost,"history",mine,"count",me.roundCount));}
        if(host&&!cfg.hiddenAnswers()&&phase==Phase.ANSWERING)v.put("live",live());
        return v;
    }
    /** What a player sees for their own answer while answering: accepted / rejected / duplicate / pending. */
    private String ownState(Sub s){
        if(phase.ordinal()>=Phase.ANSWER_REVEAL.ordinal()&&!s.result.isEmpty())return s.result;
        return switch(s.verdict.status()){case VALID->"ACCEPTED";case INVALID->"REJECTED";case DUPLICATE->"DUPLICATE";default->"PENDING";};
    }
    private List<Map<String,Object>> live(){
        List<Map<String,Object>> out=new ArrayList<>();
        for(Player p:players){List<String> last=new ArrayList<>();for(int i=subs.size()-1;i>=0&&last.size()<6;i--)if(subs.get(i).player.equals(p.id))last.add(0,subs.get(i).text);
            out.add(Map.of("id",p.id,"recent",last));}
        return out;
    }
}
