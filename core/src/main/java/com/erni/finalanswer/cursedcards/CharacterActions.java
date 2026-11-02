package com.erni.finalanswer.cursedcards;

/**
 * Animation hooks for seated players, called by the table presentation in sync with card motion.
 * The current {@link SeatedCharacters} answers with transform-only reactions; a future seated 3D rig with real clips
 * (none exist in the project yet) implements the same interface.
 */
public interface CharacterActions {
    void idle(int seat);
    void lookAtCards(int seat);
    void drawCard(int seat);
    void receiveCard(int seat);
    void discardPair(int seat);
    void nervous(int seat);
    void survive(int seat);
    void eliminate(int seat);
}
