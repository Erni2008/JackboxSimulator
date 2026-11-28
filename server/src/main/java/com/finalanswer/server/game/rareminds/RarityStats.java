package com.finalanswer.server.game.rareminds;

import com.google.gson.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;

/**
 * How often each canonical answer has been given, per question. This is the frequency half of the hybrid rarity
 * system. The default implementation is a persistent local file: it reflects games played on this server only, not
 * every player in the world; a global service can implement the same interface later.
 */
public interface RarityStats {
    long count(String questionId,String answerId);
    long total(String questionId);
    /** Record the valid answers of one resolved question (each player's answer once). */
    void record(String questionId,Collection<String> answerIds);
    /** Answers the game could not recognise (to review and add to the bank). Default: not kept. */
    default void recordUnknown(String questionId,Collection<String> texts){}

    /** In memory, for tests and when no file is configured. */
    final class Memory implements RarityStats {
        final Map<String,Map<String,Long>> counts=new HashMap<>();
        @Override public synchronized long count(String q,String a){return counts.getOrDefault(q,Map.of()).getOrDefault(a,0L);}
        @Override public synchronized long total(String q){long s=0;for(long v:counts.getOrDefault(q,Map.of()).values())s+=v;return s;}
        @Override public synchronized void record(String q,Collection<String> answers){var m=counts.computeIfAbsent(q,k->new HashMap<>());for(String a:answers)m.merge(a,1L,Long::sum);}
    }

    /**
     * JSON file ({@code rare_minds_stats.json}); written atomically (temp file + move) after every resolved question.
     * A missing or unreadable file starts from zero, a failed write is logged and play goes on.
     */
    final class FileStore implements RarityStats {
        private final Path file;private final Memory mem=new Memory();
        public FileStore(Path file){
            this.file=file;
            try{if(Files.isRegularFile(file)){
                JsonObject root=JsonParser.parseString(Files.readString(file,StandardCharsets.UTF_8)).getAsJsonObject();
                for(var q:root.getAsJsonObject("counts").entrySet()){var m=mem.counts.computeIfAbsent(q.getKey(),k->new HashMap<>());
                    for(var a:q.getValue().getAsJsonObject().entrySet()){long v=a.getValue().getAsLong();if(v>0)m.put(a.getKey(),v);}}
            }}catch(IOException|RuntimeException e){System.out.println("[rare-minds] stats file unreadable, starting fresh: "+e.getMessage());mem.counts.clear();}
        }
        /** {@code -Drareminds.stats=<path>}, else {@code ~/.finalanswer/rare_minds_stats.json}. */
        public static FileStore configured(){
            String p=System.getProperty("rareminds.stats",System.getenv().getOrDefault("RARE_MINDS_STATS",""));
            return new FileStore(p.isBlank()?Path.of(System.getProperty("user.home"),".finalanswer","rare_minds_stats.json"):Path.of(p));
        }
        private final Map<String,Map<String,Long>> unknown=new TreeMap<>();
        private Path unknownFile(){return file.resolveSibling("rare_minds_unrecognized.json");}
        /** counts of unrecognised answers per question, written next to the stats file */
        @Override public synchronized void recordUnknown(String q,Collection<String> texts){
            if(texts.isEmpty())return;
            if(unknown.isEmpty())try{if(Files.isRegularFile(unknownFile()))for(var e:JsonParser.parseString(Files.readString(unknownFile(),StandardCharsets.UTF_8)).getAsJsonObject().getAsJsonObject("unknown").entrySet()){var m=unknown.computeIfAbsent(e.getKey(),k->new TreeMap<>());for(var a:e.getValue().getAsJsonObject().entrySet())m.put(a.getKey(),a.getValue().getAsLong());}}catch(IOException|RuntimeException ignored){}
            var m=unknown.computeIfAbsent(q,k->new TreeMap<>());for(String t:texts){String k=t.toLowerCase(java.util.Locale.ROOT).trim();if(!k.isEmpty()&&k.length()<=40)m.merge(k,1L,Long::sum);}
            try{JsonObject all=new JsonObject();for(var e:unknown.entrySet()){JsonObject o=new JsonObject();e.getValue().forEach(o::addProperty);all.add(e.getKey(),o);}
                JsonObject root=new JsonObject();root.addProperty("note","answers players gave that the bank does not know; review with tools/dev/rare_minds_review.py");root.add("unknown",all);
                Path dir=unknownFile().toAbsolutePath().getParent();if(dir!=null)Files.createDirectories(dir);Path tmp=unknownFile().resolveSibling("rare_minds_unrecognized.json.tmp");
                Files.writeString(tmp,root.toString(),StandardCharsets.UTF_8);Files.move(tmp,unknownFile(),StandardCopyOption.REPLACE_EXISTING,StandardCopyOption.ATOMIC_MOVE);}
            catch(IOException|RuntimeException e){System.out.println("[rare-minds] could not save unrecognised answers: "+e.getMessage());}
        }
        @Override public long count(String q,String a){return mem.count(q,a);}
        @Override public long total(String q){return mem.total(q);}
        @Override public synchronized void record(String q,Collection<String> answers){
            if(answers.isEmpty())return;mem.record(q,answers);
            try{
                JsonObject counts=new JsonObject();
                synchronized(mem){for(var e:mem.counts.entrySet()){JsonObject m=new JsonObject();e.getValue().forEach(m::addProperty);counts.add(e.getKey(),m);}}
                JsonObject root=new JsonObject();root.addProperty("version",1);root.addProperty("note","local server statistics only");root.add("counts",counts);
                Path dir=file.toAbsolutePath().getParent();if(dir!=null)Files.createDirectories(dir);
                Path tmp=file.resolveSibling(file.getFileName()+".tmp");Files.writeString(tmp,root.toString(),StandardCharsets.UTF_8);
                Files.move(tmp,file,StandardCopyOption.REPLACE_EXISTING,StandardCopyOption.ATOMIC_MOVE);
            }catch(IOException|RuntimeException e){System.out.println("[rare-minds] could not save stats: "+e.getMessage());}
        }
    }
}
