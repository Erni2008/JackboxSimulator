package com.erni.finalanswer.deaths;

/** What killed a player in a mini-game; every character has its own death for each cause. */
public enum DeathCause {
    SHOT("ЗАСТРЕЛЕН","SHOT DOWN"),
    BURNED("СГОРЕЛ","BURNED"),
    EXPLODED("ВЗОРВАН","BLOWN UP"),
    CURSED("ПРОКЛЯТ","CURSED");
    public final String ru,en;
    DeathCause(String ru,String en){this.ru=ru;this.en=en;}
}
