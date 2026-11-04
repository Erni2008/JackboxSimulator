package com.erni.finalanswer.gameplay.elevator;

/**
 * THE BROKEN VALVES — fault types. A puzzle has one primary fault and, in harder puzzles, a second one; a pair is
 * always one mechanical fault (R-02 / B-04 / F-01, cured by BYPASS) plus the L-03 leak (cured by the pipe CLAMP).
 */
public enum Malfunction {
    /** red intake valve blocked on the main line */
    R02("R-02"),
    /** blue release valve blocked on the main line */
    B04("B-04"),
    /** intake and release swapped on the main line: red lowers, blue raises */
    F01("F-01"),
    /** cracked coupling: pressure bleeds away until the CLAMP is fitted; never a safe state while leaking */
    L03("L-03");

    public final String code;
    Malfunction(String code) { this.code = code; }
    public static final double LEAK_PSI_PER_S = 1.0;
    public boolean mechanical() { return this != L03; }
}
