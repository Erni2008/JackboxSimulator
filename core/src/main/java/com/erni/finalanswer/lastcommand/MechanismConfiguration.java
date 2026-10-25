package com.erni.finalanswer.lastcommand;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.math.Vector3;
import com.badlogic.gdx.math.collision.BoundingBox;
import com.badlogic.gdx.utils.Json;
import java.util.*;
import java.util.random.RandomGenerator;
/** Authored attachment candidates. Positions and sweep volumes are configurable in body-local units. */
public final class MechanismConfiguration {
    public static class PlacementPoint extends PanelConfiguration.Mount {
        public String id;public Vector3 normal=new Vector3(0,0,1);
        public Vector3 areaMin=new Vector3(),areaMax=new Vector3(),sweepMin=new Vector3(),sweepMax=new Vector3();
        public boolean enabled=true;
        public BoundingBox area(){return new BoundingBox(areaMin,areaMax);}
        public BoundingBox sweep(){return new BoundingBox(sweepMin,sweepMax);}
    }
    public PanelConfiguration.Mount leverBase,leverHandle,code;
    public Vector3 questionScreenMin=new Vector3(-.16f,.395f,.09f),questionScreenMax=new Vector3(.16f,.595f,.20f);
    public Vector3 leverAxis=new Vector3(1,0,0);
    public float[] leverAngles={-32,0,32};
    public float leverSeconds=.28f,hatchSeconds=.5f,hatchAngle=-115;
    public Vector3 doorPivot=new Vector3(-.45f,.23f,.01f),doorOffset=new Vector3(),doorScale=new Vector3(1,1,1);
    public PlacementPoint[] hatches;
    public Vector3[] reservedMin,reservedMax;
    public static MechanismConfiguration load(){return new Json().fromJson(MechanismConfiguration.class,Gdx.files.internal(TheLastCommandMachine.ROOT+"mechanisms.json"));}
    public PlacementPoint select(RandomGenerator generator){return select(generator,List.of());}
    public PlacementPoint select(RandomGenerator generator,List<BoundingBox> occupied){
        List<PlacementPoint> eligible=new ArrayList<>();Set<String> ids=new HashSet<>();
        for(var p:hatches){
            if(p.id==null||!ids.add(p.id)||p.normal.isZero()||!p.area().isValid()||!p.sweep().isValid()||!p.sweep().contains(p.area()))throw new IllegalArgumentException("Invalid placement "+p.id);
            boolean clear=p.enabled;
            for(int i=0;reservedMin!=null&&i<reservedMin.length;i++)if(p.sweep().intersects(new BoundingBox(reservedMin[i],reservedMax[i])))clear=false;
            for(var bounds:occupied)if(p.sweep().intersects(bounds))clear=false;
            if(clear)eligible.add(p);
        }
        eligible.sort(Comparator.comparing(p->p.id));if(eligible.isEmpty())throw new IllegalArgumentException("No collision-free hatch mounts");
        return eligible.get(generator.nextInt(eligible.size()));
    }
}
