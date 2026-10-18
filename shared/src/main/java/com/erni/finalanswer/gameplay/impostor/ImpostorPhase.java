package com.erni.finalanswer.gameplay.impostor;

/** Shared phase vocabulary; authoritative timing belongs to the server. */
public enum ImpostorPhase {
    INTRO,
    REPLAY_PREPARATION,
    ROLE_REVEAL,
    ROUND_CLUE_INPUT,
    ROUND_CLUE_REVEAL,
    PRELIMINARY_SUSPICION,
    EVIDENCE_REVIEW,
    FINAL_VOTING,
    VOTING_LOCKED,
    FINAL_VOTE_REVEAL,
    SUSPECT_ANNOUNCEMENT,
    IMPOSTOR_REVEAL,
    FINAL_GUESS,
    RESULT,
    COMPLETE
}
