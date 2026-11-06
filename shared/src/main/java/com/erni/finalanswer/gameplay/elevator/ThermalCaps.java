package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * THE HOST'S SUITCASE — mechanism V, THERMAL THREAT (fictional). Six sealed capsules numbered 1–6, each with a
 * temperature, a heat pattern and an engraved symbol. The bay carries a seal; chapter V's table gives, for that seal,
 * the dangerous pattern and temperature band. EASY: exactly one capsule fits. NORMAL/HARD: two fit — the dangerous one
 * is the one whose symbol is ANGULAR (round symbols: circle, crescent). The hottest capsule is never the answer.
 */
public final class ThermalCaps {
    public enum Pattern { CENTER, TWO, RING, COLD_CENTER, ASYM }
    public record Cap(int temp, Pattern pattern, WireMaze.Seal symbol) {}
    public record Sig(Pattern pattern, int lo, int hi) {}
    public static final Map<WireMaze.Seal, Sig> TABLE = new EnumMap<>(WireMaze.Seal.class);
    static { TABLE.put(WireMaze.Seal.CIRCLE, new Sig(Pattern.CENTER, 56, 70)); TABLE.put(WireMaze.Seal.TRIANGLE, new Sig(Pattern.TWO, 40, 55)); TABLE.put(WireMaze.Seal.SQUARE, new Sig(Pattern.RING, 71, 85));
        TABLE.put(WireMaze.Seal.DIAMOND, new Sig(Pattern.COLD_CENTER, 56, 70)); TABLE.put(WireMaze.Seal.CROSS, new Sig(Pattern.ASYM, 40, 55)); TABLE.put(WireMaze.Seal.STAR, new Sig(Pattern.CENTER, 71, 85));
        TABLE.put(WireMaze.Seal.CRESCENT, new Sig(Pattern.RING, 40, 55)); TABLE.put(WireMaze.Seal.HEXAGON, new Sig(Pattern.TWO, 56, 70)); }
    public static boolean round(WireMaze.Seal s) { return s == WireMaze.Seal.CIRCLE || s == WireMaze.Seal.CRESCENT; }
    public final WireMaze.Seal stamp; public final List<Cap> caps; private final int solution;
    private ThermalCaps(WireMaze.Seal stamp, List<Cap> caps, int sol) { this.stamp = stamp; this.caps = List.copyOf(caps); this.solution = sol; }
    static boolean fits(Cap c, Sig s) { return c.pattern() == s.pattern() && c.temp() >= s.lo() && c.temp() <= s.hi(); }

    public static ThermalCaps generate(long seed, Difficulty d) {
        Random r = new Random(seed ^ 0x7E4AL); WireMaze.Seal[] seals = WireMaze.Seal.values(); WireMaze.Seal stamp = seals[r.nextInt(seals.length)]; Sig sig = TABLE.get(stamp);
        List<WireMaze.Seal> angular = new ArrayList<>(), roundS = new ArrayList<>(); for (WireMaze.Seal s : seals) (round(s) ? roundS : angular).add(s);
        while (true) {
            List<Cap> caps = new ArrayList<>(); int inBand = sig.lo() + r.nextInt(sig.hi() - sig.lo() + 1);
            caps.add(new Cap(inBand, sig.pattern(), angular.get(r.nextInt(angular.size())))); // the dangerous one
            if (d != Difficulty.EASY) caps.add(new Cap(sig.lo() + r.nextInt(sig.hi() - sig.lo() + 1), sig.pattern(), roundS.get(r.nextInt(roundS.size())))); // twin, round symbol
            // decoys: right pattern but out of band, right band but wrong pattern, and one very hot capsule
            Pattern[] ps = Pattern.values();
            caps.add(new Cap(r.nextBoolean() ? sig.lo() - 3 - r.nextInt(10) : sig.hi() + 3 + r.nextInt(8), sig.pattern(), seals[r.nextInt(seals.length)]));
            Pattern other; do other = ps[r.nextInt(ps.length)]; while (other == sig.pattern()); caps.add(new Cap(sig.lo() + r.nextInt(sig.hi() - sig.lo() + 1), other, angular.get(r.nextInt(angular.size()))));
            do other = ps[r.nextInt(ps.length)]; while (other == sig.pattern()); caps.add(new Cap(88 + r.nextInt(8), other, seals[r.nextInt(seals.length)]));
            while (caps.size() < 6) { Pattern p = ps[r.nextInt(ps.length)]; int t = 30 + r.nextInt(56); Cap c = new Cap(t, p, seals[r.nextInt(seals.length)]); if (!fits(c, sig)) caps.add(c); }
            Cap bad = caps.get(0); Collections.shuffle(caps, r); int sol = caps.indexOf(bad);
            // validity: exactly the intended matches, the dangerous one not the hottest, the temperatures distinct
            long fit = caps.stream().filter(c -> fits(c, sig)).count(); if (fit != (d == Difficulty.EASY ? 1 : 2)) continue;
            if (caps.stream().filter(c -> fits(c, sig) && !round(c.symbol())).count() != 1) continue;
            int hottest = caps.stream().mapToInt(Cap::temp).max().getAsInt(); if (bad.temp() == hottest) continue;
            if (caps.stream().map(Cap::temp).distinct().count() != caps.size()) continue;
            return new ThermalCaps(stamp, caps, sol);
        }
    }
    public int solution() { return solution; }
}
