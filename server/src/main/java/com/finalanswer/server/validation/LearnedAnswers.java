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
    public record Entry(String categoryId,String key,String text,boolean accepted,int yes,int no,long at,List<String> games){
        /** An accepted answer counts only after separate games agreed (two friends cannot teach a wrong answer in one vote); a rejection counts at once. */
        public boolean active(){return !accepted||games!=null&&games.size()>=ACCEPT_GAMES;}
    }
    static final int ACCEPT_GAMES=2,MAX_ENTRIES=50_000,MAX_TEXT=80;
    public static final LearnedAnswers NONE=new LearnedAnswers(null);
    /** A vote counts only with at least this many voters and a clear majority (a tie goes to the player in the round, not here). */
    static final int MIN_VOTES=3; // and a two thirds majority

    private final Path file;private final Map<String,Entry> map=new ConcurrentHashMap<>();private final Gson gson=new Gson();
    private final ExecutorService writer=Executors.newSingleThreadExecutor(r->{Thread t=new Thread(r,"learned-answers");t.setDaemon(true);return t;});

    public LearnedAnswers(Path file){
        this.file=file;if(file==null)return;
        try{if(Files.isRegularFile(file))for(JsonElement el:JsonParser.parseString(Files.readString(file,StandardCharsets.UTF_8)).getAsJsonObject().getAsJsonArray("entries")){
            Entry e=gson.fromJson(el,Entry.class);if(e!=null&&e.categoryId()!=null&&e.key()!=null&&map.size()<MAX_ENTRIES)map.put(id(e.categoryId(),e.key()),e);}}
        catch(RuntimeException|IOException e){System.err.println("[validation] learned answers unreadable, starting empty: "+e.getMessage());}
    }
    public static LearnedAnswers configured(){
        String p=System.getProperty("thinkordie.learned",System.getenv().getOrDefault("THINK_OR_DIE_LEARNED",""));
        return new LearnedAnswers(p.isBlank()?Path.of(System.getProperty("user.home"),".finalanswer","think_or_die_learned.json"):Path.of(p));
    }
    static String id(String c,String k){return c+"\u0000"+k;}
    /** The settled verdict, or null while it is not trusted yet. */
    public Entry get(String categoryId,String key){Entry e=map.get(id(categoryId,key));return e!=null&&e.active()?e:null;}
    Entry pending(String categoryId,String key){return map.get(id(categoryId,key));}
    public int size(){return map.size();}

    /** Record a closed dispute; ignored when too few players voted or the room was split evenly. */
    public void record(String categoryId,String key,String text,int yes,int no){record(categoryId,key,text,yes,no,"");}
    /** {@code game}: the session that voted; the same game confirming twice counts once. */
    public synchronized void record(String categoryId,String key,String text,int yes,int no,String game){
        if(file==null||categoryId==null||key==null||key.isEmpty()||key.length()>MAX_TEXT||yes<0||no<0)return;
        int all=yes+no;boolean acc=yes*3>=all*2,rej=no*3>=all*2;
        if(all<MIN_VOTES||acc==rej)return; // too few voters or no clear two thirds majority
        String id=id(categoryId,key);Entry old=map.get(id);
        if(old==null&&map.size()>=MAX_ENTRIES)return;
        List<String> games=new ArrayList<>();if(old!=null&&old.accepted()==acc&&old.games()!=null)games.addAll(old.games());
        String g=game==null?"":game;if(g.isEmpty()||!games.contains(g))games.add(g.isEmpty()?"g"+games.size():g);while(games.size()>8)games.remove(0);
        String t=text==null?"":text.length()>MAX_TEXT?text.substring(0,MAX_TEXT):text;
        map.put(id,new Entry(categoryId,key,t,acc,yes,no,System.currentTimeMillis(),List.copyOf(games)));writer.execute(this::save);
    }
    private void save(){
        try{JsonObject root=new JsonObject();root.addProperty("format",1);root.add("entries",gson.toJsonTree(new ArrayList<>(map.values())));
            Files.createDirectories(file.toAbsolutePath().getParent());Path tmp=file.resolveSibling(file.getFileName()+".tmp");
            Files.writeString(tmp,gson.toJson(root),StandardCharsets.UTF_8);Files.move(tmp,file,StandardCopyOption.REPLACE_EXISTING,StandardCopyOption.ATOMIC_MOVE);}
        catch(IOException|RuntimeException e){System.err.println("[validation] learned answers not saved: "+e.getMessage());}
    }
}
