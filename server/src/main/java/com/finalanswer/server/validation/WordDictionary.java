package com.finalanswer.server.validation;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.zip.GZIPInputStream;

/**
 * Word lists for WORD_RULE categories, loaded lazily from the classpath ({@code /validation/words_<lang>.txt.gz}, one
 * word per line). English ships Webster's Second International (1934, public domain; see licenses/). A language
 * without a list knows no words, so its rule-keeping answers go to the vote instead of being rejected.
 */
public final class WordDictionary {
    private final Map<String,Set<String>> lists=new HashMap<>();
    private final Map<String,Set<String>> fixed;

    public WordDictionary(){fixed=null;}
    /** Tests: fixed word lists keyed by language. */
    public WordDictionary(Map<String,Set<String>> words){fixed=Map.copyOf(words);}

    public boolean knows(String lang,String key){
        Set<String> w=words(lang);if(w.contains(key))return true;
        if(!"en".equals(lang))return false;
        for(String suf:new String[]{"s","es","ed","ing","ly"})if(key.length()>suf.length()+2&&key.endsWith(suf)&&w.contains(key.substring(0,key.length()-suf.length())))return true;
        if(key.endsWith("ies")&&w.contains(key.substring(0,key.length()-3)+"y"))return true;
        return false;
    }
    private synchronized Set<String> words(String lang){
        if(fixed!=null)return fixed.getOrDefault(lang,Set.of());
        return lists.computeIfAbsent(lang,WordDictionary::load);
    }
    private static Set<String> load(String lang){
        try(InputStream in=WordDictionary.class.getResourceAsStream("/validation/words_"+lang+".txt.gz")){
            if(in==null)return Set.of();
            Set<String> s=new HashSet<>(300_000);
            try(BufferedReader r=new BufferedReader(new InputStreamReader(new GZIPInputStream(in),StandardCharsets.UTF_8))){
                for(String line;(line=r.readLine())!=null;){String k=AnswerInput.key(line);if(!k.isEmpty())s.add(k);}}
            return Collections.unmodifiableSet(s);
        }catch(IOException e){System.err.println("[validation] word list "+lang+" unreadable: "+e.getMessage());return Set.of();}
    }
}
