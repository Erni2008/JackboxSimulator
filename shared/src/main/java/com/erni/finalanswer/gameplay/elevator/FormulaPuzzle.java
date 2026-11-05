package com.erni.finalanswer.gameplay.elevator;

import com.erni.finalanswer.gameplay.elevator.Formula.*;
import java.util.*;

/**
 * THE UNSTABLE FORMULA — one player's laboratory, server-authoritative.
 * Actions: DISPENSE(reagent) (one dose, the dispenser is locked for {@link #DOSE_MS}), LOCK_ON / LOCK_OFF (cooling lock),
 * INJECT. A wrong INJECT, or an unstable reagent dispensed without the lock, rejects the mixture: the chamber drains for
 * {@link #DRAIN_MS} and resets; the timer keeps running. A correct INJECT stops the timer at once. 45 s limit.
 */
public final class FormulaPuzzle {
    public static final long LIMIT_MS = 45_000, DOSE_MS = 650, DRAIN_MS = 1_800, QUANTUM_MS = 10;
    public static final int MAX_DOSES = 6;
    public enum Outcome { RUNNING, STABILIZED, FAILED }
    public enum Action { DISPENSE, LOCK_ON, LOCK_OFF, INJECT }
    /** what the last accepted action caused (client animation cue) */
    public record Event(long seq, String type, Reagent reagent, String reason) {}

    private final Sample sample; private final Recipe recipe; private final long startedAt, limitMs;
    private long elapsed, busyUntil, drainUntil = -1, finishedAt = -1, lastSeq = -1;
    private final List<Reagent> doses = new ArrayList<>();
    private boolean lock; private int rejections; private Outcome outcome = Outcome.RUNNING; private String failReason = ""; private Event last;
    public boolean rewarded; public long sentAt;

    public FormulaPuzzle(Sample sample, long startedAt) { this(sample, startedAt, LIMIT_MS); }
    public FormulaPuzzle(Sample sample, long startedAt, long limitMs) { this.sample = sample; this.recipe = Formula.solve(sample); this.startedAt = startedAt; this.limitMs = limitMs; }

    public boolean advance(long now) {
        if (outcome != Outcome.RUNNING) return false;
        elapsed = Math.min(Math.max(elapsed, now - startedAt), limitMs);
        if (drainUntil >= 0 && elapsed >= drainUntil) { doses.clear(); drainUntil = -1; }
        if (elapsed >= limitMs) { outcome = Outcome.FAILED; failReason = "TIMEOUT"; finishedAt = startedAt + limitMs; return true; }
        return false;
    }
    public boolean draining() { return drainUntil >= 0; }
    public boolean dispensing() { return elapsed < busyUntil; }

    /** false: duplicate/stale, ended, or mechanically busy (dispenser locked, chamber draining, full) */
    public boolean apply(Action a, Reagent r, long seq, long now) {
        advance(now);
        if (outcome != Outcome.RUNNING || seq <= lastSeq) return false;
        if (a == Action.DISPENSE && r == null) throw new IllegalArgumentException("reagent");
        if (a != Action.LOCK_ON && a != Action.LOCK_OFF && (dispensing() || draining())) return false;
        lastSeq = seq;
        switch (a) {
            case LOCK_ON -> { lock = true; last = new Event(seq, "LOCK", null, "ON"); }
            case LOCK_OFF -> { lock = false; last = new Event(seq, "LOCK", null, "OFF"); }
            case DISPENSE -> {
                if (doses.size() >= MAX_DOSES) { last = new Event(seq, "FULL", r, ""); return true; }
                doses.add(r); busyUntil = elapsed + DOSE_MS;
                if (r == recipe.unstable() && !lock) { reject("UNSTABLE_UNPROTECTED", seq, r); }
                else last = new Event(seq, "DOSE", r, "");
            }
            case INJECT -> {
                if (doses.equals(recipe.sequence())) { outcome = Outcome.STABILIZED; finishedAt = startedAt + elapsed; last = new Event(seq, "ACCEPTED", null, ""); }
                else reject(doses.isEmpty() ? "EMPTY" : "WRONG_FORMULA", seq, null);
            }
        }
        return true;
    }
    private void reject(String why, long seq, Reagent r) { rejections++; drainUntil = elapsed + DRAIN_MS; busyUntil = 0; last = new Event(seq, "REJECTED", r, why); }

    public Sample sample() { return sample; }
    /** server-only: never put this in client state */
    public Recipe recipe() { return recipe; }
    public List<Reagent> doses() { return List.copyOf(doses); }
    public boolean lock() { return lock; }
    public int rejections() { return rejections; }
    public long startedAt() { return startedAt; }
    public long elapsed() { return elapsed; }
    public long deadline() { return startedAt + limitMs; }
    public long limitMs() { return limitMs; }
    public long busyUntil() { return startedAt + busyUntil; }
    public long drainUntil() { return drainUntil < 0 ? -1 : startedAt + drainUntil; }
    public long finishedAt() { return finishedAt; }
    public long lastSeq() { return lastSeq; }
    public Outcome outcome() { return outcome; }
    public String failReason() { return failReason; }
    public Event lastEvent() { return last; }
}
