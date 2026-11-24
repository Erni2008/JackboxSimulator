package com.finalanswer.server.game.rareminds;

import com.finalanswer.server.game.rareminds.RareRules.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

/** RARE MINDS rules: collisions, penalties, jackpot, RISK IT, ghosts and resurrection, final question, winner. */
class RareRulesTest {
    static final RareQuestionBank BANK=RareQuestionBank.load();
    static final RareQuestion MED=BANK.get("medicine");
    final RarityStats stats=new RarityStats.Memory();
    final CuratedAnswerValidator validator=BANK.validator();

    static List<Player> players(int n){List<Player> l=new ArrayList<>();for(int i=0;i<n;i++)l.add(new Player("p"+i,i));return l;}
    static Submission sub(String text){return new Submission(text,false,1000,false);}
    static Submission sub(String text,long at){return new Submission(text,false,at,false);}
    static Submission risky(String text){return new Submission(text,true,1000,false);}
    Outcome play(int q,List<Player> ps,Object... pairs){Map<String,Submission> m=new HashMap<>();for(int i=0;i<pairs.length;i+=2)m.put((String)pairs[i],pairs[i+1] instanceof Submission s?s:sub((String)pairs[i+1]));return RareRules.resolve(q,MED,ps,m,validator,stats);}
    static int tier(String answer){return Rarity.estimate(MED,answer,new RarityStats.Memory()).tier().souls;}

    @Test void bankIsWellFormedAndBilingual(){
        assertTrue(BANK.questions().size()>=RareRules.QUESTIONS*2,"enough questions for two matches without repeats");
        for(var q:BANK.questions()){assertFalse(q.textRu().isBlank());assertFalse(q.textEn().isBlank());
            Set<Rarity.Tier> tiers=EnumSet.noneOf(Rarity.Tier.class);for(var a:q.answers())tiers.add(Rarity.estimate(q,a.id(),new RarityStats.Memory()).tier());
            assertTrue(tiers.size()>=4,q.id()+" spreads over the rarity tiers: "+tiers);}
        assertEquals(8,new HashSet<>(BANK.draw(8,new Random(3))).size());
    }
    @Test void normalisationAndTypos(){
        assertEquals("tyrannosaurusrex",RareText.key("  Tyrannosaurus-REX "));assertEquals(RareText.key("ёж"),RareText.key("ЕЖ"));
        assertEquals("paracetamol",validator.validate(MED,"PARACETAMOL!").answerId());
        assertEquals(AnswerValidator.Status.VALID_TYPO,validator.validate(MED,"paracetamoll").status());
        assertEquals(AnswerValidator.Status.INVALID,validator.validate(MED,"banana").status());
        assertEquals(AnswerValidator.Status.EMPTY,validator.validate(MED,"   ").status());
        var europe=BANK.get("europe_country");
        assertEquals("slovakia",validator.validate(europe,"Slovakia").answerId());assertEquals("slovenia",validator.validate(europe,"Slovenia").answerId());
        assertNotEquals(AnswerValidator.Status.VALID_TYPO,validator.validate(europe,"Slovekia").status(),"a typo between two real answers is never guessed");
    }
    // 1
    @Test void twoIdenticalAnswersBothCollide(){
        var ps=players(3);var o=play(1,ps,"p0","Paracetamol","p1","paracetamol","p2","Ibuprofen");
        assertTrue(o.row("p0").collided());assertTrue(o.row("p1").collided());assertFalse(o.row("p2").collided());
        assertEquals(1,ps.get(0).collisions);assertEquals(1,ps.get(1).collisions);assertEquals(0,ps.get(2).collisions);
        int base=tier("paracetamol");assertEquals(base*75/100,o.row("p0").earned());assertEquals(25,o.row("p0").collisionPenaltyPct());
    }
    // 2
    @Test void threeIdenticalAnswersGiveOneMarkEach(){
        var ps=players(3);play(1,ps,"p0","aspirin","p1","Aspirin","p2","ASPIRIN");
        for(Player p:ps)assertEquals(1,p.collisions);
    }
    // 3
    @Test void aliasesInBothLanguagesAreOneAnswer(){
        var ps=players(3);var o=play(1,ps,"p0","Paracetamol","p1","парацетамол","p2","Acetaminophen");
        for(Player p:ps)assertEquals(1,p.collisions);assertEquals(3,o.row("p2").sharedWith());
    }
    // 4 + 5
    @Test void thirdCollisionEliminatesAndDeathPenaltyAppliesOnce(){
        var ps=players(2);Player a=ps.get(0);
        play(1,ps,"p0","aspirin","p1","aspirin");play(2,ps,"p0","ibuprofen","p1","ibuprofen");
        assertTrue(a.deathZone());long before=a.souls;
        var o=play(3,ps,"p0","insulin","p1","insulin");
        long gained=o.row("p0").earned();assertEquals(tier("insulin")/2,gained);
        assertTrue(o.row("p0").eliminated());assertFalse(a.alive);assertEquals((before+gained)/2,o.row("p0").deathPenalty());assertEquals(before+gained-o.row("p0").deathPenalty(),a.souls);
        long afterDeath=a.souls;var next=play(4,ps,"p0","morphine","p1","morphine");
        assertEquals(0,next.row("p0").deathPenalty());assertFalse(next.row("p0").eliminated());assertEquals(3,a.collisions,"ghosts collect no more marks");
        assertEquals(afterDeath+tier("morphine")/2,a.souls,"ghost earnings continue (collided answer at half)");
    }
    // 6 + 10
    @Test void ghostUniqueOnEveryRemainingQuestionResurrectsAfterTheFinal(){
        var ps=players(3);Player a=ps.get(0);kill(ps,a,"p1",5);
        assertEquals(3,a.ghostRemaining(RareRules.QUESTIONS));
        play(6,ps,"p0","warfarin","p1","aspirin","p2","ibuprofen");play(7,ps,"p0","digoxin","p1","aspirin","p2","penicillin");
        long before=a.souls;var o=play(8,ps,"p0","methotrexate","p1","insulin","p2","analgin");
        assertTrue(o.row("p0").resurrected());assertTrue(a.alive);assertEquals(2,a.collisions);
        assertEquals(before+tier("methotrexate")*2+RareRules.RESURRECTION_BONUS,a.souls,"final answer doubled + resurrection bonus; ghosts cannot win the jackpot");
        a.souls=1_000_000;var st=RareRules.finish(ps);assertTrue(st.get(0).winner());assertEquals("p0",st.get(0).playerId());
    }
    // 7
    @Test void ghostCollisionEndsResurrection(){
        var ps=players(3);Player a=ps.get(0);kill(ps,a,"p1",5);
        play(6,ps,"p0","warfarin","p1","aspirin");var o=play(7,ps,"p0","aspirin","p2","aspirin");
        assertTrue(o.row("p0").resurrectionLost());assertFalse(a.resurrectionPossible);assertEquals(1,ps.get(2).collisions,"a ghost's answer still collides with the living");
        play(8,ps,"p0","digoxin");assertFalse(a.alive);
    }
    // 8
    @Test void ghostInvalidAnswerEndsResurrection(){
        var ps=players(2);Player a=ps.get(0);kill(ps,a,"p1",6);
        var o=play(7,ps,"p0","banana");assertTrue(o.row("p0").resurrectionLost());play(8,ps,"p0","digoxin");assertFalse(a.alive);
    }
    // 9
    @Test void ghostSilenceEndsResurrection(){
        var ps=players(2);Player a=ps.get(0);kill(ps,a,"p1",6);
        play(7,ps,"p1","aspirin");assertFalse(a.resurrectionPossible);play(8,ps,"p0","digoxin");assertFalse(a.alive);
    }
    // 11
    @Test void deathOnTheFinalQuestionCannotResurrect(){
        var ps=players(2);Player a=ps.get(0);a.collisions=2;
        var o=play(8,ps,"p0","aspirin","p1","aspirin");assertTrue(o.row("p0").eliminated());assertFalse(a.resurrectionPossible);assertEquals(0,a.ghostRemaining(8));
    }
    // 12
    @Test void rarestAnswerTieBreaksByTimeThenSeat(){
        var ps=players(3);
        // two different answers of equal curated rarity: the earlier submission takes the jackpot
        var o=play(1,ps,"p0",sub("methotrexate",2000),"p1",sub("digoxin",1500),"p2",sub("aspirin",100));
        assertEquals(Rarity.estimate(MED,"methotrexate",stats).score(),Rarity.estimate(MED,"digoxin",stats).score());
        assertEquals("p1",o.jackpotWinner());
        var o2=play(2,players(2),"p0",sub("methotrexate",500),"p1",sub("digoxin",500));assertEquals("p0",o2.jackpotWinner());
    }
    // 13
    @Test void jackpotStreak(){
        var ps=players(2);Player a=ps.get(0);
        assertEquals(300,play(1,ps,"p0","methotrexate","p1","aspirin").row("p0").jackpotSouls());
        assertEquals(450,play(2,ps,"p0","digoxin","p1","aspirin").row("p0").jackpotSouls());
        assertEquals(600,play(3,ps,"p0","clopidogrel","p1","ibuprofen").row("p0").jackpotSouls());
        assertEquals(600,play(4,ps,"p0","warfarin","p1","ibuprofen").row("p0").jackpotSouls());
        var miss=play(5,ps,"p0","aspirin","p1","lisinopril");assertEquals(0,a.jackpotStreak);assertEquals("p1",miss.jackpotWinner());
        assertEquals(300,play(6,ps,"p0","amlodipine","p1","aspirin").row("p0").jackpotSouls(),"a missed jackpot resets the streak");
        var dup=play(7,players(2),"p0","digoxin","p1","digoxin");assertEquals("",dup.jackpotWinner(),"a duplicated answer never wins");
        assertEquals("",play(1,players(2),"p0","banana","p1","").jackpotWinner(),"invalid answers never win");
    }
    // 14
    @Test void finalQuestionDoublesRarityAndRaisesJackpot(){
        var ps=players(2);var o=play(8,ps,"p0","digoxin","p1","aspirin");
        assertEquals(tier("digoxin")*2,o.row("p0").earned());assertEquals(RareRules.FINAL_JACKPOT,o.row("p0").jackpotSouls());assertTrue(o.finalQuestion());
    }
    // 18
    @Test void allEliminatedMeansNoWinnerBonus(){
        var ps=players(2);for(Player p:ps)p.collisions=2;play(3,ps,"p0","aspirin","p1","aspirin");
        var st=RareRules.finish(ps);assertTrue(st.stream().noneMatch(Standing::winner));assertTrue(st.stream().allMatch(s->s.winnerBonus()==0));
    }
    // 19
    @Test void riskIt(){
        var ps=players(2);Player a=ps.get(0);a.collisions=2;
        var saved=play(1,ps,"p0",risky("methotrexate"),"p1","aspirin");assertEquals(Risk.SAVED,saved.row("p0").risk());assertEquals(1,a.collisions);
        a.collisions=2;var held=play(2,ps,"p0",risky("ibuprofen"),"p1","aspirin");assertEquals(Risk.HELD,held.row("p0").risk());assertEquals(2,a.collisions);
        var invalid=play(3,ps,"p0",risky("banana"),"p1","aspirin");assertEquals(Risk.HELD,invalid.row("p0").risk());assertEquals(2,a.collisions,"an invalid answer is not a collision");
        var failed=play(4,ps,"p0",risky("aspirin"),"p1","aspirin");assertEquals(Risk.FAILED,failed.row("p0").risk());assertTrue(failed.row("p0").eliminated());
        var notEligible=players(2);notEligible.get(0).collisions=1;assertEquals(Risk.NONE,play(1,notEligible,"p0",risky("methotrexate")).row("p0").risk(),"RISK IT needs the death zone");
    }
    @Test void validityIsSeparateFromRarityAndStatsEvolve(){
        var fresh=new RarityStats.Memory();var first=Rarity.estimate(MED,"digoxin",fresh);
        assertNotEquals(Rarity.Tier.COMMON,first.tier());
        for(int i=0;i<400;i++)fresh.record(MED.id(),List.of("digoxin"));
        assertEquals(Rarity.Tier.COMMON,Rarity.estimate(MED,"digoxin",fresh).tier(),"live statistics take over from the curated prior");
        var small=new RarityStats.Memory();small.record(MED.id(),List.of("digoxin"));
        assertEquals(first.tier(),Rarity.estimate(MED,"digoxin",small).tier(),"one game cannot swing the tier (pseudo-count safeguard)");
        var none=play(1,players(2),"p0","definitely not a drug");assertEquals(0,none.row("p0").earned());assertNull(none.row("p0").tier());
    }

    /** Puts {@code who} into ghost mode on question {@code q} (collides with {@code partner} at 2/3). */
    private void kill(List<Player> ps,Player who,String partner,int q){who.collisions=2;var o=play(q,ps,who.id,"aspirin",partner,"aspirin");assertTrue(o.row(who.id).eliminated());ps.stream().filter(p->p.id.equals(partner)).findFirst().orElseThrow().collisions=0;}
}
