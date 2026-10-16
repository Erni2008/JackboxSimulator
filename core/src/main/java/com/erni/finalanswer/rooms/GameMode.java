package com.erni.finalanswer.rooms;

/** Language-independent identifiers; gameplay implementations live in rooms/modes. */
public enum GameMode {
    STANDARD("standard"),
    DEADLINE("deadline"),
    EVERY_MAN_FOR_HIMSELF("every_man_for_himself"),
    TRUST_NO_ONE("trust_no_one"),
    HOUSE_RULES("house_rules");

    private final String id;

    GameMode(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public String getNameKey() {
        return "mode." + id + ".name";
    }

    public String getDescriptionKey() {
        return "mode." + id + ".description";
    }

    public GameMode next() {
        GameMode[] modes = values();
        return modes[(ordinal() + 1) % modes.length];
    }

    public GameMode previous() {
        GameMode[] modes = values();
        return modes[(ordinal() + modes.length - 1) % modes.length];
    }
}
