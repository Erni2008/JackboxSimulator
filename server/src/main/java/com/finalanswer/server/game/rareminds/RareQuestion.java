package com.finalanswer.server.game.rareminds;

import java.util.*;

/**
 * One open question with many valid answers. Every accepted answer is a canonical concept ({@link Answer#id}) with
 * any number of aliases in any language: "paracetamol", "парацетамол" and "acetaminophen" are the same concept, so
 * two players typing different aliases still collide.
 *
 * @param typoTolerance maximum edits forgiven for a long word (0 disables fuzzy matching for this question)
 */
public record RareQuestion(String id,String category,String textEn,String textRu,List<Answer> answers,int typoTolerance){
    /**
     * @param popularity curated prior (1 = obscure … 100 = the first thing everyone says); only an initial estimate,
     *                   live statistics take over as answers are played
     */
    public record Answer(String id,String labelEn,String labelRu,List<String> aliases,int popularity){
        public Answer{aliases=List.copyOf(aliases);if(popularity<1||popularity>100)throw new IllegalArgumentException("popularity 1..100: "+id);}
    }
    public RareQuestion{
        answers=List.copyOf(answers);
        if(answers.size()<12)throw new IllegalArgumentException("question needs at least 12 accepted answers: "+id);
        if(typoTolerance<0||typoTolerance>2)throw new IllegalArgumentException("typoTolerance 0..2: "+id);
    }
    public String text(String lang){return "ru".equals(lang)?textRu:textEn;}
    public Answer answer(String answerId){for(Answer a:answers)if(a.id.equals(answerId))return a;return null;}
    /** Sum of curated popularity, the denominator of the prior. */
    public int popularityTotal(){int s=0;for(Answer a:answers)s+=a.popularity;return s;}
}
