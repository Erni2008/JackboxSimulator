package com.erni.finalanswer.gameplay.cursedcards;

/** One physical card. {@code value} 1–10, or {@link #DEATH}. Ids are stable for the whole match. */
public record CursedCard(int id,int value){
    public static final int DEATH=0;
    public boolean death(){return value==DEATH;}
    @Override public String toString(){return death()?"DEATH#"+id:value+"#"+id;}
}
