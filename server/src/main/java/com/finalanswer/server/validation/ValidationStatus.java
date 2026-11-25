package com.finalanswer.server.validation;

/** Outcome of validating one free-text answer. */
public enum ValidationStatus {
    /** accepted; carries a canonical answer id */
    VALID,
    /** rejected (breaks the category rule, a known wrong answer, or outside an exhaustive answer set) */
    INVALID,
    /** could not be decided automatically: goes to the dispute vote, never punished on its own */
    UNCERTAIN,
    /** waiting for the optional AI judge */
    PENDING,
    /** the same player already gave this canonical answer in this round (scores 0) */
    DUPLICATE;

    public boolean decided(){return this==VALID||this==INVALID||this==DUPLICATE;}
}
