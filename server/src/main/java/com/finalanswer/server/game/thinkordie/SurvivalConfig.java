package com.finalanswer.server.game.thinkordie;

import java.io.*;
import java.util.*;

/**
 * THINK OR DIE survival (the standalone mode): players answer one at a time against a shrinking turn clock; a wrong
 * answer, a repeat or a timeout costs a life; the last survivor wins. Defaults live in {@code /think_or_die/survival.properties},
 * any key can be overridden with {@code -Dthinkordie.survival.<key>}.
 *
 * @param lives          lives per player at the start
 * @param turnStartMs    time for one turn in the first lap
 * @param turnStepMs     how much shorter each turn gets per completed lap
 * @param turnMinMs      the turn clock never goes below this
 * @param checkMaxMs     how long a turn waits for the AI judge (the clock is stopped meanwhile); undecided counts as correct
 * @param resultMs       the verdict of a turn stays on screen this long
 * @param lapsPerCategory a new category after this many full laps
 * @param pointsCorrect  points for each accepted answer (tie breaker after survival order)
 */
public record SurvivalConfig(int lives,long introMs,long categoryMs,long turnStartMs,long turnStepMs,long turnMinMs,long checkMaxMs,long resultMs,
                             int lapsPerCategory,int pointsCorrect,long finalMs,long minSubmitIntervalMs){
    public static final SurvivalConfig DEFAULT=load();
    static SurvivalConfig load(){
        Properties p=new Properties();
        try(InputStream in=SurvivalConfig.class.getResourceAsStream("/think_or_die/survival.properties")){if(in!=null)p.load(new InputStreamReader(in,java.nio.charset.StandardCharsets.UTF_8));}catch(IOException ignored){}
        java.util.function.ToLongBiFunction<String,Long> l=(k,d)->{String v=System.getProperty("thinkordie.survival."+k,p.getProperty(k));return v==null||v.isBlank()?d:Long.parseLong(v.trim());};
        return new SurvivalConfig((int)l.applyAsLong("lives",3L),l.applyAsLong("introMs",7000L),l.applyAsLong("categoryMs",3800L),l.applyAsLong("turnStartMs",10000L),
            l.applyAsLong("turnStepMs",1000L),l.applyAsLong("turnMinMs",4000L),l.applyAsLong("checkMaxMs",5000L),l.applyAsLong("resultMs",1800L),
            (int)l.applyAsLong("lapsPerCategory",2L),(int)l.applyAsLong("pointsCorrect",100L),l.applyAsLong("finalMs",14000L),l.applyAsLong("minSubmitIntervalMs",250L));
    }
    /** Turn length for a lap (0 = first lap). */
    public long turnMs(int lap){return Math.max(turnMinMs,turnStartMs-lap*turnStepMs);}
}
