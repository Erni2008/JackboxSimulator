package com.erni.finalanswer.cursedcards;

/**
 * Animation hooks for seated players, called by the table presentation in sync with card motion.
 * No seated characters exist yet (the scene uses a no-op); future 2D sprites or rigs implement this interface.
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
    /** A card was taken from this player's hand. */
    default void loseCard(int seat){}
    /** This player's turn begins. */
    default void becomeActive(int seat){}
}
