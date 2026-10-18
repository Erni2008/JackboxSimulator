package com.finalanswer.protocol;

import com.google.gson.*;
import java.io.StringReader;
import java.util.Map;

/** Versioned JSON envelope shared by desktop, HTTP and WebSocket adapters. */
public final class Protocol {
    public static final int VERSION = 1, MAX_MESSAGE_BYTES = 16384;
    public static final long ANSWER_MILLIS = 20_000, CLOCK_EXIT_MILLIS = 720,
        RESULT_ANIMATION_MILLIS = 600, RESULT_HOLD_MILLIS = 2500;
    public static final Gson JSON = new GsonBuilder().disableHtmlEscaping().create();
    public enum Phase { LOBBY, STARTING, QUESTION_PRESENTATION, ANSWERING, REVEALING, RESULTS, GAME_FINISHED }
    public enum EndPolicy { TIME_ONLY, ALL_SUBMITTED_OR_TIMEOUT }
    public record Message(String type, String requestId, JsonObject payload) {}
    public static Message decode(String text) {
        if (text == null || text.length() > MAX_MESSAGE_BYTES) throw new IllegalArgumentException("MESSAGE_TOO_LARGE");
        int depth = 0; boolean quoted = false, escaped = false;
        for (char c : text.toCharArray()) {
            if (quoted) { if (escaped) escaped=false; else if(c=='\\') escaped=true; else if(c=='"') quoted=false; }
            else if(c=='"') quoted=true;
            else if(c=='['||c=='{') { if(++depth>24) throw new IllegalArgumentException("INVALID_JSON"); }
            else if(c==']'||c=='}') depth--;
        }
        try {
            var reader = new com.google.gson.stream.JsonReader(new StringReader(text));
            reader.setStrictness(Strictness.STRICT);
            JsonObject root = JsonParser.parseReader(reader).getAsJsonObject();
            if(reader.peek()!=com.google.gson.stream.JsonToken.END_DOCUMENT) throw new IllegalArgumentException();
            String type=root.get("type").getAsString(), id=root.get("requestId").getAsString();
            if(!type.matches("[A-Z_]{1,40}") || !id.matches("[A-Za-z0-9_-]{1,64}")) throw new IllegalArgumentException();
            return new Message(type,id,root.getAsJsonObject("payload") == null ? new JsonObject() : root.getAsJsonObject("payload"));
        } catch(Exception e) { throw new IllegalArgumentException("INVALID_MESSAGE"); }
    }
    public static String event(String type, String requestId, Object payload) {
        return JSON.toJson(Map.of("type",type,"requestId",requestId == null ? "" : requestId,"payload",payload));
    }
    public static String string(JsonObject value, String key) {
        JsonElement item=value.get(key);
        if(item==null||!item.isJsonPrimitive()||!item.getAsJsonPrimitive().isString()) return "";
        return item.getAsString();
    }
    private Protocol() {}
}
