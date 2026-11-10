package com.erni.finalanswer.gameplay.forgottenroom;

import java.util.*;

/**
 * Difficulty presets. Harder rooms are denser, allow small objects and subtler change types (rotation, appearance);
 * every change stays objectively identifiable (whole objects, never pixel-level tweaks).
 */
public enum RoomDifficulty {
    EASY(8,10,2,2,EnumSet.of(RoomCatalog.Size.LARGE,RoomCatalog.Size.MEDIUM),
        EnumSet.of(ChangeType.DISAPPEARED,ChangeType.APPEARED,ChangeType.MOVED,ChangeType.TOGGLED),.30f),
    MEDIUM(12,15,3,3,EnumSet.of(RoomCatalog.Size.LARGE,RoomCatalog.Size.MEDIUM,RoomCatalog.Size.SMALL),
        EnumSet.of(ChangeType.DISAPPEARED,ChangeType.APPEARED,ChangeType.MOVED,ChangeType.TOGGLED,ChangeType.ROTATED,ChangeType.CHANGED),.24f),
    HARD(16,20,4,5,EnumSet.allOf(RoomCatalog.Size.class),EnumSet.allOf(ChangeType.class),.18f);

    public final int minObjects,maxObjects,minChanges,maxChanges;
    public final Set<RoomCatalog.Size> sizes;public final Set<ChangeType> changeTypes;
    /** Minimum distance an object travels when it moves, in normalised screen units, so a move is never a nudge. */
    public final float minMove;
    public static final int OBSERVATION_SECONDS=10;
    RoomDifficulty(int minObjects,int maxObjects,int minChanges,int maxChanges,Set<RoomCatalog.Size> sizes,Set<ChangeType> types,float minMove){
        this.minObjects=minObjects;this.maxObjects=maxObjects;this.minChanges=minChanges;this.maxChanges=maxChanges;
        this.sizes=Collections.unmodifiableSet(EnumSet.copyOf(sizes));this.changeTypes=Collections.unmodifiableSet(EnumSet.copyOf(types));this.minMove=minMove;}
    public static RoomDifficulty parse(String value){
        if(value==null)return MEDIUM;
        try{return valueOf(value.trim().toUpperCase(Locale.ROOT));}catch(IllegalArgumentException e){return MEDIUM;}}
}
