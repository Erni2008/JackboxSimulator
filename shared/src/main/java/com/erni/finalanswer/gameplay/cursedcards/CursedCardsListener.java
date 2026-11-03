package com.erni.finalanswer.gameplay.cursedcards;

import java.util.List;

/** Authoritative rule events, in order. Presentation (3D table, phones, network) subscribes; it never changes state. */
public interface CursedCardsListener {
    default void dealt(CursedCard card,int player){}
    default void pairRemoved(int player,CursedCard a,CursedCard b){}
    /** {@code drawer} must take one hidden card from {@code source}. */
    default void turnChanged(int drawer,int source){}
    default void transferred(CursedCard card,int from,int to){}
    /** A player emptied their hand and is safe. */
    default void playerSafe(int player){}
    /** The owner reordered their hand (no card identities). */
    default void shuffled(int player){}
    default void finished(int loser,List<Integer> survivors){}
}
