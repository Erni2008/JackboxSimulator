package com.erni.finalanswer.gameplay.cursedcards;

/**
 * Integration point for audience voting on which hidden card the drawer should take.
 * The rules only ever see the resulting slot; voters never receive card values.
 */
public interface CursedAudienceVote {
    /** A vote opens for {@code drawer} choosing among {@code slots} hidden cards of {@code source}. */
    void open(int drawer,int source,int slots);
    /** Winning slot, or -1 while undecided. */
    int result();
    void close();
}
