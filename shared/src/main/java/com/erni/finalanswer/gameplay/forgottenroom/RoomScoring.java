package com.erni.finalanswer.gameplay.forgottenroom;

import java.util.*;

/**
 * Scoring by marks. A player drops up to {@link #MARKS} marks on places in the changed room. Every real change that has
 * at least one mark on one of its places scores one point (a move counts once even if both ends are marked); a mark on
 * an unchanged place scores nothing. No negative points.
 */
public final class RoomScoring {
    /** How many marks a player may hold at once. */
    public static final int MARKS=5;
    /** Points per change found; change it here only. */
    public record Rules(int perChange){public static final Rules DEFAULT=new Rules(1);}
    /** One mark on one place. */
    public record Guess(String slotId){public Guess{Objects.requireNonNull(slotId);}}
    /** Whether one change was found by one player. */
    public enum Hit {FOUND,MISSED}
    public record Result(int points,int correct,int wrong,List<Hit> perChange){public Result{perChange=List.copyOf(perChange);}}

    private RoomScoring(){}

    public static Result score(List<RoomChange> changes,List<Guess> marks,Rules rules){
        Hit[] hits=new Hit[changes.size()];Arrays.fill(hits,Hit.MISSED);
        Set<String> seen=new HashSet<>();int wrong=0;
        for(Guess mark:marks){
            if(!seen.add(mark.slotId()))continue; // the same place twice never counts twice
            boolean matched=false;
            for(int i=0;i<changes.size();i++)if(changes.get(i).slots().contains(mark.slotId())){hits[i]=Hit.FOUND;matched=true;}
            if(!matched)wrong++;
        }
        int correct=0;for(Hit h:hits)if(h==Hit.FOUND)correct++;
        return new Result(correct*rules.perChange(),correct,wrong,Arrays.asList(hits));
    }
}
