package com.erni.finalanswer.gameplay.impostor;

import java.util.Objects;

/** Immutable phase holder, usable by host and future server logic without libGDX. */
public record ImpostorState(ImpostorPhase phase) {
    public ImpostorState {
        Objects.requireNonNull(phase, "phase");
    }

    public static ImpostorState initial() {
        return new ImpostorState(ImpostorPhase.INTRO);
    }
}
