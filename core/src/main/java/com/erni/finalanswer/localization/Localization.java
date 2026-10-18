package com.erni.finalanswer.localization;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.utils.I18NBundle;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/** UTF-8 bundles are loaded once per language; UI can switch without recreating screens. */
public class Localization {
    private static final Map<String, I18NBundle> BUNDLES = new HashMap<>();
    private I18NBundle bundle;
    private String language;

    public Localization(String language) {
        setLanguage(language);
    }

    public void setLanguage(String language) {
        this.language = "ru".equals(language) ? "ru" : "en";
        bundle =
                BUNDLES.computeIfAbsent(
                        this.language,
                        key ->
                                I18NBundle.createBundle(
                                        Gdx.files.internal("i18n/messages"),
                                        Locale.forLanguageTag(key),
                                        "UTF-8"));
    }

    public String getLanguage() {
        return language;
    }

    public String get(String key) {
        return bundle.get(key);
    }

    public String format(String key, Object... values) {
        return bundle.format(key, values);
    }

    public String error(String message) {
        String key =
                switch (message) {
                    case "Cannot reach room server. Start it and try again." ->
                            "error.server_unavailable";
                    case "Unexpected server response. Restart the room server." ->
                            "error.server_response";
                    case "Room not found or host disconnected." -> "error.room_missing";
                    case "Your room session has ended." -> "error.session_ended";
                    case "Incorrect room password." -> "error.password";
                    case "This room is full." -> "error.room_full";
                    case "This player name is already in use." -> "error.name_taken";
                    case "Enter a valid six-character room code." -> "error.code";
                    case "Player name must contain 1 to 24 characters." -> "error.player_name";
                    case "Server is full. Try again later." -> "error.server_full";
                    case "Room name must contain 1 to 40 characters." -> "error.room_name";
                    case "Password is too long." -> "error.password_length";
                    case "Invalid player limit.", "Player limit must be 2 to 8." ->
                            "error.player_limit";
                    case "Unknown game mode." -> "error.game_mode";
                    case "Only the host can change the room code." -> "error.reroll_host";
                    case "Cannot change code after players have joined." -> "error.reroll_players";
                    case "ROOM_NOT_FOUND" -> "error.room_missing";
                    case "SESSION_ENDED" -> "error.session_ended";
                    case "INVALID_PASSWORD" -> "error.password";
                    case "ROOM_IS_FULL" -> "error.room_full";
                    case "NICKNAME_IN_USE" -> "error.name_taken";
                    case "INVALID_NICKNAME" -> "error.player_name";
                    case "SERVER_FULL" -> "error.server_full";
                    case "INVALID_ROOM_NAME" -> "error.room_name";
                    case "INVALID_PLAYER_LIMIT" -> "error.player_limit";
                    case "INVALID_GAME_MODE" -> "error.game_mode";
                    case "ROOM_NOT_EMPTY" -> "error.reroll_players";
                    case "NOT_ENOUGH_PLAYERS" -> "network.need_players";
                    case "HOST_ONLY" -> "network.host_only";
                    case "GAME_ALREADY_STARTED" -> "network.started";
                    case "CONNECTED" -> "network.connected";
                    case "CONNECTING" -> "network.connecting";
                    case "CONNECTION_LOST" -> "network.lost";
                    case "RECONNECT_FAILED" -> "network.retry";
                    case "RATE_LIMITED" -> "network.rate";
                    default -> null;
                };
        return key == null ? message : get(key);
    }
}
