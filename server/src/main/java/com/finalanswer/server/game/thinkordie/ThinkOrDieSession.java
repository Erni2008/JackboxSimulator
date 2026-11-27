package com.finalanswer.server.game.thinkordie;

import com.finalanswer.server.validation.*;
import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * THINK OR DIE — one server-authoritative match. Every player (alive or ghost) gets the same category and types as
 * many answers as they can before the server deadline. Quantity of correct answers is the main goal; originality adds
 * to it (one player: 150, two: 100, three or more: 50; a wrong answer scores 0 and never takes points).
 *
 * <pre>
 * INTRO → CATEGORY_REVEAL → ANSWERING → ANSWER_VALIDATION → [DISPUTE] → ANSWER_REVEAL → ROUND_RESULTS
 *       → (next CATEGORY_REVEAL | FINAL_RESULTS) → COMPLETED
 * </pre>
 * Validation starts the moment an answer arrives (deterministic steps immediately, the optional AI judge on its own
 * thread). After the deadline the session waits at most {@code validationMaxMs}; anything still undecided goes to the
 * vote; a tie is accepted, only an empty vote is neutral. Nothing here blocks: {@link #tick} only reads finished futures.
 *
 * <p>Privacy: {@link #snapshot} never carries another player's answer text before ANSWER_REVEAL (the host's own
 * client gets live text only when {@code hiddenAnswers} is off), and never any verified answer of the category.
 */
public final class ThinkOrDieSession {
    /** TURN, TURN_CHECK and TURN_RESULT belong to survival (the standalone mode) */
    public enum Phase {INTRO,CATEGORY_REVEAL,ANSWERING,ANSWER_VALIDATION,DISPUTE,BRACKET,MATCH_INTRO,TURN,TURN_CHECK,TURN_RESULT,MATCH_RESULT,ANSWER_REVEAL,ROUND_RESULTS,FINAL_RESULTS,COMPLETED}
    /** survival formats: everyone against everyone, 1 on 1 knockout duels, 2 on 2 knockout team duels */
    public enum Format {FFA,DUEL,TEAMS}
    public static final class Failure extends RuntimeException{public final int status;public Failure(int status,String code){super(code);this.status=status;}}
    public static final int MIN_PLAYERS=2,MAX_PLAYERS=8;
    /**
     * An answer the AI judge called wrong costs nothing unless -Dthinkordie.aiPenalties=true: measured accuracy is
     * 93 % with 0 false accepts but 2.4 % false rejects (docs/think-or-die/AI_PACK.md), so the AI never takes points.
     */
    static final boolean AI_PENALTIES=Boolean.getBoolean("thinkordie.aiPenalties");

    static final class Sub{
        final String id,player,text,key;final long at;Verdict verdict;CompletableFuture<Verdict> pending;boolean exactRepeat;
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
        /** survival: lives left, and the order of elimination (0 = still in) */
        public int lives,out;
        /** the live counter: accepted non-empty answers of this round without the player's exact own repeats */
        int roundShown;
        Player(String id,int seat,boolean ghost){this.id=id;this.seat=seat;this.ghost=ghost;}
    }
    public record Standing(String playerId,int rank,long points,int correct,int unique,int incorrect,long souls,boolean resurrected){}

    public final String id=UUID.randomUUID().toString();
    public final String lang;
    private final ThinkOrDieConfig cfg;private final ValidationEngine engine;private final List<Category> categories;
    private final List<Player> players=new ArrayList<>();private final Map<String,Player> byId=new LinkedHashMap<>();
    private Phase phase;private long phaseStarted,phaseEnds;private int round;
    private final List<Sub> subs=new ArrayList<>();
    /** answers refused while answering (wrong or a repeat): never counted, scored or revealed; the author sees them crossed out */
    private final List<Sub> dropped=new ArrayList<>();
    /** players whose own answer list changed outside a submit (an AI verdict arrived); the room pushes them a snapshot */
    private final Set<String> touched=new LinkedHashSet<>();
    public List<String> takeTouched(){List<String> r=new ArrayList<>(touched);touched.clear();return r;}private final List<Dispute> disputes=new ArrayList<>();
    private final Set<String> handled=new HashSet<>();private final Deque<String> revivals=new ArrayDeque<>();
    private List<Map<String,Object>> reveal=List.of();private List<Standing> standings=List.of();
    private int subSeq;
    /** set by the room once rewards went into the SOULS wallet */
    public boolean paid;
    /** integrated mode: the rules card is part of this challenge's intro (first appearance in the match) */
    public final boolean rules;
    /** survival mode settings, or null for the classic simultaneous show / match challenge */
    public final SurvivalConfig survival;

    /**
     * @param ghosts players who start as ghosts (they play normally and can resurrect)
     */
    public ThinkOrDieSession(List<String> seats,Set<String> ghosts,List<Category> categories,ValidationEngine engine,ThinkOrDieConfig cfg,String lang,long now){
        this(seats,ghosts,categories,engine,cfg,lang,now,cfg.rulesMs()>0);
    }
    /** @param rules show the rules card in the intro (integrated mode: only the first challenge of a match) */
    public ThinkOrDieSession(List<String> seats,Set<String> ghosts,List<Category> categories,ValidationEngine engine,ThinkOrDieConfig cfg,String lang,long now,boolean rules){
        if(seats.size()<MIN_PLAYERS||seats.size()>MAX_PLAYERS)throw new Failure(409,"TOD_PLAYER_COUNT");
        if(new HashSet<>(seats).size()!=seats.size())throw new Failure(400,"TOD_INVALID_ROSTER");
        if(categories.size()<cfg.rounds())throw new IllegalArgumentException("need "+cfg.rounds()+" categories");
        this.cfg=cfg;this.engine=engine;this.categories=List.copyOf(categories.subList(0,cfg.rounds()));this.lang="ru".equals(lang)?"ru":"en";
        for(int i=0;i<seats.size();i++){Player p=new Player(seats.get(i),i,ghosts.contains(seats.get(i)));players.add(p);byId.put(p.id,p);}
        this.rules=rules;this.survival=null;this.format=Format.FFA;
        enter(Phase.INTRO,now,cfg.introMs()+(rules?cfg.rulesMs():0));
    }
    /**
     * Survival, everyone against everyone: players answer one at a time in seat order. Every answer must be new for the
     * category (nobody may repeat anybody); a wrong answer, a repeat or a timeout costs a life; the turn clock shrinks each
     * lap; a new category every few laps; the last player with lives wins.
     */
    public ThinkOrDieSession(List<String> seats,List<Category> categories,ValidationEngine engine,ThinkOrDieConfig cfg,SurvivalConfig sv,String lang,long now){
        this(seats,categories,engine,cfg,sv,lang,now,Format.FFA,new Random());
    }
    /**
     * Survival in a format. DUEL and TEAMS are knockout brackets: random pairs of sides (one player, or a team of two;
     * an odd player count makes one team of three), one match at a time while everybody watches; sides alternate turns
     * (team members take turns inside their team), each side has {@code duelLives}; the winner moves on, a bye goes
     * through when a round is odd; the last side standing are the champions.
     */
    public ThinkOrDieSession(List<String> seats,List<Category> categories,ValidationEngine engine,ThinkOrDieConfig cfg,SurvivalConfig sv,String lang,long now,Format format,Random random){
        if(seats.size()<MIN_PLAYERS||seats.size()>MAX_PLAYERS)throw new Failure(409,"TOD_PLAYER_COUNT");
        if(format==Format.TEAMS&&seats.size()<4)throw new Failure(409,"TOD_PLAYER_COUNT");
        if(new HashSet<>(seats).size()!=seats.size())throw new Failure(400,"TOD_INVALID_ROSTER");
        if(categories.isEmpty())throw new IllegalArgumentException("need categories");
        this.cfg=cfg;this.engine=engine;this.categories=List.copyOf(categories);this.lang="ru".equals(lang)?"ru":"en";this.rules=true;this.survival=sv;this.format=format;
        for(int i=0;i<seats.size();i++){Player p=new Player(seats.get(i),i,false);players.add(p);byId.put(p.id,p);}
        List<Player> order=new ArrayList<>(players);if(format!=Format.FFA)Collections.shuffle(order,random);
        if(format==Format.TEAMS){int teams=order.size()/2;for(int t=0;t<teams;t++)entrants.add(new Side(sideSeq++,new ArrayList<>(List.of(order.get(2*t),order.get(2*t+1)))));
            if(order.size()%2==1)entrants.get(entrants.size()-1).members.add(order.get(order.size()-1));}
        else for(Player p:order)entrants.add(new Side(sideSeq++,new ArrayList<>(List.of(p))));
        int lives=format==Format.FFA?sv.lives():sv.duelLives();
        for(Side d:entrants){d.lives=lives;for(Player p:d.members)p.lives=lives;}
        enter(Phase.INTRO,now,sv.introMs());
    }
    // ---------------------------------------------------------------- survival engine
    public final Format format;
    static final class Side{final int id;final List<Player> members;int lives,next,out;Side(int id,List<Player> m){this.id=id;members=m;}}
    private final List<Side> entrants=new ArrayList<>();private int sideSeq;
    /** knockout: the rounds, each a list of matches (a match is two sides, or one side with a bye); winners per match */
    private final List<List<Side[]>> bracket=new ArrayList<>();private final Map<Side[],Side> winners=new IdentityHashMap<>();
    private int matchIndex=-1;private List<Side> match=List.of();private int sideTurn=-1;
    private int lap,catIndex=-1,outSeq,lapsOnCategory;private String turnPlayer;private long turnMs;
    /**
     * The category round: sides that already had their turn in the current lap of this category. The category stays
     * until a turn runs out of time; then {@code closing} is set, the sides that have not played this lap yet still
     * answer the same category, and when the lap is complete the next category comes.
     */
    private final Set<Integer> lapDone=new HashSet<>();private boolean closing;
    private final Set<String> usedKeys=new HashSet<>(),usedCanon=new HashSet<>();
    private final List<Map<String,Object>> used=new ArrayList<>();
    private Map<String,Object> lastTurn=Map.of();private Sub turnSub;private Side lastWinner;
    /** wrong answers and repeats inside the current turn: refused, the clock keeps running (only a timeout costs a life) */
    private final List<Map<String,Object>> attempts=new ArrayList<>();private long turnLeft;
    /** what the answering player is typing right now (shown live on the big screen), cleared on every new turn */
    private String typing="";
    /** Live typing from the player whose turn it is; anything else is ignored. @return true when it changed */
    public boolean typing(String member,String text){
        if(survival==null||phase!=Phase.TURN||!member.equals(turnPlayer))return false;
        String t=text==null?"":text.replaceAll("\\p{Cntrl}","");if(t.length()>AnswerInput.MAX_LENGTH)t=t.substring(0,AnswerInput.MAX_LENGTH);
        if(t.equals(typing))return false;typing=t;liveDirty=true;return true;
    }
    private Side sideOf(Player p){for(Side d:entrants)if(d.members.contains(p))return d;return null;}
    private List<Side> aliveIn(List<Side> m){List<Side> a=new ArrayList<>();for(Side d:m)if(d.lives>0)a.add(d);return a;}
    private boolean tickSurvival(long now){
        boolean changed=false;
        for(int guard=0;guard<20;guard++){
            if(phase==Phase.TURN_CHECK&&turnSub!=null&&turnSub.pending!=null&&turnSub.pending.isDone()){
                Verdict v=turnSub.pending.getNow(null);turnSub.verdict=v==null?Verdict.uncertain(Verdict.Source.FALLBACK):v;settleTurn(now);changed=true;continue;}
            if(now<phaseEnds)break;
            long at=phaseEnds;changed=true;
            switch(phase){
                case INTRO->{if(format==Format.FFA){match=new ArrayList<>(entrants);startMatch(at,false);}else{bracket.add(pairs(entrants));enter(Phase.BRACKET,at,survival.bracketMs());}}
                case BRACKET->nextMatch(at);
                case MATCH_INTRO->newCategory(at);
                case CATEGORY_REVEAL->nextTurn(at);
                case TURN->{turnSub=null;lose(byId.get(turnPlayer),"TIMEOUT",null,null,at);}
                case TURN_CHECK->{turnSub.verdict=Verdict.uncertain(Verdict.Source.FALLBACK);settleTurn(at);}
                case TURN_RESULT->{List<Side> a=aliveIn(match);if(a.size()<=1)endMatch(a.isEmpty()?null:a.get(0),at);else nextTurn(at);}
                case MATCH_RESULT->nextMatch(at);
                case FINAL_RESULTS->enter(Phase.COMPLETED,at,-1);
                default->{return changed;}
            }
        }
        return changed;
    }
    private List<Side[]> pairs(List<Side> in){List<Side[]> out=new ArrayList<>();for(int i=0;i<in.size();i+=2)out.add(i+1<in.size()?new Side[]{in.get(i),in.get(i+1)}:new Side[]{in.get(i)});return out;}
    /** Next match of the current bracket round; byes pass straight through; a finished round builds the next one. */
    private void nextMatch(long now){
        List<Side[]> roundM=bracket.get(bracket.size()-1);
        while(++matchIndex<roundM.size()){Side[] m=roundM.get(matchIndex);if(m.length==2){match=List.of(m[0],m[1]);int lives=survival.duelLives();
                for(Side d:match){d.lives=lives;d.next=0;for(Player p:d.members)p.lives=lives;}startMatch(now,true);return;}
            winners.put(m,m[0]);}
        List<Side> next=new ArrayList<>();for(Side[] m:roundM)next.add(winners.get(m));
        if(next.size()<=1){finishSurvival(now);return;}
        bracket.add(pairs(next));matchIndex=-1;enter(Phase.BRACKET,now,survival.bracketMs());
    }
    private void startMatch(long now,boolean intro){lap=0;lapsOnCategory=0;sideTurn=-1;lapDone.clear();closing=false;lastTurn=Map.of();turnPlayer=null;if(intro)enter(Phase.MATCH_INTRO,now,survival.matchIntroMs());else newCategory(now);}
    private void newCategory(long now){catIndex++;round=catIndex+1;lapDone.clear();closing=false;lapsOnCategory=0;usedKeys.clear();usedCanon.clear();used.clear();lastTurn=Map.of();turnPlayer=null;enter(Phase.CATEGORY_REVEAL,now,survival.categoryMs());}
    private void endMatch(Side winner,long now){
        lastWinner=winner;turnPlayer=null;
        if(format==Format.FFA){finishSurvival(now);return;}
        winners.put(bracket.get(bracket.size()-1).get(matchIndex),winner);
        for(Side d:match)if(d!=winner){d.out=++outSeq;for(Player p:d.members){p.ghost=true;p.out=d.out;}}
        if(winner!=null)for(Player p:winner.members)p.lives=winner.lives;
        enter(Phase.MATCH_RESULT,now,survival.matchResultMs());
    }
    /**
     * Next turn. Sides answer in seat order; a lap is complete when every side with lives has had its turn in it (each
     * completed lap shortens the clock). After a timeout in this category the lap is finished by the sides that have not
     * played yet, then a new category opens with the next side in order. {@code lapsPerCategory} is only a safety cap.
     */
    private void nextTurn(long now){
        int n=match.size();
        if(phase!=Phase.CATEGORY_REVEAL&&lapComplete()){lapDone.clear();lap++;lapsOnCategory++;
            if(closing||lapsOnCategory>=survival.lapsPerCategory()){newCategory(now);return;}}
        int nxt=sideTurn;for(int k=1;k<=n;k++){int j=((sideTurn+k)%n+n)%n;if(match.get(j).lives>0&&!lapDone.contains(j)){nxt=j;break;}}
        lapDone.add(nxt);sideTurn=nxt;Side d=match.get(sideTurn);Player p=d.members.get(d.next%d.members.size());d.next++;
        turnPlayer=p.id;turnMs=survival.turnMs(lap);turnSub=null;attempts.clear();typing="";
        enter(Phase.TURN,now,turnMs);
    }
    private boolean lapComplete(){for(int j=0;j<match.size();j++)if(match.get(j).lives>0&&!lapDone.contains(j))return false;return true;}
    /** sides with lives that still answer in this lap (only meaningful while closing) */
    private int remainingInLap(){int r=0;for(int j=0;j<match.size();j++)if(match.get(j).lives>0&&!lapDone.contains(j))r++;return r;}
    private void settleTurn(long now){
        Sub s=turnSub;Player p=byId.get(s.player);
        String canon=s.verdict.valid()?s.verdict.canonicalId():null;
        // survival accepts only a confirmed answer: wrong, undecided or unchecked in time is refused (the turn goes on)
        if(!s.verdict.valid()){refuse(p,s,s.verdict.status()==ValidationStatus.INVALID?"WRONG":"UNSURE",s.text,now);return;}
        if(usedKeys.contains(s.key)||canon!=null&&usedCanon.contains(canon)){refuse(p,s,"REPEAT",label(canon,s.text),now);return;}
        usedKeys.add(s.key);if(canon!=null)usedCanon.add(canon);
        p.correct++;p.points+=survival.pointsCorrect();
        String lb=label(canon,s.text);Side d=sideOf(p);Map<String,Object> u=new LinkedHashMap<>();u.put("label",lb);u.put("player",p.id);u.put("side",d==null?0:d.id);used.add(u);
        lastTurn=Map.of("player",p.id,"outcome","CORRECT","text",s.text,"label",lb,"lives",p.lives);
        enter(Phase.TURN_RESULT,now,survival.resultMs());
    }
    /** A refused attempt: listed for everyone, the turn goes on with the time that was left (the clock was stopped while checking). */
    private void refuse(Player p,Sub s,String why,String shown,long now){
        p.incorrect++;turnSub=null;
        Map<String,Object> a=new LinkedHashMap<>();a.put("id",s.id);a.put("text",shown);a.put("outcome",why);attempts.add(a);
        if(phase==Phase.TURN_CHECK)enter(Phase.TURN,now,Math.max(600,turnLeft));
        liveDirty=true;
    }
    private String label(String canon,String text){if(canon==null)return text;Category.Answer a=category().answer(canon);return a==null?text:"ru".equals(lang)?a.labelRu():a.labelEn();}
    private void lose(Player p,String why,String text,String label,long now){
        Side d=sideOf(p);d.lives=Math.max(0,d.lives-1);p.incorrect++;closing=true; // this category ends with the current lap
        for(Player m:d.members)m.lives=d.lives;
        boolean dead=d.lives==0;
        if(dead&&format==Format.FFA){p.ghost=true;d.out=p.out=++outSeq;}
        Map<String,Object> m=new LinkedHashMap<>();m.put("player",p.id);m.put("side",d.id);m.put("outcome",why);if(text!=null)m.put("text",text);if(label!=null)m.put("label",label);m.put("lives",d.lives);m.put("eliminated",dead);
        lastTurn=m;turnSub=null;
        enter(Phase.TURN_RESULT,now,survival.resultMs()+(dead?900:0));
    }
    private void finishSurvival(long now){
        // still standing first, then the latest knocked out; ties by correct answers (team mates share their side's place)
        List<Player> order=new ArrayList<>(players);
        Comparator<Player> cmp=Comparator.comparingInt((Player p)->p.out==0?0:1).thenComparingInt(p->-p.out);
        if(format==Format.FFA)cmp=cmp.thenComparingInt(p->-p.correct);
        Comparator<Player> c2=cmp;order.sort(c2.thenComparingInt(p->-p.correct).thenComparingInt(p->p.seat));
        List<Standing> out=new ArrayList<>();int rank=0;Player prev=null;
        for(int i=0;i<order.size();i++){Player p=order.get(i);if(prev==null||c2.compare(prev,p)!=0)rank=i+1;prev=p;
            long souls=rank==1?cfg.rewardFirst():rank==2?cfg.rewardSecond():rank==3?cfg.rewardThird():0;
            out.add(new Standing(p.id,rank,p.points,p.correct,p.unique,p.incorrect,souls,false));}
        standings=List.copyOf(out);turnPlayer=null;
        enter(Phase.FINAL_RESULTS,now,survival.finalMs());
    }
    private String submitSurvival(Player p,String raw,long now){
        if(phase!=Phase.TURN)throw new Failure(409,phase==Phase.TURN_CHECK||phase==Phase.TURN_RESULT?"TOD_ANSWERS_CLOSED":"TOD_NOT_OPEN");
        if(!p.id.equals(turnPlayer))throw new Failure(409,"TOD_NOT_YOUR_TURN");
        if(now>phaseEnds+cfg.graceMs())throw new Failure(409,"TOD_TOO_LATE");
        if(raw!=null&&raw.length()>400)throw new Failure(400,"TOD_ANSWER_TOO_LONG");
        AnswerInput in=AnswerInput.of(raw);
        if(in==null)throw new Failure(400,raw==null||raw.isBlank()?"TOD_EMPTY_ANSWER":"TOD_ANSWER_TOO_LONG");
        Category c=category();Verdict v=engine.validate(c,in);
        if(p.lastSubmit>0&&now-p.lastSubmit<survival.minSubmitIntervalMs())throw new Failure(429,"TOD_TOO_FAST");
        Sub s=new Sub("s"+(++subSeq),p.id,in.clean(),in.key(),now,v);turnSub=s;p.lastSubmit=now;liveDirty=true;
        if(v.status()==ValidationStatus.PENDING){s.pending=engine.judgeLater(c,lang,in);turnLeft=phaseEnds-now;enter(Phase.TURN_CHECK,now,survival.checkMaxMs());}
        else settleTurn(now);
        return s.id;
    }
    private static List<String> ids(Side d){List<String> l=new ArrayList<>();for(Player p:d.members)l.add(p.id);return l;}
    private Map<String,Object> sideView(Side d){Map<String,Object> m=new LinkedHashMap<>();m.put("id",d.id);m.put("players",ids(d));m.put("lives",d.lives);m.put("out",d.out>0);return m;}
    private Map<String,Object> survivalView(){
        Map<String,Object> m=new LinkedHashMap<>();
        m.put("format",format.name());m.put("lives",format==Format.FFA?survival.lives():survival.duelLives());m.put("lap",lap+1);m.put("turnMs",turnMs);
        m.put("closing",closing);m.put("remaining",closing?remainingInLap()+(phase==Phase.TURN||phase==Phase.TURN_CHECK?1:0):-1); // the one answering now counts
        {List<String> done=new ArrayList<>();for(int j:lapDone)if(j>=0&&j<match.size())for(Player q:match.get(j).members)done.add(q.id);m.put("lapDone",done);}
        if(turnPlayer!=null)m.put("turnPlayer",turnPlayer);
        m.put("used",List.copyOf(used));m.put("last",lastTurn);m.put("attempts",List.copyOf(attempts));if(phase==Phase.TURN||phase==Phase.TURN_CHECK)m.put("typing",typing);
        if(format!=Format.FFA){
            List<Map<String,Object>> cur=new ArrayList<>();for(Side d:match)cur.add(sideView(d));m.put("match",cur);
            List<List<Map<String,Object>>> br=new ArrayList<>();
            for(List<Side[]> roundM:bracket){List<Map<String,Object>> rm=new ArrayList<>();
                for(Side[] x:roundM){Map<String,Object> mm=new LinkedHashMap<>();List<Map<String,Object>> sd=new ArrayList<>();for(Side d:x)sd.add(sideView(d));mm.put("sides",sd);
                    Side w=winners.get(x);if(w!=null)mm.put("winner",w.id);if(x.length==1)mm.put("bye",true);rm.add(mm);}
                br.add(rm);}
            m.put("bracket",br);m.put("matchIndex",matchIndex);m.put("roundIndex",bracket.size()-1);
            if(lastWinner!=null)m.put("winner",sideView(lastWinner));}
        return m;
    }

    public Phase phase(){return phase;}
    public int round(){return round;}
    public ThinkOrDieConfig config(){return cfg;}
    public Player player(String id){return byId.get(id);}
    public List<Standing> standings(){return standings;}
    public Category category(){return round<1?null:categories.get((round-1)%categories.size());}
    /** Players who came back to life since the last call (the room flips them to alive exactly once). */
    public List<String> takeRevivals(){List<String> r=new ArrayList<>(revivals);revivals.clear();return r;}

    private void enter(Phase p,long now,long d){phase=p;phaseStarted=now;phaseEnds=d<0?Long.MAX_VALUE:now+d;}

    /** Advance time; @return true when the phase changed (the room broadcasts). */
    public boolean tick(long now){
        if(survival!=null)return tickSurvival(now);
        boolean changed=false;
        if(phase==Phase.ANSWERING||phase==Phase.ANSWER_VALIDATION)resolveLive();
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
        round=n;subs.clear();dropped.clear();disputes.clear();reveal=List.of();
        for(Player p:players){p.roundPoints=p.roundCorrect=p.roundUnique=p.roundIncorrect=p.roundCount=p.roundShown=0;p.roundResurrected=false;}
        enter(Phase.CATEGORY_REVEAL,now,cfg.categoryMs());
    }
    /**
     * Instant checking: an AI verdict that arrived turns a pending answer into a counted one, or drops it when it is
     * wrong or the same concept the player already gave (it never counts, never scores, never reaches the reveal).
     */
    private void resolveLive(){
        for(Iterator<Sub> it=subs.iterator();it.hasNext();){Sub s=it.next();
            if(s.verdict.status()!=ValidationStatus.PENDING||s.pending==null||!s.pending.isDone())continue;
            Verdict v=s.pending.getNow(null);s.verdict=v==null?Verdict.uncertain(Verdict.Source.FALLBACK):v;
            Player p=byId.get(s.player);
            if(cfg.rejectWrong()&&(s.verdict.status()==ValidationStatus.INVALID||repeatOfOwn(s))){it.remove();s.result=s.verdict.status()==ValidationStatus.INVALID?"WRONG_LIVE":"REPEAT_LIVE";dropped.add(s);}
            else p.roundShown++;
            touched.add(s.player);liveDirty=true;}
    }
    private boolean repeatOfOwn(Sub s){
        if(!s.verdict.valid())return false;
        for(Sub o:subs)if(o!=s&&o.player.equals(s.player)&&o.verdict.valid()&&o.verdict.canonicalId().equals(s.verdict.canonicalId())&&o.at<=s.at)return true;
        return false;
    }
    private boolean allSettled(){for(Sub s:subs)if(s.verdict.status()==ValidationStatus.PENDING&&(s.pending==null||!s.pending.isDone()))return false;return true;}

    /** Collect AI results, mark anything still pending as uncertain, then dispute or score. */
    private void finishValidation(long now){
        for(Sub s:subs)if(s.verdict.status()==ValidationStatus.PENDING){
            Verdict v=s.pending!=null&&s.pending.isDone()?s.pending.getNow(null):null;
            s.verdict=v==null?Verdict.uncertain(Verdict.Source.FALLBACK):v;}
        if(cfg.rejectWrong())for(Iterator<Sub> it=subs.iterator();it.hasNext();){Sub s=it.next();if(s.verdict.status()==ValidationStatus.INVALID){it.remove();s.result="WRONG_LIVE";dropped.add(s);touched.add(s.player);}}
        markPersonalDuplicates();
        Map<String,Dispute> byKey=new LinkedHashMap<>();
        if(cfg.votes())for(Sub s:subs)if(s.result.isEmpty()&&s.verdict.status()==ValidationStatus.UNCERTAIN){
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
            // a tie goes to the player: a correct answer must not be lost to a split room
            d.outcome=d.votes.isEmpty()?"NEUTRAL":yes>=no?"ACCEPTED":"REJECTED";
            Category c=category();if(c!=null)engine.learn(c,d.key,d.text,(int)yes,(int)no); // the next game knows the answer
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
            else if(s.verdict.valid()){int n=owners.get(s.verdict.canonicalId()).size();s.canonical=s.verdict.canonicalId();s.result=n==1?"UNIQUE":n==2?"SHARED":n>=4&&cfg.crowdTier()?"CROWD":"MANY";s.points=cfg.pointsFor(n);p.roundCorrect++;if(n==1)p.roundUnique++;}
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
            // integrated: only correct answers matter (none shared with anybody); standalone: nothing wrong either
            if(cfg.integrated()&&!Set.of("SHARED","MANY","CROWD").contains(s.result)&&!s.result.equals("UNIQUE"))continue;
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
        order.sort(Comparator.comparingInt((Sub s)->switch(s.result){case "UNIQUE"->0;case "SHARED"->1;case "MANY"->2;case "CROWD"->3;case "UNCERTAIN"->3;case "REJECTED"->4;case "INVALID"->5;default->6;}).thenComparingLong(s->s.at));
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
            if(survival!=null)return submitSurvival(p,raw,now);
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
            for(Sub o:subs)if(o.player.equals(p.id)&&(o.key.equals(in.key())||v.valid()&&o.verdict.valid()&&o.verdict.canonicalId().equals(v.canonicalId()))){s.verdict=v.duplicate();s.exactRepeat=o.key.equals(in.key());break;}
            p.roundCount++;p.lastSubmit=now;liveDirty=true;
            if(cfg.rejectWrong()&&(s.verdict.status()==ValidationStatus.INVALID||s.verdict.status()==ValidationStatus.DUPLICATE)){
                // wrong or already given: refused at once, the phone shows it crossed out, nothing counts
                s.result=s.verdict.status()==ValidationStatus.INVALID?"WRONG_LIVE":"REPEAT_LIVE";dropped.add(s);return s.id;}
            if(s.verdict.status()==ValidationStatus.PENDING)s.pending=engine.judgeLater(c,lang,in);
            subs.add(s);
            if(cfg.rejectWrong()){if(s.verdict.status()!=ValidationStatus.PENDING)p.roundShown++;}
            else if(!s.exactRepeat)p.roundShown++;
            return s.id;
        }catch(Failure f){handled.remove(member+":"+requestId);throw f;}
    }

    /**
     * The full name of what the player typed, when the verified lists know it ("usa" → "United States of America",
     * "питер" → "Санкт Петербург"); "" when the lists do not know it or it is already written in full.
     * Nothing is counted or stored: the phone shows the full name in the field and the next Enter submits it.
     */
    public String preview(String raw){
        if(raw==null||raw.length()>400)return "";
        AnswerInput in=AnswerInput.of(raw);Category c=category();
        if(in==null||c==null||c.answers().isEmpty())return "";
        Verdict v;try{v=engine.validate(c,in);}catch(RuntimeException e){return "";}
        if(v.status()!=ValidationStatus.VALID||v.canonicalId()==null)return "";
        for(Category.Answer a:c.answers())if(a.id().equals(v.canonicalId())){
            boolean cyr=raw.codePoints().anyMatch(ch->Character.UnicodeScript.of(ch)==Character.UnicodeScript.CYRILLIC);
            String label=cyr||"ru".equals(lang)&&!raw.matches(".*[A-Za-z].*")?a.labelRu():a.labelEn();
            if(label==null||label.isBlank())label=a.labelEn();
            return AnswerInput.of(label)!=null&&AnswerInput.of(label).clean().equalsIgnoreCase(in.clean())?"":label;}
        return "";
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
        v.put("integrated",cfg.integrated());v.put("rules",rules);v.put("hideVerdicts",cfg.hideVerdicts());
        if(rules)v.put("rulesEndsAt",phaseStarted+cfg.introMs()+cfg.rulesMs());
        v.put("maxAnswer",AnswerInput.MAX_LENGTH);v.put("resurrectMin",cfg.resurrectMinAnswers());
        v.put("points",Map.of("unique",cfg.pointsUnique(),"two",cfg.pointsTwo(),"three",cfg.pointsThree(),"crowd",cfg.pointsCrowd(),"many",cfg.pointsMany(),"invalid",cfg.pointsInvalid()));
        v.put("rewards",List.of(cfg.rewardFirst(),cfg.rewardSecond(),cfg.rewardThird()));
        Category c=category();
        if(c!=null&&phase!=Phase.INTRO){v.put("categoryId",c.id());v.put("categoryType",c.type().name());v.put("textEn",c.textEn());v.put("textRu",c.textRu());}
        boolean validating=phase==Phase.ANSWER_VALIDATION;
        List<Map<String,Object>> ps=new ArrayList<>();
        for(Player p:players){Map<String,Object> m=new LinkedHashMap<>();
            m.put("id",p.id);m.put("ghost",p.ghost);if(survival!=null){m.put("lives",p.lives);m.put("out",p.out);}m.put("resurrected",p.resurrected);m.put("points",p.points);m.put("answers",p.roundShown);
            boolean shown=phase.ordinal()>=Phase.ANSWER_REVEAL.ordinal();
            if(shown){m.put("roundPoints",p.roundPoints);m.put("roundCorrect",p.roundCorrect);m.put("roundUnique",p.roundUnique);m.put("roundIncorrect",p.roundIncorrect);m.put("roundResurrected",p.roundResurrected);}
            m.put("correct",p.correct);m.put("unique",p.unique);m.put("incorrect",p.incorrect);
            if(validating){long done=subs.stream().filter(s->s.player.equals(p.id)&&(s.verdict.status()!=ValidationStatus.PENDING||s.pending!=null&&s.pending.isDone())).count();m.put("checked",done);}
            ps.add(m);}
        v.put("players",ps);
        if(survival!=null){v.put("mode","survival");v.put("survival",survivalView());}
        if(phase==Phase.DISPUTE){List<Map<String,Object>> ds=new ArrayList<>();
            for(Dispute d:disputes){Map<String,Object> m=new LinkedHashMap<>();m.put("id",d.id);m.put("text",d.text);m.put("votes",d.votes.size());m.put("voters",eligible(d).size());
                if(self!=null){m.put("mine",d.authors.contains(self));if(d.votes.containsKey(self))m.put("myVote",d.votes.get(self));}ds.add(m);}
            v.put("disputes",ds);}
        if(phase.ordinal()>=Phase.ANSWER_REVEAL.ordinal()&&phase!=Phase.COMPLETED||phase==Phase.COMPLETED&&!reveal.isEmpty())v.put("reveal",reveal);
        if(!standings.isEmpty()){List<Map<String,Object>> st=new ArrayList<>();for(Standing s:standings)st.add(Map.of("playerId",s.playerId(),"rank",s.rank(),"points",s.points(),"correct",s.correct(),"unique",s.unique(),"incorrect",s.incorrect(),"souls",s.souls(),"resurrected",s.resurrected()));v.put("standings",st);}
        Player me=self==null?null:byId.get(self);
        if(me!=null){List<Map<String,Object>> mine=new ArrayList<>();
            List<Sub> own=new ArrayList<>();for(Sub s:subs)if(s.player.equals(me.id))own.add(s);for(Sub s:dropped)if(s.player.equals(me.id))own.add(s);
            own.sort(Comparator.comparingInt(s->Integer.parseInt(s.id.substring(1))));
            for(Sub s:own){Map<String,Object> m=new LinkedHashMap<>();m.put("id",s.id);m.put("text",s.text);String lb=ownLabel(s);if(lb!=null)m.put("label",lb);m.put("state",ownState(s));if(!s.result.isEmpty()&&phase.ordinal()>=Phase.ANSWER_REVEAL.ordinal())m.put("points",s.points);mine.add(m);}
            v.put("me",Map.of("ghost",me.ghost,"history",mine,"count",me.roundShown));}
        if(host&&!cfg.hiddenAnswers()&&phase==Phase.ANSWERING)v.put("live",live());
        return v;
    }
    /** What a player sees for their own answer while answering: accepted / rejected / duplicate / pending. */
    /** The verified spelling of a player's own answer ("бритв" shows as "Бритва") as soon as it is known. */
    private String ownLabel(Sub s){
        if(cfg.hideVerdicts()&&phase.ordinal()<Phase.ANSWER_REVEAL.ordinal())return null;
        if(!s.verdict.valid()||s.verdict.canonicalId()==null)return null;
        Category.Answer a=category().answer(s.verdict.canonicalId());
        return a==null?null:"ru".equals(lang)?a.labelRu():a.labelEn();
    }
    private String ownState(Sub s){
        if(s.result.equals("WRONG_LIVE")||s.result.equals("REPEAT_LIVE"))return s.result;
        if(phase.ordinal()>=Phase.ANSWER_REVEAL.ordinal()&&!s.result.isEmpty())return s.result;
        // integrated: only "sent" or "you already wrote exactly this" until the reveal, never right or wrong
        if(cfg.hideVerdicts())return s.exactRepeat?"REPEAT":"SENT";
        return switch(s.verdict.status()){case VALID->"ACCEPTED";case INVALID->"REJECTED";case DUPLICATE->"DUPLICATE";default->"PENDING";};
    }
    private List<Map<String,Object>> live(){
        List<Map<String,Object>> out=new ArrayList<>();
        for(Player p:players){List<String> last=new ArrayList<>();for(int i=subs.size()-1;i>=0&&last.size()<6;i--)if(subs.get(i).player.equals(p.id))last.add(0,subs.get(i).text);
            out.add(Map.of("id",p.id,"recent",last));}
        return out;
    }
}
