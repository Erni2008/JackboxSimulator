package com.erni.finalanswer.elevator;

import com.badlogic.gdx.utils.JsonReader;
import com.badlogic.gdx.utils.JsonValue;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Everything the cinematic elevator needs, read from {@code elevator/elevator_transition.json}: timings, camera
 * parameters, and the measured geometry of every image in its own source pixels (top-left origin). Nothing is
 * hard-coded to a particular floor; a floor without an {@code exterior} block simply has no outer doors yet.
 */
public final class ElevatorTransitionConfig {
    /** A rectangle in source-image pixels, top-left origin. */
    public record SourceRect(float x,float y,float w,float h){}
    public record Door(String image,float w,float h,float closedX,float openX,float y){}
    /** Outer doors of a floor; {@code reveal} is what the open doorway shows (a crop of the open painting), may be null. */
    public record Exterior(SourceRect doorway,boolean startsOpen,Reveal reveal,Door left,Door right){}
    public record Reveal(String image,float x,float y,float w,float h){}
    public record ElevatorFloorConfig(int number,String name,String background,float w,float h,Exterior exterior){}
    public record Button(int floor,String image,float cx,float cy,float size){}
    public record Lamp(float x,float y,float radius){}
    public record Sound(String file,float volume,boolean loop){}

    public final Map<String,Float> timing=new LinkedHashMap<>(),camera=new LinkedHashMap<>();
    public String interiorImage;public float interiorW,interiorH;public SourceRect interiorDoorway;public Door interiorLeft,interiorRight;
    public final List<Button> buttons=new ArrayList<>();public final List<Lamp> lamps=new ArrayList<>();
    public String needleImage;public float needleW,needleH,needlePivotX,needlePivotY,needleSpritePivotX,needleSpritePivotY;public float[] needleAngles;
    public final List<ElevatorFloorConfig> floors=new ArrayList<>();
    public final Map<String,Sound> sounds=new LinkedHashMap<>();

    public static ElevatorTransitionConfig parse(String json){
        JsonValue r=new JsonReader().parse(json);var c=new ElevatorTransitionConfig();
        for(JsonValue e=r.get("timing").child;e!=null;e=e.next)c.timing.put(e.name,e.asFloat());
        for(JsonValue e=r.get("camera").child;e!=null;e=e.next)c.camera.put(e.name,e.asFloat());
        JsonValue in=r.get("interior");c.interiorImage=in.getString("image");c.interiorW=in.get("size").getFloat(0);c.interiorH=in.get("size").getFloat(1);
        c.interiorDoorway=rect(in.get("doorway"));c.interiorLeft=door(in.get("leftDoor"));c.interiorRight=door(in.get("rightDoor"));
        for(JsonValue b=in.get("buttons").child;b!=null;b=b.next)c.buttons.add(new Button(b.getInt("floor"),b.getString("image"),b.get("center").getFloat(0),b.get("center").getFloat(1),b.getFloat("size")));
        JsonValue n=in.get("needle");c.needleImage=n.getString("image");c.needleW=n.get("size").getFloat(0);c.needleH=n.get("size").getFloat(1);
        c.needlePivotX=n.get("pivot").getFloat(0);c.needlePivotY=n.get("pivot").getFloat(1);c.needleSpritePivotX=n.get("pivotInSprite").getFloat(0);c.needleSpritePivotY=n.get("pivotInSprite").getFloat(1);
        c.needleAngles=n.get("anglesByFloor").asFloatArray();
        JsonValue lamps=in.get("lamps");if(lamps!=null)for(JsonValue l=lamps.child;l!=null;l=l.next)c.lamps.add(new Lamp(l.getFloat(0),l.getFloat(1),l.getFloat(2)));
        for(JsonValue f=r.get("floors").child;f!=null;f=f.next){
            JsonValue ex=f.get("exterior");JsonValue rv=ex==null?null:ex.get("reveal");Reveal reveal=rv==null?null:new Reveal(rv.getString("image"),rv.get("at").getFloat(0),rv.get("at").getFloat(1),rv.get("size").getFloat(0),rv.get("size").getFloat(1));
            Exterior exterior=ex==null?null:new Exterior(rect(ex.get("doorway")),ex.getBoolean("startsOpen",false),reveal,door(ex.get("leftDoor")),door(ex.get("rightDoor")));
            c.floors.add(new ElevatorFloorConfig(f.getInt("number"),f.getString("name",""),f.getString("background"),f.get("size").getFloat(0),f.get("size").getFloat(1),exterior));
        }
        JsonValue s=r.get("sounds");if(s!=null)for(JsonValue e=s.child;e!=null;e=e.next)if(!e.name.startsWith("_"))c.sounds.put(e.name,new Sound(e.getString("file"),e.getFloat("volume",1),e.getBoolean("loop",false)));
        c.validate();return c;
    }
    private static SourceRect rect(JsonValue v){return new SourceRect(v.getFloat(0),v.getFloat(1),v.getFloat(2),v.getFloat(3));}
    private static Door door(JsonValue v){return new Door(v.getString("image"),v.get("size").getFloat(0),v.get("size").getFloat(1),v.getFloat("closedX"),v.getFloat("openX"),v.getFloat("y"));}

    public float t(String key){Float v=timing.get(key);if(v==null)throw new IllegalArgumentException("missing timing "+key);return v;}
    public float cam(String key){Float v=camera.get(key);if(v==null)throw new IllegalArgumentException("missing camera "+key);return v;}
    public ElevatorFloorConfig floor(int number){for(var f:floors)if(f.number()==number)return f;return null;}
    /** A transition can run only when both floors are configured and the departure floor has outer doors. */
    public boolean supports(int from,int to){var a=floor(from);return to==from+1&&a!=null&&a.exterior()!=null&&floor(to)!=null&&to>=1&&to<=needleAngles.length;}
    public float needleAngle(float floorPos){int n=needleAngles.length;float p=Math.max(1,Math.min(n,floorPos));int i=Math.min(n-2,(int)Math.floor(p)-1);float k=p-1-i;return needleAngles[i]+(needleAngles[i+1]-needleAngles[i])*k;}

    /** Fails fast on geometry that cannot work, so a typo never ships as a visual bug. */
    void validate(){
        checkDoors("interior",interiorDoorway,interiorLeft,interiorRight);
        for(var f:floors)if(f.exterior()!=null)checkDoors("floor "+f.number(),f.exterior().doorway(),f.exterior().left(),f.exterior().right());
        if(needleAngles.length!=5)throw new IllegalArgumentException("needle needs 5 floor angles");
    }
    private static void checkDoors(String where,SourceRect d,Door l,Door r){
        if(Math.abs(l.closedX()-d.x())>.5f||Math.abs(r.closedX()+r.w()-(d.x()+d.w()))>.5f)throw new IllegalArgumentException(where+": closed doors must reach the jambs");
        if(l.closedX()+l.w()<r.closedX())throw new IllegalArgumentException(where+": closed doors leave a gap at the seam");
        if(l.openX()+l.w()>d.x()+.5f||r.openX()<d.x()+d.w()-.5f)throw new IllegalArgumentException(where+": open doors still cover the doorway");
        if(Math.abs(l.h()-d.h())>.5f||Math.abs(r.h()-d.h())>.5f)throw new IllegalArgumentException(where+": door height must equal the doorway height");
    }
}
