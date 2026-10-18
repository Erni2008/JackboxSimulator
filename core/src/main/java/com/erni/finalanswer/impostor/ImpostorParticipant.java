package com.erni.finalanswer.impostor;

import com.erni.finalanswer.rooms.RoomSession;
import java.util.List;
import java.util.Objects;

/** Presentation data for an explicitly selected active participant, never a spectator. */
public record ImpostorParticipant(RoomSession.Player player, List<String> clues) {
    public ImpostorParticipant {
        Objects.requireNonNull(player, "player");
        if (player.id() == null || player.id().isBlank()) throw new IllegalArgumentException("Player ID required");
        Objects.requireNonNull(player.name(), "nickname");
        clues = List.copyOf(clues);
        if (clues.size() != 3) throw new IllegalArgumentException("Exactly three clue lines required");
    }
}
