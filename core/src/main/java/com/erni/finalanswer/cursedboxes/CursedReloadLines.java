package com.erni.finalanswer.cursedboxes;

/** What the host says while refilling the shotgun mid-turn (more than five shots). Never the same line twice in a row. */
public final class CursedReloadLines {
    public static final String[] LINES={
        "Пять патронов?! Кто вообще так считает выстрелы...",
        "Минуточку! Дробовик не резиновый!",
        "Не расходимся, я перезаряжаюсь!",
        "Так... где-то тут были ещё патроны...",
        "Эти ящики сами себя не прострелят.",
        "Я слышу, как вы там дышите.",
        "Скелет, хватит хихикать в ящике!",
        "Ещё чуть-чуть, и я тебя найду.",
        "Кто спрятал мои патроны? Признавайтесь!",
        "Патроны кончились. Терпение — нет."};
    private final int[] order=new int[LINES.length];private final java.util.Random random;private int used=LINES.length,last=-1;
    public CursedReloadLines(long seed){random=new java.util.Random(seed);for(int i=0;i<order.length;i++)order[i]=i;}
    /** Next line from a shuffled deck; a new deck never starts with the line just spoken. */
    public String next(){
        if(used>=order.length){for(int i=order.length-1;i>0;i--){int j=random.nextInt(i+1),t=order[i];order[i]=order[j];order[j]=t;}
            if(order[0]==last){int t=order[0];order[0]=order[1];order[1]=t;}used=0;}
        last=order[used++];return LINES[last];
    }
}
