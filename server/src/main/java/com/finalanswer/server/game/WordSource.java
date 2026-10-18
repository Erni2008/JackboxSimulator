package com.finalanswer.server.game;

import java.security.SecureRandom;
import java.util.List;

/** Replaceable, server-only source. Configure IMPOSTOR_WORDS as comma-separated single words. */
@FunctionalInterface
public interface WordSource {
    String choose(SecureRandom random);
    static WordSource configured() {
        String configured=System.getenv("IMPOSTOR_WORDS");
        List<String> words=configured==null || configured.isBlank()?List.of("ЯБЛОКО","ОКЕАН","МУЗЫКА","КОСМОС","САМОЛЁТ"):
            java.util.Arrays.stream(configured.split(",")).map(String::strip).map(ImpostorSession::normalize).toList();
        return random->words.get(random.nextInt(words.size()));
    }
}
