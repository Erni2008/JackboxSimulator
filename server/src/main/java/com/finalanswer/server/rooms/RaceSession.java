package com.finalanswer.server.rooms;

import java.util.*;

/**
 * CURSED RUN — server-authoritative survival rules on top of the client-simulated race.
 * Phones simulate their own runner and report position/checkpoint/finish; the server owns life and death:
 * who is alive at the start (Member.alive), deadlines, the darkness / collapse front, elimination gates,
 * shelter seats, the Life Spark (spawn, single atomic pickup, revival) and the final verdict that is written
 * back into Member.alive for the next mini-games.
 */
final class RaceSession {
    enum Format {DEATH_RUN, DARKNESS, LAST_SURVIVORS, COLLAPSE, LAST_CHANCE, SALVATION}
    /** Tunables (one place, per the brief). */
    static final class Config {
        long limitMs = 150_000, cryptLimitMs = 210_000;
        long frontDelayMs = 10_000; double frontStartZ = -12, frontSpeed0 = 2.6, frontAccel = .035, frontSpeedMax = 4.6; // m/s, runner top speed is 8.2
        long chanceBaseMs = 45_000, chanceBonusMs = 12_000;
        double sparkChance = .25, sparkRadius = 2.2; double sparkLatestFraction = .55;
        double seatsRatio = .6; int[] gateCheckpoints = {2, 4, 6};
    }
    static final Config CFG = new Config();
    static final Set<Format> CRYPT_OK = EnumSet.of(Format.DEATH_RUN, Format.LAST_SURVIVORS, Format.LAST_CHANCE, Format.SALVATION);

    static final class P {
        final String id; final boolean ghostAtStart; boolean alive; String status; String reason = "";
        double x, y, z; int cp = 0, cpMax = 0; boolean finished, revived, online = true; long finishAt, deadline, revivedAt, diedAt; int place;
        P(String id, boolean ghost) {this.id = id; ghostAtStart = ghost; alive = !ghost; status = ghost ? "GHOST" : "RUNNING";}
        boolean aliveRunning() {return alive && status.equals("RUNNING") || alive && status.equals("REVIVED");}
    }

    final Format format; final int map; final long startAt; long limitMs; final Map<String, P> players = new LinkedHashMap<>();
    double[] checkpoints; double finishZ; // course geometry reported by the phones (identical, deterministic from the seed)
    // spark
    boolean sparkPlanned, sparkActive, sparkTaken; int sparkCp = -1; long sparkAt; double sparkZ; String sparkBy = ""; long sparkTakenAt;
    final Set<String> handled = new HashSet<>();
    // elimination / shelter
    int seats, seatsUsed; final int[] quotas = new int[3]; final int[] passed = new int[3]; final boolean[] closed = new boolean[3];
    final List<Map<String, Object>> events = new ArrayList<>(); long eventSeq;
    boolean ended; long endedAt;
    private final Random rnd;

    RaceSession(Format format, int map, long startAt, Collection<Map.Entry<String, Boolean>> roster, Random rnd) {
        this.format = format; this.map = map; this.startAt = startAt; this.rnd = rnd;
        this.limitMs = map == 4 ? CFG.cryptLimitMs : CFG.limitMs;
        for (var e : roster) players.put(e.getKey(), new P(e.getKey(), !e.getValue()));
        int alive = aliveCount();
        seats = Math.max(1, (int) Math.ceil(alive * CFG.seatsRatio)); if (alive <= 1) seats = Math.max(1, alive);
        quotas[0] = Math.max(1, (int) Math.ceil(alive * .75)); quotas[1] = Math.max(1, Math.min(quotas[0] - 1, (int) Math.ceil(alive * .5))); quotas[2] = Math.max(1, Math.min(quotas[1] - 1, (int) Math.ceil(alive * .25)));
        if (format == Format.LAST_CHANCE) for (P p : players.values()) p.deadline = startAt + CFG.chanceBaseMs;
        sparkPlanned = players.values().stream().anyMatch(p -> p.ghostAtStart) && rnd.nextDouble() < CFG.sparkChance;
        if (sparkPlanned) sparkAt = startAt + 15_000 + (long) (rnd.nextDouble() * limitMs * (CFG.sparkLatestFraction - .1));
        event("START", "", Map.of("format", format.name()));
    }
    void qaLimit(long ms) {limitMs = ms; if (format == Format.LAST_CHANCE) for (P p : players.values()) p.deadline = startAt + Math.min(CFG.chanceBaseMs, ms / 2);}
    int aliveCount() {return (int) players.values().stream().filter(p -> p.alive).count();}

    /** Course geometry from the first phone; later reports must match (deterministic generator). */
    void course(double[] cps, double finish) {
        if (checkpoints != null) return;
        if (cps.length < 2 || cps.length > 40 || !(finish > 50 && finish < 2000)) return;
        for (int i = 1; i < cps.length; i++) if (!(cps[i] > cps[i - 1])) return;
        checkpoints = cps; finishZ = finish;
        if (sparkPlanned) { // a safe landing pad (checkpoint) in the first half of the course, never behind a front or a closed gate
            int hi = Math.max(1, Math.min(cps.length - 2, (int) (cps.length * .6)));
            if (format == Format.LAST_SURVIVORS) hi = Math.min(hi, CFG.gateCheckpoints[0] - 1);
            sparkCp = 1 + rnd.nextInt(Math.max(1, hi)); sparkZ = cps[Math.min(sparkCp, cps.length - 1)];
        }
    }

    double frontZ(long now) {
        if (format != Format.DARKNESS && format != Format.COLLAPSE) return -1e9;
        double t = (now - startAt - CFG.frontDelayMs) / 1000.0; if (t <= 0) return CFG.frontStartZ;
        double tMax = (CFG.frontSpeedMax - CFG.frontSpeed0) / CFG.frontAccel;
        double d = t < tMax ? CFG.frontSpeed0 * t + .5 * CFG.frontAccel * t * t : CFG.frontSpeed0 * tMax + .5 * CFG.frontAccel * tMax * tMax + CFG.frontSpeedMax * (t - tMax);
        return CFG.frontStartZ + d;
    }

    /** A phone's own-runner report. */
    boolean report(String id, double[] s, long now) {
        P p = players.get(id); if (p == null || ended || now < startAt) return false;
        p.x = s[0]; p.y = s[1]; p.z = s[2]; int cp = (int) s[5]; boolean changed = false;
        if (cp > p.cpMax) { // checkpoint progress (server time decides the order)
            for (int c = p.cpMax + 1; c <= cp; c++) changed |= reached(p, c, now);
            p.cpMax = cp;
        }
        p.cp = cp;
        if (s[7] > 0 && !p.finished && (p.status.equals("RUNNING") || p.status.equals("REVIVED") || p.status.equals("GHOST"))) changed |= finish(p, now);
        return changed;
    }
    private boolean reached(P p, int c, long now) {
        boolean changed = false;
        if (format == Format.LAST_CHANCE && p.aliveRunning()) {p.deadline += CFG.chanceBonusMs; changed = true;}
        if (format == Format.LAST_SURVIVORS && p.aliveRunning()) for (int g = 0; g < 3; g++) if (CFG.gateCheckpoints[g] == c && !closed[g]) {
            passed[g]++; if (passed[g] >= quotas[g]) {closed[g] = true; changed = true; event("GATE_CLOSED", "", Map.of("gate", g + 1));
                for (P o : players.values()) if (o != p && o.aliveRunning() && o.cpMax < c) kill(o, "GATE", now);}
        }
        return changed;
    }
    private boolean finish(P p, long now) {
        p.finished = true; p.finishAt = now;
        if (!p.alive) {p.status = p.status.equals("GHOST_CAUGHT") ? p.status : "GHOST_FINISHED"; event("GHOST_FINISH", p.id, Map.of()); return true;}
        if (format == Format.SALVATION) {
            if (seatsUsed >= seats) {kill(p, "SEATS", now); return true;}
            seatsUsed++; p.place = seatsUsed; p.status = "SAVED"; event("SAVED", p.id, Map.of("seat", seatsUsed));
            if (seatsUsed >= seats) for (P o : players.values()) if (o.aliveRunning()) kill(o, "SEATS", now);
            return true;
        }
        p.status = "SAVED"; p.place = (int) players.values().stream().filter(o -> o.status.equals("SAVED")).count(); event("SAVED", p.id, Map.of()); return true;
    }
    void kill(P p, String reason, long now) {
        if (!p.alive) return; p.alive = false; p.status = "DEAD"; p.reason = reason; p.diedAt = now; event("DIED", p.id, Map.of("reason", reason));
    }

    /** Ghost touches the spark: validated and applied atomically, once. */
    String pickup(String id, String requestId, long now) {
        if (!handled.add(id + "/" + requestId)) return "DUPLICATE";
        P p = players.get(id);
        if (p == null || ended) return "NO_RACE";
        if (!sparkActive || sparkTaken) return "SPARK_GONE";
        if (p.alive || p.revived || p.status.equals("GHOST_CAUGHT")) return "NOT_A_GHOST";
        if (Math.hypot(p.x, p.z - sparkZ) > CFG.sparkRadius) return "TOO_FAR";
        sparkTaken = true; sparkActive = false; sparkBy = id; sparkTakenAt = now;
        p.alive = true; p.revived = true; p.revivedAt = now; p.status = "REVIVED"; p.finished = false;
        if (format == Format.LAST_CHANCE) p.deadline = now + CFG.chanceBaseMs;
        event("REVIVED", id, Map.of());
        return "OK";
    }

    /** Server clock: fronts, deadlines, spark spawn, end of race. Returns true when anything changed. */
    boolean tick(long now, Set<String> online) {
        if (ended || now < startAt) return false; boolean changed = false;
        for (P p : players.values()) p.online = online.contains(p.id);
        double front = frontZ(now);
        for (P p : players.values()) {
            if (p.finished || p.status.equals("GHOST_CAUGHT") || p.status.equals("DEAD")) continue;
            if (front > -1e8 && p.z < front - .5 && checkpoints != null) {
                if (p.alive) kill(p, format == Format.DARKNESS ? "DARKNESS" : "COLLAPSE", now); else {p.status = "GHOST_CAUGHT"; event("CAUGHT", p.id, Map.of());}
                changed = true;
            }
            if (format == Format.LAST_CHANCE && p.aliveRunning() && now >= p.deadline) {kill(p, "TIME", now); changed = true;}
        }
        // spark: only while a ghost can still use it fairly
        if (sparkPlanned && !sparkActive && !sparkTaken && sparkCp > 0 && now >= sparkAt) {
            boolean ok = players.values().stream().anyMatch(p -> !p.alive && !p.revived && !p.status.equals("GHOST_CAUGHT"));
            if (front > -1e8 && front > sparkZ - 45) ok = false;
            if (format == Format.SALVATION && seats - seatsUsed <= players.values().stream().filter(P::aliveRunning).count()) ok = false;
            if (format == Format.LAST_SURVIVORS && closed[0]) ok = false;
            if (now - startAt > limitMs * CFG.sparkLatestFraction && !Boolean.getBoolean("race.qa")) ok = false;
            if (ok) {sparkActive = true; event("SPARK", "", Map.of("cp", sparkCp)); changed = true;} else sparkPlanned = false;
        }
        boolean timeUp = now - startAt >= limitMs;
        long runningAlive = players.values().stream().filter(P::aliveRunning).count();
        long runningGhosts = players.values().stream().filter(p -> p.status.equals("GHOST") && !p.finished).count();
        if (format == Format.LAST_SURVIVORS && runningAlive == 1 && players.values().stream().anyMatch(p -> p.status.equals("DEAD")) && players.values().stream().noneMatch(p -> p.status.equals("SAVED"))) {
            P last = players.values().stream().filter(P::aliveRunning).findFirst().get(); last.status = "SAVED"; last.place = 1; last.finished = true; last.finishAt = now; event("LAST_SURVIVOR", last.id, Map.of()); changed = true; runningAlive = 0;
        }
        boolean anyAliveAtStart = players.values().stream().anyMatch(p -> !p.ghostAtStart), sparkPossible = sparkActive || (sparkPlanned && !sparkTaken);
        boolean allDone = runningAlive == 0 && (runningGhosts == 0 || (anyAliveAtStart && !sparkPossible));
        if (timeUp || allDone) {
            for (P p : players.values()) if (p.aliveRunning()) kill(p, "TIME", now);
            sparkActive = false; ended = true; endedAt = now; event("END", "", Map.of()); changed = true;
        }
        return changed;
    }

    /** Final verdict for Member.alive: survived = alive at the end. */
    boolean survived(String id) {P p = players.get(id); return p != null && p.alive;}

    private void event(String type, String who, Map<String, Object> extra) {
        Map<String, Object> e = new LinkedHashMap<>(extra); e.put("seq", ++eventSeq); e.put("type", type); e.put("who", who); events.add(e); if (events.size() > 40) events.remove(0);
    }

    Map<String, Object> snapshot(long now) {
        Map<String, Object> v = new LinkedHashMap<>();
        v.put("format", format.name()); v.put("limitMs", limitMs); v.put("ended", ended);
        v.put("front", Map.of("delayMs", CFG.frontDelayMs, "z0", CFG.frontStartZ, "v0", CFG.frontSpeed0, "a", CFG.frontAccel, "vMax", CFG.frontSpeedMax, "z", frontZ(now)));
        v.put("seats", seats); v.put("seatsUsed", seatsUsed); v.put("quotas", quotas); v.put("passed", passed); v.put("closed", closed); v.put("gateCps", CFG.gateCheckpoints);
        Map<String, Object> sp = new LinkedHashMap<>(); sp.put("active", sparkActive); sp.put("taken", sparkTaken); sp.put("by", sparkBy); sp.put("cp", sparkCp); sp.put("z", sparkZ); v.put("spark", sp);
        Map<String, Object> ps = new LinkedHashMap<>();
        for (P p : players.values()) {Map<String, Object> o = new LinkedHashMap<>(); o.put("alive", p.alive); o.put("status", p.status); o.put("reason", p.reason); o.put("ghostAtStart", p.ghostAtStart);
            o.put("revived", p.revived); o.put("place", p.place); if (format == Format.LAST_CHANCE) o.put("deadline", p.deadline); ps.put(p.id, o);}
        v.put("players", ps); v.put("events", events); v.put("needCourse", checkpoints == null);
        return v;
    }
}
