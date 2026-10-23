package com.erni.finalanswer.gameplay.impostor;

/** Wire presentation timing shared by the authoritative server and host renderer. Milliseconds. */
public final class FinalRevealTiming {
    private FinalRevealTiming() {}
    /** Accent in the supplied impostor_role_reveal.wav, measured offline; presentation only. */
    public static final long IDENTITY_NAME_MILLIS=3400, IDENTITY_NAME_FADE_MILLIS=120;
    public static final long LEAD=800, INTERVAL=400, IMPACT=220, HOLD=1000;
    public static long duration(int votes){return LEAD+votes*INTERVAL+HOLD;}
}
