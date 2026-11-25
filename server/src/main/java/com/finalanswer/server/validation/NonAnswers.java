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
