package com.erni.finalanswer.gameplay.forgottenroom;

/** What can happen to a room position while the lights are out. Phones offer these as answer options. */
public enum ChangeType {
    DISAPPEARED("ИСЧЕЗ"),
    MOVED("ПЕРЕМЕСТИЛСЯ"),
    ROTATED("ПОВЕРНУЛСЯ"),
    CHANGED("ИЗМЕНИЛСЯ"),
    APPEARED("ПОЯВИЛСЯ"),
    TOGGLED("СВЕТ ВКЛ/ВЫКЛ");

    public final String labelRu;
    ChangeType(String labelRu){this.labelRu=labelRu;}
}
