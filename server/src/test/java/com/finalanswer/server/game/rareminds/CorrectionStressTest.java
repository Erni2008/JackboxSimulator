package com.finalanswer.server.game.rareminds;

import org.junit.jupiter.api.Test;
import java.util.*;
import java.util.function.*;
import static org.junit.jupiter.api.Assertions.*;

/** Real-world mistakes over the whole bank; each kind must be corrected to the intended answer. */
class CorrectionStressTest {
    static final String ROWS_EN[]={"qwertyuiop","asdfghjkl","zxcvbnm"},ROWS_RU[]={"йцукенгшщзхъ","фывапролджэ","ячсмитьбю"};
    static char neighbour(char c,Random r){for(String[] rows:new String[][]{ROWS_EN,ROWS_RU})for(int y=0;y<3;y++){int x=rows[y].indexOf(c);if(x<0)continue;
        List<Character> n=new ArrayList<>();if(x>0)n.add(rows[y].charAt(x-1));if(x+1<rows[y].length())n.add(rows[y].charAt(x+1));return n.get(r.nextInt(n.size()));}return c;}
    static String edit(String s,Random r){int i=1+r.nextInt(Math.max(1,s.length()-1));if(i>=s.length())i=s.length()-1;char c=s.charAt(i);if(!Character.isLetter(c))return s;
        return switch(r.nextInt(4)){case 0->s.substring(0,i)+s.substring(i+1);case 1->s.substring(0,i)+c+s.substring(i);
            case 2->i+1<s.length()?s.substring(0,i)+s.charAt(i+1)+c+s.substring(i+2):s;default->s.substring(0,i)+neighbour(c,r)+s.substring(i+1);};}
    Map<String,Double> rates=new LinkedHashMap<>();List<String> fails=new ArrayList<>();
    void kind(String name,int minLen,BiFunction<String,Random,String> mut){
        var bank=RareQuestionBank.load();var v=bank.validator();Random r=new Random(name.hashCode());int tot=0,ok=0;
        for(var q:bank.questions())for(var a:q.answers())for(String alias:List.of(a.labelEn(),a.labelRu())){String k=alias.toLowerCase(Locale.ROOT);if(RareText.key(k).length()<minLen)continue;
            String m=mut.apply(k,r);if(m==null||RareText.key(m).equals(RareText.key(k))||RareText.key(m).length()<4)continue; /* 3 letters are too few to guess from */tot++;var res=v.validate(q,m);
            if(res.valid()&&res.answerId().equals(a.id()))ok++;else if(fails.size()<60)fails.add(name+": "+q.id()+" '"+m+"' -> "+res.status()+" "+res.answerId()+" (want "+a.id()+")");}
        rates.put(name,tot==0?100:ok*100.0/tot); // tot 0: normalisation already makes them identical
    }
    @Test void realWorldMistakes(){
        kind("one typo",4,(s,r)->edit(s,r));
        kind("two typos (8+ letters)",8,(s,r)->edit(edit(s,r),r));
        kind("neighbour key",5,(s,r)->{int i=1+r.nextInt(s.length()-1);return s.substring(0,i)+neighbour(s.charAt(i),r)+s.substring(i+1);});
        kind("plural",4,(s,r)->s.matches(".*[a-z]$")?s+(s.endsWith("s")?"es":"s"):s.matches(".*[а-я]$")?s.replaceAll("[аяоеь]$","")+"ы":null);
        kind("article",4,(s,r)->s.matches("[a-z].*")?"the "+s:null);
        kind("no spaces",4,(s,r)->s.contains(" ")?s.replace(" ",""):null);
        kind("extra spaces + caps",4,(s,r)->"  "+s.toUpperCase(Locale.ROOT).replace(" ","   ")+" ");
        kind("ё/е",4,(s,r)->s.contains("е")?s.replaceFirst("е","ё"):null);
        rates.forEach((k,v)->System.out.printf("STRESS %-24s %.1f%%%n",k,v));fails.forEach(f->System.out.println("FAIL "+f));
        rates.forEach((k,v)->assertTrue(v>=99,k+" "+v));
        var v=RareQuestionBank.load().validator();var caps=RareQuestionBank.load().get("world_capital");
        for(String s:new String[]{"Washington","  WASHINGTON ","wahsington","the washington","Washingon","вашингтон","Вашингтн","washington dc","Washington D.C."})assertEquals("washington",v.validate(caps,s).answerId(),s);
    }
}
