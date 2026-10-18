package com.erni.finalanswer.gameplay.impostor;

import java.util.*;

/** Completed immutable match data. Serialized publicly only in RESULT, never during voting. */
public record ImpostorMatchResult(String matchId,long completedAt,String outcome,String impostorId,
        Side winningSide,List<Participant> participants,Map<String,String> ballots,List<String> abstentions,
        List<Map<String,String>> clueRounds,List<String> mostVoted,Statistics statistics) {
    public enum Side { INNOCENTS, IMPOSTOR }
    public record Participant(String playerId,String role,boolean winner,int votesReceived) {}
    public record Statistics(int activeParticipants,int completedRounds,int submittedClues,int validVotes,int abstentions) {}
    public ImpostorMatchResult {
        participants=List.copyOf(participants);ballots=Collections.unmodifiableMap(new LinkedHashMap<>(ballots));
        abstentions=List.copyOf(abstentions);clueRounds=clueRounds.stream().map(Map::copyOf).toList();mostVoted=List.copyOf(mostVoted);
    }
    public Participant participant(String id){return participants.stream().filter(p->p.playerId().equals(id)).findFirst().orElse(null);}
}
