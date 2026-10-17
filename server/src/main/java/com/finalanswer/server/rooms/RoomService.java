package com.finalanswer.server.rooms;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.*;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/** In-memory lobby registry. All mutations and snapshots share one lock. */
public final class RoomService {
    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final Set<String> MODES =
            Set.of("standard", "deadline", "every_man_for_himself", "trust_no_one", "house_rules");
    private static final long TIMEOUT = 120_000_000_000L;
    private final SecureRandom random = new SecureRandom();
    private final Map<String, Room> rooms = new HashMap<>();

    public synchronized String create(Map<String, String> data) {
        expire();
        if (rooms.size() >= 1000) throw new Failure(503, "Server is full. Try again later.");
        String name = text(data.get("name"), 40, "Room name");
        int max;
        try {
            max = Integer.parseInt(data.getOrDefault("maxPlayers", "4"));
        } catch (NumberFormatException error) {
            throw new Failure(400, "Invalid player limit.");
        }
        if (max < 2 || max > 8) throw new Failure(400, "Player limit must be 2 to 8.");
        String mode = data.getOrDefault("gameMode", "standard");
        if (!MODES.contains(mode)) throw new Failure(400, "Unknown game mode.");
        String password = data.getOrDefault("password", "");
        if (password.length() > 64) throw new Failure(400, "Password is too long.");
        String code = data.getOrDefault("code", "");
        if (!code.matches("[A-HJ-NP-Z2-9]{4}") || rooms.containsKey(code)) {
            do {
                StringBuilder b = new StringBuilder(4);
                for (int i = 0; i < 4; i++)
                    b.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
                code = b.toString();
            } while (rooms.containsKey(code));
        }
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        Room room =
                new Room(
                        code,
                        name,
                        max,
                        mode,
                        salt,
                        password.isEmpty() ? null : hash(password, salt));
        Member host = new Member("Host", true);
        room.members.put(host.token, host);
        rooms.put(code, room);
        return snapshot(room, host);
    }

    public synchronized String join(String code, Map<String, String> data) {
        Room room = find(code);
        String name = text(data.get("name"), 24, "Player name");
        String password = data.getOrDefault("password", "");
        if (password.length() > 64) throw new Failure(400, "Password is too long.");
        if (room.passwordHash != null
                && !MessageDigest.isEqual(room.passwordHash, hash(password, room.salt)))
            throw new Failure(403, "Incorrect room password.");
        if (room.members.size() >= room.maxPlayers) throw new Failure(409, "This room is full.");
        if (room.members.values().stream().anyMatch(m -> m.name.equalsIgnoreCase(name)))
            throw new Failure(409, "This player name is already in use.");
        Member member = new Member(name, false);
        room.members.put(member.token, member);
        return snapshot(room, member);
    }

    public synchronized String heartbeat(String code, String token) {
        Room room = find(code);
        Member member = authenticate(room, token);
        member.seen = System.nanoTime();
        return snapshot(room, member);
    }

    public synchronized String reroll(String code, Map<String, String> data) {
        Room room = find(code);
        Member host = authenticate(room, data.getOrDefault("token", ""));
        if (!host.host) throw new Failure(403, "Only the host can change the room code.");
        if (room.members.size() != 1)
            throw new Failure(409, "Cannot change code after players have joined.");
        String next = data.getOrDefault("code", "");
        while (!next.matches("[A-HJ-NP-Z2-9]{4}") || rooms.containsKey(next)) {
            StringBuilder b = new StringBuilder(4);
            for (int i = 0; i < 4; i++) b.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
            next = b.toString();
        }
        Room replacement = new Room(next, room.name, room.maxPlayers, room.mode,
                room.salt, room.passwordHash, room.members);
        rooms.remove(room.code);
        rooms.put(next, replacement);
        host.seen = System.nanoTime();
        return snapshot(replacement, host);
    }

    public synchronized String view(String code) {
        return snapshot(find(code), null);
    }

    public synchronized void leave(String code, String token) {
        Room room = rooms.get(code.toUpperCase(Locale.ROOT));
        if (room == null) return;
        Member member = authenticate(room, token);
        if (member.host) rooms.remove(room.code);
        else room.members.remove(token);
    }

    private Room find(String code) {
        expire();
        Room room = rooms.get(code.toUpperCase(Locale.ROOT));
        if (room == null) throw new Failure(404, "Room not found or host disconnected.");
        return room;
    }

    private Member authenticate(Room room, String token) {
        Member member = room.members.get(token);
        if (member == null) throw new Failure(403, "Your room session has ended.");
        return member;
    }

    private void expire() {
        long now = System.nanoTime();
        rooms.values()
                .removeIf(
                        room -> {
                            room.members.values().removeIf(m -> now - m.seen > TIMEOUT);
                            return room.members.values().stream().noneMatch(m -> m.host);
                        });
    }

    private String snapshot(Room room, Member self) {
        StringJoiner players = new StringJoiner(",", "[", "]");
        for (Member m : room.members.values())
            players.add(
                    "{\"id\":"
                            + quote(m.id)
                            + ",\"name\":"
                            + quote(m.name)
                            + ",\"host\":"
                            + m.host
                            + "}");
        return "{\"code\":"
                + quote(room.code)
                + ",\"name\":"
                + quote(room.name)
                + ",\"maxPlayers\":"
                + room.maxPlayers
                + ",\"gameMode\":"
                + quote(room.mode)
                + ",\"players\":"
                + players
                + (self == null ? "" : ",\"token\":" + quote(self.token) + ",\"host\":" + self.host)
                + "}";
    }

    public static String quote(String value) {
        StringBuilder b = new StringBuilder("\"");
        for (char c : value.toCharArray()) {
            if (c == '"' || c == '\\') b.append('\\').append(c);
            else if (c < 32) b.append(String.format(Locale.ROOT, "\\u%04x", (int) c));
            else b.append(c);
        }
        return b.append('"').toString();
    }

    private static String text(String value, int max, String label) {
        String result = value == null ? "" : value.trim();
        if (result.isEmpty()
                || result.length() > max
                || result.chars().anyMatch(Character::isISOControl))
            throw new Failure(400, label + " must contain 1 to " + max + " characters.");
        return result;
    }

    private static byte[] hash(String password, byte[] salt) {
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 100_000, 256);
        try {
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
                    .generateSecret(spec)
                    .getEncoded();
        } catch (java.security.GeneralSecurityException error) {
            throw new IllegalStateException(error);
        } finally {
            spec.clearPassword();
        }
    }

    private record Room(
            String code,
            String name,
            int maxPlayers,
            String mode,
            byte[] salt,
            byte[] passwordHash,
            Map<String, Member> members) {
        Room(String code, String name, int max, String mode, byte[] salt, byte[] hash) {
            this(code, name, max, mode, salt, hash, new LinkedHashMap<>());
        }
    }

    private static final class Member {
        final String id = UUID.randomUUID().toString(), token = UUID.randomUUID().toString(), name;
        final boolean host;
        long seen = System.nanoTime();

        Member(String name, boolean host) {
            this.name = name;
            this.host = host;
        }
    }

    public static final class Failure extends RuntimeException {
        public final int status;

        public Failure(int status, String message) {
            super(message);
            this.status = status;
        }
    }
}
