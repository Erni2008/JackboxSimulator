package com.finalanswer.server.game.rareminds;

/**
 * Decides whether a typed answer is a valid answer to a question and which canonical concept it is. Validity is
 * separate from rarity: a validator never scores. The curated implementation is {@link CuratedAnswerValidator}; an
 * external verifier can be chained in front of it later, but nothing here asks a language model.
 */
public interface AnswerValidator {
    enum Status {
        /** matches an accepted answer (exactly or through an alias) */
        VALID,
        /** close enough to exactly one accepted answer to be read as a typo of it */
        VALID_TYPO,
        /** nothing typed */
        EMPTY,
        /** not an accepted answer */
        INVALID,
        /** within typo distance of two different answers: refused rather than guessed */
        UNCERTAIN
    }
    record Result(Status status,String answerId,String key){
        public boolean valid(){return status==Status.VALID||status==Status.VALID_TYPO;}
        static Result of(Status s,String key){return new Result(s,"",key);}
    }
    Result validate(RareQuestion question,String typed);
}
