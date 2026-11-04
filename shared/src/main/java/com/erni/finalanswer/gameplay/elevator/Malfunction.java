package com.erni.finalanswer.gameplay.elevator;

/**
 * THE BROKEN VALVES — the single primary fault of a puzzle. BYPASS (auxiliary line) neutralises each of them.
 * Fault behaviour is pure and deterministic; {@link PressurePuzzle} applies it.
 */
public enum Malfunction {
    /** red intake valve mechanically blocked: red adjustments do nothing on the main line */
    R02("R-02"),
    /** blue release valve mechanically blocked: blue adjustments do nothing on the main line */
    B04("B-04"),
    /** intake and release pathways swapped: red lowers, blue raises (still a valid way to play) */
    F01("F-01"),
    /** damaged pipe: pressure bleeds away at a fixed rate; the system is not safe until the pipe is isolated */
    L03("L-03");

    public final String code;
    Malfunction(String code) { this.code = code; }

    public static final double LEAK_PSI_PER_S = 1.0;

    /** PSI change of one red adjustment of size {@code step} */
    public double red(double step, boolean bypass) {
        return switch (this) { case R02 -> bypass ? step : 0; case F01 -> bypass ? step : -step; default -> step; };
    }
    /** PSI change of one blue adjustment of size {@code step} */
    public double blue(double step, boolean bypass) {
        return switch (this) { case B04 -> bypass ? -step : 0; case F01 -> bypass ? -step : step; default -> -step; };
    }
    /** continuous PSI/s drift caused by the fault */
    public double drift(boolean bypass) { return this == L03 && !bypass ? -LEAK_PSI_PER_S : 0; }
    /** an uncontrolled leak is never a safe operating state; jams and reversed flow can be operated safely */
    public boolean safe(boolean bypass) { return this != L03 || bypass; }
    /** true when a red/blue turn is physically blocked (the wheel resists) */
    public boolean jammed(boolean red, boolean bypass) { return !bypass && (red ? this == R02 : this == B04); }
}
