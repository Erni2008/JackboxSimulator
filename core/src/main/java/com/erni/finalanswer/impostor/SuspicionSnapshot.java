package com.erni.finalanswer.impostor;

/** Public aggregate only; no individual suspicion targets belong on the shared screen. */
public record SuspicionSnapshot(String sessionId,int round,int submitted,int eligible,long deadline,boolean finalized) {
    public SuspicionSnapshot {
        java.util.Objects.requireNonNull(sessionId);
        if(round<1 || round>3 || submitted<0 || eligible<submitted)throw new IllegalArgumentException("Invalid suspicion aggregate");
    }
}
