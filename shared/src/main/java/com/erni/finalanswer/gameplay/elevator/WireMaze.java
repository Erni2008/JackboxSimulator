package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * THE HOST'S SUITCASE — mechanism I, WIRE MAZE (fictional, invented for the game).
 *
 * <p>A round panel: N start terminals along the top arc, each marked with a Greek letter; N end terminals along the
 * bottom arc numbered 1..N (left to right). Every wire runs from one start to one end through two bends, so the wires
 * cross many times; each wire lies on its own layer (a wire passing over another never touches it). The hub carries a
 * seal. The notebook (chapter I) says:
 * <ol>
 *   <li>the seal names a letter (CIRCLE→Θ, TRIANGLE→Δ, …); the firing wire is the one leaving that letter;</li>
 *   <li>(NORMAL, HARD) if that wire lands on a terminal whose number is a multiple of 3, the firing wire is instead the
 *       one that lands on the next terminal (number + 1).</li>
 * </ol>
 * Exactly one wire satisfies the rules — the generator guarantees it. Geometry is in panel units (radius 1).
 */
public final class WireMaze {
    public static final String[] LETTERS = {"Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Θ", "Λ", "Ξ", "Π", "Σ", "Φ", "Ψ", "Ω"};
    public enum Seal { CIRCLE("Θ"), TRIANGLE("Δ"), SQUARE("Π"), DIAMOND("Ξ"), CROSS("Φ"), STAR("Σ"), CRESCENT("Λ"), HEXAGON("Ω"); public final String letter; Seal(String l) { letter = l; } }

    public final int n; public final boolean redirect; public final Seal seal;
    /** per start slot (left to right): its letter, the end terminal number it lands on, colour index, layer (0 = bottom), bends (x1,y1,x2,y2) */
    public final List<String> letters; public final int[] end, color, layer; public final double[][] bends;
    private final int solution;

    private WireMaze(int n, boolean redirect, Seal seal, List<String> letters, int[] end, int[] color, int[] layer, double[][] bends) {
        this.n = n; this.redirect = redirect; this.seal = seal; this.letters = List.copyOf(letters); this.end = end; this.color = color; this.layer = layer; this.bends = bends; this.solution = solve(this);
    }
    public static int wires(Difficulty d) { return switch (d) { case EASY -> 10; case NORMAL -> 12; case HARD -> 14; }; }
    public static int colours(Difficulty d) { return switch (d) { case EASY -> 6; case NORMAL -> 5; case HARD -> 4; }; }

    public static WireMaze generate(long seed, Difficulty d) {
        Random r = new Random(seed ^ 0x3A11E5L); int n = wires(d); boolean redirect = d != Difficulty.EASY;
        Seal seal = Seal.values()[r.nextInt(Seal.values().length)];
        // letters: the seal's letter plus n-1 others, shuffled across the slots
        List<String> pool = new ArrayList<>(Arrays.asList(LETTERS)); pool.remove(seal.letter); Collections.shuffle(pool, r);
        List<String> letters = new ArrayList<>(pool.subList(0, n - 1)); letters.add(seal.letter); Collections.shuffle(letters, r);
        int key = letters.indexOf(seal.letter);
        // half the time (when the rule exists) the key wire lands on a multiple of 3 so rule 2 really matters
        boolean wantRedirect = redirect && r.nextBoolean();
        int[] end; while (true) { List<Integer> e = new ArrayList<>(); for (int i = 1; i <= n; i++) e.add(i); Collections.shuffle(e, r); end = e.stream().mapToInt(Integer::intValue).toArray();
            int k = end[key]; boolean m3 = k % 3 == 0; if (redirect && m3 && k + 1 > n) continue; if (redirect && m3 != wantRedirect) continue;
            // no wire runs straight down to the slot right under it: every path has to be traced
            if (Math.abs(slotX(key, n) - endX(end[key], n)) < .12) continue; break; }
        int cols = colours(d); int[] color = new int[n]; for (int i = 0; i < n; i++) color[i] = r.nextInt(cols);
        // the key wire and the redirect target never have a colour of their own (no shortcut by colour)
        List<Integer> lay = new ArrayList<>(); for (int i = 0; i < n; i++) lay.add(i); Collections.shuffle(lay, r); int[] layer = lay.stream().mapToInt(Integer::intValue).toArray();
        double[][] bends = new double[n][4];
        for (int i = 0; i < n; i++) for (int b = 0; b < 2; b++) { double a = r.nextDouble() * Math.PI * 2, rad = .18 + Math.sqrt(r.nextDouble()) * .5; bends[i][b * 2] = Math.cos(a) * rad; bends[i][b * 2 + 1] = Math.sin(a) * rad * .8; }
        WireMaze m = new WireMaze(n, redirect, seal, letters, end, color, layer, bends);
        for (int i = 0; i < n; i++) if (i != m.solution && m.color[i] == m.color[m.solution]) return m; // another wire shares the firing wire's colour
        int other = (m.solution + 1) % n; m.color[other] = m.color[m.solution]; return m;
    }
    static double slotX(int slot, int n) { return Math.cos(Math.toRadians(150 - slot * 120.0 / (n - 1))); }
    static double endX(int number, int n) { return Math.cos(Math.toRadians(210 + (number - 1) * 120.0 / (n - 1))); }

    /** the notebook's rules, applied to a layout */
    static int solve(WireMaze m) {
        int s = m.letters.indexOf(m.seal.letter), e = m.end[s];
        if (m.redirect && e % 3 == 0) for (int i = 0; i < m.n; i++) if (m.end[i] == e + 1) return i;
        return s;
    }
    /** the start slot of the firing wire (server only) */
    public int solution() { return solution; }
}
