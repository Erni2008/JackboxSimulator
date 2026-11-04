package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * THE UNSTABLE FORMULA — the rules printed in THE ALCHEMIST'S JOURNAL, as pure data + functions (fictional reagents).
 * Stage 1: FAMILY + CLASS -> base. Stage 2: base + REACTION -> additive. Stage 3: POLARITY -> order.
 * Stage 4: CONCENTRATION -> doses. Unstable reagent -> COOLING LOCK on before dispensing it.
 */
public final class Formula {
    private Formula() {}

    public enum Reagent { CRIMSON, AZURE, VERDANT, AMBER, VIOLET }
    public enum Family { LUNAR("☾"), SOLAR("☀"), CRYSTAL("◆"), ORGANIC("✚"); public final String symbol; Family(String s) { symbol = s; } }
    public enum Reaction { A, B, C }
    public enum Polarity { POSITIVE, NEGATIVE }
    public enum Concentration { LOW, MEDIUM, HIGH }

    /** journal spread 1: [family][class-1] */
    static final Reagent[][] BASE = {
        {Reagent.AZURE, Reagent.VIOLET},     // LUNAR
        {Reagent.CRIMSON, Reagent.AMBER},    // SOLAR
        {Reagent.VERDANT, Reagent.AZURE},    // CRYSTAL
        {Reagent.AMBER, Reagent.VERDANT},    // ORGANIC
    };
    /** journal spread 2: [base][reaction] */
    static final Reagent[][] ADDITIVE = {
        {Reagent.AZURE, Reagent.AMBER, Reagent.VIOLET},     // CRIMSON
        {Reagent.CRIMSON, Reagent.VERDANT, Reagent.VIOLET}, // AZURE
        {Reagent.CRIMSON, Reagent.AZURE, Reagent.AMBER},    // VERDANT
        {Reagent.AZURE, Reagent.VERDANT, Reagent.VIOLET},   // AMBER
        {Reagent.CRIMSON, Reagent.VERDANT, Reagent.AMBER},  // VIOLET
    };
    /** journal spread 3: [concentration] = {base doses, additive doses} */
    static final int[][] DOSES = {{2, 1}, {2, 2}, {1, 3}};

    public static Reagent base(Family f, int cls) { if (cls != 1 && cls != 2) throw new IllegalArgumentException("class"); return BASE[f.ordinal()][cls - 1]; }
    public static Reagent additive(Reagent base, Reaction r) { return ADDITIVE[base.ordinal()][r.ordinal()]; }
    /** the one reagent a base may never take (marked ✕ in the journal): the only one missing from its row */
    public static Reagent incompatible(Reagent base) {
        EnumSet<Reagent> left = EnumSet.allOf(Reagent.class); left.remove(base); left.removeAll(Arrays.asList(ADDITIVE[base.ordinal()])); return left.iterator().next();
    }
    /** journal rule (per base row): the base may take any other reagent except the one marked ✕ */
    public static boolean compatible(Reagent base, Reagent additive) { return base != additive && incompatible(base) != additive; }

    public record Sample(String id, Family family, int cls, Reaction reaction, Polarity polarity, Concentration concentration, Reagent unstable) {}
    public record Recipe(Reagent base, Reagent additive, List<Reagent> sequence, Reagent unstable) {}

    /** the unique recipe the journal yields for a sample */
    public static Recipe solve(Sample s) {
        Reagent base = base(s.family(), s.cls()), add = additive(base, s.reaction());
        int[] d = DOSES[s.concentration().ordinal()];
        List<Reagent> seq = new ArrayList<>(); Reagent first = s.polarity() == Polarity.POSITIVE ? base : add, second = first == base ? add : base;
        int nFirst = first == base ? d[0] : d[1], nSecond = first == base ? d[1] : d[0];
        for (int i = 0; i < nFirst; i++) seq.add(first); for (int i = 0; i < nSecond; i++) seq.add(second);
        return new Recipe(base, add, List.copyOf(seq), s.unstable());
    }
}
