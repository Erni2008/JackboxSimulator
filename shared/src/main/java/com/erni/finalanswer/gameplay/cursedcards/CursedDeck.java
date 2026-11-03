package com.erni.finalanswer.gameplay.cursedcards;

import java.util.*;

/**
 * Deck composition: an even number of every included value 1–10 plus exactly one DEATH.
 * Sizes per player count are configurable; defaults: 17 cards for 4–6 players.
 */
public final class CursedDeck {
    /** THE CURSED CARDS is designed for 4–6 active players (the room itself still holds up to eight). */
    public static final int MIN_PLAYERS=4,MAX_PLAYERS=6;
    /** Deck size by player count: 17 cards for 4–6 players (odd; one DEATH) — tuned for a ~2 minute match. */
    private static final int[] DEFAULT_SIZES={0,0,0,0,17,17,17};
    /** Mini-game eligibility: only the players who answered the main question incorrectly play; 4–6 of them. */
    public static boolean eligible(int incorrectAnswerCount){return incorrectAnswerCount>=MIN_PLAYERS&&incorrectAnswerCount<=MAX_PLAYERS;}
    private final int[] sizes;private final int[] values;

    public CursedDeck(){this(DEFAULT_SIZES,new int[]{1,2,3,4,5,6,7,8,9,10});}
    /** @param sizes deck size indexed by player count (odd, ≥3); @param values normal values available for pairs */
    public CursedDeck(int[] sizes,int[] values){
        for(int p=MIN_PLAYERS;p<=MAX_PLAYERS;p++){int s=sizes[p];if(s<3||s%2==0)throw new IllegalArgumentException("deck size for "+p+" players must be odd and ≥3: "+s);}
        if(values.length==0)throw new IllegalArgumentException("no card values");
        for(int v:values)if(v<1||v>10)throw new IllegalArgumentException("value out of range: "+v);
        this.sizes=sizes.clone();this.values=values.clone();
    }
    public int size(int players){check(players);return sizes[players];}
    /** Shuffled deck. Pair values are drawn without repeats until every value is used, then reused (keeping counts even). */
    public List<CursedCard> build(int players,Random random){
        int pairs=(size(players)-1)/2;List<Integer> pool=new ArrayList<>();List<CursedCard> deck=new ArrayList<>();int id=0;
        for(int i=0;i<pairs;i++){if(pool.isEmpty()){for(int v:values)pool.add(v);Collections.shuffle(pool,random);}int v=pool.remove(pool.size()-1);deck.add(new CursedCard(id++,v));deck.add(new CursedCard(id++,v));}
        deck.add(new CursedCard(id,CursedCard.DEATH));Collections.shuffle(deck,random);return deck;
    }
    static void check(int players){if(players<MIN_PLAYERS||players>MAX_PLAYERS)throw new IllegalArgumentException("players must be 4–6: "+players);}
}
