package com.erni.finalanswer.gameplay.impostor;

/** Public room configuration; no word, role or per-match state. */
public record ImpostorSettings(int roundCount,int discussionSeconds,int votingSeconds,int clueSeconds,
        String wordCategory,boolean soundEnabled,boolean visualEffectsEnabled,boolean reducedMotion) {
    public ImpostorSettings {
        // The established clue papers have three slots. Support shorter games without a second history system.
        if(roundCount<1||roundCount>3||discussionSeconds<5||discussionSeconds>300||votingSeconds<5||votingSeconds>120
                ||clueSeconds<5||clueSeconds>120||!"DEFAULT".equals(wordCategory))throw new IllegalArgumentException("Invalid Impostor settings");
    }
    public static ImpostorSettings defaults(){return new ImpostorSettings(3,30,20,10,"DEFAULT",true,true,false);}
}
