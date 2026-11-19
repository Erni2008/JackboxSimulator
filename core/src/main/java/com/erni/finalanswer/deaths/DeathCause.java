package com.erni.finalanswer.deaths;

import com.erni.finalanswer.localization.Localization;

/** What killed a player in a mini-game; every character has its own death for each cause. */
public enum DeathCause {
    SHOT(Localization.tr("ЗАСТРЕЛЕН", "SHOT DEAD"),"SHOT DOWN"),
    BURNED(Localization.tr("СГОРЕЛ", "BURNED OUT"),"BURNED"),
    EXPLODED(Localization.tr("ВЗОРВАН", "BLOWN UP"),"BLOWN UP"),
    CURSED(Localization.tr("ПРОКЛЯТ", "CURSED"),"CURSED");
    public final String ru,en;
    DeathCause(String ru,String en){this.ru=ru;this.en=en;}
}
