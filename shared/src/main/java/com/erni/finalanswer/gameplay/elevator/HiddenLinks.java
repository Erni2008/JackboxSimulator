package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * THE HOST'S SUITCASE — mechanism II, HIDDEN CONNECTIONS (fictional, invented for the game).
 *
 * <p>Two rows of brass contacts: letters on top (A, B, …), numbers below (1, 2, …). Under the panel each letter is
 * linked to exactly one number through one part: a JUMPER (reads 0.00), a RESISTOR (reads its value, e.g. 4.7k) or
 * a DIODE (reads 0.62▶ only when the red probe is on its conducting side, OL the other way). Unlinked pairs read OL.
 * The graph never leaves the server; the tester reading for a probe pair is computed here.
 *
 * <p>Chapter II: EASY — the firing link is the only diode. NORMAL — of the two diodes, the one conducting from the
 * NUMBER to the LETTER. HARD — of the three diodes, among those conducting number→letter, the one with the LARGER
 * number. The generator guarantees exactly one answer.
 */
public final class HiddenLinks {
    public enum Part { JUMPER, RESISTOR, DIODE }
    public final int n; public final Difficulty difficulty;
    /** per letter i: partner number (0-based), part, resistor value (tenths of k), diode conducts letter→number? */
    final int[] partner; final Part[] part; final int[] tenths; final boolean[] toNumber; private final int solution;

    private HiddenLinks(int n, Difficulty d, int[] partner, Part[] part, int[] tenths, boolean[] toNumber) { this.n = n; this.difficulty = d; this.partner = partner; this.part = part; this.tenths = tenths; this.toNumber = toNumber; this.solution = solve(this); }
    public static int pairs(Difficulty d) { return switch (d) { case EASY -> 4; case NORMAL -> 5; case HARD -> 6; }; }

    public static HiddenLinks generate(long seed, Difficulty d) {
        Random r = new Random(seed ^ 0x11D0E5L); int n = pairs(d), diodes = d == Difficulty.EASY ? 1 : d == Difficulty.NORMAL ? 2 : 3;
        while (true) {
            List<Integer> p = new ArrayList<>(); for (int i = 0; i < n; i++) p.add(i); Collections.shuffle(p, r); int[] partner = p.stream().mapToInt(Integer::intValue).toArray();
            Part[] part = new Part[n]; int[] tenths = new int[n]; boolean[] dir = new boolean[n];
            List<Integer> idx = new ArrayList<>(p); Collections.shuffle(idx, r);
            for (int k = 0; k < n; k++) { int i = idx.get(k); if (k < diodes) { part[i] = Part.DIODE; dir[i] = r.nextBoolean(); } else if (r.nextInt(3) == 0) part[i] = Part.JUMPER; else { part[i] = Part.RESISTOR; tenths[i] = 10 + r.nextInt(82); } }
            // the shape each difficulty needs: normal = one diode each way; hard = two number→letter, one letter→number
            long back = idx.subList(0, diodes).stream().filter(i -> !dir[i]).count();
            if (d == Difficulty.NORMAL && back != 1) continue; if (d == Difficulty.HARD && back != 2) continue;
            return new HiddenLinks(n, d, partner, part, tenths, dir);
        }
    }
    static int solve(HiddenLinks h) {
        int best = -1;
        for (int i = 0; i < h.n; i++) { if (h.part[i] != Part.DIODE) continue;
            if (h.difficulty == Difficulty.EASY) return i;
            if (h.toNumber[i]) continue; // conducts letter→number: not the one
            if (h.difficulty == Difficulty.NORMAL) return i;
            if (best < 0 || h.partner[i] > h.partner[best]) best = i; }
        return best;
    }
    /** contact ids: letters 0..n-1, numbers n..2n-1 */
    public String read(int red, int black) {
        if (red == black || red < 0 || black < 0 || red >= 2 * n || black >= 2 * n) return "—";
        boolean redLetter = red < n; int letter = redLetter ? red : black, number = (redLetter ? black : red) - n;
        if ((red < n) == (black < n) || partner[letter] != number) return "OL";
        return switch (part[letter]) { case JUMPER -> "0.00"; case RESISTOR -> (tenths[letter] / 10) + "." + (tenths[letter] % 10) + "k"; case DIODE -> toNumber[letter] == redLetter ? "0.62▶" : "OL"; };
    }
    /** true when the two contacts are the firing link (either probe order) */
    public boolean isFiring(int a, int b) { int letter = Math.min(a, b), number = Math.max(a, b) - n; return letter >= 0 && letter < n && number >= 0 && number < n && letter == solution && partner[letter] == number; }
    public int solutionLetter() { return solution; }
    public int solutionNumber() { return partner[solution]; }
}
