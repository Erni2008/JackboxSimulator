package com.finalanswer.server.rooms;

/**
 * Points for finishing a mini-game, by final place. One table for every mode so players can compare
 * modes at a glance; questions keep their own +100 per correct answer.
 */
final class ModeScoring {
    static final int FIRST=300,SECOND=200,THIRD=150,REST=100,OUT=50,NONE=0;
    static final int WIN_SIDE=250,LOSE_SIDE=50,SURVIVED=200,SAFE_CARDS=150,CAGE_CLEAR=200,CAGE_HELD=100;
    private ModeScoring(){}
    /** 1-based place among the players still in the game. */
    static int place(int place){return switch(place){case 1->FIRST;case 2->SECOND;case 3->THIRD;default->REST;};}
}
