package com.finalanswer.server.validation;

import java.math.BigInteger;

/**
 * Deterministic WORD_RULE and NUMERIC_RULE validation. A word that breaks the rule is INVALID. A word that keeps the
 * rule is VALID only when the dictionary of that language knows it (English inflections -s/-es/-ed/-ing of a known
 * word count); otherwise the step passes, and the engine sends it on to the cache, the AI judge or a vote.
 */
public final class RuleSteps {
    private RuleSteps(){}

    public static ValidationStep words(WordDictionary dictionary){return (c,in)->{
        if(c.type()!=Category.Type.WORD_RULE)return null;
        Category.Rule r=c.rule();String key=in.key();
        if(!key.chars().allMatch(Character::isLetter))return Verdict.invalid(Verdict.Source.RULE); // one word, letters only
        if("en".equals(r.lang())&&!in.latin()||"ru".equals(r.lang())&&in.latin())return Verdict.invalid(Verdict.Source.RULE);
        if(!keeps(r,key))return Verdict.invalid(Verdict.Source.RULE);
        return dictionary.knows(r.lang(),key)?Verdict.valid("word:"+key,Verdict.Source.DICTIONARY):null;
    };}
    static boolean keeps(Category.Rule r,String key){
        String v=r.value()==null?"":AnswerInput.key(r.value());
        return switch(r.kind()){
            case "CONTAINS"->key.contains(v)&&!key.equals(v);
            case "STARTS_WITH"->key.startsWith(v)&&key.length()>v.length();
            case "ENDS_WITH"->key.endsWith(v)&&key.length()>v.length();
            case "LENGTH"->key.codePointCount(0,key.length())==r.n();
            case "PALINDROME"->key.length()>=3&&new StringBuilder(key).reverse().toString().equals(key);
            default->throw new IllegalArgumentException("unknown word rule "+r.kind());
        };
    }

    public static ValidationStep numbers(){return (c,in)->{
        if(c.type()!=Category.Type.NUMERIC_RULE)return null;
        String k=in.key();if(!k.matches("[0-9]{1,15}"))return Verdict.invalid(Verdict.Source.RULE);
        long n=Long.parseLong(k);Category.Rule r=c.rule();
        boolean ok=switch(r.kind()){
            case "PRIME"->n>1&&BigInteger.valueOf(n).isProbablePrime(40);
            case "DIVISIBLE_BY"->n>0&&r.n()>0&&n%r.n()==0;
            case "SQUARE"->{long s=(long)Math.sqrt((double)n);while(s*s>n)s--;while((s+1)*(s+1)<=n)s++;yield n>0&&s*s==n;}
            default->throw new IllegalArgumentException("unknown numeric rule "+r.kind());
        };
        return ok?Verdict.valid("num:"+n,Verdict.Source.RULE):Verdict.invalid(Verdict.Source.RULE);
    };}
}
