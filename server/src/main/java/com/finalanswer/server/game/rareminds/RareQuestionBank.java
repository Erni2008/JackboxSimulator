package com.finalanswer.server.game.rareminds;

import com.google.gson.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * The RARE MINDS question bank, loaded from {@code /rare_minds/questions.json} on the server classpath. Adding a
 * question or an alias is a data change only. Format of one answer: {@code [id, popularity 1..100, "English|Русский",
 * "alias|alias|…"]} — both labels are aliases automatically, the last field may be empty.
 */
public final class RareQuestionBank {
    public static final String RESOURCE="/rare_minds/questions.json";
    private final List<RareQuestion> questions;
    private final CuratedAnswerValidator validator;

    public RareQuestionBank(List<RareQuestion> questions){
        this.questions=List.copyOf(questions);
        Set<String> ids=new HashSet<>();for(var q:questions)if(!ids.add(q.id()))throw new IllegalArgumentException("duplicate question id "+q.id());
        validator=new CuratedAnswerValidator(this.questions);
    }
    public List<RareQuestion> questions(){return questions;}
    public CuratedAnswerValidator validator(){return validator;}
    public RareQuestion get(String id){for(var q:questions)if(q.id().equals(id))return q;return null;}

    /** {@code count} distinct questions in random order (never a repeat within one match). */
    public List<RareQuestion> draw(int count,Random random){
        if(count>questions.size())throw new IllegalStateException("bank has "+questions.size()+" questions, need "+count);
        List<RareQuestion> all=new ArrayList<>(questions);Collections.shuffle(all,random);return List.copyOf(all.subList(0,count));
    }

    private static RareQuestionBank cached;
    public static synchronized RareQuestionBank load(){
        if(cached!=null)return cached;
        try(InputStream in=RareQuestionBank.class.getResourceAsStream(RESOURCE)){
            if(in==null)throw new IllegalStateException("missing "+RESOURCE);
            return cached=parse(new String(in.readAllBytes(),StandardCharsets.UTF_8));
        }catch(IOException e){throw new UncheckedIOException(e);}
    }
    public static RareQuestionBank parse(String json){
        JsonObject root=JsonParser.parseString(json).getAsJsonObject();List<RareQuestion> out=new ArrayList<>();
        for(JsonElement qe:root.getAsJsonArray("questions")){
            JsonObject q=qe.getAsJsonObject();List<RareQuestion.Answer> answers=new ArrayList<>();Set<String> seen=new HashSet<>();
            for(JsonElement ae:q.getAsJsonArray("answers")){
                JsonArray a=ae.getAsJsonArray();String id=a.get(0).getAsString();
                if(!seen.add(id))throw new IllegalArgumentException("duplicate answer "+id+" in "+q.get("id").getAsString());
                String[] labels=a.get(2).getAsString().split("\\|",-1);
                List<String> aliases=new ArrayList<>(List.of(labels));
                if(a.size()>3&&!a.get(3).getAsString().isBlank())for(String s:a.get(3).getAsString().split("\\|"))if(!s.isBlank())aliases.add(s.trim());
                answers.add(new RareQuestion.Answer(id,labels[0],labels.length>1?labels[1]:labels[0],aliases,a.get(1).getAsInt()));
            }
            out.add(new RareQuestion(q.get("id").getAsString(),q.get("category").getAsString(),q.get("en").getAsString(),q.get("ru").getAsString(),answers,q.has("typo")?q.get("typo").getAsInt():1));
        }
        return new RareQuestionBank(out);
    }
}
