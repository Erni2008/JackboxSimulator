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
    static final String VOWELS="aeiouаеёиоуыэюя";
    static boolean keeps(Category.Rule r,String key){
        String v=r.value()==null?"":AnswerInput.key(r.value());
        return switch(r.kind()){
            case "CONTAINS"->key.contains(v)&&!key.equals(v);
            case "STARTS_WITH"->key.startsWith(v)&&key.length()>v.length();
            case "ENDS_WITH"->key.endsWith(v)&&key.length()>v.length();
            case "LENGTH"->key.codePointCount(0,key.length())==r.n();
            case "PALINDROME"->key.length()>=3&&new StringBuilder(key).reverse().toString().equals(key);
            case "NOT_CONTAINS"->!key.contains(v);
            case "STARTS_ENDS"->{String[] p=r.value().split("\\|");p[0]=AnswerInput.key(p[0]);p[1]=AnswerInput.key(p[1]);yield key.length()>p[0].length()+p[1].length()-1&&key.startsWith(p[0])&&key.endsWith(p[1]);} // value "б|а"
            case "COUNT_LETTER"->key.chars().filter(x->x==v.charAt(0)).count()==r.n(); // exactly n of that letter
            case "STARTS_TWO_VOWELS"->key.length()>=3&&VOWELS.indexOf(key.charAt(0))>=0&&VOWELS.indexOf(key.charAt(1))>=0;
            case "DOUBLE_LETTER"->{boolean d=false;for(int i=1;i<key.length();i++)if(key.charAt(i)==key.charAt(i-1)){d=true;break;}yield d;}
            case "REPEAT_LETTER"->{boolean d=false;for(int i=0;i<key.length()&&!d;i++){char ch=key.charAt(i);d=key.chars().filter(x->x==ch).count()>=r.n();}yield d;}
            case "MAX_LENGTH"->key.codePointCount(0,key.length())<=r.n()&&key.length()>=2;
            case "MIDDLE_LETTER"->key.length()>=3&&key.substring(1,key.length()-1).contains(v); // the letter inside the word, not first or last
            case "CONSONANT_RUN"->{int run=0,best=0;for(char ch:key.toCharArray()){boolean cons=Character.isLetter(ch)&&VOWELS.indexOf(ch)<0&&ch!='ь'&&ch!='ъ';run=cons?run+1:0;best=Math.max(best,run);}yield best>=r.n();}
            case "SAME_ENDS"->key.length()>=2&&key.charAt(0)==key.charAt(key.length()-1);
            case "STARTS_VOWEL"->!key.isEmpty()&&VOWELS.indexOf(key.charAt(0))>=0;
            case "STARTS_CONSONANT"->!key.isEmpty()&&Character.isLetter(key.charAt(0))&&VOWELS.indexOf(key.charAt(0))<0&&"ъьй".indexOf(key.charAt(0))<0;
            default->throw new IllegalArgumentException("unknown word rule "+r.kind());
        };
    }

    /** Optional range in the rule value: "100-999" (anything after "/" is a rule parameter). */
    static boolean inRange(long n,String v){
        if(v==null)return true;String rng=v.split("/")[0];if(!rng.matches("\\d+-\\d+"))return true;
        String[] p=rng.split("-");return n>=Long.parseLong(p[0])&&n<=Long.parseLong(p[1]);
    }

    public static ValidationStep numbers(){return (c,in)->{
        if(c.type()!=Category.Type.NUMERIC_RULE)return null;
        String k=in.key();if(!k.matches("[0-9]{1,15}"))return Verdict.invalid(Verdict.Source.RULE);
        long n=Long.parseLong(k);Category.Rule r=c.rule();
        boolean ok=switch(r.kind()){
            case "PRIME"->n>1&&BigInteger.valueOf(n).isProbablePrime(40);
            case "DIVISIBLE_BY"->n>0&&r.n()>0&&n%r.n()==0;
            case "SQUARE"->{long s=(long)Math.sqrt((double)n);while(s*s>n)s--;while((s+1)*(s+1)<=n)s++;yield n>0&&s*s==n;}
            case "NUM_PALINDROME"->k.length()>=2&&new StringBuilder(k).reverse().toString().equals(k);
            case "HAS_DIGIT"->k.indexOf((char)('0'+r.n()))>=0;
            case "DIGIT_SUM"->k.chars().map(x->x-'0').sum()==r.n();
            case "FIRST_GT_SECOND"->k.length()>=2&&k.charAt(0)>k.charAt(1);
            case "DIVISIBLE_NOT"->{String[] p=(r.value()==null?"":r.value()).split("/");long not=p.length>1?Long.parseLong(p[1]):0;yield n>0&&r.n()>0&&n%r.n()==0&&(not==0||n%not!=0);}
            default->throw new IllegalArgumentException("unknown numeric rule "+r.kind());
        };
        ok=ok&&inRange(n,r.value())&&!(k.length()>1&&k.charAt(0)=='0');
        return ok?Verdict.valid("num:"+n,Verdict.Source.RULE):Verdict.invalid(Verdict.Source.RULE);
    };}
}
