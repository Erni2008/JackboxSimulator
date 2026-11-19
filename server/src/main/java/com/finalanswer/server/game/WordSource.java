package com.finalanswer.server.game;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;

/** Replaceable, server-only source. Configure IMPOSTOR_WORDS as comma-separated single words. */
@FunctionalInterface
public interface WordSource {
    String choose(SecureRandom random);
    default String hint(String word){return WordHints.forWord(word);}
    /** Built-in English set (used when the room is in English and no IMPOSTOR_WORDS are configured). */
    WordSource ENGLISH=new WordSource(){
        private final List<String> words=List.of("APPLE","OCEAN","MUSIC","SPACE","PLANE");
        public String choose(SecureRandom random){return words.get(random.nextInt(words.size()));}
        public String hint(String word){return WordHints.forWordEnglish(word);}
    };
    /** Room language aware: the built-in Russian set switches to the English one; configured custom words stay as they are. */
    default WordSource forLanguage(String language){return this;}
    static WordSource configured() {
        String configured=System.getenv("IMPOSTOR_WORDS");
        if(configured==null||configured.isBlank()){
            WordSource ru=defaults();
            return new WordSource(){
                public String choose(SecureRandom random){return ru.choose(random);}
                public String hint(String word){return ru.hint(word);}
                public WordSource forLanguage(String language){return "ru".equals(language)?this:ENGLISH;}
            };
        }
        return defaults();
    }
    private static WordSource defaults() {
        String configured=System.getenv("IMPOSTOR_WORDS");
        List<String> words=configured==null || configured.isBlank()?List.of("ЯБЛОКО","ОКЕАН","МУЗЫКА","КОСМОС","САМОЛЁТ"):
            java.util.Arrays.stream(configured.split(",")).map(String::strip).map(ImpostorSession::normalize).toList();
        Map<String,String> hints=new java.util.HashMap<>();
        String configuredHints=System.getenv("IMPOSTOR_WORD_HINTS");
        if(configuredHints!=null&&!configuredHints.isBlank()){
            var json=com.google.gson.JsonParser.parseString(configuredHints).getAsJsonObject();
            json.entrySet().forEach(entry->hints.put(ImpostorSession.normalize(entry.getKey()),entry.getValue().getAsString()));
        }
        return new WordSource(){
            public String choose(SecureRandom random){return words.get(random.nextInt(words.size()));}
            public String hint(String word){return WordHints.safe(word,hints.get(word));}
        };
    }
}
