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
    public enum Surface {MANTEL,TABLE,SHELF,WALL,FLOOR,WINDOWSILL,DESK,FRAME,SEAT}
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

    /**
     * A room = one painted background + the places on its furniture. Every background brings its own places, so new
     * rooms are data only. Coordinates point at the base of an object in the 16:9 picture (top-left origin, 0–1).
     */
    public record Layout(String id,String background,String nameRu,List<Slot> slots){
        public Layout{slots=List.copyOf(slots);Set<String> ids=new HashSet<>();for(Slot s:slots)if(!ids.add(s.id()))throw new IllegalStateException("Duplicate slot "+s.id()+" in "+id);}
        public Slot slot(String slotId){for(Slot s:slots)if(s.id().equals(slotId))return s;throw new IllegalArgumentException("Unknown slot "+slotId+" in "+id);}
        public boolean hasSlot(String slotId){for(Slot s:slots)if(s.id().equals(slotId))return true;return false;}
    }

    /** Room 1: moonlit study (window, bookcase, grandfather clock, empty gilt frame, sideboard, armchair, table). */
    public static final Layout STUDY=new Layout("study","forgotten_room/rooms/room_01.jpg","Кабинет при луне",List.of(
        s("shelf_1",.37f,.307f,SH,"Книжный шкаф, верхняя полка слева"), s("shelf_2",.455f,.307f,SH,"Книжный шкаф, верхняя полка справа"),
        s("shelf_3",.37f,.395f,SH,"Книжный шкаф, средняя полка слева"), s("shelf_4",.455f,.395f,SH,"Книжный шкаф, средняя полка справа"),
        s("shelf_5",.37f,.485f,SH,"Книжный шкаф, нижняя полка слева"), s("shelf_6",.455f,.485f,SH,"Книжный шкаф, нижняя полка справа"),
        s("cabinet_1",.36f,.572f,D,"Тумба шкафа, слева"), s("cabinet_2",.455f,.572f,D,"Тумба шкафа, справа"),
        s("sill_1",.15f,.558f,WS,"Подоконник, слева"), s("sill_2",.205f,.558f,WS,"Подоконник, справа"),
        s("sideboard_1",.705f,.568f,D,"Комод, слева"), s("sideboard_2",.78f,.568f,D,"Комод, центр"), s("sideboard_3",.855f,.568f,D,"Комод, справа"),
        s("wall_1",.69f,.36f,W,"Стена между часами и рамой"), s("frame",.82f,.235f,Surface.FRAME,"Золотая рама"),
        s("table_1",.15f,.80f,T,"Стол, ближний край"), s("table_2",.25f,.76f,T,"Стол, слева"),
        s("table_3",.35f,.74f,T,"Стол, на скатерти"), s("table_4",.465f,.73f,T,"Стол, дальний край"),
        s("armchair",.875f,.73f,Surface.SEAT,"Кресло"),
        s("floor_1",.605f,.835f,F,"Пол у часов"), s("floor_2",.53f,.955f,F,"Ковёр, слева"),
        s("floor_3",.66f,.95f,F,"Ковёр, центр"), s("floor_4",.78f,.945f,F,"Ковёр, справа")));

    /** All rooms; a round picks one by seed. Add new backgrounds here. */
    public static final List<Layout> LAYOUTS=List.of(STUDY);
    public static Layout layout(String id){for(Layout l:LAYOUTS)if(l.id().equals(id))return l;throw new IllegalArgumentException("Unknown room "+id);}

    /** 26 objects. Each id is unique in a room, so answers never depend on telling twins apart. */
    public static final List<ObjectDef> OBJECTS=List.of(
        o("painting","Картина",Size.LARGE,Set.of(Surface.FRAME),3,true,false,"другой сюжет"),
        o("mirror","Зеркало",Size.LARGE,Set.of(W),2,false,false,"другое отражение"),
        o("clock","Старинные часы",Size.LARGE,Set.of(M,W),3,false,false,"другое время"),
        o("mask","Маска",Size.MEDIUM,Set.of(W),2,true,false,"другое лицо"),
        o("crucifix","Распятие",Size.MEDIUM,Set.of(W),1,true,false,""),
        o("portrait","Маленький портрет",Size.MEDIUM,Set.of(W,D),3,true,false,"другое лицо"),
        o("skull","Череп",Size.MEDIUM,Set.of(M,T,SH,D),1,true,false,""),
        o("candlestick","Подсвечник",Size.MEDIUM,Set.of(M,T,SH,WS,D),1,false,true,""),
        o("candelabra","Канделябр",Size.LARGE,Set.of(M,T,D),1,false,true,""),
        o("lantern","Фонарь",Size.LARGE,Set.of(F,WS,T),1,false,true,""),
        o("book","Старая книга",Size.MEDIUM,Set.of(T,SH,D,M,Surface.SEAT),3,false,false,"другой цвет"),
        o("bottle","Бутылка",Size.MEDIUM,Set.of(T,SH,WS,D,M),3,false,false,"другой цвет"),
        o("doll","Кукла",Size.MEDIUM,Set.of(SH,F,T,WS,Surface.SEAT),2,true,false,"другое платье"),
        o("box","Деревянная шкатулка",Size.MEDIUM,Set.of(T,SH,D,F,Surface.SEAT),2,false,false,"открыта / закрыта"),
        o("vase","Ваза",Size.LARGE,Set.of(M,T,F,WS),2,false,false,"разбита"),
        o("radio","Старое радио",Size.LARGE,Set.of(D,T,SH),2,false,true,""),
        o("key","Ржавый ключ",Size.SMALL,Set.of(T,D,SH,M),1,true,false,""),
        o("pocket_watch","Карманные часы",Size.SMALL,Set.of(T,D,M),2,false,false,"открыты / закрыты"),
        o("hourglass","Песочные часы",Size.MEDIUM,Set.of(M,T,SH,D),1,true,false,""),
        o("music_box","Музыкальная шкатулка",Size.MEDIUM,Set.of(T,D,SH),2,false,false,"открыта / закрыта"),
        o("raven","Чучело ворона",Size.MEDIUM,Set.of(SH,M,WS,D,Surface.SEAT),1,true,false,""),
        o("globe","Глобус",Size.LARGE,Set.of(F,D,T),1,true,false,""),
        o("teacup","Чашка",Size.SMALL,Set.of(T,D,SH,WS),2,false,false,"другой цвет"),
        o("jar","Банка с глазом",Size.MEDIUM,Set.of(SH,D,T),2,true,false,"глаз смотрит иначе"),
        o("bell","Колокольчик",Size.SMALL,Set.of(T,D,SH,M),1,true,false,""),
        o("chest","Сундук",Size.LARGE,Set.of(F),2,false,false,"открыт / закрыт"));

    private static final Map<String,ObjectDef> OBJECT_BY_ID=new HashMap<>();
    static{for(ObjectDef def:OBJECTS)if(OBJECT_BY_ID.put(def.id(),def)!=null)throw new IllegalStateException("Duplicate object "+def.id());}
    public static ObjectDef object(String id){ObjectDef def=OBJECT_BY_ID.get(id);if(def==null)throw new IllegalArgumentException("Unknown object "+id);return def;}
    public static float distance(Slot a,Slot b){float dx=a.x()-b.x(),dy=(a.y()-b.y())*1.78f;return (float)Math.sqrt(dx*dx+dy*dy);}
}
