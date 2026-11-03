package com.finalanswer.server.rooms;

import com.erni.finalanswer.gameplay.cursedcards.CursedCard;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

/** Server session of THE CURSED CARDS: roster limits, audience curse, idempotent turns, timers and hidden information. */
class CursedCardsSessionTest {
    static List<String> seats(int n){List<String> s=new ArrayList<>();for(int i=0;i<n;i++)s.add("p"+i);return s;}
    static String code(Runnable r){return assertThrows(RoomService.Failure.class,r::run).getMessage();}

    @Test void onlyFourToSixSeatedPlayers(){
        for(int n:new int[]{1,2,3,7,8,9})assertEquals("CARDS_PLAYER_COUNT",code(()->new CursedCardsSession(seats(n),List.of(),new Random(1),0)));
        for(int n=4;n<=6;n++)assertEquals(CursedCardsSession.Phase.DEALING,new CursedCardsSession(seats(n),List.of(),new Random(n),0).phase());
        assertEquals("INVALID_CARDS_ROSTER",code(()->new CursedCardsSession(List.of("a","a","b","c"),List.of(),new Random(1),0)));
    }
    @Test void eligibilityFollowsTheIncorrectAnswerCount(){
        for(int n=0;n<=8;n++)assertEquals(n>=4&&n<=6,com.erni.finalanswer.gameplay.cursedcards.CursedDeck.eligible(n),"incorrect answers: "+n);
    }
    @Test void everyTurnHasExactlyFiveSecondsWhateverThePhase(){
        for(int n=4;n<=6;n++)for(int seed=0;seed<20;seed++){var s=playing(n,seed);long now=s0;int g=0;
            while(s.phase()==CursedCardsSession.Phase.PLAYING){var v=s.snapshot("host",true,now);long ready=(long)v.get("turnReadyAt"),deadline=(long)v.get("turnDeadline");
                assertEquals(5_000,deadline-ready,"turn window (players left: "+v.get("handSizes")+")");
                // shuffling by everyone never moves the deadline
                for(String p:s.seats)try{s.shuffle(p,"s"+g+p,Math.max(now,ready)+100);}catch(RoomService.Failure ignored){}
                assertEquals(deadline,(long)s.snapshot("host",true,now).get("turnDeadline"));
                assertTrue(s.tick(deadline),"timeout commits a random card exactly at the deadline");now=deadline;assertTrue(++g<500);}
            assertEquals(CursedCardsSession.Phase.FINISHED,s.phase());}
    }
    @Test void lateSelectionNeverOverridesTheTimeout(){
        var s=playing(5,3);var v=s.snapshot("host",true,s0);String drawer=(String)v.get("drawer");long deadline=(long)v.get("turnDeadline");int turn=(int)v.get("turn");
        assertEquals("CARDS_TURN_EXPIRED",code(()->s.draw(drawer,"late",turn,0,deadline)));
        assertTrue(s.tick(deadline));assertEquals(1,s.timeouts());
        assertFalse(s.draw(drawer,"late",turn,0,deadline+5),"the same late request id is ignored");
        assertTrue(Set.of("CARDS_STALE_TURN","CARDS_TURN_NOT_READY","CARDS_NOT_PLAYING").contains(code(()->s.draw(drawer,"late2",turn,0,deadline+5))));
    }
    @Test void shufflingIsUnlimitedRealAndKeepsTheCards(){
        var s=playing(4,8);long now=s0;int seat=-1;for(int p=0;p<4;p++)if(s.game().handSize(p)>=3)seat=p;assertTrue(seat>=0);String owner="p"+seat;
        var before=new HashSet<>(s.game().hand(seat));int changed=0;List<CursedCard> last=List.copyOf(s.game().hand(seat));int r0=s.revision(seat);
        for(int i=0;i<300;i++){now+=500;assertTrue(s.shuffle(owner,"sh"+i,now));var h=List.copyOf(s.game().hand(seat));if(!h.equals(last))changed++;last=h;
            assertEquals(before,new HashSet<>(h),"same cards");if(s.phase()!=CursedCardsSession.Phase.PLAYING)break;}
        assertTrue(changed>=290,"the order really changes ("+changed+"/300)");assertTrue(s.revision(seat)>r0);
        // the owner's private hand follows the new order; nobody else learns it
        List<Integer> real=new ArrayList<>();for(var c:s.game().hand(seat))real.add(c.value());assertEquals(real,s.snapshot(owner,false,now).get("hand"));
        for(var e:events(s))assertNotEquals("shuffle",e.get("type"),"shuffles leave no trail in the public log");
        assertEquals("CARDS_NOT_PLAYER",code(()->s.shuffle("stranger","x",0)));
    }
    @Test void rapidShufflesAreCoalescedNotQueued(){
        var s=playing(5,12);int seat=-1;for(int p=0;p<5;p++)if(s.game().handSize(p)>=2)seat=p;int r=s.revision(seat);long t=s0+50;
        int accepted=0;for(int i=0;i<100;i++)if(s.shuffle("p"+seat,"r"+i,t+i))accepted++; // 100 taps in 100 ms
        assertEquals(1,accepted,"one reorder per pacing window; the rest change nothing");assertEquals(r+1,s.revision(seat));
    }
    @Test void shufflingWhileBeingDrawnFromIsFairAndCannotStarve(){
        for(int seed=0;seed<200;seed++){var s=playing(5,seed);var v=s.snapshot("host",true,s0);String drawer=(String)v.get("drawer"),src=(String)v.get("source");int turn=(int)v.get("turn");
            int srcSeat=s.seats.indexOf(src);if(s.game().handSize(srcSeat)<2)continue;int seenRev=(int)v.get("sourceRevision");
            int slot=1;int wanted=s.game().hand(srcSeat).get(slot).id();long t=s0+100;
            assertTrue(s.shuffle(src,"dodge",t));// the owner shuffles while the drawer's tap is in flight
            int toBefore=s.game().handSize(s.seats.indexOf(drawer));
            assertTrue(s.draw(drawer,"tap",turn,slot,seenRev,t+300),"a tap on the order the drawer saw still lands");
            boolean took=false;for(var e:events(s))if(e.get("type").equals("transfer")&&(int)e.get("card")==wanted)took=true;assertTrue(took,"the card at the tapped position is the one taken");
            int total=0;for(int p=0;p<5;p++)total+=s.game().handSize(p);assertEquals(s.game().deck().size(),total+s.game().discard().size());}
        // an order replaced long ago is refused, and the phone simply taps again on the fresh order
        var s=playing(5,77);var v=s.snapshot("host",true,s0);String drawer=(String)v.get("drawer"),src=(String)v.get("source");int turn=(int)v.get("turn");int rev=(int)v.get("sourceRevision");
        if(s.game().handSize(s.seats.indexOf(src))>=2){assertTrue(s.shuffle(src,"a",s0+10));
            assertEquals("CARDS_STALE_HAND",code(()->s.draw(drawer,"old",turn,0,rev,s0+10+CursedCardsSession.STALE_GRACE_MS+1)));
            int fresh=(int)s.snapshot(drawer,false,s0+2_000).get("sourceRevision");assertTrue(s.draw(drawer,"new",turn,0,fresh,s0+2_000));}
        // continuous shuffling by the source never blocks a selection: every attempt within the window succeeds
        for(int seed=0;seed<50;seed++){var q=playing(6,seed);long t=s0;int g=0;var pick=new Random(seed);
            while(q.phase()==CursedCardsSession.Phase.PLAYING){var w=q.snapshot("host",true,t);t=Math.max(t,(long)w.get("turnReadyAt"));String d=(String)w.get("drawer"),so=(String)w.get("source");int seen=(int)q.snapshot(d,false,t).get("sourceRevision");
                for(int k=0;k<10;k++){t+=60;try{q.shuffle(so,"z"+g+"-"+k,t);}catch(RoomService.Failure ignored){}}
                assertTrue(q.draw(d,"d"+g,(int)w.get("turn"),pick.nextInt((int)w.get("sourceCards")),seen,t),"selection is never starved");assertTrue(++g<500);}
            assertEquals(1,q.game().hand(q.game().loser()).size());assertTrue(q.game().hand(q.game().loser()).get(0).death());}
    }
    /** Simulated pacing: phones act within the five-second window; a match must land in 1.5–2.5 minutes. */
    @Test void matchLastsAboutTwoMinutes(){
        for(int n=4;n<=6;n++){long sum=0;int runs=80;
            for(int seed=0;seed<runs;seed++){var s=new CursedCardsSession(seats(n),List.of("w"),new Random(seed),0);var think=new Random(seed+99L);long now=0;s.vote("w","v","p0",1_000);now=2_300;s.tick(now);
                now=(long)s.snapshot("host",true,now).get("dealEndsAt");s.tick(now);int g=0;
                while(s.phase()==CursedCardsSession.Phase.PLAYING){var v=s.snapshot("host",true,now);now=(long)v.get("turnReadyAt")+1_000+think.nextInt(3_900);
                    s.draw((String)v.get("drawer"),"r"+g++,(int)v.get("turn"),think.nextInt((int)v.get("sourceCards")),now);}
                sum+=now+4_000; /* DEATH reveal */}
            double minutes=sum/(double)runs/60_000;System.out.println("PACE "+n+" "+minutes);assertTrue(minutes>=1.5&&minutes<=2.5,n+" players: average "+minutes+" min");}
    }
    @Test void spectatorsCurseBeforeTheDealAndOnlyThem(){
        var s=new CursedCardsSession(seats(5),List.of("w1","w2"),new Random(3),0);
        assertEquals(CursedCardsSession.Phase.CURSE_VOTE,s.phase());assertEquals("SPECTATOR",s.snapshot("w1",false,0).get("role"));assertEquals("PLAYER",s.snapshot("p0",false,0).get("role"));
        assertEquals("CARDS_NOT_SPECTATOR",code(()->s.vote("p0","r0","p1",10)));
        assertEquals("CARDS_INVALID_TARGET",code(()->s.vote("w1","r1","w2",10)));
        assertTrue(s.vote("w1","r2","p3",10));assertFalse(s.vote("w1","r2","p3",10),"same request is ignored");
        assertTrue(s.vote("w2","r3","p3",20));
        assertFalse(s.snapshot("w1",false,20).containsKey("cursedPlayer"),"the curse result is revealed only when voting ends");
        assertTrue(s.tick(20+1_300),"all spectators voted: voting closes early");
        assertEquals(CursedCardsSession.Phase.DEALING,s.phase());assertEquals("p3",s.cursedPlayer());assertEquals("p3",s.snapshot("p0",false,2_000).get("cursedPlayer"));
        assertEquals("CARDS_VOTE_CLOSED",code(()->s.vote("w1","r4","p1",3_000)));
    }
    @Test void curseOnlyBiasesTheInitialDeal(){
        int cursedHolds=0,runs=600,n=5;
        for(int seed=0;seed<runs;seed++){var s=new CursedCardsSession(seats(n),List.of("w"),new Random(seed),0);s.vote("w","v","p2",1);s.tick(VOTE());
            var events=events(s);int deathId=-1;for(var c:s.game().deck())if(c.death())deathId=c.id();
            for(var e:events)if(e.get("type").equals("dealt")&&(int)e.get("card")==deathId&&(int)e.get("seat")==2)cursedHolds++;}
        double share=cursedHolds/(double)runs;
        assertTrue(share>.5&&share<.75,"cursed player's DEATH share "+share+" (uniform would be ~"+1.0/n+")");
    }
    @Test void turnsAreIdempotentAndStaleOrForeignDrawsAreRefused(){
        var s=playing(6,7);var snap=s.snapshot("p0",false,s0);int turn=(int)snap.get("turn");String drawer=(String)snap.get("drawer");
        String other=s.seats.stream().filter(p->!p.equals(drawer)).findFirst().get();
        assertEquals("CARDS_NOT_YOUR_TURN",code(()->s.draw(other,"x1",turn,0,s0)));
        assertEquals("CARDS_INVALID_SLOT",code(()->s.draw(drawer,"x2",turn,99,s0)));
        assertEquals("CARDS_STALE_TURN",code(()->s.draw(drawer,"x3",turn+1,0,s0)));
        int before=total(s);assertTrue(s.draw(drawer,"take",turn,0,s0));
        assertFalse(s.draw(drawer,"take",turn,0,s0),"a repeated request id changes nothing");
        assertEquals(before,total(s)+discarded(s)-discardedBefore,"no card created or lost");
        if(s.phase()==CursedCardsSession.Phase.PLAYING){String next=(String)s.snapshot("p0",false,s0).get("drawer");
            assertEquals("CARDS_TURN_NOT_READY",code(()->s.draw(next,"y",turn+1,0,s0)),"the next turn waits for the shared-screen animation");}
    }
    @Test void completeMatchesForEveryPlayerCountKeepExactlyOneDeath(){
        for(int n=4;n<=6;n++)for(int seed=0;seed<60;seed++){
            var s=playing(n,seed);long now=s0;int guard=0;var pick=new Random(seed*31L+n);
            while(s.phase()==CursedCardsSession.Phase.PLAYING){var v=s.snapshot("host",true,now);now=Math.max(now,(long)v.get("turnReadyAt"));
                String drawer=(String)v.get("drawer");int cards=(int)v.get("sourceCards");
                assertTrue(s.draw(drawer,"r"+guard,(int)v.get("turn"),pick.nextInt(cards),now));assertTrue(++guard<2_000);
                assertEquals(s.game().deck().size(),total(s)+discarded(s));}
            assertEquals(CursedCardsSession.Phase.FINISHED,s.phase());
            var end=s.snapshot("p0",false,now);String loser=(String)end.get("loser");int seat=s.seats.indexOf(loser);
            assertEquals(1,s.game().hand(seat).size());assertTrue(s.game().hand(seat).get(0).death());
            assertEquals(n-1,((List<?>)end.get("survivors")).size());}
    }
    @Test void theMomentATurnOpensIsAnnounced(){
        var s=playing(5,4);var v=s.snapshot("host",true,s0);String drawer=(String)v.get("drawer");assertTrue(s.draw(drawer,"d",(int)v.get("turn"),0,s0));
        if(s.phase()!=CursedCardsSession.Phase.PLAYING)return;long ready=(long)s.snapshot("host",true,s0).get("turnReadyAt");
        assertFalse(s.tick(ready-1));assertTrue(s.tick(ready),"phones learn the drawer may act");assertFalse(s.tick(ready+10),"announced once");
        String next=(String)s.snapshot("host",true,ready).get("drawer");assertEquals(true,s.snapshot(next,false,ready).get("canDraw"));
    }
    @Test void timeoutTakesARandomCardForAnIdleDrawer(){
        var s=playing(4,11);var v=s.snapshot("host",true,s0);int turn=(int)v.get("turn");
        assertFalse(s.tick((long)v.get("turnDeadline")-1));assertTrue(s.tick((long)v.get("turnDeadline")));
        assertEquals(1,s.timeouts());if(s.phase()==CursedCardsSession.Phase.PLAYING)assertEquals(turn+1,(int)s.snapshot("host",true,s0).get("turn"));
        assertTrue(events(s).stream().anyMatch(e->e.get("type").equals("timeout")));
    }
    @Test void snapshotsRevealOnlyTheViewersOwnValues(){
        var s=playing(5,21);
        for(int p=0;p<5;p++){var v=s.snapshot("p"+p,false,s0);List<?> hand=(List<?>)v.get("hand");List<Integer> real=new ArrayList<>();for(CursedCard c:s.game().hand(p))real.add(c.value());assertEquals(real,hand);}
        var watcher=s.snapshot("stranger",false,s0);assertFalse(watcher.containsKey("hand"));assertEquals("SPECTATOR",watcher.get("role"));
        assertFalse(s.snapshot("host",true,s0).containsKey("hand"),"the shared screen never gets hand values");
        for(var e:events(s)){if(Set.of("dealt","transfer").contains(e.get("type")))assertFalse(e.containsKey("value"),"moving cards carry no value");}
        Set<Integer> ids=new HashSet<>();for(var c:s.game().deck())ids.add(c.id());assertEquals(s.game().deck().size(),ids.size());
        int deathIdLast=0,runs=200;for(int seed=0;seed<runs;seed++){var t=playing(5,seed);for(var c:t.game().deck())if(c.death()&&c.id()==t.game().deck().size()-1)deathIdLast++;}
        assertTrue(deathIdLast<runs*.2,"card ids are shuffled; the DEATH id is not predictable ("+deathIdLast+"/"+runs+")");
    }

    // ---- helpers ----
    private long s0;private int discardedBefore;
    private CursedCardsSession playing(int n,int seed){var s=new CursedCardsSession(seats(n),List.of(),new Random(seed),0);s0=(long)s.snapshot("host",true,0).getOrDefault("dealEndsAt",0L);s.tick(s0);discardedBefore=discarded(s);return s;}
    private static long VOTE(){return CursedCardsSession.VOTE_MS;}
    @SuppressWarnings("unchecked") private static List<Map<String,Object>> events(CursedCardsSession s){return (List<Map<String,Object>>)s.snapshot("host",true,0).get("events");}
    private static int total(CursedCardsSession s){int t=0;for(int p=0;p<s.seats.size();p++)t+=s.game().handSize(p);return t;}
    private static int discarded(CursedCardsSession s){return s.game().discard().size();}
}
