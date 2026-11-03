package com.finalanswer.server.rooms;

import com.erni.finalanswer.gameplay.cursedcards.CursedCard;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

/** Server session of THE CURSED CARDS: roster limits, audience curse, idempotent turns, timers and hidden information. */
class CursedCardsSessionTest {
    static List<String> seats(int n){List<String> s=new ArrayList<>();for(int i=0;i<n;i++)s.add("p"+i);return s;}
    static String code(Runnable r){return assertThrows(RoomService.Failure.class,r::run).getMessage();}

    @Test void onlyFourToEightSeatedPlayers(){
        for(int n:new int[]{1,2,3,9})assertEquals("CARDS_PLAYER_COUNT",code(()->new CursedCardsSession(seats(n),List.of(),new Random(1),0)));
        for(int n=4;n<=8;n++)assertEquals(CursedCardsSession.Phase.DEALING,new CursedCardsSession(seats(n),List.of(),new Random(n),0).phase());
        assertEquals("INVALID_CARDS_ROSTER",code(()->new CursedCardsSession(List.of("a","a","b","c"),List.of(),new Random(1),0)));
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
        for(int n=4;n<=8;n++)for(int seed=0;seed<60;seed++){
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
