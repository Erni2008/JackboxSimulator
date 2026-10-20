package com.erni.finalanswer.ui.lobby.cages;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.utils.Json;
import com.badlogic.gdx.utils.Array;
import java.util.HashSet;

/** Editable source-pixel geometry; shared read-only by runtime instances. Dev tools edit their own copy. */
public final class VoodooConfig {
    public static final String PATH="lobby/characters/voodoo/voodoo_config.json";
    public int schemaVersion=1;
    public boolean embeddedHeart=true;
    public float lobbyX=174,lobbyFloor=68,lobbyScale=1;
    public Array<Part> parts=new Array<>(Part.class);
    public Idle idle=new Idle();public Timings timings=new Timings();public HeartGeometry embeddedHeartGeometry=new HeartGeometry();
    public int[][] threadRegions,stuffingRegions;
    public static final class Part {
        public String name="",parent=""; public int asset,order;
        public float x,y,pivotX,pivotY,artScale=1,rotation,scaleX=1,scaleY=1,alpha=1;
        public boolean visible=true;public int[] region;
    }
    public static final class Idle {
        public float breathSeconds=3.5f,bodySeconds=4,headSeconds=4.5f,breathX=.008f,breathY=.015f,bodyDegrees=1.5f,headDegrees=3;
        public float leftArmDegrees=3.5f,rightArmDegrees=3.5f,threadDegrees=3.5f,gestureMin=6,gestureMax=12;
    }
    public static final class Timings {public float blend=.2f,selected=2.5f,victory=2.8f,defeat=3.2f,death=5,elimination=3.5f;}
    public static final class HeartGeometry {public float sourceX=665,sourceY=680,radius=255;}
    public static VoodooConfig load() {return parse(Gdx.files.internal(PATH).readString("UTF-8"));}
    public static VoodooConfig parse(String text) {VoodooConfig c=new Json().fromJson(VoodooConfig.class,text);c.validate();return c;}
    public Part part(String name) {for(int i=0;i<parts.size;i++) {Part p=parts.get(i);if(p.name.equals(name)) return p;}throw new IllegalArgumentException("Missing Voodoo part: "+name);}
    public float duration(VoodooAnimationController.State state) {return switch(state) {
        case IDLE -> Float.POSITIVE_INFINITY;case SELECTED -> timings.selected;case VICTORY -> timings.victory;
        case DEFEAT -> timings.defeat;case DEATH -> timings.death;case ELIMINATION -> timings.elimination;};}
    public void validate() {
        var names=new HashSet<String>();
        for(Part p:parts) {
            if(p.name.isBlank()||!names.add(p.name)||p.asset<1||p.asset>12||!Float.isFinite(p.artScale)||p.artScale<=0)
                throw new IllegalArgumentException("Invalid Voodoo part: "+p.name);
            for(float value:new float[]{p.x,p.y,p.pivotX,p.pivotY,p.rotation,p.scaleX,p.scaleY,p.alpha})
                if(!Float.isFinite(value)) throw new IllegalArgumentException("Nonfinite Voodoo geometry: "+p.name);
            if(p.scaleX<=0||p.scaleY<=0||p.alpha<0||p.alpha>1) throw new IllegalArgumentException("Invalid Voodoo transform: "+p.name);
            if(p.region!=null&&(p.region.length!=4||p.region[0]<0||p.region[1]<0||p.region[2]<=0||p.region[3]<=0)) throw new IllegalArgumentException("Invalid Voodoo crop: "+p.name);
        }
        for(String required:new String[]{"body","head","leftArm","rightArm","leftLeg","rightLeg","redButton","blackButton","heart","needle0","needle1","needle2","needle3"}) part(required);
        for(Part p:parts) {Part ancestor=p;var seen=new HashSet<String>();while(!ancestor.parent.isEmpty()) {
            if(!seen.add(ancestor.name)) throw new IllegalArgumentException("Voodoo parent cycle");ancestor=part(ancestor.parent);
        }}
        for(float value:new float[]{idle.breathSeconds,idle.bodySeconds,idle.headSeconds,idle.gestureMin,timings.blend,timings.selected,timings.victory,timings.defeat,timings.death,timings.elimination,lobbyScale,embeddedHeartGeometry.radius})
            if(!Float.isFinite(value)||value<=0) throw new IllegalArgumentException("Voodoo duration/scale must be positive");
        if(idle.gestureMax<idle.gestureMin||!Float.isFinite(idle.gestureMax)) throw new IllegalArgumentException("Invalid Voodoo gesture range");
    }
}
