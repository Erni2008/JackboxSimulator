package com.finalanswer.server.game.rareminds;

import java.util.*;

/**
 * Validation against the curated bank: every alias of every answer is reduced to a {@link RareText#key}; an exact key
 * match is VALID. Fuzzy matching is deliberately narrow so two different legitimate answers are never merged:
 * <ul><li>only typed keys of 5+ characters are considered, and only against aliases of 5+ characters;</li>
 * <li>1 edit is forgiven up to 8 characters, 2 from 9 (never more than the question's own tolerance);</li>
 * <li>the closest answer must be strictly closer than every other answer, otherwise the result is UNCERTAIN.</li></ul>
 */
public final class CuratedAnswerValidator implements AnswerValidator {
    private final Map<String,Map<String,String>> index=new HashMap<>();

    public CuratedAnswerValidator(Collection<RareQuestion> questions){for(RareQuestion q:questions)index.put(q.id(),build(q));}

    /** Alias key → answer id; a key claimed by two answers of one question is a data error. */
    static Map<String,String> build(RareQuestion q){
        Map<String,String> m=new HashMap<>();
        for(var a:q.answers())for(String alias:a.aliases()){
            String k=RareText.key(alias);if(k.isEmpty())throw new IllegalArgumentException("empty alias in "+q.id()+"/"+a.id());
            String prev=m.putIfAbsent(k,a.id());
            if(prev!=null&&!prev.equals(a.id()))throw new IllegalArgumentException("alias '"+alias+"' belongs to both "+prev+" and "+a.id()+" in "+q.id());
        }
        return m;
    }

    @Override public Result validate(RareQuestion q,String typed){
        String key=RareText.key(typed);
        if(key.isEmpty())return Result.of(Status.EMPTY,key);
        Map<String,String> m=index.computeIfAbsent(q.id(),x->build(q));
        String exact=m.get(key);if(exact!=null)return new Result(Status.VALID,exact,key);
        if(q.typoTolerance()==0)return Result.of(Status.INVALID,key);
        Map<String,String> lat=latin.computeIfAbsent(q.id(),x->latinIndex(m));
        // 1. typed on the wrong keyboard layout (gfhfwtnfvjk → парацетамол, зфкфсуефьщд → paracetamol)
        for(String alt:new String[]{RareText.key(swapLayout(typed,EN,RU)),RareText.key(swapLayout(typed,RU,EN))}){String hit=m.get(alt);if(hit!=null&&!alt.equals(key))return new Result(Status.VALID_TYPO,hit,key);}
        // 2. the other alphabet (paratsetamol → парацетамол): compare everything in one phonetic Latin form
        String lk=phonetic(key);String hit=lat.get(lk);if(hit!=null)return new Result(Status.VALID_TYPO,hit,key);
        // 3. spelling mistakes: forgiven edits grow with the word (5–7 letters: 1, 8–11: 2, 12+: 3)
        if(key.length()<5)return Result.of(Status.INVALID,key);
        int tol=key.length()>=12?3:key.length()>=8?2:1;
        String best=null;int bestD=tol+1;boolean tie=false;
        for(var space:List.of(Map.entry(key,m),Map.entry(lk,lat)))for(var e:space.getValue().entrySet()){
            if(e.getKey().length()<5)continue;
            int d=RareText.distance(space.getKey(),e.getKey(),tol);if(d>tol)continue;
            if(d<bestD){best=e.getValue();bestD=d;tie=false;}
            else if(d==bestD&&!e.getValue().equals(best))tie=true;
        }
        if(best==null)return Result.of(Status.INVALID,key);
        if(tie)return Result.of(Status.UNCERTAIN,key);
        return new Result(Status.VALID_TYPO,best,key);
    }

    private final Map<String,Map<String,String>> latin=new HashMap<>();
    private static Map<String,String> latinIndex(Map<String,String> m){Map<String,String> o=new HashMap<>();Set<String> clash=new HashSet<>();
        for(var e:m.entrySet()){String k=phonetic(e.getKey());String prev=o.putIfAbsent(k,e.getValue());if(prev!=null&&!prev.equals(e.getValue()))clash.add(k);}
        clash.forEach(o::remove);return o;} // a phonetic form shared by two answers is never used
    static final String EN="`qwertyuiop[]asdfghjkl;'zxcvbnm,.",RU="ёйцукенгшщзхъфывапролджэячсмитьбю";
    static String swapLayout(String s,String from,String to){StringBuilder b=new StringBuilder();for(char c:s.toLowerCase(Locale.ROOT).toCharArray()){int k=from.indexOf(c);b.append(k>=0?to.charAt(k):c);}return b.toString();}
    private static final String[][] CYR={{"а","a"},{"б","b"},{"в","v"},{"г","g"},{"д","d"},{"е","e"},{"ж","zh"},{"з","z"},{"и","i"},{"й","i"},{"к","k"},{"л","l"},{"м","m"},{"н","n"},{"о","o"},{"п","p"},{"р","r"},{"с","s"},{"т","t"},{"у","u"},{"ф","f"},{"х","h"},{"ц","ts"},{"ч","ch"},{"ш","sh"},{"щ","sh"},{"ъ",""},{"ы","i"},{"ь",""},{"э","e"},{"ю","yu"},{"я","ya"}};
    /** one rough phonetic Latin spelling for Cyrillic and Latin alike (ц/ts/c, ф/ph, й/y …) */
    static String phonetic(String key){
        StringBuilder b=new StringBuilder();
        outer:for(int i=0;i<key.length();i++){String c=String.valueOf(key.charAt(i));for(String[] p:CYR)if(p[0].equals(c)){b.append(p[1]);continue outer;}b.append(c);}
        String s=b.toString().replace("ph","f").replace("th","t").replace("ck","k").replace("x","ks").replace("q","k").replace("w","v").replace("y","i");
        s=s.replaceAll("c(?=[eiy])","ts").replace("c","k");
        return s.replaceAll("(.)\\1+","$1");
    }

    /**
     * Live monitoring only (never scoring): which answers a half-typed draft could become. A validated draft is its
     * answer; otherwise every answer with an alias starting with the draft (4+ characters, at most 4 candidates).
     */
    public Set<String> candidates(RareQuestion q,String draft){
        Result r=validate(q,draft);if(r.valid())return Set.of(r.answerId());
        String key=r.key();if(key.length()<4)return Set.of();
        Set<String> out=new TreeSet<>();
        for(var e:index.computeIfAbsent(q.id(),x->build(q)).entrySet())if(e.getKey().startsWith(key)){out.add(e.getValue());if(out.size()>4)return Set.of();}
        return out;
    }
}
