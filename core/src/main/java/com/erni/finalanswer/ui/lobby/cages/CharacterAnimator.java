package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.math.MathUtils;

/** Authored acting beats with a constant-size rig: hold still for one second, sit, settle and sigh. */
public final class CharacterAnimator {
    public enum State { SPAWNING, IDLE, LOOKING_AROUND, SCARED, SAD, LOCKED_IDLE }
    public State state = State.IDLE;
    public float alpha, scale = 1, seated, bodyY, bodyAngle, headAngle, headX, headY, handLift, handsRest, slump, chestSink;

    public void update(float time, float phase, boolean reducedMotion) {
        float spawn = ease(CageAnimator.progress(time, 0, CageAnimator.SPAWN));
        seated = ease(CageAnimator.progress(time, CageAnimator.SAD_AT, CageAnimator.SAD));
        handsRest = ease(CageAnimator.progress(time, CageAnimator.SAD_AT + .16f, CageAnimator.SAD - .08f));
        slump = ease(CageAnimator.progress(time, CageAnimator.SAD_AT + .22f, CageAnimator.SAD + .2f));
        float reaction = CageAnimator.progress(time, CageAnimator.IMPACT_AT, CageAnimator.RECOIL);
        float recoil = reaction > 0 && reaction < 1 ? MathUtils.sin(reaction * MathUtils.PI) : 0;
        state = time < CageAnimator.SPAWN ? State.SPAWNING : time < CageAnimator.SAD_AT ? State.IDLE
            : recoil > 0 ? State.SCARED : time < CageAnimator.LOCKED_AT ? State.SAD : State.LOCKED_IDLE;
        float breath = reducedMotion ? 0 : MathUtils.sin(time * 1.2f + phase);
        float nod = reducedMotion ? 0 : Math.max(0, MathUtils.sin(time * .43f + phase));
        nod = nod * nod * nod * nod * nod * nod;
        alpha = spawn;
        scale = .985f + .015f * spawn;
        // Pelvis descends while the foot targets stay fixed; IK bends knees instead of scaling legs.
        bodyY = -45 * seated;
        bodyAngle = -4.8f * slump + recoil * 1.8f + slump * breath * .16f;
        chestSink = -1.2f * slump + breath * .16f * slump;
        headAngle = -20 * slump + recoil * 4 - slump * nod * 2.5f;
        headX = -recoil + 3 * slump;
        headY = -4 * slump + breath * .12f * slump;
        handLift = recoil * 5;
    }
    /** Quintic easing has zero velocity and acceleration at both ends of every acting beat. */
    private static float ease(float p) { return p * p * p * (p * (p * 6 - 15) + 10); }
}
