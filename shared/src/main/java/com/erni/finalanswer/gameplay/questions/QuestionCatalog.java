package com.erni.finalanswer.gameplay.questions;

import com.google.gson.Gson;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** Single catalog shared by the server, local demo and offline narration tools. */
public final class QuestionCatalog {
    private record Entry(String id,String text,String spokenText,List<String> answers,int correctAnswerIndex,boolean demo) {
        Question question(){return new Question(id,text,answers,correctAnswerIndex);}
    }
    private record Catalog(int version,String language,List<Entry> questions) {}
    private static final Catalog CATALOG=load();
    private static final List<Question> ALL=CATALOG.questions().stream().map(Entry::question).toList();
    private static final List<Question> DEMO=CATALOG.questions().stream().filter(Entry::demo).map(Entry::question).toList();
    private QuestionCatalog(){}
    private static Catalog load(){
        try(var stream=QuestionCatalog.class.getResourceAsStream("/questions/ru.json")){
            if(stream==null)throw new IllegalStateException("Missing questions/ru.json");
            Catalog catalog=new Gson().fromJson(new InputStreamReader(stream,StandardCharsets.UTF_8),Catalog.class);
            if(catalog.version()!=1||catalog.questions()==null||catalog.questions().isEmpty())throw new IllegalStateException("Invalid question catalog");
            Set<String> ids=new HashSet<>();
            for(Entry entry:catalog.questions()){entry.question();if(!ids.add(entry.id()))throw new IllegalStateException("Duplicate question ID: "+entry.id());}
            return catalog;
        }catch(IOException error){throw new UncheckedIOException(error);}
    }
    public static List<Question> all(){return ALL;}
    public static List<Question> demo(){return DEMO;}
}
