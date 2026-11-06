package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * THE HOST'S SUITCASE — mechanism III, X-RAY INSPECTION (fictional). Sealed canisters, alike outside; inside each a
 * core (BALL, COIL or ROD), 0–2 needles and maybe a collar RING. The bay is stamped with a letter; chapter III shows
 * the dangerous structure for each letter. Exactly one canister matches. On HARD at least two decoys differ from it
 * by a single feature (no pixel hunting: every difference is a whole part).
 */
public final class XrayCans {
    public enum Core { BALL, COIL, ROD }
    public record Inside(Core core, int needles, boolean ring) {}
    /** stamp letter → dangerous structure (chapter III) */
    public static final Map<String, Inside> TABLE = new LinkedHashMap<>();
    static { TABLE.put("Α", new Inside(Core.BALL, 2, false)); TABLE.put("Β", new Inside(Core.COIL, 1, true)); TABLE.put("Γ", new Inside(Core.ROD, 2, true));
        TABLE.put("Δ", new Inside(Core.BALL, 1, true)); TABLE.put("Ε", new Inside(Core.COIL, 2, false)); TABLE.put("Ζ", new Inside(Core.ROD, 1, false)); }
    public final String stamp; public final List<Inside> cans; private final int solution;
    private XrayCans(String stamp, List<Inside> cans) { this.stamp = stamp; this.cans = List.copyOf(cans); this.solution = cans.indexOf(TABLE.get(stamp)); }
    public static int count(Difficulty d) { return switch (d) { case EASY -> 4; case NORMAL -> 5; case HARD -> 6; }; }
    public static int diff(Inside a, Inside b) { return (a.core() != b.core() ? 1 : 0) + (a.needles() != b.needles() ? 1 : 0) + (a.ring() != b.ring() ? 1 : 0); }

    public static XrayCans generate(long seed, Difficulty d) {
        Random r = new Random(seed ^ 0x7A11L); List<String> keys = new ArrayList<>(TABLE.keySet()); String stamp = keys.get(r.nextInt(keys.size())); Inside bad = TABLE.get(stamp);
        int k = count(d), near = d == Difficulty.HARD ? 2 : d == Difficulty.NORMAL ? 1 : 0;
        List<Inside> all = new ArrayList<>(); for (Core c : Core.values()) for (int n = 0; n <= 2; n++) for (boolean g : new boolean[]{false, true}) all.add(new Inside(c, n, g));
        List<Inside> ones = new ArrayList<>(), far = new ArrayList<>(); for (Inside x : all) { int df = diff(x, bad); if (df == 1) ones.add(x); else if (df >= 2) far.add(x); }
        Collections.shuffle(ones, r); Collections.shuffle(far, r);
        List<Inside> cans = new ArrayList<>(); cans.add(bad); cans.addAll(ones.subList(0, near)); for (Inside x : far) { if (cans.size() >= k) break; cans.add(x); }
        Collections.shuffle(cans, r); return new XrayCans(stamp, cans);
    }
    public int solution() { return solution; }
}
