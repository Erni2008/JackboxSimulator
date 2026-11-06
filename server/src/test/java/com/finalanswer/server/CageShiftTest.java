package com.finalanswer.server;

import com.erni.finalanswer.gameplay.elevator.*;
import com.erni.finalanswer.gameplay.elevator.CageShift.*;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

/** THE HELL CAGE balance and round flow. */
class CageShiftTest {
    long t;
    CageShift shift(String... ids) { t = 0; return new CageShift(Difficulty.NORMAL, List.of(ids), 7, t); }
    void run(CageShift s, long ms) { for (long k = 0; k < ms; k += 25) s.advance(t += 25); }
    void toRound(CageShift s, int r) { for (int i = 0; i < 400_000 && !(s.phase() == Phase.ROUND && s.round() == r); i++) s.advance(t += 25); assertEquals(Phase.ROUND, s.phase(), "reached round " + r); }

    @Test void threeDistinctMachinesFromThePool() {
        var s = shift("a"); assertEquals(3, s.kinds.size()); assertEquals(3, new HashSet<>(s.kinds).size()); assertTrue(CageShift.POOL.containsAll(s.kinds)); assertEquals(Difficulty.NORMAL.bombMs, CageShift.limitFor(Difficulty.NORMAL, "bomb"));
        assertEquals(Phase.INTRO, s.phase()); toRound(s, 0); assertFalse(s.kind().isEmpty());
    }
    @Test void cagesSinkOnlyWhileBrokenAndStopWhenRepaired() {
        var s = shift("a", "b"); toRound(s, 0); double h0 = s.cages.get("a").height;
        run(s, s.roundLimit() / 2); assertEquals(h0 - 7.5, s.cages.get("a").height, .3, "half a round = 7.5 m");
        assertTrue(s.report("a", s.kind(), true, t)); double held = s.cages.get("a").height;
        run(s, 3000); assertEquals(held, s.cages.get("a").height, 1e-9, "repaired cage holds");
        assertTrue(s.cages.get("b").height < held, "the other keeps sinking");
        assertTrue(s.report("b", s.kind(), true, t)); assertEquals(Phase.BREAK, s.phase(), "everyone done ends the round");
        double hb = s.cages.get("a").height; toRound(s, 1); run(s, 2000); assertTrue(s.cages.get("a").height < hb, "round 2 starts the descent again");
    }
    @Test void firstFailureIsSurvivableEvenWithSlowRepairs() {
        var s = shift("a"); for (int r = 0; r < 3; r++) { toRound(s, r); if (r == 0) assertTrue(s.report("a", s.kind(), false, t)); else { run(s, s.roundLimit() - 300); assertTrue(s.report("a", s.kind(), true, t)); } }
        var c = s.cages.get("a"); assertFalse(c.dead); assertTrue(c.height > 25 && c.height < 35, "about 30 m left: " + c.height);
    }
    @Test void secondFailureNearlyAlwaysKillsAndThirdAlways() {
        int died = 0, trials = 20;
        for (int k = 0; k < trials; k++) { var s = shift("a", "b"); toRound(s, 0); s.report("a", s.kind(), false, t); s.report("b", s.kind(), true, t);
            toRound(s, 1); run(s, (long) (s.roundLimit() * (k + .5) / trials)); s.report("a", s.kind(), false, t); s.report("b", s.kind(), true, t); run(s, 100); if (s.cages.get("a").dead) died++; }
        assertTrue(died >= 16 && died < trials, "2nd failure kills about 9 in 10: " + died + "/" + trials);
        var s = shift("a"); toRound(s, 0); var c = s.cages.get("a"); c.fails = 2; c.height = 99; s.report("a", s.kind(), false, t);
        assertTrue(c.dead, "3rd failure is instant death"); assertEquals(0, c.height);
    }
    @Test void timeoutCountsAsFailureAndShiftEnds() {
        var s = shift("a"); toRound(s, 0); run(s, s.roundLimit() + CageShift.GRACE_MS + 50); assertEquals(1, s.cages.get("a").fails); assertEquals(Phase.BREAK, s.phase());
        toRound(s, 1); s.report("a", s.kind(), true, t); toRound(s, 2); s.report("a", s.kind(), true, t); run(s, 100); assertEquals(Phase.END, s.phase());
        assertFalse(s.report("a", "wire", true, t), "nothing counts after the end");
    }
}
