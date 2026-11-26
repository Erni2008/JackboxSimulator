package com.finalanswer.server.validation;

import com.google.gson.*;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * A versioned set of categories loaded from JSON (default {@code /think_or_die/categories.json} on the server
 * classpath, produced and checked by tools/content-builder). Every category is validated on load: alias conflicts,
 * an answer listed as both valid and invalid, or an unknown rule fail loudly at startup, never mid-game.
 *
 * <pre>
 * {"contentVersion":1,"categories":[{"id":"batman_villains","v":1,"type":"KNOWLEDGE","group":"movies_tv","langs":["en","ru"],
 *   "en":"Name a Batman villain","ru":"Назовите злодея из комиксов о Бэтмене","criteriaEn":"…","allowUnknown":true,
 *   "invalid":["Superman","Супермен"],"answers":[["joker","Joker|Джокер","the joker"]]}]}
 * </pre>
 * One answer: {@code [canonicalId, "English label|Русская метка", "alias|alias|…"]}; both labels are aliases.
 */
public final class CategoryPack {
    public static final String RESOURCE="/think_or_die/categories.json";
    public record Entry(Category category,Set<String> langs,int minPlayers){}
    private final int contentVersion;private final List<Entry> entries;

    public CategoryPack(int contentVersion,List<Entry> entries){
        this.contentVersion=contentVersion;this.entries=List.copyOf(entries);
        Set<String> ids=new HashSet<>();for(Entry e:entries){if(!ids.add(e.category().id()))throw new IllegalArgumentException("duplicate category "+e.category().id());VerifiedAnswers.check(e.category());}
    }
    public int contentVersion(){return contentVersion;}
    public List<Entry> entries(){return entries;}
    /** how many categories can be played in {@code lang} */
    public int size(String lang){int n=0;for(Entry e:entries)if(e.langs().contains(lang))n++;return n;}
    public Category get(String id){for(Entry e:entries)if(e.category().id().equals(id))return e.category();return null;}

    /** {@code count} distinct categories playable in {@code lang}, no two from the same group in a row when possible. */
    public List<Category> draw(int count,String lang,Random random){
        List<Entry> pool=new ArrayList<>();for(Entry e:entries)if(e.langs().contains(lang))pool.add(e);
        if(pool.size()<count)throw new IllegalStateException("only "+pool.size()+" categories for "+lang+", need "+count);
        Collections.shuffle(pool,random);List<Category> out=new ArrayList<>();Set<String> used=new HashSet<>();
        for(int pass=0;pass<2&&out.size()<count;pass++)for(Entry e:pool){if(out.size()>=count)break;
            if(used.contains(e.category().id()))continue;
            if(pass==0&&!out.isEmpty()&&out.get(out.size()-1).group().equals(e.category().group()))continue;
            out.add(e.category());used.add(e.category().id());}
        return List.copyOf(out);
    }

    private static CategoryPack cached;
    public static synchronized CategoryPack load(){
        if(cached!=null)return cached;
        try(InputStream in=CategoryPack.class.getResourceAsStream(RESOURCE)){
            if(in==null)throw new IllegalStateException("missing "+RESOURCE);
            return cached=parse(new String(in.readAllBytes(),StandardCharsets.UTF_8));
        }catch(IOException e){throw new UncheckedIOException(e);}
    }
    public static CategoryPack parse(String json){
        JsonObject root=JsonParser.parseString(json).getAsJsonObject();List<Entry> out=new ArrayList<>();
        for(JsonElement el:root.getAsJsonArray("categories")){JsonObject o=el.getAsJsonObject();String id=o.get("id").getAsString();
            try{
                List<Category.Answer> answers=new ArrayList<>();
                if(o.has("answers"))for(JsonElement ae:o.getAsJsonArray("answers")){JsonArray a=ae.getAsJsonArray();
                    String[] labels=a.get(1).getAsString().split("\\|",-1);List<String> aliases=new ArrayList<>(List.of(labels));
                    if(a.size()>2)for(String s:a.get(2).getAsString().split("\\|"))if(!s.isBlank())aliases.add(s.trim());
                    aliases.removeIf(String::isBlank);
                    answers.add(new Category.Answer(a.get(0).getAsString(),labels[0],labels.length>1&&!labels[1].isBlank()?labels[1]:labels[0],aliases));}
                List<String> invalid=new ArrayList<>();if(o.has("invalid"))for(JsonElement s:o.getAsJsonArray("invalid"))invalid.add(s.getAsString());
                Category.Rule rule=null;if(o.has("rule")){JsonObject r=o.getAsJsonObject("rule");rule=new Category.Rule(r.get("kind").getAsString(),r.has("value")?r.get("value").getAsString():null,r.has("n")?r.get("n").getAsInt():0,r.has("lang")?r.get("lang").getAsString():"en");}
                Category c=new Category(id,o.has("v")?o.get("v").getAsInt():1,Category.Type.valueOf(o.get("type").getAsString()),o.get("group").getAsString(),
                    o.get("en").getAsString(),o.get("ru").getAsString(),str(o,"criteriaEn"),str(o,"criteriaRu"),rule,answers,invalid,
                    !o.has("allowUnknown")||o.get("allowUnknown").getAsBoolean(),o.has("exhaustive")&&o.get("exhaustive").getAsBoolean());
                Set<String> langs=new LinkedHashSet<>();if(o.has("langs"))for(JsonElement l:o.getAsJsonArray("langs"))langs.add(l.getAsString());else{langs.add("en");langs.add("ru");}
                if(rule!=null&&c.type()==Category.Type.WORD_RULE&&!langs.equals(Set.of(rule.lang())))throw new IllegalArgumentException("word rule category must be playable only in "+rule.lang());
                out.add(new Entry(c,Set.copyOf(langs),o.has("minPlayers")?o.get("minPlayers").getAsInt():2));
            }catch(RuntimeException e){throw new IllegalArgumentException("category "+id+": "+e.getMessage(),e);}
        }
        return new CategoryPack(root.has("contentVersion")?root.get("contentVersion").getAsInt():1,out);
    }
    private static String str(JsonObject o,String k){return o.has(k)?o.get(k).getAsString():"";}
}
