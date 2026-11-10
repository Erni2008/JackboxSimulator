package com.erni.finalanswer.gameplay.forgottenroom;

import java.util.*;

/**
 * One explicit change applied during the blackout. {@code before}/{@code after} are null when the object is absent
 * (appeared / disappeared). The answer key is these records, never a comparison of rendered images.
 */
public record RoomChange(ChangeType type,String objectId,RoomState.Placed before,RoomState.Placed after){
    public RoomChange{Objects.requireNonNull(type);Objects.requireNonNull(objectId);
        if(before==null&&after==null)throw new IllegalArgumentException("Empty change");}
    /** Places a player may point at to identify this change: both ends of a move, otherwise its one place. */
    public Set<String> slots(){
        Set<String> out=new LinkedHashSet<>();if(before!=null)out.add(before.slotId());if(after!=null)out.add(after.slotId());return out;}
    /** Short Russian caption for the reveal, e.g. «СТАРИННЫЕ ЧАСЫ ИСЧЕЗЛИ». */
    public String captionRu(){
        var def=RoomCatalog.object(objectId);String name=def.nameRu().toUpperCase(Locale.ROOT);char g=def.gender();
        return switch(type){
            case DISAPPEARED->name+" "+verb(g,"ИСЧЕЗ","ИСЧЕЗЛА","ИСЧЕЗЛО","ИСЧЕЗЛИ");
            case APPEARED->name+" "+verb(g,"ПОЯВИЛСЯ","ПОЯВИЛАСЬ","ПОЯВИЛОСЬ","ПОЯВИЛИСЬ")+" ИЗ НИОТКУДА";
            case MOVED->name+" "+verb(g,"ПЕРЕБРАЛСЯ","ПЕРЕБРАЛАСЬ","ПЕРЕБРАЛОСЬ","ПЕРЕБРАЛИСЬ")+" НА ДРУГОЕ МЕСТО";
            case ROTATED->def.turn()==RoomCatalog.Turn.TOPPLE?name+" "+verb(g,"УПАЛ","УПАЛА","УПАЛО","УПАЛИ")+" НА БОК":name+" "+verb(g,"ОТВЕРНУЛСЯ","ОТВЕРНУЛАСЬ","ОТВЕРНУЛОСЬ","ОТВЕРНУЛИСЬ");
            case CHANGED->name+": "+def.variantHintRu().toUpperCase(Locale.ROOT);
            case TOGGLED->name+" "+(after!=null&&after.lit()?verb(g,"ЗАЖЁГСЯ","ЗАЖГЛАСЬ","ЗАЖГЛОСЬ","ЗАЖГЛИСЬ")+" САМ"+(g=='f'?"А":g=='n'?"О":g=='p'?"И":""):verb(g,"ПОГАС","ПОГАСЛА","ПОГАСЛО","ПОГАСЛИ"));};
    }
    private static String verb(char g,String m,String f,String n,String p){return switch(g){case 'f'->f;case 'n'->n;case 'p'->p;default->m;};}
}
