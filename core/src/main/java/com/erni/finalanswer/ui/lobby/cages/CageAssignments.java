package com.erni.finalanswer.ui.lobby.cages;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

/** Stable IDs survive list reorder and brief disconnections. A real roster removal frees one slot. */
public final class CageAssignments {
    private final String[] slots = new String[CageLayoutManager.SLOTS];
    public String playerAt(int slot) { return slots[slot]; }
    public void synchronize(Collection<String> players) {
        Set<String> present = new HashSet<>(players);
        if (present.size() > slots.length) throw new IllegalArgumentException("Lobby supports at most eight players");
        for (int i = 0; i < slots.length; i++) if (slots[i] != null && !present.contains(slots[i])) slots[i] = null;
        for (String id : players) {
            if (id == null) throw new IllegalArgumentException("Player ID is required");
            if (slotOf(id) >= 0) continue;
            for (int i = 0; i < slots.length; i++) if (slots[i] == null) { slots[i] = id; break; }
        }
    }
    public int slotOf(String id) {
        for (int i = 0; i < slots.length; i++) if (id.equals(slots[i])) return i;
        return -1;
    }
    public void clear() { java.util.Arrays.fill(slots, null); }
}
