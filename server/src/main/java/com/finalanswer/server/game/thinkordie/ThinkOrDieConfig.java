package com.finalanswer.server.game.thinkordie;

import java.io.*;
import java.util.*;

/**
 * Every THINK OR DIE number in one place. Defaults live in {@code /think_or_die/config.properties}; any key can be
 * overridden with a system property {@code thinkordie.<key>} (for example {@code -Dthinkordie.rounds=3}).
 *
 * @param voteRejectPenalty points for an answer the other players voted down (default 0, so a vote can never be
 *                          used to grief someone: only the validation engine charges the invalid penalty)
 * @param hiddenAnswers     true: the shared screen shows only counts while answering (nobody can copy);
 *                          false: answer text appears live on the host screen
 */
public record ThinkOrDieConfig(int rounds,long introMs,long categoryMs,long answerMs,long graceMs,long validationMinMs,long validationMaxMs,
                               long voteMs,int maxDisputes,long revealBaseMs,long revealPerAnswerMs,long revealMaxMs,long roundResultsMs,long finalMs,
                               int pointsUnique,int pointsTwo,int pointsMany,int pointsInvalid,int voteRejectPenalty,
                               int resurrectMinAnswers,long rewardFirst,long rewardSecond,long rewardThird,
                               int maxAnswersPerRound,long minSubmitIntervalMs,boolean hiddenAnswers){
    public static final ThinkOrDieConfig DEFAULT=load();

    public static ThinkOrDieConfig load(){
        Properties p=new Properties();
        try(InputStream in=ThinkOrDieConfig.class.getResourceAsStream("/think_or_die/config.properties")){if(in!=null)p.load(new InputStreamReader(in,java.nio.charset.StandardCharsets.UTF_8));}
        catch(IOException e){System.err.println("[think-or-die] config unreadable, using built-in defaults");}
        return from(k->System.getProperty("thinkordie."+k,p.getProperty(k)));
    }
    static ThinkOrDieConfig from(java.util.function.Function<String,String> get){
        java.util.function.ToLongBiFunction<String,Long> l=(k,d)->{String v=get.apply(k);return v==null||v.isBlank()?d:Long.parseLong(v.trim());};
        java.util.function.ToIntBiFunction<String,Integer> i=(k,d)->(int)l.applyAsLong(k,(long)d);
        String hid=get.apply("hiddenAnswers");
        ThinkOrDieConfig c=new ThinkOrDieConfig(i.applyAsInt("rounds",5),l.applyAsLong("introMs",9000L),l.applyAsLong("categoryMs",3800L),l.applyAsLong("answerMs",30000L),l.applyAsLong("graceMs",400L),
            l.applyAsLong("validationMinMs",900L),l.applyAsLong("validationMaxMs",5000L),l.applyAsLong("voteMs",14000L),i.applyAsInt("maxDisputes",6),
            l.applyAsLong("revealBaseMs",6000L),l.applyAsLong("revealPerAnswerMs",450L),l.applyAsLong("revealMaxMs",18000L),l.applyAsLong("roundResultsMs",6500L),l.applyAsLong("finalMs",16000L),
            i.applyAsInt("pointsUnique",150),i.applyAsInt("pointsTwo",100),i.applyAsInt("pointsMany",50),i.applyAsInt("pointsInvalid",-25),i.applyAsInt("voteRejectPenalty",0),
            i.applyAsInt("resurrectMinAnswers",5),l.applyAsLong("rewardFirst",3000L),l.applyAsLong("rewardSecond",2000L),l.applyAsLong("rewardThird",1000L),
            i.applyAsInt("maxAnswersPerRound",60),l.applyAsLong("minSubmitIntervalMs",250L),hid==null||hid.isBlank()||Boolean.parseBoolean(hid.trim()));
        c.check();return c;
    }
    void check(){
        if(rounds<1||rounds>12)throw new IllegalArgumentException("rounds 1..12");
        if(answerMs<5000)throw new IllegalArgumentException("answerMs >= 5000");
        if(!(pointsUnique>=pointsTwo&&pointsTwo>=pointsMany&&pointsMany>0))throw new IllegalArgumentException("points must fall with popularity and stay positive");
        if(pointsInvalid>0||voteRejectPenalty>0)throw new IllegalArgumentException("penalties are <= 0");
        if(maxAnswersPerRound<1||resurrectMinAnswers<1)throw new IllegalArgumentException("limits >= 1");
    }
    /** Points for a correct answer given by {@code players} distinct players. */
    public int pointsFor(int players){return players<=1?pointsUnique:players==2?pointsTwo:pointsMany;}
    public ThinkOrDieConfig withTiming(long intro,long category,long answer,long vote,long reveal,long results,long fin){
        return new ThinkOrDieConfig(rounds,intro,category,answer,graceMs,Math.min(validationMinMs,200),validationMaxMs,vote,maxDisputes,reveal,0,reveal,results,fin,
            pointsUnique,pointsTwo,pointsMany,pointsInvalid,voteRejectPenalty,resurrectMinAnswers,rewardFirst,rewardSecond,rewardThird,maxAnswersPerRound,minSubmitIntervalMs,hiddenAnswers);
    }
    public ThinkOrDieConfig withRounds(int r){return new ThinkOrDieConfig(r,introMs,categoryMs,answerMs,graceMs,validationMinMs,validationMaxMs,voteMs,maxDisputes,revealBaseMs,revealPerAnswerMs,revealMaxMs,roundResultsMs,finalMs,
            pointsUnique,pointsTwo,pointsMany,pointsInvalid,voteRejectPenalty,resurrectMinAnswers,rewardFirst,rewardSecond,rewardThird,maxAnswersPerRound,minSubmitIntervalMs,hiddenAnswers);}
    public ThinkOrDieConfig withHiddenAnswers(boolean h){return new ThinkOrDieConfig(rounds,introMs,categoryMs,answerMs,graceMs,validationMinMs,validationMaxMs,voteMs,maxDisputes,revealBaseMs,revealPerAnswerMs,revealMaxMs,roundResultsMs,finalMs,
            pointsUnique,pointsTwo,pointsMany,pointsInvalid,voteRejectPenalty,resurrectMinAnswers,rewardFirst,rewardSecond,rewardThird,maxAnswersPerRound,minSubmitIntervalMs,h);}
}
