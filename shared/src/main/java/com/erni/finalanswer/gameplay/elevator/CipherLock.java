package com.erni.finalanswer.gameplay.elevator;

import java.util.*;

/**
 * THE HOST'S SUITCASE — mechanism VI, THE CIPHER LOCK (fictional). Two screens and a key: the upper screen shows a
 * challenge, the lower one what the player types. Two formats, picked from the seed:
 * TO_HEX — a word is shown, type its letters as hexadecimal codes (S O U L → 53 4F 55 4C);
 * TO_TEXT — hexadecimal codes are shown, type the word they spell.
 * Chapter VI of the notebook carries the table: A = 41 … O = 4F, P = 50 … Z = 5A. Longer words on harder levels.
 */
public final class CipherLock {
    public enum Mode { TO_HEX, TO_TEXT }
    static final List<String> SHORT = List.of("BAT", "OWL", "RAT", "AXE", "FOG", "ASH", "OAK", "RIP", "TOMB", "BONE", "DOOM", "FEAR", "SOUL", "CAGE", "GRIM", "HOWL", "MOON", "WOLF", "DARK", "FIRE");
    static final List<String> LONG = List.of("GHOST", "SKULL", "GRAVE", "CURSE", "CRYPT", "BLOOD", "WITCH", "RAVEN", "CANDLE", "COFFIN", "SHADOW", "SPIDER", "PUMPKIN", "DEMON", "TORCH");
    public final Mode mode; public final String word;
    private CipherLock(Mode mode, String word) { this.mode = mode; this.word = word; }

    public static CipherLock generate(long seed, Difficulty d) {
        Random r = new Random(new SplittableRandom(seed ^ 0xC1F3E5L).nextLong()); /* mixed: consecutive seeds would share the first coin toss */ List<String> pool = new ArrayList<>();
        for (String w : SHORT) if (d == Difficulty.EASY ? w.length() <= 4 : d == Difficulty.NORMAL ? w.length() == 4 : false) pool.add(w);
        for (String w : LONG) if (d == Difficulty.NORMAL ? w.length() == 5 : d == Difficulty.HARD) pool.add(w);
        return new CipherLock(r.nextBoolean() ? Mode.TO_HEX : Mode.TO_TEXT, pool.get(r.nextInt(pool.size())));
    }
    /** "SOUL" → "53 4F 55 4C" */
    public static String hex(String word) { StringBuilder b = new StringBuilder(); for (char c : word.toCharArray()) { if (b.length() > 0) b.append(' '); b.append(String.format("%02X", (int) c)); } return b.toString(); }
    /** what the upper screen shows */
    public String shown() { return mode == Mode.TO_HEX ? word : hex(word); }
    /** the answer, compared without spaces and case */
    public boolean accepts(String typed) {
        if (typed == null) return false; String t = typed.replaceAll("\\s+", "").toUpperCase(Locale.ROOT);
        return t.equals(mode == Mode.TO_HEX ? hex(word).replace(" ", "") : word);
    }
}
