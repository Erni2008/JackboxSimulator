package com.erni.finalanswer.lastcommand;

import com.badlogic.gdx.math.*;

/** Reversible, time-based travel along the cap's own local axis. */
public final class MechanicalButton {
    public final Vector3 localAxis = new Vector3(0, 0, -1);
    public float travel = .025f;
    private float value, start, elapsed, duration;
    private boolean held;
    public void held(boolean down) {
        if (held == down) return;
        held = down; start = value; elapsed = 0; duration = down ? .1f : .15f;
    }
    public void update(float delta) {
        if (!Float.isFinite(delta) || delta < 0) return;
        elapsed += delta;
        value = MathUtils.lerp(start, held ? 1 : 0,
            Interpolation.smooth.apply(duration == 0 ? 1 : Math.min(1, elapsed / duration)));
    }
    public void reset() { value=start=elapsed=duration=0;held=false; }
    public boolean animating(){return elapsed<duration;}
    public float depression() { return value; }
    public void apply(Matrix4 rest, Matrix4 output) {
        output.set(rest).translate(localAxis.x * travel * value,
            localAxis.y * travel * value, localAxis.z * travel * value);
    }
}
