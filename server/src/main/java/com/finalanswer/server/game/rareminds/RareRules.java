package com.finalanswer.server.game.rareminds;

import java.util.*;

/**
 * The RARE MINDS rules, free of time, networking and rendering: given the players' states and the answers locked for
 * one question, {@link #resolve} validates, finds collisions, prices rarity, applies penalties, the jackpot,
 * eliminations and ghost resurrection, and returns everything that happened. Deterministic for equal input.
 */
public final class RareRules {
    public static final int QUESTIONS=8,MIN_PLAYERS=2,MAX_PLAYERS=8,MAX_COLLISIONS=3;
    public static final int TEAM_WIN_BONUS=300,DUEL_BONUS=200,FINAL_DUEL_BONUS=400,JACKPOT=300,FINAL_JACKPOT=500,STREAK_2=150,STREAK_3=300,RESURRECTION_BONUS=100,WINNER_BONUS=500;
    private RareRules(){}

    /** Mutable per-player match state, owned by the session. Souls here are this mini-game's souls only. */
    public static final class Player {
        public final String id;public final int seat;
        public long souls;public int collisions;public boolean alive=true;
        /** question number (1-based) on which the player died; 0 while never eliminated */
        public int eliminatedAt;
        public boolean resurrectionPossible,resurrected;
        /** valid unique answers given as a ghost since the elimination */
        public int ghostUnique;
        public int jackpotStreak,jackpots,duelWins;
        /** DUELS format: the fixed opponent for the whole match (null in the classic format) */
        public String opponent;
        /** TEAMS format: 0 or 1 (-1 in the other formats) */
        public int team=-1;
        public Player(String id,int seat){this.id=id;this.seat=seat;}
        public boolean deathZone(){return alive&&collisions==MAX_COLLISIONS-1;}
        /** questions a ghost still has to answer uniquely to come back (0 when not applicable) */
        public int ghostRemaining(int total){return alive||!resurrectionPossible?0:total-eliminatedAt-ghostUnique;}
    }
    /** An answer as the server locked it. {@code receivedAt} is server time (jackpot tie-break: earlier wins). */
    public record Submission(String text,boolean riskIt,long receivedAt,boolean timeLocked){}

    public enum Risk {NONE,SAVED,HELD,FAILED}
    /** Everything one player's answer did on one question; the reveal is drawn from these rows. */
    public record Row(String playerId,String text,AnswerValidator.Status status,String answerId,Rarity.Tier tier,long rarityScore,
                      boolean ghost,boolean collided,int sharedWith,int collisionPenaltyPct,int baseSouls,int earned,
                      boolean jackpot,int jackpotSouls,int jackpotStreak,Risk risk,boolean eliminated,long deathPenalty,
                      boolean ghostSuccess,boolean resurrectionLost,boolean resurrected,long soulsAfter,int collisionsAfter,
                      boolean aliveAfter,int ghostRemaining,int duelResult,int duelBonus){
        /** duelResult: 1 won the duel, -1 lost, 0 draw or no duel */
        public boolean valid(){return status==AnswerValidator.Status.VALID||status==AnswerValidator.Status.VALID_TYPO;}
        public boolean answered(){return status!=AnswerValidator.Status.EMPTY;}
    }
    public record Outcome(int question,boolean finalQuestion,List<Row> rows,String jackpotWinner,List<String> recordedAnswers){
        public Row row(String id){for(Row r:rows)if(r.playerId.equals(id))return r;return null;}
    }

    public static Outcome resolve(int question,RareQuestion q,List<Player> players,Map<String,Submission> subs,AnswerValidator validator,RarityStats stats){
        boolean fin=question==QUESTIONS;
        // 1. validity per player, 2. how many submitters share each canonical answer (ghosts included)
        Map<String,AnswerValidator.Result> val=new HashMap<>();Map<String,Integer> share=new HashMap<>();
        for(Player p:players){Submission s=subs.get(p.id);var r=validator.validate(q,s==null?"":s.text());val.put(p.id,r);if(r.valid())share.merge(r.answerId(),1,Integer::sum);}
        // 3. rarity priced from statistics *before* this question is recorded
        Map<String,Rarity.Estimate> est=new HashMap<>();for(String a:share.keySet())est.put(a,Rarity.estimate(q,a,stats));

        Map<String,Integer> earned=new HashMap<>(),pct=new HashMap<>(),base=new HashMap<>();Map<String,Risk> risk=new HashMap<>();
        // TEAMS: teammates may share an answer freely; a collision needs a player of the OTHER team with the same answer
        Set<String> rivalShare=new HashSet<>();
        for(Player p:players){var r=val.get(p.id);if(!r.valid())continue;for(Player o:players)if(o!=p&&val.get(o.id).valid()&&val.get(o.id).answerId().equals(r.answerId())&&(p.team<0||o.team!=p.team))rivalShare.add(p.id);}
        Set<String> wasAlive=new HashSet<>(),diedNow=new HashSet<>(),ghostOk=new HashSet<>(),lostNow=new HashSet<>();
        for(Player p:players){
            var r=val.get(p.id);Submission s=subs.get(p.id);boolean valid=r.valid();boolean collided=valid&&rivalShare.contains(p.id);
            int b=valid?est.get(r.answerId()).tier().souls*(fin?2:1):0,e=b,cut=0;Risk rk=Risk.NONE;
            if(p.alive){wasAlive.add(p.id);
                boolean risky=s!=null&&s.riskIt()&&p.collisions==MAX_COLLISIONS-1;
                if(collided){p.collisions++;cut=p.collisions==1?25:50;e=b*(100-cut)/100;if(risky)rk=Risk.FAILED;if(p.collisions>=MAX_COLLISIONS)diedNow.add(p.id);}
                else if(risky){if(valid&&est.get(r.answerId()).tier().deep()){p.collisions=MAX_COLLISIONS-2;rk=Risk.SAVED;}else rk=Risk.HELD;}
            }else{
                if(collided){cut=50;e=b/2;}
                if(p.resurrectionPossible){if(valid&&!collided){p.ghostUnique++;ghostOk.add(p.id);}else{p.resurrectionPossible=false;lostNow.add(p.id);}}
            }
            p.souls+=e;earned.put(p.id,e);pct.put(p.id,cut);base.put(p.id,b);risk.put(p.id,rk);
        }
        // 4. jackpot: rarest valid unique answer among players alive at the start of the question
        Player jw=null;long bestScore=Long.MIN_VALUE;long bestAt=Long.MAX_VALUE;
        for(Player p:players){var r=val.get(p.id);if(!wasAlive.contains(p.id)||!r.valid()||share.get(r.answerId())>1)continue;
            long sc=est.get(r.answerId()).score(),at=subs.get(p.id).receivedAt();
            if(sc>bestScore||sc==bestScore&&(at<bestAt||at==bestAt&&jw!=null&&p.seat<jw.seat)){jw=p;bestScore=sc;bestAt=at;}}
        Map<String,Integer> jack=new HashMap<>();
        for(Player p:players){
            if(p==jw){p.jackpotStreak++;p.jackpots++;int bonus=p.jackpotStreak>=3?STREAK_3:p.jackpotStreak==2?STREAK_2:0;int j=(fin?FINAL_JACKPOT:JACKPOT)+bonus;p.souls+=j;jack.put(p.id,j);}
            else p.jackpotStreak=0;
        }
        // 5. eliminations: half of this mini-game's souls, once, then ghost mode
        Map<String,Long> penalty=new HashMap<>();
        for(Player p:players)if(diedNow.contains(p.id)){long pen=p.souls/2;p.souls-=pen;penalty.put(p.id,pen);p.alive=false;p.eliminatedAt=question;p.ghostUnique=0;p.resurrectionPossible=question<QUESTIONS&&!p.resurrected;}
        // 6. after the last question: ghosts who answered every remaining question uniquely come back
        Set<String> back=new HashSet<>();
        if(fin)for(Player p:players)if(!p.alive&&p.eliminatedAt<question&&p.resurrectionPossible&&!p.resurrected&&p.ghostUnique==QUESTIONS-p.eliminatedAt){
            p.alive=true;p.resurrected=true;p.resurrectionPossible=false;p.collisions=MAX_COLLISIONS-1;p.souls+=RESURRECTION_BONUS;back.add(p.id);}

        // DUELS: inside each fixed pair the rarer valid unique answer wins the duel (both bad, or equal rarity: no winner)
        Map<String,Integer> duel=new HashMap<>(),duelSouls=new HashMap<>();Map<String,Player> by=new HashMap<>();for(Player p:players)by.put(p.id,p);
        for(Player p:players){if(p.opponent==null||duel.containsKey(p.id))continue;Player o=by.get(p.opponent);if(o==null)continue;
            long a=duelScore(val.get(p.id),share,est),b=duelScore(val.get(o.id),share,est);int r=Long.compare(a,b);
            duel.put(p.id,r);duel.put(o.id,-r);
            if(r!=0){Player w=r>0?p:o;int bonus=fin?FINAL_DUEL_BONUS:DUEL_BONUS;w.souls+=bonus;w.duelWins++;duelSouls.put(w.id,bonus);}}
        List<Row> rows=new ArrayList<>();List<String> record=new ArrayList<>();
        for(Player p:players){var r=val.get(p.id);Submission s=subs.get(p.id);boolean valid=r.valid();
            var e=valid?est.get(r.answerId()):null;if(valid)record.add(r.answerId());
            rows.add(new Row(p.id,s==null?"":s.text(),r.status(),r.answerId(),e==null?null:e.tier(),e==null?0:e.score(),!wasAlive.contains(p.id),
                valid&&rivalShare.contains(p.id),valid?share.get(r.answerId()):0,pct.get(p.id),base.get(p.id),earned.get(p.id),
                jack.containsKey(p.id),jack.getOrDefault(p.id,0),p.jackpotStreak,risk.get(p.id),diedNow.contains(p.id),penalty.getOrDefault(p.id,0L),
                ghostOk.contains(p.id),lostNow.contains(p.id),back.contains(p.id),p.souls,p.collisions,p.alive,p.ghostRemaining(QUESTIONS),duel.getOrDefault(p.id,0),duelSouls.getOrDefault(p.id,0)));}
        return new Outcome(question,fin,List.copyOf(rows),jw==null?"":jw.id,List.copyOf(record));
    }

    /** a duel compares rarity scores; collided, invalid or missing answers score lowest */
    private static long duelScore(AnswerValidator.Result r,Map<String,Integer> share,Map<String,Rarity.Estimate> est){
        if(!r.valid()||share.get(r.answerId())>1)return Long.MIN_VALUE;return est.get(r.answerId()).score();}
    /** Final standing. Only living players can win; ties: more souls, fewer collisions, earlier seat. */
    public record Standing(String playerId,int rank,long souls,boolean alive,boolean winner,int winnerBonus){}
    /** TEAMS: the team with more souls wins; every member of it gets {@link #TEAM_WIN_BONUS}. Equal totals: no bonus. */
    public static List<Standing> finishTeams(List<Player> players){
        long[] tot=new long[2];for(Player p:players)if(p.team>=0)tot[p.team]+=p.souls;
        int win=tot[0]==tot[1]?-1:tot[0]>tot[1]?0:1;
        for(Player p:players)if(p.team==win)p.souls+=TEAM_WIN_BONUS;
        List<Player> order=new ArrayList<>(players);order.sort(Comparator.<Player>comparingLong(p->-p.souls).thenComparingInt(p->p.seat));
        List<Standing> out=new ArrayList<>();for(int i=0;i<order.size();i++){Player p=order.get(i);out.add(new Standing(p.id,i+1,p.souls,p.alive,p.team==win,p.team==win?TEAM_WIN_BONUS:0));}
        return List.copyOf(out);
    }
    public static long[] teamTotals(List<Player> players){long[] t=new long[2];for(Player p:players)if(p.team>=0)t[p.team]+=p.souls;return t;}
    public static List<Standing> finish(List<Player> players){
        List<Player> order=new ArrayList<>(players);
        order.sort(Comparator.<Player,Boolean>comparing(p->!p.alive).thenComparing(p->-p.souls).thenComparingInt(p->p.collisions).thenComparingInt(p->p.seat));
        Player winner=order.isEmpty()||!order.get(0).alive?null:order.get(0);
        if(winner!=null)winner.souls+=WINNER_BONUS;
        List<Standing> out=new ArrayList<>();for(int i=0;i<order.size();i++){Player p=order.get(i);out.add(new Standing(p.id,i+1,p.souls,p.alive,p==winner,p==winner?WINNER_BONUS:0));}
        return List.copyOf(out);
    }
}
