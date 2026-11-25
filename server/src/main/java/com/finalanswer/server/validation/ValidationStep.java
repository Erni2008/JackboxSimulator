package com.finalanswer.server.validation;

/**
 * One deterministic stage of the validation pipeline. A step returns a verdict when it can decide, or null to pass the
 * answer on to the next step. Steps must be fast, thread-safe and free of I/O after construction.
 */
@FunctionalInterface
public interface ValidationStep {
    Verdict check(Category category,AnswerInput input);
}
