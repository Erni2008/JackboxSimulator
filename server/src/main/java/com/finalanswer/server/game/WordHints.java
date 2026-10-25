package com.finalanswer.server.game;

import java.text.Normalizer;
import java.util.Map;
import java.util.Locale;

/** Broad editorial directions, never an initial letter, synonym, or substring of the secret word. */
final class WordHints {
    private static final Map<String,String> DEFAULTS=Map.of(
        "ЯБЛОКО","Еда", "ОКЕАН","Природа", "МУЗЫКА","Творчество", "КОСМОС","Пространство", "САМОЛЁТ","Путешествия");
    static String forWord(String word){
        String direct=DEFAULTS.get(word);if(direct!=null)return direct;
        for(String fallback:new String[]{"Предмет, место или явление","Широкая ассоциация","Выберите общее направление"})
            if(!fallback.toUpperCase(Locale.ROOT).contains(word.toUpperCase(Locale.ROOT)))return fallback;
        return "Общая тема";
    }
    static String safe(String word,String hint){
        if(hint==null)return forWord(word);
        String value=Normalizer.normalize(hint,Normalizer.Form.NFKC).strip().replaceAll("\\s+"," ");
        if(value.length()<2||value.length()>72||value.toUpperCase(Locale.ROOT).contains(word.toUpperCase(Locale.ROOT)))return forWord(word);
        return value;
    }
    private WordHints(){}
}
