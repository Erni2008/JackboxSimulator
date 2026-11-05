package com.erni.finalanswer.gameplay.elevator;

/**
 * THE BROKEN ELEVATOR — difficulty chosen by the host for the whole room.
 * EASY: long timers, single faults, a calm line, no unstable reagents.
 * NORMAL: the reference rules (45 s, fault pairs half the time, line noise, 60 % surges, 40 % unstable).
 * HARD: short timers, always a fault pair, always a surge, unstable reagents most of the time.
 */
public enum Difficulty {
    EASY(90_000, 60_000, 60_000), NORMAL(60_000, 45_000, 45_000), HARD(45_000, 35_000, 35_000);
    public final long wireMs, pressureMs, formulaMs;
    Difficulty(long wire, long pressure, long formula) { wireMs = wire; pressureMs = pressure; formulaMs = formula; }
    public static Difficulty parse(String s) { try { return s == null ? NORMAL : valueOf(s.toUpperCase(java.util.Locale.ROOT)); } catch (IllegalArgumentException e) { return NORMAL; } }
}
