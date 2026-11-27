package com.finalanswer.server.validation;

import com.finalanswer.server.game.rareminds.RareText;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Verified answer lookup: exact alias keys, known wrong answers, and a conservative typo step.
 *
 * <p>Typo rules (two different legitimate answers are never merged): the typed key needs 5+ characters, the first
 * letter must match, one edit is forgiven up to 8 characters and two from 9, aliases shorter than 5 characters only
 * match exactly, and the closest answer must be strictly closer than every other answer and every known wrong answer.
 */
public final class VerifiedAnswers {
    /** sound: sound key -> answer id ("" when two answers share the sound); soundInvalid: sound keys of known wrong answers */
    private record Index(Map<String,String> alias,Set<String> invalid,Map<String,String> sound,Set<String> soundInvalid,Map<String,String> stem,Set<String> stemInvalid){}
    private final Map<String,Index> cache=new ConcurrentHashMap<>();

    private Index index(Category c){return cache.computeIfAbsent(c.id()+"#"+c.version(),k->build(c));}
    static Index build(Category c){
        Map<String,String> m=new HashMap<>();
        for(var a:c.answers())for(String alias:a.aliases()){
            String k=AnswerInput.key(AnswerInput.isLatin(alias)?AnswerInput.stripArticle(alias):alias);
            if(k.isEmpty())throw new IllegalArgumentException(c.id()+": empty alias in "+a.id());
            String prev=m.putIfAbsent(k,a.id());
            if(prev!=null&&!prev.equals(a.id()))throw new IllegalArgumentException(c.id()+": alias '"+alias+"' belongs to "+prev+" and "+a.id());
        }
        Set<String> bad=new HashSet<>();
        for(String s:c.knownInvalid()){String k=AnswerInput.key(AnswerInput.isLatin(s)?AnswerInput.stripArticle(s):s); // keyed like a player's answer ("The Boys" → "boys")
            if(m.containsKey(k))throw new IllegalArgumentException(c.id()+": '"+s+"' is both valid and known invalid");bad.add(k);}
        Map<String,String> snd=new HashMap<>();for(var e:m.entrySet()){String k=Phonetic.sound(e.getKey());if(k.length()<3)continue;String prev=snd.putIfAbsent(k,e.getValue());if(prev!=null&&!prev.equals(e.getValue()))snd.put(k,"");}
        Set<String> sbad=new HashSet<>();for(String b:bad){String k=Phonetic.sound(b);if(k.length()>=3&&!snd.containsKey(k))sbad.add(k);}
        // Russian stems of one-word answers (кот → кот, щука → щук, зелёный → зелен), for diminutives and plurals
        Map<String,String> st=new HashMap<>();for(var e:m.entrySet()){String s=Diminutive.stem(e.getKey());if(s==null)continue;String v=e.getValue()+"\u0000"+e.getKey();String prev=st.putIfAbsent(s,v);if(prev!=null&&!prev.split("\u0000")[0].equals(e.getValue()))st.put(s,"");}
        Set<String> stbad=new HashSet<>();for(String b:bad){String s=Diminutive.stem(b);if(s!=null)stbad.add(s);}
        return new Index(Map.copyOf(m),Set.copyOf(bad),Map.copyOf(snd),Set.copyOf(sbad),Map.copyOf(st),Set.copyOf(stbad));
    }

    /** Validates the whole category data (throws on conflicts); used by the loader and the content builder. */
    public static void check(Category c){build(c);}

    public ValidationStep knownInvalid(){return (c,in)->{Index ix=index(c);String k=in.key(),cy=Phonetic.cyrillic(k);
        return ix.invalid.contains(k)||cy!=null&&ix.invalid.contains(cy)||ix.soundInvalid().contains(Phonetic.sound(k))?Verdict.invalid(Verdict.Source.KNOWN_INVALID):null;};}
    public ValidationStep exact(){return (c,in)->{Index ix=index(c);String k=in.key(),id=ix.alias.get(k);
        if(id==null){String cy=Phonetic.cyrillic(k);if(cy!=null)id=ix.alias.get(cy);}
        return id==null?null:Verdict.valid(id,Verdict.Source.VERIFIED);};}
    /** Words that only name the kind of thing ("сыр чеддер", "морее черное", "роллы филадельфия", "the film Titanic"). */
    static final java.util.Set<String> GENERIC=java.util.Set.of("сыр","море","город","страна","фильм","мультфильм","мульт","кино","игра","игрушка","ролл","роллы","суп","торт","пирог","марка","бренд","фирма","группа","певица","певец","река","озеро","остров","порода","витамин","блюдо","напиток","сок","чай","кофе","соус","пицца","салат","фрукт","ягода","овощ","цветок","дерево","гриб","рыба","птица","зверь","животное","персонаж","герой","планета","созвездие","язык","спорт","танец","профессия","день","праздник","магазин","сеть","журнал","книга","сказка",
        "cheese","sea","city","country","movie","film","cartoon","game","toy","roll","rolls","soup","cake","pie","brand","band","group","singer","river","lake","island","breed","vitamin","dish","drink","juice","tea","coffee","sauce","pizza","salad","fruit","berry","vegetable","flower","tree","mushroom","fish","bird","animal","character","hero","planet","constellation","language","sport","dance","day","holiday","shop","store","book","tale");
    /** "морее черное" → черное: one generic word (spelling-tolerant) before or after a verified answer, or two words that both name the same answer. */
    public ValidationStep generic(){return (c,in)->{Index ix=index(c);String[] w=in.clean().trim().split("[\\s\\-]+");if(w.length!=2)return null;w[0]=AnswerInput.key(w[0]);w[1]=AnswerInput.key(w[1]);if(w[0].isEmpty()||w[1].isEmpty())return null;
        String a=lookup(ix,w[0]),b=lookup(ix,w[1]);
        if(a!=null&&a.equals(b))return Verdict.valid(a,Verdict.Source.VERIFIED); // "роллы филадельфия"
        String title=(c.textEn()+" "+c.textRu()).toLowerCase(java.util.Locale.ROOT).replace('ё','е');
        if(b!=null&&isGeneric(w[0],title))return Verdict.corrected(b);
        if(a!=null&&isGeneric(w[1],title))return Verdict.corrected(a);
        return null;};}
    /** The generic word must name this category's own kind of thing ("море" for "Name a sea", not "coffee" for programming languages). */
    private static boolean isGeneric(String word,String title){String cy=Phonetic.cyrillic(word);
        for(String g:GENERIC){if(!(g.equals(word)||g.equals(cy)||word.length()>=4&&Phonetic.sound(word).equals(Phonetic.sound(g))))continue;
            String stem=g.length()>4?g.substring(0,4):g;if(java.util.regex.Pattern.compile("(?U)\\b"+java.util.regex.Pattern.quote(stem)).matcher(title).find())return true;}
        return false;}
    private static String lookup(Index ix,String word){String id=ix.alias.get(word);if(id!=null)return id;String cy=Phonetic.cyrillic(word);
        if(cy!=null&&(id=ix.alias.get(cy))!=null)return id;
        String sk=Phonetic.sound(cy!=null?cy:word);if(sk.length()<3||ix.soundInvalid().contains(sk))return null;String s=ix.sound().get(sk);return s==null||s.isEmpty()?null:s;}
    /** Sound-alike match on the verified answers ("dolfin", "sinderella", "triler", "towl", "shchuka"); a sound shared by two answers or a wrong one decides nothing. */
    /** A verified answer that a Russian word may be a diminutive, plural or colloquial form of ("пультик" → пульт), as {id, alias}; null if none. The AI confirms it ({@link AiJudge#sameWord}). */
    public String[] formOf(Category c,String key){Index ix=index(c);
        for(String s:Diminutive.candidates(key)){if(ix.stemInvalid().contains(s))return null;String v=ix.stem().get(s);if(v!=null&&!v.isEmpty())return v.split("\u0000");}
        return null;}
    public ValidationStep sound(){return (c,in)->{Index ix=index(c);String k=in.key();if(k.replace(" ","").length()<3)return null;
        String cy=Phonetic.cyrillic(k);
        for(String cand:cy==null?new String[]{k}:new String[]{k,cy}){String sk=Phonetic.sound(cand);if(sk.length()<3)continue;
            if(ix.soundInvalid().contains(sk))return null;
            String id=ix.sound().get(sk);if(id!=null&&!id.isEmpty())return Verdict.corrected(id);}
        return null;};}
    public ValidationStep typo(){return (c,in)->{
        String key=in.key();if(key.length()<5)return null;
        int tol=key.length()>=9?2:1;
        Index ix=index(c);String best=null;int bestD=99;boolean tie=false;
        for(var e:ix.alias.entrySet()){String a=e.getKey();if(a.length()<5||a.charAt(0)!=key.charAt(0))continue;
            int d=RareText.distance(key,a,tol);if(d>tol)continue;
            if(d<bestD){bestD=d;best=e.getValue();tie=false;}else if(d==bestD&&!e.getValue().equals(best))tie=true;}
        if(best==null)return null;
        for(String bad:ix.invalid)if(bad.length()>=4&&RareText.distance(key,bad,bestD)<=bestD)return null; // as close to a wrong answer: undecided
        return tie?null:Verdict.corrected(best);
    };}
    public Set<String> canonicalIds(Category c){return new TreeSet<>(index(c).alias.values());}
}
