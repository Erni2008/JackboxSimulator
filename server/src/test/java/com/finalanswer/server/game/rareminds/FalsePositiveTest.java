package com.finalanswer.server.game.rareminds;

import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

/** Words that are NOT answers to a question must not be "corrected" into one. */
class FalsePositiveTest {
    static final String[] EVERYDAY={"table","chair","window","computer","banana bread","telephone","river","mountain","pencil","holiday","кошка","собака","стол","окно","телевизор","дерево","машина","книга","школа","погода","love","house","water","music","garden","дом","вода","любовь","молоко","город","asdf","qwerty","йцукен","hello","привет","yes","no","да","нет","idk","не знаю"};
    @Test void unrelatedWordsStayInvalid(){
        var bank=RareQuestionBank.load();var v=bank.validator();int tot=0,bad=0;List<String> fails=new ArrayList<>();
        for(var q:bank.questions()){
            Set<String> own=new HashSet<>();for(var a:q.answers())for(String al:a.aliases())own.add(RareText.key(al));
            List<String> probes=new ArrayList<>(List.of(EVERYDAY));
            for(var o:bank.questions())if(o!=q)for(var a:o.answers()){probes.add(a.labelEn());probes.add(a.labelRu());}
            for(String p:probes){String k=RareText.key(p);if(own.contains(k))continue;boolean near=false;
                for(String ok:own)if(RareText.distance(k,ok,1)<=1){near=true;break;} // a genuine near-miss of a real answer is fine to accept
                if(near)continue;tot++;var r=v.validate(q,p);if(r.valid()){bad++;if(fails.size()<80)fails.add(q.id()+": '"+p+"' -> "+r.answerId());}}
        }
        double rate=bad*100.0/tot;System.out.printf("FALSE POSITIVES %d/%d (%.2f%%)%n",bad,tot,rate);fails.forEach(f->System.out.println("FP "+f));
        assertTrue(rate<0.5,"false positives "+rate);
    }
}
