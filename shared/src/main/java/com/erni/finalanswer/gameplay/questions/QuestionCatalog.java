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
    /** One catalog per language (questions/ru.json, questions/en.json); same IDs and answer order in both. */
    private static final Map<String,Catalog> CATALOGS=Map.of("ru",load("ru"),"en",load("en"));
    private static final Catalog CATALOG=CATALOGS.get("ru");
    private static final List<Question> ALL=CATALOG.questions().stream().map(Entry::question).toList();
    private static final List<Question> DEMO=CATALOG.questions().stream().filter(Entry::demo).map(Entry::question).toList();
    private QuestionCatalog(){}
    private static Catalog load(String language){
        try(var stream=QuestionCatalog.class.getResourceAsStream("/questions/"+language+".json")){
            if(stream==null)throw new IllegalStateException("Missing questions/"+language+".json");
            Catalog catalog=new Gson().fromJson(new InputStreamReader(stream,StandardCharsets.UTF_8),Catalog.class);
            if(catalog.version()!=1||catalog.questions()==null||catalog.questions().isEmpty())throw new IllegalStateException("Invalid question catalog");
            Set<String> ids=new HashSet<>();
            for(Entry entry:catalog.questions()){entry.question();if(!ids.add(entry.id()))throw new IllegalStateException("Duplicate question ID: "+entry.id());}
            return catalog;
        }catch(IOException error){throw new UncheckedIOException(error);}
    }
    public static List<Question> all(){return ALL;}
    /** Questions in the room language; anything other than "ru" gets English. */
    public static List<Question> all(String language){return "ru".equals(language)?ALL:CATALOGS.get("en").questions().stream().map(Entry::question).toList();}
    public static List<Question> demo(){return DEMO;}
}
