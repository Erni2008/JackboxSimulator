package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * АДСКАЯ КЛЕТКА / THE HELL CAGE — one shift, server-authoritative.
 *
 * <p>A shift is {@link #ROUNDS} rounds; each round every player repairs the same machine against one shared timer.
 * The machines are drawn without repeats from {@link #POOL} (designed for five mini-games; the ones that exist today).
 *
 * <p>Balance (start {@link #START_M} m above the lava):
 * <ul>
 *   <li>while a player's machine is not repaired and the round runs, the cage sinks at {@link #ROUND_DESCENT_M} m per full round;</li>
 *   <li>a repaired machine stops the cage until the next round starts;</li>
 *   <li>1st failure (wrong answer, explosion or time out): a hard drop of {@link #FIRST_DROP_M} m — survivable;</li>
 *   <li>2nd failure: the brake lets go down to {@link #SECOND_FLOOR_M} m and the cage keeps sinking until the round ends —
 *       survives only if it happened in the last ~13 % of the round (about 9 in 10 die);</li>
 *   <li>3rd failure: instant death. A cage that reaches 0 m burns.</li>
 * </ul>
 * Worst path with one failure: three slow rounds plus the drop = 100 − 3·15 − 25 = 30 m left.
 */
public final class CageShift {
    public static final String BOMB = "bomb";
    /** the bomb suitcase is the 5th assignment of the pool; it joins the live draw once all five mechanisms are playable */
    public static final boolean BOMB_LIVE = true;
    public static final List<String> POOL = BOMB_LIVE ? List.of("wire", "pressure", "formula", "lock", BOMB) : List.of("wire", "pressure", "formula", "lock");
    public static final List<String> FULL_POOL = List.of("wire", "pressure", "formula", "lock", BOMB);
    public static final int ROUNDS = 3;
    public static final double START_M = 100, ROUND_DESCENT_M = 15, FIRST_DROP_M = 25, SECOND_FLOOR_M = 2;
    public static final long INTRO_MS = 9_000, BREAK_MS = 6_000, GRACE_MS = 2_500;

    public enum Phase { INTRO, ROUND, BREAK, END }
    public enum Outcome { RUNNING, OK, FAIL }

    public static final class Cage {
        public final String id; public double height = START_M; public int fails, repairs; public Outcome outcome = Outcome.RUNNING; public boolean dead; public long deadAt = -1, failAt = -1;
        Cage(String id) { this.id = id; }
    }

    public final Difficulty difficulty; public final List<String> kinds; public final Map<String, Cage> cages = new LinkedHashMap<>();
    private Phase phase = Phase.INTRO; private int round = -1; private long phaseStart, phaseEnd, roundLimit, last;

    public CageShift(Difficulty d, Collection<String> playerIds, long seed, long now) { this(d, playerIds, seed, now, POOL); }
    public CageShift(Difficulty d, Collection<String> playerIds, long seed, long now, List<String> machines) {
        difficulty = d; List<String> pool = new ArrayList<>(machines); Collections.shuffle(pool, new Random(seed)); kinds = List.copyOf(pool.subList(0, Math.min(ROUNDS, pool.size())));
        for (String id : playerIds) cages.put(id, new Cage(id));
        phaseStart = last = now; phaseEnd = now + INTRO_MS;
    }

    public Phase phase() { return phase; }
    public int round() { return round; }
    public String kind() { return round >= 0 && round < kinds.size() ? kinds.get(round) : ""; }
    public long phaseStart() { return phaseStart; }
    public long phaseEnd() { return phaseEnd; }
    /** the machine's own time limit for the current round (the server waits {@link #GRACE_MS} more for late reports) */
    public long roundLimit() { return roundLimit; }
    public static long limitFor(Difficulty d, String kind) { return switch (kind) { case "pressure" -> d.pressureMs; case "formula" -> d.formulaMs; case "lock" -> d.lockMs; case BOMB -> d.bombMs; default -> d.wireMs; }; }
    /** metres per millisecond while a machine is broken */
    double rate() { return ROUND_DESCENT_M / Math.max(1, roundLimit); }

    /** advances time; true when anything visible changed (phase, a death) */
    public boolean advance(long now) {
        boolean changed = false; long dt = Math.max(0, now - last); last = now;
        if (phase == Phase.ROUND) for (Cage c : cages.values()) if (!c.dead && c.outcome != Outcome.OK) { c.height -= rate() * Math.min(dt, Math.max(0, phaseStart + roundLimit - (now - dt)));
            if (c.height <= 0) { kill(c, now); changed = true; } }
        if (phase == Phase.ROUND && (now >= phaseEnd || alive().allMatch(c -> c.outcome != Outcome.RUNNING))) {
            for (Cage c : cages.values()) if (!c.dead && c.outcome == Outcome.RUNNING) fail(c, now); // time ran out
            // a broken machine keeps the cage sinking for the whole round, even when everybody else finished early
            long left = Math.max(0, phaseStart + roundLimit - now);
            for (Cage c : cages.values()) if (!c.dead && c.outcome == Outcome.FAIL) { c.height -= rate() * left; if (c.height <= 0) kill(c, now); }
            next(now, Phase.BREAK); return true;
        }
        if (phase != Phase.ROUND && phase != Phase.END && now >= phaseEnd) {
            if (round + 1 >= kinds.size() || alive().findAny().isEmpty()) next(now, Phase.END);
            else { round++; roundLimit = limitFor(difficulty, kind()); for (Cage c : cages.values()) c.outcome = Outcome.RUNNING; phase = Phase.ROUND; phaseStart = now; phaseEnd = now + roundLimit + GRACE_MS; }
            return true;
        }
        if (phase == Phase.ROUND && alive().findAny().isEmpty()) { next(now, Phase.END); return true; }
        return changed;
    }
    private void next(long now, Phase p) { phase = p; phaseStart = now; phaseEnd = p == Phase.BREAK ? now + BREAK_MS : Long.MAX_VALUE; if (p == Phase.BREAK && (round + 1 >= kinds.size() || alive().findAny().isEmpty())) { phase = Phase.END; phaseEnd = Long.MAX_VALUE; } }
    private java.util.stream.Stream<Cage> alive() { return cages.values().stream().filter(c -> !c.dead); }

    /** a player's machine reported its result for the current round; false when it does not count (wrong round / already resolved) */
    public boolean report(String id, String kind, boolean ok, long now) {
        Cage c = cages.get(id); advance(now);
        if (c == null || c.dead || phase != Phase.ROUND || !kind.equals(kind()) || c.outcome != Outcome.RUNNING) return false;
        if (ok) { c.outcome = Outcome.OK; c.repairs++; } else fail(c, now);
        advance(now); return true;
    }
    private void fail(Cage c, long now) {
        c.outcome = Outcome.FAIL; c.fails++; c.failAt = now;
        if (c.fails == 1) c.height -= FIRST_DROP_M;
        else if (c.fails == 2) c.height = Math.min(c.height - FIRST_DROP_M, SECOND_FLOOR_M);
        else c.height = 0;
        if (c.height <= 0) kill(c, now);
    }
    private void kill(Cage c, long now) { c.height = 0; c.dead = true; c.deadAt = now; }
    public void add(String id) { cages.putIfAbsent(id, new Cage(id)); }
}
