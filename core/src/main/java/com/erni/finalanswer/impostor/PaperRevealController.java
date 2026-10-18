package com.erni.finalanswer.impostor;

/** One visual timeline for every active paper. No input, networking or gameplay timers. */
public final class PaperRevealController {
    public static final double FLIP_SECONDS = 0.50;
    public static final int ROUND_COUNT = 3;
    private PaperFlipState state = PaperFlipState.FACE_DOWN;
    private double elapsed;
    private int round;

    public PaperFlipState state() { return state; }
    public int round() { return round; }
    public double progress() { return Math.min(1, elapsed / FLIP_SECONDS); }
    public boolean flipping() {
        return state == PaperFlipState.FLIPPING_TO_FRONT || state == PaperFlipState.FLIPPING_TO_BACK;
    }
    public boolean canReveal() { return state == PaperFlipState.FACE_DOWN && round < ROUND_COUNT; }

    /** Conflicting or duplicate requests are ignored; there is no delayed request queue. */
    public boolean reveal() {
        if (!canReveal()) return false;
        round++;
        elapsed = 0;
        state = PaperFlipState.FLIPPING_TO_FRONT;
        return true;
    }

    /** The third reveal is final: papers stay up until an explicit reset. */
    public boolean flipBack() {
        if (state != PaperFlipState.FACE_UP || round == ROUND_COUNT) return false;
        elapsed = 0;
        state = PaperFlipState.FLIPPING_TO_BACK;
        return true;
    }

    public void update(float delta) {
        if (!flipping() || Float.isNaN(delta) || delta <= 0) return;
        elapsed = Math.min(FLIP_SECONDS, elapsed + delta);
        if (elapsed >= FLIP_SECONDS)
            state = state == PaperFlipState.FLIPPING_TO_FRONT ? PaperFlipState.FACE_UP : PaperFlipState.FACE_DOWN;
    }

    public boolean frontVisible() {
        return state == PaperFlipState.FACE_UP
            || state == PaperFlipState.FLIPPING_TO_FRONT && progress() >= .5
            || state == PaperFlipState.FLIPPING_TO_BACK && progress() < .5;
    }

    public float widthScale() {
        if (!flipping()) return 1;
        double p = progress();
        if (p == .5) return 0;
        double eased = p*p*p*(p*(p*6-15)+10); // smootherstep
        return (float)Math.abs(Math.cos(Math.PI * eased));
    }

    /** Restore already public history after reconnect; never exposes unrevealed slots. */
    public void restore(int revealedRounds,boolean faceUp) {
        if(revealedRounds<0 || revealedRounds>ROUND_COUNT)throw new IllegalArgumentException("Invalid reveal count");
        round=revealedRounds;elapsed=0;state=faceUp?PaperFlipState.FACE_UP:PaperFlipState.FACE_DOWN;
    }

    public void reset() {
        state = PaperFlipState.FACE_DOWN;
        elapsed = 0;
        round = 0;
    }
}
