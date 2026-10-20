package com.erni.finalanswer.ui.lobby.cages;

/** Pure delta-time timeline. No networking or graphics, so joins can be tested without OpenGL. */
public final class CageAnimator {
    public static final float SPAWN = .5f, LOOK = 1f, CLOSE = .6f;
    public static final float RECOIL = .4f, KEY = .9f, SAD = .95f;
    public static final float CLOSE_AT = SPAWN + LOOK;
    public static final float IMPACT_AT = CLOSE_AT + CLOSE;
    public static final float KEY_AT = IMPACT_AT + .12f;
    public static final float SAD_AT = CLOSE_AT;
    public static final float LOCKED_AT = SAD_AT + SAD;
    private float time;
    private boolean occupied;
    private boolean impact, lock;

    public void start() { occupied = true; time = 0; impact = lock = false; }
    public void reset() { occupied = impact = lock = false; time = 0; }
    public void update(float delta) {
        impact = lock = false;
        if (!occupied || !Float.isFinite(delta) || delta <= 0) return;
        float before = time;
        time += delta;
        impact = before < IMPACT_AT && time >= IMPACT_AT;
        lock = before < KEY_AT + KEY * .6f && time >= KEY_AT + KEY * .6f;
    }
    /** Brief damped reaction only at the gate impact; no ambient cage sway. */
    public float impactRotation() {
        float age = time - IMPACT_AT;
        return occupied && age >= 0 && age < .4f
            ? (float)Math.sin(age * 45) * (1 - age / .4f) * .32f : 0;
    }
    public float time() { return time; }
    public boolean occupied() { return occupied; }
    public boolean impact() { return impact; }
    public boolean locked() { return lock; }
    public float gate() { float p = progress(time, CLOSE_AT, CLOSE); return p * p * p; }
    public static float progress(float time, float start, float duration) {
        return Math.max(0, Math.min(1, (time - start) / duration));
    }
    public static float smooth(float p) { return p * p * (3 - 2 * p); }
}
