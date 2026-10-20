package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.graphics.g2d.Batch;

/** Future characters implement this contract and are selected by the lobby's character factory. */
public interface CageCharacter {
    void update(float time, float phase, boolean reducedMotion);
    /** Delta hook for occupant-local timelines; existing absolute-time characters keep their behavior. */
    default void update(float delta, float time, float phase, boolean reducedMotion) {
        update(time, phase, reducedMotion);
    }
    void draw(Batch batch, float alpha);
}
