package com.finalanswer.server.game;

import com.erni.finalanswer.gameplay.impostor.ImpostorMatchResult.Side;

/** Outcome interpretation is independent of vote counting and presentation. */
public record ImpostorResultPolicy(boolean noConsensusImpostorWins) {
    public static ImpostorResultPolicy configured(){
        String value=System.getProperty("impostor.noConsensusImpostorWins",System.getenv().getOrDefault("IMPOSTOR_NO_CONSENSUS_IMPOSTOR_WINS","true"));
        if(!value.equalsIgnoreCase("true")&&!value.equalsIgnoreCase("false"))throw new IllegalArgumentException("Invalid no-consensus policy");
        return new ImpostorResultPolicy(Boolean.parseBoolean(value));
    }
    public Side winner(FinalVoting.Outcome outcome){return switch(outcome){case IMPOSTOR_CAUGHT->Side.INNOCENTS;case IMPOSTOR_ESCAPED->Side.IMPOSTOR;case NO_CONSENSUS->noConsensusImpostorWins?Side.IMPOSTOR:Side.INNOCENTS;};}
}
