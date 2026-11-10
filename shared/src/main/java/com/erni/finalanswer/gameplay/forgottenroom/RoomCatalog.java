package com.erni.finalanswer.gameplay.forgottenroom;

import java.util.*;

/**
 * The forgotten room's fixed furniture (positions where objects can stand) and its object library.
 * Pure data: adding a slot or an object here needs no change to generation, scoring or networking.
 * Coordinates are normalised to the 1920×1080 composition, origin top-left, pointing at the object's base centre.
 */
public final class RoomCatalog {
    private RoomCatalog(){}

    /** Furniture surfaces an object may stand on (or hang from). */
    public enum Surface {MANTEL,TABLE,SHELF,WALL,FLOOR,WINDOWSILL,DESK}
    /** Visual weight; easy rooms use only large and medium objects. */
    public enum Size {LARGE,MEDIUM,SMALL}

    /** A position in the room. {@code labelRu} names the place, never the object, so empty places don't give anything away. */
    public record Slot(String id,float x,float y,Surface surface,String labelRu){}

    /**
     * One object of the library. {@code variants} counts its appearances (colour, clock time, painting…; 1 = none);
     * {@code rotatable} means it can be turned (upside down / around); {@code light} means it can be lit or put out.
     */
    public record ObjectDef(String id,String nameRu,char gender,Size size,Set<Surface> surfaces,int variants,boolean rotatable,boolean light,String variantHintRu){
        public ObjectDef{surfaces=Set.copyOf(surfaces);if(variants<1)throw new IllegalArgumentException("variants");}
        public boolean supports(ChangeType type){return switch(type){
            case DISAPPEARED,MOVED,APPEARED->true;
            case ROTATED->rotatable;
            case CHANGED->variants>1;
            case TOGGLED->light;};}
    }

    private static Slot s(String id,float x,float y,Surface surface,String label){return new Slot(id,x,y,surface,label);}
    private static ObjectDef o(String id,String name,Size size,Set<Surface> on,int variants,boolean rot,boolean light,String hint){return new ObjectDef(id,name,GENDER.get(id),size,on,variants,rot,light,hint);}
    private static final Map<String,Character> GENDER=Map.ofEntries(Map.entry("painting",'f'),Map.entry("mirror",'n'),Map.entry("clock",'p'),Map.entry("mask",'f'),Map.entry("crucifix",'n'),Map.entry("portrait",'m'),Map.entry("skull",'m'),Map.entry("candlestick",'m'),Map.entry("candelabra",'m'),Map.entry("lantern",'m'),Map.entry("book",'f'),Map.entry("bottle",'f'),Map.entry("doll",'f'),Map.entry("box",'f'),Map.entry("vase",'f'),Map.entry("radio",'n'),Map.entry("key",'m'),Map.entry("pocket_watch",'p'),Map.entry("hourglass",'p'),Map.entry("music_box",'f'),Map.entry("raven",'n'),Map.entry("globe",'m'),Map.entry("teacup",'f'),Map.entry("jar",'f'),Map.entry("bell",'m'),Map.entry("chest",'m'));
    private static final Surface M=Surface.MANTEL,T=Surface.TABLE,SH=Surface.SHELF,W=Surface.WALL,F=Surface.FLOOR,WS=Surface.WINDOWSILL,D=Surface.DESK;

    /** 30 places, spread so any two on the same surface are at least ~0.08 apart. */
    public static final List<Slot> SLOTS=List.of(
        s("wall_l1",.12f,.30f,W,"Стена слева, выше"), s("wall_l2",.22f,.38f,W,"Стена слева, ниже"),
        s("wall_c1",.42f,.20f,W,"Над камином, слева"), s("wall_c2",.58f,.20f,W,"Над камином, справа"),
        s("wall_r1",.80f,.28f,W,"Стена справа, выше"), s("wall_r2",.90f,.40f,W,"Стена справа, ниже"),
        s("mantel_1",.38f,.44f,M,"Камин, левый край"), s("mantel_2",.46f,.44f,M,"Камин, левее центра"),
        s("mantel_3",.54f,.44f,M,"Камин, правее центра"), s("mantel_4",.62f,.44f,M,"Камин, правый край"),
        s("shelf_1",.08f,.52f,SH,"Полка слева, край"), s("shelf_2",.17f,.52f,SH,"Полка слева, середина"),
        s("shelf_3",.26f,.52f,SH,"Полка слева, у стены"),
        s("sill_1",.76f,.50f,WS,"Подоконник, слева"), s("sill_2",.86f,.50f,WS,"Подоконник, справа"),
        s("table_1",.30f,.66f,T,"Стол, левый край"), s("table_2",.39f,.64f,T,"Стол, слева"),
        s("table_3",.48f,.63f,T,"Стол, центр"), s("table_4",.57f,.64f,T,"Стол, справа"),
        s("table_5",.66f,.66f,T,"Стол, правый край"),
        s("desk_1",.78f,.70f,D,"Бюро, слева"), s("desk_2",.88f,.70f,D,"Бюро, справа"),
        s("floor_1",.06f,.86f,F,"Пол слева, у стены"), s("floor_2",.16f,.90f,F,"Пол слева"),
        s("floor_3",.28f,.92f,F,"Пол перед столом, слева"), s("floor_4",.44f,.93f,F,"Пол перед столом"),
        s("floor_5",.60f,.92f,F,"Пол перед столом, справа"), s("floor_6",.74f,.90f,F,"Пол у бюро"),
        s("floor_7",.86f,.88f,F,"Пол справа"), s("floor_8",.95f,.84f,F,"Пол справа, у окна"));

    /** 26 objects. Each id is unique in a room, so answers never depend on telling twins apart. */
    public static final List<ObjectDef> OBJECTS=List.of(
        o("painting","Картина",Size.LARGE,Set.of(W),3,true,false,"другой сюжет"),
        o("mirror","Зеркало",Size.LARGE,Set.of(W),2,false,false,"другое отражение"),
        o("clock","Старинные часы",Size.LARGE,Set.of(M,W),3,false,false,"другое время"),
        o("mask","Маска",Size.MEDIUM,Set.of(W),2,true,false,"другое лицо"),
        o("crucifix","Распятие",Size.MEDIUM,Set.of(W),1,true,false,""),
        o("portrait","Маленький портрет",Size.MEDIUM,Set.of(W),3,true,false,"другое лицо"),
        o("skull","Череп",Size.MEDIUM,Set.of(M,T,SH,D),1,true,false,""),
        o("candlestick","Подсвечник",Size.MEDIUM,Set.of(M,T,SH,WS,D),1,false,true,""),
        o("candelabra","Канделябр",Size.LARGE,Set.of(M,T,D),1,false,true,""),
        o("lantern","Фонарь",Size.LARGE,Set.of(F,WS,T),1,false,true,""),
        o("book","Старая книга",Size.MEDIUM,Set.of(T,SH,D,M),3,false,false,"другой цвет"),
        o("bottle","Бутылка",Size.MEDIUM,Set.of(T,SH,WS,D,M),3,false,false,"другой цвет"),
        o("doll","Кукла",Size.MEDIUM,Set.of(SH,F,T,WS),2,true,false,"другое платье"),
        o("box","Деревянная шкатулка",Size.MEDIUM,Set.of(T,SH,D,F),2,false,false,"открыта / закрыта"),
        o("vase","Ваза",Size.LARGE,Set.of(M,T,F,WS),2,false,false,"разбита"),
        o("radio","Старое радио",Size.LARGE,Set.of(D,T,SH),2,false,true,""),
        o("key","Ржавый ключ",Size.SMALL,Set.of(T,D,SH,M),1,true,false,""),
        o("pocket_watch","Карманные часы",Size.SMALL,Set.of(T,D,M),2,false,false,"открыты / закрыты"),
        o("hourglass","Песочные часы",Size.MEDIUM,Set.of(M,T,SH,D),1,true,false,""),
        o("music_box","Музыкальная шкатулка",Size.MEDIUM,Set.of(T,D,SH),2,false,false,"открыта / закрыта"),
        o("raven","Чучело ворона",Size.MEDIUM,Set.of(SH,M,WS,D),1,true,false,""),
        o("globe","Глобус",Size.LARGE,Set.of(F,D,T),1,true,false,""),
        o("teacup","Чашка",Size.SMALL,Set.of(T,D,SH,WS),2,false,false,"другой цвет"),
        o("jar","Банка с глазом",Size.MEDIUM,Set.of(SH,D,T),2,true,false,"глаз смотрит иначе"),
        o("bell","Колокольчик",Size.SMALL,Set.of(T,D,SH,M),1,true,false,""),
        o("chest","Сундук",Size.LARGE,Set.of(F),2,false,false,"открыт / закрыт"));

    private static final Map<String,Slot> SLOT_BY_ID=new HashMap<>();private static final Map<String,ObjectDef> OBJECT_BY_ID=new HashMap<>();
    static{for(Slot slot:SLOTS)if(SLOT_BY_ID.put(slot.id(),slot)!=null)throw new IllegalStateException("Duplicate slot "+slot.id());
        for(ObjectDef def:OBJECTS)if(OBJECT_BY_ID.put(def.id(),def)!=null)throw new IllegalStateException("Duplicate object "+def.id());}
    public static Slot slot(String id){Slot slot=SLOT_BY_ID.get(id);if(slot==null)throw new IllegalArgumentException("Unknown slot "+id);return slot;}
    public static boolean hasSlot(String id){return SLOT_BY_ID.containsKey(id);}
    public static ObjectDef object(String id){ObjectDef def=OBJECT_BY_ID.get(id);if(def==null)throw new IllegalArgumentException("Unknown object "+id);return def;}
    public static float distance(Slot a,Slot b){float dx=a.x()-b.x(),dy=(a.y()-b.y())*1.78f;return (float)Math.sqrt(dx*dx+dy*dy);}
}
