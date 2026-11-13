package com.finalanswer.server.game.systembreach;

import com.google.gson.*;
import java.util.*;

/**
 * SABOTAGE: a key spent on an opponent plants one of seven viruses in their laptop. The server owns everything that
 * matters — eligibility, the firewall roll, which virus, how long it lives (a number of questions) and the removal
 * puzzle's solution. The phone only stages the effect and submits the finished removal sequence.
 */
final class Sabotage {
    private Sabotage(){}

    /** All balancing for sabotage in one place; the phone receives the counts it needs inside the infection view. */
    static final class Config {
        static final int MAX_ACTIVE_SABOTAGES_PER_PLAYER=1;
        static final int SABOTAGE_DURATION_QUESTIONS=3;
        /** Chance (percent) that an infection gets through, indexed by the target's effective firewall level 1..3. */
        static final int[] SUCCESS_PERCENT_BY_FIREWALL={100,70,45};
        static final int SHUFFLE_SYMBOL_COUNT=5;
        static final int NUMBER_HUNT_COUNT=7;
        static final int POPUP_COUNT=5,POPUP_FAKE_CLOSE_COUNT=2;
        static final int GHOST_BUTTON_COUNT=4,GHOST_VIRUS_SYMBOL_COUNT=3;
        static final int SCREEN_GLITCH_CONTROL_COUNT=3,SCREEN_GLITCH_MAX_VALUE=5;
        static final int LOCKED_ANSWERS_NUMBER_COUNT=4;
        static final int MAGNETIC_INDICATOR_COUNT=3;
        private Config(){}
    }

    /** One generator per virus: public puzzle data for the phone plus the solution the server checks. */
    enum Type {
        SHUFFLE_ATTACK(false,(r,d)->{List<String> pool=new ArrayList<>(List.of("◆","▲","●","■","✚","★","⬢","✖"));Collections.shuffle(pool,r);var seq=pool.subList(0,Config.SHUFFLE_SYMBOL_COUNT);d.put("sequence",List.copyOf(seq));var shown=new ArrayList<>(seq);Collections.shuffle(shown,r);d.put("symbols",shown);return List.copyOf(seq);}),
        NUMBER_HUNT(false,(r,d)->{List<String> seq=new ArrayList<>();for(int i=1;i<=Config.NUMBER_HUNT_COUNT;i++)seq.add(String.valueOf(i));d.put("count",Config.NUMBER_HUNT_COUNT);return seq;}),
        POPUP_STORM(false,(r,d)->{List<String> titles=new ArrayList<>(List.of("SYSTEM ERROR","CONNECTION INTERRUPTED","UNAUTHORIZED ACCESS","SECURITY BREACH","CRITICAL WARNING","MEMORY FAULT","KERNEL PANIC"));Collections.shuffle(titles,r);
            List<Integer> fakes=new ArrayList<>();for(int i=0;i<Config.POPUP_COUNT;i++)fakes.add(i);Collections.shuffle(fakes,r);var fake=Set.copyOf(fakes.subList(0,Config.POPUP_FAKE_CLOSE_COUNT));
            List<Map<String,Object>> windows=new ArrayList<>();List<String> ids=new ArrayList<>();for(int i=0;i<Config.POPUP_COUNT;i++){String id="w"+i;ids.add(id);windows.add(Map.of("id",id,"title",titles.get(i),"fakeClose",fake.contains(i)));}d.put("windows",windows);return ids;}),
        GHOST_BUTTONS(false,(r,d)->{List<String> ids=new ArrayList<>();for(int i=0;i<Config.GHOST_VIRUS_SYMBOL_COUNT;i++)ids.add("v"+i);d.put("viruses",ids);d.put("ghosts",Config.GHOST_BUTTON_COUNT);return ids;}),
        SCREEN_GLITCH(false,(r,d)->{List<String> target=new ArrayList<>();for(int i=0;i<Config.SCREEN_GLITCH_CONTROL_COUNT;i++)target.add(String.valueOf(1+r.nextInt(Config.SCREEN_GLITCH_MAX_VALUE)));
            List<Integer> start=new ArrayList<>();for(String t:target){int v;do v=1+r.nextInt(Config.SCREEN_GLITCH_MAX_VALUE);while(String.valueOf(v).equals(t));start.add(v);}d.put("target",target);d.put("start",start);d.put("max",Config.SCREEN_GLITCH_MAX_VALUE);return target;}),
        LOCKED_ANSWERS(true,(r,d)->{TreeSet<Integer> picked=new TreeSet<>();while(picked.size()<Config.LOCKED_ANSWERS_NUMBER_COUNT)picked.add(1+r.nextInt(9));
            List<Integer> shown=new ArrayList<>(picked);do Collections.shuffle(shown,r);while(shown.equals(new ArrayList<>(picked)));d.put("numbers",shown);return picked.stream().map(String::valueOf).toList();}),
        MAGNETIC_BUTTONS(false,(r,d)->{List<String> ids=new ArrayList<>();for(int i=0;i<Config.MAGNETIC_INDICATOR_COUNT;i++)ids.add("m"+i);d.put("indicators",ids);return ids;});

        /** True when the virus stops trivia answers outright, so its removal puzzle is opened automatically. */
        final boolean blocksAnswers;private final Generator generator;
        Type(boolean blocksAnswers,Generator generator){this.blocksAnswers=blocksAnswers;this.generator=generator;}
        /** Sequence viruses check order; the others only that every piece was cleared. */
        boolean ordered(){return this!=POPUP_STORM&&this!=GHOST_BUTTONS&&this!=MAGNETIC_BUTTONS;}
    }
    @FunctionalInterface interface Generator {List<String> make(Random random,Map<String,Object> data);}

    /** A live infection on one player. */
    static final class Infection {
        final String id=UUID.randomUUID().toString(),attacker;final Type type;final long startedAt;final List<String> solution;final Map<String,Object> data;final int seed;
        int questionsLeft=Config.SABOTAGE_DURATION_QUESTIONS;
        Infection(Type type,String attacker,long now,Random random){this.type=type;this.attacker=attacker;startedAt=now;Map<String,Object> d=new LinkedHashMap<>();solution=List.copyOf(type.generator.make(random,d));seed=random.nextInt(1<<30);d.put("seed",seed);data=Collections.unmodifiableMap(d);}
        boolean solves(JsonElement answer){
            if(answer==null||!answer.isJsonArray()||answer.getAsJsonArray().size()!=solution.size())return false;
            List<String> got=new ArrayList<>();for(var e:answer.getAsJsonArray()){if(!e.isJsonPrimitive())return false;String s=e.getAsString();if(s.length()>16)return false;got.add(s);}
            if(type.ordered())return got.equals(solution);
            return new HashSet<>(got).size()==got.size()&&new HashSet<>(got).equals(new HashSet<>(solution));
        }
        Map<String,Object> view(){return Map.of("infectionId",id,"type",type.name(),"startedAt",startedAt,"questionsLeft",questionsLeft,"blocksAnswers",type.blocksAnswers,"data",data);}
    }

    static Type roll(Random random){var all=Type.values();return all[random.nextInt(all.length)];}
    static boolean getsThrough(int firewall,Random random){int chance=Config.SUCCESS_PERCENT_BY_FIREWALL[Math.max(1,Math.min(3,firewall))-1];return random.nextInt(100)<chance;}
}
