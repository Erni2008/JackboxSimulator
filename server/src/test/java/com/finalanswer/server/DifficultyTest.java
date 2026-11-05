package com.finalanswer.server;

import static org.junit.jupiter.api.Assertions.*;
import com.erni.finalanswer.gameplay.elevator.*;
import org.junit.jupiter.api.Test;

class DifficultyTest {
    @Test void everyDifficultyGeneratesSolvableMachines() {
        for (Difficulty d : Difficulty.values()) for (long seed = 1; seed <= 600; seed++) {
            var c = PressureGenerator.generate(seed, d);
            assertTrue(PressureGenerator.solveTime(c, 1_000, 4_000, d.pressureMs) <= d.pressureMs, d + " slow player in time, seed " + seed);
            if (d == Difficulty.EASY) { assertNull(c.second()); assertFalse(c.noise()); assertTrue(c.surgeAt() < 0); }
            if (d == Difficulty.HARD) { assertNotNull(c.second()); assertTrue(c.noise()); assertTrue(c.surgeAt() >= 12_000); }
            var s = FormulaGenerator.generate(seed, d);
            if (d == Difficulty.EASY) assertNull(s.unstable());
        }
    }
    @Test void timersFollowTheDifficulty() {
        var c = PressureGenerator.generate(3, Difficulty.HARD); var p = new PressurePuzzle(c, 1_000, Difficulty.HARD.pressureMs);
        assertEquals(1_000 + 35_000, p.deadline()); p.advance(1_000 + 35_000); assertEquals(PressurePuzzle.Outcome.FAILED, p.outcome());
        var f = new FormulaPuzzle(FormulaGenerator.generate(3, Difficulty.EASY), 0, Difficulty.EASY.formulaMs);
        f.advance(50_000); assertEquals(FormulaPuzzle.Outcome.RUNNING, f.outcome()); f.advance(60_000); assertEquals(FormulaPuzzle.Outcome.FAILED, f.outcome());
        assertEquals(Difficulty.NORMAL, Difficulty.parse("bogus")); assertEquals(Difficulty.HARD, Difficulty.parse("hard"));
    }
}
