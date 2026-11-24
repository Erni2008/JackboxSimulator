package com.finalanswer.server.game.rareminds;

import java.util.*;

/**
 * Validation against the curated bank: every alias of every answer is reduced to a {@link RareText#key}; an exact key
 * match is VALID. Fuzzy matching is deliberately narrow so two different legitimate answers are never merged:
 * <ul><li>only typed keys of 5+ characters are considered, and only against aliases of 5+ characters;</li>
 * <li>1 edit is forgiven up to 8 characters, 2 from 9 (never more than the question's own tolerance);</li>
 * <li>the closest answer must be strictly closer than every other answer, otherwise the result is UNCERTAIN.</li></ul>
 */
public final class CuratedAnswerValidator implements AnswerValidator {
    private final Map<String,Map<String,String>> index=new HashMap<>();

    public CuratedAnswerValidator(Collection<RareQuestion> questions){for(RareQuestion q:questions)index.put(q.id(),build(q));}

    /** Alias key → answer id; a key claimed by two answers of one question is a data error. */
    static Map<String,String> build(RareQuestion q){
        Map<String,String> m=new HashMap<>();
        for(var a:q.answers())for(String alias:a.aliases()){
            String k=RareText.key(alias);if(k.isEmpty())throw new IllegalArgumentException("empty alias in "+q.id()+"/"+a.id());
            String prev=m.putIfAbsent(k,a.id());
            if(prev!=null&&!prev.equals(a.id()))throw new IllegalArgumentException("alias '"+alias+"' belongs to both "+prev+" and "+a.id()+" in "+q.id());
        }
        return m;
    }

    @Override public Result validate(RareQuestion q,String typed){
        String key=RareText.key(typed);
        if(key.isEmpty())return Result.of(Status.EMPTY,key);
        Map<String,String> m=index.computeIfAbsent(q.id(),x->build(q));
        String exact=m.get(key);if(exact!=null)return new Result(Status.VALID,exact,key);
        if(key.length()<5||q.typoTolerance()==0)return Result.of(Status.INVALID,key);
        int tol=Math.min(q.typoTolerance(),key.length()>=9?2:1);
        String best=null;int bestD=tol+1;boolean tie=false;
        for(var e:m.entrySet()){
            if(e.getKey().length()<5)continue;
            int d=RareText.distance(key,e.getKey(),tol);if(d>tol)continue;
            if(d<bestD){best=e.getValue();bestD=d;tie=false;}
            else if(d==bestD&&!e.getValue().equals(best))tie=true;
        }
        if(best==null)return Result.of(Status.INVALID,key);
        if(tie)return Result.of(Status.UNCERTAIN,key);
        return new Result(Status.VALID_TYPO,best,key);
    }

    /**
     * Live monitoring only (never scoring): which answers a half-typed draft could become. A validated draft is its
     * answer; otherwise every answer with an alias starting with the draft (4+ characters, at most 4 candidates).
     */
    public Set<String> candidates(RareQuestion q,String draft){
        Result r=validate(q,draft);if(r.valid())return Set.of(r.answerId());
        String key=r.key();if(key.length()<4)return Set.of();
        Set<String> out=new TreeSet<>();
        for(var e:index.computeIfAbsent(q.id(),x->build(q)).entrySet())if(e.getKey().startsWith(key)){out.add(e.getValue());if(out.size()>4)return Set.of();}
        return out;
    }
}
