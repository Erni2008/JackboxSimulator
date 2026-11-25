package com.finalanswer.server.validation;

import com.google.gson.*;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

/**
 * Persistent cache of AI verdicts (never mixed with verified content, never promoted to it automatically). Only
 * decided verdicts (VALID / INVALID) are stored; UNCERTAIN is never cached. An entry is used only for the same
 * category content version and the same model version, so changed rules or a new model start fresh.
 */
public interface ValidationCache {
    record Entry(String categoryId,int categoryVersion,String key,ValidationStatus status,String canonicalId,String model,long at,String source){}
    Entry get(String categoryId,int categoryVersion,String key,String model);
    void put(Entry e);

    ValidationCache NONE=new ValidationCache(){public Entry get(String c,int v,String k,String m){return null;}public void put(Entry e){}};

    final class Memory implements ValidationCache {
        final Map<String,Entry> map=new ConcurrentHashMap<>();
        static String id(String c,int v,String k,String m){return c+"\u0000"+v+"\u0000"+k+"\u0000"+m;}
        public Entry get(String c,int v,String k,String m){return map.get(id(c,v,k,m));}
        public void put(Entry e){if(e.status()==ValidationStatus.VALID||e.status()==ValidationStatus.INVALID)map.put(id(e.categoryId(),e.categoryVersion(),e.key(),e.model()),e);}
    }

    /**
     * Local JSON file (default {@code ~/.finalanswer/think_or_die_ai_cache.json}); written atomically on a background
     * thread, so the game loop never waits for the disk. An unreadable file starts empty.
     */
    final class FileStore implements ValidationCache {
        private final Path file;private final Memory mem=new Memory();
        private final ExecutorService writer=Executors.newSingleThreadExecutor(r->{Thread t=new Thread(r,"validation-cache");t.setDaemon(true);return t;});
        private final Gson gson=new Gson();
        public FileStore(Path file){
            this.file=file;
            try{if(Files.isRegularFile(file))for(JsonElement el:JsonParser.parseString(Files.readString(file,StandardCharsets.UTF_8)).getAsJsonObject().getAsJsonArray("entries")){
                Entry e=gson.fromJson(el,Entry.class);if(e!=null&&e.status()!=null)mem.put(e);}}
            catch(RuntimeException|IOException e){System.err.println("[validation] cache unreadable, starting empty: "+e.getMessage());}
        }
        public static FileStore configured(){
            String p=System.getProperty("thinkordie.cache",System.getenv().getOrDefault("THINK_OR_DIE_CACHE",""));
            return new FileStore(p.isBlank()?Path.of(System.getProperty("user.home"),".finalanswer","think_or_die_ai_cache.json"):Path.of(p));
        }
        public Entry get(String c,int v,String k,String m){return mem.get(c,v,k,m);}
        public void put(Entry e){mem.put(e);writer.execute(this::save);}
        private void save(){
            try{JsonObject root=new JsonObject();root.addProperty("format",1);root.add("entries",gson.toJsonTree(new ArrayList<>(mem.map.values())));
                Files.createDirectories(file.toAbsolutePath().getParent());Path tmp=file.resolveSibling(file.getFileName()+".tmp");
                Files.writeString(tmp,gson.toJson(root),StandardCharsets.UTF_8);Files.move(tmp,file,StandardCopyOption.REPLACE_EXISTING,StandardCopyOption.ATOMIC_MOVE);}
            catch(IOException|RuntimeException e){System.err.println("[validation] cache not saved: "+e.getMessage());}
        }
    }
}
