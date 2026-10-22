package com.finalanswer.protocol;

/** Same row-major IDs as CrateSlot: zero is the upper-left compartment. */
public final class CursedBoxesProtocol {
    public static final int COLUMNS=4,ROWS=4,BOX_COUNT=COLUMNS*ROWS,SHOTS_PER_PLAYER=2;
    public static final long IMPACT_MILLIS=30,SHOT_MILLIS=1100,START_TIMEOUT_MILLIS=15_000;
    private CursedBoxesProtocol(){}
}
