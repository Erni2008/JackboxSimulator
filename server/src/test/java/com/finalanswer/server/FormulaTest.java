package com.finalanswer.server;

import com.erni.finalanswer.gameplay.elevator.*;
import com.erni.finalanswer.gameplay.elevator.Formula.*;
import com.erni.finalanswer.gameplay.elevator.FormulaPuzzle.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static com.erni.finalanswer.gameplay.elevator.Formula.Reagent.*;

/** THE UNSTABLE FORMULA — journal rules and laboratory behaviour. */
class FormulaTest {
    long seq = 0;
    static Sample sample(Family f, int cls, Reaction r, Polarity p, Concentration c, Reagent unstable) { return new Sample("X-47A", f, cls, r, p, c, unstable); }
    void act(FormulaPuzzle p, Action a, Reagent r, long t) { assertTrue(p.apply(a, r, seq++, t), a + " " + r + " accepted"); }
    void pour(FormulaPuzzle p, long t, Reagent... rs) { for (Reagent r : rs) { t = Math.max(t, p.busyUntil() - p.startedAt()); act(p, Action.DISPENSE, r, t); } }

    @Test void journalSpreadOneFamilyAndClass() {
        Map<String, Reagent> expect = Map.of("LUNAR1", AZURE, "LUNAR2", VIOLET, "SOLAR1", CRIMSON, "SOLAR2", AMBER, "CRYSTAL1", VERDANT, "CRYSTAL2", AZURE, "ORGANIC1", AMBER, "ORGANIC2", VERDANT);
        for (Family f : Family.values()) for (int c = 1; c <= 2; c++) assertEquals(expect.get(f.name() + c), Formula.base(f, c));
        assertEquals(List.of("☾", "☀", "◆", "✚"), Arrays.stream(Family.values()).map(f -> f.symbol).toList());
    }
    @Test void journalSpreadTwoAdditivesAndIncompatibles() {
        Reagent[][] t = {{AZURE, AMBER, VIOLET}, {CRIMSON, VERDANT, VIOLET}, {CRIMSON, AZURE, AMBER}, {AZURE, VERDANT, VIOLET}, {CRIMSON, VERDANT, AMBER}};
        for (Reagent b : Reagent.values()) for (Reaction r : Reaction.values()) { Reagent a = Formula.additive(b, r); assertEquals(t[b.ordinal()][r.ordinal()], a); assertNotEquals(b, a); assertTrue(Formula.compatible(b, a)); }
        assertEquals(VERDANT, Formula.incompatible(CRIMSON)); assertEquals(AMBER, Formula.incompatible(AZURE)); assertEquals(VIOLET, Formula.incompatible(VERDANT)); assertEquals(CRIMSON, Formula.incompatible(AMBER)); assertEquals(AZURE, Formula.incompatible(VIOLET));
        assertFalse(Formula.compatible(CRIMSON, VERDANT)); assertFalse(Formula.compatible(CRIMSON, CRIMSON));
    }
    @Test void journalSpreadThreeOrderAndDoses() {
        var neg = Formula.solve(sample(Family.LUNAR, 2, Reaction.B, Polarity.NEGATIVE, Concentration.HIGH, null)); // spec example
        assertEquals(VIOLET, neg.base()); assertEquals(VERDANT, neg.additive()); assertEquals(List.of(VERDANT, VERDANT, VERDANT, VIOLET), neg.sequence());
        assertEquals(List.of(VIOLET, VIOLET, VERDANT), Formula.solve(sample(Family.LUNAR, 2, Reaction.B, Polarity.POSITIVE, Concentration.LOW, null)).sequence());
        assertEquals(List.of(VERDANT, VERDANT, VIOLET, VIOLET), Formula.solve(sample(Family.LUNAR, 2, Reaction.B, Polarity.NEGATIVE, Concentration.MEDIUM, null)).sequence());
        assertEquals(List.of(VIOLET, VERDANT, VERDANT, VERDANT), Formula.solve(sample(Family.LUNAR, 2, Reaction.B, Polarity.POSITIVE, Concentration.HIGH, null)).sequence());
    }
    @Test void correctSequenceAndInjectSucceedAndStopTheTimer() {
        var p = new FormulaPuzzle(sample(Family.SOLAR, 1, Reaction.A, Polarity.POSITIVE, Concentration.LOW, null), 0); // CRIMSON x2, AZURE x1
        pour(p, 5000, CRIMSON, CRIMSON, AZURE); act(p, Action.INJECT, null, p.busyUntil());
        assertEquals(Outcome.STABILIZED, p.outcome()); assertTrue(p.finishedAt() < 10_000); p.advance(60_000); assertEquals(Outcome.STABILIZED, p.outcome(), "timer stopped");
        assertFalse(p.apply(Action.INJECT, null, seq++, 61_000), "duplicate INJECT ignored after success");
    }
    @Test void wrongOrderWrongDoseAndIncompatibleAreRejectedDrainedAndRetryable() {
        var s = sample(Family.SOLAR, 1, Reaction.A, Polarity.POSITIVE, Concentration.LOW, null);
        for (Reagent[] wrong : new Reagent[][]{{AZURE, CRIMSON, CRIMSON}, {CRIMSON, AZURE, CRIMSON}, {CRIMSON, CRIMSON}, {CRIMSON, CRIMSON, AZURE, AZURE}, {CRIMSON, CRIMSON, VERDANT}}) {
            var p = new FormulaPuzzle(s, 0); pour(p, 1000, wrong); long t = p.busyUntil(); act(p, Action.INJECT, null, t);
            assertEquals(Outcome.RUNNING, p.outcome()); assertEquals("REJECTED", p.lastEvent().type()); assertTrue(p.draining());
            assertFalse(p.apply(Action.DISPENSE, CRIMSON, seq++, t + 100), "no dosing while draining");
            p.advance(t + FormulaPuzzle.DRAIN_MS); assertTrue(p.doses().isEmpty(), "rejected mixture drained"); assertEquals(1, p.rejections());
            pour(p, t + FormulaPuzzle.DRAIN_MS, CRIMSON, CRIMSON, AZURE); act(p, Action.INJECT, null, p.busyUntil()); assertEquals(Outcome.STABILIZED, p.outcome(), "retry works");
        }
        var empty = new FormulaPuzzle(s, 0); act(empty, Action.INJECT, null, 0); assertEquals("EMPTY", empty.lastEvent().reason());
    }
    @Test void unstableReagentNeedsTheCoolingLock() {
        var s = sample(Family.SOLAR, 1, Reaction.A, Polarity.POSITIVE, Concentration.LOW, AZURE);
        var p = new FormulaPuzzle(s, 0); pour(p, 0, CRIMSON, CRIMSON); long t = p.busyUntil(); act(p, Action.DISPENSE, AZURE, t);
        assertEquals("REJECTED", p.lastEvent().type()); assertEquals("UNSTABLE_UNPROTECTED", p.lastEvent().reason()); p.advance(t + FormulaPuzzle.DRAIN_MS); assertTrue(p.doses().isEmpty());
        act(p, Action.LOCK_ON, null, t + FormulaPuzzle.DRAIN_MS); assertTrue(p.lock()); pour(p, t + FormulaPuzzle.DRAIN_MS, CRIMSON, CRIMSON, AZURE); act(p, Action.INJECT, null, p.busyUntil());
        assertEquals(Outcome.STABILIZED, p.outcome());
    }
    @Test void dispenserLockPreventsOverlappingDoses() {
        var p = new FormulaPuzzle(sample(Family.SOLAR, 1, Reaction.A, Polarity.POSITIVE, Concentration.LOW, null), 0);
        act(p, Action.DISPENSE, CRIMSON, 1000); assertFalse(p.apply(Action.DISPENSE, CRIMSON, seq++, 1000 + FormulaPuzzle.DOSE_MS - 10), "busy");
        assertFalse(p.apply(Action.INJECT, null, seq++, 1200), "cannot inject mid-dose"); assertEquals(1, p.doses().size());
        assertTrue(p.apply(Action.DISPENSE, CRIMSON, 77, 1000 + FormulaPuzzle.DOSE_MS)); assertFalse(p.apply(Action.DISPENSE, CRIMSON, 77, 3000), "duplicate seq"); assertEquals(2, p.doses().size());
    }
    @Test void timerExpiryFails() {
        var p = new FormulaPuzzle(sample(Family.SOLAR, 1, Reaction.A, Polarity.POSITIVE, Concentration.LOW, null), 1000);
        p.advance(45_999); assertEquals(Outcome.RUNNING, p.outcome()); assertTrue(p.advance(46_000)); assertEquals(Outcome.FAILED, p.outcome()); assertEquals("TIMEOUT", p.failReason());
        assertFalse(p.apply(Action.INJECT, null, seq++, 47_000));
    }
    @Test void fiveThousandGeneratedSamplesHaveOneRecipePreparableInTime() {
        int[] families = new int[4]; int unstable = 0; long slowest = 0; Set<String> seen = new HashSet<>();
        for (long seed = 1; seed <= 5000; seed++) {
            var s = FormulaGenerator.generate(seed); var r = Formula.solve(s);
            assertNotEquals(r.base(), r.additive()); assertTrue(Formula.compatible(r.base(), r.additive()), "compatible");
            assertTrue(r.sequence().size() >= 3 && r.sequence().size() <= 4, "size");
            // exactly one sequence passes INJECT among every arrangement of the two reagents (up to 4 doses)
            int accepted = 0; for (List<Reagent> cand : arrangements(r.base(), r.additive())) { var p = new FormulaPuzzle(s, 0); if (s.unstable() != null) p.apply(Action.LOCK_ON, null, 0, 0); long t = 0, q = 1; for (Reagent d : cand) { t = Math.max(t, p.busyUntil()); p.apply(Action.DISPENSE, d, q++, t); } p.apply(Action.INJECT, null, q, Math.max(t, p.busyUntil())); if (p.outcome() == Outcome.STABILIZED) accepted++; }
            assertEquals(1, accepted, "exactly one recipe for seed " + seed);
            long t = FormulaGenerator.solveTime(s, 12_000, 400); assertTrue(t <= 35_000, "time " + t); slowest = Math.max(slowest, t); assertTrue(FormulaGenerator.solveTime(s, 25_000, 900) <= FormulaPuzzle.LIMIT_MS, "slow reader in time");
            families[s.family().ordinal()]++; if (s.unstable() != null) unstable++; seen.add(s.family() + "" + s.cls() + s.reaction() + s.polarity() + s.concentration());
        }
        for (int f : families) assertTrue(f > 1000, "family " + f); assertTrue(unstable > 1500 && unstable < 2500, "unstable " + unstable); assertEquals(4 * 2 * 3 * 2 * 3, seen.size(), "every combination generated");
        System.out.printf("unstable formula: 5000 samples, one recipe each, all %d combinations seen, unstable %d, slowest scripted %.1f s%n", seen.size(), unstable, slowest / 1000.0);
    }
    static List<List<Reagent>> arrangements(Reagent a, Reagent b) { List<List<Reagent>> out = new ArrayList<>(); for (int n = 1; n <= 4; n++) for (int m = 0; m < (1 << n); m++) { List<Reagent> l = new ArrayList<>(); for (int i = 0; i < n; i++) l.add((m >> i & 1) == 1 ? a : b); out.add(l); } return out; }
}
