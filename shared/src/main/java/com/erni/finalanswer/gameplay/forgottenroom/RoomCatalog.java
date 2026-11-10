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
    public enum Surface {MANTEL,TABLE,SHELF,WALL,FLOOR,WINDOWSILL,DESK,FRAME,SEAT,HANG}
    /** Visual weight; easy rooms skip small objects. TALL = floor-standing furniture-height pieces. */
    public enum Size {TALL,LARGE,MEDIUM,SMALL}

    /** A position in the room. {@code labelRu} names the place, never the object, so empty places don't give anything away. */
    public record Slot(String id,float x,float y,Surface surface,String labelRu){}

    /**
     * One object of the library. {@code variants} counts its appearances (colour, clock time, painting…; 1 = none);
     * {@code turn} says how it can be turned (never upside down); {@code light} means it gives light; {@code toggles} that it can also be put out (needs lit and unlit art).
     */
    /** How an object can be turned so it still looks natural: FLIP = faces the other way, TOPPLE = lies on its side. */
    public enum Turn {NONE,FLIP,TOPPLE}
    public record ObjectDef(String id,String nameRu,char gender,Size size,Set<Surface> surfaces,int variants,Turn turn,boolean light,boolean toggles,String variantHintRu){
        public ObjectDef{surfaces=Set.copyOf(surfaces);if(variants<1)throw new IllegalArgumentException("variants");}
        public boolean supports(ChangeType type){return switch(type){
            case DISAPPEARED,MOVED,APPEARED->true;
            case ROTATED->turn!=Turn.NONE;
            case CHANGED->variants>1;
            case TOGGLED->light&&toggles;};}
    }

    private static Slot s(String id,float x,float y,Surface surface,String label){return new Slot(id,x,y,surface,label);}
    private static ObjectDef o(String id,String name,char gender,Size size,Set<Surface> on,Turn turn,String hint){return new ObjectDef(id,name,gender,size,on,1,turn,false,false,hint);}
    private static ObjectDef light(String id,String name,char gender,Size size,Set<Surface> on,boolean toggles){return new ObjectDef(id,name,gender,size,on,1,Turn.NONE,true,toggles,"");}
    private static final Surface M=Surface.MANTEL,T=Surface.TABLE,SH=Surface.SHELF,W=Surface.WALL,F=Surface.FLOOR,WS=Surface.WINDOWSILL,D=Surface.DESK;

    /**
     * A room = one painted background + the places on its furniture. Every background brings its own places, so new
     * rooms are data only. Coordinates point at the base of an object in the 16:9 picture (top-left origin, 0–1).
     */
    public record Layout(String id,String background,String nameRu,List<Slot> slots,Map<String,List<String>> staging){
        public Layout{slots=List.copyOf(slots);Set<String> ids=new HashSet<>();for(Slot s:slots)if(!ids.add(s.id()))throw new IllegalStateException("Duplicate slot "+s.id()+" in "+id);
            Map<String,List<String>> copy=new LinkedHashMap<>();
            for(var e:staging.entrySet()){for(String slot:e.getValue())if(!ids.contains(slot))throw new IllegalStateException("Staging "+e.getKey()+" → unknown slot "+slot);copy.put(e.getKey(),List.copyOf(e.getValue()));}
            staging=Collections.unmodifiableMap(copy);}
        /** The places an art director chose for this object in this room (empty = the object doesn't belong here). */
        public List<String> spots(String objectId){return staging.getOrDefault(objectId,List.of());}
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
        s("wall_1",.69f,.36f,W,"Стена между часами и рамой"), s("frame",.8119f,.2418f,Surface.FRAME,"Золотая рама"),
        s("table_1",.15f,.80f,T,"Стол, ближний край"), s("table_2",.25f,.76f,T,"Стол, слева"),
        s("table_3",.35f,.74f,T,"Стол, на скатерти"), s("table_4",.465f,.73f,T,"Стол, дальний край"),
        s("armchair",.875f,.768f,Surface.SEAT,"Кресло"),
        s("hang_1",.70f,.02f,Surface.HANG,"Свисает над рамой"), s("hang_2",.19f,.035f,Surface.HANG,"Свисает над окном"),
        s("floor_1",.605f,.835f,F,"Пол у часов"), s("floor_2",.53f,.955f,F,"Ковёр, слева"),
        s("floor_3",.66f,.95f,F,"Ковёр, центр"), s("floor_4",.78f,.945f,F,"Ковёр, справа")),
        // Set dressing: every object gets a few places where it looks deliberate in this study. Rounds only use these,
        // so the room always reads as a lived-in collector's study, never a pile; moves go between such places.
        Map.ofEntries(
            Map.entry("painting",List.of("frame")),
            Map.entry("ivy",List.of("hang_1","hang_2")),
            Map.entry("books",List.of("shelf_1","shelf_3","shelf_5","cabinet_1","table_1")),
            Map.entry("open_book",List.of("table_2","table_3","armchair")),
            Map.entry("bust",List.of("cabinet_2","sideboard_1","shelf_2")),
            Map.entry("candelabra",List.of("table_3","sideboard_2","sill_1")),
            Map.entry("chest",List.of("floor_1","floor_2")),
            Map.entry("clock",List.of("floor_1")),
            Map.entry("doll",List.of("armchair","shelf_6","shelf_4")),
            Map.entry("globe",List.of("sideboard_3","cabinet_1","table_4")),
            Map.entry("hourglass",List.of("shelf_6","shelf_3","sideboard_1","table_4")),
            Map.entry("key",List.of("table_1","shelf_5","sideboard_3","cabinet_2")),
            Map.entry("skull",List.of("shelf_4","shelf_2","sideboard_2","table_4")),
            Map.entry("telescope",List.of("floor_3","floor_2","sill_2"))));

    /** Room 2: sunlit library (arched window, bookcase, two sconces, old door, desk, sunlit floor). */
    public static final Layout LIBRARY=new Layout("library","forgotten_room/rooms/room_02.jpg","Солнечная библиотека",List.of(
        s("sill_1",.125f,.588f,WS,"Подоконник, слева"), s("sill_2",.205f,.588f,WS,"Подоконник, центр"), s("sill_3",.290f,.588f,WS,"Подоконник, справа"),
        s("shelf_1",.495f,.418f,SH,"Полка шкафа, между книгами"),
        s("table_1",.055f,.805f,T,"Стол, слева"), s("table_2",.150f,.795f,T,"Стол, центр"), s("table_3",.245f,.790f,T,"Стол, край"),
        s("floor_1",.385f,.800f,F,"Пол у шторы"), s("floor_2",.520f,.900f,F,"Пол в солнечном пятне"), s("floor_3",.690f,.850f,F,"Пол посередине"),
        s("floor_4",.860f,.910f,F,"Пол у двери"), s("floor_5",.600f,.775f,F,"Пол у шкафа"), s("floor_6",.960f,.800f,F,"Пол в углу"),
        s("wall_1",.625f,.450f,W,"Стена под левым бра"), s("wall_2",.915f,.440f,W,"Стена под правым бра")),
        Map.ofEntries(
            Map.entry("scrolls",List.of("table_1","table_2","sill_1")),
            Map.entry("butterfly",List.of("wall_1","wall_2")),
            Map.entry("compass",List.of("table_2","table_3","sill_2","shelf_1")),
            Map.entry("inkwell",List.of("table_1","table_3","sill_3")),
            Map.entry("flask",List.of("sill_1","sill_2","shelf_1")),
            Map.entry("hand_mirror",List.of("table_2","sill_3","shelf_1")),
            Map.entry("oil_lamp",List.of("floor_1","sill_3","floor_6")),
            Map.entry("magnifier",List.of("table_1","table_3","sill_2")),
            Map.entry("jester_mask",List.of("wall_1","wall_2","table_2")),
            Map.entry("camera",List.of("table_3","sill_1","table_1")),
            Map.entry("hourglass2",List.of("sill_2","shelf_1","table_2")),
            Map.entry("scales",List.of("table_1","sill_3","table_3")),
            Map.entry("skull2",List.of("shelf_1","sill_1","table_2")),
            Map.entry("dagger",List.of("table_2","table_1","floor_2")),
            Map.entry("goblet",List.of("table_3","sill_2")),
            Map.entry("violin",List.of("floor_5","floor_3","floor_4","floor_6"))));

    /** All rooms; a round picks one by seed. Add new backgrounds here. */
    public static final List<Layout> LAYOUTS=List.of(STUDY,LIBRARY);
    public static Layout layout(String id){for(Layout l:LAYOUTS)if(l.id().equals(id))return l;throw new IllegalArgumentException("Unknown room "+id);}

    /**
     * Objects with finished artwork (assets/forgotten_room/objects/<id>.png). Only these appear in rounds; add an
     * object here when its art exists. Each id is unique in a room, so answers never depend on telling twins apart.
     */
    public static final List<ObjectDef> OBJECTS=List.of(
        o("painting","Картина",'f',Size.LARGE,Set.of(Surface.FRAME),Turn.NONE,""),
        o("books","Стопка книг",'f',Size.MEDIUM,Set.of(SH,T,D,Surface.SEAT,F),Turn.NONE,""),
        o("open_book","Раскрытая книга",'f',Size.MEDIUM,Set.of(T,D,Surface.SEAT),Turn.NONE,""),
        o("bust","Мраморный бюст",'m',Size.LARGE,Set.of(D,T,SH),Turn.FLIP,""),
        light("candelabra","Канделябр",'m',Size.LARGE,Set.of(T,D,WS),false),
        o("chest","Сундук",'m',Size.LARGE,Set.of(F),Turn.NONE,""),
        o("clock","Напольные часы",'p',Size.TALL,Set.of(F),Turn.NONE,""),
        o("doll","Жуткая кукла",'f',Size.MEDIUM,Set.of(SH,F,T,WS,Surface.SEAT),Turn.TOPPLE,""),
        o("globe","Глобус",'m',Size.LARGE,Set.of(F,D,T),Turn.NONE,""),
        o("hourglass","Песочные часы",'p',Size.MEDIUM,Set.of(SH,T,D),Turn.TOPPLE,""),
        o("key","Связка ключей",'f',Size.SMALL,Set.of(T,D,SH),Turn.NONE,""),
        o("skull","Череп",'m',Size.MEDIUM,Set.of(SH,T,D,Surface.SEAT),Turn.FLIP,""),
        o("telescope","Телескоп",'m',Size.LARGE,Set.of(F,WS),Turn.NONE,""),
        o("ivy","Плющ",'m',Size.LARGE,Set.of(Surface.HANG),Turn.NONE,""),
        // room 2 — sunlit library
        o("scrolls","Древние свитки",'p',Size.MEDIUM,Set.of(T,WS,SH),Turn.NONE,""),
        o("butterfly","Бабочка в рамке",'f',Size.MEDIUM,Set.of(W),Turn.NONE,""),
        o("compass","Компас",'m',Size.SMALL,Set.of(T,WS,SH),Turn.FLIP,""),
        o("inkwell","Чернильница с пером",'f',Size.SMALL,Set.of(T,WS),Turn.FLIP,""),
        o("flask","Стеклянная колба",'f',Size.MEDIUM,Set.of(WS,SH,T),Turn.TOPPLE,""),
        o("hand_mirror","Ручное зеркальце",'n',Size.MEDIUM,Set.of(T,WS,SH),Turn.NONE,""),
        light("oil_lamp","Керосиновая лампа",'f',Size.MEDIUM,Set.of(F,WS,SH),false),
        o("magnifier","Лупа",'f',Size.SMALL,Set.of(T,WS),Turn.FLIP,""),
        o("jester_mask","Маска шута",'f',Size.MEDIUM,Set.of(W,T),Turn.FLIP,""),
        o("camera","Старый фотоаппарат",'m',Size.MEDIUM,Set.of(T,WS),Turn.FLIP,""),
        o("hourglass2","Песочные часы",'p',Size.MEDIUM,Set.of(WS,SH,T),Turn.TOPPLE,""),
        o("scales","Весы",'p',Size.MEDIUM,Set.of(T,WS),Turn.NONE,""),
        o("skull2","Череп",'m',Size.MEDIUM,Set.of(SH,WS,T),Turn.FLIP,""),
        o("dagger","Кинжал",'m',Size.MEDIUM,Set.of(T,F),Turn.FLIP,""),
        o("goblet","Кубок",'m',Size.MEDIUM,Set.of(T,WS,SH),Turn.NONE,""),
        o("violin","Скрипка",'f',Size.LARGE,Set.of(F),Turn.TOPPLE,""));


    private static final Map<String,ObjectDef> OBJECT_BY_ID=new HashMap<>();
    static{for(ObjectDef def:OBJECTS)if(OBJECT_BY_ID.put(def.id(),def)!=null)throw new IllegalStateException("Duplicate object "+def.id());}
    public static ObjectDef object(String id){ObjectDef def=OBJECT_BY_ID.get(id);if(def==null)throw new IllegalArgumentException("Unknown object "+id);return def;}
    public static float distance(Slot a,Slot b){float dx=a.x()-b.x(),dy=(a.y()-b.y())*1.78f;return (float)Math.sqrt(dx*dx+dy*dy);}
}
