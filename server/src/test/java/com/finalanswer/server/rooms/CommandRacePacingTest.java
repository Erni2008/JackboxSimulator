package com.finalanswer.server.rooms;
import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
/** Pacing tiers, procedural boards, unambiguous comparisons and memory fairness. */
class CommandRacePacingTest {
    static int evaluate(String option){String[] parts=option.split(" ");int a=Integer.parseInt(parts[0]),b=Integer.parseInt(parts[2]);return switch(parts[1]){case "+"->a+b;case "−"->a-b;case "×"->a*b;default->throw new AssertionError(option);};}

    @Test void comparisonAlwaysHasExactlyOneCorrectOption(){
        for(int seed=0;seed<5000;seed++)for(int score:List.of(0,10,19)){
            var g=new CommandRace(seed,0);var p=new CommandRace.Player();p.score=score;var t=g.generate("COMPARISON",new Random(seed),p,0);CommandRace.validateGenerated(t);
            assertEquals(4,t.options.size());List<Integer> values=t.options.stream().map(CommandRacePacingTest::evaluate).toList();assertEquals(4,new HashSet<>(values).size(),t.options.toString());
            String rule=t.instruction;int answer=Integer.parseInt(t.answer),chosen=values.get(answer);
            for(int i=0;i<4;i++){if(i==answer)continue;int other=values.get(i);
                if(rule.equals("SELECT LARGEST"))assertTrue(chosen>other);
                else if(rule.equals("SELECT SMALLEST"))assertTrue(chosen<other);
                else if(rule.startsWith("CLOSEST TO ")){int target=Integer.parseInt(rule.substring(11));assertTrue(Math.abs(chosen-target)<Math.abs(other-target),rule+" "+values);}
                else if(rule.startsWith("EQUAL TO ")){int target=Integer.parseInt(rule.substring(9));assertEquals(target,chosen);assertNotEquals(target,other);}
                else if(rule.equals("SELECT THE ONLY EVEN RESULT")){assertEquals(0,chosen%2);assertNotEquals(0,other%2);}
                else fail(rule);}
        }
    }
    @Test void circuitBoardsAreProceduralSolvableAndNeverPreSolved(){
        Set<String> boards=new HashSet<>();
        for(int seed=0;seed<2000;seed++){var g=new CommandRace(seed,0);var p=new CommandRace.Player();p.score=seed%20;var t=g.generate("CIRCUIT",new Random(seed),p,0);CommandRace.validateGenerated(t);assertFalse(CommandRace.connected(t.cells));assertTrue(CommandRace.solvable(t.cells.clone(),0));boards.add(Arrays.toString(t.cells));}
        assertTrue(boards.size()>1500,"distinct boards: "+boards.size());
    }
    @Test void lateCircuitsUseLongerRoutes(){
        for(int seed=0;seed<500;seed++){int[] cells=CommandRace.circuitBoard(new Random(seed),5);int used=0;for(int c:cells)if(c!=0)used++;assertTrue(used>=5);}
    }
    @Test void pacingTiersFollowOwnProgressAndShiftTheMix(){
        var g=new CommandRace(77,0);Map<Integer,Map<String,Integer>> mix=new HashMap<>();
        for(int score:List.of(0,17)){var counts=new HashMap<String,Integer>();for(int serial=1;serial<=4000;serial++){var p=new CommandRace.Player();p.serial=serial;p.score=score;g.family(p);counts.merge(p.category,1,Integer::sum);}mix.put(score,counts);}
        assertTrue(mix.get(0).get("MECHANICAL")>mix.get(17).get("MECHANICAL"),mix.toString());
        assertTrue(mix.get(0).get("REACTION")<mix.get(17).get("REACTION"),mix.toString());
        assertEquals(0,CommandRace.tier(new CommandRace.Player()));
        var a=new CommandRace.Player();var b=new CommandRace.Player();for(int s=0;s<20;s++){a.score=b.score=s;a.serial=b.serial=s+3;assertEquals(g.family(a),g.family(b));assertEquals(g.level(a),g.level(b));}
        var early=new CommandRace.Player();var late=new CommandRace.Player();late.score=16;assertTrue(g.level(early)<=g.level(late));
    }
    @Test void missedRecallForfeitsMemoryInsteadOfLoopingTheSameQuestion(){
        for(int score:List.of(4,18)){
            var g=new CommandRace(5,0);g.start(0);var p=g.player("a",0);p.score=score;p.memory=new CommandRace.Memory("ANIMAL",List.of("OWL"),score);g.next("a",p,1000);assertEquals("RECALL",p.family);
            String wrong=""+((Integer.parseInt(p.task.answer)+1)%p.task.options.size());p.readyAt=0;p.revealUntil=0;
            assertTrue(g.action("a","miss",g.taskId(p),"TOUCH_PANEL","SELECT",wrong,2000));assertEquals("WRONG COMMAND",p.feedback);assertNull(p.memory);assertEquals(score,p.score);
            g.tick(3000);assertNotEquals("RECALL",p.family);
            if(score>=17)assertNull(p.memory,"no unrecallable memory near the finish");else{assertEquals("NUMBER_MEMORY",p.family);assertNotNull(p.memory);assertTrue(p.memory.due()<20);}
        }
    }
    @Test void replacementAfterFailureIsAFreshComparableChallenge(){
        for(int seed=0;seed<200;seed++){var g=new CommandRace(seed,0);g.start(0);var p=g.player("a",0);p.family="ENTER_CODE";p.task=g.generate("ENTER_CODE",new Random(seed),p,0);p.readyAt=0;p.revealUntil=0;String before=p.task.instruction;
            assertTrue(g.action("a","wrong",g.taskId(p),"BIG_BUTTON","PRESS","",1000));g.tick(2000);assertEquals("ENTER_CODE",p.family);assertNotEquals(before,p.task.instruction);assertEquals(0,p.score);}
    }
}
