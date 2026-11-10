package com.erni.finalanswer.cursedboxes;

/** What the host says while refilling the shotgun mid-turn (more than five shots). Never the same line twice in a row. */
public final class CursedReloadLines {
    public static final String[] LINES={
        "Не расходимся, я перезаряжаюсь!",
        "Эти ящики сами себя не прострелят... щас только перезаряжусь.",
        "Я слышу, как вы там дышите.",
        "Патроны кончились. Терпение — нет.",
        "Кто-то в ящике только что икнул. Я запомнил.",
        "Спокойно, это не промах. Это разминка.",
        "Сидите тихо. Я уже почти чувствую запах страха.",
        "Ещё пара патронов — и кто-то станет призраком."};
    private final int[] order=new int[LINES.length];private final java.util.Random random;private int used=LINES.length,last=-1;
    public CursedReloadLines(long seed){random=new java.util.Random(seed);for(int i=0;i<order.length;i++)order[i]=i;}
    /** Next line from a shuffled deck; a new deck never starts with the line just spoken. */
    public String next(){
        if(used>=order.length){for(int i=order.length-1;i>0;i--){int j=random.nextInt(i+1),t=order[i];order[i]=order[j];order[j]=t;}
            if(order[0]==last){int t=order[0];order[0]=order[1];order[1]=t;}used=0;}
        last=order[used++];return LINES[last];
    }
}
