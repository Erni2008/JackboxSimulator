package com.erni.finalanswer.cursedboxes;

/** Keeps the existing single occupied slot. Seed selects identity, never occupancy or outcomes. */
public final class CursedCharacterAssignment {
    private static final CursedCharacterType[] TYPES=CursedCharacterType.values();
    private CursedCharacterAssignment(){}
    public static CursedCharacterType at(int slot,int occupiedSlot,long scenarioSeed){
        return slot==occupiedSlot?TYPES[(int)Math.floorMod(scenarioSeed,(long)TYPES.length)]:null;
    }
}
