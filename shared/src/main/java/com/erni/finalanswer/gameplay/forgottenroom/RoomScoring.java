package com.erni.finalanswer.gameplay.forgottenroom;

import java.util.*;

/**
 * Transparent scoring. A player points at a place and names a change type. Each real change is credited at most once
 * per player: the best guess touching any of its places wins (exact type beats partial). No negative points.
 */
public final class RoomScoring {
    /** Point values; change them here only. */
    public record Rules(int exact,int partial){public static final Rules DEFAULT=new Rules(100,25);}
    /** One answer: a place in the room and the change the player believes happened there. */
    public record Guess(String slotId,ChangeType type){public Guess{Objects.requireNonNull(slotId);Objects.requireNonNull(type);}}
    /** How one change was read by one player. */
    public enum Hit {EXACT,PARTIAL,MISSED}
    public record Result(int points,int correct,int partial,int wrong,List<Hit> perChange){public Result{perChange=List.copyOf(perChange);}}

    private RoomScoring(){}

    public static Result score(List<RoomChange> changes,List<Guess> guesses,Rules rules){
        Hit[] hits=new Hit[changes.size()];Arrays.fill(hits,Hit.MISSED);
        Set<String> seenSlots=new HashSet<>();int wrong=0;
        for(Guess guess:guesses){
            if(!seenSlots.add(guess.slotId())){continue;} // the same place twice never counts twice
            boolean matched=false;
            for(int i=0;i<changes.size();i++){
                RoomChange change=changes.get(i);if(!change.slots().contains(guess.slotId()))continue;
                matched=true;Hit hit=change.type()==guess.type()?Hit.EXACT:Hit.PARTIAL;
                if(hit==Hit.EXACT||hits[i]==Hit.MISSED)hits[i]=hit;
            }
            if(!matched)wrong++;
        }
        int correct=0,partial=0;for(Hit hit:hits){if(hit==Hit.EXACT)correct++;else if(hit==Hit.PARTIAL)partial++;}
        return new Result(correct*rules.exact()+partial*rules.partial(),correct,partial,wrong,Arrays.asList(hits));
    }
}
