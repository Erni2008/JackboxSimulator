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
 * @param votes             false (default): the AI decides everything, nothing goes to a player vote; an answer the AI
 *                          could not judge in time scores 0. true: undecided answers go to an anonymous vote
 * @param pointsThree       a correct answer given by exactly three players (standalone: same as {@code pointsMany})
 * @param pointsCrowd       a correct answer given by four or more players (standalone: same as {@code pointsMany})
 * @param rulesMs           extra intro time for the rules card (integrated mode shows it once per match)
 * @param hideVerdicts      true: a phone never learns whether its answer is right before the reveal
 * @param integrated        one challenge inside the main match (points are souls), not the standalone show
 */
public record ThinkOrDieConfig(int rounds,long introMs,long categoryMs,long answerMs,long graceMs,long validationMinMs,long validationMaxMs,
                               long voteMs,int maxDisputes,long revealBaseMs,long revealPerAnswerMs,long revealMaxMs,long roundResultsMs,long finalMs,
                               int pointsUnique,int pointsTwo,int pointsMany,int pointsInvalid,int voteRejectPenalty,
                               int resurrectMinAnswers,long rewardFirst,long rewardSecond,long rewardThird,
                               int maxAnswersPerRound,long minSubmitIntervalMs,boolean hiddenAnswers,boolean votes,
                               int pointsThree,int pointsCrowd,long rulesMs,boolean hideVerdicts,boolean integrated){
    public static final ThinkOrDieConfig DEFAULT=load();
    /** The one-round challenge inside the main match: {@code /think_or_die/integrated.properties}, overridable with {@code -Dthinkordie.integrated.<key>}. */
    public static final ThinkOrDieConfig INTEGRATED=load("/think_or_die/integrated.properties","thinkordie.integrated.");

    /** Main match schedule: a challenge follows every Nth classic question (0 = never). */
    public static int matchEvery(){
        Properties p=new Properties();
        try(InputStream in=ThinkOrDieConfig.class.getResourceAsStream("/think_or_die/integrated.properties")){if(in!=null)p.load(new InputStreamReader(in,java.nio.charset.StandardCharsets.UTF_8));}catch(IOException ignored){}
        String v=System.getProperty("thinkordie.integrated.everyQuestions",p.getProperty("everyQuestions","2"));
        try{return Math.max(0,Integer.parseInt(v.trim()));}catch(NumberFormatException e){return 2;}
    }
    public static ThinkOrDieConfig load(){return load("/think_or_die/config.properties","thinkordie.");}
    static ThinkOrDieConfig load(String resource,String prefix){
        Properties p=new Properties();
        try(InputStream in=ThinkOrDieConfig.class.getResourceAsStream(resource)){if(in!=null)p.load(new InputStreamReader(in,java.nio.charset.StandardCharsets.UTF_8));}
        catch(IOException e){System.err.println("[think-or-die] config unreadable, using built-in defaults");}
        return from(k->System.getProperty(prefix+k,p.getProperty(k)));
    }
    static ThinkOrDieConfig from(java.util.function.Function<String,String> get){
        java.util.function.ToLongBiFunction<String,Long> l=(k,d)->{String v=get.apply(k);return v==null||v.isBlank()?d:Long.parseLong(v.trim());};
        java.util.function.ToIntBiFunction<String,Integer> i=(k,d)->(int)l.applyAsLong(k,(long)d);
        String hid=get.apply("hiddenAnswers"),vot=get.apply("votes"),hv=get.apply("hideVerdicts"),ig=get.apply("integrated");
        int many=i.applyAsInt("pointsMany",50);
        ThinkOrDieConfig c=new ThinkOrDieConfig(i.applyAsInt("rounds",5),l.applyAsLong("introMs",9000L),l.applyAsLong("categoryMs",3800L),l.applyAsLong("answerMs",30000L),l.applyAsLong("graceMs",400L),
            l.applyAsLong("validationMinMs",900L),l.applyAsLong("validationMaxMs",5000L),l.applyAsLong("voteMs",14000L),i.applyAsInt("maxDisputes",6),
            l.applyAsLong("revealBaseMs",6000L),l.applyAsLong("revealPerAnswerMs",450L),l.applyAsLong("revealMaxMs",18000L),l.applyAsLong("roundResultsMs",6500L),l.applyAsLong("finalMs",16000L),
            i.applyAsInt("pointsUnique",150),i.applyAsInt("pointsTwo",100),many,i.applyAsInt("pointsInvalid",0),i.applyAsInt("voteRejectPenalty",0),
            i.applyAsInt("resurrectMinAnswers",5),l.applyAsLong("rewardFirst",3000L),l.applyAsLong("rewardSecond",2000L),l.applyAsLong("rewardThird",1000L),
            i.applyAsInt("maxAnswersPerRound",60),l.applyAsLong("minSubmitIntervalMs",250L),hid==null||hid.isBlank()||Boolean.parseBoolean(hid.trim()),vot!=null&&Boolean.parseBoolean(vot.trim()),
            i.applyAsInt("pointsThree",many),i.applyAsInt("pointsCrowd",many),l.applyAsLong("rulesMs",0L),hv!=null&&Boolean.parseBoolean(hv.trim()),ig!=null&&Boolean.parseBoolean(ig.trim()));
        c.check();return c;
    }
    void check(){
        if(rounds<1||rounds>12)throw new IllegalArgumentException("rounds 1..12");
        if(answerMs<5000)throw new IllegalArgumentException("answerMs >= 5000");
        if(!(pointsUnique>=pointsTwo&&pointsTwo>=pointsThree&&pointsThree>=pointsCrowd&&pointsCrowd>=0&&pointsUnique>0))throw new IllegalArgumentException("points must fall with popularity and never go negative");
        if(pointsInvalid>0||voteRejectPenalty>0)throw new IllegalArgumentException("penalties are <= 0");
        if(maxAnswersPerRound<1||resurrectMinAnswers<1)throw new IllegalArgumentException("limits >= 1");
    }
    /** Points for a correct answer given by {@code players} distinct players. */
    public int pointsFor(int players){return players<=1?pointsUnique:players==2?pointsTwo:players==3?pointsThree:pointsCrowd;}
    /** true when four or more matching players earn less than three (the integrated "crowd" tier, shown in red). */
    public boolean crowdTier(){return pointsCrowd<pointsThree;}
    public ThinkOrDieConfig withTiming(long intro,long category,long answer,long vote,long reveal,long results,long fin){
        return new ThinkOrDieConfig(rounds,intro,category,answer,graceMs,Math.min(validationMinMs,200),validationMaxMs,vote,maxDisputes,reveal,0,reveal,results,fin,
            pointsUnique,pointsTwo,pointsMany,pointsInvalid,voteRejectPenalty,resurrectMinAnswers,rewardFirst,rewardSecond,rewardThird,maxAnswersPerRound,minSubmitIntervalMs,hiddenAnswers,votes,pointsThree,pointsCrowd,rulesMs,hideVerdicts,integrated);
    }
    public ThinkOrDieConfig withRounds(int r){return new ThinkOrDieConfig(r,introMs,categoryMs,answerMs,graceMs,validationMinMs,validationMaxMs,voteMs,maxDisputes,revealBaseMs,revealPerAnswerMs,revealMaxMs,roundResultsMs,finalMs,
            pointsUnique,pointsTwo,pointsMany,pointsInvalid,voteRejectPenalty,resurrectMinAnswers,rewardFirst,rewardSecond,rewardThird,maxAnswersPerRound,minSubmitIntervalMs,hiddenAnswers,votes,pointsThree,pointsCrowd,rulesMs,hideVerdicts,integrated);}
    public ThinkOrDieConfig withVotes(boolean v){return new ThinkOrDieConfig(rounds,introMs,categoryMs,answerMs,graceMs,validationMinMs,validationMaxMs,voteMs,maxDisputes,revealBaseMs,revealPerAnswerMs,revealMaxMs,roundResultsMs,finalMs,
            pointsUnique,pointsTwo,pointsMany,pointsInvalid,voteRejectPenalty,resurrectMinAnswers,rewardFirst,rewardSecond,rewardThird,maxAnswersPerRound,minSubmitIntervalMs,hiddenAnswers,v,pointsThree,pointsCrowd,rulesMs,hideVerdicts,integrated);}
    public ThinkOrDieConfig withHiddenAnswers(boolean h){return new ThinkOrDieConfig(rounds,introMs,categoryMs,answerMs,graceMs,validationMinMs,validationMaxMs,voteMs,maxDisputes,revealBaseMs,revealPerAnswerMs,revealMaxMs,roundResultsMs,finalMs,
            pointsUnique,pointsTwo,pointsMany,pointsInvalid,voteRejectPenalty,resurrectMinAnswers,rewardFirst,rewardSecond,rewardThird,maxAnswersPerRound,minSubmitIntervalMs,h,votes,pointsThree,pointsCrowd,rulesMs,hideVerdicts,integrated);}
}
