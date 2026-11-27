package com.finalanswer.server.game.thinkordie;

import static org.junit.jupiter.api.Assertions.*;

import com.finalanswer.server.validation.*;
import java.util.*;
import org.junit.jupiter.api.Test;

class ThinkOrDieSessionTest {
    static final CategoryPack PACK=CategoryPack.load();
    static final ThinkOrDieConfig CFG=ThinkOrDieConfig.DEFAULT.withTiming(1000,1000,30000,10000,2000,2000,3000).withVotes(true); // vote rules stay tested; the shipped default is votes=false
    long now=0;int req=0;

    ThinkOrDieSession session(List<String> seats,Set<String> ghosts,String... cats){
        List<Category> cs=new ArrayList<>();for(String c:cats)cs.add(PACK.get(c));while(cs.size()<CFG.rounds())cs.add(PACK.get("in_kitchen"));
        return new ThinkOrDieSession(seats,ghosts,cs,ValidationEngine.deterministic(new WordDictionary()),CFG,"en",0);
    }
    void toAnswering(ThinkOrDieSession s){for(int i=0;i<2000&&s.phase()!=ThinkOrDieSession.Phase.ANSWERING;i++){now+=100;s.tick(now);}assertEquals(ThinkOrDieSession.Phase.ANSWERING,s.phase());}
    void finish(ThinkOrDieSession s){for(int i=0;i<5000&&s.phase()!=ThinkOrDieSession.Phase.COMPLETED;i++){now+=100;s.tick(now);}}
    String say(ThinkOrDieSession s,String who,String text){now+=300;return s.submit(who,"r"+(++req),s.round(),text,now);}
    void endAnswers(ThinkOrDieSession s){now=s.snapshotEnds()+1;s.tick(now);for(int i=0;i<200&&s.phase()==ThinkOrDieSession.Phase.ANSWER_VALIDATION;i++){now+=100;s.tick(now);}}
    @SuppressWarnings("unchecked") List<Map<String,Object>> reveal(ThinkOrDieSession s){return (List<Map<String,Object>>)s.snapshot(null,true,now).get("reveal");}

    @Test void stateMachineRunsAllRoundsToCompletion(){
        var s=session(List.of("a","b"),Set.of(),"batman_villains");
        assertEquals(ThinkOrDieSession.Phase.INTRO,s.phase());
        for(int r=1;r<=CFG.rounds();r++){toAnswering(s);assertEquals(r,s.round());say(s,"a",r==1?"Joker":"fridge");endAnswers(s);
            assertEquals(ThinkOrDieSession.Phase.ANSWER_REVEAL,s.phase());}
        finish(s);
        assertEquals(ThinkOrDieSession.Phase.COMPLETED,s.phase());
        assertEquals(1,s.standings().get(0).rank());
    }
    @Test void previewWritesKnownAnswersInFull(){
        var s=session(List.of("a","b"),Set.of(),"star_on_flag");toAnswering(s);
        assertEquals("United States of America",s.preview("usa"));
        assertEquals("Соединённые Штаты Америки",s.preview("америка"));
        assertEquals("United States of America",s.preview("Unted States"));
        assertEquals("",s.preview("United States of America")); // already full: the first Enter sends it
        assertEquals("",s.preview("Narnia"));        // unknown: sent as typed, the judge decides
        assertEquals("",s.preview(""));
        var b=session(List.of("a","b"),Set.of(),"batman_villains");toAnswering(b);
        assertEquals("Joker",b.preview("the joker"));
        assertEquals("",b.preview("джокер"));        // same word, only the case differs
    }

    @Test void originalityUsesCanonicalIds(){
        var s=session(List.of("a","b","c","d"),Set.of(),"batman_villains");toAnswering(s);
        say(s,"a","Joker");say(s,"b","The Joker");say(s,"c","JOKER");
        say(s,"a","Penguin");say(s,"b","Penguin");
        say(s,"d","Bane");
        say(s,"d","Superman");
        endAnswers(s);
        assertEquals(50+100,s.player("a").roundPoints);
        assertEquals(50+100,s.player("b").roundPoints);
        assertEquals(50,s.player("c").roundPoints);
        assertEquals(150,s.player("d").roundPoints,"a wrong answer scores 0, never takes points");
        var rv=reveal(s);assertEquals("UNIQUE",rv.get(0).get("status"));assertEquals("Bane",rv.get(0).get("label"));
    }
    @Test void personalRepeatsScoreZeroAndDoNotCountGlobally(){
        var s=session(List.of("a","b"),Set.of(),"batman_villains");toAnswering(s);
        say(s,"a","Joker");say(s,"a","the joker");say(s,"a","JOKER");say(s,"a","Джокер");
        say(s,"b","Riddler");
        endAnswers(s);
        assertEquals(150,s.player("a").roundPoints,"one unique joker, three free repeats");
        assertEquals(150,s.player("b").roundPoints);
        assertEquals(1,s.player("a").roundCorrect);
    }
    @Test void quantityBeatsAFewRareAnswers(){
        // 5 shared answers (5×50…100) beat one unique answer even with the bonus
        var s=session(List.of("a","b","c"),Set.of(),"in_kitchen");toAnswering(s);
        for(String w:List.of("fridge","oven","kettle","fork","spoon")){say(s,"a",w);say(s,"b",w);}
        say(s,"c","whisk");
        endAnswers(s);
        assertTrue(s.player("a").roundPoints>s.player("c").roundPoints*3);
    }
    @Test void ghostResurrectsWithFiveUniqueValidAnswersOnlyOnce(){
        var s=session(List.of("g","x"),Set.of("g"),"batman_villains","batman_villains");toAnswering(s);
        for(String w:List.of("Joker","Bane","Riddler","Penguin","Scarecrow","Joker"))say(s,"g",w); // a personal repeat doesn't spoil it
        say(s,"x","Hush");
        endAnswers(s);
        assertTrue(s.player("g").resurrected);assertEquals(List.of("g"),s.takeRevivals());assertEquals(List.of(),s.takeRevivals());
        assertFalse(s.player("g").ghost);
    }
    @Test void ghostDoesNotResurrectWithASharedOrWrongAnswer(){
        var s=session(List.of("g","h","x"),Set.of("g","h"),"batman_villains");toAnswering(s);
        for(String w:List.of("Joker","Bane","Riddler","Penguin","Scarecrow"))say(s,"g",w);
        say(s,"x","Joker"); // shared
        for(String w:List.of("Hush","Clayface","Firefly","Deadshot","Superman"))say(s,"h",w); // one wrong: only four count
        endAnswers(s);
        assertFalse(s.player("g").resurrected);assertFalse(s.player("h").resurrected);assertTrue(s.takeRevivals().isEmpty());
    }
    @Test void uncertainAnswersGoToAnonymousVoteAuthorCannotVote(){
        var s=session(List.of("a","b","c"),Set.of(),"pump_bottle");toAnswering(s);
        say(s,"a","Bubble bath foam");say(s,"b","Shampoo");
        endAnswers(s);
        assertEquals(ThinkOrDieSession.Phase.DISPUTE,s.phase());
        @SuppressWarnings("unchecked") var ds=(List<Map<String,Object>>)s.snapshot("b",false,now).get("disputes");
        String id=(String)ds.get(0).get("id");assertFalse(ds.get(0).containsKey("author"));
        var e=assertThrows(ThinkOrDieSession.Failure.class,()->s.vote("a",id,true,now));assertEquals("TOD_OWN_ANSWER",e.getMessage());
        s.vote("b",id,true,now);s.vote("c",id,true,now);
        s.tick(now); // everyone eligible voted: closes at once
        assertEquals(ThinkOrDieSession.Phase.ANSWER_REVEAL,s.phase());
        assertEquals(150,s.player("a").roundPoints);
    }
    @Test void tiedVoteGoesToThePlayer(){
        var s=session(List.of("a","b","c"),Set.of(),"pump_bottle");toAnswering(s);
        say(s,"a","Bubble bath foam");endAnswers(s);
        String id=(String)((List<Map<String,Object>>)s.snapshot("b",false,now).get("disputes")).get(0).get("id");
        s.vote("b",id,true,now);s.vote("c",id,false,now);s.tick(now);
        assertEquals(150,s.player("a").roundPoints,"a tie accepts the answer");assertEquals(0,s.player("a").roundIncorrect);
    }
    @Test void twoPlayerGameWorksWithVotes(){
        var s=session(List.of("a","b"),Set.of(),"pump_bottle");toAnswering(s);
        say(s,"a","Bubble bath foam");say(s,"b","Bubble bath foam");endAnswers(s);
        // both authored the same uncertain answer: nobody can vote, so it is neutral and play goes on
        assertEquals(ThinkOrDieSession.Phase.ANSWER_REVEAL,s.phase());
        assertEquals(0,s.player("a").roundPoints);
    }
    @Test void serverRejectsLateSpamAndOversizedInput(){
        var s=session(List.of("a","b"),Set.of(),"batman_villains");
        assertEquals("TOD_NOT_OPEN",assertThrows(ThinkOrDieSession.Failure.class,()->s.submit("a","x",1,"Joker",10)).getMessage());
        toAnswering(s);
        now+=500;s.submit("a","q1",1,"Joker",now);
        assertEquals("TOD_TOO_FAST",assertThrows(ThinkOrDieSession.Failure.class,()->s.submit("a","q2",1,"Bane",now+10)).getMessage());
        assertNull(s.submit("a","q1",1,"Joker",now+1000),"a retried request is ignored");
        assertEquals("TOD_ANSWER_TOO_LONG",assertThrows(ThinkOrDieSession.Failure.class,()->s.submit("a","q3",1,"x".repeat(41),now+2000)).getMessage());
        assertEquals("TOD_NOT_A_PLAYER",assertThrows(ThinkOrDieSession.Failure.class,()->s.submit("zz","q4",1,"Bane",now+3000)).getMessage());
        long late=s.snapshotEnds()+CFG.graceMs()+1;
        assertThrows(ThinkOrDieSession.Failure.class,()->s.submit("a","q5",1,"Bane",late));
    }
    @Test void phonesNeverSeeOtherPlayersAnswersOrTheAnswerDatabase(){
        var s=session(List.of("a","b"),Set.of(),"batman_villains");toAnswering(s);say(s,"a","Joker");say(s,"b","Riddler");
        String phone=String.valueOf(s.snapshot("b",false,now));
        assertFalse(phone.contains("Joker"),phone);assertTrue(phone.contains("Riddler"));
        assertFalse(phone.contains("Harley"),"no verified answers leak");
        assertFalse(String.valueOf(s.snapshot(null,true,now)).contains("Joker"),"hidden mode: the host screen shows counts only");
        var live=new ThinkOrDieSession(List.of("a","b"),Set.of(),List.of(PACK.get("batman_villains"),PACK.get("in_kitchen"),PACK.get("in_kitchen"),PACK.get("in_kitchen"),PACK.get("in_kitchen")),
            ValidationEngine.deterministic(new WordDictionary()),CFG.withHiddenAnswers(false),"en",0);
        toAnswering(live);live.submit("a","z",1,"Joker",now);
        assertTrue(String.valueOf(live.snapshot(null,true,now)).contains("Joker"));
        assertFalse(String.valueOf(live.snapshot("b",false,now)).contains("Joker"));
    }
    @Test void rankingTiesShareRankAndReward(){
        var s=session(List.of("a","b","c"),Set.of(),"batman_villains");
        for(int r=1;r<=CFG.rounds();r++){toAnswering(s);if(r==1){say(s,"a","Joker");say(s,"b","Bane");}endAnswers(s);}
        finish(s);
        var st=s.standings();
        assertEquals(1,st.get(0).rank());assertEquals(1,st.get(1).rank());assertEquals(3,st.get(2).rank());
        assertEquals(CFG.rewardFirst(),st.get(1).souls());assertEquals(CFG.rewardThird(),st.get(2).souls());
    }
}
