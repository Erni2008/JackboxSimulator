package com.erni.finalanswer.cursedboxes;

public final class CursedBoxesTurnCheck {
    private static void check(boolean value,String message){if(!value)throw new AssertionError(message);}
    public static void main(String[] args){
        CursedBoxesTurn turn=new CursedBoxesTurn("local-player-1");
        for(int reset=0;reset<20;reset++){
            check(turn.shotsRemaining()==2&&!turn.active()&&turn.destroyedCrateIds()==0,"Fresh turn");
            check(!turn.select(-1)&&!turn.select(16)&&!turn.begin(),"Invalid input");
            check(turn.select(5)&&turn.begin(),"First shot");
            check(turn.shotsRemaining()==1&&turn.active()&&turn.destroyed(5),"First reservation");
            check(!turn.begin()&&!turn.select(0),"No overlapping shot or retarget");
            turn.complete();check(!turn.select(5),"Destroyed box cannot be selected");
            check(turn.select(0)&&turn.begin(),"Second distinct box");
            check(turn.shotsRemaining()==0&&!turn.ended(),"Wait for animation");
            turn.complete();check(turn.ended()&&!turn.select(2)&&!turn.begin(),"Turn ends after two shots");
            check(Integer.bitCount(turn.destroyedCrateIds())==2,"Exactly two distinct boxes");
            turn.reset();
        }
        turn.multiplayerLimit(1);turn.synchronize("correct-player",1,0);
        check(turn.shotLimit()==1&&turn.select(10)&&turn.begin(),"Trivia shooter has one shot");
        check(turn.shotsRemaining()==0,"Single cartridge reserved");turn.complete();
        check(turn.ended()&&!turn.select(11)&&!turn.begin(),"No second shot for correct respondent");
        turn.synchronize("next-correct-player",1,1<<10);
        check(turn.select(11)&&turn.begin(),"Next correct respondent gets their own shot");turn.complete();
        System.out.println("PASS: 20 resets, two distinct shots, active-shot exclusion, destroyed-slot rejection, turn completion/reset and one-shot trivia synchronization");
    }
}
