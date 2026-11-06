package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * АДСКАЯ КЛЕТКА — THE HOST'S SUITCASE (the fifth assignment). One suitcase per player, server-authoritative.
 *
 * <p>The suitcase always holds all five mechanisms; one of them is armed for this event (the others are dead
 * decoration). The server picks the armed module, keeps its generated layout and its solution, counts strikes and
 * decides DEFUSED / DETONATED. The phone only renders and sends actions; it is never told the answer.
 *
 * <p>Everything here is a fictional game device: abstract rules invented for FINAL ANSWER.
 */
public final class BombPuzzle {
    public enum Mechanism { WIRE_MAZE, HIDDEN_CONNECTIONS, XRAY, LASER, THERMAL }
    public enum Outcome { RUNNING, DEFUSED, DETONATED }
    /** progress the room restores on reconnect */
    public enum Stage { HIDDEN, FOUND, OPEN }
    public record Event(long seq, String type, String detail) {}

    /** modules per event (more than one is supported by the design but off by default) */
    public static final int MODULES_PER_EVENT = 1;

    public final long seed; public final Difficulty difficulty; public final Mechanism module;
    private final long startedAt, limitMs; private Outcome outcome = Outcome.RUNNING; private Stage stage = Stage.HIDDEN;
    private int strikes; private long finishedAt = -1, lastSeq = -1; private String failReason = ""; private Event lastEvent;
    public boolean rewarded; public long sentAt;

    public BombPuzzle(long seed, Difficulty d, Mechanism forced, long now) { this(seed, d, forced, now, d.bombMs); }
    public BombPuzzle(long seed, Difficulty d, Mechanism forced, long now, long limitMs) {
        this.seed = seed; this.difficulty = d; this.module = forced != null ? forced : pick(seed); this.startedAt = now; this.limitMs = limitMs;
    }
    /** random but reproducible from the seed */
    public static Mechanism pick(long seed) { Mechanism[] all = Mechanism.values(); return all[new Random(seed ^ 0x5EEDB0B5L).nextInt(all.length)]; }
    public static Mechanism parse(String s) { if (s == null || s.isBlank()) return null; try { return Mechanism.valueOf(s.trim().toUpperCase(Locale.ROOT)); } catch (IllegalArgumentException e) { return null; } }

    /** time only: the fuse burns down; true when the outcome changed */
    public boolean advance(long now) { if (outcome != Outcome.RUNNING || now < startedAt + limitMs) return false; detonate(now, "TIMEOUT"); return true; }

    /** the player's actions that every module shares; module actions arrive in their own apply calls. Old/duplicate seq are ignored. */
    public boolean apply(String action, long seq, long now) {
        advance(now); if (outcome != Outcome.RUNNING || seq <= lastSeq) return false; lastSeq = seq;
        switch (action) {
            case "FOUND" -> { if (stage == Stage.HIDDEN) stage = Stage.FOUND; }
            case "OPEN" -> stage = Stage.OPEN;
            default -> throw new IllegalArgumentException("UNKNOWN_BOMB_ACTION");
        }
        lastEvent = new Event(seq, action, ""); return true;
    }

    /** a module rejected a defusal action: the bomb flinches; past the difficulty's allowance it goes off */
    void strike(long seq, long now, String detail) { strikes++; lastEvent = new Event(seq, "STRIKE", detail); if (strikes > difficulty.bombStrikes) detonate(now, "WRONG"); }
    void defuse(long seq, long now) { outcome = Outcome.DEFUSED; finishedAt = now; lastEvent = new Event(seq, "DEFUSED", module.name()); }
    private void detonate(long now, String why) { outcome = Outcome.DETONATED; finishedAt = now; failReason = why; lastEvent = new Event(lastSeq, "DETONATED", why); }

    public Outcome outcome() { return outcome; }
    public Stage stage() { return stage; }
    public int strikes() { return strikes; }
    public int strikesAllowed() { return difficulty.bombStrikes; }
    public long startedAt() { return startedAt; }
    public long deadline() { return startedAt + limitMs; }
    public long limitMs() { return limitMs; }
    public long finishedAt() { return finishedAt; }
    public long lastSeq() { return lastSeq; }
    public String failReason() { return failReason; }
    public Event lastEvent() { return lastEvent; }
}
