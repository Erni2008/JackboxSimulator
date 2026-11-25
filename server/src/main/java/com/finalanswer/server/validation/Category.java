package com.finalanswer.server.validation;

import java.util.*;

/**
 * One category ("Name a Batman villain"). Verified answers are canonical concepts with aliases in any language;
 * {@code knownInvalid} lists tempting wrong answers ("Superman"); {@code rule} drives WORD_RULE and NUMERIC_RULE
 * categories. Nothing here is ever sent to phones.
 *
 * @param allowUnknown  an answer missing from the verified set is not automatically wrong (sent to AI or a vote)
 * @param exhaustive    the verified set is complete and authoritative: anything else is INVALID
 * @param version       content version; cached AI verdicts of an older version are ignored
 */
public record Category(String id,int version,Type type,String group,String textEn,String textRu,String criteriaEn,String criteriaRu,
                       Rule rule,List<Answer> answers,List<String> knownInvalid,boolean allowUnknown,boolean exhaustive){
    public enum Type {WORD_RULE,NUMERIC_RULE,KNOWLEDGE,GEOGRAPHY,SEMANTIC,ASSOCIATION,CREATIVE}

    /** A verified answer: canonical id, labels for the reveal, and every accepted spelling. */
    public record Answer(String id,String labelEn,String labelRu,List<String> aliases){
        public Answer{aliases=List.copyOf(aliases);if(!id.matches("[a-z0-9_]{1,48}"))throw new IllegalArgumentException("bad canonical id "+id);}
    }

    /**
     * A deterministic rule. WORD_RULE kinds: CONTAINS, STARTS_WITH, ENDS_WITH, LENGTH, PALINDROME (value = substring,
     * {@code n} = letters); NUMERIC_RULE kinds: PRIME, DIVISIBLE_BY, SQUARE (n = divisor). {@code lang} is the language
     * the word must be in ("en" or "ru").
     */
    public record Rule(String kind,String value,int n,String lang){}

    public Category{
        answers=List.copyOf(answers);knownInvalid=List.copyOf(knownInvalid);
        if(!id.matches("[a-z0-9_]{1,64}"))throw new IllegalArgumentException("bad category id "+id);
        if((type==Type.WORD_RULE||type==Type.NUMERIC_RULE)&&rule==null)throw new IllegalArgumentException(id+": rule category needs a rule");
        if(exhaustive&&allowUnknown)throw new IllegalArgumentException(id+": exhaustive and allowUnknown contradict");
        Set<String> ids=new HashSet<>();for(Answer a:answers)if(!ids.add(a.id()))throw new IllegalArgumentException(id+": duplicate answer "+a.id());
    }
    public String text(String lang){return "ru".equals(lang)?textRu:textEn;}
    public Answer answer(String canonicalId){for(Answer a:answers)if(a.id().equals(canonicalId))return a;return null;}
}
