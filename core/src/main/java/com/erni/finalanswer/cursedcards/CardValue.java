package com.erni.finalanswer.cursedcards;

/** Values printed on THE CURSED CARDS fronts. Backs are identical for every value, DEATH included. */
public enum CardValue {
    ONE("1"),TWO("2"),THREE("3"),FOUR("4"),FIVE("5"),SIX("6"),SEVEN("7"),EIGHT("8"),NINE("9"),TEN("10"),DEATH("DEATH");
    public final String label;
    CardValue(String label){this.label=label;}
    /** Rules value (1–10, 0 = DEATH, see {@code CursedCard}) to face. */
    public static CardValue of(int rulesValue){if(rulesValue==0)return DEATH;if(rulesValue<1||rulesValue>10)throw new IllegalArgumentException("card value "+rulesValue);return values()[rulesValue-1];}
}
