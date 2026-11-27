package com.finalanswer.server.validation;

import com.google.gson.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

/**
 * Answers the players settled by a dispute vote. Unlike the AI cache this survives a new model or prompt: once a room
 * voted that "моргенштерн" is a Russian rapper, the next game accepts it at once. Stored in
 * {@code ~/.finalanswer/think_or_die_learned.json} (written atomically on a background thread) and imported into the
 * verified lists with tools/think_or_die/import_learned.py after a human look.
 */
public class LearnedAnswers {
    public record Entry(String categoryId,String key,String text,boolean accepted,int yes,int no,long at){}
    public static final LearnedAnswers NONE=new LearnedAnswers(null);
    /** A vote counts only with at least this many voters and a clear majority (a tie goes to the player in the round, not here). */
    static final int MIN_VOTES=2;

    private final Path file;private final Map<String,Entry> map=new ConcurrentHashMap<>();private final Gson gson=new Gson();
    private final ExecutorService writer=Executors.newSingleThreadExecutor(r->{Thread t=new Thread(r,"learned-answers");t.setDaemon(true);return t;});

    public LearnedAnswers(Path file){
        this.file=file;if(file==null)return;
        try{if(Files.isRegularFile(file))for(JsonElement el:JsonParser.parseString(Files.readString(file,StandardCharsets.UTF_8)).getAsJsonObject().getAsJsonArray("entries")){
            Entry e=gson.fromJson(el,Entry.class);if(e!=null&&e.categoryId()!=null&&e.key()!=null)map.put(id(e.categoryId(),e.key()),e);}}
        catch(RuntimeException|IOException e){System.err.println("[validation] learned answers unreadable, starting empty: "+e.getMessage());}
    }
    public static LearnedAnswers configured(){
        String p=System.getProperty("thinkordie.learned",System.getenv().getOrDefault("THINK_OR_DIE_LEARNED",""));
        return new LearnedAnswers(p.isBlank()?Path.of(System.getProperty("user.home"),".finalanswer","think_or_die_learned.json"):Path.of(p));
    }
    static String id(String c,String k){return c+"\u0000"+k;}
    public Entry get(String categoryId,String key){return map.get(id(categoryId,key));}
    public int size(){return map.size();}

    /** Record a closed dispute; ignored when too few players voted or the room was split evenly. */
    public void record(String categoryId,String key,String text,int yes,int no){
        if(file==null||yes+no<MIN_VOTES||yes==no)return;
        map.put(id(categoryId,key),new Entry(categoryId,key,text,yes>no,yes,no,System.currentTimeMillis()));writer.execute(this::save);
    }
    private void save(){
        try{JsonObject root=new JsonObject();root.addProperty("format",1);root.add("entries",gson.toJsonTree(new ArrayList<>(map.values())));
            Files.createDirectories(file.toAbsolutePath().getParent());Path tmp=file.resolveSibling(file.getFileName()+".tmp");
            Files.writeString(tmp,gson.toJson(root),StandardCharsets.UTF_8);Files.move(tmp,file,StandardCopyOption.REPLACE_EXISTING,StandardCopyOption.ATOMIC_MOVE);}
        catch(IOException|RuntimeException e){System.err.println("[validation] learned answers not saved: "+e.getMessage());}
    }
}
