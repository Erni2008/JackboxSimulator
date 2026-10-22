package com.finalanswer.protocol;

/** Authoritative phase names; local weapon/audio animation states remain separate. */
public enum CursedBoxesPhase {
    INTRO, PLAYER_SELECTION, SELECTION_LOCKED, HOST_ANNOUNCEMENT,
    BOX_FOCUS, PLAYER_IDENTIFICATION, SHOTGUN_AIM, PRE_SHOT_SUSPENSE,
    SHOTGUN_FIRE, IMPACT_SEQUENCE, RELOAD_AND_EJECTION, BOX_REVEAL,
    PLAYER_RESULT, NEXT_BOX_TRANSITION, FINAL_RESULTS, FINISHED
}
