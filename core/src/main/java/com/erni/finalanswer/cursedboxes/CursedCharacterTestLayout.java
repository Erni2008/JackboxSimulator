package com.erni.finalanswer.cursedboxes;

import java.util.Random;

/** Seeded, allocation-free reshuffle on explicit resets: eight occupants, one empty target, seven untouched. */
public final class CursedCharacterTestLayout {
    private final Random random;
    private final int[] boxes=new int[16];
    private int previousFirst=-1;
    public CursedCharacterTestLayout(long seed){random=new Random(seed);}
    public void next(){
        for(int i=0;i<16;i++)boxes[i]=i;
        for(int i=15;i>0;i--){int j=random.nextInt(i+1),v=boxes[i];boxes[i]=boxes[j];boxes[j]=v;}
        if(boxes[0]==previousFirst){int v=boxes[0];boxes[0]=boxes[1];boxes[1]=v;}
        previousFirst=boxes[0];
    }
    public int slot(int target){if(target<0||target>8)throw new IllegalArgumentException("Target index: "+target);return boxes[target];}
}
