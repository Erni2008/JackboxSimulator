package com.finalanswer.server.validation;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Answers that never fit any category: "не знаю", "хз", "idk", "something", keyboard mashing, a lone letter.
 * They are rejected at once (0 points, no AI, no vote). The list lives in {@code /validation/non_answers.txt}.
 */
final class NonAnswers {
    static final Set<String> KEYS=load();
    static final ValidationStep STEP=(c,in)->is(c,in)?Verdict.invalid(Verdict.Source.KNOWN_INVALID):null;

    private NonAnswers(){}
    static boolean is(Category c,AnswerInput in){
        String k=in.key();
        if(k.isEmpty()||KEYS.contains(k))return true;
        if(c.type()==Category.Type.NUMERIC_RULE)return false;
        String letters=k.replaceAll("[^\\p{L}]","");
        if(letters.length()<2)return true;                               // "?", "7", "а"
        if(letters.chars().distinct().count()==1&&letters.length()>=3)return true; // "аааа", "zzz"
        // keyboard mash, decided at once instead of waiting for the AI: a word of 3+ letters with no vowel ("qwzx", "ткпр"),
        // or 6+ consonants in a row ("sdfghjk")
        // (a word typed in capitals is an abbreviation, never mash: SQL, GLSL)
        java.util.Set<String> caps=new java.util.HashSet<>();for(String w:in.clean().split("[^\\p{L}]+"))if(w.length()>=2&&w.equals(w.toUpperCase(java.util.Locale.ROOT)))caps.add(w.toLowerCase(java.util.Locale.ROOT));
        for(String w:k.split("[^\\p{L}]+")){if(w.length()<3||caps.contains(w))continue;String lw=w.toLowerCase(java.util.Locale.ROOT);
            if(!lw.matches(".*[aeiouyаеёиоуыэюяіїєáéíóúäöü].*"))return true;
            if(lw.matches(".*[bcdfghjklmnpqrstvwxzбвгджзйклмнпрстфхцчшщ]{6,}.*"))return true;}
        return false;
    }
    private static Set<String> load(){
        Set<String> s=new HashSet<>();
        try(InputStream in=NonAnswers.class.getResourceAsStream("/validation/non_answers.txt")){
            if(in==null)return Set.of();
            for(String line:new String(in.readAllBytes(),StandardCharsets.UTF_8).split("\\R")){
                if(line.isBlank()||line.startsWith("#"))continue;String k=AnswerInput.key(line.trim());if(!k.isEmpty())s.add(k);}
        }catch(IOException e){System.err.println("[validation] non_answers.txt unreadable");}
        return Set.copyOf(s);
    }
}
