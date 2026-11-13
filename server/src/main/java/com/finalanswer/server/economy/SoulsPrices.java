package com.finalanswer.server.economy;

/** What SOULS buy. Prices live here so the shop can be rebalanced in one place. */
public final class SoulsPrices {
    private SoulsPrices(){}
    /** SYSTEM BREACH: an access key bought with SOULS instead of three right answers. */
    public static final long SB_KEY=2_000;
    public static final int SB_KEY_LIMIT=2;
    /** A ghost returns to the living at the next safe moment. */
    public static final long REVIVAL=5_000;
}
