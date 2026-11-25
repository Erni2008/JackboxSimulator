package com.finalanswer.server.validation;

import java.util.List;

/**
 * Optional semantic judge for answers the verified data cannot decide. Implementations classify, they never chat:
 * every item gets VALID, INVALID or UNCERTAIN. Player text is data, never instructions. Any failure throws, and the
 * engine then treats the answers as UNCERTAIN (a vote decides), so the game never depends on the judge.
 */
public interface AiJudge {
    record Item(String submissionId,String answer){}
    record Result(String submissionId,ValidationStatus verdict,String canonicalAnswer){}
    /** @param knownIds verified canonical ids the judge may map an answer to */
    List<Result> judge(Category category,String lang,List<Item> items,List<String> knownIds) throws Exception;
    /**
     * Judge one answer without blocking the caller. Completes with the result, or exceptionally on failure. The
     * default runs {@link #judge} on the common pool; {@link LlamaCppJudge} overrides it with a bounded queue.
     */
    default java.util.concurrent.CompletableFuture<Result> judgeOne(Category category,String lang,Item item,List<String> knownIds){
        return java.util.concurrent.CompletableFuture.supplyAsync(()->{
            try{return judge(category,lang,List.of(item),knownIds).get(0);}catch(Exception e){throw new java.util.concurrent.CompletionException(e);}});
    }
    /** Identifies model + quantization + prompt version; cached verdicts of another version are ignored. */
    String modelVersion();
}
