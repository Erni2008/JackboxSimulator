package com.finalanswer.server.validation;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Russian diminutive, plural and colloquial forms reduced to a stem, so "пультик", "грибочки", "щучка", "рёбрышки",
 * "зелёненький", "железяка" or "зомбаки" find the verified answer пульт, грибы, щука, ребро, зелёный, железо, зомби.
 * Only a candidate: the AI confirms that the word really is a form of that answer (футболка is not футбол). Stems keep at least three letters.
 */
final class Diminutive {
    private Diminutive(){}
    /** longest first: the first suffix that fits is removed */
    private static final List<String> SUFFIXES=List.of(
        "оньки","еньки","енький","онький","енькая","онькая","енькое","онькое","ишечки","ушечки",
        "ишки","ышки","ушки","юшки","очки","ечки","ички","ишко","ышко","ушко","ечко","очко","онька","енька","ушка","юшка","ишка","ышка","очка","ечка","ичка",
        "чики","чика","чик","ики","ика","ик","ок","ек","ёк","ки","ка","аки","яки","яка","ака");
    private static final String VOWEL_END="аяоеёыиуюьй";

    /** the stem of a verified one-word answer: final vowel / soft sign and adjective endings removed */
    static String stem(String key){
        if(key==null||key.length()<3||!key.matches("[а-яё]+"))return null;
        String k=key.replace('ё','е');
        for(String end:new String[]{"ый","ий","ой","ая","яя","ое","ее","ые","ие"})if(k.endsWith(end)&&k.length()-end.length()>=3)return k.substring(0,k.length()-end.length());
        while(k.length()>3&&VOWEL_END.indexOf(k.charAt(k.length()-1))>=0)k=k.substring(0,k.length()-1);
        return k.length()>=3?k:null;
    }

    /** possible stems of a player's word, most specific first */
    static Set<String> candidates(String key){
        Set<String> out=new LinkedHashSet<>();
        if(key==null||key.length()<4||!key.matches("[а-яё]+"))return out;
        String k=key.replace('ё','е');
        for(String suf:SUFFIXES){if(!k.endsWith(suf))continue;String s=k.substring(0,k.length()-suf.length());if(s.length()<3)continue;
            add(out,s);
            // consonant alternation before the suffix: щучка → щук, ножка → ног, ушко → ух, сердечко → серд(ц)
            char last=s.charAt(s.length()-1);String head=s.substring(0,s.length()-1);
            if(last=='ч'){add(out,head+"к");add(out,head+"ц");}else if(last=='ж')add(out,head+"г");else if(last=='ш')add(out,head+"х");
            // a vowel dropped or inserted: сердечко → серд + ц, огурчики → огурц
            add(out,s+"ц");
        }
        return out;
    }
    private static void add(Set<String> out,String s){String st=stem(s);if(st!=null)out.add(st);out.add(s);}
}
