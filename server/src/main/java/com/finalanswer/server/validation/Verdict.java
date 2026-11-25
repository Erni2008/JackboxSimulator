package com.finalanswer.server.validation;

/**
 * The result of one validation. {@code canonicalId} identifies the concept for originality ("joker" for "The Joker",
 * "JOKER" and "Джокер"); it is null unless the status is VALID (or DUPLICATE, which repeats an earlier canonical id).
 */
public record Verdict(ValidationStatus status,String canonicalId,Source source,boolean corrected){
    /** Where a verdict came from; verified sources always win over the AI cache and the AI judge. */
    public enum Source {RULE,DICTIONARY,VERIFIED,TYPO,KNOWN_INVALID,CACHE,AI,VOTE,FALLBACK}
    public static Verdict valid(String id,Source s){return new Verdict(ValidationStatus.VALID,id,s,false);}
    public static Verdict corrected(String id){return new Verdict(ValidationStatus.VALID,id,Source.TYPO,true);}
    public static Verdict invalid(Source s){return new Verdict(ValidationStatus.INVALID,null,s,false);}
    public static Verdict uncertain(Source s){return new Verdict(ValidationStatus.UNCERTAIN,null,s,false);}
    public static Verdict pending(){return new Verdict(ValidationStatus.PENDING,null,Source.AI,false);}
    public Verdict duplicate(){return new Verdict(ValidationStatus.DUPLICATE,canonicalId,source,corrected);}
    public boolean valid(){return status==ValidationStatus.VALID;}
}
