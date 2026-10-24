package com.erni.finalanswer.impostor;

import com.erni.finalanswer.gameplay.impostor.ImpostorPhase;
import java.util.*;

/** Public final-act presentation data only. No private ballots or hidden role map. */
public record FinalActSnapshot(String sessionId,ImpostorPhase phase,long phaseStartedAt,long deadline,
        long revealStartedAt,int submitted,int eligible,String sequenceId,List<String> stampTargets,
        Map<String,Integer> counts,List<String> leaders,String impostorId,String outcome) {
    public FinalActSnapshot {
        Objects.requireNonNull(sessionId);Objects.requireNonNull(phase);Objects.requireNonNull(sequenceId);
        stampTargets=List.copyOf(stampTargets);counts=Map.copyOf(counts);leaders=List.copyOf(leaders);
        if(submitted<0 || eligible<2 || eligible>8 || submitted>eligible || stampTargets.size()>eligible)
            throw new IllegalArgumentException("Invalid final voting aggregate");
    }
}
