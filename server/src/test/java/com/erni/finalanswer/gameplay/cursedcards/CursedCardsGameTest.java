package com.erni.finalanswer.gameplay.cursedcards;

import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

/** Rules of THE CURSED CARDS: deck composition, dealing, pairs, turn order, completion, conservation of cards. */
class CursedCardsGameTest {
    private static final int[] SIZES={0,0,7,9,13,15,19,21,25};

    @Test void deckForEveryPlayerCountHasOneDeathAndEvenValues(){
        var deck=new CursedDeck();
        for(int p=4;p<=8;p++)for(int seed=0;seed<200;seed++){
            var cards=deck.build(p,new Random(seed));assertEquals(SIZES[p],cards.size());
            assertEquals(1,cards.stream().filter(CursedCard::death).count());
            Map<Integer,Integer> counts=new HashMap<>();for(var c:cards)if(!c.death()){assertTrue(c.value()>=1&&c.value()<=10);counts.merge(c.value(),1,Integer::sum);}
            counts.forEach((v,n)->assertEquals(0,n%2,"value "+v+" count "+n));
            assertEquals(cards.size(),new HashSet<>(cards.stream().map(CursedCard::id).toList()).size(),"unique ids");
        }
    }
    @Test void customSizesAndValuesAreValidated(){
        int[] sizes=SIZES.clone();sizes[4]=11;var deck=new CursedDeck(sizes,new int[]{7});
        var cards=deck.build(4,new Random(1));assertEquals(11,cards.size());assertTrue(cards.stream().filter(c->!c.death()).allMatch(c->c.value()==7));
        int[] bad=SIZES.clone();bad[4]=12;assertThrows(IllegalArgumentException.class,()->new CursedDeck(bad,new int[]{1}));
        assertThrows(IllegalArgumentException.class,()->new CursedDeck().build(9,new Random()));
        assertThrows(IllegalArgumentException.class,()->new CursedDeck().build(3,new Random()),"fewer than 4 players is not supported");
    }
    @Test void dealIsBalancedAndInitialPairsAreDiscarded(){
        for(int p=4;p<=8;p++){var g=CursedCardsGame.create(p,new CursedDeck(),new Random(p));int[] dealt=new int[p];
            g.addListener(new CursedCardsListener(){public void dealt(CursedCard c,int to){dealt[to]++;}});g.start();
            int min=Arrays.stream(dealt).min().getAsInt(),max=Arrays.stream(dealt).max().getAsInt();assertTrue(max-min<=1,Arrays.toString(dealt));
            for(int q=0;q<p;q++)assertNoPairs(g.hand(q));conserved(g);}
    }
    @Test void pairRemovalHandlesFourOfAKindAndNeverPairsDeath(){
        // Round-robin to 4 players: P0 gets ids 0,4,8,12 (four 4s), P1 9,9,DEATH, P2 7,7,3, P3 3,6,6.
        List<CursedCard> deck=List.of(c(0,4),c(1,9),c(2,7),c(3,3),c(4,4),c(5,9),c(6,7),c(7,6),c(8,4),c(9,0),c(10,3),c(11,6),c(12,4));
        var g=new CursedCardsGame(4,deck,new Random(0));List<int[]> pairs=new ArrayList<>();
        g.addListener(new CursedCardsListener(){public void pairRemoved(int p,CursedCard a,CursedCard b){assertEquals(a.value(),b.value());assertFalse(a.death());pairs.add(new int[]{p,a.value()});}});
        g.start();
        // Four of a kind -> two pairs; the 9s, 7s and 6s pair once each; DEATH never pairs.
        assertEquals(5,pairs.size());assertEquals(0,g.handSize(0));assertEquals(List.of(c(9,0)),g.hand(1));
        assertEquals(List.of(c(10,3)),g.hand(2));assertEquals(List.of(c(3,3)),g.hand(3));assertEquals(CursedCardsGame.Phase.PLAYING,g.phase());
    }
    @Test void turnsGoClockwiseAndSkipEmptyHands(){
        // P0: 1,2   P1: 1,3   P2: 2,DEATH   P3: 3,5   P4: 5 ... crafted so nobody starts with a pair.
        List<CursedCard> deck=List.of(c(0,1),c(1,1),c(2,2),c(3,3),c(4,5),c(5,2),c(6,3),c(7,0),c(8,5));
        var g=new CursedCardsGame(5,deck,new Random(0));List<String> log=new ArrayList<>();
        g.addListener(new CursedCardsListener(){public void turnChanged(int d,int s){log.add(d+"<"+s);}public void playerSafe(int p){log.add("safe"+p);}});
        g.start();
        assertEquals(List.of("0<1"),log);assertFalse(g.draw(new CursedCardsGame.Draw(1,2,0)),"wrong player rejected");assertFalse(g.draw(new CursedCardsGame.Draw(0,2,0)),"wrong source rejected");assertFalse(g.draw(new CursedCardsGame.Draw(0,1,5)),"bad slot rejected");
        // P0 draws P1's 1 (slot 0) -> pair of 1s; P0 keeps 2, P1 keeps 3. Next: P1 draws from P2.
        assertTrue(g.draw(new CursedCardsGame.Draw(0,1,0)));assertEquals(List.of(c(5,2)),g.hand(0));assertEquals("1<2",log.get(log.size()-1));
        // P1 takes P2's 2 (slot 0): no pair; P2 keeps DEATH. Next P2 draws from P3.
        assertTrue(g.draw(new CursedCardsGame.Draw(1,2,0)));assertEquals("2<3",log.get(log.size()-1));
        // P2 takes P3's 3 (slot 0). Next P3 (holding 5) draws from P4.
        assertTrue(g.draw(new CursedCardsGame.Draw(2,3,0)));assertEquals("3<4",log.get(log.size()-1));
        // P3 takes P4's 5 -> pair, P3 and P4 now empty and safe. Next drawer skips P4 (empty) -> P0 draws from P1.
        assertTrue(g.draw(new CursedCardsGame.Draw(3,4,0)));assertTrue(log.contains("safe3")&&log.contains("safe4"),log.toString());assertEquals("0<1",log.get(log.size()-1));
        conserved(g);
    }
    @Test void randomMatchesAlwaysEndWithOneDeathHolderAndConserveCards(){
        for(int p=4;p<=8;p++)for(int seed=0;seed<300;seed++){
            var g=CursedCardsGame.create(p,new CursedDeck(),new Random(seed*31+p));int[] finished={0};int[] loser={-2};List<Integer> survivors=new ArrayList<>();
            g.addListener(new CursedCardsListener(){
                public void turnChanged(int d,int s){assertNotEquals(d,s);assertTrue(g.handSize(d)>0&&g.handSize(s)>0);}
                public void finished(int l,List<Integer> s){finished[0]++;loser[0]=l;survivors.addAll(s);}});
            g.start();int guard=0;
            while(g.phase()==CursedCardsGame.Phase.PLAYING){assertTrue(g.draw(g.randomDraw()));conserved(g);for(int q=0;q<p;q++)assertNoPairs(g.hand(q));assertTrue(++guard<10_000,"terminates");}
            assertEquals(1,finished[0]);assertEquals(List.of(new CursedCard(g.deck().stream().filter(CursedCard::death).findFirst().get().id(),0)),g.hand(loser[0]));
            assertEquals(p-1,survivors.size());assertFalse(survivors.contains(loser[0]));
            assertEquals(g.deck().size()-1,g.discard().size());
            assertFalse(g.draw(new CursedCardsGame.Draw(0,1,0)),"no draws after the end");
        }
    }
    @Test void opponentsNeverSeeHiddenValues(){
        var g=CursedCardsGame.create(4,new CursedDeck(),new Random(9));g.start();
        for(int viewer=0;viewer<4;viewer++)for(int owner=0;owner<4;owner++){int[] h=g.handFor(viewer,owner);assertEquals(g.handSize(owner),h.length);
            for(int i=0;i<h.length;i++)assertEquals(viewer==owner?g.hand(owner).get(i).value():-1,h[i]);}
    }
    private static CursedCard c(int id,int v){return new CursedCard(id,v);}
    private static void assertNoPairs(List<CursedCard> h){Set<Integer> seen=new HashSet<>();for(var c:h)if(!c.death())assertTrue(seen.add(c.value()),"pair left in "+h);}
    private static void conserved(CursedCardsGame g){List<CursedCard> all=new ArrayList<>(g.discard());for(int p=0;p<g.players();p++)all.addAll(g.hand(p));
        assertEquals(g.deck().size(),all.size(),"no lost/duplicated cards");assertEquals(new HashSet<>(g.deck()),new HashSet<>(all));}
}
