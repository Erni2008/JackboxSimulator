package com.finalanswer.server.economy;

/**
 * Reward amounts for SOULS. Only the main quiz pays for now; each mini-game will add its own constants and reasons
 * here (and call {@link SoulsWallet#reward}) when its rules are decided — deliberately no defaults until then.
 */
public final class SoulsRewards {
    private SoulsRewards(){}
    /** A quiz answer validated as correct by the server. Wrong answers and timeouts pay nothing. */
    public static final long QUIZ_CORRECT_ANSWER=1_000;
    public static final String REASON_QUIZ_CORRECT="QUIZ_CORRECT_ANSWER";
}
