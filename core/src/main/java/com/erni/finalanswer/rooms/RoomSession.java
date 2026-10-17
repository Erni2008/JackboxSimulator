package com.erni.finalanswer.rooms;

import java.util.List;

/** Server-confirmed lobby snapshot. The private token never appears in lobby labels. */
public record RoomSession(
        String code,
        String name,
        int maxPlayers,
        String gameMode,
        String token,
        boolean host,
        List<Player> players) {
    public RoomSession {
        players = List.copyOf(players);
    }

    public record Player(String id, String name, boolean host) {}

    @Override
    public String toString() {
        return "RoomSession[code=" + code + ", players=" + players.size() + "]";
    }
}
