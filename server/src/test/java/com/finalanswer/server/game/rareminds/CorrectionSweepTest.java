package com.finalanswer.server.game.rareminds;

import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

/** Every alias of every answer in the bank, misspelled by one random edit, must be corrected to that same answer. */
class CorrectionSweepTest {
    @Test void everyAnswerSurvivesATypo(){
        var bank=RareQuestionBank.load();var v=bank.validator();Random r=new Random(11);int total=0,ok=0;List<String> fails=new ArrayList<>();
        for(var q:bank.questions())for(var a:q.answers())for(String alias:List.of(a.labelEn(),a.labelRu())){
            String k=alias.toLowerCase(Locale.ROOT);if(RareText.key(k).length()<4)continue;
            for(int rep=0;rep<3;rep++){String typo=mutate(k,r);if(RareText.key(typo).equals(RareText.key(k))||RareText.key(typo).length()<4)continue;total++;
                var res=v.validate(q,typo);if(res.valid()&&res.answerId().equals(a.id()))ok++;else if(fails.size()<40)fails.add(q.id()+": "+typo+" -> "+res.status()+" "+res.answerId()+" (want "+a.id()+")");}}
        double rate=ok*100.0/total;System.out.printf("typo sweep: %d/%d corrected (%.1f%%)%n",ok,total,rate);fails.forEach(System.out::println);
        assertTrue(rate>=99,"typo correction rate "+rate);
    }
    /** one edit inside the word (never the first letter): drop, double, swap or replace with a neighbouring letter */
    static String mutate(String s,Random r){
        int i=1+r.nextInt(Math.max(1,s.length()-1));if(i>=s.length())i=s.length()-1;char c=s.charAt(i);if(!Character.isLetter(c))return s;
        return switch(r.nextInt(4)){
            case 0->s.substring(0,i)+s.substring(i+1);
            case 1->s.substring(0,i)+c+s.substring(i);
            case 2->i+1<s.length()?s.substring(0,i)+s.charAt(i+1)+c+s.substring(i+2):s.substring(0,i)+s.substring(i+1);
            default->s.substring(0,i)+(char)(c+(r.nextBoolean()?1:-1))+s.substring(i+1);
        };
    }
}
