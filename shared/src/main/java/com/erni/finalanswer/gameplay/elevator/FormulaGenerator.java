package com.erni.finalanswer.gameplay.elevator;

import com.erni.finalanswer.gameplay.elevator.Formula.*;
import java.util.Random;

/** THE UNSTABLE FORMULA — sample generation and a solvability check against the journal rules. */
public final class FormulaGenerator {
    private FormulaGenerator() {}

    public static Sample generate(long seed) { return generate(seed, Difficulty.NORMAL); }
    public static Sample generate(long seed, Difficulty d) {
        Random r = new Random(seed * 0x9E3779B97F4A7C15L + 0x632BE59BD9B4E019L); // scrambled: consecutive seeds must not correlate
        for (int attempt = 0; attempt < 100; attempt++) {
            Family f = Family.values()[r.nextInt(4)]; int cls = 1 + r.nextInt(2); Reaction re = Reaction.values()[r.nextInt(3)];
            Polarity p = Polarity.values()[r.nextInt(2)]; Concentration c = Concentration.values()[r.nextInt(3)];
            Reagent base = Formula.base(f, cls), add = Formula.additive(base, re);
            // 40 %: one of the two recipe reagents is unstable (needs the cooling lock)
            Reagent unstable = r.nextInt(10) < (d == Difficulty.EASY ? 0 : d == Difficulty.HARD ? 8 : 4) ? (r.nextBoolean() ? base : add) : null;
            String id = "X-" + (10 + r.nextInt(90)) + (char) ('A' + r.nextInt(6));
            Sample s = new Sample(id, f, cls, re, p, c, unstable);
            if (validate(s)) return s;
        }
        throw new IllegalStateException("no valid formula for seed " + seed);
    }

    /** one recipe of 3–4 doses from two distinct, compatible reagents, preparable well inside the limit */
    public static boolean validate(Sample s) {
        Recipe rc = Formula.solve(s);
        if (rc.base() == rc.additive() || !Formula.compatible(rc.base(), rc.additive())) return false;
        if (rc.sequence().size() < 3 || rc.sequence().size() > 4) return false;
        if (s.unstable() != null && s.unstable() != rc.base() && s.unstable() != rc.additive()) return false;
        return solveTime(s, 12_000, 400) <= 35_000;
    }

    /** a player who spends {@code readMs} decoding in the journal and {@code reactionMs} between controls */
    public static long solveTime(Sample s, long readMs, long reactionMs) {
        FormulaPuzzle p = new FormulaPuzzle(s, 0); Recipe rc = p.recipe(); long t = readMs, seq = 0;
        if (rc.unstable() != null) { p.apply(FormulaPuzzle.Action.LOCK_ON, null, seq++, t); t += reactionMs; }
        for (Reagent d : rc.sequence()) { t = Math.max(t, p.busyUntil()); p.apply(FormulaPuzzle.Action.DISPENSE, d, seq++, t); t += reactionMs; }
        t = Math.max(t, p.busyUntil()); p.apply(FormulaPuzzle.Action.INJECT, null, seq++, t);
        return p.outcome() == FormulaPuzzle.Outcome.STABILIZED ? p.finishedAt() : Long.MAX_VALUE;
    }
}
