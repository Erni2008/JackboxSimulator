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
    /** Identifies model + quantization + prompt version; cached verdicts of another version are ignored. */
    String modelVersion();
}
