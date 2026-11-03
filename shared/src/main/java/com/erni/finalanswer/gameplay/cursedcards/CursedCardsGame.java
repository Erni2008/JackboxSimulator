package com.erni.finalanswer.gameplay.cursedcards;

import java.util.*;

/**
 * Authoritative THE CURSED CARDS rules (Old-Maid style): deal, discard pairs, draw clockwise from the next
 * player who still has cards, until only DEATH is left. Pure Java so the server can own it; no rendering.
 * Hidden information is exposed only through {@link #handFor(int,int)}.
 */
public final class CursedCardsGame {
    public enum Phase {DEALING,PLAYING,FINISHED}
    /** A player's request to take the hidden card at {@code slot} of {@code source}'s hand. */
    public record Draw(int player,int source,int slot){}

    private final int players;
    private final List<CursedCard> deck;
    private final List<List<CursedCard>> hands=new ArrayList<>();
    private final List<CursedCard> discard=new ArrayList<>();
    private final List<CursedCardsListener> listeners=new ArrayList<>();
    private final Random random;
    private Phase phase=Phase.DEALING;
    private int current=-1,source=-1,loser=-1;
    private final boolean[] safe;

    public CursedCardsGame(int players,List<CursedCard> deck,Random random){
        CursedDeck.check(players);this.players=players;this.deck=List.copyOf(deck);this.random=random;safe=new boolean[players];
        long deaths=deck.stream().filter(CursedCard::death).count();if(deaths!=1)throw new IllegalArgumentException("deck must hold exactly one DEATH: "+deaths);
        for(int i=0;i<players;i++)hands.add(new ArrayList<>());
    }
    public static CursedCardsGame create(int players,CursedDeck deck,Random random){return new CursedCardsGame(players,deck.build(players,random),random);}
    public void addListener(CursedCardsListener l){listeners.add(l);}

    /** Deal round-robin from player 0 (counts differ by at most one), discard initial pairs, open the first turn. */
    public void start(){
        if(phase!=Phase.DEALING||!hands.get(0).isEmpty())throw new IllegalStateException("already started");
        for(int i=0;i<deck.size();i++){int p=i%players;hands.get(p).add(deck.get(i));for(var l:listeners)l.dealt(deck.get(i),p);}
        for(int p=0;p<players;p++)removePairs(p);
        phase=Phase.PLAYING;for(int p=0;p<players;p++)markSafe(p);
        if(!checkFinished())openTurn(nextWithCards(players-1));
    }
    /** Apply a draw; returns false (state untouched) for anything not legal right now. */
    public boolean draw(Draw d){
        if(phase!=Phase.PLAYING||d.player()!=current||d.source()!=source)return false;
        List<CursedCard> from=hands.get(source);if(d.slot()<0||d.slot()>=from.size())return false;
        CursedCard card=from.remove(d.slot());hands.get(current).add(card);for(var l:listeners)l.transferred(card,source,current);
        removePairs(current);markSafe(source);markSafe(current);
        if(!checkFinished())openTurn(nextWithCards(current));
        return true;
    }
    /**
     * Reorders {@code player}'s hand with an unbiased Fisher–Yates shuffle (only the order changes, never the cards).
     * A different order is preferred when one exists. Returns false when there is nothing to reorder.
     */
    public boolean shuffle(int player,Random rnd){
        if(phase==Phase.FINISHED)return false;List<CursedCard> h=hands.get(player);if(h.size()<2)return false;
        List<CursedCard> before=List.copyOf(h);for(int tries=0;tries<8;tries++){Collections.shuffle(h,rnd);if(!h.equals(before))break;}
        for(var l:listeners)l.shuffled(player);return true;
    }
    /** Owner sees values; everyone else sees hidden (-1) in the same slots. */
    public int[] handFor(int viewer,int owner){List<CursedCard> h=hands.get(owner);int[] out=new int[h.size()];for(int i=0;i<out.length;i++)out[i]=viewer==owner?h.get(i).value():-1;return out;}

    private void openTurn(int drawer){
        current=drawer;source=nextWithCards(drawer);
        for(var l:listeners)l.turnChanged(current,source);
    }
    /** Next player clockwise after {@code from} holding cards (never {@code from} itself unless alone). */
    private int nextWithCards(int from){for(int i=1;i<=players;i++){int p=(from+i)%players;if(!hands.get(p).isEmpty())return p;}return from;}
    private void removePairs(int player){
        List<CursedCard> h=hands.get(player);Map<Integer,CursedCard> open=new LinkedHashMap<>();
        for(CursedCard c:new ArrayList<>(h)){if(c.death())continue;CursedCard mate=open.remove(c.value());
            if(mate==null)open.put(c.value(),c);else{h.remove(mate);h.remove(c);discard.add(mate);discard.add(c);for(var l:listeners)l.pairRemoved(player,mate,c);}}
    }
    private void markSafe(int p){if(phase==Phase.PLAYING&&!safe[p]&&hands.get(p).isEmpty()){safe[p]=true;for(var l:listeners)l.playerSafe(p);}}
    private boolean checkFinished(){
        for(var h:hands)for(CursedCard c:h)if(!c.death())return false;
        phase=Phase.FINISHED;current=source=-1;
        for(int p=0;p<players;p++)if(!hands.get(p).isEmpty())loser=p;
        List<Integer> survivors=new ArrayList<>();for(int p=0;p<players;p++)if(p!=loser)survivors.add(p);
        for(var l:listeners)l.finished(loser,List.copyOf(survivors));return true;
    }

    public int players(){return players;}
    public Phase phase(){return phase;}
    public int current(){return current;}
    public int source(){return source;}
    public int loser(){return loser;}
    public boolean safe(int p){return safe[p];}
    public int handSize(int p){return hands.get(p).size();}
    /** Authoritative hand (server/debug only — never send to other players). */
    public List<CursedCard> hand(int p){return Collections.unmodifiableList(hands.get(p));}
    public List<CursedCard> discard(){return Collections.unmodifiableList(discard);}
    public List<CursedCard> deck(){return deck;}
    /** Random legal draw for the current player (bots, timeouts, local testing). */
    public Draw randomDraw(){return phase!=Phase.PLAYING?null:new Draw(current,source,random.nextInt(hands.get(source).size()));}
}
