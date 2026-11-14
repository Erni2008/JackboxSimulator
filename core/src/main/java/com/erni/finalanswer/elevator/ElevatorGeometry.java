package com.erni.finalanswer.elevator;

import com.badlogic.gdx.utils.JsonReader;
import com.badlogic.gdx.utils.JsonValue;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Every coordinate, size, timing and file name of the elevator, read from {@code elevator/elevator_geometry.json}.
 * Nothing in the renderer or controller is tied to a particular image: swapping the temporary art for the final PNGs
 * means editing this file only. Coordinates are in the 1920×1080 world, origin bottom-left (libGDX convention).
 */
public final class ElevatorGeometry {
    public record Rect(float x,float y,float w,float h){
        public float cx(){return x+w/2;} public float cy(){return y+h/2;}
        public boolean contains(float px,float py){return px>=x&&px<=x+w&&py>=y&&py<=y+h;}
    }
    public record Door(float closedX,float openX,float y,float w,float h){}
    public record Button(int floor,float x,float y,float radius){}
    public record Floor(int number,String id,String name,String image,float r,float g,float b){}
    public record Light(float x,float y,float radius,float r,float g,float b,float strength){}

    public float worldW=1920,worldH=1080;
    public Rect doorway;
    public Door leftDoor,rightDoor;
    public float seamOverlap;
    public final List<Button> buttons=new ArrayList<>();
    public int buttonSheetCols=3;                      // idle, pressed, active
    public Rect indicator;                             // housing
    public float needleX,needleY,needleLength,needleWidth,needlePivotFromBottom,needleAngleFloor1,needleAngleFloor5;
    public final List<Floor> floors=new ArrayList<>();
    public final List<Light> lights=new ArrayList<>();
    public final Map<String,String> images=new LinkedHashMap<>(),sounds=new LinkedHashMap<>();
    // timings
    public float doorSeconds=1.8f,doorStartDelay=.25f,motorSpinUp=.8f,secondsPerFloor=2.2f,arrivalBell=.45f,cameraExitSeconds=1.4f;
    public float vibrationMoving=1.2f,vibrationJolt=5f,flickerDepth=.18f;

    public static ElevatorGeometry parse(String json){
        JsonValue r=new JsonReader().parse(json);var g=new ElevatorGeometry();
        JsonValue w=r.get("world");if(w!=null){g.worldW=w.getFloat("w",1920);g.worldH=w.getFloat("h",1080);}
        g.doorway=rect(r.get("doorway"));
        JsonValue d=r.get("doors");g.seamOverlap=d.getFloat("seamOverlap",0);g.leftDoor=door(d.get("left"));g.rightDoor=door(d.get("right"));
        JsonValue b=r.get("buttons");g.buttonSheetCols=b.getInt("sheetCols",3);
        for(JsonValue e=b.get("items").child;e!=null;e=e.next)g.buttons.add(new Button(e.getInt("floor"),e.getFloat("x"),e.getFloat("y"),e.getFloat("radius")));
        JsonValue i=r.get("indicator");g.indicator=rect(i.get("housing"));JsonValue n=i.get("needle");
        g.needleX=n.getFloat("pivotX");g.needleY=n.getFloat("pivotY");g.needleLength=n.getFloat("length");g.needleWidth=n.getFloat("width");g.needlePivotFromBottom=n.getFloat("pivotFromBottom",0);
        g.needleAngleFloor1=n.getFloat("angleFloor1");g.needleAngleFloor5=n.getFloat("angleFloor5");
        for(JsonValue e=r.get("floors").child;e!=null;e=e.next){JsonValue t=e.get("placeholderTint");
            g.floors.add(new Floor(e.getInt("number"),e.getString("id"),e.getString("name"),e.getString("image",""),t.getFloat(0),t.getFloat(1),t.getFloat(2)));}
        JsonValue l=r.get("lights");if(l!=null)for(JsonValue e=l.child;e!=null;e=e.next){JsonValue c=e.get("color");
            g.lights.add(new Light(e.getFloat("x"),e.getFloat("y"),e.getFloat("radius"),c.getFloat(0),c.getFloat(1),c.getFloat(2),e.getFloat("strength",1)));}
        JsonValue im=r.get("images");if(im!=null)for(JsonValue e=im.child;e!=null;e=e.next)g.images.put(e.name,e.asString());
        JsonValue s=r.get("sounds");if(s!=null)for(JsonValue e=s.child;e!=null;e=e.next)g.sounds.put(e.name,e.asString());
        JsonValue t=r.get("timing");if(t!=null){g.doorSeconds=t.getFloat("doorSeconds",g.doorSeconds);g.doorStartDelay=t.getFloat("doorStartDelay",g.doorStartDelay);
            g.motorSpinUp=t.getFloat("motorSpinUp",g.motorSpinUp);g.secondsPerFloor=t.getFloat("secondsPerFloor",g.secondsPerFloor);g.arrivalBell=t.getFloat("arrivalBell",g.arrivalBell);
            g.cameraExitSeconds=t.getFloat("cameraExitSeconds",g.cameraExitSeconds);}
        JsonValue fx=r.get("effects");if(fx!=null){g.vibrationMoving=fx.getFloat("vibrationMoving",g.vibrationMoving);g.vibrationJolt=fx.getFloat("vibrationJolt",g.vibrationJolt);g.flickerDepth=fx.getFloat("flickerDepth",g.flickerDepth);}
        g.validate();return g;
    }
    private static Rect rect(JsonValue v){return new Rect(v.getFloat("x"),v.getFloat("y"),v.getFloat("w"),v.getFloat("h"));}
    private static Door door(JsonValue v){return new Door(v.getFloat("closedX"),v.getFloat("openX"),v.getFloat("y"),v.getFloat("w"),v.getFloat("h"));}

    /** Fails fast on a geometry that cannot work, so a typo in the JSON never ships as a visual bug. */
    void validate(){
        if(floors.size()!=5)throw new IllegalArgumentException("elevator needs exactly 5 floors, got "+floors.size());
        if(buttons.size()!=floors.size())throw new IllegalArgumentException("one button per floor");
        if(leftDoor.closedX()+leftDoor.w()+seamOverlap<rightDoor.closedX())throw new IllegalArgumentException("closed doors leave a gap");
        if(leftDoor.openX()+leftDoor.w()>doorway.x()+.5f||rightDoor.openX()<doorway.x()+doorway.w()-.5f)throw new IllegalArgumentException("open doors still cover the doorway");
    }
    public Floor floor(int number){for(Floor f:floors)if(f.number()==number)return f;throw new IllegalArgumentException("no floor "+number);}
    /** Needle angle (degrees, libGDX: counter-clockwise from +x) for a fractional floor position 1..5. */
    public float needleAngle(float floorPos){float k=(floorPos-1)/4f;return needleAngleFloor1+(needleAngleFloor5-needleAngleFloor1)*k;}
}
