package com.erni.finalanswer.ui.play;

/** Unicode-safe reveal driven by elapsed round time, not by threads or queued timers. */
public final class TypewriterText {
    public static final double SECONDS_PER_CHARACTER =
        com.erni.finalanswer.gameplay.round.RoundTiming.CHARACTER_SECONDS;
    private final String text;
    private final int[] boundaries;
    public TypewriterText(String text) {
        this.text = java.util.Objects.requireNonNull(text);
        boundaries = new int[text.codePointCount(0, text.length()) + 1];
        for (int i = 1; i < boundaries.length; i++)
            boundaries[i] = text.offsetByCodePoints(boundaries[i - 1], 1);
    }
    public int visibleCharacters(double elapsed) {
        return (int) Math.max(0, Math.min(boundaries.length - 1,
            Math.floor(elapsed / SECONDS_PER_CHARACTER + 1e-9)));
    }
    public boolean complete(double elapsed) { return visibleCharacters(elapsed) == boundaries.length - 1; }
    public String visibleText(double elapsed) { return text.substring(0, boundaries[visibleCharacters(elapsed)]); }
    /** Invisible suffix preserves the final wrapping, so existing words never jump between lines. */
    public String markup(double elapsed) {
        int end = boundaries[visibleCharacters(elapsed)];
        return escape(text.substring(0, end)) + "[#ffffff00]" + escape(text.substring(end)) + "[]";
    }
    private static String escape(String text) { return text.replace("[", "[["); }
}
