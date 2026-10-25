package com.erni.finalanswer.lastcommand;

/** Immutable event; PROGRAM events can be filtered out of the player's action sequence. */
public record PanelAction(long sequence, double seconds, PanelElementId element, Kind kind, String value, Cause cause) {
    public enum Cause { PLAYER, PROGRAM }
    public enum Kind { PRESSED, RELEASED, COLOR_CHANGED, ADJUSTER_CHANGED, LIGHT_CHANGED, LOCK_CHANGED }
}
