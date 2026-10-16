package com.erni.finalanswer.rooms;

import java.util.Objects;

/** A snapshot of the creation form, ready to pass to a future room/session service. */
public record RoomConfiguration(String roomName, int maxPlayers, String password, GameMode gameMode) {
    public RoomConfiguration {
        roomName = Objects.requireNonNull(roomName, "roomName").trim();
        Objects.requireNonNull(password, "password");
        Objects.requireNonNull(gameMode, "gameMode");
        if (maxPlayers < 2 || maxPlayers > 8) {
            throw new IllegalArgumentException("maxPlayers must be between 2 and 8");
        }
    }

    @Override
    public String toString() {
        // Keep the optional password out of logs.
        return "RoomConfiguration[roomName=" + roomName + ", maxPlayers=" + maxPlayers
            + ", gameMode=" + gameMode.getId() + "]";
    }
}
