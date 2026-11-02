package com.erni.finalanswer.cursedcards;

/**
 * Where discarded pairs go and how they vanish. The default fades them out at a configurable spot near the machine;
 * a dedicated 3D discard device can replace it later without touching the table presentation.
 */
public interface DiscardMechanism {
    /** Resting pose for the {@code index}-th discarded card before it disappears. */
    CardPose target(int index,CardPose out);
    /** Seconds the disappearance takes once the card has arrived. */
    float vanishDuration();
}
