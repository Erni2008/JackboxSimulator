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
    private record Index(Map<String,String> alias,Set<String> invalid){}
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
        for(String s:c.knownInvalid()){String k=AnswerInput.key(s);if(m.containsKey(k))throw new IllegalArgumentException(c.id()+": '"+s+"' is both valid and known invalid");bad.add(k);}
        return new Index(Map.copyOf(m),Set.copyOf(bad));
    }

    /** Validates the whole category data (throws on conflicts); used by the loader and the content builder. */
    public static void check(Category c){build(c);}

    public ValidationStep knownInvalid(){return (c,in)->index(c).invalid.contains(in.key())?Verdict.invalid(Verdict.Source.KNOWN_INVALID):null;}
    public ValidationStep exact(){return (c,in)->{String id=index(c).alias.get(in.key());return id==null?null:Verdict.valid(id,Verdict.Source.VERIFIED);};}
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
