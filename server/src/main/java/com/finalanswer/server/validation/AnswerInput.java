package com.finalanswer.server.validation;

import com.finalanswer.server.game.rareminds.RareText;
import java.util.Locale;

/**
 * One player answer after sanitizing and normalization. {@code clean} is the display form (NFKC, controls removed,
 * whitespace collapsed); {@code key} is the comparison form. English normalization (dropping a leading "the/a/an")
 * is applied only to Latin-script input, never to Russian text.
 */
public record AnswerInput(String raw,String clean,String key,boolean latin){
    public static final int MAX_LENGTH=40;

    /** @return null when nothing usable was typed or the text is longer than {@link #MAX_LENGTH} code points */
    public static AnswerInput of(String raw){
        String c=RareText.clean(raw);
        if(c==null||c.isEmpty()||c.codePointCount(0,c.length())>MAX_LENGTH)return null;
        boolean latin=isLatin(c);
        String body=latin?stripArticle(c):c;
        String k=key(body);
        if(k.isEmpty())return null;
        return new AnswerInput(raw,c,k,latin);
    }
    /** Comparison key: lower case, ё→е, accents and punctuation removed ("B.M.W." and "bmw" share one key). */
    public static String key(String text){return RareText.key(text);}

    static String stripArticle(String s){
        String low=s.toLowerCase(Locale.ROOT);
        for(String a:new String[]{"the ","an ","a "})if(low.startsWith(a)&&s.length()>a.length()+1)return s.substring(a.length());
        return s;
    }
    static boolean isLatin(String s){
        int latin=0,cyr=0;
        for(int i=0;i<s.length();i++){Character.UnicodeScript sc=Character.UnicodeScript.of(s.charAt(i));
            if(sc==Character.UnicodeScript.LATIN)latin++;else if(sc==Character.UnicodeScript.CYRILLIC)cyr++;}
        return latin>0&&latin>=cyr;
    }
}
