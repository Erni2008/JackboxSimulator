package com.erni.finalanswer.gameplay.impostor;

/** Wire presentation timing shared by the authoritative server and host renderer. Milliseconds. */
public final class FinalRevealTiming {
    private FinalRevealTiming() {}
    public static final long LEAD=800, INTERVAL=400, IMPACT=220, HOLD=1000;
    public static long duration(int votes){return LEAD+votes*INTERVAL+HOLD;}
}
